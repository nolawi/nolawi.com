import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL;
const base = site ? new URL(site).pathname.replace(/\/?$/, '/') : '/';

export default defineConfig({
  site,
  base: process.env.ASTRO_PREVIEW_BASE || base,
  outDir: process.env.ASTRO_PREVIEW_OUTPUT,
  build: { format: 'file' },
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false }
});
