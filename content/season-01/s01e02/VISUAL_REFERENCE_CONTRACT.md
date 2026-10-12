# S01E02 Riverside Visual Reference Gate — E02-3

**Status:** REFERENCE DESIGN CONTRACT / NOT AN APPROVED RENDERED ASSET. Source: owner-PASS E02-0 topology, approved EPB rev 2, locked E02 script v1 and interaction spec rev 1. No E01 asset may be replaced.

## One scene, one geography

The scene is a living illustrated diorama, not a disconnected collage of clue pictures. Orient camera along a public near-bank promenade entering from Town Square on the left. An old paved spur reaches a **fixed closure fence** with standing room before it. Behind the fence the current protected bank has a newer railing/stone edge; beyond it is water, a **missing bridge deck**, and a distant aligned **old masonry landing** on the opposite bank. The near-bank old footing remains visible from safe pavement.

A separate, signed, **already-open public side route on the same bank** branches away from the closed spur and reaches a protected **Riverside Overlook**. The old crossing must remain unmistakably non-traversable in every scene state. No repaired/partially repaired bridge, jump, ladder, hidden bypass, unsafe path, gate opening, water access or early Market Lane text.

### Reusable artwork state matrix

| State | Required visuals | Forbidden |
|---|---|---|
| R0 arrival | Active Riverside, three distinct trio actors on paved route, visible CLOSED fence and legible LOOKOUT sign; far old landing visible in context | Market Lane readable destination, freshly repaired bridge, misleading walkable fence |
| R1 old stones inspect | Near/far old footings align across current river, large side-by-side readable evidence panel | Full history explanation or an unbroken deck |
| R2 safe lookout inspect | Missing deck, wide open gap and changed near-bank edge **visibly distinguishable**; guarded stand | Unprotected overlook, gap hidden by UI, distant clues requiring pixel hunting |
| R3 overlook discovered | Revisitable landmark highlight/Chronicle marker, **same physical road/fence** | Opening fence or rebuilding structures |
| R4 post-revision mark | Lookout-side old route fixture with **MARKET LANE** direction readable as an explicit dynamic/reveal layer | Market text baked into the arrival master image |
| R5 Chronicle | THEN old alignment vs NOW broken connection, unknown-cause text, safe lookout discoverable | Fake fully restored bridge in present-day state |

The R0/R4 Market Lane text must be rendered from a separate semantically gated overlay/close-up, not an always-visible in-scene lettering raster. The old mystery glyph remains exactly its earlier approved undecoded identity.

## Art authority and deliverables

- **Trio:** C01 approved identity sheet + matching approved turnaround. E01 sprite/portrait registry may be reused unchanged. Preserve faces, hair, clothes, silhouette proportions, name tags and isolated RPG portrait crops; don't invent a new costume or a four-person crowd.
- **World:** Illustrated Living Diorama visual grammar. Use restrained painterly layers with coherent near/far bank perspective, path depth and warm contour hierarchy. Riverside should appear used and welcoming, not an abandoned ruin.
- **Concept deliverables before production image batch:** one overhead/topological schematic with walkable feet polygon, fence/water/far-bank no-go masks, an explicitly connected public lookout route, station standoff feet targets; one landscape staging composite; one phone crop proof; one R1 and one R2 large inspect-state reference; one sign/marker reveal sheet; Chronicle then/now reference. Every item must note source reference, intended in-game crop/state and version.
- **Camera:** preserve entire vital walkable scene with bounded RPG bottom dialogue dock and parent view. On 320/360/390/430 portrait and short desktop, ensure critical fence, public ramp branch, character names/feet, safe lookout and evidence hot zones are accessible; use a separate inspect panel if needed, not smaller clue text. Mobile Child/Parent toggle, desktop split and manual Listen are inherited.
- **Interaction geometry:** before image approval annotate actual pixel-space walkable polygons and prohibited zones from the final exported background; no moving into art props or onto a painted walkway that has no traversable mesh. Set actor start and return feet positions, station interaction radii, follower separation and label clearance. Screenshots must prove feet and sign legibility. Avoid E01 absolute coordinates.
- **Asset integrity:** original full-resolution source bytes, immutable hash, dimensions, real alpha/crop preview and provenance record. No thumbnail or altered low-res reconstruction may be called final. Reuse known existing trio assets without regeneration where fit.
- **Accessibility:** labels plus icons/shape, large forgiving hotspots and keyboard/accessible route actions, caption equivalents to visual detail, optional Listen, reduced motion. A single marker must never be recognizable only by color.

## Visual review gates (all NOT RUN)

1. One consistent bank/spur/overlook graph in overhead sketch, landscape and close-ups.
2. Walkable feet paths pass closure, water and far-bank exclusion tests; lookout public route stays on same bank.
3. Player can see **old aligned footing** and **missing present deck** from legal viewing positions; SC02 does not speak the corrected conclusion before SC03 choice.
4. Staging protects trio identity, separated actors and all active speaker name labels; RPG dock never obstructs a critical inspect view.
5. R0 has no Market answer; R4 reveals only after accepted revision. R5 never portrays a repaired present bridge.
6. Original bytes and source provenance verified before approving generated assets and batch production.
7. Responsive desktop/phone screenshot review performed on actual assembled reference media, not only coordinate arithmetic.

**Next deliverable:** create/approve **one Riverside topology/reference composition** plus phone readability proof. No new image/voice/audio or runtime is claimed here. After reference PASS, author the bounded E02 asset registry and generation prompt pack, then implement in a separate engineering layer that proves E01 regression.

## 2026-10-12 rendered blockout handoff (not final art approval)

A scene candidate [R0 SVG v2](../../../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg) now supersedes v1 **for visual composition only**: extended matched historical bases, near footing drawn above near-bank foreground, absent deck retained. [Mobile camera configuration](../../../assets/reference-candidates/s01e02/riverside-r0-camera-proof-v1.json) proves static focal coverage for 320/360/390/430 widths, not browser/device acceptance. The original v1 path and no-go graph remains an **authoring candidate**, not implemented runtime collision. From lookout, an explicit `Look across` inspect view must pan back to the aligned missing-deck evidence without moving Milo. See [QA limitations](RENDERED_CAMERA_QA_2026-10-12.md). Production visual reference and owner PASS remain OPEN.

## 2026-10-12 R1/R2 exact-topology inspection reference candidates

[R1 old-stones inspection](../../../assets/reference-candidates/s01e02/riverside-r1-old-footings-inspect-v1.svg) and [R2 look-across inspection](../../../assets/reference-candidates/s01e02/riverside-r2-look-across-inspect-v1.svg) are independent **viewBox crops over the same exact R0 v2 art geometry**, not new reconstructions that can move stones or the lookout. Their [visual manifest](../../../assets/reference-candidates/s01e02/riverside-r1-r2-visual-manifest-v1.json) defines the strict safe-state triggers and locked script line references. Source-geometry/spoiler checks PASS; production painterly rendering and owner PASS are not implied. See [R1/R2 QA log](R1_R2_REFERENCE_QA_2026-10-12.md). The next artist must match the two bases to *opposite shoreline ends* rather than add free-standing intermediate piers.

## E02-3 same-master painterly/vector art study v3 — 2026-10-12

[New R0 art-study SVG](../../../assets/reference-candidates/s01e02/riverside-r0-art-study-v3.svg), [R1](../../../assets/reference-candidates/s01e02/riverside-r1-old-stones-art-study-v3.svg) and [R2](../../../assets/reference-candidates/s01e02/riverside-r2-look-across-art-study-v3.svg) are explicitly **unapproved authoring candidates** made with unchanged underlying R0 v2 geography and a decorative style layer; R1/R2 differ from R0 only in viewing camera. [Offline QA viewer](../../../assets/reference-candidates/s01e02/riverside-r0-r1-r2-qa-viewer-v1.html) lets a reviewer compare scenes and portrait widths; it is **not playable E02**. Neither expensive/production painterly quality nor C01 overlay/device tests is proven. See [source-level QA](ART_STUDY_V3_QA_2026-10-12.md) for the exact remaining reference gate. Continue to reject AI images that add a complete bridge, move the lookout across the water, put both original footings side-by-side in the river, or expose Market Lane before R4.
