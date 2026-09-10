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

from satquery_core.src.controller.router import QueryRouter
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
from satquery_core.src.ingestion.preprocessors import PreprocessorDispatcher
from satquery_core.src.physics.indices import PhysicsVerifier, SpatialVerifier
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
        # Step 2: Radiometric Calibration
        # ----------------------------------------------------------------------
        primary_mod = request.primary_raster.modality.value if request.primary_raster.modality else None
        primary_calibrated = self.preprocessor.preprocess(primary_raw, modality=primary_mod)
        preprocessing_applied.append(f"primary_{primary_calibrated.metadata.get('processing', 'calibrated')}")

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

        if routing.task_type == TaskType.SINGLE_IMAGE_OPTICAL or routing.task_type == TaskType.SINGLE_IMAGE_SAR:
            prob_map, binary_mask, spec_meta = specialist.infer(
                geotiff=primary_calibrated,
                target_class_name=self._extract_target_entity(request.query_text),
                confidence_threshold=request.confidence_threshold,
            )
        elif routing.task_type == TaskType.CHANGE_DETECTION:
            if secondary_calibrated is None:
                # If secondary raster was not provided, compare primary with itself
                secondary_calibrated = primary_calibrated

            prob_map, binary_mask, spec_meta = specialist.infer(
                pre_geotiff=primary_calibrated,
                post_geotiff=secondary_calibrated,
                confidence_threshold=request.confidence_threshold,
            )
        elif routing.task_type == TaskType.CROSS_MODAL_FUSION:
            prob_map, binary_mask, spec_meta = specialist.infer(
                optical_geotiff=primary_calibrated,
                sar_geotiff=secondary_calibrated,
                target_class_name=self._extract_target_entity(request.query_text),
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
            )

            # Check if any physics check failed
            failed_checks = [res for res in physics_results if not res.passed]
            if failed_checks:
                overall_verdict = "PARTIAL" if len(failed_checks) < len(physics_results) else "REJECTED"

        # ----------------------------------------------------------------------
        # Step 6: Vectorization to GeoJSON
        # ----------------------------------------------------------------------
        geojson_fc, area_hectares = self._vectorize_mask(binary_mask, primary_calibrated)

        # ----------------------------------------------------------------------
        # Step 7: Natural Language & Quantitative Synthesis
        # ----------------------------------------------------------------------
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        statistics = {
            "detected_pixel_count": int(np.sum(binary_mask)),
            "total_pixels": int(binary_mask.size),
            "area_hectares": float(round(area_hectares, 3)),
            "mean_probability": float(round(float(np.mean(prob_map[binary_mask])) if np.sum(binary_mask) > 0 else 0.0, 3)),
            "coverage_percentage": float(round((np.sum(binary_mask) / binary_mask.size) * 100.0, 2)),
            "specialist_metadata": spec_meta,
        }

        audit_trace = AuditTrace(
            task_type=routing.task_type,
            specialist_model=routing.target_specialist,
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
    ) -> List[PhysicsVerificationResult]:
        """Execute physical sanity checks matched to the routed task intent."""
        results: List[PhysicsVerificationResult] = []

        # Check for Optical Water (NDWI)
        if "ndwi" in routing.required_physics_indices and primary.count >= 8:
            green = primary.get_band(3)   # Sentinel-2 B03
            nir = primary.get_band(8)     # Sentinel-2 B08
            res = self.physics_verifier.verify_optical_water(binary_mask, green=green, nir=nir)
            results.append(res)

        # Check for Optical Vegetation (NDVI)
        if "ndvi" in routing.required_physics_indices and primary.count >= 8:
            red = primary.get_band(4)     # Sentinel-2 B04
            nir = primary.get_band(8)     # Sentinel-2 B08
            res = self.physics_verifier.verify_optical_vegetation(binary_mask, nir=nir, red=red)
            results.append(res)

        # Check for SAR Water / Specular Backscatter
        if "sar_water_threshold_db" in routing.required_physics_indices:
            sar_target = primary if primary.count <= 2 else secondary
            if sar_target is not None and sar_target.count >= 1:
                vv_db = sar_target.get_band(1)
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

    def _extract_target_entity(self, query: str) -> Optional[str]:
        """Extract primary target entity keyword from natural language query."""
        q = query.lower()
        if any(w in q for w in ["water", "lake", "river", "flood", "inundation"]):
            return "water"
        if any(w in q for w in ["crop", "agriculture", "vegetation", "forest", "canopy"]):
            return "cropland"
        if any(w in q for w in ["urban", "building", "city", "built-up", "infrastructure"]):
            return "urban"
        return None

    def _synthesize_summary(
        self,
        request: QueryRequest,
        routing: RoutingDecision,
        statistics: Dict[str, Any],
        audit: AuditTrace,
    ) -> str:
        """Formulate a professional, verifiable natural language reasoning summary."""
        target_name = statistics.get("specialist_metadata", {}).get("target_class", "target feature")
        area_ha = statistics["area_hectares"]
        cov_pct = statistics["coverage_percentage"]
        pixel_count = statistics["detected_pixel_count"]

        summary = (
            f"Query Analysis Complete: '{request.query_text}'.\n"
            f"• Task Specialization: {routing.task_type.value} routed to {routing.target_specialist}.\n"
            f"• Delineated Extent: Identified {pixel_count:,} pixels ({area_ha:.2f} ha, {cov_pct:.1f}% coverage) "
            f"classified as '{target_name}'.\n"
            f"• Physics Grounding: Verdict is {audit.verdict}. "
        )

        if audit.physics_checks:
            check_summaries = []
            for check in audit.physics_checks:
                status = "PASSED" if check.passed else "FLAGGED"
                check_summaries.append(
                    f"{check.index_name} ({status}, {check.coverage_percentage:.1f}% agreement, mean {check.mean_value:.3f})"
                )
            summary += f"Validated against: {'; '.join(check_summaries)}.\n"
        else:
            summary += "No conflicting radiometric anomalies recorded.\n"

        summary += f"• Forensic Trace: ID {audit.trace_id[:8]} executed in {audit.execution_time_ms:.1f} ms."
        return summary
