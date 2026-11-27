export const accessibilityDemo = `<section class="accessibility-playground" aria-labelledby="lab-title">
<div class="playground-heading">
<nav class="demo-index" aria-label="Jump to an accessibility demo">
<a href="#reading-demo"><span aria-hidden="true">Aa</span> Reading settings</a>
<a href="#display-title"><span aria-hidden="true">◎</span> Tap targets</a>
<a href="#focus-title"><span aria-hidden="true">⌨</span> Keyboard focus</a>
<a href="#contrast-title"><span aria-hidden="true">◑</span> Contrast</a>
<a href="#switchback-title"><span aria-hidden="true">↝</span> Switchback</a>
</nav>
<h2 id="lab-title"><span class="heading-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M4 9h16m-8 0v6m0-1-4 7m4-7 4 7"/></svg></span> Accessibility playground</h2>
</div>
<!-- reading-demo -->
<section class="target-lab system-card" id="display-title" aria-labelledby="target-title" data-target-lab>
<div>
<p class="eyebrow">Accessibility experiment</p>
<h3 id="target-title">Give buttons room.</h3>
<p>Try hitting the named button in both layouts. More room makes it easier to tap the right thing, especially one-handed.</p>
</div>
<div class="target-panel">
<fieldset><legend>Button layout</legend>
<label><input type="radio" name="target-layout" value="tight" checked> Tight</label>
<label><input type="radio" name="target-layout" value="roomy"> Roomy</label>
</fieldset>
<p id="target-instruction">Tap <strong>Circle</strong>.</p>
<div class="target-buttons" role="group" aria-labelledby="target-instruction" data-layout="tight">
<button type="button" data-shape="Square" aria-label="Square">■</button>
<button type="button" data-shape="Circle" aria-label="Circle">●</button>
<button type="button" data-shape="Triangle" aria-label="Triangle">▲</button>
</div>
<p class="target-feedback" role="status"></p>
</div>
</section>
<div class="playground">
<section class="lab" aria-labelledby="focus-title">
<div>
<p class="eyebrow">Interactive accessibility demo</p>
<div class="focus-art" aria-hidden="true"><span></span><span></span><span></span><kbd>Tab</kbd></div>
<h3 id="focus-title">Follow the focus.</h3>
<p>Ever hit Tab and lose track of where you are? Open settings and press <kbd>Tab</kbd> or <kbd>Shift</kbd> + <kbd>Tab</kbd>. The readout follows you. Press <kbd>Esc</kbd> and watch where you land.</p>
</div>
<div class="lab-panel" id="focus-demo">
<button class="button" id="open-demo" type="button" aria-haspopup="dialog">Open settings</button>
<p class="focus-readout">Focus <output id="focus-output" aria-live="off">outside the demo</output></p>
<dialog id="settings-dialog" aria-labelledby="settings-title">
<form method="dialog">
<h4 id="settings-title">Preview settings</h4><ol class="focus-steps" aria-label="Focus order"><li data-step="Show outlines">Outlines</li><li data-step="Use larger type">Text size</li><li data-step="Close settings">Close</li></ol>
<label><input type="checkbox" data-focus="Show outlines" autofocus> Show outlines</label>
<label><input type="checkbox" data-focus="Use larger type"> Use larger type</label>
<button type="submit" data-focus="Close settings">Close settings</button>
<p class="focus-readout">Focus <output id="dialog-output" aria-live="off">Show outlines</output></p>
</form>
</dialog>
</div>
</section>
<section class="lab contrast-lab" aria-labelledby="contrast-title">
<div>
<p class="eyebrow">Interactive accessibility demo</p>
<div class="contrast-art" aria-hidden="true"><span>Aa</span><span>Aa</span><span>Aa</span></div>
<h3 id="contrast-title">Can you read this?</h3>
<p>Try a muted color, then turn up the contrast. The sample stays the same. The ratio tells you whether it meets the WCAG AA threshold for regular-size text.</p>
</div>
<div class="lab-panel">
<label for="contrast-level">Text darkness</label>
<input id="contrast-level" type="range" min="0" max="100" value="42">
<p class="contrast-sample" id="contrast-sample">Good design is for everyone.</p>
<p class="focus-readout"><output id="contrast-result" for="contrast-level"></output></p>
</div>
</section>
</div>
<section class="pen-example" aria-labelledby="switchback-title">
<h3 id="switchback-title"><span aria-hidden="true">🧭</span> Switchback</h3>
<p>Pick a stop on a bike-to-cabin trail and see how a control can show its state with shape, words, and color.</p>
<p class="pen-links"><a href="trail.html">Standalone demo</a><a href="https://codepen.io/nolawi/pen/LEyJxMZ">View on CodePen</a></p>
<iframe class="saved-pen" title="Switchback trail picker" src="trail.html?embed=1" width="800" height="450" loading="lazy"></iframe>
</section>
</section>`;
