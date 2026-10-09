import React from 'react';
import { TabType } from '../types';
import { audioService } from '../services/audioService';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'daily', label: 'Daily', icon: 'radar' },
    { id: 'topics', label: 'Topics', icon: 'hub' },
    { id: 'progress', label: 'My Progress', icon: 'monitoring' },
    { id: 'weekly', label: 'Weekly', icon: 'auto_stories' },
  ];

  const handleTabClick = (tab: TabType) => {
    if (tab !== currentTab) {
      audioService.playClick('button');
      onSelectTab(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none">
      <div className="max-w-xl mx-auto px-4 py-3">
        <div className="pointer-events-auto h-16 w-full rounded-2xl bg-[#0b0e13]/85 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-stretch justify-around px-2 relative overflow-hidden">
          {/* Specular hairline top rim */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center min-w-[48px] min-h-[44px] gap-0.5 transition-all active:scale-95 relative ${
                  isActive
                    ? 'text-[#00f2fe] font-semibold drop-shadow-[0_0_12px_rgba(0,242,254,0.5)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                }`}
              >
                {/* Active optical spot indicator */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-[2px] rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
                )}
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                <span className="font-mono uppercase tracking-wider text-[10px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
