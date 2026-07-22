import { useState, useEffect } from 'react';
import { GameState, GamePhase, Settings, Accusation } from '../types/game';

const LOCAL_STORAGE_KEY = 'hiljaisen_jarven_salaisuus_save';

const DEFAULT_SETTINGS: Settings = {
  musicOn: false,
  soundOn: true,
  textSize: 'normal',
  reducedMotion: false,
};

const DEFAULT_STATE: GameState = {
  currentPhase: 'PROLOGUE',
  currentLocationId: null,
  visitedLocations: [],
  discoveredClues: [],
  unlockedDialogueTopics: {
    elina: ['relation', 'evening_events', 'alibi', 'motive'],
    markus: ['relation', 'evening_events', 'alibi', 'motive'],
    laura: ['relation', 'evening_events', 'alibi', 'motive'],
    oskari: ['relation', 'evening_events', 'alibi', 'motive'],
    sara: ['relation', 'evening_events', 'alibi', 'motive'],
  },
  completedDialogueTopics: {
    elina: [],
    markus: [],
    laura: [],
    oskari: [],
    sara: [],
  },
  discoveredContradictions: [],
  notes: '',
  accusationAttempts: 0,
  gameCompleted: false,
  isAccusationCorrect: false,
  lastAccusation: null,
  settings: DEFAULT_SETTINGS,
  showIntro: true,
  ratkaistutRistiriidat: [],
  vihjeTaso: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure default structures are present
        return {
          ...DEFAULT_STATE,
          ...parsed,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          ratkaistutRistiriidat: parsed.ratkaistutRistiriidat || [],
          vihjeTaso: typeof parsed.vihjeTaso === 'number' ? parsed.vihjeTaso : 0,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved game state:', e);
    }
    return DEFAULT_STATE;
  });

  const [toast, setToast] = useState<{ message: string; type: 'clue' | 'phase' | 'contradiction' | 'info' } | null>(null);

  // Autosave to localStorage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showNotification = (message: string, type: 'clue' | 'phase' | 'contradiction' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const startNewGame = () => {
    setState({
      ...DEFAULT_STATE,
      showIntro: false,
      currentPhase: 'VAIHE1',
      currentLocationId: null,
      visitedLocations: [],
      discoveredClues: [],
      discoveredContradictions: [],
      notes: '',
      accusationAttempts: 0,
      gameCompleted: false,
      isAccusationCorrect: false,
      ratkaistutRistiriidat: [],
      vihjeTaso: 0,
    });
    showNotification('Uusi peli aloitettu. Hiljainen järvi odottaa...', 'info');
  };

  const skipIntroAndStart = () => {
    setState((prev) => ({
      ...prev,
      showIntro: false,
    }));
  };

  const changeLocation = (locationId: string | null) => {
    setState((prev) => {
      const visited = prev.visitedLocations.includes(locationId || '')
        ? prev.visitedLocations
        : locationId
        ? [...prev.visitedLocations, locationId]
        : prev.visitedLocations;

      return {
        ...prev,
        currentLocationId: locationId,
        visitedLocations: visited,
      };
    });
  };

  const setPhase = (phase: GamePhase) => {
    setState((prev) => {
      if (prev.currentPhase === phase) return prev;
      let phaseNameFinnish = '';
      if (phase === 'VAIHE1') phaseNameFinnish = 'Vaihe 1: Alkututkinta';
      if (phase === 'VAIHE2') phaseNameFinnish = 'Vaihe 2: Salaisuudet';
      if (phase === 'VAIHE3') phaseNameFinnish = 'Vaihe 3: Todisteet';
      if (phase === 'ACCUSATION') phaseNameFinnish = 'Ratkaisun Hetki';
      
      if (phaseNameFinnish) {
        showNotification(`Tutkinta edistyy! ${phaseNameFinnish}`, 'phase');
      }
      return {
        ...prev,
        currentPhase: phase,
      };
    });
  };

  // Check and advance game phase based on clues found and actions taken
  useEffect(() => {
    if (state.currentPhase === 'PROLOGUE' || state.gameCompleted) return;

    const cluesCount = state.discoveredClues.length;
    
    // Automatically progress phases
    if (state.currentPhase === 'VAIHE1' && cluesCount >= 5 && state.ratkaistutRistiriidat?.includes('elina_alibi_murrettu')) {
      setPhase('VAIHE2');
    } else if (state.currentPhase === 'VAIHE2' && cluesCount >= 11) {
      setPhase('VAIHE3');
    }
  }, [state.discoveredClues, state.currentPhase, state.gameCompleted, state.ratkaistutRistiriidat]);

  const discoverClue = (clueId: string, name: string) => {
    setState((prev) => {
      if (prev.discoveredClues.includes(clueId)) return prev;
      
      const updatedClues = [...prev.discoveredClues, clueId];
      showNotification(`Löysit uuden johtolangan: ${name}! Lisätty tutkintakansioon.`, 'clue');

      // Dynamically unlock dialogue topics associated with this clue
      const updatedUnlockedTopics = { ...prev.unlockedDialogueTopics };
      
      // Let's unlock dialogue topics across suspects depending on clue found
      if (clueId === 'kirjanpitopaperit') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_accounting'];
        updatedUnlockedTopics.markus = [...(updatedUnlockedTopics.markus || []), 'clue_accounting'];
        updatedUnlockedTopics.sara = [...(updatedUnlockedTopics.sara || []), 'clue_accounting'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_accounting'];
        updatedUnlockedTopics.oskari = [...(updatedUnlockedTopics.oskari || []), 'clue_accounting'];
      }
      if (clueId === 'tilisiirto_elinalle') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_transfer'];
        updatedUnlockedTopics.sara = [...(updatedUnlockedTopics.sara || []), 'clue_transfer'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_transfer'];
      }
      if (clueId === 'saran_tallennin') {
        updatedUnlockedTopics.sara = [...(updatedUnlockedTopics.sara || []), 'clue_recording'];
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_recording'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_recording'];
      }
      if (clueId === 'elinan_aani_tallenteella') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_recording_voice'];
        updatedUnlockedTopics.sara = [...(updatedUnlockedTopics.sara || []), 'clue_recording_voice'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_recording_voice'];
        updatedUnlockedTopics.oskari = [...(updatedUnlockedTopics.oskari || []), 'clue_recording_voice'];
      }
      if (clueId === 'repeytynyt_hiha') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_sleeve'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_sleeve'];
      }
      if (clueId === 'rikkinainen_lyhty') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_lantern'];
        updatedUnlockedTopics.markus = [...(updatedUnlockedTopics.markus || []), 'clue_lantern'];
        updatedUnlockedTopics.oskari = [...(updatedUnlockedTopics.oskari || []), 'clue_lantern'];
      }
      if (clueId === 'kenganjaljet_venevajalla') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_footprints'];
        updatedUnlockedTopics.markus = [...(updatedUnlockedTopics.markus || []), 'clue_footprints'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_footprints'];
      }
      if (clueId === 'oskarin_taskulamppu') {
        updatedUnlockedTopics.oskari = [...(updatedUnlockedTopics.oskari || []), 'clue_flashlight'];
        updatedUnlockedTopics.markus = [...(updatedUnlockedTopics.markus || []), 'clue_flashlight'];
      }
      if (clueId === 'poltettu_paperi') {
        updatedUnlockedTopics.elina = [...(updatedUnlockedTopics.elina || []), 'clue_burned_paper'];
        updatedUnlockedTopics.oskari = [...(updatedUnlockedTopics.oskari || []), 'clue_burned_paper'];
        updatedUnlockedTopics.laura = [...(updatedUnlockedTopics.laura || []), 'clue_burned_paper'];
      }

      return {
        ...prev,
        discoveredClues: updatedClues,
        unlockedDialogueTopics: updatedUnlockedTopics,
      };
    });
  };

  const completeDialogueTopic = (suspectId: string, topicId: string) => {
    setState((prev) => {
      const suspectCompleted = prev.completedDialogueTopics[suspectId] || [];
      if (suspectCompleted.includes(topicId)) return prev;

      return {
        ...prev,
        completedDialogueTopics: {
          ...prev.completedDialogueTopics,
          [suspectId]: [...suspectCompleted, topicId],
        },
      };
    });
  };

  const discoverContradiction = (contradictionId: string, title: string) => {
    setState((prev) => {
      if (prev.discoveredContradictions.includes(contradictionId)) return prev;

      showNotification(`Oivallus! Löysit ristiriidan: ${title}`, 'contradiction');
      return {
        ...prev,
        discoveredContradictions: [...prev.discoveredContradictions, contradictionId],
      };
    });
  };

  const saveNotes = (notesText: string) => {
    setState((prev) => ({
      ...prev,
      notes: notesText,
    }));
  };

  const updateSettings = (updatedSettings: Partial<Settings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updatedSettings,
      },
    }));
  };

  const submitAccusation = (accusation: Accusation, isCorrect: boolean) => {
    setState((prev) => ({
      ...prev,
      accusationAttempts: prev.accusationAttempts + 1,
      lastAccusation: accusation,
      gameCompleted: isCorrect,
      isAccusationCorrect: isCorrect,
      currentPhase: isCorrect ? 'ENDING' : prev.currentPhase,
    }));
  };

  const returnToInvestigation = () => {
    setState((prev) => ({
      ...prev,
      gameCompleted: false,
      isAccusationCorrect: false,
    }));
  };

  const resetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState({
      ...DEFAULT_STATE,
      showIntro: false,
    });
  };

  const solveContradiction = (id: string) => {
    setState((prev) => {
      if (prev.ratkaistutRistiriidat.includes(id)) return prev;
      return {
        ...prev,
        ratkaistutRistiriidat: [...prev.ratkaistutRistiriidat, id],
      };
    });
  };

  const updateVihjeTaso = (taso: number) => {
    setState((prev) => ({
      ...prev,
      vihjeTaso: taso,
    }));
  };

  const totalCluesCount = 20; // total clues in the game
  const completionPercentage = Math.round(
    ((state.discoveredClues.length + state.discoveredContradictions.length * 2) / (totalCluesCount + 10)) * 100
  );

  return {
    state,
    toast,
    setToast,
    startNewGame,
    skipIntroAndStart,
    changeLocation,
    discoverClue,
    completeDialogueTopic,
    discoverContradiction,
    saveNotes,
    updateSettings,
    submitAccusation,
    returnToInvestigation,
    resetGame,
    setPhase,
    completionPercentage,
    totalCluesCount,
    solveContradiction,
    updateVihjeTaso,
  };
}
