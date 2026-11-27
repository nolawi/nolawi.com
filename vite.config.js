import { readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { renderThemeCss } from './src/themer.js';
import { renderHeader } from './src/header.js';

import { generatePages, injectPublishing } from './scripts/publishing.js';

generatePages();
const pages = readdirSync(new URL('./', import.meta.url)).filter(file => file.endsWith('.html'));

export default defineConfig({
  base: './',
  plugins: [{
    name: 'portfolio-header',
    transformIndexHtml(html, { filename }) {
      const page = basename(filename);
      return {
        html: injectPublishing(html, page).replace('<!-- site-header -->', renderHeader(page === 'index.html')),
        tags: [{ tag: 'style', children: renderThemeCss(), injectTo: 'head' }]
      };
    }
  }],
  build: {
    rollupOptions: {
      input: pages.map(page => fileURLToPath(new URL(page, import.meta.url)))
    }
  }
});
