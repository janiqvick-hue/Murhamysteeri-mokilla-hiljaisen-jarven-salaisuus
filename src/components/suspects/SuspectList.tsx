import { useState } from 'react';
import { Suspect, GameState, Clue } from '../../types/game';
import { SUSPECTS, CLUES } from '../../data/storyData';
import { MessageSquare, ShieldAlert, Check, FileText, Flame, ShieldCheck, ArrowLeft, Folder, FolderOpen, Tag, Lock } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';
import { motion, AnimatePresence } from 'motion/react';

interface SuspectListProps {
  state: GameState;
  onSelectSuspect: (suspectId: string) => void;
}

// Inline SVG generator helper with support for real high-quality portrait images and beautiful fallback silhouettes
export function CharacterPortrait({ seed, className = "w-16 h-16" }: { seed: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

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
    <div className={`relative rounded-xs border ${outlineColor} bg-gradient-to-b ${bgColor} flex items-center justify-center overflow-hidden shadow-inner group ${className}`}>
      {!hasError ? (
        <img
          src={`/images/ui/${seed}.jpg`}
          alt={`${seed} portrait`}
          className="w-full h-full object-cover grayscale-[0.15] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-85">
          <line x1="10" y1="0" x2="10" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          <line x1="90" y1="0" x2="90" y2="100" stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
          
          <circle cx="50" cy="45" r="28" fill="none" stroke={detailColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx="50" cy="45" r="25" fill={detailColor} fillOpacity="0.1" />
          
          <path d="M 20 90 Q 20 65, 38 60 Q 32 50, 32 40 Q 32 18, 50 18 Q 68 18, 68 40 Q 68 50, 62 60 Q 80 65, 80 90 Z" className={accentColor} />
          
          {seed === 'elina' && (
            <path d="M 32 40 Q 32 20, 50 16 Q 68 20, 68 40 Q 68 28, 62 25 Q 50 21, 38 25 Q 32 28, 32 40" fill="#a855f7" fillOpacity="0.7" />
          )}
          {seed === 'laura' && (
            <path d="M 31 43 Q 22 55, 30 70 Q 36 60, 32 40 Q 64 60, 70 70 Q 78 55, 69 43" fill="#14b8a6" fillOpacity="0.6" />
          )}
          {seed === 'sara' && (
            <g>
              <circle cx="44" cy="38" r="4" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
              <circle cx="56" cy="38" r="4" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
              <line x1="48" y1="38" x2="52" y2="38" stroke="#10b981" strokeWidth="1" />
            </g>
          )}
        </svg>
      )}
      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full shadow-glow" style={{ backgroundColor: detailColor }} />
    </div>
  );
}

// Unique Dossier Number Helper
const getDossierCode = (suspectId: string): string => {
  switch (suspectId) {
    case 'elina': return 'DOSSIER #E-01';
    case 'markus': return 'DOSSIER #M-02';
    case 'laura': return 'DOSSIER #L-03';
    case 'oskari': return 'DOSSIER #O-04';
    case 'sara': return 'DOSSIER #S-05';
    default: return 'DOSSIER #X-00';
  }
};

// Suspicion Level Info
interface SuspicionInfo {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  filledBlocks: number;
  barColor: string;
  shortTag: string;
}

const getSuspicionInfo = (suspect: Suspect, state: GameState): SuspicionInfo => {
  const solvedContradictions = state.discoveredContradictions || state.ratkaistutRistiriidat || [];
  
  if (suspect.id === 'elina') {
    const hasElinaContradiction = solvedContradictions.some(cId => cId.includes('elina') || cId === 'alibi_elina');
    return {
      label: hasElinaContradiction ? '🔴 Pääepäilty • Alibi murtunut' : '🔴 Pääepäilty',
      badgeBg: 'bg-red-950/30',
      badgeText: 'text-red-900',
      badgeBorder: 'border-red-700/60',
      dotColor: 'bg-red-600 animate-pulse',
      filledBlocks: hasElinaContradiction ? 10 : 9,
      barColor: 'bg-red-700',
      shortTag: '🔴 PÄÄEPÄILTY',
    };
  }

  if (suspect.id === 'markus') {
    const hasMarkusContradiction = solvedContradictions.some(cId => cId.includes('markus'));
    return {
      label: hasMarkusContradiction ? '🔴 Kohotettu epäily' : '🟠 Tarkkailussa',
      badgeBg: hasMarkusContradiction ? 'bg-red-950/20' : 'bg-amber-950/20',
      badgeText: hasMarkusContradiction ? 'text-red-900' : 'text-amber-900',
      badgeBorder: hasMarkusContradiction ? 'border-red-700/60' : 'border-amber-700/60',
      dotColor: hasMarkusContradiction ? 'bg-red-600' : 'bg-amber-600',
      filledBlocks: hasMarkusContradiction ? 8 : 6,
      barColor: hasMarkusContradiction ? 'bg-red-700' : 'bg-amber-600',
      shortTag: hasMarkusContradiction ? '🔴 KOHOTETTU EPÄILY' : '🟠 TARKKAILUSSA',
    };
  }

  if (suspect.id === 'oskari') {
    return {
      label: '🟠 Tarkkailussa',
      badgeBg: 'bg-amber-950/20',
      badgeText: 'text-amber-900',
      badgeBorder: 'border-amber-700/60',
      dotColor: 'bg-amber-600',
      filledBlocks: 5,
      barColor: 'bg-amber-600',
      shortTag: '🟠 TARKKAILUSSA',
    };
  }

  if (suspect.id === 'laura') {
    return {
      label: '🟢 Vähäinen epäily',
      badgeBg: 'bg-emerald-950/20',
      badgeText: 'text-emerald-900',
      badgeBorder: 'border-emerald-700/60',
      dotColor: 'bg-emerald-600',
      filledBlocks: 3,
      barColor: 'bg-emerald-600',
      shortTag: '🟢 VÄHÄINEN EPÄILY',
    };
  }

  return {
    label: '🟢 Vähäinen epäily',
    badgeBg: 'bg-emerald-950/20',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-700/60',
    dotColor: 'bg-emerald-600',
    filledBlocks: 2,
    barColor: 'bg-emerald-600',
    shortTag: '🟢 VÄHÄINEN EPÄILY',
  };
};

// Handwritten Note Generator for Closed Folder Covers
const getHandwrittenNote = (suspectId: string, state: GameState): string => {
  const solvedContradictions = state.discoveredContradictions || state.ratkaistutRistiriidat || [];
  
  if (suspectId === 'elina') {
    const hasContradiction = solvedContradictions.some(cId => cId.includes('elina') || cId === 'alibi_elina');
    return hasContradiction 
      ? "🔴 ALIBI MURTUNUT! Pääepäilty ristiriidoissa." 
      : "🔴 PÄÄEPÄILTY? Tarkista alibi uudelleen!";
  }
  if (suspectId === 'markus') {
    const hasContradiction = solvedContradictions.some(cId => cId.includes('markus'));
    return hasContradiction
      ? "🔴 Kohotettu epäily! Ristiriitoja saunavaatteissa."
      : "🟠 Tarkkailussa - Kuulustele uudelleen";
  }
  if (suspectId === 'oskari') {
    return "🟠 Tarkkailussa. Seuraa venevaja-vihjeitä.";
  }
  if (suspectId === 'laura') {
    return "🟢 Vähäinen epäily. Alibi osittain vahvistettu.";
  }
  return "🟢 Vähäinen epäily. Seuraa uusia todisteita.";
};

// Discovered Clues Helper
const getDiscoveredCluesForSuspect = (suspectId: string, state: GameState): Clue[] => {
  const discoveredSet = new Set(state.discoveredClues || []);
  return CLUES.filter(clue => {
    if (!discoveredSet.has(clue.id)) return false;

    if (clue.suspectId === suspectId) return true;

    if (suspectId === 'elina' && ['repeytynyt_hiha', 'tilisiirto_elinalle', 'elinan_kengat', 'elinan_aani_tallenteella', 'auton_avaimet'].includes(clue.id)) return true;
    if (suspectId === 'markus' && ['markuksen_saunavaatteet'].includes(clue.id)) return true;
    if (suspectId === 'oskari' && ['oskarin_taskulamppu', 'venevajan_lukko'].includes(clue.id)) return true;
    if (suspectId === 'laura' && ['tekstiviesti_lauralle'].includes(clue.id)) return true;
    if (suspectId === 'sara' && ['saran_tallennin'].includes(clue.id)) return true;

    return false;
  });
};

export function SuspectList({ state, onSelectSuspect }: SuspectListProps) {
  const { tText } = useLanguage();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);

  const handleFolderClick = (suspectId: string) => {
    audioSynth.playPaperRustle();
    setSelectedSuspectId(suspectId);
  };

  const handleStartInterrogation = (suspectId: string) => {
    audioSynth.playClick();
    onSelectSuspect(suspectId);
  };

  const activeSuspect = SUSPECTS.find(s => s.id === selectedSuspectId);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8" id="suspects-list-container">
      {/* Police Department Archive Header Banner */}
      <div className="bg-[#1c1613] border-y-2 border-amber-800/60 p-4 md:p-5 rounded-xs shadow-[0_8px_20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase">
              HILJAISEN JÄRVEN POLIISI • KESKUSRIKOSPOLIISI
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              TAPAUSNUMERO: HJ-2026-071
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500 shrink-0" />
            Rikostutkinnan Henkilötiedostot
          </h3>
          <p className="text-xs font-sans text-stone-400 max-w-3xl leading-relaxed">
            Poliisin virallinen tutkinta-arkisto. Valitse epäillyn tutkintakansio tutkiaksesi henkilödossieria, alibeja ja todisteita.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-black/40 p-3 rounded border border-stone-800">
          <ShieldCheck className="w-8 h-8 text-amber-600/80 shrink-0" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Tutkintakansiot</div>
            <div className="text-base font-bold text-amber-200">5 Arkistoitua Kansiota</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedSuspectId || !activeSuspect ? (
          /* 1. SULJETTUJEN KANSIOIEN NÄKYMÄ (ARCHIVE DESK WITH CLOSED FILE FOLDERS) */
          <motion.div
            key="folders-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-600" />
                VALITSE EPÄILLYN TUTKINTAKANSIO (5)
              </span>
              <span className="text-[11px] font-mono text-amber-600/80 italic">
                Klikkaa kansiota avataksesi dossierin
              </span>
            </div>

            {/* Grid of Closed Folder Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SUSPECTS.map((suspect) => {
                const dossierCode = getDossierCode(suspect.id);
                const suspicion = getSuspicionInfo(suspect, state);
                const noteText = getHandwrittenNote(suspect.id, state);

                const completedTopics = state.completedDialogueTopics[suspect.id] || [];
                const unlockedTopics = state.unlockedDialogueTopics[suspect.id] || [];
                const progressPercent = unlockedTopics.length > 0
                  ? Math.round((completedTopics.length / unlockedTopics.length) * 100)
                  : 0;

                return (
                  <motion.div
                    key={suspect.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleFolderClick(suspect.id)}
                    className="relative cursor-pointer group select-none pt-4"
                    id={`folder-card-${suspect.id}`}
                  >
                    {/* Folder Top Tab */}
                    <div className="absolute top-0 left-6 h-5 px-3 bg-[#c7b79a] border-t-2 border-x-2 border-[#423225] rounded-t-sm flex items-center shadow-xs z-10 group-hover:bg-[#d8c7a9] transition-colors">
                      <span className="text-[9px] font-mono font-black text-[#2e2118] tracking-widest uppercase">
                        {dossierCode}
                      </span>
                    </div>

                    {/* Main Closed Folder Cover Body */}
                    <div className="bg-[#d5c5a7] text-[#241a12] rounded-xs border-2 border-[#423225] p-5 md:p-6 shadow-[0_12px_24px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300 group-hover:border-amber-600 group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.9),_0_0_20px_rgba(217,119,6,0.2)]">
                      {/* Left Metal Spine / Binder Strip */}
                      <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#2b1f17] border-r border-[#1a120c] flex flex-col justify-between py-6 items-center pointer-events-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-500 shadow-inner" />
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-500 shadow-inner" />
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-500 shadow-inner" />
                      </div>

                      {/* Paperclip Accent Top Left */}
                      <div className="absolute top-2 left-6 z-20 pointer-events-none drop-shadow">
                        <svg className="w-4 h-8 text-stone-600" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M8 8v16a4 4 0 008 0V6a3 3 0 00-6 0v16a1 1 0 002 0V10" />
                        </svg>
                      </div>

                      {/* Coffee Ring Stain Subtle Detail */}
                      <div className="absolute -bottom-6 -right-6 w-28 h-28 border-4 border-amber-900/10 rounded-full pointer-events-none select-none blur-[0.5px]" />

                      {/* Fingerprint Watermark */}
                      <div className="absolute top-12 right-4 w-32 h-32 opacity-[0.04] pointer-events-none text-stone-900 select-none">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                          <path d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 Z M50 20 A30 30 0 0 1 80 50 A30 30 0 0 1 50 80 A30 30 0 0 1 20 50 A30 30 0 0 1 50 20 Z M50 30 A20 20 0 0 1 70 50 A20 20 0 0 1 50 70 A20 20 0 0 1 30 50 A20 20 0 0 1 50 30 Z" />
                        </svg>
                      </div>

                      {/* Red Confidential Ink Stamp */}
                      <div className="absolute top-4 right-4 border-2 border-red-800/80 text-red-900 font-mono text-[8.5px] font-black tracking-widest px-2 py-0.5 rotate-[-7deg] uppercase opacity-85 pointer-events-none bg-red-100/40 rounded-2xs shadow-2xs">
                        LUOTTAMUKSELLINEN
                      </div>

                      {/* Folder Content Information */}
                      <div className="pl-4 space-y-4">
                        {/* Header Official Police Labels */}
                        <div className="border-b border-[#a8987b] pb-3 space-y-0.5">
                          <div className="text-[9px] font-mono font-extrabold text-[#524133] uppercase tracking-widest">
                            HILJAISEN JÄRVEN POLIISI
                          </div>
                          <div className="text-[8px] font-mono text-[#6e5847] uppercase tracking-wider">
                            KESKUSRIKOSPOLIISI • TAPAUS: MURHA MÖKILLÄ
                          </div>
                          <div className="text-[8.5px] font-mono text-[#382b20] font-bold">
                            TAPAUSNUMERO: HJ-2026-071
                          </div>
                        </div>

                        {/* Folder Subject / Suspect Main Name */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold text-[#635041] uppercase tracking-widest block">
                            HENKILÖDOSSIERI • EPÄILTY
                          </span>
                          <h4 className="text-xl md:text-2xl font-serif font-extrabold text-[#1f160f] tracking-tight group-hover:text-amber-950 transition-colors">
                            {suspect.name}
                          </h4>
                          <p className="text-[10.5px] font-mono font-bold text-[#4a392b] uppercase tracking-wider">
                            {suspect.age} VUOTTA • {tText(suspect.role)}
                          </p>
                        </div>

                        {/* Handwritten Investigator Note on Folder Cover */}
                        <div className="bg-[#ebdcc0]/90 border-l-3 border-amber-900/70 p-2.5 rounded-r shadow-2xs relative my-2">
                          <span className="text-[8.5px] font-mono font-extrabold text-[#5c4737] uppercase tracking-widest block mb-0.5">
                            TUTKIJAN HUOMAUTUS:
                          </span>
                          <p className="text-xs font-serif italic font-bold text-red-900 leading-snug">
                            "{noteText}"
                          </p>
                        </div>

                        {/* Suspicion Level Badge & Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-[#4d3c2f]">
                            <span>EPÄILYTASO:</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9.5px] border ${suspicion.badgeBg} ${suspicion.badgeText} ${suspicion.badgeBorder}`}>
                              {suspicion.shortTag}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-[#b8a789] h-1.5 rounded-xs overflow-hidden border border-[#948366]">
                            <div
                              className={`h-full ${suspicion.barColor}`}
                              style={{ width: `${suspicion.filledBlocks * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Bottom Open Folder Prompt Button */}
                        <div className="pt-3 border-t border-[#a8987b] flex items-center justify-between text-xs font-mono font-bold text-[#2e2118]">
                          <span className="text-[10px] text-[#5e4b3c]">
                            Kuulusteltu: {completedTopics.length}/{unlockedTopics.length}
                          </span>
                          <span className="text-amber-900 group-hover:text-amber-950 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Avaa henkilödossieri →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* 2. AVOIN HENKILÖDOSSIERI (OPEN DETAILED DOSSIER VIEW)                       */
          /* ========================================================================= */
          <motion.div
            key={`open-dossier-${activeSuspect.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Top Navigation & Quick Switch Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e1713] p-3.5 rounded-xs border border-stone-800 shadow-md">
              <button
                onClick={() => {
                  audioSynth.playPaperRustle();
                  setSelectedSuspectId(null);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer hover:text-amber-400 group"
                id="btn-back-to-folders"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-500" />
                <span>Takaisin kansioihin</span>
              </button>

              {/* Quick Switch Suspect Dossiers */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mr-1 hidden md:inline">
                  Vaihda kansiota:
                </span>
                {SUSPECTS.map(s => {
                  const isActive = s.id === activeSuspect.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleFolderClick(s.id)}
                      className={`px-2.5 py-1 text-[10.5px] font-mono font-bold rounded-2xs border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-900/80 border-amber-500 text-amber-100 shadow-2xs'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Large 2-Page Spread Open Folder Container */}
            <div className="bg-[#f2ece1] text-[#241a12] rounded-xs border-4 border-[#3e2e23] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden select-none">
              {/* Corner Brass Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-900/80 pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-900/80 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-900/80 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-900/80 pointer-events-none" />

              {/* Metallic Paperclip Accent */}
              <div className="absolute -top-3 left-8 z-20 pointer-events-none drop-shadow-md">
                <svg className="w-5 h-10 text-stone-600" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 8v16a4 4 0 008 0V6a3 3 0 00-6 0v16a1 1 0 002 0V10" />
                </svg>
              </div>

              {/* Red Confidential Stamp */}
              <div className="absolute top-4 right-6 border-2 border-red-800/80 text-red-900 font-mono text-[9px] font-black tracking-widest px-2.5 py-0.5 rotate-[-5deg] uppercase opacity-85 select-none pointer-events-none bg-red-100/40 rounded-xs shadow-2xs">
                VIRALLINEN DOSSIERI • LUOTTAMUKSELLINEN
              </div>

              {/* Center Crease Effect for Desktop 2-Page Book Spread */}
              <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/5 via-black/15 to-black/5 pointer-events-none" />

              {/* 2-Page Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                {/* PAGE 1 (LEFT): Photo, Personal Details, Suspicion & Motive */}
                <div className="space-y-5 lg:pr-4 lg:border-r lg:border-stone-300/80">
                  {/* Page 1 Header */}
                  <div className="border-b border-stone-300 pb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono font-extrabold text-stone-700 uppercase tracking-widest">
                        HILJAISEN JÄRVEN POLIISI • SIVU 1
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-stone-900 bg-stone-200 px-2 py-0.5 rounded border border-stone-300">
                        {getDossierCode(activeSuspect.id)}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                      HENKILÖDOSSIER & TUTKINTATIEDOT
                    </p>
                  </div>

                  {/* Character Mugshot & Personal Details */}
                  <div className="flex gap-4 items-start">
                    <div className="relative shrink-0">
                      <div className="p-1.5 bg-[#faf8f5] border border-stone-300 shadow-sm rounded-xs relative">
                        <div className="absolute -top-1.5 -right-1.5 w-7 h-3 bg-amber-100/90 border-y border-amber-300/90 rotate-[14deg] shadow-2xs pointer-events-none z-10" />
                        <CharacterPortrait seed={activeSuspect.portraitSvgSeed} className="w-24 h-24 md:w-28 md:h-28" />
                        <div className="mt-1 text-center bg-stone-200/80 py-0.5 rounded-2xs border border-stone-300/60">
                          <span className="text-[8px] font-mono font-bold text-stone-800 tracking-widest block uppercase">
                            REKISTERIKUVA
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div>
                        <h3 className="text-2xl font-serif font-extrabold text-stone-900 tracking-tight leading-tight">
                          {activeSuspect.name}
                        </h3>
                        <p className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider mt-0.5">
                          {activeSuspect.age} VUOTTA • {tText(activeSuspect.role)}
                        </p>
                      </div>

                      {/* Suspicion Level Badge */}
                      {(() => {
                        const suspicion = getSuspicionInfo(activeSuspect, state);
                        return (
                          <div className="pt-1">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold shadow-2xs ${suspicion.badgeBg} ${suspicion.badgeText} ${suspicion.badgeBorder}`}>
                              <span className={`w-2 h-2 rounded-full ${suspicion.dotColor}`} />
                              <span>{suspicion.label.toUpperCase()}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Suspicion Bar Block */}
                  {(() => {
                    const suspicion = getSuspicionInfo(activeSuspect, state);
                    return (
                      <div className="bg-[#e8dec7] p-3 rounded border border-[#d3c4a3] space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-800">
                          <span className="uppercase tracking-widest flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-amber-900" />
                            EPÄILYTASO
                          </span>
                          <span className="text-stone-900 font-extrabold font-mono text-xs">
                            {suspicion.filledBlocks * 10}%
                          </span>
                        </div>

                        <div className="flex gap-1 h-3.5 pt-0.5">
                          {Array.from({ length: 10 }).map((_, i) => {
                            const isFilled = i < suspicion.filledBlocks;
                            return (
                              <div
                                key={i}
                                className={`flex-1 rounded-2xs transition-colors duration-300 ${
                                  isFilled
                                    ? `${suspicion.barColor} border border-stone-900/30 shadow-2xs`
                                    : 'bg-stone-300/60 border border-stone-300'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Motive Box */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-800" />
                      MOTIIVI
                    </span>
                    <div className="bg-[#faf6eb] p-3 rounded border border-stone-300 text-xs text-stone-800 font-sans leading-relaxed shadow-2xs">
                      {tText(activeSuspect.motive)}
                    </div>
                  </div>

                  {/* Character Description Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest">
                      TAUSTATIEDOT & LUONNE
                    </span>
                    <p className="text-xs text-stone-700 font-sans leading-relaxed">
                      {tText(activeSuspect.description)}
                    </p>
                  </div>
                </div>

                {/* PAGE 2 (RIGHT): Alibi, Evidence, Progress, Interrogation Button */}
                <div className="space-y-5 flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* Page 2 Header */}
                    <div className="border-b border-stone-300 pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-mono font-extrabold text-stone-700 uppercase tracking-widest">
                          HILJAISEN JÄRVEN POLIISI • SIVU 2
                        </span>
                        <span className="text-[10px] font-mono text-stone-600">
                          LAUSUNNOT & TODISTEET
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                        VIRALLINEN ALIBI JA KYTKEYTYVÄT REAALITODISTEET
                      </p>
                    </div>

                    {/* Official Alibi */}
                    <div className="bg-[#ebdcc0] border-l-4 border-amber-900/90 p-3.5 rounded-r text-stone-900 text-xs shadow-2xs space-y-1 relative">
                      <span className="font-sans font-extrabold text-[9.5px] font-mono uppercase tracking-widest text-amber-950 block">
                        VIRALLINEN ALIBI:
                      </span>
                      <p className="font-serif italic text-stone-900 text-xs md:text-sm leading-relaxed">
                        "{tText(activeSuspect.alibi)}"
                      </p>
                    </div>

                    {/* Discovered Clues for Suspect */}
                    {(() => {
                      const discoveredClues = getDiscoveredCluesForSuspect(activeSuspect.id, state);
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-stone-700 uppercase tracking-widest">
                            <span>LIITTYVÄT LÖYDETYT TODISTEET ({discoveredClues.length})</span>
                          </div>

                          {discoveredClues.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {discoveredClues.map(clue => (
                                <span
                                  key={clue.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e3d7ba] border border-[#cebf9c] text-stone-900 text-xs font-semibold font-sans shadow-2xs"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 stroke-[3]" />
                                  <span>{tText(clue.name)}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-[#faf6eb]/80 p-3 rounded border border-stone-300/80 text-xs text-stone-500 italic font-serif">
                              Ei vielä kytkettyjä todisteita tähän epäiltyyn. Etsi johtolankoja rikospaikalta.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Interrogation Progress */}
                    {(() => {
                      const completedTopics = state.completedDialogueTopics[activeSuspect.id] || [];
                      const unlockedTopics = state.unlockedDialogueTopics[activeSuspect.id] || [];
                      const progressPercent = unlockedTopics.length > 0
                        ? Math.round((completedTopics.length / unlockedTopics.length) * 100)
                        : 0;

                      return (
                        <div className="bg-[#e8dec7] p-3.5 rounded border border-[#d3c4a3] space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-800 uppercase tracking-wider">
                            <span>KUULUSTELUN ETENEMINEN</span>
                            <span className="text-stone-900 font-extrabold">
                              {completedTopics.length} / {unlockedTopics.length} AIHETTA KÄSITELTY ({progressPercent}%)
                            </span>
                          </div>

                          <div className="w-full bg-stone-300/90 h-2.5 rounded-xs overflow-hidden border border-stone-400/60 p-0.5">
                            <div
                              className="bg-amber-800 h-full rounded-2xs transition-all duration-500 shadow-2xs"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Primary Action Button to Interrogate */}
                  {(() => {
                    const completedTopics = state.completedDialogueTopics[activeSuspect.id] || [];
                    const isStarted = completedTopics.length > 0;

                    return (
                      <div className="pt-4 border-t border-stone-300 space-y-2">
                        <button
                          onClick={() => handleStartInterrogation(activeSuspect.id)}
                          className="w-full py-3 px-5 bg-stone-900 hover:bg-stone-800 border-2 border-stone-700 hover:border-amber-500 text-stone-100 hover:text-amber-300 font-mono text-sm font-extrabold rounded-xs shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group/btn"
                          id={`btn-start-interrogation-${activeSuspect.id}`}
                        >
                          <MessageSquare className="w-5 h-5 text-amber-500 group-hover/btn:scale-110 transition-transform" />
                          <span>{isStarted ? 'JATKA KUULUSTELUA' : 'ALOITA KUULUSTELU'}</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SuspectList;
