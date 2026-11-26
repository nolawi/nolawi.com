const storageKey = 'nolawi-display';
export const defaults = Object.freeze({ theme: 'light', textSize: 'default', background: 'default', accent: 'orange', headingSize: 'default', font: 'classic' });

export const options = Object.freeze({
  theme: { light: 'Light', dark: 'Dark' },
  textSize: { small: '90%', default: '100%', large: '112.5%', larger: '125%', largest: '140%' },
  headingSize: { small: '85%', default: '100%', large: '115%', larger: '130%', largest: '145%' },
  accent: { orange: 'Orange', gold: 'Ochre', teal: 'Teal', blue: 'Denim', olive: 'Olive' },
  font: { classic: 'Editorial', sans: 'System sans', serif: 'Serif' },
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
