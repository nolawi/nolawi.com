import { createServer } from 'node:http';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderThemeCss } from '../src/themer.js';
import { contentFile, readContent, escape, renderBody, renderFeatureBody, safeId, validate } from './content.js';

import { markdownFeatures, isMarkdownFeature, featureFile, featureDraftFile, serializeFeature, validateDemos } from './markdown-feature.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.CMS_PORT || 4175);
const host = `127.0.0.1:${port}`;
const origin = `http://${host}`;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
let saving = false;

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200000) throw new Error('The submission is too large.');
  }
  return JSON.parse(raw);
}

async function writeAtomic(file, content) {
  const pending = new URL(file.href + '.pending');
  await writeFile(pending, content);
  await rename(pending, file);
}

function save(data) {
  const articles = data.articles.filter(article => !isMarkdownFeature(article.id));
  return writeAtomic(contentFile, JSON.stringify({ ...data, articles }, null, 2) + '\n');
}

async function editorContent(data = readContent()) {
  data.featureDrafts = {};
  for (const id of Object.keys(markdownFeatures)) {
    try {
      data.featureDrafts[id] = JSON.parse(await readFile(featureDraftFile(id), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return data;
}

function submittedDemos(input) {
  if (!Array.isArray(input.demos)) return [];
  return input.demos.map(demo => ({ id: demo?.id, title: demo?.title, height: Number(demo?.height) }));
}

function featureUpdate(input, old) {
  return {
    ...old, title: input.title, description: input.description, body: input.body,
    afterDemo: input.afterDemo ?? '', topics: input.topics, format: input.format,
    date: input.date || undefined, featured: Boolean(input.featured),
    demos: submittedDemos(input)
  };
}

async function saveFeature(data, index, article, draft) {
  data.articles[index] = article;
  validate(data);
  const markdown = serializeFeature(article);
  const file = featureFile(article.id);
  const draftFile = featureDraftFile(article.id);
  if (draft) {
    await writeAtomic(draftFile, JSON.stringify(article, null, 2) + '\n');
    return editorContent();
  }
  const original = await readFile(file);
  await writeAtomic(file, markdown);
  try {
    await build();
  } catch (error) {
    await writeAtomic(file, original);
    throw error;
  }
  await rm(draftFile, { force: true });
  return editorContent(data);
}

function build() {
  return new Promise((resolveBuild, reject) => {
    const proc = spawn(process.execPath, ['scripts/build-astro-preview.mjs', '--cms'], {
      cwd: root, stdio: 'inherit', env: { ...process.env, SITE_INDEXABLE: '0' }
    });
    proc.on('error', reject);
    proc.on('exit', code => code === 0 ? resolveBuild() : reject(new Error('Preview build failed. See the server output.')));
  });
}

async function update(req, res, action) {
  if (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json')) {
    return send(res, 403, { error: 'Open the editor using its local address.' });
  }
  const input = await body(req);
  if (action === 'preview') {
    const demos = isMarkdownFeature(input.id) ? submittedDemos(input) : [];
    if (isMarkdownFeature(input.id)) validateDemos(input.id, demos);
    const links = demos.map(demo =>
      `<p><a href="https://codepen.io/nolawi/full/${demo.id}" target="_blank" rel="noopener">Open ${escape(demo.title)} on CodePen</a></p>`
    ).join('');
    return send(res, 200, { html: renderFeatureBody(input.body) + links + renderBody(input.afterDemo) });
  }
  if (saving) return send(res, 409, { error: 'Another save is running. Try again shortly.' });

  saving = true;
  try {
    const data = readContent();
    const original = structuredClone(data);
    if (action === 'social') {
      const post = { title: input.title, url: input.url, date: input.date };
      data.socialPosts = [post, ...data.socialPosts.filter(item => item.url !== post.url)];
    } else if (action.startsWith('project-')) {
      if (!safeId(input.id)) throw new Error('Use a lowercase project slug with hyphens.');
      const index = data.projects.findIndex(project => project.id === input.id);
      const old = data.projects[index];
      if (old?.status === 'published' && action === 'project-draft') {
        throw new Error('This project is published. Publish an update to save your changes.');
      }
      if (old?.status === 'published' && old.body?.trim() && !input.body?.trim()) {
        throw new Error('Keep a project story to preserve its published page.');
      }
      const project = {
        id: input.id, title: input.title, context: input.context, summary: input.summary,
        body: input.body, art: input.art, links: input.links, featured: Boolean(input.featured),
        status: action === 'project-publish' ? 'published' : 'draft'
      };
      if (index >= 0) data.projects[index] = project;
      else data.projects.push(project);
    } else {
      if (!safeId(input.id)) throw new Error('Use a lowercase article slug with hyphens.');
      const index = data.articles.findIndex(a => a.id === input.id);
      const old = data.articles[index];
      if (old && isMarkdownFeature(old.id)) {
        const draft = action === 'draft';
        const result = await saveFeature(data, index, featureUpdate(input, old), draft);
        return send(res, 200, { message: draft ? 'Private draft saved.' : 'Published to local preview.', data: result });
      }
      if (old && old.publication !== 'Nolawi') throw new Error('This slug belongs to an external article.');
      if (old?.status === 'published' && action === 'draft') {
        throw new Error('This article is already published. Preview edits here before publishing an update.');
      }
      const article = {
        id: input.id, path: old?.path || `essay-${input.id}.html`, publication: 'Nolawi',
        title: input.title, description: input.description, body: input.body,
        afterDemo: input.afterDemo ?? old?.afterDemo,
        topics: input.topics, format: input.format, date: input.date || old?.date,
        status: action === 'publish' ? 'published' : 'draft',
        featured: Boolean(input.featured)
      };
      if (index >= 0) data.articles[index] = article;
      else data.articles.unshift(article);
    }
    validate(data);
    await save(data);
    const draft = action === 'draft' || action === 'project-draft';
    if (!draft) {
      try {
        await build();
      } catch (error) {
        await save(original);
        throw error;
      }
    }
    send(res, 200, { message: draft ? 'Draft saved.' : 'Published to local preview.', data: await editorContent(data) });
  } finally {
    saving = false;
  }
}

const server = createServer(async (req, res) => {
  if (req.headers.host !== host) return send(res, 403, { error: 'Use the local editor address.' });
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const url = new URL(req.url, origin);
    if (req.method === 'GET' && url.pathname === '/api/content') return send(res, 200, await editorContent());
    const action = /^\/api\/(draft|publish|preview|social|project-draft|project-publish)$/.exec(url.pathname)?.[1];
    if (req.method === 'POST' && action) return await update(req, res, action);
    if (req.method !== 'GET') return send(res, 405, { error: 'Unsupported method.' });

    if (url.pathname === '/tokens.css') {
      res.writeHead(200, { 'Content-Type': mime['.css'] });
      return res.end(renderThemeCss());
    }
    const routes = { '/': 'cms/index.html', '/editor.js': 'cms/editor.js', '/editor.css': 'cms/editor.css',
      '/components': 'cms/components.html', '/catalog.js': 'cms/catalog.js',
      '/components.css': 'site.css' };
    let file = routes[url.pathname];
    if (url.pathname.startsWith('/preview/')) {
      const base = resolve(root, 'dist');
      const target = resolve(base, url.pathname.slice('/preview/'.length) || 'index.html');
      if (!target.startsWith(base + sep)) return send(res, 404, { error: 'Page not found.' });
      file = target;
    }
    if (!file || !Object.hasOwn(mime, extname(file))) return send(res, 404, { error: 'Page not found.' });
    const data = await readFile(resolve(root, file));
    res.writeHead(200, { 'Content-Type': mime[extname(file)] });
    res.end(data);
  } catch (error) {
    send(res, error.code === 'ENOENT' ? 404 : 400, { error: error.code === 'ENOENT' ? 'Build the preview first.' : error.message });
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Portfolio editor: ${origin}/`));
