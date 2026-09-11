import React, { useEffect, useRef } from 'react';

interface SimpleSpaceBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  depth: number;
  isConstellationNode: boolean;
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

export const SimpleSpaceBackground: React.FC<SimpleSpaceBackgroundProps> = ({
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Smooth subtle mouse parallax
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      targetParallaxX = (e.clientX / width - 0.5) * 16;
      targetParallaxY = (e.clientY / height - 0.5) * 12;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate gentle starfield - clean & balanced (not overcrowded)
    const STAR_COUNT = Math.min(95, Math.floor((width * height) / 14000));
    const stars: Star[] = [];
    const starColors = ['#FFFFFF', '#F0F9FF', '#E0F2FE', '#BAE6FD', '#E0E7FF', '#DDD6FE'];

    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = Math.random() * 0.75 + 0.25;
      const baseAlpha = Math.random() * 0.5 + 0.25;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (Math.random() * 1.1 + 0.4) * depth,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.012 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.025 * depth,
        vy: (Math.random() - 0.5) * 0.025 * depth,
        depth,
        isConstellationNode: depth > 0.6 && Math.random() > 0.65
      });
    }

    // Occasional gentle shooting star
    const shootingStars: ShootingStar[] = [];
    let lastShootTime = Date.now();

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * (height * 0.4),
        length: 50 + Math.random() * 60,
        speed: 7 + Math.random() * 4,
        angle: (Math.PI / 180) * (210 + (Math.random() - 0.5) * 15),
        opacity: 0.7,
        active: true,
        color: Math.random() > 0.4 ? '#38BDF8' : '#818CF8'
      });
    };

    const render = () => {
      if (isPaused) return;

      if (!prefersReducedMotion) {
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // 1. Draw stars with gentle sine twinkle
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        const twinkle = Math.sin(star.twinklePhase) * 0.3;
        star.alpha = Math.max(0.12, Math.min(0.85, star.baseAlpha + twinkle));

        const renderX = star.x + currentParallaxX * star.depth;
        const renderY = star.y + currentParallaxY * star.depth;

        ctx.fillStyle = isDark ? star.color : '#0284C7';
        ctx.globalAlpha = isDark ? star.alpha : Math.max(0.05, Math.min(0.3, star.alpha * 0.4));
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft glow on a few brighter foreground stars
        if (star.depth > 0.85 && star.alpha > 0.65) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? star.color : '#0284C7';
          ctx.globalAlpha = isDark ? star.alpha * 0.15 : 0.05;
          ctx.fill();
        }
      }

      // 2. Faint, elegant constellation lines between nearby node stars
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        if (!s1.isConstellationNode) continue;

        const x1 = s1.x + currentParallaxX * s1.depth;
        const y1 = s1.y + currentParallaxY * s1.depth;

        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          if (!s2.isConstellationNode) continue;

          const x2 = s2.x + currentParallaxX * s2.depth;
          const y2 = s2.y + currentParallaxY * s2.depth;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const distSq = dx * dx + dy * dy;

          // Max distance ~85px
          if (distSq < 7225) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 85) * 0.12;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isDark ? '#38BDF8' : '#0284C7';
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = isDark ? lineAlpha : lineAlpha * 0.55;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 3. Occasional gentle shooting star (every 10-15 seconds)
      const now = Date.now();
      if (!prefersReducedMotion && now - lastShootTime > 12000 + Math.random() * 5000) {
        spawnShootingStar();
        lastShootTime = now;
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
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, s.color);
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX, headY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.015;

        if (s.opacity <= 0 || s.x < -50 || s.y > height + 50) {
          s.active = false;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {/* 1. Deep Space Base Canvas: Clean midnight navy void in dark mode, light sky void in light mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#040714] transition-colors duration-300" />
      <div 
        className="absolute inset-0 w-full h-full opacity-40 dark:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 20% 15%, rgba(56, 189, 248, 0.12), transparent 70%),
            radial-gradient(ellipse 60% 45% at 85% 25%, rgba(129, 140, 248, 0.12), transparent 65%),
            radial-gradient(ellipse 80% 55% at 50% 90%, rgba(30, 58, 138, 0.14), transparent 75%)
          `
        }}
      />

      {/* 2. Soft Ambient Nebula Clouds - Friendly, warm, non-distracting cosmic glow */}
      <div className="absolute -top-24 left-[10%] w-[500px] sm:w-[700px] h-[350px] bg-gradient-to-br from-cyan-500/10 via-blue-600/05 to-transparent blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-[35%] right-[5%] w-[400px] sm:w-[600px] h-[350px] bg-gradient-to-tl from-indigo-500/10 via-purple-600/05 to-transparent blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-300" />

      {/* 3. HTML5 Canvas Twinkling Starfield & Delicate Constellation Links */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
      />

      {/* 4. Elegant Minimalist Earth Limb & Atmospheric Arc (Bottom) */}
      <div className="absolute -bottom-24 sm:-bottom-32 left-1/2 -translate-x-1/2 w-[140vw] max-w-[1920px] h-[280px] sm:h-[360px] pointer-events-none">
        {/* Soft Earth curvature airglow */}
        <div 
          className="w-full h-full rounded-[100%] opacity-35 dark:opacity-70 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.28) 0%, rgba(37, 99, 235, 0.16) 35%, rgba(6, 14, 34, 0.8) 65%, #040714 100%)',
            filter: 'blur(24px)'
          }}
        />
        {/* Thin, crisp cyan ozone horizon line */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[2px] rounded-full opacity-40 dark:opacity-60 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.3) 20%, rgba(125, 211, 252, 0.85) 50%, rgba(56, 189, 248, 0.3) 80%, transparent 100%)',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)'
          }}
        />
      </div>

      {/* 5. Delicate Orbital Path Arc with Charming Friendly Micro-Satellite */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 sm:opacity-55"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbital-path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Smooth orbital arc path */}
        <path
          d="M -100,550 Q 720,120 1540,420"
          fill="none"
          stroke="url(#orbital-path-gradient)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Minimal Satellite Indicator in upper orbital position */}
      <div className="absolute top-[18%] right-[14%] sm:right-[20%] pointer-events-none flex items-center gap-2 animate-pulse" style={{ animationDuration: '4s' }}>
        {/* Small satellite silhouette / icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-sm bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]" />
          {/* Wings */}
          <div className="absolute -left-2 top-1.5 w-2 h-1 bg-[#818CF8]/80 rounded-xs" />
          <div className="absolute -right-2 top-1.5 w-2 h-1 bg-[#818CF8]/80 rounded-xs" />
          {/* Soft ping wave */}
          <div className="absolute inset-0 rounded-full border border-[#38BDF8]/40 animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        <span className="hidden md:inline-block text-[10px] font-mono text-[#0284C7] dark:text-[#7DD3FC]/70 tracking-wide transition-colors">
          SAT-LEO • ORBIT ACTIVE
        </span>
      </div>

      {/* 6. Soft Center Vignette for 100% Form Readability in dark mode */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(4, 7, 20, 0.4) 0%, rgba(4, 7, 20, 0.75) 85%, #040714 100%)'
        }}
      />
    </div>
  );
};

export default SimpleSpaceBackground;
