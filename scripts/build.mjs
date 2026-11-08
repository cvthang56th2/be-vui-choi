// Copy the static web app into www/ (used by Vercel and by Capacitor for the iOS app).
import { rmSync, mkdirSync, copyFileSync, existsSync, statSync } from 'node:fs';

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
console.log('Build done → www/');
