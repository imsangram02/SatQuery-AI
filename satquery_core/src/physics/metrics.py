"""
SatQuery AI — Ground Metrics Calculator
Calculates real-world ground measurements (pixel size, meters, hectares, and square kilometers)
from satellite transform data in easy, clear terms.
"""

from typing import Any, Dict
import math


def calculate_ground_metrics(pixel_count: int, transform: Any) -> Dict[str, Any]:
    """
    Calculate real-world ground size from pixel counts and the satellite's position data.

    Args:
        pixel_count: Number of pixels found in the image.
        transform: Affine position matrix giving the ground width and height per pixel.

    Returns:
        Dictionary containing real-world area in meters, hectares, and square kilometers,
        plus an easy-to-understand comparison for non-experts.
    """
    if pixel_count < 0:
        raise ValueError(f"pixel_count must be non-negative, got {pixel_count}")

    # Extract resolution numbers 'a' (width) and 'e' (height)
    try:
        if hasattr(transform, "a") and hasattr(transform, "e"):
            res_x = float(transform.a)
            res_y = float(transform.e)
            origin_y = float(getattr(transform, "f", 0.0))
        elif isinstance(transform, (tuple, list)) and len(transform) >= 6:
            res_x = float(transform[0])
            res_y = float(transform[4])
            origin_y = float(transform[5])
        elif isinstance(transform, dict):
            res_x = float(transform.get("a", transform.get("x_res", 10.0)))
            res_y = float(transform.get("e", transform.get("y_res", -10.0)))
            origin_y = float(transform.get("f", transform.get("y_origin", 0.0)))
        else:
            raise TypeError(f"Unsupported transform type: {type(transform)}")
    except Exception as exc:
        raise ValueError(f"Could not read resolution from image transform: {exc}") from exc

    dx = abs(res_x)
    dy = abs(res_y)

    # Check if numbers are in geographic degrees (e.g., latitude/longitude where dx < 0.1)
    if dx < 0.1 and dy < 0.1:
        # Convert degrees to real meters on Earth at this latitude
        lat_rad = math.radians(origin_y) if abs(origin_y) <= 90.0 else 0.0
        meters_per_deg_lat = 111132.954 - 559.822 * math.cos(2 * lat_rad) + 1.175 * math.cos(4 * lat_rad)
        meters_per_deg_lon = 111412.84 * math.cos(lat_rad) - 93.5 * math.cos(3 * lat_rad)

        res_x_meters = dx * meters_per_deg_lon
        res_y_meters = dy * meters_per_deg_lat
    else:
        # Already measured in meters
        res_x_meters = dx
        res_y_meters = dy

    pixel_area_sqm = res_x_meters * res_y_meters
    area_sqm = float(pixel_count) * pixel_area_sqm
    area_hectares = area_sqm / 10000.0
    area_sqkm = area_sqm / 1000000.0

    # Friendly size comparison for non-experts (1 standard football pitch is ~0.714 hectares)
    football_fields = round(area_hectares / 0.714, 1)

    return {
        "pixel_count": int(pixel_count),
        "resolution_x_meters": round(res_x_meters, 2),
        "resolution_y_meters": round(res_y_meters, 2),
        "pixel_area_sqm": round(pixel_area_sqm, 2),
        "area_sqm": round(area_sqm, 2),
        "area_hectares": round(area_hectares, 2),
        "area_sqkm": round(area_sqkm, 3),
        "easy_size_comparison": f"about {football_fields:,} football fields",
    }
