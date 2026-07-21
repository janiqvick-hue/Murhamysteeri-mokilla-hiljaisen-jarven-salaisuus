import { ChangeEvent } from 'react';
import { GameState } from '../../types/game';
import { FilePenLine, CheckCircle2, Star, Sparkles, Save } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface NotesProps {
  state: GameState;
  onSaveNotes: (text: string) => void;
}

export function Notes({ state, onSaveNotes }: NotesProps) {
  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onSaveNotes(e.target.value);
  };

  const handleNotesKeyDown = () => {
    // Play a subtle mechanical typewriter sound if desired on keys, but we can keep it standard
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="notes-view-container">
      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h3 className="text-xl md:text-2xl font-serif italic font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
          <FilePenLine className="w-5 h-5 text-amber-500" />
          Etsivän Muistiinpanot
        </h3>
        <p className="text-xs font-sans text-slate-400">
          Kirjaa ylös omia epäilyksiäsi, motiiveja ja havaintoja. Kaikki kirjoittamasi tallentuu automaattisesti selaimesi muistiin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Large Typewriter Notepad (60%) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-5 rounded flex flex-col justify-between backdrop-blur-sm relative">
          
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FilePenLine className="w-4 h-4 text-slate-500" />
                Henkilökohtainen etsivän päiväkirja
              </span>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Save className="w-3.5 h-3.5 text-amber-500" />
                <span>Automaattinen tallennus</span>
              </span>
            </div>

            <div className="flex-1 mt-3">
              <textarea
                value={state.notes}
                onChange={handleNotesChange}
                onKeyDown={handleNotesKeyDown}
                placeholder="Kirjoita tähän havaintojasi epäillyistä, outoja lausuntoja tai mahdollisia teorioita murhasta... Esimerkki: 'Elina vaikuttaa liiankin rauhalliselta, vaikka Antti oli hänen liikekumppaninsa...'"
                className="w-full h-[45vh] lg:h-[50vh] p-4 bg-slate-950 border border-white/5 rounded text-sm text-slate-200 focus:outline-none focus:border-amber-600/50 font-sans leading-relaxed resize-none shadow-inner placeholder:text-slate-700"
                id="notes-textarea"
              />
            </div>

            <div className="pt-3 text-[10px] text-slate-500 font-sans leading-tight bg-slate-950/20 p-2 rounded">
              * Muistiinpanot ovat täysin vapaamuotoisia, eivätkä ne vaikuta pelin mekaaniseen etenemiseen. Ne auttavat sinua pitämään ajatuksesi järjestyksessä.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Auto-Generated Chronology / Summary of discoveries (40%) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded flex-1 flex flex-col justify-between space-y-6 backdrop-blur-sm">
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Etsivän Havainnot & Faktat
                </span>
              </div>

              <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                <p className="text-[11px] font-sans text-slate-400">
                  Tähän osioon koottu automaattisesti tärkeimpiä riidattomia faktoja, jotka olet onnistunut todistamaan korkkitaululla tai kuulusteluissa:
                </p>

                {/* Core facts lists */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-950 border border-white/5 rounded text-xs space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest">Perustiedot:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li>Uhri: <strong className="text-slate-200">Antti Lehtonen</strong> (kuollut)</li>
                      <li>Vammat: Kallonmurtuma päähän kohdistuneesta iskusta</li>
                      <li>Katoamisaika: Lauantai-ilta noin klo 23.00</li>
                    </ul>
                  </div>

                  {/* Fact: Embezzlement */}
                  {state.discoveredClues.includes('tilisiirto_elinalle') && (
                    <div className="p-3 bg-slate-950 border border-white/5 rounded text-xs space-y-1 border-l-2 border-l-amber-500 animate-scale-up">
                      <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-widest">Motiivi todistettu:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        Löytyi todiste, että <strong className="text-zinc-200">Elina Koskinen</strong> on kavaltanut yli 420 000 euroa yhteisen konsulttiyrityksen varoja Cayman-saarille omalle tililleen.
                      </p>
                    </div>
                  )}

                  {/* Fact: Footprints matching */}
                  {state.discoveredContradictions.includes('kengat_vs_jäljet') && (
                    <div className="p-3 bg-slate-950 border border-white/5 rounded text-xs space-y-1 border-l-2 border-l-amber-500 animate-scale-up">
                      <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-widest">Sijainti kumottu:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        Elinan kalanruotokenkien pohjat vastaavat täydellisesti venevajan liejusta löytyneitä kengänjälkiä. Elina oli venevajalla, vaikka kiistää sen.
                      </p>
                    </div>
                  )}

                  {/* Fact: Voice recording matching */}
                  {state.discoveredContradictions.includes('alibi_vs_tallenne') && (
                    <div className="p-3 bg-slate-950 border border-white/5 rounded text-xs space-y-1 border-l-2 border-l-amber-500 animate-scale-up">
                      <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-widest">Alibi kumottu:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        Saran tallentimella REC_004.WAV kuuluu Elinan ja Antin äänekäs ja vihainen riippa rannassa klo 23.10. Elina ei ollut keittiössä tiskaamassa.
                      </p>
                    </div>
                  )}

                  {/* Fact: Torn Sleeve matching */}
                  {state.discoveredContradictions.includes('hiha_vs_kangas') && (
                    <div className="p-3 bg-slate-950 border border-white/5 rounded text-xs space-y-1 border-l-2 border-l-amber-500 animate-scale-up">
                      <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-widest">Kamppailu todistettu:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        Antin kädestä kuoleman jälkeen löytynyt musta kangaspala vastaa tismalleen Elinan mustan kashmirvillatakin repeytynyttä hihaa. Heillä oli fyysinen kamppailu.
                      </p>
                    </div>
                  )}

                  {state.discoveredContradictions.length === 0 && (
                    <div className="text-center py-6 text-slate-600 text-[11px] font-sans italic select-none">
                      Et ole vielä todistanut ristiriitoja korkkitaululla. Etsi todisteiden ja alibien välisiä aukkoja ja palaa katsomaan tähän muodostuvia faktoja.
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center">
              Deduction Notepad • Saved locally in browser
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Notes;
