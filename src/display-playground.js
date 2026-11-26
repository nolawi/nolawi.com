import { createApp, h, ref } from 'vue';
import { defaults, options } from './preferences.js';

export function mountDisplayPlayground(element, preferences) {
  createApp({
    setup() {
      const current = ref({ ...defaults });
      preferences.subscribe(value => { current.value = value; });

      function scale(key, label) {
        const values = Object.keys(options[key]);
        return h('label', { class: 'display-scale' }, [
          h('span', [label, h('output', options[key][current.value[key]])]),
          h('input', {
            type: 'range', min: 0, max: values.length - 1, step: 1,
            value: values.indexOf(current.value[key]),
            'aria-label': label,
            'aria-valuetext': options[key][current.value[key]],
            onInput: event => preferences.update({ [key]: values[event.target.valueAsNumber] })
          })
        ]);
      }

      function radioGroup(key, title) {
        return h('fieldset', { class: 'display-options' }, [
          h('legend', title),
          h('div', Object.entries(options[key]).map(([value, label]) => h('label', [
            h('input', {
              type: 'radio',
              name: `${element.id}-${key}`,
              value,
              checked: current.value[key] === value,
              onChange: () => preferences.update({ [key]: value })
            }),
            key === 'accent' ? h('span', { class: 'accent-chip', 'data-swatch': value, 'aria-hidden': 'true' }) : null,
            ' ' + label
          ])))
        ]);
      }

      return () => h('div', { class: 'display-controls' }, [
        radioGroup('background', 'Page background'),
        radioGroup('accent', 'Accent color'),
        scale('textSize', 'Page text size'),
        scale('headingSize', 'Heading size'),
        radioGroup('font', 'Typeface'),
        h('button', { type: 'button', class: 'outline', onClick: () => preferences.update(defaults) }, 'Reset')
      ]);
    }
  }).mount(element);
}
