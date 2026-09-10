import React from 'react';
import { Shield, Globe, Terminal, FileCode2, ExternalLink } from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-[#263B5C] bg-slate-100/90 dark:bg-[#080E21]/90 backdrop-blur-md text-slate-600 dark:text-[#A8B6CF] text-xs py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <ModernSatelliteAiLogo size="sm" showText={true} />
            <p className="text-xs text-slate-600 dark:text-[#A8B6CF] leading-relaxed">
              Open Planetary Foundation Models for multi-spectral Earth Observation, real-time change detection, and climate intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-600 dark:text-[#2DD4BF] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#2DD4BF] animate-pulse"></span>
              All 8 Global Processing Nodes Operational
            </div>
          </div>

          {/* Col 2: Earth Observation Sensors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FF] mb-3 font-mono">
              Sensors & Feeds
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-600 dark:text-[#A8B6CF] hover:text-blue-600 dark:hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  ESA Copernicus Sentinel-2 L2A (10m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-[#A8B6CF] hover:text-blue-600 dark:hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  USGS / NASA Landsat-9 OLI-2 (15m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-[#A8B6CF] hover:text-blue-600 dark:hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  PlanetScope 8-Band SuperDove (3m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-[#A8B6CF] hover:text-blue-600 dark:hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Sentinel-1 C-Band SAR GRD (5m)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Application Pages */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FF] mb-3 font-mono">
              Application Pages
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <a href="#landing" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Landing Page
                </a>
              </li>
              <li>
                <a href="#login" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Institutional Sign In
                </a>
              </li>
              <li>
                <a href="#signup" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Researcher Registration
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Analysis Workspace
                </a>
              </li>
              <li>
                <a href="#models" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Models & Specialist Tools
                </a>
              </li>
              <li>
                <a href="#history" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Analysis History & Reports
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-slate-600 dark:text-[#A8B6CF] hover:text-[#5B8CFF] transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-slate-400 dark:text-[#A8B6CF]" />
                  Diagnostic Telemetry
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Benchmark Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FF] mb-3 font-mono">
              Integrity & Standards
            </h4>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#101F38] border border-slate-200 dark:border-[#263B5C] space-y-2 shadow-xs transition-colors">
              <div className="flex items-center gap-2 text-teal-600 dark:text-[#2DD4BF] font-semibold font-mono text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                NASA ARD & CEOS Certified
              </div>
              <p className="text-[11px] text-slate-600 dark:text-[#A8B6CF] leading-relaxed">
                All spectral bands are orthorectified and bottom-of-atmosphere (BOA) atmospherically corrected in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#263B5C] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-[#71819B] transition-colors">
          <p>© 2026 SatQuery AI Consortium. Multi-Modal Earth Observation & Spatial Intelligence.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#5B8CFF] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#5B8CFF] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#5B8CFF] cursor-pointer transition-colors">API Docs</span>
            <span className="hover:text-[#5B8CFF] cursor-pointer transition-colors">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
