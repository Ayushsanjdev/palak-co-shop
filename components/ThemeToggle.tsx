"use client";

import { useEffect, useState } from "react";

// Fully boilerplate -- no decisions left for you here. Persists to
// localStorage so the choice survives a refresh, and falls back to the
// OS-level preference on first visit.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="text-sm">
      {isDark ? "☀︎" : "☾"}
    </button>
  );
}
