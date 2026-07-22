import { Settings } from '../../types/game';
import { X, Volume2, VolumeX, Eye, Maximize, Check } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';
import { useLanguage } from '../../localization/useLanguage';

interface SettingsMenuProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onClose: () => void;
  onReturnToMainMenu?: () => void;
}

export function SettingsMenu({ settings, onUpdateSettings, onClose, onReturnToMainMenu }: SettingsMenuProps) {
  const { language, setLanguage, t } = useLanguage();

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
            {t('settings.title')}
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
          {/* Language Setting */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              {t('settings.language')}
            </h4>
            <div className="flex gap-2">
              {(['fi', 'en'] as const).map((lang) => {
                const isSelected = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      audioSynth.playClick();
                      setLanguage(lang);
                    }}
                    className={`flex-1 py-2.5 px-3 border rounded-md text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-850 border-zinc-500 text-zinc-100 font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                    aria-selected={isSelected}
                    role="tab"
                    id={`setting-lang-${lang}`}
                  >
                    <span aria-hidden="true">{lang === 'fi' ? '🇫🇮' : '🇬🇧'}</span>
                    <span>{lang === 'fi' ? t('settings.finnish') : t('settings.english')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              {t('settings.sounds')}
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
                  <p className="text-xs font-sans font-medium">{t('settings.music')}</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">{settings.musicOn ? t('settings.on') : t('settings.off')}</p>
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
                  <p className="text-xs font-sans font-medium">{t('settings.sfx')}</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">{settings.soundOn ? t('settings.on') : t('settings.off')}</p>
                </div>
              </button>
            </div>
            <p className="text-[10px] font-sans text-zinc-500">
              {t('settings.audioDisclaimer')}
            </p>
          </div>

          {/* Text Size Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              {t('settings.textSizeTitle')}
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
                    {size === 'normal' ? t('settings.textSizeNormal') : size === 'large' ? t('settings.textSizeLarge') : t('settings.textSizeHuge')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessibility and Display */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
              {t('settings.accessibility')}
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
                    <p className="text-xs font-sans font-medium">{t('settings.reducedMotion')}</p>
                    <p className="text-[10px] text-zinc-500">{t('settings.reducedMotionDesc')}</p>
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
                  <p className="text-xs font-sans font-medium">{t('settings.fullscreen')}</p>
                  <p className="text-[10px] text-zinc-500">{t('settings.fullscreenDesc')}</p>
                </div>
              </button>

              {/* Return to main menu (only if callback provided) */}
              {onReturnToMainMenu && (
                <button
                  onClick={() => {
                    audioSynth.playClick();
                    onReturnToMainMenu();
                    onClose();
                  }}
                  className="w-full p-3 bg-red-950/20 hover:bg-red-900/10 border border-red-900/30 text-red-400 rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-sans font-semibold tracking-wide uppercase"
                  id="btn-settings-to-main-menu"
                >
                  {t('settings.returnToMainMenu')}
                </button>
              )}
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
            {t('settings.done')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;
