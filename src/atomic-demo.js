export function mountAtomicDemo(section) {
  const stages = section.querySelector('[data-atomic-stages]');
  const preview = section.querySelector('[data-atomic-preview]');
  const description = section.querySelector('[data-atomic-description]');
  const filter = preview.querySelector('form');
  const query = filter.elements.query;
  const directory = preview.querySelector('[data-atomic-results]');
  const results = [...directory.querySelectorAll('li')];
  const status = preview.querySelector('[role=status]');
  const filterButton = filter.querySelector('button');

  const descriptions = {
    atoms: '1 is the label, 2 is the text field, and 3 is the button. Follow those same pieces into the next step.',
    molecule: 'The three numbered pieces now share a form. Together they make one filter.',
    organism: 'The same filter now sits above directory results. Try searching for alert.'
  };

  stages.addEventListener('change', ({ target }) => {
    if (target.name !== 'stage') return;
    preview.dataset.stage = target.value;
    description.textContent = descriptions[target.value];
    directory.hidden = target.value !== 'organism';
    query.readOnly = directory.hidden;
    filterButton.disabled = query.readOnly;
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

  description.textContent = descriptions.atoms;
  stages.hidden = false;
}
