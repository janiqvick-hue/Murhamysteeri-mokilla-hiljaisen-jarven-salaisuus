import { useState, FormEvent } from 'react';
import { GameState, Accusation } from '../../types/game';
import { SUSPECTS, LOCATIONS, CLUES } from '../../data/storyData';
import { DEDUCTIONS } from '../../data/deductionData';
import { Skull, AlertTriangle, ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { verifyAccusation } from '../../utils/accusationVerification';
import { useLanguage } from '../../localization/useLanguage';

interface AccusationViewProps {
  state: GameState;
  onSubmitAccusation: (accusation: Accusation, isCorrect: boolean) => void;
}

export function AccusationView({ state, onSubmitAccusation }: AccusationViewProps) {
  const { language, tText } = useLanguage();
  const isFi = language === 'fi';

  // Pre-fill from previous accusation if available
  const prevAccusation = state.lastAccusation;

  const [suspectId, setSuspectId] = useState<string>(prevAccusation?.suspectId || '');
  const [motive, setMotive] = useState<string>(prevAccusation?.motive || '');
  const [weapon, setWeapon] = useState<string>(prevAccusation?.weapon || '');
  const [locationId, setLocationId] = useState<string>(prevAccusation?.locationId || '');
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>(prevAccusation?.clueIds || []);

  // Get only clues discovered by player
  const discoveredClues = CLUES.filter((clue) => state.discoveredClues.includes(clue.id));

  // Check if all deduction tasks are solved
  const requiredSolvedFlags = DEDUCTIONS.map((task) => task.solvedFlag);
  const solvedFlags = state.ratkaistutRistiriidat || [];
  const allDeductionsSolved = requiredSolvedFlags.every((flag) =>
    solvedFlags.includes(flag)
  );

  // Motive options (aligned with game clues & story)
  const motiveOptions = [
    {
      label: isFi
        ? 'Antti aikoi paljastaa Elinan tekemän suuren kavalluksen'
        : 'Antti was going to expose Elina’s major embezzlement',
      value: 'Antti aikoi paljastaa kavalluksen',
    },
    {
      label: isFi
        ? 'Antti vaati Markusta maksamaan heti suuren pelivelkansa'
        : 'Antti demanded Markus pay his heavy gambling debt immediately',
      value: 'Markuksen pelivelat',
    },
    {
      label: isFi
        ? 'Laura oli katkera avioerosta ja halusi Antin henkivakuutusrahat'
        : 'Laura was bitter about the divorce and wanted Antti’s life insurance',
      value: 'Laura katkeruus ja vakuutus',
    },
    {
      label: isFi
        ? 'Antti uhkasi paljastaa Oskarin laittomat mökkirakennukset viranomaisille'
        : 'Antti threatened to expose Oskari’s illegal cottage buildings',
      value: 'Oskarin mökkipaljastus',
    },
    {
      label: isFi
        ? 'Sara halusi repäisevän jymyuutisen yrityksen talousrikoksista pelastaakseen uransa'
        : 'Sara wanted a major scoop on financial crimes to save her career',
      value: 'Saran jymyuutinen',
    },
  ];

  // Weapon options (aligned with game clues)
  const weaponOptions = [
    {
      label: isFi
        ? 'Valurautainen metallinen myrskylyhty (rikkinainen lyhty)'
        : 'Cast iron metal storm lantern (broken lantern)',
      value: 'metallinen lyhty',
    },
    {
      label: isFi ? 'Vanha sorkkarauta työkalupakista' : 'Old crowbar from toolbox',
      value: 'sorkkarauta',
    },
    {
      label: isFi ? 'Unilääkkeiden yliannostus saunalla' : 'Overdose of sleeping pills at sauna',
      value: 'unilääke',
    },
    {
      label: isFi ? 'Väkisin kuristaminen tai hukuttaminen' : 'Manual strangulation or drowning',
      value: 'kuristaminen',
    },
    {
      label: isFi ? 'Oskarin raskas taskulamppu' : 'Oskari’s heavy flashlight',
      value: 'taskulamppu',
    },
  ];

  // Handle toggling clue selection (3 to 5 clues allowed)
  const handleClueToggle = (clueId: string) => {
    audioSynth.playClick();
    setSelectedClueIds((prev) => {
      if (prev.includes(clueId)) {
        return prev.filter((id) => id !== clueId);
      } else {
        if (prev.length >= 5) {
          // Replace oldest if already at 5 max
          return [...prev.slice(1), clueId];
        }
        return [...prev, clueId];
      }
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!suspectId || !motive || !weapon || !locationId || selectedClueIds.length < 3 || selectedClueIds.length > 5) {
      return;
    }

    audioSynth.playClick();

    const rawAccusation: Accusation = {
      suspectId,
      motive,
      weapon,
      locationId,
      clueIds: selectedClueIds,
    };

    // Run generic verification check
    const verification = verifyAccusation(rawAccusation, state);

    const completeAccusation: Accusation = {
      ...rawAccusation,
      resultType: verification.resultType,
      feedbacks: verification.feedbacks,
    };

    onSubmitAccusation(completeAccusation, verification.isCorrect);
  };

  const isFormIncomplete =
    !suspectId ||
    !motive ||
    !weapon ||
    !locationId ||
    selectedClueIds.length < 3 ||
    selectedClueIds.length > 5;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6" id="accusation-view-container">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-zinc-900 border border-amber-600/30 rounded-full inline-block shadow-[0_0_15px_rgba(217,119,6,0.15)]">
          <Skull className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <h2 className="text-xl md:text-3xl font-serif italic font-bold text-zinc-100 tracking-tight">
          {isFi ? 'Esitä Lopullinen Syytös' : 'Make Final Accusation'}
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {isFi
            ? 'Oletko koonnut palapelin palaset ja ratkaissut Hiljaisen järven veriteon? Valitse mielestäsi syyllinen, motiivi, tekoväline, tapahtumapaikka ja 3–5 tärkeintä todistetta, joilla vakuutat syyttäjän.'
            : 'Have you gathered the pieces and solved the crime at Silent Lake? Select the suspect, motive, murder weapon, crime scene, and 3–5 key evidence items to convince the prosecutor.'}
        </p>
      </div>

      {/* Warning if early stage or incomplete deductions */}
      {!allDeductionsSolved ? (
        <div className="p-4 bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded text-xs md:text-sm flex items-start gap-2.5 max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div className="space-y-1">
            <span className="font-bold font-serif">
              {isFi ? 'Etsivän suositus:' : 'Detective warning:'}
            </span>
            <p className="leading-relaxed">
              {isFi
                ? 'Tutkintasi päättelyketju on vielä keskeneräinen. Ratkaise avoimet kysymykset tutkintataululla ennen virallisen syytöksen esittämistä.'
                : 'Your chain of reasoning is still incomplete. Resolve the open questions on the investigation board before presenting an official accusation.'}
            </p>
          </div>
        </div>
      ) : state.discoveredClues.length < 15 ? (
        <div className="p-4 bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded text-xs md:text-sm flex items-start gap-2.5 max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div className="space-y-1">
            <span className="font-bold font-serif">
              {isFi ? 'Etsivän suositus:' : 'Detective warning:'}
            </span>
            <p className="leading-relaxed">
              {isFi
                ? `Sinulla on tällä hetkellä hallussasi vasta ${state.discoveredClues.length} / 20 johtolankaa. Syytöksen esittäminen varhaisessa vaiheessa voi kaatua puutteelliseen näyttöön.`
                : `You currently possess only ${state.discoveredClues.length} / 20 clues. Making an accusation early risks failing due to insufficient proof.`}
            </p>
          </div>
        </div>
      ) : null}

      {/* Accusation Selection Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/80 border border-zinc-800 p-6 md:p-8 rounded-lg shadow-2xl backdrop-blur-sm space-y-6"
        id="accusation-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Murderer Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              {isFi ? '1. Epäilty Syyllinen' : '1. Accused Suspect'}
            </label>
            <select
              value={suspectId}
              onChange={(e) => setSuspectId(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-200 focus:outline-none focus:border-amber-600/60 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">{isFi ? '-- Valitse syytetty --' : '-- Select suspect --'}</option>
              {SUSPECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({tText(s.role)})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Crime Scene Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              {isFi ? '2. Rikospaikka' : '2. Crime Scene'}
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-200 focus:outline-none focus:border-amber-600/60 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">{isFi ? '-- Valitse paikka --' : '-- Select crime scene --'}</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {tText(l.name)}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Motive Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              {isFi ? '3. Rikoksen Motiivi' : '3. Crime Motive'}
            </label>
            <select
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-200 focus:outline-none focus:border-amber-600/60 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">{isFi ? '-- Valitse motiivi --' : '-- Select motive --'}</option>
              {motiveOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Weapon Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
              {isFi ? '4. Murha-ase / Tekoväline' : '4. Murder Weapon'}
            </label>
            <select
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-200 focus:outline-none focus:border-amber-600/60 font-sans cursor-pointer transition-colors"
              required
            >
              <option value="">{isFi ? '-- Valitse tekoväline --' : '-- Select weapon --'}</option>
              {weaponOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Key Evidence Checkboxes (3 to 5 items) */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
              {isFi
                ? '5. Valitse 3–5 tärkeintä todistetta syytöksen tueksi:'
                : '5. Select 3–5 key evidence items supporting your case:'}
            </label>
            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold transition-all ${
                selectedClueIds.length >= 3 && selectedClueIds.length <= 5
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-400'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-500'
              }`}
            >
              {isFi ? 'Valittu' : 'Selected'}: {selectedClueIds.length} / 3–5
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-tight">
            {isFi
              ? 'Millä löytämilläsi todisteilla vakuuttaisit poliisin ja syyttäjän? Valitse 3–5 kaikkein ratkaisevinta johtolankaa.'
              : 'Which discovered evidence would convince the police and prosecutor? Select 3–5 key clues.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto pr-1">
            {discoveredClues.map((clue) => {
              const isChecked = selectedClueIds.includes(clue.id);

              return (
                <button
                  key={clue.id}
                  type="button"
                  onClick={() => handleClueToggle(clue.id)}
                  className={`p-3 border rounded text-xs font-sans font-medium flex items-center justify-start gap-3 transition-all text-left cursor-pointer ${
                    isChecked
                      ? 'bg-amber-950/30 border-amber-600/70 text-amber-300 font-semibold shadow-[0_0_10px_rgba(217,119,6,0.1)]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-amber-600/30 hover:text-zinc-200'
                  }`}
                  id={`clue-checkbox-${clue.id}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                  <span className="leading-snug">{tText(clue.name)}</span>
                </button>
              );
            })}

            {discoveredClues.length === 0 && (
              <div className="text-center py-6 text-zinc-600 text-xs font-sans sm:col-span-2 italic">
                {isFi
                  ? 'Sinulla ei ole vielä yhtään johtolankaa salkussasi. Tutki mökkiä kerätäksesi todisteita!'
                  : 'You have no clues in your case file yet. Investigate the cottage to find evidence!'}
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-1.5 text-[10px] text-zinc-500 font-sans max-w-[420px] text-left">
            <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <span>
              {isFi
                ? '* Syytöksen esittäminen vahvistaa valintasi. Jos syytös ei kestä, voit jatkaa tutkintaa ja yrittää uudelleen.'
                : '* Submitting an accusation locks your choices. If it fails, you can return to investigate and try again.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isFormIncomplete}
            className={`py-3 px-8 font-sans text-xs font-semibold rounded flex items-center gap-2 transition-all cursor-pointer ${
              isFormIncomplete
                ? 'bg-zinc-950 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.2)]'
            }`}
            id="btn-submit-accusation"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{isFi ? 'Esitä virallinen syytös' : 'Make Official Accusation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccusationView;
