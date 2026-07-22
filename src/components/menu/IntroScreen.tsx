import { useState } from 'react';
import { GameState, Settings } from '../../types/game';
import { MainMenu } from './MainMenu';
import { SettingsMenu } from './SettingsMenu';

interface IntroScreenProps {
  state: GameState;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onUpdateSettings: (settings: Partial<Settings>) => void;
}

export function IntroScreen({
  state,
  onStartNewGame,
  onContinueGame,
  onUpdateSettings,
}: IntroScreenProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div id="intro-screen-root" className="w-full min-h-screen relative">
      <MainMenu
        state={state}
        onNewGame={onStartNewGame}
        onContinueGame={onContinueGame}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      {isSettingsOpen && (
        <SettingsMenu
          settings={state.settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={onUpdateSettings}
        />
      )}
    </div>
  );
}
