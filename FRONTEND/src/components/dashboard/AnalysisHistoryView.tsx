import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Download
} from 'lucide-react';
import { MOCK_SAVED_REPORTS } from '../../data/mockData';
import { ReportItem } from '../../types';

interface AnalysisHistoryViewProps {
  onViewReport: (report: ReportItem) => void;
  onOpenInWorkspace?: (report: ReportItem) => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onViewReport,
  onOpenInWorkspace
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Change' | 'Grounding' | 'VQA' | 'Optical+SAR'>('All');

  const filteredReports = MOCK_SAVED_REPORTS.filter(item => {
    const matchesSearch = item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.task.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Change') return matchesSearch && item.task.includes('Change');
    if (selectedFilter === 'Grounding') return matchesSearch && item.task.includes('Grounding');
    if (selectedFilter === 'VQA') return matchesSearch && item.task.includes('VQA');
    if (selectedFilter === 'Optical+SAR') return matchesSearch && item.task.includes('SAR');
    return matchesSearch;
  });

  const handleDownloadSingle = (report: ReportItem) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SatQuery_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
          <History className="w-4 h-4 text-cyan-500" />
          <span>Operational Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
          Analysis History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review previous multi-spectral inference queries, model decisions, and visual evidence reports.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by query, task, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-cyan-400 outline-none font-mono text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
          {(['All', 'Change', 'Grounding', 'VQA', 'Optical+SAR'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-lg transition-all font-semibold whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table (Section 24 of design.md: Query, Task, Date, Confidence, View Result, Download Report) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Query</th>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredReports.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Query */}
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    "{row.query}"
                    <span className="block text-[11px] font-mono text-slate-500 font-normal mt-0.5">
                      {row.inputSummary}
                    </span>
                  </td>

                  {/* Task */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/20">
                      {row.task}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {row.date}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {row.confidence}%
                    </span>
                  </td>

                  {/* Actions: View Result & Download Report */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReport(row)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold transition-colors flex items-center gap-1 text-slate-700 dark:text-slate-300"
                        title="View Result Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Result</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSingle(row)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-cyan-400 hover:text-cyan-500 transition-colors text-slate-600 dark:text-slate-400"
                        title="Download Report JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
