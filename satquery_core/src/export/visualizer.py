"""
SatQuery AI — Visual Artifact Renderer
Generates high-resolution binary masks, colorized probability heatmaps,
and visual evidence overlays with bounding boxes, contours, and metric annotations.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import label, find_objects

from satquery_core.src.ingestion.geotiff_loader import GeoTIFFData


class ArtifactVisualizer:
    """
    Renders actual prediction results to disk as publication-ready visual artifacts.
    """

    COLOR_MAP = {
        "water": (0, 180, 255),        # Cyan / Azure
        "cropland": (34, 197, 94),     # Vibrant Green
        "vegetation": (34, 197, 94),   # Vibrant Green
        "urban": (234, 179, 8),        # Amber / Gold
        "change": (239, 68, 68),       # Crimson Red
        "flood": (59, 130, 246),       # Deep Blue
        "default": (168, 85, 247),     # Purple
    }

    @classmethod
    def get_class_color(cls, label_name: str) -> Tuple[int, int, int]:
        """Resolve RGB color tuple for target entity class."""
        lname = label_name.lower().strip()
        for key, color in cls.COLOR_MAP.items():
            if key in lname:
                return color
        return cls.COLOR_MAP["default"]

    @classmethod
    def save_mask(
        cls,
        binary_mask: np.ndarray,
        output_path: Union[str, Path],
    ) -> str:
        """
        Save binary prediction mask as an 8-bit PNG file (255 for detected, 0 for background).
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        mask_uint8 = (binary_mask.astype(np.uint8) * 255)
        img = Image.fromarray(mask_uint8, mode="L")
        img.save(out_path, format="PNG", optimize=True)
        return str(out_path)

    @classmethod
    def save_heatmap(
        cls,
        prob_map: np.ndarray,
        output_path: Union[str, Path],
        title: str = "Probability Heatmap",
        colormap: str = "turbo",
    ) -> str:
        """
        Save normalized probability / confidence heatmap with colorbar scale and percentage coverage.
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        h, w = prob_map.shape
        fig, ax = plt.subplots(figsize=(8, 8), dpi=150)
        im = ax.imshow(prob_map, cmap=colormap, vmin=0.0, vmax=1.0)

        # Style plot
        ax.set_title(title, fontsize=12, fontweight="bold", pad=10)
        ax.axis("off")

        # Colorbar
        cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label("Confidence / Probability Score", fontsize=10)
        cbar.ax.tick_params(labelsize=9)

        plt.tight_layout()
        plt.savefig(out_path, bbox_inches="tight", dpi=150)
        plt.close(fig)
        return str(out_path)

    @classmethod
    def extract_rgb_background(cls, geotiff: GeoTIFFData) -> np.ndarray:
        """
        Extract an authentic 8-bit RGB array representation from multi-spectral or SAR rasters.
        """
        arr = geotiff.array
        channels, height, width = arr.shape

        if channels >= 4:
            # Sentinel-2 style: B04 (Red, ch 4 or 3), B03 (Green, ch 3 or 2), B02 (Blue, ch 2 or 1)
            # Check band names if present
            upper_names = [b.upper() for b in geotiff.band_names]
            def find_idx(candidates: List[str], fallback: int) -> int:
                for c in candidates:
                    for i, name in enumerate(upper_names):
                        if c in name:
                            return i
                return fallback

            r_idx = find_idx(["B04", "B4", "RED"], min(3, channels - 1))
            g_idx = find_idx(["B03", "B3", "GREEN"], min(2, channels - 1))
            b_idx = find_idx(["B02", "B2", "BLUE"], min(1, channels - 1))

            r = arr[r_idx]
            g = arr[g_idx]
            b = arr[b_idx]
        elif channels == 3:
            r, g, b = arr[0], arr[1], arr[2]
        elif channels == 2:
            # SAR VV & VH dual-pol composite
            vv = arr[0]
            vh = arr[1]
            ratio = vv / (vh + 1e-6)
            r, g, b = vv, vh, ratio
        else:
            # Single channel grayscale
            r = g = b = arr[0]

        def stretch(band: np.ndarray) -> np.ndarray:
            p2, p98 = np.percentile(band, (2, 98))
            if p98 > p2:
                norm = np.clip((band - p2) / (p98 - p2), 0.0, 1.0)
            else:
                norm = np.zeros_like(band, dtype=np.float32)
            return (norm * 255.0).astype(np.uint8)

        rgb = np.stack([stretch(r), stretch(g), stretch(b)], axis=-1)
        return rgb

    @classmethod
    def save_overlay(
        cls,
        primary_geotiff: GeoTIFFData,
        binary_mask: np.ndarray,
        prob_map: np.ndarray,
        output_path: Union[str, Path],
        label_text: str = "Detection",
        confidence: float = 0.50,
        area_ha: float = 0.0,
        coverage_pct: float = 0.0,
    ) -> str:
        """
        Render authentic visual evidence overlay combining raw satellite imagery,
        tinted detection regions, boundary outlines, bounding boxes, and diagnostic metadata banner.
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        rgb = cls.extract_rgb_background(primary_geotiff)
        h, w, _ = rgb.shape

        color = cls.get_class_color(label_text)

        # Create overlay canvas
        base_img = Image.fromarray(rgb).convert("RGBA")
        overlay_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw_overlay = ImageDraw.Draw(overlay_mask)

        # Draw tinted pixels on detection regions
        tint_rgba = (color[0], color[1], color[2], 110)
        mask_pixels = np.argwhere(binary_mask)
        for r, c in mask_pixels:
            draw_overlay.point((c, r), fill=tint_rgba)

        blended = Image.alpha_composite(base_img, overlay_mask).convert("RGB")
        draw = ImageDraw.Draw(blended)

        # Find connected components to draw bounding boxes and tags
        labeled_mask, num_features = label(binary_mask)
        slices = find_objects(labeled_mask)

        # Draw up to top 5 prominent detection bounding boxes
        box_count = 0
        for i, sl in enumerate(slices):
            if sl is None:
                continue
            r_slice, c_slice = sl
            box_area = (r_slice.stop - r_slice.start) * (c_slice.stop - c_slice.start)
            if box_area < 25:  # filter tiny noise
                continue

            # Bounding box coordinates: (x0, y0, x1, y1)
            x0, y0 = c_slice.start, r_slice.start
            x1, y1 = c_slice.stop, r_slice.stop

            draw.rectangle([(x0, y0), (x1, y1)], outline=(color[0], color[1], color[2]), width=2)

            box_count += 1
            if box_count <= 4:
                tag = f"{label_text.upper()}"
                draw.rectangle([(x0, max(0, y0 - 16)), (x0 + len(tag) * 8 + 10, y0)], fill=(color[0], color[1], color[2]))
                draw.text((x0 + 4, max(0, y0 - 15)), tag, fill=(255, 255, 255))

        # Bottom HUD Status Banner
        banner_h = 42
        hud = Image.new("RGBA", (w, banner_h), (15, 23, 42, 220))  # Slate dark
        hud_draw = ImageDraw.Draw(hud)

        hud_text_left = f"SATQUERY AI | CLASS: {label_text.upper()} | EXTENT: {area_ha:.2f} ha ({coverage_pct:.1f}%)"
        hud_text_right = f"CONF: {confidence * 100.0:.1f}% | CRS: {primary_geotiff.crs}"

        hud_draw.text((12, 6), hud_text_left, fill=(255, 255, 255))
        hud_draw.text((12, 22), hud_text_right, fill=(148, 163, 184))

        # Paste HUD banner
        blended_rgba = blended.convert("RGBA")
        blended_rgba.paste(hud, (0, h - banner_h), hud)
        final_img = blended_rgba.convert("RGB")

        final_img.save(out_path, format="PNG", optimize=True)
        return str(out_path)
