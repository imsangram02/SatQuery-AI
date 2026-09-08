import React, { useState, useEffect } from 'react';
import { Satellite, Sun, Moon, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingNavbarProps {
  onLaunchApp: () => void;
  onOpenAuth?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchApp }) => {
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
    { label: 'Problem', href: '#problem' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Preview', href: '#preview' },
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: 🛰 SatQuery AI */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
            <Satellite className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              SatQuery<span className="text-cyan-500 dark:text-cyan-400">AI</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              SIH 2026
            </span>
          </div>
        </a>

        {/* Center: Clean Minimal Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle & Launch SatQuery AI CTA */}
        <div className="flex items-center gap-3">
          {/* Celestial Theme Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Primary CTA: Launch SatQuery AI */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
            <span>Launch SatQuery AI</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-cyan-500/20 shadow-xl space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-cyan-500"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchApp();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch SatQuery AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
