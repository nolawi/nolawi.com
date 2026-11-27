import { defaults, options } from './themer.js';

export function mountThemeDemo(section) {
  const form = section.querySelector('form');
  const sample = section.querySelector('[data-theme-sample]');
  const status = section.querySelector('[role=status]');

  function apply() {
    for (const key of Object.keys(defaults)) {
      const value = form.elements.namedItem(key).value;
      sample.dataset[key] = Object.hasOwn(options[key], value) ? value : defaults[key];
    }
  }

  form.addEventListener('change', () => {
    apply();
    status.textContent = '';
  });
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const [key, value] of Object.entries(defaults)) form.elements.namedItem(key).value = value;
    apply();
    status.textContent = 'Theme sample reset.';
  });
  apply();
  form.hidden = false;
}
