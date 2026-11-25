import '../themes.css';
import '../site.css';
import { initializePreferences } from './preferences.js';

const preferences = initializePreferences();
const themeToggle = document.querySelector('#theme-toggle');

if (themeToggle) {
  themeToggle.hidden = false;
  preferences.subscribe(({ theme }) => {
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-checked', String(dark));
    themeToggle.querySelector('[data-theme-status]').textContent = dark ? 'Dark' : 'Light';
  });
  themeToggle.addEventListener('click', () => {
    const dark = themeToggle.getAttribute('aria-checked') === 'true';
    preferences.update({ theme: dark ? 'light' : 'dark' });
  });
}

const playground = document.querySelector('#display-playground');
if (playground) {
  import('./display-playground.js').then(({ mountDisplayPlayground }) => {
    mountDisplayPlayground(playground, preferences);
  });
}

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
if (document.querySelector('#focus-demo')) import('../site.js');
if (document.querySelector('#ai-workbench')) import('../ai-workbench.js');
