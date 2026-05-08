"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import en from "@/i18n/locales/en.json";
import hi from "@/i18n/locales/hi.json";
import te from "@/i18n/locales/te.json";

type Locale = "en" | "hi" | "te";
type Translations = Record<string, string>;

const translations: Record<Locale, Translations> = { en, hi, te };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("pg_locale", newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = translations[locale] || translations.en;
      return dict[key] || translations.en[key] || fallback || key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LocaleProvider");
  }
  return context;
}
