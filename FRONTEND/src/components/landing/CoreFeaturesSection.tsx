import React, { useState } from 'react';
import { 
  HelpCircle, 
  FileText, 
  Crosshair, 
  GitCompare, 
  Radio, 
  Cpu, 
  ArrowRight, 
  Check, 
  Layers,
  Eye
} from 'lucide-react';

interface CoreFeaturesSectionProps {
  onLaunchWithQuery?: (query: string, mode: 'single' | 'bi-temporal' | 'optical-sar') => void;
}

export const CoreFeaturesSection: React.FC<CoreFeaturesSectionProps> = ({ onLaunchWithQuery }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      id: 'vqa',
      title: 'Visual Question Answering',
      subtitle: 'Natural-language queries about satellite imagery',
      exampleQuery: 'What type of land cover is visible?',
      icon: HelpCircle,
      badge: 'Interactive VQA',
      mode: 'single' as const,
      description: 'Ask complex natural-language questions about multi-spectral satellite imagery and receive direct, evidence-grounded answers. SatQuery AI computes land use proportions, infrastructure frequency, and environmental indicators without requiring code.',
      visualPreview: {
        type: 'vqa',
        gradient: 'linear-gradient(135deg, #15803d 0%, #4d7c0f 45%, #ca8a04 100%)',
        tag: 'Sentinel-2 L2A BOA',
        stats: '62% Cropland • 18% Forestry • 12% Urban'
      }
    },
    {
      id: 'scene-description',
      title: 'Scene Description',
      subtitle: 'Comprehensive geological & structural summaries',
      exampleQuery: 'Generate a detailed environmental summary of this scene.',
      icon: FileText,
      badge: 'Automated Briefings',
      mode: 'single' as const,
      description: 'Automatically generate detailed, publication-ready textual descriptions of complex remote-sensing scenes. Articulates agricultural phenology, urban morphology, geomorphology, and waterway connectivity in structured prose.',
      visualPreview: {
        type: 'caption',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        tag: 'Sub-Meter Panchromatic',
        stats: 'Industrial Port • 24 Berths • Rail Connectivity'
      }
    },
    {
      id: 'visual-grounding',
      title: 'Visual Grounding',
      subtitle: 'Referential object & region spatial localization',
      exampleQuery: 'Highlight the water body.',
      icon: Crosshair,
      badge: 'Bounding Box & Masks',
      mode: 'single' as const,
      description: 'Ask where specific objects, hydrological features, or anomalies are situated. The RS-Grounder model calculates precise pixel-level bounding boxes and polygon vector coordinates directly from natural language prompts.',
      visualPreview: {
        type: 'grounding',
        gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0284c7 100%)',
        tag: 'Water Mask • NDWI +0.68',
        stats: 'Reservoir: 412.8 km² • 95% Confidence'
      }
    },
    {
      id: 'change-analysis',
      title: 'Change Analysis',
      subtitle: 'Multi-temporal comparison across acquisition dates',
      exampleQuery: 'What changed between 2022 and 2025?',
      icon: GitCompare,
      badge: 'Before → After → Change Map',
      mode: 'bi-temporal' as const,
      description: 'Compare co-registered satellite images acquired on different dates. SatQuery AI co-registers pixels, normalizes radiometry, and isolates changes such as urban construction sprawl, canopy clearing, or shoreline erosion into an intuitive difference map.',
      visualPreview: {
        type: 'change',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)',
        tag: 'Bi-Temporal Difference Map',
        stats: '+28.4% Built-up Gain • 412.5 ha Converted'
      }
    },
    {
      id: 'optical-sar',
      title: 'Optical + SAR Analysis',
      subtitle: 'Cloud-penetrating cross-modal radar fusion',
      exampleQuery: 'Identify built-up and water-covered regions using both images.',
      icon: Radio,
      badge: 'Sentinel-1 + Sentinel-2',
      mode: 'optical-sar' as const,
      description: 'Combine complementary spectral information from optical imagery (fine texture and color reflectance) and C-Band synthetic aperture radar (cloud penetration, surface roughness, and double-bounce corner reflectors) for all-weather flood and infrastructure tracking.',
      visualPreview: {
        type: 'optical-sar',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #f59e0b 80%, #b45309 100%)',
        tag: 'Optical + SAR InSAR Fusion',
        stats: '312.4 km² Flooded • 100% Cloud Penetration'
      }
    },
    {
      id: 'agentic-orchestration',
      title: 'Agentic AI Orchestration',
      subtitle: 'Autonomous specialist model & tool selection',
      exampleQuery: 'Automatically determine best model for my query and images.',
      icon: Cpu,
      badge: 'Core Architectural Novelty',
      mode: 'bi-temporal' as const,
      description: 'The crowning innovation of SatQuery AI. Instead of forcing one generic model to perform all tasks poorly, our autonomous Controller Agent analyzes your prompt and data modalities to dispatch the exact specialist model required.',
      visualPreview: {
        type: 'agentic',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #06b6d4 100%)',
        tag: 'Autonomous Dispatch Engine',
        stats: '6 Specialist Models • Zero-Shot Routing'
      }
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-[#263B5C]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-[#5B8CFF] border border-blue-500/25 font-mono text-xs font-semibold uppercase tracking-wider">
          Multimodal Remote-Sensing Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F7FF] tracking-tight">
          One Interface. Multiple Remote-Sensing Capabilities.
        </h2>
        <p className="text-slate-600 dark:text-[#A8B6CF] text-sm sm:text-base leading-relaxed">
          From single-image question answering and referential visual grounding to multi-temporal change detection and cross-modal optical+SAR radar fusion.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          const isAgentic = feature.id === 'agentic-orchestration';

          return (
            <div
              key={feature.id}
              className={`p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group ${
                isAgentic
                  ? 'bg-gradient-to-b from-blue-50/90 to-indigo-50/80 dark:from-[#101F38] dark:to-[#152A48] border-2 border-blue-500/40 dark:border-[#5B8CFF]/50 shadow-xl shadow-blue-500/10 dark:shadow-[#5B8CFF]/15 hover:shadow-2xl hover:-translate-y-1'
                  : 'bg-white dark:bg-[#101F38] hover:bg-slate-50 dark:hover:bg-[#152A48] border border-slate-200 dark:border-[#263B5C] hover:border-blue-400 dark:hover:border-[#5B8CFF]/40 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                    isAgentic
                      ? 'bg-gradient-to-br from-[#5B8CFF] to-[#7C6CFF] text-white shadow-md shadow-[#5B8CFF]/20'
                      : 'bg-blue-500/10 dark:bg-[#5B8CFF]/15 text-blue-600 dark:text-[#5B8CFF] border border-blue-500/20 dark:border-[#5B8CFF]/25'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isAgentic
                      ? 'bg-blue-600 dark:bg-[#5B8CFF] text-white'
                      : 'bg-slate-100 dark:bg-[#0B1930] text-slate-700 dark:text-[#A8B6CF] border border-slate-200 dark:border-[#263B5C]'
                  }`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FF] tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-cyan-700 dark:text-[#22D3EE] font-mono mt-0.5 font-semibold">
                    {feature.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-[#A8B6CF] leading-relaxed mt-2.5">
                    {feature.description}
                  </p>
                </div>

                {/* Example Query Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1930] border border-slate-200 dark:border-[#263B5C] text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-[#A8B6CF] block text-[10px] uppercase font-bold">Sample Natural Query:</span>
                  <span className="text-slate-900 dark:text-[#F5F7FF] font-semibold italic">
                    "{feature.exampleQuery}"
                  </span>
                </div>

                {/* Mini Visual Simulation */}
                <div 
                  className="h-20 rounded-xl relative overflow-hidden flex flex-col justify-end p-2 border border-slate-200 dark:border-[#263B5C]"
                  style={{ background: feature.visualPreview.gradient }}
                >
                  <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-xs font-semibold">
                      {feature.visualPreview.tag}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-xs text-[#22D3EE] font-bold">
                      {feature.visualPreview.stats}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#263B5C] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#A8B6CF] text-[11px]">Mode: {feature.mode}</span>
                {onLaunchWithQuery && (
                  <button
                    onClick={() => onLaunchWithQuery(feature.exampleQuery, feature.mode)}
                    className="flex items-center gap-1 font-bold text-blue-600 dark:text-[#5B8CFF] hover:text-cyan-600 dark:hover:text-[#22D3EE] hover:underline active:scale-95 transition-transform"
                  >
                    <span>Test Query</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
