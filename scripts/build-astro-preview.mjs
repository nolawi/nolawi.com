import { execSync } from 'node:child_process';
import { cp, copyFile } from 'node:fs/promises';

execSync('npm run build -- --outDir dist-astro', { stdio: 'inherit' });
execSync('npm --prefix prototype run build', { stdio: 'inherit' });

await cp('prototype/dist/_astro', 'dist-astro/_astro', { recursive: true });
await copyFile('prototype/dist/ai-component.html', 'dist-astro/ai-component.html');
