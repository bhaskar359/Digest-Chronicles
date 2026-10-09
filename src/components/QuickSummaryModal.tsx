import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { audioService } from '../services/audioService';

interface QuickSummaryModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onToggleSave: (id: string) => void;
}

export const QuickSummaryModal: React.FC<QuickSummaryModalProps> = ({
  article,
  onClose,
  onToggleSave,
}) => {
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!article) return null;

  const handleListen = () => {
    audioService.playClick('button');
    if (isPlayingAudio) {
      audioService.stop();
      setIsPlayingAudio(false);
    } else {
      const text =
        article.audioNarration ||
        `${article.title}. ${article.excerpt}. ${article.takeawayText}`;
      audioService.speak(text, 1.25, undefined, () => setIsPlayingAudio(false));
      setIsPlayingAudio(true);
    }
  };

  const handleRequestDeepDive = async () => {
    audioService.playClick('button');
    setIsDeepAnalyzing(true);
    try {
      const res = await fetch('/api/ai/article-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          excerpt: article.excerpt,
          source: article.sourceBadge,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeepAnalysis(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-gradient-to-b from-[#1d2025] to-[#101319] border border-white/15 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-[#e1e2ea] flex flex-col gap-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Rim Specular */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0b0e13] text-[#dbb8ff] font-mono text-[11px] border border-white/5">
              {article.sourceBadge}
            </span>
            <span className="font-mono text-[11px] text-[#00f2fe]">
              {article.matchScore}
            </span>
          </div>

          <button
            onClick={() => {
              audioService.playClick('button');
              audioService.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#272a30] text-[#b9cacb] hover:text-white flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Article Image Banner */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#0b0e13] border border-white/10 shadow-inner">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#272a30]/90 text-white font-mono text-[10px]">
              {article.overlayBadgeLeft}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#00f2fe] text-[#00373a] font-mono text-[10px] font-semibold">
              {article.overlayBadgeRight}
            </span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="flex flex-col gap-2">
          <h3 className="font-headline text-[1.25rem] font-semibold text-[#e1e2ea] leading-snug">
            {article.title}
          </h3>
          <p className="text-[0.875rem] text-[#b9cacb] leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Key Takeaway Callout */}
        <div className="p-3.5 rounded-xl bg-[#0b0e13]/85 border border-white/10 flex items-start gap-3 shadow-inner">
          <span
            className="material-symbols-outlined text-[20px] mt-0.5 shrink-0"
            style={{ color: article.takeawayColor }}
          >
            {article.takeawayIcon}
          </span>
          <div className="flex flex-col">
            <span
              className="font-mono text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: article.takeawayColor }}
            >
              {article.takeawayType}
            </span>
            <span className="text-[0.875rem] text-[#e1e2ea] mt-0.5">
              {article.takeawayText}
            </span>
          </div>
        </div>

        {/* Deep Dive AI Synthesis if requested */}
        {deepAnalysis && (
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#191c21]/90 border border-[#00f2fe]/30 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#00f2fe]">
              <span className="material-symbols-outlined text-[18px]">
                psychology
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                Gemini Synthesis Insights
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase text-[#b9cacb]">
                Core Findings
              </span>
              <ul className="list-disc list-inside text-[0.8125rem] text-[#e1e2ea] flex flex-col gap-1.5">
                {deepAnalysis.keyInsights?.map((insight: string, i: number) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>

            {deepAnalysis.whyItMatters && (
              <div className="pt-1 text-[0.8125rem]">
                <strong className="text-[#dbb8ff]">Strategic Implication:</strong>{' '}
                <span className="text-[#b9cacb]">{deepAnalysis.whyItMatters}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={handleListen}
            className={`flex-1 py-2.5 px-3 rounded-xl border font-mono text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isPlayingAudio
                ? 'bg-[#6807ba] text-white border-[#dbb8ff]'
                : 'bg-[#272a30] text-[#e1e2ea] border-white/10 hover:text-[#dbb8ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlayingAudio ? 'pause' : 'volume_up'}
            </span>
            <span>{isPlayingAudio ? 'Pause Narration' : 'Listen Briefing'}</span>
          </button>

          {!deepAnalysis && (
            <button
              onClick={handleRequestDeepDive}
              disabled={isDeepAnalyzing}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#6ff6ff] text-[#00373a] font-mono text-[11px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,242,254,0.3)] active:scale-95 disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isDeepAnalyzing ? 'animate-spin' : ''
                }`}
              >
                auto_awesome
              </span>
              <span>{isDeepAnalyzing ? 'Analyzing...' : 'Deep Dive (AI)'}</span>
            </button>
          )}

          <button
            onClick={() => onToggleSave(article.id)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all active:scale-90 ${
              article.saved
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40'
                : 'bg-[#272a30] text-[#b9cacb] border-white/10 hover:text-[#00f2fe]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={article.saved ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {article.saved ? 'bookmark_added' : 'bookmark_add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
