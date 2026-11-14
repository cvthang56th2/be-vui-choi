# Balloon Games Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new balloon-themed games — "Thả bóng bay" (tap-anywhere balloon release, 1–2 tuổi) and "Đếm bóng bay" (count-the-balloons quiz, 4–5 tuổi) — reusing the app's existing balloon visuals and shared helpers, without touching the two existing balloon games.

**Architecture:** Both games follow the file's existing per-game pattern exactly: an IIFE with `start()`/`stop()` registered in `GAMES`, a `<section class="screen">` with a `.stage` div, an entry in the relevant `AGES[i].games` array, and a `CARDS` entry for the home-screen card. "Thả bóng bay" is a continuous-animation game modeled closely on the already-shipped `Bubbles` (`index.html:2141`, spawn-on-interval/float/pop-with-`sparks()`) but spawns on tap instead of auto-spawning, and reuses the `.balloon`/`.bb` CSS classes and `COLS_B` array already used by `Pump`/`Balloon` so the balloon shape/style matches. "Đếm bóng bay" is a `makeQuiz()` game modeled closely on the already-shipped `Count3Q` (`index.html:2410`), using the same `.bb`/`COLS_B` balloon markup instead of emoji for the counted items.

**Tech Stack:** Vanilla JS/HTML/CSS, no build step for this change, no new assets (CSS-drawn balloons only — not real images, matching the design's call that abstract/decorative game elements stay illustrated).

**Spec:** [docs/superpowers/specs/2026-11-14-balloon-games-design.md](../specs/2026-11-14-balloon-games-design.md)

## Global Constraints

- Do not modify the existing `Balloon` (`index.html:1443`) or `Pump` (`index.html:2713`) games, their CSS, or their `AGES`/`GAMES`/`CARDS` entries — only add new ones.
- "Thả bóng bay" goes in the 1–2 tuổi age group and must have **no wrong answers / no fail state** — every tap must produce a positive response, matching this age group's existing games' design rule (stated in the project's own README: "1–2 tuổi (27 game) — không có đáp án sai, mọi lần chạm đều có phản hồi").
- Reuse existing shared helpers/CSS rather than duplicating: `sparks(stage,cx,cy,color,n)` (`index.html:2101`) for particle bursts, `.balloon`/`.bb` CSS classes and the `COLS_B` array (`index.html:2737`) for balloon shape/color, `makeQuiz()` for the counting game, `addStar()`, `setPrompt()`, `win()`.
- New game keys must not collide with any existing key in `GAMES`/`CARDS`/`AGES` — this plan uses `float` (Thả bóng bay) and `countballoon` (Đếm bóng bay), both confirmed unused in the current file.
- The generic `.home-btn` wiring (`index.html:2970`, a single `querySelectorAll` loop run once at page load) already covers any new `<section>`'s home button automatically — no new wiring needed, just include the same `<button class="btn-round home-btn">🏠</button>` markup other sections use.

## Review Focus

- "Thả bóng bay" must have zero fail/negative-feedback path anywhere (no wrong-color requirement, no timer pressure) — a reviewer should specifically check there's no code path that plays a "wrong" sound or shows a sad/negative response, since this is a hard rule for this age group.
- Rapid repeated tapping (a toddler mashing the screen) must not spawn unbounded balloons / leak DOM nodes or `requestAnimationFrame` loops — there must be a reasonable cap or cleanup, mirroring how `Bubbles`/`Balloon` already bound their own `list` arrays.
- `stop()` on both new games must fully clean up (cancel any `requestAnimationFrame`/`setTimeout`, remove DOM nodes) so switching away and back doesn't leave duplicate loops running — this is a real failure mode the shared `openGame`/`goHome` lifecycle depends on every game getting right.
- The counting quiz's balloon count must visually match its stated number exactly (an off-by-one rendering bug would directly teach a child the wrong count) — a reviewer should count the rendered balloons against `n` for several generated rounds, not just trust the code.
- Device-resize mid-game (the existing `Bubbles`/`Balloon` games compute pixel positions from `stage.getBoundingClientRect()` at spawn time) — "Thả bóng bay" must not break or throw if the window/stage resizes while balloons are mid-flight, matching the existing games' tolerance for this (check whether the existing games actively handle it or simply don't break, and match that same bar — not a new requirement beyond parity).

---

### Task 1: "Thả bóng bay" (Balloon Release) — 1–2 tuổi

**Files:**
- Modify: `index.html` — new `<section class="screen" id="float">` (place it near the other 1–2 tuổi sections, e.g. right after the `pump`/`garden` sections around `index.html:841-848`), a new `const Float=(()=>{...})()` IIFE (place it near `Bubbles`/`Balloon`, e.g. right after `Bubbles`), one new entry each in `GAMES`, `CARDS`, and `AGES[0].games` (the 1–2 tuổi array, `index.html:2929`)

**Interfaces:**
- Consumes: `sparks(stage,cx,cy,color,n)`, `.balloon`/`.bb` CSS + `COLS_B` array, `addStar()`, `setPrompt(id,promptHtml,speech)`, `sfx()`/`audio()`/`tone()`.
- Produces: `Float` object with `{start(), stop()}`, registered as `GAMES.float`; no other task depends on this.

- [ ] **Step 1: HTML section.** Add `<section class="screen" id="float"><div class="topbar"><button class="btn-round home-btn">🏠</button><div class="prompt"></div><div class="stars">⭐ <span class="starcount">0</span></div></div><div class="stage" id="flstage"></div></section>`, matching the exact markup shape of neighboring sections.
- [ ] **Step 2: Implement the `Float` game.** Model its spawn/animate/pop loop directly on `Bubbles` (`index.html:2141-2160+`, read the whole IIFE first) with these changes: (a) spawning happens on `pointerdown` anywhere on the stage (not on an interval timer) — each tap creates one new balloon at the tapped x-position (or near it) using the `.balloon`/`.bb` markup and a random color from `COLS_B`, matching how `Balloon`/`Pump` build their balloon DOM (`<div class="bb" style="--c:${c};--c2:${c2}">...`); (b) the balloon floats upward on its own via the same `requestAnimationFrame` loop pattern `Bubbles` uses; (c) when a balloon reaches the top of the stage (not when tapped — it's not tappable/poppable, release is the only interaction), it calls `sparks(stage,cx,cy,color,n)` for a burst of sparkles plus a cheerful chime (`tone(...)`, picking from the existing `PENTA` pentatonic set the file already uses elsewhere for pleasant random notes), then removes itself — never a "pop by tapping" interaction, since tapping is what *creates* balloons here, not what destroys them. (d) Cap concurrent balloons at a reasonable number (e.g. 12) — if at the cap, a new tap simply doesn't spawn one rather than erroring. (e) `stop()` cancels the RAF loop and removes all balloon DOM nodes, matching `Bubbles`' own `stop()`.
- [ ] **Step 3: Register the game.** Add `float:Float` to `GAMES` (`index.html:2953`). Add an entry to `CARDS` (`index.html:2867` area) — pick an emoji (e.g. `🎈`), Vietnamese/English title "Thả bóng bay"/"Balloon Release", a subtitle, and a 2-color gradient not already used by `balloon`/`pump`'s own card colors. Add `'float'` to `AGES[0].games` (the 1–2 tuổi array).
- [ ] **Step 4: Manual verify** — in the browser pane, open the game from the 1–2 tuổi tab's home screen, tap the stage repeatedly in different spots: confirm a new balloon appears near each tap, floats up, and pops into sparkles + a chime sound at the top with no negative/error feedback ever. Tap rapidly many times in a row: confirm no runaway balloon count (respects the cap) and no console errors. Switch to another game and back: confirm no leftover balloons/animation from a prior visit (clean `stop()`). Go home and confirm the 🏠 button works (should, via the existing generic wiring, but confirm it actually does on this new section).
- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Thêm game Thả bóng bay (1-2 tuổi)"
```

### Task 2: "Đếm bóng bay" (Count the Balloons) — 4–5 tuổi

**Files:**
- Modify: `index.html` — new `<section class="screen" id="countballoon">` (place near other 4–5 tuổi quiz sections), a new `const CountBalloonQ=makeQuiz({...})` (place near `Count3Q`, `index.html:2410`), one new entry each in `GAMES`, `CARDS`, and `AGES[2].games` (the 4–5 tuổi array, `index.html:2930` area)

**Interfaces:**
- Consumes: `makeQuiz(cfg)`, `.bb` CSS + `COLS_B` array, `ri(n)`/`pickOne`/`pickN` random helpers already used by other quizzes, `win()` (called internally by `makeQuiz`).
- Produces: `CountBalloonQ` registered as `GAMES.countballoon`; no other task depends on this.

- [ ] **Step 1: HTML section.** Same shape as Task 1's Step 1, with `id="countballoon"` and a stage id like `#cblstage`.
- [ ] **Step 2: Implement `CountBalloonQ` via `makeQuiz`.** Model directly on `Count3Q` (`index.html:2410-2415`): `gen()` picks a random count `n` from 1–10 (wider range than `Count3Q`'s 1–3, since this is the older 4–5 tuổi bracket — check what range other 4–5 tuổi counting-style quizzes in this file use, e.g. `CountQ`/`math20`, and match that bracket's typical difficulty rather than guessing), renders `n` balloon divs (reuse the `.bb`/`COLS_B` markup, one random color each, laid out in a wrapping flex/grid container similar to `Count3Q`'s `.cbox`/`.citem` — add a new CSS rule if `.citem`'s sizing doesn't suit a balloon shape) inside the question area, and offers 3 numeric options (the correct count plus two plausible distractors, same pattern as `Count3Q`'s `options:[1,2,3].map(...)`, but reachable ones given the wider 1–10 range). On a correct answer, make all the rendered balloons pop in a quick visual cascade (e.g. stagger a `sparks()` burst + fade/remove on each balloon with a short `setTimeout` delay per balloon, similar in spirit to `Count3Q`'s `onCorrect` staggering `<b>` number reveals) before advancing to the next round.
- [ ] **Step 3: Register the game.** Add `countballoon:CountBalloonQ` to `GAMES`. Add a `CARDS` entry (emoji e.g. `🎈`, title "Đếm bóng bay"/"Count the balloons", subtitle, a gradient not already used by `balloon`/`pump`/`float`). Add `'countballoon'` to `AGES[2].games` (4–5 tuổi).
- [ ] **Step 4: Manual verify** — open the game from the 4–5 tuổi tab. For at least 5 generated rounds, count the rendered balloons by eye against the number the prompt/speech states and confirm they match exactly. Tap a wrong answer: confirm the existing `makeQuiz` wrong-answer feedback plays (no special handling needed, this is inherited from `makeQuiz` for free) and the round doesn't advance. Tap the correct answer: confirm the pop-cascade plays and the round advances; complete all `rounds` and confirm the win screen appears via `win(...)`.
- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Thêm game Đếm bóng bay (4-5 tuổi)"
```
