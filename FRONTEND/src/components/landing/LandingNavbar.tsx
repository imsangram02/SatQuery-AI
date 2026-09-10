import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, LogIn } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ModernSatelliteAiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Modern, minimal, and professional Satellite + AI brand logo.
 * Features an orbital ellipse path, geometric solar wings, diamond satellite core,
 * and central AI neural sensor pupil. Includes a subtle, non-excessive ambient glow on hover.
 */
export const ModernSatelliteAiLogo: React.FC<ModernSatelliteAiLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl'
  };

  const svgSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black'
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 group/logo ${className}`}>
      {/* Logo Icon with subtle ambient glow */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Soft Ambient Radial Glow on hover (subtle, non-excessive) */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5B8CFF]/25 via-[#7C6CFF]/20 to-[#22D3EE]/20 opacity-0 group-hover/logo:opacity-100 blur-md transition-opacity duration-300 pointer-events-none" />

        {/* Icon Base Frame */}
        <div
          className={`relative ${containerSizes[size]} bg-gradient-to-br from-[#0B1530] via-[#101938] to-[#1A1238] border border-[#5B8CFF]/35 group-hover/logo:border-[#7C6CFF]/70 shadow-[0_2px_10px_rgba(7,14,33,0.5)] group-hover/logo:shadow-[0_0_20px_rgba(91,140,255,0.3)] flex items-center justify-center transition-all duration-300`}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${svgSizes[size]} transition-transform duration-300 group-hover/logo:scale-105`}
          >
            <defs>
              <linearGradient id="sqai-orbit-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5B8CFF" />
                <stop offset="50%" stopColor="#7C6CFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>

            {/* Orbital Trajectory Ring */}
            <ellipse
              cx="16"
              cy="16"
              rx="12.5"
              ry="4.8"
              transform="rotate(-28 16 16)"
              stroke="url(#sqai-orbit-grad)"
              strokeWidth="1.4"
              strokeDasharray="24 6"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Trajectory Orbital Pulse Particle */}
            <circle cx="26" cy="10.8" r="1.3" fill="#22D3EE" />

            {/* Satellite Left Solar Wing */}
            <rect
              x="6.5"
              y="14.5"
              width="5"
              height="3"
              rx="0.6"
              transform="rotate(28 6.5 14.5)"
              fill="#101F38"
              stroke="#5B8CFF"
              strokeWidth="0.9"
            />
            <line x1="8.2" y1="14.2" x2="9.8" y2="17.2" stroke="#5B8CFF" strokeWidth="0.6" opacity="0.7" />

            {/* Satellite Right Solar Wing */}
            <rect
              x="19.5"
              y="14.5"
              width="5"
              height="3"
              rx="0.6"
              transform="rotate(28 19.5 14.5)"
              fill="#101F38"
              stroke="#7C6CFF"
              strokeWidth="0.9"
            />
            <line x1="21.2" y1="14.2" x2="22.8" y2="17.2" stroke="#7C6CFF" strokeWidth="0.6" opacity="0.7" />

            {/* Satellite Connecting Axle */}
            <line x1="11.5" y1="16.5" x2="20.5" y2="15.5" stroke="#A8B6CF" strokeWidth="1" strokeLinecap="round" />

            {/* Central Satellite Body / AI Core: Sleek Diamond */}
            <rect
              x="13.2"
              y="13.2"
              width="5.6"
              height="5.6"
              rx="1.2"
              transform="rotate(45 16 16)"
              fill="#071026"
              stroke="url(#sqai-orbit-grad)"
              strokeWidth="1.3"
            />

            {/* AI Central Neural Sensor Pupil */}
            <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="2.5" stroke="#22D3EE" strokeWidth="0.5" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Brand Text: 'SatQuery' in crisp slate-900 / white, 'AI' in bright blue/purple gradient */}
      {showText && (
        <span className={`${textSizes[size]} tracking-tight leading-none select-none flex items-center`}>
          <span className="text-slate-900 dark:text-white transition-colors duration-200">SatQuery</span>
          <span className="bg-gradient-to-r from-[#5B8CFF] via-[#7C6CFF] to-[#A78BFA] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] ml-0.5">
            AI
          </span>
        </span>
      )}
    </div>
  );
};

interface LandingNavbarProps {
  onLaunchApp: () => void;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
  onNavigateToAuth?: (page: 'login' | 'signup') => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLaunchApp,
  onOpenAuth,
  onNavigateToAuth
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToAuth = (tab: 'login' | 'signup') => {
    setMobileMenuOpen(false);
    if (onNavigateToAuth) {
      onNavigateToAuth(tab);
    } else if (onOpenAuth) {
      onOpenAuth(tab === 'login' ? 'signin' : 'signup');
    } else {
      window.location.hash = tab;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#080E21]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#263B5C]/80 shadow-lg shadow-slate-200/50 dark:shadow-[#080E21]/60 py-1'
          : 'bg-transparent border-b border-transparent py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between transition-all duration-200">
        {/* Left: Brand Logo & Title with balanced padding and hover effect */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8CFF]"
          title="SatQuery AI Home"
        >
          <ModernSatelliteAiLogo size="md" showText={true} />
        </a>

        {/* Center: Clean Minimal Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#A8B6CF] hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#5B8CFF] via-[#7C6CFF] to-[#A78BFA] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle, Auth Buttons, & Launch SatQuery AI CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-[#263B5C] bg-white/80 dark:bg-[#101F38]/80 text-slate-700 dark:text-[#A8B6CF] hover:text-slate-900 dark:hover:text-white hover:border-[#5B8CFF]/50 hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8CFF] shadow-xs cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F5B942]" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Dedicated Sign In Button with smooth hover */}
          <button
            type="button"
            onClick={() => handleGoToAuth('login')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-[#A8B6CF] hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-[#101F38]/70 hover:bg-slate-100 dark:hover:bg-[#152A48] border border-slate-200 dark:border-[#263B5C] hover:border-[#5B8CFF]/50 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 shadow-xs"
            title="Sign In"
          >
            <LogIn className="w-3.5 h-3.5 text-[#5B8CFF]" />
            <span>Sign In</span>
          </button>

          {/* Primary CTA: Launch SatQuery AI */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#7C6CFF] hover:from-[#6B96FF] hover:to-[#8B7DFF] text-white font-semibold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-[#5B8CFF]/25 hover:shadow-lg hover:shadow-[#5B8CFF]/40 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8CFF]"
          >
            <span>Launch SatQuery AI</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-[#263B5C] bg-white dark:bg-[#101F38] text-slate-700 dark:text-[#A8B6CF] hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-white/95 dark:bg-[#080E21]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-[#263B5C] shadow-2xl space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-[#A8B6CF] hover:bg-slate-100 dark:hover:bg-[#101F38] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-[#263B5C] space-y-2.5">
            <button
              onClick={() => handleGoToAuth('login')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#263B5C] bg-slate-50 dark:bg-[#101F38]/60 text-slate-800 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-[#152A48]"
            >
              <LogIn className="w-4 h-4 text-[#5B8CFF]" />
              <span>Sign In / Register</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchApp();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#7C6CFF] text-white font-semibold text-sm flex items-center justify-center shadow-md shadow-[#5B8CFF]/25"
            >
              <span>Launch SatQuery AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
