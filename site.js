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

const contrastControls = document.querySelector('#contrast-controls');
const contrastSample = document.querySelector('#contrast-sample');
const contrastResult = document.querySelector('#contrast-result');

if (contrastControls) {
  const { foreground, background } = contrastControls.elements;

  function luminance(color) {
    const channels = color.slice(1).match(/.{2}/g).map(hex => Number.parseInt(hex, 16) / 255);
    const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  function updateContrast() {
    const light = luminance(foreground.value);
    const dark = luminance(background.value);
    const ratio = (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
    const displayedRatio = Math.floor(ratio * 100) / 100;
    contrastSample.style.color = foreground.value;
    contrastSample.style.backgroundColor = background.value;
    contrastResult.value = `${displayedRatio.toFixed(2)}:1 · ${ratio >= 4.5 ? 'Meets' : 'Below'} 4.5:1 for regular text`;
  }

  contrastControls.addEventListener('input', updateContrast);
  contrastControls.addEventListener('reset', () => requestAnimationFrame(updateContrast));
  updateContrast();
  contrastControls.hidden = false;
}
