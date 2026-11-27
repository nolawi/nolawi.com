export const atomicDesignDemo = `<section class="system-card atomic-demo" id="atomic-demo" aria-labelledby="atomic-demo-title">
<h2 id="atomic-demo-title">Build a component directory</h2>
<p class="atomic-reference">The three assembly steps use <a href="https://atomicdesign.bradfrost.com/chapter-2/">Brad Frost’s Atomic Design</a> framework. <a href="https://github.com/nolawi/delano/blob/master/src/app/%40theme/components/search-input/search-input.component.ts">Delano’s search input</a> groups a search icon with a field and emits the query. The directory below uses that same idea of composing a reusable search control.</p>
<fieldset data-atomic-stages hidden>
  <legend>Show assembly step</legend>
  <label><input type="radio" name="stage" value="atoms" checked> Atoms</label>
  <label><input type="radio" name="stage" value="molecule"> Molecule</label>
  <label><input type="radio" name="stage" value="organism"> Organism</label>
</fieldset>
<div class="atomic-step-controls" data-atomic-navigation hidden>
<output data-stage-count>Step 1 of 3</output>
<button class="outline" type="button" data-atomic-next>Next step</button>
</div>
<p data-atomic-description role="status">A label, text field, and button start as separate pieces.</p>
<div class="atomic-preview" data-atomic-preview data-stage="atoms">
  <p class="atomic-added" data-atomic-added>Separate pieces</p>
  <form class="atomic-filter" role="search" aria-label="Component directory">
    <label for="atomic-query"><span class="atomic-part" aria-hidden="true">1</span> Find a component</label>
    <div class="atomic-input"><span class="atomic-part" aria-hidden="true">2</span><input id="atomic-query" name="query" type="search" readonly></div>
    <button class="outline" type="submit" disabled><span class="atomic-part" aria-hidden="true">3</span> Filter</button>
  </form>
  <div data-atomic-results hidden>
    <h3>Directory results</h3>
    <p>Try “alert” or clear the field and filter again to see all components.</p>
    <ul><li>Button</li><li>Search field</li><li>Alert</li></ul>
    <p class="demo-status" role="status"></p>
  </div>
</div>
</section>`;
