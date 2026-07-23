import { useState } from 'react';
import { GameState, LocationData } from '../../types/game';
import { LOCATIONS } from '../../data/storyData';
import { MapPin, CheckCircle2, Home, Compass, Trees, Waves } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

interface MapViewProps {
  state: GameState;
  onSelectLocation: (locationId: string) => void;
}

interface MapPinDef {
  id: string;
  targetIds: string[];
  nameFi: string;
  nameEn: string;
  top: string;
  left: string;
  isCrimeScene?: boolean;
  defaultLocationId: string;
}

const MAP_PIN_DEFS: MapPinDef[] = [
  {
    id: 'paamokki',
    targetIds: ['olohuone', 'keittio', 'vierashuone', 'antinhuone'],
    nameFi: 'Päämökki',
    nameEn: 'Main Cabin',
    top: '36%',
    left: '36%',
    defaultLocationId: 'olohuone',
  },
  {
    id: 'sauna',
    targetIds: ['sauna'],
    nameFi: 'Rantasauna',
    nameEn: 'Sauna',
    top: '22%',
    left: '48%',
    defaultLocationId: 'sauna',
  },
  {
    id: 'rantapolku',
    targetIds: ['rantapolku'],
    nameFi: 'Rantapolku',
    nameEn: 'Shore Path',
    top: '40%',
    left: '42%',
    defaultLocationId: 'rantapolku',
  },
  {
    id: 'laituri',
    targetIds: ['laituri'],
    nameFi: 'Laituri',
    nameEn: 'Dock',
    top: '58%',
    left: '55%',
    defaultLocationId: 'laituri',
  },
  {
    id: 'venevaja',
    targetIds: ['venevaja'],
    nameFi: 'Venevaja',
    nameEn: 'Boathouse',
    top: '76%',
    left: '46%',
    isCrimeScene: true,
    defaultLocationId: 'venevaja',
  },
  {
    id: 'vanhavarasto',
    targetIds: ['vanhavarasto'],
    nameFi: 'Vanha varasto',
    nameEn: 'Old Storage',
    top: '24%',
    left: '80%',
    defaultLocationId: 'vanhavarasto',
  },
  {
    id: 'metsapolku',
    targetIds: ['metsapolku'],
    nameFi: 'Metsäpolku',
    nameEn: 'Forest Path',
    top: '52%',
    left: '86%',
    defaultLocationId: 'metsapolku',
  },
  {
    id: 'autopaikka',
    targetIds: ['autopaikka'],
    nameFi: 'Autopaikka',
    nameEn: 'Parking',
    top: '76%',
    left: '78%',
    defaultLocationId: 'autopaikka',
  },
];

export function MapView({ state, onSelectLocation }: MapViewProps) {
  const { language } = useLanguage();
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const handleLocationClick = (locId: string) => {
    audioSynth.playClick();
    onSelectLocation(locId);
  };

  const getImageForLocation = (id: string): string => {
    switch (id) {
      case 'olohuone': return '/images/locations/olohuone2.png';
      case 'keittio': return '/images/locations/keittio2.png';
      case 'vierashuone': return '/images/locations/guest-room-1.png';
      case 'antinhuone': return '/images/locations/antti-room.png';
      case 'sauna': return '/images/locations/sauna2.png';
      case 'rantapolku': return '/images/locations/shore-path.png';
      case 'laituri': return '/images/locations/dock.png';
      case 'venevaja': return '/images/locations/boathouse.png';
      case 'vanhavarasto': return '/images/locations/old-storage.png';
      case 'metsapolku': return '/images/locations/forest-path.png';
      case 'autopaikka': return '/images/locations/parking-area.png';
      default: return '/images/locations/olohuone2.png';
    }
  };

  // Group locations for semantic UI representation
  const cabinLocs = LOCATIONS.filter(l => ['olohuone', 'keittio', 'vierashuone', 'antinhuone'].includes(l.id));
  const lakeLocs = LOCATIONS.filter(l => ['sauna', 'rantapolku', 'laituri', 'venevaja'].includes(l.id));
  const forestLocs = LOCATIONS.filter(l => ['vanhavarasto', 'metsapolku', 'autopaikka'].includes(l.id));

  const indoorIds = ['olohuone', 'keittio', 'vierashuone', 'antinhuone'];

  const renderLocationCard = (loc: LocationData) => {
    const visited = state.visitedLocations.includes(loc.id);
    const inspectablesCount = loc.inspectables.length;
    
    // Determine card hover state
    const isIndoorCard = indoorIds.includes(loc.id);
    const isHovered = hoveredLocationId === loc.id || (isIndoorCard && indoorIds.includes(hoveredLocationId || ''));

    return (
      <button
        key={loc.id}
        onClick={() => handleLocationClick(loc.id)}
        onMouseEnter={() => setHoveredLocationId(loc.id)}
        onMouseLeave={() => setHoveredLocationId(null)}
        className={`w-full p-3.5 border rounded-2xl transition-all duration-300 text-left flex items-start justify-between relative cursor-pointer group backdrop-blur-md ${
          isHovered
            ? '-translate-y-1 border-amber-400/90 bg-zinc-900/80 shadow-[0_12px_35px_rgba(245,158,11,0.28)]'
            : 'border-amber-500/15 bg-zinc-950/60 hover:-translate-y-1 hover:border-amber-400/80 hover:bg-zinc-900/75 hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        }`}
        id={`map-loc-${loc.id}`}
      >
        <div className="flex gap-4 w-full">
          {/* Esikatselukuva */}
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 relative shadow-inner">
            <img 
              src={getImageForLocation(loc.id)} 
              alt={loc.name} 
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110 brightness-110' : 'group-hover:scale-110'}`}
            />
          </div>

          {/* Text details */}
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-sm font-sans font-bold transition-colors duration-300 ${isHovered ? 'text-amber-400' : 'text-slate-100 group-hover:text-amber-400'}`}>
                {loc.name}
              </span>
              {visited && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title={language === 'fi' ? 'Tutkittu paikka' : 'Investigated'} />
              )}
              {loc.id === 'venevaja' && (
                <span className="text-[8px] font-mono bg-red-950/90 border border-red-700/80 text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold shadow-sm">
                  {language === 'fi' ? 'Rikospaikka' : 'Crime Scene'}
                </span>
              )}
            </div>
            <p className="text-[11px] leading-snug transition-colors duration-300 text-slate-300/90 line-clamp-2">
              {loc.shortDesc}
            </p>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5 font-sans">
              <span>
                {language === 'fi' 
                  ? `🔍 ${inspectablesCount} johtolankaa odottaa` 
                  : `🔍 ${inspectablesCount} clues waiting`}
              </span>
            </div>
          </div>

          <div className="pl-1 self-center shrink-0">
            <MapPin className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'scale-125 text-amber-400' : visited ? 'text-emerald-500/80' : 'text-amber-500/80 group-hover:text-amber-400'}`} />
          </div>
        </div>
      </button>
    );
  };

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
      {/* Satelliitti- / ilmakuva tausta mökkialueesta (noin 15-20% näkyvyydellä) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.18] mix-blend-luminosity brightness-90 contrast-125"
        style={{
          backgroundImage: 'url("/images/locations/satellite-map-background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Topografiset taktilliset hienoviivat ja satelliittiverkko */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.2) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px'
        }}
      />

      {/* Elegant dark overlay for background contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      {/* Atmospheric moving fog */}
      <div className="back-fog opacity-35 pointer-events-none z-0" />
      <div className="front-fog opacity-20 pointer-events-none z-0" />

      {/* Subtle weather rain overlay */}
      <div className="rain-overlay opacity-[0.12] pointer-events-none z-0" />

      {/* Warm candle/window light glow overlay near the right side */}
      <div className="absolute right-[8%] top-[25%] w-72 h-72 bg-amber-500/10 blur-[85px] rounded-full mix-blend-screen animate-pulse pointer-events-none z-0" style={{ animationDuration: '8s' }} />

      {/* Taktiset satelliittimerkinnät / koordinaatit taustalla */}
      <div className="absolute top-4 right-6 z-0 pointer-events-none text-[9px] font-mono text-amber-500/40 tracking-widest uppercase hidden md:flex items-center gap-3">
        <span>SATELLITE RECON // N 61°29'42" E 23°45'11"</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-ping" />
      </div>

      {/* Paikkamerkit taustakartalla (Suurennetut, hehkuvat Map Pins) */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block overflow-hidden">
        {MAP_PIN_DEFS.map((pin) => {
          // Check if any location targeted by this pin is hovered
          const isPinHovered = hoveredLocationId ? pin.targetIds.includes(hoveredLocationId) : false;
          const isAnyHovered = hoveredLocationId !== null;
          const isDimmed = isAnyHovered && !isPinHovered;

          // Check if all or any targets visited
          const isVisited = pin.targetIds.some(id => state.visitedLocations.includes(id));

          return (
            <div
              key={pin.id}
              style={{ top: pin.top, left: pin.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-auto cursor-pointer group ${
                isPinHovered
                  ? 'z-30 scale-125'
                  : isDimmed
                  ? 'z-0 opacity-35 scale-90 blur-[0.2px]'
                  : 'z-10 opacity-80 hover:opacity-100 hover:scale-110'
              }`}
              onMouseEnter={() => setHoveredLocationId(pin.defaultLocationId)}
              onMouseLeave={() => setHoveredLocationId(null)}
              onClick={() => handleLocationClick(pin.defaultLocationId)}
            >
              {/* Sykkivä hehkurengas / halo kun aktiivinen */}
              {isPinHovered && (
                <div className="absolute -inset-2.5 rounded-full bg-amber-400/40 blur-md animate-pulse" />
              )}

              {/* Pin pilleri (20–30% suurempi) */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold shadow-xl backdrop-blur-md transition-all duration-300 ${
                  isPinHovered
                    ? 'bg-amber-500 text-black border-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.95)] ring-2 ring-amber-300/80 font-extrabold'
                    : pin.isCrimeScene
                    ? 'bg-red-950/90 border-red-500/70 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : isVisited
                    ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-950/90 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                }`}
              >
                <MapPin className={`w-4 h-4 shrink-0 transition-transform ${isPinHovered ? 'animate-bounce' : ''}`} />
                <span className="whitespace-nowrap tracking-wide">
                  {language === 'fi' ? pin.nameFi : pin.nameEn}
                </span>
                {isVisited && !isPinHovered && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>

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
              ? 'Valitse sijainti kartalta tutkiaksesi ympäristöä ja etsiäksesi johtolankoja. Kaikki alueet ovat avoinna tutkintaa varten.'
              : 'Select a location from the map to investigate the environment and search for clues. All areas are open for investigation.'}
          </p>
        </div>

        {/* Blueprint Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CATEGORY 1: PÄÄMÖKKI (MAIN CABIN) */}
          <div className="bg-black/45 backdrop-blur-md border border-amber-500/15 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/15">
              <Home className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Päämökki (Sisätilat)' : 'Main Cabin (Indoors)'}
              </span>
            </div>

            <div className="space-y-3.5">
              {cabinLocs.map(renderLocationCard)}
            </div>
          </div>

          {/* CATEGORY 2: RANTA-ALUE (LAKE SHORE) */}
          <div className="bg-black/45 backdrop-blur-md border border-amber-500/15 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/15">
              <Waves className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Ranta-alue & Järvi' : 'Shore Area & Lake'}
              </span>
            </div>

            <div className="space-y-3.5">
              {lakeLocs.map(renderLocationCard)}
            </div>
          </div>

          {/* CATEGORY 3: ULKOALUEET (SURROUNDINGS) */}
          <div className="bg-black/45 backdrop-blur-md border border-amber-500/15 p-5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-amber-500/15">
              <Trees className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {language === 'fi' ? 'Ympäristö & Metsä' : 'Surroundings & Forest'}
              </span>
            </div>

            <div className="space-y-3.5">
              {forestLocs.map(renderLocationCard)}
            </div>
          </div>

        </div>

        {/* 3. DETECTIVE DESK DESK SHORTCUT PANEL */}
        <div className="bg-black/40 backdrop-blur-md border border-amber-500/15 p-5 rounded-2xl text-center flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
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
                ? `Avatut paikat: 11 / 11` 
                : `Unlocked Areas: 11 / 11`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
export default MapView;

