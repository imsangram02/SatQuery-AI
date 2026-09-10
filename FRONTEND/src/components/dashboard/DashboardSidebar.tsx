import React from 'react';
import { 
  Satellite, 
  Compass, 
  History, 
  FileText, 
  Cpu, 
  Settings, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DashboardView, UserProfile } from '../../types';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onBackToLanding: () => void;
  user: UserProfile | null;
  systemStatus?: string;
  onSignOut?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onSelectView,
  onBackToLanding,
  user,
  systemStatus = 'AI System Ready',
  onSignOut
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: Compass,
      badge: 'Core'
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: History
    },
    {
      id: 'reports',
      label: 'Saved Reports',
      icon: FileText
    },
    {
      id: 'models',
      label: 'Models & Tools',
      icon: Cpu,
      badge: '6 Models'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 lg:w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-cyan-500/20 flex flex-col justify-between h-screen sticky top-0 select-none z-30 transition-colors duration-200 flex-shrink-0">
      {/* Top Section: Brand & Navigation */}
      <div>
        {/* Top Radiant Accent Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-600 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />

        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center">
            <ModernSatelliteAiLogo size="sm" showText={true} />
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Return to Public Landing Page Link */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={onBackToLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-dashed border-slate-200 dark:border-slate-800 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Landing Page</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Public</span>
          </button>
        </div>

        {/* Sidebar Nav Items (Section 13-14 of design.md) */}
        <nav className="p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
            Operations Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/10 dark:bg-cyan-500/20 border border-cyan-400/50 text-slate-950 dark:text-white shadow-xs dark:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-cyan-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-400/30 text-cyan-900 dark:text-cyan-200 border border-cyan-400/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active User & "● AI System Ready" (Section 14 of design.md) */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
        {/* User Card */}
        {user && (
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30 flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Sign Out / Switch Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section 14 Bottom Requirement: ● AI System Ready */}
        <div className="px-3 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{systemStatus}</span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
