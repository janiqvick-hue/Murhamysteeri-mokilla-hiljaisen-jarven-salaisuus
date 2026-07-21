import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';
import { LOCATIONS, SUSPECTS } from './data/storyData';
import { ActiveTab } from './components/layout/GameNavigation';
import { Accusation } from './types/game';

// Components
import { GameHeader } from './components/layout/GameHeader';
import { GameNavigation } from './components/layout/GameNavigation';
import { MainMenu } from './components/menu/MainMenu';
import { SettingsMenu } from './components/menu/SettingsMenu';
import { Prologue } from './components/story/Prologue';
import { Ending } from './components/story/Ending';
import { MapView } from './components/locations/MapView';
import { LocationView } from './components/locations/LocationView';
import { SuspectList } from './components/suspects/SuspectList';
import { InterrogationView } from './components/suspects/InterrogationView';
import { CaseFile } from './components/investigation/CaseFile';
import { InvestigationBoard } from './components/investigation/InvestigationBoard';
import { Notes } from './components/investigation/Notes';
import { AccusationView } from './components/accusation/AccusationView';

// Icons
import { ToastContainer } from './components/ui/Toast';

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
  } = useGameState();

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('MAP');
  
  // Settings menu toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active interrogation suspect (null means show list of suspects)
  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);

  // Track the last accusation for incorrect-accusation feedback
  const [lastAccusation, setLastAccusation] = useState<Accusation | null>(null);

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
  useAudio(state);

  // If the user is on intro page, render the main menu
  if (state.showIntro) {
    return (
      <MainMenu
        state={state}
        onNewGame={startNewGame}
        onContinueGame={skipIntroAndStart}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    );
  }

  // If the phase is PROLOGUE, render the immersive intro prologue text
  if (state.currentPhase === 'PROLOGUE') {
    return (
      <Prologue
        onStartGame={() => {
          setPhase('VAIHE1');
        }}
      />
    );
  }

  // If the game is completed (either success ending or failed), Ending handles it beautifully!
  // Note: if the accusation is incorrect, useGameState keeps state.gameCompleted: false,
  // so Ending will render inside the main workspace OR we can render Ending as an overlay/screen.
  // To match the hook's structure:
  // state.gameCompleted represents correct accusation.
  // Let's check: if state.gameCompleted is true, we render the SUCCESS ENDING.
  // If the player made an INCORRECT accusation, we should show the Ending component in "failed" mode.
  // To handle the failed accusation state: let's toggle a failed screen or use the lastAccusation state!
  const isFailedAccusationActive = lastAccusation !== null && !state.isAccusationCorrect;

  if (state.gameCompleted) {
    return (
      <Ending
        state={state}
        onRestart={resetGame}
        onReturnToGame={() => {
          setLastAccusation(null);
          returnToInvestigation();
        }}
        lastAccusation={lastAccusation}
      />
    );
  }

  if (isFailedAccusationActive) {
    return (
      <Ending
        state={state}
        onRestart={resetGame}
        onReturnToGame={() => {
          setLastAccusation(null);
          returnToInvestigation();
        }}
        lastAccusation={lastAccusation}
      />
    );
  }

  const handleSelectLocationOnMap = (locationId: string) => {
    changeLocation(locationId);
  };

  const handleDiscoverClueInLocation = (clueId: string, name: string) => {
    discoverClue(clueId, name);
  };

  const handleSelectSuspectInList = (suspectId: string) => {
    setActiveSuspectId(suspectId);
  };

  const handleCompleteDialogueTopic = (suspectId: string, topicId: string) => {
    completeDialogueTopic(suspectId, topicId);
  };

  const handleDiscoverContradictionOnBoard = (contradictionId: string, title: string) => {
    discoverContradiction(contradictionId, title);
  };

  const handleSubmitAccusationForm = (accusation: Accusation, isCorrect: boolean) => {
    setLastAccusation(accusation);
    submitAccusation(isCorrect);
  };

  // Render active tab body
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'MAP':
        if (state.currentLocationId) {
          const locObj = LOCATIONS.find(l => l.id === state.currentLocationId);
          if (locObj) {
            return (
              <LocationView
                location={locObj}
                state={state}
                onBackToMap={() => changeLocation(null)}
                onDiscoverClue={handleDiscoverClueInLocation}
              />
            );
          }
        }
        return (
          <MapView
            state={state}
            onSelectLocation={handleSelectLocationOnMap}
          />
        );

      case 'CLUES':
        return <CaseFile state={state} />;

      case 'SUSPECTS':
        if (activeSuspectId) {
          const suspectObj = SUSPECTS.find(s => s.id === activeSuspectId);
          if (suspectObj) {
            return (
              <InterrogationView
                suspect={suspectObj}
                state={state}
                onBackToList={() => setActiveSuspectId(null)}
                onCompleteTopic={handleCompleteDialogueTopic}
              />
            );
          }
        }
        return (
          <SuspectList
            state={state}
            onSelectSuspect={handleSelectSuspectInList}
          />
        );

      case 'BOARD':
        return (
          <InvestigationBoard
            state={state}
            onDiscoverContradiction={handleDiscoverContradictionOnBoard}
          />
        );

      case 'NOTES':
        return (
          <Notes
            state={state}
            onSaveNotes={saveNotes}
          />
        );

      case 'ACCUSATE':
        return (
          <AccusationView
            state={state}
            onSubmitAccusation={handleSubmitAccusationForm}
          />
        );

      default:
        return null;
    }
  };

  // Base font size scaling based on settings
  const getTextSizeClass = () => {
    if (state.settings.textSize === 'large') return 'text-lg';
    if (state.settings.textSize === 'small') return 'text-xs';
    return 'text-sm';
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between ${getTextSizeClass()}`} id="game-app-shell">
      
      {/* 1. Header with stats */}
      <GameHeader
        state={state}
        completionPercentage={completionPercentage}
        totalCluesCount={totalCluesCount}
        onToggleMusic={() => updateSettings({ musicOn: !state.settings.musicOn })}
        onToggleSound={() => updateSettings({ soundOn: !state.settings.soundOn })}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Secondary Tab Navigation */}
      <GameNavigation
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          // If switching tab, clear nested states so we reset views cleanly
          if (tab !== 'MAP') changeLocation(null);
          if (tab !== 'SUSPECTS') setActiveSuspectId(null);
        }}
        state={state}
      />

      {/* 3. Main interactive content area */}
      <main className="flex-1 w-full bg-radial-[circle_at_center] from-zinc-900 to-zinc-950 flex flex-col justify-start relative">
        {renderActiveTabContent()}
      </main>

      {/* 4. Footer credits with severe architectural honesty */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-3.5 px-4 text-center text-[10px] text-zinc-600 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Hiljaisen järven salaisuus © 2026</span>
        <div className="flex gap-4">
          <span>Yksinpeli</span>
          <span>Offline-safe</span>
          <span>TypeScript & React</span>
        </div>
      </footer>

      {/* Settings Overlay panel */}
      {isSettingsOpen && (
        <SettingsMenu
          settings={state.settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={updateSettings}
        />
      )}

      {/* Dynamic persistent Toast notifications for unlocks and progress */}
      {toast && (
        <ToastContainer
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
