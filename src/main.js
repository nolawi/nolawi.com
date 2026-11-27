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
if (document.querySelector('#focus-demo')) import('../site.js');

const recordsExplorer = document.querySelector('#records-explorer');
if (recordsExplorer) {
  import('./records-explorer.js').then(({ mountRecordsExplorer }) => {
    mountRecordsExplorer(recordsExplorer);
  });
}

const socialFeed = document.querySelector('[data-social-feed]');
if (socialFeed) {
  import('./social-feed.js').then(({ mountSocialFeed }) => mountSocialFeed(socialFeed));
}

const targetLab = document.querySelector('[data-target-lab]');
if (targetLab) {
  import('./target-lab.js').then(({ mountTargetLab }) => mountTargetLab(targetLab));
}

const readingDemo = document.querySelector('#reading-demo');
if (readingDemo) import('./reading-demo.js').then(({ mountReadingDemo }) => mountReadingDemo(readingDemo));

const atomicDemo = document.querySelector('#atomic-demo');
if (atomicDemo) import('./atomic-demo.js').then(({ mountAtomicDemo }) => mountAtomicDemo(atomicDemo));

const themeDemo = document.querySelector('#theme-demo');
if (themeDemo) import('./theme-demo.js').then(({ mountThemeDemo }) => mountThemeDemo(themeDemo));
