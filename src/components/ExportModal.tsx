import React, { useState } from 'react';
import { WeeklyData } from '../types';
import { audioService } from '../services/audioService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyData: WeeklyData;
  streakDays: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  weeklyData,
  streakDays,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `# Luminous Radar — Weekly Executive Briefing
**${weeklyData.issue}**
*Generated: ${new Date().toLocaleDateString()} | Active Streak: Day ${streakDays + 72}*

## Executive Big Picture
### ${weeklyData.headline}
${weeklyData.abstract}

**Key Strategic Vectors:**
- **Biggest Shift:** ${weeklyData.biggestShift}
- **Efficiency Gain:** ${weeklyData.efficiencyGain}
- **Scale:** ${weeklyData.articlesAnalyzed.toLocaleString()} Articles Analyzed (${weeklyData.knowledgeGrowth} Knowledge Growth)

---

## High-Conviction Research Trends
${weeklyData.trends
  .map(
    (t, idx) => `
### ${idx + 1}. ${t.title} (${t.tag} · ${t.sourcesCount} Sources)
${t.description}

*Synthesis:*
${t.fullSummary}
`
  )
  .join('\n')}

---
*Synthesized autonomously by Luminous Radar with Gemini AI.*
`;

  const handleCopyMarkdown = () => {
    audioService.playClick('button');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(markdownContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    audioService.playClick('button');
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Luminous_Radar_Weekly_Issue_${weeklyData.issue.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    audioService.playClick('button');
    window.print();
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
            <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
              download
            </span>
            <h3 className="font-headline text-[1.125rem] font-semibold text-[#e1e2ea]">
              Export Weekly Briefing
            </h3>
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

        <div className="flex flex-col gap-1">
          <p className="text-[0.875rem] text-[#b9cacb]">
            Your weekly synthesis has been formatted as an executive document ready
            to archive, share with team members, or import into Obsidian / Notion.
          </p>
        </div>

        {/* Markdown preview box */}
        <div className="p-3.5 rounded-xl bg-[#0b0e13]/90 border border-white/5 font-mono text-[11px] text-[#b9cacb] max-h-56 overflow-y-auto shadow-inner leading-relaxed">
          <pre className="whitespace-pre-wrap">{markdownContent}</pre>
        </div>

        {/* Export buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopyMarkdown}
            className="py-2.5 px-3 rounded-xl bg-[#272a30] hover:bg-[#32353b] border border-white/10 font-mono text-[11px] text-[#e1e2ea] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00f2fe]">
              {copied ? 'done' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#6ff6ff] text-[#00373a] font-mono text-[11px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,242,254,0.3)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Download .MD File</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-2 px-3 rounded-xl bg-[#191c21] hover:bg-[#272a30] border border-white/5 text-[#b9cacb] hover:text-[#e1e2ea] font-mono text-[10px] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">print</span>
          <span>Print or Save to PDF</span>
        </button>
      </div>
    </div>
  );
};
