import { readFileSync } from 'node:fs';
import { parse, stringify } from 'yaml';

export const markdownFeatures = Object.freeze({
  'ai-component': 1,
  accessibility: 2,
  'atomic-design': 1
});
export const isMarkdownFeature = id => Object.hasOwn(markdownFeatures, id);
export const featurePath = id => id === 'atomic-design' ? 'essay-atomic-design.html' : `${id}.html`;
export const featureFile = id => new URL(`../prototype/content/${id}.md`, import.meta.url);
export const featureDraftFile = id => new URL(`../prototype/content/${id}.draft.json`, import.meta.url);

export function readFeature(id) {
  const raw = readFileSync(featureFile(id), 'utf8');
  const document = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!document) throw new Error(`The ${id} feature needs Markdown frontmatter.`);
  const article = {
    ...parse(document[1]),
    id,
    path: featurePath(id),
    publication: 'Nolawi',
    status: 'published',
    body: document[2].trim()
  };
  validateDemos(id, article.demos);
  return article;
}

export function validateDemos(id, demos) {
  if (!Array.isArray(demos) || demos.length !== markdownFeatures[id] ||
      demos.some(demo => !demo || typeof demo.id !== 'string' || !/^[A-Za-z0-9]+$/.test(demo.id) ||
        typeof demo.title !== 'string' || !demo.title.trim() ||
        !Number.isInteger(demo.height) || demo.height <= 0)) {
    throw new Error(`Enter a CodePen ID, title, and positive height for each of the ${markdownFeatures[id]} demo slots.`);
  }
}

export function serializeFeature({ id, title, description, format, topics, date, featured, demos, afterDemo, body }) {
  validateDemos(id, demos);
  const frontmatter = { title, description, format, topics, ...(date ? { date } : {}), featured, demos, afterDemo };
  return `---\n${stringify(frontmatter)}---\n\n${body.trim()}\n`;
}
