import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Cpu, 
  Radio, 
  FileCheck2, 
  ArrowRight,
  Maximize2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { Screen } from '../../types';

interface FeaturesGridProps {
  onNavigate: (screen: Screen) => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Cpu,
      title: 'Geospatial Foundation Models',
      desc: 'Trained on 45M+ multi-sensor Earth observation scenes. Performs zero-shot segmentation across biomes, urban matrices, and oceanic zones with 89.4% mIoU.'
    },
    {
      icon: Radio,
      title: 'All-Weather SAR Radar Fusion',
      desc: 'Overcomes impenetrable tropical cloud cover by fusing Sentinel-1 C-Band SAR cross-polarization (VV/VH) with optical multi-spectral data.'
    },
    {
      icon: SlidersHorizontal,
      title: 'Real-Time Band Index Algebra',
      desc: 'Compute NDVI, NDWI, NBR, and EVI directly on calibrated Bottom-of-Atmosphere (BOA) surface reflectance tiles in sub-20ms latency.'
    },
    {
      icon: Sparkles,
      title: 'Observable AI Co-Pilot',
      desc: 'Inspect step-by-step chain-of-thought execution traces, spatial projection transformations, cloud masking logs, and grounded quantitative statistics.'
    },
    {
      icon: Layers,
      title: 'Multi-Temporal Drift Analysis',
      desc: 'Automatic pixel-level co-registration and radiometric normalization to flag illegal deforestation corridors, wildfire char depth, and shoreline erosion.'
    },
    {
      icon: FileCheck2,
      title: 'OGC & STAC Native Compliance',
      desc: 'Native ingestion and export for Cloud-Optimized GeoTIFF (COG), GeoJSON feature collections, Shapefiles, and STAC API v1.0 catalogs.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5 text-teal-500" />
          Enterprise Earth Observation Stack
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Next-Generation Planetary Analytics
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          From multi-spectral raster processing to observable LLM-orchestrated spatial queries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-150">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-teal-600 dark:text-teal-400">
                <span className="font-semibold">Capability 0{i + 1}</span>
                <button
                  onClick={() => onNavigate('workspace')}
                  className="flex items-center gap-1 hover:underline active:scale-[0.98] transition-transform"
                >
                  <span>Test in Canvas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
