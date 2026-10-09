import React, { useState } from 'react';
import { audioService } from '../services/audioService';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voicePersona: string;
  onSelectVoicePersona: (name: string) => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  voicePersona,
  onSelectVoicePersona,
}) => {
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.2);
  const [tactileClicks, setTactileClicks] = useState<boolean>(true);
  const [autoPlayDaily, setAutoPlayDaily] = useState<boolean>(false);

  if (!isOpen) return null;

  const personas = [
    {
      id: 'Studio Ultra',
      name: 'Studio Ultra',
      desc: 'Balanced, authoritative tech news anchor with deep resonance.',
      accent: '#00f2fe',
    },
    {
      id: 'Nova Clear',
      name: 'Nova Clear',
      desc: 'Crisp analytical researcher tone, optimal for technical papers.',
      accent: '#dbb8ff',
    },
    {
      id: 'Zephyr AI',
      name: 'Zephyr AI',
      desc: 'Fast-paced, high information density for quick morning digests.',
      accent: '#6ff6ff',
    },
  ];

  const handleTestVoice = (personaName: string) => {
    audioService.playClick('button');
    audioService.speak(
      `Hello! You are listening to the ${personaName} voice preset on Luminous Radar.`,
      speechSpeed
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-gradient-to-b from-[#1d2025] to-[#101319] border border-white/15 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-[#e1e2ea] flex flex-col gap-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">
              tune
            </span>
            <h3 className="font-headline text-[1.125rem] font-semibold text-[#e1e2ea]">
              Radar & Audio Acoustics
            </h3>
          </div>

          <button
            onClick={() => {
              audioService.playClick('button');
              audioService.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#272a30] text-[#b9cacb] hover:text-white flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Voice persona selector */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#b9cacb]">
            Voice Persona Studio
          </span>
          <div className="flex flex-col gap-2">
            {personas.map((p) => {
              const isSelected = voicePersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    audioService.playClick('button');
                    onSelectVoicePersona(p.id);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#272a30] border-[#00f2fe]/50 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'bg-[#191c21]/80 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                      style={{
                        backgroundColor: p.accent,
                        boxShadow: isSelected ? `0 0 8px ${p.accent}` : 'none',
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-headline text-[0.9375rem] font-medium text-[#e1e2ea]">
                        {p.name}
                      </span>
                      <span className="text-[0.8125rem] text-[#b9cacb] mt-0.5">
                        {p.desc}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoice(p.name);
                    }}
                    className="p-1.5 rounded-lg bg-[#32353b] text-[#00f2fe] hover:bg-[#00f2fe] hover:text-[#00373a] transition-all ml-2 shrink-0"
                    title="Test voice"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      play_arrow
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Speed slider */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#b9cacb]">
              Playback Narration Rate
            </span>
            <span className="font-mono text-[11px] text-[#00f2fe]">
              {speechSpeed}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.8"
            step="0.1"
            value={speechSpeed}
            onChange={(e) => {
              audioService.playClick('dial');
              setSpeechSpeed(parseFloat(e.target.value));
            }}
            className="w-full h-2 bg-[#32353b] rounded-lg appearance-none cursor-pointer accent-[#00f2fe]"
          />
        </div>

        {/* Switches */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-headline text-[0.875rem] text-[#e1e2ea]">
                Tactile Switch Feedback
              </span>
              <span className="text-[0.75rem] text-[#b9cacb]">
                Play physical mechanical click sounds on interaction
              </span>
            </div>
            <button
              onClick={() => {
                audioService.playClick('switch');
                setTactileClicks(!tactileClicks);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${
                tactileClicks ? 'bg-[#00f2fe]' : 'bg-[#32353b]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-[#101319] shadow transition-transform duration-200 ${
                  tactileClicks ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-headline text-[0.875rem] text-[#e1e2ea]">
                Auto-play Morning Brief
              </span>
              <span className="text-[0.75rem] text-[#b9cacb]">
                Trigger audio overview immediately when opened at 07:30
              </span>
            </div>
            <button
              onClick={() => {
                audioService.playClick('switch');
                setAutoPlayDaily(!autoPlayDaily);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${
                autoPlayDaily ? 'bg-[#00f2fe]' : 'bg-[#32353b]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-[#101319] shadow transition-transform duration-200 ${
                  autoPlayDaily ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            audioService.playClick('button');
            onClose();
          }}
          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#6ff6ff] text-[#00373a] font-mono text-[11px] font-semibold active:scale-95"
        >
          Save Acoustic Preferences
        </button>
      </div>
    </div>
  );
};
