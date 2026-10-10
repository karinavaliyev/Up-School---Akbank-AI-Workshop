import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Mic,
  ChevronDown,
  Building2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  CandidateLevel,
  InterviewGenerationResponse,
  InterviewQuestion,
} from '../types';
import { INTERVIEW_PRESETS } from '../data/presets';

interface InterviewGeneratorProps {
  onSelectQuestionForPractice: (
    question: InterviewQuestion,
    interviewerTitle: string,
    candidateLevel: CandidateLevel
  ) => void;
  interviewerTitle: string;
  setInterviewerTitle: (title: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  candidateLevel: CandidateLevel;
  setCandidateLevel: (level: CandidateLevel) => void;
  companyContext: string;
  setCompanyContext: (context: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (notes: string) => void;
  interviewData: InterviewGenerationResponse | null;
  setInterviewData: (data: InterviewGenerationResponse | null) => void;
}

export const InterviewGenerator: React.FC<InterviewGeneratorProps> = ({
  onSelectQuestionForPractice,
  interviewerTitle,
  setInterviewerTitle,
  targetRole,
  setTargetRole,
  candidateLevel,
  setCandidateLevel,
  companyContext,
  setCompanyContext,
  additionalNotes,
  setAdditionalNotes,
  interviewData,
  setInterviewData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const titleSuggestions = [
    'Engineering Manager',
    'Kıdemli Tech Lead',
    'İnsan Kaynakları Uzmanı',
    'CTO (Teknoloji Lideri)',
    'Lead Data Scientist',
    'Product Manager',
  ];

  const handleApplyPreset = (presetId: string) => {
    const preset = INTERVIEW_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInterviewerTitle(preset.interviewerTitle);
      setTargetRole(preset.targetRole);
      setCandidateLevel(preset.candidateLevel);
      setCompanyContext(preset.companyContext);
      setAdditionalNotes(preset.notes);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) {
      setError('Lütfen görüşmeci unvanını ve hedeflenen rolü doldurun.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          targetRole,
          candidateLevel,
          companyContext,
          additionalNotes,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Sorular oluşturulamadı.');
      }

      const data: InterviewGenerationResponse = await response.json();
      setInterviewData(data);
      if (data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Mülakat soruları alınırken bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero / Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
            <span>Staj & Junior Mülakat Simülasyonu</span>
            <span aria-hidden="true">·</span>
            <span>Unvan Bazlı Soru Analitiği</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Masanın Karşı Tarafındaki Kişinin Gözünden Mülakata Hazırlanın
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Mülakatı yapan kişinin unvanını (Engineering Manager, İK, Tech Lead veya CTO) girin.
            Yapay zeka, o unvanın stajyer veya yeni mezun bir adayda nelere baktığını deşifre etsin ve
            potansiyel olarak sorabileceği soruları STAR metodolojisiyle hazırlasın.
          </p>

          {/* Quick presets strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Hızlı Hazır Profiller:</span>
            {INTERVIEW_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p.id)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Configuration */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Mülakat Parametreleri
            </h2>
            <span className="text-xs text-slate-400 font-mono">1. Adım</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Interviewer Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mülakatı Yapacak Kişinin Unvanı <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Engineering Manager, İnsan Kaynakları Uzmanı, CTO"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                required
              />
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {titleSuggestions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewerTitle(t)}
                    className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Level */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Aday Seviyesi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCandidateLevel('Stajyer (Üniversite Öğrencisi)')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    candidateLevel === 'Stajyer (Üniversite Öğrencisi)'
                      ? 'bg-indigo-950/60 border-indigo-500/70 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Stajyer (Öğrenci)
                </button>
                <button
                  type="button"
                  onClick={() => setCandidateLevel('Yeni Mezun / Junior')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    candidateLevel === 'Yeni Mezun / Junior'
                      ? 'bg-indigo-950/60 border-indigo-500/70 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Yeni Mezun / Junior
                </button>
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Hedeflenen Rol / Pozisyon <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Frontend Geliştirici Stajyeri, Junior Backend Developer"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            {/* Company / Industry Context */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Şirket veya Sektör Türü
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="Örn: B2B SaaS Startup, Kurumsal Banka, E-Ticaret"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Additional Projects / Context */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Öne Çıkarmak İstediğiniz Proje veya Notlar
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Örn: Bitirme projemde React ve Node kullandım. Kulüp hackathonunda ekip liderliği yaptım..."
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Görüşmeci Perspektifi Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Potansiyel Mülakat Sorularını Üret</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Area: Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {!interviewData && !loading && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Mülakat Soruları Henüz Oluşturulmadı
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Soldaki formdan gireceğiniz mülakatın katılımcı unvanını belirleyin veya yukarıdaki
                hazır öğrenci/junior profillerinden birine tıklayın.
              </p>
              <button
                type="button"
                onClick={() => handleApplyPreset('em-frontend-intern')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 rounded-lg hover:bg-indigo-900/50 transition-colors"
              >
                <span>Örnek Profil Yükle (Engineering Manager · Frontend Stajı)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mx-auto animate-pulse">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                "{interviewerTitle}" Perspektifi İnceleniyor...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Gemini, stajyer ve junior beklentilerine göre filtrelenmiş 5 kritik soru, değerlendirme amaçları ve STAR rehberini hazırlıyor.
              </p>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-indigo-500 animate-pulse" />
              </div>
            </div>
          )}

          {interviewData && !loading && (
            <div className="space-y-6">
              {/* Interviewer Mindset Banner */}
              <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-indigo-300">
                    Görüşmeci Zihin Haritası: {interviewerTitle}
                  </span>
                  <span>{candidateLevel}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {interviewData.interviewerMindsetSummary}
                </p>
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">
                    Bu unvanın masadaki ilk 3 önceliği:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {interviewData.interviewerPriorities.map((priority, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {priority}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-medium text-slate-300">
                    Önerilen {interviewData.questions.length} Potansiyel Soru
                  </span>
                  <span>Pratik yapmak için soru kartına tıklayın</span>
                </div>

                {interviewData.questions.map((q, index) => {
                  const isExpanded = expandedQuestionId === q.id;

                  return (
                    <div
                      key={q.id || index}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all overflow-hidden"
                    >
                      {/* Question Header Row */}
                      <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-mono text-indigo-400 font-semibold">
                              Soru 0{index + 1}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-300 font-medium">
                              {q.categoryBadge || q.category}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                            {q.questionText}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Practice Button */}
                          <button
                            type="button"
                            onClick={() =>
                              onSelectQuestionForPractice(q, interviewerTitle, candidateLevel)
                            }
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                            title="Bu soruyla sesli veya yazılı pratik yap"
                          >
                            <Mic className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Pratik Yap</span>
                          </button>

                          {/* Toggle expand button */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedQuestionId(isExpanded ? null : q.id)
                            }
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            aria-label="Detayları aç/kapat"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Question Deep Dive */}
                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 sm:px-5 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
                          {/* Interviewer Intent */}
                          <div className="rounded-lg p-3 bg-slate-900/80 border border-slate-800/80 space-y-1">
                            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Neden Bu Soruyu Soruyor? (Görüşmeci Amacı)
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {q.interviewerIntent}
                            </p>
                          </div>

                          {/* What to highlight */}
                          <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1.5">
                              Cevabınızda Mutlaka Vurgulanması Gereken 3 Nokta:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {q.whatToHighlight.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-xs p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-start gap-1.5"
                                >
                                  <span className="text-indigo-400 font-mono font-bold mt-0.5">
                                    {i + 1}.
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* STAR Advice */}
                          <div className="rounded-lg p-3 bg-indigo-950/20 border border-indigo-900/40 space-y-1">
                            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              STAR Metodolojisi İpucu
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {q.starAdvice}
                            </p>
                          </div>

                          {/* Sample Good Response */}
                          <div className="rounded-lg p-3 bg-slate-900/90 border border-slate-800 space-y-1">
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              Örnek Güçlü Junior/Stajyer Yanıtı
                            </span>
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                              "{q.sampleGoodResponse}"
                            </p>
                          </div>

                          {/* Common Pitfalls */}
                          <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                            <div>
                              <span className="font-semibold text-amber-300">
                                Junior Adayların Düştüğü Hata:{' '}
                              </span>
                              <span>{q.commonPitfalls}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
