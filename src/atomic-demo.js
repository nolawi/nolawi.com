export function mountAtomicDemo(section) {
  const stages = section.querySelector('[data-atomic-stages]');
  const preview = section.querySelector('[data-atomic-preview]');
  const description = section.querySelector('[data-atomic-description]');
  const filter = preview.querySelector('form');
  const query = filter.elements.query;
  const directory = preview.querySelector('[data-atomic-results]');
  const results = [...directory.querySelectorAll('li')];
  const status = preview.querySelector('[role=status]');

  const descriptions = {
    atoms: 'A label, text field, and button start as separate pieces.',
    molecule: 'Those same pieces form a filter. Try it in the next step.',
    organism: 'The filter, heading, and list make a directory you can search.'
  };

  stages.addEventListener('change', ({ target }) => {
    if (target.name !== 'stage') return;
    preview.dataset.stage = target.value;
    description.textContent = descriptions[target.value];
    directory.hidden = target.value !== 'organism';
    query.readOnly = directory.hidden;
    filter.querySelector('button').disabled = query.readOnly;
  });

  filter.addEventListener('submit', event => {
    event.preventDefault();
    if (query.readOnly) return;
    const term = query.value.trim().toLowerCase();
    const matches = results.filter(item => {
      item.hidden = !item.textContent.toLowerCase().includes(term);
      return !item.hidden;
    });
    status.textContent = `${matches.length} ${matches.length === 1 ? 'component' : 'components'} found.`;
  });

  stages.hidden = false;
}
