import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { escape, published, readContent, renderBody, renderList, tags, validate } from './content.js';

import { projectArt } from './project-art.js';
import { renderGitHubActivity } from './github-activity.js';

function codePen(id, title, height) {
  const profile = 'https://codepen.io/nolawi';
  return `<div class="codepen-demo">
<p><a href="${profile}/full/${id}">Open ${escape(title)} on CodePen</a></p>
<iframe title="${escape(title)} interactive demo on CodePen" src="${profile}/embed/${id}?default-tab=result" loading="lazy" width="960" height="${height}"></iframe>
</div>`;
}

const recordsDemo = codePen('ogWQBPv', 'Records Explorer', 760);
const accessibilityPen = codePen('emWQWzZ', 'Accessibility playground', 740);
const designPen = codePen('dPWQWXJ', 'Design systems playground', 790);
const accessibilityPlayground = `<section class="accessibility-playground" aria-labelledby="lab-title">
<h2 id="lab-title">Accessibility playground</h2>
<p>Try reading settings, tap targets, keyboard focus, or the contrast checker.</p>
${accessibilityPen}
<section aria-labelledby="switchback-title" class="pen-example">
<h3 id="switchback-title">Switchback</h3>
<p>Pick a trail stop by mouse or keyboard. Look for the shape, label, and color that show which stop is selected.</p>
${codePen('LEyJxMZ', 'Switchback', 540)}
<p><a href="trail.html">Switchback on nolawi.com</a></p>
</section>
</section>`;

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
const mediumStoryId = url => url?.match(/-([0-9a-f]{12})\/?(?:[?#]|$)/)?.[1];

function readPublishingContent() {
  const data = readContent();
  let snapshot;
  try {
    snapshot = readFileSync(at('content/medium-feed.json'), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return data;
    throw error;
  }
  const curatedIds = new Set(data.articles.map(article => mediumStoryId(article.url)).filter(Boolean));
  const feedArticles = JSON.parse(snapshot);
  return validate({ ...data, articles: [...data.articles,
    ...feedArticles.filter(article => !curatedIds.has(mediumStoryId(article.url)))] });
}

const legacy = ['accessibility.html', 'ai-component.html', 'ai-checkable-answers.html', 'delano.html', 'projects.html'];

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
<footer class="wrap footer"><a href="./">Portfolio home</a><a href="writing.html">Writing</a><a href="about.html">About</a></footer>
</body></html>`;
}

const projectPath = project => project.id === 'delano' ? 'delano.html' : `project-${project.id}.html`;
const liveProjects = data => data.projects.filter(project => project.status === 'published');

function projectLinks(project, includeStory) {
  const story = includeStory && project.body?.trim()
    ? `<a class="button" href="${projectPath(project)}">Read the project story</a>` : '';
  return story || project.links.length
    ? `<div class="links">${story}${project.links.map(link => `<a href="${escape(link.url)}">${escape(link.label)}</a>`).join('')}</div>` : '';
}

function projectCards(projects) {
  const card = project => `<article${project.featured ? ' class="system-card"' : ''}>
${project.featured ? projectArt[project.art] || '' : ''}<p class="eyebrow">${escape(project.context)}</p>
<h3>${escape(project.title)}</h3><p>${escape(project.summary)}</p>${projectLinks(project, true)}</article>`;
  const featured = projects.filter(project => project.featured).map(card).join('');
  const other = projects.filter(project => !project.featured).map(card).join('');
  return (featured ? `<div class="systems-grid">${featured}</div>` : '') +
    (other ? `<div class="project-grid">${other}</div>` : '');
}

export function generatePages(data = readPublishingContent()) {
  const entries = published(data);
  const pages = new Map();
  const projects = liveProjects(data);
  const selectedDesignProjects = projects.filter(project => ['delano', 'uswds', 'ngkit'].includes(project.id));
  for (const a of entries.filter(item => item.path)) {
    const closing = a.afterDemo?.trim() ? `<div class="prose post-close">${renderBody(a.afterDemo)}</div>` : '';
    const schema = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: a.title,
      description: a.description, datePublished: a.date,
      author: { '@type': 'Person', name: 'Nolawi Petros', url: absolute('about.html') },
      mainEntityOfPage: absolute(a.path)
    }).replaceAll('<', '\\u003c');
    pages.set(a.path, page(a.title, a.description,
      `<h1>${escape(a.title)}</h1>${tags(a, data.topics)}
${a.date ? `<p><time datetime="${a.date}">${a.date}</time></p>` : ''}
<div class="prose">${renderBody(a.body)}</div>
${a.id === 'ai-component' ? recordsDemo : ''}
${a.id === 'accessibility' ? accessibilityPlayground : ''}
${a.id === 'atomic-design' ? designPen : ''}
${closing}
${a.id === 'atomic-design' ? `<section aria-labelledby="design-projects-title" id="selected-projects">
<h2 id="design-projects-title">Selected projects</h2>
${projectCards(selectedDesignProjects)}
<p><a href="projects.html">All projects</a></p>
</section>` : ''}
<script type="application/ld+json">${schema}</script>`));
  }
  const oldChatPath = 'ai-checkable-answers.html';
  if (pages.has('ai-component.html') && !pages.has(oldChatPath)) {
    pages.set(oldChatPath, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=ai-component.html">
<title>When your app gets a chat interface</title></head>
<body><p><a href="ai-component.html">Continue to the article and demo</a></p></body></html>`);
  }
  for (const t of data.topics) {
    const related = entries.filter(a => a.topics.includes(t.id));
    if (related.length) pages.set(`topic-${t.id}.html`, page(t.label, `Writing about ${t.label} by Nolawi Petros.`,
      `<h1>${escape(t.label)}</h1>${renderList(related, data.topics)}`));
  }
  pages.set('projects.html', page('Selected projects', 'Design systems, open source, and accessibility projects by Nolawi Petros.',
    `<h1>Selected projects</h1>${projectCards(projects)}`));
  for (const project of projects.filter(item => item.body?.trim())) {
    pages.set(projectPath(project), page(project.title, project.summary,
      `<p class="eyebrow">${escape(project.context)}</p><h1>${escape(project.title)}</h1>
<p class="intro">${escape(project.summary)}</p>${projectLinks(project, false)}
<div class="prose">${renderBody(project.body)}</div><a href="projects.html">All projects</a>`));
  }
  const generated = readdirSync(root).filter(file => legacy.includes(file) ||
    /^(essay|topic|project)-[a-z0-9-]+\.html$/.test(file));
  for (const file of generated) if (!pages.has(file)) unlinkSync(at(file));
  for (const [file, html] of pages) {
    if (!generated.includes(file) || readFileSync(at(file), 'utf8') !== html) writeFileSync(at(file), html);
  }
  mkdirSync(at('public/'), { recursive: true });
  const items = entries.filter(a => a.path).map(a =>
    `<item><title>${escape(a.title)}</title><link>${escape(absolute(a.path))}</link><guid>${escape(absolute(a.path))}</guid><description>${escape(a.description)}</description>${a.date ? `<pubDate>${new Date(a.date).toUTCString()}</pubDate>` : ''}</item>`).join('');
  writeFileSync(at('public/feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Nolawi · Writing</title><link>${escape(absolute('writing.html'))}</link><description>Essays by Nolawi Petros</description>${items}</channel></rss>\n`);
  const routes = ['', 'writing.html', 'about.html', 'resume.html', 'trail.html', ...Array.from(pages.keys()).filter(path => path !== oldChatPath || entries.some(article => article.path === oldChatPath))];
  writeFileSync(at('public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escape(absolute(route))}</loc></url>`).join('')}</urlset>\n`);
}

export function injectPublishing(html, filename) {
  const data = readPublishingContent();
  const entries = published(data);
  if (filename === 'ai-checkable-answers.html' && /http-equiv="refresh"/.test(html)) {
    return html.replace('</head>', `<link rel="canonical" href="${escape(absolute('ai-component.html'))}"></head>`);
  }
  const home = filename === 'index.html';
  const list = home ? entries.filter(article => article.publication === 'Medium').slice(0, 5) : entries;
  const social = '<ul class="social-highlights" aria-label="Selected posts">' +
    [...data.socialPosts].sort((a, b) => b.date.localeCompare(a.date)).map(post =>
      `<li><a href="${escape(post.url)}">${escape(post.title)}</a><time datetime="${post.date}">${post.date}</time></li>`).join('') + '</ul>';
  return html.replace('<!-- writing-list -->', () => renderList(list, data.topics))
    .replace('<!-- records-demo -->', () => recordsDemo)
    .replace('<!-- accessibility-demo -->', () => accessibilityPen)
    .replace('<!-- design-demo -->', () => designPen)
    .replace('<!-- feature-list -->', () => renderList(entries.filter(article => article.path), data.topics, { descriptions: true }))
    .replace('<!-- medium-list -->', () => renderList(entries.filter(article => article.publication === 'Medium'), data.topics))
    .replace('<!-- github-activity -->', () => renderGitHubActivity())
    .replace('<!-- social-posts -->', () => social)
    .replace(/<meta name="robots" content="noindex">/, () => `<meta name="robots" content="${indexable ? 'index,follow' : 'noindex'}">`)
    .replace('</head>', () => `<link rel="canonical" href="${escape(absolute(home ? '' : filename))}">
<link rel="alternate" type="application/rss+xml" title="Nolawi · Writing" href="./feed.xml">
${analytics}
</head>`);
}
