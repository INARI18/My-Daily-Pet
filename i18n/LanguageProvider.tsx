import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LANGUAGE_STORAGE_KEY,
  Language,
  Translate,
  applyLanguage,
  deviceLanguage,
  i18n,
  isLanguage,
} from "./index";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translate;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = deviceLanguage();
    applyLanguage(initial);
    return initial;
  });

  // stored preference wins over the device language
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (isLanguage(stored)) {
        applyLanguage(stored);
        setLanguageState(stored);
      }
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    applyLanguage(lang);
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      // new function per language so consumers re-render on change
      t: (key, options) => i18n.t(key, { locale: language, ...options }),
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT/useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function useT(): Translate {
  return useLanguageContext().t;
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const { language, setLanguage } = useLanguageContext();
  return [language, setLanguage];
}
