import { useState } from 'react';
import { GameState, Settings, Accusation } from '../../types/game';
import { LOCATIONS, SUSPECTS } from '../../data/storyData';
import { ActiveTab, GameNavigation } from './GameNavigation';
import { GameHeader } from './GameHeader';
import { SettingsMenu } from '../menu/SettingsMenu';
import { Prologue } from '../story/Prologue';
import { Ending } from '../story/Ending';
import { MapView } from '../locations/MapView';
import { LocationView } from '../locations/LocationView';
import { SuspectList } from '../suspects/SuspectList';
import { InterrogationView } from '../suspects/InterrogationView';
import { CaseFile } from '../investigation/CaseFile';
import { InvestigationBoard } from '../investigation/InvestigationBoard';
import { Notes } from '../investigation/Notes';
import { AccusationView } from '../accusation/AccusationView';
import { ToastContainer } from '../ui/Toast';

interface GameInterfaceProps {
  state: GameState;
  toast: any;
  setToast: any;
  changeLocation: (locationId: string | null) => void;
  discoverClue: (clueId: string, name: string) => void;
  completeDialogueTopic: (suspectId: string, topicId: string) => void;
  discoverContradiction: (contradictionId: string, title: string) => void;
  saveNotes: (notesText: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  submitAccusation: (accusation: Accusation, isCorrect: boolean) => void;
  returnToInvestigation: () => void;
  resetGame: () => void;
  setPhase: (phase: any) => void;
  completionPercentage: number;
  totalCluesCount: number;
  onReturnToMainMenu: () => void;
  solveContradiction: (id: string) => void;
  updateVihjeTaso: (taso: number) => void;
}

export function GameInterface({
  state,
  toast,
  setToast,
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
  onReturnToMainMenu,
  solveContradiction,
  updateVihjeTaso,
}: GameInterfaceProps) {
  // Active workspace tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('MAP');

  // Settings menu toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active interrogation suspect (null means show list of suspects)
  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);

  // Track the last accusation for incorrect-accusation feedback
  const [lastAccusation, setLastAccusation] = useState<Accusation | null>(null);

  // If the phase is PROLOGUE, render the immersive intro prologue text
  if (state.currentPhase === 'PROLOGUE') {
    return (
      <Prologue
        onStartGame={() => {
          setPhase('VAIHE1');
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }}
      />
    );
  }

  // To handle the failed accusation state
  const effectiveLastAccusation = state.lastAccusation || lastAccusation;
  const isFailedAccusationActive = effectiveLastAccusation !== null && !state.isAccusationCorrect;

  if (state.gameCompleted || isFailedAccusationActive) {
    return (
      <Ending
        state={state}
        onRestart={resetGame}
        onReturnToGame={() => {
          setLastAccusation(null);
          returnToInvestigation();
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }}
        lastAccusation={effectiveLastAccusation}
      />
    );
  }

  const handleSelectLocationOnMap = (locationId: string) => {
    changeLocation(locationId);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleDiscoverClueInLocation = (clueId: string, name: string) => {
    discoverClue(clueId, name);
  };

  const handleSelectSuspectInList = (suspectId: string) => {
    setActiveSuspectId(suspectId);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleCompleteDialogueTopic = (suspectId: string, topicId: string) => {
    completeDialogueTopic(suspectId, topicId);
  };

  const handleDiscoverContradictionOnBoard = (contradictionId: string, title: string) => {
    discoverContradiction(contradictionId, title);
  };

  const handleSubmitAccusationForm = (accusation: Accusation, isCorrect: boolean) => {
    setLastAccusation(accusation);
    submitAccusation(accusation, isCorrect);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  // Render active tab body
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'MAP':
        if (state.currentLocationId) {
          const locObj = LOCATIONS.find((l) => l.id === state.currentLocationId);
          if (locObj) {
            return (
              <LocationView
                location={locObj}
                state={state}
                onBackToMap={() => {
                  changeLocation(null);
                  window.scrollTo({ top: 0, behavior: 'instant' as any });
                }}
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
          const suspectObj = SUSPECTS.find((s) => s.id === activeSuspectId);
          if (suspectObj) {
            return (
              <InterrogationView
                suspect={suspectObj}
                state={state}
                onBackToList={() => {
                  setActiveSuspectId(null);
                  window.scrollTo({ top: 0, behavior: 'instant' as any });
                }}
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
            solveContradiction={solveContradiction}
            updateVihjeTaso={updateVihjeTaso}
          />
        );

      case 'NOTES':
        return <Notes state={state} onSaveNotes={saveNotes} />;

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
    if (state.settings.textSize === 'huge') return 'text-xl';
    return 'text-sm';
  };

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between ${getTextSizeClass()}`}
      id="game-app-shell"
    >
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
          // If switching tab, clear nested states so we reset views cleanly and scroll to top
          if (tab !== 'MAP') changeLocation(null);
          if (tab !== 'SUSPECTS') setActiveSuspectId(null);
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }}
        state={state}
        onOpenSettings={() => setIsSettingsOpen(true)}
        changeLocation={changeLocation}
      />

      {/* 3. Main interactive content area */}
      <main className="flex-1 w-full bg-radial-[circle_at_center] from-zinc-900 to-zinc-950 flex flex-col justify-start relative pb-16 md:pb-0">
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
          onReturnToMainMenu={onReturnToMainMenu}
        />
      )}

      {/* Dynamic persistent Toast notifications for unlocks and progress */}
      {toast && <ToastContainer toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
