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
