import { Settings } from '../../types/game';
import { X, Volume2, VolumeX, Eye, Maximize, Check } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

interface SettingsMenuProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onClose: () => void;
}

export function SettingsMenu({ settings, onUpdateSettings, onClose }: SettingsMenuProps) {
  const handleToggleMusic = () => {
    const updated = !settings.musicOn;
    audioSynth.playClick();
    onUpdateSettings({ musicOn: updated });
  };

  const handleToggleSound = () => {
    const updated = !settings.soundOn;
    audioSynth.playClick();
    onUpdateSettings({ soundOn: updated });
  };

  const handleChangeTextSize = (size: 'normal' | 'large' | 'huge') => {
    audioSynth.playClick();
    onUpdateSettings({ textSize: size });
  };

  const handleToggleMotion = () => {
    audioSynth.playClick();
    onUpdateSettings({ reducedMotion: !settings.reducedMotion });
  };

  const handleToggleFullScreen = () => {
    audioSynth.playClick();
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen mode not allowed in iframe:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="settings-modal-overlay">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden animate-scale-up" id="settings-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-base font-sans font-semibold text-zinc-100 uppercase tracking-wider">
            Peliasetukset
          </h3>
          <button
            onClick={() => {
              audioSynth.playClick();
              onClose();
            }}
            className="text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
            id="btn-close-settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sound Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              Äänet & Tehosteet
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Ambient Music/Atmosphere */}
              <button
                onClick={handleToggleMusic}
                className={`p-3 border rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                  settings.musicOn
                    ? 'bg-red-950/20 border-red-700/50 text-red-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
                id="setting-music"
              >
                {settings.musicOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
                <div className="text-left">
                  <p className="text-xs font-sans font-medium">Taustaäänet</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">{settings.musicOn ? 'PÄÄLLÄ' : 'POIS'}</p>
                </div>
              </button>

              {/* Sound SFX */}
              <button
                onClick={handleToggleSound}
                className={`p-3 border rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                  settings.soundOn
                    ? 'bg-red-950/20 border-red-700/50 text-red-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
                id="setting-sound"
              >
                {settings.soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
                <div className="text-left">
                  <p className="text-xs font-sans font-medium">Ääniefektit</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">{settings.soundOn ? 'PÄÄLLÄ' : 'POIS'}</p>
                </div>
              </button>
            </div>
            <p className="text-[10px] font-sans text-zinc-500">
              * Taustaäänet syntetisoidaan dynaamisesti selaimessasi (sadetta ja tuulta ilman latausaikoja).
            </p>
          </div>

          {/* Text Size Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              Käyttöliittymä & Tekstin koko
            </h4>

            <div className="flex gap-2">
              {(['normal', 'large', 'huge'] as const).map((size) => {
                const isSelected = settings.textSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleChangeTextSize(size)}
                    className={`flex-1 py-2 px-3 border rounded-md text-xs font-sans font-medium transition-all cursor-pointer capitalize ${
                      isSelected
                        ? 'bg-zinc-850 border-zinc-500 text-zinc-100 font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                    id={`setting-text-${size}`}
                  >
                    {size === 'normal' ? 'Normaali' : size === 'large' ? 'Suuri' : 'Erittäin suuri'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessibility and Display */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              Saavutettavuus & Näyttö
            </h4>

            <div className="space-y-2">
              {/* Reduced Motion */}
              <button
                onClick={handleToggleMotion}
                className={`w-full p-3 border rounded-md flex items-center justify-between transition-all cursor-pointer ${
                  settings.reducedMotion
                    ? 'bg-zinc-850 border-zinc-700 text-zinc-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
                id="setting-reduced-motion"
              >
                <div className="flex items-center gap-2 text-left">
                  <Eye className="w-4 h-4" />
                  <div>
                    <p className="text-xs font-sans font-medium">Vähennä animaatioita</p>
                    <p className="text-[10px] text-zinc-500">Hyödyllinen herkemmille silmille tai vanhemmille laitteille.</p>
                  </div>
                </div>
                {settings.reducedMotion && <Check className="w-4 h-4 text-emerald-500" />}
              </button>

              {/* Fullscreen Mode */}
              <button
                onClick={handleToggleFullScreen}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:bg-zinc-900 rounded-md flex items-center gap-2 transition-all cursor-pointer"
                id="setting-fullscreen"
              >
                <Maximize className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs font-sans font-medium">Koko näytön tila</p>
                  <p className="text-[10px] text-zinc-500">Laajenna peli koko näytölle (jos selaimesi ja iframe sallivat).</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 text-center">
          <button
            onClick={() => {
              audioSynth.playClick();
              onClose();
            }}
            className="py-2 px-8 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-200 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer"
            id="btn-settings-done"
          >
            Valmis
          </button>
        </div>
      </div>
    </div>
  );
}
export default SettingsMenu;
