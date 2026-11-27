import { readdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { renderThemeCss, themeSettings } from './src/themer.js';
import { renderFavicon } from './src/favicon.js';
import { renderBrand, renderHeader } from './src/header.js';

import { generatePages, injectPublishing } from './scripts/publishing.js';

generatePages();
const initialTokens = themeSettings.theme.values[themeSettings.theme.default].tokens;
writeFileSync(new URL('./public/favicon.svg', import.meta.url), renderFavicon(initialTokens.accent, initialTokens['on-accent']));

const pages = readdirSync(new URL('./', import.meta.url)).filter(file => file.endsWith('.html'));

export default defineConfig({
  base: './',
  plugins: [{
    name: 'portfolio-header',
    transformIndexHtml(html, { filename }) {
      const page = basename(filename);
      return {
        html: injectPublishing(html, page)
          .replace('<!-- site-header -->', renderHeader(page === 'index.html'))
          .replace('<!-- footer-brand -->', renderBrand({ backToTop: true })),
        tags: [
          { tag: 'style', children: renderThemeCss(), injectTo: 'head' },
          { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: './favicon.svg', 'data-theme-icon': '' }, injectTo: 'head' }
        ]
      };
    }
  }],
  build: {
    rollupOptions: {
      input: pages.map(page => fileURLToPath(new URL(page, import.meta.url)))
    }
  }
});
