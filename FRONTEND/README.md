# SatQuery AI — Planetary Intelligence & Geospatial Analytics

A production-ready React (Vite + TypeScript + Tailwind CSS) platform for Earth Observation (EO) analysis powered by multi-modal foundation models.

---

## Key Highlights

- **Dark Default Theme (Slate & Teal)**: High-contrast satellite telemetry theme with seamless dark/light mode toggle.
- **Zero Emojis**: 100% compliant with clean, professional Lucide React SVG icons.
- **Tactile UI Interactions**: Every button has smooth transitions, focus-ring states, and `active:scale-[0.98]` tactile click dynamics.
- **Complete Suite of Screens**:
  1. **Landing Page**: Split-screen draggable interactive hero demo, verified SOTA benchmark badges, multi-model performance comparison matrix, and core capability highlights.
  2. **Authentication (Login / Sign-Up)**: Dedicated modal with institutional login, Copernicus & NASA Earthdata SSO triggers, and one-click demo profiles.
  3. **Dashboard**: 5 quick-start workflow pipeline cards, KPI metrics (AOI area, active constellations, latency), and recent analyses table with filters and direct canvas actions.
  4. **Profile & Settings**: Multi-tab interface featuring confidence cutoff sliders, multi-temporal drift sensitivity, cloud masking strictness, API key management with permission scopes, and storage quota meters.
  5. **3-Pane Geospatial Workspace**:
     - **Pane 1 (Left)**: Data upload & staging panel with sensor selection, spectral band index algebra (NDVI, NDWI, NBR, SAR dual-pol), AOI quick switcher, drag-and-drop raster/vector dropzone, and layer stack manager.
     - **Pane 2 (Center)**: Interactive split-view geospatial canvas with draggable split slider, pan/zoom, live cursor HUD (Lat, Lon, Elevation, BOA DN), clickable feature bounding boxes, multi-temporal scrubber, and an interactive **Spectral Sampling Inspector** (revealing 5-band surface reflectance and NDVI values).
     - **Pane 3 (Right)**: AI Agent Chatbox (GeoLLM-v3) with **observable execution traces** (step-by-step pipeline view with duration in ms), collapsible STAC JSON payload inspector, grounded quantitative statistics, and actionable suggested prompt chips.
- **Mock Benchmark Datasets**: Pre-configured real-world AOIs including Amazon Rainforest (Rondônia), Rhine Flood Plain, Sierra Nevada Wildfire Complex, Punjab Wheat Belt, and Tokyo Bay.

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript (Strict type safety)
- **Styling**: Tailwind CSS (Tailwind v3 + PostCSS)
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: Client-side hash routing (`#landing`, `#dashboard`, `#workspace`, `#settings`)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
