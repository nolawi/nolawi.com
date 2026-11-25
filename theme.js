const root = document.documentElement;
const themeKey = 'nolawi-theme';
const themes = new Set(['studio', 'slate']);

function applyTheme(theme) {
  if (!themes.has(theme)) return;
  root.dataset.theme = theme;
}

try {
  applyTheme(localStorage.getItem(themeKey));
} catch {
  // Storage may be unavailable in a private or embedded browser.
}

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector('#theme-picker');
  if (!picker) return;

  picker.hidden = false;
  picker.querySelector('select').value = root.dataset.theme || 'studio';
  picker.addEventListener('change', ({ target }) => {
    applyTheme(target.value);

    try {
      localStorage.setItem(themeKey, target.value);
    } catch {
      // The selected theme still applies to the current page.
    }
  });
});
