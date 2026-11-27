export function mountReadingDemo(section) {
  const controls = section.querySelector('[data-reading-controls]');
  const sample = section.querySelector('[data-reading-sample]');
  const status = section.querySelector('[data-reading-status]');
  const { size, font, contrast } = controls.elements;

  function update() {
    sample.style.setProperty('--sample-scale', size.value);
    sample.dataset.font = font.value;
    sample.dataset.contrast = contrast.value;
  }

  controls.addEventListener('change', () => {
    update();
    status.textContent = '';
  });
  controls.addEventListener('reset', () => {
    // The reset event runs before the browser restores the selected options.
    requestAnimationFrame(() => {
      update();
      status.textContent = 'Reading sample reset.';
    });
  });
  controls.hidden = false;
}
