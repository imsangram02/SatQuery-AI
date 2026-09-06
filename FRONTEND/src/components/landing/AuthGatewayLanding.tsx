import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Mail, 
  Lock, 
  UserCheck, 
  Building2, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Globe, 
  Radio, 
  CheckCircle2,
  HardDrive,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile, Screen, AOIPreset } from '../../types';
import { DEFAULT_PROFILE } from '../../data/mockData';
import { CosmicOrbitBackground } from './CosmicOrbitBackground';
import { 
  generateOAuthState, 
  saveOAuthState, 
  getOAuthUrl, 
  openOAuthPopup, 
  OAuthProvider 
} from '../../services/oauthService';
import { OAuthModal } from '../auth/OAuthModal';

interface AuthGatewayLandingProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (screen: Screen) => void;
  onSelectAOI?: (aoi: AOIPreset) => void;
}

export const AuthGatewayLanding: React.FC<AuthGatewayLandingProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Clean form state without dummy masked text
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');

  // OAuth Flow State
  const [activeOAuthModal, setActiveOAuthModal] = useState<OAuthProvider | null>(null);
  const [currentOAuthState, setCurrentOAuthState] = useState<string>('');

  // Listen for OAuth messages from popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SATQUERY_OAUTH_SUCCESS' && event.data.user) {
        setActiveOAuthModal(null);
        onLoginSuccess(event.data.user);
        onNavigate('dashboard');
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess, onNavigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name.trim() || (activeTab === 'signup' ? 'Earth Observation Scientist' : DEFAULT_PROFILE.name),
      email: email.trim() || DEFAULT_PROFILE.email,
      organization: organization.trim() || DEFAULT_PROFILE.organization,
      role: activeTab === 'signup' ? 'Earth Observation Scientist' : 'Principal Geospatial Research Lead',
      stacTier: 'Enterprise STAC Planetary Dedicated',
      quotaUsedGb: 840,
      quotaMaxGb: 2000
    });
    onNavigate('dashboard');
  };

  const handleSocialLogin = (provider: OAuthProvider) => {
    const state = generateOAuthState();
    setCurrentOAuthState(state);
    saveOAuthState(state, provider);

    const url = getOAuthUrl(provider, state);
    const title = provider === 'Google' ? 'Sign in - Google Accounts' : 'Authorize SatQueryAI - GitHub';
    const popup = openOAuthPopup(url, title, 500, provider === 'Google' ? 620 : 680);

    // If popup was blocked by browser or failed, immediately open the in-page modal fallback
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setActiveOAuthModal(provider);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden select-none bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Full-screen Dark Futuristic Cosmic Orbit Background */}
      <CosmicOrbitBackground />

      {/* Main Gateway Hero & Auth Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 w-full my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center lg:items-start xl:items-center">
          
          {/* LEFT COLUMN: Planetary Earth Observation & AI Intelligence Showcase (Elevated Upward) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-5 lg:-translate-y-3 xl:-translate-y-5">
            {/* Top Status Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-gradient-to-r dark:from-cyan-950/80 dark:via-slate-900/80 dark:to-purple-950/60 border border-cyan-500/30 dark:border-cyan-500/40 text-[11px] font-medium text-cyan-800 dark:text-cyan-300 shadow-xs backdrop-blur-xl transition-all duration-200 hover:border-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <Satellite className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Planetary Intelligence Terminal • [LIVE ORBIT]</span>
            </div>

            {/* Headline */}
            <div className="space-y-2 sm:space-y-2.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Earth Observation Intelligence at{' '}
                <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 dark:from-cyan-400 dark:via-teal-300 dark:to-purple-400 bg-clip-text text-transparent">
                  Sub-Meter Precision
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Query multi-spectral Sentinel-2, Landsat-9, and SAR radar constellations in plain language.
                Detect canopy loss, flood perimeters, and agricultural stress with sub-second deep neural inference.
              </p>
            </div>

            {/* Core Aerospace Capability Badges (Compact & Balanced) */}
            <div className="space-y-2.5 pt-0.5 max-w-lg">
              <div className="group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-cyan-500/20 backdrop-blur-xl shadow-xs hover:shadow-sm dark:shadow-black/40 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-teal-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    Multi-Spectral Optical & SAR Radar Fusion
                  </h2>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    10m Sentinel-2 L2A Bottom-of-Atmosphere reflectance fused with cloud-penetrating C-Band radar.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-cyan-500/20 backdrop-blur-xl shadow-xs hover:shadow-sm dark:shadow-black/40 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400/20 to-purple-600/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    GeoSAM-v3 Foundation Model (89.4% mIoU)
                  </h2>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    Zero-shot semantic segmentation and disturbance polygon vectorization with 18.2ms latency.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-cyan-500/20 backdrop-blur-xl shadow-xs hover:shadow-sm dark:shadow-black/40 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-600/20 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    NASA ARD & CEOS Certified Standards
                  </h2>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    Native Cloud-Optimized GeoTIFF (COG), GeoJSON, and STAC API v1.0.0 integration.
                  </p>
                </div>
              </div>
            </div>

            {/* Real-Time Telemetry Metrics Strip */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-slate-900 dark:text-white font-semibold">8 Constellations Online</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-[11px]">
                <Radio className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span className="text-slate-700 dark:text-slate-300">1.24 GB/s Downlink</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs text-[11px]">
                <HardDrive className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span className="text-slate-700 dark:text-slate-300">Sub-Meter Precision</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scaled-Down Premium Light/Dark Glassmorphism Login & Sign Up Card */}
          <div className="lg:col-span-6 xl:col-span-5 max-w-[380px] sm:max-w-[395px] mx-auto lg:ml-auto w-full relative z-20">
            {/* ========================================================================= */}
            {/* BACKLIT GLOW: Multi-Layered Futuristic Illuminated Backlight             */}
            {/* Radiates softly from behind all 4 edges & corners (Cyan, Blue, Purple)   */}
            {/* ========================================================================= */}
            <div className="absolute -inset-1.5 sm:-inset-2 rounded-[30px] pointer-events-none z-0 animate-backlight-pulse">
              {/* Layer 1: Wide Ambient Atmospheric Bloom (Soft diffuse spread) */}
              <div 
                className="absolute -inset-3 sm:-inset-4 rounded-[34px] bg-gradient-to-tr from-cyan-500/30 via-blue-600/25 to-purple-600/20 dark:from-cyan-400/35 dark:via-blue-500/30 dark:to-purple-500/25 blur-2xl sm:blur-3xl opacity-75 dark:opacity-90"
              />

              {/* Layer 2: Contoured Edge Radiator (Four edges & rounded corners illumination) */}
              <div 
                className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-teal-400/40 via-cyan-400/50 via-blue-500/45 to-purple-500/35 dark:from-teal-400/55 dark:via-cyan-400/60 dark:via-blue-500/50 dark:to-purple-500/45 blur-md opacity-85 dark:opacity-95"
              />

              {/* Layer 3: Corner Pinpoint Ambient Radiance Blooms */}
              {/* Top-Left Corner: Vibrant Cyan/Teal Radiance */}
              <div 
                className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-cyan-400/25 dark:bg-cyan-300/35 blur-xl pointer-events-none"
              />
              {/* Top-Right Corner: Electric Blue Glow */}
              <div 
                className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-blue-500/25 dark:bg-blue-400/35 blur-xl pointer-events-none"
              />
              {/* Bottom-Right Corner: Subtle Cosmic Purple Accent */}
              <div 
                className="absolute -bottom-4 -right-4 w-36 h-36 rounded-full bg-purple-600/20 dark:bg-purple-500/30 blur-xl pointer-events-none"
              />
              {/* Bottom-Left Corner: Deep Teal/Cyan Glow */}
              <div 
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-teal-400/20 dark:bg-teal-400/35 blur-xl pointer-events-none"
              />
            </div>

            {/* Login & Sign Up Card (Softer, modern rounded corners: rounded-[24px]) */}
            <div className="bg-white/95 dark:glass-panel-dark border border-slate-200/90 dark:border-cyan-500/30 shadow-[0_10px_35px_-5px_rgba(6,182,212,0.2),0_20px_50px_-10px_rgba(59,130,246,0.16),0_0_30px_rgba(168,85,247,0.1)] dark:shadow-[0_0_50px_-10px_rgba(6,182,212,0.35),0_0_80px_-15px_rgba(59,130,246,0.28),0_0_40px_-10px_rgba(168,85,247,0.2),0_30px_70px_-15px_rgba(0,0,0,0.95)] relative z-10 rounded-[24px] p-4.5 sm:p-5 sm:px-6 overflow-hidden transition-all duration-300 backdrop-blur-2xl">
              
              {/* Luminous Top Radiant Accent Bar with Cyan to Subtle Purple Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.6)]"></div>

              {/* Aerospace Corner HUD Brackets */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-cyan-400/50 pointer-events-none rounded-tl-sm"></div>
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-cyan-400/50 pointer-events-none rounded-tr-sm"></div>
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-cyan-400/50 pointer-events-none rounded-bl-sm"></div>

              {/* Clean Authentication Interface Header */}
              <div className="mb-3.5 text-center">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeTab === 'login' 
                    ? 'Enter your credentials to access your operations dashboard' 
                    : 'Register your institutional credentials to get started'}
                </p>
              </div>

              {/* Segmented Futuristic Tab Switcher */}
              <div className="flex p-1 mb-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/25 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setForgotPasswordSent(false);
                  }}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold -translate-y-0.5'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <LogIn className={`w-3.5 h-3.5 ${activeTab === 'login' ? 'text-slate-950' : 'text-cyan-600 dark:text-cyan-400'}`} />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setForgotPasswordSent(false);
                  }}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeTab === 'signup'
                      ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold -translate-y-0.5'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <UserPlus className={`w-3.5 h-3.5 ${activeTab === 'signup' ? 'text-slate-950' : 'text-cyan-600 dark:text-cyan-400'}`} />
                  <span>Sign Up</span>
                </button>
              </div>

              {/* Forgot Password Dispatched Alert Toast */}
              {forgotPasswordSent && (
                <div className="mb-3 p-2.5 rounded-lg bg-teal-50 dark:bg-cyan-950/90 border border-teal-200 dark:border-cyan-500/40 text-[11px] text-teal-800 dark:text-cyan-200 flex items-center justify-between gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 dark:text-cyan-400 flex-shrink-0" />
                    <span>Password reset link sent to your institutional email.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordSent(false)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-[11px] px-1 font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Dr. Maya Chen"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 transition-all duration-200 font-sans shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      Research Organization / University Lab
                    </label>
                    <div className="relative group">
                      <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        required
                        placeholder="Planetary Dynamics Institute"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 transition-all duration-200 font-sans shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="analyst@earthobservatory.org"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 transition-all duration-200 font-sans shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your secure password"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25 transition-all duration-200 font-sans shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors focus:outline-none p-0.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox & Forgot Password Link */}
                {activeTab === 'login' && (
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 text-cyan-500 dark:text-cyan-400 focus:ring-cyan-400/30 accent-cyan-500 cursor-pointer transition-colors"
                      />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-medium">
                        Remember Me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordSent(true)}
                      className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Modern Glowing Log In / Sign Up Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {activeTab === 'login' ? (
                    <>
                      <LogIn className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                      <span>Log In</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                      <span>Create Account</span>
                    </>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] ml-0.5" />
                </button>

                {/* Subtle Divider: "or continue with" */}
                <div className="relative my-2.5 pt-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800/90"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2.5 bg-white dark:bg-[#030712]/95 border border-slate-200 dark:border-slate-800/80 rounded-full text-[10px] font-medium text-slate-500 dark:text-slate-400 lowercase tracking-wider backdrop-blur-md">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons: Google and GitHub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md shadow-xs hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    title="Continue with Google"
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                      <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3.7-2.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"/>
                    </svg>
                    <span className="text-[11px] font-semibold whitespace-nowrap">Google</span>
                  </button>

                  {/* Continue with GitHub */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('GitHub')}
                    className="w-full py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-purple-400/60 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md shadow-xs hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    title="Continue with GitHub"
                  >
                    <svg className="w-3.5 h-3.5 flex-shrink-0 fill-current text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 group-hover:scale-105 transition-all duration-200" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="text-[11px] font-semibold whitespace-nowrap">GitHub</span>
                  </button>
                </div>

                {/* Sign Up / Log In Bottom Switcher */}
                <div className="text-center pt-0.5">
                  {activeTab === 'login' ? (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('signup');
                          setForgotPasswordSent(false);
                        }}
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold hover:underline transition-colors ml-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setForgotPasswordSent(false);
                        }}
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold hover:underline transition-colors ml-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                      >
                        Log In
                      </button>
                    </p>
                  )}
                </div>
              </form>

              {/* SSO Institutional Logos */}
              <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <Globe className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                  Copernicus SSO
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <ShieldCheck className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                  NASA Earthdata
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Professional Compliance & Satellite Mesh Strip */}
      <div className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>STAC Catalog v1.0.0 Validated</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cloud-Optimized GeoTIFF (COG)</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sub-Meter GSD Optical & InSAR</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Radio className="w-3 h-3 text-cyan-500 dark:text-cyan-400 animate-pulse" />
            <span>Encrypted STAC Authentication Required</span>
          </div>
        </div>
      </div>

      {/* Interactive OAuth Flow In-Page Fallback (When popup is blocked or closed) */}
      {activeOAuthModal && (
        <OAuthModal
          isOpen={true}
          provider={activeOAuthModal}
          stateParam={currentOAuthState}
          onClose={() => setActiveOAuthModal(null)}
          onSuccess={(user) => {
            setActiveOAuthModal(null);
            onLoginSuccess(user);
            onNavigate('dashboard');
          }}
        />
      )}
    </div>
  );
};
