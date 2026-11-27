import { readFileSync } from 'node:fs';
import MarkdownIt from 'markdown-it';

export const contentFile = new URL('../content/site.json', import.meta.url);
export const safeId = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
export const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const markdown = new MarkdownIt({ html: false, linkify: true });
const text = value => typeof value === 'string' && Boolean(value.trim());
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validate(data) {
  const topics = new Set();
  const ids = new Set();
  const paths = new Set();
  for (const topic of data.topics) {
    if (!safeId(topic.id) || !text(topic.label) || topics.has(topic.id)) throw new Error('Invalid or duplicate topic.');
    topics.add(topic.id);
  }
  for (const a of data.articles) {
    if (!safeId(a.id) || ids.has(a.id) || !text(a.title) || !text(a.format) ||
        !['draft', 'published'].includes(a.status) || !Array.isArray(a.topics) ||
        a.topics.some(id => !topics.has(id)) || new Set(a.topics).size !== a.topics.length ||
        (a.date && !date(a.date))) throw new Error('Check title, format, date, and topics.');
    ids.add(a.id);
    if (a.publication === 'Nolawi') {
      const allowed = ['ai-component.html', 'ai-checkable-answers.html', `essay-${a.id}.html`];
      if (!allowed.includes(a.path) || paths.has(a.path)) throw new Error('Invalid or duplicate article path.');
      paths.add(a.path);
      if (a.status === 'published' && (!text(a.body) || !text(a.description) || !a.topics.length)) {
        throw new Error('Published articles need a body, summary, and at least one topic.');
      }
    } else if (a.publication !== 'Medium' || !/^https:\/\/medium\.com\//.test(a.url)) {
      throw new Error('External articles need a Medium URL.');
    }
  }
  const projects = new Set();
  for (const project of data.projects) {
    if (!safeId(project.id) || projects.has(project.id) || !text(project.title) ||
        !['draft', 'published'].includes(project.status) ||
        !['', 'delano', 'uswds'].includes(project.art) ||
        !Array.isArray(project.links) || project.links.some(link => !text(link.label) || !httpsUrl(link.url)) ||
        (project.body != null && typeof project.body !== 'string') ||
        (project.status === 'published' && (!text(project.summary) || !text(project.context)))) {
      throw new Error('Check project title, context, summary, and HTTPS links.');
    }
    if (project.id === 'delano' && project.status === 'published' && !text(project.body)) {
      throw new Error('Delano needs a project story to preserve its shared URL.');
    }
    projects.add(project.id);
  }
  for (const post of data.socialPosts) {
    if (!/^https:\/\/x\.com\/nolawi\/status\/\d+$/.test(post.url) || !text(post.title) || !date(post.date)) {
      throw new Error('Invalid X post.');
    }
  }
  return data;
}
export const readContent = () => validate(JSON.parse(readFileSync(contentFile, 'utf8')));
export const published = data => data.articles.filter(a => a.status === 'published')
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
export function tags(article, topics) {
  const labels = [article.format, article.publication === 'Medium' && 'Medium', article.access].filter(Boolean);
  return '<ul class="content-tags" aria-label="Article tags">' +
    labels.map(label => `<li><span>${escape(label)}</span></li>`).join('') +
    article.topics.map(id => `<li><span>${escape(topics.find(topic => topic.id === id).label)}</span></li>`).join('') + '</ul>';
}
export function renderList(articles, topics, { descriptions = false } = {}) {
  return '<div class="articles">' + articles.map(article =>
    `<article>${article.date ? `<time datetime="${article.date}">${article.date}</time>` : ''}
<h3><a href="${escape(article.path || article.url)}">${escape(article.title)}</a></h3>
${descriptions && article.description ? `<p>${escape(article.description)}</p>` : ''}${tags(article, topics)}</article>`).join('\n') + '</div>';
}
export const renderBody = body => markdown.render(body || '');
