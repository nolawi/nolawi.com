import { createServer } from 'node:http';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderThemeCss } from '../src/themer.js';
import { contentFile, readContent, renderBody, safeId, validate } from './content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.CMS_PORT || 4175);
const host = `127.0.0.1:${port}`;
const origin = `http://${host}`;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.xml': 'application/xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
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

async function save(data) {
  const pending = new URL('site.json.pending', contentFile);
  await writeFile(pending, JSON.stringify(data, null, 2) + '\n');
  await rename(pending, contentFile);
}

function build() {
  return new Promise((resolveBuild, reject) => {
    const proc = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
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
  if (action === 'preview') return send(res, 200, { html: renderBody(input.body) });
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
    send(res, 200, { message: draft ? 'Draft saved.' : 'Published to local preview.', data });
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
    if (req.method === 'GET' && url.pathname === '/api/content') return send(res, 200, readContent());
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
