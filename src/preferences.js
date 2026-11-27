import { defaults, options } from './themer.js';
export { defaults, options } from './themer.js';

const storageKey = 'nolawi-display';

export function normalizePreferences(value) {
  if (value?.font === 'sans') value = { ...value, font: 'classic', titleFont: value.titleFont ?? 'sans' };
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key, Object.hasOwn(options[key], value?.[key]) ? value[key] : fallback
  ]));
}

export function initializePreferences({ root, storage } = {}) {
  root ??= document.documentElement;
  let saved;
  try {
    storage ??= globalThis.localStorage;
    saved = JSON.parse(storage?.getItem(storageKey));
  } catch {
    // Preferences still work for the current page if storage is unavailable.
  }

  let settings = normalizePreferences(saved);
  const subscribers = new Set();
  function apply() {
    Object.assign(root.dataset, settings);
    subscribers.forEach(listener => listener({ ...settings }));
  }
  apply();

  return {
    subscribe(listener) {
      subscribers.add(listener);
      listener({ ...settings });
    },
    update(values) {
      settings = normalizePreferences({ ...settings, ...values });
      apply();
      try {
        storage?.setItem(storageKey, JSON.stringify(settings));
      } catch {
        // The page has already applied the new values.
      }
    }
  };
}
