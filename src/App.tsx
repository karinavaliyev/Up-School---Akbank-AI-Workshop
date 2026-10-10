/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InterviewGenerator } from './components/InterviewGenerator';
import { PracticeStudio } from './components/PracticeStudio';
import { TrainingRoadmapCoach } from './components/TrainingRoadmapCoach';
import { PracticeHistory } from './components/PracticeHistory';
import {
  CandidateLevel,
  InterviewGenerationResponse,
  InterviewQuestion,
  PracticeSessionRecord,
} from './types';
import { INTERVIEW_PRESETS } from './data/presets';

const STORAGE_KEY = 'kariyer_kocu_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'generator' | 'practice' | 'training' | 'history'
  >('generator');

  // Generator State
  const [interviewerTitle, setInterviewerTitle] = useState(
    INTERVIEW_PRESETS[0].interviewerTitle
  );
  const [targetRole, setTargetRole] = useState(INTERVIEW_PRESETS[0].targetRole);
  const [candidateLevel, setCandidateLevel] = useState<CandidateLevel>(
    INTERVIEW_PRESETS[0].candidateLevel
  );
  const [companyContext, setCompanyContext] = useState(
    INTERVIEW_PRESETS[0].companyContext
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    INTERVIEW_PRESETS[0].notes
  );
  const [interviewData, setInterviewData] =
    useState<InterviewGenerationResponse | null>(null);

  // Practice State
  const [currentPracticeQuestion, setCurrentPracticeQuestion] =
    useState<InterviewQuestion | null>(null);

  // History State
  const [history, setHistory] = useState<PracticeSessionRecord[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from storage:', e);
    }
  }, []);

  const handleSaveToHistory = (record: PracticeSessionRecord) => {
    setHistory((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history to storage:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history from storage:', e);
    }
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update history in storage:', e);
      }
      return updated;
    });
  };

  const handleSelectQuestionForPractice = (
    question: InterviewQuestion,
    title: string,
    level: CandidateLevel
  ) => {
    setCurrentPracticeQuestion(question);
    setInterviewerTitle(title);
    setCandidateLevel(level);
    setActiveTab('practice');
  };

  const handleQuickPreset = () => {
    const preset = INTERVIEW_PRESETS[0];
    setInterviewerTitle(preset.interviewerTitle);
    setTargetRole(preset.targetRole);
    setCandidateLevel(preset.candidateLevel);
    setCompanyContext(preset.companyContext);
    setAdditionalNotes(preset.notes);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickPreset={handleQuickPreset}
        savedCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'generator' && (
          <InterviewGenerator
            onSelectQuestionForPractice={handleSelectQuestionForPractice}
            interviewerTitle={interviewerTitle}
            setInterviewerTitle={setInterviewerTitle}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            candidateLevel={candidateLevel}
            setCandidateLevel={setCandidateLevel}
            companyContext={companyContext}
            setCompanyContext={setCompanyContext}
            additionalNotes={additionalNotes}
            setAdditionalNotes={setAdditionalNotes}
            interviewData={interviewData}
            setInterviewData={setInterviewData}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeStudio
            currentQuestion={currentPracticeQuestion}
            interviewerTitle={interviewerTitle}
            candidateLevel={candidateLevel}
            onSaveToHistory={handleSaveToHistory}
            onNavigateToGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'training' && <TrainingRoadmapCoach />}

        {activeTab === 'history' && (
          <PracticeHistory
            history={history}
            onClearHistory={handleClearHistory}
            onRemoveItem={handleRemoveHistoryItem}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-400">
              Staj & Junior Mülakat ve Kariyer Koçu
            </span>
            <span aria-hidden="true">·</span>
            <span>Üniversite Öğrencileri ve Yeni Mezunlar İçin Geliştirildi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Google Gemini 3.8 Flash Destekli</span>
            <span aria-hidden="true">·</span>
            <span>STAR Metodolojisi & Beceri Açığı Analizi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
