# Background Music Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a looping, royalty-free background music track that plays softly during gameplay (any game), is silent on the Home screen, and can be toggled/volume-adjusted by a parent in ⚙️ Settings.

**Architecture:** One bundled audio file served from a new `audio/` folder, played through a single lazily-created `<audio loop>` element controlled by a small `music` object in `index.html`, hooked into the existing `openGame`/`goHome` navigation functions. Settings persisted the same way voice settings already are (a small object saved to `localStorage`).

**Tech Stack:** Plain `<audio>` element + vanilla JS, no new npm dependency. `scripts/build.mjs` gains a recursive-copy step for the new asset folder.

**Spec:** Discussed and approved in conversation (no separate design file — small/medium change). Summary: music must be free/royalty-free, offline-playable (bundled, not streamed), off by default volume low, toggle+volume in Settings, plays during games only.

## Global Constraints

- Royalty-free / free-license track only; license + source must be stated to the user before downloading (filename, source, size) and approved.
- No streaming — file must be bundled so offline PWA play-through keeps working.
- No new runtime dependency; a small devtime-only asset-prep tool is fine, native OS tools preferred.
- Default volume low (music must never drown out `say()` speech or `SFX`).
- Must not autoplay before a user gesture (iOS Safari blocks that) — only start from inside `openGame`, which is already triggered by a tap.

## Review Focus

- First playback attempt may be blocked by the browser's autoplay policy even after a tap in some edge cases — `music.ensure()` must swallow a rejected `play()` promise instead of throwing.
- Rapid tapping between two games (`openGame` → `openGame` without going home) must not stack a second `<audio>` element or restart the track from 0 each time — reuse the one element, only call `.play()` if currently paused.
- Toggling music off in Settings while a game is open must take effect immediately, not just on next game open.
- If the audio file fails to load (missing/404), the game must still work normally — only the music is silently absent.
- Volume slider must update the live element's `volume` immediately, and the chosen value must survive a reload (`localStorage`).

---

### Task 1: Source and add the royalty-free track

**Files:**
- Create: `audio/bgmusic.mp3`
- Modify: `scripts/build.mjs`

- [ ] **Step 1: Find a candidate track.** Search Pixabay Music / Pexels (clear "free to use" license, no attribution required) for a short (~1 min, seamlessly loopable), gentle/playful instrumental suitable for toddlers. Propose 1-2 specific candidates to the user (title, source URL, license, file size) and get explicit approval before downloading.
- [ ] **Step 2: Download the approved track into `audio/bgmusic.mp3`.** If the source format isn't already a reasonably small mp3, re-encode/trim with a locally available tool (e.g. `ffmpeg` if present) to keep the file under ~1.5MB.
- [ ] **Step 3: Add a recursive folder copy to `scripts/build.mjs`** so `audio/` is copied to `www/audio/` on build, alongside the existing flat `FILES` copy loop (use `cpSync(src, dest, {recursive:true})`).
- [ ] **Step 4: Manual verify** — run `npm run build` and confirm `www/audio/bgmusic.mp3` exists with the same size as `audio/bgmusic.mp3`.
- [ ] **Step 5: Commit**

```bash
git add audio/bgmusic.mp3 scripts/build.mjs
git commit -m "Thêm nhạc nền miễn phí bản quyền + copy vào build"
```

### Task 2: Music settings state + Settings UI

**Files:**
- Modify: `index.html` (new `MS` object near `VS` at `index.html:956`; new markup inside `#vset` near `index.html:879-885`; new wiring inside the voice-settings IIFE at `index.html:1784-1812`)

**Interfaces:**
- Produces: `MS = {on: boolean, vol: number}` (default `{on:true, vol:0.18}`), persisted to `localStorage` key `bevui_music`, function `saveMS()`. DOM: checkbox `#mOn`, range `#mVol` (min 0, max 0.5, step 0.02) inside `#vset`.
- Consumed by Task 3's `music` object.

- [ ] **Step 1: Add `MS` object + `saveMS()`** next to the existing `VS`/`saveVS()` code (`index.html:956-958`), same `try{Object.assign(...)}catch` load pattern.
- [ ] **Step 2: Add Settings UI markup** inside `#vset` (after the `vsep` at `index.html:878`, before the voice rows): a `.vrow` with checkbox `id="mOn"` labeled "Nhạc nền" / "Background music", and a `.vcol` with range `id="mVol"` labeled with current percentage like the existing `vRate`/`vRateL` pattern.
- [ ] **Step 3: Wire listeners** in the voice-settings IIFE: on `renderVoiceUI()`, set `mOn.checked=MS.on` and `mVol.value=MS.vol`; `mOn` `change` → update `MS.on`, `saveMS()`, and call `music.setEnabled(MS.on)` (defined in Task 3); `mVol` `input` → update `MS.vol`, `saveMS()`, call `music.setVolume(MS.vol)`.
- [ ] **Step 4: Manual verify** — open ⚙️ Settings in the browser pane, confirm the new row/slider render, toggle/drag them, and confirm `localStorage.getItem('bevui_music')` reflects the change (via `javascript_tool`).
- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Thêm cài đặt bật/tắt và âm lượng nhạc nền"
```

### Task 3: Music playback controller + navigation hooks

**Files:**
- Modify: `index.html` (new `music` object near `audio()`/`tone()` at `index.html:922-949`; call sites inside `openGame` at `index.html:2927-2930` and `goHome` at `index.html:2932`)

**Interfaces:**
- Consumes: `MS.on`, `MS.vol` from Task 2.
- Produces: `music.ensure()` (start/resume if enabled), `music.stop()` (pause), `music.setEnabled(on: boolean)`, `music.setVolume(vol: number)` — all called by Task 2's listeners and by `openGame`/`goHome`.

- [ ] **Step 1: Implement the `music` object.** Lazily create one `<audio>` element (`loop=true`, `src='audio/bgmusic.mp3'`, `volume=MS.vol`) on first use, cached in a closure variable — never create a second element. `ensure()`: if `MS.on` and the element is `.paused`, call `.play()` and `.catch(()=>{})` to swallow autoplay-policy rejections. `stop()`: `.pause()` if the element exists. `setEnabled(on)`: if `!on`, call `stop()`; if `on`, call `ensure()`. `setVolume(v)`: set `.volume` on the element if it exists.
- [ ] **Step 2: Hook navigation.** In `openGame` (`index.html:2927-2930`), after the existing `sfx('tap')` line, add `music.ensure()`. In `goHome` (`index.html:2932`), after `hush()`, add `music.stop()`.
- [ ] **Step 3: Manual verify** — in the browser pane, tap into any game; use `javascript_tool` to confirm `document.querySelector('audio')?.paused === false` and `.currentSrc` ends with `bgmusic.mp3`. Tap "🏠" home; confirm `.paused === true`. Switch directly between two different games without going home; confirm still only one `<audio>` element exists in the DOM/closure and it kept playing without restarting from 0.
- [ ] **Step 4: Manual verify missing-file resilience** — temporarily rename `audio/bgmusic.mp3`, reload, open a game, confirm no uncaught console error and the game still fully works (just silent); restore the file afterward.
- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Phát nhạc nền trong game, dừng khi về màn hình chính"
```
