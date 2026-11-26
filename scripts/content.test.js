import assert from 'node:assert/strict';
import { test } from 'node:test';
import { published, readContent, renderBody, tags, validate } from './content.js';

test('drafts stay out of published listings and old essay URLs are preserved', () => {
  const data = readContent();
  data.articles.push({ ...data.articles[0], status: 'draft' });
  assert.ok(published(data).every(article => article.status === 'published'));
  assert.ok(published(data).some(article => article.path === 'ai-component.html'));
  assert.ok(published(data).some(article => article.path === 'ai-checkable-answers.html'));
});

test('tags distinguish publication, access and topic', () => {
  const data = readContent();
  const article = data.articles.find(item => item.access === 'Members only');
  const html = tags(article, data.topics);
  assert.match(html, /<span>Medium<\/span>/);
  assert.match(html, /<span>Members only<\/span>/);
  assert.match(html, /href="topic-accessibility.html"/);
});

test('invalid routes are rejected and raw HTML is escaped', () => {
  const data = readContent();
  data.articles[0].path = '../index.html';
  assert.throws(() => validate(data), /article path/);
  assert.match(renderBody('<script>alert(1)</script>'), /&lt;script&gt;/);
});
