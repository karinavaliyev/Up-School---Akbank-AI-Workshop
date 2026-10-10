import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import {
  CandidateLevel,
  EvaluationResult,
  InterviewQuestion,
  PracticeSessionRecord,
} from '../types';

interface PracticeStudioProps {
  currentQuestion: InterviewQuestion | null;
  interviewerTitle: string;
  candidateLevel: CandidateLevel;
  onSaveToHistory: (record: PracticeSessionRecord) => void;
  onNavigateToGenerator: () => void;
}

// Window speech recognition typings
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  currentQuestion,
  interviewerTitle,
  candidateLevel,
  onSaveToHistory,
  onNavigateToGenerator,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        alert(
          'Tarayıcınız Web Speech ses tanıma özelliğini desteklemiyor. Lütfen yanıtınızı klavye ile yazarak girin.'
        );
        return;
      }

      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'tr-TR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          if (currentTranscript.trim()) {
            setAnswerText(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!currentQuestion) {
      setEvalError('Lütfen önce bir soru seçin.');
      return;
    }
    if (!answerText.trim() || answerText.trim().length < 15) {
      setEvalError('Lütfen değerlendirme için en az bir iki cümlelik anlamlı bir yanıt girin veya konuşun.');
      return;
    }

    if (isRecording) {
      toggleRecording();
    }

    setIsEvaluating(true);
    setEvalError(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: currentQuestion.questionText,
          interviewerTitle: interviewerTitle || 'Mülakatçı',
          candidateLevel,
          userAnswer: answerText,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Yanıt değerlendirilemedi.');
      }

      const result: EvaluationResult = await response.json();
      setEvaluation(result);

      // Auto-save to local session history
      const record: PracticeSessionRecord = {
        id: 'practice-' + Date.now(),
        timestamp: new Date().toLocaleString('tr-TR'),
        questionText: currentQuestion.questionText,
        interviewerTitle: interviewerTitle || 'Mülakatçı',
        userAnswer: answerText,
        evaluation: result,
      };
      onSaveToHistory(record);
      setIsSaved(true);
    } catch (err: any) {
      console.error(err);
      setEvalError(err.message || 'Yanıt değerlendirilirken hata oluştu.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyRephrased = () => {
    if (evaluation?.rephrasedIdealAnswer) {
      navigator.clipboard.writeText(evaluation.rephrasedIdealAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentQuestion) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <Mic className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">
          Henüz Pratik İçin Soru Seçilmedi
        </h3>
        <p className="text-sm text-slate-400">
          Lütfen önce Mülakat Simülatörü sekmesinden görüşmeci unvanını girin ve beğendiğiniz sorunun yanındaki "Pratik Yap" butonuna tıklayın.
        </p>
        <button
          onClick={onNavigateToGenerator}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <span>Mülakat Simülatörüne Git</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Active Question Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-400">
              Görüşmeci: {interviewerTitle || 'Kıdemli Mülakatçı'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{candidateLevel}</span>
          </div>
          <button
            onClick={onNavigateToGenerator}
            className="text-xs text-slate-400 hover:text-indigo-300 transition-colors"
          >
            Farklı Soru Seç
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
          "{currentQuestion.questionText}"
        </h2>

        <div className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-1">
          <span className="font-semibold text-indigo-300">Görüşmeci İpucu (Neden Soruluyor?): </span>
          <span>{currentQuestion.interviewerIntent}</span>
        </div>
      </div>

      {/* Answer & Voice Input Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Yanıtınızı Verin (Sesli veya Yazılı)
          </h3>

          <div className="flex items-center gap-3">
            {isRecording && (
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Kayıt Alınıyor: {formatTimer(recordingSeconds)}</span>
              </div>
            )}
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {answerText.length} karakter
            </span>
          </div>
        </div>

        {/* Speech-to-text control buttons */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
          <button
            type="button"
            onClick={toggleRecording}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isRecording
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Kaydı Bitir</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Mikrofon ile Sesli Konuş</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAnswerText('')}
            disabled={!answerText || isEvaluating}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>

          <span className="text-xs text-slate-500 ml-auto hidden sm:inline">
            {speechSupported
              ? 'Konuştuğunuz cümleler anında yazıya dökülecektir.'
              : 'Web Speech desteklenmiyor; yanıtınızı klavye ile yazabilirsiniz.'}
          </span>
        </div>

        {/* Text Area */}
        <div>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={5}
            placeholder="Yanıtınızı buraya sesle aktarın veya yazın. Örnek: 'Üniversitede 3. sınıfta yaptığımız bir veri yapıları projesinde...' (STAR metoduna göre Durum, Eylem ve Sonucu belirtmeye çalışın)"
            className="w-full px-4 py-3 text-sm bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Evaluation trigger button */}
        {evalError && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{evalError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleEvaluate}
          disabled={isEvaluating || !answerText.trim()}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>STAR Metodu & Yetkinlik Puanı Hesaplanıyor...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Yanıtımı Değerlendir & İdeal Versiyonu Gör</span>
            </>
          )}
        </button>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 sm:p-8 space-y-6">
          {/* Header & Score */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                <Award className="w-4 h-4" />
                <span>Mülakat Değerlendirme Raporu</span>
                {isSaved && (
                  <span className="text-slate-400">· Geçmişe Kaydedildi</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {evaluation.verdict}
              </h3>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400">Yetkinlik Skoru</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {evaluation.score} <span className="text-xs text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-indigo-300">
              Mülakatçının Genel İzlenimi ({interviewerTitle}):
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {evaluation.executiveSummary}
            </p>
          </div>

          {/* STAR Methodology Analysis */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              STAR Metodolojisi Analizi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-semibold text-indigo-400 block">
                  1. Durum & Görev (Situation / Task)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.situationTask}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-semibold text-emerald-400 block">
                  2. Eylem & Katkı (Action)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.action}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-semibold text-amber-400 block">
                  3. Çıktı & Sonuç (Result / Impact)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.starAnalysis.resultImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-lg bg-slate-950 border border-emerald-900/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Güçlü Bulunan Yönler
              </span>
              <ul className="space-y-1.5">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">·</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="p-4 rounded-lg bg-slate-950 border border-amber-900/30 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Geliştirilmesi Gereken Noktalar
              </span>
              <ul className="space-y-1.5">
                {evaluation.areasForImprovement.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">·</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rephrased Ideal Answer */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Hikayenizin İdeal Mülakat Versiyonu (Rephrased Answer)
              </span>
              <button
                type="button"
                onClick={handleCopyRephrased}
                className="text-xs px-2.5 py-1 rounded bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-200 border border-indigo-700/50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
              "{evaluation.rephrasedIdealAnswer}"
            </p>
          </div>

          {/* Coach Tip */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Kariyer Koçu Tavsiyesi: </span>
              <span>{evaluation.coachTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
