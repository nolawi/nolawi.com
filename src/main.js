import '../themes.css';
import '../site.css';
import { initializePreferences } from './preferences.js';
import { mountDisplayToolbar } from './display-toolbar.js';

const preferences = initializePreferences();
const toolbar = document.querySelector('#display-toolbar');
if (toolbar) mountDisplayToolbar(toolbar, preferences);

const playground = document.querySelector('#display-playground');
if (playground) {
  import('./display-playground.js').then(({ mountDisplayPlayground }) => {
    mountDisplayPlayground(playground, preferences);
  });
}

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
if (document.querySelector('#focus-demo')) import('../site.js');

const recordsExplorer = document.querySelector('#records-explorer');
if (recordsExplorer) {
  import('./records-explorer.js').then(({ mountRecordsExplorer }) => {
    mountRecordsExplorer(recordsExplorer);
  });
}
