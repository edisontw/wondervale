# E03 S/N candidate route geometry — source-mask audit (2026-10-25)

**Status:** engineering evidence / **blocked-design**, not an approved walkable S/N implementation, browser/phone PASS, or a revision to E03's accepted story. Baseline GitHub `main`: `f0964329404ae3a457ae403042ca1ff0f97031f3`. Related: [#108](https://github.com/edisontw/wondervale/issues/108), [#109](https://github.com/edisontw/wondervale/issues/109), [recovery plan](48H_RECOVERY_PLAN_2026-10-25.md).

## Exact source inputs and method

- `content/season-01/s01e03/M1_ROUTE_REVIEW.json`: proposed S/N/L **review-only** foot-point polylines.
- `e03/route-depth.mjs`: review-only painted foreground masks, **not** verified collision geometry or a walkable-floor map.
- `engine/s01e03.mjs`: shipped L-only legal route graph and explicitly unmeasured `clearance:null`.
- `public/art/s01e03-market-lane-m0.webp` and `s01e03-market-lane-m1-candidate.webp` currently resolve to the **same Git blob** `f0c544413fb9caeaa55755b3c272c10d5bcd7589` (1672×941 source coordinates). Thus the M1 candidate is not an independent new pavement image.

A read-only deterministic JavaScript audit sampled each proposed straight segment at approximately **1 source-pixel** intervals. Each foot point was tested by even/odd point-in-polygon against every foreground-mask polygon. The numbers below are **approximate centerline lengths inside painted foreground masks**; mask overlap may represent intended actor occlusion, not a solid wall or a real collision. This calculation does **not** inspect actual source-image floor pixels, body width, entry/exit continuity, perspective depth or physical-device rendering.

| Candidate | Segment (review point indices, zero-based) | Painted mask crossed | Approx. foot-centerline overlap |
| --- | --- | --- | ---: |
| S | 6→7, 7→8, 8→9, 9→10, 10→11, 11→12 | `terrace-front` parapet/ivy | 59, 125, 131, 104, 101, 18 px |
| S | 8→9 and 9→10 | `terrace-sign-pier` (overlapping mask polygons) | up to 34/22 and 35/26 px |
| N | 4→5 (530,609→600,595) | `unloading-cargo` | 24 px |
| N | 6→7 (735,597→845,599) | `unloading-cargo` | 17 px |
| N | 9→10 and 10→11 | `arcade-front-pier` | 32 px and 28/44 px |
| N | 10→11 | `arcade-side-jamb` | 34 px |
| L | all proposed review segments | none of the above review-only masks | 0 sampled overlaps |

**Interpretation:** N's proposed rear cargo crossing has two distinct painted-cargo intersections, and its arcade exit/turn is also obscured by multiple foreground structures. S spends multiple long segments in the upper parapet/ivy mask; the *actual terrace walking floor and its entrance/exit* are not demonstrated by these masks. L's zero mask intersections is **not** proof of a legal cart swept envelope; #109 remains independent. Existing E03 engine correctly refuses S/N through-route selection rather than creating invisible edges.

## Decoded main scene inspection (2026-10-26 04:11 Asia/Taipei)

The actual **decoded** 1672×941 WebP on `main`, `public/art/s01e03-market-lane-m0.webp` (Git blob `f0c544413fb9caeaa55755b3c272c10d5bcd7589`), was visually inspected against the candidate foot points in `M1_ROUTE_REVIEW.json`. The M1 review image has the same blob; this is **one painting**, not two independent route observations. This closes the earlier *uninspected source raster* evidence gap, **not** the walkable-floor gate.

| Candidate point(s), source pixels | Decoded-paint observation | Decision for current candidate |
| --- | --- | --- |
| S: (805,215) → (930,215) → (1060,230) → (1160,260) → (1260,275) | The proposed foot line follows the **front terrace parapet/ivy/railing and stone-pier zone**. A continuous upper-terrace foot-width paving strip at these feet is not visibly established; the actual walking terrace is behind the foreground wall. | **Reject these S foot points as a legal through-route** until a distinct floor-aligned path and both stair/top-market transitions can be shown. Do not merely draw an edge behind the wall. |
| N: (530,609) → (600,595) → (735,597) → (845,599) | The candidate line runs along/through the **painted unloading cart, crates and cargo**. The rear sidewalk at those feet is hidden, and two source-mask crossings were already measured. | **Reject this N centerline as proven walkable**; a continuous, body-width passage behind the load is not demonstrated. |
| N: (965,525) → (1020,490) → (1150,480) | The turn is in the **arch masonry/pier, ivy and planter/side-path transition**. The painted arch opening and the side market paving are visible separately, but a legal continuous passage connecting the candidate points is not established. | **Keep N arcade exit blocked** pending visible, correctly depth-ordered feet and entry/exit continuity. |
| L: outer-lane points | A visually distinct open cobbled outer lane is present, consistent with the existing limited L gameplay. | **No new approval** for cart yaw/wheels/swept turns; see #109. |

These are qualitative **source-image observations**, not pixel-classified floor segmentation, a measured character-body clearance, real rendered-actor occlusion, or phone QA. A painted wall covering a route does not by itself prove there is no path behind it; it means the proposed path is **not evidenced**. The existing `route-depth.mjs` polygons remain occlusion review masks, **not** walkable/no-go physics polygons.

**Smallest actionable design request:** mark, on this same accepted source painting, (1) a continuous S foot-width upper-terrace pavement line plus stair landing and market-side exit, and (2) a continuous N cargo-rear/arch pavement line with both pier-side transitions, identifying where the character is behind foreground paint versus blocked by a solid. If no such lines can be traced without putting feet on parapet/cargo/masonry, approve a **localized scene correction** before adding route edges. Preserve the accepted scene/story and existing L route. Do not infer a new S/N connection from interpolation.

**Verification scope this round:** GitHub source raster and review JSON inspected; no image bytes, runtime graph, tests or deployment changed. Node/Chromium, physical device and MN4 **NOT RUN** for this documentation-only evidence.

## Acceptance / next bounded evidence

1. **N:** inspect actual source-image pavement at the two cargo overlaps and both sides of the arcade pier, especially whether a continuous foot-width strip exists behind the unloading and where the arcade reconnects to the bookstall approach. If the painted floor is absent or blocked, require a minimal owner-approved scene/art correction; do **not** bridge by graph line, opacity, clipping or teleport.
2. **S:** inspect actual step landing, upper terrace walking surface and both parapet transitions; document the exact foreground/no-go boundaries and where a walker can legally rejoin the bookstall path.
3. Only after source-image floor/occlusion evidence, register **distinct walkable polygons + legal edges** and test book traversal in both directions, cargo restrictions, interruption, replay and 320/568/desktop Chromium screenshots. Preserve E01/E02/C01, existing E03 Owner PASS content, and E04 engineering-only status.

**Evidence not obtained in this audit:** decoded source-image pavement inspection, actual Chromium scene screenshots, real-phone/Owner geometry acceptance, and MN4 deployment. No S/N gameplay changes or source-media changes are authorized by this document.

## 2026-10-27 — bounded S/N repair handoff (source geometry, **not** floor approval)

At `main` `c43c8ce525ce918412f21a09a55a635130421ec4`, cross-checked the immutable 1672×941 `M1_ROUTE_REVIEW.json` candidate feet against the **current runtime's** `e03/perspective.mjs` projection (`actorHeight`, `spriteBox.width/height = 490/990`). The numbers below are the **full on-screen sprite bounding-box width**, not shoe width, required pavement width, physical centimeters, or a collision clearance. They quantify why a centerline-only art repair is insufficient; the actual shoe/body/no-go silhouette and legal floor remain unregistered.

| Review station | Source foot (x,y) | Projected sprite height × width (image px) | Smallest missing evidence |
| --- | --- | --- | --- |
| S stair/terrace approach | (475,445) | 123.8 × 61.3 | Stair tread/landing with correctly grounded shoes |
| S parapet entrance | (805,215) | 88.8 × 43.9 | Foot-aligned floor **behind** foreground railing |
| S sign-pier crossing | (1060,230) | 91.0 × 45.1 | Walkable terrace around solid pier, with separate occlusion |
| S market-side exit | (1432,305) | 102.5 × 50.7 | Continuous re-entry from upper level to destination |
| N cargo-rear entrance | (530,609) | 148.8 × 73.7 | Continuous cobbled strip distinct from crate silhouettes |
| N cargo-rear middle | (735,597) | 147.0 × 72.8 | Body/foot envelope and load clearance behind cargo |
| N arcade pier | (1020,490) | 130.7 × 64.7 | Solid pier boundary versus foreground cover, grounded turn |
| N arcade-side exit | (1180,560) | 141.4 × 70.0 | Visible or justified level-floor transition to market side |

**Minimal repair units; review windows, not approved redraw coordinates:**

1. **S upper terrace, approximately x=735–1300/y=190–350:** identify the *actual* shoe-grounded terrace floor **behind** parapet/ivy, the stair landing and market-side exit. The current candidate (805,215)→(1260,275) follows parapet/stone-pier paint and is **rejected as a legal centerline**. A review mask may hide the torso, but it cannot create missing floor. Keep original stair and shop topology.
2. **N cargo-rear, approximately x=500–900/y=550–740:** show a continuous level cobblestone band from the left approach to the arcade, with a full actor/load clearance review and cargo designated **solid** or **foreground-only** per region. Existing 4→5 and 6→7 cargo-mask intersections remain unresolved. Preserve recognizable unloading obstruction and do not turn this into a cart lane.
3. **N arcade entrance/exit, approximately x=930–1220/y=350–570:** mark the pier/jamb as physical no-go versus intended front-layer occlusion; trace legal feet through the covered passage to both sides. Existing (965,525)→(1020,490)→(1150,480) is **not** accepted merely because a sprite can be drawn behind the pier.

**Owner/art input needed before implementation:** on the **approved raster** (or a separately approved *localized* correction), supply a continuous foot-centerline **and its left/right walkable boundaries** for S and N, grounded entrances/exits, solid/no-go polygons distinct from painterly occlusion polygons, and an explicit yes/no for body/load clearance at the listed pinch points. If any segment lacks defensible floor, leave it unavailable rather than joining graph nodes or masking/teleporting actors. The projected widths above are **diagnostic references only**, not invented acceptance thresholds.

**Engineering acceptance after that input:** add only proven S/N graph edges; validate books and flowers both directions, cart prohibition, obstacle and exit rejection, interruption/reload/replay and E02 continuity; run Node plus actual Chromium at 320×740, 568×320 and 1366×900, with E01/E02 regression. Record actual Owner-device review separately. Until then keep `restricted.S/N` inspection-only and `clearance:null`; do not change approved M0/M1 image bytes, C01, story, E01/E02, or release/E04.

**This pass:** numeric projection calculated directly from the checked-in formula and route JSON; **Node test suite, Chromium, physical device and MN4 deployment NOT RUN**. No art, gameplay, save, package, or CI workflow was changed. This is an actionable `blocked-design` handoff, **not** Gate 3 PASS.
