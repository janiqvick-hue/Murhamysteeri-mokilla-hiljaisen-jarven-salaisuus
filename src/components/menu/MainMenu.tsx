import { useState } from 'react';
import { GameState } from '../../types/game';
import { Play, RotateCcw, HelpCircle, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface MainMenuProps {
  state: GameState;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenSettings: () => void;
}

export function MainMenu({ state, onNewGame, onContinueGame, onOpenSettings }: MainMenuProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const hasSaveGame = state.visitedLocations.length > 0 || state.discoveredClues.length > 0 || state.currentPhase !== 'PROLOGUE';

  const handleNewGameClick = () => {
    audioSynth.playClick();
    if (hasSaveGame) {
      setShowConfirmReset(true);
    } else {
      onNewGame();
    }
  };

  const confirmNewGame = () => {
    audioSynth.playClick();
    setShowConfirmReset(false);
    onNewGame();
  };

  const cancelNewGame = () => {
    audioSynth.playClick();
    setShowConfirmReset(false);
  };

  const handleContinue = () => {
    audioSynth.playClick();
    onContinueGame();
  };

  const handleInfoToggle = () => {
    audioSynth.playClick();
    setShowInfo(!showInfo);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden" id="main-menu-container">
      {/* Background image & dark overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center transition-all duration-1000" 
        style={{ backgroundImage: 'url("/images/ui/main-menu-background.png")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-0" />

      {/* Atmospheric dynamic weather effects */}
      <div className="rain-overlay" />
      <div className="fog-overlay" />
      <div className="lightning-overlay" />

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">


        {/* Title logo block */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <div className="p-3 bg-red-950/60 border border-red-700/40 rounded-full mb-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-zinc-100 leading-tight">
            Murhamysteeri mökillä
          </h1>
          <h2 className="text-sm font-sans font-medium text-amber-500/80 tracking-wide mt-1 uppercase">
            Hiljaisen järven salaisuus
          </h2>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent mt-4" />
        </div>

        {/* Main interactive cards / buttons */}
        {!showInfo ? (
          <div className="w-full space-y-3 bg-zinc-900/60 border border-zinc-800 p-6 rounded-lg backdrop-blur-md shadow-2xl">
            {hasSaveGame && (
              <button
                onClick={handleContinue}
                className="w-full py-3.5 px-4 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-sans font-medium rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_10px_rgba(185,28,28,0.2)] hover:shadow-[0_4px_15px_rgba(185,28,28,0.3)] hover:-translate-y-0.5"
                id="btn-continue-game"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Jatka tutkintaa</span>
              </button>
            )}

            <button
              onClick={handleNewGameClick}
              className={`w-full py-3.5 px-4 font-sans font-medium rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                hasSaveGame
                  ? 'bg-zinc-950/80 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-red-700 hover:bg-red-600 active:bg-red-800 border-transparent text-white shadow-[0_4px_10px_rgba(185,28,28,0.2)] hover:shadow-[0_4px_15px_rgba(185,28,28,0.3)] hover:-translate-y-0.5'
              }`}
              id="btn-new-game"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{hasSaveGame ? 'Aloita uusi peli' : 'Aloita peli'}</span>
            </button>

            <button
              onClick={handleInfoToggle}
              className="w-full py-3 px-4 bg-zinc-950/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-sans text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="btn-about-game"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Tietoa pelistä</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full py-3 px-4 bg-zinc-950/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-sans text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="btn-main-settings"
            >
              <HelpCircle className="w-4 h-4 opacity-0" /> {/* helper spacer */}
              <span>Peli-asetukset</span>
            </button>
          </div>
        ) : (
          /* About game modal overlay replacement */
          <div className="w-full bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg backdrop-blur-md shadow-2xl space-y-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-sans font-medium text-amber-500 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Pelin tausta & ohjeet
            </h3>
            
            <div className="space-y-3 text-sm text-zinc-400 font-sans leading-relaxed">
              <p>
                Kuusi ystävää kokoontuu viettämään viikonloppua syrjäiselle järvenrantamökille Suomessa. Illalla ryhmän jäsen <strong className="text-zinc-200">Antti Lehtonen</strong> katoaa hämärissä olosuhteissa.
              </p>
              <p>
                Seuraavana aamuna Antti löydetään kuolleena venevajan läheltä. Myrsky on kaatanut puita teiden päälle ja katkaissut yhteydet. Poliisi ei pääse paikalle nopeasti.
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Sinä olet tutkija.</span> Sinun täytyy selvittää kuka viidestä epäillystä on murhaaja, mikä oli hänen motiivinsa, mikä oli murha-ase ja missä teko tapahtui, sekä esittää kolme ratkaisevaa todistetta ennen kuin myrsky laantuu ja syyllinen pääsee pakenemaan.
              </p>
              <div className="border-t border-zinc-800 pt-3 space-y-1">
                <span className="text-xs font-semibold text-zinc-300">Kuinka pelata:</span>
                <ul className="list-disc pl-5 text-xs space-y-1 text-zinc-400">
                  <li>Tutki paikkoja kartalta ja etsi piilotettuja johtolankoja klikkaamalla kohteita.</li>
                  <li>Kuulustele epäiltyjä. Johtolangat avaavat uusia kysymyksiä.</li>
                  <li>Yhdistä todisteita ja alibeja tutkintataululla löytääksesi ristiriitoja.</li>
                  <li>Kun olet varma, tee virallinen syytös syytösnäkymässä.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleInfoToggle}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sans text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Takaisin päävalikkoon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer info and copyright credits */}
        <div className="mt-12 text-center text-[10px] text-zinc-600 font-mono tracking-wider space-y-1">
          <p>© 2026 Hiljaisen Järven Salaisuus • MIT-lisenssi</p>
          <p>Rakennettu React + TypeScript + Tailwindilla</p>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" id="reset-confirm-modal-overlay">
          <div className="w-full max-w-sm bg-slate-900 border border-white/5 rounded p-6 shadow-2xl text-center space-y-5 animate-scale-up">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-950/40 border border-amber-600/35 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-amber-500 animate-spin-slow" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-serif italic font-bold text-slate-100">
                Aloitetaanko uusi peli?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Tämä poistaa selaimeesi tallennetun nykyisen edistymisesi ja aloittaa murhatutkinnan kokonaan alusta. Tätä toimintoa ei voi peruuttaa.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelNewGame}
                className="flex-1 py-2 px-3 border border-white/5 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-sans font-medium rounded transition-colors cursor-pointer"
                id="btn-cancel-reset"
              >
                Peruuta
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-sans font-semibold rounded transition-colors cursor-pointer shadow-md"
                id="btn-confirm-reset"
              >
                Kyllä, aloita alusta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
