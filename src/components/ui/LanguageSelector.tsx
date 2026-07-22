import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useLanguage } from '../../localization/useLanguage';
import { Globe, Check } from 'lucide-react';
import { audioSynth } from '../../hooks/useAudio';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    audioSynth.playClick();
    setIsOpen(!isOpen);
  };

  const handleSelectLanguage = (lang: 'fi' | 'en') => {
    audioSynth.playClick();
    setLanguage(lang);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
      // Focus first item after micro-delay
      setTimeout(() => {
        const firstItem = menuRef.current?.querySelector('[role="option"]') as HTMLElement;
        firstItem?.focus();
      }, 50);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, lang: 'fi' | 'en') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectLanguage(lang);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextItem = event.currentTarget.nextElementSibling as HTMLButtonElement;
      nextItem?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevItem = event.currentTarget.previousElementSibling as HTMLButtonElement;
      prevItem?.focus();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="language-selector-wrapper">
      <button
        ref={buttonRef}
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-xs font-sans tracking-wider rounded border border-amber-600/30 hover:border-amber-500/70 bg-zinc-950/80 hover:bg-zinc-900/90 text-zinc-300 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 cursor-pointer transition-all duration-200 shadow-md"
        id="language-selector-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('settings.language')}
        onKeyDown={handleKeyDown}
        onClick={toggleMenu}
      >
        <Globe className="w-3.5 h-3.5 text-amber-500" />
        
        {/* Desktop display */}
        <span className="hidden sm:inline">
          {language === 'fi' ? 'Suomi' : 'English'}
        </span>
        
        {/* Mobile display */}
        <span className="sm:hidden font-bold">
          {language.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2.5 w-36 origin-top-right rounded border border-amber-600/40 bg-zinc-950/95 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in backdrop-blur-md"
          role="listbox"
          aria-label={t('settings.language')}
          onKeyDown={handleMenuKeyDown}
          id="language-selector-dropdown"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => handleSelectLanguage('fi')}
              onKeyDown={(e) => handleItemKeyDown(e, 'fi')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-sans text-left transition-colors cursor-pointer focus:outline-none focus:bg-zinc-900 focus:text-amber-400 ${
                language === 'fi' 
                  ? 'text-amber-500 font-bold bg-zinc-900/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
              role="option"
              aria-selected={language === 'fi'}
              id="lang-option-fi"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block" aria-hidden="true">🇫🇮</span>
                <span>Suomi</span>
              </span>
              {language === 'fi' && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleSelectLanguage('en')}
              onKeyDown={(e) => handleItemKeyDown(e, 'en')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-sans text-left transition-colors cursor-pointer focus:outline-none focus:bg-zinc-900 focus:text-amber-400 ${
                language === 'en' 
                  ? 'text-amber-500 font-bold bg-zinc-900/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
              role="option"
              aria-selected={language === 'en'}
              id="lang-option-en"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block" aria-hidden="true">🇬🇧</span>
                <span>English</span>
              </span>
              {language === 'en' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
