import { options } from './preferences.js';

const links = [
  ['Design systems', '#work'],
  ['Experience', '#experience'],
  ['Accessibility', '#lab-title'],
  ['AI integrations', '#ai-work'],
  ['Writing', 'writing.html'],
  ['About', 'about.html'],
  ['Contact me', '#contact']
];

export function renderHeader(home) {
  const nav = links.map(([label, href]) => {
    const target = !home && href.startsWith('#') ? './' + href : href;
    return `<a href="${target}">${label}</a>`;
  }).join('');
  return `<div class="reading-progress" aria-hidden="true"><span></span></div>
<header class="mast wrap" id="page-top" tabindex="-1">
<a class="brand" href="./"><span aria-hidden="true">n.</span> Nolawi</a>
<nav aria-label="Main">${nav}<a class="direct-linkedin" href="https://www.linkedin.com/in/nolawi/"><span aria-hidden="true">in</span> LinkedIn</a></nav>
<div class="display-toolbar" id="display-toolbar" role="group" aria-label="Quick display settings" hidden>
  <button class="theme-switch" id="theme-toggle" type="button" role="switch" aria-checked="false">
    <span class="toolbar-icon" aria-hidden="true">◐</span><span>Dark mode</span><span class="switch-track" aria-hidden="true"></span>
  </button>
  <label class="toolbar-select"><span class="toolbar-icon" aria-hidden="true">Aa</span> Font <select id="toolbar-font">${renderOptions(options.font)}</select></label>
  <fieldset class="toolbar-accents"><legend>Accent</legend><div class="toolbar-swatches">${renderSwatches()}</div></fieldset>
  <div class="type-stepper" role="group" aria-label="Page text size">
    <button type="button" data-text-step="-1" aria-label="Decrease page text size">A−</button>
    <output id="toolbar-text-size">100%</output>
    <button type="button" data-text-step="1" aria-label="Increase page text size">A+</button>
  </div>
  <button id="quick-display-reset" type="button" class="outline">Reset</button>
  <button id="open-display-settings" class="display-open" type="button" aria-haspopup="dialog">Make it easier to read</button>
</div>
<dialog class="display-dialog" id="display-settings" aria-labelledby="display-settings-title">
  <div class="display-dialog-head">
    <h2 id="display-settings-title" tabindex="-1" autofocus>Make it easier to read</h2>
    <form method="dialog"><button class="outline" type="submit">Close</button></form>
  </div>
  <p>These settings update the whole site as you try them.</p>
  <div id="dialog-display-playground"><p>Use the quick controls in the header while the full settings load.</p></div>
</dialog>
</header>
<a class="back-to-top" href="#page-top" hidden><span aria-hidden="true">↑</span> Back to top</a>`;
}

function renderOptions(values) {
  return Object.entries(values).map(([value, label]) =>
    `<option value="${value}">${label}</option>`
  ).join('');
}

function renderSwatches() {
  return Object.entries(options.accent).map(([value, label]) =>
    `<label title="${label}"><input type="radio" name="toolbar-accent" value="${value}" aria-label="${label}"><span data-swatch="${value}" aria-hidden="true"></span></label>`
  ).join('');
}
