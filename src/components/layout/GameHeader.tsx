import { GameState } from '../../types/game';
import { Volume2, VolumeX, ShieldAlert, Award, FileText, Settings as SettingsIcon } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface GameHeaderProps {
  state: GameState;
  completionPercentage: number;
  totalCluesCount: number;
  onToggleMusic: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export function GameHeader({
  state,
  completionPercentage,
  totalCluesCount,
  onToggleMusic,
  onToggleSound,
  onOpenSettings,
}: GameHeaderProps) {
  const getPhaseLabel = () => {
    switch (state.currentPhase) {
      case 'PROLOGUE':
        return 'Prologi';
      case 'VAIHE1':
        return 'Vaihe 1: Alkututkinta';
      case 'VAIHE2':
        return 'Vaihe 2: Salaisuudet';
      case 'VAIHE3':
        return 'Vaihe 3: Todisteet';
      case 'ACCUSATION':
        return 'Syytösvaihe';
      case 'ENDING':
        return 'Loppuratkaisu';
      default:
        return 'Tutkinta käynnissä';
    }
  };

  const getPhaseColor = () => {
    switch (state.currentPhase) {
      case 'PROLOGUE':
        return 'bg-blue-950/80 border-blue-500/30 text-blue-400';
      case 'VAIHE1':
        return 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400';
      case 'VAIHE2':
        return 'bg-amber-950/80 border-amber-500/30 text-amber-400';
      case 'VAIHE3':
        return 'bg-rose-950/80 border-rose-500/30 text-rose-400';
      case 'ACCUSATION':
        return 'bg-red-950/80 border-red-500/30 text-red-400';
      case 'ENDING':
        return 'bg-violet-950/80 border-violet-500/30 text-violet-400';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  const handleToggleMusic = () => {
    audioSynth.playClick();
    onToggleMusic();
  };

  const handleToggleSound = () => {
    audioSynth.playClick();
    onToggleSound();
  };

  const handleOpenSettings = () => {
    audioSynth.playClick();
    onOpenSettings();
  };

  return (
    <header className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30" id="game-header">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-amber-950/60 border border-amber-700/40 rounded-md">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-lg font-serif italic text-amber-500 font-bold tracking-tight leading-none uppercase">
            Hiljaisen järven salaisuus
          </h1>
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-0.5">
            V1.0.42_INVESTIGATION
          </p>
        </div>
      </div>

      {/* Stats and Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
        {/* Phase Badge */}
        <span className={`px-2.5 py-0.5 text-xs font-sans font-medium border rounded-full ${getPhaseColor()}`}>
          {getPhaseLabel()}
        </span>

        {/* Clues Count */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1 rounded">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Johtolangat:</span>
          <span className="font-bold text-amber-500">
            {state.discoveredClues.length}/{totalCluesCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 px-3 py-1 rounded">
          <Award className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Eteneminen:</span>
          <div className="w-20 md:w-32 bg-white/10 h-1.5 rounded overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500 shadow-[0_0_8px_rgba(217,119,6,0.5)]"
              style={{ width: `${Math.min(100, completionPercentage)}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-zinc-200">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleMusic}
          className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            state.settings.musicOn
              ? 'bg-amber-950/20 border-amber-600/30 text-amber-400 hover:bg-amber-950/40'
              : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-900'
          }`}
          title={state.settings.musicOn ? 'Mykistä taustaäänet' : 'Ota taustaäänet käyttöön'}
          id="btn-toggle-music"
        >
          {state.settings.musicOn ? <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono text-[10px] uppercase">Äänet</span>
        </button>

        <button
          onClick={handleToggleSound}
          className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            state.settings.soundOn
              ? 'bg-amber-950/20 border-amber-600/30 text-amber-400 hover:bg-amber-950/40'
              : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-900'
          }`}
          title={state.settings.soundOn ? 'Mykistä tehosteet' : 'Ota tehosteet käyttöön'}
          id="btn-toggle-sound"
        >
          {state.settings.soundOn ? <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono text-[10px] uppercase">Efektit</span>
        </button>

        <button
          onClick={handleOpenSettings}
          className="p-2 bg-slate-900/60 border border-white/10 hover:border-amber-600/50 text-slate-400 hover:text-amber-500 rounded transition-colors cursor-pointer"
          title="Asetukset"
          id="btn-settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
