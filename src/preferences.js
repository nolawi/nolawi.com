const storageKey = 'nolawi-display';
export const defaults = Object.freeze({ theme: 'light', textSize: 'default', background: 'default' });

export const options = Object.freeze({
  theme: { light: 'Light', dark: 'Dark' },
  textSize: { default: 'Default (100%)', large: 'Large (112.5%)', larger: 'Larger (125%)' },
  background: { default: 'Default', warm: 'Warm', neutral: 'Neutral' }
});

export function normalizePreferences(value) {
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
