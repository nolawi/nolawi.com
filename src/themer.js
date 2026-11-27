// Change theme tokens, labels, and presets here. The site and component demo
// both render these definitions as CSS custom properties.
const sharedTokens = {
  'heading-scale': 1,
  'text-scale': 1,
  'body-font': 'system-ui, sans-serif',
  'heading-font': 'Georgia, serif',
  'title-color': 'inherit',
  'link-color': 'var(--focus)',
  'feature-description': '#ffaea5',
  'button-pad-block': '.55rem',
  'button-pad-inline': '1rem',
  'button-radius': '.35rem'
};

export const themeSettings = {
  theme: {
    default: 'light',
    values: {
      light: { label: 'Light', tokens: {
        paper: '#f8f6f2', ink: '#23211e', navy: '#242320', 'on-dark': '#f9f6ef',
        wash: '#ede9e2', accent: '#f19b4c', 'on-accent': '#25170e', line: '#857b6f',
        focus: '#9e410c', 'dark-line': '#b8afa2', 'dark-panel': '#39352f', 'warm-panel': '#f0d2af',
        'personal-panel': '#ede5d8', 'embed-panel': '#f2eee6', 'key-shadow': '#a94716',
        'dialog-backdrop': '#1d1812bb'
      }},
      dark: { label: 'Dark', tokens: {
        paper: '#211f1c', ink: '#f7f2e9', navy: '#151412', 'on-dark': '#f7f2e9',
        wash: '#302c26', accent: '#efb078', 'on-accent': '#24170d', line: '#a29a8d',
        focus: '#ffb97a', 'dark-line': '#b8afa2', 'dark-panel': '#39342d', 'warm-panel': '#d6bc9c',
        'personal-panel': '#2b2721', 'embed-panel': '#29251f', 'key-shadow': '#a4471c',
        'dialog-backdrop': '#100e0cbb'
      }}
    }
  },
  titleFont: { default: 'classic', values: {
    classic: { label: 'Editorial', tokens: { 'heading-font': 'Georgia, serif' } },
    sans: { label: 'Sans', tokens: { 'heading-font': 'system-ui, sans-serif' } },
    serif: { label: 'Serif', tokens: { 'heading-font': 'Palatino, "Palatino Linotype", serif' } }
  }},
  font: { default: 'classic', values: {
    classic: { label: 'Sans serif body', tokens: { 'body-font': 'system-ui, sans-serif' } },
    serif: { label: 'Serif body', tokens: { 'body-font': 'Georgia, serif' } }
  }},
  titleColor: { default: 'default', values: {
    default: { label: 'Default', tokens: { 'title-color': 'inherit' } },
    accent: { label: 'Accent', tokens: { 'title-color': 'var(--focus)' } }
  }},
  textSize: { default: 'default', values: {
    small: { label: '90%', scale: .9 },
    default: { label: '100%', scale: 1 },
    large: { label: '112.5%', scale: 1.125 },
    larger: { label: '125%', scale: 1.25 },
    largest: { label: '140%', scale: 1.4 }
  }},
  headingSize: { default: 'default', values: {
    small: { label: '85%', tokens: { 'heading-scale': .85 } },
    default: { label: '100%', tokens: { 'heading-scale': 1 } },
    large: { label: '115%', tokens: { 'heading-scale': 1.15 } },
    larger: { label: '130%', tokens: { 'heading-scale': 1.3 } },
    largest: { label: '145%', tokens: { 'heading-scale': 1.45 } }
  }},
  accent: { default: 'orange', values: {
    orange: { label: 'Orange', swatch: '#f19b4c' },
    gold: { label: 'Ochre', swatch: '#dfba63', focus: '#725008', shadow: '#85621a', dark: '#e8c982' },
    teal: { label: 'Teal', swatch: '#6fbbb0', focus: '#075d53', shadow: '#296f66', dark: '#9bd1c7' },
    blue: { label: 'Denim', swatch: '#8cafd2', focus: '#294f7d', shadow: '#4b7097', dark: '#a7c5e6' },
    olive: { label: 'Olive', swatch: '#abb974', focus: '#47571b', shadow: '#626e33', dark: '#c2cf96' }
  }},
  componentSpacing: { default: 'default', values: {
    compact: { label: 'Compact', tokens: { 'button-pad-block': '.35rem', 'button-pad-inline': '.7rem' } },
    default: { label: 'Default', tokens: { 'button-pad-block': '.55rem', 'button-pad-inline': '1rem' } },
    roomy: { label: 'Roomy', tokens: { 'button-pad-block': '.8rem', 'button-pad-inline': '1.3rem' } }
  }},
  background: { default: 'default', values: {
    default: { label: 'Default' },
    warm: { label: 'Warm', light: '#f3e9d9', dark: '#30241c' },
    neutral: { label: 'Neutral', light: '#f0f0ed', dark: '#262729' }
  }}
};

const settings = Object.entries(themeSettings);
export const defaults = Object.freeze(Object.fromEntries(settings.map(([key, setting]) => [key, setting.default])));
export const options = Object.freeze(Object.fromEntries(settings.map(([key, setting]) => [
  key, Object.fromEntries(Object.entries(setting.values).map(([id, value]) => [id, value.label]))
])));

export function renderThemeOptions(key) {
  return Object.entries(options[key]).map(([value, label]) =>
    `<option value="${value}"${value === defaults[key] ? ' selected' : ''}>${label}</option>`
  ).join('');
}

const scopes = [':root', '[data-theme-sample]'];
const selector = (state = '') => scopes.map(scope => scope + state).join(', ');
const cssRule = (target, tokens, extra = '') => `${target}{${Object.entries(tokens)
  .map(([key, value]) => `--${key}:${value};`).join('')}${extra}}`;

export function renderThemeCss() {
  const { theme, accent, background, textSize } = themeSettings;
  const swatches = Object.fromEntries(Object.entries(accent.values).map(([id, value]) => ['swatch-' + id, value.swatch]));
  const rules = [
    cssRule(selector(), { ...sharedTokens, ...theme.values.light.tokens, ...swatches }, 'color-scheme:light;'),
    cssRule(selector('[data-theme="dark"]'), theme.values.dark.tokens, 'color-scheme:dark;')
  ];
  for (const [id, value] of Object.entries(background.values)) {
    if (!value.light) continue;
    rules.push(cssRule(selector(`[data-background="${id}"]`), { paper: value.light }));
    rules.push(cssRule(selector(`[data-theme="dark"][data-background="${id}"]`), { paper: value.dark }));
  }
  for (const [id, value] of Object.entries(accent.values)) {
    if (!value.focus) continue;
    rules.push(cssRule(selector(`[data-accent="${id}"]`), {
      accent: value.swatch, focus: value.focus, 'key-shadow': value.shadow
    }));
    rules.push(cssRule(selector(`[data-theme="dark"][data-accent="${id}"]`), {
      accent: value.dark, focus: value.dark
    }));
  }
  for (const [id, value] of Object.entries(textSize.values)) {
    if (id === textSize.default) continue;
    rules.push(cssRule(selector(`[data-text-size="${id}"]`), { 'text-scale': value.scale }, `font-size:${value.label};`));
  }
  for (const [key, attribute] of [['titleFont', 'title-font'], ['font', 'font'], ['headingSize', 'heading-size'], ['titleColor', 'title-color'], ['componentSpacing', 'component-spacing']]) {
    for (const [id, value] of Object.entries(themeSettings[key].values)) {
      rules.push(cssRule(selector(`[data-${attribute}="${id}"]`), value.tokens));
    }
  }
  return rules.join('\n');
}
