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


## 2026-10-17 — Owner scene / props / portrait handoff update

Owner accepted prior E03 visual positioning and explicitly requested the latest Market Lane scene, book bundle without its floating parchment background, a richer flower delivery object, and distinct coordinator / garden-resident RPG dialogue headshots. The current runtime M0 WebP has the **exact** SHA-256 of an independently generated Q88 WebP of the user-supplied 1672×941 screenshot; no second scene WebP transfer was needed. However GitHub's current M0 PNG is an RGB copy of the prior M1 image rather than byte-identical to the latest user-supplied RGBA PNG. The updated production manifest records this distinction and actual blob hashes. Source media bytes and C01/E01/E02 remain unchanged by this scoped runtime revision.

The inline book bundle has transparent surrounding pixels instead of the former cardboard-looking rectangular backing; the flower tray has multiple layered blooms and foliage. The coordinator and resident now each receive a separate E03-only illustrated dialogue icon at the same portrait slot/size as the current caption UI. These are **provisional visual role identifiers**, not owner-locked NPC identity sheets. Regression coverage verifies transparency, petal detail, and NPC heads during their respective speech lines; physical-device legibility and final NPC appearance still need owner confirmation.

Build `20261017-e03-market-props-npc1`. Hidden S/N path integration, cart physical clearance, full Gate 3/device acceptance and prerecorded audio remain OPEN. Do not reopen E01/E02, C01 or Season story/learning decisions.


## 2026-10-18 — Source-image perspective in actual E03 playable scene

Verified starting main: `4c77d62f77783a3fbac459d263cfcac5d16a7fc4` (PR #101). M1 actor-depth review previously owner PASS; the main game still used fixed-size actors on L, so Milo appeared too large at the elevated bookstall. This scoped implementation imports the **same** review curve (`actorHeight`) and shoe-grounded C01 Milo viewBox (`60 0 490 990`) into the game. Nia/Finn use 90% perspective scale and their existing C01 atlas crops. All three actors' width and height interpolate at each animation frame, and cargo remains a descendant of Milo, scaling with him. No independent sprite teleport, opacity fade, new art, or save/ledger change.

Tests validate source height and shoe alignment at 568×320 and seven mobile/desktop sizes, reduction toward the distant bookstall and current checkpoint/replay isolation. The package allowlists view-only `e03/perspective.mjs` as a tenth runtime dependency; review-only `e03/route-depth.mjs` and its masks remain excluded. **Foreground occlusion polygons are not applied in the playable runtime** in this step: L remains the only implemented continuous route. Additional occlusion/physical cart clearance needs a separate validation. Candidate build `20261018-e03-perspective1`; owner/device PASS and full Gate 3 remain OPEN.

A direct diagnostic overlay on the current 1672×941 image revealed that N's review centerline passes through the tops or occluded back of central unloading crates, not demonstrably on walkable pavement. Do not promote the N route just because a line can be drawn. S terrace floor continuity and L cart turns also remain unverified. E01/E02/C01 and the selected WebP are unchanged.


## 2026-10-18 — MN4 deployment allowlist parity fix

The PR #102 perspective integration passed E03 browser, M1 review/depth, E01/E02 and archive packaging CI and merged to main `6c0288f2b569989d1d1a16207b0783f66f779eca`. The **main deployment** [run #39053272646](https://github.com/edisontw/wondervale/actions/runs/39053272646) failed **before symlink switch** because the remote server's strict E03 archive allowlist in `scripts/mn4/deploy_e02.sh` did not include the new view-only `e03/perspective.mjs`; log: `Unsafe/unexpected E03 archive member: ./e03/perspective.mjs`. The remote validator safely blocked that unrecognized file, so this run is NOT deployment PASS.

Fix scope: add this one accepted E03 module to the remote allowlist; add a source CI test that compares the local E03 packager `FILES` set with the remote server acceptance set **before** expensive browser QA or SSH. Preserve strict archive type, hash, membership and symlink protections; never relax the validation broadly. No gameplay, C01/E01/E02, scene-media or audio changes. After merge, require the new main MN4 deploy job to PASS and report the resulting SHA and live-build status.


## 2026-10-18 — L-route centerline clearance audit (not a pass of physical cart clearance)

Start from verified main `96112c88d1ea5b8a726f3aea5d0ef5e06dd3b313`, build `20261018-e03-perspective1`, owner PASS for the preceding perspective release. **Defect found:** every edge in `engine/s01e03.mjs` advertised `clearance:80` without measured pavement width or cargo swept-envelope evidence, although the flag was unused by routing. The metadata has been changed to `clearance:null` on every edge. This does not change cart/walker eligibility, graph nodes, scene art, event history, persistence, UI or any shipped chapter outside E03.

A deterministic centerline-to-simplified-unloading-silhouette scan at 2-pixel sampling intervals finds approximately **37 px on west→bend** and **41 px on bend→front**, despite both being cart-enabled. These distances are screen-coordinate gaps to a painted boundary, **not a measured physical passable corridor**, and cannot prove that cart wheels, handles, turning, Milo's sprite or companion positions avoid cargo/railing. In particular, the existing decorative cart is much wider than an infinitesimal centerline. The N candidate contains waypoints on/behind the unloading cargo and S terrace ground remains occluded, so neither route is promoted. S/N stay inspection-only. L remains a playable preview without claiming full Gate 3.

Regression `tests/s01e03.test.mjs` now asserts that no edge advertises fabricated clearance, verifies the two existing L pinch points against a bounded source-pixel cargo silhouette, confirms the N review path is still unverified, and keeps the cart out of the arch. Results are *diagnostic* rather than a physical collision PASS. Later geometry changes must update/replace the forensic pinch baselines only after new art-coordinate evidence. Next focus: trace actual walkable paving edges, model perspective-dependent cart footprint/swept turns on L, and validate S/N connections in the approved art before adding gameplay routes. Physical phone/owner PASS, recorded audio and full Gate 3 remain OPEN.

## 2026-10-18 — Cart visual-envelope swept path (Gate 3 diagnostic, NOT clearance PASS)

Main baseline verified at `9835dec80185fb168714d7dc9ba8395de58cde9f` (PR #104). The accepted outer-lane cart animation follows Milo, but centerline-versus-crate checks could not detect the wide rendered cart entering the central unloading painted area. The new `scripts/audit_e03_cart_sweep.mjs` parses the **last effective** `.load-cart` CSS percentages, reuses `e03/perspective.mjs` for Milo's size at each interpolated point, and converts the visible handle/tray/cup/wheel SVG frame into approximate source-image coordinates at 3-pixel walking intervals along `route('H','T','tea_cart')` and its legal reverse. Each frame tests conservative cart bounding polygon against the previous simplified central unloading polygon; it reports segment-wise overlap samples and min display-envelope clearance.

The first conservative local probe shows *possible rendered envelope overlaps* along west→bend, bend→front, front→east and east→fork; they were invisible to the centerline-only test. The report `test-results/e03-cart-sweep-report.json` and art-backed `test-results/e03-cart-sweep-overlay.svg` are automatically attached to E03 CI artifacts. The SVG references the existing local scene asset; it does not generate or modify art or ship with the game. The probe intentionally does **not** model actual ink opacity, real passage boundaries, cart rotation/yaw at corners, or wheel-track swept radius. Potential overlaps therefore require visual/manual review, not an ungrounded automatic routing ban; conversely, zero overlap would not prove clearance.

No waypoint, route eligibility, story/learning, dialogue, persistence, CSS sprite or packed runtime file is changed by this QA layer. The accepted L gameplay remains available. **Decision OPEN:** verify cart placement and drawable cart yaw/orientation against actual paving and foreground fence, fix defensible collisions in a separate scoped implementation with owner/device review, then consider S/N walkability and full Gate 3. E01/E02/C01 and recorded audio remain untouched/deferred.
