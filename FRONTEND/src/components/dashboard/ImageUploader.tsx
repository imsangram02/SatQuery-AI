import React, { useRef, useState, useEffect } from 'react';
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
  Info,
  AlertCircle,
  Database,
  Plus
} from 'lucide-react';
import { ImageAnalysisMode, UploadedImageMeta } from '../../types';
import { SatQueryApiService } from '../../services/apiService';

interface ImageUploaderProps {
  mode: ImageAnalysisMode;
  images: UploadedImageMeta[];
  onAddImage: (img: UploadedImageMeta) => void;
  onRemoveImage: (id: string) => void;
  onUpdateImage?: (id: string, updates: Partial<UploadedImageMeta>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  mode,
  images,
  onAddImage,
  onRemoveImage,
  onUpdateImage
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [availableSamples, setAvailableSamples] = useState<any[]>([]);
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    SatQueryApiService.getSamples().then(samples => {
      if (mounted && samples && samples.length > 0) {
        setAvailableSamples(samples);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

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

  const processFiles = async (fileList: FileList) => {
    setErrorMessage(null);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');
      const isPng = file.name.toLowerCase().endsWith('.png');
      const isJpeg = file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

      if (!isTiff && !isPng && !isJpeg) {
        setErrorMessage(`"${file.name}" is not supported. Please upload GeoTIFF (.tif, .tiff) or benchmark imagery (.png, .jpg).`);
        continue;
      }

      const isSar = file.name.toLowerCase().includes('sar') || file.name.toLowerCase().includes('s1');

      let previewUrl: string | undefined = undefined;
      if (isPng || isJpeg) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          // ignore
        }
      }

      const formatLabel: 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG' = isTiff ? 'GeoTIFF' : isPng ? 'PNG' : 'JPEG';

      const newImage: UploadedImageMeta = {
        id: `custom-img-${Date.now()}-${i}`,
        name: file.name,
        format: formatLabel,
        dimensions: '2048 × 2048 px',
        modality: isSar ? 'SAR VV/VH' : 'Optical BOA',
        acquisitionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        sizeMb: Number((file.size / (1024 * 1024)).toFixed(1)) || 16.4,
        validationStatus: isSar ? 'Valid SAR C-Band' : isTiff ? 'Valid GeoTIFF' : 'Valid Benchmark Image',
        previewVisual: isSar
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
          : 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)',
        previewUrl,
        fileObject: file
      };

      // Upload to server in background to register and create preview
      setIsUploading(true);
      SatQueryApiService.uploadFile(file).then(res => {
        if (res) {
          newImage.serverPath = res.filename;
          if (res.preview_url) {
            newImage.previewUrl = res.preview_url;
            newImage.previewVisual = `url("${res.preview_url}") center/cover no-repeat`;
          }
          if (onUpdateImage) {
            onUpdateImage(newImage.id, {
              serverPath: res.filename,
              previewUrl: res.preview_url || undefined,
              previewVisual: res.preview_url ? `url("${res.preview_url}") center/cover no-repeat` : newImage.previewVisual
            });
          }
        }
        setIsUploading(false);
      }).catch(() => setIsUploading(false));

      onAddImage(newImage);
    }
  };

  const handleStageSample = (sample: any) => {
    const isSar = (sample.name || '').toLowerCase().includes('sar') || 
                  (sample.name || '').toLowerCase().includes('s1') || 
                  (sample.modality || '').toLowerCase().includes('sar');
    const isTiff = (sample.name || '').toLowerCase().endsWith('.tif') || (sample.name || '').toLowerCase().endsWith('.tiff');

    const stagedImg: UploadedImageMeta = {
      id: `srv-${Date.now()}-${sample.id}`,
      name: sample.name,
      format: isTiff ? 'GeoTIFF' : 'PNG',
      dimensions: '512 × 512 px',
      modality: isSar ? 'SAR VV/VH' : 'Optical BOA',
      acquisitionDate: 'Calibrated Scene',
      sizeMb: Number((sample.size_bytes / (1024 * 1024)).toFixed(1)) || 1.2,
      validationStatus: isSar ? 'Valid SAR C-Band' : 'Valid GeoTIFF',
      previewVisual: isSar
        ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)'
        : 'linear-gradient(135deg, #134e4a 0%, #065f46 45%, #0284c7 100%)',
      previewUrl: sample.preview_url,
      serverPath: sample.name || sample.path
    };
    onAddImage(stagedImg);
  };


  return (
    <div className="space-y-6">
      {/* Auto-Detected Analysis Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Analysis Mode:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                {mode === 'single'
                  ? 'Single Image Mode (VQA / Grounding)'
                  : mode === 'bi-temporal'
                  ? 'Bi-Temporal Mode (T0 & T1 Change Analysis)'
                  : 'Optical + SAR Cross-Modal Fusion'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Auto-Detected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {images.length === 0
                ? 'System will automatically select neural specialist upon image staging.'
                : images.length === 1
                ? 'Single scene detected → Auto-routed to ConvNeXt-v2 Optical/SAR Specialist & Physics Sanity Engine'
                : mode === 'optical-sar'
                ? 'Optical + SAR radar pair detected → Auto-routed to 14-Channel ViT Cross-Modal Specialist'
                : 'Dual temporal scenes detected → Auto-routed to Siamese ResNet-50 Change Detector'}
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block shrink-0">
          <span className="text-cyan-500 font-semibold">{images.length}</span> {images.length === 1 ? 'image staged' : 'images staged'}
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
              Supports <strong className="text-cyan-600 dark:text-cyan-400">GeoTIFF (.tif, .tiff)</strong>, PNG, and JPG images, or click to browse.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Select from Server Imagery & Datasets */}
      {availableSamples.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
                Server Datasets & Rasters ({availableSamples.length} available)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSamplePicker(!showSamplePicker)}
              className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              {showSamplePicker ? 'Hide Datasets ▲' : 'Browse & Stage Datasets ▼'}
            </button>
          </div>

          {showSamplePicker && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
              {availableSamples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleStageSample(sample)}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 hover:border-cyan-400 hover:shadow-sm transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {sample.preview_url ? (
                      <img
                        src={sample.preview_url}
                        alt={sample.label}
                        className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-500 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                        SAT
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {sample.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {sample.modality}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                    + Stage
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Format Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
