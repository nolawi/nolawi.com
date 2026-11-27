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
<button class="outline" type="reset">Reset theme sample</button>
</form>
<div class="theme-sample" data-theme-sample>
<h3>Trail conditions</h3>
<p>The river trail is open. The path up to the lookout is still muddy after the rain.</p>
<p class="theme-sample-badge">River trail open</p>
</div>
<p class="demo-status" role="status"></p>
</section>`;
