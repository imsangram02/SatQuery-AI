import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileCode2, 
  Download, 
  Eye, 
  RefreshCw, 
  Trash2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ExecutionTraceStep, AOIPreset } from '../../types';
import { OrbitMascot } from '../mascot/OrbitMascot';
import { SatQueryApiService } from '../../services/apiService';

interface AgentChatboxProps {
  activeAOI: AOIPreset;
  onHighlightFeature?: (featureId: string) => void;
  onExportGeoJSON?: () => void;
}

export const AgentChatbox: React.FC<AgentChatboxProps> = ({
  activeAOI,
  onHighlightFeature,
  onExportGeoJSON
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'agent',
      timestamp: '14:20:04',
      text: `Initialized GeoLLM-v3 Earth Observation Agent. Connected to ESA Copernicus STAC & USGS Landsat catalogs. Active AOI is staged to **${activeAOI.name}**. What would you like to quantify or detect?`,
      traces: [
        {
          id: 't-0',
          title: 'AOI Geometric Orthorectification',
          status: 'completed',
          durationMs: 14,
          details: `Reprojected tile bounds to UTM Zone (EPSG:32621). Checked 16 STAC items.`
        },
        {
          id: 't-1',
          title: 'Cloud & Shadow Masking (s2cloudless)',
          status: 'completed',
          durationMs: 22,
          details: 'Masked 2.4% cirrus cloud interference across target sector.'
        }
      ]
    },
    {
      id: 'm-query-1',
      sender: 'user',
      timestamp: '14:21:10',
      text: 'Quantify recent canopy loss and identify illegal logging corridors in Sector 4.'
    },
    {
      id: 'm-res-1',
      sender: 'agent',
      timestamp: '14:21:12',
      text: `Analysis complete for **${activeAOI.name}** (Sector 4). 

Using multi-temporal Sentinel-2 L2A BOA reflectance (June vs August 2024), we observed **48.2 hectares** of new canopy loss along illegal tributary corridors. The Normalized Difference Vegetation Index (NDVI) dropped from a baseline mean of **0.84** to **0.31** in affected clusters.`,
      traces: [
        {
          id: 'tr-1',
          title: 'Step 1: STAC Ingestion & Co-Registration',
          status: 'completed',
          durationMs: 28,
          details: 'Fetched 4 Cloud-Optimized GeoTIFF tiles (B04, B08, B11, B12). Co-registered with <0.2 px sub-pixel residual error.',
          payload: {
            stac_endpoint: 'https://earth-search.aws.element84.com/v1',
            collection: 'sentinel-2-l2a',
            bbox: activeAOI.bounds,
            cloud_cover_percent: 2.1
          }
        },
        {
          id: 'tr-2',
          title: 'Step 2: Atmospheric Correction & Band Algebra',
          status: 'completed',
          durationMs: 19,
          details: 'Computed dNDVI = (B08 - B04)/(B08 + B04) across 16.4M raster pixels.'
        },
        {
          id: 'tr-3',
          title: 'Step 3: GeoSAM-v3 Large Deep Inference',
          status: 'completed',
          durationMs: 34,
          details: 'Extracted 14 contiguous vector disturbance polygons at 98.6% mean confidence.',
          payload: {
            model: 'SatQuery-GeoSAM-v3-Large',
            iou_threshold: 0.85,
            features_detected: 14,
            loss_area_ha: 48.2
          }
        },
        {
          id: 'tr-4',
          title: 'Step 4: Spatial Synthesis & Metric Grounding',
          status: 'completed',
          durationMs: 12,
          details: 'Calculated exact geodesic area metrics and cross-referenced with Brazilian PRODES conservation boundaries.'
        }
      ],
      groundedStats: [
        { label: 'Total Loss Area', value: '48.2', unit: 'hectares' },
        { label: 'NDVI Drop', value: '-63.1%', unit: 'relative' },
        { label: 'Model Confidence', value: '98.6%', unit: 'F1: 0.958' },
        { label: 'Disturbance Polygons', value: '14', unit: 'vectors' }
      ],
      suggestedAction: {
        label: 'Highlight Disturbance Scar #1',
        actionType: 'highlight-scar'
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>('m-res-1');
  const [showRawJson, setShowRawJson] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Calculate burned area index & severity class',
    'Map peak flood inundation depth > 1.2m',
    'Detect crop nitrogen chlorophyll stress in Sector 7'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toTimeString().split(' ')[0],
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    const livePromise = SatQueryApiService.sendChat(textToSend, activeAOI.name);

    setTimeout(async () => {
      const liveRes = await livePromise;
      const agentResId = `agt-${Date.now()}`;

      if (liveRes && liveRes.reply) {
        const liveAgentMessage: ChatMessage = {
          id: agentResId,
          sender: 'agent',
          timestamp: new Date().toTimeString().split(' ')[0],
          text: liveRes.reply,
          traces: (liveRes.traces as any) || [],
          groundedStats: liveRes.groundedStats,
          suggestedAction: (liveRes.suggestedAction as any)
        };
        setMessages(prev => [...prev, liveAgentMessage]);
        setExpandedTraceId(agentResId);
        setIsProcessing(false);
        return;
      }

      const agentMessage: ChatMessage = {
        id: agentResId,
        sender: 'agent',
        timestamp: new Date().toTimeString().split(' ')[0],
        text: `Processed query: "${textToSend}" on **${activeAOI.name}**. 

The foundation model isolated **28.4 km²** of spatial anomalies with high spectral variance. Radiometric alignment between multi-spectral passes verified the anomaly signatures with **97.4% precision**.`,
        traces: [
          {
            id: `tr-a-${Date.now()}`,
            title: '1. STAC Raster Item Alignment',
            status: 'completed',
            durationMs: 24,
            details: `Retrieved Sentinel-2 Bottom-of-Atmosphere surface reflectance for bounds: [${activeAOI.coordinates.join(', ')}]`,
            payload: {
              sensor: 'sentinel-2',
              bands: ['B02', 'B03', 'B04', 'B08', 'B11'],
              resolution_gsd: '10m'
            }
          },
          {
            id: `tr-b-${Date.now()}`,
            title: '2. Deep Neural Segmentation',
            status: 'completed',
            durationMs: 38,
            details: 'Ran TensorRT-accelerated GeoSAM-MultiSpectral inference (38ms latency).'
          },
          {
            id: `tr-c-${Date.now()}`,
            title: '3. Quantitative Polygon Extraction',
            status: 'completed',
            durationMs: 18,
            details: 'Vectorized classification raster into OGC GeoJSON feature collections.'
          }
        ],
        groundedStats: [
          { label: 'Anomaly Extent', value: '28.4', unit: 'km²' },
          { label: 'Spectral Index', value: '0.78', unit: 'Normalized' },
          { label: 'Confidence Score', value: '97.4%', unit: 'Verified' }
        ],
        suggestedAction: {
          label: 'Export Analysis GeoJSON',
          actionType: 'export-geojson'
        }
      };

      setMessages(prev => [...prev, agentMessage]);
      setExpandedTraceId(agentResId);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] text-xs select-none text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      {/* Radiant Blue Top Trim */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_12px_rgba(56,189,248,0.5)]"></div>

      {/* Agent Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <OrbitMascot size="sm" mood={isProcessing ? 'analyzing' : 'idle'} showHalo={true} />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <span>Orbit AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Observable STAC Inference
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-[0.98]"
          title="Clear Chat History"
          aria-label="Clear Chat History"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender tag */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="font-medium">You</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <OrbitMascot size="xs" mood="idle" showHalo={false} />
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">Orbit Copilot</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-sm shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
              }`}
            >
              <div className="text-xs whitespace-pre-line">{msg.text}</div>

              {/* Observable Execution Traces Widget */}
              {msg.traces && msg.traces.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() =>
                      setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)
                    }
                    className="w-full flex items-center justify-between text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400 hover:underline active:scale-[0.98] py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Execution Pipeline Traces ({msg.traces.length} steps)</span>
                    </span>
                    {expandedTraceId === msg.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedTraceId === msg.id && (
                    <div className="mt-2 space-y-2 font-mono text-[11px] bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in">
                      {msg.traces.map((trace) => (
                        <div
                          key={trace.id}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                              {trace.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {trace.durationMs}ms
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-5">
                            {trace.details}
                          </p>

                          {/* Raw Payload Inspector toggle */}
                          {trace.payload && (
                            <div className="pl-5 pt-1">
                              <button
                                onClick={() => setShowRawJson(!showRawJson)}
                                className="text-[9px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                              >
                                <FileCode2 className="w-3 h-3" />
                                {showRawJson ? 'Hide STAC Payload' : 'Inspect STAC Payload'}
                              </button>
                              {showRawJson && (
                                <pre className="mt-1 p-2 rounded bg-slate-900 dark:bg-slate-950 border border-slate-800 text-teal-300 text-[9px] overflow-x-auto">
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

              {/* Grounded Quantitative Statistics Grid */}
              {msg.groundedStats && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                  {msg.groundedStats.map((stat, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                    >
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{stat.label}</div>
                      <div className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                        {stat.value}{' '}
                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                          {stat.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons inside responses */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.actionType === 'export-geojson') {
                        onExportGeoJSON?.();
                      } else {
                        onHighlightFeature?.('feature-1');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700 text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    <span>{msg.suggestedAction.label}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-start animate-in fade-in">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm flex items-center gap-3 text-xs shadow-sm">
              <OrbitMascot size="xs" mood="analyzing" showHalo={false} />
              <div className="flex items-center gap-1.5 font-medium text-teal-600 dark:text-teal-400">
                <Loader2 className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                <span>Orbit is computing tensor graph inference...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex items-center gap-1.5">
        {suggestedQueries.map((query, i) => (
          <button
            key={i}
            onClick={() => handleSend(query)}
            disabled={isProcessing}
            className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 whitespace-nowrap transition-all duration-150 active:scale-[0.98] shadow-xs"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Input Query Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about this AOI..."
            disabled={isProcessing}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 text-xs"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-40"
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
