import '../site.css';
import { mountFavicon } from './favicon.js';
import { initializePreferences, options } from './preferences.js';
import { mountDisplayToolbar } from './display-toolbar.js';
import { mountPageMotion } from './page-motion.js';

const preferences = initializePreferences();
mountFavicon(preferences);
mountPageMotion();
const toolbar = document.querySelector('#display-toolbar');
if (toolbar) mountDisplayToolbar(toolbar, preferences);

const heroAccent = document.querySelector('.hero-accent');
if (heroAccent) {
  const accents = Object.keys(options.accent);
  const dot = heroAccent.querySelector('.hero-brand-dot');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let nextAccent;
  let pulse;

  preferences.subscribe(({ accent }) => {
    nextAccent = accents[(accents.indexOf(accent) + 1) % accents.length];
    heroAccent.setAttribute('aria-label', `Change accent color to ${options.accent[nextAccent]}`);
  });
  heroAccent.disabled = false;
  heroAccent.addEventListener('click', () => {
    preferences.update({ accent: nextAccent });
    pulse?.cancel();
    if (!reduceMotion.matches && typeof dot.animate === 'function') {
      pulse = dot.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
        { duration: 260, easing: 'ease-out' }
      );
    }
  });
}

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
