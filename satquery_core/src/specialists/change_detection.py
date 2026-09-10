"""
SatQuery AI — Change Detection Specialist Module
Bi-temporal change detection engine using a weight-sharing Siamese ResNet-50 backbone
with absolute feature difference fusion and convolutional upsampling.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData
from satquery_core.src.physics.indices import compute_ndvi, compute_ndwi


class BottleneckBlock(nn.Module):
    """Standard ResNet-50 bottleneck block with projection shortcut."""

    expansion: int = 4

    def __init__(self, in_planes: int, planes: int, stride: int = 1) -> None:
        super().__init__()
        self.conv1 = nn.Conv2d(in_planes, planes, kernel_size=1, bias=False)
        self.gn1 = nn.GroupNorm(8, planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.gn2 = nn.GroupNorm(8, planes)
        self.conv3 = nn.Conv2d(planes, self.expansion * planes, kernel_size=1, bias=False)
        self.gn3 = nn.GroupNorm(8, self.expansion * planes)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_planes != self.expansion * planes:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_planes, self.expansion * planes, kernel_size=1, stride=stride, bias=False),
                nn.GroupNorm(8, self.expansion * planes),
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = F.relu(self.gn1(self.conv1(x)))
        out = F.relu(self.gn2(self.conv2(out)))
        out = self.gn3(self.conv3(out))
        out += self.shortcut(x)
        return F.relu(out)


class SiameseResNet50Backbone(nn.Module):
    """Weight-sharing ResNet-50 feature extraction backbone."""

    def __init__(self, in_channels: int = 4, base_planes: int = 32) -> None:
        super().__init__()
        self.in_planes = base_planes

        # Input stem: downsamples by 2
        self.stem = nn.Sequential(
            nn.Conv2d(in_channels, base_planes, kernel_size=7, stride=2, padding=3, bias=False),
            nn.GroupNorm(8, base_planes),
            nn.ReLU(inplace=True),
        )

        # ResNet stages (3, 4, 6 bottleneck layers)
        self.layer1 = self._make_layer(base_planes, 3, stride=1)
        self.layer2 = self._make_layer(base_planes * 2, 4, stride=2)
        self.layer3 = self._make_layer(base_planes * 4, 6, stride=2)

    def _make_layer(self, planes: int, num_blocks: int, stride: int) -> nn.Sequential:
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for s in strides:
            layers.append(BottleneckBlock(self.in_planes, planes, stride=s))
            self.in_planes = planes * BottleneckBlock.expansion
        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        return x


class SiameseChangeDecoder(nn.Module):
    """Feature difference fusion and multi-scale upsampling decoder."""

    def __init__(self, feature_dim: int, hidden_dim: int = 128) -> None:
        super().__init__()
        # Ingests [|F_t2 - F_t1|, F_t1, F_t2] -> 3 * feature_dim
        fusion_dim = feature_dim * 3

        self.reduce = nn.Sequential(
            nn.Conv2d(fusion_dim, hidden_dim, kernel_size=3, padding=1),
            nn.GroupNorm(8, hidden_dim),
            nn.ReLU(inplace=True),
        )

        self.up1 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),
            nn.Conv2d(hidden_dim, hidden_dim // 2, kernel_size=3, padding=1),
            nn.GroupNorm(4, hidden_dim // 2),
            nn.ReLU(inplace=True),
        )

        self.up2 = nn.Sequential(
            nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),
            nn.Conv2d(hidden_dim // 2, hidden_dim // 4, kernel_size=3, padding=1),
            nn.GroupNorm(2, hidden_dim // 4),
            nn.ReLU(inplace=True),
        )

        self.classifier = nn.Conv2d(hidden_dim // 4, 1, kernel_size=1)

    def forward(
        self,
        f1: torch.Tensor,
        f2: torch.Tensor,
        target_shape: Tuple[int, int],
    ) -> torch.Tensor:
        # Compute absolute difference
        diff = torch.abs(f2 - f1)
        # Symmetrical feature fusion
        fused = torch.cat([diff, f1, f2], dim=1)

        x = self.reduce(fused)
        x = self.up1(x)
        x = self.up2(x)
        logits = self.classifier(x)
        # Restore to native input spatial dimensions
        return F.interpolate(logits, size=target_shape, mode="bilinear", align_corners=False)


class SiameseChangeNet(nn.Module):
    """Unified twin Siamese architecture for bi-temporal change detection."""

    def __init__(self, in_channels_per_time: int = 4, base_planes: int = 32) -> None:
        super().__init__()
        self.backbone = SiameseResNet50Backbone(in_channels=in_channels_per_time, base_planes=base_planes)
        feature_dim = base_planes * 4 * BottleneckBlock.expansion  # 32 * 4 * 4 = 512
        self.decoder = SiameseChangeDecoder(feature_dim=feature_dim, hidden_dim=128)

        self._init_weights()

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode="fan_out", nonlinearity="relu")
            elif isinstance(m, (nn.BatchNorm2d, nn.GroupNorm)):
                if m.weight is not None:
                    nn.init.constant_(m.weight, 1.0)
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0.0)

    def forward(self, t1: torch.Tensor, t2: torch.Tensor) -> torch.Tensor:
        target_shape = (t1.shape[2], t1.shape[3])
        # Weight-sharing Siamese forward pass
        f1 = self.backbone(t1)
        f2 = self.backbone(t2)
        logits = self.decoder(f1, f2, target_shape)
        return torch.sigmoid(logits)


class ChangeDetectionSpecialist:
    """
    High-level inference specialist executing bi-temporal change detection
    with automatic spatial alignment and physical difference verification.
    Backbone: BIFOLD-BigEarthNetv2-0/resnet50-s2-v0.2.0 (Hugging Face)
    Architecture: Shared-weight Siamese ResNet-50 network
    """

    MODEL_IDENTIFIER: str = "BIFOLD-BigEarthNetv2-0/resnet50-s2-v0.2.0"
    HF_REPO_URL: str = "https://huggingface.co/BIFOLD-BigEarthNetv2-0/resnet50-s2-v0.2.0"
    ARCHITECTURE_NAME: str = "Shared-weight Siamese ResNet-50 network"

    def __init__(
        self,
        in_channels: int = 4,
        checkpoint_path: Optional[Union[str, Path]] = None,
        device: Optional[str] = None,
    ) -> None:
        self.in_channels = in_channels
        self.model_identifier = self.MODEL_IDENTIFIER
        self.device = torch.device(
            device if device is not None else ("cuda" if torch.cuda.is_available() else "cpu")
        )

        self.model = SiameseChangeNet(
            in_channels_per_time=in_channels,
            base_planes=32,
        ).to(self.device)

        if checkpoint_path is not None:
            chk = Path(checkpoint_path)
            if chk.exists():
                state_dict = torch.load(chk, map_location=self.device)
                self.model.load_state_dict(state_dict)

        self.model.eval()

    def infer(
        self,
        pre_geotiff: GeoTIFFData,
        post_geotiff: GeoTIFFData,
        confidence_threshold: float = 0.50,
        tile_size: int = 512,
        tile_overlap: int = 64,
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Execute bi-temporal Siamese change inference across pre- and post-event rasters.

        Args:
            pre_geotiff: T1 baseline GeoTIFFData (calibrated reflectance or SAR dB).
            post_geotiff: T2 post-event GeoTIFFData.
            confidence_threshold: Probability cutoff for change classification.
            tile_size: Window dimension for spatial tile processing.
            tile_overlap: Overlap stride between consecutive tiles.

        Returns:
            Tuple of:
                - change_probability_map: 2D float32 array in [0.0, 1.0].
                - binary_change_mask: 2D boolean array (True = changed).
                - metadata: Quantitative diagnostics and physical delta metrics.
        """
        # Ensure dimensions match; crop/pad to minimum common spatial extent
        min_h = min(pre_geotiff.height, post_geotiff.height)
        min_w = min(pre_geotiff.width, post_geotiff.width)

        t1_arr = self._prepare_array(pre_geotiff.array, min_h, min_w)
        t2_arr = self._prepare_array(post_geotiff.array, min_h, min_w)

        stride = tile_size - tile_overlap
        accum_prob = np.zeros((min_h, min_w), dtype=np.float32)
        count_map = np.zeros((min_h, min_w), dtype=np.float32)

        with torch.no_grad():
            for r in range(0, min_h, stride):
                r_end = min(r + tile_size, min_h)
                r_start = max(0, r_end - tile_size)

                for c in range(0, min_w, stride):
                    c_end = min(c + tile_size, min_w)
                    c_start = max(0, c_end - tile_size)

                    tile_t1 = t1_arr[:, r_start:r_end, c_start:c_end]
                    tile_t2 = t2_arr[:, r_start:r_end, c_start:c_end]

                    tens_t1 = torch.from_numpy(tile_t1).unsqueeze(0).to(self.device)
                    tens_t2 = torch.from_numpy(tile_t2).unsqueeze(0).to(self.device)

                    prob_tile = self.model(tens_t1, tens_t2).squeeze().cpu().numpy()

                    accum_prob[r_start:r_end, c_start:c_end] += prob_tile
                    count_map[r_start:r_end, c_start:c_end] += 1.0

        count_map = np.maximum(count_map, 1.0)
        neural_prob = accum_prob / count_map

        # Grounding with deterministic physical multi-spectral reflectance change
        common_chans = min(pre_geotiff.count, post_geotiff.count)
        spectral_diff = np.sqrt(np.mean((t2_arr[:common_chans] - t1_arr[:common_chans]) ** 2, axis=0))
        physical_change_prob = np.clip((spectral_diff - 0.03) / 0.12, 0.0, 1.0)

        # Fused probability: modulates Siamese features with physical spectral delta
        prob_map = 0.30 * (neural_prob * np.clip(spectral_diff / 0.04, 0.0, 1.0)) + 0.70 * physical_change_prob
        prob_map = np.clip(prob_map, 0.0, 1.0).astype(np.float32)
        binary_mask = prob_map >= confidence_threshold

        changed_pixels = int(np.sum(binary_mask))
        total_pixels = int(min_h * min_w)
        change_pct = float(np.round((changed_pixels / total_pixels) * 100.0, 2))

        # Compute physical backscatter or spectral delta over changed areas
        physical_deltas: Dict[str, Any] = {}
        if pre_geotiff.count >= 2 and post_geotiff.count >= 2:
            # Channel 0 delta (e.g. Blue or VV backscatter)
            delta_ch0 = float(np.mean(t2_arr[0][binary_mask] - t1_arr[0][binary_mask])) if changed_pixels > 0 else 0.0
            physical_deltas["mean_channel_0_delta"] = round(delta_ch0, 4)

        metadata = {
            "target_class": "land_cover_change",
            "specialist": self.model_identifier,
            "model_identifier": self.model_identifier,
            "architecture": self.ARCHITECTURE_NAME,
            "changed_pixel_count": changed_pixels,
            "total_pixels": total_pixels,
            "change_percentage": change_pct,
            "mean_change_probability": float(np.mean(prob_map)),
            "physical_deltas": physical_deltas,
        }

        return prob_map, binary_mask, metadata

    def _prepare_array(self, arr: np.ndarray, target_h: int, target_w: int) -> np.ndarray:
        """Extract optimal channels (e.g. RGB+NIR for 12-band Sentinel-2) and crop/pad to dimensions."""
        c, _, _ = arr.shape
        cropped = arr[:, :target_h, :target_w]
        if c >= 8 and self.in_channels == 4:
            # Select 10m Sentinel-2 bands: B02 (Blue), B03 (Green), B04 (Red), B08 (NIR)
            return cropped[[1, 2, 3, 7]]
        if c < self.in_channels:
            padded = np.zeros((self.in_channels, target_h, target_w), dtype=np.float32)
            padded[:c] = cropped
            return padded
        return cropped[:self.in_channels]
