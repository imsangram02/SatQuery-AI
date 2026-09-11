import React, { useMemo } from 'react';

interface Star {
  id: number;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  color: string;
}

export const GeospatialBackground: React.FC = () => {
  // Static stars field across internal pages
  const stars: Star[] = useMemo(() => {
    const starList: Star[] = [];
    const colors = ['#ffffff', '#7dd3fc', '#38bdf8', '#5eead4', '#c084fc', '#bae6fd', '#a855f7', '#fef08a'];

    for (let i = 0; i < 85; i++) {
      const seed1 = Math.sin(i * 9187) * 10000;
      const seed2 = Math.cos(i * 4391) * 10000;
      const seed3 = Math.sin(i * 2677) * 10000;

      const x = Math.abs(seed1 - Math.floor(seed1)) * 100;
      const y = Math.abs(seed2 - Math.floor(seed2)) * 92;
      const r = 0.5 + (Math.abs(seed3 - Math.floor(seed3)) * 1.4);
      const opacity = 0.2 + (Math.abs(seed1 * 0.7 - Math.floor(seed1 * 0.7)) * 0.7);
      const color = colors[i % colors.length];

      starList.push({ id: i, cx: x, cy: y, r, opacity, color });
    }
    return starList;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Ambient Lighting: Daylight Sky in Light Mode & Cosmic Nebulae in Dark Mode */}
      <div className="absolute inset-0 block dark:hidden bg-gradient-to-b from-sky-50/60 via-teal-50/30 to-slate-50/80 transition-colors duration-300" />
      <div className="absolute inset-0 hidden dark:block bg-radial-at-t from-[#0b192c]/80 via-[#030712]/95 to-[#010409] transition-opacity duration-300" />

      {/* Volumetric Nebulae Lighting (Dark Mode Only - Static) */}
      <div className="hidden dark:block">
        <div className="absolute -top-32 left-[15%] w-[1000px] h-[600px] bg-gradient-to-b from-cyan-600/15 via-blue-900/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[18%] right-[10%] w-[750px] h-[550px] bg-gradient-to-br from-purple-900/15 via-indigo-950/20 to-transparent blur-[150px] rounded-full" />
        <div className="absolute top-[35%] left-0 w-[700px] h-[700px] bg-gradient-to-tr from-teal-500/10 via-cyan-700/10 to-transparent blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[25%] w-[650px] h-[450px] bg-gradient-to-tl from-violet-900/15 via-purple-950/15 to-transparent blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] left-[20%] w-[900px] h-[500px] bg-gradient-to-t from-sky-500/15 via-teal-900/10 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Subtle Atmospheric Daylight Glow (Light Mode Only) */}
      <div className="block dark:hidden">
        <div className="absolute -top-24 left-[20%] w-[800px] h-[400px] bg-gradient-to-b from-cyan-200/25 via-teal-100/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[15%] w-[600px] h-[400px] bg-gradient-to-bl from-sky-200/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Static Stars (Dark Mode Only) */}
      <svg
        className="hidden dark:block absolute inset-0 w-full h-full opacity-80 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="geo-star-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.cx}%`}
            cy={`${star.cy}%`}
            r={star.r * 0.24}
            fill={star.color}
            opacity={star.opacity}
            filter="url(#geo-star-blur)"
          />
        ))}

        {/* High-Magnitude Static Stars */}
        <g opacity="0.85">
          <path d="M 18 14 L 18.8 15.5 L 20.3 15.5 L 19.1 16.3 L 19.5 17.8 L 18 16.8 L 16.5 17.8 L 16.9 16.3 L 15.7 15.5 L 17.2 15.5 Z" fill="#7dd3fc" />
          <circle cx="18" cy="16" r="0.9" fill="#ffffff" />
        </g>
        <g opacity="0.75">
          <path d="M 74 18 L 74.8 19.3 L 76.3 19.3 L 75.1 20.1 L 75.5 21.4 L 74 20.6 L 72.5 21.4 L 72.9 20.1 L 71.7 19.3 L 73.2 19.3 Z" fill="#38bdf8" />
          <circle cx="74" cy="20" r="0.8" fill="#ffffff" />
        </g>
        <g opacity="0.85">
          <circle cx="46" cy="9" r="0.8" fill="#ffffff" />
          <line x1="46" y1="6.5" x2="46" y2="11.5" stroke="#5eead4" strokeWidth="0.25" opacity="0.65" />
          <line x1="43.5" y1="9" x2="48.5" y2="9" stroke="#5eead4" strokeWidth="0.25" opacity="0.65" />
        </g>
      </svg>

      {/* 3. Satellite Orbital Lines & Laser Crosslinks (Static) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-65 dark:opacity-85 transition-opacity fill-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="geo-data-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="geo-laser-link" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="geo-earth-airglow" cx="30%" cy="100%" r="85%">
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0" />
            <stop offset="74%" stopColor="#6366f1" stopOpacity="0.14" />
            <stop offset="78%" stopColor="#8b5cf6" stopOpacity="0.22" />
            <stop offset="82%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="86%" stopColor="#5eead4" stopOpacity="0.7" />
            <stop offset="90%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Earth Atmospheric Airglow Limb (Lower Horizon - Static) */}
        <ellipse
          cx="600"
          cy="1550"
          rx="1550"
          ry="780"
          fill="url(#geo-earth-airglow)"
          className="hidden dark:block opacity-80"
        />

        {/* Orbital Track 1 */}
        <path
          d="M -100 220 C 420 -30, 940 380, 1420 160 C 1720 40, 1960 420, 2120 310"
          stroke="url(#geo-data-glow)"
          strokeWidth="1.6"
          strokeDasharray="8 6"
          opacity="0.65"
        />
        <path
          d="M -100 255 C 420 5, 940 415, 1420 195 C 1720 75, 1960 455, 2120 345"
          stroke="#38bdf8"
          strokeWidth="0.8"
          strokeDasharray="4 8"
          opacity="0.3"
        />

        {/* Orbital Track 2 */}
        <path
          d="M -150 780 C 380 980, 880 620, 1380 840 C 1680 960, 1960 690, 2160 740"
          stroke="url(#geo-laser-link)"
          strokeWidth="1.4"
          strokeDasharray="7 9"
          opacity="0.55"
        />

        {/* Orbital Track 3 */}
        <path
          d="M 120 1020 C 620 740, 1120 880, 1620 590 C 1880 440, 2060 410, 2220 360"
          stroke="#2dd4bf"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          opacity="0.35"
        />

        {/* Intersatellite Laser Crosslink */}
        <path
          d="M 680 190 Q 900 480 1140 750"
          stroke="url(#geo-laser-link)"
          strokeWidth="1.4"
          strokeDasharray="6 6"
          opacity="0.6"
        />

        {/* Active Satellite Nodes */}
        <g transform="translate(680, 190)">
          <polygon points="0,0 -40,110 40,110" fill="url(#geo-data-glow)" opacity="0.1" />
          <circle cx="0" cy="0" r="14" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="0" cy="0" r="7" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
          <circle cx="0" cy="0" r="4" fill="#38bdf8" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          <rect x="-16" y="-2" width="8" height="4" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
          <rect x="8" y="-2" width="8" height="4" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
        </g>

        <g transform="translate(1140, 750)">
          <circle cx="0" cy="0" r="12" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <circle cx="0" cy="0" r="6" stroke="#a855f7" strokeWidth="1.2" opacity="0.75" />
          <circle cx="0" cy="0" r="3.5" fill="#a855f7" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          <rect x="-14" y="-2" width="7" height="4" rx="1" fill="#7e22ce" stroke="#c084fc" strokeWidth="0.6" />
          <rect x="7" y="-2" width="7" height="4" rx="1" fill="#7e22ce" stroke="#c084fc" strokeWidth="0.6" />
        </g>

        <g transform="translate(1540, 260)">
          <circle cx="0" cy="0" r="10" stroke="#2dd4bf" strokeWidth="0.9" opacity="0.5" />
          <circle cx="0" cy="0" r="3.5" fill="#2dd4bf" />
          <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
        </g>

        {/* Ground Station Matrix Data Up/Downlinks */}
        <g opacity="0.45">
          <line x1="380" y1="890" x2="680" y2="190" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 5" />
          <circle cx="380" cy="890" r="3" fill="#38bdf8" />
          <circle cx="380" cy="890" r="7" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" />

          <line x1="1380" y1="920" x2="1140" y2="750" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="3 5" />
          <circle cx="1380" cy="920" r="3" fill="#a855f7" />
          <circle cx="1380" cy="920" r="7" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      </svg>

      {/* 4. Precision Geospatial Coordinate Grid Matrix */}
      <svg
        className="absolute inset-0 w-full h-full stroke-slate-400/20 dark:stroke-slate-800/40"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="geo-subgrid-int" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" strokeWidth="0.5" strokeDasharray="2 6" />
            <path d="M 40 37 L 40 43 M 37 40 L 43 40" fill="none" strokeWidth="0.6" className="stroke-cyan-500/25 dark:stroke-cyan-400/20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-subgrid-int)" />
      </svg>

      {/* 5. Peripheral GIS Latitude & Longitude HUD Telemetry Ticks */}
      <div className="absolute top-24 left-4 hidden xl:flex flex-col gap-16 font-mono text-[9px] text-slate-400/50 dark:text-slate-600/70 select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-px bg-cyan-500/40" />
          <span>72°00'N // POLAR-MESH</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-px bg-cyan-500/40" />
          <span>48°30'N // EO-SECTOR-A</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-px bg-cyan-500/40" />
          <span>24°15'N // TROPIC-CORRIDOR</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-px bg-cyan-500/40" />
          <span>00°00'EQ // EQUATORIAL-NADIR</span>
        </span>
      </div>

      <div className="absolute top-24 right-4 hidden xl:flex flex-col gap-16 font-mono text-[9px] text-slate-400/50 dark:text-slate-600/70 select-none text-right">
        <span className="flex items-center justify-end gap-1.5">
          <span>STAC-COG // WGS84</span>
          <span className="w-2 h-px bg-cyan-500/40" />
        </span>
        <span className="flex items-center justify-end gap-1.5">
          <span>GSD: 0.3m – 10m BOA</span>
          <span className="w-2 h-px bg-cyan-500/40" />
        </span>
        <span className="flex items-center justify-end gap-1.5">
          <span>ORBIT: SUN-SYNC 786KM</span>
          <span className="w-2 h-px bg-cyan-500/40" />
        </span>
        <span className="flex items-center justify-end gap-1.5">
          <span>SAR C-BAND // VV+VH</span>
          <span className="w-2 h-px bg-cyan-500/40" />
        </span>
      </div>

      {/* 6. Soft Horizon Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50/90 via-slate-50/50 to-transparent dark:from-slate-950/95 dark:via-slate-950/60 dark:to-transparent" />
    </div>
  );
};
