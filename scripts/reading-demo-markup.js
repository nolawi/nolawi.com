export const readingDemo = `<section class="system-card reading-demo" id="reading-demo" aria-labelledby="reading-demo-title">
<div>
<h3 id="reading-demo-title">What makes text easier to read?</h3>
<p>Try a bigger size, a different font, or stronger contrast. The controls change the sample here.</p>
<form class="demo-controls" data-reading-controls hidden>
<label>Text size <select name="size"><option value="1">100%</option><option value="1.25">125%</option><option value="1.5">150%</option><option value="2">200%</option></select></label>
<label>Font <select name="font"><option value="sans">Sans serif</option><option value="serif">Serif</option><option value="mono">Monospace</option></select></label>
<label>Contrast <select name="contrast"><option value="standard">Standard · 13.38:1</option><option value="low">Low · 4.16:1</option><option value="high">High · 18.88:1</option></select></label>
<button class="outline" type="reset">Reset sample</button>
</form>
<p class="demo-status" data-reading-status role="status"></p>
<p class="reading-note">For regular text, WCAG AA calls for at least 4.5:1 contrast.</p>
</div>
<div class="reading-sample" data-reading-sample>
<p><strong>A morning at my cabin</strong></p>
<p>I take the dog out first. Then I grab a cup of coffee and see what needs fixing.</p>
</div>
</section>`;
