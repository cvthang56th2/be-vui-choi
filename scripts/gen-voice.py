#!/usr/bin/env python3
"""Pre-record the app's voice with VieNeu-TTS → audio/voice/*.mp3 + audio/voice/manifest.json.

The app splits every say() text into sentences (on . ! ? …) and plays the recorded file for each
sentence it finds in the manifest; anything not recorded falls back to the device voice.

Sentences come from two places:
  * scripts/voice-phrases.json — sentences built from game data (npm run voice:harvest)
  * fixed strings written in index.html — T('…','…') pairs and say('…') literals
  * scripts/voice-extra.json (optional) — [lang, text] pairs you add by hand, e.g. from the
    "missed sentences" list the app keeps (localStorage key bevui_voice_miss)

Only new sentences are synthesized, so re-running after adding a game is quick.
Setup:  python3.13 -m venv .venv-voice && .venv-voice/bin/pip install vieneu
Run:    .venv-voice/bin/python scripts/gen-voice.py [--dry-run] [--voice "Mỹ Duyên"] [--lang vi,en]
(KorvaTTS was tried first and dropped: every Korva voice had an audible tremble.)
"""
import argparse, hashlib, json, os, re, subprocess, sys, tempfile, time, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio' / 'voice'


def vnorm(s: str) -> str:
    """Must match vnorm() in index.html: the lookup key for one sentence."""
    s = unicodedata.normalize('NFC', s).lower().replace('’', "'")
    s = re.sub(r'[–—-]', ' ', s)
    s = ''.join(c if (unicodedata.category(c)[0] in 'LNM' or c.isspace() or c in "'_") else ' ' for c in s)
    return re.sub(r'\s+', ' ', s).strip()


def chunks(text: str):
    """Must match the sentence split in say()."""
    return [c for c in re.sub(r'([.!?…])\s+', r'\1\n', text).split('\n') if c.strip()]


def speakable(chunk: str) -> str:
    """Text handed to the TTS: drop emoji/symbols, keep letters, digits and punctuation."""
    s = ''.join(c for c in chunk if unicodedata.category(c)[0] in 'LNMPZ')
    return re.sub(r'\s+', ' ', s).strip(' ,')


STR = r"""'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`"""


def unq(groups):
    s = next(g for g in groups if g is not None)
    return s.replace("\\'", "'").replace('\\"', '"').replace('\\n', ' ')


def literals(html: str):
    """Fixed strings the app may speak: both sides of T('vi','en') and say('…', lang)."""
    out = []
    for m in re.finditer(r'\bT\(\s*(?:' + STR + r')\s*,\s*(?:' + STR + r')\s*\)', html):
        vi, en = unq(m.groups()[:3]), unq(m.groups()[3:])
        if '${' not in vi and '<' not in vi: out.append(('vi', vi))
        if '${' not in en and '<' not in en: out.append(('en', en))
    for m in re.finditer(r"\bsay\(\s*'((?:[^'\\\n]|\\.)*)'\s*,\s*'(vi|en)-", html):
        out.append((m.group(2), m.group(1).replace("\\'", "'")))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='Mỹ Duyên', help='a VieNeu preset voice name')
    ap.add_argument('--lang', default='vi', help='vi, en or vi,en (English defaults to the device voice)')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--limit', type=int, default=0, help='synthesize at most N new sentences (for a quick test)')
    ap.add_argument('--jobs', type=int, default=6, help='parallel worker processes')
    ap.add_argument('--out', default='', help='write somewhere other than audio/voice (for trying settings)')
    ap.add_argument('--shard', default='', help=argparse.SUPPRESS)  # i/n, set for worker processes
    a = ap.parse_args()
    global OUT
    if a.out: OUT = Path(a.out).resolve()

    src = []
    src += [tuple(p) for p in json.loads((ROOT / 'scripts' / 'voice-phrases.json').read_text())]
    src += literals((ROOT / 'index.html').read_text())
    extra = ROOT / 'scripts' / 'voice-extra.json'
    if extra.exists(): src += [tuple(p) for p in json.loads(extra.read_text())]

    want = {}  # (lang, key) -> text to speak
    langs = set(a.lang.split(','))
    for lang, text in src:
        if lang not in langs: continue
        for c in chunks(text):
            k, t = vnorm(c), speakable(c)
            if not k or not re.search(r'[^\W\d_]', k) or len(k) > 220: continue
            want.setdefault((lang, k), t)

    OUT.mkdir(parents=True, exist_ok=True)
    mpath = OUT / 'manifest.json'
    old = json.loads(mpath.read_text()) if mpath.exists() else {}
    meta = old.get('_', {})
    if meta and (meta.get('engine'), meta.get('voice')) != ('vieneu', a.voice):
        print('voice settings changed → re-recording everything'); old = {}
    fresh = not old  # settings changed (or first run): every old recording goes
    # languages not asked for this run keep their recordings as they are
    a.other = {l: m for l, m in old.items() if l not in ('_', *langs)}
    # a sentence is recorded when its file exists, so parallel workers need no shared state
    have = {} if fresh else {lk: fname(*lk) for lk in want if (OUT / fname(*lk)).exists()}
    todo = [(lk, t) for lk, t in want.items() if lk not in have]
    if a.shard:
        i, n = map(int, a.shard.split('/'))
        todo = todo[i::n]
    print(f'{len(want)} sentences ({sum(l == "vi" for l, _ in want)} vi / {sum(l == "en" for l, _ in want)} en), '
          f'{len(want) - len(todo)} already recorded, {len(todo)} to record')
    if a.dry_run: return
    if a.limit: todo = todo[:a.limit]
    if not a.shard:
        if fresh:
            for f in OUT.glob('*.mp3'): f.unlink()
            a.other = {}
        write(mpath, have, want, a)  # record the settings before the workers start
        if todo:
            args = [a2 for a2 in sys.argv[1:]]
            procs = [subprocess.Popen([sys.executable, __file__, *args, '--shard', f'{i}/{a.jobs}'])
                     for i in range(a.jobs)]
            if any(p.wait() for p in procs): print('a worker failed; run again to finish', file=sys.stderr)
        have = {lk: fname(*lk) for lk in want if (OUT / fname(*lk)).exists()}
        write(mpath, have, want, a, prune=True)
        print(f'done → {mpath} ({len(have)}/{len(want)} recorded)')
        return

    from vieneu import Vieneu
    tts = Vieneu(threads=max(1, (os.cpu_count() or 4) // a.jobs))
    t0 = time.time()
    with tempfile.TemporaryDirectory() as tmp:
        for i, ((lang, k), text) in enumerate(todo, 1):
            name = fname(lang, k)
            # VieNeu samples token by token, so now and then a take runs on or gets cut short:
            # keep the take whose length best fits the number of syllables
            syl = max(1, len(text.split()))
            best = None
            for _ in range(3):
                wav = tts.infer(text, voice=a.voice)
                dur = len(wav) / tts.sample_rate
                off = max(0.0, dur - (0.6 + syl * 0.42), (0.2 + syl * 0.12) - dur)
                if best is None or off < best[0]: best = (off, wav)
                if off == 0: break
            if best[0] > 0: print(f'  [{a.shard}] odd length kept for: {text}', flush=True)
            w = Path(tmp) / 'x.wav'
            tts.save(best[1], w)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(w), '-ac', '1', '-ar', '24000',
                            '-b:a', '40k', str(Path(tmp) / name)], check=True)
            os.replace(Path(tmp) / name, OUT / name)  # appear whole, never half-written
            if i % 25 == 0 or i == len(todo):
                el = time.time() - t0
                print(f'  [{a.shard}] {i}/{len(todo)}  ~{el / i * (len(todo) - i) / 60:.0f} min left', flush=True)


def fname(lang, k):
    return hashlib.sha1(f'{lang}|{k}'.encode()).hexdigest()[:12] + '.mp3'


def write(mpath, have, want, a, prune=False):
    m = {'_': {'engine': 'vieneu', 'voice': a.voice}, 'vi': {}, 'en': {}, **getattr(a, 'other', {})}
    for (lang, k), f in sorted(have.items()):
        if (lang, k) in want: m[lang][k] = f
    if prune:  # drop recordings of sentences the app no longer says
        keep = {f for l in ('vi', 'en') for f in m[l].values()}
        for f in OUT.glob('*.mp3'):
            if f.name not in keep: f.unlink()
    mpath.write_text(json.dumps(m, ensure_ascii=False, separators=(',', ':')))


if __name__ == '__main__':
    sys.exit(main())
