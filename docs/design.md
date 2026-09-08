# Task: Design the Complete SatQuery AI Website UI

Design the complete frontend UI/UX for **SatQuery AI**, including both:

1. A professional **Landing Page**
2. The actual **AI Analysis Dashboard/Application**

This is an advanced remote sensing platform built around the core vision-language specification:

**"SatQuery AI - An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Text Queries."**

The website should look like a professional AI + satellite/remote-sensing platform, not a generic chatbot.

---

# PART 1 — LANDING PAGE

The landing page is the public-facing entry point.

Its purpose is to quickly explain:

* What SatQuery AI is
* What problem it solves
* How it works
* What types of satellite imagery it supports
* What makes it different
* What users can do with it
* How to launch the application

---

## 1. Navbar

Create a clean professional navbar.

Left:

**🛰 SatQuery AI**

Navigation:

* Home
* Features
* How It Works
* Capabilities
* About

Right:

**Launch SatQuery AI**

The navbar should remain clean and minimal.

---

# 2. Hero Section

Create a strong hero section.

Main heading:

> **Ask Questions. Understand Satellite Imagery.**

Supporting text:

> SatQuery AI is an agentic Vision-Language Assistant that understands natural-language queries and analyzes remote-sensing imagery using specialized AI models.

Primary CTA:

**Launch SatQuery AI**

Secondary CTA:

**Explore Capabilities**

---

## Hero Visual

Do NOT use a generic AI robot.

Create a sophisticated visual showing:

* Satellite imagery
* Image layers
* AI analysis
* Geographic regions
* Bounding boxes
* Change detection
* Optical + SAR imagery

The visual should communicate:

```text
Satellite Images
       +
Natural Language Query
       ↓
    AI Agent
       ↓
Specialized Models
       ↓
Evidence-Grounded Result
```

---

# 3. Problem Section

Section heading:

> **Understanding Earth Observation Data Shouldn't Require a GIS Expert.**

Explain the problem simply.

Existing remote-sensing AI systems often focus on individual tasks such as:

* Classification
* Object detection
* VQA
* Captioning
* Change detection

Users often need technical knowledge to choose the correct model and configure the analysis.

SatQuery AI simplifies this through natural-language interaction and agentic model selection.

Use a visual comparison:

```text
Traditional Approach

User
 ↓
Understand dataset
 ↓
Choose model
 ↓
Configure parameters
 ↓
Run analysis
 ↓
Interpret output


SatQuery AI

User
 ↓
Ask a question
 ↓
AI Agent
 ↓
Select appropriate tool
 ↓
Analyze
 ↓
Answer + Evidence
```

---

# 4. Core Features Section

Heading:

> **One Interface. Multiple Remote-Sensing Capabilities.**

Create feature cards for:

### Visual Question Answering

Ask natural-language questions about a satellite image.

Example:

> "What type of land cover is visible?"

---

### Scene Description

Generate meaningful descriptions of remote-sensing scenes.

---

### Visual Grounding

Ask where an object or region is located.

Example:

> "Highlight the water body."

Show a bounding box/highlighted region.

---

### Change Analysis

Compare images from different dates.

Example:

> "What changed between 2022 and 2025?"

Show:

Before → After → Change Map

---

### Optical + SAR Analysis

Combine complementary information from optical and SAR imagery.

Example:

> "Identify built-up and water-covered regions using both images."

---

### Agentic AI Orchestration

The system automatically determines which specialist model/tool should process the request.

This is one of the most important features.

---

# 5. How It Works

Heading:

> **From Question to Insight**

Create a visual 5-step workflow.

```text
01
Upload
Satellite Image(s)

↓

02
Ask
Natural Language Query

↓

03
Understand
AI Agent identifies the task

↓

04
Analyze
Specialized remote-sensing model

↓

05
Explain
Answer + Visual Evidence
```

Add subtle animations between steps.

---

# 6. Supported Image Analysis

Create a visually strong section showing the three major input modes.

### Single Image

```text
Satellite Image
      ↓
VQA / Captioning / Grounding
```

### Bi-Temporal Images

```text
Image A          Image B
2022             2025
   \              /
      ↓
Change Analysis
```

### Optical + SAR

```text
OPTICAL          SAR
   \              /
       ↓
Cross-Modal Analysis
```

Use actual-looking satellite imagery rather than generic stock images.

---

# 7. Agentic Architecture Section

This should be a major section because agentic orchestration is the project's key novelty.

Heading:

> **One Agent. Multiple Specialist Models.**

Show:

```text
                 User Query
                     ↓
              AI Agent / Controller
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
       VQA       Grounding      Change
        │            │            │
        └────────────┼────────────┘
                     ↓
              Result Integrator
                     ↓
          Answer + Visual Evidence
```

Explain:

> Instead of relying on one generic model for every task, SatQuery AI selects the appropriate remote-sensing specialist model based on the user's query and available imagery.

---

# 8. Results Preview

Create a realistic mock analysis interface.

Show:

```text
User Query:

"Has the built-up area increased?"

        ↓

Before Image | After Image | Change Map

        ↓

Analysis Result

Built-up area increased in the selected region.

Confidence
91%

Selected Task
Change-based VQA

Models Used
Change Detection Model
Remote-Sensing VQA Model
```

This section should visually demonstrate what the actual application does.

---

# 9. Evidence-Grounded AI

Heading:

> **Don't Just Get an Answer. See the Evidence.**

Explain that results can include:

* Highlighted regions
* Bounding boxes
* Change maps
* Before/after comparisons
* Confidence information
* Execution summary

Use a satellite-image visual with highlighted regions.

---

# 10. Use Cases

Create cards for:

* Agriculture
* Disaster Management
* Urban Planning
* Forest Monitoring
* Water Resources
* Infrastructure Mapping
* Environmental Monitoring

Keep the section concise and professional.

---

# 11. Technology / Research Section

Show the project's major technical components:

```text
Remote-Sensing VLM
        +
Specialist AI Models
        +
Agentic Orchestration
        +
Multimodal Satellite Imagery
        +
Evidence-Grounded Results
```

Do not overpopulate the landing page with programming-language logos.

Focus on the actual research/technical capabilities.

---

# 12. Final CTA

Create a strong final section.

Heading:

> **Explore Satellite Imagery Through Natural Language.**

Text:

> Upload remote-sensing imagery, ask your question, and let SatQuery AI determine how to analyze it.

Button:

**Launch SatQuery AI →**

---

# PART 2 — APPLICATION / ANALYSIS DASHBOARD

After clicking **Launch SatQuery AI**, navigate to the main application.

This should be a separate dashboard experience.

---

# 13. Dashboard Layout

Use:

```text
┌──────────────┬────────────────────────────────────┐
│              │                                    │
│   SIDEBAR    │          MAIN WORKSPACE            │
│              │                                    │
│ New Analysis │                                    │
│ History      │                                    │
│ Reports      │                                    │
│ Models       │                                    │
│ Settings     │                                    │
│              │                                    │
└──────────────┴────────────────────────────────────┘
```

---

# 14. Sidebar

Include:

**SatQuery AI**

* New Analysis
* Analysis History
* Saved Reports
* Models & Tools
* Settings

Bottom:

```text
● AI System Ready
```

---

# 15. Analysis Workspace

Top heading:

> **New Analysis**

Subtitle:

> Upload remote-sensing imagery and ask a question.

---

# 16. Image Upload

Create a large drag-and-drop area.

Support:

* GeoTIFF
* TIFF
* PNG/JPEG for supported benchmark datasets

Show:

* Filename
* Format
* Dimensions
* Modality
* Acquisition date
* Validation status

---

# 17. Dynamic Image Configuration

The UI should adapt to uploaded images.

### Single Image

Show one image.

### Bi-Temporal

Show:

```text
Image A                    Image B

Date 1                     Date 2
```

### Optical + SAR

Show:

```text
Optical                    SAR
```

The user should not need to manually select complicated technical settings.

---

# 18. Natural Language Query

Create a large query box.

Placeholder:

> "Ask a question about your satellite imagery..."

Suggested queries:

* Describe the land-cover in this image.
* Highlight the water body.
* What changed between these two dates?
* Has the built-up area increased?
* Identify built-up and water-covered regions using optical and SAR imagery.

Button:

**✦ Analyze with SatQuery AI**

---

# 19. Agent Processing UI

Do not show a generic loading spinner only.

Show the actual agentic workflow:

```text
Analyzing request...

✓ Input validated
✓ Query understood
✓ Task identified
✓ Specialist model selected
● Running analysis...
○ Generating visual evidence
○ Preparing response
```

This makes the agentic nature visible to the user.

---

# 20. Results Interface

Display:

### Final Answer

Large readable answer.

### Confidence

Example:

**91% — High confidence**

### Visual Evidence

Show the appropriate visualization.

---

# 21. Evidence Viewer

For different tasks:

### VQA

Image + answer

### Grounding

Image + highlighted region

### Change Analysis

Before + After + Change Map

### Optical + SAR

Optical + SAR + Combined result

Include:

* Zoom
* Pan
* Layer visibility
* Image comparison

---

# 22. Execution Summary

Create an expandable panel:

> **How SatQuery AI analyzed this**

Show:

```text
Task
Change-based VQA

Input
2 Bi-temporal Images

Selected Tools
Change Detection
Remote-Sensing VQA

Pipeline
Validation
→ Change Detection
→ Change Interpretation
→ Answer Generation

Status
Completed
```

---

# 23. Model & Tools Page

Create cards for:

* Remote-Sensing VQA
* Image Captioning
* Visual Grounding
* Change Analysis
* Change VQA
* Optical + SAR Analysis

Each card should show:

* Description
* Status
* Model/tool name
* Supported input

---

# 24. History Page

Show previous analyses:

```text
Query
Task
Date
Confidence
View Result
Download Report
```

---

# 25. Reports Page

Allow users to generate/download reports containing:

* Query
* Input images
* Analysis type
* Answer
* Visual evidence
* Confidence
* Models/tools used
* Execution summary

---

# 26. Error States

Design proper states for:

* Invalid file
* Unsupported format
* Wrong number of images
* Incompatible image pair
* Missing metadata
* Model unavailable
* Analysis failure

Never leave the user with only a generic "Something went wrong."

---

# 27. Visual Design System

The overall visual language should feel:

**Scientific + Geospatial + AI + Professional**

Use:

* Clean typography
* Strong information hierarchy
* Dark/light professional interface
* Subtle satellite/geospatial visual elements
* Minimal but meaningful animations
* High-quality satellite imagery
* Clear cards and panels
* Professional data visualization

Avoid:

* Generic AI robot graphics
* Cartoon illustrations
* Excessive gradients
* Excessive glassmorphism
* Neon cyberpunk styling
* Generic ChatGPT clone appearance
* Excessive animations

---

# 28. Responsive Design

Support:

* Desktop
* Laptop
* Tablet

Prioritize desktop because satellite imagery requires large visualization areas.

---

# 29. Technical Requirement

Use the existing frontend technology of the project.

If the project uses React, continue using React.

Create reusable components.

Suggested structure:

```text
frontend/
│
├── components/
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Hero/
│   ├── FeatureCard/
│   ├── Workflow/
│   ├── ImageUploader/
│   ├── ImagePreview/
│   ├── QueryBox/
│   ├── AgentStatus/
│   ├── ResultCard/
│   ├── EvidenceViewer/
│   ├── ConfidenceCard/
│   └── ExecutionSummary/
│
├── pages/
│   ├── Landing/
│   ├── Dashboard/
│   ├── Analysis/
│   ├── History/
│   ├── Models/
│   ├── Reports/
│   └── Settings/
│
└── ...
```

---

# 30. Important Constraint

This task is primarily **UI/UX implementation**.

Do NOT implement real:

* VQA inference
* Change detection inference
* SAR processing
* Model fine-tuning
* Dataset downloading
* Agent intelligence
* AI backend

Use realistic mock data and mock API responses where necessary.

However, structure the frontend so that real backend APIs can easily replace the mock data later.

---

# 31. Final User Journey

The complete website should provide this journey:

```text
LANDING PAGE
     ↓
Learn about SatQuery AI
     ↓
Launch SatQuery AI
     ↓
DASHBOARD
     ↓
Upload Image(s)
     ↓
Ask Natural-Language Question
     ↓
AI Agent Processing
     ↓
Specialist Model
     ↓
Result
     ↓
Visual Evidence
     ↓
Confidence
     ↓
Execution Summary
     ↓
Generate Report
```

The final result looks like a **real, polished, research-grade remote-sensing AI product ready for production operations and executive demonstrations**.

Build the UI in a modular way so the AI/backend functionality can be integrated later without redesigning the interface.

---

# PART 3 — SYSTEM UPDATES & ENHANCEMENTS INVENTORY

---

# 32. Complete Application Page Map & Multi-Page Architecture

SatQuery AI has been expanded into a fully modular, multi-page web application featuring **12 dedicated operational views and pages** accessible via persistent URL hash routing, responsive navigation headers, and operations sidebar:

| Page Index | Route / Hash | Page Title | Purpose & Scope |
|---|---|---|---|
| **01** | `#landing` or `/` | **Public Landing Page** | Public entry point featuring all 12 core product showcase sections, capability previews, and interactive CTAs. |
| **02** | `#login` / `#signin` | **Dedicated Institutional Login Page** | Standalone authentication view for remote sensing researchers with email/password, session caching, and demo 1-click test button. |
| **03** | `#signup` / `#register` | **Dedicated Researcher Registration Page** | Standalone registration portal capturing researcher credentials, laboratory/agency name, and STAC API tier selection. |
| **04** | `#forgot-password` | **Credential Recovery Page** | Institutional account recovery portal with dispatch simulation and security token verification. |
| **05** | `#oauth-google` / `#oauth-github` | **OAuth 2.0 Handshake Bridge** | Popup/redirect OAuth flow handling cross-origin message passing (`SATQUERY_OAUTH_SUCCESS`) for Google and GitHub accounts. |
| **06** | `#dashboard` / `#new-analysis` | **New Analysis Workspace** | The flagship agentic analysis workspace supporting multi-modal raster uploads (GeoTIFF/TIFF/PNG/JPEG), query dispatch, and live pipeline visualization. |
| **07** | `#history` | **Analysis History Registry** | Searchable and filterable registry of all executed inferences with task metadata, calibrated confidence, and quick report downloads. |
| **08** | `#reports` | **Mission Reports Dossier** | Comprehensive report generator and inspection interface with printable dossiers, JSON telemetry export, and stakeholder summaries. |
| **09** | `#models` | **Models & Specialist Tools Directory** | Detailed inventory of the 6 specialized AI models (RS-VQA, RS-Captioning, Grounding, Change Detection, Change VQA, Optical+SAR) with benchmarks and task launchers. |
| **10** | `#canvas` / `#workspace` | **3-Pane GIS Interactive Canvas** | High-precision geospatial GIS studio featuring a Layer staging dock, multi-spectral viewport (True Color, NIR, NDVI, NDWI, SAR Dual-Pol), and telemetry HUD. |
| **11** | `#errors` | **Error Diagnostics & Graceful Recovery Lab** | Diagnostic simulation environment covering all 7 deterministic failure states with actionable technical remediation guides. |
| **12** | `#settings` | **Platform Calibration & Settings** | Configuration portal for model confidence thresholds, cloud-mask strictness, STAC API endpoints, and API key management. |

---

# 33. Dedicated Authentication Pages & Identity Architecture

In addition to optional modal overlays for rapid testing, the platform provides first-class dedicated Auth Pages (`AuthPage.tsx`) designed specifically for research and defense workflows:

### A. Institutional Login Page (`#login`)
* **Secure Credential Inputs**: Validated email and password fields with visibility toggles and focus ring indicators.
* **Evaluator Quick Login**: Single-click demo bypass logging in as **Dr. Maya Chen (Lead EO Analyst)** for friction-free jury evaluation.
* **Persistent Session State**: `sessionStorage` credential persistence with `rememberMe` support.
* **SSO Federation**: Direct integration markers for **ESA Copernicus SSO** and **NASA Earthdata Login**.
* **Federated OAuth**: Support for Google and GitHub accounts via popups or embedded modals.

### B. Researcher Registration Page (`#signup`)
* **Academic Identity Profiling**: Capture Full Name, Academic Title, and Laboratory / Space Agency (e.g. *ISRO Space Applications Centre*).
* **STAC API Quota Tier Selection**:
  * *Academic Researcher*: Free tier with 2TB monthly bottom-of-atmosphere quota.
  * *Institutional Lab*: Multi-seat tier with 10TB multi-spectral and C-Band radar throughput.
  * *Enterprise Planetary Dedicated*: Dedicated STAC cluster with real-time sub-meter telemetry feeds.
* **Open Science Compliance**: Agreement to CEOS (Committee on Earth Observation Satellites) and NASA ARD open science licensing.

### C. Password Recovery Page (`#forgot-password`)
* Single-use institutional token dispatch simulation.
* Actionable inline notification confirming dispatch to registered institutional address.
* Seamless navigational return to login.

---

# 34. Background Cartography & Animation Removal Architecture

In strict accordance with Section 27 of this specification (*"Avoid: Excessive animations"*):
* **Elimination of Continuous Animation Loops**:
  * Removed all infinite keyframe loops including `star-twinkle`, `satellite-glide`, `telemetry-flow`, `orbit-pulse`, `neon-glow-pulse`, and `particle-drift`.
  * Removed SVG `<animateMotion>` and continuous scaling transformations.
* **Scientific Geospatial Vector Art**:
  * Transitioned background components (`CosmicOrbitBackground.tsx` and `GeospatialBackground.tsx`) to **clean, static, high-resolution SVG cartography**.
  * Retained precise orbital arcs, satellite body geometries, nadir scan cones, and coordinate graticules in a crisp, static state.
* **Benefits**:
  * Zero continuous CPU/GPU thread utilization on background canvas.
  * No visual distraction during complex raster interpretation and split-slider comparisons.
  * Maximum readability and battery efficiency across laptops and workstations.

---

# 35. Scroll-Driven Interaction System ("Reveal on Scroll")

To achieve a modern, tactile, research-grade presentation without background motion clutter, SatQuery AI implements a dedicated **Scroll-Driven Reveal System**:

### Component Architecture (`RevealOnScroll.tsx`)
* **Observer Engine**: Leverages the high-performance browser `IntersectionObserver` API to monitor elements as they scroll into the viewport.
* **Configurable Transition Parameters**:
  * `direction`: Configurable directional entry (`'up'`, `'down'`, `'left'`, `'right'`, `'zoom'`, `'fade'`).
  * `delay`: Millisecond stagger offset enabling sequential cascading card reveals.
  * `duration`: Smooth cubic-bezier transition timing (`1000ms` default for measured, high-end visibility).
  * `threshold`: Viewport intersection ratio (`0.12` default).
  * `rootMargin`: Lookahead margin (`0px 0px -40px 0px`) ensuring elements activate before reaching the center.
* **Accessibility Compliance**: Fully honors `prefers-reduced-motion: reduce` by immediately revealing content without motion for users requiring accessibility accommodations.
* **Hero Section Granular Integration (`LandingHero.tsx`)**:
  * *Announcement Pill*: Floats down with `direction="down" delay={100} duration={1000}`.
  * *Main Headings & Mission Copy*: Glides up with `direction="up" delay={200} duration={1000}`.
  * *High-Engagement CTA Action Buttons*: Glides up with `direction="up" delay={350} duration={1000}`.
  * *Sophisticated Telemetry & Visual Comparison Showcase*: Reveals upon scroll with `direction="up" delay={250} duration={1000} threshold={0.08}`.
* **Coverage**: Integrated granularly within the Hero Section, across all subsequent landing page sections (Problem, Core Features, How It Works, Supported Analysis, Architecture, Results Preview, Grounded Evidence, Use Cases, Tech Stack, Final CTA), and global dashboard registries.

---

# 36. Complete Frontend File Structure & Component Inventory

```text
FRONTEND/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx             # Inline modal login/signup dialog
│   │   │   ├── AuthPage.tsx              # Dedicated full-page Auth suite (Login, Signup, Recovery)
│   │   │   └── OAuthModal.tsx            # OAuth handshake & popup bridge
│   │   │
│   │   ├── common/
│   │   │   └── RevealOnScroll.tsx        # IntersectionObserver scroll reveal component
│   │   │
│   │   ├── landing/
│   │   │   ├── LandingPage.tsx           # Orchestrator for all 12 landing page sections
│   │   │   ├── LandingNavbar.tsx         # Sticky navigation header with theme & auth buttons
│   │   │   ├── LandingHero.tsx           # Section 2: Hero section & agent visual
│   │   │   ├── ProblemSection.tsx        # Section 3: Traditional vs SatQuery AI comparison
│   │   │   ├── CoreFeaturesSection.tsx   # Section 4: 6 core capability feature cards
│   │   │   ├── HowItWorksSection.tsx     # Section 5: 5-step interactive workflow
│   │   │   ├── SupportedAnalysisSection.tsx # Section 6: Single, Bi-temporal, and Optical+SAR
│   │   │   ├── AgenticArchitectureSection.tsx # Section 7: Controller & model routing diagram
│   │   │   ├── ResultsPreviewSection.tsx # Section 8: Realistic mock analysis interface
│   │   │   ├── EvidenceGroundedSection.tsx # Section 9: Grounded evidence visualizer
│   │   │   ├── UseCasesSection.tsx       # Section 10: 8 application domains
│   │   │   ├── TechnologySection.tsx     # Section 11: Technical stack & research components
│   │   │   ├── LandingCTA.tsx            # Section 12: Final conversion CTA banner
│   │   │   └── CosmicOrbitBackground.tsx # Static vector space & satellite cartography
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx       # Sections 13-14: Two-column responsive dashboard shell
│   │   │   ├── DashboardSidebar.tsx      # Section 14: Operations sidebar with "● AI System Ready"
│   │   │   ├── NewAnalysisWorkspace.tsx  # Sections 15-22: Core agentic analysis workspace
│   │   │   ├── ImageUploader.tsx         # Section 16: Multi-modal raster upload dock
│   │   │   ├── QueryBox.tsx              # Section 18: Natural language query bar with presets
│   │   │   ├── AgentProcessingView.tsx   # Section 19: Step-by-step agentic execution tracker
│   │   │   ├── EvidenceViewer.tsx        # Section 21: Split-slider, side-by-side & bbox viewer
│   │   │   ├── ExecutionSummary.tsx      # Section 22: Expandable execution trace dossier
│   │   │   ├── ModelsAndToolsView.tsx    # Section 23: 6 specialist AI engines directory
│   │   │   ├── AnalysisHistoryView.tsx   # Section 24: Operational analysis registry table
│   │   │   ├── ReportsView.tsx           # Section 25: Mission briefing report generator
│   │   │   └── ErrorStatesView.tsx       # Section 26: 7 failure scenarios simulation lab
│   │   │
│   │   ├── workspace/
│   │   │   ├── WorkspaceView.tsx         # Interactive 3-pane GIS studio
│   │   │   ├── GeospatialCanvas.tsx      # Multi-spectral layer canvas & coordinate HUD
│   │   │   ├── StagingPanel.tsx          # Raster staging dock & AOI selector
│   │   │   ├── WorkspaceHeader.tsx       # GIS header controls & band mode toggles
│   │   │   └── AgentChatbox.tsx          # Dedicated GIS conversational agent
│   │   │
│   │   ├── chat/
│   │   │   ├── FloatingChatWidget.tsx    # Draggable floating copilot
│   │   │   └── DedicatedChatView.tsx     # Fullscreen conversational assistant
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsView.tsx          # Confidence thresholds & STAC configuration
│   │   │
│   │   └── layout/
│   │       ├── Footer.tsx                # Global footer with all page links
│   │       └── GeospatialBackground.tsx  # Clean static vector background
│   │
│   ├── context/
│   │   └── ThemeContext.tsx              # Light / Dark mode state provider
│   │
│   ├── services/
│   │   └── oauthService.ts               # OAuth state and popup manager
│   │
│   ├── data/
│   │   └── mockData.ts                   # Realistic remote sensing scenarios and benchmarks
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions for STAC, tasks, and models
│   │
│   ├── App.tsx                           # Master client router & screen controller
│   ├── main.tsx                          # Vite React DOM entry point
│   └── index.css                         # Tailwind CSS & Reveal on Scroll styles
│
└── docs/
    └── design.md                         # Complete SatQuery AI architectural specification
```

---

# 37. Authentic Aerospace & Earth Observation Color Architecture

To establish an authentic, research-grade visual identity and eliminate generic "vibe-coded" aesthetics (neon glows, fluorescent magenta halos, and ambient blur artifacts), SatQuery AI implements a purposeful, high-contrast **Aerospace & Earth Observation Color System**:

### 1. Rejection of "Vibe-Coded" Clichés & Architecture Simplification
* **Removal of Palette Switcher**: The interactive theme palette switcher has been completely dismantled. Rather than superficial color re-skins, the platform employs a single, cohesive visual system calibrated specifically for Earth observation and remote sensing workflows.
* **Elimination of Neon Halos**: Stripped out all oversaturated neon cyan (`#06b6d4`/`#22d3ee`), fluorescent magenta, fuzzy `blur-3xl` ambient light blobs, and glowing multi-color shadows that create eye fatigue during imagery analysis.
* **Scientific Clarity**: Replaced with clean, crisp elevation shadows (`shadow-sm`, `shadow-md`, `shadow-xl`), authentic vector grid lines, and high-contrast typography.

### 2. Core Operational Color Combinations & Semantics
The color system reflects the exact spectrum used in professional satellite telemetry, multispectral remote sensing, and aerospace mission control:

1. **Aerospace Royal Blue (`#2563eb` / `#1d4ed8` / dark: `#3b82f6`)**
   * *Role*: Primary actions, active navigation tabs, mission control chrome, and authoritative telemetry.
   * *Rationale*: Grounded, authoritative, and legible; avoids the washed-out readability issues of neon cyan.

2. **Earth Vegetation & Radar Emerald (`#10b981` / `#059669` / `#047857`)**
   * *Role*: NDVI/vegetation metrics, SAR coherence, verified detections, confidence badges (>90%), and confirmation actions.
   * *Rationale*: Directly references bi-temporal Earth observation indices and false-color satellite compositing.

3. **Solar Thermal Amber (`#f59e0b` / `#d97706` / `#b45309`)**
   * *Role*: Thermal anomalies, AI agent processing status, warning indicators, and bounding box highlights.
   * *Rationale*: Resembles solar telemetry and thermal infrared detection channels without being alarmist.

4. **Deep Space Indigo (`#4f46e5` / `#4338ca` / dark: `#818cf8`)**
   * *Role*: Multi-model routing steps, STAC metadata tags, secondary pipeline highlights, and gradient transitions.
   * *Rationale*: Provides depth and contrast against dark backgrounds without introducing neon artifacting.

5. **Precision Neutral Slate (`#0b0f19` / `#0f172a` / `#1e293b` / `#f8fafc`)**
   * *Role*: High-contrast background canvas, card surfaces, and borders.
   * *Rationale*: Pure dark slate background prevents color contamination when inspecting raster imagery, spectral bands, and split-slider comparisons.

### 3. Technical Implementation & Tailwind Token Mapping
* **Direct Tailwind Color Mapping (`tailwind.config.js`)**:
  * `cyan` is mapped directly to the vibrant **Aerospace Royal Blue** scale (`50: #eff6ff` to `600: #2563eb`, `700: #1d4ed8`, `950: #0f172a`).
  * `teal` is mapped directly to the **Earth Vegetation Emerald** scale (`50: #ecfdf5` to `500: #10b981`, `600: #059669`, `950: #022c22`).
  * `brand` is mapped to **Aerospace Royal Blue**, ensuring all existing components across the application render consistently without neon tints.
* **Component Styling (`index.css`)**:
  * `.btn-primary`: Solid Royal Blue (`bg-blue-600 hover:bg-blue-500 active:bg-blue-700`) with clean `shadow-sm`.
  * `.btn-gradient`: Royal Blue to Deep Space Indigo (`from-blue-600 via-indigo-600 to-blue-700`) with high-contrast text.
  * `.theme-heading-gradient`: Balanced 3-stop aerospace gradient (`#2563eb` -> `#4f46e5` -> `#d97706` in light mode; `#60a5fa` -> `#818cf8` -> `#f59e0b` in dark mode).
  * `.btn-outline-teal`: Crisp emerald border (`border-emerald-500/50`) and text (`text-emerald-700 dark:text-emerald-400`).
* **Light / Dark Mode**:
  * Maintained via clean, lightweight `ThemeContext.tsx` toggling the `.dark` class on `document.documentElement` with `localStorage` persistence (`satquery_theme`). All multi-palette dynamic CSS variables have been removed in favor of direct Tailwind utility classes.