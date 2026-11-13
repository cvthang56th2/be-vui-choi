# Realistic Images Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace emoji with real photos for the two flagship object-recognition games — Con vật (Animals) and Xe cộ (Vehicles) — while keeping every other game untouched and keeping offline play working.

**Architecture:** Generalize the shared `makeBoard()` tile renderer to optionally render an `<img>` (with emoji fallback on load error) when an item carries an image path, then supply image paths for the 12 items in `AnimalBoard`/`VehicleBoard`. Images are bundled under `img/`, shipped via a build-script change; the service worker's existing stale-while-revalidate fetch handler caches them for offline use automatically — no `sw.js` change needed.

**Tech Stack:** Vanilla JS/HTML, native macOS `sips` for image resize/compress (no new npm dependency), `scripts/build.mjs` gains recursive folder copy.

**Spec:** [docs/superpowers/specs/2026-11-13-realistic-images-design.md](../specs/2026-11-13-realistic-images-design.md)

## Global Constraints

- Only `AnimalBoard` and `VehicleBoard` change this batch — no other game's rendering changes.
- Each image ≤ ~50KB, square, ~400-600px — total batch ≤ ~600KB added.
- Must degrade to the existing emoji if an image is missing/fails to load — never a broken-image icon or blank tile.
- No change to game logic: sounds, scoring, round counts, speech text stay exactly as they are — only the visual item rendering changes.
- License/source must be stated to the user and approved before any image is downloaded (per item: source, license, approx size).

## Review Focus

- An image 404s (file renamed/missing, or offline before first cache) — the tile must show the emoji instead, not a broken-image glyph, and must still be tappable with sound/speech working.
- A future caller of `makeBoard()` that doesn't pass an image path (none exists yet, but the signature must stay backward compatible) must keep rendering exactly as before.
- Image aspect ratio inside `.btile` (currently emoji-sized via font) must stay square-ish and not distort or overflow the tile at small phone widths.
- First-ever offline load (before the service worker has cached anything) with no network — current `sw.js` only precaches the `ASSETS` list (not images); confirm this is an accepted, pre-existing limitation (same as any other new asset) and not a regression this batch introduces.
- Total payload growth must stay within the ≤600KB budget from the spec — verify actual file sizes, not just estimates.

---

### Task 1: Source and prepare the 12 images

**Files:**
- Create: `img/animals/{dog,cat,cow,chicken,duck,pig}.jpg`
- Create: `img/vehicles/{car,train,airplane,firetruck,bus,bicycle}.jpg`

- [ ] **Step 1: Find candidates.** Search Pixabay/Pexels for a real photo of each of the 12 animals/vehicles (plain/simple background, license allowing free use without attribution). Propose the shortlist (source URL + license per item) to the user and get explicit approval before downloading.
- [ ] **Step 2: Download the approved images** into a scratch location.
- [ ] **Step 3: Resize and compress each** to a square ~500×500 JPEG using macOS `sips` (e.g. `sips -z 500 500 -s format jpeg -s formatOptions 70 <in> --out <out>`), saving as `img/animals/<name>.jpg` / `img/vehicles/<name>.jpg` matching the filenames above.
- [ ] **Step 4: Manual verify** — `ls -la img/animals img/vehicles` and confirm each file is present and ≤ 50KB; open each in the browser pane or Preview to confirm it's recognizable and not distorted.
- [ ] **Step 5: Commit**

```bash
git add img/animals img/vehicles
git commit -m "Thêm 12 ảnh thật cho game Con vật và Xe cộ"
```

### Task 2: Teach `makeBoard()` to render images with emoji fallback

**Files:**
- Modify: `index.html:2149-2161` (`makeBoard`)
- Modify: `index.html:2162-2163` (`AnimalBoard` item list)
- Modify: `index.html:2164-2165` (`VehicleBoard` item list)

**Interfaces:**
- Item shape stays a plain array; adds an optional 5th slot `it[4]` = image path string. `[emoji, label, speech, sndKey?, imgPath?]`.
- `makeBoard(id, stageSel, items, promptHtml, speech, anim)` signature is unchanged.

- [ ] **Step 1: Edit the tile template in `makeBoard`'s `start()`** (`index.html:2152`) so each tile renders `<img class="btimg" src="${it[4]}" alt="${it[0]}" onerror="this.outerHTML='<span class=&quot;be&quot;>${it[0]}</span>'">` when `it[4]` is truthy, otherwise the existing `<span class="be">${it[0]}</span>`. Keep the rest of the tile markup (label text, sound/speech wiring on `pointerdown`) exactly as-is — it already reads `it[0]`/`it[1]`/`it[2]`/`it[3]` and doesn't need to know about `it[4]`.
- [ ] **Step 2: Add a `.btimg` CSS rule** near the existing `.btile`/`.be` styles so images render square, contained, and centered in the tile (e.g. `width/height: ~55%` of tile, `object-fit: cover`, `border-radius` matching the tile).
- [ ] **Step 3: Add image paths to `AnimalBoard`** (`index.html:2162-2163`): append `'img/animals/dog.jpg'`, `'img/animals/cat.jpg'`, `'img/animals/cow.jpg'`, `'img/animals/chicken.jpg'`, `'img/animals/duck.jpg'`, `'img/animals/pig.jpg'` as the 5th element of each item, in the same order the items already appear (dog, cat, cow, chicken, duck, pig).
- [ ] **Step 4: Add image paths to `VehicleBoard`** (`index.html:2164-2165`): append `'img/vehicles/car.jpg'`, `'img/vehicles/train.jpg'`, `'img/vehicles/airplane.jpg'`, `'img/vehicles/firetruck.jpg'`, `'img/vehicles/bus.jpg'`, `'img/vehicles/bicycle.jpg'` in the existing item order (car, train, airplane, fire truck, bus, bicycle).
- [ ] **Step 5: Manual verify happy path** — in the browser pane, open Con vật and Xe cộ, confirm all 12 tiles show the real photo, tapping still plays the right sound and speaks the right label/sound-word (unchanged behavior).
- [ ] **Step 6: Manual verify fallback** — temporarily rename `img/animals/dog.jpg`, reload, open Con vật, confirm that tile shows the 🐶 emoji instead of a broken image and is still fully tappable/working; restore the file.
- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Dùng ảnh thật cho game Con vật và Xe cộ, có ảnh emoji dự phòng"
```

### Task 3: Ship the new image folders in the build

**Files:**
- Modify: `scripts/build.mjs`

**Interfaces:**
- Consumes: `audio/` recursive-copy helper added in the background-music plan's Task 1, if that plan lands first — otherwise add the same small `cpSync(src, dest, {recursive:true})` helper here.

- [ ] **Step 1: Add (or reuse) a recursive copy step** in `scripts/build.mjs` for `img/` → `www/img/`, alongside the existing flat `FILES` loop.
- [ ] **Step 2: Manual verify** — run `npm run build`, confirm `www/img/animals/*.jpg` and `www/img/vehicles/*.jpg` all exist and match the source files' sizes.
- [ ] **Step 3: Commit**

```bash
git add scripts/build.mjs
git commit -m "Copy thư mục img/ vào build"
```
