import React, { useState, useEffect } from 'react';
import { 
  X, 
  Satellite, 
  Mail, 
  Lock, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Globe,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_PROFILE } from '../../data/mockData';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'signin',
  onClose,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('m.chen@earthobservatory.org');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Dr. Maya Chen');
  const [organization, setOrganization] = useState('Planetary Dynamics Institute');

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name || DEFAULT_PROFILE.name,
      email: email || DEFAULT_PROFILE.email,
      organization: organization || DEFAULT_PROFILE.organization,
      role: tab === 'signup' ? 'Earth Observation Scientist' : 'Principal Geospatial Research Lead',
      stacTier: 'Enterprise STAC Planetary Dedicated',
      quotaUsedGb: 840,
      quotaMaxGb: 2000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md">
        {/* Backlit Glow for Modal */}
        <div className="absolute -inset-1.5 sm:-inset-2 rounded-[28px] pointer-events-none z-0 animate-backlight-pulse">
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-purple-600/20 dark:from-cyan-400/30 dark:via-blue-500/25 dark:to-purple-500/25 blur-2xl opacity-75 dark:opacity-90" />
          <div className="absolute -inset-1 rounded-[24px] bg-gradient-to-r from-teal-400/40 via-cyan-400/50 via-blue-500/45 to-purple-500/35 dark:from-teal-400/55 dark:via-cyan-400/60 dark:via-blue-500/50 dark:to-purple-500/45 blur-lg opacity-85 dark:opacity-95" />
        </div>

        <div 
          className="relative z-10 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header decoration */}
          <div className="h-2 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo & Title */}
          <div className="mb-6">
            <ModernSatelliteAiLogo size="md" showText={true} />
            <p className="text-xs text-slate-500 dark:text-[#A8B6CF] mt-2">
              Planetary STAC & Geospatial Inference Gateway
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                tab === 'signin'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-teal-500" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                tab === 'signup'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-500" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Title
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Dr. Maya Chen"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Research Organization / Enterprise
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    placeholder="Planetary Dynamics Institute"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@earthobservatory.org"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {tab === 'signin' && (
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                    Forgot key?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your secure password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <span>{tab === 'signin' ? 'Log In to Terminal' : 'Create Account & Launch'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Institutional SSO Options */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 cursor-pointer hover:text-teal-400">
              <Globe className="w-3 h-3 text-slate-400" />
              Copernicus SSO
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-teal-400">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              NASA Earthdata
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
