import { useState, useEffect, useRef } from 'react';
import { GameState, Clue } from '../../types/game';
import { LocalizedText } from '../../localization/types';
import { CONTRADICTIONS, CLUES, SUSPECTS, LOCATIONS } from '../../data/storyData';
import { DEDUCTIONS, DeductionTask } from '../../data/deductionData';
import { ShieldAlert, Award, Puzzle, HelpCircle, CheckCircle2, ListFilter, RefreshCw, FileText, Star, MapPin, X, ZoomIn, Info, Coffee, BookOpen } from 'lucide-react';

const phaseOrder = ['PROLOGUE', 'VAIHE1', 'VAIHE2', 'VAIHE3', 'ACCUSATION', 'ENDING'];
const isPhaseUnlocked = (unlockPhase: string, currentPhase: string) => {
  return phaseOrder.indexOf(currentPhase) >= phaseOrder.indexOf(unlockPhase);
};
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';
import { CaseJournal } from './CaseJournal';

interface InvestigationBoardProps {
  state: GameState;
  onDiscoverContradiction: (contradictionId: string, title: string) => void;
  solveContradiction: (id: string) => void;
  updateVihjeTaso: (taso: number) => void;
}

interface SelectableItem {
  type: 'clue' | 'alibi';
  id: string; // clue ID or suspect ID for alibi
  name: string;
  category: string; // e.g. "Johtolanka" or "Alibi"
}

// Retro analog desk clock component
function RetroDeskClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hrDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div 
      className="relative w-14 h-14 rounded-full bg-stone-100 border-[3px] border-amber-900 shadow-[0_4px_10px_rgba(0,0,0,0.5),_inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center select-none shrink-0" 
      title="Retro Desk Clock"
      id="retro-desk-clock"
    >
      {/* Clock Markings */}
      <div className="absolute inset-0.5 rounded-full border border-stone-200/50 pointer-events-none" />
      <div className="absolute top-1 text-[6px] font-serif font-bold text-stone-700 leading-none pointer-events-none">12</div>
      <div className="absolute bottom-1 text-[6px] font-serif font-bold text-stone-700 leading-none pointer-events-none">6</div>
      <div className="absolute right-1.5 text-[6px] font-serif font-bold text-stone-700 leading-none pointer-events-none">3</div>
      <div className="absolute left-1.5 text-[6px] font-serif font-bold text-stone-700 leading-none pointer-events-none">9</div>

      {/* Hour Hand */}
      <div
        className="absolute w-[1.5px] h-3 bg-stone-900 rounded-full origin-bottom pointer-events-none"
        style={{
          transform: `rotate(${hrDeg}deg)`,
          top: 'calc(50% - 12px)',
          transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)',
        }}
      />
      {/* Minute Hand */}
      <div
        className="absolute w-[1px] h-4.5 bg-stone-800 rounded-full origin-bottom pointer-events-none"
        style={{
          transform: `rotate(${minDeg}deg)`,
          top: 'calc(50% - 18px)',
          transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 1)',
        }}
      />
      {/* Seconds Hand */}
      <div
        className="absolute w-[0.5px] h-5 bg-red-600 origin-bottom pointer-events-none"
        style={{
          transform: `rotate(${secDeg}deg)`,
          top: 'calc(50% - 20px)',
          transition: 'transform 0.15s cubic-bezier(0.8, 0, 0.2, 1.4)',
        }}
      />
      {/* Center Pin */}
      <div className="absolute w-1 h-1 rounded-full bg-amber-800 pointer-events-none" />
    </div>
  );
}

// Canvas-based subtle dust particles effect
function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const particlesCount = 20;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
      angle: number;
      angleSpeed: number;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4,
        vx: (Math.random() * 0.12 - 0.04) + 0.015,
        vy: (Math.random() * 0.15 - 0.08) - 0.02,
        alpha: Math.random() * 0.4 + 0.08,
        alphaSpeed: Math.random() * 0.003 + 0.001,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: Math.random() * 0.01 - 0.005,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.angle) * 0.03;
        p.y += p.vy;
        p.angle += p.angleSpeed;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.55 || p.alpha < 0.08) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${p.alpha})`;
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(253, 230, 138, 0.4)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none opacity-60"
    />
  );
}

// Local Web Audio synthesizer for warm room ambiance
const playRoomAmbiance = (soundOn: boolean) => {
  if (!soundOn) return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, ctx.currentTime); // keep it extremely quiet and subtle
    masterGain.connect(ctx.destination);

    // 1. Warm Analog Lamp Hum (60Hz sine wave + very soft higher harmonics)
    const humOsc1 = ctx.createOscillator();
    const humOsc2 = ctx.createOscillator();
    const humFilter = ctx.createBiquadFilter();
    const humGain = ctx.createGain();

    humOsc1.type = 'sine';
    humOsc1.frequency.setValueAtTime(60, ctx.currentTime);

    humOsc2.type = 'triangle';
    humOsc2.frequency.setValueAtTime(120, ctx.currentTime);

    humFilter.type = 'lowpass';
    humFilter.frequency.setValueAtTime(80, ctx.currentTime);

    humGain.gain.setValueAtTime(0.2, ctx.currentTime);

    humOsc1.connect(humFilter);
    humOsc2.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(masterGain);

    humOsc1.start();
    humOsc2.start();

    // 2. Slow Clock Ticking (Exactly every 1.0 second)
    let tickInterval: any = null;
    let isTick = true;
    const playTick = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isTick ? 115 : 95, t);
      isTick = !isTick;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.04);
    };

    tickInterval = setInterval(playTick, 1000);

    // 3. Occasional Wood Creak (every 24 seconds)
    let woodCreakInterval: any = null;
    const playWoodCreak = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.linearRampToValueAtTime(65, t + 0.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(190, t);
      filter.Q.setValueAtTime(2.5, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.012, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.3);
    };
    woodCreakInterval = setInterval(playWoodCreak, 24000);

    return () => {
      clearInterval(tickInterval);
      clearInterval(woodCreakInterval);
      try {
        humOsc1.stop();
        humOsc2.stop();
        ctx.close();
      } catch (e) {
        console.error("Room audio cleanup error:", e);
      }
    };
  } catch (e) {
    console.error("Room audio initialization failed:", e);
    return null;
  }
};

export function InvestigationBoard({ state, onDiscoverContradiction, solveContradiction, updateVihjeTaso }: InvestigationBoardProps) {
  const { t, tText } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'journal'>('board');
  const [selectedItemA, setSelectedItemA] = useState<SelectableItem | null>(null);
  const [selectedItemB, setSelectedItemB] = useState<SelectableItem | null>(null);
  const [feedback, setFeedback] = useState<{ message: LocalizedText; success: boolean } | null>(null);
  const [activeInspectClue, setActiveInspectClue] = useState<Clue | null>(null);

  const [selectedStatement, setSelectedStatement] = useState<string>('');
  const [selectedClue1, setSelectedClue1] = useState<string>('');
  const [selectedClue2, setSelectedClue2] = useState<string>('');
  const [alibiFeedback, setAlibiFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const unlockedDeductions = DEDUCTIONS.filter(d => isPhaseUnlocked(d.unlockPhase, state.currentPhase));

  const [selectedDeductionId, setSelectedDeductionId] = useState<string>(() => {
    const firstUnsolved = DEDUCTIONS.find(d => !state.ratkaistutRistiriidat?.includes(d.solvedFlag) && isPhaseUnlocked(d.unlockPhase, state.currentPhase));
    return firstUnsolved ? firstUnsolved.id : 'elina_alibi';
  });

  const activeDeduction = DEDUCTIONS.find(d => d.id === selectedDeductionId) || DEDUCTIONS[0];

  useEffect(() => {
    const firstUnsolved = DEDUCTIONS.find(d => !state.ratkaistutRistiriidat?.includes(d.solvedFlag) && isPhaseUnlocked(d.unlockPhase, state.currentPhase));
    if (firstUnsolved) {
      setSelectedDeductionId(firstUnsolved.id);
    }
  }, [state.currentPhase]);

  const unlockedLausunnot = [
    { id: 'elina.alibi', name: t('settings.textSizeNormal') === 'Normaali' ? 'Elinan alibilausunto (Keittiö)' : "Elina's alibi (Kitchen)" },
    { id: 'markus.alibi', name: t('settings.textSizeNormal') === 'Normaali' ? 'Markuksen alibilausunto (Sauna)' : "Markus's alibi (Sauna)" },
    { id: 'laura.alibi', name: t('settings.textSizeNormal') === 'Normaali' ? 'Lauran alibilausunto (Makuuhuone)' : "Laura's alibi (Bedroom)" },
    { id: 'oskari.alibi', name: t('settings.textSizeNormal') === 'Normaali' ? 'Oskarin alibilausunto (Sähkökatko)' : "Oskari's alibi (Power outage)" },
    { id: 'sara.alibi', name: t('settings.textSizeNormal') === 'Normaali' ? 'Saran alibilausunto (Kirjoitustyö)' : "Sara's alibi (Writing work)" }
  ].filter(item => {
    const suspectId = item.id.split('.')[0];
    return state.completedDialogueTopics[suspectId]?.includes('alibi');
  });

  const discoveredCluesForSelection = CLUES
    .filter(clue => state.discoveredClues.includes(clue.id))
    .map(clue => ({
      id: clue.id,
      name: tText(clue.name)
    }));

  const checkCombination = (task: DeductionTask, statement: string, clue1: string, clue2: string) => {
    if (statement !== task.requiredStatement) return false;
    const [reqClue1, reqClue2] = task.requiredEvidence;
    return (clue1 === reqClue1 && clue2 === reqClue2) || (clue1 === reqClue2 && clue2 === reqClue1);
  };

  // Play room ambiance sound loop when investigation board is mounted
  useEffect(() => {
    const cleanup = playRoomAmbiance(state.settings.soundOn);
    return () => {
      if (cleanup) cleanup();
    };
  }, [state.settings.soundOn]);

  // Categorize clues to their respective corkboard categories
  const getClueGroup = (clueId: string): 'physical' | 'document' | 'person' => {
    switch (clueId) {
      // Fyysiset todisteet
      case 'rikkinainen_lyhty':
      case 'kuitu_lyhdyssa':
      case 'repeytynyt_hiha':
      case 'kenganjaljet_venevajalla':
      case 'venevajan_lukko':
      case 'kangas_antin_kadessa':
      case 'keittion_kello':
      case 'tyokalulaatikko':
      case 'tyhja_laakepakkaus':
        return 'physical';

      // Asiakirjat
      case 'tekstiviesti_lauralle':
      case 'kirjanpitopaperit':
      case 'tilisiirto_elinalle':
      case 'poltettu_paperi':
        return 'document';

      // Henkilöihin liittyvät
      case 'antin_puhelin':
      case 'saran_tallennin':
      case 'elinan_aani_tallenteella':
      case 'elinan_kengat':
      case 'markuksen_saunavaatteet':
      case 'oskarin_taskulamppu':
      case 'auton_avaimet':
      default:
        return 'person';
    }
  };

  // Safe image path resolver
  const getClueImage = (clueId: string): string | null => {
    const images: Record<string, string> = {
      elinan_aani_tallenteella: '/images/ui/elinan_aani_tallenteella.png',
      kangas_antin_kadessa: '/images/ui/kangas_antin_kadessa.jpg',
      antin_puhelin: '/images/ui/antin_puhelin.jpg',
      tekstiviesti_lauralle: '/images/ui/tekstiviesti_lauralle.jpg',
      auton_avaimet: '/images/ui/auton_avaimet.jpg',
      elinan_kengat: '/images/ui/elinan_kengat.jpg',
      keittion_kello: '/images/ui/keittion_kello.jpg',
      markuksen_saunavaatteet: '/images/ui/markuksen_saunavaatteet.jpg',
      kenganjaljet_venevajalla: '/images/ui/kenganjaljet_venevajalla.jpg',
      poltettu_paperi: '/images/ui/poltettu_paperi.jpg',
      oskarin_taskulamppu: '/images/ui/oskarin_taskulamppu.jpg',
      repeytynyt_hiha: '/images/ui/repeytynyt_hiha.jpg',
      rikkinainen_lyhty: '/images/ui/rikkinainen_lyhty.jpg',
      tyokalulaatikko: '/images/ui/tyokalulaatikko.jpg',
      tilisiirto_elinalle: '/images/ui/tilisiirto_elinalle.jpg',
      kirjanpitopaperit: '/images/ui/kirjanpitopaperit.jpg',
      saran_tallennin: '/images/ui/saran_tallennin.jpg',
      tyhja_laakepakkaus: '/images/ui/tyhja_laakepakkaus.jpg',
      venevajan_lukko: '/images/ui/venevajan_lukko.jpg',
      kuitu_lyhdyssa: '/images/ui/kuitu_lyhdyssa.jpg',
    };
    return images[clueId] || null;
  };

  // Safe location string resolver
  const getClueLocationName = (locationId: string): string => {
    const loc = LOCATIONS.find(l => l.id === locationId);
    return loc ? tText(loc.name) : locationId;
  };

  // Deterministic rotations to prevent layout jumping/flickering on state refresh
  const getDeterministicRotation = (id: string): string => {
    const charSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const rotations = [
      '-rotate-1',
      'rotate-[1.5deg]',
      '-rotate-[1.5deg]',
      'rotate-[0.8deg]',
      '-rotate-[0.8deg]',
      'rotate-[2deg]',
      '-rotate-[2deg]',
      'rotate-[0.5deg]'
    ];
    return rotations[charSum % rotations.length];
  };

  // Collect all discovered clues as selectable items
  const discoveredClueItems: SelectableItem[] = CLUES
    .filter(clue => state.discoveredClues.includes(clue.id))
    .map(clue => ({
      type: 'clue',
      id: clue.id,
      name: `${tText(clue.name)} (${t('board.evidence')})`,
      category: t('board.evidenceCategory')
    }));

  // Collect all suspect alibis as selectable items
  const alibiItems: SelectableItem[] = SUSPECTS.map(susp => {
    let localizedAlibiDesc = '';
    if (susp.id === 'elina') {
      localizedAlibiDesc = t('settings.textSizeNormal') === 'Normaali' ? 'Keittiö' : 'Kitchen';
    } else if (susp.id === 'markus') {
      localizedAlibiDesc = t('settings.textSizeNormal') === 'Normaali' ? 'Sauna' : 'Sauna';
    } else if (susp.id === 'laura') {
      localizedAlibiDesc = t('settings.textSizeNormal') === 'Normaali' ? 'Makuuhuone' : 'Bedroom';
    } else if (susp.id === 'oskari') {
      localizedAlibiDesc = t('settings.textSizeNormal') === 'Normaali' ? 'Sähkökatko' : 'Power outage';
    } else {
      localizedAlibiDesc = t('settings.textSizeNormal') === 'Normaali' ? 'Kirjoitustyö' : 'Writing work';
    }

    return {
      type: 'alibi',
      id: susp.id,
      name: `${susp.name} - ${t('board.alibiLabel')} (${localizedAlibiDesc})`,
      category: t('board.alibiCategory')
    };
  });

  const allSelectableItems = [...discoveredClueItems, ...alibiItems];

  const handleSelectA = (item: SelectableItem) => {
    audioSynth.playClick();
    setFeedback(null);
    if (selectedItemB?.id === item.id && selectedItemB?.type === item.type) {
      setSelectedItemB(null);
    }
    setSelectedItemA(item);
  };

  const handleSelectB = (item: SelectableItem) => {
    audioSynth.playClick();
    setFeedback(null);
    if (selectedItemA?.id === item.id && selectedItemA?.type === item.type) {
      setSelectedItemA(null);
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

    const match = CONTRADICTIONS.find((contradiction) => {
      const match1 =
        (contradiction.itemA.type === selectedItemA.type && contradiction.itemA.id === selectedItemA.id &&
         contradiction.itemB.type === selectedItemB.type && contradiction.itemB.id === selectedItemB.id) ||
        (contradiction.itemA.type === selectedItemB.type && contradiction.itemA.id === selectedItemB.id &&
         contradiction.itemB.type === selectedItemA.type && contradiction.itemB.id === selectedItemA.id);

      return match1;
    });

    if (match) {
      audioSynth.playContradictionFound();
      onDiscoverContradiction(match.id, tText(match.title));
      setFeedback({
        message: match.discoveryMessage,
        success: true
      });
      setSelectedItemA(null);
      setSelectedItemB(null);
    } else {
      setFeedback({
        message: {
          fi: 'Ei suoraa ristiriitaa. Nämä kaksi asiaa eivät kumoa toisiaan tai muodosta merkittävää uutta päätelmää. Tarkastele johtolankojen yksityiskohtia uudelleen.',
          en: 'No direct contradiction. These two things do not invalidate each other or create a new deduction. Examine the clue details again.'
        },
        success: false
      });
    }
  };

  const physicalClues = CLUES.filter(c => getClueGroup(c.id) === 'physical');
  const documentClues = CLUES.filter(c => getClueGroup(c.id) === 'document');
  const personClues = CLUES.filter(c => getClueGroup(c.id) === 'person');

  const renderStars = (count: number = 3) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < count ? 'text-amber-500 fill-amber-500' : 'text-stone-800'}`}
          />
        ))}
      </div>
    );
  };

  // Render a single pinned clue card
  const renderClueCard = (clue: Clue) => {
    const discoveryIndex = state.discoveredClues.indexOf(clue.id);
    const isDiscovered = discoveryIndex !== -1;
    const clueImage = getClueImage(clue.id);
    const rotationClass = getDeterministicRotation(clue.id);

    const group = getClueGroup(clue.id);

    // Check if clue is involved in solved contradictions
    const isConnectedToSolved = CONTRADICTIONS.some(
      c => state.discoveredContradictions.includes(c.id) &&
        ((c.itemA.type === 'clue' && c.itemA.id === clue.id) || (c.itemB.type === 'clue' && c.itemB.id === clue.id))
    );

    // Check if selected in slot A or B
    const isSelectedInSlot =
      (selectedItemA?.type === 'clue' && selectedItemA?.id === clue.id) ||
      (selectedItemB?.type === 'clue' && selectedItemB?.id === clue.id);

    if (!isDiscovered) {
      // UNDISCOVERED / SILHOUETTE CARD
      return (
        <div
          key={clue.id}
          className={`relative border-2 border-dashed border-stone-800/60 bg-stone-950/30 text-stone-600 rounded-lg p-4 min-h-[120px] flex flex-col justify-between items-center text-center select-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] ${rotationClass}`}
        >
          {/* Pin hole with indent shadow */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/80 shadow-inner border border-stone-800" />
          
          <div className="mt-4 flex flex-col items-center space-y-1">
            <div className="p-2.5 rounded-full border border-stone-800 bg-stone-900/80 text-stone-700 shadow-sm">
              <FileText className="w-5 h-5 opacity-40" />
            </div>
            <p className="text-[10px] font-mono font-semibold tracking-wider text-stone-600 uppercase mt-2">
              {t('board.unknownClue')}
            </p>
          </div>
        </div>
      );
    }

    // DISCOVERED CARD VARIANTS
    const isDoc = group === 'document';
    const isPerson = group === 'person';

    // Pin color logic
    let pinColor = 'from-red-500 via-red-700 to-red-950 border-red-900';
    if (isDoc) pinColor = 'from-amber-300 via-amber-500 to-amber-800 border-amber-900';
    if (isPerson) pinColor = 'from-sky-400 via-sky-600 to-sky-900 border-sky-950';

    return (
      <div
        key={clue.id}
        onClick={() => {
          audioSynth.playClick();
          setActiveInspectClue(clue);
        }}
        className={`group relative transition-all duration-300 cursor-pointer select-none ${rotationClass} animate-scale-up ${
          isSelectedInSlot
            ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-30 scale-[1.02]'
            : 'hover:-translate-y-2 hover:rotate-0 hover:z-30 hover:scale-[1.02]'
        } ${
          isDoc
            /* Aged Document style */
            ? 'bg-[#f4ebd0] text-[#2c2217] border border-[#d8c89d] shadow-[3px_6px_16px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(139,92,26,0.06)] rounded-sm p-3 pb-4'
            : isPerson
            /* Sticky Note / Note style */
            ? 'bg-[#fef08a] text-[#3f2c06] border border-[#facc15]/70 shadow-[4px_7px_18px_rgba(0,0,0,0.5)] rounded-sm p-3 pb-4'
            /* Polaroid Photo style */
            : 'bg-[#faf8f4] text-stone-900 border border-stone-300 shadow-[5px_8px_22px_rgba(0,0,0,0.55)] rounded p-3 pb-4'
        }`}
      >
        {/* Top Scotch Tape accent for documents and photos */}
        {(isDoc || (!isPerson && clueImage)) && (
          <div className="absolute -top-2 -right-1 w-11 h-4 bg-white/40 border-y border-white/60 backdrop-blur-[1px] rotate-[14deg] shadow-[0_1px_3px_rgba(0,0,0,0.2)] pointer-events-none z-20" />
        )}

        {/* 3D Pushpin with soft offset directional drop shadow */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 w-4 h-4 flex items-center justify-center pointer-events-none">
          <div className="absolute top-3 left-2 w-3 h-3 bg-black/50 rounded-full blur-[2px]" />
          <div className="absolute top-1.5 w-[2px] h-3 bg-stone-400" />
          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br border shadow-[1px_3px_6px_rgba(0,0,0,0.7)] flex items-center justify-center relative ${pinColor}`}>
            <div className="w-1 h-1 bg-white/60 rounded-full absolute top-0.5 left-0.5" />
          </div>
        </div>

        {/* Red Thread Connection Indicator Badge */}
        {(isConnectedToSolved || isSelectedInSlot) && (
          <div className="absolute -top-1 -left-1 z-20 bg-red-800 text-white border border-red-500 text-[8px] font-mono px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span>🧵 {isSelectedInSlot ? 'Valittu' : 'Yhdistetty'}</span>
          </div>
        )}

        {/* Card Content */}
        <div className="space-y-2 pt-2">
          {clueImage ? (
            <div className="w-full aspect-[4/3] bg-stone-950 border border-stone-300/60 rounded overflow-hidden shadow-inner relative group/image">
              <img
                src={clueImage}
                alt={tText(clue.name)}
                className="w-full h-full object-cover filter brightness-[0.88] sepia-[0.08] transition-transform duration-500 group-hover/image:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Photo paper gloss overlay sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.15] opacity-80 pointer-events-none mix-blend-overlay" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : isDoc ? (
            /* Document Header Stamp */
            <div className="w-full bg-[#eee3c2] border border-[#d2c299] p-2 rounded flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-1.5 text-[#543d2b]">
                <FileText className="w-4 h-4 text-[#8a6845]" />
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">{t('board.documentsGroup')}</span>
              </div>
              <span className="text-[8px] font-mono font-bold text-red-800/80 border border-red-800/40 px-1 rounded uppercase tracking-tighter rotate-[-2deg]">
                TODISTE
              </span>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-amber-200/50 border border-amber-300/70 rounded flex flex-col items-center justify-center text-amber-900/60 shadow-inner p-2">
              <FileText className="w-6 h-6 opacity-60 text-amber-800" />
              <span className="text-[8px] font-mono tracking-widest text-amber-900/70 mt-1 uppercase">SNO: {clue.id.substring(0, 8)}</span>
            </div>
          )}

          {/* Clue Details */}
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-1">
              <h5 className={`text-[11px] font-bold leading-snug tracking-tight transition-colors ${
                isDoc ? 'font-serif text-[#2a1e12] group-hover:text-amber-950' : isPerson ? 'font-serif text-[#3f2c06]' : 'font-serif text-stone-900 group-hover:text-amber-900'
              }`}>
                {tText(clue.name)}
              </h5>
              
              <span className="text-[9px] font-mono font-bold shrink-0 border border-red-700/40 text-red-800 rounded px-1 rotate-[-3deg] uppercase leading-none scale-90 select-none bg-red-100/30 shadow-2xs">
                #{discoveryIndex + 1}
              </span>
            </div>
            
            <p className={`text-[9px] leading-relaxed line-clamp-2 ${
              isDoc ? 'font-sans text-[#524132]' : isPerson ? 'font-sans text-[#5c4312] italic' : 'font-sans text-stone-600'
            }`}>
              {tText(clue.description)}
            </p>
          </div>
        </div>

        {/* Found metadata Shorthand footer */}
        <div className={`mt-3 pt-2 border-t text-[8px] font-mono uppercase tracking-widest flex justify-between items-center select-none ${
          isDoc ? 'border-[#d0c098] text-[#826f55]' : isPerson ? 'border-[#e0c842] text-[#8a7218]' : 'border-stone-200 text-stone-400'
        }`}>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0 opacity-70" />
            <span className="truncate max-w-[80px]">{getClueLocationName(clue.locationId)}</span>
          </span>
          <span>{t('board.clueShorthand')}</span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in" 
      id="investigation-board-container"
    >
      {/* Dynamic Inline CSS for immersive lighting breathing, float animations, noise & wood paneling */}
      <style>{`
        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.22; }
        }
        @keyframes deskLightWarm {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
        .spotlight-lens {
          background: radial-gradient(circle at 15% 15%, rgba(253, 230, 138, 0.22) 0%, rgba(253, 230, 138, 0.05) 45%, transparent 75%);
          animation: spotlightPulse 12s ease-in-out infinite;
        }
        .desk-lamp-warm {
          background: radial-gradient(circle at 50% 120%, rgba(245, 158, 11, 0.14) 0%, transparent 60%);
          animation: deskLightWarm 10s ease-in-out infinite;
        }
        .vintage-grain {
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .wooden-panel-lines {
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.25) 1px, transparent 1px);
          background-size: 140px 100%;
        }
      `}</style>

      {/* DETECTIVE ROOM WRAPPER ENVIRONMENT */}
      <div className="absolute inset-0 -z-20 rounded-3xl bg-[#1c120c] border-2 border-stone-900 shadow-2xl overflow-hidden wooden-panel-lines">
        {/* Real dark rustic wood wall coloration */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140b06] via-[#1a100a] to-[#25150e] opacity-95" />
        
        {/* Subtle retro wallpaper pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Vintage Film Grain layer */}
        <div className="absolute inset-0 vintage-grain opacity-40 pointer-events-none" />

        {/* Left top spotlight lukuvalo light beam */}
        <div className="absolute inset-0 spotlight-lens pointer-events-none z-10" />

        {/* Bottom warm ambient glow representing workspace desk light bounce */}
        <div className="absolute inset-0 desk-lamp-warm pointer-events-none z-10" />

        {/* Canvas floating dust particles inside light beam */}
        <DustParticles />

        {/* DECORATIVE IMMERSION PROPS (Wood trim, map sketches, case file props, retro clock) */}
        
        {/* A: Left-margin retro lake map sketch pinned to the wall */}
        <div className="hidden lg:block absolute top-8 left-6 w-32 h-40 opacity-[0.25] rotate-[-2deg] border border-stone-800 bg-[#e6dfcc]/80 rounded p-1.5 shadow-md pointer-events-none select-none">
          <div className="w-full h-full border border-dashed border-amber-800/20 relative flex flex-col justify-between p-1">
            <span className="text-[6px] font-mono text-stone-700 tracking-wider">HILJAISEN JÄRVI REGION</span>
            {/* Lake silhouette */}
            <div className="w-16 h-12 rounded-full border border-sky-900/30 bg-sky-950/10 border-dashed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="text-[5px] text-right font-mono text-stone-500">Case #2026-A</div>
          </div>
        </div>

        {/* B: Right-margin document stacks / coffee mugs hints */}
        <div className="hidden lg:block absolute bottom-8 right-6 w-32 text-right opacity-30 select-none pointer-events-none font-mono text-[7px] text-stone-400 space-y-1.5">
          <div className="flex justify-end gap-1 items-center">
            <Coffee className="w-3.5 h-3.5 text-stone-500" />
            <span>KAHVIKUPISTA NOUSEE HÖYRYÄ...</span>
          </div>
          <div>EST. TEMP: 21°C</div>
          <div>FORENSIC LOG #39B</div>
        </div>
      </div>

      {/* ROOM MAIN IMMERSIVE CONTAINER */}
      <div className="relative z-10 space-y-6">

        {/* TOP STATUS BAR: Styled as the top shelf of the wooden cabinet */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-lg relative overflow-hidden">
          {/* Subtle brass plate nameplate */}
          <div className="absolute top-0 left-4 w-36 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 rounded-b-md" />
          
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg md:text-xl font-serif italic font-bold text-amber-200 flex items-center justify-center sm:justify-start gap-2 drop-shadow-sm">
              <Puzzle className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Mökkialueen Tutkintataulu' : 'Cottage Area Investigation Board'}</span>
            </h3>
            <p className="text-[11px] font-sans text-stone-400">
              {t('settings.textSizeNormal') === 'Normaali' ? 'Rikostutkinnan päänäkymä • Todisteet, asiakirjat ja ristiriidat' : 'Main investigation board • Evidence, documents, and contradictions'}
            </p>
          </div>

          {/* Right shelf element: Clock & Info notes */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden xs:block">
              <span className="text-[9px] font-mono text-amber-500/80 uppercase block tracking-wider font-bold">KÄYNNISSÄ OLEVA TUTKINTA</span>
              <span className="text-[10px] font-sans text-stone-400">Aika kuluu... Ristiriidat paljastavat totuuden.</span>
            </div>
            
            {/* Retro Analog Clock */}
            <RetroDeskClock />
          </div>
        </div>

        {/* SUB-TAB BAR: To switch between Investigation Board and Case Journal */}
        <div className="flex justify-center sm:justify-start gap-3 border-b border-stone-800/40 pb-1" id="board-subtabs">
          <button
            onClick={() => {
              audioSynth.playClick();
              setActiveSubTab('board');
            }}
            className={`py-2 px-5 font-serif italic text-xs md:text-sm tracking-wide transition-all duration-300 relative select-none cursor-pointer flex items-center gap-2 rounded-t-xl ${
              activeSubTab === 'board'
                ? 'text-amber-400 font-bold bg-[#20150d] border-t border-x border-amber-900/40 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]'
                : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.02]'
            }`}
          >
            <span>📌</span>
            <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutkintataulu' : 'Investigation Board'}</span>
          </button>
          
          <button
            onClick={() => {
              audioSynth.playClick();
              setActiveSubTab('journal');
            }}
            className={`py-2 px-5 font-serif italic text-xs md:text-sm tracking-wide transition-all duration-300 relative select-none cursor-pointer flex items-center gap-2 rounded-t-xl ${
              activeSubTab === 'journal'
                ? 'text-amber-400 font-bold bg-[#1e1712] border-t border-x border-amber-900/40 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]'
                : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.02]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500/80" />
            <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Tutkintapäiväkirja' : 'Case Journal'}</span>
          </button>
        </div>

        {activeSubTab === 'board' ? (
          <>
            {/* GENTLE DEDUCTION REMINDER */}
        {state.currentPhase === 'VAIHE1' && state.discoveredClues.length >= 5 && !state.ratkaistutRistiriidat?.includes('elina_alibi_murrettu') && (
          <div className="bg-[#181410] border border-amber-900/30 rounded-2xl p-5 shadow-lg flex items-start gap-4 animate-scale-up" id="phase-deduction-reminder">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Tutkintahuomio</span>
              <p className="text-stone-300 font-sans text-xs md:text-sm leading-relaxed font-medium">
                Olet kerännyt riittävästi aineistoa. Ennen kuin tutkimus voi edetä, sinun täytyy osoittaa ensimmäinen ristiriita Elinan alibissa.
              </p>
              <p className="text-[10px] text-stone-500 font-sans leading-relaxed">
                Vihje: Avaa tutkintataulun alaosasta löytyvä "Osoita ristiriita" -paneeli ja yhdistä Elinan alibilausunto sekä kaksi sitä kumoavaa todistetta.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 1: CORKBOARD (18/20 evidence items neatly categorized) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📌</span>
              <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Rikostutkinnan korkkitaulu' : 'Crime Investigation Corkboard'}</span>
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/30 to-transparent" />
          </div>

          {/* Large Cinematic Wooden Frame Board with Cork texture */}
          <div className="relative rounded-3xl p-5 md:p-8 bg-[#3d271f] border-[12px] border-[#20120a] shadow-[inset_0_8px_30px_rgba(0,0,0,0.95),_0_20px_45px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Real Cork Background Texturing */}
            <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/15 pointer-events-none" />
            
            {/* Corner Brass Brackets for frame */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/40 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/40 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* COLUMN 1: Fyysiset todisteet */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="bg-[#f0e4cf] text-[#442b1f] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider rounded border border-[#cb9b7d] shadow-[1px_2px_4px_rgba(0,0,0,0.3)] rotate-[-1deg] select-none flex items-center gap-1">
                    <span>📍</span>
                    <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Fyysiset todisteet' : 'Physical Evidence'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-300/80 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {physicalClues.filter(c => state.discoveredClues.includes(c.id)).length} / {physicalClues.length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {physicalClues.map(c => renderClueCard(c))}
                </div>
              </div>

              {/* COLUMN 2: Asiakirjat */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="bg-[#f0e4cf] text-[#442b1f] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider rounded border border-[#cb9b7d] shadow-[1px_2px_4px_rgba(0,0,0,0.3)] rotate-[0.5deg] select-none flex items-center gap-1">
                    <span>📍</span>
                    <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Asiakirjat' : 'Documents'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-300/80 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {documentClues.filter(c => state.discoveredClues.includes(c.id)).length} / {documentClues.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {documentClues.map(c => renderClueCard(c))}
                </div>
              </div>

              {/* COLUMN 3: Henkilöihin liittyvät todisteet */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="bg-[#f0e4cf] text-[#442b1f] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider rounded border border-[#cb9b7d] shadow-[1px_2px_4px_rgba(0,0,0,0.3)] rotate-[-0.5deg] select-none flex items-center gap-1">
                    <span>📍</span>
                    <span>{t('settings.textSizeNormal') === 'Normaali' ? 'Henkilöihin liittyvät todisteet' : 'Person-Related Evidence'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-300/80 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {personClues.filter(c => state.discoveredClues.includes(c.id)).length} / {personClues.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {personClues.map(c => renderClueCard(c))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 2: DEDUCTION DESK (Slots and connector mechanics) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              💼 {t('board.connectorTitle')}
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/25 to-transparent" />
          </div>

          {/* Elegant leather desk-pad workspace */}
          <div className="bg-[#120f0c] border border-[#2b221a] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Leather texture bounce highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-950/20" />
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch">
              
              {/* Left 8 columns: Input Selector & Slots */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  {/* Reset button bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ListFilter className="w-4 h-4 text-stone-500" />
                      {t('board.connectorTitle')}
                    </span>
                    
                    {(selectedItemA || selectedItemB) && (
                      <button
                        onClick={handleResetSelection}
                        className="flex items-center gap-1 text-[10px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                        id="btn-reset-selection"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('board.resetSelection')}</span>
                      </button>
                    )}
                  </div>

                  {/* The Analyser Slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Slot A */}
                    <div className="border border-[#281f18] bg-[#0c0a08] p-4 rounded-xl flex flex-col justify-between min-h-[110px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative">
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                      <div>
                        <span className="text-[9px] font-mono font-bold text-amber-500/70 uppercase tracking-widest block">{t('board.uncoveredItemA')}</span>
                        {selectedItemA ? (
                          <div className="mt-1.5 animate-scale-up">
                            <p className="text-xs font-semibold text-stone-200">{selectedItemA.name}</p>
                            <span className="text-[9px] font-mono uppercase bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded text-stone-400 mt-2 inline-block">
                              {selectedItemA.category}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-stone-600 font-sans italic mt-1.5 select-none">{t('board.emptySlotDesc')}</p>
                        )}
                      </div>
                    </div>

                    {/* Slot B */}
                    <div className="border border-[#281f18] bg-[#0c0a08] p-4 rounded-xl flex flex-col justify-between min-h-[110px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative">
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                      <div>
                        <span className="text-[9px] font-mono font-bold text-amber-500/70 uppercase tracking-widest block">{t('board.uncoveredItemB')}</span>
                        {selectedItemB ? (
                          <div className="mt-1.5 animate-scale-up">
                            <p className="text-xs font-semibold text-stone-200">{selectedItemB.name}</p>
                            <span className="text-[9px] font-mono uppercase bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded text-stone-400 mt-2 inline-block">
                              {selectedItemB.category}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-stone-600 font-sans italic mt-1.5 select-none">{t('board.emptySlotDesc')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selectable ledger items buttons list */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block flex items-center gap-1 select-none">
                      <Info className="w-3.5 h-3.5 text-stone-500" />
                      {t('settings.textSizeNormal') === 'Normaali' ? 'Valittavissa olevat aineistot (Klikkaa asettaaksesi kohdepaikkaan):' : 'Available documents (Click to set to slot):'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {allSelectableItems.map((item) => {
                        const isA = selectedItemA?.id === item.id && selectedItemA?.type === item.type;
                        const isB = selectedItemB?.id === item.id && selectedItemB?.type === item.type;

                        return (
                          <div
                            key={`${item.type}-${item.id}`}
                            className={`p-2 rounded-lg border text-xs font-sans font-medium flex items-center justify-between gap-2 transition-all ${
                              isA || isB
                                ? 'bg-amber-950/20 border-amber-600/50 text-amber-300 font-semibold shadow-sm'
                                : 'bg-[#0a0806] border-[#231d17] hover:border-amber-900/40 text-stone-300'
                            }`}
                          >
                            <span className="truncate leading-snug">{item.name}</span>
                            
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleSelectA(item)}
                                disabled={isA}
                                className={`px-1.5 py-0.5 text-[9px] font-mono border rounded uppercase cursor-pointer transition-colors ${
                                  isA
                                    ? 'bg-amber-950 border-amber-600/60 text-amber-400'
                                    : 'bg-stone-900 border-stone-850 hover:bg-stone-800 text-stone-450'
                                }`}
                                title={t('board.uncoveredItemA')}
                              >
                                K1
                              </button>
                              <button
                                onClick={() => handleSelectB(item)}
                                disabled={isB}
                                className={`px-1.5 py-0.5 text-[9px] font-mono border rounded uppercase cursor-pointer transition-colors ${
                                  isB
                                    ? 'bg-amber-950 border-amber-600/60 text-amber-400'
                                    : 'bg-stone-900 border-stone-850 hover:bg-stone-800 text-stone-450'
                                }`}
                                title={t('board.uncoveredItemB')}
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
                <div className="pt-4 border-t border-stone-900/60 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-[10px] text-stone-550 font-sans max-w-[340px] text-left leading-relaxed">
                    {t('settings.textSizeNormal') === 'Normaali' 
                      ? '* Yhdistämällä ristiriitaisia todisteita ja alibeja paljastat valehtelijat ja keräät vedenpitävää aineistoa virallista syytöstä varten.'
                      : '* By connecting contradictory evidence and alibis, you expose the liars and collect watertight evidence for the official accusation.'}
                  </span>
                  <button
                    onClick={handleConnect}
                    disabled={!selectedItemA || !selectedItemB}
                    className={`py-2.5 px-6 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                      selectedItemA && selectedItemB
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md border border-amber-500/30'
                        : 'bg-stone-900 border border-stone-850 text-stone-650 cursor-not-allowed'
                    }`}
                    id="btn-perform-connect"
                  >
                    <Puzzle className="w-4 h-4 shrink-0" />
                    <span>{t('board.connectBtn')}</span>
                  </button>
                </div>

              </div>

              {/* Right 4 columns: Discovered Contradictions List */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="border border-[#281f18] bg-[#0c0a08] p-5 rounded-xl flex-1 flex flex-col justify-between space-y-6 shadow-md">
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        {t('board.viewContradictions', { count: state.discoveredContradictions.length })}
                      </span>
                    </div>

                    {/* Feedback Alert box (if any) */}
                    {feedback && (
                      <div className={`p-4 border rounded-lg text-xs leading-relaxed space-y-2 animate-scale-up ${
                        feedback.success
                          ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                          : 'bg-red-950/10 border-red-900/40 text-red-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold font-sans">
                          <ShieldAlert className="w-4 h-4" />
                          <span>{feedback.success ? t('board.contradictionDiscovered') : (t('settings.textSizeNormal') === 'Normaali' ? 'Ei yhteyttä' : 'No Connection')}</span>
                        </div>
                        <p className="font-sans leading-relaxed text-[11px] md:text-xs">
                          {tText(feedback.message)}
                        </p>
                      </div>
                    )}

                    {/* List of successfully unlocked contradictions */}
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {state.discoveredContradictions.length > 0 ? (
                        CONTRADICTIONS.filter(c => state.discoveredContradictions.includes(c.id)).map((c) => (
                          <div
                            key={c.id}
                            className="p-3 bg-black/45 border border-[#2b2118] rounded-lg space-y-1.5 border-l-2 border-l-amber-500 animate-scale-up"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono text-amber-500">
                              <span className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                                {t('settings.textSizeNormal') === 'Normaali' ? 'Ristiriita selvitetty' : 'Contradiction Solved'}
                              </span>
                            </div>
                            <h4 className="text-xs font-serif italic font-bold text-slate-200 leading-snug">
                              {tText(c.title)}
                            </h4>
                            <p className="text-[10px] md:text-[11px] text-stone-400 font-sans leading-relaxed">
                              {tText(c.description)}
                            </p>
                          </div>
                        ))
                      ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center text-center py-10 text-stone-700 space-y-3 select-none">
                          <HelpCircle className="w-8 h-8 text-stone-800 animate-pulse" />
                          <div>
                            <p className="text-xs font-sans font-medium text-stone-500">
                              {t('settings.textSizeNormal') === 'Normaali' ? 'Työpöytä on hiljainen' : 'The desk is quiet'}
                            </p>
                            <p className="text-[10px] text-stone-600 max-w-[180px] mt-1 mx-auto">
                              {t('settings.textSizeNormal') === 'Normaali' ? 'Kokeile yhdistellä todisteita ja kuulustelukertomuksia.' : 'Try to combine clues and alibi details.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-900/60 text-[9px] font-mono text-stone-650 text-center select-none uppercase tracking-wider">
                    Deductive Reasoning System v1.2
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 3: OSOITA RISTIRIITA (Geneerinen päättelyjärjestelmä) */}
        <div className="space-y-4 pt-2" id="alibi-breaker-section">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span>🔍</span> {t('settings.textSizeNormal') === 'Normaali' ? 'Osoita ristiriita: Tutkijan päättelyt' : 'Point out a contradiction: Detective deductions'}
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/25 to-transparent" />
          </div>

          {/* Selector Tabs for Unlocked Deductions */}
          {unlockedDeductions.length > 0 && (
            <div className="flex flex-wrap gap-2 select-none">
              {unlockedDeductions.map(d => {
                const isSolved = !!state.ratkaistutRistiriidat?.includes(d.solvedFlag);
                const isActive = d.id === selectedDeductionId;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      audioSynth.playClick();
                      setSelectedDeductionId(d.id);
                      setAlibiFeedback(null);
                    }}
                    className={`py-1.5 px-3 rounded-full text-[11px] font-sans font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-stone-950/40 border-stone-850 text-stone-500 hover:text-stone-300 hover:border-stone-750'
                    }`}
                  >
                    <span className={isSolved ? 'text-emerald-500' : 'text-stone-600'}>
                      {isSolved ? '☑' : '☐'}
                    </span>
                    <span>{tText(d.title)}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="bg-[#120f0c] border border-[#2b221a] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Soft backdrop radial light */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-950/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-950/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {state.ratkaistutRistiriidat?.includes(activeDeduction.solvedFlag) ? (
                /* Success display */
                <div className="bg-emerald-950/20 border border-emerald-800 rounded-2xl p-6 space-y-4 animate-scale-up">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-serif italic text-base md:text-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span>{tText(activeDeduction.title)}: {t('settings.textSizeNormal') === 'Normaali' ? 'Ratkaistu!' : 'Solved!'}</span>
                  </div>
                  <p className="text-stone-300 font-sans text-xs md:text-sm leading-relaxed">
                    {tText(activeDeduction.successMessage)}
                  </p>
                </div>
              ) : (
                /* Interactive deduction tool */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Inputs Column */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <p className="text-xs text-stone-400 font-sans leading-relaxed mb-4">
                        {t('settings.textSizeNormal') === 'Normaali'
                          ? `Osoita ristiriita päättelyssä "${tText(activeDeduction.title)}". Valitse alta lausunto ja kaksi sitä kumoavaa todistetta.`
                          : `Prove a contradiction in "${tText(activeDeduction.title)}". Select a statement and two refuting clues below.`}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Field 1: Valitse lausunto */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-bold text-amber-500/80 uppercase tracking-wider block">
                          1. {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse lausunto' : 'Select statement'}
                        </label>
                        <select
                          value={selectedStatement}
                          onChange={(e) => {
                            audioSynth.playClick();
                            setSelectedStatement(e.target.value);
                            setAlibiFeedback(null);
                          }}
                          className="w-full bg-[#0a0806] border border-[#231d17] hover:border-amber-900/40 text-stone-300 rounded-lg p-2.5 text-xs font-sans transition-colors focus:outline-none focus:border-amber-600/60"
                        >
                          <option value="">-- {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse lausunto' : 'Select statement'} --</option>
                          {unlockedLausunnot.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {unlockedLausunnot.length === 0 && (
                          <p className="text-[10px] text-stone-600 font-sans italic">
                            * {t('settings.textSizeNormal') === 'Normaali' ? 'Sinulla ei ole vielä avattuja alibilausuntoja.' : 'You do not have any unlocked alibi statements yet.'}
                          </p>
                        )}
                      </div>

                      {/* Field 2: Valitse ensimmäinen todiste */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-bold text-amber-500/80 uppercase tracking-wider block">
                          2. {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse ensimmäinen todiste' : 'Select first clue'}
                        </label>
                        <select
                          value={selectedClue1}
                          onChange={(e) => {
                            audioSynth.playClick();
                            setSelectedClue1(e.target.value);
                            setAlibiFeedback(null);
                          }}
                          className="w-full bg-[#0a0806] border border-[#231d17] hover:border-amber-900/40 text-stone-300 rounded-lg p-2.5 text-xs font-sans transition-colors focus:outline-none focus:border-amber-600/60"
                        >
                          <option value="">-- {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse todiste' : 'Select clue'} --</option>
                          {discoveredCluesForSelection
                            .filter(clue => clue.id !== selectedClue2)
                            .map((clue) => (
                              <option key={clue.id} value={clue.id}>
                                {clue.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Field 3: Valitse toinen todiste */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-bold text-amber-500/80 uppercase tracking-wider block">
                          3. {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse toinen todiste' : 'Select second clue'}
                        </label>
                        <select
                          value={selectedClue2}
                          onChange={(e) => {
                            audioSynth.playClick();
                            setSelectedClue2(e.target.value);
                            setAlibiFeedback(null);
                          }}
                          className="w-full bg-[#0a0806] border border-[#231d17] hover:border-amber-900/40 text-stone-300 rounded-lg p-2.5 text-xs font-sans transition-colors focus:outline-none focus:border-amber-600/60"
                        >
                          <option value="">-- {t('settings.textSizeNormal') === 'Normaali' ? 'Valitse todiste' : 'Select clue'} --</option>
                          {discoveredCluesForSelection
                            .filter(clue => clue.id !== selectedClue1)
                            .map((clue) => (
                              <option key={clue.id} value={clue.id}>
                                {clue.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Action buttons & feedback */}
                    <div className="pt-4 border-t border-stone-900/60 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex-1 w-full text-left">
                        {alibiFeedback && (
                          <div className={`p-3 border rounded-lg text-xs font-sans leading-relaxed animate-scale-up ${
                            alibiFeedback.success
                              ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                              : 'bg-red-950/10 border-red-900/40 text-red-300'
                          }`}>
                            <p>{alibiFeedback.message}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {/* Reset button */}
                        {(selectedStatement || selectedClue1 || selectedClue2) && (
                          <button
                            onClick={() => {
                              audioSynth.playClick();
                              setSelectedStatement('');
                              setSelectedClue1('');
                              setSelectedClue2('');
                              setAlibiFeedback(null);
                            }}
                            className="py-2 px-4 font-sans text-xs font-medium border border-stone-800 bg-[#0a0806] hover:bg-stone-900 text-stone-400 rounded-lg transition-all cursor-pointer"
                          >
                            {t('settings.textSizeNormal') === 'Normaali' ? 'Tyhjennä' : 'Clear'}
                          </button>
                        )}

                        {/* Submit button */}
                        <button
                          onClick={() => {
                            audioSynth.playClick();
                            if (!selectedStatement || !selectedClue1 || !selectedClue2) return;

                            const isCorrect = checkCombination(activeDeduction, selectedStatement, selectedClue1, selectedClue2);
                            if (isCorrect) {
                              audioSynth.playContradictionFound();
                              solveContradiction(activeDeduction.solvedFlag);
                              setAlibiFeedback({
                                message: tText(activeDeduction.successMessage),
                                success: true
                              });
                              // Clear local inputs
                              setSelectedStatement('');
                              setSelectedClue1('');
                              setSelectedClue2('');
                            } else {
                              setAlibiFeedback({
                                message: tText(activeDeduction.failureMessage),
                                success: false
                              });
                            }
                          }}
                          disabled={!selectedStatement || !selectedClue1 || !selectedClue2}
                          className={`py-2 px-5 font-sans text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedStatement && selectedClue1 && selectedClue2
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md border border-amber-500/30'
                              : 'bg-stone-900 border border-stone-850 text-stone-650 cursor-not-allowed'
                          }`}
                        >
                          <Puzzle className="w-3.5 h-3.5" />
                          {t('settings.textSizeNormal') === 'Normaali' ? 'Tarkista' : 'Check'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hints Column */}
                  <div className="lg:col-span-4 border border-[#281f18] bg-[#0c0a08] p-5 rounded-xl space-y-4 shadow-md h-full">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5 select-none">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      {t('settings.textSizeNormal') === 'Normaali' ? `Vihjeet (${state.vihjeTaso}/${activeDeduction.hints.length})` : `Hints (${state.vihjeTaso}/${activeDeduction.hints.length})`}
                    </span>

                    <div className="space-y-3">
                      {activeDeduction.hints.map((hint, idx) => {
                        const hintNum = idx + 1;
                        if (state.vihjeTaso < hintNum) return null;
                        return (
                          <div key={idx} className="p-2.5 bg-black/45 border border-[#2b2118] rounded-lg text-xs text-stone-300 font-sans leading-relaxed animate-scale-up">
                            <span className="font-mono text-[9px] text-amber-500 block mb-1">
                              {t('settings.textSizeNormal') === 'Normaali' ? `VIHJE ${hintNum}` : `HINT ${hintNum}`}
                            </span>
                            {tText(hint)}
                          </div>
                        );
                      })}

                      {state.vihjeTaso < activeDeduction.hints.length && (
                        <button
                          onClick={() => {
                            audioSynth.playClick();
                            updateVihjeTaso(state.vihjeTaso + 1);
                          }}
                          className="w-full py-2 px-3 border border-dashed border-stone-800 hover:border-amber-900/50 hover:bg-stone-900/20 text-stone-400 hover:text-stone-300 font-sans text-xs rounded-lg transition-all cursor-pointer"
                        >
                          {t('settings.textSizeNormal') === 'Normaali' ? 'Pyydä vihje' : 'Request hint'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        ) : (
          <CaseJournal state={state} setActiveInspectClue={setActiveInspectClue} />
        )}

      </div>

      {/* FORENSIC DETAILED INSPECTION MODAL */}
      {activeInspectClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="clue-detail-modal">
          <div className="relative w-full max-w-2xl bg-[#faf7f0] text-stone-900 border-4 border-stone-350 rounded-2xl shadow-2xl p-5 md:p-8 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto relative">
            
            {/* Elegant wood background tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/5 to-amber-900/[0.03] pointer-events-none rounded-xl" />

            {/* Close button */}
            <button
              onClick={() => {
                audioSynth.playClick();
                setActiveInspectClue(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer transition-colors z-20"
              id="close-clue-modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Image in polaroid format */}
            <div className="w-full md:w-2/5 flex flex-col items-center space-y-4 relative z-10">
              <div className="bg-[#fdfcf7] border border-stone-300 p-2.5 pb-8 rounded shadow-[3px_4px_12px_rgba(0,0,0,0.18)] w-full max-w-[240px]">
                {getClueImage(activeInspectClue.id) ? (
                  <div className="bg-stone-950 aspect-square overflow-hidden rounded shadow-inner relative border border-stone-100">
                    <img
                      src={getClueImage(activeInspectClue.id) || ''}
                      alt={tText(activeInspectClue.name)}
                      className="w-full h-full object-cover sepia-[0.12] brightness-[0.9]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.1] opacity-90 pointer-events-none mix-blend-overlay" />
                  </div>
                ) : (
                  <div className="bg-stone-100 aspect-square rounded flex flex-col items-center justify-center text-stone-400 p-4 border border-dashed border-stone-300 shadow-inner">
                    <FileText className="w-10 h-10 opacity-50" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mt-2">NO CAMERA DATA</span>
                  </div>
                )}
                
                {/* Handwritten styled caption under polaroid */}
                <p className="font-serif italic font-semibold text-center text-stone-700 text-xs mt-4 truncate px-1">
                  {tText(activeInspectClue.name)}
                </p>
              </div>

              {/* Forensic Details badges */}
              <div className="w-full max-w-[240px] bg-stone-100/70 border border-stone-250 rounded-lg p-3 space-y-2 select-none">
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>{t('board.categoryLabel')}:</span>
                  <span className="font-bold text-stone-700 truncate max-w-[120px]">{tText(activeInspectClue.category)}</span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>{t('board.evidenceValueLabel')}:</span>
                  <span>{renderStars(activeInspectClue.evidenceValueStars)}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>Order Found:</span>
                  <span className="font-bold text-red-800">#{state.discoveredClues.indexOf(activeInspectClue.id) + 1}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Forensics Analysis reports */}
            <div className="w-full md:w-3/5 space-y-5 flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                {/* Header title */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-amber-800 font-bold tracking-widest uppercase bg-amber-100/80 border border-amber-200/50 px-2 py-0.5 rounded">
                    {tText(activeInspectClue.category) || t('board.clueShorthand')}
                  </span>
                  <h4 className="text-lg font-serif italic font-bold text-stone-900 leading-tight">
                    {tText(activeInspectClue.name)}
                  </h4>
                </div>

                {/* Location pin block */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans select-none">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-medium text-stone-600">{t('board.foundIn')}:</span>
                  <span className="text-stone-800 font-semibold">{getClueLocationName(activeInspectClue.locationId)}</span>
                  {activeInspectClue.foundInObject && (
                    <span className="text-stone-500 text-[10px] bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded truncate">
                      {activeInspectClue.foundInObject}
                    </span>
                  )}
                </div>

                {/* Main description */}
                <p className="text-xs leading-relaxed text-stone-750 font-sans border-l-2 border-amber-600/30 pl-3">
                  {tText(activeInspectClue.description)}
                </p>

                {/* Forensic Analysis */}
                {activeInspectClue.forensicAnalysis && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                      🔎 {t('board.analysisLabel')}
                    </span>
                    <p className="text-[11px] leading-relaxed text-stone-650 font-sans bg-stone-100 border border-stone-200 p-2.5 rounded-lg shadow-inner">
                      {tText(activeInspectClue.forensicAnalysis)}
                    </p>
                  </div>
                )}

                {/* Investigative significance */}
                {activeInspectClue.investigativeSignificance && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                      💡 {t('board.whyImportant')}
                    </span>
                    <p className="text-[11px] leading-relaxed text-stone-650 font-sans bg-amber-50/50 border border-amber-200/40 p-2.5 rounded-lg shadow-inner">
                      {tText(activeInspectClue.investigativeSignificance)}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer Close Button */}
              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    setActiveInspectClue(null);
                  }}
                  className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 border border-stone-950 text-white font-sans text-xs font-semibold rounded-lg shadow cursor-pointer transition-colors"
                >
                  {t('board.closeBtn')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default InvestigationBoard;
