import { useState, useEffect, useRef } from 'react';
import { GameState } from '../../types/game';
import { Play, RotateCcw, HelpCircle, Award, ArrowRight, Settings } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';
import { LanguageSelector } from '../ui/LanguageSelector';

interface MainMenuProps {
  state: GameState;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenSettings: () => void;
}

export function MainMenu({ state, onNewGame, onContinueGame, onOpenSettings }: MainMenuProps) {
  const { t } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const hasSaveGame = state.visitedLocations.length > 0 || state.discoveredClues.length > 0 || state.currentPhase !== 'PROLOGUE';

  const isReducedMotion = state.settings.reducedMotion;

  // Handle main menu background ambient music
  useEffect(() => {
    if (isTransitioning) return;

    // Only play if music setting is enabled
    if (state.settings.musicOn) {
      audioSynth.startMainMenuMusic();
    }

    const startAudioOnInteraction = () => {
      if (state.settings.musicOn && !isTransitioning) {
        audioSynth.startMainMenuMusic();
      }
      // Remove listeners once sound starts playing
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('mousemove', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('mousemove', startAudioOnInteraction);
    window.addEventListener('keydown', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);

    return () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('mousemove', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
      audioSynth.stopMainMenuMusic();
    };
  }, [state.settings.musicOn, isTransitioning]);

  // Handle weather/lightning atmospheric timers, immediately cancellable upon transition
  useEffect(() => {
    if (isTransitioning || isFadingOut) {
      setIsFlashActive(false);
      return;
    }

    let lightningTimer: NodeJS.Timeout | null = null;
    let thunderTimer: NodeJS.Timeout | null = null;
    let flashOffTimer: NodeJS.Timeout | null = null;
    let active = true;

    const triggerLightning = () => {
      if (!active || isTransitioning || isFadingOut) return;

      // 1. Trigger the visual flash
      setIsFlashActive(true);
      
      // Flash duration: random 150-250ms
      const flashDuration = 150 + Math.random() * 100;
      flashOffTimer = setTimeout(() => {
        setIsFlashActive(false);
      }, flashDuration);

      // 2. Play corresponding deep thunder sound after a random 1-3 seconds delay
      const thunderDelay = 1000 + Math.random() * 2000;
      thunderTimer = setTimeout(() => {
        if (!active || isTransitioning || isFadingOut) return;
        if (state.settings.soundOn) {
          audioSynth.triggerDynamicThunder();
        }
      }, thunderDelay);

      // 3. Schedule next lightning flash in 20-45 seconds
      const nextInterval = 20000 + Math.random() * 25000;
      lightningTimer = setTimeout(triggerLightning, nextInterval);
    };

    // First lightning flash after a brief warm-up (12-25 seconds after opening menu)
    const initialDelay = 12000 + Math.random() * 13000;
    lightningTimer = setTimeout(triggerLightning, initialDelay);

    return () => {
      active = false;
      if (lightningTimer) clearTimeout(lightningTimer);
      if (thunderTimer) clearTimeout(thunderTimer);
      if (flashOffTimer) clearTimeout(flashOffTimer);
    };
  }, [state.settings.soundOn, isTransitioning, isFadingOut]);

  // Refined double-click-safe rapid launch sequence (600ms - 900ms fadeout, silent transition)
  const handleStartNewGame = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFadingOut(true);
    setIsFlashActive(false);

    audioSynth.fadeAndStopMainMenuMusic();

    // Exactly 800ms fadeout sequence (conforms to the 600-900ms requirement)
    setTimeout(() => {
      onNewGame();
    }, 800);
  };

  const handleContinueGame = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFadingOut(true);
    setIsFlashActive(false);

    audioSynth.fadeAndStopMainMenuMusic();

    // Exactly 800ms fadeout sequence (conforms to the 600-900ms requirement)
    setTimeout(() => {
      onContinueGame();
    }, 800);
  };

  const handleNewGameClick = () => {
    if (isTransitioning) return;
    audioSynth.playClick();
    if (hasSaveGame) {
      setShowConfirmReset(true);
    } else {
      handleStartNewGame();
    }
  };

  const confirmNewGame = () => {
    if (isTransitioning) return;
    setShowConfirmReset(false);
    handleStartNewGame();
  };

  const cancelNewGame = () => {
    if (isTransitioning) return;
    audioSynth.playClick();
    setShowConfirmReset(false);
  };

  const handleInfoToggle = () => {
    if (isTransitioning) return;
    audioSynth.playClick();
    setShowInfo(!showInfo);
  };

  // Unified elegant class generator for primary action buttons
  const getPrimaryButtonClasses = () => {
    const base = `
      relative group w-full py-4 px-8 
      bg-zinc-950/80 backdrop-blur-sm 
      border text-amber-500 font-serif text-sm tracking-widest font-bold rounded 
      shadow-[inset_0_0_10px_rgba(198,146,20,0.08)]
      cursor-pointer flex items-center justify-center gap-3
      disabled:opacity-50 disabled:pointer-events-none
    `.trim();

    if (isTransitioning) {
      return `${base} border-amber-600/30 scale-98 opacity-90 transition-all duration-200`;
    }

    if (isReducedMotion) {
      return `${base} border-amber-600 hover:border-amber-400 hover:text-amber-400 active:scale-95 transition-colors duration-200`;
    }

    return `
      ${base} 
      border-amber-600/60 hover:border-amber-400 hover:text-amber-400 
      button-pulse-effect hover:scale-[1.018] active:scale-95
      hover:shadow-[inset_0_0_15px_rgba(198,146,20,0.15),0_0_22px_rgba(198,146,20,0.25)]
      transition-all duration-[250ms]
    `.trim();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 relative overflow-hidden" id="main-menu-container">
      {/* Background image & dark overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center transition-transform duration-10000 scale-105" 
        style={{ backgroundImage: 'url("/images/ui/main-menu-background.png")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-0" />

      {/* Top Right Language Selector */}
      <div className="absolute top-6 right-6 z-30 animate-fade-in" id="main-menu-lang-selector">
        <LanguageSelector />
      </div>

      {/* Atmospheric dynamic weather effects */}
      <div className="rain-overlay opacity-30" />
      
      {/* Two-layer cinema fog: Back (large, super slow) and Front (thin, slightly faster, bottom-focused) */}
      <div className="back-fog" />
      <div className="front-fog" />

      {/* Dynamic Lightning overlay reflecting environmental flashes */}
      <div className="lightning-overlay" style={{
        animation: isFlashActive ? 'single-lightning-flash 200ms cubic-bezier(0.15, 0.85, 0.35, 1) forwards' : 'none',
        pointerEvents: 'none'
      }} />

      {/* High-quality 800ms Fade-to-Dark Overlay during investigative transition */}
      <div 
        className={`fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-[800ms] ease-in-out ${
          isFadingOut ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Header Decorator - MURHAMYSTEERI MÖKILLÄ (Clearly enhanced hierarchy) */}
      <div className="w-full relative z-10 flex justify-center py-6 sm:py-8">
        <div className={`flex items-center gap-4 text-xs sm:text-sm font-serif text-amber-500/90 uppercase tracking-[0.3em] sm:tracking-[0.4em] drop-shadow-[0_2px_8px_rgba(198,146,20,0.45)] select-none transition-all duration-[200ms] ${
          isFlashActive ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,1)] scale-[1.01]' : ''
        }`}>
          <span className={`w-16 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent to-amber-500/80 transition-all duration-[200ms] ${
            isFlashActive ? 'to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : ''
          }`} />
          <span className="font-bold">{t('intro.cabinMystery')}</span>
          <span className={`w-16 sm:w-24 h-[1.5px] bg-gradient-to-l from-transparent to-amber-500/80 transition-all duration-[200ms] ${
            isFlashActive ? 'to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : ''
          }`} />
        </div>
      </div>

      {/* Main content layout */}
      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center justify-center flex-1 my-4 sm:my-12 text-center">
        {!showInfo ? (
          <div className="flex flex-col items-center max-w-2xl w-full">
            {/* Main Epic Title Block - Lightning Reactiveness */}
            <div className="space-y-3 mb-8 w-full">
              <h1 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-[0.05em] sm:tracking-[0.1em] text-slate-100 drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)] uppercase select-none transition-all duration-[200ms] ${
                isFlashActive ? 'text-white brightness-125 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] font-bold' : ''
              }`}>
                {t('intro.gameTitle')}
              </h1>
              <h1 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.12em] sm:tracking-[0.2em] text-slate-100/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] uppercase select-none mt-1 transition-all duration-[200ms] ${
                isFlashActive ? 'text-white brightness-125 drop-shadow-[0_0_18px_rgba(255,255,255,0.5)] font-bold' : ''
              }`}>
                {t('intro.gameTitleSub')}
              </h1>
              
              {/* Cinematic Subtitle */}
              <div className="pt-4 sm:pt-6 pb-2">
                <p className="text-xs sm:text-base italic font-serif text-zinc-400 drop-shadow-md select-none">
                  {t('intro.quote')}
                </p>
              </div>
            </div>

            {/* Main Interactive Button Box */}
            <div className="w-full max-w-sm space-y-4 pt-2 animate-scale-up">
              {hasSaveGame ? (
                <div className="space-y-4">
                  {/* Primary Continue Game Button */}
                  <button
                    onClick={handleContinueGame}
                    disabled={isTransitioning}
                    className={getPrimaryButtonClasses()}
                    id="btn-continue-game"
                  >
                    <Play className={`w-4 h-4 fill-amber-500 text-amber-500 ${
                      !isReducedMotion ? 'group-hover:translate-x-1 transition-transform duration-250' : ''
                    }`} />
                    <span>{t('intro.continueInvestigation')}</span>
                  </button>

                  {/* Secondary New Game Button */}
                  <button
                    onClick={handleNewGameClick}
                    disabled={isTransitioning}
                    className="w-full py-2.5 px-6 bg-transparent hover:bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 font-sans text-xs tracking-wider font-semibold rounded hover:scale-[1.01] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    id="btn-new-game"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('intro.startNew')}</span>
                  </button>
                </div>
              ) : (
                /* Primary Play Button */
                <button
                  onClick={handleNewGameClick}
                  disabled={isTransitioning}
                  className={getPrimaryButtonClasses()}
                  id="btn-start-investigation"
                >
                  <Play className={`w-4 h-4 fill-amber-500 text-amber-500 ${
                    !isReducedMotion ? 'group-hover:translate-x-1 transition-transform duration-250' : ''
                  }`} />
                  <span>{t('intro.startInvestigation')}</span>
                </button>
              )}

              {/* Utility Submenu Shortcuts Row with high visual standards */}
              <div className="flex justify-center gap-6 pt-6 text-xs text-zinc-400">
                <button
                  onClick={handleInfoToggle}
                  disabled={isTransitioning}
                  className="hover:text-amber-400 text-zinc-300 active:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 p-2.5 rounded transition-all duration-200 cursor-pointer flex items-center gap-2 font-sans tracking-wide disabled:opacity-50"
                  id="btn-about-game"
                >
                  <HelpCircle className="w-4 h-4 text-zinc-400 hover:text-amber-400 transition-colors" />
                  <span>{t('intro.aboutGame')}</span>
                </button>

                <button
                  onClick={onOpenSettings}
                  disabled={isTransitioning}
                  className="hover:text-amber-400 text-zinc-300 active:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 p-2.5 rounded transition-all duration-200 cursor-pointer flex items-center gap-2 font-sans tracking-wide disabled:opacity-50"
                  id="btn-main-settings"
                >
                  <Settings className="w-4 h-4 text-zinc-400 hover:text-amber-400 transition-colors" />
                  <span>{t('intro.settings')}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Info display card with matching high standards */
          <div className="w-full max-w-lg bg-zinc-950/90 border border-zinc-800/80 p-8 rounded-lg backdrop-blur-md shadow-2xl space-y-5 animate-scale-up text-left">
            <h3 className="text-xl font-serif text-amber-500 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              {t('intro.aboutTitle')}
            </h3>
            
            <div className="space-y-4 text-sm text-zinc-400 font-sans leading-relaxed">
              <p>
                {t('intro.aboutParagraph1')}
              </p>
              <p>
                {t('intro.aboutParagraph2')}
              </p>
              <p>
                {t('intro.aboutParagraph3')}
              </p>
              <div className="border-t border-zinc-900 pt-4 space-y-2">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">{t('intro.howToPlay')}</span>
                <ul className="list-disc pl-5 text-xs space-y-1.5 text-zinc-400">
                  <li>{t('intro.rule1')}</li>
                  <li>{t('intro.rule2')}</li>
                  <li>{t('intro.rule3')}</li>
                  <li>{t('intro.rule4')}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleInfoToggle}
              className="w-full mt-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-sans text-xs font-semibold rounded border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('intro.backToMenu')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info / Credits */}
      <div className="w-full relative z-10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-600 font-mono tracking-wider pt-4 border-t border-zinc-900/40">
        <p>© 2026 Hiljaisen Järven Salaisuus • MIT-lisenssi</p>
        <p className="mt-1 sm:mt-0">React + TypeScript + Tailwind CSS</p>
      </div>

      {/* Confirmation Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="reset-confirm-modal-overlay">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded p-6 shadow-2xl text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/40 border border-red-800/35 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-serif italic font-bold text-slate-100">
                {t('intro.confirmNewGame')}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {t('intro.confirmNewGameDesc')}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelNewGame}
                className="flex-1 py-2 px-3 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-sans font-medium rounded transition-colors cursor-pointer"
                id="btn-cancel-reset"
              >
                {t('intro.cancel')}
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 py-2 px-3 bg-red-700 hover:bg-red-600 text-white text-xs font-sans font-semibold rounded transition-colors cursor-pointer shadow-md"
                id="btn-confirm-reset"
              >
                {t('intro.confirmReset')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
