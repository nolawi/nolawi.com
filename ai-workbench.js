import { computed, createApp, h, ref } from 'vue';

const patterns = {
  dialog: {
    title: 'Dialog',
    requirements: [
      'Name the dialog with its visible heading.',
      'Move focus to a useful element when it opens.',
      'Keep Tab and Shift+Tab inside the modal.',
      'Close on Escape and restore focus to the opener when it still exists.'
    ]
  },
  accordion: {
    title: 'Accordion',
    requirements: [
      'Use a native button for each section heading and expose its expanded state.',
      'Let Enter and Space toggle the section.',
      'Keep focus on the trigger on toggle.',
      'Keep collapsed content out of the tab order.'
    ]
  },
  search: {
    title: 'Search field',
    requirements: [
      'Give the input a visible label and a clear submit action.',
      'Make Enter submit the query.',
      'Announce result counts and empty states without moving focus.',
      'Explain errors in text and associate them with the relevant field.'
    ]
  }
};

const mount = document.querySelector('#ai-workbench');
if (mount) {
  createApp({
    setup() {
      const selected = ref('dialog');
      const includeChecks = ref(true);
      const status = ref('');
      const brief = computed(() => {
        const pattern = patterns[selected.value];
        const requirements = pattern.requirements.map(item => `- ${item}`).join('\n');
        const checks = 'Before shipping: test keyboard-only use, check the screen reader announcement, and verify behavior at narrow widths and 200% zoom.';
        return `Build this component using our existing components and design tokens: ${pattern.title}.\n\nRequired behavior:\n${requirements}${includeChecks.value ? '\n\n' + checks : ''}`;
      });
      async function copyBrief() {
        try {
          await navigator.clipboard.writeText(brief.value);
          status.value = 'Brief copied.';
        } catch {
          status.value = 'Select the brief and copy it manually.';
        }
      }
      return () => h('div', { class: 'brief-builder' }, [
        h('div', { class: 'brief-controls' }, [
          h('label', { for: 'brief-pattern' }, 'Component'),
          h('select', {
            id: 'brief-pattern',
            value: selected.value,
            onChange: event => {
              selected.value = event.target.value;
              status.value = '';
            }
          }, Object.entries(patterns).map(([value, pattern]) => h('option', { value }, pattern.title))),
          h('label', { class: 'brief-check' }, [
            h('input', {
              type: 'checkbox',
              checked: includeChecks.value,
              onChange: event => {
                includeChecks.value = event.target.checked;
                status.value = '';
              }
            }),
            ' Include manual testing checks'
          ])
        ]),
        h('label', { for: 'brief-result' }, 'Component brief'),
        h('textarea', { id: 'brief-result', readonly: true, rows: 10, value: brief.value }),
        h('div', { class: 'actions' }, [
          h('button', { class: 'button', type: 'button', onClick: copyBrief }, 'Copy brief'),
          h('span', { role: 'status' }, status.value)
        ])
      ]);
    }
  }).mount(mount);
}
