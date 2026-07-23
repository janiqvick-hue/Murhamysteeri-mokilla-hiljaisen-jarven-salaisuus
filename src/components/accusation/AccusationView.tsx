import { useState, FormEvent } from 'react';
import { GameState, Accusation } from '../../types/game';
import { SUSPECTS, LOCATIONS, CLUES } from '../../data/storyData';
import { DEDUCTIONS } from '../../data/deductionData';
import { 
  Skull, AlertTriangle, ShieldCheck, CheckSquare, Square, Info, 
  FileText, CheckCircle2, Stamp, FilePenLine, UserCheck, MapPin, 
  Crosshair, ShieldAlert, X, FileCheck, Award
} from 'lucide-react';
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
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

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
      hint: isFi ? 'Motiivina Cayman-saarten kavallus' : 'Motive: Cayman Islands embezzlement',
    },
    {
      label: isFi
        ? 'Antti vaati Markusta maksamaan heti suuren pelivelkansa'
        : 'Antti demanded Markus pay his heavy gambling debt immediately',
      value: 'Markuksen pelivelat',
      hint: isFi ? 'Motiivina pelivelat & henkilökohtainen konkurssi' : 'Motive: Gambling debt & bankruptcy',
    },
    {
      label: isFi
        ? 'Laura oli katkera avioerosta ja halusi Antin henkivakuutusrahat'
        : 'Laura was bitter about the divorce and wanted Antti’s life insurance',
      value: 'Laura katkeruus ja vakuutus',
      hint: isFi ? 'Motiivina katkeruus & henkivakuutus' : 'Motive: Bitterness & life insurance',
    },
    {
      label: isFi
        ? 'Antti uhkasi paljastaa Oskarin laittomat mökkirakennukset viranomaisille'
        : 'Antti threatened to expose Oskari’s illegal cottage buildings',
      value: 'Oskarin mökkipaljastus',
      hint: isFi ? 'Motiivina luvattomat rakennukset' : 'Motive: Illegal construction',
    },
    {
      label: isFi
        ? 'Sara halusi repäisevän jymyuutisen yrityksen talousrikoksista pelastaakseen uransa'
        : 'Sara wanted a major scoop on financial crimes to save her career',
      value: 'Saran jymyuutinen',
      hint: isFi ? 'Motiivina lehtijuttu & toimittajan ura' : 'Motive: Journalist scoop',
    },
  ];

  // Weapon options (aligned with game clues)
  const weaponOptions = [
    {
      label: isFi
        ? 'Valurautainen metallinen myrskylyhty (rikkinainen lyhty)'
        : 'Cast iron metal storm lantern (broken lantern)',
      value: 'metallinen lyhty',
      hint: isFi ? 'Raskas metalli-isku päähän venevajalla' : 'Heavy metallic blow at boathouse',
    },
    {
      label: isFi ? 'Vanha sorkkarauta työkalupakista' : 'Old crowbar from toolbox',
      value: 'sorkkarauta',
      hint: isFi ? 'Työkalupakin raskas teräsase' : 'Heavy steel tool from box',
    },
    {
      label: isFi ? 'Unilääkkeiden yliannostus saunalla' : 'Overdose of sleeping pills at sauna',
      value: 'unilääke',
      hint: isFi ? 'Myrkytys / lääkeyliannostus' : 'Poisoning / overdose',
    },
    {
      label: isFi ? 'Väkisin kuristaminen tai hukuttaminen' : 'Manual strangulation or drowning',
      value: 'kuristaminen',
      hint: isFi ? 'Käsikähmä / hukuttaminen' : 'Physical strangulation',
    },
    {
      label: isFi ? 'Oskarin raskas taskulamppu' : 'Oskari’s heavy flashlight',
      value: 'taskulamppu',
      hint: isFi ? 'Raskas maglite-valaisin' : 'Heavy flashlight',
    },
  ];

  // Map location images
  const getLocationImage = (locId: string) => {
    switch (locId) {
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

  // Handle toggling clue selection (3 to 5 clues allowed)
  const handleClueToggle = (clueId: string) => {
    audioSynth.playClick();
    setSelectedClueIds((prev) => {
      if (prev.includes(clueId)) {
        return prev.filter((id) => id !== clueId);
      } else {
        if (prev.length >= 5) {
          return [...prev.slice(1), clueId];
        }
        return [...prev, clueId];
      }
    });
  };

  const handleOpenConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (isFormIncomplete) return;
    audioSynth.playClick();
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    audioSynth.playClick();

    const rawAccusation: Accusation = {
      suspectId,
      motive,
      weapon,
      locationId,
      clueIds: selectedClueIds,
    };

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

  const selectedSuspectObj = SUSPECTS.find((s) => s.id === suspectId);
  const selectedLocationObj = LOCATIONS.find((l) => l.id === locationId);
  const selectedMotiveObj = motiveOptions.find((m) => m.value === motive);
  const selectedWeaponObj = weaponOptions.find((w) => w.value === weapon);

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 md:p-8 space-y-6 select-none" id="accusation-view-container">
      
      {/* OFFICIAL POLICE CASE FILE HEADER */}
      <div className="bg-[#1a130e] border-2 border-[#802318]/80 p-5 md:p-6 rounded-xs shadow-[0_12px_35px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Confiscated/Secret Red Stamp Overlay */}
        <div className="absolute -top-3 -right-3 z-20 pointer-events-none hidden sm:block transform rotate-6 opacity-90">
          <div className="border-2 border-red-700/90 text-red-700 font-mono text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-2xs uppercase tracking-widest bg-red-950/40 shadow-sm flex items-center gap-1.5 backdrop-blur-2xs">
            <Stamp className="w-4 h-4 text-red-600" />
            <span>LUOTTAMUKSELLINEN • POLIISI 2026</span>
          </div>
        </div>

        {/* Paperclip Accent */}
        <div className="absolute top-0 left-8 z-30 pointer-events-none -translate-y-2">
          <svg className="w-6 h-10 text-stone-500" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 8v16a4 4 0 008 0V6a3 3 0 00-6 0v16a1 1 0 002 0V10" />
          </svg>
        </div>

        <div className="space-y-1.5 pl-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-400 font-mono text-[10px] font-bold tracking-widest uppercase">
              HILJAISEN JÄRVEN POLIISI • KESKUSRIKOSPOLIISI
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              TAPAUSNUMERO: HJ-2026-071
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-stone-100 tracking-tight flex items-center gap-2.5">
            <Skull className="w-6 h-6 text-red-600 shrink-0 animate-pulse" />
            {isFi ? 'LOPPUTUTKINTARAPORTTI & SYYTE-ESITYS' : 'FINAL INVESTIGATION REPORT & CHARGES'}
          </h2>
          <p className="text-xs md:text-sm font-sans text-stone-300 max-w-3xl leading-relaxed">
            {isFi
              ? 'Täytä virallinen syyte-esitys syyttäjälle. Valitse syytetty, motiivi, tekoväline, rikospaikka ja 3–5 aukotonta todistetta, joilla murhasyyte pitää oikeudessa.'
              : 'Complete the official charge report for prosecution. Select suspect, motive, weapon, crime scene, and 3–5 key evidence items.'}
          </p>
        </div>

        {/* Official Status Box */}
        <div className="flex items-center gap-3 shrink-0 bg-black/60 p-3.5 rounded border border-stone-800 self-start md:self-auto">
          <FileCheck className="w-8 h-8 text-amber-500/90 shrink-0" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Asettelutila</div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
              <span>{isFormIncomplete ? 'Keskeneräinen' : 'Valmis allekirjoitettavaksi'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETECTIVE ADVISORY WARNINGS */}
      {!allDeductionsSolved ? (
        <div className="p-4 bg-red-950/30 border border-red-800/60 text-red-200 rounded-xs text-xs md:text-sm flex items-start gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-serif text-red-300 uppercase tracking-wide block">
              {isFi ? 'POLIISIN TUTKINTAVAROITUS:' : 'INVESTIGATION WARNING:'}
            </span>
            <p className="leading-relaxed">
              {isFi
                ? 'Kaikkia Tutkintataulun päättelytehtäviä ei ole vielä ratkaistu. Syytöksen tekeminen tässä vaiheessa saattaa kaataa syytteen näytön puutteeseen!'
                : 'Not all deduction tasks on the Investigation Board are resolved. Filing charges now risks prosecution rejection!'}
            </p>
          </div>
        </div>
      ) : state.discoveredClues.length < 15 ? (
        <div className="p-4 bg-amber-950/30 border border-amber-800/60 text-amber-200 rounded-xs text-xs md:text-sm flex items-start gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-serif text-amber-300 uppercase tracking-wide block">
              {isFi ? 'TUTKINNAN HUOMIO:' : 'DETECTIVE NOTICE:'}
            </span>
            <p className="leading-relaxed">
              {isFi
                ? `Olet löytänyt vasta ${state.discoveredClues.length} / 20 todisteesta. Varmista, että sinulla on tarpeeksi fyysisiä ja teknisiä todisteita syytteen tueksi.`
                : `You have found only ${state.discoveredClues.length} / 20 clues. Ensure you have sufficient evidence before filing formal charges.`}
            </p>
          </div>
        </div>
      ) : null}

      {/* FORM CONTAINER - OFFICIAL POLICE DOSSIER SHEET */}
      <form onSubmit={handleOpenConfirm} className="space-y-8" id="accusation-form">

        {/* ========================================================================= */}
        {/* STEP 1: VALITSE SYYTETTY (SUSPECT SELECTION CARDS)                        */}
        {/* ========================================================================= */}
        <div className="bg-[#241b14] border-2 border-[#3d2e22] p-5 md:p-6 rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="text-base md:text-lg font-serif font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                {isFi ? '1. Valitse syytetty (Poliisin rekisterikortit)' : '1. Select Accused Suspect'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase">
              {suspectId ? `VALITTU: ${selectedSuspectObj?.name}` : 'EI VALITTU'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {SUSPECTS.map((s) => {
              const isSelected = suspectId === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    audioSynth.playClick();
                    setSuspectId(s.id);
                  }}
                  className={`p-3.5 rounded-xs border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#3b120c] border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.35)] translate-y-[-2px]'
                      : 'bg-[#18110b] border-stone-800 hover:border-amber-700/60 hover:bg-[#201710]'
                  }`}
                  id={`suspect-card-${s.id}`}
                >
                  {/* Selected Stamp Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-20 bg-red-800 text-white font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-2xs uppercase tracking-widest shadow-md">
                      VALITTU
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {/* Suspect Photo */}
                    <div className="aspect-4/3 sm:aspect-square w-full rounded-2xs overflow-hidden border border-stone-700/80 bg-black relative">
                      <img
                        src={`/images/ui/${s.portraitSvgSeed}.jpg`}
                        alt={s.name}
                        className={`w-full h-full object-cover transition-transform ${isSelected ? 'scale-105 filter brightness-105' : 'opacity-85'}`}
                        onError={(e) => {
                          e.currentTarget.src = '/images/ui/elina.jpg';
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-serif font-bold text-stone-100 leading-tight">
                        {s.name}
                      </h4>
                      <p className="text-[11px] font-sans text-stone-400">
                        {s.age} v • {tText(s.role)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className={s.isGuilty ? 'text-amber-500 font-bold' : 'text-stone-500'}>
                      {isSelected ? 'SYYTETTY' : 'EHDOKAS'}
                    </span>
                    <span className={isSelected ? 'text-red-400 font-bold' : 'text-stone-500'}>
                      {isSelected ? '✓ VALITTU' : 'VALITSE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: VALITSE MOTIIVI (MOTIVE SELECTION)                                */}
        {/* ========================================================================= */}
        <div className="bg-[#241b14] border-2 border-[#3d2e22] p-5 md:p-6 rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="text-base md:text-lg font-serif font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
                <FilePenLine className="w-5 h-5 text-amber-500" />
                {isFi ? '2. Valitse rikoksen motiivi (Syyteperuste)' : '2. Select Crime Motive'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase">
              {motive ? 'MOTIIVI VALITTU' : 'EI VALITTU'}
            </span>
          </div>

          <div className="space-y-2.5">
            {motiveOptions.map((opt, idx) => {
              const isSelected = motive === opt.value;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    audioSynth.playClick();
                    setMotive(opt.value);
                  }}
                  className={`p-3.5 rounded-xs border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#3b120c] border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                      : 'bg-[#18110b] border-stone-800 hover:border-amber-700/60 hover:bg-[#201710]'
                  }`}
                  id={`motive-option-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-red-500 bg-red-900' : 'border-stone-600 bg-stone-900'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-sans font-medium leading-snug ${isSelected ? 'text-stone-100 font-bold' : 'text-stone-300'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                        {opt.hint}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950 px-2.5 py-1 rounded border border-red-800 shrink-0 hidden sm:block">
                      VALITTU MOTIIVI
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 3 & 4: MURHA-ASE JA TEKOPAIKKA (WEAPON & LOCATION)                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* STEP 3: WEAPON */}
          <div className="bg-[#241b14] border-2 border-[#3d2e22] p-5 md:p-6 rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-base font-serif font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-amber-500" />
                  {isFi ? '3. Valitse murha-ase' : '3. Select Weapon'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 uppercase">
                {weapon ? 'ASE VALITTU' : 'EI VALITTU'}
              </span>
            </div>

            <div className="space-y-2">
              {weaponOptions.map((opt, idx) => {
                const isSelected = weapon === opt.value;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      audioSynth.playClick();
                      setWeapon(opt.value);
                    }}
                    className={`p-3 rounded-xs border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#3b120c] border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                        : 'bg-[#18110b] border-stone-800 hover:border-amber-700/60 hover:bg-[#201710]'
                    }`}
                    id={`weapon-option-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-red-500 bg-red-900' : 'border-stone-600 bg-stone-900'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={`text-xs font-sans font-medium ${isSelected ? 'text-stone-100 font-bold' : 'text-stone-300'}`}>
                        {opt.label}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[9px] font-mono text-red-400 font-bold shrink-0">
                        ✓ VALITTU
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: LOCATION */}
          <div className="bg-[#241b14] border-2 border-[#3d2e22] p-5 md:p-6 rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="text-base font-serif font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  {isFi ? '4. Valitse tekopaikka' : '4. Select Location'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 uppercase">
                {locationId ? `VALITTU: ${selectedLocationObj ? tText(selectedLocationObj.name) : ''}` : 'EI VALITTU'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
              {LOCATIONS.map((loc) => {
                const isSelected = locationId === loc.id;
                const locImg = getLocationImage(loc.id);

                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      audioSynth.playClick();
                      setLocationId(loc.id);
                    }}
                    className={`p-2 rounded-xs border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#3b120c] border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                        : 'bg-[#18110b] border-stone-800 hover:border-amber-700/60 hover:bg-[#201710]'
                    }`}
                    id={`location-option-${loc.id}`}
                  >
                    <div className="aspect-16/9 w-full rounded-2xs overflow-hidden border border-stone-700/80 bg-black mb-1.5 relative">
                      <img
                        src={locImg}
                        alt={tText(loc.name)}
                        className={`w-full h-full object-cover ${isSelected ? 'brightness-110' : 'opacity-70'}`}
                      />
                    </div>

                    <span className={`text-[11px] font-serif font-bold truncate ${isSelected ? 'text-stone-100' : 'text-stone-300'}`}>
                      {tText(loc.name)}
                    </span>

                    {isSelected && (
                      <span className="text-[8.5px] font-mono text-red-400 font-bold mt-0.5">
                        ✓ VALITTU TEKOPAIKKA
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* STEP 5: VALITSE TÄRKEIMMÄT TODISTEET (3 to 5 CLUES)                      */}
        {/* ========================================================================= */}
        <div className="bg-[#241b14] border-2 border-[#3d2e22] p-5 md:p-6 rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-red-950 border border-red-700 text-red-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              <h3 className="text-base md:text-lg font-serif font-bold text-stone-100 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                {isFi ? '5. Valitse 3–5 tärkeintä todistetta syytöksen tueksi' : '5. Select 3–5 Key Evidence Items'}
              </h3>
            </div>
            
            <span
              className={`text-xs font-mono px-3 py-1 rounded font-bold border ${
                selectedClueIds.length >= 3 && selectedClueIds.length <= 5
                  ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-600/80 text-amber-400'
              }`}
            >
              {isFi ? 'Valittu' : 'Selected'}: {selectedClueIds.length} / 3–5 todistetta
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed italic">
            {isFi
              ? 'Valitse hallussasi olevista johtolangoista ne 3–5 ratkaisevinta todistetta, joilla kumoat syytetyn alibin ja todistat teon kiistatta.'
              : 'Select 3–5 critical evidence items from your discovered clues that break the alibi and prove guilt.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {discoveredClues.map((clue) => {
              const isChecked = selectedClueIds.includes(clue.id);

              return (
                <div
                  key={clue.id}
                  onClick={() => handleClueToggle(clue.id)}
                  className={`p-3 border-2 rounded-xs transition-all cursor-pointer flex items-center justify-start gap-3 text-left ${
                    isChecked
                      ? 'bg-[#3b120c] border-red-600 text-stone-100 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                      : 'bg-[#18110b] border-stone-800 text-stone-400 hover:border-amber-700/60 hover:text-stone-200'
                  }`}
                  id={`clue-checkbox-${clue.id}`}
                >
                  <div className="shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-red-500" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-600" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <p className={`text-xs font-serif font-bold truncate ${isChecked ? 'text-stone-100' : 'text-stone-300'}`}>
                      {tText(clue.name)}
                    </p>
                    <p className="text-[10px] font-mono text-stone-500 truncate">
                      {clue.category || 'Todiste'}
                    </p>
                  </div>
                </div>
              );
            })}

            {discoveredClues.length === 0 && (
              <div className="text-center py-6 text-stone-500 text-xs font-sans sm:col-span-3 italic">
                {isFi
                  ? 'Sinulla ei ole vielä yhtään johtolankaa. Tutki mökin paikkoja kerätäksesi todisteita!'
                  : 'No discovered clues in your case file yet. Investigate locations to find evidence!'}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TUTKIJAN LOPPUTUTKINTALAUSUNTO & SYYTEPERUSTELUT                          */}
        {/* ========================================================================= */}
        <div className="bg-[#ede4d0] text-[#221811] p-5 md:p-6 rounded-xs border-2 border-[#b0a082] shadow-[0_10px_25px_rgba(0,0,0,0.6)] space-y-3 relative overflow-hidden">
          <div className="border-b border-[#a8987a] pb-2 flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-[#524131] uppercase tracking-widest flex items-center gap-1.5">
              <FilePenLine className="w-4 h-4 text-amber-900" />
              TUTKIJAN VIRALLINEN KANTA & YHTEENVETO
            </span>
            <span className="text-[9px] font-mono text-stone-700">
              VIRKAMIESLAUSUNTO
            </span>
          </div>

          <div className="font-serif text-xs md:text-sm text-[#2b1f15] leading-relaxed space-y-2">
            <p className="italic">
              "Esitän poliisijohdolle ja syyttäjälle, että <strong className="text-stone-950 font-bold underline">{selectedSuspectObj ? selectedSuspectObj.name : '___'}</strong> asetetaan syytteeseen Hiljaisella järvellä tapahtuneesta henkirikoksesta. Teko tapahtui paikassa <strong className="text-stone-950 font-bold underline">{selectedLocationObj ? tText(selectedLocationObj.name) : '___'}</strong>, ja tekovälineenä käytettiin <strong className="text-stone-950 font-bold underline">{selectedWeaponObj ? selectedWeaponObj.label : '___'}</strong>. Rikoksen motiivina oli <strong className="text-stone-950 font-bold underline">{selectedMotiveObj ? selectedMotiveObj.label : '___'}</strong>."
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL CASE SUMMARY CHECKLIST                                           */}
        {/* ========================================================================= */}
        <div className="bg-[#18110b] border-2 border-stone-800 p-5 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              SYYTE-ESITYKSEN YHTEENVETO & VALMIUSTILA
            </span>
            <span className="text-[10px] font-mono text-stone-500">
              {isFormIncomplete ? '⚠️ PUUTTEELLINEN' : '✓ RAPORTTI VALMIS'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            <div className={`p-2.5 rounded border ${suspectId ? 'bg-red-950/40 border-red-800/80 text-red-200' : 'bg-stone-900/60 border-stone-800 text-stone-500'}`}>
              <span className="text-[9px] uppercase tracking-wider block text-stone-400">1. SYYTETTY:</span>
              <span className="font-bold font-serif">{selectedSuspectObj ? selectedSuspectObj.name : '❌ EI VALITTU'}</span>
            </div>

            <div className={`p-2.5 rounded border ${motive ? 'bg-red-950/40 border-red-800/80 text-red-200' : 'bg-stone-900/60 border-stone-800 text-stone-500'}`}>
              <span className="text-[9px] uppercase tracking-wider block text-stone-400">2. MOTIIVI:</span>
              <span className="font-bold truncate block">{selectedMotiveObj ? selectedMotiveObj.value : '❌ EI VALITTU'}</span>
            </div>

            <div className={`p-2.5 rounded border ${weapon ? 'bg-red-950/40 border-red-800/80 text-red-200' : 'bg-stone-900/60 border-stone-800 text-stone-500'}`}>
              <span className="text-[9px] uppercase tracking-wider block text-stone-400">3. TEKOVÄLINE:</span>
              <span className="font-bold truncate block">{selectedWeaponObj ? selectedWeaponObj.value : '❌ EI VALITTU'}</span>
            </div>

            <div className={`p-2.5 rounded border ${locationId ? 'bg-red-950/40 border-red-800/80 text-red-200' : 'bg-stone-900/60 border-stone-800 text-stone-500'}`}>
              <span className="text-[9px] uppercase tracking-wider block text-stone-400">4. TEKOPAIKKA:</span>
              <span className="font-bold font-serif">{selectedLocationObj ? tText(selectedLocationObj.name) : '❌ EI VALITTU'}</span>
            </div>

            <div className={`p-2.5 rounded border ${selectedClueIds.length >= 3 && selectedClueIds.length <= 5 ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' : 'bg-stone-900/60 border-stone-800 text-stone-500'}`}>
              <span className="text-[9px] uppercase tracking-wider block text-stone-400">5. TODISTEET:</span>
              <span className="font-bold">{selectedClueIds.length} / 3–5 {selectedClueIds.length >= 3 ? '✓' : '❌'}</span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-sans text-stone-400">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isFormIncomplete
                ? 'Valitse kaikki 5 osiota esittääksesi virallisen syytöksen.'
                : 'Kaikki vaaditut tiedot syötetty. Voit allekirjoittaa ja lähettää raportin.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isFormIncomplete}
            className={`py-4 px-10 font-serif text-sm font-bold tracking-wider uppercase rounded-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
              isFormIncomplete
                ? 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'
                : 'bg-red-800 hover:bg-red-700 active:bg-red-900 text-stone-100 border border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:-translate-y-0.5'
            }`}
            id="btn-submit-accusation"
          >
            <Stamp className="w-5 h-5 shrink-0" />
            <span>{isFi ? 'ALLEKIRJOITA JA LÄHETÄ SYYTE' : 'SIGN & SUBMIT CHARGES'}</span>
          </button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* CONFIRMATION DIALOG MODAL                                                  */}
      {/* ========================================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="accusation-confirm-modal">
          <div className="max-w-xl w-full bg-[#1c130d] border-2 border-red-800 p-6 sm:p-8 rounded-xs shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6 relative">
            
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <div className="p-3 bg-red-950 border border-red-700 rounded-full text-red-500">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-100 uppercase tracking-tight">
                  {isFi ? 'VAHVISTA LOPULLINEN SYYTE' : 'CONFIRM FINAL CHARGE'}
                </h3>
                <p className="text-xs font-mono text-red-400 uppercase tracking-wider">
                  VIRALLINEN PÄÄTÖS • HILJAISEN JÄRVEN POLIISI
                </p>
              </div>
            </div>

            <p className="text-sm font-sans text-stone-300 leading-relaxed">
              {isFi
                ? 'Oletko varma, että haluat allekirjoittaa ja lähettää virallisen syyteraportin syyttäjälle? Tämän jälkeen tutkinta siirtyy loppuratkaisuun.'
                : 'Are you sure you want to sign and submit the official charge report to the prosecutor? This will proceed to the final resolution.'}
            </p>

            <div className="bg-[#120c08] border border-stone-800 p-4 rounded text-xs space-y-2 font-mono text-stone-300">
              <div><strong className="text-stone-400">Syytetty:</strong> <span className="text-amber-400 font-bold">{selectedSuspectObj?.name}</span></div>
              <div><strong className="text-stone-400">Motiivi:</strong> <span>{selectedMotiveObj?.value}</span></div>
              <div><strong className="text-stone-400">Tekoväline:</strong> <span>{selectedWeaponObj?.value}</span></div>
              <div><strong className="text-stone-400">Tekopaikka:</strong> <span>{selectedLocationObj ? tText(selectedLocationObj.name) : ''}</span></div>
              <div><strong className="text-stone-400">Todisteet:</strong> <span>{selectedClueIds.length} todistetta valittu</span></div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3 px-5 bg-stone-900 hover:bg-stone-800 text-stone-300 font-sans text-xs font-bold rounded border border-stone-700 cursor-pointer"
              >
                {isFi ? 'Peruuta / Tarkista valintoja' : 'Cancel / Review Choices'}
              </button>

              <button
                onClick={handleFinalSubmit}
                className="py-3 px-6 bg-red-800 hover:bg-red-700 text-white font-serif text-xs font-bold uppercase tracking-wider rounded border border-red-600 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                id="btn-confirm-final-submit"
              >
                <Stamp className="w-4 h-4" />
                <span>{isFi ? 'Vahvista ja allekirjoita syyte' : 'Confirm & Sign Charge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AccusationView;
