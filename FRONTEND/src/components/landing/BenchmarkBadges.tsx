import React, { useState } from 'react';
import { 
  Award, 
  Zap, 
  Target, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { MOCK_BENCHMARKS } from '../../data/mockData';
import { BenchmarkItem } from '../../types';

export const BenchmarkBadges: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string>('all');

  const tasks = [
    { id: 'all', label: 'All Benchmarks' },
    { id: 'Land Cover Segmentation', label: 'Land Cover Segmentation' },
    { id: 'Deforestation & Canopy Loss', label: 'Deforestation & Canopy' },
    { id: 'Surface Water & Flood Extent', label: 'Flood Extent (SAR)' }
  ];

  const filteredBenchmarks = selectedTask === 'all'
    ? MOCK_BENCHMARKS
    : MOCK_BENCHMARKS.filter(b => b.task.toLowerCase().includes(selectedTask.toLowerCase()));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Benchmark Badges Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5 text-teal-500" />
          Verified SOTA Benchmarks (2026)
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for Earth Observation Precision
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Evaluated against SpaceNet 8, DynamicWorld, and PRODES multi-spectral validation splits with sub-second distributed inference.
        </p>
      </div>

      {/* Top Benchmark Metric Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {/* Badge 1: mIoU */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Mean IoU</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            89.4%
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            +14.2% over generic SAM-v2
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            SpaceNet 8 multi-class validation
          </div>
        </div>

        {/* Badge 2: Inference Latency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Inference Latency</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            18.2 ms
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            1024×1024 multi-band tile
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            NVIDIA H100 TensorRT-LLM engine
          </div>
        </div>

        {/* Badge 3: F1-Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Zero-Shot F1</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            0.958
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Canopy deforestation detection
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            PRODES Brazilian Amazon ground-truth
          </div>
        </div>

        {/* Badge 4: Ground Sample Distance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">GSD Resolution</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            0.3m – 30m
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            Multi-constellation support
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            Sub-meter optical + C-Band SAR
          </div>
        </div>
      </div>

      {/* Interactive Benchmark Comparison Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Model Performance Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct comparison between SatQuery foundation architectures and generic computer vision baselines.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  selectedTask === task.id
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3.5 px-4 font-semibold">Model Architecture</th>
                <th className="py-3.5 px-4 font-semibold">Target Task</th>
                <th className="py-3.5 px-4 font-semibold">Validation Benchmark</th>
                <th className="py-3.5 px-4 font-semibold">Mean IoU</th>
                <th className="py-3.5 px-4 font-semibold">F1-Score</th>
                <th className="py-3.5 px-4 font-semibold">Latency</th>
                <th className="py-3.5 px-4 font-semibold">Supported GSD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {filteredBenchmarks.map((b) => {
                const isSatQuery = b.model.startsWith('SatQuery');
                return (
                  <tr
                    key={b.id}
                    className={`transition-colors ${
                      isSatQuery
                        ? 'bg-teal-500/[0.03] dark:bg-teal-500/[0.05] hover:bg-teal-500/[0.07]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      {isSatQuery && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      )}
                      <span className={isSatQuery ? 'font-bold text-teal-600 dark:text-teal-400' : ''}>
                        {b.model}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {b.task}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {b.dataset}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={isSatQuery ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}>
                        {b.mIoU.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {b.f1Score.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {b.latencyMs} ms
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {b.resolutionGSD}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
