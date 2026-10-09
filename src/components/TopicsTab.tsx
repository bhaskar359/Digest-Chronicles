import React, { useState } from 'react';
import { TrackedTopic, NewsArticle } from '../types';
import { audioService } from '../services/audioService';
import { TRENDING_TOPICS } from '../data/initialData';

interface TopicsTabProps {
  topics: TrackedTopic[];
  onAddTopic: (newTopic: Partial<TrackedTopic>) => void;
  onToggleTopicActive: (id: string) => void;
  onToggleDetailLevel: (id: string, level: 'Deep Dive' | 'Quick Summary') => void;
  onDeleteTopic: (id: string) => void;
  onPauseAll: () => void;
  allPaused: boolean;
  onAddNewArticleFromTopic?: (article: NewsArticle) => void;
}

export const TopicsTab: React.FC<TopicsTabProps> = ({
  topics,
  onAddTopic,
  onToggleTopicActive,
  onToggleDetailLevel,
  onDeleteTopic,
  onPauseAll,
  allPaused,
  onAddNewArticleFromTopic,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState<number>(1);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>({
    'Research Papers': true,
    'Tech News': false,
    'Code Repos': false,
    'Market Trends': false,
  });

  const [followedTrendingIds, setFollowedTrendingIds] = useState<string[]>([]);

  const frequencyLabels: Record<number, string> = {
    1: 'How Often to Update: Every 5 minutes',
    2: 'How Often to Update: Hourly',
    3: 'How Often to Update: Daily Brief',
    4: 'How Often to Update: Weekly Digest',
  };

  const toggleSourceType = (src: string) => {
    audioService.playClick('button');
    setActiveSources((prev) => ({
      ...prev,
      [src]: !prev[src],
    }));
  };

  const handleAddTopicSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim() || isSubmitting) return;

    audioService.playClick('button');
    setIsSubmitting(true);

    const name = topicInput.trim();
    const selectedTypes = Object.entries(activeSources)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    const freqMap: Record<number, string> = {
      1: 'Continuous',
      2: 'Hourly',
      3: 'Daily Brief',
      4: 'Weekly Digest',
    };

    const newTopic: Partial<TrackedTopic> = {
      id: `topic-${Date.now()}`,
      name,
      description: `Active intelligence monitoring on ${name} across selected sources.`,
      tags: [`#${name.replace(/\s+/g, '')}`, '#ActiveRadar'],
      sourceCount: selectedTypes.length * 4 + 4,
      active: true,
      detailLevel: 'Deep Dive',
      statusText: 'All sources synced • Just now',
      lastUpdated: 'Just now',
      sourceTypes: selectedTypes.length > 0 ? selectedTypes : ['Research Papers'],
      frequency: freqMap[frequencyValue] || 'Continuous',
      accentColor: '#00f2fe',
    };

    onAddTopic(newTopic);

    // Call server API to synthesize initial brief
    try {
      const res = await fetch('/api/ai/topic-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: name,
          sourceTypes: newTopic.sourceTypes,
          frequency: newTopic.frequency,
          detailLevel: newTopic.detailLevel,
        }),
      });
      if (res.ok && onAddNewArticleFromTopic) {
        const data = await res.json();
        const article: NewsArticle = {
          id: `art-${Date.now()}`,
          sourceBadge: 'Radar Discovery',
          matchScore: data.confidence || '98.5% Match',
          timeAgo: 'Just now',
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCrpkmkylHdzJTmlZfM2-jl7TSa4fGuvanR-N4CHSzHOPtWbvm0FMCylLbVhpC3Ew1wBzDIG53QWMcieArQJqpLhSMQs953YBsSHZvbIoHW3UEsbFA0rs1DXMFcC_YBDv1wNA4Bgd0Z96nCootX8-yxRCSEPrqgwMzdKjKYfKD6mEq5_x-PAm05ZJX9lAHSFmGUu5VNOyMdA0rMpj506joX39JvrniDU0vOZYhP6B_vDya0dOta6LRd',
          overlayBadgeLeft: name,
          overlayBadgeRight: 'New Ingest',
          overlayRightColor: '#00f2fe',
          title: data.title || `Frontiers in ${name}`,
          excerpt: data.summary || `Autonomous scanning of ${name} repositories and peer reviews.`,
          takeawayType: 'Key Takeaway',
          takeawayText: data.keyTakeaway || 'Rapid algorithmic convergence observed across primary benchmarks.',
          takeawayIcon: 'bolt',
          takeawayColor: '#00f2fe',
          topicTag: name,
          saved: false,
          audioDuration: '1 min 10 sec',
          audioNarration: data.summary || `Latest intelligence brief for ${name}.`,
        };
        onAddNewArticleFromTopic(article);
      }
    } catch {
      // Handled gracefully
    }

    setTopicInput('');
    setIsSubmitting(false);
  };

  const handleFollowTrending = (trend: (typeof TRENDING_TOPICS)[0]) => {
    audioService.playClick('button');
    if (followedTrendingIds.includes(trend.id)) return;

    setFollowedTrendingIds((prev) => [...prev, trend.id]);

    const newTopic: Partial<TrackedTopic> = {
      id: `topic-trend-${Date.now()}`,
      name: trend.title,
      description: trend.description,
      tags: [trend.tag, `#${trend.source.replace(/\./g, '')}`],
      sourceCount: parseInt(trend.rate) || 12,
      active: true,
      detailLevel: 'Deep Dive',
      statusText: `Streaming from ${trend.source} • Synced now`,
      lastUpdated: '1m ago',
      sourceTypes: ['Research Papers', 'Tech News'],
      frequency: 'Continuous',
      accentColor: trend.rateColor || '#00f2fe',
    };

    onAddTopic(newTopic);
  };

  const activeCount = topics.filter((t) => t.active).length;

  return (
    <div className="flex flex-col w-full gap-6 select-none pb-8">
      {/* Top Metric Lens Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#191c21]/90 to-[#101319]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.2)]">
        {/* Optical Highlight Sheen */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00f2fe]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="p-5 flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#b9cacb]">
                TOPIC TRACKER OVERVIEW
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d2025]/80 border border-white/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-[#00f2fe] text-[14px]">
                sensors
              </span>
              <span className="font-mono text-[11px] text-[#00f2fe]">LIVE RADAR</span>
            </div>
          </div>

          {/* Dials & KPI Triad */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {/* Metric 1: Active Topics */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#1d2025]/50 border border-white/[0.06] backdrop-blur-md relative overflow-hidden shadow-inner">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#32353b]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                  />
                  <path
                    className="text-[#00f2fe]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="80, 100"
                    strokeLinecap="round"
                    strokeWidth="3.2"
                    style={{ filter: 'drop-shadow(0 0 5px #00f2fe)' }}
                  />
                </svg>
                <span className="absolute font-headline text-[1.25rem] text-[#e1e2ea] font-semibold">
                  {activeCount}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#b9cacb]">Active Topics</span>
              <span className="font-mono text-[10px] text-[#00f2fe] mt-0.5">
                +{topics.length - activeCount} queued
              </span>
            </div>

            {/* Metric 2: Daily Articles */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#1d2025]/50 border border-white/[0.06] backdrop-blur-md relative overflow-hidden shadow-inner">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#32353b]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                  />
                  <path
                    className="text-[#dbb8ff]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="64, 100"
                    strokeLinecap="round"
                    strokeWidth="3.2"
                    style={{ filter: 'drop-shadow(0 0 5px #dbb8ff)' }}
                  />
                </svg>
                <span className="absolute font-headline text-[1.125rem] text-[#e1e2ea] font-semibold">
                  14.2k
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#b9cacb]">Daily Articles</span>
              <span className="font-mono text-[10px] text-[#dbb8ff] mt-0.5">
                +18% today
              </span>
            </div>

            {/* Metric 3: Summary Accuracy */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#1d2025]/50 border border-white/[0.06] backdrop-blur-md relative overflow-hidden shadow-inner">
              <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#32353b]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                  />
                  <path
                    className="text-[#6ff6ff]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="98, 100"
                    strokeLinecap="round"
                    strokeWidth="3.2"
                    style={{ filter: 'drop-shadow(0 0 5px #00dce6)' }}
                  />
                </svg>
                <span className="absolute font-headline text-[1.25rem] text-[#e1e2ea] font-semibold">
                  98<span className="text-[10px]">%</span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#b9cacb]">Accuracy</span>
              <span className="font-mono text-[10px] text-[#6ff6ff] mt-0.5">
                High Fidelity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Focus Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 backdrop-blur-2xl border border-white/[0.1] shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] p-5 flex flex-col gap-4">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
              add_circle
            </span>
            <h2 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Add New Topic to Follow
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#b9cacb] px-2.5 py-0.5 rounded-full bg-[#32353b]/60 border border-white/5">
            Slot {topics.length + 1} of 15
          </span>
        </div>

        {/* Frosted Input with Ambient Glow on Focus */}
        <form onSubmit={handleAddTopicSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f2fe]/30 via-[#6807ba]/30 to-[#00f2fe]/30 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center bg-[#0b0e13]/90 backdrop-blur-xl border border-white/10 rounded-xl px-3.5 py-2.5 shadow-inner">
            <span className="material-symbols-outlined text-[#b9cacb] mr-2 text-[20px] group-focus-within:text-[#00f2fe] transition-colors">
              manage_search
            </span>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Electric Vehicles, Liquid AI, or Fusion Tech"
              className="w-full bg-transparent text-[0.9375rem] text-[#e1e2ea] placeholder-[#849495] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !topicInput.trim()}
              className="ml-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#00f2fe] to-[#6ff6ff] text-[#00373a] font-mono text-[11px] font-semibold flex items-center gap-1 shadow-[0_0_12px_rgba(0,242,254,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <span>{isSubmitting ? 'Scanning...' : 'Add Topic'}</span>
              <span className="material-symbols-outlined text-[14px]">bolt</span>
            </button>
          </div>
        </form>

        {/* Category Chips */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#b9cacb]">
            Source Types
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(activeSources).map((src) => {
              const active = activeSources[src];
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => toggleSourceType(src)}
                  className={`px-3 py-1.5 rounded-full font-mono text-[11px] flex items-center gap-1.5 transition-all active:scale-95 border ${
                    active
                      ? 'bg-[#272a30] text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : 'bg-[#191c21]/70 text-[#b9cacb] border-white/5 hover:text-[#e1e2ea]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      active
                        ? 'bg-[#00f2fe] shadow-[0_0_6px_#00f2fe]'
                        : 'bg-[#849495]'
                    }`}
                  />
                  <span>{src}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingestion Pulse / Frequency Slider */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b9cacb]">
              How Often to Update
            </span>
            <span className="font-mono text-[11px] text-[#00f2fe]">
              {frequencyLabels[frequencyValue]}
            </span>
          </div>
          <div className="relative flex items-center py-1">
            <input
              type="range"
              min="1"
              max="4"
              value={frequencyValue}
              onChange={(e) => {
                audioService.playClick('dial');
                setFrequencyValue(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-[#32353b] rounded-lg appearance-none cursor-pointer accent-[#00f2fe]"
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#849495]">
            <span>Continuous</span>
            <span>Hourly</span>
            <span>Daily Brief</span>
            <span>Weekly Digest</span>
          </div>
        </div>
      </div>

      {/* AI Suggested Trending Radars (Horizontal Carousel) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#dbb8ff] text-[18px]">
              auto_awesome
            </span>
            <h3 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Trending Topics Today
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#dbb8ff]">Updated Live</span>
        </div>

        {/* Carousel Track */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
          {TRENDING_TOPICS.map((trend) => {
            const isFollowed = followedTrendingIds.includes(trend.id);
            return (
              <div
                key={trend.id}
                className="min-w-[240px] max-w-[240px] p-4 rounded-2xl bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden shrink-0"
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#6807ba]/30 text-[#d0a6ff] font-mono text-[10px]">
                      {trend.trendingMatch}
                    </span>
                    <span className="font-mono text-[10px] text-[#849495]">
                      {trend.source}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline text-[0.9375rem] leading-snug text-[#e1e2ea] font-medium">
                      {trend.title}
                    </h4>
                    <p className="text-[0.8125rem] text-[#b9cacb] mt-1 line-clamp-2">
                      {trend.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between mt-1">
                  <span className="font-mono text-[10px] text-[#b9cacb] flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: trend.rateColor }}
                    />
                    {trend.rate}
                  </span>
                  <button
                    onClick={() => handleFollowTrending(trend)}
                    className={`px-3 py-1 rounded-full font-mono text-[11px] flex items-center gap-1 transition-all active:scale-95 border ${
                      isFollowed
                        ? 'bg-[#00f2fe] text-[#00373a] border-[#00f2fe] font-semibold'
                        : 'bg-[#32353b]/80 border-white/10 text-[#e0fdff] hover:bg-[#00f2fe] hover:text-[#00373a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {isFollowed ? 'check' : 'add'}
                    </span>
                    <span>{isFollowed ? 'Following' : '+ Follow'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Tracked Topics Feed List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Your Followed Topics
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#32353b]/80 font-mono text-[11px] text-[#b9cacb] border border-white/5">
              {topics.length} Tracked
            </span>
          </div>
          <button
            onClick={() => {
              audioService.playClick('switch');
              onPauseAll();
            }}
            className="font-mono text-[11px] text-[#00f2fe] hover:underline flex items-center gap-1"
          >
            <span>{allPaused ? 'Resume All' : 'Pause All'}</span>
          </button>
        </div>

        {/* Topic Cards */}
        {topics.map((t) => {
          return (
            <div
              key={t.id}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.09] backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 flex flex-col gap-3 transition-all duration-300 ${
                !t.active ? 'opacity-70 hover:opacity-100' : ''
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {/* Top Row: Title, Health Indicator & Tactile Switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    {t.active ? (
                      <span className="relative flex h-2 w-2">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: t.accentColor || '#00f2fe' }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-2 w-2"
                          style={{
                            backgroundColor: t.accentColor || '#00f2fe',
                            boxShadow: `0 0 6px ${t.accentColor || '#00f2fe'}`,
                          }}
                        />
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full h-2 w-2 bg-[#849495]" />
                    )}
                    <h4 className="font-headline text-[1.0625rem] font-medium leading-snug text-[#e1e2ea]">
                      {t.name}
                    </h4>
                  </div>
                  <p className="text-[0.8125rem] text-[#b9cacb] line-clamp-1">
                    {t.description}
                  </p>
                </div>

                {/* Tactile Luminous Switch Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick('switch');
                    onToggleTopicActive(t.id);
                  }}
                  aria-label={`Toggle active state for ${t.name}`}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out border ${
                    t.active
                      ? 'bg-[#00f2fe]/30 border-[#00f2fe]/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                      : 'bg-[#272a30] border-white/10'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md transition duration-200 ease-in-out ${
                      t.active
                        ? 'translate-x-5 bg-[#00f2fe]'
                        : 'translate-x-0 bg-[#849495]'
                    }`}
                  />
                </button>
              </div>

              {/* Keyword Pills Cluster */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-[#1d2025]/80 border border-white/5 text-[#b9cacb] font-mono text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-full bg-[#00f2fe]/10 text-[#00f2fe] font-mono text-[10px] border border-[#00f2fe]/20">
                  +{t.sourceCount} sources
                </span>
                <button
                  onClick={() => {
                    audioService.playClick('button');
                    onDeleteTopic(t.id);
                  }}
                  title="Remove topic"
                  className="ml-auto text-[#849495] hover:text-[#ffb4ab] text-[16px] material-symbols-outlined p-0.5"
                >
                  delete
                </button>
              </div>

              {/* Depth Mode Dual Selector & Telemetry Bar */}
              <div className="pt-2 flex flex-col gap-2 bg-[#0b0e13]/60 rounded-xl p-2.5 border border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#b9cacb] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[#00f2fe]">
                      model_training
                    </span>
                    <span>Detail Level</span>
                  </span>
                  <div className="flex p-0.5 rounded-lg bg-[#32353b]/80 border border-white/5 backdrop-blur-md">
                    <button
                      onClick={() => {
                        audioService.playClick('button');
                        onToggleDetailLevel(t.id, 'Deep Dive');
                      }}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                        t.detailLevel === 'Deep Dive'
                          ? 'bg-[#00f2fe] text-[#00373a] shadow-sm font-semibold'
                          : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                      }`}
                    >
                      Deep Dive
                    </button>
                    <button
                      onClick={() => {
                        audioService.playClick('button');
                        onToggleDetailLevel(t.id, 'Quick Summary');
                      }}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                        t.detailLevel === 'Quick Summary'
                          ? 'bg-[#dbb8ff] text-[#470083] shadow-sm font-semibold'
                          : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                      }`}
                    >
                      Quick Summary
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#849495] font-mono text-[10px] pt-1">
                  <span
                    className="flex items-center gap-1"
                    style={{ color: t.active ? '#00f2fe' : '#849495' }}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {t.active ? 'check_circle' : 'pause_circle'}
                    </span>
                    <span>{t.statusText}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
