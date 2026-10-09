import React, { useState, useEffect } from 'react';
import { WeeklyData, WeeklyTrend } from '../types';
import { audioService } from '../services/audioService';

interface WeeklyTabProps {
  weeklyData: WeeklyData;
  onOpenTrendSummary: (trend: WeeklyTrend) => void;
  onOpenExportModal: () => void;
  onRegenerateWeekly: () => void;
  isRegenerating: boolean;
}

export const WeeklyTab: React.FC<WeeklyTabProps> = ({
  weeklyData,
  onOpenTrendSummary,
  onOpenExportModal,
  onRegenerateWeekly,
  isRegenerating,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioSec, setCurrentAudioSec] = useState(342); // 05:42
  const totalAudioSec = 858; // 14:18
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [sheenActive, setSheenActive] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setCurrentAudioSec((sec) => {
          if (sec >= totalAudioSec) {
            setIsPlayingAudio(false);
            return totalAudioSec;
          }
          return sec + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const toggleWeeklyAudio = () => {
    audioService.playClick('switch');
    if (isPlayingAudio) {
      audioService.stop();
      setIsPlayingAudio(false);
    } else {
      const narrationText = `Weekly intelligence review: ${weeklyData.headline}. ${weeklyData.abstract} The biggest shift this week is that ${weeklyData.biggestShift}. Efficiency gains reached ${weeklyData.efficiencyGain}.`;
      audioService.speak(narrationText, playbackSpeed, undefined, () => {
        setIsPlayingAudio(false);
      });
      setIsPlayingAudio(true);
    }
  };

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAudioScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentAudioSec(Math.round(ratio * totalAudioSec));
    audioService.playClick('dial');
  };

  const handleExportClick = () => {
    audioService.playClick('button');
    setSheenActive(true);
    setTimeout(() => setSheenActive(false), 900);
    onOpenExportModal();
  };

  return (
    <div className="flex flex-col w-full gap-6 select-none pb-8">
      {/* Live Vector Synced Badge & Timestamp */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d2025]/80 border border-white/10 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
          <span className="font-mono text-[10px] text-[#00f2fe] uppercase tracking-widest font-semibold">
            {weeklyData.issue}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#b9cacb] font-mono text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#00f2fe]">
            calendar_today
          </span>
          <span>{weeklyData.dateRange}</span>
        </div>
      </div>

      {/* Weekly AI Executive Synthesis Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#191c21]/90 to-[#101319]/95 border border-white/[0.12] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
        {/* Specular Rim Gradient & Ambient Backlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#00f2fe]/15 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#6807ba]/25 blur-[70px] pointer-events-none" />

        <div className="relative p-5 flex flex-col gap-4 z-10">
          {/* Card Eyebrow & Confidence Metric */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#272a30] border border-white/10 backdrop-blur-md flex items-center justify-center text-[#00f2fe] shadow-inner">
                <span className="material-symbols-outlined text-[17px]">
                  auto_awesome
                </span>
              </div>
              <span className="font-mono text-[11px] tracking-wider text-[#00f2fe] font-semibold">
                WEEKLY BIG PICTURE
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0b0e13]/80 border border-white/10 backdrop-blur-md">
              <span className="font-mono text-[10px] text-[#dbb8ff] font-medium">
                99% VERIFIED
              </span>
              <span
                className="material-symbols-outlined text-[#dbb8ff] text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* Title & Executive Abstract */}
          <div className="flex flex-col gap-2">
            <h2 className="font-headline text-[1.5rem] text-[#e1e2ea] font-semibold tracking-tight leading-snug">
              {weeklyData.headline}
            </h2>
            <p className="text-[0.9375rem] text-[#b9cacb] leading-relaxed">
              {weeklyData.abstract}
            </p>
          </div>

          {/* Synthesized Key Breakthrough Callout Matrix */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#272a30]/60 border border-white/5 backdrop-blur-lg flex items-start gap-3 shadow-inner">
              <div className="mt-0.5 p-1 rounded-md bg-[#00f2fe]/15 text-[#00f2fe] shrink-0">
                <span className="material-symbols-outlined text-[16px]">
                  neurology
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-[#00f2fe] font-semibold tracking-wide uppercase">
                  BIGGEST SHIFT
                </span>
                <span className="text-[0.875rem] text-[#e1e2ea] mt-0.5">
                  {weeklyData.biggestShift}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#272a30]/60 border border-white/5 backdrop-blur-lg flex items-start gap-3 shadow-inner">
              <div className="mt-0.5 p-1 rounded-md bg-[#6807ba]/30 text-[#dbb8ff] shrink-0">
                <span className="material-symbols-outlined text-[16px]">speed</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-[#dbb8ff] font-semibold tracking-wide uppercase">
                  EFFICIENCY GAIN
                </span>
                <span className="text-[0.875rem] text-[#e1e2ea] mt-0.5">
                  {weeklyData.efficiencyGain}
                </span>
              </div>
            </div>
          </div>

          {/* Delta Streamer Ribbon & Regenerate Trigger */}
          <div className="flex items-center justify-between pt-1 text-[#b9cacb] font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#ffb86f]">
                hub
              </span>
              <span>{weeklyData.articlesAnalyzed.toLocaleString()} Articles Analyzed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]" />
                <span>Knowledge Growth: {weeklyData.knowledgeGrowth}</span>
              </div>
              <button
                onClick={onRegenerateWeekly}
                disabled={isRegenerating}
                className="text-[#00f2fe] hover:underline flex items-center gap-1 active:scale-95 disabled:opacity-50"
                title="Regenerate with AI"
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    isRegenerating ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                <span>{isRegenerating ? 'Generating...' : 'Refresh AI'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Glassy Audio Mini-Player */}
      <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#191c21]/90 to-[#101319]/95 border border-white/[0.1] backdrop-blur-xl shadow-lg flex flex-col gap-3 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#00f2fe]/10 blur-[40px] pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={toggleWeeklyAudio}
              aria-label={isPlayingAudio ? 'Pause weekly summary' : 'Play weekly summary'}
              className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#e0fdff] text-[#00373a] flex items-center justify-center shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-transform active:scale-90"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-[#00f2fe] uppercase tracking-wider font-semibold">
                  WEEKLY AUDIO SUMMARY
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#272a30] text-[#b9cacb] font-mono text-[9px]">
                  14 MINS
                </span>
              </div>
              <span className="text-[0.9375rem] text-[#e1e2ea] font-medium truncate mt-0.5">
                This Week's Big Tech & AI Story
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playClick('button');
              const speeds = [1, 1.25, 1.5];
              const idx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[idx]);
            }}
            className="px-2 py-1 rounded-lg bg-[#272a30] border border-white/5 font-mono text-[11px] text-[#b9cacb] hover:text-[#00f2fe]"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Interactive Glass Scrubber */}
        <div className="flex flex-col gap-1.5 pt-1 relative z-10">
          <div
            onClick={handleAudioScrub}
            className="relative w-full h-2 rounded-full bg-[#32353b] cursor-pointer overflow-hidden backdrop-blur-sm shadow-inner"
          >
            <div
              style={{ width: `${(currentAudioSec / totalAudioSec) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#00f2fe] to-[#dbb8ff] shadow-[0_0_8px_rgba(0,242,254,0.6)] transition-all duration-150"
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#b9cacb]">
            <span>{formatAudioTime(currentAudioSec)}</span>
            <span>{formatAudioTime(totalAudioSec)}</span>
          </div>
        </div>
      </div>

      {/* Knowledge Retention & Matrix Grid (Stats with Sparklines) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#00f2fe]">
              analytics
            </span>
            <h3 className="font-headline text-[1.125rem] text-[#e1e2ea] font-semibold">
              Your Weekly Study Stats
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#b9cacb]">Synced just now</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Stat Tile 1: Topics Explored */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-md">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">
                Explored
              </span>
              <span className="font-headline text-[1.625rem] text-[#e1e2ea] font-semibold leading-tight">
                18
              </span>
              <span className="font-mono text-[10px] text-[#b9cacb] truncate">
                Topics Explored
              </span>
            </div>
            {/* Inline Glowing Sparkline SVG */}
            <div className="w-full h-8 pt-1">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 70 25">
                <defs>
                  <linearGradient id="cyanSpark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 20 Q 15 18, 25 10 T 50 12 T 70 3 L 70 25 L 0 25 Z"
                  fill="url(#cyanSpark)"
                />
                <path
                  d="M0 20 Q 15 18, 25 10 T 50 12 T 70 3"
                  stroke="#00f2fe"
                  strokeLinecap="round"
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 0 4px #00f2fe)' }}
                />
              </svg>
            </div>
          </div>

          {/* Stat Tile 2: Papers Ingested */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-md">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">Read</span>
              <span className="font-headline text-[1.625rem] text-[#00f2fe] font-semibold leading-tight">
                42
              </span>
              <span className="font-mono text-[10px] text-[#b9cacb] truncate">
                Papers & Articles
              </span>
            </div>
            <div className="w-full h-8 pt-1">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 70 25">
                <defs>
                  <linearGradient id="purpleSpark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#dbb8ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#dbb8ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 22 Q 20 8, 35 15 T 55 5 T 70 2 L 70 25 L 0 25 Z"
                  fill="url(#purpleSpark)"
                />
                <path
                  d="M0 22 Q 20 8, 35 15 T 55 5 T 70 2"
                  stroke="#dbb8ff"
                  strokeLinecap="round"
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 0 4px #dbb8ff)' }}
                />
              </svg>
            </div>
          </div>

          {/* Stat Tile 3: Synthesis Hours */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-md">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">
                Learning
              </span>
              <span className="font-headline text-[1.625rem] text-[#ffb86f] font-semibold leading-tight">
                6.4<span className="text-[12px] font-normal text-[#b9cacb]">h</span>
              </span>
              <span className="font-mono text-[10px] text-[#b9cacb] truncate">
                Hours Spent
              </span>
            </div>
            <div className="w-full h-8 pt-1">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 70 25">
                <defs>
                  <linearGradient id="amberSpark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffb86f" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffb86f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 18 Q 15 22, 30 14 T 50 8 T 70 4 L 70 25 L 0 25 Z"
                  fill="url(#amberSpark)"
                />
                <path
                  d="M0 18 Q 15 22, 30 14 T 50 8 T 70 4"
                  stroke="#ffb86f"
                  strokeLinecap="round"
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 0 4px #ffb86f)' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Key Theme Clusters Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#dbb8ff]">
              bubble_chart
            </span>
            <h3 className="font-headline text-[1.125rem] text-[#e1e2ea] font-semibold">
              Key Highlights This Week
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#00f2fe] font-medium">
            {weeklyData.trends.length} Major Trends
          </span>
        </div>

        {/* Cluster Cards */}
        {weeklyData.trends.map((trend, idx) => {
          const isSecond = idx === 1;
          return (
            <div
              key={trend.id || idx}
              onClick={() => onOpenTrendSummary(trend)}
              className="relative rounded-2xl p-4 bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.08] backdrop-blur-xl shadow-md flex flex-col gap-2.5 overflow-hidden group hover:border-[#00f2fe]/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold flex items-center gap-1 border ${
                        isSecond
                          ? 'bg-[#6807ba]/30 text-[#dbb8ff] border-[#dbb8ff]/20'
                          : 'bg-[#00f2fe]/15 text-[#00f2fe] border-[#00f2fe]/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSecond ? 'bg-[#dbb8ff]' : 'bg-[#00f2fe]'
                        }`}
                      />
                      {trend.tag}
                    </span>
                    <span className="font-mono text-[11px] text-[#b9cacb]">
                      {trend.sourcesCount} Sources
                    </span>
                  </div>
                  <h4 className="font-headline text-[1.0625rem] text-[#e1e2ea] font-semibold pt-0.5">
                    {trend.title}
                  </h4>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#272a30] border border-white/10 flex items-center justify-center text-[#e0fdff] shrink-0 shadow-inner group-hover:text-[#00f2fe] group-hover:border-[#00f2fe]/40 transition-colors">
                  <span className="material-symbols-outlined text-[19px]">
                    arrow_outward
                  </span>
                </div>
              </div>

              <p className="text-[0.875rem] text-[#b9cacb] leading-relaxed">
                {trend.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {trend.badges.map((b, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded bg-[#272a30] border border-white/5 text-[#b9cacb] font-mono text-[10px]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <span
                  className={`font-mono text-[11px] font-medium tracking-wide flex items-center gap-1 ${
                    isSecond ? 'text-[#dbb8ff]' : 'text-[#00f2fe]'
                  }`}
                >
                  <span>Read Full Summary</span>
                  <span className="material-symbols-outlined text-[12px]">
                    chevron_right
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Deep Dive / Photo Anchor */}
      <div className="relative rounded-2xl overflow-hidden bg-[#101319] border border-white/10 shadow-xl">
        <div
          className="bg-cover bg-center w-full h-40"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB49fEUdungr7-6I2tQWffI1Jxu5s0GEebmiDgVaM0J1E8sJio10r59bSqY7CoH6eC03_bZ6oahcUP0MV5qmsMrpYdS3YFR9-F8uHQ6pKSmvvJb7tF07FXGxpVrd_HalzRyEAymKtkpGIGYn3zkpP5sQd7sM5pi0SUHRnExwgmKbsr6SOrie6DZfHGbMmTAg3JdDYSkRWLie77vSjT0ZUdBJL7wsl68hmMbv0SwABtRnssG-Nuv77K4')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13] via-[#0b0e13]/60 to-transparent p-4 flex flex-col justify-end">
          <span className="font-mono text-[10px] text-[#00f2fe] uppercase tracking-widest font-semibold">
            FEATURED DEEP DIVE
          </span>
          <h5 className="font-headline text-[1.125rem] text-[#e1e2ea] font-semibold mt-0.5">
            Next-Gen Optical & Light-Based Computing
          </h5>
        </div>
      </div>

      {/* Interactive Export Action Button */}
      <div className="pt-1 pb-4 flex flex-col gap-2 items-center">
        <button
          onClick={handleExportClick}
          className="w-full relative overflow-hidden py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00f2fe] via-[#6ff6ff] to-[#00f2fe] text-[#00373a] font-mono text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(0,242,254,0.45)] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">ios_share</span>
          <span>DOWNLOAD WEEKLY SUMMARY REPORT</span>
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none transition-transform duration-1000 ${
              sheenActive ? 'translate-x-full' : '-translate-x-full'
            }`}
          />
        </button>

        <div className="flex items-center gap-1.5 text-[#b9cacb] font-mono text-[11px] pt-1">
          <span className="material-symbols-outlined text-[13px] text-[#00f2fe]">
            lock
          </span>
          <span>Saved as PDF & Markdown for easy sharing</span>
        </div>
      </div>
    </div>
  );
};
