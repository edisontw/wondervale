# E03 M0 — one-path engineering slice (2026-10-16)

**Baseline main:** `986689382718555490ef54fa142c0610c18cd028`, freshly fetched before work. **Build:** `20261017-e03-carried-props2`. **Status:** runnable engineering preview; full Gate 3, owner dialogue/playable approval and physical-device acceptance **OPEN**. MN4 deployment is a separate preview release gate.

## Scope and unchanged authority

Approved EPB rev 2, candidate script rev 2, interaction spec rev 2 and verified M0 intake govern this slice. No new story/canon, no new illustration, no SVG sketch modification, no prerecorded audio. All 79 candidate caption IDs and exact text compile from the current script; unused conditional stop-at-stairs lines are not falsely played on the L-first path. E01/E02 runtime, tests, art, ledgers and release scripts are unchanged.

One usable path: begin → carry books to bookstall → return along the same real graph → take cup cart to tea → inspect steps/arcade and identify a cargo constraint → return → carry flowers on the stable outer spur → return → choose current-day WALK/CART signs → approach/inspect old stone → hear coordinator's station memory and garden resident's garden memory in either order → Chronicle → explicit finish. No timer, lost cargo or scored failure. Repeated help offers observation then confirmation without automatic reasoning credit.

The three loads are now separate in-world visuals attached to Milo's actor: a book bundle sits at his hands, an upright flower tray sits in front of his body, and the tea-cup handcart rolls behind him with visible handle, cups and wheels. They are DOM/SVG presentation components, not new background art; they move whenever Milo's committed route animation moves and disappear on delivery. Browser coverage checks all three load visuals during the canonical story and verifies each remains inside Milo's actor.

## Visible geometry and honest limits

`engine/s01e03.mjs` owns source-pixel feet nodes, edges and walk/cart/stable-tray flags. Each movement commits only its next adjacent node; animated actors and followers use that same polyline, without a separate decorative path. Reload at an interrupted edge resumes from the last committed safe node. All three visible destinations are connected bidirectionally by the outside lane. The cart cannot enter the arch-side foot branch. Center unloading has no through-edge; cargo-silhouette sampling checks the drawn route against its occupied area. These authored widths/footprints are engineering values, **not** a complete swept-cart/turn-clearance proof.

| Stop | M0 source-pixel feet | Purpose |
|---|---|---|
| H | 275,656 | Collection point on left paved approach |
| west / bend / front / east | 350,691 / 470,747 / 670,788 / 880,790 | Continuous outside arc below cargo |
| fork / ramp0 / ramp1 / ramp2 / ramp3 | 1085,731 / 1160,644 / 1190,535 / 1285,428 / 1394,342 | Wide paved approach to upper bookstall |
| B / T | 1432,305 / 1370,656 | Shop arrival points on pavement |
| flowerTurn / F | 950,870 / 1040,885 | Approach in front of flower planters |
| stone | 1125,708 | Safe approach beside existing pillar, not inside it |
| archApproach / arch | 946,664 / 847,573 | Foot-only entrance branch; no invented exit connection |

**S/N do not have proven visible through-connections.** The illustration hides parts of the stair approach and rear arcade exit behind masonry/planting. Their real-image inspection crops are available, but this slice does not claim S/N book-delivery alternatives or failed-cart entrance traversal. No offscreen connector, fake ramp or teleport is fabricated. Full alternative walking paths and corresponding fork signage are still required by the approved interaction contract. The initial WALK-to-books and CART-to-tea signs both point along the valid visible outer lane; they do not imply a validated S/N shortcut. This is an explicit partial implementation, not a redefinition of upstream topology.

The low-left masonry stays noninteractive. Flower focus transforms the same unchanged M0 plate, actors, cargo and glyph together; it is not an alternate invented location. Caption dock sits outside the scene. Names sit above actors so the focus cannot hide feet under labels. The old glyph uses the existing glyph asset on existing stone and remains distinct from new signs; intentional inspection, not mere presence, awards discovery.

## Persistence and prerequisite contract

- E03 key: `wondervale-s01e03-progress-v1`; schema 1, content `s01e03-slice-v1`. One atomic checkpoint contains accepted action history, pending dialogue, committed position/remaining itinerary and event ledger. Restore reconstructs state from history and rejects contradictory snapshots. History is bounded to 4,000 accepted actions.
- E02 is read-only. The existing frozen E02 restore/projection validates actual completion plus Market marker; two arbitrary event strings alone do not unlock E03. The locked landing offers an explicit **Preview without saving** mode. It uses a temporary noncanonical world and never fabricates E02 completion or writes E03 progress; exit returns to the locked landing. Canonical play still requires the validated E02 save.
- Each of the nine proposed E03 milestones emits once. The cart reasoning milestone records a changed-load comparison, not a fabricated failed route. Parent cue follows an observed constraint and is optional.
- Historical replay derives the temporary world in memory, emits no canonical ledger and returns no save payload. Replay can be exited to the saved chapter. Confirmed restart clears E03 only; denied deletion reports failure. Denied writes leave the story playable with a warning.
- Chronicle keeps today's deliveries/signs distinct from two attributed, unverified memories. No route chronology verdict or Common reveal.

## Executable evidence and release boundary

`tests/s01e03.test.mjs`: nine engine groups. `tests/s01e03-browser.mjs`: 22 browser result records and screenshots, including full touch story at 568×320, 320/360/390/430 portrait, 667×375 landscape, 1366×900 and 1024×600 desktop, interruption, replay, reset, storage refusal, keyboard modal focus and parent controls. See the matrix's bounded coverage mapping. Source-art and rendered screenshots were visually inspected; actual phone/owner evaluation remains open.

`scripts/package_e03.py` allowlists nine runtime dependencies: E03 HTML/CSS/UI/engine/content, the frozen E02 engine solely for prerequisite validation, existing C01 sprite/glyph and M0 WebP. It excludes PNG masters, E01/E02 UI/content/art and all SVG drafts. Neither earlier release packager is changed. Artifact path: `dist/wondervale-e03-preview/`, entry `e03/index.html`; no MN4 deployment workflow is added.

Local Windows E01/E02 regression and Linux PR-head CI are recorded separately. A frozen E02 local browser assertion about minimum Chronicle scroll overflow failed with content 211px vs visible 208px under Windows fonts; do not change accepted E02 to accommodate this environment. Linux current-head E02 CI must pass before merge. Local E01 browser baseline PASS (no page/HTTP errors); E01/E02 engine regression: 46 groups PASS. All-episode media integrity: 15 images / 3 manifests PASS.

**Next focused task:** resolve S/N occluded pedestrian connections in a bounded same-art inspection/staging solution; then demonstrate all promised book routes, cart boundary recovery, continuous clearance and mobile perception before full Gate 3 acceptance. Keep M0/C01 and E01/E02 frozen.


## 2026-10-17 — PR candidate: opening book at Milo's carrying side

At verified main `c0704548bdc8d755d0c2893023b6b129da9d3194`, current-head Chromium artifacts from [E03 CI run #39001641794](https://github.com/edisontw/wondervale/actions/runs/39001641794) show the pale rectangular book tile over Milo's upper body in the 568×320 opening screenshot and desktop 1366×900 market screenshot. The prop passes the original DOM-presence and minimum-size checks but looks like a hovering UI card, not books carried by the child. This is a **confirmed screenshot presentation defect**, not a new upstream art or story decision.

Scoped proposed correction: move the existing book-bundle artwork toward Milo's carrying side at waist/hand height; scale below one actor-width, remove the square paper fill/border and retain a narrow, soft shadow for contrast. Add viewport-geometry regression checks for side, height, relative size and lack of floating square on 568×320 and the existing seven responsive sizes. Do not change the inline SVG content, book delivery/game semantics, M0/M1 image bytes, trio sprites, E01/E02, episode save, or the two other loads. Recheck fresh PR-head screenshots before considering merge; source geometry tests do **not** prove owner visual/device acceptance or the scene is flicker-free on a phone. The live MN4 page was not remotely controllable in this session, so CI screenshots are explicitly the visual evidence source, not a claimed live-device PASS.

**PR-head initial visual iteration:** CI screenshot from [PR #100 first E03 run #39003470352](https://github.com/edisontw/wondervale/actions/runs/39003470352) shows the rectangle removed and Milo's head/torso unobstructed, but the bare book bundle becomes hard to distinguish from dense market texture at 568×320. The proposed second CSS-only pass keeps the transparent bundle and actor-side position, sets a bounded minimum apparent pixel size with `clamp()`, and adds a pale edge glow rather than restoring a rectangular UI tile. Fresh CI screenshots and owner judgement are still required before promotion.

**PR-head second visual iteration:** [E03 run #39003699572](https://github.com/edisontw/wondervale/actions/runs/39003699572) PASS with the enlarged transparent stack and better actor clearance, but full 568×320 screenshot still does not make the small dark stack reliably identifiable against the cobbles. Therefore a **compact, bounded parchment wrapper** is being trialled *at Milo's right/hand side only*; its footprint is at most approximately one actor width, rather than the earlier oversized chest-covering square. This is not a new illustration or change to the SVG drawing. A fresh rendered PR-head review is mandatory; physical-device and full Gate 3 remain OPEN.
