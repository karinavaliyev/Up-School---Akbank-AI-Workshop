import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { PracticeSessionRecord } from '../types';

interface PracticeHistoryProps {
  history: PracticeSessionRecord[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const PracticeHistory: React.FC<PracticeHistoryProps> = ({
  history,
  onClearHistory,
  onRemoveItem,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    history.length > 0 ? history[0].id : null
  );

  const handleExportMarkdown = () => {
    if (history.length === 0) return;

    let md = `# Staj & Junior Mülakat Pratik Kayıtları\n`;
    md += `Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}\n\n---\n\n`;

    history.forEach((h, idx) => {
      md += `## ${idx + 1}. Mülakat Sorusu: ${h.questionText}\n`;
      md += `- **Görüşmeci Unvanı:** ${h.interviewerTitle}\n`;
      md += `- **Tarih:** ${h.timestamp}\n`;
      md += `- **Puan:** ${h.evaluation.score}/100 (${h.evaluation.verdict})\n\n`;
      md += `### Adayın Yanıtı:\n> ${h.userAnswer}\n\n`;
      md += `### Genel Değerlendirme:\n${h.evaluation.executiveSummary}\n\n`;
      md += `### STAR Analizi:\n`;
      md += `- **Durum/Görev:** ${h.evaluation.starAnalysis.situationTask}\n`;
      md += `- **Eylem:** ${h.evaluation.starAnalysis.action}\n`;
      md += `- **Sonuç/Etki:** ${h.evaluation.starAnalysis.resultImpact}\n\n`;
      md += `### İdeal Mülakat Versiyonu:\n> ${h.evaluation.rephrasedIdealAnswer}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mulakat_pratik_kayitlari_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">
          Henüz Kayıtlı Mülakat Pratiği Yok
        </h3>
        <p className="text-sm text-slate-400">
          "Sesli & Yazılı Pratik" modunda herhangi bir mülakat sorusuna yanıt verip değerlendirdiğinizde
          sonuçlar otomatik olarak buraya kaydedilecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <History className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">
            Toplam {history.length} Pratik Oturumu
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Markdown Olarak İndir</span>
          </button>

          <button
            type="button"
            onClick={onClearHistory}
            className="px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-300 border border-slate-700/60 text-slate-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tümünü Temizle</span>
          </button>
        </div>
      </div>

      {/* History Items list */}
      <div className="space-y-4">
        {history.map((item, idx) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              {/* Item Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-indigo-400 font-semibold">
                      #{history.length - idx}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300 font-medium">
                      {item.interviewerTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {item.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {item.questionText}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Puan</span>
                    <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                      {item.evaluation.score}/100
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Bu kaydı sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Item Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 sm:px-5 space-y-4 border-t border-slate-800 bg-slate-950/50">
                  {/* User's Answer */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Verdiğiniz Yanıt:
                    </span>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{item.userAnswer}"
                    </p>
                  </div>

                  {/* Feedback Summary */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-indigo-300">
                      Görüşmeci Değerlendirmesi ({item.evaluation.verdict}):
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {item.evaluation.executiveSummary}
                    </p>
                  </div>

                  {/* Rephrased Ideal Answer */}
                  <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 space-y-1">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Önerilen İdeal Anlatım Versiyonu:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed italic border-l-2 border-indigo-500 pl-2.5">
                      "{item.evaluation.rephrasedIdealAnswer}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
