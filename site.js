const demo = document.querySelector('#focus-demo');
const dialog = document.querySelector('#settings-dialog');
const openButton = document.querySelector('#open-demo');
const focusOutput = document.querySelector('#focus-output');
const dialogOutput = document.querySelector('#dialog-output');

if (demo && dialog && openButton && focusOutput && dialogOutput) {
  openButton.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => openButton.focus());
  document.addEventListener('focusin', ({ target }) => {
    const label = target === openButton ? 'Open settings' : target.dataset.focus;
    focusOutput.value = label || 'outside the demo';
    if (dialog.contains(target)) {
      dialogOutput.value = label || 'settings dialog';
      dialog.querySelectorAll('[data-step]').forEach(step => {
        const active = step.dataset.step === label;
        step.toggleAttribute('data-active', active);
        if (active) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    }
  });
  dialog.addEventListener('change', () => {
    dialog.classList.toggle('show-outlines', dialog.querySelector('[data-focus="Show outlines"]').checked);
    dialog.classList.toggle('large-type', dialog.querySelector('[data-focus="Use larger type"]').checked);
  });
}
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const contrastLevel = document.querySelector('#contrast-level');
const contrastSample = document.querySelector('#contrast-sample');
const contrastResult = document.querySelector('#contrast-result');

if (contrastLevel && contrastSample && contrastResult) {
  function updateContrast() {
    const channel = Math.round(255 * (1 - contrastLevel.valueAsNumber / 100));
    const srgb = channel / 255;
    const luminance = srgb <= 0.04045
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4;
    const ratio = 1.05 / (luminance + 0.05);
    const displayedRatio = Math.floor(ratio * 100) / 100;
    contrastSample.style.color = `rgb(${channel} ${channel} ${channel})`;
    contrastResult.value = `${displayedRatio.toFixed(2)}:1 · ${ratio >= 4.5 ? 'Meets' : 'Below'} AA for regular text`;
  }

  contrastLevel.addEventListener('input', updateContrast);
  updateContrast();
}

const penPreview = document.querySelector('[data-pen-preview]');
penPreview?.closest('details').addEventListener('toggle', ({ currentTarget }) => {
  if (!currentTarget.open || penPreview.firstElementChild) return;

  const frame = document.createElement('iframe');
  frame.title = 'Champs UI Multiselect CodePen preview';
  frame.src = 'https://codepen.io/nolawi/embed/xLGzYV?default-tab=result';
  penPreview.append(frame);
});
