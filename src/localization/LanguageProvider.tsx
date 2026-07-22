import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './types';
import { fi } from './fi';
import { en } from './en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { fi, en };

const getNestedTranslation = (dictionary: any, path: string): string | undefined => {
  const parts = path.split('.');
  let current = dictionary;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use 'fi' as the default language, loading from localStorage if present
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'fi' || saved === 'en') {
      return saved;
    }
    return 'fi';
  });

  // Sync with HTML lang attribute and localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    // 1. Try to fetch from active language dictionary
    let text = getNestedTranslation(dictionaries[language], key);
    
    // 2. Fallback to Finnish if missing in current language
    if (text === undefined && language !== 'fi') {
      text = getNestedTranslation(dictionaries.fi, key);
    }
    
    // 3. Fallback to key itself if completely missing
    if (text === undefined) {
      console.warn(`Translation key not found: "${key}"`);
      return key;
    }

    // 4. Perform replacements/interpolations
    if (replacements) {
      let result = text;
      Object.entries(replacements).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
      return result;
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export default LanguageProvider;
