import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { QueryBox } from './QueryBox';
import { AgentProcessingView } from './AgentProcessingView';
import { EvidenceViewer } from './EvidenceViewer';
import { ExecutionSummary } from './ExecutionSummary';
import { 
  ImageAnalysisMode, 
  UploadedImageMeta, 
  AnalysisResultData, 
  AgentProcessStep, 
  ReportItem 
} from '../../types';
import { AnalysisScenario, MOCK_SCENARIOS, MOCK_SAVED_REPORTS } from '../../data/mockData';

interface NewAnalysisWorkspaceProps {
  initialScenario?: AnalysisScenario;
  onSaveReport?: (report: ReportItem) => void;
  onViewReports?: () => void;
}

export const NewAnalysisWorkspace: React.FC<NewAnalysisWorkspaceProps> = ({
  initialScenario,
  onSaveReport,
  onViewReports
}) => {
  // Default to the first scenario (Urban Expansion Change VQA from Section 8 of design.md)
  const defaultScenario = initialScenario || MOCK_SCENARIOS[0];

  const [mode, setMode] = useState<ImageAnalysisMode>(defaultScenario.mode);
  const [images, setImages] = useState<UploadedImageMeta[]>(defaultScenario.images);
  const [query, setQuery] = useState(defaultScenario.defaultQuery);
  const [activeScenario, setActiveScenario] = useState<AnalysisScenario>(defaultScenario);

  // Analysis State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [currentResult, setCurrentResult] = useState<AnalysisResultData | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Step definition from Section 19 of design.md
  const agentSteps: AgentProcessStep[] = [
    { id: '1', title: 'Input validated', detail: 'Raster tags and CRS EPSG projection confirmed', status: 'completed' },
    { id: '2', title: 'Query understood', detail: 'Semantic intent & referential targets extracted', status: 'completed' },
    { id: '3', title: 'Task identified', detail: `${activeScenario.taskType.toUpperCase()} Pipeline dispatched`, status: 'completed' },
    { id: '4', title: 'Specialist model selected', detail: activeScenario.result.modelsUsed[0] || 'RS-VLM Model', status: 'completed' },
    { id: '5', title: 'Running analysis...', detail: 'TensorRT-LLM sub-second inference running', status: 'running' },
    { id: '6', title: 'Generating visual evidence', detail: 'Extracting bounding boxes & difference heatmap', status: 'pending' },
    { id: '7', title: 'Preparing response', detail: 'Correlating confidence and execution summary', status: 'pending' }
  ];

  // When scenario changes
  const handleSelectScenario = (sc: AnalysisScenario) => {
    setActiveScenario(sc);
    setMode(sc.mode);
    setImages(sc.images);
    setQuery(sc.defaultQuery);
    setCurrentResult(null);
    setSavedSuccess(false);
  };

  const handleAddImage = (newImg: UploadedImageMeta) => {
    setImages(prev => [...prev, newImg]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Run the full authentic agentic analysis workflow
  const handleAnalyze = () => {
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    setCurrentResult(null);
    setSavedSuccess(false);
    setProcessingStepIndex(0);

    // Progression timing through the agent steps
    const timer1 = setTimeout(() => setProcessingStepIndex(1), 350);
    const timer2 = setTimeout(() => setProcessingStepIndex(2), 700);
    const timer3 = setTimeout(() => setProcessingStepIndex(3), 1100);
    const timer4 = setTimeout(() => setProcessingStepIndex(4), 1500);
    const timer5 = setTimeout(() => setProcessingStepIndex(5), 2000);
    const timer6 = setTimeout(() => setProcessingStepIndex(6), 2500);
    const timer7 = setTimeout(() => {
      setIsProcessing(false);
      setProcessingStepIndex(7);

      // Synthesize result matching current scenario or dynamic query
      const newResultData: AnalysisResultData = {
        id: `AN-${Date.now().toString().slice(-4)}`,
        query,
        task: activeScenario.result.selectedTask,
        taskType: activeScenario.taskType,
        mode,
        answer: activeScenario.result.answer,
        confidence: activeScenario.result.confidence,
        confidenceLevel: activeScenario.result.confidenceLevel,
        timestamp: new Date().toISOString(),
        modelsUsed: activeScenario.result.modelsUsed,
        executionSummary: activeScenario.result.executionSummary,
        evidence: activeScenario.result.evidence
      };

      setCurrentResult(newResultData);
    }, 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  };

  const handleSaveToReports = () => {
    if (!currentResult) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: `${activeScenario.title}: ${query.slice(0, 45)}...`,
      query: currentResult.query,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      task: currentResult.task,
      confidence: currentResult.confidence,
      answer: currentResult.answer,
      modelsUsed: currentResult.modelsUsed,
      executionTime: `${currentResult.executionSummary.latencyMs} ms`,
      status: 'Generated',
      inputSummary: currentResult.executionSummary.inputSummary,
      evidenceVisual: currentResult.evidence.changeMap?.visual || currentResult.evidence.imageA?.visual,
      tags: [currentResult.task, currentResult.mode],
      fullAnalysis: currentResult
    };

    if (onSaveReport) {
      onSaveReport(newReport);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 15. Workspace Header (Section 15 of design.md: Heading & Subtitle) */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
            <Compass className="w-4 h-4 text-cyan-500" />
            <span>Analysis Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            New Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload remote-sensing imagery and ask a question.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {onViewReports && (
            <button
              onClick={onViewReports}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:border-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-500" />
              <span>Saved Reports</span>
            </button>
          )}
        </div>
      </div>

      {/* 16 & 17. Image Upload & Dynamic Configuration */}
      <ImageUploader
        mode={mode}
        onChangeMode={setMode}
        images={images}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onSelectScenario={handleSelectScenario}
      />

      {/* 18. Natural Language Query */}
      <QueryBox
        query={query}
        onChangeQuery={setQuery}
        onAnalyze={handleAnalyze}
        isProcessing={isProcessing}
        disabled={images.length === 0}
      />

      {/* 19. Agent Processing UI */}
      {isProcessing && (
        <AgentProcessingView
          currentStepIndex={processingStepIndex}
          steps={agentSteps}
          selectedTask={activeScenario.result.selectedTask}
          selectedModel={activeScenario.result.modelsUsed[0]}
        />
      )}

      {/* 20 & 21 & 22. Results Interface & Evidence Viewer */}
      {currentResult && !isProcessing && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Section 20: Results Header (Final Answer + Confidence Badge) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border-2 border-cyan-400/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  Final Answer • {currentResult.task}
                </span>
              </div>

              {/* Confidence Badge (Section 20: e.g. 91% — High confidence) */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{currentResult.confidence}% — {currentResult.confidenceLevel} confidence</span>
                </span>
              </div>
            </div>

            {/* Final Answer Text */}
            <div className="space-y-2">
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {currentResult.answer}
              </div>
            </div>

            {/* Action Bar: Save to Reports / Re-run */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="text-slate-500 dark:text-slate-400">
                Models: {currentResult.modelsUsed.join(' + ')}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToReports}
                  className={`px-3.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                    savedSuccess
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved to Reports!' : 'Save Report'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 21: Visual Evidence Viewer */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Visual Evidence & Multi-Spectral Verification
            </div>
            <EvidenceViewer result={currentResult} />
          </div>

          {/* Section 22: Execution Summary */}
          <ExecutionSummary
            summary={currentResult.executionSummary}
            confidence={currentResult.confidence}
          />
        </div>
      )}
    </div>
  );
};
