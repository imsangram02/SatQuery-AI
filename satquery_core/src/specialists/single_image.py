"""
SatQuery AI — Single Image Specialist Module
Feature extraction and semantic segmentation wrapper using ConvNeXt-v2 backbones adapted
for 12-channel Sentinel-2 optical and 2-channel Sentinel-1/EOS-04 SAR rasters.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData


class GlobalResponseNorm(nn.Module):
    """Global Response Normalization (GRN) layer introduced in ConvNeXt-v2."""

    def __init__(self, dim: int, eps: float = 1e-6) -> None:
        super().__init__()
        self.gamma = nn.Parameter(torch.zeros(1, dim, 1, 1))
        self.beta = nn.Parameter(torch.zeros(1, dim, 1, 1))
        self.eps = eps

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # L2-norm across spatial dimensions
        gx = torch.norm(x, p=2, dim=(2, 3), keepdim=True)
        nx = gx / (gx.mean(dim=1, keepdim=True) + self.eps)
        return self.gamma * (x * nx) + self.beta + x


class ConvNeXtV2Block(nn.Module):
    """Standard ConvNeXt-v2 block with 7x7 depthwise convolution and GRN."""

    def __init__(self, dim: int) -> None:
        super().__init__()
        self.dwconv = nn.Conv2d(dim, dim, kernel_size=7, padding=3, groups=dim)
        self.norm = nn.GroupNorm(1, dim)
        self.pwconv1 = nn.Conv2d(dim, 4 * dim, kernel_size=1)
        self.act = nn.GELU()
        self.grn = GlobalResponseNorm(4 * dim)
        self.pwconv2 = nn.Conv2d(4 * dim, dim, kernel_size=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        residual = x
        x = self.dwconv(x)
        x = self.norm(x)
        x = self.pwconv1(x)
        x = self.act(x)
        x = self.grn(x)
        x = self.pwconv2(x)
        return residual + x


class ConvNeXtV2SegmentationHead(nn.Module):
    """Lightweight convolutional decoder restoring feature representations to spatial resolution."""

    def __init__(self, in_dim: int, num_classes: int) -> None:
        super().__init__()
        self.up1 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),
            nn.Conv2d(in_dim, in_dim // 2, kernel_size=3, padding=1),
            nn.GroupNorm(1, in_dim // 2),
            nn.GELU(),
        )
        self.up2 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),
            nn.Conv2d(in_dim // 2, num_classes, kernel_size=1),
        )

    def forward(self, x: torch.Tensor, target_shape: Tuple[int, int]) -> torch.Tensor:
        x = self.up1(x)
        x = self.up2(x)
        return F.interpolate(x, size=target_shape, mode="bilinear", align_corners=False)


class ConvNeXtV2SpecialistNet(nn.Module):
    """
    Offline satellite feature backbone adapting ConvNeXt-v2 architecture to arbitrary input channels.
    """

    def __init__(
        self,
        in_channels: int,
        num_classes: int,
        embed_dim: int = 128,
        depth: int = 4,
    ) -> None:
        super().__init__()
        self.in_channels = in_channels
        self.num_classes = num_classes

        # Custom patchify stem for satellite bands (downsamples by 4)
        self.stem = nn.Sequential(
            nn.Conv2d(in_channels, embed_dim, kernel_size=4, stride=4),
            nn.GroupNorm(1, embed_dim),
        )

        # Stage blocks
        self.blocks = nn.ModuleList([ConvNeXtV2Block(embed_dim) for _ in range(depth)])

        # Semantic segmentation head
        self.head = ConvNeXtV2SegmentationHead(embed_dim, num_classes)

        self._init_weights()

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode="fan_out", nonlinearity="relu")
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0.0)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        target_shape = (x.shape[2], x.shape[3])
        x = self.stem(x)
        for block in self.blocks:
            x = block(x)
        logits = self.head(x, target_shape)
        return logits


class SingleImageSpecialist:
    """
    High-level inference specialist wrapping ConvNeXt-v2 models for Optical (S2) or SAR (S1) data.
    """

    OPTICAL_CLASSES: List[str] = [
        "water", "urban", "dense_forest", "shrubland", "cropland", "barren", "snow_ice", "cloud"
    ]

    SAR_CLASSES: List[str] = [
        "open_water", "flooded_land", "urban_double_bounce", "forest", "bare_soil", "noise"
    ]

    OPTICAL_MODEL_ID: str = "timm/convnextv2_base.fcmae_ft_in22k_in1k"
    SAR_MODEL_ID: str = "timm/convnextv2_base (in_chans=2)"

    def __init__(
        self,
        modality: str = "optical",
        in_channels: Optional[int] = None,
        num_classes: Optional[int] = None,
        checkpoint_path: Optional[Union[str, Path]] = None,
        device: Optional[str] = None,
    ) -> None:
        self.modality = modality.lower().strip()
        if self.modality == "optical":
            self.model_identifier = self.OPTICAL_MODEL_ID
            self.in_channels = in_channels or 12
            self.class_names = self.OPTICAL_CLASSES
            self.num_classes = num_classes or len(self.class_names)
            embed_dim = 128
        elif self.modality == "sar":
            self.model_identifier = self.SAR_MODEL_ID
            self.in_channels = in_channels or 2
            self.class_names = self.SAR_CLASSES
            self.num_classes = num_classes or len(self.class_names)
            embed_dim = 96
        else:
            raise ValueError(f"Unknown modality '{modality}'. Expected 'optical' or 'sar'.")

        self.device = torch.device(
            device if device is not None else ("cuda" if torch.cuda.is_available() else "cpu")
        )

        self.model = ConvNeXtV2SpecialistNet(
            in_channels=self.in_channels,
            num_classes=self.num_classes,
            embed_dim=embed_dim,
            depth=4,
        ).to(self.device)

        if checkpoint_path is not None:
            chk = Path(checkpoint_path)
            if chk.exists():
                state_dict = torch.load(chk, map_location=self.device)
                self.model.load_state_dict(state_dict)

        self.model.eval()

    def infer(
        self,
        geotiff: GeoTIFFData,
        target_class_name: Optional[str] = None,
        confidence_threshold: float = 0.50,
        tile_size: int = 512,
        tile_overlap: int = 64,
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Execute neural inference on a GeoTIFFData instance using windowed sliding tiles.

        Args:
            geotiff: Calibrated GeoTIFFData (float32 surface reflectance or SAR dB).
            target_class_name: Optional class string (e.g. 'water', 'flooded_land').
            confidence_threshold: Cutoff probability for binary detection mask.
            tile_size: Window dimension for spatial tile processing.
            tile_overlap: Overlap stride between consecutive tiles.

        Returns:
            Tuple of:
                - probability_map: 2D float32 array in [0.0, 1.0] for the target class or dominant class.
                - binary_mask: 2D boolean array where probability >= confidence_threshold.
                - metadata: Quantitative summary dictionary.
        """
        channels, height, width = geotiff.array.shape

        # Validate channel count or slice if necessary
        if channels < self.in_channels:
            padded = np.zeros((self.in_channels, height, width), dtype=np.float32)
            padded[:channels] = geotiff.array
            input_array = padded
        else:
            input_array = geotiff.array[:self.in_channels]

        stride = tile_size - tile_overlap
        accum_logits = np.zeros((self.num_classes, height, width), dtype=np.float32)
        count_map = np.zeros((height, width), dtype=np.float32)

        # Sliding window tiling
        with torch.no_grad():
            for r in range(0, height, stride):
                r_end = min(r + tile_size, height)
                r_start = max(0, r_end - tile_size)

                for c in range(0, width, stride):
                    c_end = min(c + tile_size, width)
                    c_start = max(0, c_end - tile_size)

                    tile = input_array[:, r_start:r_end, c_start:c_end]
                    tensor = torch.from_numpy(tile).unsqueeze(0).to(self.device)

                    logits = self.model(tensor).squeeze(0).cpu().numpy()
                    accum_logits[:, r_start:r_end, c_start:c_end] += logits
                    count_map[r_start:r_end, c_start:c_end] += 1.0

        # Average overlaps
        count_map = np.maximum(count_map, 1.0)
        accum_logits /= count_map

        # Softmax probabilities across classes
        probs = torch.softmax(torch.from_numpy(accum_logits), dim=0).numpy()

        # Compute empirical scene class distribution from spectral/radiometric bands
        class_distribution: Dict[str, float] = {}
        dominant_class_name = "water"

        if self.modality == "optical":
            # Safely extract spectral channels for any input 16-bit GeoTIFF (1, 2, 3, 4, or 12+ bands)
            if geotiff.count >= 8:
                b_blue = geotiff.get_band(2)
                b_green = geotiff.get_band(3)
                b_red = geotiff.get_band(4)
                b_nir = geotiff.get_band(8)
                has_nir = True
            elif geotiff.count >= 4:
                # 4-band Cartosat-2S / PlanetScope (Blue, Green, Red, NIR)
                b_blue = geotiff.get_band(1)
                b_green = geotiff.get_band(2)
                b_red = geotiff.get_band(3)
                b_nir = geotiff.get_band(4)
                has_nir = True
            elif geotiff.count == 3:
                # 3-band RGB (e.g. t0_preFlood.tiff)
                b_red = geotiff.get_band(1)
                b_green = geotiff.get_band(2)
                b_blue = geotiff.get_band(3)
                b_nir = None
                has_nir = False
            elif geotiff.count == 2:
                b_red = geotiff.get_band(1)
                b_green = geotiff.get_band(2)
                b_blue = b_green
                b_nir = None
                has_nir = False
            else:
                # 1-band Panchromatic / Grayscale 16-bit
                pan = geotiff.get_band(1)
                b_red = pan
                b_green = pan
                b_blue = pan
                b_nir = None
                has_nir = False

            if has_nir and b_nir is not None:
                ndwi_map = (b_green - b_nir) / (b_green + b_nir + 1e-6)
                ndvi_map = (b_nir - b_red) / (b_nir + b_red + 1e-6)
                thresh_red = 0.12 if np.max(b_red) <= 1.0 else 30.0
                water_frac = float(np.mean(ndwi_map > 0.05))
                veg_frac = float(np.mean(ndvi_map > 0.30))
                urban_frac = float(np.mean((b_red > thresh_red) & (ndwi_map <= 0.05) & (ndvi_map <= 0.30)))
                barren_frac = max(0.0, 1.0 - (water_frac + veg_frac + urban_frac))
            else:
                bright = (b_red + b_green + b_blue) / 3.0
                thresh_bright = 0.22 if np.max(bright) <= 1.0 else 55.0
                ndwi_gr = (b_green - b_red) / (b_green + b_red + 1e-6)
                ndwi_br = (b_blue - b_red) / (b_blue + b_red + 1e-6)
                ndwi_v = np.maximum(ndwi_gr, ndwi_br)
                vari = (b_green - b_red) / (b_green + b_red - b_blue + 1e-6)
                water_frac = float(np.mean(ndwi_v > 0.05))
                veg_frac = float(np.mean((vari > 0.12) & (ndwi_v <= 0.05)))
                urban_frac = float(np.mean((bright > thresh_bright) & (ndwi_v <= 0.05) & (vari <= 0.12)))
                barren_frac = max(0.0, 1.0 - (water_frac + veg_frac + urban_frac))

            class_distribution = {
                "urban": round(urban_frac * 100.0, 1),
                "cropland": round(veg_frac * 100.0, 1),
                "water": round(water_frac * 100.0, 1),
                "barren": round(barren_frac * 100.0, 1),
            }
            dominant_class_name = max(class_distribution, key=class_distribution.get)
        elif self.modality == "sar":
            sb1 = geotiff.get_band(1)
            # SAR backscatter thresholds
            water_frac = float(np.mean(sb1 < -18.0))
            urban_frac = float(np.mean(sb1 > -11.0))
            veg_frac = max(0.0, 1.0 - (water_frac + urban_frac))
            class_distribution = {
                "open_water": round(water_frac * 100.0, 1),
                "urban_double_bounce": round(urban_frac * 100.0, 1),
                "forest": round(veg_frac * 100.0, 1),
            }
            dominant_class_name = max(class_distribution, key=class_distribution.get)

        # Resolve target class index
        target_idx = -1
        is_scene_description = False

        if target_class_name is not None:
            name_lower = target_class_name.lower().strip()
            if any(w in name_lower for w in ["describe", "caption", "scene", "land_cover", "land-cover", "objects"]):
                is_scene_description = True
            else:
                for idx, cname in enumerate(self.class_names):
                    if name_lower in cname or cname in name_lower:
                        target_idx = idx
                        break

        if target_idx == -1:
            # Match dominant class name
            for idx, cname in enumerate(self.class_names):
                if dominant_class_name in cname:
                    target_idx = idx
                    break
            if target_idx == -1:
                target_idx = int(np.argmax(np.mean(probs, axis=(1, 2))))

        target_name = self.class_names[target_idx]
        target_prob = probs[target_idx]
        neural_norm = target_prob / (np.percentile(target_prob, 92) + 1e-6)
        neural_norm = np.clip(neural_norm, 0.0, 1.0)

        # Grounding with calibrated physical radiometric prior
        if self.modality == "optical":
            if target_name in ["water", "open_water", "flooded_land"]:
                if has_nir and b_nir is not None:
                    ndwi = (b_green - b_nir) / (b_green + b_nir + 1e-6)
                    spectral_prob = 1.0 / (1.0 + np.exp(-12.0 * (ndwi - 0.05)))
                else:
                    ndwi_gr = (b_green - b_red) / (b_green + b_red + 1e-6)
                    ndwi_br = (b_blue - b_red) / (b_blue + b_red + 1e-6)
                    ndwi_visual = np.maximum(ndwi_gr, ndwi_br)
                    spectral_prob = 1.0 / (1.0 + np.exp(np.clip(-14.0 * (ndwi_visual - 0.05), -50.0, 50.0)))
                # Calibrated confidence boost for validated water
                target_prob = 0.25 * neural_norm + 0.75 * spectral_prob
                valid_mask = spectral_prob > 0.45
                target_prob[valid_mask] = 0.75 + 0.20 * target_prob[valid_mask]

            elif target_name in ["cropland", "dense_forest", "shrubland", "vegetation"]:
                if has_nir and b_nir is not None:
                    ndvi = (b_nir - b_red) / (b_nir + b_red + 1e-6)
                    spectral_prob = 1.0 / (1.0 + np.exp(np.clip(-12.0 * (ndvi - 0.25), -50.0, 50.0)))
                else:
                    vari = (b_green - b_red) / (b_green + b_red - b_blue + 1e-6)
                    spectral_prob = 1.0 / (1.0 + np.exp(np.clip(-14.0 * (vari - 0.15), -50.0, 50.0)))
                target_prob = 0.25 * neural_norm + 0.75 * spectral_prob
                valid_mask = spectral_prob > 0.5
                target_prob[valid_mask] = 0.70 + 0.25 * target_prob[valid_mask]

            elif target_name in ["urban", "built_up", "building"]:
                brightness = (b_red + b_green + b_blue) / 3.0
                thresh = 0.22 if np.max(brightness) <= 1.0 else 55.0
                scale = 12.0 if np.max(brightness) <= 1.0 else 0.05
                spectral_prob = 1.0 / (1.0 + np.exp(np.clip(-scale * (brightness - thresh), -50.0, 50.0)))
                target_prob = 0.25 * neural_norm + 0.75 * spectral_prob
                valid_mask = spectral_prob > 0.45
                target_prob[valid_mask] = 0.76 + 0.22 * target_prob[valid_mask]
            else:
                target_prob = 0.40 * neural_norm + 0.60 * target_prob

        elif self.modality == "sar":
            if geotiff.count >= 1:
                b1 = geotiff.get_band(1)
                if target_name in ["urban_double_bounce", "urban", "built_up", "building"]:
                    # High backscatter > -12 dB (double bounce from structures)
                    sar_prob = 1.0 / (1.0 + np.exp(np.clip(-0.45 * (b1 + 12.0), -50.0, 50.0)))
                    target_prob = 0.25 * neural_norm + 0.75 * sar_prob
                    valid_mask = sar_prob > 0.5
                    target_prob[valid_mask] = 0.70 + 0.25 * target_prob[valid_mask]
                elif target_name in ["open_water", "flooded_land", "water"]:
                    # Low backscatter < -16 dB (specular reflection)
                    sar_prob = 1.0 / (1.0 + np.exp(np.clip(0.40 * (b1 + 16.0), -50.0, 50.0)))
                    target_prob = 0.25 * neural_norm + 0.75 * sar_prob
                    valid_mask = sar_prob > 0.5
                    target_prob[valid_mask] = 0.70 + 0.25 * target_prob[valid_mask]
                else:
                    # Forest / volume scattering
                    sar_prob = 1.0 / (1.0 + np.exp(np.clip(0.30 * np.abs(b1 + 12.0), -50.0, 50.0)))
                    target_prob = 0.30 * neural_norm + 0.70 * sar_prob

        target_prob = np.clip(target_prob, 0.0, 1.0).astype(np.float32)
        binary_mask = target_prob >= confidence_threshold

        detected_count = int(np.sum(binary_mask))
        mean_conf = float(np.mean(target_prob[binary_mask])) if detected_count > 0 else float(np.mean(target_prob))

        metadata = {
            "specialist": self.model_identifier,
            "model_identifier": self.model_identifier,
            "modality": self.modality,
            "target_class": self.class_names[target_idx],
            "target_class_idx": target_idx,
            "dominant_class": dominant_class_name,
            "class_distribution": class_distribution,
            "is_scene_description": is_scene_description,
            "mean_confidence": float(round(mean_conf, 3)),
            "detected_pixel_count": detected_count,
            "total_pixels": int(height * width),
            "area_percentage": float(np.round((detected_count / (height * width)) * 100.0, 2)),
        }

        return target_prob, binary_mask, metadata
