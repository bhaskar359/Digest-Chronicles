import React from 'react';
import { WeeklyTrend } from '../types';
import { audioService } from '../services/audioService';

interface TrendModalProps {
  trend: WeeklyTrend | null;
  onClose: () => void;
}

export const TrendModal: React.FC<TrendModalProps> = ({ trend, onClose }) => {
  if (!trend) return null;

  const handleListen = () => {
    audioService.playClick('button');
    audioService.speak(
      `${trend.title}. ${trend.description} In detail: ${trend.fullSummary}`,
      1.2
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-gradient-to-b from-[#1d2025] to-[#101319] border border-white/15 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-[#e1e2ea] flex flex-col gap-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] font-mono text-[10px] font-semibold border border-[#00f2fe]/20">
              {trend.tag}
            </span>
            <span className="font-mono text-[11px] text-[#b9cacb]">
              {trend.sourcesCount} Integrated Sources
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

        <div className="flex flex-col gap-1.5">
          <h3 className="font-headline text-[1.25rem] font-semibold text-[#e1e2ea]">
            {trend.title}
          </h3>
          <p className="text-[0.875rem] text-[#b9cacb] leading-relaxed">
            {trend.description}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0e13]/85 border border-white/10 shadow-inner flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#dbb8ff]">
            <span className="material-symbols-outlined text-[18px]">
              analytics
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              Deep Analytical Synthesis
            </span>
          </div>
          <p className="text-[0.875rem] text-[#e1e2ea] leading-relaxed">
            {trend.fullSummary}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="font-mono text-[10px] text-[#849495] uppercase">
            Validated Citations:
          </span>
          {trend.badges.map((b, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-md bg-[#272a30] border border-white/10 text-[#6ff6ff] font-mono text-[10px]"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={handleListen}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#272a30] hover:bg-[#32353b] border border-white/10 text-[#e1e2ea] font-mono text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">volume_up</span>
            <span>Listen Audio Brief</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick('button');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#6ff6ff] text-[#00373a] font-mono text-[11px] font-semibold active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
