export type Theme = 'dark' | 'light';

export type Screen = 'landing' | 'showcase' | 'dashboard' | 'workspace' | 'settings' | 'chat' | 'auth';

export type SensorType = 
  | 'sentinel-2' 
  | 'landsat-9' 
  | 'planetscope' 
  | 'sentinel-1' 
  | 'worldview-3';

export type SpectralBandMode = 
  | 'true-color' 
  | 'false-color-nir' 
  | 'ndvi' 
  | 'ndwi' 
  | 'nbr' 
  | 'sar-dual';

export interface AOIPreset {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]];
  areaKm2: number;
  recommendedSensor: SensorType;
  primaryMetric: string;
  metricValue: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeVisual: string;
  afterVisual: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  type: 'base' | 'spectral' | 'mask' | 'vector' | 'heatmap';
  visible: boolean;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface ExecutionTraceStep {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  durationMs: number;
  details: string;
  payload?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  traces?: ExecutionTraceStep[];
  groundedStats?: {
    label: string;
    value: string;
    unit?: string;
  }[];
  suggestedAction?: {
    label: string;
    actionType: 'highlight-scar' | 'switch-ndvi' | 'export-geojson' | 'zoom-anomaly' | 'open-workspace';
    targetAOIId?: string;
  };
}

export interface BenchmarkItem {
  id: string;
  model: string;
  task: string;
  dataset: string;
  mIoU: number;
  f1Score: number;
  latencyMs: number;
  resolutionGSD: string;
  hardware: string;
}

export interface RecentAnalysis {
  id: string;
  title: string;
  aoiName: string;
  sensor: SensorType;
  date: string;
  areaKm2: number;
  confidence: number;
  status: 'Completed' | 'Processing' | 'Flagged';
  anomalyCount: number;
  spectralIndex: SpectralBandMode;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  fullKey?: string;
  role: 'Admin' | 'Read/Analyze' | 'Inference-Only';
  created: string;
  lastUsed: string;
  requestsCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
  stacTier: string;
  quotaUsedGb: number;
  quotaMaxGb: number;
}

export interface ModelConfidenceSettings {
  detectionThreshold: number; // 0 to 100
  cloudMaskStrictness: 'loose' | 'balanced' | 'aggressive';
  superResolution: boolean;
  driftSensitivity: number; // 0 to 100
  preferredProjection: 'EPSG:4326' | 'EPSG:3857' | 'UTM-Auto';
  autoCogOptimization: boolean;
}
