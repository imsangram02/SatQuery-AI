import React, { useEffect, useRef } from 'react';

interface CosmicOrbitBackgroundProps {
  className?: string;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  depth: number;
  isNode?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  color: string;
}

export const CosmicOrbitBackground: React.FC<CosmicOrbitBackgroundProps> = ({
  className = "fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isPaused = false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Pause on window blur / tab invisibility to optimize CPU/GPU usage (60fps performance)
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    const handleWindowBlur = () => { isPaused = true; };
    const handleWindowFocus = () => {
      if (isPaused) {
        isPaused = false;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Subtle mouse parallax easing
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetParallaxX = (mouseX / width - 0.5) * 24;
      targetParallaxY = (mouseY / height - 0.5) * 16;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Multi-depth stars with deep void black, dark cosmic navy, cyan, and indigo accents
    const starColors = ['#F5F7FF', '#4FACFE', '#00F2FE', '#7C6CFF', '#A8B6CF', '#FFFFFF'];
    const starCount = 110;
    const stars: StarParticle[] = [];

    for (let i = 0; i < starCount; i++) {
      const depth = 0.2 + Math.random() * 0.8;
      const baseAlpha = 0.25 + Math.random() * 0.55;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (0.45 + Math.random() * 1.25) * depth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: 0.009 + Math.random() * 0.018,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.04 * depth,
        vy: (Math.random() - 0.5) * 0.04 * depth,
        depth,
        isNode: depth > 0.65 && Math.random() > 0.5,
      });
    }

    // Occasional shooting meteors / telemetry lasers
    const shootingStars: ShootingStar[] = [];
    let lastSpawnTime = Date.now();

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.35,
        length: 70 + Math.random() * 90,
        speed: 10 + Math.random() * 6,
        angle: (Math.PI / 180) * (215 + (Math.random() - 0.5) * 18),
        opacity: 0.75,
        active: true,
        color: Math.random() > 0.5 ? '#00F2FE' : '#4FACFE',
      });
    };

    let lastTime = performance.now();

    const render = () => {
      if (isPaused) return;

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // 1. Draw twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = (Math.sin(star.twinklePhase) + 1) / 2;
        star.alpha = star.baseAlpha * 0.5 + twinkleFactor * star.baseAlpha * 0.5;

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const renderX = star.x + currentParallaxX * star.depth;
        const renderY = star.y + currentParallaxY * star.depth;

        ctx.save();
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? star.color : '#0284C7';
        ctx.globalAlpha = isDark ? Math.max(0.12, Math.min(0.85, star.alpha)) : Math.max(0.06, Math.min(0.35, star.alpha * 0.45));
        ctx.fill();
        ctx.restore();
      }

      // 2. Constellation Lines: Connect nearby foreground node stars
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        if (!s1.isNode) continue;

        const x1 = s1.x + currentParallaxX * s1.depth;
        const y1 = s1.y + currentParallaxY * s1.depth;

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          if (!s2.isNode) continue;

          const x2 = s2.x + currentParallaxX * s2.depth;
          const y2 = s2.y + currentParallaxY * s2.depth;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const distSq = dx * dx + dy * dy;

          // Connection threshold (approx 90px)
          if (distSq < 8100) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 90) * 0.16;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isDark ? '#4FACFE' : '#0284C7';
            ctx.lineWidth = 0.7;
            ctx.globalAlpha = isDark ? lineAlpha : lineAlpha * 0.55;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 3. Draw shooting stars / telemetry laser tracks
      const now = Date.now();
      if (now - lastSpawnTime > 11000 + Math.random() * 5000) {
        spawnShootingStar();
        lastSpawnTime = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        const headX = s.x;
        const headY = s.y;
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, s.color);
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX, headY, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.012;

        if (s.opacity <= 0 || s.x < -100 || s.y > height + 100) {
          s.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {/* 1. Deep Space Base: Void Black (#050811) in dark mode, clean daylight sky in light mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#050811] transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/90 via-white/80 to-slate-100/90 dark:from-[#050811] dark:via-[#0B132B] dark:to-[#050811] opacity-95 transition-colors duration-300" />

      {/* 2. Glowing Nebula Accents in Cyan (#00F2FE), Indigo (#4FACFE), and Cosmic Purple */}
      <div className="absolute -top-32 left-[15%] w-[950px] h-[550px] bg-gradient-to-b from-[#4FACFE]/16 via-[#00F2FE]/10 to-transparent blur-[160px] rounded-full animate-nebula-float opacity-30 dark:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-[18%] right-[8%] w-[780px] h-[520px] bg-gradient-to-br from-[#00F2FE]/12 via-[#4FACFE]/12 to-transparent blur-[160px] rounded-full animate-nebula-float opacity-30 dark:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-7s' }} />
      <div className="absolute top-[46%] left-[4%] w-[700px] h-[700px] bg-gradient-to-tr from-[#00F2FE]/08 via-[#4FACFE]/12 to-transparent blur-[160px] rounded-full animate-nebula-float opacity-30 dark:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-14s' }} />
      <div className="absolute bottom-[6%] right-[16%] w-[680px] h-[480px] bg-gradient-to-tl from-[#7C6CFF]/14 via-[#4FACFE]/10 to-transparent blur-[150px] rounded-full animate-nebula-float opacity-30 dark:opacity-100 transition-opacity duration-300" style={{ animationDelay: '-4s' }} />

      {/* 3. Celestial Starfield & Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 4. High-Tech SVG Orbital Grid, Wireframe Sensor Cone & Earth Horizon */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Earth Atmosphere Outer Airglow Gradient */}
          <radialGradient id="space-airglow-halo" cx="50%" cy="100%" r="85%">
            <stop offset="68%" stopColor="#4FACFE" stopOpacity="0" />
            <stop offset="74%" stopColor="#7C6CFF" stopOpacity="0.15" />
            <stop offset="79%" stopColor="#4FACFE" stopOpacity="0.45" />
            <stop offset="83%" stopColor="#00F2FE" stopOpacity="0.65" />
            <stop offset="87%" stopColor="#4FACFE" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          {/* Earth Surface Day/Night Terminator Gradient */}
          <radialGradient id="space-earth-sphere" cx="30%" cy="85%" r="90%">
            <stop offset="0%" stopColor="#0B132B" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#070E22" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#050811" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#020408" stopOpacity="1" />
          </radialGradient>

          {/* Volumetric Satellite Sensor Cone Gradient */}
          <linearGradient id="aerospace-sensor-cone" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#4FACFE" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#00F2FE" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4FACFE" stopOpacity="0.02" />
          </linearGradient>

          {/* Orbital Track Flow Gradient */}
          <linearGradient id="space-orbit-track-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FACFE" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#4FACFE" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#00F2FE" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0.1" />
          </linearGradient>

          {/* Downlink Stream Gradient */}
          <linearGradient id="aerospace-downlink-stream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#4FACFE" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* REALISTIC EARTH HORIZON GLOW (PLANETARY LIMB) AT BOTTOM                   */}
        {/* ========================================================================= */}
        <g id="aerospace-earth-horizon">
          {/* Volumetric Atmosphere Airglow Halo */}
          <ellipse
            cx="960"
            cy="1680"
            rx="1350"
            ry="750"
            fill="url(#space-airglow-halo)"
            className="animate-atmospheric-shimmer opacity-25 dark:opacity-85 transition-opacity duration-300"
          />

          {/* Solid Planetary Core */}
          <ellipse
            cx="960"
            cy="1680"
            rx="1330"
            ry="730"
            fill="url(#space-earth-sphere)"
            className="opacity-15 dark:opacity-100 transition-opacity duration-300"
          />

          {/* Luminous Horizon Ozone Line */}
          <path
            d="M -200 1020 Q 960 880 2120 1020"
            fill="none"
            stroke="#4FACFE"
            strokeWidth="2.4"
            className="opacity-80"
          />
          <path
            d="M -200 1020 Q 960 880 2120 1020"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="1.2"
            className="opacity-70"
          />
          <path
            d="M -200 1025 Q 960 885 2120 1025"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.7"
            className="opacity-60"
          />

          {/* Planetary Curvature Graticule Lines */}
          <path
            d="M -100 1060 Q 960 920 2020 1060"
            fill="none"
            stroke="#4FACFE"
            strokeWidth="0.7"
            strokeDasharray="4 8"
            className="opacity-35 animate-orbit-flow"
          />

          {/* Nightside Continent Silhouettes & City Light Clusters */}
          <g id="city-lights" opacity="0.75">
            <circle cx="680" cy="945" r="1.8" fill="#F5B942" opacity="0.8" />
            <circle cx="692" cy="950" r="1.3" fill="#F5B942" opacity="0.65" />
            <circle cx="840" cy="932" r="2.2" fill="#00F2FE" opacity="0.75" />
            <circle cx="960" cy="920" r="2.4" fill="#F5B942" opacity="0.85" />
            <circle cx="1080" cy="935" r="1.8" fill="#F5B942" opacity="0.7" />
            <circle cx="1220" cy="952" r="2.0" fill="#4FACFE" opacity="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CosmicOrbitBackground;
