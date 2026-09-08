import React, { useState } from 'react';
import { Cpu, ArrowDown, Sparkles, MessageSquare, Database, CheckCircle2, ShieldAlert, Zap, Network } from 'lucide-react';

export const AgenticArchitectureSection: React.FC = () => {
  const [selectedDemoQuery, setSelectedDemoQuery] = useState<'vqa' | 'grounding' | 'change' | 'optical-sar'>('change');

  const queryExamples = {
    'change': {
      query: '"Has the built-up area increased between 2022 and 2025?"',
      task: 'Change-based VQA',
      modelsDispatched: ['Temporal Siamese ResNet Change Detector', 'Remote-Sensing Vision-Language Model (RS-VLM)'],
      reason: 'Bi-temporal inputs detected + comparative trend question -> Requires joint change extraction & language synthesis'
    },
    'grounding': {
      query: '"Highlight the water reservoir and spillway perimeter."',
      task: 'Visual Grounding & Localization',
      modelsDispatched: ['RS-Grounder Zero-Shot Grounding Model', 'NDWI Spectral Water Indexer'],
      reason: 'Single image + referential expression ("Highlight the...") -> Requires spatial coordinate bounding & polygon mask extraction'
    },
    'optical-sar': {
      query: '"Identify built-up and water-covered regions using both images."',
      task: 'Optical + SAR Fusion',
      modelsDispatched: ['Radar-Optical Fusion Transformer', 'InSAR Flood Inundation Detector'],
      reason: 'Dual multi-sensor inputs (RGB + SAR C-Band) -> Dispatches cross-modal feature alignment & radar backscatter fusion'
    },
    'vqa': {
      query: '"What percentage of land cover is active cropland?"',
      task: 'Categorical VQA & Scene Analysis',
      modelsDispatched: ['Remote-Sensing Vision-Language Model (RS-VLM)', 'DynamicWorld Land Cover Segmenter'],
      reason: 'Single multi-spectral tile + statistical proportion query -> Triggers land cover classification and reasoning engine'
    }
  };

  const activeDemo = queryExamples[selectedDemoQuery];

  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Network className="w-3.5 h-3.5 text-cyan-500" />
          Autonomous Multi-Model Orchestration
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          One Agent. Multiple Specialist Models.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Instead of relying on one generic model for every task, SatQuery AI selects the appropriate remote-sensing specialist model based on the user's query and available imagery.
        </p>
      </div>

      {/* Main Architecture Diagram Container (Section 7 of design.md) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Interactive Query Simulator for Architecture */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold mb-2.5 flex items-center justify-between">
            <span>Try an interactive prompt to see the Agentic Controller in action:</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">Dynamic Dispatch Simulation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedDemoQuery('change')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedDemoQuery === 'change'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              Change VQA
            </button>
            <button
              onClick={() => setSelectedDemoQuery('grounding')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedDemoQuery === 'grounding'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              Visual Grounding
            </button>
            <button
              onClick={() => setSelectedDemoQuery('optical-sar')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedDemoQuery === 'optical-sar'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              Optical + SAR
            </button>
            <button
              onClick={() => setSelectedDemoQuery('vqa')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedDemoQuery === 'vqa'
                  ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              Land-Cover VQA
            </button>
          </div>
        </div>

        {/* FLOW GRAPH */}
        <div className="max-w-3xl mx-auto space-y-5 text-center relative z-10">
          {/* Node 1: User Natural Language Query */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-cyan-500/40 shadow-md inline-block max-w-lg mx-auto w-full">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Step 1: Input</div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span>User Query: {activeDemo.query}</span>
            </div>
          </div>

          <div className="flex justify-center text-cyan-500 dark:text-cyan-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Node 2: The Agentic Controller */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-indigo-500/20 border-2 border-cyan-400 shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.25)] inline-block max-w-xl mx-auto w-full">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                SatQuery AI Agent / Controller
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
              Identified Task: <strong className="text-cyan-600 dark:text-cyan-300">{activeDemo.task}</strong>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {activeDemo.reason}
            </p>
          </div>

          <div className="flex justify-center text-cyan-500 dark:text-cyan-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Node 3: Specialized Remote-Sensing Models Cluster */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-xl border transition-all text-left ${
              activeDemo.modelsDispatched.some(m => m.includes('VQA') || m.includes('Land Cover'))
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-md ring-2 ring-cyan-400/40 scale-105'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold">Specialist 01</div>
              <div className="text-xs font-bold mt-0.5">RS-VLM & Captioning</div>
              <div className="text-[10px] font-mono mt-1">EarthQA / RSVQA</div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all text-left ${
              activeDemo.modelsDispatched.some(m => m.includes('Grounder') || m.includes('NDWI'))
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-md ring-2 ring-cyan-400/40 scale-105'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold">Specialist 02</div>
              <div className="text-xs font-bold mt-0.5">RS-Grounder Specialist</div>
              <div className="text-[10px] font-mono mt-1">Bounding Box & Polygon</div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all text-left ${
              activeDemo.modelsDispatched.some(m => m.includes('Change') || m.includes('Temporal'))
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-md ring-2 ring-cyan-400/40 scale-105'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold">Specialist 03</div>
              <div className="text-xs font-bold mt-0.5">Bi-Temporal Siamese Net</div>
              <div className="text-[10px] font-mono mt-1">LEVIR-CD / OSCD</div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all text-left ${
              activeDemo.modelsDispatched.some(m => m.includes('Fusion') || m.includes('Radar'))
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-900 dark:text-cyan-200 shadow-md ring-2 ring-cyan-400/40 scale-105'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase font-bold">Specialist 04</div>
              <div className="text-xs font-bold mt-0.5">Optical + SAR Radar Fusion</div>
              <div className="text-[10px] font-mono mt-1">SEN12-Flood InSAR</div>
            </div>
          </div>

          <div className="flex justify-center text-teal-500 dark:text-teal-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Node 4: Result Integrator & Verifier */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-teal-500/40 shadow-md inline-block max-w-lg mx-auto w-full">
            <div className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold mb-0.5">
              Step 4: Integration
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Evidence Integrator & Quantitative Validator
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Correlates specialist tensors, computes confidence metrics, and generates execution summary
            </div>
          </div>

          <div className="flex justify-center text-emerald-500">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Node 5: Output */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500/50 shadow-lg inline-block max-w-xl mx-auto w-full text-emerald-950 dark:text-emerald-100">
            <div className="flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Grounded Natural-Language Answer + Visual Evidence Mask</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
