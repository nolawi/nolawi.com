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
    if (dialog.contains(target)) dialogOutput.value = label || 'settings dialog';
  });
  dialog.addEventListener('change', () => {
    dialog.classList.toggle('show-outlines', dialog.querySelector('[data-focus="Show outlines"]').checked);
    dialog.classList.toggle('large-type', dialog.querySelector('[data-focus="Use larger type"]').checked);
  });
}
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
