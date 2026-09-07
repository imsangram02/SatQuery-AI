import React from 'react';
import { 
  Globe2, 
  Satellite, 
  Zap, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const metrics = [
    {
      title: 'Total AOI Area Analyzed',
      value: '142,850',
      unit: 'km²',
      change: '+18.4% this month',
      icon: Globe2,
      trend: 'positive',
      // Cyan / Deep Navy Tint
      cardBg: 'bg-gradient-to-br from-cyan-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#07253a] dark:via-[#091b33] dark:to-[#050f1d]',
      borderStyle: 'border-cyan-400/50 dark:border-cyan-400/60 hover:border-cyan-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_8px_1px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_14px_rgba(6,182,212,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.5),0_0_12px_2px_rgba(6,182,212,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(6,182,212,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-cyan-400 via-teal-400 to-cyan-500',
      iconStyle: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-xs',
      orbGlow1: 'bg-cyan-400/15',
      orbGlow2: 'bg-teal-400/10',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'Active Sensor Streams',
      value: '8',
      unit: 'Sensors',
      change: '42 daily passes',
      icon: Satellite,
      trend: 'neutral',
      // Dark Blue / Electric Indigo Tint
      cardBg: 'bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#0d2354] dark:via-[#0a1936] dark:to-[#050f1d]',
      borderStyle: 'border-blue-400/50 dark:border-blue-400/60 hover:border-blue-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(96,165,250,0.25),0_0_8px_1px_rgba(59,130,246,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_14px_rgba(59,130,246,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(96,165,250,0.5),0_0_12px_2px_rgba(59,130,246,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(59,130,246,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-blue-400 via-sky-400 to-indigo-500',
      iconStyle: 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/40 shadow-xs',
      orbGlow1: 'bg-blue-400/15',
      orbGlow2: 'bg-indigo-400/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Mean Inference Speed',
      value: '21.4',
      unit: 'ms / tile',
      change: 'TensorRT H100',
      icon: Zap,
      trend: 'positive',
      // Emerald Teal / Mint Tint
      cardBg: 'bg-gradient-to-br from-teal-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#072f2b] dark:via-[#081e28] dark:to-[#050f1d]',
      borderStyle: 'border-teal-400/50 dark:border-teal-400/60 hover:border-teal-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(45,212,191,0.25),0_0_8px_1px_rgba(20,184,166,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_14px_rgba(20,184,166,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(45,212,191,0.5),0_0_12px_2px_rgba(20,184,166,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(20,184,166,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-teal-400 via-emerald-400 to-cyan-500',
      iconStyle: 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/40 shadow-xs',
      orbGlow1: 'bg-teal-400/15',
      orbGlow2: 'bg-emerald-400/10',
      textColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      title: 'GeoSAM Confidence Index',
      value: '98.6%',
      unit: 'Score',
      change: 'Verified ground truth',
      icon: ShieldCheck,
      trend: 'positive',
      // Cosmic Purple / Violet Tint
      cardBg: 'bg-gradient-to-br from-purple-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-[#2c1348] dark:via-[#161238] dark:to-[#050f1d]',
      borderStyle: 'border-purple-400/50 dark:border-purple-400/60 hover:border-purple-300',
      glowStyle: 'shadow-[0_0_0_1px_rgba(192,132,252,0.25),0_0_8px_1px_rgba(168,85,247,0.22),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_14px_rgba(168,85,247,0.14),0_6px_18px_-3px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(192,132,252,0.5),0_0_12px_2px_rgba(168,85,247,0.38),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_16px_rgba(168,85,247,0.2),0_8px_22px_-3px_rgba(0,0,0,0.6)]',
      topAccent: 'from-purple-400 via-fuchsia-400 to-indigo-500',
      iconStyle: 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 shadow-xs',
      orbGlow1: 'bg-purple-400/15',
      orbGlow2: 'bg-fuchsia-400/10',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`relative p-5 rounded-2xl ${m.cardBg} border ${m.borderStyle} ${m.glowStyle} flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-xl overflow-hidden group`}
          >
            {/* Soft Top Radiant Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${m.topAccent} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

            {/* Concentrated Corner Ambient Glow Orbs */}
            <div className={`absolute -top-3 -right-3 w-14 h-14 rounded-full ${m.orbGlow1} blur-md pointer-events-none group-hover:scale-115 transition-transform duration-300`}></div>
            <div className={`absolute -bottom-3 -left-3 w-12 h-12 rounded-full ${m.orbGlow2} blur-md pointer-events-none`}></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                {m.title}
              </span>
              <div className={`w-8 h-8 rounded-lg ${m.iconStyle} flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 my-1 relative z-10">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {m.value}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {m.unit}
              </span>
            </div>

            <div className={`flex items-center gap-1 text-[11px] font-mono ${m.textColor} pt-2 border-t border-slate-200/60 dark:border-slate-800/80 relative z-10`}>
              <TrendingUp className="w-3 h-3" />
              <span>{m.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
