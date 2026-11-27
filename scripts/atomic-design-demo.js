export const atomicDesignDemo = `<section class="system-card atomic-demo" id="atomic-demo" aria-labelledby="atomic-demo-title">
<h2 id="atomic-demo-title">Build a component directory</h2>
<fieldset data-atomic-stages hidden>
  <legend>Show assembly step</legend>
  <label><input type="radio" name="stage" value="atoms" checked> Atoms</label>
  <label><input type="radio" name="stage" value="molecule"> Molecule</label>
  <label><input type="radio" name="stage" value="organism"> Organism</label>
</fieldset>
<p data-atomic-description role="status">A label, text field, and button start as separate pieces.</p>
<div class="atomic-preview" data-atomic-preview data-stage="atoms">
  <form class="atomic-filter" role="search" aria-label="Component directory">
    <label for="atomic-query">Find a component</label>
    <input id="atomic-query" name="query" type="search" readonly>
    <button class="outline" type="submit" disabled>Filter</button>
  </form>
  <div data-atomic-results hidden>
    <h3>Components</h3>
    <ul><li>Button</li><li>Search field</li><li>Alert</li></ul>
    <p class="demo-status" role="status"></p>
  </div>
</div>
</section>`;
