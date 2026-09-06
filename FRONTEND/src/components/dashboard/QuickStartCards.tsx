import React from 'react';
import { 
  TreePine, 
  Waves, 
  Flame, 
  Wheat, 
  Building2, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { AOIPreset } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';

interface QuickStartCardsProps {
  onSelectPreset: (aoi: AOIPreset) => void;
}

export const QuickStartCards: React.FC<QuickStartCardsProps> = ({ onSelectPreset }) => {
  const cards = [
    {
      title: 'Land Cover Segmentation',
      subtitle: 'Zero-shot foundation segmentation across multi-spectral biomes',
      sensor: 'Sentinel-2 L2A',
      metric: '89.4% mIoU',
      icon: TreePine,
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      presetIndex: 0, // Amazon
      // Land Cover: Teal
      cardBg: 'bg-gradient-to-br from-teal-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#082933] dark:via-[#0a1c33] dark:to-[#061120]',
      borderStyle: 'border-teal-400/50 dark:border-teal-400/60 hover:border-teal-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(45,212,191,0.25),0_0_8px_1px_rgba(20,184,166,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_12px_rgba(20,184,166,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(45,212,191,0.5),0_0_12px_2px_rgba(20,184,166,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(20,184,166,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-teal-400 via-cyan-400 to-teal-500',
      iconStyle: 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/40 shadow-xs',
      orbGlow1: 'bg-teal-400/15',
      orbGlow2: 'bg-cyan-400/10',
      accentHover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400'
    },
    {
      title: 'Canopy Loss & Deforestation',
      subtitle: 'Bi-temporal drift tracking along illegal logging corridors',
      sensor: 'Sentinel-2 / Landsat-9',
      metric: 'F1: 0.958',
      icon: Flame,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      presetIndex: 2, // California / Wildfire
      // Canopy: Rose / Crimson
      cardBg: 'bg-gradient-to-br from-rose-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#311425] dark:via-[#191535] dark:to-[#081122]',
      borderStyle: 'border-rose-400/50 dark:border-rose-400/60 hover:border-rose-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(251,113,133,0.25),0_0_8px_1px_rgba(244,63,94,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_12px_rgba(244,63,94,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(251,113,133,0.5),0_0_12px_2px_rgba(244,63,94,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(244,63,94,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-rose-400 via-orange-400 to-rose-500',
      iconStyle: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 shadow-xs',
      orbGlow1: 'bg-rose-400/15',
      orbGlow2: 'bg-purple-500/10',
      accentHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400'
    },
    {
      title: 'Flood Inundation & SAR Mapping',
      subtitle: 'All-weather C-Band radar penetration of storm clouds and dykes',
      sensor: 'Sentinel-1 SAR (VV/VH)',
      metric: 'Depth > 1.2m',
      icon: Waves,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      presetIndex: 1, // Rhine
      // Flood: Ocean Cyan
      cardBg: 'bg-gradient-to-br from-cyan-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#092a48] dark:via-[#091e3b] dark:to-[#061020]',
      borderStyle: 'border-cyan-400/50 dark:border-cyan-400/60 hover:border-cyan-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_8px_1px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_12px_rgba(6,182,212,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.5),0_0_12px_2px_rgba(6,182,212,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(6,182,212,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-cyan-400 via-blue-400 to-cyan-500',
      iconStyle: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-xs',
      orbGlow1: 'bg-cyan-400/15',
      orbGlow2: 'bg-blue-400/10',
      accentHover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
    },
    {
      title: 'Crop Chlorophyll & NDVI Stress',
      subtitle: 'Daily 3-meter thermal & vegetative vigor anomaly tracking',
      sensor: 'PlanetScope SuperDove',
      metric: '0.82 Mean NDVI',
      icon: Wheat,
      badgeColor: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
      presetIndex: 3, // Punjab
      // Crop: Lime / Olive
      cardBg: 'bg-gradient-to-br from-lime-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#1c2c15] dark:via-[#0f2129] dark:to-[#061020]',
      borderStyle: 'border-lime-400/50 dark:border-lime-400/60 hover:border-lime-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(163,230,53,0.25),0_0_8px_1px_rgba(132,204,22,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_12px_rgba(132,204,22,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(163,230,53,0.5),0_0_12px_2px_rgba(132,204,22,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(132,204,22,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-lime-400 via-emerald-400 to-lime-500',
      iconStyle: 'bg-lime-500/20 text-lime-600 dark:text-lime-300 border border-lime-500/40 shadow-xs',
      orbGlow1: 'bg-lime-400/15',
      orbGlow2: 'bg-teal-400/10',
      accentHover: 'group-hover:text-lime-600 dark:group-hover:text-lime-400'
    },
    {
      title: 'Sub-Meter Building Footprints',
      subtitle: 'Vector polygon extraction for maritime and urban port density',
      sensor: 'WorldView-3 (0.3m)',
      metric: '0.3m GSD Vector',
      icon: Building2,
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      presetIndex: 4, // Tokyo
      // Footprints: Cosmic Purple
      cardBg: 'bg-gradient-to-br from-purple-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#261545] dark:via-[#131b3e] dark:to-[#061020]',
      borderStyle: 'border-purple-400/50 dark:border-purple-400/60 hover:border-purple-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(192,132,252,0.25),0_0_8px_1px_rgba(168,85,247,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_12px_rgba(168,85,247,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(192,132,252,0.5),0_0_12px_2px_rgba(168,85,247,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(168,85,247,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-purple-400 via-indigo-400 to-purple-500',
      iconStyle: 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 shadow-xs',
      orbGlow1: 'bg-purple-400/15',
      orbGlow2: 'bg-fuchsia-400/10',
      accentHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Quick-Start Geospatial Pipelines
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Click any pipeline to stage data in workspace
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const targetPreset = MOCK_AOI_PRESETS[card.presetIndex];

          return (
            <button
              key={idx}
              onClick={() => onSelectPreset(targetPreset)}
              className={`relative text-left p-4 rounded-2xl ${card.cardBg} border ${card.borderStyle} ${card.glowStyle} transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex flex-col justify-between group overflow-hidden backdrop-blur-xl`}
            >
              {/* Soft Top Radiant Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.topAccent} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

              {/* Concentrated Corner Ambient Glow Orbs */}
              <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full ${card.orbGlow1} blur-md pointer-events-none group-hover:scale-115 transition-transform duration-300`}></div>
              <div className={`absolute -bottom-3 -left-3 w-10 h-10 rounded-full ${card.orbGlow2} blur-md pointer-events-none`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${card.iconStyle} flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${card.badgeColor}`}>
                    {card.metric}
                  </span>
                </div>

                <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${card.accentHover} transition-colors`}>
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 relative z-10 transition-colors">
                <span className="truncate">{card.sensor}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

