import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  Trash2, 
  Download, 
  Paperclip, 
  Clock, 
  Satellite, 
  Cpu, 
  Radio, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileCode2,
  RefreshCw,
  Globe2
} from 'lucide-react';
import { ChatMessage, AOIPreset, Screen } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { OrbitMascot } from '../mascot/OrbitMascot';

interface DedicatedChatViewProps {
  onNavigateToWorkspace: (aoi?: AOIPreset) => void;
  onNavigate: (screen: Screen) => void;
}

export const DedicatedChatView: React.FC<DedicatedChatViewProps> = ({
  onNavigateToWorkspace,
  onNavigate
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('SatQuery-GeoLLM-v3 (Grounded STAC)');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      timestamp: '04:40:02',
      text: `Greetings, Analyst! I'm **Orbit**, your SatQuery AI Earth Observation Copilot.

I am connected to multi-spectral Earth Observation streams including **ESA Copernicus Sentinel-2**, **USGS Landsat-9**, and **Sentinel-1 SAR C-Band radar**. 

You can query any planetary coordinate, request disturbance quantifications, compute bi-temporal spectral indices (NDVI, NDWI, NBR), or transition directly into our 3-Pane Geospatial Workspace for sub-meter vector inspection.`,
      traces: [
        {
          id: 'tr-boot-1',
          title: 'STAC Catalog Handshake',
          status: 'completed',
          durationMs: 16,
          details: 'Connected to AWS Earth Search & Copernicus Open Access Hub.'
        },
        {
          id: 'tr-boot-2',
          title: 'Foundation Model Weights Loaded',
          status: 'completed',
          durationMs: 24,
          details: 'GeoSAM-MultiSpectral v3.4 TensorRT engine active on NVIDIA H100.'
        }
      ],
      groundedStats: [
        { label: 'Active Constellations', value: '8', unit: 'sensors' },
        { label: 'Inference Precision', value: '89.4%', unit: 'mIoU' },
        { label: 'STAC Catalogs', value: '45M+', unit: 'scenes' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [showRawJsonId, setShowRawJsonId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    {
      title: 'Amazon Canopy Disturbance',
      query: 'Quantify canopy loss in the Brazilian Amazon (Rondônia track) between June and August 2024.',
      preset: MOCK_AOI_PRESETS[0]
    },
    {
      title: 'Rhine Flood Plain SAR Analysis',
      query: 'Analyze Sentinel-1 C-Band radar cross-polarization (VV/VH) for peak flood inundation in the Rhine basin.',
      preset: MOCK_AOI_PRESETS[1]
    },
    {
      title: 'Wildfire Severity (dNBR)',
      query: 'Calculate Normalized Burn Ratio (NBR) and detect high-severity char depth for the Sierra Nevada fire.',
      preset: MOCK_AOI_PRESETS[2]
    },
    {
      title: 'Multi-Spectral Band Algebra',
      query: 'How does SatQuery calculate NDVI and EVI from Sentinel-2 bands B04, B08, and B02?',
      preset: undefined
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = (textToSend?: string, preset?: AOIPreset) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toTimeString().split(' ')[0],
      text: attachedFile ? `[Attached: ${attachedFile}]\n\n${query}` : query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setAttachedFile(null);
    setIsProcessing(true);

    // Dynamic response generation based on query content
    setTimeout(() => {
      const isAmazon = query.toLowerCase().includes('amazon') || query.toLowerCase().includes('canopy') || query.toLowerCase().includes('rondonia');
      const isFlood = query.toLowerCase().includes('flood') || query.toLowerCase().includes('rhine') || query.toLowerCase().includes('sar');
      const isFire = query.toLowerCase().includes('fire') || query.toLowerCase().includes('burn') || query.toLowerCase().includes('nbr');
      const isFormula = query.toLowerCase().includes('ndvi') || query.toLowerCase().includes('evi') || query.toLowerCase().includes('band');

      let responseText = '';
      let stats = undefined;
      let targetPreset = preset;

      if (isAmazon) {
        targetPreset = MOCK_AOI_PRESETS[0];
        responseText = `### Canopy Disturbance Quantification: Amazon Rainforest (Rondônia Track)

Using bi-temporal **Sentinel-2 L2A BOA Surface Reflectance** (June 12, 2024 vs August 28, 2024), the **GeoSAM-v3 Large** foundation model identified **48.2 hectares** of new canopy loss.

#### Key Findings:
- **Mean NDVI Degradation**: Dropped from **0.84** to **0.31** across clear-cut tributary corridors.
- **Disturbance Geometry**: 14 contiguous disturbance polygons detected along illegal secondary logging spurs.
- **Atmospheric Confidence**: Filtered 2.1% cirrus clouds using *s2cloudless* with **98.6% model confidence**.`;
        stats = [
          { label: 'Deforested Area', value: '48.2', unit: 'hectares' },
          { label: 'NDVI Delta', value: '-63.1%', unit: 'relative drop' },
          { label: 'Disturbance Polygons', value: '14', unit: 'vectors' },
          { label: 'Model Confidence', value: '98.6%', unit: 'F1: 0.958' }
        ];
      } else if (isFlood) {
        targetPreset = MOCK_AOI_PRESETS[1];
        responseText = `### Radar Inundation Assessment: Lower Rhine Flood Basin

Penetrating storm cloud cover using **Sentinel-1 C-Band SAR (VV/VH dual-polarization)** at 5-meter resolution.

#### Key Findings:
- **Submerged Extent**: **312.4 km²** of agricultural lowlands and riverine flood plains submerged.
- **Water Depth Threshold**: Inundation depth exceeds **1.2 meters** across secondary dyke zones.
- **SAR Scattering Index**: Specular reflection over standing water caused radar backscatter drop to **-22.4 dB** (normal: -11.2 dB).`;
        stats = [
          { label: 'Submerged Extent', value: '312.4', unit: 'km²' },
          { label: 'Mean Water Depth', value: '> 1.2', unit: 'meters' },
          { label: 'SAR Backscatter', value: '-22.4', unit: 'dB (VH)' },
          { label: 'Confidence Score', value: '96.2%', unit: 'radar-grounded' }
        ];
      } else if (isFire) {
        targetPreset = MOCK_AOI_PRESETS[2];
        responseText = `### Wildfire Severity Analysis: Sierra Nevada Fire Complex

Processed **Landsat-9 OLI-2 calibrated SWIR1 (B06) and SWIR2 (B07)** surface reflectance passes.

#### Key Findings:
- **Normalized Burn Ratio (NBR)**: Pre-fire NBR = **0.68**, Post-fire NBR = **-0.06** (dNBR = **0.74**).
- **Burn Severity Classification**: High Severity (Soil char depth > 4cm across 1,890 km² perimeter).
- **Post-Fire Debris Flow Hazard**: Critical alert generated for steep gulch drainage zones.`;
        stats = [
          { label: 'Total Scar Extent', value: '1,890', unit: 'km²' },
          { label: 'Delta NBR (dNBR)', value: '0.74', unit: 'High Severity' },
          { label: 'Unburned Islands', value: '14.2%', unit: 'canopy refugia' }
        ];
      } else if (isFormula) {
        responseText = `### Multi-Spectral Vegetation Indices & Band Arithmetic

SatQuery AI computes vegetation vigour indices on calibrated Bottom-of-Atmosphere (BOA) surface reflectance:

1. **Normalized Difference Vegetation Index (NDVI)**:
   $$\\text{NDVI} = \\frac{\\text{NIR} - \\text{Red}}{\\text{NIR} + \\text{Red}} = \\frac{B08 - B04}{B08 + B04}$$
   *Highlights healthy chlorophyll absorption in red and high reflection in near-infrared.*

2. **Enhanced Vegetation Index (EVI)**:
   $$\\text{EVI} = 2.5 \\times \\frac{\\text{NIR} - \\text{Red}}{\\text{NIR} + 6 \\times \\text{Red} - 7.5 \\times \\text{Blue} + 1}$$
   *Decouples canopy background signals and reduces atmospheric aerosol influences.*

3. **Normalized Burn Ratio (NBR)**:
   $$\\text{NBR} = \\frac{B08 - B12}{B08 + B12}$$
   *Highlights fire scars and moisture deficits using Short-Wave Infrared.*`;
        stats = [
          { label: 'Resolution (GSD)', value: '10', unit: 'meters (S2)' },
          { label: 'Inference Latency', value: '18.2', unit: 'ms / tile' },
          { label: 'Radiometric Bands', value: '13', unit: 'multi-spectral' }
        ];
      } else {
        responseText = `### Geospatial Query Analysis

SatQuery AI synthesized the query: "${query}" using foundation model **${selectedModel}**.

- **Spatial Coordinate Resolution**: Orthorectified target AOI bounds to WGS84 UTM projections.
- **Zero-Shot Segmentation**: Identified candidate disturbance anomalies across calibrated multi-spectral tiles.
- **STAC Provenance**: All raster tiles are linked to CEOS-certified Level-2A surface reflectance data.`;
        stats = [
          { label: 'Processed Bounds', value: 'WGS84', unit: 'EPSG:4326' },
          { label: 'Confidence Score', value: '97.8%', unit: 'grounded' },
          { label: 'Latency', value: '28.4', unit: 'ms' }
        ];
      }

      const resId = `agt-${Date.now()}`;
      const agentMsg: ChatMessage = {
        id: resId,
        sender: 'agent',
        timestamp: new Date().toTimeString().split(' ')[0],
        text: responseText,
        traces: [
          {
            id: `tr-${Date.now()}-1`,
            title: '1. STAC Item Spatial Search & Co-Registration',
            status: 'completed',
            durationMs: 22,
            details: 'Located multi-temporal COG rasters with cloud cover threshold < 5%.',
            payload: {
              model: selectedModel,
              query_type: 'spatial-synthesis',
              timestamp: new Date().toISOString()
            }
          },
          {
            id: `tr-${Date.now()}-2`,
            title: '2. Atmospheric Masking & Band Calibration',
            status: 'completed',
            durationMs: 18,
            details: 'Computed radiometric surface reflectance BOA indices.'
          },
          {
            id: `tr-${Date.now()}-3`,
            title: '3. GeoSAM-MultiSpectral Neural Inference',
            status: 'completed',
            durationMs: 32,
            details: 'Executed tensor graph in 32ms on TensorRT-LLM H100.'
          }
        ],
        groundedStats: stats,
        suggestedAction: targetPreset ? {
          label: `Open in 3-Pane Geospatial Canvas`,
          actionType: 'open-workspace',
          targetAOIId: targetPreset.id
        } : undefined
      };

      setMessages(prev => [...prev, agentMsg]);
      setExpandedTraceId(resId);
      setIsProcessing(false);
    }, 1100);
  };

  const handleClearHistory = () => {
    setMessages([messages[0]]);
  };

  const handleExportChat = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SatQuery_AI_Chat_Transcript_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col h-[calc(100vh-64px)] select-none relative">
      {/* Surrounding Ambient Blue Atmospheric Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4/5 h-96 bg-blue-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/10 blur-[110px] pointer-events-none rounded-full" />

      {/* Top Header Card */}
      <div className="relative z-10 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400/50 dark:border-cyan-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-4 ring-blue-500/10 dark:ring-cyan-500/10 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-900 dark:text-white transition-colors duration-200">
        <div className="flex items-center gap-3.5">
          <OrbitMascot size="md" mood={isProcessing ? 'analyzing' : 'idle'} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                SatQuery<span className="text-teal-500">AI</span> Copilot Terminal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
                Orbit AI Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>STAC Multi-Sensor Mesh Active</span>
              <span>•</span>
              <span>Sub-Meter Precision</span>
            </div>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500"
          >
            <option value="SatQuery-GeoLLM-v3 (Grounded STAC)">GeoLLM-v3 (Grounded STAC)</option>
            <option value="SatQuery-SAR-RadarVision (C-Band / InSAR)">SAR-RadarVision (C-Band)</option>
            <option value="SatQuery-HyperSpectral-Eco">HyperSpectral-Eco (Agriculture)</option>
          </select>

          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-150 active:scale-[0.98]"
            title="Export Conversation Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-150 active:scale-[0.98]"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="relative z-10 flex-1 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-400/50 dark:border-cyan-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] dark:shadow-[0_0_40px_rgba(6,182,212,0.2)] ring-4 ring-blue-500/10 dark:ring-cyan-500/10 flex flex-col overflow-hidden text-slate-900 dark:text-white transition-colors duration-200">
        {/* Top Radiant Blue Ambient Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/60 dark:bg-slate-950/40">
          {/* Friendly Mascot Welcome Hero Banner */}
          {messages.length === 1 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
              <OrbitMascot size="lg" mood="greeting" className="flex-shrink-0" />
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  <span>Meet Orbit • Your SatQuery Copilot</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  "Ready to explore planetary Earth observation data?"
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Ask me to inspect forest canopy loss, segment flood inundation perimeters, calculate NDVI health indices, or query raw STAC items from Sentinel-2, Landsat-9, and Sentinel-1 SAR.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Header */}
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-1 px-1">
                {msg.sender === 'user' ? (
                  <>
                    <span className="font-medium">You (Analyst)</span>
                    <User className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <OrbitMascot size="xs" mood={msg.groundedStats ? 'happy' : 'idle'} showHalo={false} />
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">Orbit AI Copilot</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-[90%] sm:max-w-[80%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Observable Execution Traces Dropdown */}
                {msg.traces && msg.traces.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                      className="w-full flex items-center justify-between text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 hover:underline active:scale-[0.98] py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4" />
                        <span>Observable Pipeline Traces ({msg.traces.length} steps verified)</span>
                      </span>
                      {expandedTraceId === msg.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedTraceId === msg.id && (
                      <div className="mt-3 space-y-2 font-mono text-xs bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in">
                        {msg.traces.map((trace) => (
                          <div
                            key={trace.id}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                                {trace.title}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {trace.durationMs}ms
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 leading-relaxed">
                              {trace.details}
                            </p>

                            {trace.payload && (
                              <div className="pl-5 pt-1">
                                <button
                                  onClick={() => setShowRawJsonId(showRawJsonId === trace.id ? null : trace.id)}
                                  className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                                >
                                  <FileCode2 className="w-3 h-3" />
                                  {showRawJsonId === trace.id ? 'Hide STAC Payload' : 'Inspect STAC Payload'}
                                </button>
                                {showRawJsonId === trace.id && (
                                  <pre className="mt-1 p-2 rounded bg-slate-900 dark:bg-slate-950 border border-slate-800 text-teal-300 text-[10px] overflow-x-auto">
                                    {JSON.stringify(trace.payload, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Grounded Quantitative Metrics Grid */}
                {msg.groundedStats && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {msg.groundedStats.map((stat, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                      >
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{stat.label}</div>
                        <div className="text-sm font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                          {stat.value}{' '}
                          <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                            {stat.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action to Open in Canvas */}
                {msg.suggestedAction && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const targetAOI = MOCK_AOI_PRESETS.find(p => p.id === msg.suggestedAction?.targetAOIId) || MOCK_AOI_PRESETS[0];
                        onNavigateToWorkspace(targetAOI);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-500/20 hover:bg-teal-400 transition-all duration-150 active:scale-[0.98]"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Pipeline State with Orbit Mascot */}
          {isProcessing && (
            <div className="flex flex-col items-start animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm flex items-center gap-3.5 text-xs shadow-sm">
                <OrbitMascot size="sm" mood="analyzing" showHalo={false} />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-teal-600 dark:text-teal-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Orbit is analyzing multi-spectral imagery...</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Querying STAC raster assets & executing GeoSAM neural inference
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rapid Starter Prompts Pills */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            Quick Prompts:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query, p.preset)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 whitespace-nowrap transition-all duration-150 active:scale-[0.98] shadow-xs flex items-center gap-1"
            >
              <span>{p.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {attachedFile && (
            <div className="mb-2 p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs text-teal-700 dark:text-teal-300 flex items-center justify-between">
              <span>Attached: {attachedFile}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-slate-400 dark:text-slate-500 hover:text-rose-500"
              >
                Remove
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Attach raster trigger */}
            <button
              type="button"
              onClick={() => setAttachedFile('Amazon_Deforestation_Sector04_B08.tif (COG)')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-150 active:scale-[0.98]"
              title="Attach Sample GeoTIFF or Coordinates"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask SatQuery Copilot about any coordinate, sensor band, or disturbance..."
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
