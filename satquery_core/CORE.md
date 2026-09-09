# SatQuery AI — Core Engine Documentation & Architecture Ledger (`CORE.md`)

## 1. Executive Summary & Project Purpose
**SatQuery AI** is an offline, high-precision geospatial artificial intelligence reasoning engine designed for Earth observation data, with specialized support for ISRO (e.g., EOS-04, RISAT, Cartosat, Resourcesat) and international partner constellations (Sentinel-1 SAR, Sentinel-2 Optical MSI).

The core engine provides an end-to-end pipeline capable of:
1. Ingesting raw 16-bit multi-spectral optical and dual-pol synthetic aperture radar (SAR) GeoTIFF products.
2. Converting raw digital numbers (DN) to physically calibrated surface reflectance and radar backscatter ($\sigma^0$ in dB).
3. Interpreting multimodal natural language user queries (e.g., flood extent delineation, urban growth, drought monitoring, damage assessment).
4. Routing tasks dynamically to specialized deep-learning backbones (Single-image ConvNeXt-v2, Siamese ResNet-50 change detection, or Cross-modal 14-channel ViT fusion).
5. Grounding neural network inferences with deterministic physical spectral indices (NDWI, MNDWI, NDVI) and SAR backscatter thresholding.
6. Emitting verifiable, geo-referenced analytical outputs (GeoJSON vector geometries, raster masks, and synthesized natural language audit traces).

---

## 2. Directory Structure
```text
satquery_core/
├── CORE.md                       <-- Continuous architecture ledger, physics log & API docs
├── requirements.txt              <-- Production dependencies (Rasterio, GDAL, PyTorch, etc.)
├── configs/
│   ├── spectral_indices.yaml     <-- Band equations, index rules, and verification thresholds
│   └── model_registry.yaml       <-- Neural network backbone architectures & checkpoint configs
├── src/
│   ├── ingestion/
│   │   ├── geotiff_loader.py     <-- 16-bit GeoTIFF reader, CRS preservation, band slicing
│   │   └── preprocessors.py      <-- Reflectance /10000 scaling and SAR linear-to-dB conversion
│   ├── controller/
│   │   ├── schemas.py            <-- Pydantic models for queries, task routes, audit traces
│   │   └── router.py             <-- Heuristic & rule-based multi-modal intent router
│   ├── physics/
│   │   └── indices.py            <-- Deterministic index computing & bbox spatial verification
│   ├── specialists/
│   │   ├── single_image.py       <-- ConvNeXt-v2 visual backbone for S1 / S2 feature extraction
│   │   ├── change_detection.py   <-- ResNet-50 Siamese difference engine for bi-temporal pairs
│   │   └── cross_modal.py        <-- 14-channel ViT Base fusion for joint Optical-SAR reasoning
│   └── engine.py                 <-- Master SatQueryEngine pipeline coordinator
└── test_pipeline.py              <-- End-to-end integration and smoke test suite
```

---

## 3. Engineering & Technical Decisions

### 3.1 Radiometric Precision & 16-Bit Processing
- Optical satellite sensors (Sentinel-2 MSI, Resourcesat-2 LISS-IV) record radiance at 12 to 16 bits per pixel (values spanning 0 to 65535).
- Downscaling raw data directly to 8-bit integers (0–255) leads to severe quantization error and eliminates subtle spectral variations required for index analysis.
- **Decision:** All ingestion pipelines maintain native `float32` internal buffers loaded directly from `uint16` raster rasters.

### 3.2 Reflectance Normalization
- Sentinel-2 Level-2A bottom-of-atmosphere (BOA) surface reflectance is distributed as integer Digital Numbers (DN) scaled by a factor of 10,000.
- **Decision:** Optical preprocessor executes:
  $$\rho_{\lambda} = \frac{\text{DN}_{\lambda}}{10000.0}$$
  Values are clamped to physical bounds $[0.0, 1.0]$ with NoData handling preserving masking flags.

### 3.3 SAR Backscatter Calibration & Decibel Transformation
- Sentinel-1 Ground Range Detected (GRD) amplitude/intensity values exhibit extreme dynamic ranges with high speckle noise.
- Water surfaces exhibit specular reflection away from radar antennas, yielding dark backscatter (low return), while urban structures exhibit double-bounce returns (high return).
- **Decision:** SAR linear intensity ($I = \text{DN}^2$) is converted to sigma-nought ($\sigma^0$) backscatter in decibels:
  $$\sigma^0_{\text{dB}} = 10 \cdot \log_{10}(\max(I, \epsilon))$$
  where $\epsilon = 10^{-7}$ prevents numerical singularity. Typical terrestrial backscatter bounds $[-30\text{ dB}, 0\text{ dB}]$ are enforced.

### 3.4 Coordinate Reference System (CRS) & Spatial Geometry
- Spatial queries must not decouple pixel arrays from geographic references.
- **Decision:** Every raster array retains its affine transformation matrix (`affine.Affine`) and spatial CRS (e.g., EPSG:4326, EPSG:32643 / UTM zones). Vectorization outputs are projected to standard WGS84 (`EPSG:4326`) GeoJSON geometries.

### 3.5 Hybrid Physics-Guided Reasoning
- Neural networks are susceptible to hallucinating features under unfamiliar cloud conditions or speckle.
- **Decision:** AI specialist predictions are validated against deterministic physics layers:
  - Water detections must cross-correlate with high NDWI/MNDWI ($> 0.0$) or low SAR VV/VH backscatter ($< -16\text{ dB}$).
  - Vegetation health detections must cross-correlate with NDVI values.

---

## 4. Mathematical & Physical Formulations

| Index / Metric | Mathematical Definition | Physical Purpose |
| :--- | :--- | :--- |
| **NDVI** (Normalized Difference Vegetation Index) | $\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$ | Distinguishes green chlorophyll absorption from near-infrared cellular scattering. |
| **NDWI** (Normalized Difference Water Index - McFeeters) | $\frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}$ | Highlights open water bodies by leveraging green reflectance and NIR absorption. |
| **MNDWI** (Modified NDWI - Xu) | $\frac{\text{Green} - \text{SWIR1}}{\text{Green} + \text{SWIR1}}$ | Suppresses built-up urban noise and improves turbidity/sediment resilience. |
| **SAR Backscatter** ($\sigma^0_{\text{dB}}$) | $10 \cdot \log_{10}(\text{DN}^2 + \epsilon)$ | Delineates surface roughness, dielectric properties, and flood inundation. |
| **SAR Cross-Ratio** (CR) | $\frac{\sigma^0_{\text{VH}}}{\sigma^0_{\text{VV}}}$ (or $\text{VH}_{\text{dB}} - \text{VV}_{\text{dB}}$) | Sensitive to volume scattering vs. surface scattering (useful for crop canopy structure). |

---

## 5. Development Roadmap & Implementation Ledger

| Step | Target File | Status | Description |
| :---: | :--- | :---: | :--- |
| **0** | `satquery_core/CORE.md` | **Completed** | Master architectural ledger, physics specifications, and system roadmap. |
| **1** | `satquery_core/requirements.txt` | **Completed** | Production runtime dependencies (Rasterio, PyTorch, Pydantic, etc.). |
| **2** | `satquery_core/configs/spectral_indices.yaml` | **Completed** | Index band equations, sensor channel mappings, and verification thresholds. |
| **3** | `satquery_core/configs/model_registry.yaml` | **Completed** | Specialist backbone configurations (ConvNeXt-v2, ResNet-50, ViT 14-ch). |
| **4** | `satquery_core/src/ingestion/geotiff_loader.py` | **Completed** | Robust 16-bit GeoTIFF reader, CRS parsing, and band slicing. |
| **5** | `satquery_core/src/ingestion/preprocessors.py` | **Completed** | Reflectance scaling (/10000) and SAR dB conversion. |
| **6** | `satquery_core/src/controller/schemas.py` | **Completed** | Pydantic schemas for queries, routes, audit logs, and outputs. |
| **7** | `satquery_core/src/controller/router.py` | **Completed** | Intent-based multi-modal query router. |
| **8** | `satquery_core/src/physics/indices.py` | **Completed** | Deterministic spectral/SAR index calculator and spatial bbox checker. |
| **9** | `satquery_core/src/specialists/single_image.py` | **Completed** | Single-scene feature extraction specialist (ConvNeXt-v2). |
| **10** | `satquery_core/src/specialists/change_detection.py` | **Completed** | Bi-temporal Siamese difference specialist (ResNet-50). |
| **11** | `satquery_core/src/specialists/cross_modal.py` | **Completed** | Multimodal 14-channel joint optical-SAR specialist (ViT Base). |
| **12** | `satquery_core/src/engine.py` | **Completed** | Master SatQueryEngine pipeline orchestration and synthesis. |
| **13** | `satquery_core/test_pipeline.py` | **Completed** | End-to-end integration test runner with synthetic GeoTIFF fixtures. |

---

## 6. Component Documentation & Implemented Modules

### 6.1 `satquery_core/requirements.txt`
- **Purpose:** Defines pinned and minimum production-grade Python package dependencies for offline geospatial AI execution.
- **Key Libraries & Roles:**
  - `rasterio` & `affine`: High-performance GDAL-backed raster reading, 16-bit band slicing, NoData identification, and CRS preservation.
  - `shapely` & `geojson`: Planar topological operations, bounding-box checks, polygon intersection, and RFC 7946 GeoJSON export.
  - `torch`, `torchvision`, `timm`: Offline PyTorch execution engine for neural vision backbones (ConvNeXt-v2, ResNet-50 Siamese, ViT).
  - `numpy` & `scipy`: Vectorized multi-spectral band arithmetic, floating-point array transformations, and speckle/morphology filters.
  - `pydantic` & `pydantic-settings`: Enforces strict data models for user queries, routing classifications, and verification traces.
  - `pyyaml`: Configuration ingestion for spectral indices, sensor bands, and neural backbone architectures.
  - `rich` & `tqdm`: Visual execution progress and structured terminal audit output.

### 6.2 `satquery_core/configs/spectral_indices.yaml`
- **Purpose:** Central declarative configuration of sensor band channel assignments, deterministic index formulas, and physical verification bounds.
- **Key Configurations:**
  - **Sensor Channel Maps:** 1-indexed band channels for Sentinel-2 MSI (12 bands), Sentinel-1 C-SAR (VV, VH), ISRO EOS-04 C-SAR (co-pol, cross-pol), and ISRO Resourcesat-2 LISS-IV (Green, Red, NIR).
  - **Formulas & Ranges:** NDVI, NDWI (McFeeters), MNDWI (Xu), and NDBI with mathematical formulations, $\epsilon = 10^{-7}$ division safety, and $[-1.0, 1.0]$ bounds.
  - **Threshold Rules:** Water confirmation ($>0.0$ / $>0.10$), dense vegetation ($>0.50$), and built-up settlement separation ($>0.00$).
  - **SAR Decibel Parameters:** Intensity-to-dB logarithmic transform parameters, specular water boundary ($\sigma^0_{\text{VV}} < -16\text{ dB}$, $\sigma^0_{\text{VH}} < -23\text{ dB}$), urban double-bounce threshold ($\sigma^0_{\text{VV}} > -6\text{ dB}$), and bi-temporal flood delta ($\Delta \le -4\text{ dB}$).

### 6.3 `satquery_core/configs/model_registry.yaml`
- **Purpose:** Central model registry specifying backbone neural network configurations, channel counts, feature dimensions, and normalization constants for offline inference.
- **Key Configurations:**
  - **Single Image Specialists:**
    - `convnextv2_tiny`: Configured for full 12-channel Sentinel-2 optical stacks (768 embed dimension, 8 land-cover classification classes).
    - `convnextv2_nano`: Configured for 2-channel calibrated Sentinel-1 SAR (VV, VH) in decibels (640 embed dimension, 6 radar classes).
  - **Change Detection Specialist:**
    - `siamese_resnet50`: Weight-sharing dual-branch Siamese backbone with `abs_diff_concat` feature difference fusion ($[|F_{t2} - F_{t1}|, F_{t1}, F_{t2}]$) and binary change probability head.
  - **Cross-Modal Fusion Specialist:**
    - `vit_base_patch16_14ch`: 14-channel joint optical-SAR Vision Transformer (12 S2 bands + 2 S1 SAR bands, $16 \times 16$ patch embedding, 768 hidden dimension, 12 attention heads, 12 layers).
  - **Inference Runtime Settings:** Automatic GPU/CPU fallback, 512-pixel sliding window tiling with 64-pixel boundary overlaps.

### 6.4 `satquery_core/src/ingestion/geotiff_loader.py`
- **Purpose:** Production-grade geospatial raster reader supporting real satellite imagery products (Sentinel-2, Sentinel-1, Landsat, ISRO Resourcesat/EOS), single multi-band GeoTIFFs, directory-based band granules (Sentinel-2 SAFE folders), and standard imagery formats with automatic spatial reference synthesis.
- **Key Classes & Methods:**
  - `GeoTIFFData`: Encapsulated dataclass containing `array` (shape $[C, H, W]$ in `float32`), `crs` (`rasterio.crs.CRS`), `transform` (`affine.Affine`), `bounds`, `nodata`, `metadata`, and `band_names`.
  - `GeoTIFFData.get_band(channel_1_indexed)`: Extracts 2D array by 1-indexed satellite band conventions.
  - `GeoTIFFData.get_band_by_name(name)`: Extracts 2D array by standard band designation (e.g., `'B04'`, `'NIR'`, `'VV'`) with fuzzy aliasing heuristics.
  - `GeoTIFFData.pixel_to_spatial(row, col)` & `spatial_to_pixel(x, y)`: Bi-directional coordinate converters between array indices and cartographic coordinates.
  - `GeoTIFFData.to_geojson_polygon()`: Extracts geospatial footprints formatted as RFC 7946 GeoJSON Polygons.
  - `GeoTIFFLoader.load(source, bands, as_float32)`: Ingests real satellite scenes from single GeoTIFF files, directory structures with separate band files, or standard images (`.png`, `.jpg`).
  - `GeoTIFFLoader._load_from_directory(dir_path)`: Scans for individual band files (`B01`..`B12`, `B8A`, `VV`, `VH`), automatically resamples differing resolutions (e.g., 10m vs 20m), and stacks them into a unified multi-band tensor.
  - `GeoTIFFLoader._load_standard_image(path)`: Ingests non-georeferenced images with synthesized cartographic bounds and WGS84 CRS for visual remote sensing workflows.
  - `GeoTIFFLoader.load_window(...)`: Reads spatial sub-tile windows directly from disk, updating affine transforms dynamically for memory-constrained execution.

### 6.5 `satquery_core/src/ingestion/preprocessors.py`
- **Purpose:** Standardizes raw satellite pixel measurements into physically grounded, sensor-independent radiometric units.
- **Key Classes & Methods:**
  - `OpticalPreprocessor.calibrate(array, nodata)`: Scales Sentinel-2 L2A digital numbers ($\rho = \text{DN} / 10000.0$) to $[0.0, 1.0]$ Bottom-of-Atmosphere surface reflectance, masking invalid/NoData pixels and clamping atmospheric atmospheric overcorrections.
  - `SARPreprocessor.calibrate(array)`: Converts radar amplitude/intensity to sigma-nought decibels ($\sigma^0_{\text{dB}} = 10 \log_{10}(\max(I, \epsilon))$) with spatial boxcar speckle suppression filtering and $[-35\text{ dB}, +5\text{ dB}]$ physical bounding.
  - `SARPreprocessor.compute_cross_ratio(vh_db, vv_db)`: Computes the polarimetric cross-ratio $\text{CR}_{\text{dB}} = \text{VH}_{\text{dB}} - \text{VV}_{\text{dB}}$ to assess volume vs. surface scattering.
  - `PreprocessorDispatcher.preprocess(geotiff, modality)`: Auto-detects sensor modality (SAR vs. Optical) based on channel count and dispatches to the corresponding calibrator while maintaining spatial metadata.

### 6.6 `satquery_core/src/controller/schemas.py`
- **Purpose:** Strongly typed Pydantic v2 data models for engine request contracts, routing classifications, physics sanity metrics, and forensic audit logs.
- **Key Schemas & Validations:**
  - `TaskType`: Enum of operations (`SINGLE_IMAGE_OPTICAL`, `SINGLE_IMAGE_SAR`, `CHANGE_DETECTION`, `CROSS_MODAL_FUSION`).
  - `BoundingBox`: Spatial bounds in EPSG:4326 with strict ordering validators (`min_lon <= max_lon`, `min_lat <= max_lat`) and GeoJSON Polygon conversion.
  - `RasterInput` & `QueryRequest`: Contract for multi-temporal / multi-modal input rasters, natural language query text, confidence thresholds, and physics flags.
  - `RoutingDecision`: Controller dispatch plan containing selected deep learning specialist model, required sensor modalities, and designated physics index verification targets.
  - `PhysicsVerificationResult`: Tracks physical sanity metrics (mean, min, max, coverage percentage, discrepancy notes) against neural detections.
  - `AuditTrace`: Complete provenance log with UUID, execution latency, sensor shapes, calibrations applied, and final verification verdict.
  - `EngineOutput`: Standardized envelope with natural language summary text, GeoJSON polygons, and structured audit traces.

### 6.7 `satquery_core/src/controller/router.py`
- **Purpose:** Semantic and heuristic controller that parses natural language query intent, checks raster modality signatures, and routes queries to deep learning specialists and physical verification pipelines.
- **Key Routing Logic:**
  - **Cross-Modal Fusion Path:** Triggered on multi-modal queries (e.g. "fuse S1 and S2", "penetrate clouds") or heterogeneous raster pairs (Optical + SAR) $\rightarrow$ routes to `vit_base_patch16_14ch`.
  - **Change Detection Path:** Triggered on bi-temporal comparison queries ("pre and post", "difference", "damage") or multiple temporal rasters $\rightarrow$ routes to `siamese_resnet50`.
  - **Single SAR Path:** Triggered on radar backscatter queries ("microwave", "decibel", "speckle", "double bounce") or 1-2 channel SAR rasters $\rightarrow$ routes to `convnextv2_s1`.
  - **Single Optical Path:** Default single-scene multi-spectral reasoning $\rightarrow$ routes to `convnextv2_s2`.
  - **Dynamic Physics Index Selection:** Heuristically links query targets (water, agriculture, urban) to deterministic physics checks (`ndwi`, `mndwi`, `ndvi`, `ndbi`, `sar_backscatter_db`).

### 6.8 `satquery_core/src/physics/indices.py`
- **Purpose:** Vectorized pixel-level calculation of optical spectral indices (NDVI, NDWI, MNDWI, NDBI), SAR specular backscatter validation, and spatial geometric bounding box containment verification.
- **Key Functions & Classes:**
  - `compute_normalized_difference(band_a, band_b, epsilon)`: Safe floating-point normalized difference ratio with division guard.
  - `compute_ndvi(nir, red)`: $(NIR - Red) / (NIR + Red)$ for green cellular biomass and chlorophyll absorption.
  - `compute_ndwi(green, nir)`: $(Green - NIR) / (Green + NIR)$ for water body delineation (McFeeters).
  - `compute_mndwi(green, swir1)`: $(Green - SWIR1) / (Green + SWIR1)$ for urban-resilient water detection (Xu).
  - `compute_ndbi(swir1, nir)`: $(SWIR1 - NIR) / (SWIR1 + NIR)$ for urban built-up settlement identification.
  - `PhysicsVerifier.verify_optical_water(...)`: Quantifies physical NDWI coverage inside AI-predicted water masks and flags contradictions.
  - `PhysicsVerifier.verify_optical_vegetation(...)`: Cross-validates predicted vegetation against minimum NDVI chlorophyll thresholds ($0.30$).
  - `PhysicsVerifier.verify_sar_water(...)`: Validates radar flood masks against specular low-backscatter constraints ($\sigma^0_{\text{VV}} \le -16.0\text{ dB}$).
  - `SpatialVerifier.crop_to_bbox(...)` & `check_bbox_intersection(...)`: Performs geometric intersection and affine-calibrated pixel window slicing.

### 6.9 `satquery_core/src/specialists/single_image.py`
- **Purpose:** Single-scene computer vision feature extraction and semantic segmentation engine implementing ConvNeXt-v2 with Global Response Normalization (GRN).
- **Key Architectural Components:**
  - `GlobalResponseNorm (GRN)`: Feature competition mechanism that prevents channel feature collapse in deep multi-spectral representations.
  - `ConvNeXtV2Block`: Inverted bottleneck block with 7x7 depthwise convolutions, GroupNorm, and point-wise expansion.
  - `ConvNeXtV2SpecialistNet`: Fully offline PyTorch neural network accepting arbitrary input channels (12-channel Sentinel-2 optical or 2-channel Sentinel-1/EOS-04 SAR).
  - `SingleImageSpecialist.infer(...)`: Performs overlapping sliding-window inference ($512 \times 512$ tiles with 64-pixel overlap), accumulates soft class probability fields, and generates discrete binary masks along with diagnostic metadata.

### 6.10 `satquery_core/src/specialists/change_detection.py`
- **Purpose:** Bi-temporal change detection specialist using twin weight-sharing ResNet-50 branches and absolute feature difference concatenation.
- **Key Architectural Components:**
  - `SiameseResNet50Backbone`: Dual-branch weight-sharing feature extractor processing baseline ($t_1$) and event ($t_2$) rasters symmetrically.
  - `SiameseChangeDecoder`: Fuses representations using $F_{\Delta} = [|F_{t_2} - F_{t1}|, F_{t1}, F_{t2}]$ with progressive bilinear upsampling and GroupNorm.
  - `SiameseChangeNet`: End-to-end model producing spatial change probability maps $P \in [0.0, 1.0]$.
  - `ChangeDetectionSpecialist.infer(...)`: Automatically coregisters spatial arrays, handles windowed tiling, and computes physical radiometric deltas ($\Delta\text{dB}$ or $\Delta\text{NDVI}$) across detected change zones.

### 6.11 `satquery_core/src/specialists/cross_modal.py`
- **Purpose:** Multimodal 14-channel joint optical-SAR Vision Transformer (ViT-Base) integrating 12 Sentinel-2 BOA reflectance bands with 2 Sentinel-1/EOS-04 SAR decibel channels for cloud-penetrating reasoning.
- **Key Architectural Components:**
  - `PatchEmbed14Ch`: Projects 14-channel input tensors into 768-dimensional token vectors using $16 \times 16$ convolutional patch projection.
  - `TransformerEncoderBlock`: Multi-Head Self-Attention (MHSA) blocks computing all-to-all cross-spectral token dependencies.
  - `ViTSegmentationDecoder`: Progressive deconvolutional decoder restoring token features to native $H \times W$ spatial resolution across 10 complex multi-modal land-cover classes.
  - `CrossModalSpecialist.infer(...)`: Coordinates automatic multi-sensor array harmonization, channel concatenation, and overlapping sliding-tile inference.

### 6.12 `satquery_core/src/engine.py`
- **Purpose:** Central coordinator (`SatQueryEngine`) providing end-to-end orchestration connecting raster ingestion, physics calibration, heuristic routing, neural inference, physical validation, vectorization, and natural language synthesis.
- **Key Methods & Workflows:**
  - `SatQueryEngine.execute_query(request)`: Main pipeline entry point returning a validated `EngineOutput`.
  - `_run_physics_checks(...)`: Evaluates physical index agreement (NDWI, NDVI, SAR specular limits) over candidate predictions and assigns `VERIFIED`, `PARTIAL`, or `REJECTED` verdicts.
  - `_vectorize_mask(...)`: Uses `rasterio.features.shapes` and affine transformation matrices to generate valid RFC 7946 GeoJSON FeatureCollections and computes geographic ground surface area in hectares.
  - `_synthesize_summary(...)`: Synthesizes concise, verifiable diagnostic explanations including area, pixel counts, physics agreement percentages, and forensic trace latencies.

### 6.13 `satquery_core/test_pipeline.py`
- **Purpose:** Comprehensive standalone CLI integration and smoke test suite exercising all 4 operational pathways with synthetic 16-bit GeoTIFF fixtures.
- **Test Scenarios Covered:**
  1. `Single Image Optical`: Sentinel-2 12-channel surface reflectance ingestion $\rightarrow$ ConvNeXt-v2 feature segmentation $\rightarrow$ NDWI physical validation $\rightarrow$ GeoJSON polygon vectorization.
  2. `Single Image SAR`: Sentinel-1 dual-pol calibrated decibels $\rightarrow$ ConvNeXt-v2 S1 radar specialist $\rightarrow$ Specular reflection threshold check ($\sigma^0_{\text{VV}} \le -16\text{ dB}$) $\rightarrow$ Area computation in hectares.
  3. `Bi-Temporal Change Detection`: Dual-temporal Sentinel-2 pair $\rightarrow$ Twin Siamese ResNet-50 $\rightarrow$ Feature difference concatenation $\rightarrow$ Change probability map.
  4. `Cross-Modal Fusion`: Joint Optical (12-ch) + SAR (2-ch) $\rightarrow$ 14-channel tensor assembly $\rightarrow$ Vision Transformer (ViT-Base) multi-head self-attention $\rightarrow$ Natural language audit synthesis.













