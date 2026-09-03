"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dictionary, type Language, type DictionaryKey } from "./dictionary";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: DictionaryKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Fully boilerplate plumbing -- persists choice to localStorage, defaults
// to English. Wrap the app once (already done in layout.tsx); everywhere
// else, just call useLanguage().
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
    if (stored === "en" || stored === "hi") setLangState(stored);
  }, []);

  function setLang(next: Language) {
    setLangState(next);
    localStorage.setItem("lang", next);
  }

  function t(key: DictionaryKey) {
    return dictionary[lang][key];
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
