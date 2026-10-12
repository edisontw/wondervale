# E02-3 Riverside same-geography art study v3 — 2026-10-12

**Status: VISUAL AUTHORING STUDY / SOURCE QA PASS, PRODUCTION ART NOT APPROVED.** No changes to E01, story canon, E02 runtime, original R0 v2 geometry or existing approved character identities.

## Scope and provenance

Verified GitHub `main` at task start: `ff78540f4e979b0852b741d68746a2140070e1e2`. Read project README, WORK_SEQUENCE, OPEN_DECISIONS, E02 visual contract, R1/R2 QA, EPB and visual bible.

Earlier image-generation attempts repeatedly produced attractive fantasy scenes with **stone piers side-by-side in the water**, rather than the two shore ends aligned on one transverse axis. One concept sheet also baked answer-adjacent travel signage into an infographic. **None of those images is promoted to production R0/R1/R2.**

To avoid repeating the same geography regression, E02-3 now uses source-controlled **single-master SVG art studies**:

| File | Purpose | Status |
|---|---|---|
| [R0 v3 art study](../../../assets/reference-candidates/s01e02/riverside-r0-art-study-v3.svg) | Starts with exact previous R0 v2 SVG and adds nonstructural water glints, flower flecks, stone moss, far-bank foliage and gentle sky accents; original walkable road and bridge-base shapes remain | CANDIDATE |
| [R1 v3 close view](../../../assets/reference-candidates/s01e02/riverside-r1-old-stones-art-study-v3.svg) | Same complete v3 drawing with 16:9 `viewBox=270 285 950 534.375` to inspect opposing old bases | CANDIDATE |
| [R2 v3 close view](../../../assets/reference-candidates/s01e02/riverside-r2-look-across-art-study-v3.svg) | Same complete v3 drawing with 16:9 `viewBox=475 310 1020 573.75`, camera only, no Milo position change | CANDIDATE |
| [Offline art QA viewer](../../../assets/reference-candidates/s01e02/riverside-r0-r1-r2-qa-viewer-v1.html) | Browser-openable review page with R0/R1/R2 controls, 320/360/390/430 px preview sizes, focus control and caption dock. **Not episode runtime** | Candidate design QA |

New art study source is an illustrated/vector/ink-wash **work-in-progress** rather than an assertion that high-end hand-painted production artwork has been achieved.

## Checks executed and their limits

- **PASS: source equality.** Verified all SVG geometry and decorative draw instructions from `<defs>` to closing `</svg>` match across R0/R1/R2, aside from the intentional camera viewBox and human-readable alternate description. All three inherit the identical R0 v2 safe route, protection/fence, separated near/far landing and open water gap.
- **PASS: source spoiler/nonactor.** No baked `Market Lane`, SVG `<text>`, extra NPC/pet, E01 portrait replacement or embedded raster image.
- **PASS: source QA viewer linkage.** Three working button handlers represented in HTML source, size presets (320/360/390/430) and a separate placeholder caption dock. Actual Chromium visual comparison still needs execution.
- **PASS: locally generated illustrative review export.** A locally available v2-geometry-equivalent PNG plus an SVG atmospheric overlay was composited into one R0 study, then cropped into matching R1/R2 PNGs. A contact sheet and ZIP for user review were produced during the conversation. These are **not byte-identical GitHub v3 SVG renders**, and those PNGs have **not been uploaded to GitHub**.
- **NOT PASS: final illustration quality.** The controlled version preserves facts but remains deliberately simple compared with the rejected painterly AI scene candidates. Color/texture is not a substitute for professionally consistent finished environment art.
- **NOT RUN:** actual approved C01 actor compositor, rendered exact SVG browser QA, phone hardware/keyboard/touch/Listen, persistent E02 game events, E02 test matrix, art owner PASS, final E02 original binary asset integrity, deployment.

## Art-production recovery decision

The repeated scene regeneration failures are **not** solved by producing another self-contained AI infographic. The correct next production step is to use the v3 same-bank geometry as a **fixed underlay / art direction constraint** and create one unlettered, character-free premium painterly environment **without independently inventing bridge piers, paths or buildings that suggest a crossing**. Crop R1/R2 from that accepted master, not independent generations. Keep any stylized mask/PSD layers separate from walkable masks. Review a real browser render at a narrow phone frame with C01 sprites before owner visual acceptance.

**Gate status:** E02-3 remains `candidate_visual_source`, not `reference_approved`, `production_asset` or `runtime_ready`. Next focused task: high-fidelity art **conforming to the exact near/far shoreline base placement**, and browser+owner visual QA. E01 continues frozen.
