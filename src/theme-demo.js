import { defaults, options } from './themer.js';

export function mountThemeDemo(section) {
  const form = section.querySelector('form');
  const sample = section.querySelector('[data-theme-sample]');
  const status = section.querySelector('[data-theme-feedback]');
  const button = section.querySelector('[data-token-button]');
  const buttonFeedback = section.querySelector('[data-token-feedback]');
  const buttonState = form.elements.namedItem('buttonState');

  function apply() {
    for (const key of Object.keys(defaults)) {
      const value = form.elements.namedItem(key).value;
      sample.dataset[key] = Object.hasOwn(options[key], value) ? value : defaults[key];
    }
    button.disabled = buttonState.value === 'disabled';
    buttonFeedback.textContent = button.disabled ? 'This action is unavailable.' : '';
  }

  button.addEventListener('click', () => {
    buttonFeedback.textContent = 'Saved in this sample.';
  });

  form.addEventListener('change', () => {
    apply();
    status.textContent = '';
  });
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const [key, value] of Object.entries(defaults)) form.elements.namedItem(key).value = value;
    buttonState.value = 'ready';
    apply();
    status.textContent = 'Theme sample reset.';
  });
  apply();
  form.hidden = false;

  const spacing = section.querySelector('.type-spacing-controls');
  const tracking = spacing.querySelector('[data-tracking]');
  const kerning = spacing.querySelector('[data-kerning]');
  const display = spacing.querySelector('[data-tracking-value]');
  const specimen = section.querySelector('[data-type-specimen]');
  spacing.addEventListener('input', () => {
    const value = tracking.valueAsNumber;
    specimen.style.letterSpacing = value + 'em';
    specimen.style.fontKerning = kerning.checked ? 'normal' : 'none';
    display.value = value.toFixed(2) + ' em';
  });
  spacing.hidden = false;
}
