import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Language, getTranslation } from '@/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Memoize the translation function to prevent unnecessary re-renders
  const t = useMemo(() => (key: string): string => {
    return getTranslation(language, key);
  }, [language]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Enhanced hook with fallback for development hot reloads
export const useLanguage = (): LanguageContextType => {
  try {
    const context = useContext(LanguageContext);
    
    if (context === undefined) {
      // Provide fallback during development to prevent crashes
      console.warn('LanguageContext not found, using fallback');
      return {
        language: 'en' as Language,
        setLanguage: () => console.warn('setLanguage called on fallback context'),
        t: (key: string) => key // Return key as fallback translation
      };
    }
    
    return context;
  } catch (error) {
    console.error('Error in useLanguage hook:', error);
    // Emergency fallback
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    };
  }
};