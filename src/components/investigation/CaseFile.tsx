import { useState } from 'react';
import { Clue, GameState } from '../../types/game';
import { CLUES, LOCATIONS, SUSPECTS } from '../../data/storyData';
import { FileText, MapPin, Eye, Filter, User2, Sparkles, AlertCircle } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface CaseFileProps {
  state: GameState;
}

export function CaseFile({ state }: CaseFileProps) {
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'LOCATION' | 'SUSPECT'>('ALL');
  const [filterValue, setFilterValue] = useState<string>('');

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

  const selectedClue = CLUES.find(c => c.id === selectedClueId);
  const selectedClueLocation = selectedClue ? LOCATIONS.find(l => l.id === selectedClue.locationId) : null;
  const selectedClueSuspect = selectedClue && selectedClue.suspectId ? SUSPECTS.find(s => s.id === selectedClue.suspectId) : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="casefile-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h3 className="text-xl md:text-2xl font-serif italic font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Etsivän Tutkintakansio
        </h3>
        <p className="text-xs font-sans text-slate-400">
          Tarkastele kaikkia löytämiäsi fyysisiä, teknisiä ja kirjallisia johtolankoja. Voit suodattaa niitä paikan tai hahmon mukaan analyysin helpottamiseksi.
        </p>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Filters and Clues Index List (50%) */}
        <div className="lg:col-span-6 bg-slate-900/40 border border-white/5 p-5 rounded flex flex-col justify-between space-y-4 backdrop-blur-sm">
          
          <div className="space-y-4">
            {/* Filters selectors */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                Suodata johtolankoja:
              </span>

              <div className="flex gap-1.5 pb-2 border-b border-white/5">
                {(['ALL', 'LOCATION', 'SUSPECT'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterTypeChange(type)}
                    className={`py-1.5 px-3 border rounded text-[10px] font-mono font-bold tracking-wider uppercase cursor-pointer transition-colors ${
                      filterType === type
                        ? 'bg-amber-950/30 border-amber-600/50 text-amber-500'
                        : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {type === 'ALL' ? 'Kaikki' : type === 'LOCATION' ? 'Sijainti' : 'Epäilty'}
                  </button>
                ))}
              </div>

              {/* Dynamic Sub-Filter Options dropdown */}
              {filterType === 'LOCATION' && (
                <select
                  value={filterValue}
                  onChange={(e) => handleFilterValueChange(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-white/5 rounded text-xs text-slate-300 focus:outline-none focus:border-amber-600/50 font-sans"
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
                  className="w-full p-2 bg-slate-950 border border-white/5 rounded text-xs text-slate-300 focus:outline-none focus:border-amber-600/50 font-sans"
                >
                  <option value="">-- Valitse epäilty --</option>
                  {SUSPECTS.map(susp => (
                    <option key={susp.id} value={susp.id}>{susp.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Clues count indicator */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-1">
              <span>Näytetään {filteredClues.length} / {discoveredClues.length} löydetystä</span>
              <span>Kokonaispisteet: {discoveredClues.length} / 20</span>
            </div>

            {/* Clues grid container */}
            <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
              {filteredClues.length > 0 ? (
                filteredClues.map((clue) => {
                  const isActive = selectedClueId === clue.id;
                  const loc = LOCATIONS.find(l => l.id === clue.locationId);

                  return (
                    <button
                      key={clue.id}
                      onClick={() => handleClueClick(clue.id)}
                      className={`w-full p-3 border rounded text-xs font-sans font-medium transition-all text-left flex items-start gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-amber-950/25 border-amber-600/60 text-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.15)]'
                          : 'bg-slate-950/80 border-white/5 hover:border-amber-600/20 text-slate-300 hover:bg-slate-900/40'
                      }`}
                      id={`clue-list-item-${clue.id}`}
                    >
                      {/* Simple aesthetic clue icon badge */}
                      <div className="p-1.5 bg-slate-900 border border-white/5 text-slate-500 rounded font-mono text-center text-[9px] min-w-[32px]">
                        JOHTO
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <span className="font-semibold block text-slate-200">{clue.name}</span>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 leading-tight">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-600" />
                            {loc?.name || 'Mökki'}
                          </span>
                          {clue.isMisleading && (
                            <span className="bg-slate-900 text-amber-600 border border-amber-600/20 px-1 rounded uppercase tracking-wider text-[8px] font-bold">Harhautus</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                /* Empty filtered list state */
                <div className="text-center py-10 text-slate-600 text-xs font-sans">
                  {discoveredClues.length === 0
                    ? 'Et ole vielä löytänyt yhtään johtolankaa. Tutki mökkiä ja rantaa!'
                    : 'Ei suodatusta täsmääviä johtolankoja.'}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-sans leading-tight bg-slate-950/20 p-2 rounded">
            * Kerää vähintään 15 johtolankaa, jotta saat täydellisen kuvan tapauksesta ja voit esittää pitävän syytöksen.
          </div>

        </div>

        {/* RIGHT COLUMN: Selected Clue Detail Analyzer (50%) */}
        <div className="lg:col-span-6 bg-slate-900/40 border border-white/5 rounded p-5 flex flex-col justify-between backdrop-blur-sm relative">
          
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Eye className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Johtolanka-Analysaattori
              </span>
            </div>

            {selectedClue ? (() => {
              const clueImage = 
                selectedClue.id === 'elinan_aani_tallenteella' 
                  ? '/images/ui/elinan_aani_tallenteella.jpg' 
                  : selectedClue.id === 'kangas_antin_kadessa'
                  ? '/images/ui/kangas_antin_kadessa.jpg'
                  : selectedClue.id === 'antin_puhelin'
                  ? '/images/ui/antin_puhelin.jpg'
                  : selectedClue.id === 'tekstiviesti_lauralle'
                  ? '/images/ui/tekstiviesti_lauralle.jpg'
                  : selectedClue.id === 'auton_avaimet'
                  ? '/images/ui/auton_avaimet.jpg'
                  : selectedClue.id === 'elinan_kengat'
                  ? '/images/ui/elinan_kengat.jpg'
                  : selectedClue.id === 'keittion_kello'
                  ? '/images/ui/keittion_kello.jpg'
                  : selectedClue.id === 'markuksen_saunavaatteet'
                  ? '/images/ui/markuksen_saunavaatteet.jpg'
                  : selectedClue.id === 'kenganjaljet_venevajalla'
                  ? '/images/ui/kenganjaljet_venevajalla.jpg'
                  : selectedClue.id === 'poltettu_paperi'
                  ? '/images/ui/poltettu_paperi.jpg'
                  : selectedClue.id === 'oskarin_taskulamppu'
                  ? '/images/ui/oskarin_taskulamppu.jpg'
                  : selectedClue.id === 'repeytynyt_hiha'
                  ? '/images/ui/repeytynyt_hiha.jpg'
                  : selectedClue.id === 'rikkinainen_lyhty'
                  ? '/images/ui/rikkinainen_lyhty.jpg'
                  : selectedClue.id === 'tyokalulaatikko'
                  ? '/images/ui/tyokalulaatikko.jpg'
                  : selectedClue.id === 'tilisiirto_elinalle'
                  ? '/images/ui/tilisiirto_elinalle.jpg'
                  : selectedClue.id === 'kirjanpitopaperit'
                  ? '/images/ui/kirjanpitopaperit.jpg'
                  : selectedClue.id === 'saran_tallennin'
                  ? '/images/ui/saran_tallennin.jpg'
                  : selectedClue.id === 'tyhja_laakepakkaus'
                  ? '/images/ui/tyhja_laakepakkaus.jpg'
                  : null;

              return (
                <div className="space-y-4 flex-1 flex flex-col justify-start animate-fade-in py-2 overflow-y-auto max-h-[70vh] pr-1">
                  {/* Clue Visual Representation */}
                  {clueImage ? (
                    <div className="w-full overflow-hidden rounded border border-white/10 bg-slate-950 flex justify-center items-center shadow-lg" id={`clue-image-container-${selectedClue.id}`}>
                      <img
                        src={clueImage}
                        alt={selectedClue.name}
                        className="w-full h-auto max-h-[220px] object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] max-h-[100px] rounded border border-dashed border-white/5 bg-slate-950/40 flex flex-col items-center justify-center text-slate-600 gap-1.5" id={`clue-no-image-${selectedClue.id}`}>
                      <div className="p-1.5 bg-slate-950 border border-white/5 text-slate-500 rounded-full">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono tracking-widest uppercase">Ei visuaalista tallennetta</span>
                    </div>
                  )}

                  {/* Header metadata */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif italic font-bold text-slate-100">
                      {selectedClue.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Löytöpaikka: <strong className="text-slate-400">{selectedClueLocation?.name}</strong>
                        </span>
                        {selectedClueSuspect && (
                          <span className="flex items-center gap-1">
                            <User2 className="w-3.5 h-3.5" />
                            Hahmo: <strong className="text-slate-400">{selectedClueSuspect.name}</strong>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">
                        ID: {selectedClue.id}
                      </span>
                    </div>
                  </div>

                  {/* Category and Evidence Stars Badge */}
                  {(selectedClue.category || selectedClue.evidenceValueStars) && (
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono border-t border-b border-white/5 py-2">
                      <div>
                        <span className="text-slate-500 block uppercase tracking-wider">Kategoria:</span>
                        <span className="text-slate-300 font-sans font-semibold text-[11px]">{selectedClue.category || 'Tekniikka / Esine'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase tracking-wider">Todistusarvo:</span>
                        <span className="text-amber-500 font-sans font-bold flex items-center gap-1 text-[11px]">
                          {'★'.repeat(selectedClue.evidenceValueStars || 3)}
                          <span className="text-[9px] text-slate-400 font-mono font-normal">
                            {selectedClue.evidenceValueStars && selectedClue.evidenceValueStars >= 4 ? 'Erittäin korkea' : 'Normaali'}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Main description summary */}
                  <div className="space-y-1 bg-slate-950 border border-white/5 p-3.5 rounded">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Kuvaus:</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {selectedClue.description}
                    </p>
                  </div>

                  {/* Detailed expert forensic/investigative analysis */}
                  <div className="space-y-1.5 bg-slate-950 border border-white/5 p-3.5 rounded">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      Tutkijan analyysi:
                    </span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {selectedClue.forensicAnalysis || selectedClue.detailedAnalysis}
                    </p>
                  </div>

                  {/* Significance to the investigation */}
                  {selectedClue.investigativeSignificance && (
                    <div className="space-y-1.5 bg-amber-950/10 border border-amber-600/20 p-3.5 rounded">
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        Merkitys tutkinnalle:
                      </span>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {selectedClue.investigativeSignificance}
                      </p>
                    </div>
                  )}

                  {/* Connected Clues view */}
                  {selectedClue.connectedClues && selectedClue.connectedClues.length > 0 && (
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                        Johtolangan yhteydet:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedClue.connectedClues.map((connId) => {
                          const connClue = CLUES.find(c => c.id === connId);
                          const connSuspect = !connClue ? SUSPECTS.find(s => s.id === connId) : null;
                          
                          if (!connClue && !connSuspect) return null;
                          
                          const name = connClue ? connClue.name : (connSuspect ? `Epäilty: ${connSuspect.name}` : '');
                          const isDiscovered = connClue ? state.discoveredClues.includes(connId) : true;
                          const tooltip = connClue 
                            ? (isDiscovered ? `Siirry johtolankaan: ${name}` : 'Ei vielä löydetty')
                            : `Epäilty: ${connSuspect?.name}`;

                          return (
                            <button
                              key={connId}
                              disabled={!connClue || !isDiscovered}
                              onClick={() => connClue && handleClueClick(connId)}
                              className={`py-1 px-2 border rounded text-[10px] font-sans font-semibold transition-all flex items-center gap-1.5 ${
                                !connClue
                                  ? 'bg-slate-900/40 border-blue-900/30 text-blue-300'
                                  : isDiscovered
                                  ? 'bg-slate-950 border-white/10 text-slate-300 hover:border-amber-600/35 hover:text-amber-400 hover:bg-slate-900 cursor-pointer'
                                  : 'bg-slate-950/20 border-white/5 text-slate-600 cursor-not-allowed'
                              }`}
                              title={tooltip}
                              id={`connected-clue-btn-${connId}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${!connClue ? 'bg-blue-500' : isDiscovered ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`} />
                              <span>{name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Display specific action for specific clues (e.g. analyzed recorder) */}
                  {selectedClue.id === 'saran_tallennin' && !state.discoveredClues.includes('elinan_aani_tallenteella') && (
                    <div className="bg-amber-950/20 border border-amber-900/60 p-4 rounded space-y-3 mt-2">
                      <div>
                        <h4 className="text-xs font-sans font-bold text-amber-400">Huomattava tiedosto tallentimella</h4>
                        <p className="text-[11px] text-slate-400 font-sans leading-snug">
                          Tallentimesta löytyy erillinen äänitiedosto "REC_004.WAV". Haluatko ajaa siihen kohinanpoiston ja analysoida äänet?
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          audioSynth.playClueDiscovered();
                          state.discoveredClues.push('elinan_aani_tallenteella'); // mutates correctly via triggers
                          const elinasVoiceClue = CLUES.find(c => c.id === 'elinan_aani_tallenteella');
                          if (elinasVoiceClue) {
                            (window as any)._discoverClueCallback?.('elinan_aani_tallenteella', elinasVoiceClue.name);
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-sans text-xs font-semibold rounded transition-all cursor-pointer shadow-md border border-amber-500/30"
                      >
                        Suorita äänen kohinanpoisto ja analyysi
                      </button>
                    </div>
                  )}
                </div>
              );
            })() : (
              /* Detail analyzer empty state */
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-600 space-y-3 flex-1">
                <AlertCircle className="w-12 h-12 text-slate-700" />
                <div>
                  <p className="text-xs font-sans font-medium text-slate-500">
                    Valitse tutkittava kohde
                  </p>
                  <p className="text-[10px] text-slate-500 max-w-[240px] mt-1 mx-auto leading-relaxed">
                    Valitse jokin vasemman palstan johtolankoista nähdäksesi sen tarkan laboratoriotutkimuksen ja syvällisemmät etsivän päätelmät.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center">
              Hiljaisen Järven Poliisi • Tekniset todistusaineistot
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
export default CaseFile;
