import { options } from './themer.js';

export function mountDisplayToolbar(toolbar, preferences) {
  const toggle = toolbar.querySelector('#theme-toggle');
  const titleFont = toolbar.querySelector('#toolbar-title-font');
  const font = toolbar.querySelector('#toolbar-font');
  const accents = [...toolbar.querySelectorAll('[name=toolbar-accent]')];
  const sizeOutput = toolbar.querySelector('#toolbar-text-size');
  const steppers = [...toolbar.querySelectorAll('[data-text-step]')];
  const sizes = Object.keys(options.textSize);
  let current;

  preferences.subscribe(settings => {
    current = settings;
    toggle.setAttribute('aria-checked', String(settings.theme === 'dark'));
    titleFont.value = settings.titleFont;
    font.setAttribute('aria-checked', String(settings.font === 'serif'));
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
  titleFont.addEventListener('change', () => preferences.update({ titleFont: titleFont.value }));
  font.addEventListener('click', () => {
    preferences.update({ font: current.font === 'serif' ? 'classic' : 'serif' });
  });
  accents.forEach(input => input.addEventListener('change', () => {
    if (input.checked) preferences.update({ accent: input.value });
  }));
  steppers.forEach(button => button.addEventListener('click', () => {
    const next = sizes[sizes.indexOf(current.textSize) + Number(button.dataset.textStep)];
    if (next) preferences.update({ textSize: next });
  }));

  toolbar.hidden = false;
}
