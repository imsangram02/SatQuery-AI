import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Layers, 
  Clock, 
  Eye, 
  Satellite,
  ChevronRight
} from 'lucide-react';
import { RecentAnalysis, AOIPreset } from '../../types';
import { MOCK_ANALYSES, MOCK_AOI_PRESETS } from '../../data/mockData';

interface AnalysesTableProps {
  onOpenInWorkspace: (aoi: AOIPreset) => void;
}

export const AnalysesTable: React.FC<AnalysesTableProps> = ({ onOpenInWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Processing' | 'Flagged'>('All');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const filteredAnalyses = MOCK_ANALYSES.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aoiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpen = (analysis: RecentAnalysis) => {
    // Find matching preset or fallback to first
    const matchedPreset = MOCK_AOI_PRESETS.find(p => p.name.includes(analysis.aoiName.split(' ')[0])) || MOCK_AOI_PRESETS[0];
    onOpenInWorkspace(matchedPreset);
  };

  const handleDownloadGeoJson = (id: string) => {
    setDownloadSuccessId(id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2000);
  };

  return (
    <div className="relative rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#07152b] dark:via-[#09172f] dark:to-[#050d1a] border border-slate-200 dark:border-cyan-500/40 shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_0_12px_1px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_20px_rgba(6,182,212,0.1),0_10px_25px_-5px_rgba(0,0,0,0.55)] backdrop-blur-xl overflow-hidden">
      {/* Top Radiant Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-teal-400 via-blue-500 to-purple-500 opacity-80 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>

      {/* Table Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-cyan-500/30 bg-slate-50/80 dark:bg-gradient-to-r dark:from-[#081b33] dark:via-[#0a2040] dark:to-[#081729] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Geospatial Inferences & Runs
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated change detection logs and verified ground-truth runs.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by AOI or ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#050e1c] border border-slate-200 dark:border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 text-slate-900 dark:text-white outline-none font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.4),0_0_12px_rgba(6,182,212,0.08)] transition-all"
            />
          </div>

          {/* Status buttons */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-[#050e1c] p-1 border border-slate-200 dark:border-cyan-500/35 text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            {(['All', 'Completed', 'Processing', 'Flagged'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  statusFilter === status
                    ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/30 dark:to-teal-500/25 text-cyan-700 dark:text-cyan-300 dark:border dark:border-cyan-500/50 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#050d18] border-b border-slate-200 dark:border-cyan-500/25 text-slate-500 dark:text-slate-400 font-mono">
              <th className="py-3 px-4 font-semibold">Job ID & Analysis</th>
              <th className="py-3 px-4 font-semibold">Sensor / Platform</th>
              <th className="py-3 px-4 font-semibold">Area</th>
              <th className="py-3 px-4 font-semibold">Confidence</th>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-mono">
            {filteredAnalyses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No matching analyses found.
                </td>
              </tr>
            ) : (
              filteredAnalyses.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-cyan-500/[0.08] dark:hover:bg-cyan-500/[0.08] transition-colors"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
                        {item.id}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.aoiName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px]">
                      <Satellite className="w-3 h-3 text-teal-500" />
                      {item.sensor}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {item.areaKm2.toLocaleString()} km²
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {item.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.date}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {item.status === 'Processing' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing
                      </span>
                    )}
                    {item.status === 'Flagged' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged Review
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDownloadGeoJson(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        title="Download GeoJSON Polygons"
                      >
                        {downloadSuccessId === item.id ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleOpen(item)}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold flex items-center gap-1 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Canvas</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
