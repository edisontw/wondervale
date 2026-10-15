# E03 Gate 2 — Isolated Bookstall Component R1

**Date:** 2026-10-15
**Status:** **isolated alpha/media workflow SOURCE + RASTER PASS**, but **NOT owner painterly-art PASS**. This is one Bookstall proof only; Tea, Flower, C01 characters, game logic, E03 runtime, E01/E02 and audio are unaffected.

## Source of truth and provenance

- Locked parent stage: [R2 Market Lane SVG](MARKET_LANE_LAYERED_R2.svg), [R2 route graph](MARKET_LANE_TOPOLOGY_R2.json), approved **static geometry/mobile preview only**. R2 source/graph are unchanged in this branch.
- Authoring source: [MARKET_BOOKSTALL_COMPONENT_R1.svg](MARKET_BOOKSTALL_COMPONENT_R1.svg), self-contained original transparent vector element, **340×286**, with warm paper, book-spines, awning/tile, shade, and foliage details. No people, street, sky, river, labels, text, route arrows, extra scenery or plot clues.
- Placement contract in 1600×900 R2 artboard: **x=1170, y=8**. The fixed destination/approach node **B=(1350,335)** and legal path graph are **not** relocated. No shop collision polygon is defined by this artwork.
- One additional targeted image-generation request once again returned a **full village scene**, not a single transparent Bookstall. That output is **not adopted** (prior failed extraction QA applies). To avoid repeat attempts, this proof uses hand-authored *independent SVG source* instead of cropping a whole-market raster. This is a controllable independent component **but not a high-end hand-painted raster**.

## Repeatable evidence

- [Python raster+alpha+placement QA](../../../scripts/render_e03_bookstall_proof.py) checks a true RGBA component, transparency in all four corners, nonempty bounded silhouette, top safe margin and a coarse forbidden-approach-disk check at B/J/T/W; renders original R2, Bookstall-only composition, optional décor+Bookstall and desktop/mobile comparisons.
- [CI workflow](../../../.github/workflows/e03-bookstall-proof.yml) produces a **temporary, non-production** GitHub Actions diagnostic ZIP.
- [HTML viewer](MARKET_BOOKSTALL_VISUAL_QA_R1.html) offers full 1600×900 / landscape 667×375 / landscape 568×320 / portrait letterbox; toggle new Bookstall, old décor and mock RPG dock independently. Browser playability is **NOT** inferred.
- Latest source+CI proof of this iteration: **340×286 PNG**, source SVG SHA-256 `d0708e67f8ac5313c374420994629425533a468be51a6284906ba058b7c96ca6`, alpha coverage 0.6403 at threshold 20, alpha bounding box (13,4)–(328,279), component placement **(1170,8)**; protected B/J/T/W approach disks clear. The GitHub run may change with a subsequent SHA; use current branch CI artifact and report for latest evidence.
- Scene comparison at **568×320**: book shop is distinguishable by its two rows of books, and the arrival pavement remains unobstructed. At the 1600×900 frame, the independent roof and facade rest within the composition and do not touch the upper crop after the 12-pixel downward correction.

## QA interpretation / known visual shortcomings

**PASS (technical prototype):** single genuinely separate backdrop-free art unit, transparent alpha, reproducible component sprite, non-distorted scale in scene, coarse safe margin and visible book landmark on the small scene preview.

**NOT PASS (final art):** source SVG looks **flat/vector-like**, still materially less tactile than the rich Illustrated Living Diorama reference. Painterly finish and detailed material integration require actual independent texture/material authoring; the two adjacent pre-existing shop/roof elements can still look duplicated if this component is layered together with the optional old decorative overlay. A future integration should **replace** corresponding R2 Bookstall decor group instead of casually stacking two full bookshops in final art. Also not proven: accurate avatar foot placement, collision turn radii, Child/Parent layout, real mobile viewport, load scripts, source-original PNG/WebP intake, owner visual approval.

**Next single focused task:** obtain owner review of the *actual Bookstall-only R2 compositing proof*; if the new **component method** is accepted but style needs improvement, upgrade texture/brush quality **within exactly this component bounding space and alpha**. Do **not** begin Tea/Flower batch or promote media until the isolated Bookstall image looks consistent with the intended final art.
