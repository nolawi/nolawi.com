import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { escape, published, readContent, renderBody, renderList, tags } from './content.js';

const root = new URL('../', import.meta.url);
const defaultSite = 'https://nolawi.github.io/nolawi.com/';
const siteUrl = new URL(process.env.SITE_URL || defaultSite);
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
const indexable = process.env.SITE_INDEXABLE === '1' && Boolean(process.env.SITE_URL);
const analyticsToken = indexable ? process.env.SITE_ANALYTICS_TOKEN : undefined;
const analytics = analyticsToken && /^[a-zA-Z0-9_-]+$/.test(analyticsToken)
  ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="${escape(JSON.stringify({ token: analyticsToken }))}"></script>`
  : '';
const absolute = path => new URL(path, siteUrl).href;
const at = path => new URL(path, root);
const legacy = ['ai-component.html', 'ai-checkable-answers.html'];

function page(title, description, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="description" content="${escape(description)}">
<title>${escape(title)} | Nolawi Petros</title>
<script type="module" src="/src/main.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<!-- site-header -->
<main id="main" class="subpage wrap section">${body}</main>
<footer class="wrap footer"><a href="./">Portfolio home</a><a href="writing.html">Writing</a></footer>
</body></html>`;
}

export function generatePages(data = readContent()) {
  const entries = published(data);
  const pages = new Map();
  for (const a of entries.filter(item => item.path)) {
    const schema = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: a.title,
      description: a.description, datePublished: a.date,
      author: { '@type': 'Person', name: 'Nolawi Petros', url: absolute('about.html') },
      mainEntityOfPage: absolute(a.path)
    }).replaceAll('<', '\\u003c');
    pages.set(a.path, page(a.title, a.description,
      `<h1>${escape(a.title)}</h1>${tags(a, data.topics)}
<p>By Nolawi Petros${a.date ? ` · <time datetime="${a.date}">${a.date}</time>` : ''}</p>
<div class="prose">${renderBody(a.body)}</div>
<script type="application/ld+json">${schema}</script>`));
  }
  for (const t of data.topics) {
    const related = entries.filter(a => a.topics.includes(t.id));
    if (related.length) pages.set(`topic-${t.id}.html`, page(t.label, `Writing about ${t.label} by Nolawi Petros.`,
      `<h1>${escape(t.label)}</h1>${renderList(related, data.topics)}`));
  }
  const generated = readdirSync(root).filter(file => legacy.includes(file) ||
    /^(essay|topic)-[a-z0-9-]+\.html$/.test(file));
  for (const file of generated) if (!pages.has(file)) unlinkSync(at(file));
  for (const [file, html] of pages) {
    if (!generated.includes(file) || readFileSync(at(file), 'utf8') !== html) writeFileSync(at(file), html);
  }
  mkdirSync(at('public/'), { recursive: true });
  const items = entries.filter(a => a.path).map(a =>
    `<item><title>${escape(a.title)}</title><link>${escape(absolute(a.path))}</link><guid>${escape(absolute(a.path))}</guid><description>${escape(a.description)}</description>${a.date ? `<pubDate>${new Date(a.date).toUTCString()}</pubDate>` : ''}</item>`).join('');
  writeFileSync(at('public/feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Nolawi · Writing</title><link>${escape(absolute('writing.html'))}</link><description>Essays by Nolawi Petros</description>${items}</channel></rss>\n`);
  const routes = ['', 'writing.html', 'about.html', 'resume.html', 'delano.html', 'trail.html', ...pages.keys()];
  writeFileSync(at('public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escape(absolute(route))}</loc></url>`).join('')}</urlset>\n`);
}

export function injectPublishing(html, filename) {
  const data = readContent();
  const entries = published(data);
  const home = filename === 'index.html';
  const list = home ? [...entries.filter(a => a.featured), ...entries.filter(a => !a.featured && a.path), ...entries.filter(a => !a.featured && !a.path)].slice(0, 5) : entries;
  const activeTopics = data.topics.filter(t => entries.some(a => a.topics.includes(t.id)));
  const topics = '<nav class="content-tags" aria-label="Writing topics">' + activeTopics.map(t =>
    `<a href="topic-${t.id}.html">${escape(t.label)}</a>`).join('') + '</nav>';
  const social = '<ul class="social-highlights" aria-label="Selected posts">' +
    [...data.socialPosts].sort((a, b) => b.date.localeCompare(a.date)).map(post =>
      `<li><a href="${escape(post.url)}">${escape(post.title)}</a><time datetime="${post.date}">${post.date}</time></li>`).join('') + '</ul>';
  return html.replace('<!-- writing-list -->', () => topics + renderList(list, data.topics))
    .replace('<!-- social-posts -->', () => social)
    .replace(/<meta name="robots" content="noindex">/, () => `<meta name="robots" content="${indexable ? 'index,follow' : 'noindex'}">`)
    .replace('</head>', () => `<link rel="canonical" href="${escape(absolute(home ? '' : filename))}">
<link rel="alternate" type="application/rss+xml" title="Nolawi · Writing" href="./feed.xml">
${analytics}
</head>`);
}
