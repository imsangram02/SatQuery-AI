import React, { useState } from 'react';
import { 
  UploadCloud, 
  Satellite, 
  Sliders, 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  FileCode, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SensorType, SpectralBandMode, AOIPreset, LayerConfig } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';

interface StagingPanelProps {
  activeSensor: SensorType;
  onChangeSensor: (sensor: SensorType) => void;
  activeBandMode: SpectralBandMode;
  onChangeBandMode: (mode: SpectralBandMode) => void;
  activeAOI: AOIPreset;
  onSelectAOI: (aoi: AOIPreset) => void;
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  onChangeOpacity: (id: string, opacity: number) => void;
  onAddLayer: (name: string, type: LayerConfig['type']) => void;
  onRemoveLayer: (id: string) => void;
}

export const StagingPanel: React.FC<StagingPanelProps> = ({
  activeSensor,
  onChangeSensor,
  activeBandMode,
  onChangeBandMode,
  activeAOI,
  onSelectAOI,
  layers,
  onToggleLayer,
  onChangeOpacity,
  onAddLayer,
  onRemoveLayer
}) => {
  const [stagedFiles, setStagedFiles] = useState<Array<{
    name: string;
    size: string;
    type: string;
    crs: string;
    status: 'Staged' | 'Processing';
  }>>([
    {
      name: 'Rondonia_S2_B04_B08_10m.tif',
      size: '142.6 MB',
      type: 'GeoTIFF (COG)',
      crs: 'EPSG:32621',
      status: 'Staged'
    }
  ]);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const sensors: { id: SensorType; label: string; desc: string; gsd: string }[] = [
    { id: 'sentinel-2', label: 'Sentinel-2 L2A', desc: '13-Band Multi-Spectral', gsd: '10m GSD' },
    { id: 'landsat-9', label: 'Landsat-9 OLI-2', desc: 'Thermal + SWIR Calibrated', gsd: '15m GSD' },
    { id: 'planetscope', label: 'PlanetScope Dove', desc: 'Daily High-Cadence Constellation', gsd: '3m GSD' },
    { id: 'sentinel-1', label: 'Sentinel-1 C-Band', desc: 'SAR Radar (VV/VH Polarized)', gsd: '5m GSD' },
    { id: 'worldview-3', label: 'WorldView-3 Commercial', desc: 'Very High Resolution Panchromatic', gsd: '0.3m GSD' }
  ];

  const bandModes: { id: SpectralBandMode; label: string; formula: string }[] = [
    { id: 'true-color', label: 'Natural Color RGB', formula: 'B04 - B03 - B02' },
    { id: 'false-color-nir', label: 'False Color NIR', formula: 'B08 - B04 - B03 (Vegetation)' },
    { id: 'ndvi', label: 'NDVI Index', formula: '(B08 - B04) / (B08 + B04)' },
    { id: 'ndwi', label: 'NDWI Water Index', formula: '(B03 - B08) / (B03 + B08)' },
    { id: 'nbr', label: 'NBR Burn Ratio', formula: '(B08 - B12) / (B08 + B12)' },
    { id: 'sar-dual', label: 'SAR Dual Polarized', formula: 'VV / VH Cross-Ratio' }
  ];

  const handleSimulatedFileUpload = () => {
    const mockFileNames = [
      'Copernicus_AOI_CloudMask_v2.tif',
      'Hydrological_Inundation_Vectors.geojson',
      'Wildfire_dNBR_Thermal_Classification.tif'
    ];
    const pickedName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const newFile = {
      name: pickedName,
      size: `${(Math.random() * 80 + 20).toFixed(1)} MB`,
      type: pickedName.endsWith('.geojson') ? 'GeoJSON Vectors' : 'Cloud-Optimized GeoTIFF',
      crs: 'EPSG:4326',
      status: 'Staged' as const
    };

    setStagedFiles(prev => [newFile, ...prev]);
    onAddLayer(pickedName.replace('.tif', '').replace('.geojson', ''), 'spectral');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-xs overflow-y-auto">
      {/* Panel Title */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-500" />
          <span className="font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
            Staging & Spectral Controls
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-[10px] font-semibold">
          STAC Live
        </span>
      </div>

      <div className="p-3.5 space-y-5">
        {/* Section 1: AOI Presets Quick Picker */}
        <div>
          <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            Area of Interest (AOI)
          </label>
          <div className="space-y-1.5">
            {MOCK_AOI_PRESETS.map((preset) => {
              const isSelected = activeAOI.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectAOI(preset)}
                  className={`w-full text-left p-2 rounded-xl transition-all duration-150 active:scale-[0.98] border flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate text-xs">{preset.name.split(' (')[0]}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {preset.location}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Sensor & Constellation Picker */}
        <div>
          <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-teal-500" />
            Sensor Platform
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {sensors.map((sensor) => {
              const isSelected = activeSensor === sensor.id;
              return (
                <button
                  key={sensor.id}
                  onClick={() => onChangeSensor(sensor.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500/60 text-slate-900 dark:text-white font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{sensor.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {sensor.desc}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {sensor.gsd}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Spectral Band Index Algebra */}
        <div>
          <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-500" />
            Spectral Index & Band Algebra
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {bandModes.map((mode) => {
              const isSelected = activeBandMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onChangeBandMode(mode.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs">{mode.label}</span>
                  <span className={`text-[9px] font-mono mt-1 truncate ${
                    isSelected ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {mode.formula}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Simulated File Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-teal-500" />
              Stage Raster / Vectors
            </label>
            {uploadSuccess && (
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Parsed COG
              </span>
            )}
          </div>

          <div
            onClick={handleSimulatedFileUpload}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              handleSimulatedFileUpload();
            }}
            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-150 active:scale-[0.98] ${
              isDraggingFile
                ? 'border-teal-400 bg-teal-500/10'
                : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-500/50'
            }`}
          >
            <UploadCloud className="w-6 h-6 mx-auto text-teal-500 mb-1" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Drop GeoTIFF, GeoJSON, or SHP
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Click to browse local files or simulate staging
            </p>
          </div>

          {/* Staged files list */}
          <div className="mt-2 space-y-1.5">
            {stagedFiles.map((file, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-[10px]"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-slate-400">
                    {file.type} • {file.size} • {file.crs}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Active Layer Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              Layer Stack & Opacity
            </label>
            <button
              onClick={() => onAddLayer('Custom InSAR Deformation', 'heatmap')}
              className="text-[10px] font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5 active:scale-[0.98]"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  layer.visible
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="text-slate-500 hover:text-teal-500 transition-colors active:scale-[0.98]"
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-teal-500" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {layer.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveLayer(layer.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 active:scale-[0.98]"
                    title="Remove layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Opacity Slider */}
                {layer.visible && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 w-10">
                      {layer.opacity}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity}
                      onChange={(e) => onChangeOpacity(layer.id, Number(e.target.value))}
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
