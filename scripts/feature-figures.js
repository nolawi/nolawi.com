const box = (x, y, width, height, style = 'figure-surface') =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" class="${style}"/>`;
const label = (x, y, value, style = '') =>
  `<text x="${x}" y="${y}" class="${style}">${value}</text>`;
const frame = (title, inside) =>
  box(4, 5, 152, 80, 'figure-frame') + label(12, 21, title, 'figure-heading') + inside;
const row = (y, left, right, highlighted = false) =>
  box(11, y, 138, 18, highlighted ? 'figure-highlight' : 'figure-surface') +
  label(17, y + 12, left) + label(143, y + 12, right, 'figure-end');
const filter = (y) =>
  label(13, y + 12, 'Type', 'figure-heading') +
  box(41, y, 59, 18) + label(47, y + 12, 'All types') +
  box(105, y, 43, 18, 'figure-highlight') + label(113, y + 12, 'Filter');
const flow = (caption, ...steps) => ({ caption, steps });

const figures = {
  'chat-source': flow('The chat sets Region to North and Status to Open. The table returns records #101 and #104, each with a link back to the source.',
    ['Ask in chat', frame('Chat', box(11, 37, 138, 36, 'figure-highlight') +
      label(18, 51, 'Show open records') + label(18, 65, 'in North.'))],
    ['Check the filters', frame('Filters', row(33, 'Region', 'North', true) + row(57, 'Status', 'Open', true))],
    ['Open a source row', frame('2 matching records', row(33, '#101', 'Open') + row(57, '#104', 'Open ↗', true))]),
  'chat-confirm': flow('Record #104 stays Open until you confirm the change. Once saved as Under review, it drops out of the Open results.',
    ['Current record', frame('Record #104', row(43, 'Status', 'Open'))],
    ['Review the change', frame('Change status?', label(12, 45, 'Open → Under review') +
      row(56, 'Cancel', 'Confirm', true))],
    ['Saved record', frame('Record #104 · Saved', row(43, 'Status', 'Under review', true))]),
  'a11y-focus': flow('Focus starts on Settings, moves inside the dialog with Tab, and returns to Settings when you press Escape to close it.',
    ['Open settings', frame('Page', box(12, 41, 68, 22, 'figure-highlight') + label(20, 56, 'Settings'))],
    ['Tab through controls', frame('Settings dialog', row(33, 'Text size', '100%') + row(57, 'Contrast', 'Default', true))],
    ['Return with Escape', frame('Page', box(12, 41, 68, 22, 'figure-highlight') +
      label(20, 56, 'Settings') + label(91, 56, 'Esc ↶'))]),
  'a11y-scaling': flow('At 200% text size, the same sentence wraps onto more lines and Reset stays within reach.',
    ['At 100%', frame('Text sample', label(12, 43, 'Make the type bigger.') +
      box(12, 57, 39, 16, 'figure-highlight') + label(18, 68, 'Reset'))],
    ['At 200%', frame('Text sample', label(12, 45, 'Make the type', 'figure-large') +
      label(12, 62, 'bigger.', 'figure-large') +
      box(89, 49, 58, 23, 'figure-highlight') + label(95, 65, 'Reset', 'figure-large'))]),
  'atomic-assembly': flow('Start with a label, field, and button. Group them into a filter, then pair the filter with component cards to form a directory.',
    ['Atoms', frame('Label, field, button', label(13, 55, 'Type', 'figure-heading') +
      box(48, 42, 45, 19) + label(55, 55, 'Field') +
      box(105, 42, 43, 19, 'figure-highlight') + label(113, 55, 'Filter'))],
    ['Molecule', frame('Filter control', filter(44))],
    ['Organism', frame('Component directory', filter(33) + row(58, 'Button', 'Atom'))]),
  'atomic-reuse': flow('The Type field and Filter button work the same way in both screens. The directory shows component cards, while the records screen shows table rows.',
    ['Component directory', frame('Component directory', filter(33) + row(58, 'Button', 'Atom'))],
    ['Records table', frame('Records table', filter(33) + row(58, '#104', 'Open'))])
};

export function renderFeatureFigure(id) {
  const figure = Object.hasOwn(figures, id) && figures[id];
  if (!figure) return '';
  return `<figure class="feature-figure" data-figure="${id}">
<div class="feature-figure-steps">${figure.steps.map(([name, drawing]) =>
  `<div class="feature-figure-step"><svg viewBox="0 0 160 90" aria-hidden="true" focusable="false">${drawing}</svg><strong>${name}</strong></div>`).join('')}</div>
<figcaption>${figure.caption}</figcaption>
</figure>`;
}
