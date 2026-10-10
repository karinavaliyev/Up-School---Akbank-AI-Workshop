import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
} from 'lucide-react';
import { CareerRoadmapResponse, TrainingItem } from '../types';
import { TRAINING_PROFILE_PRESETS } from '../data/presets';

interface TrainingRoadmapCoachProps {
  onExportRoadmap?: (roadmap: CareerRoadmapResponse) => void;
}

export const TrainingRoadmapCoach: React.FC<TrainingRoadmapCoachProps> = () => {
  const [trainings, setTrainings] = useState<TrainingItem[]>(
    TRAINING_PROFILE_PRESETS[0].trainings
  );
  const [department, setDepartment] = useState(
    TRAINING_PROFILE_PRESETS[0].department
  );
  const [targetGoal, setTargetGoal] = useState(
    TRAINING_PROFILE_PRESETS[0].targetGoal
  );
  const [notes, setNotes] = useState(TRAINING_PROFILE_PRESETS[0].notes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<CareerRoadmapResponse | null>(null);

  // New training item modal/inline state
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const handleApplyPreset = (presetId: string) => {
    const preset = TRAINING_PROFILE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setTrainings(preset.trainings);
      setDepartment(preset.department);
      setTargetGoal(preset.targetGoal);
      setNotes(preset.notes);
      setRoadmapData(null);
    }
  };

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopics.trim()) {
      return;
    }

    const newItem: TrainingItem = {
      id: 'training-' + Date.now(),
      title: newTitle.trim(),
      provider: newProvider.trim() || 'Online Kurs / Ders',
      topicsCovered: newTopics.trim(),
      duration: newDuration.trim() || '4 Hafta',
    };

    setTrainings([...trainings, newItem]);
    setNewTitle('');
    setNewProvider('');
    setNewTopics('');
    setNewDuration('');
  };

  const handleRemoveTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleAnalyze = async () => {
    if (trainings.length === 0) {
      setError('Lütfen analiz için en az bir eğitim veya ders içeriği ekleyin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/analyze-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainings,
          targetGoal,
          universityDepartment: department,
          notes,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Eğitim analizi yapılamadı.');
      }

      const data: CareerRoadmapResponse = await response.json();
      setRoadmapData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analiz sırasında sunucuyla iletişim kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-2">
            <span>Eğitim İçeriği & Beceri Açığı Analizi</span>
            <span aria-hidden="true">·</span>
            <span>Kişiselleştirilmiş Öğrenme Yol Haritası</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Aldığınız Eğitimlerin Ötesine Geçin: Bir Sonraki Adımda Ne Öğrenmelisiniz?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Tamamladığınız üniversite derslerini, Udemy/Coursera kurslarını ve sertifika içeriklerini girin.
            Yapay zeka mevcut seviyenizi tartıp, hedeflediğiniz staj veya junior rolü için nelerin eksik kaldığını
            (beceri açıklarını) analiz etsin ve almanız gereken sonraki spesifik eğitimi, müfredatını ve bitirme projesini çıkarsın.
          </p>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Örnek Eğitim Geçmişi Setleri:</span>
            {TRAINING_PROFILE_PRESETS.map((p) => (
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

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Training Input & Profile Setup */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Target className="w-4 h-4 text-indigo-400" />
              Hedef ve Aday Bilgisi
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bölüm / Akademik Durum
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Örn: Bilgisayar Mühendisliği 3. Sınıf, YBS Yeni Mezun"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hedeflenen Pozisyon veya Aşama
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="Örn: Yazılım Geliştirici Stajı Bulmak, Junior Frontend Developer"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Özel Durum Notu (İsteğe Bağlı)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Örn: Teori derslerim iyi ama henüz portfolyomda yayında bir web projem yok..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Training Items List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Tamamlanan Eğitimler ({trainings.length})
              </h2>
              <span className="text-xs text-slate-400">İçerik Detayları</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {trainings.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-white">
                      {idx + 1}. {t.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTraining(t.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Eğitimi kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{t.provider}</span>
                    {t.duration && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{t.duration}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-850">
                    <span className="text-slate-400 font-medium">İçerik: </span>
                    {t.topicsCovered}
                  </p>
                </div>
              ))}
            </div>

            {/* Add new training form */}
            <form onSubmit={handleAddTraining} className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-indigo-300 block">
                + Yeni Eğitim İçeriği Ekle
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Eğitim / Ders Adı *"
                  className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="Sağlayıcı (Udemy, BTK vb.)"
                  className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white placeholder-slate-500"
                />
              </div>

              <textarea
                value={newTopics}
                onChange={(e) => setNewTopics(e.target.value)}
                rows={2}
                placeholder="Öğrenilen kritik konu başlıkları * (Örn: REST API, Docker temelleri, State management)"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white placeholder-slate-500"
              />

              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Süre (örn. 6 Hafta)"
                  className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-white placeholder-slate-500 w-32"
                />
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newTopics.trim()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Listeye Ekle</span>
                </button>
              </div>
            </form>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || trainings.length === 0}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Eğitim İçerikleri & Beceri Açıkları Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Eğitimlerimi Analiz Et & Yol Haritası Çıkar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Analysis & Next Steps Roadmap Output */}
        <div className="lg:col-span-7 space-y-6">
          {!roadmapData && !loading && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Eğitim Yol Haritası Henüz Oluşturulmadı
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Soldaki panelden bugüne kadar aldığınız eğitimleri inceleyin veya hazır öğrenci profillerinden birini yükleyip
                "Analiz Et" butonuna tıklayın.
              </p>
              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/50 border border-amber-800/60 rounded-lg hover:bg-amber-900/50 transition-colors"
              >
                <span>Mevcut Profili Şimdi Analiz Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Tamamlanan {trainings.length} Eğitimin İçeriği İnceleniyor...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Gemini, hedefiniz olan "{targetGoal}" pozisyonuna göre beceri açıklarınızı ve bir sonraki adımda almanız gereken en kritik eğitimi planlıyor.
              </p>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-amber-500 animate-pulse" />
              </div>
            </div>
          )}

          {roadmapData && !loading && (
            <div className="space-y-6">
              {/* Current Level Assessment Card */}
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Mevcut Yetkinlik Seviyesi Teşhisi</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {roadmapData.currentLevelAssessment.levelBadge}
                    </h3>
                  </div>

                  {/* Readiness percentage */}
                  <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-400">Hedefe Hazırlık</span>
                      <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                        %{roadmapData.currentLevelAssessment.levelPercentage}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {roadmapData.currentLevelAssessment.profileSummary}
                </p>

                {/* Validated Skills */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">
                    Eğitimlerinizle Kanıtlanmış Güçlü Kaslar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {roadmapData.currentLevelAssessment.validatedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill Gaps Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Hedef Rol İçin Tespit Edilen Beceri Açıkları (Skill Gaps)
                  </h3>
                  <span className="text-xs text-slate-400">
                    {roadmapData.skillGaps.length} Kritik Alan
                  </span>
                </div>

                <div className="space-y-3">
                  {roadmapData.skillGaps.map((gap, idx) => {
                    const isCritical = gap.severity.includes('Kritik');

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isCritical ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                            />
                            {gap.skillName}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              isCritical
                                ? 'bg-red-950/60 text-red-300 border border-red-800/50'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                            }`}
                          >
                            {gap.severity}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="text-slate-400 font-medium">Neden Eksik Kaldı: </span>
                          {gap.gapReason}
                        </p>

                        <div className="text-xs text-red-300/90 bg-red-950/20 border border-red-900/30 rounded p-2">
                          <span className="font-semibold text-red-400">Mülakat Riski: </span>
                          {gap.interviewRisk}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Next Steps & Roadmap */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Bir Sonraki Adım İçin Önerilen Eğitim Yol Haritası
                  </h3>
                  <span className="text-xs text-indigo-400 font-mono">Somut Eylem Planı</span>
                </div>

                <div className="space-y-5">
                  {roadmapData.recommendedNextTrainings.map((rec) => (
                    <div
                      key={rec.stepNumber}
                      className="p-5 rounded-xl bg-slate-950 border border-indigo-900/40 space-y-3.5 relative overflow-hidden"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono font-semibold">
                            <span>Adım 0{rec.stepNumber}</span>
                            <span aria-hidden="true">·</span>
                            <span>{rec.estimatedWeeks}</span>
                          </div>
                          <h4 className="text-base font-bold text-white">
                            {rec.trainingTitle}
                          </h4>
                        </div>

                        <span className="text-xs px-2.5 py-1 bg-indigo-950/70 border border-indigo-800/60 text-indigo-200 rounded">
                          {rec.targetCompetency}
                        </span>
                      </div>

                      {/* Required Syllabus Topics */}
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                          Alacağınız Eğitimde MUTLAKA Olması Gereken Konu Modülleri:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rec.syllabusTopics.map((topic, i) => (
                            <li
                              key={i}
                              className="text-xs p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-start gap-2"
                            >
                              <span className="text-indigo-400 font-bold">✓</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Platforms */}
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800/80 flex flex-wrap items-center gap-2">
                        <span className="text-slate-400 font-medium">Önerilen Kaynaklar:</span>
                        {rec.recommendedPlatformsOrResources.map((res, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800"
                          >
                            {res}
                          </span>
                        ))}
                      </div>

                      {/* Hands-on Capstone Project */}
                      <div className="p-3.5 rounded-lg bg-gradient-to-r from-indigo-950/30 to-slate-900 border border-indigo-700/40 space-y-1.5">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          CV ve GitHub İçin Tavsiye Edilen Bitirme Projesi:
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {rec.capstoneProjectIdea}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Coach Advice Banner */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <FileText className="w-4 h-4" />
                  <span>Kariyer Koçundan Staj & Junior İşe Alım Tavsiyesi:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {roadmapData.careerCoachAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
