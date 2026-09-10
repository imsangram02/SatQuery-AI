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
from scipy.ndimage import (
    binary_closing,
    binary_erosion,
    binary_opening,
    distance_transform_edt,
    find_objects,
    label,
)

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
        # Create overlay canvas with vectorized tint array (1000x faster than per-pixel point draw)
        base_img = Image.fromarray(rgb).convert("RGBA")
        overlay_arr = np.zeros((h, w, 4), dtype=np.uint8)
        tint_rgba = (color[0], color[1], color[2], 120)
        overlay_arr[binary_mask] = tint_rgba

        overlay_mask = Image.fromarray(overlay_arr, mode="RGBA")
        blended = Image.alpha_composite(base_img, overlay_mask).convert("RGB")
        draw = ImageDraw.Draw(blended)

        # Extract precise, morphologically filtered bounding boxes
        boxes = cls.extract_bounding_boxes(
            binary_mask=binary_mask,
            label_text=label_text,
            confidence=confidence,
            prob_map=prob_map,
            max_boxes=6,
        )

        # Draw crisp bounding boxes and localized label tags
        for b in boxes:
            cmin, rmin, cmax, rmax = b["pixel_box"]

            # Draw solid bounding rectangle with 3px border
            draw.rectangle([(cmin, rmin), (cmax, rmax)], outline=(color[0], color[1], color[2]), width=3)

            # Draw prominent label badge above box (or inside if near top boundary)
            tag = f" {b['label']} • {b['sector']} "
            tag_w = len(tag) * 7 + 10
            tag_h = 18
            if rmin >= tag_h + 2:
                box_top = rmin - tag_h
                box_bottom = rmin
            else:
                box_top = rmin
                box_bottom = rmin + tag_h

            tag_right = min(w, cmin + tag_w)
            draw.rectangle([(cmin, box_top), (tag_right, box_bottom)], fill=(color[0], color[1], color[2]))
            draw.text((cmin + 3, box_top + 2), tag, fill=(255, 255, 255))

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

    @classmethod
    def extract_bounding_boxes(
        cls,
        binary_mask: np.ndarray,
        label_text: str = "Detection",
        confidence: float = 0.88,
        prob_map: Optional[np.ndarray] = None,
        max_boxes: int = 6,
        min_pixels: int = 120,
    ) -> List[Dict[str, Any]]:
        """
        Extract precise, localized bounding boxes for grounded target regions.
        Applies adaptive core clustering, solidity gating, and IoU/containment suppression
        to prevent oversized canvas-spanning boxes and redundant nested duplicates.
        """
        h, w = binary_mask.shape
        total_pixels = h * w
        pos_pixels = int(np.sum(binary_mask))
        if pos_pixels == 0:
            return []

        # Adaptive minimum pixel threshold (at least min_pixels or 0.03% of scene)
        adaptive_min = max(min_pixels, int(total_pixels * 0.0003))

        # Check if the mask has sprawling high-coverage (> 18% of scene)
        coverage_ratio = pos_pixels / total_pixels
        use_core_clustering = coverage_ratio > 0.18

        # 1. Clean mask with opening / closing
        struct_open = np.ones((3, 3), dtype=bool)
        struct_close = np.ones((3, 3), dtype=bool)
        cleaned = binary_opening(binary_mask, structure=struct_open)
        cleaned = binary_closing(cleaned, structure=struct_close)

        candidate_masks = []

        # Find connected components from cleaned mask
        labeled_mask, num_features = label(cleaned)
        if num_features == 0:
            labeled_mask, num_features = label(binary_mask)
            num_features = int(num_features)

        if num_features > 0:
            component_sizes = np.bincount(labeled_mask.ravel())
            for comp_idx in range(1, num_features + 1):
                cnt = int(component_sizes[comp_idx])
                if cnt < adaptive_min:
                    continue

                comp_mask = (labeled_mask == comp_idx)
                rows = np.any(comp_mask, axis=1)
                cols = np.any(comp_mask, axis=0)
                if not np.any(rows) or not np.any(cols):
                    continue

                box_w = int(np.where(cols)[0][-1] - np.where(cols)[0][0] + 1)
                box_h = int(np.where(rows)[0][-1] - np.where(rows)[0][0] + 1)
                box_area = box_w * box_h

                # If the component is sprawling (covers > 35% of image or box occupies > 60% of both axes),
                # do NOT add this giant bounding box! Instead, decompose it into localized structural clusters.
                if box_area > 0.35 * total_pixels or (box_w > 0.60 * w and box_h > 0.60 * h):
                    eroded = binary_erosion(comp_mask, structure=np.ones((4, 4), dtype=bool), iterations=2)
                    if not np.any(eroded):
                        eroded = binary_erosion(comp_mask, structure=np.ones((3, 3), dtype=bool), iterations=1)
                    labeled_sub, num_sub = label(eroded)
                    if num_sub > 0:
                        sub_sizes = np.bincount(labeled_sub.ravel())
                        for sub_idx in range(1, num_sub + 1):
                            sub_cnt = int(sub_sizes[sub_idx])
                            if sub_cnt >= max(30, adaptive_min // 3):
                                candidate_masks.append(((labeled_sub == sub_idx), sub_cnt))
                    else:
                        candidate_masks.append((comp_mask, cnt))
                else:
                    candidate_masks.append((comp_mask, cnt))

        # Also extract probability density cores if available
        if prob_map is not None:
            pos_probs = prob_map[cleaned] if np.any(cleaned) else prob_map[binary_mask]
            if len(pos_probs) > 0:
                core_thresh = float(np.percentile(pos_probs, 75))
                core_mask = (prob_map >= core_thresh) & cleaned
                core_mask = binary_opening(core_mask, structure=np.ones((3, 3), dtype=bool))
                labeled_core, num_cores = label(core_mask)
                if num_cores > 0:
                    core_sizes = np.bincount(labeled_core.ravel())
                    for c_id in range(1, num_cores + 1):
                        c_cnt = int(core_sizes[c_id])
                        if c_cnt >= max(40, adaptive_min // 2):
                            candidate_masks.append(((labeled_core == c_id), c_cnt))

        if not candidate_masks:
            return []

        color_tuple = cls.get_class_color(label_text)
        hex_color = f"#{color_tuple[0]:02x}{color_tuple[1]:02x}{color_tuple[2]:02x}"

        raw_boxes = []

        for comp_mask, cnt in candidate_masks:
            rows = np.any(comp_mask, axis=1)
            cols = np.any(comp_mask, axis=0)
            if not np.any(rows) or not np.any(cols):
                continue

            row_indices = np.where(rows)[0]
            col_indices = np.where(cols)[0]

            # Robust coordinate percentiles to avoid single-pixel noise tails
            if cnt > 150:
                all_r, all_c = np.where(comp_mask)
                rmin = int(np.percentile(all_r, 1.0))
                rmax = int(np.percentile(all_r, 99.0))
                cmin = int(np.percentile(all_c, 1.0))
                cmax = int(np.percentile(all_c, 99.0))
            else:
                rmin, rmax = int(row_indices[0]), int(row_indices[-1])
                cmin, cmax = int(col_indices[0]), int(col_indices[-1])

            box_w = max(1, cmax - cmin + 1)
            box_h = max(1, rmax - rmin + 1)
            box_area = box_w * box_h

            # Solidity filter: ratio of actual target pixels to bounding box area
            solidity = float(cnt / box_area)

            # Suppress giant sprawling boxes covering > 65% of the scene with low solidity
            if box_area > 0.65 * total_pixels and solidity < 0.35:
                continue

            # Minimum box dimension (must be at least 14x14 pixels)
            if box_w < 14 and box_h < 14:
                continue

            # Compute local per-box confidence
            if prob_map is not None and np.any(comp_mask):
                box_conf = float(np.mean(prob_map[comp_mask]))
            else:
                box_conf = float(confidence)

            # Spatial sector determination
            center_y = (rmin + rmax) / (2.0 * max(1, h))
            center_x = (cmin + cmax) / (2.0 * max(1, w))
            vert = "Northern" if center_y < 0.35 else "Southern" if center_y > 0.65 else "Central"
            horiz = "Western" if center_x < 0.35 else "Eastern" if center_x > 0.65 else "Central"
            sector = f"{vert}-{horiz}" if vert != horiz else vert

            # Estimated hectares (assuming standard 10m pixel = 0.01 ha)
            box_ha = round(cnt * 0.01, 2)

            # Composite ranking score: higher confidence, larger salient mass, higher solidity
            score = box_conf * (cnt ** 0.5) * (0.6 + 0.4 * min(1.0, solidity))

            raw_boxes.append({
                "pixel_box": [cmin, rmin, cmax, rmax],
                "pixel_count": cnt,
                "area_hectares": float(box_ha),
                "box_area": box_area,
                "solidity": round(solidity, 3),
                "sector": sector,
                "confidence": round(box_conf * 100),
                "box_conf_raw": box_conf,
                "score": score,
                "cmin": cmin,
                "rmin": rmin,
                "box_w": box_w,
                "box_h": box_h,
            })

        # Sort raw candidate boxes by score descending
        raw_boxes.sort(key=lambda b: b["score"], reverse=True)

        # 2. Non-Maximum Suppression (IoU + Containment suppression)
        filtered_boxes = []
        for cand in raw_boxes:
            c1_min, r1_min, c1_max, r1_max = cand["pixel_box"]
            a1 = cand["box_area"]
            suppress = False

            for existing in filtered_boxes:
                c2_min, r2_min, c2_max, r2_max = existing["pixel_box"]
                a2 = existing["box_area"]

                # Compute intersection
                inter_w = max(0, min(c1_max, c2_max) - max(c1_min, c2_min) + 1)
                inter_h = max(0, min(r1_max, r2_max) - max(r1_min, r2_min) + 1)
                inter_area = inter_w * inter_h

                if inter_area > 0:
                    iou = inter_area / max(1, (a1 + a2 - inter_area))
                    containment1 = inter_area / max(1, a1)
                    containment2 = inter_area / max(1, a2)

                    # Suppress if high IoU (> 0.35) or if heavily contained (> 0.60 inside existing)
                    if iou > 0.35 or containment1 > 0.60:
                        suppress = True
                        break
                    # If existing box is heavily contained in candidate but candidate has lower score, suppress candidate
                    if containment2 > 0.70:
                        suppress = True
                        break

            if not suppress:
                filtered_boxes.append(cand)
                if len(filtered_boxes) >= max_boxes:
                    break

        # 3. Format final box objects
        final_boxes = []
        for rank, b in enumerate(filtered_boxes, start=1):
            cmin, rmin, cmax, rmax = b["pixel_box"]
            bw = b["box_w"]
            bh = b["box_h"]
            final_boxes.append({
                "id": f"bb-{rank}",
                "label": f"{label_text.title()} ({b['confidence']}%)",
                "sector": b["sector"],
                "pixel_box": [cmin, rmin, cmax, rmax],
                "pixel_count": b["pixel_count"],
                "area_hectares": b["area_hectares"],
                "solidity": b["solidity"],
                "x": round((cmin / w) * 100.0, 1),
                "y": round((rmin / h) * 100.0, 1),
                "width": round((bw / w) * 100.0, 1),
                "height": round((bh / h) * 100.0, 1),
                "color": hex_color,
                "confidence": b["confidence"],
            })

        return final_boxes
