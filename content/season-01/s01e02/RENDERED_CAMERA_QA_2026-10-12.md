# E02-3 rendered geography and camera review — 2026-10-12

**Outcome: v2 VECTOR STAGING CANDIDATE REVIEWED; painterly art, C01 composite and actual device approval OPEN.** No E01 files/runtime/art were changed.

## Sources and scope

- Starting verified GitHub `main`: `799ba1da9ed8886dd691edcb6cda809f7e8aff80`.
- Canon: approved E02-0 Riverside design, locked E02 script/dialogue v1, `INTERACTION_SPEC.md`, `VISUAL_REFERENCE_CONTRACT.md`, Season visual grammar and E01 prevention rules.
- [R0 v1 SVG](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.svg) and [stable safe route graph](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json).
- **New** [R0 v2 SVG](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg) and [camera proof configuration](../../../assets/reference-candidates/s01e02/riverside-r0-camera-proof-v1.json).

These remain **reference candidate geometry**, not approved 2.5D painterly scene art or engine collision masks.

## What the actual rasterized blockout revealed

A local geometry-equivalent copy of the GitHub R0 SVG was rasterized using CairoSVG at **1600×900** and inspected. This is NOT a byte-identical export of the GitHub SVG because the local copy omits metadata/comments/unused definitions; all path/shape/paint geometry for the reviewed frame was faithfully reproduced. This avoids treating the reconstructed PNG as byte-level repository integrity proof.

| Criterion | V1 render | Corrected v2 candidate |
|---|---|---|
| Old stones visually readable | **FAIL:** both footings appeared as very shallow slabs, near footing mostly obscured by the foreground/bank | **BETTER:** far landing vertically extended toward river; near footing elevated and rendered **after near-bank ground** but before edge/fence/rail; both align at approximately x=745 with empty water gap |
| Closure/access | Closed fence was visible at old spur | Preserved as a solid barrier; no deck/cross-water walkable link |
| Same-bank lookout | Protected near-bank overlook and connecting path distinguishable on large layout | Preserved exactly, not repositioned across water |
| Spoiler control | No embedded dialogue, character or Market Lane text | Preserved: `<text>` absent in scene asset |
| Painted-game quality | Layout/blockout only | Still layout/blockout only — **no production art approval** |

Two more painterly generated scene attempts in this pass were **REJECTED** rather than imported, because bridge ruins appeared side-by-side across the picture in water instead of old foundations located at opposing near/far banks. Scenic aesthetics cannot override the approved geography.

## Executed static camera staging

The locally rasterized v2 geometry was composited into **noninteractive** frame mockups. The actual mockups are conversation review PNGs and are **not** GitHub production assets. All phone frames reserve a real dock area separately; the desktop simulation reserves a quieter side Parent View. Proposed camera parameters are reproducibly stored in [camera proof configuration](../../../assets/reference-candidates/s01e02/riverside-r0-camera-proof-v1.json).

| Static camera | Scene height | Approx. source width | Visual staging observation |
|---|---:|---:|---|
| 320×700 | 486 px | 593 px | Old stone pair and closure visible in evidence focal crop; protected lookout in its own focal crop |
| 360×750 | 540 px | 600 px | Both camera views readable as broad illustrated evidence; dock kept separate |
| 390×844 | 606 px | 579 px | Broad old-stone/gap and safe lookout both fit their **individual** frames |
| 430×932 | 660 px | 586 px | Same; consistent focal world size, not entire 1600px squeezed into portrait |
| 1366×850 desktop study | 668px child scene + 182px dock; 1024px child scene, 342px parent panel | 1600px image scaled to 1024px | Parent split does not use child scene to spoil the notebook; exact character/label overlay remains untested |

**Important learning/presentation constraint:** the mobile player at lookout cannot simultaneously see the old foundations at x≈745 if their camera remains centered at x≈1380. `Look across` must intentionally enter a **separate inspect close view or safe camera pan/cut** to the observed old alignment, without moving Milo across water, triggering an unrelated discovery or displaying the cognitive answer early. This is now a firm visual production dependency.

## What was and was not tested

**PASS — source/rendered-staging scope only:**
- [x] 1600×900 existing world SVG converted to a viewable raster mockup in the local review workspace.
- [x] Discovered original hidden-footing rendering flaw and changed v2 SVG draw order/shape to expose two distant old foundations.
- [x] Parent/child desktop and 320/360/390/430 portrait **camera crop mockups produced and visually inspected**, preserving dedicated dialogue dock space.
- [x] No E01 visual identity was regenerated and no unwanted pets, Market destination, restored bridge, full crossing or premature clue text was added to authored v2 source.
- [x] Near-bank route graph from v1 remains unchanged: old spur is closed and same-bank public path leads to already-protected lookout.

**NOT DONE / remains blocking:**
- [ ] The exact uploaded `v2` Git blob's raster byte-for-byte reproducibility and independent browser rendering check (local equivalent geometry reviewed, not exact bytes).
- [ ] True C01 actor sprite compositions, sizes, feet masks, labels and occlusion at each viewpoint. **No placeholder actors are treated as passing C01 QA.**
- [ ] Physically realistic painting and final original-source PNG/WebP with audited GitHub upload.
- [ ] Close-view reference R1/R2 and R4 Market destination sign art with after-revision visibility gate.
- [ ] Actual responsive browser, reduced-motion/keyboard/touch movement, save/replay and real phone tests; all E02 runtime test matrix cases stay NOT RUN.
- [ ] User visual PASS of the finished Riverside scene.

## Next focused work

1. Treat [v2 SVG](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg) as the **single visual geometry reference** for the next render rather than going back to unconstrained concept sheets. Keep camera source polygons and both base alignments.
2. Create a separate R1 old-foundation and R2 look-across close view, then one attractive painterly background whose **actual topology** matches v2. Reject scenery with side-by-side mid-river piers, hidden near/far footing, detached right-side lookout or a complete bridge in the distance.
3. Overlay **approved C01 sprites as separate layers** and inspect screen crops; no identity change.
4. Obtain visual review PASS before production asset adoption and any E02 runtime/scene assembly.

**Do not modify E01.** In this pass the v1 geometry JSON is unchanged and v2 SVG explicitly changes **presentation of the bases**, not the approved walkability graph.
