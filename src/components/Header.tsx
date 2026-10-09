import React from 'react';

interface HeaderProps {
  currentTab: string;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSettings,
  onOpenProfile,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'daily':
        return 'Daily';
      case 'topics':
        return 'Topics';
      case 'progress':
        return 'My Progress';
      case 'weekly':
        return 'Weekly';
      default:
        return 'Daily';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0b0e13]/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/[0.08]">
      <div className="h-16 max-w-xl mx-auto px-4 flex items-center justify-between relative">
        {/* Specular hairline top sheen */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Brand & Tab Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] shadow-[0_0_10px_#00f2fe] animate-pulse" />
            <span className="absolute w-4 h-4 rounded-full bg-[#00f2fe]/30 animate-ping" />
          </div>
          <h1 className="font-headline text-[1.25rem] font-medium tracking-tight text-[#e1e2ea] select-none truncate">
            {getTabTitle()}
          </h1>
        </div>

        {/* Tactical Header Controls */}
        <div className="flex items-center gap-2">
          {/* Audio / Tuning Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Radar and Audio Settings"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#191c21]/80 border border-white/10 text-[#b9cacb] hover:text-[#00f2fe] hover:border-[#00f2fe]/40 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {/* User Profile / Stats Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#e0fdff] flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.35)] transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[#00373a] text-[18px] font-semibold">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
