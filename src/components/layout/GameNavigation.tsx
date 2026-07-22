import { useState } from 'react';
import { Map, Users, FolderOpen, Puzzle, FilePenLine, Skull, Eye, Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { GameState } from '../../types/game';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

export type ActiveTab = 'MAP' | 'CLUES' | 'SUSPECTS' | 'BOARD' | 'NOTES' | 'ACCUSATE';

interface GameNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  state: GameState;
  onOpenSettings?: () => void;
  changeLocation?: (locationId: string | null) => void;
}

export function GameNavigation({ 
  activeTab, 
  onChangeTab, 
  state, 
  onOpenSettings,
  changeLocation 
}: GameNavigationProps) {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'MAP', label: t('navigation.map'), icon: Map, color: 'text-sky-500' },
    { id: 'CLUES', label: t('navigation.evidence'), icon: FolderOpen, color: 'text-amber-500', badge: state.discoveredClues.length },
    { id: 'SUSPECTS', label: t('navigation.suspects'), icon: Users, color: 'text-emerald-500' },
    { id: 'BOARD', label: t('navigation.board'), icon: Puzzle, color: 'text-pink-500', badge: state.discoveredContradictions.length },
    { id: 'NOTES', label: t('navigation.notes'), icon: FilePenLine, color: 'text-teal-500' },
    { id: 'ACCUSATE', label: t('investigation.accuse'), icon: Skull, color: 'text-red-500' },
  ] as const;

  const handleTabChange = (tabId: ActiveTab) => {
    audioSynth.playClick();
    onChangeTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMapClick = () => {
    audioSynth.playClick();
    if (changeLocation) {
      changeLocation(null);
    }
    onChangeTab('MAP');
    setIsMobileMenuOpen(false);
  };

  const handleMobileInspectClick = () => {
    audioSynth.playClick();
    // If we have an active location, stay on it. Otherwise, MAP will guide them.
    onChangeTab('MAP');
    setIsMobileMenuOpen(false);
  };

  const handleMobileSettingsClick = () => {
    audioSynth.playClick();
    setIsMobileMenuOpen(false);
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  // Determine if we are currently "investigating" inside a location
  const isInsideLocation = activeTab === 'MAP' && state.currentLocationId !== null;

  // Determine if voice recorder needs noise reduction and analysis
  const needsRecorderAnalysis = state.discoveredClues.includes('saran_tallennin') && !state.discoveredClues.includes('elinan_aani_tallenteella');

  return (
    <>
      {/* 1. DESKTOP NAVIGATION TABS (visible only on md and larger) */}
      <nav className="hidden md:flex bg-slate-950/45 backdrop-blur-md border-b border-white/5 items-center justify-start overflow-x-auto scrollbar-none" id="game-navigation">
        <div className="flex w-full max-w-7xl mx-auto px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-5 border-b-2 text-sm font-sans font-medium transition-all cursor-pointer whitespace-nowrap relative justify-center flex-initial ${
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

                {tab.id === 'CLUES' && needsRecorderAnalysis && (
                  <span className="ml-1.5 px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-500 text-black rounded-full border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse">
                    UUSI
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

      {/* 2. MOBILE BOTTOM NAVIGATION (visible only on mobile) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-white/10 backdrop-blur-md flex items-center justify-around"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
        id="game-mobile-navigation"
      >
        {/* Map Tab */}
        <button
          onClick={handleMobileMapClick}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] cursor-pointer relative ${
            activeTab === 'MAP' && !isInsideLocation ? 'text-amber-500' : 'text-zinc-400'
          }`}
          id="mobile-nav-map"
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-sans font-medium">{t('navigation.map')}</span>
        </button>

        {/* Inspect/Investigate Tab */}
        <button
          onClick={handleMobileInspectClick}
          disabled={state.currentLocationId === null}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] cursor-pointer relative transition-all ${
            isInsideLocation 
              ? 'text-amber-500 font-semibold' 
              : 'text-zinc-600 cursor-not-allowed opacity-50'
          }`}
          id="mobile-nav-inspect"
        >
          <Eye className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-sans font-medium">{t('investigation.examine')}</span>
        </button>

        {/* Clues Tab */}
        <button
          onClick={() => handleTabChange('CLUES')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] cursor-pointer relative ${
            activeTab === 'CLUES' ? 'text-amber-500' : 'text-zinc-400'
          }`}
          id="mobile-nav-clues"
        >
          <FolderOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-sans font-medium">{t('navigation.evidence')}</span>
          {needsRecorderAnalysis ? (
            <span className="absolute top-1 right-1 bg-amber-500 text-black text-[8px] font-extrabold font-mono px-1 rounded-full border border-black animate-pulse shadow-md">
              UUSI
            </span>
          ) : (
            state.discoveredClues.length > 0 && (
              <span className="absolute top-1.5 right-1/4 bg-amber-500 text-black text-[8px] font-bold font-mono px-1 rounded-full border border-black min-w-[14px] text-center">
                {state.discoveredClues.length}
              </span>
            )
          )}
        </button>

        {/* Suspects Tab */}
        <button
          onClick={() => handleTabChange('SUSPECTS')}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] cursor-pointer relative ${
            activeTab === 'SUSPECTS' ? 'text-amber-500' : 'text-zinc-400'
          }`}
          id="mobile-nav-suspects"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-sans font-medium">{t('navigation.suspects')}</span>
        </button>

        {/* More/Menu Tab */}
        <button
          onClick={() => {
            audioSynth.playClick();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] cursor-pointer relative ${
            isMobileMenuOpen || ['BOARD', 'NOTES', 'ACCUSATE'].includes(activeTab) ? 'text-amber-500' : 'text-zinc-400'
          }`}
          id="mobile-nav-menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 mb-0.5 text-red-400" /> : <Menu className="w-5 h-5 mb-0.5" />}
          <span className="text-[9px] font-sans font-medium">Valikko</span>
          {state.discoveredContradictions.length > 0 && (
            <span className="absolute top-1.5 right-1/4 bg-pink-500 text-white text-[8px] font-bold font-mono px-1 rounded-full border border-black min-w-[14px] text-center">
              {state.discoveredContradictions.length}
            </span>
          )}
        </button>
      </nav>

      {/* 3. MOBILE MENU SLIDE-UP SHEET/OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/85 backdrop-blur-sm flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="bg-zinc-900 border-t border-zinc-800 rounded-t-xl px-4 py-6 space-y-4 max-w-md mx-auto w-full"
            style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">TUTKINTAVALIKKO</span>
              <button 
                className="text-zinc-500 hover:text-white p-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Tutkintataulu */}
              <button
                onClick={() => handleTabChange('BOARD')}
                className={`w-full py-3.5 px-4 rounded-md border text-left flex items-center justify-between min-h-[44px] cursor-pointer transition-all ${
                  activeTab === 'BOARD' 
                    ? 'bg-pink-950/20 border-pink-700/40 text-pink-300 font-semibold' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Puzzle className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-sans font-medium">{t('navigation.board')}</span>
                </div>
                {state.discoveredContradictions.length > 0 && (
                  <span className="bg-pink-900 border border-pink-600 text-pink-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {state.discoveredContradictions.length}
                  </span>
                )}
              </button>

              {/* Muistiinpanot */}
              <button
                onClick={() => handleTabChange('NOTES')}
                className={`w-full py-3.5 px-4 rounded-md border text-left flex items-center gap-3 min-h-[44px] cursor-pointer transition-all ${
                  activeTab === 'NOTES' 
                    ? 'bg-teal-950/20 border-teal-700/40 text-teal-300 font-semibold' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-300'
                }`}
              >
                <FilePenLine className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-sans font-medium">{t('navigation.notes')}</span>
              </button>

              {/* Syytä */}
              <button
                onClick={() => handleTabChange('ACCUSATE')}
                className={`w-full py-3.5 px-4 rounded-md border text-left flex items-center gap-3 min-h-[44px] cursor-pointer transition-all ${
                  activeTab === 'ACCUSATE' 
                    ? 'bg-red-950/20 border-red-700/40 text-red-300 font-semibold' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-300'
                }`}
              >
                <Skull className="w-5 h-5 text-red-500" />
                <span className="text-sm font-sans font-medium">{t('investigation.accuse')}</span>
              </button>

              {/* Peliasetukset */}
              <button
                onClick={handleMobileSettingsClick}
                className="w-full py-3.5 px-4 rounded-md border bg-zinc-950 border-zinc-850 text-zinc-300 text-left flex items-center gap-3 min-h-[44px] cursor-pointer"
              >
                <SettingsIcon className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-sans font-medium">{t('settings.title')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default GameNavigation;
