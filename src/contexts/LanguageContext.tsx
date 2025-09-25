
import React, { createContext, useState, useContext, ReactNode } from 'react';
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
  
  // Function to get translated text
  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // During hot reload or development, provide a fallback to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      console.warn('useLanguage called outside LanguageProvider, using fallback');
      return {
        language: 'en' as Language,
        setLanguage: () => {},
        t: (key: string) => key // Return the key as fallback
      };
    }
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
