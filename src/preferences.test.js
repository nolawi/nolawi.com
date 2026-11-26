import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaults, initializePreferences, normalizePreferences } from './preferences.js';

test('invalid or legacy preference values fall back independently', () => {
  assert.deepEqual(normalizePreferences({ theme: 'slate', textSize: 'larger', background: '__proto__' }), {
    ...defaults, textSize: 'larger'
  });
});

test('controls share state across pages and can reset preferences', () => {
  const root = { dataset: {} };
  let saved;
  const storage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
  const preferences = initializePreferences({ root, storage });
  preferences.update({ theme: 'dark', background: 'warm' });
  preferences.update({ textSize: 'larger' });
  assert.deepEqual(root.dataset, { ...defaults, theme: 'dark', background: 'warm', textSize: 'larger' });
  const nextPage = { dataset: {} };
  const restored = initializePreferences({ root: nextPage, storage });
  assert.deepEqual(nextPage.dataset, root.dataset);
  restored.update(defaults);
  assert.deepEqual(nextPage.dataset, defaults);
});

test('controls still work when storage is blocked', () => {
  const root = { dataset: {} };
  const storage = {
    getItem() { throw new Error('unavailable'); },
    setItem() { throw new Error('unavailable'); }
  };
  const preferences = initializePreferences({ root, storage });
  preferences.update({ theme: 'dark' });
  assert.equal(root.dataset.theme, 'dark');
});
