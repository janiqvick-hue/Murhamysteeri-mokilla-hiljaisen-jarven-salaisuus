import { Map, Users, FolderOpen, Puzzle, FilePenLine, Skull } from 'lucide-react';
import { GameState } from '../../types/game';
import { audioSynth } from '../../hooks/useAudio';

export type ActiveTab = 'MAP' | 'CLUES' | 'SUSPECTS' | 'BOARD' | 'NOTES' | 'ACCUSATE';

interface GameNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  state: GameState;
}

export function GameNavigation({ activeTab, onChangeTab, state }: GameNavigationProps) {
  const tabs = [
    { id: 'MAP', label: 'Kartta', icon: Map, color: 'text-sky-500' },
    { id: 'CLUES', label: 'Johtolangat', icon: FolderOpen, color: 'text-amber-500', badge: state.discoveredClues.length },
    { id: 'SUSPECTS', label: 'Epäillyt', icon: Users, color: 'text-emerald-500' },
    { id: 'BOARD', label: 'Tutkintataulu', icon: Puzzle, color: 'text-pink-500', badge: state.discoveredContradictions.length },
    { id: 'NOTES', label: 'Muistiinpanot', icon: FilePenLine, color: 'text-teal-500' },
    { id: 'ACCUSATE', label: 'Syytä', icon: Skull, color: 'text-red-500' },
  ] as const;

  const handleTabChange = (tabId: ActiveTab) => {
    audioSynth.playClick();
    onChangeTab(tabId);
  };

  return (
    <nav className="bg-slate-950/70 backdrop-blur-sm border-b border-white/10 flex items-center justify-start overflow-x-auto scrollbar-none" id="game-navigation">
      <div className="flex w-full max-w-7xl mx-auto px-2 md:px-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-3 md:px-5 border-b-2 text-xs md:text-sm font-sans font-medium transition-all cursor-pointer whitespace-nowrap relative flex-1 justify-center md:flex-initial ${
                isActive
                  ? 'border-amber-500 text-amber-500 bg-amber-950/15'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
              id={`nav-tab-${tab.id.toLowerCase()}`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />
              <span className={isActive ? 'font-semibold text-white' : ''}>{tab.label}</span>
              
              {/* Optional dynamic badge */}
              {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${
                  isActive ? 'bg-amber-950 border-amber-800 text-amber-300' : 'bg-slate-900 border-white/5 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}

              {tab.id === 'ACCUSATE' && state.currentPhase === 'VAIHE3' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
