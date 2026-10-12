# S01E02 Riverside production postmortem — 2026-10-12

**Scope:** design → picture generation → media upload → QA workflow only. Not a claim that E02 gameplay, C01 compositor or MN4 deployment is finished. E01 owner-PASS runtime remains frozen.

## Verified upload closeout

The owner reported **已上傳**. GitHub `main` is now `038f9f48a53feaf4ee7a72d2fd0bd490f0de0a2f`, after the earlier documented art/manifest main `0bc21694f0d71ff7818316e2141985fd0b9b471d`.

A GitHub compare shows **exactly six newly added binary files and no other code changes**: three `assets/production-candidates/s01e02/riverside-r[0-2]-original.png` plus `public/art/s01e02-riverside-r[0-2].webp`. GitHub size and Git blob SHA for every one **exactly match** the original-byte hash manifest:

| E02 view | Original PNG bytes / Git blob | WebP bytes / Git blob |
|---|---|---|
| R0 main | `3080156` / `4dd1af5044e3a2cc70b59870713e5ae3b20bbdeb` | `407288` / `551c24a88bca30d1e804efd49f6ff2447ff5edef` |
| R1 old stones | `3171010` / `0d4e2d72b501a6239c40109fedc96aa752545afb` | `423958` / `4e51cf22c2e4cf8cda733323de953bb889f9109d` |
| R2 lookout | `3160394` / `d230710c4986e292cda4fec1494fb36ded9b5ecb` | `429262` / `c96d260e58b9294f6edd5289ccc88cacf2803afe` |

Current-`main` E01 runtime GitHub Action **PASS** at `https://github.com/edisontw/wondervale/actions/runs/38217390123`; the older workflow verifies only the E01 originals, not full E02 file SHA-256/CRC. A new lightweight episode-media verifier/workflow is being added in this focused PR and must pass before declaring full E02 binary integrity CI PASS. No second manual upload is needed if media checks pass.

## Root causes and consequences

1. **Wrong tool boundary:** ChatGPT image generation produced image assets but the current GitHub connector can edit UTF-8 documents, not transfer large binary image bytes directly. Several historical attempts delayed delivery by trying unproven paths. **Correction:** package original PNG + compressed WebP into a stable directory-preserving ZIP; user uploads once. Assistant must immediately verify current main, not regenerate.
2. **Too much visual perfectionism:** correct-enough painterly scenes were repeatedly re-generated while investigating precise physics of imaginary bridge piers. Owner explicitly preferred the attractive original art absent an *obvious material error*, and later PASSed three separate scenes. **Correction:** accept good illustrations at a clear owner gate and separate background scenery from the accurate walkable/observation geometry. The evidence still needs to be truthfully visible on screen.
3. **Redundant serial PRs and testing:** E02 preparation crossed PR #44–#53, including repeated docs/image-study branches and full E01 Chromium tests for changes that never touched playable runtime. **Correction:** preserve only important failure learning, batch one focused layer into a PR, route binary/media changes through fast media integrity QA, reserve full E01+E02 browser regression for integrated code and release changes.
4. **Approval/status confusion:** visual PASS, binary uploaded, Git hash verified, game playable and deployed are independent facts. **Correction:** track each state separately; do not let old “media pending” prose override new GitHub evidence, and do not present CI E01 PASS as E02 browser PASS.
5. **Release scope defect found in this audit:** existing E01 `scripts/package_static.py` used `public/art/*.webp`, so after the upload, its E01-only package unintentionally contained the three E02 WebPs (combined **1,260,508 bytes** before ZIP compression). **Correction:** package only WebPs explicitly listed in E01 `PRODUCTION_INTEGRITY.json`; preserve `sw.js` E01 asset cache list. Confirm on actual latest-HEAD CI release archive.
6. **Fixed E02 play semantics remain valuable:** safe same-bank public walkway, closed old bridge, two evidence categories, qualified correction, parent cue, Chronicle/ledger once-only, and Market Lane post-revision reveal. **Do not throw away these upstream decisions to make art photorealistic or chase image pixel alignment.**

## Lock / open / next

**Locked:** owner-selected full-resolution R0/R1/R2 painterly art and filenames; exact received blobs; E02-0 geometry semantics and E02 script v1; E01 owner-PASS baseline. **Not locked:** pixel-perfect mapping of the *three independent paintings* to one animated traversable level; approved C01 sprite/feet layout; final screen art evidence legibility.

**Verified:** six source/derivative files present on GitHub main with matching size/Git blob; current main E01 CI PASS. **New gate pending:** fast all-episode PNG/WebP byte and dimensions verification on the PR's updated script.

**Open:** true E02 browser implementation, save/Chronicle, R4 delayed sign, actual 320/360/390/430 + desktop visual pass, accessibility, family feedback and MN4 deployment.

**Single next focused task after this workflow change:** build one end-to-end S01E02 playable slice from the approved WebPs and existing C01 art using the immutable E02 script, interaction spec and walkable graph. Do not ask the owner to upload again.
