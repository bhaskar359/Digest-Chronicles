export type TabType = 'daily' | 'topics' | 'progress' | 'weekly';

export interface TrackedTopic {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sourceCount: number;
  active: boolean;
  detailLevel: 'Deep Dive' | 'Quick Summary';
  statusText: string;
  lastUpdated: string;
  sourceTypes?: string[];
  frequency?: string;
  accentColor?: string;
}

export interface NewsArticle {
  id: string;
  sourceBadge: string;
  matchScore: string;
  timeAgo: string;
  image: string;
  overlayBadgeLeft: string;
  overlayBadgeRight: string;
  overlayRightColor?: string;
  title: string;
  excerpt: string;
  takeawayType: 'Key Takeaway' | 'Why It Matters' | 'Big Picture';
  takeawayText: string;
  takeawayIcon: string;
  takeawayColor: string;
  topicTag: string;
  saved?: boolean;
  audioDuration?: string;
  audioNarration?: string;
  externalUrl?: string;
  sourceOrigin?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  readTime: string;
  completed: boolean;
  sourceMeta: string;
  metricBadge: string;
  metricColor: string;
  badgeLabel?: string;
  keyTakeaway: string;
  themeCategory: string;
}

export interface WeeklyTrend {
  id: string;
  tag: string;
  sourcesCount: number;
  title: string;
  description: string;
  badges: string[];
  fullSummary: string;
  accentColor?: string;
}

export interface WeeklyData {
  issue: string;
  dateRange: string;
  headline: string;
  abstract: string;
  biggestShift: string;
  efficiencyGain: string;
  articlesAnalyzed: number;
  knowledgeGrowth: string;
  trends: WeeklyTrend[];
}
