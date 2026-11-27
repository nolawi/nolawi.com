export function mountReadingDemo(section) {
  const controls = section.querySelector('[data-reading-controls]');
  const sample = section.querySelector('[data-reading-sample]');
  const status = section.querySelector('[data-reading-status]');
  const { size, font, contrast, compare } = controls.elements;
  const original = section.querySelector('[data-reading-original]');
  const summary = section.querySelector('[data-reading-summary]');

  function update() {
    sample.style.setProperty('--sample-scale', size.value);
    sample.dataset.font = font.value;
    sample.dataset.contrast = contrast.value;
    original.hidden = !compare.checked;
    const ratio = contrast.selectedOptions[0].textContent.split(' · ')[1];
    summary.textContent = `· ${size.selectedOptions[0].textContent} · ${ratio}`;
  }

  controls.addEventListener('change', () => {
    update();
    status.textContent = '';
  });
  controls.querySelector('[data-reading-preset]').addEventListener('click', () => {
    size.value = '2';
    compare.checked = true;
    update();
    status.textContent = 'Comparing 200% with the original.';
  });
  controls.addEventListener('reset', () => {
    // The reset event runs before the browser restores the selected options.
    requestAnimationFrame(() => {
      update();
      status.textContent = 'Reading sample reset.';
    });
  });
  update();
  controls.hidden = false;
}
