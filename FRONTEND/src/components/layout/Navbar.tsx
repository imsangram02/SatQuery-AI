import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Radio, 
  UserCheck, 
  LogOut,
  Split,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Screen, UserProfile } from '../../types';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

interface NavbarProps {
  currentScreen: Screen;
  currentTab?: 'profile' | 'api-keys' | 'confidence';
  onNavigate: (screen: Screen, tab?: 'profile' | 'api-keys' | 'confidence') => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

/**
 * SatQueryAI High-Tech Celestial Theme Mode Toggle
 * Features dual-state space/dawn track with glowing cyan-teal orb (Dark) and radiant solar amber orb (Light).
 */
const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative inline-flex h-8 w-[62px] items-center rounded-full p-1 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 active:scale-95 cursor-pointer select-none ${
        isDark
          ? 'bg-gradient-to-r from-slate-950 via-teal-950/80 to-slate-900 border border-teal-500/50 shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_0_15px_rgba(45,212,191,0.3)] hover:border-teal-400 hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_0_22px_rgba(45,212,191,0.5)]'
          : 'bg-gradient-to-r from-amber-100/90 via-sky-100/80 to-slate-100 border border-amber-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_15px_rgba(245,158,11,0.28)] hover:border-amber-400 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_22px_rgba(245,158,11,0.45)]'
      }`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle light and dark mode"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {/* Background Track Celestial Icons */}
      <div className="absolute inset-0 px-2 flex items-center justify-between pointer-events-none">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'text-amber-400/40 opacity-100' : 'opacity-0'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'text-slate-400 opacity-100'}`} />
      </div>

      {/* Floating Glowing Sliding Orb */}
      <span
        className={`relative z-10 inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isDark
            ? 'translate-x-[30px] bg-gradient-to-tr from-teal-400 via-cyan-400 to-sky-300 text-slate-950 shadow-[0_0_14px_rgba(45,212,191,0.85)] border border-teal-100/80'
            : 'translate-x-0 bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 shadow-[0_0_14px_rgba(245,158,11,0.75)] border border-amber-100'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-slate-950 stroke-[2.4] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-950 stroke-[2.4] transition-transform duration-300 group-hover:rotate-45" />
        )}
      </span>
    </button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  currentTab = 'confidence',
  onNavigate,
  user,
  onOpenAuth,
  onSignOut
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Completely hide Navbar on unauthenticated Login/Sign Up page
  if (!user) {
    return null;
  }

  // Main collapsible navigation items arranged in clear order
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Earth Observation Operations Center',
      screen: 'dashboard' as Screen,
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'benchmarks',
      label: 'Benchmarks',
      subtitle: 'SpaceNet 8 Verified SOTA Models',
      screen: 'showcase' as Screen,
      icon: Split,
      badge: 'SOTA'
    },
    {
      id: 'settings',
      label: 'Settings',
      subtitle: 'Model Confidence, API Keys & Mesh',
      screen: 'settings' as Screen,
      tab: 'confidence' as const,
      icon: SettingsIcon
    },
    {
      id: 'profile',
      label: 'Profile',
      subtitle: 'Analyst Security & Credentials',
      screen: 'settings' as Screen,
      tab: 'profile' as const,
      icon: UserCheck
    }
  ];

  const handleItemClick = (screen: Screen, tab?: 'profile' | 'api-keys' | 'confidence') => {
    setIsSidebarOpen(false);
    if (!user) {
      onOpenAuth('signin');
      return;
    }
    onNavigate(screen, tab);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* STICKY TOP HEADER                                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Section: Three-Line Hamburger Icon + Brand Logo */}
          {/* Left Section: Three-Line Hamburger Icon (ONLY shown when authenticated) + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Clean Three-Line Hamburger Icon: ONLY shown when user is logged in */}
            {user && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_18px_rgba(56,189,248,0.25)] transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 flex items-center justify-center group"
                aria-label="Open navigation menu"
                title="Open Navigation Menu"
              >
                <div className="w-5 h-3.5 flex flex-col justify-between items-center">
                  <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-200 group-hover:bg-cyan-400 shadow-xs" />
                  <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-200 group-hover:bg-cyan-400 shadow-xs" />
                  <span className="w-5 h-[2px] bg-current rounded-full transition-all duration-200 group-hover:bg-cyan-400 shadow-xs" />
                </div>
              </button>
            )}

            {/* Brand Logo & Platform Title */}
            <button
              onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
              className="flex items-center rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8CFF]"
              title="SatQuery AI Home"
            >
              <ModernSatelliteAiLogo size="md" showText={true} />
            </button>
          </div>

          {/* Right Section: Secure Gateway Status, Telemetry, Theme Toggle, and User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Secure Gateway Status Indicator (Displayed on main dashboard / internal pages) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 dark:border-emerald-500/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Secure Gateway: <strong className="font-bold text-emerald-800 dark:text-emerald-200">Active</strong></span>
              </span>
            </div>

            {/* Constellation Live Telemetry Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <Radio className="w-3 h-3 text-teal-500" />
              <span>STAC: 8 Active Sensors</span>
            </div>

            {/* High-Tech Celestial Sun/Moon Theme Toggle Switch */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* Profile Chip */}
            <button
              onClick={() => handleItemClick('settings', 'profile')}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              title="Account Profile"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] border border-cyan-500/30">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{user.name.split(' ')[1] || user.name}</span>
              <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* COLLAPSIBLE LEFT-SIDE NAVIGATION PANEL (SIDEBAR)                          */}
      {/* ONLY RENDERED WHEN USER IS AUTHENTICATED                                  */}
      {/* ========================================================================= */}
      {user && (
        <>
          {/* Semi-Transparent Backdrop with Blur */}
          <div
            className={`fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Left Sidebar Panel */}
          <aside
            className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-r border-slate-200 dark:border-cyan-500/20 shadow-2xl dark:shadow-[0_0_60px_rgba(56,189,248,0.2)] flex flex-col justify-between transition-transform duration-300 ease-out text-slate-900 dark:text-slate-100 select-none ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-label="Main Navigation Menu"
          >
            {/* Radiant Blue, Cyan, and Purple Glowing Top Border Strip */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600 shadow-[0_0_18px_rgba(56,189,248,0.6)] flex-shrink-0" />

            {/* Ambient Glowing Atmospheric Backdrops */}
            <div className="absolute top-0 -left-12 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-16 w-56 h-56 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-52 h-52 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Section: Brand Header & Compact Active User Indicator */}
            <div className="flex-shrink-0 relative z-10">
              {/* Sidebar Header with Brand & Close Button */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-cyan-500/15 flex items-center justify-between">
                <ModernSatelliteAiLogo size="sm" showText={true} />

                {/* Close Button */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-150 active:scale-[0.98]"
                  aria-label="Close navigation panel"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Status Strip */}
              <div className="px-3.5 py-1.5 border-b border-slate-200 dark:border-cyan-500/10 bg-slate-100/60 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-700 dark:text-cyan-300 text-[9px] flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate block leading-none">
                      {user.name}
                    </span>
                    <span className="text-[8.5px] text-cyan-600 dark:text-cyan-400/90 font-mono leading-none flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse inline-block"></span>
                      <span className="truncate">{user.role}</span>
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-600 dark:text-slate-400 font-mono bg-slate-200/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-700/60">
                  Active
                </span>
              </div>
            </div>

            {/* Middle Section: Navigation Hub */}
            <div className="flex-1 px-3 py-3 space-y-2 relative z-10 overflow-y-auto">
              {/* Navigation Items List: All options arranged with clear descriptions */}
              <nav className="space-y-1.5">
                <div className="px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Navigation Hub</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-[9px]">All Options</span>
                </div>

                {navItems.map((item) => {
                  const isActive = user && (
                    item.id === 'profile'
                      ? currentScreen === 'settings' && currentTab === 'profile'
                      : item.id === 'settings'
                      ? currentScreen === 'settings' && currentTab !== 'profile'
                      : currentScreen === item.screen
                  );

                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.screen, item.tab)}
                      className={`w-full group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        isActive
                          ? 'bg-cyan-500/15 dark:bg-cyan-500/20 border border-cyan-400/50 text-slate-950 dark:text-white shadow-sm dark:shadow-[0_0_18px_rgba(56,189,248,0.2)]'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100/60 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/35 hover:shadow-xs'
                      }`}
                    >
                      {/* Active Indicator Strip on Left */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
                      )}

                      {/* Item Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                          isActive
                            ? 'bg-cyan-500/25 dark:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 shadow-sm border border-cyan-400/40'
                            : 'bg-slate-200/70 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-500/15 group-hover:border group-hover:border-cyan-500/30'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>

                      {/* Text Labels & Description */}
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold block truncate transition-colors ${
                              isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate leading-tight group-hover:text-slate-700 dark:group-hover:text-slate-300">
                            {item.subtitle}
                          </span>
                        </div>

                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-150 ${
                          isActive ? 'text-cyan-500 dark:text-cyan-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5'
                        }`}
                      />
                    </button>
                  );
                })}

                {/* Single Celestial Theme Toggle Switch */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  <div className="px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Appearance</span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold text-[9px] capitalize">{theme} Mode</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 stroke-[2.2]" /> : <Sun className="w-3.5 h-3.5 stroke-[2.2]" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                          Theme Mode
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                          {theme === 'dark' ? 'Dark Futuristic UI' : 'Daylight Crisp UI'}
                        </span>
                      </div>
                    </div>
                    <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  </div>
                </div>
              </nav>
            </div>

            {/* Sidebar Footer: STAC Mesh Status & Sign Out Control */}
            <div className="px-3 py-2 border-t border-slate-200 dark:border-cyan-500/15 relative z-10 bg-slate-50/95 dark:bg-slate-950/95 flex-shrink-0 space-y-1.5">
              {/* Live Sensor Mesh Banner */}
              <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/15 text-[9.5px] text-slate-600 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span>STAC Constellation</span>
                </div>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">8 Sensors Online</span>
              </div>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 shadow-xs transition-all duration-150 active:scale-[0.98]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
