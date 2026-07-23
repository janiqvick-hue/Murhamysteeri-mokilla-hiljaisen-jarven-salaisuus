import { useState, useEffect } from 'react';
import { LocationData, InspectableObject, GameState } from '../../types/game';
import { CLUES } from '../../data/storyData';
import { ArrowLeft, Eye, CheckCircle2, AlertCircle, Sparkles, FileSearch, X } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

interface LocationViewProps {
  location: LocationData;
  state: GameState;
  onBackToMap: () => void;
  onDiscoverClue: (clueId: string, name: string) => void;
}

export function LocationView({ location, state, onBackToMap, onDiscoverClue }: LocationViewProps) {
  const { t, tText } = useLanguage();
  const [selectedObject, setSelectedObject] = useState<InspectableObject | null>(null);
  const [revealText, setRevealText] = useState<string | null>(null);
  const [inspectedIds, setInspectedIds] = useState<string[]>(() => {
    // Restore already inspected objects from state (if we found the corresponding clue, it's inspected)
    return location.inspectables
      .filter(o => o.clueIdTrigger && state.discoveredClues.includes(o.clueIdTrigger))
      .map(o => o.id);
  });

  // Hotspot Debugger State
  const [debugHotspots, setDebugHotspots] = useState(false);
  const [lastClickedCoords, setLastClickedCoords] = useState<{ x: number; y: number } | null>(null);

  // Lock body scroll when selectedObject is open on mobile
  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      if (selectedObject && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleScrollLock();
    window.addEventListener('resize', handleScrollLock);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleScrollLock);
    };
  }, [selectedObject]);


  const playObjectSound = (obj: InspectableObject, isFirstClick: boolean) => {
    if (!state.settings.soundOn) return;
    
    const trigger = obj.clueIdTrigger;
    
    // Fabric/fiber objects
    const isFabric = [
      'elinan_kengat',
      'elinan_kengat_auto',
      'saran_tallennin',
      'repeytynyt_hiha',
      'markuksen_saunavaatteet',
      'kuitu_lyhdyssa',
      'kangas_antin_kadessa'
    ].includes(trigger || '') || obj.id === 'salkku';
    
    // Paper/document objects
    const isPaper = [
      'poltettu_paperi',
      'tilisiirto_elinalle',
      'kirjanpitopaperit',
      'tekstiviesti_lauralle',
      'tyhja_laakepakkaus'
    ].includes(trigger || '');
    
    // Metal objects
    const isMetal = [
      'keittion_kello',
      'auton_avaimet',
      'oskarin_taskulamppu',
      'rikkinainen_lyhty',
      'venevajan_lukko',
      'tyokalulaatikko'
    ].includes(trigger || '');
    
    // Wood/structure objects
    const isWood = [
      'elinan_kaappi',
      'lauteet',
      'kuusenoksa',
      'puskikko'
    ].includes(obj.id);

    if (isFirstClick) {
      audioSynth.playInvestigationStinger();
    } else {
      if (isPaper) {
        audioSynth.playPaperRustle();
      } else if (isWood) {
        audioSynth.playWoodCreak();
      } else if (isMetal) {
        audioSynth.playMetalClink();
      } else if (isFabric) {
        audioSynth.playFabricRustle();
      } else {
        audioSynth.playInvestigationStinger();
      }
    }
  };

  const getObjectImage = (obj: InspectableObject): string | null => {
    const trigger = obj.clueIdTrigger || (obj.id === 'kuusenoksa' ? 'kuusenoksa' : undefined);
    if (!trigger) return null;
    
    if (obj.id === 'auton_renkaat' || trigger === 'elinan_kengat_auto') {
      return '/images/ui/elinan_kengat_auto.jpg';
    }

    if (trigger === 'elinan_aani_tallenteella') {
      return '/images/ui/elinan_aani_tallenteella.png';
    }
    
    const validTriggers = [
      'poltettu_paperi',
      'elinan_kengat',
      'keittion_kello',
      'auton_avaimet',
      'saran_tallennin',
      'repeytynyt_hiha',
      'antin_puhelin',
      'kirjanpitopaperit',
      'tilisiirto_elinalle',
      'markuksen_saunavaatteet',
      'tyhja_laakepakkaus',
      'oskarin_taskulamppu',
      'tekstiviesti_lauralle',
      'rikkinainen_lyhty',
      'kenganjaljet_venevajalla',
      'kangas_antin_kadessa',
      'tyokalulaatikko',
      'venevajan_lukko',
      'kuitu_lyhdyssa',
      'kuusenoksa'
    ];
    
    if (validTriggers.includes(trigger)) {
      return `/images/ui/${trigger}.jpg`;
    }
    
    console.warn(`[PUUTTUVA KUVA]: Esineelle "${obj.name}" (clueIdTrigger: "${trigger}") ei löytynyt kuvaa polusta "/images/ui/${trigger}.jpg"`);
    return null;
  };

  const handleBack = () => {
    audioSynth.playClick();
    onBackToMap();
  };

  const handleObjectClick = (obj: InspectableObject) => {
    playObjectSound(obj, true);
    setSelectedObject(obj);
    setRevealText(null);
  };

  const getCoordinates = (obj: InspectableObject) => {
    if (location.id === 'keittio') {
      if (obj.id === 'avainnaula') return { x: 30, y: 45 };
      if (obj.id === 'keittion_kello') return { x: 75, y: 30 };
    }
    if (location.id === 'antinhuone') {
      if (obj.id === 'yopoyta') return { x: 68, y: 62 };
      if (obj.id === 'salkku') return { x: 35, y: 78 };
      if (obj.id === 'tilisiirto') return { x: 45, y: 82 };
    }
    if (location.id === 'sauna') {
      if (obj.id === 'vaatekasa') return { x: 20, y: 65 };
      if (obj.id === 'lauteet') return { x: 80, y: 75 };
    }
    if (location.id === 'venevaja') {
      if (obj.id === 'venevajan_ovi') return { x: 10, y: 45 };
      if (obj.id === 'ruumiin_tarkastelu') return { x: 48, y: 40 };
      if (obj.id === 'rikospaikka_lattia') return { x: 50, y: 60 };
      if (obj.id === 'lyhyn_kahva') return { x: 52, y: 63 };
      if (obj.id === 'lattia_kengat') return { x: 30, y: 75 };
    }
    if (location.id === 'laituri') {
      if (obj.id === 'laiturin_paa') return { x: 50, y: 45 }; // Siirretty laiturin kauimmaiseen päätyyn
    }
    if (location.id === 'rantapolku') {
      if (obj.id === 'puskikko') return { x: 82, y: 75 }; // Siirretty polun reunalla olevaan kasvillisuuteen (ei veden päällä)
    }
    if (location.id === 'vanhavarasto') {
      if (obj.id === 'tyokalulaatikko') return { x: 45, y: 55 }; // Siirretty työpöydän metallisen työkalupakin päälle
    }
    if (location.id === 'metsapolku') {
      if (obj.id === 'kuusenoksa') return { x: 78, y: 32 }; // Placed naturalistically on the low-hanging spruce branches on the right side
    }
    if (location.id === 'autopaikka') {
      if (obj.id === 'auton_renkaat') return { x: 61, y: 57 }; // Placed precisely on the flatbed/trunk of the grey pickup truck in the center
    }
    if (location.id === 'vierashuone') {
      if (obj.id === 'saran_laukku') return { x: 74, y: 86 }; // Placed precisely on the brown leather bag on the floor to the right
      if (obj.id === 'elinan_kaappi') return { x: 28, y: 38 }; // Placed precisely on Elina's coat right sleeve with the tear
    }
    return { x: obj.x, y: obj.y };
  };

  const handleInspect = () => {
    if (!selectedObject) return;
    
    // Play material sound effect
    playObjectSound(selectedObject, false);

    setRevealText(selectedObject.revealText ? tText(selectedObject.revealText) : (t('settings.textSizeNormal') === 'Normaali' ? 'Tutkit kohdetta tarkasti, mutta et löydä mitään epätavallista.' : 'You inspect the object closely, but find nothing unusual.'));

    if (selectedObject.clueIdTrigger) {
      const clue = CLUES.find(c => c.id === selectedObject.clueIdTrigger);
      if (clue) {
        // Trigger discovery of the clue
        onDiscoverClue(clue.id, tText(clue.name));
        
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
            className={`w-full ${location.id === 'olohuone' ? 'aspect-[3/2]' : 'aspect-video'} bg-gradient-to-b ${location.bgGradient} border border-white/10 rounded relative overflow-hidden flex flex-col justify-end p-4 shadow-2xl ${
              debugHotspots ? 'cursor-crosshair border-red-500/50' : ''
            }`}
            id="atmospheric-canvas"
            onClick={debugHotspots ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setLastClickedCoords({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
            } : undefined}
            style={
              location.id === 'olohuone'
                ? {
                    backgroundImage: 'url("/images/locations/olohuone2.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'keittio'
                ? {
                    backgroundImage: 'url("/images/locations/keittio2.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'antinhuone'
                ? {
                    backgroundImage: 'url("/images/locations/antti-room.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'sauna'
                ? {
                    backgroundImage: 'url("/images/locations/sauna2.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'venevaja'
                ? {
                    backgroundImage: 'url("/images/locations/venevaja2.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'laituri'
                ? {
                    backgroundImage: 'url("/images/locations/dock.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'rantapolku'
                ? {
                    backgroundImage: 'url("/images/locations/shore-path.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'vanhavarasto'
                ? {
                    backgroundImage: 'url("/images/locations/old-storage.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'metsapolku'
                ? {
                    backgroundImage: 'url("/images/locations/forest-path.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'autopaikka'
                ? {
                    backgroundImage: 'url("/images/locations/parking-area.png")',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : location.id === 'vierashuone'
                ? {
                    backgroundImage: 'url("/images/locations/guest-room-1.png")',
                    backgroundSize: '100% 100%',
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
              if (!coords) return null; // Puuttuu kuvasta: exclude from visual canvas but keep in accessible list
              
              return (
                <button
                  key={obj.id}
                  onClick={() => handleObjectClick(obj)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 group flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                    debugHotspots ? 'border-2 border-dashed border-red-500 bg-red-500/10 rounded' : ''
                  }`}
                  id={`hotspot-${obj.id}`}
                  title={obj.name}
                >
                  {debugHotspots && (
                    <span className="absolute -top-6 bg-red-600 text-white text-[8px] font-mono px-1 py-0.5 rounded whitespace-nowrap z-30 shadow border border-red-400">
                      {obj.id} ({coords.x}%, {coords.y}%)
                    </span>
                  )}
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

            {/* Visual click helper dot in debug mode */}
            {debugHotspots && lastClickedCoords && (
              <div
                className="absolute w-4 h-4 border-2 border-red-500 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50 pointer-events-none shadow-lg shadow-black/80"
                style={{ left: `${lastClickedCoords.x}%`, top: `${lastClickedCoords.y}%` }}
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span className="absolute left-6 bg-slate-900 border border-red-500/30 text-red-400 font-mono text-[9px] px-2 py-1 rounded whitespace-nowrap shadow-md">
                  Klikattu: x: {lastClickedCoords.x}%, y: {lastClickedCoords.y}%
                </span>
              </div>
            )}

            {/* Floating title and weather overlay */}
            <div className="relative z-10 space-y-1 self-start select-none">
              <h2 className="text-xl md:text-2xl font-serif italic font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {tText(location.name)}
              </h2>
              <p className="text-xs font-mono text-slate-300 max-w-md drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded border border-white/5 inline-block">
                {tText(location.weatherAmbiance)}
              </p>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide pb-1 border-b border-white/5">
              {t('settings.textSizeNormal') === 'Normaali' ? 'Ympäristön kuvaus' : 'Area Description'}
            </h4>
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              {tText(location.longDesc)}
            </p>
          </div>

          {/* Accessible Text-Based List of Inspectables */}
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded space-y-3 animate-fade-in" id="accessible-inspectables-container">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide pb-1 border-b border-white/5">
              {t('settings.textSizeNormal') === 'Normaali' ? 'Tutkittavat kohteet' : 'Inspectable Objects'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {location.inspectables.map((obj) => {
                const isSelected = selectedObject?.id === obj.id;
                const isInspected = inspectedIds.includes(obj.id);
                const coords = getCoordinates(obj);
                const isMissing = coords === null;
                return (
                  <button
                    key={`text-list-${obj.id}`}
                    onClick={() => handleObjectClick(obj)}
                    className={`px-3 py-1.5 rounded text-xs font-sans transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-[0_0_8px_rgba(198,146,20,0.2)]'
                        : isInspected
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50'
                        : isMissing
                        ? 'bg-slate-900/20 border-red-500/10 text-slate-400 hover:border-red-500/30 hover:text-red-300'
                        : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isInspected ? 'bg-emerald-400' : isMissing ? 'bg-red-500/60' : 'bg-amber-500'}`} />
                    <span>{tText(obj.name)}</span>
                    {isMissing && <span className="text-[9px] text-red-400/80 font-mono">({t('settings.textSizeNormal') === 'Normaali' ? 'Puuttuu kuvasta' : 'Missing from image'})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Developer Tools Toggle & Diagnostics */}
          <div className="p-4 bg-slate-900/60 border border-white/5 rounded space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Kehitystyökalut
              </span>
              <button
                onClick={() => setDebugHotspots(!debugHotspots)}
                className={`px-3 py-1 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                  debugHotspots
                    ? 'bg-red-950/40 border-red-500 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {debugHotspots ? 'Sulje debug-tila' : 'Avaa debug-tila'}
              </button>
            </div>

            {debugHotspots && (
              <div className="text-[11px] font-mono text-slate-300 space-y-2 border-t border-slate-800 pt-3 animate-fade-in">
                <p className="text-slate-400 leading-normal">
                  Klikkaa mitä tahansa kohtaa kuvassa nähdäksesi x- ja y-koordinaatit. Punaiset katkoviivat osoittavat hotspotien osuma-alueet.
                </p>
                {lastClickedCoords && (
                  <div className="p-2 bg-slate-950/80 border border-red-950 rounded text-red-400 flex justify-between items-center">
                    <span>Viimeisin klikkaus: <strong className="text-white">x: {lastClickedCoords.x}%, y: {lastClickedCoords.y}%</strong></span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`{ x: ${lastClickedCoords.x}, y: ${lastClickedCoords.y} }`)}
                      className="px-2 py-0.5 bg-red-900/30 border border-red-800 text-[9px] hover:bg-red-900 hover:text-white rounded transition-all cursor-pointer"
                    >
                      Kopioi koodi
                    </button>
                  </div>
                )}
                
                <div className="space-y-1 pt-1.5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold pb-1">Hotspotien koordinaatit:</div>
                  {location.inspectables.map(obj => {
                    const coords = getCoordinates(obj);
                    return (
                      <div key={`debug-list-${obj.id}`} className="flex justify-between items-center p-1.5 bg-slate-950/40 rounded border border-white/5">
                        <span className="text-slate-400">{tText(obj.name)} ({obj.id}):</span>
                        {coords ? (
                          <span className="text-emerald-400 font-bold">x: {coords.x}%, y: {coords.y}%</span>
                        ) : (
                          <span className="text-red-400 font-bold">{t('settings.textSizeNormal') === 'Normaali' ? 'Puuttuu kuvasta (Piilotettu)' : 'Missing from image (Hidden)'}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Inspector Tool Panel (35%) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded flex-1 flex flex-col justify-between space-y-6">
            
            {/* Top Object Selection Details */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                <FileSearch className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  {t('settings.textSizeNormal') === 'Normaali' ? 'Tarkastelupaneeli' : 'Inspection Panel'}
                </span>
              </div>

              {selectedObject ? (
                <div className="space-y-4 animate-fade-in" id="inspected-object-details">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-serif italic font-bold text-slate-200">
                      {tText(selectedObject.name)}
                    </h3>
                    {inspectedIds.includes(selectedObject.id) && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutkittu' : 'Inspected'}</span>
                      </span>
                    )}
                  </div>

                  {/* Object Visual Image */}
                  {(() => {
                    const imgPath = getObjectImage(selectedObject);
                    if (imgPath) {
                      return (
                        <div className="w-full h-[320px] md:h-[400px] overflow-hidden rounded border border-amber-600/30 bg-slate-950/80 flex justify-center items-center shadow-[0_0_15px_rgba(217,119,6,0.15)] p-2" id={`inspect-image-container-${selectedObject.id}`}>
                          <img
                            src={imgPath}
                            alt={tText(selectedObject.name)}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-full h-[150px] rounded border border-dashed border-white/5 bg-slate-950/40 flex flex-col items-center justify-center text-slate-600 gap-1.5" id={`inspect-no-image-${selectedObject.id}`}>
                          <div className="p-1.5 bg-slate-950 border border-white/5 text-slate-500 rounded-full">
                            <FileSearch className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">Ei visuaalista tallennetta</span>
                        </div>
                      );
                    }
                  })()}

                  <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed bg-slate-950 border border-white/5 p-3 rounded">
                    {tText(selectedObject.description)}
                  </p>

                  {/* If revealed, show the text */}
                  {revealText ? (
                    <div className="space-y-3 p-3.5 bg-slate-950 border border-white/5 rounded animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Havainto:' : 'Observation:'}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                        {revealText}
                      </p>
                      
                      {selectedObject.clueIdTrigger && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/20 border border-amber-800/40 p-2 rounded">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Materiaali kerätty tutkintakansioon!' : 'Evidence collected to case file!'}</span>
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
                      <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutki kohdetta tarkemmin' : 'Inspect object closely'}</span>
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

      {/* MOBILE PANEL OVERLAY (visible on screens smaller than lg) */}
      {selectedObject && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          id="mobile-inspection-overlay"
        >
          <div 
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 rounded-t-lg">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                {t('settings.textSizeNormal') === 'Normaali' ? 'Tutkintapaneeli' : 'Inspection Panel'}
              </span>
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setSelectedObject(null);
                }}
                className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-none">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-serif italic font-bold text-slate-200">
                  {tText(selectedObject.name)}
                </h3>
                {inspectedIds.includes(selectedObject.id) && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutkittu' : 'Inspected'}</span>
                  </span>
                )}
              </div>

              {/* Object Visual Image */}
              {(() => {
                const imgPath = getObjectImage(selectedObject);
                if (imgPath) {
                  return (
                    <div className="w-full h-[220px] xs:h-[280px] sm:h-[320px] overflow-hidden rounded border border-amber-600/30 bg-slate-950/80 flex justify-center items-center shadow-[0_0_15px_rgba(217,119,6,0.15)] p-2">
                      <img
                        src={imgPath}
                        alt={tText(selectedObject.name)}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full h-[100px] rounded border border-dashed border-white/5 bg-slate-950/40 flex flex-col items-center justify-center text-slate-600 gap-1">
                      <FileSearch className="w-4 h-4 text-slate-500" />
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500">Ei kuvaa</span>
                    </div>
                  );
                }
              })()}

              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950 border border-white/5 p-3 rounded">
                {tText(selectedObject.description)}
              </p>

              {/* Observation results */}
              {revealText && (
                <div className="space-y-2 p-3 bg-slate-950 border border-white/5 rounded">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Havainto:' : 'Observation:'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {revealText}
                  </p>
                  
                  {selectedObject.clueIdTrigger && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/20 border border-amber-800/40 p-2 rounded">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Materiaali lisätty kansioon!' : 'Evidence added to case file!'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 rounded-b-lg flex gap-2">
              {!revealText && (
                <button
                  onClick={handleInspect}
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-sans text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutki tarkemmin' : 'Inspect closely'}</span>
                </button>
              )}
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setSelectedObject(null);
                }}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sans text-xs font-semibold rounded transition-all flex items-center justify-center min-h-[44px]"
              >
                <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Sulje' : 'Close'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default LocationView;
