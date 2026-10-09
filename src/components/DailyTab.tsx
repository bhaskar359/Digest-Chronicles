import React, { useState, useEffect } from 'react';
import { NewsArticle, TrackedTopic } from '../types';
import { audioService } from '../services/audioService';

interface DailyTabProps {
  articles: NewsArticle[];
  topics: TrackedTopic[];
  onOpenQuickSummary: (article: NewsArticle) => void;
  onToggleSave: (id: string) => void;
  onNavigateToTopics: () => void;
  onFetchLiveUpdates?: (topicName?: string) => Promise<void>;
  isFetchingLive?: boolean;
}

export const DailyTab: React.FC<DailyTabProps> = ({
  articles,
  topics,
  onOpenQuickSummary,
  onToggleSave,
  onNavigateToTopics,
  onFetchLiveUpdates,
  isFetchingLive = false,
}) => {
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [currentTimeSec, setCurrentTimeSec] = useState(106); // 01:46
  const totalDurationSec = 222; // 03:42
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);
  const [studioVoice, setStudioVoice] = useState<'Studio' | 'Nova' | 'Zephyr'>('Studio');
  const [currentlyListeningArticleId, setCurrentlyListeningArticleId] = useState<string | null>(null);
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  // Waveform heights
  const [waveHeights, setWaveHeights] = useState<number[]>([
    30, 65, 90, 50, 75, 100, 40, 85, 60, 80, 25, 45, 70, 35, 55, 20, 40, 60, 30, 15,
  ]);

  // Waveform animation loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 80) + 20)
        );
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, 300);
    } else {
      setWaveHeights([
        30, 65, 90, 50, 75, 100, 40, 85, 60, 80, 25, 45, 70, 35, 55, 20, 40, 60, 30, 15,
      ]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleMainPlay = () => {
    audioService.playClick('switch');
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
    } else {
      const summaryText =
        "Welcome to today's morning AI intelligence briefing. Major breakthroughs this morning in LLM test-time search trees and superconducting neuromorphic circuits demonstrate significant leaps in compute density and verification reliability.";
      audioService.speak(summaryText, playbackSpeed, undefined, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
      setCurrentlyListeningArticleId(null);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTimeSec(Math.round(clickRatio * totalDurationSec));
    audioService.playClick('dial');
  };

  const cycleSpeed = () => {
    audioService.playClick('button');
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const toggleStudioVoice = () => {
    audioService.playClick('button');
    const voices: ('Studio' | 'Nova' | 'Zephyr')[] = ['Studio', 'Nova', 'Zephyr'];
    const nextIdx = (voices.indexOf(studioVoice) + 1) % voices.length;
    setStudioVoice(voices[nextIdx]);
  };

  const handleListenArticle = (article: NewsArticle) => {
    audioService.playClick('button');
    if (currentlyListeningArticleId === article.id) {
      audioService.stop();
      setCurrentlyListeningArticleId(null);
    } else {
      setCurrentlyListeningArticleId(article.id);
      setIsPlaying(false);
      const textToRead =
        article.audioNarration ||
        `${article.title}. ${article.excerpt} ${article.takeawayType}: ${article.takeawayText}`;
      audioService.speak(textToRead, playbackSpeed, undefined, () => {
        setCurrentlyListeningArticleId(null);
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const remainingSeconds = Math.max(0, totalDurationSec - currentTimeSec);

  // Filter articles based on chip
  const filteredArticles = selectedTopicFilter
    ? articles.filter((a) =>
        a.topicTag.toLowerCase().includes(selectedTopicFilter.toLowerCase()) ||
        a.title.toLowerCase().includes(selectedTopicFilter.toLowerCase())
      )
    : articles;

  const activeTopicsCount = topics.filter((t) => t.active).length;

  return (
    <div className="flex flex-col w-full gap-6 select-none pb-8">
      {/* Live Vector Intelligence Ambient Streamer */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#191c21]/80 backdrop-blur-md p-3.5 border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/10 via-[#6807ba]/15 to-[#00f2fe]/10 opacity-70 animate-pulse pointer-events-none" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
            </span>
            <span className="font-mono text-[11px] text-[#e0fdff] uppercase tracking-wider font-semibold truncate">
              LIVE UPDATES
            </span>
            <button
              onClick={() => setShowSourceInfo(!showSourceInfo)}
              className="text-[#849495] hover:text-[#00f2fe] transition-colors text-[14px] material-symbols-outlined ml-0.5"
              title="View Ingestion Pipeline & Sources"
            >
              info
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onFetchLiveUpdates && (
              <button
                onClick={() => {
                  audioService.playClick('button');
                  onFetchLiveUpdates(selectedTopicFilter || undefined);
                }}
                disabled={isFetchingLive}
                className="px-2.5 py-1 rounded-lg bg-[#272a30] hover:bg-[#32353b] border border-[#00f2fe]/30 text-[#00f2fe] font-mono text-[10px] font-medium flex items-center gap-1 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[13px] ${isFetchingLive ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isFetchingLive ? 'Ingesting...' : 'Fetch Live'}</span>
              </button>
            )}
            <div className="flex items-center gap-1 text-[#b9cacb]">
              <span className="font-mono text-[11px] truncate">
                18k updates
              </span>
              <span className="material-symbols-outlined text-[15px] text-[#00f2fe]">
                auto_awesome
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Info Banner (Toggleable) */}
        {showSourceInfo && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5 text-[0.8125rem] text-[#b9cacb]">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#00f2fe] uppercase tracking-wider">
              <span>Where Data Is Fetched:</span>
              <span className="text-white">Continuous Live Ingestion</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-mono text-[#e1e2ea]">
              <li><strong>arXiv Open API</strong> (export.arxiv.org): Peer-reviewed STEM and AI preprints</li>
              <li><strong>Tech Wire & Hacker News API</strong>: Live engineering discussions and releases</li>
              <li><strong>Google Search Grounding with Gemini 3.8 Flash</strong>: Verified web news synthesis</li>
            </ul>
          </div>
        )}
      </div>

      {/* Hero Module: AI Audio Briefing Player */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#1d2025]/85 to-[#16191f]/95 backdrop-blur-2xl p-5 border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden">
        {/* Ambient back-glow inside card */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#00f2fe]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#6807ba]/25 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 z-10">
          {/* Player Metadata Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#32353b]/90 backdrop-blur-md font-mono text-[11px] text-[#00f2fe] flex items-center gap-1.5 shadow-sm border border-[#00f2fe]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_6px_#00f2fe]" />
                  DAILY AUDIO BRIEF
                </span>
                <span className="font-mono text-[11px] text-[#b9cacb]">07:30 UTC</span>
              </div>
              <h2 className="font-headline text-[1.25rem] text-[#e1e2ea] font-medium mt-1 truncate">
                Today's AI Morning Summary
              </h2>
              <p className="text-[0.8125rem] text-[#b9cacb]">
                AI Voice Brief • 3 min 42 sec
              </p>
            </div>
            <button
              onClick={() => {
                audioService.playClick('dial');
                setWaveHeights((prev) => prev.map(() => Math.floor(Math.random() * 85) + 15));
              }}
              aria-label="Audio graphic equalizer"
              className="w-10 h-10 rounded-full bg-[#32353b]/60 border border-white/10 flex items-center justify-center text-[#b9cacb] hover:text-[#00f2fe] transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </button>
          </div>

          {/* Waveform Simulation with Segmented Optical Bars */}
          <div className="flex items-end justify-between h-12 px-3 py-1 bg-[#0b0e13]/70 backdrop-blur-md rounded-xl border border-white/[0.05] gap-[3px] overflow-hidden shadow-inner">
            {waveHeights.map((h, idx) => {
              const isPurple = idx === 4 || idx === 7;
              const isAccent = idx < 10;
              return (
                <div
                  key={idx}
                  style={{ height: `${h}%` }}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isPurple
                      ? 'bg-[#dbb8ff] shadow-[0_0_8px_#dbb8ff]'
                      : isAccent
                      ? 'bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]'
                      : 'bg-[#32353b]'
                  }`}
                />
              );
            })}
          </div>

          {/* Scrubber & Interactive Controls */}
          <div className="flex flex-col gap-1.5">
            <div
              onClick={handleSeek}
              className="relative w-full h-2 bg-[#32353b]/90 rounded-full overflow-hidden cursor-pointer shadow-inner border border-white/5"
            >
              <div
                style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#00f2fe] via-[#6ff6ff] to-[#dbb8ff] rounded-full shadow-[0_0_10px_#00f2fe] transition-all duration-150"
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#b9cacb]">
              <span>{formatTime(currentTimeSec)}</span>
              <span className="text-[#00f2fe] truncate px-2 font-medium">
                Key Topic: Quantum Computing • Part 2
              </span>
              <span>-{formatTime(remainingSeconds)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={cycleSpeed}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#272a30]/80 border border-white/10 text-[#e1e2ea] hover:text-[#00f2fe] transition-colors text-[11px] font-mono shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span>{playbackSpeed}x</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  audioService.playClick('button');
                  setCurrentTimeSec((t) => Math.max(0, t - 15));
                }}
                aria-label="Rewind 15 seconds"
                className="text-[#b9cacb] hover:text-[#00f2fe] transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">replay_10</span>
              </button>

              {/* Big Center Tactile Play Button */}
              <button
                onClick={toggleMainPlay}
                aria-label={isPlaying ? 'Pause AI briefing' : 'Play AI briefing'}
                className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#e0fdff] flex items-center justify-center text-[#00373a] shadow-[0_4px_24px_rgba(0,242,254,0.45),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_4px_32px_rgba(0,242,254,0.7)] transition-all active:scale-95"
              >
                <span
                  className="material-symbols-outlined text-[32px] font-bold"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {
                  audioService.playClick('button');
                  setCurrentTimeSec((t) => Math.min(totalDurationSec, t + 15));
                }}
                aria-label="Forward 15 seconds"
                className="text-[#b9cacb] hover:text-[#00f2fe] transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">forward_10</span>
              </button>
            </div>

            <button
              onClick={toggleStudioVoice}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#272a30]/80 border border-white/10 text-[#e1e2ea] hover:text-[#00f2fe] transition-colors text-[11px] font-mono shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                record_voice_over
              </span>
              <span>{studioVoice}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Radar Topics Carousel / Filter Glass Strip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#00f2fe]">
              radar
            </span>
            <span className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Topics You Follow
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#b9cacb]">
            {activeTopicsCount} Active
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
          <button
            onClick={() => {
              audioService.playClick('button');
              setSelectedTopicFilter(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] shrink-0 active:scale-95 transition-all border ${
              selectedTopicFilter === null
                ? 'bg-[#272a30] text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                : 'bg-[#191c21]/80 text-[#b9cacb] border-white/10 hover:text-[#e1e2ea]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] shadow-[0_0_6px_#00f2fe]" />
            <span>All Updates</span>
          </button>

          {topics.map((t) => {
            const isSelected = selectedTopicFilter === t.name;
            return (
              <button
                key={t.id}
                onClick={() => {
                  audioService.playClick('button');
                  setSelectedTopicFilter(isSelected ? null : t.name);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] shrink-0 active:scale-95 transition-all border ${
                  isSelected
                    ? 'bg-[#272a30] text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : 'bg-[#191c21]/80 text-[#b9cacb] border-white/10 hover:text-[#e1e2ea]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: t.accentColor || '#00f2fe',
                    boxShadow: `0 0 6px ${t.accentColor || '#00f2fe'}`,
                  }}
                />
                <span>{t.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              audioService.playClick('button');
              onNavigateToTopics();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#32353b]/40 border border-dashed border-[#00f2fe]/40 text-[#00f2fe] font-mono text-[11px] shrink-0 active:scale-95 hover:bg-[#00f2fe]/10 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>+ Topic</span>
          </button>
        </div>
      </div>

      {/* Curated Daily News & Findings Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#dbb8ff]">
              insights
            </span>
            <h3 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Today's Top Reads & News
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#b9cacb]">
            Updated 12 mins ago
          </span>
        </div>

        {/* Feed Cards */}
        {filteredArticles.map((article) => {
          const isListening = currentlyListeningArticleId === article.id;
          return (
            <article
              key={article.id}
              className="relative w-full rounded-2xl bg-gradient-to-b from-[#1d2025]/75 to-[#16191f]/85 backdrop-blur-2xl p-4 border border-white/[0.09] shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col gap-3 transition-all hover:border-white/20"
            >
              {/* Backlight flare */}
              <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-[#6807ba]/15 blur-2xl pointer-events-none" />

              {/* Top Row Badges & Timestamp */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0b0e13]/85 text-[#dbb8ff] font-mono text-[11px] flex items-center gap-1 border border-white/5 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">school</span>
                    {article.sourceBadge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#272a30]/80 text-[#6ff6ff] font-mono text-[11px] border border-white/5">
                    {article.matchScore}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#b9cacb]">
                  {article.timeAgo}
                </span>
              </div>

              {/* Image Module with specular inner border */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#0b0e13] shadow-inner border border-white/10 group">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-[#272a30]/90 backdrop-blur-md text-[#e1e2ea] font-mono text-[10px] border border-white/10">
                    {article.overlayBadgeLeft}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[#00373a] font-mono text-[10px] font-semibold shadow-md"
                    style={{
                      backgroundColor: article.overlayRightColor || '#00f2fe',
                      boxShadow: `0 0 10px ${article.overlayRightColor || '#00f2fe'}`,
                    }}
                  >
                    {article.overlayBadgeRight}
                  </span>
                </div>
              </div>

              {/* Card Core Content */}
              <div className="flex flex-col gap-1">
                <h4 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium leading-snug">
                  {article.title}
                </h4>
                <p className="text-[0.875rem] text-[#b9cacb] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* AI Key Takeaway Pill */}
              <div className="rounded-xl bg-[#0b0e13]/80 backdrop-blur-md p-3 flex items-start gap-2.5 border border-white/[0.06] shadow-inner">
                <span
                  className="material-symbols-outlined text-[18px] mt-0.5 shrink-0"
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

              {/* Action Strip */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenQuickSummary(article)}
                    className="px-3 py-1.5 rounded-lg bg-[#272a30]/90 hover:bg-[#32353b] border border-white/10 text-[#e1e2ea] hover:text-[#00f2fe] font-mono text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      summarize
                    </span>
                    <span>Quick Summary</span>
                  </button>

                  <button
                    onClick={() => handleListenArticle(article)}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                      isListening
                        ? 'bg-[#6807ba] text-white border-[#dbb8ff] shadow-[0_0_12px_#dbb8ff]'
                        : 'bg-[#272a30]/90 hover:bg-[#32353b] border-white/10 text-[#e1e2ea] hover:text-[#dbb8ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isListening ? 'volume_up' : 'headphones'}
                    </span>
                    <span>{isListening ? 'Playing...' : 'Listen (1 min)'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {article.externalUrl && (
                    <a
                      href={article.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg border bg-[#272a30]/60 border-white/10 text-[#b9cacb] hover:text-[#00f2fe] hover:border-[#00f2fe]/40 flex items-center justify-center transition-all active:scale-90 shadow-sm"
                      title="Open Original Source / Paper"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        open_in_new
                      </span>
                    </a>
                  )}

                  <button
                    onClick={() => onToggleSave(article.id)}
                    aria-label="Save to knowledge graph"
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all active:scale-90 shadow-sm ${
                      article.saved
                        ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_8px_rgba(0,242,254,0.4)]'
                        : 'bg-[#272a30]/60 border-white/10 text-[#b9cacb] hover:text-[#00f2fe]'
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
            </article>
          );
        })}
      </div>

      {/* End-of-Stream Ambient State & Add Topic Pill */}
      <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-[#32353b]/80 border border-white/10 backdrop-blur-xl flex items-center justify-center text-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.25)]">
          <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
            All Topics Up to Date
          </p>
          <p className="text-[0.8125rem] text-[#b9cacb] max-w-[280px]">
            You have checked all top research and news for today. Great job!
          </p>
        </div>

        {/* Quick Add Radar Topic Button */}
        <button
          onClick={() => {
            audioService.playClick('button');
            onNavigateToTopics();
          }}
          className="mt-2 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#272a30] via-[#32353b] to-[#272a30] border border-white/15 text-[#e0fdff] font-headline text-[0.875rem] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_16px_rgba(0,242,254,0.18)] hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
            add_circle
          </span>
          <span className="tracking-wide">+ Add New Topic</span>
        </button>
      </div>
    </div>
  );
};
