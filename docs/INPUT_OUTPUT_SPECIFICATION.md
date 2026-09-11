# SatQuery AI — Input/Output Specification & System Architecture
**SIH Problem ID:** SIH26167 | **Organization:** ISRO / Space Applications Centre (SAC)  
**Reference Document:** `Detailed Description SIH26167 ISRO.pdf`  
**Governing Standard:** Official ISRO SIH26167 Remote-Sensing Agentic Specification  

---

## 1. System Input Specification

According to the official ISRO specification, SatQuery AI accepts three distinct input image configurations and two primary data format classes.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 USER INPUT INTERFACE                   │
                  │   Natural Language Query + Satellite Observation(s)   │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
         ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
         │    Single Image     │   │   Bi-temporal Pair  │   │  Cross-Modal Pair   │
         │ Optical/MS or SAR   │   │  Pre + Post Images  │   │   Optical + SAR     │
         │ (Caption, VQA, BBox)│   │ (Change, Delta VQA) │   │ (Cloud Penetration) │
         └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

### 1.1. Defined Input Scopes

| Input Scope | Configuration | Sensor Modalities Allowed | Target Tasks Supported |
| :--- | :--- | :--- | :--- |
| **Single Image** | Exactly 1 satellite image | Optical / Multispectral (e.g., Sentinel-2, Cartosat-2S) **OR** SAR (e.g., Sentinel-1, RISAT) | Image captioning, Visual Question Answering (VQA), Text-guided region grounding / bounding segmentation. |
| **Bi-temporal Pair** | 2 spatially corresponding images | Optical + Optical (Pre/Post) **OR** SAR + SAR (Pre/Post) acquired at dates $T_1$ and $T_2$ | Land-cover change detection, change description, change-based Visual Question Answering (CDVQA), spatial change mapping. |
| **Cross-Modal Pair** | 2 co-registered images | Co-registered Optical/Multispectral + Synthetic Aperture Radar (SAR) of the same geographic area | Joint complementary feature extraction, all-weather cloud-penetrating water/urban mapping, multi-sensor synergy. |

### 1.2. Supported File Formats & Compatibility Rules

1. **Geospatial Primary Formats (Mandatory for Operational Imagery):**
   - **GeoTIFF (`.tif`, `.tiff`):** Standard for georeferenced raster data. Must contain valid spatial geotransforms (Affine coordinates), projection CRS (e.g., `EPSG:4326` or UTM projections), and valid NoData masks where applicable.
   - **Multi-Band Stacks:**
     - Sentinel-2 Level-2A: 12 Bottom-of-Atmosphere spectral bands (B01 through B12).
     - Cartosat-2S: High-resolution Panchromatic (0.65m) and 4-band Multispectral (2.0m).
     - Sentinel-1 / RISAT: 2-band dual-polarization (VV + VH or HH + HV) in amplitude, intensity, or decibel ($\text{dB}$) scale.

2. **Public Benchmark Formats (Permitted Exception):**
   - **Standard Image Files (`.png`, `.jpg`, `.jpeg`):** Accepted **strictly and only** when evaluating against prescribed public benchmark datasets (`VRSBench`, `RSVQA`, `CDVQA`, `BigEarthNet`).

### 1.3. Automated Input Compatibility Verification

Before execution, the system controller executes automated validation:
- **Spatial Alignment:** Verifies that image dimensions $(H \times W)$ and bounding extents match for paired inputs; automatically resamples or crops minor pixel offsets using nearest-neighbor/bilinear interpolation.
- **Modality Verification:** Inspects spectral band distributions to determine whether an image is multispectral optical, true-color RGB, or single/dual-polarization radar.
- **Radiometric Normalization:** Dynamically detects dynamic ranges (8-bit integer $[0, 255]$, 16-bit DN $[0, 10000]$, or floating-point reflectance/dB backscatter) and normalizes them into standard specialist tensor ranges.

---

## 2. Natural Language Query Specification

SatQuery AI interprets natural-language user queries without requiring the user to specify GIS parameters, band math indices, or model selection.

### 2.1. Representative Queries (Prescribed by ISRO Specification)

The controller routes and answers the 5 canonical query paradigms defined in the specification:

| Query Type | Prescribed Representative Query | Target Specialist | Output Required |
| :--- | :--- | :--- | :--- |
| **Scene Description** | *"Describe the land-cover and major objects visible in this image."* | `SingleImageSpecialist` | Comprehensive scene captioning, land-cover percentages, and dominant objects. |
| **Region Grounding** | *"Highlight the water body referred to in the query."* | `SingleImageSpecialist` | Binary mask, heatmap, visual overlay, and vector boundaries isolating the target feature. |
| **Change Detection** | *"What changed between these two dates, and where did the change occur?"* | `ChangeDetectionSpecialist` | Spatial change mask, geographic coordinates of change regions, and area in hectares. |
| **Cross-Modal Fusion** | *"Use the optical and SAR images together to identify built-up and water-covered regions."* | `CrossModalSpecialist` | Multi-sensor fused segmentation combining optical absorption with microwave backscatter. |
| **Change-Based VQA** | *"Has the built-up area increased, decreased, or remained unchanged?"* | `ChangeDetectionSpecialist` | Direct categorical answer (`INCREASED` / `DECREASED` / `UNCHANGED`) + quantified delta. |

---

## 3. System Output Specification

Every execution of SatQuery AI produces an **evidence-grounded output bundle** comprising observable execution traces, visual evidence, structured vector layers, and downloadable forensic reports.

```
                           SATQUERY AI EXECUTION
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│ Observable Trace  │      │  Visual Evidence  │      │ Forensic Reports  │
│ • Selected Task   │      │ • Binary Mask     │      │ • Markdown Report │
│ • Model Backbone  │      │ • Conf Heatmap    │      │ • JSON Audit File │
│ • Latency (ms)    │      │ • Visual Overlay  │      │ • GeoJSON Vectors │
│ • Physics Check   │      │ • RFC 7946 Vector │      │ • Text Answer     │
└───────────────────┘      └───────────────────┘      └───────────────────┘
```

### 3.1. Observable Execution Summary (Evaluation Standard)

> [!IMPORTANT]
> **ISRO Specification Rule:** *"The controller may perform internal task planning; however, only the observable execution trace, including the selected task, models or tools, permitted parameters, and outputs will be evaluated. Internal reasoning text is neither required nor evaluated."*

The execution summary emitted by the system contains:
1. **Selected Task:** e.g., `change_detection`, `cross_modal_fusion`, or `single_image_grounding`.
2. **Selected Specialist Model / Tool:** e.g., `siamese_change_detection` (ResNet-50 dual-branch), `vit_base_patch16_14ch` (Vision Transformer), or `single_image_spectral`.
3. **Execution Latency:** Measured wall-clock inference and verification runtime in milliseconds ($ms$).
4. **Mean Confidence Estimation:** Probability percentage aggregated across detected regions.
5. **Deterministic Physics Verdict:** `🟢 VERIFIED` (Passed all radiometric and radar backscatter constraints) or `⚠️ FLAGGED`.

### 3.2. Evidence-Grounded Spatial Outputs

All generated visual artifacts are stored under `data/outputs/`:

| Output Deliverable | Format | File Directory | Description |
| :--- | :--- | :--- | :--- |
| **Binary Segmentation Mask** | PNG (8-bit grayscale) | `data/outputs/masks/` | Pixel values: $255$ for target detection, $0$ for background. |
| **Probability Heatmap** | PNG (RGB Inferno/Viridis) | `data/outputs/heatmaps/` | Visual gradient showing confidence from $0.0$ (dark blue) to $1.0$ (bright yellow). |
| **Visual Overlay Composite** | PNG (RGBA Alpha Blended) | `data/outputs/overlays/` | Semi-transparent highlight ($35\%$ alpha) superimposed directly on original satellite image. |
| **Vector Geometry Layer** | RFC 7946 GeoJSON | `data/outputs/geojson/` | Polygon features with real-world CRS coordinates, bounding boxes, and perimeter statistics. |

### 3.3. Textual & Analytical Deliverables

1. **Direct Query Response / Natural Language Synthesis:**
   - **Spatial & Semantic Findings:** Quantitative summary of detected targets, area in hectares, and percentage of overall scene coverage.
   - **Morphological Layout:** Spatial distribution, continuity of contours, and orientation.
   - **Radiometric & Microwave Evidence:** Confirmation of spectral index values (NDWI, NDVI, MNDWI) and SAR backscatter bounds ($\text{dB}$).
   - **Categorical Answer (for CDVQA):** Clear categorical statement (`INCREASED`, `DECREASED`, or `UNCHANGED`).

2. **Downloadable Forensic Reports:**
   - **JSON Report (`pred_<id>_report.json`):** Complete machine-readable payload containing input metadata, execution trace, pixel counts, area metrics, physics verification arrays, and GeoJSON features.
   - **Markdown Report (`pred_<id>_report.md`):** Executive-ready formatted document with Markdown tables, summary sections, and clickable links to generated assets.

---

## 4. Evaluation & Benchmark Compliance

To fulfill the ISRO/SAC judging criteria, SatQuery AI adheres to the following public benchmarks and institutional dataset protocols:

### 4.1. Public Remote-Sensing Benchmarks

- **BigEarthNet (`BigEarthNet.txt`):** Multispectral (Sentinel-2) and SAR (Sentinel-1) multimodal dataset used for remote-sensing domain adaptation and multi-label feature representation.
- **RSVQA (Remote Sensing Visual Question Answering):** Used to evaluate single-image VQA on low-resolution ($10\text{m}$) and high-resolution ($1\text{m}$) optical imagery.
- **VRSBench:** Used to evaluate high-resolution satellite image captioning (BLEU-4, METEOR, ROUGE-L, CIDEr) and text-guided visual grounding (mean Intersection-over-Union, mIoU).
- **CDVQA (Change Detection Visual Question Answering):** Used to evaluate bi-temporal change detection, change localization, and change-based question answering.

### 4.2. ISRO / SAC Official Evaluation Set

The evaluation dataset provided by ISRO/SAC during judging comprises:
- **Cartosat-2S Optical Imagery:** High-resolution optical data requiring sub-meter feature delineation.
- **RISAT-1 / RISAT-1A SAR Imagery:** C-band Synthetic Aperture Radar data requiring speckle filtering, terrain correction, and microwave backscatter analysis.
- **Co-Registration:** Pre-georeferenced optical–SAR pairs evaluated against reference answers, class labels, bounding boxes, and ground-truth segmentation masks.
