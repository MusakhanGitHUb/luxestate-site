import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'www');
const copyItems = [
  'index.html',
  'property.html',
  'offline.html',
  'manifest.webmanifest',
  'service-worker.js',
  'assets',
  'data'
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const item of copyItems) {
  const source = path.join(root, item);
  const destination = path.join(outDir, item);
  if (!existsSync(source)) {
    throw new Error(`Missing required build asset: ${item}`);
  }
  await cp(source, destination, { recursive: true });
}

console.log('LuxEstate application build ready in ./www');
