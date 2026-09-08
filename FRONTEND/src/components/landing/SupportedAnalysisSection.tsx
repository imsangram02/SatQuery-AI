import React, { useState } from 'react';
import { Layers, ArrowRight, Check, Compass, Sparkles } from 'lucide-react';

interface SupportedAnalysisSectionProps {
  onLaunchMode?: (mode: 'single' | 'bi-temporal' | 'optical-sar') => void;
}

export const SupportedAnalysisSection: React.FC<SupportedAnalysisSectionProps> = ({ onLaunchMode }) => {
  const [selectedMode, setSelectedMode] = useState<'single' | 'bi-temporal' | 'optical-sar'>('bi-temporal');

  const modes = [
    {
      id: 'single' as const,
      title: 'Single Image Mode',
      badge: 'VQA • Captioning • Grounding',
      tagline: 'Deep visual question answering & referential object localization',
      description: 'Upload a single orthorectified multi-spectral or panchromatic satellite image. SatQuery AI extracts surface reflectance parameters, detects geographic regions, and localizes specific natural features with pixel-accurate bounding boxes.',
      inputDiagram: 'Satellite Image (T0) → Specialized RS-VLM / Grounder',
      visuals: [
        {
          label: 'Single Multi-Spectral Scene',
          meta: 'Sentinel-2 L2A BOA (10m GSD)',
          gradient: 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)',
          annotation: 'Water Surface Mask: 412.8 km²'
        }
      ],
      capabilities: [
        'Visual Question Answering (Land-Cover proportions, infrastructure counts)',
        'Comprehensive automated Scene Description and environmental reports',
        'Referential Visual Grounding with coordinate bounding boxes'
      ]
    },
    {
      id: 'bi-temporal' as const,
      title: 'Bi-Temporal Mode',
      badge: 'Multi-Temporal Change Analysis',
      tagline: 'Pixel-level co-registration and drift detection between two acquisition dates',
      description: 'Upload two co-registered scenes acquired on different dates (e.g. 2022 vs 2025). SatQuery AI executes radiometric cross-normalization, extracts difference feature maps, and outputs quantitative drift metrics for urban expansion and deforestation.',
      inputDiagram: 'Image A (2022) + Image B (2025) → Bi-Temporal Change Engine',
      visuals: [
        {
          label: 'Image A (June 2022)',
          meta: 'Baseline Pass T0',
          gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          annotation: 'Pre-Development Matrix'
        },
        {
          label: 'Image B (August 2025)',
          meta: 'Comparison Pass T1',
          gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0369a1 100%)',
          annotation: 'Urban Infill Detected'
        },
        {
          label: 'Change Heatmap Vector',
          meta: 'Difference Mask',
          gradient: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)',
          annotation: '+28.4% Built-up Gain'
        }
      ],
      capabilities: [
        'Urban construction sprawl and building footprint extraction',
        'Canopy clearing and selective logging corridor detection',
        'Natural-language Change VQA ("Has built-up area increased?")'
      ]
    },
    {
      id: 'optical-sar' as const,
      title: 'Optical + SAR Mode',
      badge: 'Cross-Modal Radar-Optical Fusion',
      tagline: 'All-weather cloud-penetrating synthetic aperture radar fusion',
      description: 'Combine optical multi-spectral imagery with Sentinel-1 C-Band SAR radar data. Penetrate through persistent heavy storm clouds to evaluate dynamic flood inundation and delineate building structures unaffected by weather conditions.',
      inputDiagram: 'Optical RGB + SAR Radar (VV/VH) → Joint Fusion Transformer',
      visuals: [
        {
          label: 'Optical Modality',
          meta: 'Sentinel-2 RGB (Cloud-obscured)',
          gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          annotation: 'High Visual Fidelity'
        },
        {
          label: 'SAR Radar Modality',
          meta: 'Sentinel-1 C-Band Radar (VV/VH)',
          gradient: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
          annotation: 'Cloud-Penetrating Backscatter'
        },
        {
          label: 'Cross-Modal Fused Result',
          meta: 'Multi-Modal Joint Map',
          gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #f59e0b 80%, #b45309 100%)',
          annotation: '312.4 km² Flooded Extent'
        }
      ],
      capabilities: [
        '100% all-weather penetration through heavy precipitation and clouds',
        'Double-bounce corner reflector detection for built-up assets',
        'Specular surface reflection isolation for peak flood crest modeling'
      ]
    }
  ];

  const currentMode = modes.find(m => m.id === selectedMode) || modes[1];

  return (
    <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          Multimodal Input Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supported Image Analysis Modes
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          SatQuery AI natively adapts its agentic workflow depending on whether you provide a single image, bi-temporal passes, or multi-sensor optical and SAR radar combinations.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 active:scale-95 ${
                selectedMode === mode.id
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Showcase Panel */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 5 cols: Details & Capabilities */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>{currentMode.badge}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {currentMode.title}
            </h3>

            <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              {currentMode.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentMode.description}
            </p>

            {/* Input flow badge */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Pipeline Flow:</span>
              <span className="font-semibold text-cyan-700 dark:text-cyan-300">{currentMode.inputDiagram}</span>
            </div>

            {/* Bulleted list */}
            <div className="space-y-2 pt-1">
              {currentMode.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>

            {onLaunchMode && (
              <div className="pt-2">
                <button
                  onClick={() => onLaunchMode(currentMode.id)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch in {currentMode.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right 7 cols: Realistic Visual Multi-Pass Representation */}
          <div className="lg:col-span-7">
            <div className={`grid gap-3 ${currentMode.visuals.length > 1 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
              {currentMode.visuals.map((vis, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <span className="font-semibold truncate">{vis.label}</span>
                  </div>
                  <div
                    className="h-44 sm:h-52 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 flex flex-col justify-between p-3 shadow-md"
                    style={{ background: vis.gradient }}
                  >
                    <div className="absolute inset-0 geo-grid-pattern opacity-40 pointer-events-none" />
                    
                    <div className="relative z-10 flex justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 backdrop-blur-xs">
                        {vis.meta}
                      </span>
                    </div>

                    <div className="relative z-10 px-2.5 py-1 rounded bg-slate-950/90 border border-slate-700/80 text-[11px] font-mono text-white font-bold backdrop-blur-xs">
                      {vis.annotation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom HUD info */}
            <div className="mt-4 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
              <span>GeoTIFF / TIFF / STAC v1.0.0 Compatible</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">Automatic Modality Detection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
