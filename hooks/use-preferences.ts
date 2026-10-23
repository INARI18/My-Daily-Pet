import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export type Language = "en" | "pt";

const LANGUAGE_KEY = "preferences.language";

// Stored preference consumed by the (future) i18n layer; UI texts do not switch yet.
export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
      if (stored === "en" || stored === "pt") setLanguageState(stored);
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  return [language, setLanguage];
}
