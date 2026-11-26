import { defaults, options } from './preferences.js';

export function mountDisplayToolbar(toolbar, preferences) {
  const toggle = toolbar.querySelector('#theme-toggle');
  const font = toolbar.querySelector('#toolbar-font');
  const accents = [...toolbar.querySelectorAll('[name=toolbar-accent]')];
  const sizeOutput = toolbar.querySelector('#toolbar-text-size');
  const steppers = [...toolbar.querySelectorAll('[data-text-step]')];
  const open = toolbar.querySelector('#open-display-settings');
  const dialog = document.querySelector('#display-settings');
  const panel = document.querySelector('#dialog-display-playground');
  const sizes = Object.keys(options.textSize);
  let current;
  let panelLoaded = false;
  let opener = open;

  preferences.subscribe(settings => {
    current = settings;
    toggle.setAttribute('aria-checked', String(settings.theme === 'dark'));
    font.value = settings.font;
    accents.forEach(input => { input.checked = input.value === settings.accent; });
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
  accents.forEach(input => input.addEventListener('change', () => {
    if (input.checked) preferences.update({ accent: input.value });
  }));
  toolbar.querySelector('#quick-display-reset').addEventListener('click', () => preferences.update(defaults));
  steppers.forEach(button => button.addEventListener('click', () => {
    const next = sizes[sizes.indexOf(current.textSize) + Number(button.dataset.textStep)];
    if (next) preferences.update({ textSize: next });
  }));

  async function openSettings(event) {
    opener = event.currentTarget;
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
  }
  for (const trigger of [open, ...document.querySelectorAll('[data-open-display]')]) {
    trigger.hidden = false;
    trigger.addEventListener('click', openSettings);
  }
  dialog.addEventListener('close', () => opener.focus());
  toolbar.hidden = false;
}
