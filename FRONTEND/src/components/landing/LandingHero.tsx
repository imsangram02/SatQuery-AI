import React from 'react';
import { 
  Scan
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';
import deepSpaceSatelliteHero from '../../assets/deep_space_satellite_hero.jpg';

interface LandingHeroProps {
  onLaunchApp: () => void;
  onExploreFeatures?: () => void;
  onExploreCapabilities?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onExploreFeatures,
  onExploreCapabilities,
}) => {
  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden border-b border-[#263B5C]">
      {/* ========================================================================= */}
      {/* REALISTIC DEEP SPACE SATELLITE BACKGROUND WITH SOLAR GLARE & CONTRAST     */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Realistic Deep Space Image with Orbiting Satellite (Framing the Right Side, 85% Center) with Floating Zero-G Drift */}
        <div 
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] opacity-25 sm:opacity-35 md:opacity-75 lg:opacity-95 transition-opacity duration-500 animate-satellite-drift"
          style={{
            backgroundImage: `url(${deepSpaceSatelliteHero})`,
            backgroundSize: 'cover',
            backgroundPosition: '85% center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Shimmering specular sweep across the solar panel surfaces */}
          <div className="solar-panel-shimmer" aria-hidden="true" />
        </div>

        {/* Deep Space Dark Contrast Mask (Horizontal Left-to-Right: 100% sharp text contrast on left/center) */}
        <div 
          className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(5, 8, 17, 0.98) 0%, rgba(5, 8, 17, 0.90) 38%, rgba(5, 8, 17, 0.65) 65%, rgba(5, 8, 17, 0.18) 100%)'
          }}
        />

        {/* Light Mode Contrast Mask */}
        <div 
          className="absolute inset-0 w-full h-full opacity-100 dark:opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.88) 40%, rgba(248, 250, 252, 0.5) 70%, rgba(248, 250, 252, 0.15) 100%)'
          }}
        />

        {/* Vertical Top-to-Bottom Gradient for Seamless Boundary Blending */}
        <div 
          className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(5, 8, 17, 0.5) 0%, rgba(5, 8, 17, 0.15) 30%, rgba(5, 8, 17, 0.75) 75%, #050811 100%)'
          }}
        />

        {/* Light Mode Vertical Gradient */}
        <div 
          className="absolute inset-0 w-full h-full opacity-100 dark:opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.7) 0%, transparent 30%, rgba(241, 245, 249, 0.6) 75%, #F8FAFC 100%)'
          }}
        />

        {/* Soft Top-Right Corner Spotlight / Solar Glare matching the right-positioned satellite (Pulsing 5s) */}
        <div 
          className="absolute -top-12 -right-8 w-[650px] h-[650px] pointer-events-none animate-solar-glare opacity-40 dark:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 80% 25%, rgba(255, 255, 255, 0.25) 0%, rgba(79, 172, 254, 0.18) 28%, rgba(0, 242, 254, 0.08) 52%, transparent 72%)',
            filter: 'blur(35px)'
          }}
        />

        {/* Edge Vignette to keep focus centered on the Headline and Telemetry */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse 95% 80% at 50% 35%, transparent 45%, rgba(5,8,17,0.65) 100%)'
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* User-Friendly Announcement Pill (0.2s staggered entrance delay) */}
        <RevealOnScroll direction="up" delay={200} duration={800}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#101F38] border border-slate-200 dark:border-[#263B5C] text-xs font-mono text-slate-600 dark:text-[#A8B6CF] shadow-sm backdrop-blur-sm">
              <span className="font-semibold text-slate-900 dark:text-[#F5F7FF]">Autonomous Vision-Language Assistant</span>
              <span className="text-slate-300 dark:text-[#263B5C]">•</span>
              <span className="text-cyan-600 dark:text-[#22D3EE] font-semibold">Remote Sensing AI</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Hero Headings with Ambient Radial Light Flare */}
        <div className="relative text-center max-w-4xl mx-auto space-y-4 mb-10">
          {/* Ambient Radial Light Flare behind the main headline */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#4facfe]/22 via-[#00f2fe]/14 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Headline Entrance (0.4s staggered entrance delay) */}
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-[#F5F7FF] leading-[1.12]">
              Ask Questions.{' '}
              <span className="theme-heading-gradient block sm:inline font-black">
                Understand Satellite Imagery.
              </span>
            </h1>
          </RevealOnScroll>

          {/* Subtitle Entrance (0.6s staggered entrance delay) */}
          <RevealOnScroll direction="up" delay={600} duration={800}>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#A8B6CF] leading-relaxed max-w-2xl mx-auto font-normal mt-4">
              SatQuery AI is an agentic Vision-Language Assistant that understands natural-language queries and analyzes remote-sensing imagery using specialized AI models.
            </p>
          </RevealOnScroll>

          {/* Primary and Secondary Action CTAs with Soft Glow (0.8s staggered entrance delay) */}
          <RevealOnScroll direction="up" delay={800} duration={800}>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchApp}
                className="px-7 py-3.5 rounded-xl btn-gradient text-sm flex items-center justify-center group shadow-md shadow-[#5B8CFF]/20 hover:shadow-lg hover:shadow-[#5B8CFF]/35"
              >
                <span>Launch SatQuery AI</span>
              </button>

              <button
                onClick={onExploreFeatures || onExploreCapabilities}
                className="px-6 py-3.5 rounded-xl btn-secondary font-semibold text-sm flex items-center justify-center"
              >
                <span>Explore Features</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* HERO SOPHISTICATED VISUAL: WORKFLOW TELEMETRY PANEL */}
        <RevealOnScroll direction="up" delay={250} duration={1000} threshold={0.08} className="max-w-5xl mx-auto mt-6 relative">
          {/* Ambient Radial Light Flare behind the telemetry card */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#4facfe]/22 via-[#00f2fe]/16 to-[#7c6cff]/22 blur-2xl rounded-3xl -z-10 pointer-events-none opacity-90" />
          <div className="rounded-2xl bg-white/95 dark:bg-[#0B1930]/90 backdrop-blur-xl border border-slate-200 dark:border-[#263B5C] shadow-2xl shadow-slate-300/40 dark:shadow-[#071426]/80 overflow-hidden relative">
            {/* Faint Horizontal Scanning Laser Line (Sweeps every 4s) */}
            <div className="telemetry-scan-laser" aria-hidden="true" />

            {/* Top Interactive HUD Bar */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50/90 dark:bg-[#071426]/80 border-b border-slate-200 dark:border-[#263B5C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2 text-[#5B8CFF] font-bold">
                <Scan className="w-4 h-4 text-[#5B8CFF]" />
                <span className="text-slate-900 dark:text-[#F5F7FF]">AGENTIC WORKFLOW TELEMETRY • MULTI-SENSOR REASONING</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-[#A8B6CF] text-[11px]">
                <span>Sensor: Sentinel-2 BOA + Sentinel-1 SAR</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-[#2DD4BF] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00ff88] animate-active-pipeline" />
                  Active Pipeline
                </span>
              </div>
            </div>

            {/* Workflow Progression Visual Banner: 4 Stages with Distinct Accents */}
            <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-[#071426]/40 border-b border-slate-200 dark:border-[#263B5C] relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {/* Stage 01: INPUT (Blue) */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white dark:bg-[#101F38] border border-blue-200 dark:border-[#5B8CFF]/30 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-[#5B8CFF] font-bold uppercase mb-1">01 Input</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FF]">Satellite Imagery</div>
                  <div className="text-[11px] text-slate-600 dark:text-[#A8B6CF] mt-0.5">Optical RGB + SAR Radar</div>
                </div>

                {/* Stage 02: QUERY (Violet) */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white dark:bg-[#101F38] border border-purple-200 dark:border-[#7C6CFF]/30 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-purple-600 dark:text-[#7C6CFF] font-bold uppercase mb-1">02 Query</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FF]">Natural Language</div>
                  <div className="text-[11px] text-slate-600 dark:text-[#A8B6CF] mt-0.5">"Has built-up area increased?"</div>
                </div>

                {/* Stage 03: AI AGENT (Orange/Amber) */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white dark:bg-[#101F38] border border-amber-200 dark:border-[#F5B942]/35 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-amber-600 dark:text-[#F5B942] font-bold uppercase mb-1">03 AI Agent</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FF]">Model Selection</div>
                  <div className="text-[11px] text-slate-600 dark:text-[#A8B6CF] mt-0.5">Dispatches 2 Specialist Models</div>
                </div>

                {/* Stage 04: RESULT (Cyan/Green) */}
                <div className="pipeline-step-card p-3.5 rounded-xl bg-white dark:bg-[#101F38] border border-teal-200 dark:border-[#2DD4BF]/35 shadow-xs cursor-pointer">
                  <div className="text-[10px] font-mono text-teal-600 dark:text-[#2DD4BF] font-bold uppercase mb-1">04 Result</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FF]">Evidence + Answer</div>
                  <div className="text-[11px] text-slate-600 dark:text-[#A8B6CF] mt-0.5">Change Heatmap + 91% Confidence</div>
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
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-[#A8B6CF]">
                      <span className="font-semibold text-slate-900 dark:text-[#F5F7FF]">Baseline (T0)</span>
                      <span>2022</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-200 dark:border-[#263B5C] flex items-end p-2.5 shadow-xs bg-[#101F38]"
                      style={{ background: 'linear-gradient(135deg, #071426 0%, #101F38 60%, #152A48 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-30" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 dark:bg-[#071426]/90 text-[10px] font-mono text-white border border-white/20 dark:border-[#263B5C]">
                        True Color Optical
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Post-Period Image */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-[#A8B6CF]">
                      <span className="font-semibold text-slate-900 dark:text-[#F5F7FF]">Comparison (T1)</span>
                      <span>2025</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-slate-200 dark:border-[#263B5C] flex items-end p-2.5 shadow-xs bg-[#101F38]"
                      style={{ background: 'linear-gradient(135deg, #071426 0%, #101F38 50%, #17325c 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-30" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 dark:bg-[#071426]/90 text-[10px] font-mono text-white border border-white/20 dark:border-[#263B5C]">
                        Urban Expansion
                      </div>
                    </div>
                  </div>

                  {/* Layer 3: AI Change Detection Mask */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-600 dark:text-[#F5B942] font-bold">
                      <span>Change Heatmap</span>
                      <span>+28.4%</span>
                    </div>
                    <div 
                      className="h-32 sm:h-40 rounded-xl relative overflow-hidden border border-amber-500/40 flex items-end p-2.5 shadow-xs bg-[#101F38]"
                      style={{ background: 'linear-gradient(135deg, #071426 0%, #7c2d12 40%, #b45309 70%, #dc2626 100%)' }}
                    >
                      <div className="absolute inset-0 geo-grid-pattern opacity-30" />
                      <div className="absolute top-3 left-3 right-3 bottom-8 border-2 border-dashed border-[#F5B942]/80 rounded-lg pointer-events-none" />
                      <div className="relative z-10 px-2 py-0.5 rounded bg-slate-950/80 dark:bg-[#071426]/90 border border-amber-400/40 text-[10px] font-mono text-amber-300 dark:text-[#F5B942] font-bold">
                        AI Change Vector
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-label metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#A8B6CF] pt-1">
                  <span>Target Area: Urban Development Sector</span>
                  <span>Spatial Res: 10m Ground Sample Distance</span>
                </div>
              </div>

              {/* Right 5 Columns: Agent Reasoning & Grounded Evidence Card */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50/90 dark:bg-[#101F38] border border-slate-200 dark:border-[#263B5C] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8B6CF]">Agentic Synthesis</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-[#2DD4BF]/15 text-emerald-700 dark:text-[#2DD4BF] font-mono text-[10px] font-bold border border-emerald-500/30 dark:border-[#2DD4BF]/30">
                    91% Confidence
                  </span>
                </div>

                {/* Query Display */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#263B5C] text-xs">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-[#A8B6CF] uppercase font-semibold">Input Query:</div>
                  <div className="font-semibold text-slate-900 dark:text-[#F5F7FF] mt-0.5">
                    "Has the built-up area increased?"
                  </div>
                </div>

                {/* Grounded Natural Language Answer */}
                <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-[#5B8CFF]/10 border border-blue-200/80 dark:border-[#5B8CFF]/30 text-xs space-y-1">
                  <div className="font-bold text-blue-700 dark:text-[#5B8CFF]">
                    Analysis Result:
                  </div>
                  <p className="text-slate-800 dark:text-[#F5F7FF] text-[11px] leading-relaxed">
                    Built-up and paved surface area has increased by <strong className="text-amber-600 dark:text-[#F5B942] font-bold">+28.4%</strong> between 2022 and 2025. Significant residential infrastructure expansion detected across the southern quadrant.
                  </p>
                </div>

                {/* Models selected by agent */}
                <div className="pt-2 border-t border-slate-200 dark:border-[#263B5C] flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-[#A8B6CF]">
                  <span>Selected Models:</span>
                  <span className="text-blue-700 dark:text-[#5B8CFF] font-bold">
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
