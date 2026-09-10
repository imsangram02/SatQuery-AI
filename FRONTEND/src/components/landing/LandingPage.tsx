import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { CoreFeaturesSection } from './CoreFeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { UseCasesSection } from './UseCasesSection';
import { Footer } from '../layout/Footer';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { CosmicOrbitBackground } from './CosmicOrbitBackground';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLaunchWithScenario?: (query?: string, mode?: 'single' | 'bi-temporal' | 'optical-sar') => void;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
  onNavigateToAuth?: (page: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLaunchWithScenario,
  onOpenAuth,
  onNavigateToAuth
}) => {
  const handleScrollToFeatures = () => {
    const el = document.querySelector('#features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-modern-gradient text-slate-900 dark:text-[#F5F7FF] selection:bg-[#5B8CFF] selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Space Related Animated Cosmic Background */}
      <CosmicOrbitBackground />

      {/* Subtle glowing nebula accents in cyan (#00f2fe) and indigo (#4facfe) */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-radial from-[#4facfe]/10 via-[#00f2fe]/06 to-transparent blur-[140px] pointer-events-none opacity-30 dark:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-radial from-[#00f2fe]/08 via-[#4facfe]/06 to-transparent blur-[150px] pointer-events-none opacity-30 dark:opacity-100 transition-opacity duration-300" />

      {/* 1. Landing Navbar */}
      <LandingNavbar
        onLaunchApp={onLaunchApp}
        onOpenAuth={onOpenAuth}
        onNavigateToAuth={onNavigateToAuth}
      />

      {/* Main Sections */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* 1. Home (Hero Section) */}
        <LandingHero
          onLaunchApp={onLaunchApp}
          onExploreFeatures={handleScrollToFeatures}
        />

        {/* 2. Features */}
        <RevealOnScroll direction="up" delay={100} duration={1000}>
          <CoreFeaturesSection
            onLaunchWithQuery={(query, mode) => {
              if (onLaunchWithScenario) {
                onLaunchWithScenario(query, mode);
              } else {
                onLaunchApp();
              }
            }}
          />
        </RevealOnScroll>

        {/* 3. How It Works */}
        <RevealOnScroll direction="up" delay={80} duration={1000}>
          <HowItWorksSection />
        </RevealOnScroll>

        {/* 4. Use Cases */}
        <RevealOnScroll direction="up" delay={80} duration={1000}>
          <UseCasesSection />
        </RevealOnScroll>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
