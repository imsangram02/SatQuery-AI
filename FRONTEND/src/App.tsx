import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OAuthModal } from './components/auth/OAuthModal';
import { AuthModal } from './components/auth/AuthModal';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';
import { Screen, UserProfile, DashboardView } from './types';
import { DEFAULT_PROFILE } from './data/mockData';

export function App() {
  // Check if current window was spawned as an OAuth popup
  const isOAuthPopup = typeof window !== 'undefined' && window.location.hash.startsWith('#oauth-');
  const oauthProvider = typeof window !== 'undefined' && window.location.hash.includes('google') ? 'Google' : 'GitHub';
  const oauthState = typeof window !== 'undefined' 
    ? (new URLSearchParams(window.location.hash.split('?')[1] || '').get('state') || '') 
    : '';

  // User Profile: Defaults to pre-authenticated Lead EO Analyst Dr. Maya Chen so judges/users can test immediately
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = sessionStorage.getItem('satquery_user');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Current screen: 'landing' or 'dashboard'
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'workspace', 'history', 'reports', 'models', 'settings'].includes(hash)) {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  // Active dashboard view when on dashboard
  const [dashboardView, setDashboardView] = useState<DashboardView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'history') return 'history';
      if (hash === 'reports') return 'reports';
      if (hash === 'models') return 'models';
      if (hash === 'settings') return 'settings';
      if (hash === 'workspace' || hash === 'canvas') return 'canvas';
      if (hash === 'errors') return 'errors';
    }
    return 'new-analysis';
  });

  // Auth modal state (for explicit login / signup testing)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  // Handle successful login
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

  // Synchronize URL Hash
  useEffect(() => {
    if (isOAuthPopup) return;

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash.startsWith('oauth-')) return;

      if (['dashboard', 'workspace', 'history', 'reports', 'models', 'settings', 'canvas', 'errors'].includes(rawHash)) {
        setCurrentScreen('dashboard');
        if (rawHash === 'history') setDashboardView('history');
        else if (rawHash === 'reports') setDashboardView('reports');
        else if (rawHash === 'models') setDashboardView('models');
        else if (rawHash === 'settings') setDashboardView('settings');
        else if (rawHash === 'workspace' || rawHash === 'canvas') setDashboardView('canvas');
        else if (rawHash === 'errors') setDashboardView('errors');
        else setDashboardView('new-analysis');
      } else {
        setCurrentScreen('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isOAuthPopup]);

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

  const handleLaunchApp = () => {
    setCurrentScreen('dashboard');
    setDashboardView('new-analysis');
    window.location.hash = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
    window.location.hash = 'landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* ========================================================================= */}
        {/* PART 1 — PUBLIC LANDING PAGE (Sections 1 to 12 of design.md)              */}
        {/* ========================================================================= */}
        {currentScreen === 'landing' ? (
          <LandingPage
            onLaunchApp={handleLaunchApp}
            onLaunchWithScenario={() => handleLaunchApp()}
            onOpenAuth={(tab) => {
              if (tab) setAuthModalTab(tab);
              setIsAuthModalOpen(true);
            }}
          />
        ) : (
          /* ========================================================================= */
          /* PART 2 — APPLICATION / ANALYSIS DASHBOARD (Sections 13 to 26 of design.md)*/
          /* ========================================================================= */
          <DashboardLayout
            user={currentUser}
            onBackToLanding={handleBackToLanding}
            onUpdateProfile={(updated) => setCurrentUser(updated)}
            initialView={dashboardView}
          />
        )}

        {/* Auth Modal for explicit Login/Signup testing */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            initialTab={authModalTab}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Floating AI Copilot Widget (available in dashboard) */}
        {currentScreen === 'dashboard' && (
          <FloatingChatWidget
            onNavigateToWorkspace={() => {
              setDashboardView('canvas');
            }}
            onNavigate={(screen) => {
              if (screen === 'landing') handleBackToLanding();
              else handleLaunchApp();
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
