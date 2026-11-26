import '../themes.css';
import '../site.css';
import { initializePreferences } from './preferences.js';
import { mountDisplayToolbar } from './display-toolbar.js';
import { mountPageMotion } from './page-motion.js';

const preferences = initializePreferences();
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
