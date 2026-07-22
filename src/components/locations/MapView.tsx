import { GameState, LocationData } from '../../types/game';
import { LOCATIONS } from '../../data/storyData';
import { MapPin, Lock, CheckCircle2, Home, Compass } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

interface MapViewProps {
  state: GameState;
  onSelectLocation: (locationId: string) => void;
}

export function MapView({ state, onSelectLocation }: MapViewProps) {
  const { language } = useLanguage();

  const getPhaseName = (phase: string) => {
    if (language === 'fi') {
      if (phase === 'VAIHE2') return 'Vaihe 2 – Salaisuudet';
      if (phase === 'VAIHE3') return 'Vaihe 3 – Todisteet';
      if (phase === 'ACCUSATION') return 'Ratkaisun Hetki';
      return 'Vaihe 1 – Alkututkinta';
    } else {
      if (phase === 'VAIHE2') return 'Phase 2 – Secrets';
      if (phase === 'VAIHE3') return 'Phase 3 – Evidence';
      if (phase === 'ACCUSATION') return 'Moment of Truth';
      return 'Phase 1 – Initial Investigation';
    }
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

  const getImageForLocation = (id: string): string => {
    switch (id) {
      case 'olohuone': return '/images/locations/living-room.png';
      case 'keittio': return '/images/locations/kitchen.png';
      case 'vierashuone': return '/images/locations/guest-room.png';
      case 'antinhuone': return '/images/locations/antti-room.png';
      case 'sauna': return '/images/locations/sauna.png';
      case 'rantapolku': return '/images/locations/shore-path.png';
      case 'laituri': return '/images/locations/dock.png';
      case 'venevaja': return '/images/locations/boathouse.png';
      case 'vanhavarasto': return '/images/locations/old-storage.png';
      case 'metsapolku': return '/images/locations/forest-path.png';
      case 'autopaikka': return '/images/locations/parking-area.png';
      default: return '/images/locations/living-room.png';
    }
  };

  // Group locations for semantic UI representation
  const cabinLocs = LOCATIONS.filter(l => ['olohuone', 'keittio', 'vierashuone', 'antinhuone'].includes(l.id));
  const lakeLocs = LOCATIONS.filter(l => ['sauna', 'rantapolku', 'laituri', 'venevaja'].includes(l.id));
  const forestLocs = LOCATIONS.filter(l => ['vanhavarasto', 'metsapolku', 'autopaikka'].includes(l.id));

  return (
    <div 
      className="w-full relative overflow-hidden py-10 px-4 md:px-8 rounded-[24px] shadow-2xl transition-all duration-500" 
      style={{ 
        backgroundImage: 'url("/images/ui/main-menu-background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      id="map-view-container"
    >
      {/* 25-35% elegant dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      {/* Atmospheric moving fog */}
      <div className="back-fog opacity-35 pointer-events-none z-0" />
      <div className="front-fog opacity-20 pointer-events-none z-0" />

      {/* Subtle weather rain overlay */}
      <div className="rain-overlay opacity-[0.12] pointer-events-none z-0" />

      {/* Warm candle/window light glow overlay near the right side */}
      <div className="absolute right-[8%] top-[25%] w-72 h-72 bg-amber-500/10 blur-[85px] rounded-full mix-blend-screen animate-pulse pointer-events-none z-0" style={{ animationDuration: '8s' }} />

      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-8" id="map-grid-section">
        
        {/* Intro Section Header */}
        <div className="text-center md:text-left space-y-2 max-w-3xl">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-2xl md:text-3.5xl font-serif italic text-amber-500 drop-shadow-[0_2px_10px_rgba(198,146,20,0.4)] flex items-center justify-center md:justify-start gap-3 font-bold tracking-wide">
              <Compass className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '40s' }} />
              {language === 'fi' ? 'Hiljaisen Järven Mökkialue' : 'Silent Lake Cabin Area'}
            </h3>
            <div className="w-36 h-[1.5px] bg-gradient-to-r from-amber-500/80 via-amber-600/30 to-transparent" />
          </div>
          <p className="text-xs text-slate-200/90 font-sans leading-relaxed drop-shadow-md">
            {language === 'fi' 
              ? 'Valitse sijainti kartalta tutkiaksesi ympäristöä ja etsiäksesi johtolankoja. Alueet laajentuvat ja avautuvat tutkinnan edetessä.'
              : 'Select a location from the map to investigate the environment and search for clues. Areas expand and open as the investigation progresses.'}
          </p>
        </div>

        {/* Blueprint Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CATEGORY 1: PÄÄMÖKKI (MAIN CABIN) */}
          <div className="bg-black/40 backdrop-blur-md border border-amber-500/10 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/10">
              <Home className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Päämökki (Sisätilat)' : 'Main Cabin (Indoors)'}
              </span>
            </div>

            <div className="space-y-3.5">
              {cabinLocs.map((loc) => {
                const unlocked = isLocationUnlocked(loc);
                const visited = state.visitedLocations.includes(loc.id);
                const inspectablesCount = loc.inspectables.length;

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationClick(loc)}
                    disabled={!unlocked}
                    className={`w-full p-3.5 border rounded-2xl transition-all duration-300 text-left flex items-start justify-between relative cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                      unlocked
                        ? 'bg-zinc-950/45 border-amber-500/10 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-zinc-900/40 hover:shadow-[0_4px_25px_rgba(198,146,20,0.18)]'
                        : 'bg-black/55 border-zinc-800/10 opacity-75 cursor-not-allowed'
                    }`}
                    id={`map-loc-${loc.id}`}
                  >
                    <div className="flex gap-4 w-full">
                      {/* Pieni esikatselukuva */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img 
                          src={getImageForLocation(loc.id)} 
                          alt={loc.name} 
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-transform duration-500 ${unlocked ? 'group-hover:scale-110' : 'grayscale contrast-75 brightness-75'}`}
                        />
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-4.5 h-4.5 text-amber-500/90" />
                          </div>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-sm font-sans font-semibold transition-colors duration-300 ${unlocked ? 'text-slate-100 group-hover:text-amber-400 font-bold' : 'text-slate-400'}`}>
                            {loc.name}
                          </span>
                          {visited && unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                          )}
                        </div>
                        <p className={`text-[11px] leading-snug transition-colors duration-300 ${unlocked ? 'text-slate-300/90' : 'text-slate-500 font-medium'}`}>
                          {unlocked ? loc.shortDesc : `${language === 'fi' ? 'Lukittu.' : 'Locked.'} ${getPhaseName(loc.unlockedAtPhase)}.`}
                        </p>
                        
                        {unlocked && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5 font-sans">
                            <span>
                              {language === 'fi' 
                                ? `🔍 ${inspectablesCount} johtolankaa odottaa` 
                                : `🔍 ${inspectablesCount} clues waiting`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pl-1 self-center shrink-0">
                        {unlocked ? (
                          <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-500/50" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CATEGORY 2: RANTA-ALUE (LAKE SHORE) */}
          <div className="bg-black/40 backdrop-blur-md border border-amber-500/10 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/10">
              <Compass className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Ranta-alue & Järvi' : 'Shore Area & Lake'}
              </span>
            </div>

            <div className="space-y-3.5">
              {lakeLocs.map((loc) => {
                const unlocked = isLocationUnlocked(loc);
                const visited = state.visitedLocations.includes(loc.id);
                const inspectablesCount = loc.inspectables.length;

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationClick(loc)}
                    disabled={!unlocked}
                    className={`w-full p-3.5 border rounded-2xl transition-all duration-300 text-left flex items-start justify-between relative cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                      unlocked
                        ? 'bg-zinc-950/45 border-amber-500/10 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-zinc-900/40 hover:shadow-[0_4px_25px_rgba(198,146,20,0.18)]'
                        : 'bg-black/55 border-zinc-800/10 opacity-75 cursor-not-allowed'
                    }`}
                    id={`map-loc-${loc.id}`}
                  >
                    <div className="flex gap-4 w-full">
                      {/* Pieni esikatselukuva */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img 
                          src={getImageForLocation(loc.id)} 
                          alt={loc.name} 
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-transform duration-500 ${unlocked ? 'group-hover:scale-110' : 'grayscale contrast-75 brightness-75'}`}
                        />
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-4.5 h-4.5 text-amber-500/90" />
                          </div>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-sm font-sans font-semibold transition-colors duration-300 ${unlocked ? 'text-slate-100 group-hover:text-amber-400 font-bold' : 'text-slate-400'}`}>
                            {loc.name}
                          </span>
                          {visited && unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                          )}
                          {loc.id === 'venevaja' && (
                            <span className="text-[8px] font-mono bg-amber-950/80 border border-amber-800 text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Rikospaikka</span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-snug transition-colors duration-300 ${unlocked ? 'text-slate-300/90' : 'text-slate-500 font-medium'}`}>
                          {unlocked ? loc.shortDesc : `${language === 'fi' ? 'Lukittu.' : 'Locked.'} ${getPhaseName(loc.unlockedAtPhase)}.`}
                        </p>
                        
                        {unlocked && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5 font-sans">
                            <span>
                              {language === 'fi' 
                                ? `🔍 ${inspectablesCount} johtolankaa odottaa` 
                                : `🔍 ${inspectablesCount} clues waiting`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pl-1 self-center shrink-0">
                        {unlocked ? (
                          <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-500/50" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CATEGORY 3: ULKOALUEET (SURROUNDINGS) */}
          <div className="bg-black/40 backdrop-blur-md border border-amber-500/10 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/10">
              <Compass className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Ympäristö & Metsä' : 'Surroundings & Forest'}
              </span>
            </div>

            <div className="space-y-3.5">
              {forestLocs.map((loc) => {
                const unlocked = isLocationUnlocked(loc);
                const visited = state.visitedLocations.includes(loc.id);
                const inspectablesCount = loc.inspectables.length;

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationClick(loc)}
                    disabled={!unlocked}
                    className={`w-full p-3.5 border rounded-2xl transition-all duration-300 text-left flex items-start justify-between relative cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                      unlocked
                        ? 'bg-zinc-950/45 border-amber-500/10 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-zinc-900/40 hover:shadow-[0_4px_25px_rgba(198,146,20,0.18)]'
                        : 'bg-black/55 border-zinc-800/10 opacity-75 cursor-not-allowed'
                    }`}
                    id={`map-loc-${loc.id}`}
                  >
                    <div className="flex gap-4 w-full">
                      {/* Pieni esikatselukuva */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img 
                          src={getImageForLocation(loc.id)} 
                          alt={loc.name} 
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-transform duration-500 ${unlocked ? 'group-hover:scale-110' : 'grayscale contrast-75 brightness-75'}`}
                        />
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-4.5 h-4.5 text-amber-500/90" />
                          </div>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-sm font-sans font-semibold transition-colors duration-300 ${unlocked ? 'text-slate-100 group-hover:text-amber-400 font-bold' : 'text-slate-400'}`}>
                            {loc.name}
                          </span>
                          {visited && unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Tutkittu paikka" />
                          )}
                        </div>
                        <p className={`text-[11px] leading-snug transition-colors duration-300 ${unlocked ? 'text-slate-300/90' : 'text-slate-500 font-medium'}`}>
                          {unlocked ? loc.shortDesc : `${language === 'fi' ? 'Lukittu.' : 'Locked.'} ${getPhaseName(loc.unlockedAtPhase)}.`}
                        </p>
                        
                        {unlocked && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5 font-sans">
                            <span>
                              {language === 'fi' 
                                ? `🔍 ${inspectablesCount} johtolankaa odottaa` 
                                : `🔍 ${inspectablesCount} clues waiting`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pl-1 self-center shrink-0">
                        {unlocked ? (
                          <MapPin className={`w-4 h-4 transition-transform group-hover:scale-125 ${visited ? 'text-emerald-500/70' : 'text-amber-500'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-500/50" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 3. DETECTIVE DESK DESK SHORTCUT PANEL */}
        <div className="bg-black/35 backdrop-blur-md border border-amber-500/10 p-5 rounded-2xl text-center flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.35)]">
          <div className="text-left space-y-1">
            <h4 className="text-sm font-sans font-semibold text-amber-500/90 tracking-wide">
              {language === 'fi' ? 'Rikostutkinnan työpöytä' : 'Investigation Desk'}
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'fi'
                ? 'Voit analysoida kerättyjä todisteita, katsella johtolankakansiollasi tai asettaa ne korkkitaululle etsiäksesi ristiriitoja milloin tahansa yläpalkin navigaatiolla.'
                : 'You can analyze collected evidence, browse your case files, or place them on the corkboard to find contradictions at any time using the navigation bar.'}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="text-[10px] font-mono bg-zinc-950/80 border border-amber-500/20 text-amber-500 py-1.5 px-4 rounded-xl uppercase tracking-wider font-bold shadow-md">
              {language === 'fi' 
                ? `Avatut paikat: ${state.visitedLocations.length} / 11` 
                : `Unlocked Areas: ${state.visitedLocations.length} / 11`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
export default MapView;
