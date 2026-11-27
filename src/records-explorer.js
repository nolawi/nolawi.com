import { computed, createApp, h, nextTick, ref } from 'vue';
import { answerQuestion, parseRecordQuestion, records } from './records.js';

export function mountRecordsExplorer(element) {
  const compact = Boolean(element.closest('.feature-demo'));
  createApp({
    setup() {
      const status = ref('');
      const question = ref('');
      const messages = ref([]);
      const selectedSource = ref(null);
      const matchedIds = ref(null);
      let sourceTrigger;
      const filtered = computed(() => records.filter(record =>
        (!matchedIds.value || matchedIds.value.includes(record.id)) && (!status.value || record.status === status.value)));
      const examples = [
        ['By region and status', 'Show open records in North'],
        ['By record ID', 'What is SR-112?'],
        ['Zero matches', 'Show closed records in South'],
        ['Beyond the records', 'How much will this cost?']
      ];
      const statusCounts = ['Open', 'In review', 'Closed'].map(value => ({
        value,
        total: records.filter(record => record.status === value).length
      }));

      function ask(value = question.value) {
        const query = value.trim();
        if (!query) return;
        selectedSource.value = null;
        matchedIds.value = null;
        const sources = answerQuestion(query);
        const filters = parseRecordQuestion(query);
        const criteria = filters && Object.entries(filters).filter(([, value]) => value)
          .map(([key, value]) => `${key === 'id' ? 'ID' : key}: ${key === 'id' ? value.toUpperCase() : value}`);
        const response = sources === null
          ? 'I can only look up sample records by ID, region, or status. Try a record ID, region, or status instead.'
          : sources.length
            ? `${sources.length} matching ${sources.length === 1 ? 'record' : 'records'}. Open a source row to verify the details.`
            : 'No records matched. Try a different region or status.';
        const reply = { query, response, sources, criteria };
        if (compact) messages.value = [reply];
        else messages.value.push(reply);
        question.value = '';
      }

      function sourceLink(record, sources) {
        return h('a', {
          href: '#record-' + record.id,
          onClick: async event => {
            event.preventDefault();
            status.value = '';
            sourceTrigger = event.currentTarget;
            matchedIds.value = sources.map(source => source.id);
            selectedSource.value = record.id;
            await nextTick();
            const row = element.querySelector('#record-' + record.id);
            row?.focus();
          }
        }, `${record.id} · ${record.name} · ${record.status}`);
      }

      const table = () => h('section', { class: 'system-card records-table-card', 'aria-labelledby': 'table-heading' }, [
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
          h('p', { role: 'status' }, matchedIds.value
            ? `${filtered.value.length} matching records shown.`
            : `${filtered.value.length} records shown.`),
          selectedSource.value ? h('div', { class: 'links record-source-actions' }, [
            h('button', { class: 'outline', type: 'button', onClick: () => sourceTrigger?.focus() }, 'Back to answer'),
            !compact ? h('button', { class: 'outline', type: 'button', onClick: async () => {
              matchedIds.value = null;
              selectedSource.value = null;
              status.value = '';
              await nextTick();
              element.querySelector('#record-status')?.focus();
            } }, 'Show all records') : null
          ]) : null,
          h('div', { class: 'record-table' }, [
            h('table', [
              h('caption', 'Fictional service requests'),
              h('thead', [h('tr', ['Record', 'Region', 'Status'].map(label => h('th', { scope: 'col' }, label)))]),
              h('tbody', filtered.value.map(record => h('tr', {
                key: record.id, id: 'record-' + record.id, tabindex: -1,
                'data-source-open': selectedSource.value === record.id || undefined
              }, [
                h('th', { scope: 'row' }, [h('small', record.id), ' ', record.name]),
                h('td', record.region),
                h('td', record.status)
              ])))
            ])
          ])
        ]);

      const chat = () => h('section', { class: 'system-card', 'aria-labelledby': 'chat-heading' }, [
          h('h3', { id: 'chat-heading' }, 'Ask the records'),
          h('p', compact ? 'Try a question, then open a source row.' : 'Try a question about these fictional records. Your questions stay in this browser.'),
          h('div', { class: 'record-examples', role: 'group', 'aria-label': 'Example questions' }, (compact ? examples.slice(0, 1) : examples).map(([kind, example]) => h('button', {
            class: 'outline', type: 'button', onClick: () => {
              ask(example);
            }
          }, compact ? example : [h('strong', kind), h('span', example)]))),
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
              selectedSource.value = null;
              matchedIds.value = null;
              element.querySelector('#record-question')?.focus();
            }
          }, 'Clear conversation'),
          h('div', { role: 'log', 'aria-label': 'Conversation', class: 'record-conversation' },
            messages.value.map((message, index) => h('article', { key: index }, [
              h('p', [h('strong', 'You: '), message.query]),
              h('p', message.response),
              message.criteria ? h('p', { class: 'record-criteria' },
                `Searched: ${message.criteria.join(' · ') || 'all records'}`) : null,
              message.sources?.length ? h('ul', message.sources.map(record => h('li', [sourceLink(record, message.sources)]))) : null
            ])))
        ]);

      return () => h('div', { class: 'records-grid' }, [
        chat(), (!compact || selectedSource.value) ? table() : null
      ]);
    }
  }).mount(element);
}
