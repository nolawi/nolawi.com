import { execFileSync } from 'node:child_process';
import { cp, copyFile, mkdtemp, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { markdownFeatures, featurePath } from './markdown-feature.js';

const cms = process.argv.includes('--cms');
const output = resolve(cms ? 'dist' : 'dist-astro');
const staging = await mkdtemp(resolve('.astro-preview-'));
const site = resolve(staging, 'site');
const astro = resolve(staging, 'astro');
const backup = resolve(staging, 'previous');

try {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', site], {
    stdio: 'inherit', env: { ...process.env, SITE_INDEXABLE: '0' }
  });
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: 'prototype', stdio: 'inherit',
    env: { ...process.env, SITE_INDEXABLE: '0', ASTRO_PREVIEW_BASE: cms ? '/preview/' : '/', ASTRO_PREVIEW_OUTPUT: astro, ASTRO_TELEMETRY_DISABLED: '1' }
  });
  await cp(resolve(astro, '_astro'), resolve(site, '_astro'), { recursive: true });
  for (const id of Object.keys(markdownFeatures)) {
    const page = featurePath(id);
    await copyFile(resolve(astro, page), resolve(site, page));
  }

  let replacedPrevious = false;
  try {
    await rename(output, backup);
    replacedPrevious = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  try {
    await rename(site, output);
  } catch (error) {
    if (replacedPrevious) await rename(backup, output);
    throw error;
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}
