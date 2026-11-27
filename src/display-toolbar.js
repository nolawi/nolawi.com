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

  const panel = toolbar.closest('.theme-bar');
  const tab = toolbar.closest('.site-header').querySelector('#theme-tab');
  const drawerHeading = toolbar.querySelector('.theme-drawer-heading');
  const tabHome = tab.parentElement;

  function setOpen(open) {
    const restoreFocus = toolbar.contains(document.activeElement) || document.activeElement === tab;
    if (open) {
      toolbar.hidden = panel.hidden = false;
      drawerHeading.prepend(tab);
    } else {
      tabHome.append(tab);
      toolbar.hidden = panel.hidden = true;
    }
    tab.setAttribute('aria-expanded', String(open));
    if (restoreFocus) tab.focus();
  }

  tab.hidden = false;
  tab.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || panel.hidden ||
        !(tab === document.activeElement || panel.contains(document.activeElement))) return;
    event.preventDefault();
    setOpen(false);
  });
  document.addEventListener('focusin', ({ target }) => {
    if (!panel.hidden && target !== tab && !panel.contains(target)) setOpen(false);
  });
  document.addEventListener('click', ({ target }) => {
    if (!panel.hidden && !tab.contains(target) && !panel.contains(target)) setOpen(false);
  });
}
