import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Cpu, 
  X, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { ReportItem } from '../../types';
import { MOCK_SAVED_REPORTS } from '../../data/mockData';

interface ReportsViewProps {
  customReports?: ReportItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ customReports = [] }) => {
  const allReports = [...customReports, ...MOCK_SAVED_REPORTS];
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(allReports[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReportJson = (report: ReportItem) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SatQuery_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>Document Generation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Saved Analysis Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate, preview, and download structured mission briefing dossiers for government and research stakeholders.
          </p>
        </div>
      </div>

      {/* Main Grid: Left List + Right Active Report Preview (Section 25 of design.md) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 cols: Reports List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Available Reports ({allReports.length})
          </div>

          <div className="space-y-2.5">
            {allReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-150 border text-left ${
                  selectedReport?.id === report.id
                    ? 'bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{report.task}</span>
                  <span className="text-slate-400">{report.date.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {report.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  "{report.query}"
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {report.confidence}% Conf.
                  </span>
                  <span className="text-slate-400">{report.executionTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 8 cols: Detailed Report Preview Document (Section 25 of design.md) */}
        {selectedReport ? (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-bold border border-cyan-500/20">
                  {selectedReport.task}
                </span>
                <span className="text-xs font-mono text-slate-500">ID: {selectedReport.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-xs font-mono font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>

                <button
                  onClick={() => handleDownloadReportJson(selectedReport)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON / Report</span>
                </button>
              </div>
            </div>

            {/* Document Header */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedReport.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Date: <strong>{selectedReport.date}</strong></span>
                <span>Latency: <strong>{selectedReport.executionTime}</strong></span>
                <span>Status: <strong className="text-emerald-500">{selectedReport.status}</strong></span>
              </div>
            </div>

            {/* 1. Query & Inputs (Section 25 requirement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">User Query:</span>
                <span className="text-slate-900 dark:text-white font-semibold">"{selectedReport.query}"</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Input Images:</span>
                <span className="text-slate-900 dark:text-white font-semibold">{selectedReport.inputSummary}</span>
              </div>
            </div>

            {/* 2. Analysis Answer & Confidence (Section 25 requirement) */}
            <div className="p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-700 dark:text-cyan-300">
                  Synthesized Answer
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                  {selectedReport.confidence}% Calibrated Confidence
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {selectedReport.answer}
              </p>
            </div>

            {/* 3. Visual Evidence Snapshot (Section 25 requirement) */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
                Visual Evidence Snapshot:
              </span>
              <div
                className="h-44 sm:h-52 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 p-4 flex flex-col justify-between"
                style={{ background: selectedReport.evidenceVisual || 'linear-gradient(135deg, #0f172a, #0369a1)' }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-40 pointer-events-none" />
                <span className="relative z-10 px-2.5 py-0.5 rounded bg-slate-950/80 text-xs font-mono text-slate-200 self-start">
                  Georeferenced Analytical Verification Mask
                </span>
                <span className="relative z-10 text-xs font-mono text-white font-bold bg-slate-950/90 px-3 py-1 rounded self-end">
                  Task Verification: {selectedReport.task}
                </span>
              </div>
            </div>

            {/* 4. Models Used & Execution Summary (Section 25 requirement) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Models / Tools Orchestrated:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.modelsUsed.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Certification: CEOS & NASA ARD Validated Pipeline</span>
                <span className="text-emerald-500 font-bold">Passed QA Audits</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-xs">
            Select a report on the left to view complete dossier
          </div>
        )}
      </div>
    </div>
  );
};
