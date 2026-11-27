# nolawi.com

Personal portfolio and résumé for Nolawi Petros, hosted with GitHub Pages.

- [Live preview](https://nolawi.github.io/nolawi.com/)
- [Launch checklist](https://github.com/nolawi/nolawi.com/issues/1)

## Publishing preview

Run `npm ci`, `npm run build`, then `npm run cms`. Open http://127.0.0.1:4175. The editor is loopback-only and is excluded from the public build.

- Write an essay in Markdown, choose topics, and preview it. Save Draft keeps it out of generated pages and RSS.
- Publish to Local Preview generates the article, topic pages, homepage listings, archive, RSS, and sitemap. Open Portfolio Preview to review the result.
- Open Component Catalog to check shared buttons, links, tags, cards, and dialogs with different colors or text sizes.
- Add a confirmed @nolawi permalink under Featured X Posts to show it in the portfolio.
- Commit changes to `content/site.json` when ready to share. Keep private drafts on your machine because the repository is public.
- To add topics, update the taxonomy in `content/site.json`. Existing article slugs are locked in the editor so shared links remain valid.

Run `npm run dev` for frontend development or `npm run check` for tests. GitHub Actions builds both branches. Main publishes to Pages, and the publishing branch uploads a downloadable preview build. Previews use `noindex`. Set `SITE_URL` and `SITE_INDEXABLE=1` explicitly when the final domain is ready.

## App structure

- `src/header.js` renders the shared navigation and dark mode toggle at build time.
- `src/main.js` applies preferences, mounts the header toolbar, and loads interactive modules when their targets exist.
- `src/display-toolbar.js` connects quick header controls and the full settings dialog to the same state.
- `src/preferences.js` stores and validates display preferences. `src/themer.js` defines the default theme, palettes, type and size options. The site, theme demo, and component catalog use its generated tokens.
- `src/display-playground.js` and `src/records-explorer.js` are Vue components. The records explorer uses fictional data and deterministic local lookup in `src/records.js`. `site.js` contains the focus and contrast demos. The saved CodePen remains independent.

## Before launch

Review the preview and agree on a hosted CMS if browser editing from another device is needed. Configure Search Console after the domain cutover. On an explicitly indexable build, providing `SITE_ANALYTICS_TOKEN` enables Cloudflare Web Analytics. Preview builds omit the tracker. The existing focus, contrast, and Vue demos are included in the preview build.

In the studio's Projects panel, save a draft or publish it to the local preview. Published projects appear in the archive and homepage. Featured projects get larger cards. Add a Markdown story to generate a project page. Delano keeps its existing page address. Preview updates stay local until the source changes go through the GitHub publishing workflow.

## Astro publishing prototype

The AI chat feature has a local Astro preview at its existing `/ai-component.html` route. The preview reads the [Markdown entry](prototype/content/ai-component.md), validates its frontmatter at build time, and renders it with a reusable layout. The production editor and publish workflow still use `content/site.json` for the live feature, listings, RSS, and sitemap. For the prototype, edit the Markdown entry and rebuild the preview.

Use Node 22.23.4 or newer and run these commands from the repository root.

```sh
npm ci
npm --prefix prototype ci
node scripts/build-astro-preview.mjs
npm run preview -- --outDir dist-astro --host 127.0.0.1 --port 4193
```

Open `http://127.0.0.1:4193/ai-component.html`. The build overlays one Astro page and its assets on a separate copy of the site. It uses the existing theme tokens, header controls, CodePen embed renderer, and metadata settings. The local preview stays out of search indexing and omits analytics by default.
