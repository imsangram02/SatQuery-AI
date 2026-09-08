import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Satellite, 
  Scan
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface LandingHeroProps {
  onLaunchApp: () => void;
  onExploreCapabilities: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onExploreCapabilities
}) => {
  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* User-Friendly Announcement Pill (No Hackathon Jargon) */}
        <RevealOnScroll direction="down" delay={100} duration={1000}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-950/50 border border-blue-500/25 text-xs font-mono text-blue-700 dark:text-blue-300 shadow-xs">
              <Satellite className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">Autonomous Vision-Language Assistant</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Remote Sensing AI</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Hero Headings based directly on design.md */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <RevealOnScroll direction="up" delay={200} duration={1000}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Ask Questions.{' '}
              <span className="theme-heading-gradient font-black">
                Understand Satellite Imagery.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal mt-4">
              SatQuery AI is an agentic Vision-Language Assistant that understands natural-language queries and analyzes remote-sensing imagery using specialized AI models.
            </p>
          </RevealOnScroll>

          {/* Primary and Secondary Action CTAs with High-Engagement Hover */}
          <RevealOnScroll direction="up" delay={350} duration={1000}>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchApp}
                className="px-7 py-3.5 rounded-xl btn-gradient text-sm flex items-center gap-2 group"
              >
                <Compass className="w-4 h-4 stroke-[2.5]" />
                <span>Launch SatQuery AI</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={onExploreCapabilities}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 font-semibold text-sm flex items-center gap-2 shadow-xs hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Explore Capabilities</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* HERO SOPHISTICATED VISUAL (Section 2 of design.md) */}
        {/* Demonstrates: Satellite Images + Natural Language Query -> AI Agent -> Specialized Models -> Evidence-Grounded Result */}
        <RevealOnScroll direction="up" delay={250} duration={1000} threshold={0.08} className="max-w-5xl mx-auto mt-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden">
            {/* Top Interactive HUD Bar */}
            <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold">
                <Scan className="w-4 h-4 text-blue-500" />
                <span>AGENTIC WORKFLOW TELEMETRY • MULTI-SENSOR REASONING</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Sensor: Sentinel-2 BOA + Sentinel-1 SAR</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Pipeline</span>
              </div>
            </div>

            {/* Workflow Progression Visual Banner */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">01 Input</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Satellite Imagery</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Optical RGB + SAR Radar</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                  <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-1">02 Query</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Natural Language</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">"Has built-up area increased?"</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 shadow-xs">
                  <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase mb-1">03 AI Agent</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Model Selection</div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Dispatches 2 Specialist Models</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 shadow-xs">
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase mb-1">04 Result</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Evidence + Answer</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Change Heatmap + 91% Confidence</div>
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
                        True Color Optical
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
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      <span>Change Heatmap</span>
                      <span>+28.4%</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-amber-500/40 flex items-end p-2.5 shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #b45309 40%, #dc2626 70%, #ef4444 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-30" />
                      <div className="absolute top-3 left-3 right-3 bottom-8 border-2 border-dashed border-amber-400/80 rounded-lg pointer-events-none" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/90 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                        AI Change Vector
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-label metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                  <span>Target Area: Urban Development Sector</span>
                  <span>Spatial Res: 10m Ground Sample Distance</span>
                </div>
              </div>

              {/* Right 5 Columns: Agent Reasoning & Grounded Evidence Card */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Agentic Synthesis</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
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

                {/* Grounded Natural Language Answer */}
                <div className="p-3 rounded-lg bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/25 text-xs space-y-1">
                  <div className="font-bold text-blue-800 dark:text-blue-300">
                    Analysis Result:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    Built-up and paved surface area has increased by <strong className="text-amber-600 dark:text-amber-400 font-bold">+28.4%</strong> between 2022 and 2025. Significant residential infrastructure expansion detected across the southern quadrant.
                  </p>
                </div>

                {/* Models selected by agent */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Selected Models:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    Bi-Temporal ChangeNet + RS-VQA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};

export default LandingHero;
