import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { build } from 'vite';

const output = await mkdtemp(join(tmpdir(), 'nolawi-theme-'));
let browser;
try {
  await build({ logLevel: 'error', build: { outDir: output } });
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN });
  const sizes = [[320, 568], [375, 667], [667, 320], [768, 768], [1440, 900]];

  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== 'http://portfolio.test') return route.abort();
      return route.fulfill({ path: join(output, url.pathname === '/' ? 'index.html' : url.pathname) });
    });
    await page.goto('http://portfolio.test/');
    await page.getByRole('button', { name: 'Theme', exact: true }).click();
    const toolbar = page.getByRole('group', { name: 'Theme', exact: true });
    const panel = page.locator('.theme-bar');
    const increase = toolbar.getByRole('button', { name: 'Increase page text size' });
    await toolbar.getByRole('switch', { name: 'Dark mode' }).waitFor();
    await toolbar.getByRole('switch', { name: 'Serif body' }).waitFor();
    await toolbar.getByRole('combobox', { name: 'Title font' }).waitFor();
    await toolbar.getByRole('group', { name: 'Accent' }).waitFor();

    for (let step = 0; step <= 3; step++) {
      const metrics = await toolbar.evaluate(async element => {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return {
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          height: element.clientHeight,
          scrollHeight: element.scrollHeight,
          viewportWidth: document.documentElement.clientWidth,
          pageWidth: document.documentElement.scrollWidth,
          elements: [...element.children].map(child => [child.className, child.getBoundingClientRect().left, child.getBoundingClientRect().right]),
          right: element.getBoundingClientRect().right,
          left: element.getBoundingClientRect().left,
          logoLeft: document.querySelector(".site-header .brand").getBoundingClientRect().left
        };
      });
      const description = `${width}×${height}, ${await toolbar.locator('output').textContent()} text`;
      assert.ok(metrics.scrollWidth <= metrics.width, `${description}: Theme drawer scrolls sideways ${JSON.stringify(metrics)}`);
      assert.ok(metrics.scrollHeight <= metrics.height, `${description}: Theme drawer scrolls vertically ${JSON.stringify(metrics)}`);
      assert.ok(metrics.pageWidth <= metrics.viewportWidth, `${description}: page scrolls sideways`);
      const tab = metrics.elements.find(([name]) => name === 'theme-drawer-heading');
      const size = metrics.elements.find(([name]) => name === 'type-stepper');
      if (width === 1440) {
        assert.ok(Math.abs(metrics.left - metrics.logoLeft) <= 1, `${description}: drawer should start at the logo`);
        const rows = await toolbar.evaluate(element => [...element.children].map(child =>
          Math.round(child.getBoundingClientRect().top + child.getBoundingClientRect().height / 2)));
        assert.ok(Math.max(...rows) - Math.min(...rows) <= 1, `${description}: Theme controls wrap on desktop`);
        assert.ok(tab[1] >= size[2], `${description}: Theme tab should follow text size`);
      }
      if (step < 3) await increase.click();
    }

    await increase.press('Escape');
    await panel.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-tab');
    await page.close();
  }
  console.log('Theme drawer wraps at all five viewport sizes through 140% text.');
} finally {
  await browser?.close();
  await rm(output, { recursive: true, force: true });
}
