import { useState, useRef, useEffect } from 'react';
import { Clue, GameState } from '../../types/game';
import { CLUES, LOCATIONS, SUSPECTS } from '../../data/storyData';
import {
  FileText,
  MapPin,
  Eye,
  Filter,
  User2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Camera,
  Paperclip,
  ShieldAlert,
  Volume2,
  Star,
  Search,
  Radio,
  Layers,
} from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface CaseFileProps {
  state: GameState;
}

type ClueStyleType = 'photo' | 'document' | 'technical' | 'observation' | 'audio';

export function CaseFile({ state }: CaseFileProps) {
  const [selectedClueId, setSelectedClueId] = useState<string | null>(() => {
    if (state.discoveredClues.includes('saran_tallennin') && !state.discoveredClues.includes('elinan_aani_tallenteella')) {
      return 'saran_tallennin';
    }
    return null;
  });
  const [hoveredClueId, setHoveredClueId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'LOCATION' | 'SUSPECT'>('ALL');
  const [filterValue, setFilterValue] = useState<string>('');

  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [cardPositions, setCardPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Get only clues that the player has discovered
  const discoveredClues = CLUES.filter(clue => state.discoveredClues.includes(clue.id));

  const handleClueClick = (clueId: string) => {
    audioSynth.playClick();
    setSelectedClueId(clueId);
  };

  const handleFilterTypeChange = (type: 'ALL' | 'LOCATION' | 'SUSPECT') => {
    audioSynth.playClick();
    setFilterType(type);
    setFilterValue('');
  };

  const handleFilterValueChange = (val: string) => {
    audioSynth.playClick();
    setFilterValue(val);
  };

  // Apply filters
  const filteredClues = discoveredClues.filter((clue) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'LOCATION') {
      return !filterValue || clue.locationId === filterValue;
    }
    if (filterType === 'SUSPECT') {
      return !filterValue || clue.suspectId === filterValue;
    }
    return true;
  });

  // Calculate card center positions for SVG red thread connections
  useEffect(() => {
    const updatePositions = () => {
      if (!gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const pos: Record<string, { x: number; y: number }> = {};
      Object.entries(cardRefs.current).forEach(([id, el]) => {
        if (el) {
          const rect = (el as HTMLButtonElement).getBoundingClientRect();
          pos[id] = {
            x: rect.left + rect.width / 2 - gridRect.left,
            y: rect.top + rect.height / 2 - gridRect.top,
          };
        }
      });
      setCardPositions((prev) => {
        const keys = Object.keys(pos);
        const prevKeys = Object.keys(prev);
        if (keys.length !== prevKeys.length) return pos;
        const isSame = keys.every(
          (k) => prev[k] && Math.abs(prev[k].x - pos[k].x) < 1 && Math.abs(prev[k].y - pos[k].y) < 1
        );
        return isSame ? prev : pos;
      });
    };

    updatePositions();
    const timer = setTimeout(updatePositions, 100);
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [filterType, filterValue, state.discoveredClues.length, filteredClues.length, selectedClueId]);

  const selectedClue = CLUES.find(c => c.id === selectedClueId);
  const selectedClueLocation = selectedClue ? LOCATIONS.find(l => l.id === selectedClue.locationId) : null;
  const selectedClueSuspect = selectedClue && selectedClue.suspectId ? SUSPECTS.find(s => s.id === selectedClue.suspectId) : null;

  const activeClueId = hoveredClueId || selectedClueId;
  const activeClueObj = CLUES.find(c => c.id === activeClueId);
  const connectedIds = activeClueObj?.connectedClues || [];

  const getClueStyleType = (clue: Clue): ClueStyleType => {
    if (['saran_tallennin', 'elinan_aani_tallenteella'].includes(clue.id) || clue.iconType === 'tape' || clue.iconType === 'voice') {
      return 'audio';
    }
    if (['tekstiviesti_lauralle', 'tilisiirto_elinalle', 'kirjanpitopaperit', 'poltettu_paperi'].includes(clue.id) || ['paper', 'account', 'message', 'ash'].includes(clue.iconType)) {
      return 'document';
    }
    if (['elinan_kengat', 'kenganjaljet_venevajalla', 'kuusenoksa', 'oskarin_taskulamppu'].includes(clue.id) || ['shoe', 'footprint', 'branch', 'flashlight'].includes(clue.iconType)) {
      return 'photo';
    }
    if (['keittion_kello', 'auton_avaimet', 'tyhja_laakepakkaus', 'markuksen_saunavaatteet'].includes(clue.id) || ['clock', 'keys', 'pills', 'clothes'].includes(clue.iconType)) {
      return 'observation';
    }
    return 'technical';
  };

  const getClueImage = (clueId: string): string | null => {
    const clueObj = CLUES.find(c => c.id === clueId);
    if (clueObj?.imageUrl) return clueObj.imageUrl;
    switch (clueId) {
      case 'elinan_aani_tallenteella': return '/images/ui/elinan_aani_tallenteella.png';
      case 'kangas_antin_kadessa': return '/images/ui/kangas_antin_kadessa.jpg';
      case 'antin_puhelin': return '/images/ui/antin_puhelin.jpg';
      case 'tekstiviesti_lauralle': return '/images/ui/tekstiviesti_lauralle.jpg';
      case 'auton_avaimet': return '/images/ui/auton_avaimet.jpg';
      case 'elinan_kengat': return '/images/ui/elinan_kengat.jpg';
      case 'keittion_kello': return '/images/ui/keittion_kello.jpg';
      case 'markuksen_saunavaatteet': return '/images/ui/markuksen_saunavaatteet.jpg';
      case 'kenganjaljet_venevajalla': return '/images/ui/kenganjaljet_venevajalla.jpg';
      case 'poltettu_paperi': return '/images/ui/poltettu_paperi.jpg';
      case 'oskarin_taskulamppu': return '/images/ui/oskarin_taskulamppu.jpg';
      case 'repeytynyt_hiha': return '/images/ui/repeytynyt_hiha.jpg';
      case 'rikkinainen_lyhty': return '/images/ui/rikkinainen_lyhty.jpg';
      case 'tyokalulaatikko': return '/images/ui/tyokalulaatikko.jpg';
      case 'tilisiirto_elinalle': return '/images/ui/tilisiirto_elinalle.jpg';
      case 'kirjanpitopaperit': return '/images/ui/kirjanpitopaperit.jpg';
      case 'saran_tallennin': return '/images/ui/saran_tallennin.jpg';
      case 'tyhja_laakepakkaus': return '/images/ui/tyhja_laakepakkaus.jpg';
      case 'kuitu_lyhdyssa': return '/images/ui/kuitu_lyhdyssa.jpg';
      case 'venevajan_lukko': return '/images/ui/venevajan_lukko.jpg';
      case 'kuusenoksa': return '/images/ui/kuusenoksa.jpg';
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6" id="casefile-container">
      {/* Header with detective board title */}
      <div className="bg-zinc-950/80 border border-amber-900/40 p-4 md:p-5 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif italic font-bold text-amber-100 tracking-wide">
              Etsivän Tutkintakansio & Todistetaulu
            </h3>
          </div>
          <p className="text-xs font-sans text-slate-400 max-w-2xl leading-relaxed">
            Tutkintapöydällesi kerätyt fyysiset, kirjalliset ja tekniset todisteet. Tarkastele johtolankojen välisiä vahvistettuja yhteyksiä ja suorita syvällisempiä rikosteknisiä analyysejä.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-amber-500/20 px-4 py-2.5 rounded-xl shrink-0">
          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Löydetyt todisteet</span>
            <span className="text-lg font-mono font-bold text-amber-400 leading-none">
              {discoveredClues.length} <span className="text-xs text-slate-500 font-normal">/ {CLUES.length}</span>
            </span>
          </div>
          <div className="h-6 w-px bg-amber-500/20" />
          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Status</span>
            <span className="text-xs font-mono font-bold text-emerald-400 leading-none flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {discoveredClues.length >= 15 ? 'VALMIS' : 'KESKEN'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Detective Evidence Board / Corkboard View (7 Cols) */}
        <div className="lg:col-span-7 bg-[#14110e] border border-[#3d2e20] p-4 md:p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between space-y-4">
          
          {/* Subtle Corkboard Texture & Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Top Brass Pins / Board Screws in corners */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-600 to-amber-950 border border-amber-400/40 shadow-md" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-600 to-amber-950 border border-amber-400/40 shadow-md" />

          {/* Controls & Filter Bar */}
          <div className="relative z-10 space-y-3 pb-3 border-b border-amber-950/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-500/90 uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-amber-500" />
                Suodata tutkintataulua:
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Näytetään {filteredClues.length} todistetta
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['ALL', 'LOCATION', 'SUSPECT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterTypeChange(type)}
                  className={`py-1.5 px-3 border rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase cursor-pointer transition-all ${
                    filterType === type
                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-zinc-950/80 border-amber-900/30 text-slate-400 hover:text-slate-200 hover:bg-zinc-900'
                  }`}
                >
                  {type === 'ALL' ? 'Kaikki' : type === 'LOCATION' ? 'Sijainti' : 'Epäilty'}
                </button>
              ))}

              {/* Sub-Filter selects */}
              {filterType === 'LOCATION' && (
                <select
                  value={filterValue}
                  onChange={(e) => handleFilterValueChange(e.target.value)}
                  className="p-1.5 bg-zinc-950 border border-amber-900/40 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="">-- Valitse paikka --</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              )}

              {filterType === 'SUSPECT' && (
                <select
                  value={filterValue}
                  onChange={(e) => handleFilterValueChange(e.target.value)}
                  className="p-1.5 bg-zinc-950 border border-amber-900/40 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="">-- Valitse epäilty --</option>
                  {SUSPECTS.map(susp => (
                    <option key={susp.id} value={susp.id}>{susp.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* CORKBOARD CARDS CANVAS CONTAINER */}
          <div className="relative z-10 flex-1 min-h-[420px] max-h-[62vh] overflow-y-auto pr-1" ref={gridRef}>
            
            {/* SVG RED THREAD / GOLDEN CONNECTION LINES LAYER */}
            {activeClueObj && connectedIds.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                {connectedIds.map((targetId) => {
                  const sourcePos = cardPositions[activeClueObj.id];
                  const targetPos = cardPositions[targetId];

                  if (!sourcePos || !targetPos) return null;

                  return (
                    <g key={`connection-${activeClueObj.id}-${targetId}`}>
                      {/* Outer red glowing string blur */}
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke="rgba(239, 68, 68, 0.4)"
                        strokeWidth="5"
                        className="animate-pulse"
                      />
                      {/* Core sharp red string line */}
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      {/* Pin points at ends */}
                      <circle cx={sourcePos.x} cy={sourcePos.y} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx={targetPos.x} cy={targetPos.y} r="4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Cards Grid */}
            {filteredClues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 pb-4">
                {filteredClues.map((clue) => {
                  const isSelected = selectedClueId === clue.id;
                  const isHovered = hoveredClueId === clue.id;
                  const isConnected = activeClueId && (connectedIds.includes(clue.id) || clue.id === activeClueId);
                  const isDimmed = activeClueId !== null && !isConnected;

                  const styleType = getClueStyleType(clue);
                  const loc = LOCATIONS.find(l => l.id === clue.locationId);
                  const susp = clue.suspectId ? SUSPECTS.find(s => s.id === clue.suspectId) : null;
                  const clueImg = getClueImage(clue.id);

                  // Special status conditions
                  const isAudioUnanalyzed = clue.id === 'saran_tallennin' && !state.discoveredClues.includes('elinan_aani_tallenteella');
                  const isAudioAnalyzed = clue.id === 'elinan_aani_tallenteella' || (clue.id === 'saran_tallennin' && state.discoveredClues.includes('elinan_aani_tallenteella'));
                  const isKeyEvidence = (clue.evidenceValueStars || 3) >= 4;

                  return (
                    <button
                      key={clue.id}
                      ref={(el) => { cardRefs.current[clue.id] = el; }}
                      onClick={() => handleClueClick(clue.id)}
                      onMouseEnter={() => setHoveredClueId(clue.id)}
                      onMouseLeave={() => setHoveredClueId(null)}
                      className={`relative text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                        isDimmed ? 'opacity-35 scale-95 blur-[0.3px]' : 'opacity-100'
                      } ${
                        isSelected
                          ? 'ring-2 ring-amber-400 bg-amber-950/40 border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.35)] -translate-y-1 scale-[1.02] z-30'
                          : isHovered
                          ? 'border-amber-400/80 bg-zinc-900/90 shadow-[0_10px_25px_rgba(245,158,11,0.22)] -translate-y-1 scale-[1.01] z-30'
                          : styleType === 'photo'
                          ? 'bg-[#fbf9f4] border-[#d4cebd] text-zinc-900 shadow-md hover:bg-white'
                          : styleType === 'document'
                          ? 'bg-[#f7f2e4] border-[#e2d5bd] text-zinc-900 shadow-md hover:bg-[#fffdf7]'
                          : styleType === 'audio'
                          ? 'bg-zinc-950 border-amber-500/40 text-amber-200 shadow-md'
                          : styleType === 'observation'
                          ? 'bg-[#292215] border-amber-600/30 text-amber-100 shadow-md'
                          : 'bg-zinc-900/90 border-zinc-700/60 text-slate-200 shadow-md'
                      }`}
                      id={`clue-card-${clue.id}`}
                    >
                      {/* Pushpin / Tape visual at top */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                        {styleType === 'photo' ? (
                          <div className="w-10 h-3 bg-amber-200/50 backdrop-blur-sm border border-amber-300/40 rounded-sm rotate-1 shadow-sm" />
                        ) : styleType === 'document' ? (
                          <Paperclip className="w-4 h-4 text-slate-500 -rotate-45" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full border shadow-md ${isSelected ? 'bg-red-500 border-amber-300 animate-pulse' : 'bg-amber-600 border-amber-800'}`} />
                        )}
                      </div>

                      {/* Header row with Type badge & Status */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between gap-1.5 text-[9px] font-mono">
                          {/* Type indicator */}
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                            styleType === 'photo'
                              ? 'bg-amber-900/10 text-amber-900 border border-amber-800/20'
                              : styleType === 'document'
                              ? 'bg-slate-900/10 text-slate-800 border border-slate-700/20'
                              : styleType === 'audio'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-zinc-800 text-amber-400 border border-amber-500/30'
                          }`}>
                            {styleType === 'photo' && <Camera className="w-2.5 h-2.5" />}
                            {styleType === 'document' && <FileText className="w-2.5 h-2.5" />}
                            {styleType === 'audio' && <Volume2 className="w-2.5 h-2.5 animate-pulse" />}
                            {styleType === 'observation' && <Eye className="w-2.5 h-2.5" />}
                            {styleType === 'technical' && <ShieldAlert className="w-2.5 h-2.5" />}
                            {clue.category || 'Todiste'}
                          </span>

                          {/* Status Badge */}
                          {isAudioUnanalyzed ? (
                            <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded font-extrabold animate-pulse shadow-sm">
                              ANALYSOTAVISSA
                            </span>
                          ) : isKeyEvidence ? (
                            <span className="bg-amber-950 border border-amber-500/60 text-amber-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              TÄRKEÄ
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">#{clue.id.slice(0, 8)}</span>
                          )}
                        </div>

                        {/* Title & Thumbnail */}
                        <div className="flex gap-2.5 items-start">
                          {clueImg && (
                            <div className="w-12 h-12 rounded border border-black/20 overflow-hidden shrink-0 bg-black/40">
                              <img src={clueImg} alt={clue.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <h4 className={`text-xs font-serif font-bold leading-snug line-clamp-2 ${
                              ['photo', 'document'].includes(styleType) && !isSelected && !isHovered ? 'text-zinc-900' : 'text-amber-100'
                            }`}>
                              {clue.name}
                            </h4>
                            <p className={`text-[10px] font-sans line-clamp-2 leading-relaxed ${
                              ['photo', 'document'].includes(styleType) && !isSelected && !isHovered ? 'text-zinc-700' : 'text-slate-400'
                            }`}>
                              {clue.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer Metadata */}
                      <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[120px]">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          {loc?.name || 'Mökki'}
                        </span>

                        {susp && (
                          <span className="flex items-center gap-1 text-sky-400 font-semibold bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                            <User2 className="w-2.5 h-2.5" />
                            {susp.name}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs font-sans space-y-2">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <p>
                  {discoveredClues.length === 0
                    ? 'Et ole vielä löytänyt yhtään johtolankaa. Tutki mökkiä ja rantaa!'
                    : 'Ei suodatusta täsmääviä johtolankoja.'}
                </p>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-2 text-center text-[10px] text-slate-400 font-sans leading-tight bg-zinc-950/60 p-2.5 rounded-xl border border-amber-950/40">
            * Kerää vähintään 15 johtolankaa saadaksesi täyden rikosteknisen kuvan tapauksesta.
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Clue Detail Analyzer Dossier (5 Cols) */}
        <div className="lg:col-span-5 bg-zinc-950/95 border border-amber-900/50 rounded-2xl p-4 md:p-5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden shadow-2xl">
          
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-950/60">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Etsivän Laboratorio-Analysaattori
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                DOSSIER #2026
              </span>
            </div>

            {selectedClue ? (() => {
              const clueImage = getClueImage(selectedClue.id);
              const isKeyEvidence = (selectedClue.evidenceValueStars || 3) >= 4;

              return (
                <div key={selectedClue.id} className="space-y-4 flex-1 flex flex-col justify-start py-1 overflow-y-auto max-h-[68vh] pr-1 animate-clue-zoom">
                  
                  {/* 1. LARGE PREVIEW IMAGE AT TOP OF ANALYSIS AREA */}
                  <div className="w-full overflow-hidden rounded-xl border border-amber-500/40 bg-zinc-950/90 flex justify-center items-center shadow-2xl relative group min-h-[190px] max-h-[280px] p-2" id={`clue-image-container-${selectedClue.id}`}>
                    {clueImage ? (
                      <img
                        key={`img-${selectedClue.id}`}
                        src={clueImage}
                        alt={selectedClue.name}
                        className="w-full h-auto max-h-[260px] object-contain filter contrast-105 rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] max-h-[140px] rounded-xl border border-dashed border-amber-500/20 bg-zinc-950/60 flex flex-col items-center justify-center text-slate-500 gap-1.5" id={`clue-no-image-${selectedClue.id}`}>
                        <div className="p-2 bg-zinc-900 border border-amber-500/20 text-amber-500 rounded-full">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-mono tracking-widest uppercase">Ei valokuvallista tallennetta</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-mono text-amber-300 border border-amber-500/40 pointer-events-none shadow-md">
                      RIKOSTEKNINEN ESIKATSELU
                    </div>
                  </div>

                  {/* 2. UNDER IMAGE: NAME, CATEGORY, LOCATION, MARKERS */}
                  <div className="space-y-2 bg-zinc-900/60 border border-amber-900/40 p-3.5 rounded-xl shadow-md">
                    {/* Todisteen nimi */}
                    <h3 className="text-lg md:text-xl font-serif italic font-bold text-amber-100 leading-snug">
                      {selectedClue.name}
                    </h3>
                    
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono border-t border-amber-950/60 pt-2.5 mt-1">
                      {/* Kategoria */}
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-slate-500 uppercase text-[9px] shrink-0">Kategoria:</span>
                        <strong className="text-amber-200 font-sans font-semibold text-[11px] truncate">
                          {selectedClue.category || 'Tekniikka / Esine'}
                        </strong>
                      </div>

                      {/* Löytöpaikka */}
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-slate-500 uppercase text-[9px] shrink-0">Löytöpaikka:</span>
                        <strong className="text-amber-200 font-sans font-semibold text-[11px] truncate">
                          {selectedClueLocation?.name || 'Tuntematon'}
                        </strong>
                      </div>
                    </div>

                    {/* Merkinnät */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-950/40 pt-2 text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        {isKeyEvidence ? (
                          <span className="bg-amber-950/90 border border-amber-500/80 text-amber-300 px-2.5 py-0.5 rounded font-bold flex items-center gap-1 text-[10px] shadow-sm">
                            <Star className="w-3 h-3 fill-amber-400" />
                            TÄRKEÄ TODISTE
                          </span>
                        ) : (
                          <span className="bg-zinc-800/80 border border-zinc-700/60 text-amber-400 px-2 py-0.5 rounded font-bold flex items-center gap-1 text-[10px]">
                            {'★'.repeat(selectedClue.evidenceValueStars || 3)}
                            <span className="text-[9px] text-slate-400 font-normal">Normaali</span>
                          </span>
                        )}

                        {selectedClueSuspect && (
                          <span className="flex items-center gap-1 text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/40">
                            <User2 className="w-3 h-3" />
                            <strong className="text-sky-300 font-sans font-semibold">{selectedClueSuspect.name}</strong>
                          </span>
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-amber-400/90 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/40">
                        ID: {selectedClue.id}
                      </span>
                    </div>
                  </div>

                  {/* 3. BELOW: UNCHANGED DETECTIVE LAB ANALYZER CONTENT */}
                  {/* Yleiskuvaus */}
                  <div className="space-y-1 bg-zinc-900/80 border border-amber-900/30 p-3.5 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Yleiskuvaus:</span>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">
                      {selectedClue.description}
                    </p>
                  </div>

                  {/* Rikostekninen analyysi */}
                  <div className="space-y-1.5 bg-zinc-900/80 border border-amber-900/30 p-3.5 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      Rikostekninen analyysi:
                    </span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {selectedClue.forensicAnalysis || selectedClue.detailedAnalysis}
                    </p>
                  </div>

                  {/* Merkitys tutkinnalle */}
                  {selectedClue.investigativeSignificance && (
                    <div className="space-y-1.5 bg-amber-950/30 border border-amber-600/30 p-3.5 rounded-xl">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Merkitys tutkinnalle:
                      </span>
                      <p className="text-xs text-slate-200 font-sans leading-relaxed">
                        {selectedClue.investigativeSignificance}
                      </p>
                    </div>
                  )}

                  {/* Vahvistetut tutkintayhteydet */}
                  {selectedClue.connectedClues && selectedClue.connectedClues.length > 0 && (
                    <div className="space-y-2 border-t border-amber-950/60 pt-3">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                        Vahvistetut tutkintayhteydet:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedClue.connectedClues.map((connId) => {
                          const connClue = CLUES.find(c => c.id === connId);
                          const connSuspect = !connClue ? SUSPECTS.find(s => s.id === connId) : null;
                          
                          if (!connClue && !connSuspect) return null;
                          
                          const name = connClue ? connClue.name : (connSuspect ? `Epäilty: ${connSuspect.name}` : '');
                          const isDiscovered = connClue ? state.discoveredClues.includes(connId) : true;

                          return (
                            <button
                              key={connId}
                              disabled={!connClue || !isDiscovered}
                              onClick={() => connClue && handleClueClick(connId)}
                              className={`py-1.5 px-2.5 border rounded-lg text-[10px] font-sans font-semibold transition-all flex items-center gap-1.5 ${
                                !connClue
                                  ? 'bg-sky-950/40 border-sky-800/40 text-sky-300'
                                  : isDiscovered
                                  ? 'bg-zinc-900 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-950/50 cursor-pointer shadow-sm'
                                  : 'bg-zinc-950/40 border-zinc-800 text-slate-600 cursor-not-allowed'
                              }`}
                              id={`connected-clue-btn-${connId}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${!connClue ? 'bg-sky-400' : isDiscovered ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                              <span>{name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action button for Saran Tallennin noise reduction */}
                  {selectedClue.id === 'saran_tallennin' && !state.discoveredClues.includes('elinan_aani_tallenteella') && (
                    <div className="bg-amber-950/40 border border-amber-500/60 p-4 rounded-xl space-y-3 mt-2 shadow-lg">
                      <div className="space-y-1">
                        <h4 className="text-xs font-sans font-bold text-amber-300 flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                          Huomattava tiedosto tallentimella
                        </h4>
                        <p className="text-[11px] text-slate-300 font-sans leading-snug">
                          Tallentimesta löytyi erillinen äänitiedosto "REC_004.WAV". Haluatko ajaa siihen kohinanpoiston ja analysoida tausta-äänet?
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          audioSynth.playClueDiscovered();
                          const elinasVoiceClue = CLUES.find(c => c.id === 'elinan_aani_tallenteella');
                          if (elinasVoiceClue) {
                            (window as any)._discoverClueCallback?.('elinan_aani_tallenteella', elinasVoiceClue.name);
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg border border-amber-300 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Suorita äänen kohinanpoisto ja analyysi
                      </button>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-3 flex-1">
                <AlertCircle className="w-12 h-12 text-slate-700" />
                <div>
                  <p className="text-xs font-sans font-medium text-slate-400">
                    Valitse tutkittava kohde tutkintataululta
                  </p>
                  <p className="text-[10px] text-slate-400 max-w-[240px] mt-1 mx-auto leading-relaxed">
                    Napsauta mitä tahansa todistetta nähdäksesi sen täyden rikosteknisen erittelyn ja päätelmät.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-amber-950/60 text-[10px] text-slate-400 font-mono text-center">
              Hiljaisen Järven Poliisi • KRP Tekniset Tutkimukset
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default CaseFile;

