import { options } from './preferences.js';

export function mountDisplayToolbar(toolbar, preferences) {
  const toggle = toolbar.querySelector('#theme-toggle');
  const font = toolbar.querySelector('#toolbar-font');
  const accent = toolbar.querySelector('#toolbar-accent');
  const sizeOutput = toolbar.querySelector('#toolbar-text-size');
  const steppers = [...toolbar.querySelectorAll('[data-text-step]')];
  const open = toolbar.querySelector('#open-display-settings');
  const dialog = document.querySelector('#display-settings');
  const panel = document.querySelector('#dialog-display-playground');
  const sizes = Object.keys(options.textSize);
  let current;
  let panelLoaded = false;

  preferences.subscribe(settings => {
    current = settings;
    toggle.setAttribute('aria-checked', String(settings.theme === 'dark'));
    font.value = settings.font;
    accent.value = settings.accent;
    sizeOutput.value = options.textSize[settings.textSize];
    steppers.forEach(button => {
      const next = sizes.indexOf(settings.textSize) + Number(button.dataset.textStep);
      button.setAttribute('aria-disabled', String(!sizes[next]));
    });
  });

  toggle.addEventListener('click', () => {
    preferences.update({ theme: current.theme === 'dark' ? 'light' : 'dark' });
  });
  font.addEventListener('change', () => preferences.update({ font: font.value }));
  accent.addEventListener('change', () => preferences.update({ accent: accent.value }));
  steppers.forEach(button => button.addEventListener('click', () => {
    const next = sizes[sizes.indexOf(current.textSize) + Number(button.dataset.textStep)];
    if (next) preferences.update({ textSize: next });
  }));

  open.addEventListener('click', async () => {
    dialog.showModal();
    if (panelLoaded) return;
    panelLoaded = true;
    try {
      const { mountDisplayPlayground } = await import('./display-playground.js');
      mountDisplayPlayground(panel, preferences);
    } catch {
      panelLoaded = false;
      panel.textContent = 'The full settings could not load. Close this panel and try again.';
    }
  });
  dialog.addEventListener('close', () => open.focus());
  toolbar.hidden = false;
}
