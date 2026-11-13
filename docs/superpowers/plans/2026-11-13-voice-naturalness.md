# Voice Naturalness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the on-device text-to-speech voice used throughout the app sound less robotic, with zero new dependencies and no network calls.

**Architecture:** Two independent, additive edits to the existing voice code in `index.html`: (1) broaden the voice-quality scoring heuristic so more platforms' good built-in voices get picked, and (2) split long spoken text into short per-clause utterances so pacing/intonation resets at each clause instead of one flat monotone block.

**Tech Stack:** Vanilla JS, Web Speech API (`speechSynthesis`), no build step for this change.

**Spec:** Discussed and approved in conversation (no separate design file — small change). Summary: keep voice fully offline/free; only tune voice selection and text pacing.

## Global Constraints

- No network TTS service, no new dependency — stay inside `speechSynthesis`.
- Must not break the existing `localStorage` key `bevui_voice` / `VS` shape (`{on,rate,vi,en}`) so saved user prefs keep working.
- Must not change the public call shape `say(text, lang, queue, force)` — many call sites throughout `index.html` depend on it.

## Review Focus

- A device with no "premium"-named voice at all (score list all low/negative) must still pick *some* voice, not crash or leave `u.voice` unset-and-broken.
- Known robotic engines not currently in the `BAD` list (e.g. `compact`, `eSpeak`) must not outrank a merely mediocre but less-bad voice.
- Splitting text must still respect the `queue` flag (a second `say()` call with `queue=true` must not cancel the first call's still-pending clauses).
- A single-clause short phrase (no punctuation) must still speak once, not be mangled by the splitter.
- Changing language mid-session (`VI`/`EN` toggle) must still reselect the right voice after the scoring change — don't hardcode Apple-only names.

---

### Task 1: Broaden voice-quality scoring

**Files:**
- Modify: `index.html:955` (`BAD` regex), `index.html:960-970` (`vscore`)

**Interfaces:**
- Produces: same `vscore(v, lang): number` signature, used unchanged by `voicesFor`/`pickVoice`/`renderVoiceUI`.

- [ ] **Step 1: Extend `BAD` at `index.html:955` to also deprioritize `compact|espeak|pico`** (common robotic fallback engines on non-Apple platforms), appended into the existing alternation.
- [ ] **Step 2: Extend `vscore` at `index.html:960-970`** to add platform-neutral quality signals: `+30` if name matches `/natural|wavenet|neural|chirp/i`, in addition to the existing Apple/Google/Siri checks. Keep all existing scoring lines unchanged.
- [ ] **Step 3: Manual verify** — open the app in the browser pane, open ⚙️ Settings, confirm the Vietnamese/English voice dropdowns still render without console errors and the top pick is not something matching the new `BAD` additions.
- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Nhận thêm giọng đọc chất lượng cao trên các nền tảng khác iOS"
```

### Task 2: Split long speech into per-clause utterances

**Files:**
- Modify: `index.html:983-995` (`say`)

**Interfaces:**
- Consumes: nothing new.
- Produces: same external signature `say(text, lang, queue, force): void`. Internally may call `speechSynthesis.speak()` more than once per call.

- [ ] **Step 1: Implement clause splitting in `say()`.** Before building the utterance, split `text` on `/(?<=[.!?…])\s+/` (keep punctuation attached to each clause) when the text contains more than one clause; otherwise treat the whole string as one clause. Keep the existing `if(!queue)speechSynthesis.cancel()` behavior applied once, before any clause is queued — not per clause. For each clause, build and `speak()` an utterance exactly as the current code does (same `lang`, `voice`, `rate`, `pitch`, `volume` logic), so clauses play back to back via the browser's own utterance queue.
- [ ] **Step 2: Manual verify** — in the browser pane, open ⚙️ Settings and click "▶ Nghe thử tiếng Việt" (speaks the 3-clause string `"Chào bé! Mình là Mít. Bé có nghe rõ không?"`). Use `javascript_tool` to poll `speechSynthesis.pending || speechSynthesis.speaking` over ~2s and confirm it stays true across multiple short bursts (i.e. more than one utterance was queued) rather than a single long one, and confirm no console errors.
- [ ] **Step 3: Manual verify short phrase** — trigger any single-clause game prompt (e.g. tap a tile in Con vật) and confirm it still speaks normally (no missing/duplicated audio, no console errors).
- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Đọc câu dài thành từng cụm ngắn cho tự nhiên hơn"
```
