import React, { useState } from 'react';
import { ChecklistTask } from '../types';
import { audioService } from '../services/audioService';

interface ProgressTabProps {
  tasks: ChecklistTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: ChecklistTask) => void;
  streakDays: number;
  onIncrementStreak: () => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  streakDays,
  onIncrementStreak,
}) => {
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>(['task-1']);
  const [isCompletedForToday, setIsCompletedForToday] = useState(false);
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Dynamic AI summary note state
  const [summaryNote, setSummaryNote] = useState({
    quote:
      "Today’s learning was focused on efficiency and cost savings. As AI models grow bigger, techniques like Mixture of Experts and faster inference make real-world deployment practical and affordable. Meanwhile, solid-state batteries are making steady leaps toward commercial electric vehicles.",
    coreTheme: 'Efficient AI Architecture & Solid-State Batteries',
    verifiedCount: 18,
    rating: 'High Quality Summary',
    timestamp: 'Today, 9:40 PM',
  });

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const calculatedPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Arc math: circumference for r=68 is 2 * PI * 68 ≈ 427.26
  const outerCircumference = 427.26;
  const outerOffset =
    outerCircumference - (calculatedPercentage / 100) * outerCircumference;

  // Inner arc for comprehension depth (fixed high fidelity or scales with completed)
  const innerCircumference = 339.29;
  const innerPercentage = Math.min(100, Math.max(60, calculatedPercentage + 8));
  const innerOffset =
    innerCircumference - (innerPercentage / 100) * innerCircumference;

  const toggleTaskExpansion = (id: string) => {
    audioService.playClick('button');
    setExpandedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTaskCheck = (id: string) => {
    audioService.playClick('switch');
    onToggleTask(id);
  };

  const handleCompleteToday = () => {
    audioService.playClick('button');
    setIsCompletedForToday(true);
    onIncrementStreak();
  };

  const handleRefreshSummary = async () => {
    audioService.playClick('button');
    setIsRefreshingSummary(true);
    try {
      const completedTitles = tasks
        .filter((t) => t.completed)
        .map((t) => t.title);

      const res = await fetch('/api/ai/synthesize-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTopics: completedTitles,
          itemsRead: completedCount,
          streakDays,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryNote({
          quote: data.quote || summaryNote.quote,
          coreTheme: data.coreTheme || summaryNote.coreTheme,
          verifiedCount: data.verifiedCount || 19,
          rating: data.rating || 'High Quality Summary',
          timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        });
      }
    } catch {
      // Fallback preserves current note
    } finally {
      setIsRefreshingSummary(false);
    }
  };

  const handleShare = () => {
    audioService.playClick('button');
    const textToShare = `Luminous Radar Daily Learning: Completed ${completedCount}/${totalCount} tasks (${calculatedPercentage}%) on Day ${streakDays + 72}! Theme: "${summaryNote.coreTheme}".`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
    }
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    audioService.playClick('button');

    const newTask: ChecklistTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      readTime: '8 min read',
      completed: false,
      sourceMeta: 'Custom Research Track • Ready to explore',
      metricBadge: 'Active',
      metricColor: '#00f2fe',
      badgeLabel: 'Pending',
      keyTakeaway: `Key exploration notes on ${newTaskInput.trim()}: focuses on verified evidence and repeatable findings.`,
      themeCategory: 'Custom Learning',
    };

    onAddTask(newTask);
    setNewTaskInput('');
    setShowAddTask(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 select-none pb-8">
      {/* Interactive Streak & Status Capsule Bar */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#191c21]/90 to-[#101319]/95 backdrop-blur-2xl p-4 border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-[#00f2fe]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-[#6807ba]/25 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#272a30]/90 border border-white/10 backdrop-blur-md flex items-center justify-center text-[#00f2fe] shadow-md">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
                  {streakDays}-Day Learning Streak!
                </span>
              </div>
              <span className="text-[0.8125rem] text-[#b9cacb]">
                Top 4% most active learners this month
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#32353b]/80 border border-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe] animate-pulse" />
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-widest font-semibold">
              DAY {streakDays + 72}
            </span>
          </div>
        </div>
      </div>

      {/* Radial Gauge Lens Section */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#191c21]/85 to-[#101319]/95 backdrop-blur-2xl p-6 border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col items-center">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#00f2fe]/10 via-[#6807ba]/5 to-transparent pointer-events-none" />

        <div className="w-full flex items-center justify-between relative z-10 mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">
              lens_blur
            </span>
            <span className="font-mono text-[11px] text-[#e1e2ea] uppercase tracking-wider font-semibold">
              TODAY'S COVERAGE
            </span>
          </div>
          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#32353b]/80 border border-white/5 text-[#dbb8ff]">
            Target: 100%
          </span>
        </div>

        {/* Gauge Visualization */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          {/* Glow Underlay */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#6807ba]/30 to-[#00f2fe]/20 blur-xl" />

          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Tracks */}
            <circle
              className="text-[#32353b]"
              cx="80"
              cy="80"
              fill="none"
              opacity="0.6"
              r="68"
              stroke="currentColor"
              strokeDasharray="3 4"
              strokeWidth="7"
            />
            <circle
              className="text-[#272a30]"
              cx="80"
              cy="80"
              fill="none"
              opacity="0.4"
              r="54"
              stroke="currentColor"
              strokeWidth="4"
            />

            {/* Outer Glowing Arc (Primary Cyan Calculated %) */}
            <circle
              className="text-[#00f2fe] transition-all duration-700 ease-out"
              cx="80"
              cy="80"
              fill="none"
              r="68"
              stroke="currentColor"
              strokeDasharray={outerCircumference}
              strokeDashoffset={outerOffset}
              strokeLinecap="round"
              strokeWidth="8"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,242,254,0.75))',
              }}
            />

            {/* Inner Secondary Arc (Comprehension Depth %) */}
            <circle
              className="text-[#dbb8ff] transition-all duration-700 ease-out"
              cx="80"
              cy="80"
              fill="none"
              r="54"
              stroke="currentColor"
              strokeDasharray={innerCircumference}
              strokeDashoffset={innerOffset}
              strokeLinecap="round"
              strokeWidth="4.5"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(219,184,255,0.6))',
              }}
            />
          </svg>

          {/* Center Optical Reading Plaque */}
          <div className="absolute flex flex-col items-center justify-center text-center px-4">
            <span className="font-headline text-[2.5rem] tracking-tight text-[#e1e2ea] drop-shadow-sm font-semibold leading-none">
              {calculatedPercentage}
              <span className="text-[#00f2fe] text-[1.25rem] font-medium">%</span>
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-widest mt-1 text-center font-medium">
              DAILY GOAL COMPLETED
            </span>
          </div>
        </div>

        {/* Multi-metric Telemetry Micro-cards */}
        <div className="grid grid-cols-3 w-full gap-3 mt-2 pt-2">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-[#0b0e13]/70 border border-white/[0.06] backdrop-blur-md text-center shadow-inner">
            <span className="font-mono text-[11px] text-[#b9cacb]">Topics Read</span>
            <span className="font-headline text-[1.125rem] text-[#dbb8ff] font-semibold mt-0.5">
              92%
            </span>
            <span className="font-mono text-[10px] text-[#849495]">Read Rate</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-xl bg-[#0b0e13]/70 border border-white/[0.06] backdrop-blur-md text-center shadow-inner">
            <span className="font-mono text-[11px] text-[#b9cacb]">Daily Tasks</span>
            <span className="font-headline text-[1.125rem] text-[#00f2fe] font-semibold mt-0.5">
              {completedCount} of {totalCount}
            </span>
            <span className="font-mono text-[10px] text-[#849495]">Done</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-xl bg-[#0b0e13]/70 border border-white/[0.06] backdrop-blur-md text-center shadow-inner">
            <span className="font-mono text-[11px] text-[#b9cacb]">Time Spent</span>
            <span className="font-headline text-[1.125rem] text-[#ffb86f] font-semibold mt-0.5">
              24m
            </span>
            <span className="font-mono text-[10px] text-[#849495]">Active mins</span>
          </div>
        </div>
      </div>

      {/* Visual Concept Banner Slot */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-[#191c21]">
        <div
          className="bg-cover bg-center w-full h-full transform scale-105 hover:scale-100 transition-transform duration-700"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALaFOwzRZTfiD34cmnwIds0513mdRVaFMxYadYO5B-ttrV2Zw8_oPv3SDYTMLLYip5vzgsGBZDwW2N_9xNw7uVSHcpa1EcWJZH59wUzBOuaURWrgg8tCkzpSCblpRFAWPvLRTAqgdegAJlGF0zDh0oUJX32TDctay6uGpEXVKnDqbomn21UgXGptuWj8PS_Ed1mGFTN1TTx_ST8hRXIVWd1uTNQtfRs2H5YlEWd50pIEIqmZhifsyO')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-[#101319]/40 to-transparent flex flex-col justify-end p-4">
          <span className="font-mono text-[10px] text-[#00f2fe] uppercase tracking-widest font-semibold">
            TODAY'S CORE THEME
          </span>
          <p className="font-headline text-[1.0625rem] text-[#e1e2ea] font-medium truncate mt-0.5">
            {summaryNote.coreTheme}
          </p>
        </div>
      </div>

      {/* Tracked Topics & Completion Checklist Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
              checklist
            </span>
            <h2 className="font-headline text-[1.125rem] text-[#e1e2ea] font-medium">
              Today's Reading Checklist
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#b9cacb]">
              {completedCount} of {totalCount} Finished
            </span>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="text-[#00f2fe] text-[18px] material-symbols-outlined hover:scale-110 active:scale-95 transition-transform"
              title="Add reading task"
            >
              add_circle
            </button>
          </div>
        </div>

        {/* Add Task Quick Form */}
        {showAddTask && (
          <form
            onSubmit={handleAddNewTask}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#191c21] border border-[#00f2fe]/30 shadow-md"
          >
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Enter article or topic to read today..."
              className="flex-1 bg-transparent text-[0.875rem] text-[#e1e2ea] focus:outline-none placeholder-[#849495]"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-[#00f2fe] text-[#00373a] font-mono text-[11px] font-semibold"
            >
              Add
            </button>
          </form>
        )}

        {/* Checklist Task Items */}
        {tasks.map((task) => {
          const isExpanded = expandedTaskIds.includes(task.id);
          return (
            <div
              key={task.id}
              className={`rounded-2xl bg-gradient-to-b from-[#191c21]/80 to-[#101319]/90 border border-white/[0.09] backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300 ${
                !task.completed ? 'opacity-85' : ''
              }`}
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Glowing Glass Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleTaskCheck(task.id)}
                      aria-label={`Mark ${task.title} as ${task.completed ? 'pending' : 'done'}`}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90 border ${
                        task.completed
                          ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                          : 'bg-[#272a30] text-transparent border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">
                        check
                      </span>
                    </button>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                            task.completed
                              ? 'bg-[#272a30] text-[#00f2fe] border-[#00f2fe]/20'
                              : 'bg-[#272a30]/50 text-[#b9cacb] border-white/5'
                          }`}
                        >
                          {task.completed ? 'Done' : 'Pending'}
                        </span>
                        <span className="font-mono text-[11px] text-[#b9cacb]">
                          {task.readTime}
                        </span>
                      </div>
                      <h3
                        className={`font-headline text-[1.0625rem] text-[#e1e2ea] font-medium tracking-tight mt-1 transition-colors ${
                          task.completed ? '' : 'text-[#e1e2ea]/90'
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTaskExpansion(task.id)}
                    aria-label="Expand task details"
                    className="p-1.5 rounded-full bg-[#272a30]/70 border border-white/5 text-[#b9cacb] hover:text-[#e1e2ea] active:scale-95 transition-all"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                </div>

                {/* Meta Sub-plate */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0b0e13]/60 border border-white/5 text-[#b9cacb] shadow-inner">
                  <span className="font-mono text-[11px] truncate">
                    {task.sourceMeta}
                  </span>
                  <span
                    className="font-mono text-[11px] shrink-0 ml-2 font-medium"
                    style={{ color: task.metricColor }}
                  >
                    {task.metricBadge}
                  </span>
                </div>
              </div>

              {/* Expandable AI Insights Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  <div className="p-3.5 rounded-xl bg-[#0b0e13]/80 border border-white/5 backdrop-blur-lg flex flex-col gap-1.5 relative overflow-hidden shadow-inner">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00f2fe] to-[#dbb8ff]" />
                    <div className="flex items-center gap-1.5 text-[#00f2fe]">
                      <span className="material-symbols-outlined text-[16px]">
                        smart_toy
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                        Key Takeaway
                      </span>
                    </div>
                    <p className="text-[0.875rem] text-[#e1e2ea] leading-relaxed pl-1">
                      {task.keyTakeaway}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily Reflection & AI Synthesis Note Card */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#191c21]/90 to-[#101319]/95 backdrop-blur-2xl p-5 border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col gap-4">
        {/* Ambient Specular Bloom */}
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-[#6807ba]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-[#00f2fe]/15 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6807ba]/40 border border-[#dbb8ff]/30 flex items-center justify-center text-[#dbb8ff] shadow-[0_0_10px_rgba(219,184,255,0.4)]">
              <span className="material-symbols-outlined text-[16px]">
                auto_awesome
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#e1e2ea] font-semibold uppercase tracking-wider">
              TODAY'S AI SUMMARY NOTE
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#b9cacb]">
            {summaryNote.timestamp}
          </span>
        </div>

        {/* Rich Quote Box Frame */}
        <div className="relative p-4 rounded-xl bg-[#0b0e13]/85 border border-white/5 backdrop-blur-md overflow-hidden shadow-inner">
          <div className="absolute top-2 left-2 text-[#32353b] opacity-40 select-none">
            <span className="material-symbols-outlined text-[36px]">format_quote</span>
          </div>
          <p className="text-[0.9375rem] text-[#e1e2ea] relative z-10 leading-relaxed italic pl-6 font-normal">
            “{summaryNote.quote}”
          </p>
        </div>

        <div className="flex items-center justify-between text-[#b9cacb]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f2fe] text-[16px]">
              psychology
            </span>
            <span className="font-mono text-[11px]">
              Verified from {summaryNote.verifiedCount} articles & papers
            </span>
          </div>
          <span className="font-mono text-[#00f2fe] text-[11px] font-medium">
            {summaryNote.rating}
          </span>
        </div>
      </div>

      {/* Glass Action Bar */}
      <div className="flex flex-col gap-3 pt-1">
        <button
          onClick={handleCompleteToday}
          className={`w-full py-3.5 px-4 rounded-xl font-mono text-[12px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
            isCompletedForToday
              ? 'bg-gradient-to-r from-[#6807ba] to-[#93000a] text-white shadow-[0_0_24px_rgba(104,7,186,0.5)]'
              : 'bg-gradient-to-r from-[#00f2fe] via-[#6ff6ff] to-[#00f2fe] text-[#00373a] shadow-[0_0_24px_rgba(0,242,254,0.45)]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCompletedForToday ? 'verified' : 'task_alt'}
          </span>
          <span>
            {isCompletedForToday
              ? 'COMPLETED FOR TODAY!'
              : 'MARK TODAY AS COMPLETED'}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-[#191c21]/90 hover:bg-[#272a30] border border-white/10 text-[#e1e2ea] font-mono text-[11px] uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">
              {shareFeedback ? 'done' : 'ios_share'}
            </span>
            <span>{shareFeedback ? 'Copied!' : 'Share Progress'}</span>
          </button>

          <button
            onClick={handleRefreshSummary}
            disabled={isRefreshingSummary}
            className="py-2.5 px-3 rounded-xl bg-[#191c21]/90 hover:bg-[#272a30] border border-white/10 text-[#e1e2ea] font-mono text-[11px] uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[#dbb8ff] text-[18px] ${
                isRefreshingSummary ? 'animate-spin' : ''
              }`}
            >
              cycle
            </span>
            <span>{isRefreshingSummary ? 'Synthesizing...' : 'Refresh Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
