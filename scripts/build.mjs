// Copy the static web app into www/ (used by Vercel and by Capacitor for the iOS app).
import { rmSync, mkdirSync, copyFileSync, existsSync, statSync } from 'node:fs';

const FILES = ['index.html', 'sw.js', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-512.png'];

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
