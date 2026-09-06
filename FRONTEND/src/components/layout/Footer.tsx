import React from 'react';
import { Satellite, Shield, Globe, Terminal, FileCode2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                SatQuery<span className="text-teal-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open Planetary Foundation Models for multi-spectral Earth Observation, real-time change detection, and climate intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-600 dark:text-teal-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              All 8 Global Processing Nodes Operational
            </div>
          </div>

          {/* Col 2: Earth Observation Sensors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Sensors & Feeds
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  ESA Copernicus Sentinel-2 L2A (10m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  USGS / NASA Landsat-9 OLI-2 (15m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  PlanetScope 8-Band SuperDove (3m)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Globe className="w-3 h-3 text-slate-400" />
                  Sentinel-1 C-Band SAR GRD (5m)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Foundation Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <FileCode2 className="w-3 h-3 text-slate-400" />
                  GeoSAM-v3 Foundation Weights
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  STAC API Specification v1.0.0
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Shield className="w-3 h-3 text-slate-400" />
                  Cloud-Optimized GeoTIFF (COG)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  OGC Compliant WMS / WMTS Tiling
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Benchmark Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Integrity & Standards
            </h4>
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold font-mono text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                NASA ARD & CEOS Certified
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                All spectral bands are orthorectified and bottom-of-atmosphere (BOA) atmospherically corrected in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SatQuery AI Consortium. Multi-Modal Earth Observation & Spatial Intelligence.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">API Docs</span>
            <span className="hover:text-teal-400 cursor-pointer transition-colors">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
