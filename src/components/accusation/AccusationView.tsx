import { useState, FormEvent } from 'react';
import { GameState, Accusation } from '../../types/game';
import { SUSPECTS, LOCATIONS, CLUES } from '../../data/storyData';
import { Skull, AlertTriangle, ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface AccusationViewProps {
  state: GameState;
  onSubmitAccusation: (accusation: Accusation, isCorrect: boolean) => void;
}

export function AccusationView({ state, onSubmitAccusation }: AccusationViewProps) {
  const [suspectId, setSuspectId] = useState<string>('');
  const [motive, setMotive] = useState<string>('');
  const [weapon, setWeapon] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);

  // Get only clues discovered by player
  const discoveredClues = CLUES.filter(clue => state.discoveredClues.includes(clue.id));

  // Motive options
  const motiveOptions = [
    { label: 'Antti aikoi paljastaa Elinan tekemän suuren kavalluksen', value: 'Antti aikoi paljastaa kavalluksen' },
    { label: 'Antti vaati Markusta maksamaan heti suuren pelivelkansa', value: 'Markuksen pelivelat' },
    { label: 'Laura oli katkera avioerosta ja halusi Antin henkivakuutusrahat', value: 'Laura katkeruus ja vakuutus' },
    { label: 'Antti uhkasi paljastaa Oskarin laittomat mökkirakennukset viranomaisille', value: 'Oskarin mökkipaljastus' },
    { label: 'Sara halusi repäisevän jymyuutisen yrityksen talousrikoksista pelastaakseen uransa', value: 'Saran jymyuutinen' }
  ];

  // Weapon options
  const weaponOptions = [
    { label: 'Valurautainen metallinen myrskylyhty', value: 'metallinen lyhty' },
    { label: 'Vanha sorkkarauta työkalupakista', value: 'sorkkarauta' },
    { label: 'Unilääkkeiden yliannostus saunalla', value: 'unilääke' },
    { label: 'Väkisin kuristaminen tai hukuttaminen', value: 'kuristaminen' }
  ];

  const handleClueToggle = (clueId: string) => {
    audioSynth.playClick();
    setSelectedClueIds((prev) => {
      if (prev.includes(clueId)) {
        return prev.filter(id => id !== clueId);
      } else {
        if (prev.length >= 3) {
          // Max 3 clues limit
          return [prev[1], prev[2], clueId];
        }
        return [...prev, clueId];
      }
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!suspectId || !motive || !weapon || !locationId || selectedClueIds.length !== 3) {
      return;
    }

    audioSynth.playClick();

    // Verification check for correct solution:
    // Murderer: Elina Koskinen (id: 'elina')
    // Motive: Antti was going to expose embezzlement ('Antti aikoi paljastaa kavalluksen')
    // Weapon: metal lantern ('metallinen lyhty')
    // Scene: boathouse (id: 'venevaja')
    // 3 critical clues: must be from the list of correct clues ('tilisiirto_elinalle', 'elinan_aani_tallenteella', 'kangas_antin_kadessa', 'repeytynyt_hiha', 'kenganjaljet_venevajalla', 'rikkinainen_lyhty')
    const correctClueIds = ['tilisiirto_elinalle', 'elinan_aani_tallenteella', 'kangas_antin_kadessa', 'repeytynyt_hiha', 'kenganjaljet_venevajalla', 'rikkinainen_lyhty'];
    
    const isMurdererCorrect = suspectId === 'elina';
    const isMotiveCorrect = motive === 'Antti aikoi paljastaa kavalluksen';
    const isWeaponCorrect = weapon === 'metallinen lyhty';
    const isLocationCorrect = locationId === 'venevaja';
    
    const matchedCorrectClues = selectedClueIds.filter(id => correctClueIds.includes(id));
    const isCluesCorrect = matchedCorrectClues.length === 3; // Must have exactly 3 correct supporting clues!

    const isAllCorrect = isMurdererCorrect && isMotiveCorrect && isWeaponCorrect && isLocationCorrect && isCluesCorrect;

    const accusationObj: Accusation = {
      suspectId,
      motive,
      weapon,
      locationId,
      clueIds: selectedClueIds
    };

    onSubmitAccusation(accusationObj, isAllCorrect);
  };

  const isFormIncomplete = !suspectId || !motive || !weapon || !locationId || selectedClueIds.length !== 3;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6" id="accusation-view-container">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-slate-900 border border-white/5 rounded-full inline-block">
          <Skull className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <h2 className="text-xl md:text-3xl font-serif italic font-bold text-slate-100 tracking-tight">
          Esitä Virallinen Syytös
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Oletko kerännyt riittävästi todisteita ja ratkaissut Hiljaisen järven mysteerin? Valitse murhaaja, motiivi, tekoväline, tapahtumapaikka ja esitä kolme aukotonta todistetta syyllisyydestä.
        </p>
      </div>

      {state.discoveredClues.length < 15 && (
        <div className="p-4 bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded text-xs md:text-sm flex items-start gap-2.5 max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div className="space-y-1">
            <span className="font-bold font-serif">Etsivän suositus:</span>
            <p className="leading-relaxed">
              Sinulla on tällä hetkellä kasassa vain <strong className="text-white">{state.discoveredClues.length} / 20 johtolankaa</strong>. Syytöksen esittäminen näin varhaisessa vaiheessa on riskialtista ja saattaa kaatua puutteelliseen näyttöön. Suosittelemme etsimään vähintään <strong className="text-white">15 johtolankaa</strong> ennen syytöksen tekemistä.
            </p>
          </div>
        </div>
      )}

      {/* Accusation Selection Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded shadow-2xl backdrop-blur-sm space-y-6" id="accusation-form">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Murderer Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              1. Epäilty Murhaaja
            </label>
            <select
              value={suspectId}
              onChange={(e) => setSuspectId(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-white/5 rounded text-sm text-slate-200 focus:outline-none focus:border-amber-600/50 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">-- Valitse syytetty --</option>
              {SUSPECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          {/* 2. Scene Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              2. Tapahtumapaikka
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-white/5 rounded text-sm text-slate-200 focus:outline-none focus:border-amber-600/50 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">-- Valitse paikka --</option>
              {LOCATIONS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* 3. Motive Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              3. Murhan Motiivi
            </label>
            <select
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-white/5 rounded text-sm text-slate-200 focus:outline-none focus:border-amber-600/50 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">-- Valitse motiivi --</option>
              {motiveOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 4. Weapon Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              4. Murha-ase / Tekoväline
            </label>
            <select
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-white/5 rounded text-sm text-slate-200 focus:outline-none focus:border-amber-600/50 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">-- Valitse tekoväline --</option>
              {weaponOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* 5. Critical Clues checkboxes - exactly 3 */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              5. Valitse kolme (3) raskauttavaa todistetta:
            </label>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              selectedClueIds.length === 3 ? 'bg-amber-950/40 border border-amber-600/30 text-amber-400' : 'bg-slate-950 border border-white/5 text-slate-500'
            }`}>
              Valittu: {selectedClueIds.length} / 3 todistetta
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Valitse keräämistäsi johtolangoista ne kolme, jotka osoittavat kiistatta murhaajan valheet ja sitovat hänet tekoon rannassa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-1">
            {discoveredClues.map((clue) => {
              const isChecked = selectedClueIds.includes(clue.id);

              return (
                <button
                  key={clue.id}
                  type="button"
                  onClick={() => handleClueToggle(clue.id)}
                  className={`p-3 border rounded text-xs font-sans font-medium flex items-center justify-start gap-3 transition-all text-left cursor-pointer ${
                    isChecked
                      ? 'bg-amber-950/20 border-amber-600 text-amber-400 font-semibold'
                      : 'bg-slate-950 border border-white/5 text-slate-400 hover:border-amber-600/20 hover:text-slate-300'
                  }`}
                  id={`clue-checkbox-${clue.id}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-650 shrink-0" />
                  )}
                  <span className="leading-snug">{clue.name}</span>
                </button>
              );
            })}

            {discoveredClues.length === 0 && (
              <div className="text-center py-6 text-slate-600 text-xs font-sans sm:col-span-2 italic">
                Sinulla ei ole vielä yhtään johtolankaa salkussasi. Tutki mökkiä kerätäksesi todisteita!
              </div>
            )}
          </div>
        </div>

        {/* Form Submission Call to Action */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-1.5 text-[10px] text-slate-500 font-sans max-w-[420px] text-left">
            <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>
              * Syytöksen esittäminen lukitsee valintasi. Jos ratkaisu on väärä, voit jatkaa pelin pelaamista, tutkia mökkiä ja yrittää uudelleen saatuasi uusia havaintoja.
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isFormIncomplete}
            className={`py-3 px-8 font-sans text-xs font-semibold rounded transition-all cursor-pointer ${
              isFormIncomplete
                ? 'bg-slate-950 border border-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.15)]'
            }`}
            id="btn-submit-accusation"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Esitä virallinen syytös</span>
          </button>
        </div>

      </form>
    </div>
  );
}
export default AccusationView;
