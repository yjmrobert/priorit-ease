// One-off script to generate PWA icons from public/favicon.svg.
// Run with: node scripts/gen-icons.mjs
// Requires `sharp` installed as a dev dep at the time of running.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const svgPath = path.join(root, 'public', 'favicon.svg');
const svg = await fs.readFile(svgPath);

async function render(size, outName, { padding = 0 } = {}) {
  const inner = size - padding * 2;
  const resized = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const out = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: padding > 0 ? { r: 15, g: 23, b: 42, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left: padding, top: padding }])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(root, 'public', outName), out);
  console.log('wrote', outName, size + 'x' + size);
}

await render(192, 'icon-192.png');
await render(512, 'icon-512.png');
// Maskable: ~20% safe-zone padding, on the app's background color.
await render(512, 'icon-maskable-512.png', { padding: 64 });
