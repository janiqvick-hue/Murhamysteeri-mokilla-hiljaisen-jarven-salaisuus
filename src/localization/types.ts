export type Language = 'fi' | 'en';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export type LocalizedText = string | {
  fi: string;
  en?: string;
};

/**
 * Safely localizes a string or an object with multiple languages.
 * Falls back to Finnish ('fi') if the English ('en') translation is missing,
 * avoiding undefined or empty strings for the player.
 */
export function getLocalizedText(
  text: LocalizedText | undefined,
  lang: Language
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  if (lang === 'en' && text.en && text.en.trim() !== '') {
    return text.en;
  }
  
  return text.fi || '';
}
