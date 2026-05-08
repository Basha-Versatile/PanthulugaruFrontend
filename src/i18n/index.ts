import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';

export type Locale = 'en' | 'hi' | 'te';

export const locales: Record<Locale, Record<string, string>> = {
  en,
  hi,
  te,
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
};

export function getTranslation(locale: Locale, key: string, fallback?: string): string {
  return locales[locale]?.[key] || locales.en[key] || fallback || key;
}

export default locales;
