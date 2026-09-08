import React, { useMemo } from 'react';

interface Star {
  id: number;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  color: string;
}

export const CosmicOrbitBackground: React.FC = () => {
  // Generate high-density realistic star distribution (clean static placement without continuous animation)
  const stars: Star[] = useMemo(() => {
    const starList: Star[] = [];
    const colors = ['#ffffff', '#7dd3fc', '#38bdf8', '#5eead4', '#c084fc', '#bae6fd', '#a855f7', '#fef08a'];
    
    for (let i = 0; i < 95; i++) {
      const seed1 = Math.sin(i * 8191) * 10000;
      const seed2 = Math.cos(i * 3571) * 10000;
      const seed3 = Math.sin(i * 1237) * 10000;
      
      const x = Math.abs(seed1 - Math.floor(seed1)) * 100;
      const y = Math.abs(seed2 - Math.floor(seed2)) * 90;
      const r = 0.5 + (Math.abs(seed3 - Math.floor(seed3)) * 1.5);
      const opacity = 0.25 + (Math.abs(seed1 * 0.7 - Math.floor(seed1 * 0.7)) * 0.65);
      const color = colors[i % colors.length];

      starList.push({ id: i, cx: x, cy: y, r, opacity, color });
    }
    return starList;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 hidden dark:block bg-[#020617]" aria-hidden="true">
      {/* 1. Deep Space Cosmic Nebular Ambient Lighting (Static, crisp, professional) */}
      <div className="absolute inset-0 bg-radial-at-t from-[#0b192c]/60 via-[#030712]/90 to-[#010409]" />
      
      {/* Volumetric Nebulae Blooms (Dark blue, black, cyan, and subtle cosmic purple) */}
      <div className="absolute -top-32 left-[15%] w-[1000px] h-[600px] bg-gradient-to-b from-cyan-600/15 via-blue-900/10 to-transparent blur-[140px] rounded-full" />
      <div className="absolute top-[18%] right-[10%] w-[750px] h-[550px] bg-gradient-to-br from-purple-900/15 via-indigo-950/20 to-transparent blur-[150px] rounded-full" />
      <div className="absolute top-[35%] left-0 w-[700px] h-[700px] bg-gradient-to-tr from-teal-500/10 via-cyan-700/10 to-transparent blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] right-[30%] w-[600px] h-[450px] bg-gradient-to-tl from-violet-900/15 via-purple-950/15 to-transparent blur-[130px] rounded-full" />
      <div className="absolute bottom-[5%] left-[20%] w-[900px] h-[500px] bg-gradient-to-t from-sky-500/15 via-teal-900/10 to-transparent blur-[120px] rounded-full" />

      {/* 2. Vector Stars & Constellation Dust Field (Static) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="cosmic-star-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static Cosmic Stars */}
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.cx}%`}
            cy={`${star.cy}%`}
            r={star.r * 0.25}
            fill={star.color}
            opacity={star.opacity}
            filter="url(#cosmic-star-blur)"
          />
        ))}

        {/* High-Magnitude Cross Diffraction Stars (Static) */}
        <g opacity="0.85">
          <path d="M 18 14 L 18.8 15.5 L 20.3 15.5 L 19.1 16.3 L 19.5 17.8 L 18 16.8 L 16.5 17.8 L 16.9 16.3 L 15.7 15.5 L 17.2 15.5 Z" fill="#7dd3fc" />
          <circle cx="18" cy="16" r="0.9" fill="#ffffff" />
        </g>
        <g opacity="0.75">
          <path d="M 72 19 L 72.8 20.3 L 74.3 20.3 L 73.1 21.1 L 73.5 22.4 L 72 21.6 L 70.5 22.4 L 70.9 21.1 L 69.7 20.3 L 71.2 20.3 Z" fill="#38bdf8" />
          <circle cx="72" cy="21" r="0.8" fill="#ffffff" />
        </g>
        <g opacity="0.85">
          <circle cx="44" cy="8" r="0.8" fill="#ffffff" />
          <line x1="44" y1="5.5" x2="44" y2="10.5" stroke="#5eead4" strokeWidth="0.2" opacity="0.65" />
          <line x1="41.5" y1="8" x2="46.5" y2="8" stroke="#5eead4" strokeWidth="0.2" opacity="0.65" />
        </g>
      </svg>

      {/* 3. High-Precision Vector Earth, Satellite Geometry & Global Data Mesh (Static) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Earth Atmosphere Outer Airglow Gradient with Subtle Auroral Violet/Cyan */}
          <radialGradient id="earth-airglow-halo" cx="30%" cy="100%" r="85%">
            <stop offset="68%" stopColor="#0284c7" stopOpacity="0" />
            <stop offset="71%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="79%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="83%" stopColor="#5eead4" stopOpacity="0.9" />
            <stop offset="86%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Earth Surface Day/Night Terminator Gradient */}
          <radialGradient id="earth-surface-sphere" cx="15%" cy="85%" r="90%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#075985" stopOpacity="0.8" />
            <stop offset="62%" stopColor="#0f172a" stopOpacity="0.92" />
            <stop offset="80%" stopColor="#030712" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#010409" stopOpacity="1" />
          </radialGradient>

          {/* Glowing Blue Data Path Gradient */}
          <linearGradient id="blue-data-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#2dd4bf" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
          </linearGradient>

          {/* Cosmic Purple & Cyan Intersatellite Data Glow */}
          <linearGradient id="purple-cyan-data-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#818cf8" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.95" />
          </linearGradient>

          {/* Sensor Swath Volumetric Scan Gradient */}
          <linearGradient id="swath-beam-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#14b8a6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
          </linearGradient>

          {/* Orbital Track Line Gradient */}
          <linearGradient id="orbit-track-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="intense-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* A. REALISTIC-LOOKING EARTH HORIZON (PLANETARY LIMB) - STATIC               */}
        {/* ========================================================================= */}
        <g id="realistic-earth-horizon">
          {/* 1. Volumetric Outer Atmosphere Exosphere Airglow */}
          <ellipse
            cx="480"
            cy="1560"
            rx="1200"
            ry="780"
            fill="url(#earth-airglow-halo)"
            filter="url(#intense-glow)"
            className="opacity-80"
          />

          {/* 2. Solid Planetary Core Body with Terminator */}
          <ellipse
            cx="480"
            cy="1560"
            rx="1180"
            ry="760"
            fill="url(#earth-surface-sphere)"
          />

          {/* 3. Luminous Sharp Ozone/Mesosphere Horizon Boundary */}
          <path
            d="M -220 1020 Q 480 790 1660 1060"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.2"
            filter="url(#intense-glow)"
            className="opacity-85"
          />
          <path
            d="M -220 1020 Q 480 790 1660 1060"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            className="opacity-90"
          />
          <path
            d="M -220 1026 Q 480 796 1660 1066"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.6"
            className="opacity-65"
          />

          {/* 4. Planetary Latitude & Longitude Curvature Graticules */}
          <path
            d="M -100 1060 Q 480 840 1520 1080"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            className="opacity-30"
          />
          <path
            d="M 50 1100 Q 480 890 1380 1100"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="0.6"
            strokeDasharray="3 6"
            className="opacity-20"
          />
          <path
            d="M 220 830 Q 320 950 400 1150"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="3 6"
            className="opacity-20"
          />
          <path
            d="M 520 800 Q 560 930 600 1150"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="3 6"
            className="opacity-20"
          />
          <path
            d="M 820 820 Q 800 940 780 1150"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="3 6"
            className="opacity-20"
          />

          {/* 5. Continent & Landmass Silhouettes with Nightside City Light Clusters */}
          <path
            d="M 240 920 Q 280 890 350 905 Q 410 930 450 900 Q 490 885 530 910 Q 580 940 620 920 Q 660 910 700 940 L 710 990 Q 640 1020 540 1000 Q 420 980 320 1010 Z"
            fill="#062238"
            opacity="0.6"
          />
          <path
            d="M 680 960 Q 740 930 810 950 Q 870 980 930 960 Q 980 950 1040 980 Q 1100 1010 1180 990 L 1200 1050 Q 1080 1080 960 1060 Q 840 1040 730 1060 Z"
            fill="#041f2a"
            opacity="0.55"
          />

          {/* Nightside City Light Hubs (Warm Gold & Luminous Cyan - Static) */}
          <g id="city-light-clusters">
            <circle cx="340" cy="915" r="2" fill="#fde047" opacity="0.75" />
            <circle cx="348" cy="918" r="1.3" fill="#fbbf24" opacity="0.65" />
            <circle cx="332" cy="922" r="1.5" fill="#fde047" opacity="0.6" />
            <circle cx="355" cy="925" r="1.1" fill="#38bdf8" opacity="0.75" />

            <circle cx="480" cy="905" r="2.2" fill="#fde047" opacity="0.8" />
            <circle cx="492" cy="912" r="1.4" fill="#fde047" opacity="0.7" />
            <circle cx="470" cy="915" r="1.6" fill="#5eead4" opacity="0.75" />
            <circle cx="505" cy="910" r="1.2" fill="#fbbf24" opacity="0.55" />

            <circle cx="610" cy="935" r="1.8" fill="#fde047" opacity="0.75" />
            <circle cx="625" cy="940" r="1.3" fill="#38bdf8" opacity="0.7" />
            <circle cx="598" cy="942" r="1.4" fill="#fde047" opacity="0.65" />

            <circle cx="780" cy="965" r="2.2" fill="#fde047" opacity="0.75" />
            <circle cx="795" cy="970" r="1.4" fill="#5eead4" opacity="0.7" />
            <circle cx="810" cy="962" r="1.5" fill="#fde047" opacity="0.65" />

            <circle cx="940" cy="980" r="2" fill="#fde047" opacity="0.7" />
            <circle cx="955" cy="985" r="1.3" fill="#38bdf8" opacity="0.65" />
            <circle cx="928" cy="990" r="1.4" fill="#fbbf24" opacity="0.6" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* B. DATA PATHS & GROUND STATIONS (STATIC CARTOGRAPHIC NETWORK)             */}
        {/* ========================================================================= */}
        <g id="glowing-data-paths">
          {/* Inter-Station Mesh Arcs (Static) */}
          <path
            d="M 340 915 Q 410 880 480 905"
            fill="none"
            stroke="url(#blue-data-glow)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            opacity="0.75"
          />
          <path
            d="M 480 905 Q 545 885 610 935"
            fill="none"
            stroke="url(#blue-data-glow)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            opacity="0.75"
          />
          <path
            d="M 610 935 Q 695 915 780 965"
            fill="none"
            stroke="url(#blue-data-glow)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            opacity="0.75"
          />
          <path
            d="M 780 965 Q 860 935 940 980"
            fill="none"
            stroke="url(#blue-data-glow)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            opacity="0.75"
          />

          {/* Downlink Beams */}
          <path
            d="M 520 355 Q 490 620 480 905"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <path
            d="M 520 355 Q 580 640 610 935"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.4"
            strokeDasharray="4 6"
            opacity="0.55"
          />

          {/* Cross-Constellation Optical Laser Link */}
          <path
            d="M 540 330 Q 920 190 1380 250"
            fill="none"
            stroke="url(#purple-cyan-data-glow)"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            opacity="0.6"
          />

          {/* Orbital Relay Node */}
          <g transform="translate(1380, 250)">
            <circle cx="0" cy="0" r="3.5" fill="#c084fc" opacity="0.9" />
            <circle cx="0" cy="0" r="9" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.5" />
            <line x1="0" y1="-5" x2="20" y2="-20" stroke="#c084fc" strokeWidth="0.8" opacity="0.75" />
            <line x1="20" y1="-20" x2="95" y2="-20" stroke="#c084fc" strokeWidth="0.8" opacity="0.75" />
            <text x="25" y="-24" fill="#c084fc" fontSize="8" fontFamily="Inter" fontWeight="600" letterSpacing="0.05em">
              GEO-RELAY • 26.5 GHz
            </text>
          </g>

          {/* Ground Station Telemetry Markers */}
          <g transform="translate(340, 915)">
            <circle cx="0" cy="0" r="3" fill="#38bdf8" opacity="0.9" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5" />
          </g>
          <g transform="translate(480, 905)">
            <circle cx="0" cy="0" r="3.5" fill="#5eead4" opacity="0.9" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="-5" x2="-20" y2="-25" stroke="#5eead4" strokeWidth="0.8" opacity="0.8" />
            <line x1="-20" y1="-25" x2="-80" y2="-25" stroke="#5eead4" strokeWidth="0.8" opacity="0.8" />
            <text x="-78" y="-29" fill="#5eead4" fontSize="8" fontFamily="Inter" fontWeight="600" letterSpacing="0.05em">
              MATERA GS • 8.2 GHz
            </text>
          </g>
          <g transform="translate(610, 935)">
            <circle cx="0" cy="0" r="3" fill="#38bdf8" opacity="0.9" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5" />
          </g>
          <g transform="translate(780, 965)">
            <circle cx="0" cy="0" r="3" fill="#2dd4bf" opacity="0.9" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.5" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* C. ORBITAL TRACKS (STATIC CARTOGRAPHIC LINES)                              */}
        {/* ========================================================================= */}
        <g id="orbital-tracks">
          {/* Main Polar Orbit Arc */}
          <path
            d="M -150 180 C 220 80, 720 380, 1380 200 C 1680 120, 1950 360, 2150 290"
            fill="none"
            stroke="url(#orbit-track-glow)"
            strokeWidth="1.6"
            strokeDasharray="8 12"
            opacity="0.6"
          />

          {/* Secondary Low Earth Orbit Elliptical Vector */}
          <path
            d="M -120 740 C 380 920, 920 600, 1460 780 C 1780 880, 1980 660, 2180 700"
            fill="none"
            stroke="url(#orbit-track-glow)"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            opacity="0.45"
          />

          {/* Intersecting LEO Inclination Ring */}
          <ellipse
            cx="820"
            cy="440"
            rx="780"
            ry="280"
            fill="none"
            stroke="url(#blue-data-glow)"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            transform="rotate(-15 820 440)"
            className="opacity-25"
          />
        </g>

        {/* ========================================================================= */}
        {/* D. SATELLITE STRUCTURE & SENSOR SWATH (STATIC POSITION)                    */}
        {/* ========================================================================= */}
        <g id="realistic-orbiting-satellite" style={{ transformOrigin: '520px 340px' }}>
          {/* 1. Volumetric Sensor Swath Scan Cone */}
          <polygon
            points="520,355 360,690 680,690"
            fill="url(#swath-beam-grad)"
            className="opacity-25"
          />
          {/* Scan Cone Perimeter Lines */}
          <line x1="520" y1="355" x2="360" y2="690" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
          <line x1="520" y1="355" x2="680" y2="690" stroke="#2dd4bf" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
          {/* Scan Swath Ground Ellipse on Earth Surface */}
          <ellipse cx="520" cy="690" rx="160" ry="24" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* 2. Left Extended Solar Array Panel */}
          <rect x="444" y="337" width="14" height="4" rx="1.5" fill="#64748b" />
          <rect x="368" y="322" width="76" height="34" rx="3" fill="#032541" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="393" y1="322" x2="393" y2="356" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="418" y1="322" x2="418" y2="356" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="368" y1="333" x2="444" y2="333" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="368" y1="345" x2="444" y2="345" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <rect x="370" y="324" width="3" height="3" fill="#fbbf24" opacity="0.9" />
          <rect x="439" y="324" width="3" height="3" fill="#fbbf24" opacity="0.9" />

          {/* 3. Right Extended Solar Array Panel */}
          <rect x="582" y="337" width="14" height="4" rx="1.5" fill="#64748b" />
          <rect x="596" y="322" width="76" height="34" rx="3" fill="#032541" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="621" y1="322" x2="621" y2="356" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="646" y1="322" x2="646" y2="356" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="596" y1="333" x2="672" y2="333" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <line x1="596" y1="345" x2="672" y2="345" stroke="#38bdf8" strokeWidth="0.6" opacity="0.7" />
          <rect x="598" y="324" width="3" height="3" fill="#fbbf24" opacity="0.9" />
          <rect x="667" y="324" width="3" height="3" fill="#fbbf24" opacity="0.9" />

          {/* 4. Central Satellite Avionics Chassis */}
          <rect
            x="494"
            y="316"
            width="52"
            height="46"
            rx="6"
            fill="#0f172a"
            stroke="#5eead4"
            strokeWidth="1.6"
          />
          <rect x="498" y="320" width="20" height="38" rx="2" fill="#78350f" stroke="#fbbf24" strokeWidth="0.8" opacity="0.85" />
          <line x1="498" y1="329" x2="518" y2="329" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
          <line x1="498" y1="339" x2="518" y2="339" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
          <line x1="498" y1="349" x2="518" y2="349" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />

          {/* Optical Sensor Aperture */}
          <circle cx="532" cy="340" r="10" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" />
          <circle cx="532" cy="340" r="6" fill="#0369a1" />
          <circle cx="530" cy="338" r="2.5" fill="#ffffff" opacity="0.8" />

          {/* High-Gain Dish Antenna */}
          <path d="M 520 316 L 520 300" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 508 300 Q 520 292 532 300" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          <line x1="520" y1="294" x2="520" y2="288" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="520" cy="287" r="2" fill="#38bdf8" opacity="0.9" />

          {/* Telemetry Status Beacon */}
          <circle cx="538" cy="324" r="2" fill="#2dd4bf" opacity="0.9" />
          <circle cx="542" cy="324" r="1" fill="#ffffff" />
          <circle cx="520" cy="340" r="24" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />

          {/* 5. HUD Telemetry Callout Box */}
          <g opacity="0.9">
            <line x1="546" y1="324" x2="580" y2="295" stroke="#38bdf8" strokeWidth="0.9" />
            <line x1="580" y1="295" x2="685" y2="295" stroke="#38bdf8" strokeWidth="0.9" />
            <rect x="580" y="278" width="105" height="15" rx="3" fill="#030712" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.5" />
            <text x="585" y="289" fill="#38bdf8" fontSize="8.5" fontFamily="Inter" fontWeight="700" letterSpacing="0.06em">
              SATQUERY-1B • LEO 786KM
            </text>
            <text x="585" y="306" fill="#94a3b8" fontSize="7.5" fontFamily="Inter" fontWeight="500">
              0.5m Multi-Spectral • 1.24 GB/s
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
