// Copy the static web app into www/ (used by Vercel and by Capacitor for the iOS app).
import { rmSync, mkdirSync, copyFileSync, cpSync, existsSync, statSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const FILES = [
  'index.html', 'sw.js', 'manifest.webmanifest', 'favicon.ico', 'favicon-16.png', 'favicon-32.png',
  'apple-touch-icon.png', 'apple-touch-icon-precomposed.png', 'apple-touch-icon-180.png',
  'apple-touch-icon-167.png', 'apple-touch-icon-152.png', 'apple-touch-icon-120.png',
  'icon-192.png', 'icon-512.png',
];

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
for (const f of FILES) {
  if (!existsSync(f)) {
    console.error(`✗ Missing ${f}`);
    process.exit(1);
  }
  copyFileSync(f, `www/${f}`);
  console.log(`✓ www/${f} (${(statSync(f).size / 1024).toFixed(1)} KB)`);
}
// Stamp the service worker with a content hash so every deploy with new code installs a fresh SW
// (and drops the old cache) without bumping a version by hand.
{
  const h = createHash('sha256');
  for (const f of FILES) h.update(readFileSync(f));
  const walk = d => readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach(e => {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) walk(p); else h.update(p + statSync(p).size);
  });
  walk('audio'); walk('img');
  const build = h.digest('hex').slice(0, 12);
  writeFileSync('www/sw.js', readFileSync('www/sw.js', 'utf8').replace("'bevui-__BUILD__'", `'bevui-${build}'`));
  console.log(`✓ www/sw.js stamped with build ${build}`);
}
cpSync('audio', 'www/audio', { recursive: true });
console.log('✓ www/audio/ (folder)');
cpSync('img', 'www/img', { recursive: true });
console.log('✓ www/img/ (folder)');
console.log('Build done → www/');
