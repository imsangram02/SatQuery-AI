import { AOIPreset, BenchmarkItem, RecentAnalysis, ApiKeyItem, LayerConfig, UserProfile, ModelConfidenceSettings } from '../types';

export const MOCK_AOI_PRESETS: AOIPreset[] = [
  {
    id: 'amazon-rondonia',
    name: 'Amazon Rainforest (Rondônia Track)',
    location: 'Rondônia, Brazil',
    coordinates: [-10.824, -62.923],
    bounds: [[-10.6, -63.2], [-11.0, -62.6]],
    areaKm2: 4820,
    recommendedSensor: 'sentinel-2',
    primaryMetric: 'Canopy Loss Rate',
    metricValue: '-4.8% / 90-day window',
    description: 'Multi-temporal rainforest monitoring detecting illegal clear-cutting corridors and selective logging paths along the BR-364 corridor.',
    beforeLabel: 'Baseline (June 2024 - True Color)',
    afterLabel: 'AI Canopy Change Detection (Aug 2024)',
    beforeVisual: 'linear-gradient(135deg, #134e4a 0%, #064e3b 45%, #022c22 100%)',
    afterVisual: 'linear-gradient(135deg, #134e4a 0%, #b45309 45%, #991b1b 100%)'
  },
  {
    id: 'rhine-flood',
    name: 'Lower Rhine Flood Plain Basin',
    location: 'North Rhine-Westphalia, Germany',
    coordinates: [51.433, 6.762],
    bounds: [[51.2, 6.5], [51.6, 7.0]],
    areaKm2: 2450,
    recommendedSensor: 'sentinel-1',
    primaryMetric: 'Peak Inundation Extent',
    metricValue: '312.4 km² submerged',
    description: 'C-Band Synthetic Aperture Radar (SAR) cross-polarized penetration through heavy rainclouds to track dynamic flood crests and dyke breaches.',
    beforeLabel: 'Normal River Gauge (VV/VH Radar)',
    afterLabel: 'Peak Inundation Mask (Water Depth > 1.2m)',
    beforeVisual: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    afterVisual: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #075985 100%)'
  },
  {
    id: 'california-fire',
    name: 'Sierra Nevada Fire Complex',
    location: 'California, United States',
    coordinates: [39.759, -121.621],
    bounds: [[39.5, -121.9], [40.0, -121.3]],
    areaKm2: 1890,
    recommendedSensor: 'landsat-9',
    primaryMetric: 'Normalized Burn Ratio (NBR)',
    metricValue: 'dNBR = 0.74 (High Severity)',
    description: 'SWIR1 and SWIR2 band difference analysis to evaluate soil char depth, unburned islands, and immediate post-wildfire debris flow risk.',
    beforeLabel: 'Pre-Fire Healthy Biomass (NIR B8)',
    afterLabel: 'Post-Fire Severity Classification',
    beforeVisual: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
    afterVisual: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 45%, #ea580c 100%)'
  },
  {
    id: 'punjab-wheat',
    name: 'Punjab Agro-Hydrological Zone',
    location: 'Punjab, India',
    coordinates: [30.901, 75.857],
    bounds: [[30.6, 75.5], [31.2, 76.2]],
    areaKm2: 3600,
    recommendedSensor: 'planetscope',
    primaryMetric: 'NDVI Vegetation Vigour Index',
    metricValue: '0.82 Mean Index (Healthy)',
    description: 'High-frequency 3-meter daily constellation scanning to forecast winter wheat yield, monitor tube-well groundwater depletion, and identify saline patches.',
    beforeLabel: 'Early Emergence Stage (True Color)',
    afterLabel: 'Chlorophyll Stress Heatmap (3m GSD)',
    beforeVisual: 'linear-gradient(135deg, #365314 0%, #4d7c0f 45%, #65a30d 100%)',
    afterVisual: 'linear-gradient(135deg, #15803d 0%, #eab308 60%, #dc2626 100%)'
  },
  {
    id: 'tokyo-port',
    name: 'Tokyo Bay Maritime & Port Terminal',
    location: 'Tokyo / Kanagawa, Japan',
    coordinates: [35.619, 139.781],
    bounds: [[35.4, 139.6], [35.8, 140.0]],
    areaKm2: 1200,
    recommendedSensor: 'worldview-3',
    primaryMetric: 'Vessel Classification & Berthing',
    metricValue: '99.4% Accuracy (0.3m GSD)',
    description: 'Sub-meter panchromatic sharpening coupled with deep instance segmentation for cargo container stacking density and automatic AIS vessel correlation.',
    beforeLabel: 'Standard Port RGB Imagery',
    afterLabel: 'Sub-meter AIS + Structural Detection',
    beforeVisual: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    afterVisual: 'linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #14b8a6 100%)'
  }
];

export const MOCK_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'b-1',
    model: 'SatQuery-GeoSAM-v3 Large',
    task: 'Land Cover Segmentation',
    dataset: 'SpaceNet 8 + DynamicWorld',
    mIoU: 89.4,
    f1Score: 0.942,
    latencyMs: 18.2,
    resolutionGSD: '0.5m – 10m',
    hardware: 'TensorRT-LLM / H100 SXM5'
  },
  {
    id: 'b-2',
    model: 'SatQuery-ChangeDet-Temporal',
    task: 'Deforestation & Canopy Loss',
    dataset: 'PRODES Brazilian Amazon',
    mIoU: 92.1,
    f1Score: 0.958,
    latencyMs: 24.6,
    resolutionGSD: '10m (Sentinel-2)',
    hardware: 'TensorRT-LLM / H100 SXM5'
  },
  {
    id: 'b-3',
    model: 'SatQuery-RadarInSAR-v2',
    task: 'Surface Water & Flood Extent',
    dataset: 'Copernicus EMS Flood DB',
    mIoU: 91.8,
    f1Score: 0.951,
    latencyMs: 16.4,
    resolutionGSD: '5m (Sentinel-1 SAR)',
    hardware: 'NVIDIA L40S'
  },
  {
    id: 'b-4',
    model: 'Baseline: Meta SAM-v2 (Generic)',
    task: 'Land Cover Segmentation',
    dataset: 'SpaceNet 8',
    mIoU: 75.2,
    f1Score: 0.814,
    latencyMs: 78.5,
    resolutionGSD: 'Generic Image Only',
    hardware: 'PyTorch Native / A100'
  },
  {
    id: 'b-5',
    model: 'Baseline: Swin-B Mask2Former',
    task: 'Urban Building Footprints',
    dataset: 'Massachusetts Buildings',
    mIoU: 81.3,
    f1Score: 0.869,
    latencyMs: 52.0,
    resolutionGSD: '0.3m Aerial',
    hardware: 'TensorRT / A100'
  }
];

export const MOCK_ANALYSES: RecentAnalysis[] = [
  {
    id: 'AN-2024-0981',
    title: 'Rondônia Canopy Deforestation Survey Q3',
    aoiName: 'Amazon Rainforest (Rondônia Track)',
    sensor: 'sentinel-2',
    date: '2026-09-05 18:42 UTC',
    areaKm2: 4820,
    confidence: 97.8,
    status: 'Completed',
    anomalyCount: 14,
    spectralIndex: 'ndvi'
  },
  {
    id: 'AN-2024-0980',
    title: 'Rhine Lowlands Flash Inundation Scan',
    aoiName: 'Lower Rhine Flood Plain Basin',
    sensor: 'sentinel-1',
    date: '2026-09-05 14:15 UTC',
    areaKm2: 2450,
    confidence: 96.2,
    status: 'Completed',
    anomalyCount: 8,
    spectralIndex: 'sar-dual'
  },
  {
    id: 'AN-2024-0979',
    title: 'Sierra Nevada Post-Fire Severity Assessment',
    aoiName: 'Sierra Nevada Fire Complex',
    sensor: 'landsat-9',
    date: '2026-09-05 09:20 UTC',
    areaKm2: 1890,
    confidence: 94.5,
    status: 'Completed',
    anomalyCount: 22,
    spectralIndex: 'nbr'
  },
  {
    id: 'AN-2024-0978',
    title: 'Punjab Wheat Belt Hydrological Stress Index',
    aoiName: 'Punjab Agro-Hydrological Zone',
    sensor: 'planetscope',
    date: '2026-09-04 22:04 UTC',
    areaKm2: 3600,
    confidence: 98.4,
    status: 'Completed',
    anomalyCount: 6,
    spectralIndex: 'false-color-nir'
  },
  {
    id: 'AN-2024-0977',
    title: 'Tokyo Bay Berth Structural Classification',
    aoiName: 'Tokyo Bay Maritime & Port Terminal',
    sensor: 'worldview-3',
    date: '2026-09-04 16:30 UTC',
    areaKm2: 1200,
    confidence: 89.1,
    status: 'Flagged',
    anomalyCount: 3,
    spectralIndex: 'true-color'
  },
  {
    id: 'AN-2024-0976',
    title: 'Congo Basin Primary Forest Edge Tracking',
    aoiName: 'Central Congo Core Zone',
    sensor: 'sentinel-2',
    date: '2026-09-04 11:10 UTC',
    areaKm2: 5200,
    confidence: 93.7,
    status: 'Processing',
    anomalyCount: 0,
    spectralIndex: 'ndvi'
  }
];

export const INITIAL_LAYERS: LayerConfig[] = [
  { id: 'l-base', name: 'Sentinel-2 L2A BOA Reflectance', type: 'base', visible: true, opacity: 100, blendMode: 'normal' },
  { id: 'l-mask', name: 'GeoSAM Deep Segmentation Overlay', type: 'mask', visible: true, opacity: 75, blendMode: 'overlay' },
  { id: 'l-cloud', name: 's2cloudless Atmospheric Cirrus Mask', type: 'spectral', visible: false, opacity: 50, blendMode: 'multiply' },
  { id: 'l-contours', name: 'Copernicus 30m Global DEM Contours', type: 'vector', visible: true, opacity: 60, blendMode: 'screen' }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Pipeline - US-East-1',
    keyMasked: 'satq_live_948a20d4...4f1e',
    role: 'Admin',
    created: '2026-08-12',
    lastUsed: '4 minutes ago',
    requestsCount: 248190
  },
  {
    id: 'key-2',
    name: 'Earth Engine & STAC Ingestion Worker',
    keyMasked: 'satq_stac_7b99c104...8e21',
    role: 'Read/Analyze',
    created: '2026-08-20',
    lastUsed: '1 hour ago',
    requestsCount: 94210
  },
  {
    id: 'key-3',
    name: 'Jupyter Research Notebook Sandbox',
    keyMasked: 'satq_test_1f44a339...cc02',
    role: 'Inference-Only',
    created: '2026-09-01',
    lastUsed: 'Yesterday',
    requestsCount: 1420
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Dr. Maya Chen',
  email: 'm.chen@earthobservatory.org',
  organization: 'Planetary Dynamics Institute & ESA Earth Science',
  role: 'Principal Geospatial Research Lead',
  stacTier: 'Enterprise STAC Planetary Dedicated',
  quotaUsedGb: 840,
  quotaMaxGb: 2000
};

export const DEFAULT_CONFIDENCE_SETTINGS: ModelConfidenceSettings = {
  detectionThreshold: 85,
  cloudMaskStrictness: 'balanced',
  superResolution: true,
  driftSensitivity: 70,
  preferredProjection: 'EPSG:4326',
  autoCogOptimization: true
};
