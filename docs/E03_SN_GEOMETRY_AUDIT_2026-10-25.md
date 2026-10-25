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

## Acceptance / next bounded evidence

1. **N:** inspect actual source-image pavement at the two cargo overlaps and both sides of the arcade pier, especially whether a continuous foot-width strip exists behind the unloading and where the arcade reconnects to the bookstall approach. If the painted floor is absent or blocked, require a minimal owner-approved scene/art correction; do **not** bridge by graph line, opacity, clipping or teleport.
2. **S:** inspect actual step landing, upper terrace walking surface and both parapet transitions; document the exact foreground/no-go boundaries and where a walker can legally rejoin the bookstall path.
3. Only after source-image floor/occlusion evidence, register **distinct walkable polygons + legal edges** and test book traversal in both directions, cargo restrictions, interruption, replay and 320/568/desktop Chromium screenshots. Preserve E01/E02/C01, existing E03 Owner PASS content, and E04 engineering-only status.

**Evidence not obtained in this audit:** decoded source-image pavement inspection, actual Chromium scene screenshots, real-phone/Owner geometry acceptance, and MN4 deployment. No S/N gameplay changes or source-media changes are authorized by this document.
