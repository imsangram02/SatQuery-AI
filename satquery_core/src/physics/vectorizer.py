"""
SatQuery AI — Vectorizer Module
Extracts boundaries around detected regions and turns them into standard map shapes (GeoJSON).
"""

from typing import Any, Dict, List
import numpy as np
import cv2


def mask_to_geojson(
    binary_mask: np.ndarray,
    transform: Any,
    crs: str = "EPSG:4326",
    min_contour_area: float = 4.0,
) -> Dict[str, Any]:
    """
    Convert a detected pixel mask into standard map boundary shapes (GeoJSON Polygon).

    Args:
        binary_mask: 2D array where True/1 marks the detected areas.
        transform: Satellite position transform used to convert pixel positions to real-world map coordinates.
        crs: Map coordinate system name (default: EPSG:4326).
        min_contour_area: Minimum pixel area to ignore tiny dots.

    Returns:
        Standard GeoJSON dictionary with polygon coordinates and easy summary counts.
    """
    if not isinstance(binary_mask, np.ndarray) or binary_mask.ndim != 2:
        raise ValueError(f"binary_mask must be a 2D NumPy array, got shape {getattr(binary_mask, 'shape', None)}")

    h, w = binary_mask.shape
    total_pos_pixels = int(np.sum(binary_mask > 0))

    # Extract transform numbers
    try:
        if hasattr(transform, "a") and hasattr(transform, "e"):
            a, b, c = float(transform.a), float(transform.b), float(transform.c)
            d, e, f = float(transform.d), float(transform.e), float(transform.f)
        elif isinstance(transform, (tuple, list)) and len(transform) >= 6:
            a, b, c, d, e, f = [float(transform[i]) for i in range(6)]
        elif isinstance(transform, dict):
            a, b, c = float(transform["a"]), float(transform.get("b", 0.0)), float(transform["c"])
            d, e, f = float(transform.get("d", 0.0)), float(transform["e"]), float(transform["f"])
        else:
            raise TypeError("Unsupported transform format")
    except Exception as exc:
        raise ValueError(f"Failed to read transform for vector boundaries: {exc}") from exc

    def _pixel_to_geo(px: float, py: float) -> List[float]:
        """Map a pixel corner/center to real-world longitude and latitude."""
        x_world = c + (px + 0.5) * a + (py + 0.5) * b
        y_world = f + (px + 0.5) * d + (py + 0.5) * e
        return [round(float(x_world), 6), round(float(y_world), 6)]

    if total_pos_pixels == 0:
        return {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [],
            },
            "properties": {
                "crs": crs,
                "shape_count": 0,
                "total_detected_pixels": 0,
            },
        }

    uint8_mask = (binary_mask > 0).astype(np.uint8) * 255
    contours, _ = cv2.findContours(uint8_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    polygon_rings: List[List[List[float]]] = []
    for cnt in contours:
        if cv2.contourArea(cnt) < min_contour_area:
            continue

        pts = cnt.squeeze(axis=1)
        if pts.ndim != 2 or len(pts) < 3:
            continue

        ring = [_pixel_to_geo(float(p[0]), float(p[1])) for p in pts]
        if ring[0] != ring[-1]:
            ring.append(ring[0])
        polygon_rings.append(ring)

    if not polygon_rings:
        rows, cols = np.where(binary_mask > 0)
        r_min, r_max = int(rows.min()), int(rows.max())
        c_min, c_max = int(cols.min()), int(cols.max())
        fallback_ring = [
            _pixel_to_geo(c_min, r_min),
            _pixel_to_geo(c_max, r_min),
            _pixel_to_geo(c_max, r_max),
            _pixel_to_geo(c_min, r_max),
            _pixel_to_geo(c_min, r_min),
        ]
        polygon_rings.append(fallback_ring)

    if len(polygon_rings) == 1:
        geometry = {
            "type": "Polygon",
            "coordinates": polygon_rings,
        }
    else:
        geometry = {
            "type": "MultiPolygon",
            "coordinates": [[ring] for ring in polygon_rings],
        }

    return {
        "type": "Feature",
        "geometry": geometry,
        "properties": {
            "crs": str(crs),
            "shape_count": len(polygon_rings),
            "total_detected_pixels": total_pos_pixels,
        },
    }
