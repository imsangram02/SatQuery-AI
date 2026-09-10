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
      <div className="border-b border-slate-200 dark:border-[#263B5C] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22D3EE] uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-[#22D3EE]" />
          <span>Autonomous AI Inventory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-[#F5F7FF] mt-1">
          Models & Tools Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B6CF] mt-1">
          Inspect the 6 specialized remote-sensing neural engines orchestrated by the SatQuery AI agent.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MODEL_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#101F38] border border-slate-200 dark:border-[#263B5C] hover:border-[#5B8CFF]/60 dark:hover:bg-[#152A48] hover:shadow-xl dark:hover:shadow-[#5B8CFF]/10 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header: Title, Badge, Status */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#5B8CFF]/10 text-[#5B8CFF] dark:text-[#22D3EE] border border-[#5B8CFF]/25">
                  {tool.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#2DD4BF] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span>{tool.status}</span>
                </div>
              </div>

              {/* Model/Tool Name & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FF] tracking-tight group-hover:text-[#5B8CFF] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8B6CF] leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>

              {/* Specifications: Supported Input, Architecture, Precision */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#263B5C] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-[#71819B] uppercase font-bold block">Supported Input:</span>
                  <span className="text-slate-700 dark:text-[#F5F7FF] font-semibold">{tool.supportedInput}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-[#71819B] uppercase block">Architecture:</span>
                    <span className="text-slate-600 dark:text-[#A8B6CF]">{tool.architecture.slice(0, 22)}...</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-[#71819B] uppercase block">Precision:</span>
                    <span className="text-slate-600 dark:text-[#A8B6CF]">{tool.precision}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1930] border border-slate-200 dark:border-[#263B5C] text-[11px] text-[#22D3EE] font-bold flex items-center justify-between">
                  <span className="text-slate-500 dark:text-[#71819B] font-normal">Benchmark</span>
                  <span>{tool.benchmarkMetric}</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            {onSelectModelTask && (
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#263B5C] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 dark:text-[#71819B]">Latency: ~{tool.latencyMs}ms</span>
                <button
                  onClick={() => onSelectModelTask(tool.taskType)}
                  className="flex items-center gap-1.5 font-bold text-[#5B8CFF] hover:text-[#22D3EE] active:scale-95 transition-all"
                >
                  <span>Launch Task</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
