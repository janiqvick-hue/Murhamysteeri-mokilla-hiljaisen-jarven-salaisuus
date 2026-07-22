import { GameState, LocationData } from '../../types/game';
import { LOCATIONS } from '../../data/storyData';
import { MapPin, Lock, CheckCircle2, Home, Compass, Eye } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface MapViewProps {
  state: GameState;
  onSelectLocation: (locationId: string) => void;
}

export function MapView({ state, onSelectLocation }: MapViewProps) {
  const getPhaseName = (phase: string) => {
    if (phase === 'VAIHE2') return 'Vaihe 2';
    if (phase === 'VAIHE3') return 'Vaihe 3';
    return 'Alkututkinta';
  };

  const isLocationUnlocked = (loc: LocationData) => {
    if (loc.unlockedAtPhase === 'PROLOGUE' || loc.unlockedAtPhase === 'VAIHE1') {
      return true;
    }
    if (loc.unlockedAtPhase === 'VAIHE2') {
      return state.currentPhase === 'VAIHE2' || state.currentPhase === 'VAIHE3' || state.currentPhase === 'ACCUSATION';
    }
    if (loc.unlockedAtPhase === 'VAIHE3') {
      return state.currentPhase === 'VAIHE3' || state.currentPhase === 'ACCUSATION';
    }
    return false;
  };

  const handleLocationClick = (loc: LocationData) => {
    if (!isLocationUnlocked(loc)) {
      if (state.settings.soundOn) {
        audioSynth.playClick();
      }
      return;
    }
    audioSynth.playClick();
    onSelectLocation(loc.id);
  };

  // Group locations for semantic UI representation: Cabin, Lake Shore, Surrounding
  const cabinLocs = LOCATIONS.filter(l => ['olohuone', 'keittio', 'vierashuone', 'antinhuone'].includes(l.id));
  const lakeLocs = LOCATIONS.filter(l => ['sauna', 'rantapolku', 'laituri', 'venevaja'].includes(l.id));
  const forestLocs = LOCATIONS.filter(l => ['vanhavarasto', 'metsapolku', 'autopaikka'].includes(l.id));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8" id="map-view-container">
      {/* Intro header */}
      <div className="text-center md:text-left space-y-1">
        <h3 className="text-2xl font-serif italic text-amber-500 flex items-center justify-center md:justify-start gap-2 font-bold">
          <Compass className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
          Hiljaisen Järven Mökkialue
        </h3>
        <p className="text-xs text-slate-400 font-sans max-w-2xl">
          Valitse sijainti kartalta tutkiaksesi ympäristöä ja etsiäksesi johtolankoja. Alueet laajentuvat ja avautuvat tutkinnan edetessä.
        </p>
      </div>

      {/* Styled Blueprint/Schematic Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CATEGORY 1: PÄÄMÖKKI (MAIN CABIN) */}
        <div className="bg-slate-900/40 border border-white/5 p-5 rounded backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Home className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Päämökki (Sisätilat)
            </span>
          </div>

          <div className="space-y-3">
            {cabinLocs.map((loc) => {
              const unlocked = isLocationUnlocked(loc);
              const visited = state.visitedLocations.includes(loc.id);
              const inspectablesCount = loc.inspectables.length;

              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationClick(loc)}
                  disabled={!unlocked}
                  className={`w-full p-4 border rounded transition-all text-left flex items-start justify-between relative cursor-pointer group ${
                    unlocked
                      ? 'bg-slate-950/80 border-white/5 hover:bg-slate-900/80 hover:border-amber-600/50'
                      : 'bg-slate-950/20 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                  id={`map-loc-${loc.id}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-sans font-semibold transition-colors ${unlocked ? 'text-slate-200 group-hover:text-amber-500' : 'text-slate-500'}`}>
                        {loc.name}
                      </span>
                      {visited && unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {unlocked ? loc.shortDesc : `Lukittu. Avautuu tutkinnassa (${getPhaseName(loc.unlockedAtPhase)}).`}
                    </p>
                    
                    {unlocked && (
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 pt-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Tutkittavia kohteita: {inspectablesCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="pl-3 self-center">
                    {unlocked ? (
                      <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CATEGORY 2: RANTALUE (LAKE SHORE) */}
        <div className="bg-slate-900/40 border border-white/5 p-5 rounded backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Ranta-alue & Järvi
            </span>
          </div>

          <div className="space-y-3">
            {lakeLocs.map((loc) => {
              const unlocked = isLocationUnlocked(loc);
              const visited = state.visitedLocations.includes(loc.id);
              const inspectablesCount = loc.inspectables.length;

              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationClick(loc)}
                  disabled={!unlocked}
                  className={`w-full p-4 border rounded transition-all text-left flex items-start justify-between relative cursor-pointer group ${
                    unlocked
                      ? 'bg-slate-950/80 border-white/5 hover:bg-slate-900/80 hover:border-amber-600/50'
                      : 'bg-slate-950/20 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                  id={`map-loc-${loc.id}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-sans font-semibold transition-colors ${unlocked ? 'text-slate-200 group-hover:text-amber-500' : 'text-slate-500'}`}>
                        {loc.name}
                      </span>
                      {visited && unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                      )}
                      {loc.id === 'venevaja' && (
                        <span className="text-[8px] font-mono bg-amber-950/80 border border-amber-800 text-amber-500 px-1 rounded uppercase tracking-wider">Rikospaikka</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {unlocked ? loc.shortDesc : `Lukittu. Avautuu tutkinnassa (${getPhaseName(loc.unlockedAtPhase)}).`}
                    </p>

                    {unlocked && (
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 pt-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Tutkittavia kohteita: {inspectablesCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="pl-3 self-center">
                    {unlocked ? (
                      <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CATEGORY 3: ULKOALUEET (SURROUNDINGS) */}
        <div className="bg-slate-900/40 border border-white/5 p-5 rounded backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Ympäristö & Metsä
            </span>
          </div>

          <div className="space-y-3">
            {forestLocs.map((loc) => {
              const unlocked = isLocationUnlocked(loc);
              const visited = state.visitedLocations.includes(loc.id);
              const inspectablesCount = loc.inspectables.length;

              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationClick(loc)}
                  disabled={!unlocked}
                  className={`w-full p-4 border rounded transition-all text-left flex items-start justify-between relative cursor-pointer group ${
                    unlocked
                      ? 'bg-slate-950/80 border-white/5 hover:bg-slate-900/80 hover:border-amber-600/50'
                      : 'bg-slate-950/20 border-white/5 opacity-40 cursor-not-allowed'
                  }`}
                  id={`map-loc-${loc.id}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-sans font-semibold transition-colors ${unlocked ? 'text-slate-200 group-hover:text-amber-500' : 'text-slate-500'}`}>
                        {loc.name}
                      </span>
                      {visited && unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {unlocked ? loc.shortDesc : `Lukittu. Avautuu tutkinnassa (${getPhaseName(loc.unlockedAtPhase)}).`}
                    </p>

                    {unlocked && (
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 pt-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Tutkittavia kohteita: {inspectablesCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="pl-3 self-center">
                    {unlocked ? (
                      <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Special Detective Desk Shortcut section */}
      <div className="bg-slate-900/20 border border-white/5 p-5 rounded text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <h4 className="text-sm font-sans font-semibold text-slate-200">Rikostutkinnan työpöytä</h4>
          <p className="text-xs text-slate-400">
            Voit analysoida kerättyjä todisteita, katsella johtolankakansiollasi tai asettaa ne korkkitaululle etsiäksesi ristiriitoja milloin tahansa yläpalkin navigaatiolla.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono bg-slate-950 border border-white/5 text-amber-500 py-1.5 px-3 rounded uppercase tracking-wider font-bold">
            Avatut paikat: {state.visitedLocations.length} / 11
          </span>
        </div>
      </div>
    </div>
  );
}
export default MapView;
