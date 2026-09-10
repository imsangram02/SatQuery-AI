import React from 'react';
import { 
  Wheat, 
  Flame, 
  Building2, 
  Trees, 
  Droplets, 
  MapPin, 
  Globe2 
} from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: Wheat,
      title: 'Agriculture',
      tag: 'Crop Health & Yield',
      desc: 'NDVI vegetation vigour tracking, winter crop yield forecasting, soil moisture evaluation, and drought stress detection across agricultural belts.'
    },
    {
      icon: Flame,
      title: 'Disaster Management',
      tag: 'Rapid Emergency Response',
      desc: 'All-weather SAR flood extent mapping, wildfire burn scar delineation via dNBR, and landslide boundary vectorization for first responders.'
    },
    {
      icon: Building2,
      title: 'Urban Planning',
      tag: 'Sprawl & Density',
      desc: 'Bi-temporal built-up expansion audits, illegal construction detection, rooftop solar capacity analysis, and transportation corridor expansion.'
    },
    {
      icon: Trees,
      title: 'Forest Monitoring',
      tag: 'Canopy Loss & Logging',
      desc: 'Automated detection of selective logging roads, illegal clear-cutting perimeters in tropical rainforests, and mangrove conservation tracking.'
    },
    {
      icon: Droplets,
      title: 'Water Resources',
      tag: 'Reservoirs & Drought',
      desc: 'Lake Powell surface area reduction tracking, reservoir capacity estimation using NDWI, and wetland shrinkage monitoring across hydrological cycles.'
    },
    {
      icon: MapPin,
      title: 'Infrastructure Mapping',
      tag: 'Asset Integrity',
      desc: 'Deep sub-meter panchromatic detection of port berthing vessels, railway corridors, highway development, and electrical transmission rights-of-way.'
    },
    {
      icon: Globe2,
      title: 'Environmental Monitoring',
      tag: 'Ecological Drift',
      desc: 'Glacial retreat tracking, coastal shoreline erosion quantification, mine tailings dispersion, and biodiversity corridor continuity assessments.'
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-[#263B5C]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-[#7C6CFF] border border-purple-500/25 font-mono text-xs font-semibold uppercase tracking-wider">
          Mission-Critical Domains
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F7FF] tracking-tight">
          Designed for Real-World Earth Observation
        </h2>
        <p className="text-slate-600 dark:text-[#A8B6CF] text-sm sm:text-base leading-relaxed">
          From agricultural drought forecasting to disaster relief response, SatQuery AI accelerates high-stakes environmental decision-making.
        </p>
      </div>

      {/* 7 Use Cases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#101F38] hover:bg-slate-50 dark:hover:bg-[#152A48] border border-slate-200 dark:border-[#263B5C] hover:border-blue-400 dark:hover:border-[#5B8CFF]/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-[#5B8CFF] border border-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-[#A8B6CF] bg-slate-100 dark:bg-[#0B1930] border border-slate-200 dark:border-[#263B5C] px-2 py-0.5 rounded">
                    {uc.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FF] mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8B6CF] leading-relaxed">
                  {uc.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#263B5C] flex items-center justify-between text-[11px] font-mono text-blue-600 dark:text-[#5B8CFF] group-hover:text-cyan-600 dark:group-hover:text-[#22D3EE] font-semibold transition-colors">
                <span className="text-slate-500 dark:text-[#A8B6CF]">Domain 0{i + 1}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">View Workflows →</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
