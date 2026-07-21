import { useState } from 'react';
import { GameState, Contradiction } from '../../types/game';
import { CONTRADICTIONS, CLUES, SUSPECTS } from '../../data/storyData';
import { ShieldAlert, Award, Puzzle, HelpCircle, CheckCircle2, ListFilter, RefreshCw } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface InvestigationBoardProps {
  state: GameState;
  onDiscoverContradiction: (contradictionId: string, title: string) => void;
}

interface SelectableItem {
  type: 'clue' | 'alibi';
  id: string; // clue ID or suspect ID for alibi
  name: string;
  category: string; // e.g. "Johtolanka" or "Alibi"
}

export function InvestigationBoard({ state, onDiscoverContradiction }: InvestigationBoardProps) {
  const [selectedItemA, setSelectedItemA] = useState<SelectableItem | null>(null);
  const [selectedItemB, setSelectedItemB] = useState<SelectableItem | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  // Collect all discovered clues as selectable items
  const discoveredClueItems: SelectableItem[] = CLUES
    .filter(clue => state.discoveredClues.includes(clue.id))
    .map(clue => ({
      type: 'clue',
      id: clue.id,
      name: `${clue.name} (${clue.isMisleading ? 'Harhautus' : 'Todiste'})`,
      category: 'Johtolanka'
    }));

  // Collect all suspect alibis as selectable items
  const alibiItems: SelectableItem[] = SUSPECTS.map(susp => ({
    type: 'alibi',
    id: susp.id,
    name: `${susp.name} - Alibi (${susp.id === 'elina' ? 'Keittiö' : susp.id === 'markus' ? 'Sauna' : susp.id === 'laura' ? 'Makuuhuone' : susp.id === 'oskari' ? 'Sähkökatko' : 'Kirjoitustyö'})`,
    category: 'Alibi'
  }));

  const allSelectableItems = [...discoveredClueItems, ...alibiItems];

  const handleSelectA = (item: SelectableItem) => {
    audioSynth.playClick();
    setFeedback(null);
    if (selectedItemB?.id === item.id && selectedItemB?.type === item.type) {
      setSelectedItemB(null); // clear duplicates
    }
    setSelectedItemA(item);
  };

  const handleSelectB = (item: SelectableItem) => {
    audioSynth.playClick();
    setFeedback(null);
    if (selectedItemA?.id === item.id && selectedItemA?.type === item.type) {
      setSelectedItemA(null); // clear duplicates
    }
    setSelectedItemB(item);
  };

  const handleResetSelection = () => {
    audioSynth.playClick();
    setSelectedItemA(null);
    setSelectedItemB(null);
    setFeedback(null);
  };

  const handleConnect = () => {
    if (!selectedItemA || !selectedItemB) return;

    audioSynth.playClick();

    // Look for a contradiction that matches these two selected items
    const match = CONTRADICTIONS.find((contradiction) => {
      const match1 =
        (contradiction.itemA.type === selectedItemA.type && contradiction.itemA.id === selectedItemA.id &&
         contradiction.itemB.type === selectedItemB.type && contradiction.itemB.id === selectedItemB.id) ||
        (contradiction.itemA.type === selectedItemB.type && contradiction.itemA.id === selectedItemB.id &&
         contradiction.itemB.type === selectedItemA.type && contradiction.itemB.id === selectedItemA.id);

      return match1;
    });

    if (match) {
      // SUCCESSFUL CONTRADICTION UNCOVERED
      audioSynth.playContradictionFound();
      onDiscoverContradiction(match.id, match.title);
      setFeedback({
        message: match.discoveryMessage,
        success: true
      });
      setSelectedItemA(null);
      setSelectedItemB(null);
    } else {
      // INCORRECT COMBINATION
      setFeedback({
        message: 'Ei suoraa ristiriitaa. Nämä kaksi asiaa eivät kumoa toisiaan tai muodosta merkittävää uutta päätelmää. Tarkastele johtolankojen yksityiskohtia uudelleen.',
        success: false
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="investigation-board-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h3 className="text-xl md:text-2xl font-serif italic font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <Puzzle className="w-5 h-5 text-amber-500" />
          Mökkialueen Tutkintataulu
        </h3>
        <p className="text-xs font-sans text-slate-400">
          Aseta löytämiäsi todisteita ja epäiltyjen virallisia alibeja korkkitaululle. Yhdistä kaksi asiaa ja katso, paljastavatko ne ristiriitaisuuksia tai vahvistavatko ne kertomuksia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT TWO COLUMNS: Connectors workspace selection (60%) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 p-5 rounded flex flex-col justify-between space-y-6 backdrop-blur-sm relative">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-slate-500" />
                Deduktiivinen yhdistäjä (Valitse kaksi erilaista kohdetta)
              </span>
              
              {(selectedItemA || selectedItemB) && (
                <button
                  onClick={handleResetSelection}
                  className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  id="btn-reset-selection"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Nollaa valinnat</span>
                </button>
              )}
            </div>

            {/* Selection Slots Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Slot A */}
              <div className="border border-white/5 bg-slate-950 p-4 rounded flex flex-col justify-between min-h-[110px]">
                <div>
                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Kohde 1</span>
                  {selectedItemA ? (
                    <div className="mt-1 animate-scale-up">
                      <p className="text-xs font-semibold text-slate-200">{selectedItemA.name}</p>
                      <span className="text-[9px] font-mono uppercase bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-slate-400 mt-1.5 inline-block">
                        {selectedItemA.category}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 font-sans italic mt-1 select-none">Valitse ensimmäinen kohde alta...</p>
                  )}
                </div>
              </div>

              {/* Slot B */}
              <div className="border border-white/5 bg-slate-950 p-4 rounded flex flex-col justify-between min-h-[110px]">
                <div>
                  <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Kohde 2</span>
                  {selectedItemB ? (
                    <div className="mt-1 animate-scale-up">
                      <p className="text-xs font-semibold text-slate-200">{selectedItemB.name}</p>
                      <span className="text-[9px] font-mono uppercase bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-slate-400 mt-1.5 inline-block">
                        {selectedItemB.category}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 font-sans italic mt-1 select-none">Valitse toinen kohde alta...</p>
                  )}
                </div>
              </div>

            </div>

            {/* Selection Grid buttons */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                Valittavissa olevat aineistot (Klikkaa asettaaksesi kohdepaikkaan):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[25vh] overflow-y-auto pr-1">
                {allSelectableItems.map((item) => {
                  const isA = selectedItemA?.id === item.id && selectedItemA?.type === item.type;
                  const isB = selectedItemB?.id === item.id && selectedItemB?.type === item.type;
                  const isAlibi = item.type === 'alibi';

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`p-2 rounded border text-xs font-sans font-medium flex items-center justify-between gap-2 transition-all ${
                        isA || isB
                          ? 'bg-slate-850 border-amber-600/50 text-slate-100 font-semibold shadow-sm'
                          : 'bg-slate-950/90 border-white/5 hover:border-amber-600/20 text-slate-300'
                      }`}
                    >
                      <span className="truncate leading-snug">{item.name}</span>
                      
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleSelectA(item)}
                          disabled={isA}
                          className={`px-1.5 py-0.5 text-[9px] font-mono border rounded uppercase cursor-pointer transition-colors ${
                            isA
                              ? 'bg-amber-950/50 border-amber-600/60 text-amber-400'
                              : 'bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-400'
                          }`}
                          title="Aseta kohteeksi 1"
                        >
                          K1
                        </button>
                        <button
                          onClick={() => handleSelectB(item)}
                          disabled={isB}
                          className={`px-1.5 py-0.5 text-[9px] font-mono border rounded uppercase cursor-pointer transition-colors ${
                            isB
                              ? 'bg-amber-950/50 border-amber-600/60 text-amber-400'
                              : 'bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-400'
                          }`}
                          title="Aseta kohteeksi 2"
                        >
                          K2
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action trigger button */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-[10px] text-slate-500 font-sans max-w-[320px] text-left">
              * Yhdistämällä oikeat todisteet, ne kiinnittyvät pysyvästi etsivän korkkitaululle ja auttavat ratkaisemaan mysteerin.
            </span>
            <button
              onClick={handleConnect}
              disabled={!selectedItemA || !selectedItemB}
              className={`py-2.5 px-6 font-sans text-xs font-semibold rounded transition-all cursor-pointer ${
                selectedItemA && selectedItemB
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md border border-amber-500/30'
                  : 'bg-slate-950 border border-white/5 text-slate-600 cursor-not-allowed'
              }`}
              id="btn-perform-connect"
            >
              <Puzzle className="w-4 h-4 shrink-0" />
              <span>Yhdistä todisteet</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Discovered Contradictions Board (40%) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded flex-1 flex flex-col justify-between space-y-6 backdrop-blur-sm">
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Korkkitaulun Havainnot ({state.discoveredContradictions.length} / 5)
                </span>
              </div>

              {/* Feedback Alert box (if any) */}
              {feedback && (
                <div className={`p-4 border rounded text-xs leading-relaxed space-y-2 animate-scale-up ${
                  feedback.success
                    ? 'bg-emerald-950/25 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/15 border-red-900/40 text-red-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold font-sans">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{feedback.success ? 'Oivallus!' : 'Ei yhteyttä'}</span>
                  </div>
                  <p className="font-sans leading-relaxed text-[11px] md:text-xs">
                    {feedback.message}
                  </p>
                </div>
              )}

              {/* List of successfully unlocked contradictions */}
              <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
                {state.discoveredContradictions.length > 0 ? (
                  CONTRADICTIONS.filter(c => state.discoveredContradictions.includes(c.id)).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-950 border border-white/5 rounded space-y-1.5 border-l-2 border-l-amber-500 animate-scale-up"
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono text-amber-500">
                        <span className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                          Ristiriita selvitetty
                        </span>
                      </div>
                      <h4 className="text-xs font-serif italic font-bold text-slate-200 leading-snug">
                        {c.title}
                      </h4>
                      <p className="text-[10px] md:text-[11px] text-slate-400 font-sans leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  ))
                ) : (
                  /* Corkboard empty state */
                  <div className="flex flex-col items-center justify-center text-center py-10 text-slate-600 space-y-3 select-none">
                    <HelpCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                    <div>
                      <p className="text-xs font-sans font-medium text-slate-500">
                        Korkkitaulu on tyhjä
                      </p>
                      <p className="text-[10px] text-slate-600 max-w-[180px] mt-1 mx-auto">
                        Valitse alibeja ja todisteita vasemmalta ja paina "Yhdistä", niin ristiriidat kiinnittyvät tähän.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center">
              Deductive Reasoning Corkboard
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default InvestigationBoard;
