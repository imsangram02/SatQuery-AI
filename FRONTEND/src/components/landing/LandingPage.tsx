import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { ProblemSection } from './ProblemSection';
import { CoreFeaturesSection } from './CoreFeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SupportedAnalysisSection } from './SupportedAnalysisSection';
import { AgenticArchitectureSection } from './AgenticArchitectureSection';
import { ResultsPreviewSection } from './ResultsPreviewSection';
import { EvidenceGroundedSection } from './EvidenceGroundedSection';
import { UseCasesSection } from './UseCasesSection';
import { TechnologySection } from './TechnologySection';
import { LandingCTA } from './LandingCTA';
import { Footer } from '../layout/Footer';
import { CosmicOrbitBackground } from './CosmicOrbitBackground';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLaunchWithScenario?: (query?: string, mode?: 'single' | 'bi-temporal' | 'optical-sar') => void;
  onOpenAuth?: (tab?: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLaunchWithScenario,
  onOpenAuth
}) => {
  const handleScrollToCapabilities = () => {
    const el = document.querySelector('#capabilities');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200">
      {/* Background Cosmic Atmosphere */}
      <CosmicOrbitBackground />

      {/* 1. Landing Navbar (Section 1) */}
      <LandingNavbar onLaunchApp={onLaunchApp} onOpenAuth={onOpenAuth} />

      {/* Main Sections */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* 2. Hero Section (Section 2) */}
        <LandingHero
          onLaunchApp={onLaunchApp}
          onExploreCapabilities={handleScrollToCapabilities}
        />

        {/* 3. Problem Section (Section 3) */}
        <ProblemSection />

        {/* 4. Core Features Section (Section 4) */}
        <CoreFeaturesSection
          onLaunchWithQuery={(query, mode) => {
            if (onLaunchWithScenario) {
              onLaunchWithScenario(query, mode);
            } else {
              onLaunchApp();
            }
          }}
        />

        {/* 5. How It Works (Section 5) */}
        <HowItWorksSection />

        {/* 6. Supported Image Analysis (Section 6) */}
        <SupportedAnalysisSection
          onLaunchMode={(mode) => {
            if (onLaunchWithScenario) {
              onLaunchWithScenario(undefined, mode);
            } else {
              onLaunchApp();
            }
          }}
        />

        {/* 7. Agentic Architecture (Section 7) */}
        <AgenticArchitectureSection />

        {/* 8. Results Preview (Section 8) */}
        <ResultsPreviewSection
          onLaunchWithScenario={() => {
            if (onLaunchWithScenario) {
              onLaunchWithScenario("Has the built-up area increased?", "bi-temporal");
            } else {
              onLaunchApp();
            }
          }}
        />

        {/* 9. Evidence-Grounded AI (Section 9) */}
        <EvidenceGroundedSection />

        {/* 10. Use Cases (Section 10) */}
        <UseCasesSection />

        {/* 11. Technology / Research (Section 11) */}
        <TechnologySection />

        {/* 12. Final CTA (Section 12) */}
        <LandingCTA onLaunchApp={onLaunchApp} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
