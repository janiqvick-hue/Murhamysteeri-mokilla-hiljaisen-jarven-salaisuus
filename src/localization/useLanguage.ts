import { useContext } from 'react';
import { LanguageContext } from './LanguageProvider';
import { LocalizedText, getLocalizedText } from './types';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  const { language, setLanguage, t } = context;

  /**
   * Helper to localize dynamic story contents that support the { fi: string, en?: string } model.
   */
  const tText = (text: LocalizedText | undefined): string => {
    return getLocalizedText(text, language);
  };

  return {
    language,
    setLanguage,
    t,
    tText
  };
}

export default useLanguage;
export { getLocalizedText };
