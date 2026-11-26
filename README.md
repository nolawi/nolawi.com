# nolawi.com

Personal portfolio and résumé for Nolawi Petros, hosted with GitHub Pages.

- [Live preview](https://nolawi.github.io/nolawi.com/)
- [Launch checklist](https://github.com/nolawi/nolawi.com/issues/1)

## Development

Run `npm ci`, then `npm run dev`. Vite serves the HTML routes and shares the header and app entry point. Run `npm run check` for the generated writing and preference checks. Use `npm run build` to create `dist/`, then `npm run preview` to inspect that build.

GitHub Actions builds and publishes `dist/` to GitHub Pages. Article lists are committed as HTML so they remain readable without JavaScript.

## Add an article

1. For an on-site article, use `ai-component.html` as a starting point and give the new page a title and description.
2. Add its title, URL, label, and optional ISO date to `articles.json`. Put the newest entries first. Use `"featured": true` for an article that should appear above the grid.
3. Run `python3 scripts/render-writing.py` and commit the updated homepage and archive alongside the article. Run the same command with `--check` to detect stale lists.

## App structure

- `src/header.js` renders the shared navigation and dark mode toggle at build time.
- `src/main.js` applies preferences, handles the header toggle, and loads interactive modules when their targets exist.
- `src/preferences.js` stores and validates display preferences. `themes.css` defines color tokens, backgrounds, and text-size steps.
- `src/display-playground.js` and `src/records-explorer.js` are Vue components. The records explorer uses fictional data and deterministic local lookup in `src/records.js`. `site.js` contains the focus and contrast demos. The saved CodePen remains independent.

## Launch

The preview pages carry `noindex`. Keep it until the final domain is serving the reviewed site over HTTPS, then update the page metadata, add a sitemap, and verify the domain in Google Search Console.
