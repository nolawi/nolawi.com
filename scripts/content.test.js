import assert from 'node:assert/strict';
import { test } from 'node:test';
import { published, readContent, renderBody, renderFeatureBody, tags, validate } from './content.js';

test('drafts stay out of published listings and the chat essay appears once', () => {
  const data = readContent();
  data.articles.push({ ...data.articles[0], status: 'draft' });
  assert.ok(published(data).every(article => article.status === 'published'));
  const chat = published(data).filter(article => article.path === 'ai-component.html');
  assert.equal(chat.length, 1);
  assert.match(chat[0].demos[0].id, /^[A-Za-z0-9]+$/);
  assert.ok(chat[0].body.trim());
  const accessibility = published(data).find(article => article.path === 'accessibility.html');
  assert.equal(accessibility.demos.length, 2);
  assert.equal(published(data).find(article => article.id === 'atomic-design').path, 'essay-atomic-design.html');
  assert.ok(!published(data).some(article => article.path === 'ai-checkable-answers.html'));
});

test('tags distinguish publication, access and topic', () => {
  const data = readContent();
  const article = data.articles.find(item => item.access === 'Members only');
  const html = tags(article, data.topics);
  assert.match(html, /<span>Medium<\/span>/);
  assert.match(html, /<span>Members only<\/span>/);
  assert.match(html, /<span>Accessibility<\/span>/);
  assert.doesNotMatch(html, /<a\s/);
});

test('invalid routes are rejected and raw HTML is escaped', () => {
  const data = readContent();
  data.articles[0].path = '../index.html';
  assert.throws(() => validate(data), /article path/);
  assert.match(renderBody('<script>alert(1)</script>'), /&lt;script&gt;/);
});

test('registered feature figures render only as standalone Markdown markers', () => {
  const html = renderFeatureBody('[[illustration:a11y-focus]]');
  assert.match(html, /data-figure="a11y-focus"/);
  assert.match(html, /<figcaption>/);
  assert.doesNotMatch(renderFeatureBody('```text\n[[illustration:a11y-focus]]\n```'), /<figure/);
  assert.doesNotMatch(renderFeatureBody('<script>alert(1)</script>'), /<script>/);
});
