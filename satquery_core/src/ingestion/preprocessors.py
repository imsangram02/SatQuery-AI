"""
SatQuery AI — Satellite Preprocessors Module
Physical radiometric calibrations: Optical BOA reflectance scaling and SAR decibel transformation.
"""

from typing import Optional, Tuple, Union

import numpy as np
from scipy.ndimage import uniform_filter

from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData


class OpticalPreprocessor:
    """
    Calibrates multi-spectral optical imagery from raw Digital Numbers (DN)
    to physical Bottom-of-Atmosphere (BOA) surface reflectance in the range [0.0, 1.0].
    """

    def __init__(
        self,
        scale_factor: float = 10000.0,
        clamp_min: float = 0.0,
        clamp_max: float = 1.0,
        nodata_val: Optional[float] = 0.0,
    ) -> None:
        """
        Initialize optical preprocessor.

        Args:
            scale_factor: Radiometric divisor (10000.0 for Sentinel-2 L2A, 1023.0 for 10-bit sensors).
            clamp_min: Lower bound for physical reflectance (default: 0.0).
            clamp_max: Upper bound for physical reflectance (default: 1.0).
            nodata_val: Sentinel value indicating missing or invalid sensor observations.
        """
        self.scale_factor = float(scale_factor)
        self.clamp_min = float(clamp_min)
        self.clamp_max = float(clamp_max)
        self.nodata_val = nodata_val

    def calibrate(
        self,
        array: np.ndarray,
        nodata: Optional[float] = None,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Calibrate optical Digital Numbers (DN) to normalized surface reflectance.

        Formula:
            rho = DN / scale_factor, clamped to [clamp_min, clamp_max]

        Args:
            array: Multi-spectral array of shape (Channels, Height, Width) or (Height, Width).
            nodata: Optional NoData override.

        Returns:
            Tuple of:
                - Calibrated float32 array in [clamp_min, clamp_max].
                - Boolean validity mask (True = valid pixel, False = NoData / corrupted).
        """
        data = array.astype(np.float32)
        data = np.nan_to_num(data, nan=0.0, posinf=65535.0, neginf=0.0)

        # Generate validity mask safely without wiping legitimate zero-value pixels
        valid_mask = ~np.isnan(data) & ~np.isinf(data)
        if nodata is not None and not np.isnan(nodata):
            valid_mask &= ~np.isclose(data, float(nodata))

        # Scale to surface reflectance: adaptively detect 8-bit, 16-bit S2 (10000), vs full uint16 (65535)
        max_val = float(np.nanmax(data)) if data.size > 0 else 1.0
        if max_val <= 1.0:
            scale = 1.0
        elif max_val <= 255.0:
            scale = 255.0  # Standard 8-bit visual RGB (PNG, JPEG)
        elif max_val <= 10000.0:
            scale = self.scale_factor  # Multi-spectral Sentinel-2 L2A surface reflectance DN (10000)
        elif max_val <= 65535.0:
            scale = 65535.0  # Standard 16-bit unsigned integer raster range
        else:
            scale = max_val

        calibrated = data / scale

        # Atmospheric over-correction or shadow noise can yield negative values; clamp safely
        calibrated = np.clip(calibrated, self.clamp_min, self.clamp_max)

        # Zero out invalid pixels
        calibrated[~valid_mask] = 0.0

        return calibrated.astype(np.float32), valid_mask

    def process_geotiff(self, geotiff: GeoTIFFData) -> GeoTIFFData:
        """
        Process a GeoTIFFData instance, returning a newly calibrated GeoTIFFData object.

        Args:
            geotiff: Input raw GeoTIFFData.

        Returns:
            Calibrated GeoTIFFData containing surface reflectance values.
        """
        calibrated_array, _ = self.calibrate(geotiff.array, nodata=geotiff.nodata)
        updated_meta = geotiff.metadata.copy()
        updated_meta["processing"] = "calibrated_surface_reflectance"
        updated_meta["scale_factor"] = self.scale_factor

        return GeoTIFFData(
            array=calibrated_array,
            crs=geotiff.crs,
            transform=geotiff.transform,
            width=geotiff.width,
            height=geotiff.height,
            count=geotiff.count,
            nodata=0.0,
            bounds=geotiff.bounds,
            metadata=updated_meta,
            file_path=geotiff.file_path,
        )


class SARPreprocessor:
    """
    Calibrates Synthetic Aperture Radar (SAR) linear amplitude or intensity
    to calibrated sigma-nought (sigma^0) backscatter in decibels (dB), with optional speckle filtering.
    """

    def __init__(
        self,
        is_amplitude: bool = True,
        epsilon: float = 1.0e-7,
        clamp_min_db: float = -35.0,
        clamp_max_db: float = 5.0,
        filter_speckle: bool = True,
        filter_window_size: int = 3,
    ) -> None:
        """
        Initialize SAR preprocessor.

        Args:
            is_amplitude: If True, input is treated as amplitude (DN) and squared to intensity (DN^2).
                          If False, input is assumed to already be linear intensity.
            epsilon: Small numerical guard to prevent log10(0) evaluation.
            clamp_min_db: Lower bound for terrestrial backscatter (default: -35.0 dB).
            clamp_max_db: Upper bound for terrestrial backscatter (default: +5.0 dB).
            filter_speckle: Whether to apply a local spatial speckle suppression filter.
            filter_window_size: Window dimension for spatial boxcar/Lee filtering.
        """
        self.is_amplitude = is_amplitude
        self.epsilon = float(epsilon)
        self.clamp_min_db = float(clamp_min_db)
        self.clamp_max_db = float(clamp_max_db)
        self.filter_speckle = filter_speckle
        self.filter_window_size = filter_window_size

    def calibrate(self, array: np.ndarray) -> np.ndarray:
        """
        Calibrate SAR linear array to sigma-nought backscatter in decibels.

        Supports both:
        - 16-bit satellite GeoTIFF DN (e.g., Sentinel-1 GRD DN scaled by 10000)
        - 8-bit remote-sensing benchmark images (e.g., PNG/JPEG in [0, 255])
        """
        data = array.astype(np.float32)
        max_val = float(np.max(data)) if data.size > 0 else 1.0

        if max_val <= 255.0 and max_val > 10.0:
            # 8-bit benchmark image (PNG/JPEG): map [0, 255] linearly to [-30.0, 0.0] dB
            sigma0_db = -30.0 + (data / 255.0) * 30.0
            if self.filter_speckle and sigma0_db.shape[-1] >= self.filter_window_size:
                sigma0_db = self._apply_boxcar_filter(sigma0_db, self.filter_window_size)
            return np.clip(sigma0_db, self.clamp_min_db, self.clamp_max_db).astype(np.float32)

        # 16-bit satellite GeoTIFF DN
        if max_val > 10.0:
            if max_val <= 10000.0:
                data = data / 10000.0
            elif max_val <= 65535.0:
                data = data / 65535.0
            else:
                data = data / max_val

        # Compute linear power intensity
        if self.is_amplitude:
            intensity = np.square(data)
        else:
            intensity = np.maximum(data, 0.0)

        # Optional spatial speckle filtering in the linear intensity domain
        if self.filter_speckle and intensity.shape[-1] >= self.filter_window_size:
            intensity = self._apply_boxcar_filter(intensity, self.filter_window_size)

        # Apply logarithmic decibel transformation with numerical safety
        intensity_safe = np.maximum(intensity, self.epsilon)
        sigma0_db = 10.0 * np.log10(intensity_safe)

        # Clamp to realistic terrestrial dynamic range
        sigma0_db = np.clip(sigma0_db, self.clamp_min_db, self.clamp_max_db)

        return sigma0_db.astype(np.float32)

    def compute_cross_ratio(
        self,
        vh_db: np.ndarray,
        vv_db: np.ndarray,
    ) -> np.ndarray:
        """
        Compute the SAR Cross-Ratio (CR) in the decibel domain.

        Formula:
            CR_dB = VH_dB - VV_dB  (equivalent to log10(sigma^0_VH / sigma^0_VV))

        Args:
            vh_db: Cross-polarized backscatter in dB.
            vv_db: Co-polarized backscatter in dB.

        Returns:
            Cross-ratio array in dB.
        """
        return (vh_db - vv_db).astype(np.float32)

    def _apply_boxcar_filter(self, intensity: np.ndarray, size: int) -> np.ndarray:
        """Apply uniform spatial averaging across spatial axes (H, W) per channel."""
        if intensity.ndim == 3:
            filtered = np.empty_like(intensity)
            for c in range(intensity.shape[0]):
                filtered[c] = uniform_filter(intensity[c], size=size, mode="reflect")
            return filtered
        elif intensity.ndim == 2:
            return uniform_filter(intensity, size=size, mode="reflect")
        return intensity

    def process_geotiff(self, geotiff: GeoTIFFData) -> GeoTIFFData:
        """
        Process a GeoTIFFData SAR instance, returning a calibrated GeoTIFFData object in decibels.

        Args:
            geotiff: Input raw GeoTIFFData containing SAR channels (e.g., VV, VH).

        Returns:
            Calibrated GeoTIFFData in decibels.
        """
        db_array = self.calibrate(geotiff.array)
        updated_meta = geotiff.metadata.copy()
        updated_meta["processing"] = "calibrated_sigma_nought_db"
        updated_meta["unit"] = "dB"

        return GeoTIFFData(
            array=db_array,
            crs=geotiff.crs,
            transform=geotiff.transform,
            width=geotiff.width,
            height=geotiff.height,
            count=geotiff.count,
            nodata=None,
            bounds=geotiff.bounds,
            metadata=updated_meta,
            file_path=geotiff.file_path,
        )


class PreprocessorDispatcher:
    """
    Convenience orchestrator that inspects raster characteristics and dispatches
    to either OpticalPreprocessor or SARPreprocessor.
    """

    def __init__(self) -> None:
        self.optical = OpticalPreprocessor()
        self.sar = SARPreprocessor()

    def preprocess(
        self,
        geotiff: GeoTIFFData,
        modality: Optional[str] = None,
    ) -> GeoTIFFData:
        """
        Automatically normalize and calibrate a GeoTIFFData product.

        Args:
            geotiff: Input GeoTIFFData instance.
            modality: Explicit 'optical' or 'sar'. If None, inferred heuristically:
                      - 1 or 2 channels -> SAR
                      - 3 or more channels -> Optical

        Returns:
            Calibrated GeoTIFFData ready for physics indexing and neural backbones.
        """
        if modality is None:
            # Heuristic: Sentinel-1 / EOS-04 typically has 1 or 2 channels (VV, VH)
            # Optical imagery typically has 3 (RGB), 4 (RGB-NIR), or 12+ channels
            modality = "sar" if geotiff.count <= 2 else "optical"

        modality = modality.lower().strip()
        if modality == "sar":
            return self.sar.process_geotiff(geotiff)
        elif modality == "optical":
            return self.optical.process_geotiff(geotiff)
        else:
            raise ValueError(f"Unsupported modality: '{modality}'. Expected 'optical' or 'sar'.")
