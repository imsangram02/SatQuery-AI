"""
SatQuery AI — Physics Spectral & SAR Indices Module
Deterministic pixel-level physical indices (NDVI, NDWI, MNDWI, NDBI, SAR backscatter)
and spatial bounding-box verification routines.
"""

from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
from shapely.geometry import box, shape

from satquery_core.src.controller.schemas import BoundingBox, PhysicsVerificationResult
from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData


def compute_normalized_difference(
    band_a: np.ndarray,
    band_b: np.ndarray,
    epsilon: float = 1.0e-7,
) -> np.ndarray:
    """
    Vectorized calculation of normalized difference ratio: (A - B) / (A + B + epsilon).

    Args:
        band_a: First spectral channel array (float32).
        band_b: Second spectral channel array (float32).
        epsilon: Numerical guard against zero division.

    Returns:
        Index array strictly bounded in [-1.0, 1.0].
    """
    diff = band_a.astype(np.float32) - band_b.astype(np.float32)
    denom = band_a.astype(np.float32) + band_b.astype(np.float32) + epsilon
    ratio = diff / denom
    return np.clip(ratio, -1.0, 1.0).astype(np.float32)


def compute_ndvi(nir: np.ndarray, red: np.ndarray, epsilon: float = 1.0e-7) -> np.ndarray:
    """
    Compute Normalized Difference Vegetation Index (NDVI).
    Formula: (NIR - Red) / (NIR + Red)
    """
    return compute_normalized_difference(nir, red, epsilon=epsilon)


def compute_ndwi(green: np.ndarray, nir: np.ndarray, epsilon: float = 1.0e-7) -> np.ndarray:
    """
    Compute Normalized Difference Water Index (NDWI - McFeeters 1996).
    Formula: (Green - NIR) / (Green + NIR)
    """
    return compute_normalized_difference(green, nir, epsilon=epsilon)


def compute_mndwi(green: np.ndarray, swir1: np.ndarray, epsilon: float = 1.0e-7) -> np.ndarray:
    """
    Compute Modified Normalized Difference Water Index (MNDWI - Xu 2006).
    Formula: (Green - SWIR1) / (Green + SWIR1)
    """
    return compute_normalized_difference(green, swir1, epsilon=epsilon)


def compute_ndbi(swir1: np.ndarray, nir: np.ndarray, epsilon: float = 1.0e-7) -> np.ndarray:
    """
    Compute Normalized Difference Built-Up Index (NDBI).
    Formula: (SWIR1 - NIR) / (SWIR1 + NIR)
    """
    return compute_normalized_difference(swir1, nir, epsilon=epsilon)


class PhysicsVerifier:
    """
    Grounds deep learning neural network predictions with deterministic physical checks
    derived from multi-spectral equations and SAR microwave backscatter limits.
    """

    def __init__(self, epsilon: float = 1.0e-7) -> None:
        self.epsilon = float(epsilon)

    def verify_optical_water(
        self,
        predicted_mask: np.ndarray,
        green: np.ndarray,
        nir: np.ndarray,
        threshold: float = 0.0,
        min_agreement_ratio: float = 0.70,
    ) -> PhysicsVerificationResult:
        """
        Validate predicted water mask against deterministic NDWI.

        Args:
            predicted_mask: Boolean or binary array (H, W) where 1 indicates water.
            green: Calibrated green surface reflectance [0.0, 1.0].
            nir: Calibrated NIR surface reflectance [0.0, 1.0].
            threshold: Physical NDWI water cutoff (default: 0.0).
            min_agreement_ratio: Minimum ratio of pixels satisfying NDWI threshold (default: 70%).

        Returns:
            PhysicsVerificationResult containing diagnostic coverage metrics.
        """
        ndwi = compute_ndwi(green, nir, epsilon=self.epsilon)
        mask_bool = predicted_mask.astype(bool)
        total_pred_pixels = int(np.sum(mask_bool))

        if total_pred_pixels == 0:
            return PhysicsVerificationResult(
                index_name="NDWI",
                passed=True,
                coverage_percentage=100.0,
                mean_value=0.0,
                min_value=0.0,
                max_value=0.0,
                discrepancy_note="Empty detection footprint; trivially valid.",
            )

        sampled_ndwi = ndwi[mask_bool]
        mean_val = float(np.mean(sampled_ndwi))
        min_val = float(np.min(sampled_ndwi))
        max_val = float(np.max(sampled_ndwi))

        valid_count = int(np.sum(sampled_ndwi > threshold))
        agreement = (valid_count / total_pred_pixels) * 100.0
        passed = (agreement >= (min_agreement_ratio * 100.0))

        note = None
        if not passed:
            note = (
                f"Neural water detection contradicted by physics: only {agreement:.1f}% of pixels "
                f"exceed NDWI threshold of {threshold} (Mean NDWI: {mean_val:.3f})."
            )

        return PhysicsVerificationResult(
            index_name="NDWI",
            passed=passed,
            coverage_percentage=float(round(agreement, 2)),
            mean_value=float(round(mean_val, 4)),
            min_value=float(round(min_val, 4)),
            max_value=float(round(max_val, 4)),
            discrepancy_note=note,
        )

    def verify_optical_vegetation(
        self,
        predicted_mask: np.ndarray,
        nir: np.ndarray,
        red: np.ndarray,
        threshold: float = 0.30,
        min_agreement_ratio: float = 0.70,
    ) -> PhysicsVerificationResult:
        """
        Validate predicted vegetation mask against deterministic NDVI.
        """
        ndvi = compute_ndvi(nir, red, epsilon=self.epsilon)
        mask_bool = predicted_mask.astype(bool)
        total_pred_pixels = int(np.sum(mask_bool))

        if total_pred_pixels == 0:
            return PhysicsVerificationResult(
                index_name="NDVI",
                passed=True,
                coverage_percentage=100.0,
                mean_value=0.0,
                min_value=0.0,
                max_value=0.0,
                discrepancy_note="Empty detection footprint; trivially valid.",
            )

        sampled_ndvi = ndvi[mask_bool]
        mean_val = float(np.mean(sampled_ndvi))
        min_val = float(np.min(sampled_ndvi))
        max_val = float(np.max(sampled_ndvi))

        valid_count = int(np.sum(sampled_ndvi >= threshold))
        agreement = (valid_count / total_pred_pixels) * 100.0
        passed = (agreement >= (min_agreement_ratio * 100.0))

        note = None
        if not passed:
            note = (
                f"Vegetation detection lacks strong chlorophyll signal: only {agreement:.1f}% "
                f"exceed NDVI threshold {threshold} (Mean NDVI: {mean_val:.3f})."
            )

        return PhysicsVerificationResult(
            index_name="NDVI",
            passed=passed,
            coverage_percentage=float(round(agreement, 2)),
            mean_value=float(round(mean_val, 4)),
            min_value=float(round(min_val, 4)),
            max_value=float(round(max_val, 4)),
            discrepancy_note=note,
        )

    def verify_sar_water(
        self,
        predicted_mask: np.ndarray,
        vv_db: np.ndarray,
        vh_db: Optional[np.ndarray] = None,
        max_vv_db: float = -16.0,
        min_agreement_ratio: float = 0.65,
    ) -> PhysicsVerificationResult:
        """
        Validate SAR flood/water detection using specular reflection backscatter boundaries.
        Smooth water surfaces scatter microwave pulses specularly, yielding low backscatter (VV < -16 dB).
        """
        mask_bool = predicted_mask.astype(bool)
        total_pred_pixels = int(np.sum(mask_bool))

        if total_pred_pixels == 0:
            return PhysicsVerificationResult(
                index_name="SAR_VV_dB",
                passed=True,
                coverage_percentage=100.0,
                mean_value=0.0,
                min_value=0.0,
                max_value=0.0,
                discrepancy_note="Empty detection footprint.",
            )

        sampled_vv = vv_db[mask_bool]
        mean_val = float(np.mean(sampled_vv))
        min_val = float(np.min(sampled_vv))
        max_val = float(np.max(sampled_vv))

        valid_count = int(np.sum(sampled_vv <= max_vv_db))
        agreement = (valid_count / total_pred_pixels) * 100.0
        passed = (agreement >= (min_agreement_ratio * 100.0))

        note = None
        if not passed:
            note = (
                f"SAR water backscatter mismatch: only {agreement:.1f}% of pixels are below "
                f"specular threshold {max_vv_db} dB (Mean VV: {mean_val:.2f} dB)."
            )

        return PhysicsVerificationResult(
            index_name="SAR_VV_dB",
            passed=passed,
            coverage_percentage=float(round(agreement, 2)),
            mean_value=float(round(mean_val, 4)),
            min_value=float(round(min_val, 4)),
            max_value=float(round(max_val, 4)),
            discrepancy_note=note,
        )

    def verify_sar_urban(
        self,
        predicted_mask: np.ndarray,
        vv_db: np.ndarray,
        min_vv_db: float = -15.0,
        min_agreement_ratio: float = 0.60,
    ) -> PhysicsVerificationResult:
        """
        Validate SAR built-up / structural detection using corner reflector double-bounce.
        Urban structures and settlements scatter microwave pulses strongly, yielding elevated backscatter (VV >= -15 dB).
        """
        mask_bool = predicted_mask.astype(bool)
        total_pred_pixels = int(np.sum(mask_bool))

        if total_pred_pixels == 0:
            return PhysicsVerificationResult(
                index_name="SAR_Urban_dB",
                passed=True,
                coverage_percentage=100.0,
                mean_value=0.0,
                min_value=0.0,
                max_value=0.0,
                discrepancy_note="Empty detection footprint.",
            )

        sampled_vv = vv_db[mask_bool]
        mean_val = float(np.mean(sampled_vv))
        min_val = float(np.min(sampled_vv))
        max_val = float(np.max(sampled_vv))

        valid_count = int(np.sum(sampled_vv >= min_vv_db))
        agreement = (valid_count / total_pred_pixels) * 100.0
        passed = (agreement >= (min_agreement_ratio * 100.0))

        note = None
        if not passed:
            note = (
                f"SAR urban backscatter mismatch: only {agreement:.1f}% of pixels exceed "
                f"double-bounce threshold {min_vv_db} dB (Mean VV: {mean_val:.2f} dB)."
            )

        return PhysicsVerificationResult(
            index_name="SAR_Urban_dB",
            passed=passed,
            coverage_percentage=float(round(agreement, 2)),
            mean_value=float(round(mean_val, 4)),
            min_value=float(round(min_val, 4)),
            max_value=float(round(max_val, 4)),
            discrepancy_note=note,
        )


class SpatialVerifier:
    """
    Spatial geometry and Region of Interest (ROI) validator for georeferenced raster products.
    """

    @staticmethod
    def crop_to_bbox(
        geotiff: GeoTIFFData,
        bbox: BoundingBox,
    ) -> Tuple[np.ndarray, Tuple[int, int, int, int]]:
        """
        Extract spatial pixel slice corresponding to geographic bounding box.

        Args:
            geotiff: GeoTIFFData instance.
            bbox: BoundingBox in EPSG:4326.

        Returns:
            Tuple of:
                - Sliced 3D NumPy array (C, sub_h, sub_w).
                - Pixel bounding window (min_row, min_col, max_row, max_col).

        Raises:
            ValueError: If bounding box does not intersect raster coverage.
        """
        # Convert geographic corners to pixel coordinates
        row1, col1 = geotiff.spatial_to_pixel(bbox.min_lon, bbox.max_lat)  # Top-left
        row2, col2 = geotiff.spatial_to_pixel(bbox.max_lon, bbox.min_lat)  # Bottom-right

        min_row = max(0, min(row1, row2))
        max_row = min(geotiff.height, max(row1, row2))
        min_col = max(0, min(col1, col2))
        max_col = min(geotiff.width, max(col1, col2))

        if min_row >= max_row or min_col >= max_col:
            raise ValueError(
                f"ROI bounding box {bbox} does not intersect raster bounds {geotiff.bounds}."
            )

        sub_array = geotiff.array[:, min_row:max_row, min_col:max_col]
        return sub_array, (min_row, min_col, max_row, max_col)

    @staticmethod
    def check_bbox_intersection(geotiff: GeoTIFFData, bbox: BoundingBox) -> bool:
        """Verify whether an ROI bounding box intersects the raster geographic footprint."""
        raster_geom = box(*geotiff.bounds)
        bbox_geom = box(bbox.min_lon, bbox.min_lat, bbox.max_lon, bbox.max_lat)
        return bool(raster_geom.intersects(bbox_geom))
