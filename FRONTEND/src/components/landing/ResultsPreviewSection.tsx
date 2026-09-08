import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Activity, 
  Compass, 
  Layers, 
  FileText,
  Download
} from 'lucide-react';

interface ResultsPreviewSectionProps {
  onLaunchWithScenario?: () => void;
}

export const ResultsPreviewSection: React.FC<ResultsPreviewSectionProps> = ({ onLaunchWithScenario }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState<'change-vqa' | 'grounding' | 'optical-sar'>('change-vqa');

  return (
    <section id="preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          Interactive Application Preview
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Realistic Results & Analysis Interface
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          See what an authentic SatQuery AI analysis looks like—with quantitative findings, multi-layer visual evidence, and calibrated model confidence metrics.
        </p>
      </div>

      {/* Realistic Mock Analysis Interface Container (Section 8 of design.md) */}
      <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/30 shadow-2xl dark:shadow-[0_0_50px_rgba(6,182,212,0.18)] overflow-hidden">
        {/* Mock Window Titlebar */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              SatQuery AI • Analysis Terminal Preview • [SESSION_ID: SQ-8910-LIVE]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● Analysis Completed
            </span>
          </div>
        </div>

        {/* User Query Banner */}
        <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              User Query:
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-cyan-500">"</span>
              <span>Has the built-up area increased?</span>
              <span className="text-cyan-500">"</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
              Task: Change-based VQA
            </span>
          </div>
        </div>

        {/* Evidence Triple Layer View: Before Image | After Image | Change Map */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 1. Before Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
                <span className="font-bold">Before Image</span>
                <span className="text-slate-400">June 2022</span>
              </div>
              <div
                className="h-44 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 flex items-end p-3 shadow-xs"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)' }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-40 pointer-events-none" />
                <span className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-200">
                  Sentinel-2 L2A T0
                </span>
              </div>
            </div>

            {/* 2. After Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
                <span className="font-bold">After Image</span>
                <span className="text-slate-400">August 2025</span>
              </div>
              <div
                className="h-44 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 flex items-end p-3 shadow-xs"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0369a1 100%)' }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-40 pointer-events-none" />
                <span className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-200">
                  Sentinel-2 L2A T1
                </span>
              </div>
            </div>

            {/* 3. Change Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                <span>Change Map</span>
                <span>Heatmap Overlay</span>
              </div>
              <div
                className="h-44 rounded-xl relative overflow-hidden border-2 border-cyan-400/70 flex items-end p-3 shadow-md shadow-cyan-500/10"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)' }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
                <div className="absolute inset-3 border border-dashed border-cyan-300/80 rounded-lg pointer-events-none" />
                <span className="relative z-10 px-2.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-mono text-cyan-200 font-bold">
                  AI Difference Mask: +28.4%
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Result & Metrics Grid */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-cyan-500/20 space-y-4">
            {/* Answer Headline */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                Analysis Result:
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                Built-up area increased in the selected region by +28.4% (+412.5 ha) between 2022 and 2025.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                Zero-shot deep siamese segmentation verified 14 newly constructed commercial and residential clusters along the peripheral arterial highway. Fallow agricultural plots were predominantly converted.
              </p>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Confidence</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  91%
                </div>
                <div className="text-[10px] font-mono text-slate-500">High Confidence</div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Selected Task</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Change-based VQA
                </div>
                <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Agent Dispatched</div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Models Used</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-slate-700">
                    Change Detection Model
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-slate-700">
                    Remote-Sensing VQA Model
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <span>Ready for your own satellite imagery or pre-loaded benchmark scenes.</span>
          </div>

          <button
            onClick={onLaunchWithScenario}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-sm transition-all duration-150 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Analysis Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
