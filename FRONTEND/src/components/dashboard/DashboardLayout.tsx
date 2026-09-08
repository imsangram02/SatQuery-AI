import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { NewAnalysisWorkspace } from './NewAnalysisWorkspace';
import { ModelsAndToolsView } from './ModelsAndToolsView';
import { AnalysisHistoryView } from './AnalysisHistoryView';
import { ReportsView } from './ReportsView';
import { ErrorStatesView } from './ErrorStatesView';
import { WorkspaceView } from '../workspace/WorkspaceView';
import { SettingsView } from '../settings/SettingsView';
import { 
  DashboardView, 
  UserProfile, 
  ReportItem, 
  AnalysisTaskType,
  AOIPreset
} from '../../types';
import { AnalysisScenario, MOCK_SCENARIOS } from '../../data/mockData';
import { Footer } from '../layout/Footer';

interface DashboardLayoutProps {
  user: UserProfile;
  onBackToLanding: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  initialView?: DashboardView;
  onSignOut?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onBackToLanding,
  onUpdateProfile,
  initialView = 'new-analysis',
  onSignOut
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>(initialView);
  const [selectedScenario, setSelectedScenario] = useState<AnalysisScenario>(MOCK_SCENARIOS[0]);
  const [savedReports, setSavedReports] = useState<ReportItem[]>([]);

  const handleSaveReport = (report: ReportItem) => {
    setSavedReports(prev => [report, ...prev]);
  };

  const handleViewReportInHistory = (report: ReportItem) => {
    setCurrentView('reports');
  };

  const handleSelectModelTask = (taskType: AnalysisTaskType) => {
    // Find matching scenario for taskType
    const matchingScenario = MOCK_SCENARIOS.find(s => s.taskType === taskType) || MOCK_SCENARIOS[0];
    setSelectedScenario(matchingScenario);
    setCurrentView('new-analysis');
  };

  return (
    <div className="min-h-screen flex flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 13 & 14. Left Sidebar Panel (Section 13 & 14 of design.md) */}
      <DashboardSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        onBackToLanding={onBackToLanding}
        user={user}
        systemStatus="AI System Ready"
        onSignOut={onSignOut}
      />

      {/* Main Workspace Area (Section 13 of design.md) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        <div className="flex-1">
          {/* View 1: New Analysis (The core agentic workspace from Section 15-22) */}
          {currentView === 'new-analysis' && (
            <NewAnalysisWorkspace
              initialScenario={selectedScenario}
              onSaveReport={handleSaveReport}
              onViewReports={() => setCurrentView('reports')}
            />
          )}

          {/* View 2: Analysis History (Section 24) */}
          {currentView === 'history' && (
            <AnalysisHistoryView
              onViewReport={handleViewReportInHistory}
              onOpenInWorkspace={(_rep) => {
                setCurrentView('new-analysis');
              }}
            />
          )}

          {/* View 3: Saved Reports (Section 25) */}
          {currentView === 'reports' && (
            <ReportsView customReports={savedReports} />
          )}

          {/* View 4: Models & Tools Page (Section 23) */}
          {currentView === 'models' && (
            <ModelsAndToolsView onSelectModelTask={handleSelectModelTask} />
          )}

          {/* View 5: 3-Pane Geospatial Canvas (Power-user GIS Interactive Studio) */}
          {currentView === 'canvas' && (
            <div className="h-[calc(100vh-10px)] w-full">
              <WorkspaceView />
            </div>
          )}

          {/* View 6: Error States & Recovery Lab (Section 26) */}
          {currentView === 'errors' && (
            <ErrorStatesView
              onResolveToWorkspace={() => setCurrentView('new-analysis')}
            />
          )}

          {/* View 7: Settings Page */}
          {currentView === 'settings' && (
            <SettingsView
              user={user}
              onUpdateProfile={onUpdateProfile}
              initialTab="confidence"
            />
          )}
        </div>

        {/* Workspace Footer (only on non-full canvas pages) */}
        {currentView !== 'canvas' && <Footer />}
      </main>
    </div>
  );
};
