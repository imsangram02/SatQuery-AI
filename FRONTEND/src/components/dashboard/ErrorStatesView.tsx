import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileWarning, 
  RefreshCw, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { MOCK_ERROR_SCENARIOS } from '../../data/mockData';
import { ErrorScenario } from '../../types';

interface ErrorStatesViewProps {
  onResolveToWorkspace?: () => void;
}

export const ErrorStatesView: React.FC<ErrorStatesViewProps> = ({ onResolveToWorkspace }) => {
  const [activeError, setActiveError] = useState<ErrorScenario>(MOCK_ERROR_SCENARIOS[0]);
  const [isResolved, setIsResolved] = useState(false);

  const handleSimulateResolution = () => {
    setIsResolved(true);
    setTimeout(() => {
      setIsResolved(false);
      if (onResolveToWorkspace) {
        onResolveToWorkspace();
      }
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Diagnostic & Resiliency Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
          Error States & Graceful Recovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          SatQuery AI never leaves the user stranded with generic "Something went wrong" messages. Explore all 7 deterministic failure modes and actionable remedies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Error Scenario Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Simulate Failure Modes (Section 26)
          </span>

          {MOCK_ERROR_SCENARIOS.map((scenario) => {
            const isSelected = activeError.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  setActiveError(scenario);
                  setIsResolved(false);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/50 text-slate-950 dark:text-white shadow-sm ring-1 ring-rose-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileWarning className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold truncate">{scenario.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase ml-2 flex-shrink-0">
                  {scenario.type.split('-')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 8 cols: Active Diagnostic & Recovery Panel */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-500/30 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400">
                  Diagnostic Exception Detected
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeError.errorMessage}
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
              Code: {activeError.type}
            </span>
          </div>

          {/* Diagnostic Root Cause */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Automated Root Cause Diagnostics:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeError.diagnosticDetail}
            </p>
          </div>

          {/* Suggested Resolution Step */}
          <div className="p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-300 block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Recommended Operator Action:</span>
            </span>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
              {activeError.suggestedFix}
            </p>
          </div>

          {/* Remediation Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Deterministic fallback path ready for automatic re-routing.
            </div>

            <button
              onClick={handleSimulateResolution}
              disabled={isResolved}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                isResolved
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white'
              }`}
            >
              {isResolved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>Applied: Auto-Repaired Pipeline!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>{activeError.remediationAction}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
