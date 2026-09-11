import React from 'react';
import { Sparkles, Compass, ArrowRight, Satellite, ShieldCheck, Layers } from 'lucide-react';

interface LandingCTAProps {
  onLaunchApp: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onLaunchApp }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="relative rounded-3xl bg-slate-900 border border-slate-700/80 p-8 sm:p-14 text-white text-center shadow-2xl overflow-hidden group">
        {/* Top Radiant Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300">
            <Satellite className="w-4 h-4 text-blue-400" />
            <span>Autonomous Remote Sensing Platform</span>
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
              className="px-8 py-4 rounded-xl btn-gradient text-base flex items-center justify-center shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Launch SatQuery AI</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
