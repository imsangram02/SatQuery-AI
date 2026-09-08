import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, CheckCircle2, Terminal, Clock, ShieldCheck } from 'lucide-react';
import { AnalysisResultData } from '../../types';

interface ExecutionSummaryProps {
  summary: AnalysisResultData['executionSummary'];
  confidence: number;
}

export const ExecutionSummary: React.FC<ExecutionSummaryProps> = ({ summary, confidence }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/25 overflow-hidden shadow-md">
      {/* Header: Click to toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              How SatQuery AI analyzed this
            </h4>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Autonomous agentic dispatch and inference trace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{summary.status} ({summary.latencyMs} ms)</span>
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expandable Body (Section 22 of design.md) */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Task */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Task:</span>
              <span className="text-slate-900 dark:text-white font-bold">{summary.task}</span>
            </div>

            {/* Input Summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Input:</span>
              <span className="text-slate-900 dark:text-white font-bold">{summary.inputSummary}</span>
            </div>
          </div>

          {/* Selected Tools */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Selected Tools / Models:</span>
            <div className="flex flex-wrap gap-2">
              {summary.selectedTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/25"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Execution Pipeline:</span>
            <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/40">
              {summary.pipeline.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">→</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Status: {summary.status}</span>
              <span>•</span>
              <span>Inference: {summary.latencyMs} ms</span>
              <span>•</span>
              <span>Calibrated Confidence: {confidence}%</span>
            </div>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
              Deterministic & Reproducible
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
