import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ChatMessage, AOIPreset, Screen } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { OrbitMascot } from '../mascot/OrbitMascot';

interface FloatingChatWidgetProps {
  onNavigateToWorkspace: (aoi?: AOIPreset) => void;
  onNavigate: (screen: Screen) => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onNavigateToWorkspace,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'f-init',
      sender: 'agent',
      timestamp: 'Just now',
      text: 'Hi there! I am **Orbit**, your SatQuery Earth Observation AI companion. Ask me anything about planetary coordinates, multi-spectral band indices (NDVI/NBR), or satellite change detection.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    'Quantify Amazon canopy loss',
    'How is NDVI calculated?',
    'Map Rhine flood crest depth'
  ];

  const hasStartedChatting = messages.some(m => m.sender === 'user');

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded]);

  const handleSend = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      const isAmazon = query.toLowerCase().includes('amazon') || query.toLowerCase().includes('canopy');
      const isFormula = query.toLowerCase().includes('ndvi') || query.toLowerCase().includes('formula');

      let reply = `Analyzed query: "${query}". Connected to Copernicus STAC endpoint. Ready to generate high-resolution segmentations.`;
      let targetPreset = MOCK_AOI_PRESETS[0];

      if (isAmazon) {
        reply = `**Amazon Basin (Rondônia)**: Detected **48.2 ha** of canopy loss between June and August 2024 with **98.6% model confidence** across 14 disturbance vectors.`;
        targetPreset = MOCK_AOI_PRESETS[0];
      } else if (isFormula) {
        reply = `**NDVI Formula**: (B08 - B04) / (B08 + B04). Using Sentinel-2 Level-2A surface reflectance, healthy dense forest typically yields values between 0.75 and 0.88.`;
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        timestamp: 'Just now',
        text: reply,
        suggestedAction: {
          label: 'Open in Geospatial Canvas',
          actionType: 'open-workspace',
          targetAOIId: targetPreset.id
        }
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <>
      {/* Soft Dimming Backdrop for In-Page Expanded View */}
      {isOpen && isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity duration-200 animate-in fade-in"
          aria-label="Collapse full conversation"
        />
      )}

      {/* Floating Chatbox Widget / Launcher Container */}
      <div
        className={
          isOpen && isExpanded
            ? 'fixed inset-x-3 bottom-4 sm:inset-auto sm:bottom-5 sm:right-5 z-50 select-none flex justify-end pointer-events-none'
            : 'fixed bottom-5 right-5 z-50 select-none'
        }
      >
        {/* Floating Chatbox Window */}
        {isOpen && (
          <div
            className={`bg-white dark:bg-slate-900 border-2 border-blue-500/70 dark:border-cyan-500/40 shadow-[0_0_40px_rgba(59,130,246,0.38)] dark:shadow-[0_0_40px_rgba(6,182,212,0.25)] ring-4 ring-blue-500/20 dark:ring-cyan-500/20 flex flex-col overflow-hidden text-slate-900 dark:text-white transition-all duration-300 ease-out pointer-events-auto ${
              isExpanded
                ? 'w-full sm:w-[500px] md:w-[550px] h-[540px] max-h-[78vh] rounded-2xl shadow-[0_0_55px_rgba(59,130,246,0.45)] ring-blue-500/30 dark:ring-cyan-500/30'
                : 'mb-0 w-[315px] sm:w-[340px] h-[435px] rounded-2xl animate-in slide-in-from-bottom-5 duration-200'
            }`}
          >
            {/* Radiant Blue Top Accent Trim */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_12px_rgba(56,189,248,0.6)] shrink-0"></div>

            {/* Header */}
            <div className="px-3 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <OrbitMascot size="sm" mood={isProcessing ? 'analyzing' : 'idle'} showHalo={true} />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Orbit AI Copilot</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
                    {isExpanded && (
                      <span className="ml-1 text-[9px] font-semibold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-cyan-800">
                        Full
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold leading-tight">
                    STAC Multi-Spectral Agent
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* View Full Conversation option in header (when user started chatting & not expanded) */}
                {hasStartedChatting && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 hover:bg-blue-100 dark:hover:bg-cyan-900/60 border border-blue-200 dark:border-cyan-800 transition-all duration-150 active:scale-[0.98]"
                    title="View Full Conversation within this page"
                  >
                    <Maximize2 className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                    <span>Expand</span>
                  </button>
                )}

                {/* Return to Compact View option when expanded */}
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-150 active:scale-[0.98]"
                    title="Return to compact chatbox"
                  >
                    <Minimize2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    <span>Compact</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-[0.98]"
                  title="Close Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-50/70 dark:bg-slate-950/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {m.sender !== 'user' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-0.5 px-1">
                      <OrbitMascot size="xs" mood="idle" showHalo={false} />
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">Orbit</span>
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-2xl ${isExpanded ? 'max-w-[82%]' : 'max-w-[88%]'} text-[11.5px] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-sm shadow-sm'
                        : 'bg-white dark:bg-slate-850 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {m.suggestedAction && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => {
                            const target = MOCK_AOI_PRESETS.find(p => p.id === m.suggestedAction?.targetAOIId) || MOCK_AOI_PRESETS[0];
                            setIsOpen(false);
                            setIsExpanded(false);
                            onNavigateToWorkspace(target);
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 text-[10px] font-bold flex items-center gap-1 active:scale-[0.98] transition-colors"
                        >
                          <Compass className="w-3 h-3" />
                          <span>{m.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-2 py-1">
                  <OrbitMascot size="xs" mood="analyzing" showHalo={true} />
                  <Loader2 className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                  <span>Orbit is querying foundation models...</span>
                </div>
              )}

              {/* Contextual option banner in conversation stream after chatting starts (compact mode) */}
              {hasStartedChatting && !isExpanded && !isProcessing && (
                <div className="pt-1.5 pb-0.5">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                      <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium truncate">
                        Need more space?
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] shrink-0 flex items-center gap-1 active:scale-[0.98] transition-colors shadow-xs"
                    >
                      <span>Continue Chat</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Chips */}
            <div className="py-1.5 px-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5 text-[10px] shrink-0">
              {quickQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isProcessing}
                  className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 whitespace-nowrap active:scale-[0.98] transition-all shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2 px-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Orbit AI..."
                disabled={isProcessing}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isProcessing}
                className="p-1.5 sm:p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-500/20 active:scale-[0.98] disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Floating Launcher Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group pl-2.5 pr-4 py-2 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-[0_0_25px_rgba(59,130,246,0.35)] dark:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] border-2 border-blue-500/70 dark:border-cyan-500/50 ring-4 ring-blue-500/20 dark:ring-cyan-500/20 flex items-center gap-2.5 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-cyan-400"
            aria-label="Open SatQuery AI Chat"
          >
            <OrbitMascot size="sm" mood="idle" showHalo={true} />
            <span className="text-slate-900 dark:text-white font-bold">Chat with Orbit AI</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </button>
        )}
      </div>
    </>
  );
};
