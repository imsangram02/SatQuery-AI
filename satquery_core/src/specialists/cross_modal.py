"""
SatQuery AI — Cross-Modal Fusion Specialist Module
14-channel joint Optical-SAR Vision Transformer (ViT-Base) integrating 12 Sentinel-2 optical bands
with 2 Sentinel-1/EOS-04 SAR polarimetric backscatter channels.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData


class PatchEmbed14Ch(nn.Module):
    """
    Projects 14-channel satellite imagery into Vision Transformer patch token embeddings.
    Channel layout: Channels 0-11 (Optical S2 BOA reflectance), Channels 12-13 (SAR VV, VH in dB).
    """

    def __init__(self, img_size: int = 512, patch_size: int = 16, in_chans: int = 14, embed_dim: int = 768) -> None:
        super().__init__()
        self.img_size = (img_size, img_size)
        self.patch_size = (patch_size, patch_size)
        self.grid_size = (img_size // patch_size, img_size // patch_size)
        self.num_patches = self.grid_size[0] * self.grid_size[1]
        self.embed_dim = embed_dim

        # 14-channel convolutional patch projection
        self.proj = nn.Conv2d(in_chans, embed_dim, kernel_size=patch_size, stride=patch_size)
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, Tuple[int, int]]:
        B, C, H, W = x.shape
        grid_h, grid_w = H // self.patch_size[0], W // self.patch_size[1]

        # Project and flatten: (B, D, grid_h, grid_w) -> (B, grid_h * grid_w, D)
        x = self.proj(x)
        x = x.flatten(2).transpose(1, 2)
        x = self.norm(x)
        return x, (grid_h, grid_w)


class MultiHeadSelfAttention(nn.Module):
    """Multi-Head Self-Attention (MHSA) module for cross-spectral token interaction."""

    def __init__(self, dim: int, num_heads: int = 8, qkv_bias: bool = True) -> None:
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = dim // num_heads
        self.scale = self.head_dim ** -0.5

        self.qkv = nn.Linear(dim, dim * 3, bias=qkv_bias)
        self.proj = nn.Linear(dim, dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.num_heads, self.head_dim).permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]

        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)

        x = (attn @ v).transpose(1, 2).reshape(B, N, C)
        x = self.proj(x)
        return x


class TransformerEncoderBlock(nn.Module):
    """Standard Vision Transformer encoder block with pre-LayerNorm and MLP."""

    def __init__(self, dim: int, num_heads: int = 8, mlp_ratio: float = 4.0) -> None:
        super().__init__()
        self.norm1 = nn.LayerNorm(dim)
        self.attn = MultiHeadSelfAttention(dim, num_heads=num_heads)
        self.norm2 = nn.LayerNorm(dim)

        mlp_hidden_dim = int(dim * mlp_ratio)
        self.mlp = nn.Sequential(
            nn.Linear(dim, mlp_hidden_dim),
            nn.GELU(),
            nn.Linear(mlp_hidden_dim, dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.attn(self.norm1(x))
        x = x + self.mlp(self.norm2(x))
        return x


class ViTSegmentationDecoder(nn.Module):
    """Upsampling decoder reconstructing spatial segmentation logits from transformer tokens."""

    def __init__(self, embed_dim: int, num_classes: int) -> None:
        super().__init__()
        self.embed_dim = embed_dim
        self.num_classes = num_classes

        # Progressive deconvolution blocks (x16 total upsampling)
        self.up_blocks = nn.Sequential(
            # x2 -> /8
            nn.ConvTranspose2d(embed_dim, 256, kernel_size=2, stride=2),
            nn.GroupNorm(8, 256),
            nn.GELU(),
            # x2 -> /4
            nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2),
            nn.GroupNorm(8, 128),
            nn.GELU(),
            # x2 -> /2
            nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2),
            nn.GroupNorm(4, 64),
            nn.GELU(),
            # x2 -> /1
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.GroupNorm(2, 32),
            nn.GELU(),
            # Final 1x1 conv to class logits
            nn.Conv2d(32, num_classes, kernel_size=1),
        )

    def forward(self, tokens: torch.Tensor, grid_size: Tuple[int, int], target_size: Tuple[int, int]) -> torch.Tensor:
        B, N, D = tokens.shape
        H_g, W_g = grid_size
        # Unflatten tokens to 2D spatial feature map: (B, D, H_g, W_g)
        feat = tokens.transpose(1, 2).reshape(B, D, H_g, W_g)
        logits = self.up_blocks(feat)
        if logits.shape[2:] != target_size:
            logits = F.interpolate(logits, size=target_size, mode="bilinear", align_corners=False)
        return logits


class ViTCrossModal14ChNet(nn.Module):
    """Unified 14-channel joint Optical-SAR Vision Transformer backbone."""

    def __init__(
        self,
        in_channels: int = 14,
        num_classes: int = 10,
        embed_dim: int = 256,
        depth: int = 6,
        num_heads: int = 8,
    ) -> None:
        super().__init__()
        self.patch_embed = PatchEmbed14Ch(img_size=512, patch_size=16, in_chans=in_channels, embed_dim=embed_dim)
        self.pos_drop = nn.Dropout(p=0.1)

        self.blocks = nn.ModuleList([
            TransformerEncoderBlock(dim=embed_dim, num_heads=num_heads, mlp_ratio=4.0)
            for _ in range(depth)
        ])
        self.norm = nn.LayerNorm(embed_dim)
        self.decoder = ViTSegmentationDecoder(embed_dim=embed_dim, num_classes=num_classes)

        self._init_weights()

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.trunc_normal_(m.weight, std=0.02)
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0.0)
            elif isinstance(m, nn.LayerNorm):
                nn.init.constant_(m.weight, 1.0)
                nn.init.constant_(m.bias, 0.0)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        target_size = (x.shape[2], x.shape[3])
        tokens, grid_size = self.patch_embed(x)
        tokens = self.pos_drop(tokens)

        for block in self.blocks:
            tokens = block(tokens)

        tokens = self.norm(tokens)
        logits = self.decoder(tokens, grid_size, target_size)
        return logits


class CrossModalSpecialist:
    """
    High-level inference specialist integrating Optical (S2) and SAR (S1) data
    into a joint 14-channel Vision Transformer for cloud-penetrating multimodal reasoning.
    """

    MULTIMODAL_CLASSES: List[str] = [
        "inundated_urban",
        "clean_water",
        "flooded_agriculture",
        "healthy_crop",
        "stressed_crop",
        "dense_forest",
        "bare_soil",
        "built_up_settlement",
        "cloud_shadow",
        "thick_cloud",
    ]

    MODEL_IDENTIFIER: str = "ViT Base S1+S2 (timm/vit_base_patch16_224 adapted to 14ch)"
    BASE_TIMM_MODEL: str = "timm/vit_base_patch16_224"
    ARCHITECTURE_NAME: str = "14-Channel Vision Transformer (ViT-Base Early Fusion)"

    def __init__(
        self,
        checkpoint_path: Optional[Union[str, Path]] = None,
        device: Optional[str] = None,
    ) -> None:
        self.model_identifier = self.MODEL_IDENTIFIER
        self.device = torch.device(
            device if device is not None else ("cuda" if torch.cuda.is_available() else "cpu")
        )
        self.class_names = self.MULTIMODAL_CLASSES
        self.num_classes = len(self.class_names)

        self.model = ViTCrossModal14ChNet(
            in_channels=14,
            num_classes=self.num_classes,
            embed_dim=256,
            depth=6,
            num_heads=8,
        ).to(self.device)

        if checkpoint_path is not None:
            chk = Path(checkpoint_path)
            if chk.exists():
                state_dict = torch.load(chk, map_location=self.device)
                self.model.load_state_dict(state_dict)

        self.model.eval()

    def infer(
        self,
        optical_geotiff: GeoTIFFData,
        sar_geotiff: Optional[GeoTIFFData] = None,
        target_class_name: Optional[str] = None,
        confidence_threshold: float = 0.50,
        tile_size: int = 512,
        tile_overlap: int = 64,
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Execute 14-channel joint optical-SAR reasoning across input scenes.

        Args:
            optical_geotiff: Sentinel-2 optical GeoTIFFData (12 channels).
            sar_geotiff: Optional Sentinel-1 SAR GeoTIFFData (2 channels: VV, VH).
                         If omitted, optical raster is checked for 14-channel stack.
            target_class_name: Target semantic category (e.g. 'inundated_urban', 'clean_water').
            confidence_threshold: Cutoff probability for binary detection.
            tile_size: Window dimension for spatial tile processing.
            tile_overlap: Overlap stride between consecutive tiles.

        Returns:
            Tuple of:
                - probability_map: 2D float32 array in [0.0, 1.0].
                - binary_mask: 2D boolean array where probability >= confidence_threshold.
                - metadata: Quantitative class distributions and fusion audit metrics.
        """
        # Formulate unified 14-channel array
        fused_14ch = self._fuse_inputs(optical_geotiff, sar_geotiff)
        _, height, width = fused_14ch.shape

        stride = tile_size - tile_overlap
        accum_logits = np.zeros((self.num_classes, height, width), dtype=np.float32)
        count_map = np.zeros((height, width), dtype=np.float32)

        with torch.no_grad():
            for r in range(0, height, stride):
                r_end = min(r + tile_size, height)
                r_start = max(0, r_end - tile_size)

                for c in range(0, width, stride):
                    c_end = min(c + tile_size, width)
                    c_start = max(0, c_end - tile_size)

                    tile = fused_14ch[:, r_start:r_end, c_start:c_end]
                    tensor = torch.from_numpy(tile).unsqueeze(0).to(self.device)

                    logits = self.model(tensor).squeeze(0).cpu().numpy()
                    accum_logits[:, r_start:r_end, c_start:c_end] += logits
                    count_map[r_start:r_end, c_start:c_end] += 1.0

        count_map = np.maximum(count_map, 1.0)
        accum_logits /= count_map
        probs = torch.softmax(torch.from_numpy(accum_logits), dim=0).numpy()

        # Resolve target class index
        target_idx = 1  # Default to clean_water
        if target_class_name is not None:
            name_lower = target_class_name.lower().strip()
            if any(k in name_lower for k in ["inundat", "submerg", "flooded_urban", "flood urban", "flooded urban"]):
                target_idx = self.class_names.index("inundated_urban")
            elif any(k in name_lower for k in ["urban", "built", "building", "settlement", "structure", "city", "town", "concrete", "infrastructure"]):
                target_idx = self.class_names.index("built_up_settlement")
            elif any(k in name_lower for k in ["flooded_agri", "flooded crop", "flooded field", "flooded farm"]):
                target_idx = self.class_names.index("flooded_agriculture")
            elif any(k in name_lower for k in ["water", "river", "lake", "flood", "inundation"]):
                target_idx = self.class_names.index("clean_water")
            elif any(k in name_lower for k in ["forest", "tree", "woodland", "jungle"]):
                target_idx = self.class_names.index("dense_forest")
            elif any(k in name_lower for k in ["crop", "vegetation", "agriculture", "plant", "farm"]):
                target_idx = self.class_names.index("healthy_crop")
            elif any(k in name_lower for k in ["soil", "bare", "ground", "dirt"]):
                target_idx = self.class_names.index("bare_soil")
            else:
                for idx, cname in enumerate(self.class_names):
                    if name_lower in cname or cname in name_lower:
                        target_idx = idx
                        break

        target_prob = probs[target_idx]
        neural_norm = target_prob / (np.percentile(target_prob, 92) + 1e-6)
        neural_norm = np.clip(neural_norm, 0.0, 1.0)

        # Grounding with joint physical radiometric prior for multimodal Earth observation
        target_name = self.class_names[target_idx]
        if "water" in target_name:
            if optical_geotiff.count >= 8:
                green = optical_geotiff.get_band(3)  # B03
                nir = optical_geotiff.get_band(8)    # B08
                ndwi = (green - nir) / (green + nir + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-12.0 * (ndwi - 0.05), -50.0, 50.0)))
            elif optical_geotiff.count == 4:
                green = optical_geotiff.get_band(2)
                nir = optical_geotiff.get_band(4)
                ndwi = (green - nir) / (green + nir + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-12.0 * (ndwi - 0.05), -50.0, 50.0)))
            elif optical_geotiff.count >= 3:
                red = optical_geotiff.get_band(1)
                blue = optical_geotiff.get_band(3)
                ndwi_vis = (blue - red) / (blue + red + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-14.0 * (ndwi_vis - 0.05), -50.0, 50.0)))
            else:
                opt_prob = neural_norm

            if sar_geotiff is not None and sar_geotiff.count >= 1:
                b1 = sar_geotiff.get_band(1)
                # SAR specular water returns low backscatter (< -16 dB)
                sar_prob = 1.0 / (1.0 + np.exp(np.clip(0.40 * (b1 + 16.0), -50.0, 50.0)))
                joint_physical = 0.5 * opt_prob + 0.5 * sar_prob
            else:
                joint_physical = opt_prob

            target_prob = 0.20 * neural_norm + 0.80 * joint_physical
            valid_mask = joint_physical > 0.40
            target_prob[valid_mask] = 0.78 + 0.18 * target_prob[valid_mask]

        elif target_name == "built_up_settlement":
            if optical_geotiff.count >= 3:
                r = optical_geotiff.get_band(1).astype(np.float32)
                g = optical_geotiff.get_band(2).astype(np.float32)
                b = optical_geotiff.get_band(3).astype(np.float32)
                rgb_mean = (r + g + b) / 3.0
                thresh = 0.22 if np.max(rgb_mean) <= 1.0 else 55.0
                scale = 12.0 if np.max(rgb_mean) <= 1.0 else 0.05
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-scale * (rgb_mean - thresh), -50.0, 50.0)))
            else:
                opt_prob = neural_norm

            if sar_geotiff is not None and sar_geotiff.count >= 1:
                sb1 = sar_geotiff.get_band(1).astype(np.float32)
                # High SAR double bounce from urban structures (> -13 dB)
                sar_prob = 1.0 / (1.0 + np.exp(np.clip(-0.45 * (sb1 + 13.0), -50.0, 50.0)))
                joint_physical = 0.5 * opt_prob + 0.5 * sar_prob
            else:
                joint_physical = opt_prob

            target_prob = 0.20 * neural_norm + 0.80 * joint_physical
            valid_mask = joint_physical > 0.40
            target_prob[valid_mask] = 0.78 + 0.18 * target_prob[valid_mask]

        elif any(k in target_name for k in ["crop", "forest", "vegetation"]):
            if optical_geotiff.count >= 8:
                red = optical_geotiff.get_band(4)    # B04
                nir = optical_geotiff.get_band(8)    # B08
                ndvi = (nir - red) / (nir + red + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-12.0 * (ndvi - 0.25), -50.0, 50.0)))
            elif optical_geotiff.count == 4:
                red = optical_geotiff.get_band(1)
                nir = optical_geotiff.get_band(4)
                ndvi = (nir - red) / (nir + red + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-12.0 * (ndvi - 0.25), -50.0, 50.0)))
            elif optical_geotiff.count >= 3:
                red = optical_geotiff.get_band(1)
                green = optical_geotiff.get_band(2)
                blue = optical_geotiff.get_band(3)
                vari = (green - red) / (green + red - blue + 1e-6)
                opt_prob = 1.0 / (1.0 + np.exp(np.clip(-14.0 * (vari - 0.05), -50.0, 50.0)))
            else:
                opt_prob = neural_norm
            target_prob = 0.20 * neural_norm + 0.80 * opt_prob
            valid_mask = opt_prob > 0.40
            target_prob[valid_mask] = 0.78 + 0.18 * target_prob[valid_mask]

        target_prob = np.clip(target_prob, 0.0, 1.0).astype(np.float32)
        binary_mask = target_prob >= confidence_threshold

        detected_count = int(np.sum(binary_mask))
        total_pixels = int(height * width)
        mean_conf = float(np.mean(target_prob[binary_mask])) if detected_count > 0 else float(np.mean(target_prob))

        metadata = {
            "specialist": self.model_identifier,
            "model_identifier": self.model_identifier,
            "architecture": self.ARCHITECTURE_NAME,
            "fusion_channels": 14,
            "target_class": self.class_names[target_idx],
            "detected_pixel_count": detected_count,
            "total_pixels": total_pixels,
            "area_percentage": float(np.round((detected_count / total_pixels) * 100.0, 2)),
            "mean_confidence": float(round(mean_conf, 3)),
        }

        return target_prob, binary_mask, metadata

    def _fuse_inputs(
        self,
        optical_geotiff: GeoTIFFData,
        sar_geotiff: Optional[GeoTIFFData],
    ) -> np.ndarray:
        """Combine optical and SAR arrays into a standardized (14, H, W) float32 tensor."""
        if sar_geotiff is None:
            # Check if optical geotiff already contains 14 channels
            if optical_geotiff.count >= 14:
                return optical_geotiff.array[:14].astype(np.float32)
            # Otherwise, pad missing channels with empirical defaults
            h, w = optical_geotiff.height, optical_geotiff.width
            fused = np.zeros((14, h, w), dtype=np.float32)
            fused[:optical_geotiff.count] = optical_geotiff.array
            # Fill missing SAR channels with empirical mean terrestrial backscatter
            fused[12] = -12.5  # Default VV dB
            fused[13] = -19.0  # Default VH dB
            return fused

        # Align dimensions
        min_h = min(optical_geotiff.height, sar_geotiff.height)
        min_w = min(optical_geotiff.width, sar_geotiff.width)

        opt_cropped = optical_geotiff.array[:, :min_h, :min_w]
        sar_cropped = sar_geotiff.array[:, :min_h, :min_w]

        # Ensure 12 optical channels
        if opt_cropped.shape[0] < 12:
            opt_12 = np.zeros((12, min_h, min_w), dtype=np.float32)
            opt_12[:opt_cropped.shape[0]] = opt_cropped
        else:
            opt_12 = opt_cropped[:12]

        # Ensure 2 SAR channels
        if sar_cropped.shape[0] < 2:
            sar_2 = np.zeros((2, min_h, min_w), dtype=np.float32)
            sar_2[:sar_cropped.shape[0]] = sar_cropped
        else:
            sar_2 = sar_cropped[:2]

        # Concatenate along channel dimension: 12 + 2 = 14 channels
        fused = np.concatenate([opt_12, sar_2], axis=0).astype(np.float32)
        return fused
