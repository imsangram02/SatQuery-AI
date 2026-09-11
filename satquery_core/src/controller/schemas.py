"""
SatQuery AI — Controller Schemas Module
Pydantic v2 data models for user queries, routing classifications, physics verifications, and audit traces.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
import uuid

from pydantic import BaseModel, Field, field_validator


class TaskType(str, Enum):
    """Supported analytical task specializations in the SatQuery AI engine."""
    SINGLE_IMAGE_OPTICAL = "single_image_optical"
    SINGLE_IMAGE_SAR = "single_image_sar"
    CHANGE_DETECTION = "change_detection"
    CROSS_MODAL_FUSION = "cross_modal_fusion"


class SensorModality(str, Enum):
    """Satellite remote-sensing modalities."""
    OPTICAL = "optical"
    SAR = "sar"
    MULTIMODAL = "multimodal"


class BoundingBox(BaseModel):
    """Geographic bounding box in standard WGS84 (EPSG:4326) coordinates."""
    min_lon: float = Field(..., ge=-180.0, le=180.0, description="Westernmost longitude")
    min_lat: float = Field(..., ge=-90.0, le=90.0, description="Southernmost latitude")
    max_lon: float = Field(..., ge=-180.0, le=180.0, description="Easternmost longitude")
    max_lat: float = Field(..., ge=-90.0, le=90.0, description="Northernmost latitude")

    @field_validator("max_lon")
    @classmethod
    def validate_longitude_order(cls, max_lon: float, info) -> float:
        if "min_lon" in info.data and max_lon < info.data["min_lon"]:
            raise ValueError(f"max_lon ({max_lon}) must be >= min_lon ({info.data['min_lon']})")
        return max_lon

    @field_validator("max_lat")
    @classmethod
    def validate_latitude_order(cls, max_lat: float, info) -> float:
        if "min_lat" in info.data and max_lat < info.data["min_lat"]:
            raise ValueError(f"max_lat ({max_lat}) must be >= min_lat ({info.data['min_lat']})")
        return max_lat

    def to_geojson_polygon(self) -> Dict[str, Any]:
        """Generate an RFC 7946 GeoJSON Polygon dictionary."""
        return {
            "type": "Polygon",
            "coordinates": [
                [
                    [self.min_lon, self.min_lat],
                    [self.max_lon, self.min_lat],
                    [self.max_lon, self.max_lat],
                    [self.min_lon, self.max_lat],
                    [self.min_lon, self.min_lat],
                ]
            ],
        }


class RasterInput(BaseModel):
    """Specification of an input GeoTIFF file for reasoning."""
    path: str = Field(..., description="Local file path to GeoTIFF raster")
    modality: Optional[SensorModality] = Field(
        default=None, description="Modality of raster; if omitted, inferred from band profile"
    )
    timestamp: Optional[str] = Field(
        default=None, description="Acquisition ISO-8601 timestamp or label (e.g. 'pre', 'post')"
    )
    band_selection: Optional[List[int]] = Field(
        default=None, description="Optional 1-indexed band channels to slice"
    )


class QueryRequest(BaseModel):
    """Primary user query payload for the SatQuery engine."""
    query_text: str = Field(..., min_length=3, description="Natural language geospatial request")
    primary_raster: RasterInput = Field(..., description="Main observation raster")
    secondary_raster: Optional[RasterInput] = Field(
        default=None, description="Optional secondary raster for change detection or cross-modal fusion"
    )
    roi: Optional[BoundingBox] = Field(
        default=None, description="Optional spatial bounding box filter"
    )
    confidence_threshold: float = Field(
        default=0.50, ge=0.0, le=1.0, description="Minimum confidence for detections"
    )
    enable_physics_verification: bool = Field(
        default=True, description="Whether to cross-check predictions with deterministic physics indices"
    )


class RoutingDecision(BaseModel):
    """Result emitted by the controller router determining downstream execution strategy."""
    task_type: TaskType
    target_specialist: str = Field(..., description="Model identifier in model_registry.yaml")
    required_modalities: List[SensorModality]
    required_physics_indices: List[str] = Field(
        default_factory=list, description="Physics metrics to compute (e.g. ndwi, ndvi, sar_db)"
    )
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    reasoning_rationale: str = Field(
        ..., description="Human-readable rationale for why this routing path was selected"
    )


class PhysicsVerificationResult(BaseModel):
    """Deterministic validation score for an AI specialist detection."""
    index_name: str = Field(..., description="Name of computed physical index (e.g. NDWI, SAR_dB)")
    passed: bool = Field(..., description="True if physical threshold validates neural detection")
    coverage_percentage: float = Field(
        ..., ge=0.0, le=100.0, description="Percentage of detected area satisfying physics bounds"
    )
    mean_value: float = Field(..., description="Mean index value inside detection footprint")
    min_value: float = Field(..., description="Minimum index value inside detection footprint")
    max_value: float = Field(..., description="Maximum index value inside detection footprint")
    discrepancy_note: Optional[str] = Field(
        default=None, description="Warning note if neural output conflicts with physics"
    )


class AuditTrace(BaseModel):
    """Complete diagnostic audit trail of the reasoning lifecycle."""
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    task_type: TaskType
    controller_model: str = Field(
        default="Qwen/Qwen3-VL-7B-Instruct (LoRA: aanandmodi/satquery-qwen3vl-bigearthnet-txt-lora)",
        description="Agentic controller and reasoning decoder model identifier",
    )
    specialist_model: str
    input_shapes: Dict[str, List[int]] = Field(default_factory=dict)
    preprocessing_applied: List[str] = Field(default_factory=list)
    physics_checks: List[PhysicsVerificationResult] = Field(default_factory=list)
    execution_time_ms: float = Field(default=0.0, ge=0.0)
    verdict: str = Field(default="UNVERIFIED", description="VERIFIED, REJECTED, or PARTIAL")


class OutputArtifacts(BaseModel):
    """File storage paths for generated prediction images, vector layers, and reports."""
    input_image_path: Optional[str] = Field(default=None, description="Path where input image was uploaded or read from")
    secondary_image_path: Optional[str] = Field(default=None, description="Path where secondary image was uploaded or read from")
    mask_image_path: Optional[str] = Field(default=None, description="Path where binary prediction mask is saved")
    heatmap_image_path: Optional[str] = Field(default=None, description="Path where probability heatmap is saved")
    overlay_image_path: Optional[str] = Field(default=None, description="Path where visual evidence overlay image is saved")
    geojson_path: Optional[str] = Field(default=None, description="Path where RFC 7946 GeoJSON vector file is saved")
    report_json_path: Optional[str] = Field(default=None, description="Path where structured JSON analysis report is saved")
    report_markdown_path: Optional[str] = Field(default=None, description="Path where formatted Markdown analysis report is saved")


class EngineOutput(BaseModel):
    """Unified response emitted by the master SatQueryEngine."""
    query_text: str
    task_type: TaskType
    summary_text: str
    geojson: Optional[Dict[str, Any]] = Field(
        default=None, description="RFC 7946 GeoJSON FeatureCollection containing vectorized detections"
    )
    statistics: Dict[str, Any] = Field(
        default_factory=dict, description="Quantitative summary (area in hectares, pixel counts, etc.)"
    )
    audit_trace: AuditTrace
    artifacts: Optional[OutputArtifacts] = Field(
        default=None, description="Generated output artifact file paths (masks, heatmaps, overlays, reports)"
    )

