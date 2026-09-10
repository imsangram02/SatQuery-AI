"""
SatQuery AI — Master Engine Module
Orchestrates end-to-end geospatial reasoning:
Ingestion -> Radiometric Calibration -> Intent Routing -> Specialist Neural Inference ->
Deterministic Physics Verification -> RFC 7946 GeoJSON Vectorization & Natural Language Synthesis.
"""

import json
import os
from pathlib import Path
import time
from typing import Any, Dict, List, Optional, Tuple, Union
import uuid

import numpy as np
from shapely.geometry import mapping, shape, Polygon
from shapely.ops import unary_union

try:
    import rasterio
    import rasterio.features
    HAS_RASTERIO_FEATURES = True
except Exception:
    HAS_RASTERIO_FEATURES = False

from satquery_core.src.controller.router import QueryRouter, detect_sensor_modality
from satquery_core.src.controller.schemas import (
    AuditTrace,
    EngineOutput,
    OutputArtifacts,
    PhysicsVerificationResult,
    QueryRequest,
    RoutingDecision,
    SensorModality,
    TaskType,
)
from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData, GeoTIFFLoader
from satquery_core.src.ingestion.preprocessors import PreprocessorDispatcher, create_valid_data_mask
from satquery_core.src.physics.indices import PhysicsVerifier, SpatialVerifier, verify_detection_physics
from satquery_core.src.physics.metrics import calculate_ground_metrics
from satquery_core.src.physics.vectorizer import mask_to_geojson
from satquery_core.src.specialists.change_detection import ChangeDetectionSpecialist
from satquery_core.src.specialists.cross_modal import CrossModalSpecialist
from satquery_core.src.specialists.single_image import SingleImageSpecialist
from satquery_core.src.export.visualizer import ArtifactVisualizer
from satquery_core.src.export.report_generator import ReportGenerator



class SatQueryEngine:
    """
    Master coordinator for offline geospatial AI reasoning on Earth observation satellite data.
    """

    def __init__(self, default_crs: str = "EPSG:4326") -> None:
        # Data loaders & preprocessors
        self.loader = GeoTIFFLoader(default_crs=default_crs)
        self.preprocessor = PreprocessorDispatcher()

        # Controller router
        self.router = QueryRouter()

        # Physics grounder & verifier
        self.physics_verifier = PhysicsVerifier()

        # Neural specialists (lazy loaded on demand to conserve offline RAM)
        self._specialists: Dict[str, Any] = {}

    def get_specialist(self, specialist_name: str) -> Any:
        """Instantiate or retrieve cached deep learning specialist backbone."""
        if specialist_name not in self._specialists:
            if specialist_name == "single_image_s2":
                self._specialists[specialist_name] = SingleImageSpecialist(modality="optical")
            elif specialist_name == "single_image_s1":
                self._specialists[specialist_name] = SingleImageSpecialist(modality="sar")
            elif specialist_name == "siamese_change_detection":
                self._specialists[specialist_name] = ChangeDetectionSpecialist()
            elif specialist_name == "cross_modal_fusion":
                self._specialists[specialist_name] = CrossModalSpecialist()
            else:
                raise ValueError(f"Unknown specialist model: '{specialist_name}'")
        return self._specialists[specialist_name]

    def execute_query(
        self,
        request: QueryRequest,
        save_artifacts: bool = True,
        output_dir: Optional[Union[str, Path]] = None,
    ) -> EngineOutput:
        """
        Execute an end-to-end analytical query across input GeoTIFF rasters.

        Args:
            request: Validated QueryRequest instance.
            save_artifacts: If True, renders and saves mask, heatmap, overlay images, GeoJSON, and reports.
            output_dir: Base directory for storing outputs (defaults to data/outputs).

        Returns:
            EngineOutput containing natural language summary, GeoJSON features,
            quantitative statistics, diagnostic audit trace, and saved output artifact paths.
        """
        start_time = time.perf_counter()
        preprocessing_applied: List[str] = []
        input_shapes: Dict[str, List[int]] = {}

        # ----------------------------------------------------------------------
        # Step 1: Ingestion
        # ----------------------------------------------------------------------
        primary_raw = self.loader.load(
            request.primary_raster.path,
            bands=request.primary_raster.band_selection,
        )
        input_shapes["primary_raw"] = list(primary_raw.array.shape)

        secondary_raw: Optional[GeoTIFFData] = None
        if request.secondary_raster is not None:
            secondary_raw = self.loader.load(
                request.secondary_raster.path,
                bands=request.secondary_raster.band_selection,
            )
            input_shapes["secondary_raw"] = list(secondary_raw.array.shape)

        # ----------------------------------------------------------------------
        # Step 2: Radiometric Calibration & Sensor Modality Analysis
        # ----------------------------------------------------------------------
        primary_mod = request.primary_raster.modality.value if request.primary_raster.modality else None
        primary_calibrated = self.preprocessor.preprocess(primary_raw, modality=primary_mod)
        preprocessing_applied.append(f"primary_{primary_calibrated.metadata.get('processing', 'calibrated')}")

        # Module 3: Valid Data Mask & Image Quality Assessment
        valid_data_mask = create_valid_data_mask(
            primary_calibrated.array,
            nodata_val=primary_raw.nodata,
        )
        total_px = valid_data_mask.size
        valid_px = int(np.sum(valid_data_mask))
        valid_pct = (valid_px / max(1, total_px)) * 100.0
        has_empty_borders = valid_pct < 99.5
        if valid_pct >= 99.9:
            easy_quality = "100% clean image data with no empty black borders."
        elif valid_pct >= 90.0:
            easy_quality = f"{valid_pct:.1f}% usable picture (empty outer borders safely ignored)."
        else:
            easy_quality = f"Partial picture coverage ({valid_pct:.1f}% usable data, rest is missing or empty border)."

        valid_stats = {
            "valid_percentage": round(valid_pct, 2),
            "valid_pixels": valid_px,
            "total_pixels": total_px,
            "has_empty_borders": has_empty_borders,
            "easy_quality_summary": easy_quality,
        }

        # Module 2: Sensor Modality & Camera Type Classification
        band_aliases = [f"Band_{i+1}" for i in range(primary_raw.count)]
        if primary_raw.count in (12, 13):
            band_aliases = ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B8A", "B09", "B11", "B12"]
        elif primary_raw.count <= 2:
            band_aliases = ["VV", "VH"] if primary_raw.count == 2 else ["VV"]
        elif primary_raw.count == 3:
            band_aliases = ["RED", "GREEN", "BLUE"]
        elif primary_raw.count == 4:
            band_aliases = ["RED", "GREEN", "BLUE", "NIR"]

        sensor_info = detect_sensor_modality(
            channels=primary_raw.count,
            band_aliases=band_aliases,
            dtype=str(primary_raw.array.dtype),
            filename=str(primary_raw.file_path or request.primary_raster.path or ""),
        )

        secondary_calibrated: Optional[GeoTIFFData] = None
        if secondary_raw is not None:
            sec_mod = request.secondary_raster.modality.value if request.secondary_raster.modality else None
            secondary_calibrated = self.preprocessor.preprocess(secondary_raw, modality=sec_mod)
            preprocessing_applied.append(f"secondary_{secondary_calibrated.metadata.get('processing', 'calibrated')}")

        # ----------------------------------------------------------------------
        # Step 3: Intent Routing
        # ----------------------------------------------------------------------
        routing = self.router.route(request)

        # ----------------------------------------------------------------------
        # Step 4: Neural Specialist Inference
        # ----------------------------------------------------------------------
        specialist = self.get_specialist(routing.target_specialist)

        prob_map: np.ndarray
        binary_mask: np.ndarray
        spec_meta: Dict[str, Any]

        target_entity = self._extract_target_entity(request.query_text, primary_calibrated)

        if routing.task_type == TaskType.SINGLE_IMAGE_OPTICAL or routing.task_type == TaskType.SINGLE_IMAGE_SAR:
            prob_map, binary_mask, spec_meta = specialist.infer(
                geotiff=primary_calibrated,
                target_class_name=target_entity,
                confidence_threshold=request.confidence_threshold,
            )
        elif routing.task_type == TaskType.CHANGE_DETECTION:
            if secondary_calibrated is None:
                secondary_calibrated = primary_calibrated

            prob_map, binary_mask, spec_meta = specialist.infer(
                pre_geotiff=primary_calibrated,
                post_geotiff=secondary_calibrated,
                confidence_threshold=request.confidence_threshold,
            )

            # Check if this is a Categorical CDVQA query
            cdvqa_result = self._evaluate_cdvqa_query(
                query_text=request.query_text,
                pre_geotiff=primary_calibrated,
                post_geotiff=secondary_calibrated,
                change_mask=binary_mask,
            )
            if cdvqa_result:
                spec_meta.update(cdvqa_result)

        elif routing.task_type == TaskType.CROSS_MODAL_FUSION:
            prob_map, binary_mask, spec_meta = specialist.infer(
                optical_geotiff=primary_calibrated,
                sar_geotiff=secondary_calibrated,
                target_class_name=target_entity,
                confidence_threshold=request.confidence_threshold,
            )
        else:
            raise ValueError(f"Unsupported task type: {routing.task_type}")

        # ----------------------------------------------------------------------
        # Step 5: Deterministic Physics Verification
        # ----------------------------------------------------------------------
        physics_results: List[PhysicsVerificationResult] = []
        overall_verdict = "VERIFIED"

        if request.enable_physics_verification and np.sum(binary_mask) > 0:
            physics_results = self._run_physics_checks(
                routing=routing,
                binary_mask=binary_mask,
                primary=primary_calibrated,
                secondary=secondary_calibrated,
                target_class=spec_meta.get("target_class"),
            )

            # Check if any physics check failed
            failed_checks = [res for res in physics_results if not res.passed]
            if failed_checks:
                overall_verdict = "PARTIAL" if len(failed_checks) < len(physics_results) else "REJECTED"

        # ----------------------------------------------------------------------
        # Step 6: Real-World Ground Metrics & GeoJSON Vectorization
        # ----------------------------------------------------------------------
        # Module 1: Real-World Ground Metrics Calculation
        ground_metrics = calculate_ground_metrics(
            pixel_count=int(np.sum(binary_mask)),
            transform=primary_calibrated.transform,
        )

        # Module 4: GeoJSON Vector Boundary Extraction
        geojson_fc, area_hectares = self._vectorize_mask(binary_mask, primary_calibrated)
        if ground_metrics.get("area_hectares", 0.0) > 0:
            area_hectares = float(ground_metrics["area_hectares"])

        # ----------------------------------------------------------------------
        # Step 7: Natural Language & Quantitative Synthesis
        # ----------------------------------------------------------------------
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        target_lbl = spec_meta.get("target_class") or target_entity or "detection"
        boxes = []
        if np.sum(binary_mask) > 0:
            mean_prob = float(np.mean(prob_map[binary_mask]))
            boxes = ArtifactVisualizer.extract_bounding_boxes(
                binary_mask=binary_mask,
                label_text=target_lbl,
                confidence=mean_prob,
                prob_map=prob_map,
                max_boxes=6,
            )

        # Module 5: Physical Science Verification Gatekeeper
        tensor_dict: Dict[str, np.ndarray] = {}
        if primary_calibrated.count >= 8:
            tensor_dict["GREEN"] = primary_calibrated.get_band(3)
            tensor_dict["RED"] = primary_calibrated.get_band(4)
            tensor_dict["NIR"] = primary_calibrated.get_band(8)
            if primary_calibrated.count >= 11:
                tensor_dict["SWIR1"] = primary_calibrated.get_band(11)
        elif primary_calibrated.count >= 4:
            tensor_dict["GREEN"] = primary_calibrated.get_band(2)
            tensor_dict["RED"] = primary_calibrated.get_band(3)
            tensor_dict["NIR"] = primary_calibrated.get_band(4)
        elif primary_calibrated.count >= 3:
            tensor_dict["RED"] = primary_calibrated.get_band(1)
            tensor_dict["GREEN"] = primary_calibrated.get_band(2)
            tensor_dict["BLUE"] = primary_calibrated.get_band(3)
            tensor_dict["NIR"] = primary_calibrated.get_band(2)
        if primary_calibrated.count <= 2:
            tensor_dict["VV"] = primary_calibrated.get_band(1)

        eval_bbox = [0, 0, max(0, primary_calibrated.width - 1), max(0, primary_calibrated.height - 1)]
        if boxes:
            eval_bbox = boxes[0]["pixel_box"]

        physics_gatekeeper = verify_detection_physics(
            tensor_dict=tensor_dict,
            bbox=eval_bbox,
            target=target_lbl,
        )

        statistics = {
            "detected_pixel_count": int(np.sum(binary_mask)),
            "total_pixels": int(binary_mask.size),
            "area_hectares": float(round(area_hectares, 3)),
            "ground_metrics": ground_metrics,
            "sensor_info": sensor_info,
            "valid_data_stats": valid_stats,
            "physics_gatekeeper": physics_gatekeeper,
            "mean_probability": float(round(float(np.mean(prob_map[binary_mask])) if np.sum(binary_mask) > 0 else 0.0, 3)),
            "coverage_percentage": float(round((np.sum(binary_mask) / binary_mask.size) * 100.0, 2)),
            "bounding_boxes": boxes,
            "specialist_metadata": spec_meta,
        }

        specialist_model_id = (
            spec_meta.get("model_identifier")
            or spec_meta.get("specialist")
            or routing.target_specialist
        )
        audit_trace = AuditTrace(
            task_type=routing.task_type,
            controller_model=self.router.controller_model,
            specialist_model=specialist_model_id,
            input_shapes=input_shapes,
            preprocessing_applied=preprocessing_applied,
            physics_checks=physics_results,
            execution_time_ms=float(round(elapsed_ms, 2)),
            verdict=overall_verdict,
        )

        summary_text = self._synthesize_summary(
            request=request,
            routing=routing,
            statistics=statistics,
            audit=audit_trace,
        )

        # ----------------------------------------------------------------------
        # Step 8: Visual Artifact & Analytical Report Persistence
        # ----------------------------------------------------------------------
        artifacts: Optional[OutputArtifacts] = None

        if save_artifacts:
            base_out = Path(output_dir or "data/outputs").resolve()
            masks_dir = base_out / "masks"
            heatmaps_dir = base_out / "heatmaps"
            overlays_dir = base_out / "overlays"
            geojson_dir = base_out / "geojson"
            reports_dir = base_out / "reports"

            for d in [masks_dir, heatmaps_dir, overlays_dir, geojson_dir, reports_dir]:
                d.mkdir(parents=True, exist_ok=True)

            timestamp_str = int(time.time())
            file_prefix = f"pred_{audit_trace.trace_id[:8]}_{timestamp_str}"
            target_class_str = spec_meta.get("target_class", "target")

            # 1. Save Binary Mask Image
            mask_path = ArtifactVisualizer.save_mask(
                binary_mask=binary_mask,
                output_path=masks_dir / f"{file_prefix}_mask.png",
            )

            # 2. Save Colorized Probability Heatmap
            heatmap_path = ArtifactVisualizer.save_heatmap(
                prob_map=prob_map,
                output_path=heatmaps_dir / f"{file_prefix}_heatmap.png",
                title=f"Probability Heatmap: {target_class_str.title()} ({statistics['mean_probability']*100:.1f}%)",
            )

            # 3. Save Visual Evidence Overlay
            overlay_path = ArtifactVisualizer.save_overlay(
                primary_geotiff=primary_raw,
                binary_mask=binary_mask,
                prob_map=prob_map,
                output_path=overlays_dir / f"{file_prefix}_overlay.png",
                label_text=target_class_str,
                confidence=statistics["mean_probability"],
                area_ha=statistics["area_hectares"],
                coverage_pct=statistics["coverage_percentage"],
            )

            # 4. Save Vector RFC 7946 GeoJSON
            geojson_path = geojson_dir / f"{file_prefix}_vectors.geojson"
            with open(geojson_path, "w", encoding="utf-8") as f:
                json.dump(geojson_fc, f, indent=2)

            # 5. Build Comprehensive Report Data
            report_data = {
                "metadata": {
                    "report_id": f"SATQUERY-{audit_trace.trace_id[:8].upper()}",
                    "timestamp": audit_trace.timestamp,
                    "crs": str(primary_calibrated.crs),
                    "bounds": list(primary_calibrated.bounds),
                },
                "query_text": request.query_text,
                "task_type": routing.task_type.value,
                "summary_text": summary_text,
                "statistics": statistics,
                "audit_trace": audit_trace.model_dump(),
                "artifacts": {
                    "input_image_path": str(Path(request.primary_raster.path).resolve()),
                    "secondary_image_path": str(Path(request.secondary_raster.path).resolve()) if request.secondary_raster else None,
                    "mask_image_path": str(mask_path),
                    "heatmap_image_path": str(heatmap_path),
                    "overlay_image_path": str(overlay_path),
                    "geojson_path": str(geojson_path),
                },
            }

            # 6. Save JSON & Markdown Reports
            rep_json_path = ReportGenerator.save_json_report(
                report_data=report_data,
                output_path=reports_dir / f"{file_prefix}_report.json",
            )
            rep_md_path = ReportGenerator.save_markdown_report(
                report_data=report_data,
                output_path=reports_dir / f"{file_prefix}_report.md",
            )

            artifacts = OutputArtifacts(
                input_image_path=report_data["artifacts"]["input_image_path"],
                secondary_image_path=report_data["artifacts"]["secondary_image_path"],
                mask_image_path=str(mask_path),
                heatmap_image_path=str(heatmap_path),
                overlay_image_path=str(overlay_path),
                geojson_path=str(geojson_path),
                report_json_path=str(rep_json_path),
                report_markdown_path=str(rep_md_path),
            )

        return EngineOutput(
            query_text=request.query_text,
            task_type=routing.task_type,
            summary_text=summary_text,
            geojson=geojson_fc,
            statistics=statistics,
            audit_trace=audit_trace,
            artifacts=artifacts,
        )


    def _run_physics_checks(
        self,
        routing: RoutingDecision,
        binary_mask: np.ndarray,
        primary: GeoTIFFData,
        secondary: Optional[GeoTIFFData],
        target_class: Optional[str] = None,
    ) -> List[PhysicsVerificationResult]:
        """Execute physical sanity checks matched to the routed task intent and target class."""
        results: List[PhysicsVerificationResult] = []

        # Target raster for optical checks (for change detection, check post-event state in secondary)
        opt_target = secondary if (routing.task_type == TaskType.CHANGE_DETECTION and secondary is not None and secondary.count >= 8) else primary

        t_class = (target_class or "").lower()

        # Check for Optical Water (NDWI)
        if ("ndwi" in routing.required_physics_indices or "water" in t_class) and opt_target.count >= 8:
            if not t_class or any(k in t_class for k in ["water", "flood", "lake", "river"]):
                green = opt_target.get_band(3)   # Sentinel-2 B03
                nir = opt_target.get_band(8)     # Sentinel-2 B08
                res = self.physics_verifier.verify_optical_water(binary_mask, green=green, nir=nir)
                results.append(res)

        # Check for Optical Vegetation (NDVI)
        if ("ndvi" in routing.required_physics_indices or any(k in t_class for k in ["vegetation", "crop", "forest"])) and opt_target.count >= 8:
            if not t_class or any(k in t_class for k in ["vegetation", "crop", "forest", "tree", "plant"]):
                red = opt_target.get_band(4)     # Sentinel-2 B04
                nir = opt_target.get_band(8)     # Sentinel-2 B08
                res = self.physics_verifier.verify_optical_vegetation(binary_mask, nir=nir, red=red)
                results.append(res)

        # Check for SAR Urban (Double-Bounce) or SAR Water (Specular Backscatter)
        sar_target = primary if primary.count <= 2 else secondary
        if sar_target is not None and sar_target.count >= 1:
            vv_db = sar_target.get_band(1)
            is_urban_target = any(k in t_class for k in ["built", "urban", "settlement", "structure", "building"])
            is_water_target = any(k in t_class for k in ["water", "flood", "lake", "river"])

            if is_urban_target or ("sar_urban_threshold_db" in routing.required_physics_indices and not is_water_target):
                res = self.physics_verifier.verify_sar_urban(binary_mask, vv_db=vv_db)
                results.append(res)
            elif is_water_target or "sar_water_threshold_db" in routing.required_physics_indices:
                res = self.physics_verifier.verify_sar_water(binary_mask, vv_db=vv_db)
                results.append(res)

        return results

    def _vectorize_mask(
        self,
        binary_mask: np.ndarray,
        geotiff: GeoTIFFData,
        min_pixel_size: int = 4,
    ) -> Tuple[Dict[str, Any], float]:
        """Convert binary detection mask into RFC 7946 GeoJSON FeatureCollection and compute area."""
        features: List[Dict[str, Any]] = []
        total_area_sq_m = 0.0

        mask_uint8 = binary_mask.astype(np.uint8)
        pixel_width = abs(geotiff.transform.a)
        pixel_height = abs(geotiff.transform.e)
        pixel_area = pixel_width * pixel_height

        shapes_list = []
        if HAS_RASTERIO_FEATURES:
            try:
                shapes_gen = rasterio.features.shapes(
                    mask_uint8,
                    mask=(mask_uint8 == 1),
                    transform=geotiff.transform,
                )
                for geom_dict, value in shapes_gen:
                    poly = shape(geom_dict)
                    shapes_list.append((poly, value))
            except Exception:
                shapes_list = []

        if not shapes_list and np.sum(binary_mask) > 0:
            try:
                v_res = mask_to_geojson(
                    binary_mask=binary_mask,
                    transform=geotiff.transform,
                    crs=str(geotiff.crs),
                    min_contour_area=float(min_pixel_size),
                )
                geom = v_res.get("geometry", {})
                if geom.get("type") == "Polygon" and geom.get("coordinates"):
                    poly = Polygon(geom["coordinates"][0])
                    shapes_list.append((poly, 1))
                elif geom.get("type") == "MultiPolygon":
                    for poly_ring in geom.get("coordinates", []):
                        if poly_ring and len(poly_ring[0]) >= 3:
                            poly = Polygon(poly_ring[0])
                            shapes_list.append((poly, 1))
            except Exception:
                pass

        if not shapes_list and np.sum(binary_mask) > 0:
            import matplotlib.pyplot as plt
            fig = plt.figure()
            try:
                cs = plt.contour(mask_uint8.astype(float), levels=[0.5])
                for path in cs.get_paths():
                    for poly_pts in path.to_polygons():
                        if len(poly_pts) >= 3:
                            spatial_pts = [geotiff.transform * (pt[0], pt[1]) for pt in poly_pts]
                            poly = Polygon(spatial_pts)
                            shapes_list.append((poly, 1))
            except Exception:
                pass
            finally:
                plt.close(fig)

        for poly, value in shapes_list:
            # Filter negligible single-pixel speckle noise
            if poly.area < (min_pixel_size * pixel_area):
                continue

            total_area_sq_m += poly.area
            features.append({
                "type": "Feature",
                "geometry": mapping(poly),
                "properties": {
                    "pixel_value": int(value),
                    "area_sq_m": float(round(poly.area, 2)),
                    "area_hectares": float(round(poly.area / 10000.0, 4)),
                },
            })


        feature_collection = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {"name": str(geotiff.crs)},
            },
            "features": features,
        }

        # If CRS is in degrees (EPSG:4326), approximate 1 degree ~ 111.32 km at equator
        if geotiff.crs.is_geographic:
            # 1 deg ~ 111320 meters
            meters_per_deg_lat = 111320.0
            mid_lat = (geotiff.bounds[1] + geotiff.bounds[3]) / 2.0
            meters_per_deg_lon = 111320.0 * np.cos(np.radians(mid_lat))
            area_sq_m_metric = total_area_sq_m * meters_per_deg_lat * meters_per_deg_lon
            area_hectares = area_sq_m_metric / 10000.0
        else:
            area_hectares = total_area_sq_m / 10000.0

        return feature_collection, area_hectares

    def _extract_target_entity(self, query: str, geotiff: Optional[GeoTIFFData] = None) -> Optional[str]:
        """Extract primary target entity keyword from natural language query with scene context."""
        q = query.lower()

        # Scene description / captioning intent
        if any(w in q for w in ["describe", "caption", "major objects", "land-cover and", "land cover and", "visible in this image", "summarize the scene"]):
            return "describe_land_cover"

        # Check for target categories
        has_water = any(w in q for w in ["water", "lake", "river", "flood", "inundation"])
        has_urban = any(w in q for w in ["urban", "building", "city", "built-up", "structure", "infrastructure", "settlement"])
        has_veg = any(w in q for w in ["crop", "agriculture", "vegetation", "forest", "canopy", "tree"])

        if has_water and has_urban:
            # Compound query: disambiguate based on scene contents
            if geotiff is not None:
                if geotiff.count >= 8:
                    green = geotiff.get_band(3)
                    nir = geotiff.get_band(8)
                    ndwi = (green - nir) / (green + nir + 1e-6)
                    if float(np.mean(ndwi > 0.05)) > 0.15:
                        return "water"
                    return "urban"
                elif geotiff.count >= 3:
                    r, g, b = geotiff.get_band(1), geotiff.get_band(2), geotiff.get_band(3)
                    ndwi_v = (b - r) / (b + r + 1e-6)
                    if float(np.mean(ndwi_v > 0.20)) > 0.20:
                        return "water"
                    return "urban"
            return "urban"

        if has_urban:
            return "urban"
        if has_water:
            return "water"
        if has_veg:
            return "cropland"

        return None

    def _evaluate_cdvqa_query(
        self,
        query_text: str,
        pre_geotiff: GeoTIFFData,
        post_geotiff: GeoTIFFData,
        change_mask: np.ndarray,
    ) -> Optional[Dict[str, Any]]:
        """
        Categorical CDVQA Fine-Grained Answering Engine.
        Evaluates categorical multitemporal questions such as:
        'Has the built-up area increased, decreased, or remained unchanged?'
        """
        q = query_text.lower()
        is_categorical = any(k in q for k in [
            "increased", "decreased", "unchanged", "increase or decrease",
            "growth or reduction", "remained unchanged", "expanded or reduced",
            "has the built-up", "has the water", "has the vegetation",
            "has built-up", "did the built-up", "did water increase"
        ])
        if not is_categorical:
            return None

        # Determine target land-cover class
        target_class = "built-up"
        if any(w in q for w in ["water", "flood", "lake", "river", "inundat"]):
            target_class = "water"
        elif any(w in q for w in ["vegetation", "crop", "forest", "tree", "agriculture"]):
            target_class = "vegetation"
        elif any(w in q for w in ["built", "urban", "building", "settlement", "structure"]):
            target_class = "built-up"

        # Compute pre (T1) and post (T2) class footprints
        if target_class == "water":
            if pre_geotiff.count >= 8 and post_geotiff.count >= 8:
                ndwi1 = (pre_geotiff.get_band(3) - pre_geotiff.get_band(8)) / (pre_geotiff.get_band(3) + pre_geotiff.get_band(8) + 1e-6)
                ndwi2 = (post_geotiff.get_band(3) - post_geotiff.get_band(8)) / (post_geotiff.get_band(3) + post_geotiff.get_band(8) + 1e-6)
                m1, m2 = ndwi1 > 0.05, ndwi2 > 0.05
            elif pre_geotiff.count >= 4 and post_geotiff.count >= 4:
                ndwi1 = (pre_geotiff.get_band(2) - pre_geotiff.get_band(4)) / (pre_geotiff.get_band(2) + pre_geotiff.get_band(4) + 1e-6)
                ndwi2 = (post_geotiff.get_band(2) - post_geotiff.get_band(4)) / (post_geotiff.get_band(2) + post_geotiff.get_band(4) + 1e-6)
                m1, m2 = ndwi1 > 0.05, ndwi2 > 0.05
            elif pre_geotiff.count >= 3 and post_geotiff.count >= 3:
                r1, g1, b1 = pre_geotiff.get_band(1), pre_geotiff.get_band(2), pre_geotiff.get_band(3)
                r2, g2, b2 = post_geotiff.get_band(1), post_geotiff.get_band(2), post_geotiff.get_band(3)
                ndwi_v1 = np.maximum((g1 - r1) / (g1 + r1 + 1e-6), (b1 - r1) / (b1 + r1 + 1e-6))
                ndwi_v2 = np.maximum((g2 - r2) / (g2 + r2 + 1e-6), (b2 - r2) / (b2 + r2 + 1e-6))
                m1, m2 = ndwi_v1 > 0.05, ndwi_v2 > 0.05
            else:
                m1 = pre_geotiff.get_band(1) < 0.15
                m2 = post_geotiff.get_band(1) < 0.15
        elif target_class == "vegetation":
            if pre_geotiff.count >= 8 and post_geotiff.count >= 8:
                ndvi1 = (pre_geotiff.get_band(8) - pre_geotiff.get_band(4)) / (pre_geotiff.get_band(8) + pre_geotiff.get_band(4) + 1e-6)
                ndvi2 = (post_geotiff.get_band(8) - post_geotiff.get_band(4)) / (post_geotiff.get_band(8) + post_geotiff.get_band(4) + 1e-6)
                m1, m2 = ndvi1 > 0.35, ndvi2 > 0.35
            elif pre_geotiff.count >= 4 and post_geotiff.count >= 4:
                ndvi1 = (pre_geotiff.get_band(4) - pre_geotiff.get_band(3)) / (pre_geotiff.get_band(4) + pre_geotiff.get_band(3) + 1e-6)
                ndvi2 = (post_geotiff.get_band(4) - post_geotiff.get_band(3)) / (post_geotiff.get_band(4) + post_geotiff.get_band(3) + 1e-6)
                m1, m2 = ndvi1 > 0.35, ndvi2 > 0.35
            else:
                m1 = (pre_geotiff.get_band(2) - pre_geotiff.get_band(1)) / (pre_geotiff.get_band(2) + pre_geotiff.get_band(1) + 1e-6) > 0.15
                m2 = (post_geotiff.get_band(2) - post_geotiff.get_band(1)) / (post_geotiff.get_band(2) + post_geotiff.get_band(1) + 1e-6) > 0.15
        else:  # built-up
            if pre_geotiff.count >= 3 and post_geotiff.count >= 3:
                b1 = (pre_geotiff.get_band(1).astype(np.float32) + pre_geotiff.get_band(2).astype(np.float32) + pre_geotiff.get_band(3).astype(np.float32)) / 3.0
                b2 = (post_geotiff.get_band(1).astype(np.float32) + post_geotiff.get_band(2).astype(np.float32) + post_geotiff.get_band(3).astype(np.float32)) / 3.0
                thresh = 0.22 if np.max(b1) <= 1.0 else 55.0
                m1, m2 = b1 > thresh, b2 > thresh
            else:
                m1 = np.zeros_like(change_mask, dtype=bool)
                m2 = change_mask

        p1, p2 = int(np.sum(m1)), int(np.sum(m2))
        pixel_ha = 0.01  # standard 10m pixel = 0.01 ha (100 sqm)
        t1_ha = p1 * pixel_ha
        t2_ha = p2 * pixel_ha
        delta_ha = t2_ha - t1_ha
        delta_pct = ((p2 - p1) / max(1, p1)) * 100.0

        if delta_pct > 2.0:
            verdict = "Increased"
        elif delta_pct < -2.0:
            verdict = "Decreased"
        else:
            verdict = "Remained Unchanged"

        return {
            "is_cdvqa": True,
            "cdvqa_categorical_verdict": verdict,
            "cdvqa_target_class": target_class,
            "cdvqa_t1_pixels": p1,
            "cdvqa_t2_pixels": p2,
            "cdvqa_t1_ha": round(t1_ha, 2),
            "cdvqa_t2_ha": round(t2_ha, 2),
            "cdvqa_delta_ha": round(delta_ha, 2),
            "cdvqa_delta_pct": round(delta_pct, 1),
        }

    def _synthesize_summary(
        self,
        request: QueryRequest,
        routing: RoutingDecision,
        statistics: Dict[str, Any],
        audit: AuditTrace,
    ) -> str:
        """Formulate a comprehensive, verifiable natural language reasoning summary using the pretrained VLM decoder."""
        return self.router.decoder.synthesize_vlm_answer(
            query=request.query_text,
            task_type=routing.task_type,
            statistics=statistics,
            audit=audit,
        )

