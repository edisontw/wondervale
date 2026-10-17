# E03 M1 — art and actor-depth visual PASS; runtime pending

**LATEST OWNER DECISION (2026-10-17):** Owner replied “pass” to the corrected review `e03/route-review.html?depth=2`, accepting feet, perspective and foreground occlusion visually. Reviewed main: `3ef426e1990c0cbe425e36b252450f2a428571f3` (PR #94; E01, E02, E03 and media CI all PASS). This closes the actor-depth owner-review item only. M1 art and this review correction are locked; physical cart clearance, S/N/L runtime integration, save/replay, actual device/playable acceptance and deployment remain OPEN. No media bytes or runtime changed for this acceptance.

**Previous owner decision (2026-10-17):** M1 scene art is accepted as usable: “pass，勉強可以，但人物會出現在，欄杆前面，像出現在空中”. This supersedes the earlier **unaccepted art** disposition below, while preserving its physical-route caveats. Owner requested actor depth correction; acceptance of that correction, full game routes, actual devices and deployment are still OPEN. Baseline for this fix: freshly fetched main `e75b2f3da7b23ebcb41ec8f055e80c18cecc31a8`.

## Actor-depth correction (review page only)

- `e03/route-depth.mjs` provides source-image foreground polygons for the upper terrace parapet/wood rails, sign pier, unloading cargo and arcade piers/jambs. A polygon is activated only from its registered **behind-object ground region**, so actors on the front road stay in front. The renderer clips and redraws pixels from the **same unchanged M1 plate** above the actor on every frame. It does not generate, edit, fade or replace any art.
- C01 Milo retains the same atlas bytes. A review-local `60 0 490 990` viewBox includes the shoes and removes transparent bottom padding; height varies continuously from 156 source pixels near the hub to about 89 on the upper terrace. A small ground-contact shadow follows the foot point underneath the same foreground. No shadow or name remains floating when the actor is fully covered.
- The N cargo point `(600,609)` moves to `(600,595)`, the following point to `(735,597)`. The exit uses `(1150,480) → (1180,560) → (1260,540)` to avoid side-door planters. These are presentation registrations, not a swept-collision proof.
- The actor is always rendered at opacity 1, even while a pier fully occludes it. Position, perspective and foreground are updated continuously between nodes, with no fade or skipped edge. Names hide only when the body is substantially covered; the actor itself is hidden by real foreground pixels.
- `tests/s01e03-depth.mjs` compares **actual Chromium screenshots**: foreground ON vs actor-hidden background vs foreground OFF. At fully opaque interior witnesses where the unmasked C01 changes the image, the corrected foreground restores background pixels. Local results: terrace railing **141/141**, sign pier **403/403**, arcade pier **1037/1037** exact restored witnesses (0 channel error). Clip edges are excluded because CSS downsampling legitimately blends them. Tests also verify perspective, 568×320/390×844 layer alignment, masks updating during normal-motion travel, no stale mask on front road/M0, opacity 1 and zero save writes. These prove compositing, **not physical clearance**.
- `tests/s01e03-art-review.mjs` retains all 41 review stops and release exclusion. Old failure records remain in `priorFindings` for provenance. PNG/WebP bytes and hashes below remain unchanged; owner art acceptance is metadata only. No game runtime, release asset allowlist, E01/E02 or audio behavior changed.

**Next:** validate/integrate M1 ground and occlusion into actual E03 routes and test cart boundaries, state, replay and mobile perception; owner visual review of this correction is now PASS; physical/game/device acceptance remains open. No further scene generation is needed for this defect.


**Baseline main:** `cee30b9fe4ff65c08d7e0454fec87b57d8742806`, freshly fetched 2026-10-17. **Owner decision:** A — retain three-route play and allow localized road-connection editing, keeping M0 original unchanged. **Outcome:** candidate media PASS; actual route/feet clearance **FAIL / OPEN**, not accepted for game integration. Full Gate 3/Gate 4 stay OPEN.

## Delivered artifacts

| File | Bytes | SHA-256 | Git blob |
|---|---:|---|---|
| `assets/production-candidates/s01e03/market-lane-m1-connected-candidate.png` | 3,148,682 | `86b916f04ebf69d46e27ed42bd43dd9afc1edb486cbde36c523c7b1aaedb5ac0` | `60593f8fa38dbf2b4a83a2e127e00887e357e283` |
| `public/art/s01e03-market-lane-m1-candidate.webp` | 470,326 | `1a174ab8913786b7573dda0035af71725c0051e898d801b41a0d1530e731f5b1` | `f0c544413fb9caeaa55755b3c272c10d5bcd7589` |

Both are 1672×941, RGB/no alpha. PNG preserved exactly as generated; WebP Q88/method 6 is a derivative. Original M0 PNG/WebP remain byte-identical. Source: existing M0 → built-in `image_gen` precise-object-edit → connected-stair derivative → right-side exit edit → narrow rear-sidewalk edit. Three completed targeted edits; the previously interrupted call produced no file. Intermediate trials remain local references, not accepted assets or game art. C01 is reused only in review overlays, never baked into the picture.

The image retains the same framing, shops, warm style, foreground boundary, outer road and unloading cargo in composition. It is a generated derivative: unrelated texture pixels are **not claimed byte-identical** to M0. No painted route labels, new character identity, story spoiler or new Riverside crossing is accepted.

## Actually checked

- `python scripts/verify_episode_media.py --manifest assets/production-candidates/s01e03/PRODUCTION_INTAKE_PENDING.json`: four exact-byte M0/M1 files, SHA-256/Git blobs, dimensions, PNG chunk CRC and WebP RIFF PASS. Pillow `verify()` and full decode on both M1 images PASS.
- [Route review data](M1_ROUTE_REVIEW.json) and [actual C01 review page](../../../e03/route-review.html) present S/N/L source-image nodes, source switching, manual stepping, animation and draft cart stops. The page writes **no localStorage**, never grants events, and is excluded from the runtime package. Its dashed lines are optional authoring overlays, not final art.
- Source-pixel polyline lengths: S 1349.28, N 1350.40, L 1405.56. This is screen-space math only, not meters or validated physical route lengths; the tiny S/N difference does not establish a perceptually shorter stair route.
- Browser review controls exercised 41 node stops in Chromium, original/candidate switching, draft cart stop and 568×320 no horizontal overflow; no page exceptions/storage changes. This verifies the review tool, **not** collision or route legality. Screenshots emitted as `e03-m1-review-*` CI evidence.

## Initial clearance findings before owner PASS and depth correction (historical)

| Route / index | Source feet | Actual rendered finding |
|---|---|---|
| S / 8 | 930,215 | Milo feet lie on a terrace stone/railing edge. A landing-to-shop line is not proof of continuous floor. |
| N / 5 | 600,609 | Milo feet overlap top/rear unloading cargo; the generated rear sidewalk still lacks proven pedestrian clearance. |
| N / 10 | 1020,490 | Milo intersects the side pier/ivy. Proper ground registration and an honest covered-passage occlusion model are missing. |

The enlarged steps, visible side doorway and reduced planters are useful visual improvements, but they do not close these failures. No further serial whole-scene edits were made after the walk review. Do not disguise a blocked segment with an unvalidated sprite fade or teleport. A source line must first be registered to real visible/justifiably occluded floor.

**Runtime unchanged:** `e03/main.mjs`, `engine/s01e03.mjs`, script/build IDs and `scripts/package_e03.py` still select only the existing M0 engineering slice. Neither M1 media nor this review page may leak into E01/E02 or existing E03 packages. No deployment, recorded audio or SVG changes.

## Final edit prompt (built-in image_gen; precise-object-edit)

> Precise-object-edit. Preserve this exact image and all successful repairs: the connected left stairs, upper footway, front arcade, new open right-side arcade exit connected to the outer lane. Preserve all shops, outer roads, cargo cart, foreground boundary, lighting and painterly detail. No people, text, arrows or route labels.
>
> ONE last small safety correction ONLY: the pedestrian approach from the LEFT collection point to the FRONT arch is still pinched by the decorative flowerpots behind the unloading crates. In the thin band approximately x=350..820,y=555..630 (1672x941 image), remove/shift just those flowerpots and a little ivy at the foot of the stairs so there is a clearly visible continuous ONE-PERSON-WIDE level cobbled sidewalk BETWEEN the foot of the stair/stone facade and the BACK of the unloading cargo. It must connect the left public paving near x=350,y=605, pass behind/above the crates without intersecting any crate or planter, and join the FRONT arch floor near x=820,y=590. The strip should be visibly about 45-60 image pixels wide, enough for a child carrying books, narrower than a loaded cart, no steps on this strip. If needed shift the topmost rear crates DOWN a small amount, keeping the unloading obstruction centered and all other cargo recognizable. Do NOT remove the whole cargo, widen into a cart road, redesign the shops, or change the arch/right-side exit/stairs. Most important: show uninterrupted cobblestones along this exact short left-to-arch pedestrian link, not a dotted trail or hidden route under flowers. Keep all unrelated pixels/style as close as possible.

**Next focused task:** resolve the three documented registration/clearance failures in a bounded ground-and-occlusion review before changing the playable route graph. Existing accepted art/master, E01/E02 and upstream three-route intent remain locked. M1 owner art approval, physical clearance, actual gameplay and device acceptance are explicitly unproven.
