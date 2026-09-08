import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, ArrowDown, HelpCircle, Layers, Cpu, Sparkles, Terminal } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          The Remote Sensing Bottleneck
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Understanding Earth Observation Data Shouldn't Require a GIS Expert.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Existing remote-sensing AI systems are fractured across isolated silos—requiring researchers to manually select datasets, configure deep network parameters, and decipher raw raster matrices. SatQuery AI replaces technical friction with natural language.
        </p>
      </div>

      {/* Visual Comparison: Traditional Approach vs SatQuery AI (Section 3 of design.md) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* TRADITIONAL APPROACH CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-rose-500/30 dark:border-rose-500/20 shadow-lg relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Traditional GIS Workflow
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complex, fragmented, and requiring deep specialized engineering
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-mono font-bold">
                High Friction
              </span>
            </div>

            {/* Step-by-step Traditional Pipeline */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">01. Manual Dataset Discovery</span>
                <span className="text-[11px] text-slate-400">Search STAC / Landsat / Sentinel catalogs</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">02. Choose Specialist Model</span>
                <span className="text-[11px] text-slate-400">Pick between VQA, detection, or segmentation</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">03. Configure Hyperparameters</span>
                <span className="text-[11px] text-slate-400">CRS, thresholds, band math, cloud masks</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">04. Run Analysis & Scripts</span>
                <span className="text-[11px] text-slate-400">Heavy manual execution across Python scripts</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">05. Manually Interpret Output</span>
                <span className="text-[11px] text-slate-400">Raw TIFF matrices without explanation</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Result: Days spent configuring pipelines instead of gaining immediate actionable insights.</span>
          </div>
        </div>

        {/* SATQUERY AI APPROACH CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-950 border border-cyan-400/40 dark:border-cyan-400/30 shadow-xl shadow-cyan-500/5 relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-cyan-500/20 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  SatQuery AI Agentic Paradigm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                  Natural language in • Multi-model reasoning • Grounded visual evidence out
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30">
                Autonomous
              </span>
            </div>

            {/* Step-by-step SatQuery Pipeline */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-cyan-400/30 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-100">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">01. Ask a Question</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">"Has the built-up area increased?"</span>
              </div>
              <div className="flex justify-center text-cyan-500">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-cyan-400/30 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-100">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">02. Autonomous AI Agent</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Understands semantic intent and spatial context</span>
              </div>
              <div className="flex justify-center text-cyan-500">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-cyan-400/30 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-100">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">03. Select Appropriate Tools</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Dispatches Change Detection + RS-VLM</span>
              </div>
              <div className="flex justify-center text-cyan-500">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-cyan-400/30 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-100">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">04. TensorRT Accelerated Analysis</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Sub-second inference across multi-modal tensors</span>
              </div>
              <div className="flex justify-center text-cyan-500">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-xs flex items-center justify-between text-emerald-900 dark:text-emerald-100 font-bold">
                <span className="text-emerald-700 dark:text-emerald-300">05. Answer + Visual Evidence</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Clear answer + highlighted masks + 91%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-cyan-500/20 text-[11px] font-mono text-cyan-600 dark:text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Result: Instant, evidence-grounded insights accessible to analysts, decision-makers, and field teams.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
