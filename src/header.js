import { options, renderThemeOptions } from './themer.js';

const links = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Writing', 'writing.html'],
  ['Contact me', '#contact']
];

export function renderBrand({ backToTop = false } = {}) {
  const href = backToTop ? '#page-top' : './';
  const label = backToTop ? 'Back to top' : 'Portfolio home';
  return `<a class="brand" href="${href}" aria-label="${label}"><span class="brand-mark" aria-hidden="true">n<span class="brand-dot"></span></span></a>`;
}

export function renderHeader(home) {
  const nav = links.map(([label, href]) => {
    const target = home && href === 'writing.html' ? '#writing' : !home && href.startsWith('#') ? './' + href : href;
    return `<a href="${target}">${label}</a>`;
  }).join('');
  return `<div class="reading-progress" aria-hidden="true"><span></span></div>
<div id="page-top" tabindex="-1"></div>
<header class="site-header"><div class="mast wrap">
${renderBrand()}
<nav aria-label="Main">${nav}<a class="direct-linkedin" href="https://www.linkedin.com/in/nolawi/"><span aria-hidden="true">in</span> LinkedIn</a></nav>
<button class="theme-tab" id="theme-tab" type="button" aria-expanded="false" aria-controls="display-toolbar" hidden>Theme <svg class="theme-tab-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path class="theme-open-icon" d="m4 6 4 4 4-4"/><path class="theme-close-icon" d="m4 4 8 8m0-8-8 8"/></svg></button>
</div>
<div class="wrap theme-bar" hidden>
<div class="display-toolbar" id="display-toolbar" role="group" aria-labelledby="theme-tab" hidden>
  <div class="theme-drawer-heading"></div>
  <button class="theme-switch" id="theme-toggle" type="button" role="switch" aria-checked="false">
    <span class="theme-control-caption">Dark mode</span><span class="switch-track" aria-hidden="true"><span>☼</span><span>☾</span></span>
  </button>
  <label class="theme-select"><span class="theme-control-caption">Title font</span>
    <span class="theme-select-frame"><select id="toolbar-title-font">${renderThemeOptions('titleFont')}</select><span aria-hidden="true">⌄</span></span>
  </label>
  <button class="theme-switch font-switch" id="toolbar-font" type="button" role="switch" aria-checked="false">
    <span class="theme-control-caption">Serif body</span><span class="switch-track" aria-hidden="true"><span>Aa</span><span>Aa</span></span>
  </button>
  <fieldset class="toolbar-accents"><legend class="theme-control-caption">Accent</legend><div class="toolbar-swatches">${renderSwatches()}</div></fieldset>
  <div class="type-stepper" role="group" aria-label="Page text size">
    <button type="button" data-text-step="-1" aria-label="Decrease page text size">A−</button>
    <output id="toolbar-text-size">100%</output>
    <button type="button" data-text-step="1" aria-label="Increase page text size">A+</button>
  </div>
</div>
</div></header>
<a class="back-to-top" href="#page-top" hidden><span aria-hidden="true">↑</span> Back to top</a>`;
}

function renderSwatches() {
  return Object.entries(options.accent).map(([value, label]) =>
    `<label title="${label}"><input type="radio" name="toolbar-accent" value="${value}" aria-label="${label}"><span data-swatch="${value}" aria-hidden="true"></span></label>`
  ).join('');
}
