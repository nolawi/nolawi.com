import { options, renderThemeOptions } from './themer.js';

const links = [
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Writing', 'writing.html'],
  ['Contact me', '#contact']
];

export function renderHeader(home) {
  const nav = links.map(([label, href]) => {
    const target = home && href === 'writing.html' ? '#writing' : !home && href.startsWith('#') ? './' + href : href;
    return `<a href="${target}">${label}</a>`;
  }).join('');
  return `<div class="reading-progress" aria-hidden="true"><span></span></div>
<div id="page-top" tabindex="-1"></div>
<header class="site-header"><div class="mast wrap">
<a class="brand" href="./" aria-label="Portfolio home"><span aria-hidden="true">n.</span></a>
<nav aria-label="Main">${nav}<a class="direct-linkedin" href="https://www.linkedin.com/in/nolawi/"><span aria-hidden="true">in</span> LinkedIn</a></nav>
</div></header>
<div class="wrap theme-bar">
<div class="display-toolbar" id="display-toolbar" role="group" aria-labelledby="theme-controls-title" hidden>
  <button class="theme-switch" id="theme-toggle" type="button" role="switch" aria-checked="false">
    <span>Dark mode</span><span class="switch-track" aria-hidden="true"><span>☼</span><span>☾</span></span>
  </button>
  <label class="theme-select">Title font
    <span class="theme-select-frame"><select id="toolbar-title-font">${renderThemeOptions('titleFont')}</select><span aria-hidden="true">⌄</span></span>
  </label>
  <button class="theme-switch font-switch" id="toolbar-font" type="button" role="switch" aria-checked="false">
    <span>Serif body</span><span class="switch-track" aria-hidden="true"><span>Aa</span><span>Aa</span></span>
  </button>
  <fieldset class="toolbar-accents"><legend>Accent</legend><div class="toolbar-swatches">${renderSwatches()}</div></fieldset>
  <div class="type-stepper" role="group" aria-label="Page text size">
    <button type="button" data-text-step="-1" aria-label="Decrease page text size">A−</button>
    <output id="toolbar-text-size">100%</output>
    <button type="button" data-text-step="1" aria-label="Increase page text size">A+</button>
  </div>
  <strong class="theme-controls-title" id="theme-controls-title">Theme</strong>
</div>
</div>
<a class="back-to-top" href="#page-top" hidden><span aria-hidden="true">↑</span> Back to top</a>`;
}

function renderSwatches() {
  return Object.entries(options.accent).map(([value, label]) =>
    `<label title="${label}"><input type="radio" name="toolbar-accent" value="${value}" aria-label="${label}"><span data-swatch="${value}" aria-hidden="true"></span></label>`
  ).join('');
}
