# Portfolio backlog

## This release

- [x] Tighten heading spacing and review homepage and article typography.
- [x] Feature typography in the Design Systems theme playground.
- [x] Label the homepage group Featured posts and use an icon beside each distinct title.
- [x] Move About to the footer, revise the opening, and use the illustrated portrait.
- [x] Move the Accessibility post into the JSON-backed publishing studio. Keep its URL and existing demos.

## Demo polish

- [x] Improve the AI demo so visitors can quickly ask a question, read the answer, and open the source record.
- [x] Improve the accessibility demo with a clearer comparison and a specific task to try with the keyboard, at 200% text size, or with different contrast.
- [x] Improve the atomic design demo so it is easier to see which pieces carry forward into the filter and directory. Keep Delano and the Slides.com talk close by.
- [x] Review the demo enhancements on phone and desktop, including keyboard use, then publish that batch.

## Demo and homepage refinements

- [x] **Atomic Design first.** Make each assembly step visibly different while keeping reused parts recognizable. Show what gets added at each step, and connect the example to a real pattern in Delano.
- [x] **Text contrast.** Add a clearer before-and-after comparison with the ratio and regular-text pass threshold visible. Show how changing foreground and background colors affects the result.
- [x] **Typography.** Add a tracking control for spacing across all letters and a kerning comparison for individual letter pairs. Use the same sample to make the difference easy to see.
- [x] **Chat interface.** Keep one quick example on the homepage and add more paths to try in the full demo: find a record by ID, filter by region and status, see an empty result, and ask something the records cannot answer. Make the filters, source rows, and next action clear in each reply.
- [x] **Homepage accessibility.** Review the demo disclosures, skip link, keyboard order, focus visibility, and enlarged-text layout.
- [x] **Header on scroll.** Try a compact header that follows readers as they scroll. Check mobile, in-page jumps, and keyboard focus so the header does not cover them.

## Standalone follow-ups

- [x] Review Cloudflare page views by path. Keep page-level tracking while the baseline grows, then reconsider demo interaction tracking if there is a concrete question to answer.
- [x] Design tokens. Add a short walkthrough to the Design Systems post showing how type, spacing, colors, and states flow from shared tokens into real components. Use the existing theme playground as the example.
- [ ] Share the chat interfaces update on X. Draft for review: “I’ve been tinkering with my portfolio for years. There’s always something new I want to try. This time it’s chat interfaces. I added a small demo where you can ask a question and open the record behind the answer. https://nolawi.com/ai-component.html”
- [x] Reillustrate the original About portrait in the homepage’s cartoon cutout style. Use the old LinkedIn photo as the likeness reference. Create a separate illustration in the homepage cutout style.

## Later

- [ ] Write about biking and being a bike messenger as a separate writing project. Medium is the likely home.
- [ ] Give typography a standalone feature when the playground has enough material to warrant one.
- [ ] Review the publishing architecture. Prototype Astro on one existing feature URL, with one Markdown entry per post, typed frontmatter, shared layouts and theme tokens, and client-side code loaded only for demos. Keep GitHub Pages and preserve existing URLs, redirects, metadata, and analytics. Keep Medium as the publishing home for regular articles and use the portfolio editor for original features. Keep article planning and editorial notes here. The README is for setup and maintenance.
- [ ] Explore a public Books page. Use an approved list from the Goodreads Read shelf or a library export. Reconcile finished Audible titles into that list after reviewing the available listening history or export. Deduplicate editions, preserve unknown dates, and publish only selected titles. Check whether a public Goodreads shelf feed is usable before automating refreshes. Avoid depending on a Goodreads developer key or linking private account data to the public site.
