import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthGatewayLanding } from './components/landing/AuthGatewayLanding';
import { HeroSection } from './components/landing/HeroSection';
import { BenchmarkBadges } from './components/landing/BenchmarkBadges';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { CallToAction } from './components/landing/CallToAction';
import { QuickStartCards } from './components/dashboard/QuickStartCards';
import { MetricsOverview } from './components/dashboard/MetricsOverview';
import { AnalysesTable } from './components/dashboard/AnalysesTable';
import { SettingsView } from './components/settings/SettingsView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { DedicatedChatView } from './components/chat/DedicatedChatView';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';
import { GeospatialBackground } from './components/layout/GeospatialBackground';
import { Screen, UserProfile, AOIPreset } from './types';
import { MOCK_AOI_PRESETS } from './data/mockData';
import { Compass, Satellite } from 'lucide-react';
import { OAuthModal } from './components/auth/OAuthModal';

export function App() {
  // Check if current window was spawned as an OAuth popup
  const isOAuthPopup = typeof window !== 'undefined' && window.location.hash.startsWith('#oauth-');
  const oauthProvider = typeof window !== 'undefined' && window.location.hash.includes('google') ? 'Google' : 'GitHub';
  const oauthState = typeof window !== 'undefined' 
    ? (new URLSearchParams(window.location.hash.split('?')[1] || '').get('state') || '') 
    : '';

  // Authentication state: persisted in sessionStorage so refreshes and redirects stay logged in
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem('satquery_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    try {
      const saved = sessionStorage.getItem('satquery_user');
      return saved ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [settingsTab, setSettingsTab] = useState<'profile' | 'api-keys' | 'confidence'>('confidence');
  const [stagedAOI, setStagedAOI] = useState<AOIPreset>(MOCK_AOI_PRESETS[0]);

  // Called on successful log in or sign up
  const handleLoginSuccess = (user: UserProfile) => {
    try {
      sessionStorage.setItem('satquery_user', JSON.stringify(user));
    } catch (err) {
      console.warn('Unable to persist session', err);
    }
    setCurrentUser(user);
    setCurrentScreen('dashboard');
    window.location.hash = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called on sign out
  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('satquery_user');
    } catch (err) {
      console.warn('Unable to remove session', err);
    }
    setCurrentUser(null);
    setCurrentScreen('landing');
    window.location.hash = 'landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Robust URL Hash Synchronization with Strict Authentication Guard
  useEffect(() => {
    // If running in OAuth popup, do not redirect or alter hash
    if (isOAuthPopup) return;

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash.startsWith('oauth-')) return;

      const hash = rawHash as Screen;

      // If user is not authenticated, strictly lock internal pages and force landing gateway
      if (!currentUser) {
        if (hash !== 'landing') {
          window.location.hash = 'landing';
        }
        setCurrentScreen('landing');
        return;
      }

      // If authenticated, allow navigation between all internal screens
      if (['dashboard', 'workspace', 'chat', 'showcase', 'settings'].includes(hash)) {
        setCurrentScreen(hash);
      } else {
        setCurrentScreen('dashboard');
        window.location.hash = 'dashboard';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser, isOAuthPopup]);

  // Global listener for OAuth success messages from popup windows
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SATQUERY_OAUTH_SUCCESS' && event.data.user) {
        handleLoginSuccess(event.data.user);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const navigate = (screen: Screen, tab?: 'profile' | 'api-keys' | 'confidence') => {
    // Auth Guard
    if (!currentUser) {
      setCurrentScreen('landing');
      window.location.hash = 'landing';
      return;
    }

    if (tab) {
      setSettingsTab(tab);
    }
    setCurrentScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchWithAOI = (aoi?: AOIPreset) => {
    if (aoi) {
      setStagedAOI(aoi);
    }
    navigate('workspace');
  };

  // If this window is dedicated to the OAuth popup flow, render ONLY the OAuth flow view
  if (isOAuthPopup) {
    return (
      <ThemeProvider>
        <OAuthModal
          isOpen={true}
          isPopupPage={true}
          provider={oauthProvider}
          stateParam={oauthState}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Satellite and Remote Sensing Intelligence Background */}
        <GeospatialBackground />

        {/* Navigation Bar with Collapsible Hamburger Sidebar (Rendered on Dashboard & Main Pages) */}
        {currentUser && (
          <Navbar
            currentScreen={currentScreen}
            currentTab={settingsTab}
            onNavigate={navigate}
            user={currentUser}
            onOpenAuth={() => navigate('landing')}
            onSignOut={handleSignOut}
          />
        )}

        {/* Main Content Area guarded by Authentication */}
        <main className="relative z-10 flex-1 flex flex-col">
          {!currentUser ? (
            /* ========================================================================= */
            /* UNAUTHENTICATED: Clean, modern landing page with ONLY Log In and Sign Up */
            /* ========================================================================= */
            <AuthGatewayLanding
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigate}
              onSelectAOI={handleLaunchWithAOI}
            />
          ) : (
            /* ========================================================================= */
            /* AUTHENTICATED: All internal pages and features unlocked                   */
            /* ========================================================================= */
            <>
              {/* DASHBOARD: Earth Observation Operations Center (Default redirect after login) */}
              {currentScreen === 'dashboard' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1 animate-in fade-in">
                  {/* Dashboard Welcome Banner with Controlled Backlit Border Glow */}
                  <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#071328] via-[#0c1f42] to-[#082937] dark:from-[#061226] dark:via-[#0a1e3e] dark:to-[#072432] border border-cyan-500/40 dark:border-cyan-400/45 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_0_12px_1px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_0_20px_rgba(6,182,212,0.12),0_8px_24px_-6px_rgba(0,0,0,0.55)] backdrop-blur-xl overflow-hidden group">
                    {/* Top Radiant Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-teal-400 via-blue-500 to-purple-500 opacity-80 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>

                    {/* Concentrated Corner Ambient Glows */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-cyan-400/15 blur-xl pointer-events-none"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-purple-600/15 blur-xl pointer-events-none"></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 dark:text-cyan-300 mb-1">
                        <Satellite className="w-3.5 h-3.5 animate-pulse" />
                        <span>8 Constellations Online • 42 Passes Today</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        Earth Observation Operations Center
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Welcome back, {currentUser.name}. Full STAC multi-spectral pipeline and foundation models unlocked.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                      <button
                        onClick={() => navigate('workspace')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:via-teal-300 hover:to-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Launch 3-Pane Canvas</span>
                      </button>
                    </div>
                  </div>

                  {/* KPI Metrics */}
                  <MetricsOverview />

                  {/* Quick Start Cards */}
                  <QuickStartCards onSelectPreset={handleLaunchWithAOI} />

                  {/* Analyses Table */}
                  <AnalysesTable onOpenInWorkspace={handleLaunchWithAOI} />

                  <Footer />
                </div>
              )}

              {/* 3-PANE WORKSPACE: Interactive Geospatial Canvas & Telemetry */}
              {currentScreen === 'workspace' && (
                <div className="flex-1 w-full flex flex-col animate-in fade-in">
                  <WorkspaceView initialAOI={stagedAOI} />
                </div>
              )}

              {/* DEDICATED AI CHAT TERMINAL: Multi-Modal Earth Observation Copilot */}
              {currentScreen === 'chat' && (
                <div className="animate-in fade-in">
                  <DedicatedChatView
                    onNavigateToWorkspace={handleLaunchWithAOI}
                    onNavigate={navigate}
                  />
                </div>
              )}

              {/* BENCHMARKS & SHOWCASE: SpaceNet 8 SOTA Verification */}
              {currentScreen === 'showcase' && (
                <div className="animate-in fade-in">
                  <HeroSection 
                    onNavigate={navigate} 
                    onSelectAOI={handleLaunchWithAOI}
                  />
                  <BenchmarkBadges />
                  <FeaturesGrid onNavigate={navigate} />
                  <CallToAction onNavigate={navigate} />
                  <Footer />
                </div>
              )}

              {/* SYSTEM SETTINGS & CONFIDENCE CONTROLS */}
              {currentScreen === 'settings' && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in">
                  <SettingsView
                    user={currentUser}
                    initialTab={settingsTab}
                    onUpdateProfile={(updated) => setCurrentUser(updated)}
                  />
                  <Footer />
                </div>
              )}
            </>
          )}
        </main>

        {/* Floating Quick Chat Widget (ONLY visible when authenticated) */}
        {currentUser && currentScreen !== 'workspace' && currentScreen !== 'chat' && (
          <FloatingChatWidget
            onNavigateToWorkspace={handleLaunchWithAOI}
            onNavigate={navigate}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
