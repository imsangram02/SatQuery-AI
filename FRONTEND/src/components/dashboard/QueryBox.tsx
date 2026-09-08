import React from 'react';
import { Sparkles, MessageSquare, HelpCircle } from 'lucide-react';

interface QueryBoxProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const QueryBox: React.FC<QueryBoxProps> = ({
  query,
  onChangeQuery,
  onAnalyze,
  isProcessing,
  disabled = false
}) => {
  const suggestedQueries = [
    'Describe the land-cover in this image.',
    'Highlight the water body.',
    'What changed between these two dates?',
    'Has the built-up area increased?',
    'Identify built-up and water-covered regions using optical and SAR imagery.'
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isProcessing && !disabled) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor="query-textarea" className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
          <MessageSquare className="w-4 h-4 text-cyan-500" />
          <span>Natural Language Query</span>
        </label>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px]">Enter ↵</kbd> to analyze
        </span>
      </div>

      {/* Large Query Text Area & Action Button (Section 18 of design.md) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus-within:border-cyan-400 dark:focus-within:border-cyan-400 shadow-md transition-all">
        <textarea
          id="query-textarea"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || disabled}
          placeholder="Ask a question about your satellite imagery..."
          rows={3}
          className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none leading-relaxed"
        />

        {/* Action Button Strip */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="hidden sm:inline">Agent will autonomously route to specialist model</span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!query.trim() || isProcessing || disabled}
            className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-md ${
              query.trim() && !isProcessing && !disabled
                ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer -translate-y-0.5'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>✦ Analyze with SatQuery AI</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries Chips (Section 18 of design.md) */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Suggested queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((suggested, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChangeQuery(suggested)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all text-left"
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
