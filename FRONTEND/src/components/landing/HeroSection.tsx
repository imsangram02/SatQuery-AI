import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Sliders, 
  Sparkles, 
  Activity, 
  Compass, 
  Split, 
  Eye, 
  CheckCircle2, 
  Cpu, 
  LogIn, 
  UserPlus, 
  Radio, 
  Satellite, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { Screen, AOIPreset } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';

interface HeroSectionProps {
  onNavigate: (screen: Screen) => void;
  onSelectAOI?: (aoi: AOIPreset) => void;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onNavigate, 
  onSelectAOI,
  onOpenAuth
}) => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [splitPosition, setSplitPosition] = useState(52); // Percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeAOI = MOCK_AOI_PRESETS[activePresetIndex];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(rect.width - 5, e.clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSplitPosition(Math.round(percent));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    if (onSelectAOI) {
      onSelectAOI(MOCK_AOI_PRESETS[idx]);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Visual background ambient radar pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-teal-500/10 pointer-events-none dark:border-teal-500/10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-teal-500/10 pointer-events-none dark:border-teal-500/10"></div>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-teal-500/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Status Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-xs font-mono text-teal-700 dark:text-teal-300 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-teal-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>SatQuery-GeoSAM-v3 Foundation Model Live</span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold">89.4% mIoU</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Planetary Intelligence & Remote Sensing at{' '}
            <span className="bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Sub-Meter Scale
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Multi-modal Earth observation foundation models with observable chain-of-thought execution.
            Seamlessly query multi-spectral Sentinel-2, Landsat-9, and SAR radar imagery for instant zero-shot disturbance detection.
          </p>

          {/* Action CTAs: Smooth hover, elevation, and tactile click effects */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('workspace')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 hover:from-teal-300 hover:via-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-400/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3-Pane Geospatial Canvas</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-800 font-semibold text-xs font-mono flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 shadow-sm hover:shadow"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Ask AI Copilot Terminal</span>
            </button>
          </div>

          {/* Trust & Sensor Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              STAC v1.0.0 Validated
            </span>
            <span className="flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-teal-500" />
              Copernicus Sentinel-2 & Landsat-9
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-teal-500" />
              Sentinel-1 SAR C-Band Radar
            </span>
          </div>
        </div>

        {/* Interactive Split-Screen Live Demo */}
        <div className="max-w-5xl mx-auto mt-8">
          {/* Preset Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-t-2xl bg-slate-900 border-x border-t border-slate-800 text-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold">
              <Split className="w-4 h-4 text-teal-400" />
              <span>INTERACTIVE MULTI-SPECTRAL COMPARISON</span>
              <span className="hidden sm:inline text-slate-500">| Drag center divider</span>
            </div>

            {/* AOI Preset Buttons with tactile hover/active states */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {MOCK_AOI_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    activePresetIndex === idx
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {preset.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Split Screen Canvas Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-[380px] sm:h-[460px] w-full select-none overflow-hidden border-x border-b border-slate-800 shadow-2xl bg-slate-950 cursor-ew-resize group"
          >
            {/* Background Layer: Post-Processing / AI Inference */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ background: activeAOI.afterVisual }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-40"></div>
              
              {/* Synthetic AI Detection Overlay Polygons with authentic remote sensing classes */}
              <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                <div className="w-4/5 h-4/5 border-2 border-dashed border-teal-400/60 rounded-xl relative p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-1 rounded bg-teal-950/80 border border-teal-500/60 text-teal-300 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      GeoSAM Neural Mask: {activeAOI.metricValue}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                      Model Confidence: 98.4%
                    </span>
                  </div>

                  {/* Real remote sensing classification clusters */}
                  <div className="grid grid-cols-3 gap-4 opacity-80">
                    <div className="h-20 rounded-lg bg-teal-500/20 border border-teal-400/40 p-2 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-teal-300 font-semibold">Core Intact Canopy</span>
                      <span className="text-xs font-bold text-teal-200">NDVI 0.81</span>
                    </div>
                    <div className="h-20 rounded-lg bg-amber-500/25 border border-amber-400/40 p-2 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-amber-300 font-semibold">Logging Spur Delta</span>
                      <span className="text-xs font-bold text-amber-200">Disturbance Verified</span>
                    </div>
                    <div className="h-20 rounded-lg bg-rose-500/30 border border-rose-400/50 p-2 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-rose-300 font-semibold">Clear-Cut Perimeter</span>
                      <span className="text-xs font-bold text-rose-200">High Severity Loss</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Coordinate System: EPSG:32621 (WGS84 UTM Zone 21S)</span>
                    <span>Sensor: {activeAOI.recommendedSensor.toUpperCase()} BOA</span>
                  </div>
                </div>
              </div>

              {/* Right Tag Label */}
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-teal-500/40 text-teal-300 font-mono text-xs shadow-lg backdrop-blur-sm pointer-events-none">
                <span className="font-bold">{activeAOI.afterLabel}</span>
              </div>
            </div>

            {/* Foreground Layer: Raw Baseline Imagery */}
            <div
              className="absolute inset-0 h-full overflow-hidden pointer-events-none"
              style={{ width: `${splitPosition}%` }}
            >
              <div 
                className="absolute inset-0 w-[1000px] sm:w-[1200px] h-full"
                style={{ background: activeAOI.beforeVisual }}
              >
                <div className="absolute inset-0 opacity-30 geo-grid-pattern"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-4/5 h-4/5 border border-slate-700/60 rounded-xl relative p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                        Raw Orthorectified Sentinel-2 L2A
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-400">
                        Surface Reflectance (BOA)
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="px-4 py-2 rounded-lg bg-slate-900/70 border border-slate-700/80 text-center font-mono text-xs text-slate-300">
                        Baseline Snapshot: Multi-Spectral Pass T0
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Monitored Area: {activeAOI.areaKm2.toLocaleString()} km²</span>
                      <span>Cloud Cover: &lt;1.2%</span>
                    </div>
                  </div>
                </div>

                {/* Left Tag Label */}
                <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 text-slate-300 font-mono text-xs shadow-lg backdrop-blur-sm">
                  <span className="font-bold">{activeAOI.beforeLabel}</span>
                </div>
              </div>
            </div>

            {/* Draggable Vertical Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-teal-400 z-30 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-500 text-slate-950 border-2 border-white shadow-xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Top Center Real-Time Split Telemetry HUD */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
              <span>Split: {splitPosition}% / {100 - splitPosition}%</span>
              <span className="text-slate-500">|</span>
              <span>Coordinates: {activeAOI.coordinates[0].toFixed(2)}°, {activeAOI.coordinates[1].toFixed(2)}°</span>
            </div>
          </div>

          {/* Quick launch action bar below demo */}
          <div className="p-3 bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Loaded: <strong className="text-slate-200">{activeAOI.name}</strong></span>
              <span className="hidden md:inline text-slate-600">—</span>
              <span className="hidden md:inline text-slate-400">{activeAOI.description}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('workspace')}
                className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in 3-Pane Canvas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
