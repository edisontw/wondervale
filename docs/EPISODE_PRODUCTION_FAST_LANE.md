# Wondervale — Fast Episode Production & Image Intake

**Status:** reusable production operating rule, 2026-10-12. Source: E01 production retrospective, E02 R0/R1/R2 art trials and the owner's confirmed manual GitHub image upload. GitHub `main` is the durable authority. This is a **workflow**, not a new art style, episode canon or release acceptance.

## A. Why the previous sequence was slower than necessary

| Repeated source of friction | Evidence and cause | Default rule from E02 onward |
|---|---|---|
| Many attempts to regenerate good-looking scenes because stone locations were not perfectly identical | E02 R0/R1/R2 were separate illustrations; acceptable aesthetics were treated as if they needed to be one metrically consistent 3D level. Several AI concepts were rejected or repeated for midriver footings and viewpoint mismatch | Distinguish **material canon errors** (bridge visibly open, unsafe route, early clue, character identity drift) from **nonblocking illustration variations** (stone textures, nonidentical framing). Owner may approve R0/R1/R2 as distinct illustrations; the fixed walkable/collision graph provides physical truth |
| Repeated GitHub binary upload attempts from the assistant | Generated image URLs, content IDs and a GitHub text-file connector do **not** establish transferable PNG bytes; source copies can be inaccessible across tools | **Default one handoff only:** generate selected full-resolution PNGs, make quality-checked WebPs and one ZIP preserving paths, names and hashes; owner manually uploads once. Never call a text-file GitHub API on megabytes of binary or pretend it uploaded |
| Art approved but repository/media/release readiness conflated | E02 owner PASS was recorded before the real three PNG and three WebP files existed in the repository; earlier records correctly marked upload pending | Separate **visual acceptance**, **Git binary verification**, **runtime integration** and **device/playable acceptance**. Mark the lowest proven level only |
| Long document-only PR/CI loops | E02 work crossed several narrow PRs for proposed visual blockouts and rejected attempts while E01 browser suite ran each time | In one focused layer, batch the accepted spec + manifest + QA into a single PR. Run lightweight media integrity QA after image intake; reserve full browser QA for runtime integration/change, while maintaining required current-HEAD branch checks before merge |
| New episode files entered a previous episode's release archive | The E01 packager globbed `public/art/*.webp`; new E02 WebPs were therefore picked up by E01 artifact creation | **Episode-specific asset allowlist**, never indiscriminate public art globbing. The E01 static package uses the owned E01 image list from its production manifest |
| Visual QA and gameplay QA were conflated | Camera-crop PNG and geometry-source checks said nothing about live Milo feet, followers, sprite labels, actual touch keyboard/restore, or mobile responsive behavior | Use static art preview to choose imagery, then test **actual running scene** at target device sizes. CI PASS for E01 alone does not demonstrate E02 has run |

## B. Fast lane: only four major acceptance gates

### Gate 1 — Canon/interaction locked (story and thinking)

Fetch current `main`; read README, WORK_SEQUENCE, OPEN_DECISIONS, episode brief and only necessary foundations. Finish/approve the Episode Production Brief, child agency, evidence-before-answer sequence, EFL, parent cue, line ID lock, persistence and visibility-state matrix.

**Pass means:** story/learning/interaction reference approved. **Does not mean:** any media or runtime exists. Limit scene-specific art decisions to physical hazards, reachable destinations, factual clues, mandatory camera positions and forbidden spoilers. Small visual details are delegated ordinary choices.

### Gate 2 — Art chosen and single manual upload (visual and transport)

Produce a **small set** of targeted illustration options (prefer 1–2 compositions per truly distinct needed state), use existing C01 sprite identity, and show actual images quickly. If one image is good and **no material story/safety/spoiler/identity defect** is present, accept it; **do not require separate storybook paintings to be exact world-coordinate clones**. The child still sees an honest gap from the lookout in the respective inspection state.

Once accepted:
1. Preserve original full-size PNG bytes, do not make low-res previews the source.
2. Export WebP derivatives at original dimensions (record format, dimension, quality and byte size).
3. Bundle **one ZIP** with two repository-relative destinations, source/derivative filenames and a SHA-256/Git blob intake manifest. For the present E02: `assets/production-candidates/s01e02/riverside-r[0-2]-original.png` and `public/art/s01e02-riverside-r[0-2].webp`.
4. The owner uploads the six files to one branch or directly to `main` if that is the established manual workflow; no duplicate upload instruction for files already present.
5. On receiving “已上傳,” **first fetch current `main` and check all 6 exact paths, sizes and Git blob hashes**. If files are on an unmerged branch, identify that branch before continuing. Never answer “not uploaded” from an old SHA.

**Pass means:** approved illustration selection plus verified Git media intake (after exact byte/CRC check). **Does not mean:** character assembly or episode play is ready.

### Gate 3 — One working vertical slice (engineering + perception)

Implement a **single usable path through the whole episode**, even if some optional polish/media is deferred. Reuse RPG dialogue shell, C01 role registry, desktop Parent View / mobile Child–Parent toggle, audio Listen fallback, Chronicle/save/ledger/read-only replay. Do not copy E01 board/scratching mechanics. Key E02 interactions: actual safe public path, optional order of old stones/lookout evidence, child-selected gap contradiction, non-punitive uncertainty, explicit Market Lane reveal after revision.

**Test actual rendered behavior** including first/incognito user, reload/interruption, keyboard/touch, no-go geometry, focus camera, labels/sprite feet, parent cue timing, and spoiler gates. The E02 test matrix is the single QA source; automated cases MUST run on latest PR HEAD. Keep E01 frozen, run full E01 regression on any integration PR.

**Pass means:** the integrated episode is playable in supported browsers. **Does not mean:** server deployed or family UX approved.

### Gate 4 — Device/owner PASS, then deploy

Verify actual 320/360/390/430 phone screens, desktop with parent side panel and short desktop/landscape; check that important evidence and character feet/labels are not cropped or behind the RPG dock. Test persisted state through refresh and replay, plus accessibility/read-aloud-off and a meaningful child decision.

Owner confirms **playable** episode separately from artistic PASS. Build static-only release, verify repository SHA, files/art integrity and hosted HTTPS build, preserve atomic rollback. Label CI, artifact package, actual device QA and MN4 production deployment as separate checkmarks. Then record final accepted facts, main SHA and next episode hook.

## C. Automation and single-source handoff

- Use `python3 scripts/verify_episode_media.py` to verify **all episode original PNG/WebP bytes, PNG CRC and reported dimensions** against manifests (SHA-256 and Git blob). It auto-discovers `assets/production-candidates/*/PRODUCTION_INTEGRITY.json` and `PRODUCTION_INTAKE_PENDING.json`; for a single set use `--manifest <path>`. The targeted media-intake GitHub Action uses only Python and avoids Chromium.
- E01 release builds must select only assets owned by E01. A new `s01e03` or `s01e04` media file in `public/art/` must **not** appear in a packaged E01 release.
- Review image integrity **once after upload**, never before on a phantom file. Auto verify on GitHub push/PR, then re-check manifest status/provenance before integration.
- Keep a **single** current episode ledger/state sheet; do not multiply handoff documents for every rejected image. Document only accepted decisions, important failure modes, changed contracts and measured tests. Rejected standalone illustrations can be summarized in a short QA note.
- A brief recurring status should contain: `main SHA`, `locked`, `actually tested`, `still open`, and `one next task`. Do not re-open owner-PASS image art unless a **reproducible material defect** appears in the playable frame.
- **Speed guardrail:** batch related text/docs and minor cosmetic corrections; avoid generating 5+ visually similar versions for subtle perspective shifts. Do not relax story reasoning, safety path, spoiler, C01 identity, state or accessibility contracts to gain speed.

## D. What the next worker should actually do (E02)

1. Verify all six E02 media files in the **current** GitHub main, using the manifest and fast GitHub media QA. Never ask for a second upload if they match.
2. Note R0/R1/R2 **owner art PASS** and freeze new concept generation. Use the PNG/WebP media for display, the R0 v2 path graph for legal movement, and the locked E02 script/interaction spec for player actions.
3. Prioritize a small **E02 playable** engineering PR: move Milo on near-bank routes, click two evidence stations (either order), choose gap evidence, record hypothesis revision, reveal Market Lane only at the correct point, update Chronicle and save/replay. Use the C01 speaker/actor sprite assets without regeneration.
4. Run E02 interaction tests and existing E01 full browser regression; check phone crops and actual sprite placement. Only then request a **playable** owner PASS, followed by deployment.
