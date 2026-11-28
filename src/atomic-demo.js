export function mountAtomicDemo(section) {
  const stages = section.querySelector('[data-atomic-stages]');
  const preview = section.querySelector('[data-atomic-preview]');
  const stageLabel = section.querySelector('[data-atomic-added]');
  const description = section.querySelector('[data-atomic-description]');
  const filter = preview.querySelector('form');
  const query = filter.elements.query;
  const directory = preview.querySelector('[data-atomic-results]');
  const results = [...directory.querySelectorAll('li')];
  const status = preview.querySelector('[role=status]');
  const filterButton = filter.querySelector('button');
  const empty = directory.querySelector('[data-atomic-empty]');
  const clear = directory.querySelector('[data-atomic-clear]');

  const descriptions = {
    atoms: '1 is the label, 2 is the text field, and 3 is the button. Follow those same pieces into the next step.',
    molecule: 'The three numbered pieces now share a form. Together they make one filter.',
    organism: 'The same filter now sits above directory results. Try searching for alert.'
  };

  const stageLabels = { atoms: 'Separate pieces', molecule: 'Added: one shared form', organism: 'Added: a results list' };
  const steps = [...stages.querySelectorAll('input[name=stage]')];
  const navigation = section.querySelector('[data-atomic-navigation]');
  const next = navigation.querySelector('[data-atomic-next]');
  const count = navigation.querySelector('[data-stage-count]');
  let stageIndex = 0;

  function showStage(index) {
    stageIndex = index;
    const step = steps[index];
    step.checked = true;
    preview.dataset.stage = step.value;
    description.textContent = descriptions[step.value];
    stageLabel.textContent = stageLabels[step.value];
    directory.hidden = step.value !== 'organism';
    query.readOnly = directory.hidden;
    filterButton.disabled = query.readOnly;
    count.value = `Step ${index + 1} of ${steps.length}`;
    next.textContent = index === steps.length - 1 ? 'Back to atoms' : 'Next step';
  }

  stages.addEventListener('change', ({ target }) => {
    const index = steps.indexOf(target);
    if (index >= 0) showStage(index);
  });
  next.addEventListener('click', () => showStage((stageIndex + 1) % steps.length));

  function filterDirectory() {
    const term = query.value.trim().toLowerCase();
    const matches = results.filter(item => {
      item.hidden = !item.textContent.toLowerCase().includes(term);
      return !item.hidden;
    });
    empty.hidden = matches.length > 0;
    clear.hidden = !term;
    status.textContent = `${matches.length} ${matches.length === 1 ? 'component' : 'components'} found.`;
  }

  filter.addEventListener('submit', event => {
    event.preventDefault();
    if (!query.readOnly) filterDirectory();
  });
  clear.addEventListener('click', () => {
    query.value = '';
    filterDirectory();
    query.focus();
  });

  showStage(steps.findIndex(step => step.checked));
  stages.hidden = navigation.hidden = false;
}
