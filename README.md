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

The [AI chat feature](prototype/content/ai-component.md), [Accessibility feature](prototype/content/accessibility.md), and [Design Systems feature](prototype/content/atomic-design.md) each use one Markdown entry for their page, CodePen settings, Writing listing, topic pages, and RSS. The local studio can edit each entry and its CodePen IDs, titles, and embed heights. Save Draft creates an ignored local draft. Preview Draft shows the copy and direct links to the selected Pens. Publish to Local Preview updates the Markdown and rebuilds the portfolio. Commit the Markdown file when the content is ready to share.

Use Node 22.23.4 or newer and run the following from the repository root on the Astro branch.

```sh
npm ci
npm --prefix prototype ci
node scripts/build-astro-preview.mjs --cms
npm run cms
```

Open `http://127.0.0.1:4175/` for the studio and `http://127.0.0.1:4175/preview/ai-component.html` for the rendered feature. For a standalone preview, run `node scripts/build-astro-preview.mjs` and then `npm run preview -- --outDir dist-astro --host 127.0.0.1 --port 4193`.

Astro renders the three features in the preview. The existing Vite generator also reads the Markdown for the current GitHub Pages build. Medium still syncs from its own feed. The Astro branch gives us a place to review the publishing workflow before merging it.

## Goodreads Books page

The Pages workflow refreshes Nolawi’s Goodreads Read shelf during its existing build and schedule. It tries Goodreads RSS, then uses the public shelf widget when RSS is unavailable. Run `python3 scripts/sync-goodreads.py` and rebuild to refresh the local preview. The generated snapshot contains titles, authors, and Goodreads links and is ignored by Git. An indexable build includes the Books page only when the sync supplies entries. Set `GOODREADS_USER_ID` to override the default profile for a different installation.

## Theme layout check

Run `npx playwright-core install chromium` once, then `npm run check:theme-layout`. Set `CHROME_BIN` to use an installed Chrome or Chromium executable. The check builds the site in a temporary directory and verifies wrapping at phone, landscape, tablet, and desktop sizes through 140% text.
