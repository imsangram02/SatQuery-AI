import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Layers, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Satellite, 
  Search,
  Scan,
  Maximize2
} from 'lucide-react';

interface LandingHeroProps {
  onLaunchApp: () => void;
  onExploreCapabilities: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onExploreCapabilities
}) => {
  return (
    <section id="home" className="relative pt-28 pb-20 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Geospatial Radar Pulse & Orbit Ring Atmospheric Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-teal-500/10 pointer-events-none" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Announcement Pill: SIH 2026 & ISRO Problem Statement */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 dark:border-cyan-500/40 text-xs font-mono text-cyan-800 dark:text-cyan-300 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <Satellite className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>SIH 2026 ISRO Problem Statement</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="font-semibold text-teal-600 dark:text-teal-300">Interactive Vision-Language Assistant</span>
          </div>
        </div>

        {/* Hero Headings based directly on design.md */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Ask Questions.{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-400 bg-clip-text text-transparent">
              Understand Satellite Imagery.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            SatQuery AI is an agentic Vision-Language Assistant that understands natural-language queries and analyzes remote-sensing imagery using specialized AI models.
          </p>

          {/* Primary and Secondary Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Compass className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Launch SatQuery AI</span>
              <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreCapabilities}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-cyan-500/30 font-semibold text-sm flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Explore Capabilities</span>
            </button>
          </div>

          {/* Verified Standards Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              CEOS & STAC v1.0 Validated
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              Optical + SAR Multi-Modal
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-purple-400" />
              Specialized Specialist Models
            </span>
          </div>
        </div>

        {/* HERO SOPHISTICATED VISUAL (Section 2 of design.md) */}
        {/* Demonstrates: Satellite Images + Natural Language Query -> AI Agent -> Specialized Models -> Evidence-Grounded Result */}
        <div className="max-w-5xl mx-auto mt-6">
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/90 dark:border-cyan-500/30 shadow-2xl dark:shadow-[0_0_50px_rgba(6,182,212,0.18)] backdrop-blur-xl overflow-hidden">
            {/* Top Interactive HUD Bar */}
            <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold">
                <Scan className="w-4 h-4 text-cyan-500 animate-pulse" />
                <span>AGENTIC WORKFLOW TELEMETRY • MULTI-SENSOR REASONING</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Sensor: Sentinel-2 L2A BOA + Sentinel-1 SAR</span>
                <span>•</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold">Active Pipeline</span>
              </div>
            </div>

            {/* Workflow Progression Visual Banner */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase mb-1">01 Input</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Multi-Modal Imagery</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Optical RGB + SAR Radar</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold uppercase mb-1">02 Prompt</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Natural Language Query</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">"Has built-up area increased?"</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-400/40 shadow-xs">
                  <div className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300 font-bold uppercase mb-1">03 Agent Selection</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Orchestration Controller</div>
                  <div className="text-[11px] text-cyan-700 dark:text-cyan-300 mt-0.5">Dispatches 2 Specialist Models</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-xs">
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold uppercase mb-1">04 Output</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Evidence-Grounded Result</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">Answer + Change Heatmap + 91%</div>
                </div>
              </div>
            </div>

            {/* Visual Canvas Comparison Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left 7 Columns: Multi-Layer Satellite Visual Preview */}
              <div className="lg:col-span-7 space-y-3">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Layer 1: Baseline Image */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Baseline (T0)</span>
                      <span>2022</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 flex items-end p-2.5 shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-40" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-200">
                        True Color BOA
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Post-Period Image */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Comparison (T1)</span>
                      <span>2025</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 flex items-end p-2.5 shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0369a1 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-40" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-200">
                        Urban Expansion
                      </div>
                    </div>
                  </div>

                  {/* Layer 3: AI Change Detection Mask */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      <span>Change Heatmap</span>
                      <span>+28.4%</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-cyan-500/50 flex items-end p-2.5 shadow-sm shadow-cyan-500/10"
                      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-30" />
                      {/* Highlighted Bounding Box */}
                      <div className="absolute top-3 left-3 right-3 bottom-8 border-2 border-dashed border-cyan-400/80 rounded-lg pointer-events-none" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 font-bold">
                        AI Change Vector
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-label metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                  <span>Region: Bengaluru Peri-Urban Corridor</span>
                  <span>Spatial Res: 10m Ground Sample Distance</span>
                </div>
              </div>

              {/* Right 5 Columns: Agent Reasoning & Grounded Evidence Card */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Agentic Synthesis</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    91% Confidence
                  </span>
                </div>

                {/* Query Display */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">Input Query:</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    "Has the built-up area increased?"
                  </div>
                </div>

                {/* Agent Answer */}
                <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Built-up area increased by +28.4% (+412.5 ha) in the northwest sector.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    14 new industrial complexes detected. Farmland conversion confirmed by NDVI spectral drift.
                  </p>
                </div>

                {/* Models Dispatched */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] font-mono">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">Specialist Models Used:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      Change Detection Model
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                      Remote-Sensing VQA Model
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Test Banner */}
            <div className="px-4 sm:px-6 py-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Zero GIS manual parameter tuning required. Natural language input to evidence-grounded insights.</span>
              </div>
              <button
                onClick={onLaunchApp}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Try Live in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
