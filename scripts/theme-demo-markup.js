import { renderThemeOptions } from '../src/themer.js';

const typography = [
  ['titleFont', 'Title font'],
  ['font', 'Body font'],
  ['titleColor', 'Title color'],
  ['headingSize', 'Title size'],
  ['textSize', 'Text size']
];
const palette = [
  ['theme', 'Mode'],
  ['accent', 'Accent'],
  ['background', 'Background']
];

const renderControls = controls => controls.map(([key, label]) =>
  `<label>${label} <select name="${key}">${renderThemeOptions(key)}</select></label>`
).join('\n');

export const themeDemo = `<section class="system-card theme-demo" id="theme-demo" aria-labelledby="theme-demo-title">
<h2 id="theme-demo-title">Typography and theme tokens</h2>
<p>I use the same theme tokens here and on the rest of the site. Try a serif title with a sans-serif paragraph, then increase the text size and see where the lines wrap. Your choices stay in this sample.</p>
<form class="theme-demo-controls" hidden>
<fieldset class="demo-controls"><legend>Typography</legend>${renderControls(typography)}</fieldset>
<fieldset class="demo-controls"><legend>Color and background</legend>${renderControls(palette)}</fieldset>
<fieldset class="demo-controls"><legend>Component</legend>
${renderControls([['componentSpacing', 'Button spacing']])}
<label>Button state <select name="buttonState"><option value="ready">Ready</option><option value="disabled">Disabled</option></select></label>
</fieldset>
<button class="outline" type="reset">Reset theme sample</button>
</form>
<div class="theme-sample" data-theme-sample>
<h3>Trail conditions</h3>
<p>The river trail is open. The path up to the lookout is still muddy after the rain.</p>
<button class="button" data-token-button type="button">Save trail</button>
<p class="demo-status" data-token-feedback role="status"></p>
</div>
<p class="demo-status" data-theme-feedback role="status"></p>
<p class="token-walkthrough">The button inherits the body font and text size. Its padding comes from the spacing tokens, its fill from the accent, and its label from the on-accent color. Tab to it to see the focus ring, then switch it to Disabled to compare the states.</p>
<section class="type-spacing" aria-labelledby="type-spacing-title">
<h3 id="type-spacing-title">Tracking and kerning</h3>
<p>Tracking changes spacing across the word. Kerning lets the font adjust specific pairs, like “AV” and “To”.</p>
<div class="type-spacing-controls" hidden>
<label>Tracking <input type="range" min="-0.05" max="0.15" step="0.01" value="0" data-tracking></label>
<output data-tracking-value>0.00 em</output>
<label><input type="checkbox" data-kerning checked> Use font kerning</label>
</div>
<div class="type-specimens">
<div><strong>Original</strong><p>AV To WAVE</p></div>
<div><strong>Your settings</strong><p data-type-specimen>AV To WAVE</p></div>
</div>
</section>
</section>`;
