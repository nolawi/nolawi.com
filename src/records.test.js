import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { answerQuestion } from './records.js';

test('lookup by status and region returns the source record', () => {
  assert.deepEqual(answerQuestion('Show open records in North').map(record => record.id), ['SR-104']);
});

test('record IDs and empty results are supported', () => {
  assert.deepEqual(answerQuestion('What is SR-112?').map(record => record.id), ['SR-112']);
  assert.deepEqual(answerQuestion('Show closed records in South'), []);
});

test('unsupported questions and conflicting filters ask for a simpler query', () => {
  for (const query of ['How much will this cost?', 'Show North or South', 'Show open records in North and South', 'How are you?']) {
    assert.equal(answerQuestion(query), null);
  }
});
