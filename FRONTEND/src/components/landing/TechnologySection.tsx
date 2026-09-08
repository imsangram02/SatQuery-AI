import React from 'react';
import { Cpu, BrainCircuit, Network, Layers, FileCheck, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Remote-Sensing VLM',
      subtitle: 'Multimodal Vision-Language Core',
      desc: 'Foundation model tuned specifically on Earth observation spectral bands (BOA surface reflectance, NIR, SWIR) and spatial geometries, overcoming the domain gap of consumer image models.'
    },
    {
      icon: BrainCircuit,
      title: 'Specialist AI Models',
      subtitle: 'Task-Dedicated Architecture',
      desc: 'Dedicated deep models for Siamese temporal change detection, sub-meter visual grounding, SAR C-Band polarimetric decomposition, and crop phenology indexing.'
    },
    {
      icon: Network,
      title: 'Agentic Orchestration',
      subtitle: 'Autonomous Controller Dispatch',
      desc: 'Dynamic intent parsing engine that determines whether to trigger single-image VQA, bi-temporal change difference, or multi-modal radar fusion without manual user configuration.'
    },
    {
      icon: Layers,
      title: 'Multimodal Satellite Imagery',
      subtitle: 'Cross-Sensor Constellation Support',
      desc: 'Native ingestion of Copernicus Sentinel-2, Landsat-9, PlanetScope, Sentinel-1 SAR C-Band radar, and sub-meter panchromatic WorldView-3 imagery.'
    },
    {
      icon: FileCheck,
      title: 'Evidence-Grounded Results',
      subtitle: 'Verifiable Quantitative Analytics',
      desc: 'Every natural-language output is accompanied by vector masks, georeferenced bounding boxes, statistical delta summaries, and reproducible model execution traces.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          Core Research Pillars
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Research-Grade Technological Architecture
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Groundbreaking integration of multimodal vision-language intelligence with specialized remote-sensing analytical models.
        </p>
      </div>

      {/* 5 Technical Components Connected (Section 11 of design.md) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                  {pillar.title}
                </h3>
                <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                Pillar 0{i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
