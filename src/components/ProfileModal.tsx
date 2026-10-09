import React from 'react';
import { audioService } from '../services/audioService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  totalTopicsCount: number;
  completedTasksCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  totalTopicsCount,
  completedTasksCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-gradient-to-b from-[#1d2025] to-[#101319] border border-white/15 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-[#e1e2ea] flex flex-col gap-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#e0fdff] flex items-center justify-center text-[#00373a] font-bold shadow-md">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline text-[1.125rem] font-semibold text-[#e1e2ea]">
                Learner Profile
              </h3>
              <span className="font-mono text-[10px] text-[#00f2fe]">
                Senior Research Mode
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playClick('button');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#272a30] text-[#b9cacb] hover:text-white flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Learning Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-[#0b0e13]/80 border border-white/5 text-center flex flex-col">
            <span className="font-headline text-[1.25rem] font-semibold text-[#00f2fe]">
              {streakDays}d
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb]">Streak</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0b0e13]/80 border border-white/5 text-center flex flex-col">
            <span className="font-headline text-[1.25rem] font-semibold text-[#dbb8ff]">
              {totalTopicsCount}
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb]">Topics</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0b0e13]/80 border border-white/5 text-center flex flex-col">
            <span className="font-headline text-[1.25rem] font-semibold text-[#ffb86f]">
              {completedTasksCount}
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb]">Tasks Done</span>
          </div>
        </div>

        {/* Knowledge Radar Calibration */}
        <div className="p-4 rounded-xl bg-[#191c21]/90 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#e1e2ea] font-medium">
              Radar Coverage Rank
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#00f2fe]/20 text-[#00f2fe]">
              Top 4% Global
            </span>
          </div>
          <p className="text-[0.8125rem] text-[#b9cacb] leading-relaxed">
            Your daily ingestion cadence places you ahead of 96% of AI researchers
            tracking arXiv and peer-reviewed journals.
          </p>
        </div>

        <button
          onClick={() => {
            audioService.playClick('button');
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-[#272a30] hover:bg-[#32353b] border border-white/10 font-mono text-[11px] text-[#e1e2ea] active:scale-95 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
