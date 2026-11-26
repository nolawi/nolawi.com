# nolawi.com

Personal portfolio and résumé for Nolawi Petros, hosted with GitHub Pages.

- [Live preview](https://nolawi.github.io/nolawi.com/)
- [Launch checklist](https://github.com/nolawi/nolawi.com/issues/1)

## Publishing preview

Run `npm ci`, `npm run build`, then `npm run cms`. Open http://127.0.0.1:4175. The editor is loopback-only and is excluded from the public build.

- Write an essay in Markdown, choose topics, and preview it. Save Draft keeps it out of generated pages and RSS.
- Publish to Local Preview generates the article, topic pages, homepage listings, archive, RSS, and sitemap. Open Portfolio Preview to review the result.
- Add a confirmed @nolawi permalink under Featured X Posts to show it in the portfolio.
- Commit changes to `content/site.json` when ready to share. Keep private drafts on your machine because the repository is public.
- To add topics, update the taxonomy in `content/site.json`. Existing article slugs are locked in the editor so shared links remain valid.

Run `npm run dev` for frontend development or `npm run check` for tests. GitHub Actions builds both branches. Main publishes to Pages, and the publishing branch uploads a downloadable preview build. Previews use `noindex`. Set `SITE_URL` and `SITE_INDEXABLE=1` explicitly when the final domain is ready.

## App structure

- `src/header.js` renders the shared navigation and dark mode toggle at build time.
- `src/main.js` applies preferences, mounts the header toolbar, and loads interactive modules when their targets exist.
- `src/display-toolbar.js` connects quick header controls and the full settings dialog to the same state.
- `src/preferences.js` stores and validates display preferences. `themes.css` defines color tokens, backgrounds, and text-size steps.
- `src/display-playground.js` and `src/records-explorer.js` are Vue components. The records explorer uses fictional data and deterministic local lookup in `src/records.js`. `site.js` contains the focus and contrast demos. The saved CodePen remains independent.

## Before launch

Review the preview and agree on a hosted CMS if browser editing from another device is needed. Configure Search Console after the domain cutover. On an explicitly indexable build, providing `SITE_ANALYTICS_TOKEN` enables Cloudflare Web Analytics. Preview builds omit the tracker. The existing focus, contrast, and Vue demos are included in the preview build.
