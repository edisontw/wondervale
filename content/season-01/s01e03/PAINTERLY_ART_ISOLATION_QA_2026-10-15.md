# S01E03 — Painterly Asset Isolation QA (2026-10-15)

**Status:** Gate 2 visual trial; **NOT PASS for independent gameplay art**. No final art owner PASS, binary upload, playable E03, or audio change.

## Locked baseline

Owner accepted static R2 geometry and mobile-scale scene layout; R2 nodes and 18-layer SVG stay unchanged. E01/E02 frozen, C01 trio stays independent, recorded audio remains deferred.

## Objective and evidence

Goal: generate truly independent painterly Bookstall, Tea and Flower stand art that can be composited at approved R2 destinations without redefining stair, narrow arcade, level cart road or unloading.

**Observed:** Two targeted image-generation attempts again produced **complete picturesque market scenes**, both 1672×941 PNG, rather than independent alpha cutouts. They include roofs, roads, elevations and water/bridge suggestions inconsistent or unverified against the accepted E03 R2 layout. They are promising *style references* but **not shippable Market Lane gameplay backgrounds or accepted storybook plates**.

Generated candidate source SHA-256 values, still conversation-only and **not GitHub binaries**:

- `a_bright_detailed_hand_painted_illustration_st.png`: `26090e851ca857ec75283d85b51af09c3772a4f28b9f0a5cbb2c589ec5618e63`
- `a_wide_colorful_detailed_fantasy_medieval_villag.png`: `c25a427125a3e94fac9b2d33775bd0056fa548f22019808453d7502e4aa7bd6b`

**Extraction trial:** Independently alpha-masking parts of the second full-scene image yields cutout patches, **not** independently produced props. The collage was inspected on R2 full scene and failed aesthetic continuity: mismatched shading, relative scale, perspective and texture density, hard/feathered boundary discontinuities, and occlusion of existing geometry. Bookstall extraction also required error correction in the polygon coordinates. Do **not** promote these patchwork files to the production media manifest. A local side-by-side review image compares the painterly context scene with the R2 geometry.

## Proposed direction — NOT yet locked

**Two visual media roles for the same episode (possible, pending approval):**

1. A noninteractive **storybook chapter plate** can use a high-quality standalone painting once its continuity is checked for misleading river crossings, stairs, navigability, text and spoiler content. Neither generated candidate is accepted automatically.
2. The **living playable scene** must preserve R2 node/collider/route truth. Obtain painterly finishing through layer-local source art and masking with the R2 silhouette as the authority, not repeatedly generating a full incompatible village.
3. Trial **one** genuine standalone bookstall first: no background or typography, alpha edges, R2-sized facade placement; preview at 1600×900 and 568×320 alongside locked geometry. If that passes, continue Tea and Flower. No large art batch until component isolation is proven.

**Do not conflate:** AI scenic illustration visual appeal, exact isolated art, actual mobile/route/perception QA, user aesthetic approval, hash-verified GitHub PNG/WebP intake or runtime acceptance.

**Current result:** R2 geometry PASS preserved; isolated painterly sprite pipeline failed; finished Game Gate 2 art still OPEN. Next focus is *one* R2-bound real bookstall art component or a high-quality brush/texturing pass confined to the current Bookstall's silhouette. Do not generate whole-market scenery again without a new material decision.
