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
      detail: 'Drag and drop single, bi-temporal, or multi-modal Optical and SAR GeoTIFFs or TIFFs. Dimensions and CRS bounds are parsed automatically.',
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
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-[#263B5C]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-[#22D3EE] border border-cyan-500/25 font-mono text-xs font-semibold uppercase tracking-wider">
          Seamless End-to-End Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F7FF] tracking-tight">
          From Question to Insight
        </h2>
        <p className="text-slate-600 dark:text-[#A8B6CF] text-sm sm:text-base leading-relaxed">
          How SatQuery AI transforms raw multi-spectral raster inputs and conversational prompts into evidence-grounded geospatial intelligence in five streamlined steps.
        </p>
      </div>

      {/* 5-Step Visual Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-16 left-12 right-12 h-0.5 bg-gradient-to-r from-[#5B8CFF] via-[#7C6CFF] to-[#22D3EE] opacity-30 pointer-events-none" />

        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeStep === index;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative select-none ${
                isActive
                  ? 'bg-blue-50/90 dark:bg-[#101F38] border-2 border-blue-500 dark:border-[#5B8CFF] shadow-xl shadow-blue-500/15 dark:shadow-[#5B8CFF]/20 -translate-y-1'
                  : 'bg-white dark:bg-[#101F38] hover:bg-slate-50 dark:hover:bg-[#152A48] border border-slate-200 dark:border-[#263B5C] hover:border-blue-400 dark:hover:border-[#5B8CFF]/40 hover:-translate-y-0.5 shadow-sm'
              }`}
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-blue-600 dark:bg-[#5B8CFF] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0B1930] text-slate-700 dark:text-[#A8B6CF] border border-slate-200 dark:border-[#263B5C]'
                }`}>
                  {item.step}
                </span>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? 'bg-blue-500/15 dark:bg-[#5B8CFF]/20 text-blue-600 dark:text-[#5B8CFF] border border-blue-500/30 dark:border-[#5B8CFF]/40 scale-105'
                    : 'bg-slate-100 dark:bg-[#0B1930] text-slate-600 dark:text-[#A8B6CF] group-hover:text-blue-600 dark:group-hover:text-[#5B8CFF]'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.3]" />
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FF] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-700 dark:text-[#22D3EE] font-mono">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-[#A8B6CF] leading-relaxed pt-1">
                  {item.detail}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#263B5C] flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 dark:text-[#A8B6CF]">{item.badge}</span>
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#2DD4BF]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
