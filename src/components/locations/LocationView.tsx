import { useState, useEffect } from 'react';
import { LocationData, InspectableObject, GameState } from '../../types/game';
import { CLUES } from '../../data/storyData';
import { ArrowLeft, Eye, CheckCircle2, AlertCircle, Sparkles, FileSearch } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface LocationViewProps {
  location: LocationData;
  state: GameState;
  onBackToMap: () => void;
  onDiscoverClue: (clueId: string, name: string) => void;
}

export function LocationView({ location, state, onBackToMap, onDiscoverClue }: LocationViewProps) {
  const [selectedObject, setSelectedObject] = useState<InspectableObject | null>(null);
  const [revealText, setRevealText] = useState<string | null>(null);
  const [inspectedIds, setInspectedIds] = useState<string[]>(() => {
    // Restore already inspected objects from state (if we found the corresponding clue, it's inspected)
    return location.inspectables
      .filter(o => o.clueIdTrigger && state.discoveredClues.includes(o.clueIdTrigger))
      .map(o => o.id);
  });

  const handleBack = () => {
    audioSynth.playClick();
    onBackToMap();
  };

  const handleObjectClick = (obj: InspectableObject) => {
    audioSynth.playClick();
    setSelectedObject(obj);
    setRevealText(null);
  };

  const getCoordinates = (obj: InspectableObject) => {
    if (location.id === 'olohuone') {
      if (obj.id === 'takka') return { x: 86, y: 55 };
      if (obj.id === 'naulakko') return { x: 73, y: 40 };
    }
    if (location.id === 'keittio') {
      if (obj.id === 'keittion_kello') return { x: 63, y: 21 };
      if (obj.id === 'avainnaula') return { x: 34, y: 31 };
    }
    if (location.id === 'antinhuone') {
      if (obj.id === 'yopoyta') return { x: 68, y: 62 };
      if (obj.id === 'salkku') return { x: 35, y: 78 };
      if (obj.id === 'tilisiirto') return { x: 45, y: 82 };
    }
    if (location.id === 'sauna') {
      if (obj.id === 'vaatekasa') return { x: 23, y: 80 };
      if (obj.id === 'lauteet') return { x: 78, y: 72 };
    }
    if (location.id === 'venevaja') {
      if (obj.id === 'rikospaikka_lattia') return { x: 53, y: 78 };
      if (obj.id === 'lyhyn_kahva') return { x: 59, y: 81 };
      if (obj.id === 'lattia_kengat') return { x: 51, y: 65 };
      if (obj.id === 'ruumiin_tarkastelu') return { x: 38, y: 76 };
      if (obj.id === 'venevajan_ovi') return { x: 49, y: 38 };
    }
    if (location.id === 'laituri') {
      if (obj.id === 'laiturin_paa') return { x: 50, y: 75 };
    }
    if (location.id === 'rantapolku') {
      if (obj.id === 'puskikko') return { x: 32, y: 62 };
    }
    if (location.id === 'vanhavarasto') {
      if (obj.id === 'tyokalulaatikko') return { x: 11, y: 53 };
    }
    if (location.id === 'metsapolku') {
      if (obj.id === 'kuusenoksa') return { x: 78, y: 32 }; // Placed naturalistically on the low-hanging spruce branches on the right side
    }
    if (location.id === 'autopaikka') {
      if (obj.id === 'auton_renkaat') return { x: 61, y: 57 }; // Placed precisely on the flatbed/trunk of the grey pickup truck in the center
    }
    if (location.id === 'vierashuone') {
      if (obj.id === 'saran_laukku') return { x: 23, y: 66 }; // Placed precisely on the black suitcase standing on the floor to the left of the bed
      if (obj.id === 'elinan_kaappi') return { x: 10, y: 78 }; // Placed precisely on the wooden dresser cabinet in the bottom-left foreground
    }
    return { x: obj.x, y: obj.y };
  };

  const handleInspect = () => {
    if (!selectedObject) return;
    
    // Play sound effects
    if (state.settings.soundOn) {
      audioSynth.playClick();
    }

    setRevealText(selectedObject.revealText || 'Tutkit kohdetta tarkasti, mutta et löydä mitään epätavallista.');

    if (selectedObject.clueIdTrigger) {
      const clue = CLUES.find(c => c.id === selectedObject.clueIdTrigger);
      if (clue) {
        // Trigger discovery of the clue
        onDiscoverClue(clue.id, clue.name);
        
        // Mark as inspected
        if (!inspectedIds.includes(selectedObject.id)) {
          setInspectedIds(prev => [...prev, selectedObject.id]);
        }

        // Special trigger: If finding 'saran_tallennin' and we are in VAIHE3,
        // let's also auto-discover 'elinan_aani_tallenteella' once analyzed or inspected!
        // To keep it simple, if they find saran_tallennin, let's also give them a prompt
        // to analyze it in their case file, or let them find the voice recording as part of it!
        // Let's make 'elinan_aani_tallenteella' discoverable once they analyze the recorder,
        // which we can implement as an action in the CaseFile or on the Detective Desk!
      }
    } else {
      // Just plain inspection item
      if (!inspectedIds.includes(selectedObject.id)) {
        setInspectedIds(prev => [...prev, selectedObject.id]);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="location-view-container">
      {/* Back button and location header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-4 bg-slate-900/60 border border-white/10 hover:border-amber-600/50 hover:bg-slate-900 text-slate-300 hover:text-white rounded text-xs font-sans font-medium transition-all cursor-pointer"
          id="btn-back-to-map"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Takaisin karttaan</span>
        </button>

        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          SIJAINTI: {location.name}
        </span>
      </div>

      {/* Main Exploration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Visual interactive stage representing the scene (65%) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Interactive Atmospheric Canvas */}
          <div
            className={`w-full aspect-video bg-gradient-to-b ${location.bgGradient} border border-white/10 rounded relative overflow-hidden flex flex-col justify-end p-4 shadow-2xl`}
            id="atmospheric-canvas"
            style={
              location.id === 'olohuone'
                ? {
                    backgroundImage: 'url("/images/locations/living-room.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'keittio'
                ? {
                    backgroundImage: 'url("/images/locations/kitchen.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'antinhuone'
                ? {
                    backgroundImage: 'url("/images/locations/antti-room.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'sauna'
                ? {
                    backgroundImage: 'url("/images/locations/sauna.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'venevaja'
                ? {
                    backgroundImage: 'url("/images/locations/boathouse.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'laituri'
                ? {
                    backgroundImage: 'url("/images/locations/dock.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'rantapolku'
                ? {
                    backgroundImage: 'url("/images/locations/shore-path.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'vanhavarasto'
                ? {
                    backgroundImage: 'url("/images/locations/old-storage.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'metsapolku'
                ? {
                    backgroundImage: 'url("/images/locations/forest-path.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'autopaikka'
                ? {
                    backgroundImage: 'url("/images/locations/parking-area.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'vierashuone'
                ? {
                    backgroundImage: 'url("/images/locations/guest-room.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : {}
            }
          >
            {/* Cinematic weather/mist effect overlays using CSS */}
            <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-black/30 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><filter id=%22f%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.025%22 numOctaves=%222%22/></filter><rect width=%2280%22 height=%2280%22 filter=%22url(%23f)%22 opacity=%220.06%22/></svg>')] animate-pulse" />
            
            {/* Immersive weather particles & effects specifically for active locations */}
            <div className="absolute inset-0 rain-overlay opacity-30 pointer-events-none" />
            <div className="absolute inset-0 fog-overlay opacity-20 pointer-events-none" />
            <div className="absolute inset-0 lightning-overlay pointer-events-none" />

            {/* Dark overlay to make elements and text pop on image */}
            {['olohuone', 'keittio', 'antinhuone', 'sauna', 'venevaja', 'laituri', 'rantapolku', 'vanhavarasto', 'metsapolku', 'autopaikka', 'vierashuone'].includes(location.id) && (
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            )}

            {/* Soft lamp/cottage glow filter if it is olohuone/keittio */}
            {['olohuone', 'keittio', 'antinhuone', 'sauna', 'venevaja', 'laituri', 'rantapolku', 'vanhavarasto', 'metsapolku', 'autopaikka', 'vierashuone'].includes(location.id) && (
              <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Pulsing fog or sea lines */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950/40 to-transparent blur-md pointer-events-none" />

            {/* Displaying Inspectable object hotspots */}
            {location.inspectables.map((obj) => {
              const isInspected = inspectedIds.includes(obj.id);
              const coords = getCoordinates(obj);
              
              return (
                <button
                  key={obj.id}
                  onClick={() => handleObjectClick(obj)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 group flex items-center justify-center cursor-pointer"
                  id={`hotspot-${obj.id}`}
                  title={obj.name}
                >
                  <span className={`absolute w-8 h-8 rounded-full border animate-ping opacity-60 pointer-events-none ${
                    isInspected ? 'border-emerald-500/30' : 'border-amber-500/30'
                  }`} />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 shadow-lg ${
                      isInspected
                        ? 'bg-emerald-500 border-emerald-300 scale-90'
                        : selectedObject?.id === obj.id
                        ? 'bg-amber-400 border-white scale-125 shadow-[0_0_10px_rgba(217,119,6,0.8)]'
                        : 'bg-amber-600 border-amber-300 hover:bg-amber-500 hover:scale-110'
                    }`}
                  />
                  {/* Subtle hover tag */}
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-950/95 border border-white/10 text-slate-200 text-[10px] font-sans font-medium px-2 py-0.5 rounded whitespace-nowrap transition-transform duration-150 z-20 pointer-events-none">
                    {obj.name}
                  </span>
                </button>
              );
            })}

            {/* Floating title and weather overlay */}
            <div className="relative z-10 space-y-1 self-start select-none">
              <h2 className="text-xl md:text-2xl font-serif italic font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {location.name}
              </h2>
              <p className="text-xs font-mono text-slate-300 max-w-md drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded border border-white/5 inline-block">
                {location.weatherAmbiance}
              </p>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide pb-1 border-b border-white/5">
              Ympäristön kuvaus
            </h4>
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              {location.longDesc}
            </p>
          </div>

          {/* Accessible Text-Based List of Inspectables */}
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded space-y-3 animate-fade-in" id="accessible-inspectables-container">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide pb-1 border-b border-white/5">
              Tutkittavat kohteet
            </h4>
            <div className="flex flex-wrap gap-2">
              {location.inspectables.map((obj) => {
                const isSelected = selectedObject?.id === obj.id;
                const isInspected = inspectedIds.includes(obj.id);
                return (
                  <button
                    key={`text-list-${obj.id}`}
                    onClick={() => handleObjectClick(obj)}
                    className={`px-3 py-1.5 rounded text-xs font-sans transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-[0_0_8px_rgba(198,146,20,0.2)]'
                        : isInspected
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50'
                        : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isInspected ? 'bg-emerald-400' : 'bg-amber-500'}`} />
                    <span>{obj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Inspector Tool Panel (35%) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded flex-1 flex flex-col justify-between space-y-6">
            
            {/* Top Object Selection Details */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                <FileSearch className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Tarkastelupaneeli
                </span>
              </div>

              {selectedObject ? (
                <div className="space-y-4 animate-fade-in" id="inspected-object-details">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-serif italic font-bold text-slate-200">
                      {selectedObject.name}
                    </h3>
                    {inspectedIds.includes(selectedObject.id) && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tutkittu</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed bg-slate-950 border border-white/5 p-3 rounded">
                    {selectedObject.description}
                  </p>

                  {/* If revealed, show the text */}
                  {revealText ? (
                    <div className="space-y-3 p-3.5 bg-slate-950 border border-white/5 rounded animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Havainto:</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                        {revealText}
                      </p>
                      
                      {selectedObject.clueIdTrigger && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/20 border border-amber-800/40 p-2 rounded">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Materiaali kerätty tutkintakansioon!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleInspect}
                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-sans text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md border border-amber-500/30"
                      id="btn-perform-inspect"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Tutki kohdetta tarkemmin</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500 space-y-3 select-none">
                  <AlertCircle className="w-10 h-10 text-slate-600" />
                  <div>
                    <p className="text-xs font-sans font-medium text-slate-400">
                      Ei valittua kohdetta
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-[200px] mt-1">
                      Klikkaa keltaista hotspot-palloa kuva-alueella aloittaaksesi tutkimuksen.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="pt-4 border-t border-white/5 text-center text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Sijainti tutkittu:</span>
              <span className={inspectedIds.length === location.inspectables.length ? 'text-amber-500 font-bold' : 'text-slate-400'}>
                {inspectedIds.length} / {location.inspectables.length} kohdetta
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
export default LocationView;
