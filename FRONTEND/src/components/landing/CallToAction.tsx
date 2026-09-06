import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Screen } from '../../types';

interface CallToActionProps {
  onNavigate: (screen: Screen) => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 geo-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            Instant Sandbox Access • No Credit Card Required
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Querying Planetary Data in Real Time
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect directly to Sentinel-2, Landsat-9, and PlanetScope STAC endpoints.
            Segment deforestation, wildfire scars, flood plains, and crop health in seconds.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('workspace')}
              className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/30 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3-Pane Geospatial Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-medium text-sm flex items-center gap-2 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>View Active Analytics Dashboard</span>
            </button>
          </div>

          <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              STAC v1.0.0 Ready
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              OGC WMS / COG Native
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
