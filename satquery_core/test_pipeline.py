"""
SatQuery AI — Integration & Smoke Test Suite (test_pipeline.py)
End-to-end verification script generating synthetic 16-bit optical (S2) and SAR (S1)
GeoTIFF fixtures, running multi-modal reasoning queries through SatQueryEngine,
and validating Pydantic schemas, physics grounding, and RFC 7946 GeoJSON outputs.
"""

import os
from pathlib import Path
import sys
import tempfile
from typing import Tuple

import numpy as np
import rasterio
from rasterio.crs import CRS
from rasterio.transform import from_bounds

# Ensure root repository is in sys.path for direct CLI execution
REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from satquery_core.src.controller.schemas import (
    EngineOutput,
    QueryRequest,
    RasterInput,
    SensorModality,
    TaskType,
)
from satquery_core.src.engine import SatQueryEngine


def create_synthetic_s2_geotiff(
    file_path: Path,
    width: int = 256,
    height: int = 256,
) -> Path:
    """
    Generate a synthetic 12-channel 16-bit Sentinel-2 Level-2A GeoTIFF.
    Embeds realistic surface reflectance (DN = reflectance * 10000) with a circular water body.
    """
    # 12 channels matching Sentinel-2 band registry
    # B01(Coastal), B02(Blue), B03(Green), B04(Red), B05-B07(RedEdge), B08(NIR), B8A(NIR-narrow), B09(Vapour), B11(SWIR1), B12(SWIR2)
    array = np.full((12, height, width), 2000, dtype=np.uint16)  # Default bare/mixed background

    # Background vegetation: High NIR (B08 = channel 8), Moderate Green (B03 = channel 3), Low Red (B04 = channel 4)
    array[2, :, :] = 1200   # Green (0.12 reflectance)
    array[3, :, :] = 800    # Red (0.08 reflectance)
    array[7, :, :] = 4500   # NIR (0.45 reflectance) -> NDVI ~ (0.45 - 0.08)/(0.45 + 0.08) = 0.698 (Dense veg)

    # Embedded water body (circle in center): High Green, Very Low NIR, Low SWIR
    y_grid, x_grid = np.ogrid[:height, :width]
    center_y, center_x = height // 2, width // 2
    water_mask = (y_grid - center_y) ** 2 + (x_grid - center_x) ** 2 <= (height // 4) ** 2

    array[2, water_mask] = 2200   # Green (0.22)
    array[3, water_mask] = 400    # Red (0.04)
    array[7, water_mask] = 200    # NIR (0.02) -> NDWI = (0.22 - 0.02)/(0.22 + 0.02) = +0.833 (Strong water signal)
    array[10, water_mask] = 100   # SWIR1 (0.01)

    # Spatial georeferencing centered over Godavari delta, India (EPSG:4326)
    left, bottom, right, top = 81.50, 16.50, 81.75, 16.75
    transform = from_bounds(left, bottom, right, top, width, height)

    profile = {
        "driver": "GTiff",
        "height": height,
        "width": width,
        "count": 12,
        "dtype": "uint16",
        "crs": CRS.from_epsg(4326),
        "transform": transform,
        "nodata": 0,
    }

    with rasterio.open(file_path, "w", **profile) as dst:
        dst.write(array)

    return file_path


def create_synthetic_s1_geotiff(
    file_path: Path,
    width: int = 256,
    height: int = 256,
) -> Path:
    """
    Generate a synthetic 2-channel 16-bit Sentinel-1 SAR GeoTIFF (VV, VH amplitude).
    Embeds low amplitude (specular reflection) over the central water footprint.
    """
    # Channel 1: VV, Channel 2: VH
    # Decibel target: Background land ~ -12 dB -> Amplitude = sqrt(10^(-12/10)) = 0.251 -> DN ~ 2510
    array = np.full((2, height, width), 2500, dtype=np.uint16)

    # Water body: Calm water ~ -20 dB -> Amplitude = sqrt(10^(-20/10)) = 0.100 -> DN ~ 1000
    y_grid, x_grid = np.ogrid[:height, :width]
    center_y, center_x = height // 2, width // 2
    water_mask = (y_grid - center_y) ** 2 + (x_grid - center_x) ** 2 <= (height // 4) ** 2

    array[0, water_mask] = 800    # VV amplitude -> Backscatter ~ -22 dB (Low specular return)
    array[1, water_mask] = 400    # VH amplitude -> Backscatter ~ -28 dB

    left, bottom, right, top = 81.50, 16.50, 81.75, 16.75
    transform = from_bounds(left, bottom, right, top, width, height)

    profile = {
        "driver": "GTiff",
        "height": height,
        "width": width,
        "count": 2,
        "dtype": "uint16",
        "crs": CRS.from_epsg(4326),
        "transform": transform,
        "nodata": 0,
    }

    with rasterio.open(file_path, "w", **profile) as dst:
        dst.write(array)

    return file_path


def run_pipeline_tests() -> None:
    """Execute end-to-end integration tests across all four reasoning modalities."""
    print("=" * 80)
    print(" SatQuery AI Core Engine — End-to-End Test Runner")
    print("=" * 80)

    engine = SatQueryEngine(default_crs="EPSG:4326")

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        s2_pre_path = tmp_path / "sentinel2_godavari_pre.tif"
        s2_post_path = tmp_path / "sentinel2_godavari_post.tif"
        s1_sar_path = tmp_path / "sentinel1_godavari_sar.tif"

        # Generate test fixtures
        print("\n[1/5] Synthesizing Georeferenced 16-Bit Test Rasters...")
        create_synthetic_s2_geotiff(s2_pre_path)
        create_synthetic_s2_geotiff(s2_post_path)
        create_synthetic_s1_geotiff(s1_sar_path)
        print("  ✓ Created Sentinel-2 MSI Pre-event 12-band GeoTIFF")
        print("  ✓ Created Sentinel-2 MSI Post-event 12-band GeoTIFF")
        print("  ✓ Created Sentinel-1 C-SAR Dual-Pol GeoTIFF")

        # ----------------------------------------------------------------------
        # Test Case 1: Single Image Optical (Water detection on Sentinel-2)
        # ----------------------------------------------------------------------
        print("\n[2/5] Testing Single Image Optical Specialist (ConvNeXt-v2 S2)...")
        opt_query = QueryRequest(
            query_text="Delineate all open water bodies and lakes in the scene",
            primary_raster=RasterInput(path=str(s2_pre_path), modality=SensorModality.OPTICAL),
            confidence_threshold=0.45,
            enable_physics_verification=True,
        )

        opt_output: EngineOutput = engine.execute_query(opt_query)
        assert opt_output.task_type == TaskType.SINGLE_IMAGE_OPTICAL, "TaskType mismatch"
        assert opt_output.geojson is not None, "GeoJSON should not be None"
        assert len(opt_output.geojson["features"]) > 0, "Expected at least 1 vectorized polygon"
        assert opt_output.statistics["detected_pixel_count"] > 0, "Expected positive pixel detection"
        assert opt_output.audit_trace.verdict in ["VERIFIED", "PARTIAL"], f"Unexpected verdict: {opt_output.audit_trace.verdict}"

        print(f"  ✓ Routed correctly to: {opt_output.audit_trace.specialist_model}")
        print(f"  ✓ Detected Area: {opt_output.statistics['area_hectares']:.2f} ha ({opt_output.statistics['detected_pixel_count']} px)")
        print(f"  ✓ Physics Verdict: {opt_output.audit_trace.verdict}")
        print(f"  ✓ Latency: {opt_output.audit_trace.execution_time_ms:.1f} ms")

        # ----------------------------------------------------------------------
        # Test Case 2: Single Image SAR (Radar backscatter water / flood mapping)
        # ----------------------------------------------------------------------
        print("\n[3/5] Testing Single Image SAR Specialist (ConvNeXt-v2 S1)...")
        sar_query = QueryRequest(
            query_text="Analyze microwave radar backscatter for flood inundation mapping using Sentinel-1",
            primary_raster=RasterInput(path=str(s1_sar_path), modality=SensorModality.SAR),
            confidence_threshold=0.40,
            enable_physics_verification=True,
        )

        sar_output: EngineOutput = engine.execute_query(sar_query)
        assert sar_output.task_type == TaskType.SINGLE_IMAGE_SAR, "TaskType mismatch"
        assert sar_output.statistics["detected_pixel_count"] > 0
        print(f"  ✓ Routed correctly to: {sar_output.audit_trace.specialist_model}")
        print(f"  ✓ Detected Area: {sar_output.statistics['area_hectares']:.2f} ha")
        print(f"  ✓ Physics Verdict: {sar_output.audit_trace.verdict}")
        print(f"  ✓ Latency: {sar_output.audit_trace.execution_time_ms:.1f} ms")

        # ----------------------------------------------------------------------
        # Test Case 3: Change Detection (Siamese ResNet-50)
        # ----------------------------------------------------------------------
        print("\n[4/5] Testing Bi-Temporal Change Detection Specialist (Siamese ResNet-50)...")
        change_query = QueryRequest(
            query_text="Compare before and after satellite observations to detect land-cover change",
            primary_raster=RasterInput(path=str(s2_pre_path), timestamp="2025-06-01"),
            secondary_raster=RasterInput(path=str(s2_post_path), timestamp="2025-09-15"),
            confidence_threshold=0.50,
            enable_physics_verification=False,
        )

        change_output: EngineOutput = engine.execute_query(change_query)
        assert change_output.task_type == TaskType.CHANGE_DETECTION, "TaskType mismatch"
        assert change_output.audit_trace.specialist_model == "siamese_change_detection"
        print(f"  ✓ Routed correctly to: {change_output.audit_trace.specialist_model}")
        print(f"  ✓ Bi-temporal change evaluation completed in {change_output.audit_trace.execution_time_ms:.1f} ms")

        # ----------------------------------------------------------------------
        # Test Case 4: Cross-Modal Fusion (ViT-Base 14-channel Optical + SAR)
        # ----------------------------------------------------------------------
        print("\n[5/5] Testing Cross-Modal 14-Channel Fusion Specialist (ViT-Base)...")
        fusion_query = QueryRequest(
            query_text="Fuse optical and SAR radar imagery for cloud-penetrating water detection",
            primary_raster=RasterInput(path=str(s2_pre_path), modality=SensorModality.OPTICAL),
            secondary_raster=RasterInput(path=str(s1_sar_path), modality=SensorModality.SAR),
            confidence_threshold=0.45,
            enable_physics_verification=True,
        )

        fusion_output: EngineOutput = engine.execute_query(fusion_query)
        assert fusion_output.task_type == TaskType.CROSS_MODAL_FUSION, "TaskType mismatch"
        assert fusion_output.audit_trace.specialist_model == "cross_modal_fusion"
        assert fusion_output.geojson is not None
        print(f"  ✓ Routed correctly to: {fusion_output.audit_trace.specialist_model}")
        print(f"  ✓ 14-channel joint tensor processed ({fusion_output.statistics['detected_pixel_count']} px)")
        print(f"  ✓ Summary Synthesis:\n    \"{fusion_output.summary_text.splitlines()[0]}\"")
        print(f"  ✓ Latency: {fusion_output.audit_trace.execution_time_ms:.1f} ms")

    print("\n" + "=" * 80)
    print(" ALL SATQUERY AI PIPELINE TESTS PASSED SUCCESSFULLY! (100% Offline)")
    print("=" * 80)


if __name__ == "__main__":
    run_pipeline_tests()
