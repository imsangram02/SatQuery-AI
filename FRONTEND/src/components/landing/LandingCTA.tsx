import React from 'react';
import { Sparkles, Compass, ArrowRight, Satellite, ShieldCheck, Layers } from 'lucide-react';

interface LandingCTAProps {
  onLaunchApp: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onLaunchApp }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#071328] via-[#0c1f42] to-[#082937] dark:from-[#061226] dark:via-[#0a1e3e] dark:to-[#072432] border border-cyan-500/40 p-8 sm:p-14 text-white text-center shadow-2xl overflow-hidden group">
        {/* Top Radiant Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

        {/* Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono text-cyan-300">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>SIH 2026 Interactive Remote Sensing Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Explore Satellite Imagery Through Natural Language.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload remote-sensing imagery, ask your question, and let SatQuery AI determine how to analyze it.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 font-extrabold text-base flex items-center gap-2.5 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_45px_rgba(34,211,238,0.8)] transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              <span>Launch SatQuery AI →</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Pre-loaded Benchmark Datasets Included
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              GeoTIFF & TIFF Drag-and-Drop
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
