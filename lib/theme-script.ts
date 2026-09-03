// Runs before React hydrates -- reads the same localStorage key
// ThemeToggle.tsx uses, so there's no flash of the wrong theme on load.
// Boilerplate; you shouldn't need to touch this.
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
