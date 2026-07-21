import { useState } from 'react';
import { Suspect, GameState } from '../../types/game';
import { SUSPECTS } from '../../data/storyData';
import { MessageSquare, ShieldAlert, Award, FileQuestion } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface SuspectListProps {
  state: GameState;
  onSelectSuspect: (suspectId: string) => void;
}

// Inline SVG generator helper with support for real high-quality portrait images and beautiful fallback silhouettes
export function CharacterPortrait({ seed, className = "w-16 h-16" }: { seed: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  // Let's generate a beautiful styled vector silhouette with mood colors
  let bgColor = "from-zinc-800 to-zinc-950";
  let accentColor = "fill-zinc-700";
  let outlineColor = "border-zinc-700/50";
  let detailColor = "#3f3f46";

  if (seed === 'elina') {
    bgColor = "from-purple-950/40 to-slate-950";
    accentColor = "fill-purple-500/80";
    outlineColor = "border-purple-850";
    detailColor = "#a855f7";
  } else if (seed === 'markus') {
    bgColor = "from-amber-950/40 to-slate-950";
    accentColor = "fill-amber-600/80";
    outlineColor = "border-amber-850";
    detailColor = "#d97706";
  } else if (seed === 'laura') {
    bgColor = "from-teal-950/40 to-slate-950";
    accentColor = "fill-teal-500/80";
    outlineColor = "border-teal-850";
    detailColor = "#14b8a6";
  } else if (seed === 'oskari') {
    bgColor = "from-sky-950/40 to-slate-950";
    accentColor = "fill-sky-600/80";
    outlineColor = "border-sky-850";
    detailColor = "#0284c7";
  } else if (seed === 'sara') {
    bgColor = "from-emerald-950/40 to-slate-950";
    accentColor = "fill-emerald-500/80";
    outlineColor = "border-emerald-850";
    detailColor = "#10b981";
  }

  return (
    <div className={`relative rounded-md border ${outlineColor} bg-gradient-to-b ${bgColor} flex items-center justify-center overflow-hidden shadow-md group ${className}`}>
      {!hasError ? (
        <img
          src={`/images/ui/${seed}.jpg`}
          alt={`${seed} portrait`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-85">
          {/* Abstract futuristic grid lines */}
          <line x1="10" y1="0" x2="10" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          <line x1="90" y1="0" x2="90" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          
          {/* Background glow circle */}
          <circle cx="50" cy="45" r="28" fill="none" stroke={detailColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx="50" cy="45" r="25" fill={detailColor} fillOpacity="0.1" />
          
          {/* Body silhouette */}
          <path d="M 20 90 Q 20 65, 38 60 Q 32 50, 32 40 Q 32 18, 50 18 Q 68 18, 68 40 Q 68 50, 62 60 Q 80 65, 80 90 Z" className={accentColor} />
          
          {/* Stylized hair/head accessory markings depending on character */}
          {seed === 'elina' && (
            // Elegant bob hair cut
            <path d="M 32 40 Q 32 20, 50 16 Q 68 20, 68 40 Q 68 28, 62 25 Q 50 21, 38 25 Q 32 28, 32 40" fill="#a855f7" fillOpacity="0.7" />
          )}
          {seed === 'laura' && (
            // Long wavy artistic hair
            <path d="M 31 43 Q 22 55, 30 70 Q 36 60, 32 40 Q 50 14, 68 40 Q 64 60, 70 70 Q 78 55, 69 43" fill="#14b8a6" fillOpacity="0.6" />
          )}
          {seed === 'sara' && (
            // Sharp glasses and ponytail outline
            <g>
              <circle cx="44" cy="38" r="4" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
              <circle cx="56" cy="38" r="4" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
              <line x1="48" y1="38" x2="52" y2="38" stroke="#10b981" strokeWidth="1" />
            </g>
          )}
        </svg>
      )}
      {/* Glow dot in the corner */}
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full shadow-glow" style={{ backgroundColor: detailColor }} />
    </div>
  );
}

export function SuspectList({ state, onSelectSuspect }: SuspectListProps) {
  const handleSuspectClick = (suspectId: string) => {
    audioSynth.playClick();
    onSelectSuspect(suspectId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="suspects-list-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h3 className="text-xl md:text-2xl font-serif italic font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <FileQuestion className="w-5 h-5 text-amber-500" />
          Tapauksen Epäillyt
        </h3>
        <p className="text-xs font-sans text-slate-400">
          Kuulustele ystävyksiä. Etsi ristiriitaisuuksia heidän lausunnoistaan. Löydetyt johtolangat avaavat uusia kysymyksiä ja murtavat alibeja.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUSPECTS.map((suspect) => {
          const completedTopics = state.completedDialogueTopics[suspect.id] || [];
          const unlockedTopics = state.unlockedDialogueTopics[suspect.id] || [];
          const progressPercent = unlockedTopics.length > 0
            ? Math.round((completedTopics.length / unlockedTopics.length) * 100)
            : 0;

          return (
            <div
              key={suspect.id}
              className="bg-slate-900/40 border border-white/5 rounded p-5 flex flex-col justify-between backdrop-blur-sm hover:border-amber-600/30 transition-all duration-300 shadow-lg"
              id={`suspect-card-${suspect.id}`}
            >
              <div className="space-y-4">
                {/* Character Header Block */}
                <div className="flex gap-4 items-center">
                  <CharacterPortrait seed={suspect.portraitSvgSeed} className="w-16 h-16 shrink-0" />
                  <div className="space-y-0.5">
                    <h4 className="text-base font-serif italic font-bold text-slate-200">
                      {suspect.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {suspect.age} vuotta • {suspect.role}
                    </p>
                  </div>
                </div>

                {/* Description summary */}
                <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed line-clamp-3">
                  {suspect.description}
                </p>

                {/* Alibi description snippet */}
                <div className="bg-slate-950 border border-white/5 p-2.5 rounded text-xs">
                  <span className="font-semibold text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Virallinen alibi:</span>
                  <p className="text-slate-300 font-serif italic mt-1 leading-relaxed">
                    "{suspect.alibi}"
                  </p>
                </div>
              </div>

              {/* Action and Progress indicator */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Haastateltu:</span>
                  <span className="text-slate-300 font-bold">
                    {completedTopics.length} / {unlockedTopics.length} aihetta ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <button
                  onClick={() => handleSuspectClick(suspect.id)}
                  className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-amber-600/40 hover:text-white text-slate-300 font-sans text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  id={`btn-interrogate-${suspect.id}`}
                >
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span>Aloita kuulustelu</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SuspectList;
