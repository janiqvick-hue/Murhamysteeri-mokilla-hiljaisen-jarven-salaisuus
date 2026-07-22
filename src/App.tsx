import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';
import { IntroScreen } from './components/menu/IntroScreen';
import { GameInterface } from './components/layout/GameInterface';

export default function App() {
  const {
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
  } = useGameState();

  // Track if the game has started in this session using sessionStorage
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return sessionStorage.getItem('investigationStarted') === 'true';
  });

  // Bind the global voice recorder triggers so CaseFile can trigger correctly
  useEffect(() => {
    (window as any)._discoverClueCallback = (clueId: string, name: string) => {
      discoverClue(clueId, name);
    };
    return () => {
      delete (window as any)._discoverClueCallback;
    };
  }, [discoverClue]);

  // Hook up background audio ambiance using the useAudio hook
  useAudio(state.settings);

  const handleStartNewGame = () => {
    startNewGame();
    sessionStorage.setItem('investigationStarted', 'true');
    setHasStarted(true);
    // Guarantee top scroll position
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleContinueGame = () => {
    skipIntroAndStart();
    changeLocation(null);
    sessionStorage.setItem('investigationStarted', 'true');
    setHasStarted(true);
    // Guarantee top scroll position
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleReturnToMainMenu = () => {
    sessionStorage.removeItem('investigationStarted');
    setHasStarted(false);
  };

  return hasStarted ? (
    <GameInterface
      state={state}
      toast={toast}
      setToast={setToast}
      changeLocation={changeLocation}
      discoverClue={discoverClue}
      completeDialogueTopic={completeDialogueTopic}
      discoverContradiction={discoverContradiction}
      saveNotes={saveNotes}
      updateSettings={updateSettings}
      submitAccusation={submitAccusation}
      returnToInvestigation={returnToInvestigation}
      resetGame={() => {
        resetGame();
        handleReturnToMainMenu();
      }}
      setPhase={setPhase}
      completionPercentage={completionPercentage}
      totalCluesCount={totalCluesCount}
      onReturnToMainMenu={handleReturnToMainMenu}
      solveContradiction={solveContradiction}
      updateVihjeTaso={updateVihjeTaso}
    />
  ) : (
    <IntroScreen
      state={state}
      onStartNewGame={handleStartNewGame}
      onContinueGame={handleContinueGame}
      onUpdateSettings={updateSettings}
    />
  );
}

