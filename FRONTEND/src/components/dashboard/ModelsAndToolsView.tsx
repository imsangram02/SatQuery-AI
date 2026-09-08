import React from 'react';
import { Cpu, CheckCircle2, Zap, Layers, Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { MOCK_MODEL_TOOLS } from '../../data/mockData';
import { AnalysisTaskType } from '../../types';

interface ModelsAndToolsViewProps {
  onSelectModelTask?: (taskType: AnalysisTaskType) => void;
}

export const ModelsAndToolsView: React.FC<ModelsAndToolsViewProps> = ({ onSelectModelTask }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
          <Cpu className="w-4 h-4 text-cyan-500" />
          <span>Autonomous AI Inventory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
          Models & Tools Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspect the 6 specialized remote-sensing neural engines orchestrated by the SatQuery AI agent.
        </p>
      </div>

      {/* Overview Cards (Section 23 of design.md) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MODEL_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 hover:shadow-xl dark:hover:shadow-cyan-500/5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header: Title, Badge, Status */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  {tool.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{tool.status}</span>
                </div>
              </div>

              {/* Model/Tool Name & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>

              {/* Specifications: Supported Input, Architecture, Precision */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Supported Input:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">{tool.supportedInput}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Architecture:</span>
                    <span className="text-slate-600 dark:text-slate-300">{tool.architecture.slice(0, 22)}...</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Precision:</span>
                    <span className="text-slate-600 dark:text-slate-300">{tool.precision}</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-cyan-700 dark:text-cyan-300 font-bold">
                  Benchmark: {tool.benchmarkMetric}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            {onSelectModelTask && (
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Latency: ~{tool.latencyMs}ms</span>
                <button
                  onClick={() => onSelectModelTask(tool.taskType)}
                  className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 hover:underline active:scale-95 transition-transform"
                >
                  <span>Launch Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
