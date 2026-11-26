import { readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
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
      return injectPublishing(html, page).replace('<!-- site-header -->', renderHeader(page === 'index.html'));
    }
  }],
  build: {
    rollupOptions: {
      input: pages.map(page => fileURLToPath(new URL(page, import.meta.url)))
    }
  }
});
