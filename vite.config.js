import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { renderHeader } from './src/header.js';

const pages = readdirSync(new URL('./', import.meta.url)).filter(file => file.endsWith('.html'));

export default defineConfig({
  base: './',
  plugins: [{
    name: 'portfolio-header',
    transformIndexHtml(html, { filename }) {
      return html.replace('<!-- site-header -->', renderHeader(filename.endsWith('/index.html')));
    }
  }],
  build: {
    rollupOptions: {
      input: pages.map(page => fileURLToPath(new URL(page, import.meta.url)))
    }
  }
});
