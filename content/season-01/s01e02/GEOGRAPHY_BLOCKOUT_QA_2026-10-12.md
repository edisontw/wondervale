# S01E02 E02-3 geography blockout QA — 2026-10-12

**Result: TOPOLOGY AUTHORING CHECK PASS; VISUAL/OWNER GATE STILL OPEN.** No final image, C01 actor composite, exact collision implementation, E02 runtime or deployed E02 is approved.

Source-of-truth preflight: GitHub `main` `98656bd9a983d144b542873d944f81bf678f41fe`, then branched to `art/s01e02-geography-blockout-20261012`. Read README, WORK_SEQUENCE, OPEN_DECISIONS, E02-0, E02 visual reference contract, prior trial QA, E01 lessons and visual-style bible.

## Generated raster scene candidate review (not imported)

Two additional character-free landscape images were generated, but **both fail the one-bank route contract**: each depicts a gazebo apparently cut off by water from the original entrance or gives no continuous safe access from the child's spawn. Attractive appearance alone is not valid navigable geography.

| Render | Size / SHA-256 of original conversation PNG | Result |
|---|---|---|
| `a_wide_highly_detailed_colorful_storybook_anima.png` | 1672×941; `4a6fd78212f07e2a870a9f39756d706d72672a1703a72466df9ed9cfa4140aea` | REJECT as topology master; no continuous same-bank route visibly proved |
| `wide_detailed_high_resolution_anime_illustratio.png` | 1536×1024; `6e63673de8c3941944d0681d35a569d9efdcbf75ea3c191bcb7bce48e1b92ca5` | REJECT; same ambiguous/opposite-bank lookout connection |

These raster PNGs are NOT in GitHub, NOT approved. Do not claim them as source masters or use them for collision masks. This supplements [earlier trial QA](IMAGE_TRIAL_QA_2026-10-11.md).

## Authoritative *candidate* geography source created

| File | Git blob SHA | Contents |
|---|---|---|
| [R0 environment-only SVG](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.svg) | `4b3f246e6726ce455dd212d6376b4663a943cbaa` | 1600×900 zero-characters, zero-words vector environment; far/near banks, continuous water gap, separate aligned old footings, solid closure, public promenade and reachable guarded same-bank lookout |
| [R0 technical debug overlay SVG](../../../assets/reference-candidates/s01e02/riverside-r0-topology-debug-v1.svg) | `973acdbcd384d46a5486e1bfe8bc5ac65ce2c736` | Same base art with explicitly distinct safe route, old spur approach, no-go river and viewpoint waypoints; text labels only in QA view |
| [R0 geometry JSON](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json) | `95b7124beffd926213b76d7a50df4b08e05ce9ca` | Candidate 1600×900 walkable polygons, continuous near-bank route graph, forbidden river/far-bank/fence, station points and event associations |

**Coordinate orientation:** near bank (player) = bottom/south of the continuously flowing west-east river, far bank = top/north; the old bridge footings align along x≈740 on opposite sides of the water, but the deck is absent. The old spur ends at a fence at y≈647, before the river. The separate public route joins the promenade to a protected lookout around (1407,667) **on the same near bank**. No live gameplay collision masks yet.

The environment SVG has **no embedded words at all**, so the closed/spur, LOOKOUT, and later Market Lane readable labels must be authored as independently layered runtime/UI signs. Market Lane cannot appear in R0. C01 Milo/Nia/Finn must remain separate previously approved actor layers.

## Executed source QA (not image/browser QA)

- [x] Independently fetched all three generated repository files back from the feature branch; blob hashes recorded above.
- [x] No `<text>`, character names, baked images or technical overlay in the R0 art SVG.
- [x] Old bridge footings, fence, walkable public side branch and complete guarded lookout exist as distinct SVG layers.
- [x] Geometry JSON contains only near-bank walkable waypoints; all nine spawn/route/inspection points lie inside at least one nominated walkable polygon and none in/above the y≤610 river zone.
- [x] Graph traversal from spawn reaches **both** old-stones station and public lookout through only declared near-bank edges. No far-bank endpoint exists.
- [x] Debug labels remain entirely separate from the image used in game.

## Still OPEN; required before 'reference approved'

- [ ] Render the actual SVG and inspect overlapping layers, near/far-base appearance, closed-spur standoff and sign/actor placement with a human visual check.
- [ ] Compose the original C01 sprites/portraits independently; prove no crop/foot overlap.
- [ ] Test actual 320/360/390/430 phone and desktop viewports, meaningful camera follow/pan and two evidence closeups without UI covering the gap.
- [ ] Decide whether this vector blockout is suitable as storyboard only (likely) or needs a coherent painterly 2.5D re-illustration before game art.
- [ ] Create separate gated R4 Market sign art; no pre-reveal text in R0. No E01 glyph alteration.
- [ ] Import/export audited production media with exact byte/hash checks; actual E02 path/keyboard/touch browser tests remain NOT RUN.
- [ ] Obtain owner visual PASS before promoting any candidate to reference approved.

**Decision:** lock **geographic layout as a working candidate**, not asset quality/production reference. Next focused task is rendered SVG/blockout visual review and a constrained painterly image pass based on this topology; stop using unconstrained concept infographics. E01 source remains unchanged.
