"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      aria-label="Toggle language"
      className="text-sm font-medium"
    >
      {lang === "en" ? "हिं" : "EN"}
    </button>
  );
}
