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
            self.in_channels = in_channels or 12
            self.class_names = self.OPTICAL_CLASSES
            self.num_classes = num_classes or len(self.class_names)
            embed_dim = 128
        elif self.modality == "sar":
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

        # Softmax probabilities
        probs = torch.softmax(torch.from_numpy(accum_logits), dim=0).numpy()

        # Resolve target class index
        target_idx = 0
        if target_class_name is not None:
            name_lower = target_class_name.lower().strip()
            for idx, cname in enumerate(self.class_names):
                if name_lower in cname or cname in name_lower:
                    target_idx = idx
                    break

        target_prob = probs[target_idx]
        binary_mask = target_prob >= confidence_threshold

        # Summary diagnostics
        dominant_class_idx = int(np.argmax(np.mean(probs, axis=(1, 2))))
        metadata = {
            "modality": self.modality,
            "target_class": self.class_names[target_idx],
            "target_class_idx": target_idx,
            "dominant_class": self.class_names[dominant_class_idx],
            "mean_confidence": float(np.mean(target_prob)),
            "detected_pixel_count": int(np.sum(binary_mask)),
            "total_pixels": int(height * width),
            "area_percentage": float(np.round((np.sum(binary_mask) / (height * width)) * 100.0, 2)),
        }

        return target_prob, binary_mask, metadata
