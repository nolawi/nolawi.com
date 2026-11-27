import '../site.css';
import { mountFavicon } from './favicon.js';
import { initializePreferences } from './preferences.js';
import { mountDisplayToolbar } from './display-toolbar.js';
import { mountPageMotion } from './page-motion.js';

const preferences = initializePreferences();
mountFavicon(preferences);
mountPageMotion();
const toolbar = document.querySelector('#display-toolbar');
if (toolbar) mountDisplayToolbar(toolbar, preferences);

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
