import { computed, createApp, h, nextTick, ref } from 'vue';
import { answerQuestion, records } from './records.js';

export function mountRecordsExplorer(element) {
  createApp({
    setup() {
      const status = ref('');
      const question = ref('');
      const messages = ref([]);
      const filtered = computed(() => records.filter(record => !status.value || record.status === status.value));
      const examples = ['Show open records in North', 'What is SR-112?', 'How much will this cost?'];
      const statusCounts = ['Open', 'In review', 'Closed'].map(value => ({
        value,
        total: records.filter(record => record.status === value).length
      }));

      function ask(value = question.value) {
        const query = value.trim();
        if (!query) return;
        const sources = answerQuestion(query);
        const response = sources === null
          ? 'I can only look up sample records by ID, region, or status. This question needs information or a comparison the demo does not support.'
          : sources.length
            ? `${sources.length} matching ${sources.length === 1 ? 'record' : 'records'}. Open a source row to verify the details.`
            : 'No sample records matched those filters.';
        messages.value.push({ query, response, sources });
        question.value = '';
      }

      function sourceLink(record) {
        return h('a', {
          href: '#record-' + record.id,
          onClick: async event => {
            event.preventDefault();
            status.value = '';
            await nextTick();
            const row = document.getElementById('record-' + record.id);
            row?.focus();
          }
        }, `${record.id} · ${record.name} · ${record.status}`);
      }

      return () => h('div', { class: 'records-grid' }, [
        h('section', { class: 'system-card', 'aria-labelledby': 'table-heading' }, [
          h('h3', { id: 'table-heading' }, 'Browse the table'),
          h('div', { class: 'status-buttons', role: 'group', 'aria-label': 'Filter records by status' },
            statusCounts.map(({ value, total }) => h('button', {
              type: 'button', class: 'outline', 'aria-pressed': status.value === value,
              onClick: () => { status.value = status.value === value ? '' : value; }
            }, [h('strong', String(total)), ' ' + value]))),
          h('label', { for: 'record-status' }, 'Filter by status'),
          h('select', {
            id: 'record-status',
            value: status.value,
            onChange: event => { status.value = event.target.value; }
          }, ['', 'Open', 'In review', 'Closed'].map(value => h('option', { value }, value || 'All statuses'))),
          h('p', { role: 'status' }, `${filtered.value.length} records shown`),
          h('div', { class: 'record-table' }, [
            h('table', [
              h('caption', 'Fictional service requests'),
              h('thead', [h('tr', ['Record', 'Region', 'Status'].map(label => h('th', { scope: 'col' }, label)))]),
              h('tbody', filtered.value.map(record => h('tr', {
                key: record.id, id: 'record-' + record.id, tabindex: -1
              }, [
                h('th', { scope: 'row' }, [h('small', record.id), ' ', record.name]),
                h('td', record.region),
                h('td', record.status)
              ])))
            ])
          ])
        ]),
        h('section', { class: 'system-card', 'aria-labelledby': 'chat-heading' }, [
          h('h3', { id: 'chat-heading' }, 'Ask the records'),
          h('p', 'A local simulation with preset rules and fictional data. Questions stay in this browser.'),
          h('div', { class: 'record-examples' }, examples.map(example => h('button', {
            class: 'outline', type: 'button', onClick: () => {
              ask(example);
            }
          }, example))),
          h('form', {
            onSubmit: event => { event.preventDefault(); ask(); }
          }, [
            h('label', { for: 'record-question' }, 'Your question'),
            h('div', { class: 'record-input' }, [
              h('input', {
                id: 'record-question', type: 'text', value: question.value, maxlength: 160,
                onInput: event => { question.value = event.target.value; }
              }),
              h('button', { class: 'button', type: 'submit' }, 'Ask')
            ])
          ]),
          h('button', {
            type: 'button', class: 'outline clear-chat', 'aria-disabled': !messages.value.length,
            onClick: () => {
              if (!messages.value.length) return;
              messages.value = [];
              element.querySelector('#record-question')?.focus();
            }
          }, 'Clear conversation'),
          h('div', { role: 'log', 'aria-label': 'Conversation', class: 'record-conversation' },
            messages.value.map((message, index) => h('article', { key: index }, [
              h('p', [h('strong', 'You: '), message.query]),
              h('p', message.response),
              message.sources?.length ? h('ul', message.sources.map(record => h('li', [sourceLink(record)]))) : null
            ])))
        ])
      ]);
    }
  }).mount(element);
}
