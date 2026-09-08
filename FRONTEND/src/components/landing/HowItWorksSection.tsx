import React, { useState } from 'react';
import { UploadCloud, MessageSquare, BrainCircuit, Cpu, FileCheck2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // default highlighting Agent Understanding

  const steps = [
    {
      step: '01',
      title: 'Upload',
      subtitle: 'Satellite Image(s)',
      icon: UploadCloud,
      detail: 'Drag and drop single, bi-temporal, or multi-modal Optical and SAR GeoTIFFs, TIFFs, or supported benchmark PNG/JPEGs. Dimensions and CRS bounds are parsed automatically.',
      badge: 'STAC & GeoTIFF'
    },
    {
      step: '02',
      title: 'Ask',
      subtitle: 'Natural Language Query',
      icon: MessageSquare,
      detail: 'Type any natural language prompt such as "What type of land cover is visible?" or "Has the built-up area increased?" without needing GIS syntax.',
      badge: 'Zero-Code Prompt'
    },
    {
      step: '03',
      title: 'Understand',
      subtitle: 'AI Agent identifies task',
      icon: BrainCircuit,
      detail: 'The autonomous Agentic Controller inspects your query and images to classify the task: VQA, Scene Description, Grounding, Change Analysis, or Cross-Modal Fusion.',
      badge: 'Intent Classification'
    },
    {
      step: '04',
      title: 'Analyze',
      subtitle: 'Specialized RS model',
      icon: Cpu,
      detail: 'Dispatches task execution to specialized remote-sensing foundation models (e.g. RS-Grounder, Siamese Temporal ResNet, or Radar InSAR Hydrology) running on TensorRT.',
      badge: 'Specialist Dispatch'
    },
    {
      step: '05',
      title: 'Explain',
      subtitle: 'Answer + Visual Evidence',
      icon: FileCheck2,
      detail: 'Synthesizes concise answers grounded in quantitative evidence: interactive split-sliders, bounding boxes, highlighted change heatmaps, confidence score, and full execution traces.',
      badge: 'Observable Evidence'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit className="w-3.5 h-3.5 text-teal-500" />
          Seamless End-to-End Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          From Question to Insight
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          How SatQuery AI transforms raw multi-spectral raster inputs and conversational prompts into evidence-grounded geospatial intelligence in five streamlined steps.
        </p>
      </div>

      {/* 5-Step Visual Workflow Grid (Section 5 of design.md) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-16 left-12 right-12 h-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 opacity-20 pointer-events-none" />

        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeStep === index;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative select-none ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/15 -translate-y-1'
                  : 'bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:-translate-y-0.5'
              }`}
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {item.step}
                </span>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-400/40 scale-110'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.3]" />
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {item.detail}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 dark:text-slate-500">{item.badge}</span>
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
