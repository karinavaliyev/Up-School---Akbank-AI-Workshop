import React from 'react';
import { Briefcase, Mic, GraduationCap, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'practice' | 'training' | 'history';
  setActiveTab: (tab: 'generator' | 'practice' | 'training' | 'history') => void;
  onQuickPreset: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickPreset,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
                KariyerKoçu <span className="text-indigo-400 font-normal">· Staj & Junior Stüdyo</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean Single-line Tabs) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'generator'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Mülakat Simülatörü</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'practice'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Sesli & Yazılı Pratik</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'training'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Eğitim & Kariyer Koçu</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Geçmiş Pratikler</span>
              {savedCount > 0 && (
                <span className="text-xs font-mono tabular-nums text-slate-400 ml-0.5">
                  ({savedCount})
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onQuickPreset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 rounded-lg hover:bg-indigo-900/50 hover:text-indigo-200 transition-colors whitespace-nowrap shrink-0"
              title="Örnek öğrenci/junior profilini hızlıca yükler"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Örnek Profil Yükle</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'generator' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Mülakat
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'practice' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Pratik Modu
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'training' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Eğitim Koçu
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Kayıtlar ({savedCount})
          </button>
        </div>
      </div>
    </header>
  );
};
