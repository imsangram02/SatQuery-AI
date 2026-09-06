import React from 'react';
import { 
  Compass, 
  Split, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Share2, 
  Sliders, 
  Check, 
  Maximize2
} from 'lucide-react';
import { AOIPreset, SensorType } from '../../types';

interface WorkspaceHeaderProps {
  activeAOI: AOIPreset;
  activeSensor: SensorType;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  viewMode: 'split' | 'side-by-side' | 'overlay';
  onChangeViewMode: (mode: 'split' | 'side-by-side' | 'overlay') => void;
  onExportReport: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeAOI,
  activeSensor,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  viewMode,
  onChangeViewMode,
  onExportReport
}) => {
  return (
    <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between gap-4 select-none">
      {/* Left: Active AOI Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center flex-shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeAOI.name}
            </h1>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {activeSensor}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
            {activeAOI.coordinates[0].toFixed(3)}°N, {activeAOI.coordinates[1].toFixed(3)}°W • {activeAOI.areaKm2.toLocaleString()} km²
          </p>
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => onChangeViewMode('split')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            viewMode === 'split'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Split Slider</span>
        </button>

        <button
          onClick={() => onChangeViewMode('side-by-side')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            viewMode === 'side-by-side'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Side-by-Side</span>
        </button>

        <button
          onClick={() => onChangeViewMode('overlay')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            viewMode === 'overlay'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AI Overlay</span>
        </button>
      </div>

      {/* Right: Map Controls & Export */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5">
          <button
            onClick={onZoomOut}
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-150 active:scale-[0.98]"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 select-none">
            {zoom}x
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-150 active:scale-[0.98]"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-[0.98]"
          title="Reset View Position"
          aria-label="Reset View Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportReport}
          className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Analysis</span>
        </button>
      </div>
    </div>
  );
};
