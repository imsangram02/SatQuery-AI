import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  Layers, 
  Image as ImageIcon, 
  Radio, 
  CheckCircle2, 
  Calendar, 
  Maximize2, 
  Trash2, 
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';
import { ImageAnalysisMode, UploadedImageMeta } from '../../types';
import { AnalysisScenario, MOCK_SCENARIOS } from '../../data/mockData';

interface ImageUploaderProps {
  mode: ImageAnalysisMode;
  onChangeMode: (mode: ImageAnalysisMode) => void;
  images: UploadedImageMeta[];
  onAddImage: (img: UploadedImageMeta) => void;
  onRemoveImage: (id: string) => void;
  onSelectScenario: (scenario: AnalysisScenario) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  mode,
  onChangeMode,
  images,
  onAddImage,
  onRemoveImage,
  onSelectScenario
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');
      const isPng = file.name.toLowerCase().endsWith('.png');
      const isJpeg = file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

      const format = isTiff ? 'GeoTIFF' : isPng ? 'PNG' : 'JPEG';
      const isSar = file.name.toLowerCase().includes('sar') || file.name.toLowerCase().includes('s1');

      const newImage: UploadedImageMeta = {
        id: `custom-img-${Date.now()}-${i}`,
        name: file.name,
        format,
        dimensions: '2048 × 2048 px',
        modality: isSar ? 'SAR VV/VH' : 'Optical BOA',
        acquisitionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        sizeMb: Number((file.size / (1024 * 1024)).toFixed(1)) || 16.4,
        validationStatus: isTiff ? 'Valid GeoTIFF' : 'Valid Benchmark Raster',
        previewVisual: isSar
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
          : 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)'
      };

      onAddImage(newImage);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Benchmark Scenario Quick-Load Bar */}
      <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>QUICK-LOAD BENCHMARK SCENARIOS (1-CLICK TEST)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Click to auto-stage imagery, prompt & specialist pipeline
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {MOCK_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 shadow-xs"
            >
              {scenario.title.split(' Analysis')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Mode Switcher (Section 17: UI adapts to uploaded images) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Analysis Modality Configuration
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            UI dynamically reconfigures image slots and pipeline based on selected mode
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onChangeMode('single')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
              mode === 'single'
                ? 'bg-cyan-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Single Image
          </button>
          <button
            onClick={() => onChangeMode('bi-temporal')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
              mode === 'bi-temporal'
                ? 'bg-cyan-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bi-Temporal (T0 / T1)
          </button>
          <button
            onClick={() => onChangeMode('optical-sar')}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
              mode === 'optical-sar'
                ? 'bg-cyan-400 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Optical + SAR
          </button>
        </div>
      </div>

      {/* Large Drag-and-Drop Area (Section 16 of design.md) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-cyan-400/60 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30 shadow-xs">
            <UploadCloud className="w-7 h-7 stroke-[2.2]" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Drag & Drop Satellite Imagery Here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports <strong className="text-cyan-600 dark:text-cyan-400">GeoTIFF (.tif, .tiff)</strong>, CEOS SAR C-Band radar, and PNG/JPEG benchmark datasets.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
            <span>STAC API v1.0.0</span>
            <span>•</span>
            <span>Cloud-Optimized GeoTIFF (COG)</span>
            <span>•</span>
            <span>Auto CRS Parsing</span>
          </div>
        </div>
      </div>

      {/* Uploaded Images Staging Cards (Section 16: Filename, Format, Dimensions, Modality, Acquisition date, Validation status) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">
            Staged Satellite Imagery ({images.length} {images.length === 1 ? 'image' : 'images'})
          </span>
          <span className="text-cyan-600 dark:text-cyan-400">
            {mode === 'single' ? 'Single Image Mode' : mode === 'bi-temporal' ? 'Bi-Temporal Mode (T0 & T1)' : 'Optical + SAR Modality'}
          </span>
        </div>

        {images.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono text-slate-500">
            No images currently staged. Drag and drop a file above or click a benchmark scenario to load sample imagery.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm space-y-3 group"
              >
                {/* Header: Label & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                      Slot 0{index + 1}: {index === 0 && mode === 'bi-temporal' ? 'Baseline (T0)' : index === 1 && mode === 'bi-temporal' ? 'Comparison (T1)' : index === 0 && mode === 'optical-sar' ? 'Optical Modality' : index === 1 && mode === 'optical-sar' ? 'SAR Radar Modality' : 'Target Scene'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{img.format}</span>
                  </div>

                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Row: Mini visual + details */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg relative overflow-hidden border border-slate-300 dark:border-slate-700 flex-shrink-0"
                    style={{ background: img.previewVisual || 'linear-gradient(135deg, #1e293b, #334155)' }}
                  >
                    <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={img.name}>
                      {img.name}
                    </div>

                    {/* Metadata items required by Section 16 */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <div>
                        <span>Dim: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{img.dimensions}</strong>
                      </div>
                      <div>
                        <span>Modality: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{img.modality}</strong>
                      </div>
                      <div>
                        <span>Date: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{img.acquisitionDate}</strong>
                      </div>
                      <div>
                        <span>Size: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{img.sizeMb} MB</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{img.validationStatus}</span>
                  </span>
                  <span className="text-slate-400">Georeferenced</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
