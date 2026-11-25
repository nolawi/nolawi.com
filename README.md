# nolawi.com

Personal portfolio and résumé for Nolawi Petros, hosted with GitHub Pages.

- [Live preview](https://nolawi.github.io/nolawi.com/)
- [Launch checklist](https://github.com/nolawi/nolawi.com/issues/1)

## Local preview

Run `python3 -m http.server 8000` in this directory and open `http://localhost:8000`.

GitHub Pages serves the root of `main`. The homepage, résumé, and writing archive are static HTML. To add an original post, create a page with `site.css` and add it to `writing.html`. The site currently links to the three published Medium articles.

## Launch

The preview pages carry `noindex`. Keep it until the final domain is serving the reviewed site over HTTPS, then update the page metadata, add a sitemap, and verify the domain in Google Search Console.
