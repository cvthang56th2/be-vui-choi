# Fruit Images and Home-Screen Card Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the emoji/image-fallback rendering used by `makeBoard()` into a shared helper, use it to teach the home-screen game-card grid (`CARDS`) the same optional-image pattern, then use both to ship real photos for the Fruit recognition game and give the "Con vật" / "Xe cộ" / "Trái cây" home-screen cards a representative real photo instead of their emoji.

**Architecture:** A single new helper function builds the `<img ... onerror="...">`-with-emoji-fallback markup used today only inside `makeBoard()`. `makeBoard()` is refactored to call it (no behavior change, regression-checked against the already-shipped Animal/Vehicle boards). The home-screen grid renderer (currently `<span class="ico">${c[0]}</span>` inside the template at `index.html:2935`) is generalized the same way, gated on a new optional 6th array element in `CARDS` entries. Quiz-based games (`FruitQ` and others) are explicitly out of scope this round — their per-question option rendering needs its own wiring and is deferred to a later batch.

**Tech Stack:** Vanilla JS/HTML/CSS, no build step for the code change; `scripts/build.mjs` already copies all of `img/` recursively (no change needed there this round).

**Spec:** [docs/superpowers/specs/2026-11-14-visuals-realism-expansion-design.md](../specs/2026-11-14-visuals-realism-expansion-design.md)

## Global Constraints

- `makeBoard()`'s refactor must not change its output for any existing caller, byte-for-byte, including the already-shipped `AnimalBoard`/`VehicleBoard` (which already use the `it[4]` image slot) and every caller that doesn't pass one (FruitBoard before this plan runs, ColorBoard, BodyBoard, InstrBoard, FamilyBoard, ShapeBoard).
- `CARDS`' generalization must not change rendering for any of the ~56 existing entries that don't get a 6th element — this grid is the app's main navigation screen, so a bug here has the largest possible blast radius in the whole app.
- Each image ≤ ~50KB, sourced from Pexels (free to use, no attribution required) or an equivalently clear royalty-free license, resized to ~500×500 JPEG — same pipeline as the prior realistic-images batch.
- License/source stated to the user and approved before any image download (per item: source, license, approx size) — but per the user's "làm hết đi" / "làm luôn" instructions already on record for this kind of work this session, the implementer may pick specific sources itself and record the choice in the task report rather than blocking on a chat round-trip.
- This batch does **not** touch any `makeQuiz()`-based game (`FruitQ`, `SoundQ`, `EatQ`, `HomeQ`, `VehQ`, `ShadowQ`, etc.) — those need per-question option wiring and are explicitly deferred.
- `sw.js`'s precache list must include every new image path in the same commit that adds it (lesson from the prior batch's final review — don't rely on stale-while-revalidate alone for first-ever-offline).

## Review Focus

- The `makeBoard` refactor subtly changes the fallback markup's escaping or attribute order for the already-shipped Animal/Vehicle boards — must re-verify their `onerror` fallback still swaps to the correct emoji span, not just that the happy path still renders.
- A mistake in the `CARDS` generalization breaks rendering for an emoji-only entry (the overwhelming majority of the ~56 cards) — the home screen must still fully render and be tappable for every card that doesn't carry an image.
- Choosing one representative photo for a whole category card (e.g. which single animal represents "Con vật") is a content judgment call, not a technical one, and must look reasonable at the card's actual on-screen size, not just technically present.
- Adding a 4th element to `FRUITS`' array entries must not disturb `FruitQ`'s existing use of `FRUITS` (indices 0/1 only, confirmed) or any other consumer of the array.
- `sw.js`'s `CACHE` version bump must be the single source of truth (no second hardcoded cache-name string anywhere) and the new `ASSETS` paths must resolve to the same files `index.html` actually requests.

---

### Task 1: Shared emoji/image-fallback helper + `makeBoard()` refactor

**Files:**
- Modify: `index.html:2179-2191` (`makeBoard`'s `start()` template, currently builds `it[4]?...<img class="btimg"...>...:...<span class="be">...` inline)
- Create: a new helper function, placed just above `makeBoard` (e.g. `function emojiOrImg(emoji,path,imgClass,wrapClass){...}`)

**Interfaces:**
- Produces: `emojiOrImg(emoji: string, path: string|undefined|null, imgClass: string, wrapClass: string|undefined): string` — returns an HTML string. When `path` is falsy, returns `wrapClass ? '<span class="'+wrapClass+'">'+emoji+'</span>' : emoji` (bare emoji, no wrapper, when `wrapClass` is omitted). When `path` is truthy, returns `<img class="${imgClass}" src="${path}" alt="${emoji}" onerror="this.outerHTML='<the same fallback markup, HTML-attribute-escaped>'">`.
- Consumed by: Task 2 (CARDS generalization) and Task 3 (FruitBoard).

- [ ] **Step 1: Implement `emojiOrImg(emoji,path,imgClass,wrapClass)`.** Build the fallback string first (`wrapClass` present → `<span class="${wrapClass}">${emoji}</span>`, matching today's literal `<span class="be">${it[0]}</span>`; absent → bare `${emoji}`). If `!path`, return that fallback directly. Otherwise return the `<img>` tag whose `onerror` reassigns `this.outerHTML` to that same fallback string, HTML-attribute-escaped exactly the way the current inline code escapes it (`"` → `&quot;` inside the single-quoted JS string, so it survives being embedded inside a double-quoted HTML attribute) — match the existing escaping pattern used today in `makeBoard`'s template, character for character, just parameterized.
- [ ] **Step 2: Refactor `makeBoard`'s template** (`index.html:2182`) to call `${emojiOrImg(it[0], it[4], 'btimg', 'be')}` in place of the inline ternary, with everything else in the template (the tile's label text, the `pointerdown` handler, sound/speech dispatch) completely untouched.
- [ ] **Step 3: Manual regression verify** — in the browser pane, open "Con vật" and "Xe cộ" (the already-shipped image boards): confirm all 12 tiles still show their real photos exactly as before. Temporarily rename `img/animals/dog.jpg`, reload, confirm the dog tile still falls back to the 🐶 emoji (not a broken-image icon) and is still fully tappable; restore the file. Also open a board that has never had images (e.g. "Nhạc cụ"/InstrBoard): confirm it still renders its emoji tiles exactly as before (unaffected by the refactor).
- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Tách hàm dùng chung cho ảnh/emoji dự phòng, dùng lại trong makeBoard"
```

### Task 2: Generalize the home-screen card-icon renderer

**Files:**
- Modify: `index.html:2935` (the `#grid` template inside the function that renders `CARDS` onto the home screen)
- Modify: the `.ico` CSS rule and add a new `.icoimg` rule near it (search the `<style>` block for `.ico{`)

**Interfaces:**
- Consumes: `emojiOrImg(...)` from Task 1.
- Produces: `CARDS` entries may now carry an optional 6th element `c[5]` = image path, consumed by Task 3 and future batches. No existing entry gets one in this task — this task only adds the *capability*.

- [ ] **Step 1: Edit the grid template** at `index.html:2935` to replace `<span class="ico" style="...">${c[0]}</span>` with `${emojiOrImg(c[0], c[5], 'icoimg', 'ico').replace('<span class', '<span style="animation-delay:'+((i*.27)%1.2)+'s" class')}` — **do not** attempt that exact string surgery; instead, extend `emojiOrImg` call usage here by first building the fallback span with its existing inline `style="animation-delay:..."` attribute preserved. Concretely: keep the per-card bounce animation delay working for both the emoji-fallback case and (new) the image case — look at how the current `<span class="ico" style="animation-delay:${...}s">` is built and preserve that inline style on whichever element (`<span>` or `<img>`) actually ends up on screen for that card. The simplest correct approach is usually to add the `style` as a 5th parameter to a slightly extended helper call, or to wrap the `emojiOrImg(...)` output in a container that carries the animation delay instead of relying on the helper's own markup — your call, as long as every card's existing bounce/jump animation timing is visually unchanged after this task.
- [ ] **Step 2: Add a `.icoimg` CSS rule** near the existing `.ico{...}` rule: square-ish, `object-fit:cover`, sized to roughly the same visual footprint `.ico`'s font-size currently occupies, rounded corners consistent with the card's own border-radius.
- [ ] **Step 3: Manual verify (no visual change expected yet)** — reload the home screen for all 4 age tabs, confirm every card still renders its emoji icon exactly as before (no `CARDS` entry has a 6th element yet, so this task should be a pure no-op visually). Confirm the per-card stagger/bounce animation on load still looks the same as before this change.
- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Cho phép thẻ game ở màn hình chính dùng ảnh thật thay icon"
```

### Task 3: Fruit photos for `FruitBoard` + one representative card icon per sourced category

**Files:**
- Create: `img/fruits/{apple,banana,grapes,orange,watermelon,strawberry}.jpg` (6 images, matching `FRUITS`' first 6 entries in order)
- Modify: `index.html` — `FRUITS` array (`index.html:2239`, add a 4th element = image path to its first 6 entries only; the remaining 6 entries used only by the still-out-of-scope `FruitQ` stay untouched), `FruitBoard`'s `.map()` call (`index.html:2255`) to pass the image through to `makeBoard`'s item shape, and the `CARDS` entries for `animals`, `vehicles`, and `fruitsB` (add a 6th element = one representative photo path each, reusing an already-existing animal/vehicle photo for the first two, and one of this task's new fruit photos for the third — your call which single photo best represents each category at a glance)
- Modify: `sw.js` (`ASSETS` array + `CACHE` version bump)

**Interfaces:**
- Consumes: `makeBoard`'s `it[4]` slot (Task 1) and `CARDS`' `c[5]` slot (Task 2).

- [ ] **Step 1: Source and prepare 6 fruit images.** Search Pixabay/Pexels for a real photo of each: apple, banana, grapes (a bunch), orange, watermelon (a slice or whole, your call), strawberry. Pick clear, recognizable, well-lit photos — avoid prop-heavy or stylized shots (lesson from the prior batch's visual QA pass: reject anything too dark/low-contrast or where the fruit isn't the clear subject). Resize to ~500×500 square JPEG, compress to ≤50KB each.
  **Corrected `sips` pipeline (do not use the prior batch's pipeline as-is — it had a bug that baked solid black letterbox bars into 16 of 18 shipped photos, fixed after the fact in a later pass):** scale the *shortest* side up/down to at least 500 first — `sips -Z 500` only guarantees the *longest* side fits 500 and can leave the shorter side well under 500 for non-square sources (e.g. a 3:2 photo becomes 500×333), so instead resize so the shorter side reaches 500 (if the source is wider than tall, resize by height; if taller than wide, resize by width — check the source's own aspect ratio before picking which `sips -z`/`-Z` flag/dimension to use), **then** center-crop to exactly 500×500 with `sips -c 500 500`. Center-cropping down from a shorter side already ≥500 only ever removes pixels, never pads — padding-with-black is the bug to avoid. Finish with `sips -s format jpeg -s formatOptions <50-60>`. After processing each image, sanity-check for black bars before moving on (e.g. visually inspect it, or sample pixel brightness near all four edges) rather than assuming the pipeline worked.
- [ ] **Step 2: Add the image path as a 4th element to `FRUITS`' first 6 entries** (`index.html:2239`), in order: apple→`img/fruits/apple.jpg`, banana→`img/fruits/banana.jpg`, grapes→`img/fruits/grapes.jpg`, orange→`img/fruits/orange.jpg`, watermelon→`img/fruits/watermelon.jpg`, strawberry→`img/fruits/strawberry.jpg`. Leave `FRUITS`' other 6 entries (pineapple, mango, pear, coconut, cherry, kiwi) exactly as they are — 3-element arrays, unchanged.
- [ ] **Step 3: Update `FruitBoard`'s `.map()`** (`index.html:2255`, currently `FRUITS.slice(0,6).map(f=>[f[0],f[1],T('Màu ',"")+f[2]+'!','note'])`) to also pass the new 4th `FRUITS` element through as the resulting item's 5th element (`it[4]`), e.g. `[f[0],f[1],T('Màu ',"")+f[2]+'!','note',f[3]]`.
- [ ] **Step 4: Add a 6th element to the `animals`, `vehicles`, and `fruitsB` entries in `CARDS`** — one photo path each. For `animals`/`vehicles`, reuse one existing photo already shipped in a prior batch (e.g. `img/animals/dog.jpg`, `img/vehicles/car.jpg` — pick whichever single photo you judge most recognizable as representing the whole category). For `fruitsB`, use one of this task's new fruit photos (e.g. the apple).
- [ ] **Step 5: Add the 6 new fruit paths to `sw.js`'s `ASSETS`** and bump `CACHE`'s version string (check its current value first — it was last bumped in a prior batch).
- [ ] **Step 6: Manual verify** — open "Trái cây" (FruitBoard): confirm all 6 tiles show real fruit photos, tapping still plays the correct color-name speech (unchanged game logic). Return to the home screen for every age tab that shows the "Con vật", "Xe cộ", or "Trái cây" card: confirm each now shows a real photo instead of its emoji, every other card is unaffected, and the per-card animation still looks right. Rename one fruit image temporarily, reload, confirm that tile falls back to its emoji and stays fully tappable; restore the file. Run `node --check` on the extracted inline script, and `node --check sw.js`.
- [ ] **Step 7: Commit**

```bash
git add index.html sw.js img/fruits
git commit -m "Ảnh thật cho Trái cây + icon đại diện cho 3 thẻ game ở màn hình chính"
```
