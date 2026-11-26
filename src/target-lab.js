export function mountTargetLab(lab) {
  const targets = lab.querySelector('.target-buttons');
  const nextShape = lab.querySelector('#target-instruction strong');
  const feedback = lab.querySelector('[role=status]');
  const sequence = ['Circle', 'Triangle', 'Square'];
  let step = 0;

  lab.querySelector('fieldset').addEventListener('change', ({ target }) => {
    targets.dataset.layout = target.value;
    feedback.textContent = target.value === 'roomy'
      ? 'Roomy layout: larger buttons and more space between them.'
      : 'Tight layout: smaller buttons and less space.';
  });

  targets.addEventListener('click', ({ target }) => {
    const shape = target.closest('button')?.dataset.shape;
    if (!shape) return;
    const expected = sequence[step];
    if (shape !== expected) {
      feedback.textContent = `That was ${shape}. Try ${expected}.`;
      return;
    }
    step = (step + 1) % sequence.length;
    nextShape.textContent = sequence[step];
    feedback.textContent = `You hit ${shape}. Next: ${sequence[step]}.`;
  });
}
