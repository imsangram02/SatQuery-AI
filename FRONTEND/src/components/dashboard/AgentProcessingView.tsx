import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, Cpu } from 'lucide-react';
import { AgentProcessStep } from '../../types';

interface AgentProcessingViewProps {
  currentStepIndex: number;
  steps: AgentProcessStep[];
  selectedTask?: string;
  selectedModel?: string;
}

export const AgentProcessingView: React.FC<AgentProcessingViewProps> = ({
  currentStepIndex,
  steps,
  selectedTask,
  selectedModel
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-cyan-400/50 shadow-xl dark:shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6 animate-in fade-in duration-300">
      {/* Title & Agent Activity */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center border border-cyan-400/30">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Agentic Orchestration in Progress</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Autonomous task identification and specialist model execution
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400">
          <span>TensorRT Backend</span>
        </div>
      </div>

      {/* Actual Step-by-Step Agentic Workflow (Section 19 of design.md) */}
      <div className="space-y-3 font-mono text-xs max-w-xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Analyzing request...
        </div>

        {steps.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-400 text-slate-900 dark:text-white shadow-sm ring-1 ring-cyan-400/30'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                )}

                <div>
                  <span className={`font-semibold ${isCurrent ? 'font-bold' : ''}`}>
                    {isDone ? `✓ ${step.title}` : isCurrent ? `● ${step.title}` : `○ ${step.title}`}
                  </span>
                  {step.detail && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {step.detail}
                    </span>
                  )}
                </div>
              </div>

              {isDone && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Verified
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] text-cyan-600 dark:text-cyan-300 font-bold uppercase animate-pulse">
                  Processing
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Dispatched Model Notification Pill */}
      {selectedModel && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
          <span>Active Specialist: <strong className="text-cyan-600 dark:text-cyan-400">{selectedModel}</strong></span>
          <span>Task: <strong className="text-teal-600 dark:text-teal-400">{selectedTask || 'VQA'}</strong></span>
        </div>
      )}
    </div>
  );
};
