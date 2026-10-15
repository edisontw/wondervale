# E03 Gate 2 — Market Lane R2 Visual Geometry & Viewport QA

**State:** R2 layered illustration draft, **not owner art PASS**, no playable E03, no production PNG/WebP media intake or mobile-device PASS. The parent-approved E01/E02 code/art/saves are unchanged.

## Finding: why R1 needed revision

An audit of the R1 canvas and route-node positions revealed that the rendering was not yet safe to accept as a playable background: Hub, Bookstall and Flower arrival footprints coincided with large *painted buildings*, the foot arcade arch was drawn across a post-entry route, and the wide cart road at lower bend y=660 used a ~107 design-pixel outline that reached below the reserved y=705 bottom dialogue-dock boundary. This was detected from **source shapes and coordinate geometry**, not from a claimed live browser screenshot. A subsequent broad-phase check sampled route centerlines against storefront rectangles and found additional crossings on the arcade→Bookstall path.

## R2 corrections, without overriding original R0/R1

- [R2 topology](MARKET_LANE_TOPOLOGY_R2.json) is a **derived** graph file. Unchanged historical baseline: [R0 topology](MARKET_LANE_TOPOLOGY.json).
- [R2 editable scene SVG](MARKET_LANE_LAYERED_R2.svg): retains the 18 independently editable layer groups, no baked English labels or arrows, no new river/bridge, no added people; repositions **shop decorative groups** away from the actual arrival and public walkway nodes. Market unloading remains a temporary blockage on *only* the direct connector.
- The wide-level-lane nodes move in illustration coordinates: L0 y605→565, L1 y660→602, L2 y625→592; Bookstall arrival B y310→335. **The episode concept remains the same**: short pedestrian stairs, narrow passage for walkers, long *level/wide* cart route, safe flower spur.
- Narrow-arcade architectural layer is offset to frame the start of the pedestrian-only route; no change to the graph's legal S/N/L edges. Final portal depth, posts and collider masks still need actual visual and physical verification.
- The flower kiosk is relatively small in R2 to keep the very tight upper/lower route corridors visible. Its size and recognizability are an explicit **art review risk**, not an approved final shop design. Distinguishing flower props can be staged independently at F without rerouting paths.

## Reproducible QA tools

- **Source geometry:** `node scripts/verify_e03_market_visual.mjs` checks R2 route connectivity and cart-only permissions, short/medium/long shared-destination ordering, 18 separate layer IDs, dynamic blank-sign constraints, node coordinates and broad-phase visual shop/road spacing, and road margin above caption dock. It is **not a polygon collision solver**.
- **Visual raster output:** `python scripts/render_e03_market_previews.py` uses CairoSVG/Pillow to produce actual SVG raster frames and diagnostic overlays at 1600×900, 667×375, 568×320 and a **letterboxed 390×844 portrait**. These PNGs are CI artifacts for scene review, *not approved production art*. The dock drawn in a diagnostic PNG is **simulated** and not the real E03 RPG UI.
- **Local interactive layout reviewer:** [R2 browser QA page](MARKET_LANE_R2_VISUAL_QA.html) displays the exact SVG in a viewport-sized HTML box and allows toggling node markers; requires a user/browser to inspect perception and click-target legibility.
- **GitHub Actions:** [e03-visual-qa.yml](../../../.github/workflows/e03-visual-qa.yml) runs the source check and renders/exports diagnostics. Read the current HEAD check and downloadable artifact, not an earlier run, when assessing whether rasterization succeeded.

## Current pass boundary and next task

**Accepted upstream:** E03 story, route purpose, EFL reasoning and Chronicle mystery boundaries, C01 identity, E01/E02 freezes.

**Verifiable in this pass:** source geometry and machine SVG rasterization once the GitHub Actions run succeeds. A runnable viewport preview is provided for manual review.

**Still OPEN:** human-reviewed full PNG/small-screen aesthetic and legibility PASS; real C01 sprites, object feet and cart turning; collision polygons; actual 44px browser controls and landscape/portrait game layout; production-ready painted decoration, full-size PNG/WebP hash handoff and final Gate 2 owner decision.

**One next task:** inspect the actual R2 CI PNGs/browser viewport (especially the small Flower stand and arcade post clearance) and make only material **layer-local** art adjustments. After owner visually accepts the revised image, preserve original art and send one media-intake bundle. Do not begin E03 game deployment or prerecorded audio in Gate 2.
