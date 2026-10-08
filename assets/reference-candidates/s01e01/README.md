# S01E01 — Reference Candidate Intake

**Branch:** `art/s01e01-reference-candidates`  
**Status:** Awaiting original full-resolution candidate upload and visual review.  
**Visual style:** `wondervale-illustrated-living-diorama@1` (style grammar approved; actual character design unapproved).  
**Current target:** `ref-wv-trio-neutral-v1` — shared Milo / Nia / Finn identity sheet.

This is the **candidate area**, not the approved production asset folder. Keeping candidates in a draft PR prevents unreviewed character faces/wardrobes from becoming canon.

## One action to complete the upload

1. Download the **original resolution** of the Canva three-character image, *not* its 200-pixel thumbnail. Its recorded generated dimensions are 1536 × 1024. If the actual image is disappointing, instead generate and download a replacement with [Reference A prompt](../../../prompts/season-01/e01/26-trio-reference-manual.md).
2. On GitHub **switch to this branch**, open this directory and select **Add file → Upload files**.
3. Upload the original image as `s01e01-trio-neutral-candidate-01.jpg` or `.png` **according to the file's real format**. Do not simply rename a JPEG as PNG. Commit to `art/s01e01-reference-candidates`, not `main`.
4. The draft PR will automatically include the added image. Request review in ChatGPT after committing it; verify actual SHA, dimensions and contents and then decide `approve`, `revise` or `reject`.

**Never substitute** the old 48×30 smoke-test PNG, the old Riverside-revealing scene illustration, a 200×133 Canva thumbnail, or an expiring CDN link. All four are **not usable** as the authoritative trio sheet.

## Grounded current source candidates

- **Canva image generated 2026-10-08**, media ID `MAHXYFZZA0A`, recorded `1536×1024`. This is a **candidate only**; content has not been viewed at full resolution or visually accepted. Open the saved media within the connected Canva account to download the original.
- **Prior ChatGPT wide scene image** is **REJECT for use as E01 Reference A**: includes premature `RIVERSIDE` signage and visual direction/props that conflict with the fixed Reference A goal. It is a scene illustration, *not a neutral trio model sheet*.
- **GitHub binary smoke-test PNGs** are verified transport tests only.

## Acceptance gate, after file is committed

1. Original resolution/actual encoding and committed Git blob verified.
2. Milo, Nia, Finn are three separately readable children ~8, ~8, ~9, same style/scale with full bodies; no scene, no text, no final world facts.
3. Characters distinguishable in grayscale and reduced phone-size silhouette views.
4. Milo as active protagonist; Nia thoughtful observation; Finn practical playful challenge; no huge goggles/tool stereotype.
5. Illustrated 2.5D painterly storybook grammar, not generic glossy 3D film still; usable as source for front/side/3/4 reference sheets.
6. Source, generation model if available, tool, date, prompt/version, review status and license/usage notes recorded.
7. Only after actual character reference approval may E01 Square and further scene/pose references proceed.

Review authority: `docs/CORE_TRIO.md`, `docs/VISUAL_STYLE_BIBLE.md`, `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md`, `prompts/season-01/e01/25-visual-reference-set.md`. This folder and PR do **not** change the character canon or open E01 bulk production.

### The remaining limitation

The connected GitHub tool accepts real binary Base64 blobs but cannot directly read `/mnt/data` files in the separate image-generation/container runtime. Full-resolution generation-to-GitHub transport has **not** yet been verified automatically. For this one reference image, browser/manual upload on the prepared branch is the safest available route.
