"""
SatQuery AI — Controller Router Module
Rule-based and heuristic intent routing for Optical (S2), SAR (S1), Change Detection, and Cross-Modal Fusion.
"""

import re
from typing import List, Optional, Set, Tuple

from satquery_core.src.controller.schemas import (
    QueryRequest,
    RasterInput,
    RoutingDecision,
    SensorModality,
    TaskType,
)


class QueryRouter:
    """
    Intelligent routing controller that evaluates user prompt intent and available raster modalities
    to select the optimal deep learning specialist backbone and relevant physics verification targets.
    """

    # Keyword lexicons for semantic intent extraction
    CHANGE_KEYWORDS: Set[str] = {
        "change", "changed", "difference", "compare", "comparison", "temporal",
        "before", "after", "pre", "post", "bitemporal", "growth", "expansion",
        "destruction", "loss", "deforestation", "damage", "receded", "disaster",
    }

    FUSION_KEYWORDS: Set[str] = {
        "fuse", "fusion", "cross-modal", "cross modal", "joint", "combined",
        "optical and sar", "sar and optical", "s1 and s2", "s2 and s1",
        "cloud penetration", "all-weather", "multisensor", "multimodal",
    }

    SAR_KEYWORDS: Set[str] = {
        "sar", "radar", "microwave", "sentinel-1", "s1", "eos-04", "risat",
        "backscatter", "decibel", "db", "vv", "vh", "polarization", "cross-ratio",
        "double bounce", "double-bounce", "flood water",
    }

    WATER_KEYWORDS: Set[str] = {
        "water", "flood", "inundation", "lake", "river", "reservoir", "wetland",
        "ndwi", "mndwi", "ponding", "submerged", "drowned",
    }

    VEGETATION_KEYWORDS: Set[str] = {
        "vegetation", "crop", "forest", "tree", "canopy", "agriculture",
        "ndvi", "chlorophyll", "greenery", "pasture", "biomass", "farming",
    }

    URBAN_KEYWORDS: Set[str] = {
        "urban", "building", "structure", "city", "built-up", "concrete",
        "settlement", "ndbi", "double-bounce", "infrastructure",
    }

    def __init__(self) -> None:
        pass

    def route(self, request: QueryRequest) -> RoutingDecision:
        """
        Analyze the incoming QueryRequest and determine the specialist task route.

        Args:
            request: Validated QueryRequest instance.

        Returns:
            RoutingDecision specifying the target neural backbone, required modalities,
            and deterministic physics sanity targets.
        """
        query_lower = request.query_text.lower()
        tokens = set(re.findall(r"\b[a-z0-9\-]+\b", query_lower))

        has_secondary = request.secondary_raster is not None
        primary_modality = self._resolve_modality(request.primary_raster)
        secondary_modality = (
            self._resolve_modality(request.secondary_raster) if has_secondary else None
        )

        # ----------------------------------------------------------------------
        # Case 1: Cross-Modal Fusion
        # Triggered when both Optical and SAR rasters are provided, or explicit fusion intent
        # ----------------------------------------------------------------------
        is_explicit_fusion = bool(tokens & self.FUSION_KEYWORDS) or any(
            phrase in query_lower for phrase in ["optical and sar", "sar and optical", "s1 and s2"]
        )
        has_heterogeneous_pair = (
            has_secondary
            and primary_modality is not None
            and secondary_modality is not None
            and primary_modality != secondary_modality
        )

        if is_explicit_fusion or has_heterogeneous_pair:
            physics_targets = self._select_physics_indices(tokens, is_sar_capable=True)
            return RoutingDecision(
                task_type=TaskType.CROSS_MODAL_FUSION,
                target_specialist="cross_modal_fusion",
                required_modalities=[SensorModality.OPTICAL, SensorModality.SAR],
                required_physics_indices=physics_targets,
                confidence=0.95,
                reasoning_rationale=(
                    "Query requires joint Optical-SAR reasoning. Routed to ViT-Base 14-channel "
                    "backbone for complementary cloud-penetrating radar backscatter and multi-spectral indices."
                ),
            )

        # ----------------------------------------------------------------------
        # Case 2: Change Detection
        # Triggered when two temporal scenes are present or change keywords dominate
        # ----------------------------------------------------------------------
        is_change_query = bool(tokens & self.CHANGE_KEYWORDS) or any(
            phrase in query_lower for phrase in ["before and after", "pre and post", "between dates"]
        )

        if has_secondary or is_change_query:
            target_mod = primary_modality or SensorModality.OPTICAL
            physics_targets = self._select_physics_indices(tokens, is_sar_capable=(target_mod == SensorModality.SAR))
            return RoutingDecision(
                task_type=TaskType.CHANGE_DETECTION,
                target_specialist="siamese_change_detection",
                required_modalities=[target_mod],
                required_physics_indices=physics_targets,
                confidence=0.90 if has_secondary else 0.75,
                reasoning_rationale=(
                    "Identified bi-temporal comparison intent. Routed to Siamese ResNet-50 "
                    "feature difference extractor for land-cover change delineation."
                ),
            )

        # ----------------------------------------------------------------------
        # Case 3: Single Image SAR
        # Triggered when primary raster is SAR or query strictly concerns radar backscatter
        # ----------------------------------------------------------------------
        is_sar_intent = (primary_modality == SensorModality.SAR) or bool(tokens & self.SAR_KEYWORDS)

        if is_sar_intent:
            physics_targets = ["sar_backscatter_db"]
            if tokens & self.WATER_KEYWORDS:
                physics_targets.append("sar_water_threshold_db")
            if tokens & self.URBAN_KEYWORDS:
                physics_targets.append("sar_urban_threshold_db")

            return RoutingDecision(
                task_type=TaskType.SINGLE_IMAGE_SAR,
                target_specialist="single_image_s1",
                required_modalities=[SensorModality.SAR],
                required_physics_indices=physics_targets,
                confidence=0.92,
                reasoning_rationale=(
                    "Identified SAR radar observation. Routed to ConvNeXt-v2 S1 specialist "
                    "using dual-polarization (VV/VH) backscatter and speckle-filtered decibel calibration."
                ),
            )

        # ----------------------------------------------------------------------
        # Case 4: Single Image Optical (Default)
        # Multispectral Sentinel-2 or ISRO LISS-IV optical scene
        # ----------------------------------------------------------------------
        physics_targets = self._select_physics_indices(tokens, is_sar_capable=False)
        return RoutingDecision(
            task_type=TaskType.SINGLE_IMAGE_OPTICAL,
            target_specialist="single_image_s2",
            required_modalities=[SensorModality.OPTICAL],
            required_physics_indices=physics_targets,
            confidence=0.90,
            reasoning_rationale=(
                "Identified single-scene optical task. Routed to ConvNeXt-v2 S2 specialist "
                "with Bottom-of-Atmosphere surface reflectance scaling and spectral index verification."
            ),
        )

    def _resolve_modality(self, raster: Optional[RasterInput]) -> Optional[SensorModality]:
        """Infer modality from explicit field or file naming conventions."""
        if raster is None:
            return None
        if raster.modality is not None:
            return raster.modality

        # Check path hints
        path_lower = raster.path.lower()
        if any(marker in path_lower for marker in ["s1", "sar", "grd", "vv", "vh", "eos04", "risat"]):
            return SensorModality.SAR
        if any(marker in path_lower for marker in ["s2", "msi", "b0", "liss", "optical"]):
            return SensorModality.OPTICAL

        return None

    def _select_physics_indices(self, tokens: Set[str], is_sar_capable: bool) -> List[str]:
        """Select applicable deterministic physics verification metrics based on intent."""
        indices: List[str] = []

        if tokens & self.WATER_KEYWORDS:
            indices.extend(["ndwi", "mndwi"])
            if is_sar_capable:
                indices.append("sar_water_threshold_db")

        if tokens & self.VEGETATION_KEYWORDS:
            indices.append("ndvi")

        if tokens & self.URBAN_KEYWORDS:
            indices.append("ndbi")
            if is_sar_capable:
                indices.append("sar_urban_threshold_db")

        # Default to NDWI and NDVI if no specific thematic domain is singled out
        if not indices:
            indices = ["ndwi", "ndvi"]

        return list(dict.fromkeys(indices))  # Preserves order without duplicates
