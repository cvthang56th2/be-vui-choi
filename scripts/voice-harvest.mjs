// Load the app in jsdom (once in Vietnamese, once in English) with scripts/voice-harvest.js injected into it,
// and write every collected sentence to scripts/voice-phrases.json for scripts/gen-voice.py.
import { readFileSync, writeFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = readFileSync('index.html', 'utf8');
const harvest = readFileSync('scripts/voice-harvest.js', 'utf8');
const end = html.lastIndexOf('})();\n</script>');
if (end < 0) throw new Error('could not find the end of the app script in index.html');
const page = html.slice(0, end) + harvest + '\n' + html.slice(end);
const all = [];

for (const lang of ['vi', 'en']) {
  const vc = new VirtualConsole();  // the app pokes at canvas/audio APIs jsdom lacks; that noise is not useful here
  const dom = new JSDOM(page, {
    url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.localStorage.setItem('bevui_lang', lang);
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      w.HTMLCanvasElement.prototype.getContext = () => null;
      w.fetch = () => Promise.reject(new Error('offline'));
    },
  });
  const pairs = dom.window.__harvest;
  if (!pairs) throw new Error(`the app script did not run (${lang})`);
  console.log(`${lang}: ${pairs.length} sentences`);
  all.push(...pairs);
  dom.window.close();
}

const uniq = [...new Map(all.map(p => [JSON.stringify(p), p])).values()];
writeFileSync('scripts/voice-phrases.json', JSON.stringify(uniq, null, 0).replace(/\],\[/g, '],\n['));
console.log(`→ scripts/voice-phrases.json (${uniq.length})`);
