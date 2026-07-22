import { GameState } from '../../types/game';
import { Volume2, VolumeX, ShieldAlert, Award, FileText, Settings as SettingsIcon } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

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
  const { t } = useLanguage();

  const getPhaseLabel = () => {
    switch (state.currentPhase) {
      case 'PROLOGUE':
        return t('general.phases.prologue');
      case 'VAIHE1':
        return t('general.phases.phase1');
      case 'VAIHE2':
        return t('general.phases.phase2');
      case 'VAIHE3':
        return t('general.phases.phase3');
      case 'ACCUSATION':
        return t('general.phases.accusation');
      case 'ENDING':
        return t('general.phases.ending');
      default:
        return t('general.phases.ongoing');
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
    <header 
      className="bg-black/35 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-1.5 md:py-2 flex flex-row items-center justify-between gap-3 md:gap-6 sticky top-0 z-30" 
      style={{ 
        paddingTop: 'calc(0.5rem + env(safe-area-inset-top, 0px))',
        paddingLeft: 'calc(0.75rem + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(0.75rem + env(safe-area-inset-right, 0px))'
      }} 
      id="game-header"
    >
      {/* Brand Title */}
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
        <div className="p-1 md:p-1.5 bg-amber-950/60 border border-amber-700/40 rounded-md">
          <ShieldAlert className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm md:text-lg font-serif italic text-amber-500 font-bold tracking-tight leading-none uppercase">
            <span className="hidden sm:inline">{t('intro.gameTitle')} {t('intro.gameTitleSub')}</span>
            <span className="sm:hidden">Hiljainen Järvi</span>
          </h1>
          <p className="text-[7px] md:text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-0.5 hidden xs:block">
            V1.0.42_INVESTIGATION
          </p>
        </div>
      </div>

      {/* Stats and Badges */}
      <div className="flex items-center justify-end md:justify-center gap-1.5 md:gap-5 flex-1 md:flex-initial">
        {/* Phase Badge */}
        <span className={`px-1.5 md:px-2.5 py-0.5 text-[8px] md:text-xs font-sans font-medium border rounded-full whitespace-nowrap ${getPhaseColor()}`}>
          {getPhaseLabel()}
        </span>

        {/* Clues Count */}
        <div className="flex items-center gap-1 md:gap-2 text-[9px] md:text-xs font-mono text-slate-400 bg-slate-900/60 border border-white/5 px-1.5 md:px-3 py-0.5 md:py-1 rounded shrink-0">
          <FileText className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-500" />
          <span className="hidden md:inline">{t('navigation.evidence')}:</span>
          <span className="font-bold text-amber-500">
            {state.discoveredClues.length}/{totalCluesCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1 md:gap-3 bg-slate-900/60 border border-white/5 px-1.5 md:px-3 py-0.5 md:py-1 rounded shrink-0">
          <Award className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-500" />
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 hidden md:inline">{t('general.progress')}:</span>
          <div className="w-12 sm:w-20 md:w-32 bg-white/10 h-1 md:h-1.5 rounded overflow-hidden hidden md:block">
            <div
              className="bg-amber-500 h-full transition-all duration-500 shadow-[0_0_8px_rgba(217,119,6,0.5)]"
              style={{ width: `${Math.min(100, completionPercentage)}%` }}
            />
          </div>
          <span className="text-[9px] md:text-xs font-mono font-bold text-zinc-200">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleToggleMusic}
          className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer hidden md:flex ${
            state.settings.musicOn
              ? 'bg-amber-950/20 border-amber-600/30 text-amber-400 hover:bg-amber-950/40'
              : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-900'
          }`}
          title={state.settings.musicOn ? t('general.muteSounds') : t('general.unmuteSounds')}
          id="btn-toggle-music"
        >
          {state.settings.musicOn ? <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono text-[10px] uppercase">{t('general.sound')}</span>
        </button>

        <button
          onClick={handleToggleSound}
          className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer hidden md:flex ${
            state.settings.soundOn
              ? 'bg-amber-950/20 border-amber-600/30 text-amber-400 hover:bg-amber-950/40'
              : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-900'
          }`}
          title={state.settings.soundOn ? t('general.muteEffects') : t('general.unmuteEffects')}
          id="btn-toggle-sound"
        >
          {state.settings.soundOn ? <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono text-[10px] uppercase">{t('general.effects')}</span>
        </button>

        <button
          onClick={handleOpenSettings}
          className="w-11 h-11 bg-slate-900/60 border border-white/10 hover:border-amber-600/50 text-slate-400 hover:text-amber-500 rounded transition-colors cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
          title={t('general.settings')}
          id="btn-settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
