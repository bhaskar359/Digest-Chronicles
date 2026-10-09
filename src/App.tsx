/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, TrackedTopic, NewsArticle, ChecklistTask, WeeklyData, WeeklyTrend } from './types';
import { INITIAL_TOPICS, INITIAL_ARTICLES, INITIAL_TASKS, INITIAL_WEEKLY } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyTab } from './components/DailyTab';
import { TopicsTab } from './components/TopicsTab';
import { ProgressTab } from './components/ProgressTab';
import { WeeklyTab } from './components/WeeklyTab';
import { QuickSummaryModal } from './components/QuickSummaryModal';
import { TrendModal } from './components/TrendModal';
import { ExportModal } from './components/ExportModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { audioService } from './services/audioService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('daily');
  const [topics, setTopics] = useState<TrackedTopic[]>(INITIAL_TOPICS);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [tasks, setTasks] = useState<ChecklistTask[]>(INITIAL_TASKS);
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(INITIAL_WEEKLY);
  const [streakDays, setStreakDays] = useState<number>(12);
  const [allPaused, setAllPaused] = useState<boolean>(false);
  const [voicePersona, setVoicePersona] = useState<string>('Studio Ultra');
  const [isRegeneratingWeekly, setIsRegeneratingWeekly] = useState<boolean>(false);

  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<WeeklyTrend | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Handlers for Topics
  const handleAddTopic = (newTopic: Partial<TrackedTopic>) => {
    setTopics((prev) => [newTopic as TrackedTopic, ...prev]);
  };

  const handleToggleTopicActive = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleToggleDetailLevel = (id: string, level: 'Deep Dive' | 'Quick Summary') => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, detailLevel: level } : t))
    );
  };

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePauseAll = () => {
    const nextState = !allPaused;
    setAllPaused(nextState);
    setTopics((prev) => prev.map((t) => ({ ...t, active: !nextState })));
  };

  const handleAddNewArticleFromTopic = (newArt: NewsArticle) => {
    setArticles((prev) => [newArt, ...prev]);
  };

  // Handlers for Articles
  const handleToggleSaveArticle = (id: string) => {
    audioService.playClick('button');
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a))
    );
  };

  // Handlers for Tasks
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: ChecklistTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleIncrementStreak = () => {
    setStreakDays((prev) => prev + 1);
  };

  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  // Fetch Live Updates from arXiv, Hacker News, and Gemini Search Grounding
  const handleFetchLiveUpdates = async (topicName?: string) => {
    audioService.playClick('button');
    setIsFetchingLive(true);
    try {
      const activeTopic = topicName || topics.find((t) => t.active)?.name || 'AI Reasoning';
      const res = await fetch('/api/feed/fetch-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic,
          sourceTypes: ['Research Papers', 'Tech News'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          // Prepend newly fetched articles to feed
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = data.articles.filter((a: NewsArticle) => !existingIds.has(a.id));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live updates:', err);
    } finally {
      setIsFetchingLive(false);
    }
  };

  // Regenerate Weekly Briefing using server Gemini route
  const handleRegenerateWeekly = async () => {
    audioService.playClick('button');
    setIsRegeneratingWeekly(true);
    try {
      const activeTopicNames = topics.filter((t) => t.active).map((t) => t.name);
      const res = await fetch('/api/ai/synthesize-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackedTopics: activeTopicNames,
          stats: {
            explored: 18,
            read: 42,
            hours: 6.4,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWeeklyData((prev) => ({
          ...prev,
          headline: data.headline || prev.headline,
          abstract: data.abstract || prev.abstract,
          biggestShift: data.biggestShift || prev.biggestShift,
          efficiencyGain: data.efficiencyGain || prev.efficiencyGain,
          articlesAnalyzed: data.articlesAnalyzed || prev.articlesAnalyzed,
          knowledgeGrowth: data.knowledgeGrowth || prev.knowledgeGrowth,
          trends: data.trends || prev.trends,
        }));
      }
    } catch {
      // Retains existing
    } finally {
      setIsRegeneratingWeekly(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#101319] text-[#e1e2ea] antialiased selection:bg-[#00f2fe] selection:text-[#00373a] overflow-x-hidden">
      {/* Ambient optical backlight glows matching mockups */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full bg-[#00f2fe]/10 blur-[130px]" />
        <div className="absolute top-[40%] -left-[20%] w-[320px] h-[320px] rounded-full bg-[#6807ba]/15 blur-[140px]" />
        <div className="absolute bottom-[10%] -right-[15%] w-[300px] h-[300px] rounded-full bg-[#ffd3aa]/10 blur-[120px]" />
      </div>

      {/* Persistent Top Header */}
      <Header
        currentTab={currentTab}
        onOpenSettings={() => {
          audioService.playClick('button');
          setIsSettingsModalOpen(true);
        }}
        onOpenProfile={() => {
          audioService.playClick('button');
          setIsProfileModalOpen(true);
        }}
      />

      {/* Main Viewport Content Container */}
      <main className="relative z-10 w-full max-w-xl mx-auto pt-20 pb-28 px-4 min-h-screen">
        {currentTab === 'daily' && (
          <DailyTab
            articles={articles}
            topics={topics}
            onOpenQuickSummary={(art) => setSelectedArticle(art)}
            onToggleSave={handleToggleSaveArticle}
            onNavigateToTopics={() => setCurrentTab('topics')}
            onFetchLiveUpdates={handleFetchLiveUpdates}
            isFetchingLive={isFetchingLive}
          />
        )}

        {currentTab === 'topics' && (
          <TopicsTab
            topics={topics}
            onAddTopic={handleAddTopic}
            onToggleTopicActive={handleToggleTopicActive}
            onToggleDetailLevel={handleToggleDetailLevel}
            onDeleteTopic={handleDeleteTopic}
            onPauseAll={handlePauseAll}
            allPaused={allPaused}
            onAddNewArticleFromTopic={handleAddNewArticleFromTopic}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressTab
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            streakDays={streakDays}
            onIncrementStreak={handleIncrementStreak}
          />
        )}

        {currentTab === 'weekly' && (
          <WeeklyTab
            weeklyData={weeklyData}
            onOpenTrendSummary={(trend) => setSelectedTrend(trend)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onRegenerateWeekly={handleRegenerateWeekly}
            isRegenerating={isRegeneratingWeekly}
          />
        )}
      </main>

      {/* Persistent Tactile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* Interactive Modals */}
      <QuickSummaryModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onToggleSave={handleToggleSaveArticle}
      />

      <TrendModal
        trend={selectedTrend}
        onClose={() => setSelectedTrend(null)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        weeklyData={weeklyData}
        streakDays={streakDays}
      />

      <AudioSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        voicePersona={voicePersona}
        onSelectVoicePersona={setVoicePersona}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        streakDays={streakDays}
        totalTopicsCount={topics.length}
        completedTasksCount={tasks.filter((t) => t.completed).length}
      />
    </div>
  );
}
