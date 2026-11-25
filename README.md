# nolawi.com

Personal portfolio and résumé for Nolawi Petros, hosted with GitHub Pages.

- [Live preview](https://nolawi.github.io/nolawi.com/)
- [Launch checklist](https://github.com/nolawi/nolawi.com/issues/1)

## Local preview

Run `python3 -m http.server 8000` in this directory and open `http://localhost:8000`.

GitHub Pages serves the root of `main`. The generated article lists are committed as HTML so visitors and crawlers can read them without JavaScript.

## Add an article

1. For an on-site article, use `ai-component.html` as a starting point and give the new page a title and description.
2. Add its title, URL, label, and optional ISO date to `articles.json`. Put the newest entries first. Use `"featured": true` for an article that should appear above the grid.
3. Run `python3 scripts/render-writing.py` and commit the updated homepage and archive alongside the article. Run the same command with `--check` to detect stale lists.

## Themes

`themes.css` holds shared color tokens and the Slate overrides. `site.css` styles components using those tokens. To add a palette, add a token override in `themes.css`, a value in `theme.js`, and the corresponding option to the page theme controls. Test text and focus contrast in both light and dark panels. The saved CodePen and its standalone counterpart are independent demos.

## Launch

The preview pages carry `noindex`. Keep it until the final domain is serving the reviewed site over HTTPS, then update the page metadata, add a sitemap, and verify the domain in Google Search Console.
