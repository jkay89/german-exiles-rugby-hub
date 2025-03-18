
import { en } from './en';
import { de } from './de';

export type Language = 'en' | 'de';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  de
};

export const getTranslation = (language: Language, key: string): string => {
  return translations[language][key as TranslationKey] || key;
};
