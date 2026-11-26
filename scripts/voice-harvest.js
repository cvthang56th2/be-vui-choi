// Collect sentences the app speaks that are built from game data (quiz questions, numbers, game names…).
// scripts/voice-harvest.mjs injects this inside the app's main closure (so it can see say(), QUIZZES…)
// and runs the app once in Vietnamese and once in English; it leaves [lang, text] pairs in window.__harvest. Fixed sentences written directly
// in the code are picked up by scripts/gen-voice.py itself, so they do not need to be collected here.
window.__harvest = (() => {
  const out = new Set();
  const add = (lang, t) => {
    if (typeof t !== 'string' || !t.trim()) return;
    lang = lang === 'vi-VN!' ? 'vi' : lang === 'en-US' ? 'en' : (LANG === 'en' ? 'en' : 'vi');
    out.add(JSON.stringify([lang, t]));
  };
  const realSay = say;
  say = (t, l) => add(l, t);
  const dummy = () => document.createElement('div');
  const stage = { querySelector: dummy, querySelectorAll: () => [], classList: dummy().classList };
  try {
    for (const cfg of QUIZZES) {
      const rounds = cfg.rounds || 6;
      for (let n = 0; n < 6000; n++) {
        try {
          const q = cfg.gen(n % rounds);
          if (typeof q.speech === 'function') q.speech(); else add(undefined, q.speech);
          (q.options || []).forEach(o => add(undefined, o.say));
          if (q.onCorrect) q.onCorrect(stage);
        } catch (e) { /* a generator that needs real DOM; its fixed sentences still come from the code scan */ }
      }
      if (cfg.winMsg) add(undefined, cfg.winMsg.replace(/[^\p{L}\p{N}\s!.,]/gu, '') + T(' Bé giỏi quá!', ' Great job!'));
    }
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    for (let n = 0; n <= 100; n++) { add(undefined, viNum(n)); add(undefined, cap(viNum(n)) + '!'); }
    for (let n = 1; n <= 10; n++) add(undefined, NUMW.slice(1, n + 1).map(cap).join(', ') + '!');
    PRAISE.forEach(p => add(undefined, p));
    Object.values(CARDS).forEach(c => add(undefined, c[1]));
    AGES.forEach(g => add(undefined, T('Trò chơi cho bé ' + g.say + ' tuổi', 'Games for ages ' + g.say)));
  } finally {
    say = realSay;
  }
  return [...out].map(s => JSON.parse(s));
})();
