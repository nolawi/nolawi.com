import { createApp, h, ref } from 'vue';
import { defaults, options } from './preferences.js';

export function mountDisplayPlayground(element, preferences) {
  createApp({
    setup() {
      const current = ref({ ...defaults });
      preferences.subscribe(value => { current.value = value; });

      function radioGroup(key, title) {
        return h('fieldset', { class: 'display-options' }, [
          h('legend', title),
          h('div', Object.entries(options[key]).map(([value, label]) => h('label', [
            h('input', {
              type: 'radio',
              name: key,
              value,
              checked: current.value[key] === value,
              onChange: () => preferences.update({ [key]: value })
            }),
            ' ' + label
          ])))
        ]);
      }

      return () => h('div', { class: 'display-controls' }, [
        radioGroup('background', 'Page background'),
        radioGroup('textSize', 'Text size'),
        h('button', { type: 'button', class: 'outline', onClick: () => preferences.update(defaults) }, 'Reset display settings')
      ]);
    }
  }).mount(element);
}
