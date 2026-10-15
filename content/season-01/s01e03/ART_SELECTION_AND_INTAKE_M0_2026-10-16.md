# S01E03 Gate 2 — Existing painterly artwork selection and media intake (2026-10-16)

**Decision status:** **M0 background chosen for single-asset manual intake** under owner's instruction, “前面生成了很多圖，如果沒太大問題可使用” (reuse previously generated images when no major problem). No new picture generation in this selection round. **Media upload and actual game QA remain PENDING**; the status is not Gate 3/Gate 4 PASS.

**Authoritative story:** E03 Production Brief rev 2; E01/E02 frozen; approved C01 identity; caption and manual Listen, prerecorded audio deferred. The earlier R2 SVGs are discarded as final-art candidates and preserved only as concept/route sketches. **Never force the accepted painterly illustration to match obsolete R2 SVG pixel coordinates.**

## Seven previously generated images reviewed

The exact original PNG files were verified locally. All seven are bright, high-resolution landscape painterly scene illustrations; some differ in shop placement or carry labels. This is a pragmatic Gate 2 visual selection, **not** a claim that all seven are geometrically interchangeable.

| Candidate | Original PNG basename | Size | Decision |
|---|---|---|---|
| **01 — M0 SELECTED** | `a_bright_detailed_hand_painted_illustration_st.png` | 1672×941 | Best single-image fit: distinctive upper-right bookstall, visible stairs, narrow arched passage, outer curved cart lane, tea shop, flower display, unloading cargo, no baked instructional labels |
| 02 — backup only | `a_wide_colorful_detailed_fantasy_medieval_villag.png` | 1672×941 | Attractive and largely consistent; less convincing single localized direct-corridor unloading closure, and has altered shop/cargo placement; avoid interleaving as a supposedly identical location |
| 03 — not chosen | `wide_bright_detailed_fantasy_animated_illustrati.png` | 1672×941 | High quality, but bookstall appears on the other side; not a drop-in alternate for same room/camera |
| 04 — reject for gameplay | `a_wide_colorful_storybook_style_hand_painted_ca.png` | 1536×1024 | English route/answer labels baked in; large water/bridge motif |
| 05 — reference only | `a_detailed_wide_colorful_storybook_style_fantas.png` | 1536×1024 | Strong painterly style and multiple routes, but unloading obstruction not visibly established and foreground bridge is prominent |
| 06 — reference only | `wide_detailed_colorful_fantasy_medieval_european.png` | 1536×1024 | Rich setting but no clear central unloading obstacle; differs from M0 geometry |
| 07 — reject for gameplay | `a_detailed_colorful_illustrated_storybook_carto.png` | 1536×1024 | English route labels baked into art, which would reveal/lock the sign-improvement gameplay |

**Original selected SHA-256:** `26090e851ca857ec75283d85b51af09c3772a4f28b9f0a5cbb2c589ec5618e63`. Original is preserved byte-for-byte in the pending media ZIP; no rough alpha crops or SVG are selected.

## M0 acceptance, specific material constraints

- **Good enough to reuse as E03 main scene plate:** illustration is a consistent warm Illustrated Living Diorama market, with children/C01 sprites absent, stores recognizable by actual objects and design rather than text. A staircase leads to the upper foot approach/bookshop. The central arch reads as a pedestrian-scale narrow connection; a wide outer paved approach connects toward tea and flowers. Temporary crate/cart unloading is visible at the middle.
- **No requirement that every path centerline follow R2 SVG pixels:** Gate 3 must draw *new gameplay nodes and clickable regions from the actual painting*, then prove continuous legal H→B/T/F routes for walking vs loaded cart. Never fake a teleport, pass through crates, or reuse an image route that visibly disagrees with collision.
- **One constrained concern:** crates in front of the central arcade may visually narrow its approach. In gameplay, ensure an honest clear pedestrian entrance on the side of the cargo; if an actual 568×320 test cannot show it, use one bounded inspection/focus view (or adjust only the object overlay), not a full redraw. This is a runtime verification condition, **not currently proven PASS**.
- **Forefront lower-left bridge-like masonry:** treat as decorative *non-traversable* foreground boundary, not a repaired E02 crossing, and do not place characters there. Its mostly low frame position falls beneath or near the real RPG caption dock, but real camera/crop must be checked.
- **Flower shop near bottom-right:** in a simple full-frame 568×320 scene with a lower caption dock, its lower part becomes hidden. A camera **focus/crop of the same unchanged original PNG** restores meaningful view of the flower shop and right path. A 568×320 simulated focused preview was produced, but real in-game character/control and dock placement still need testing. No additional art required to test this.
- **Signs & historic glyph:** current-day WALK/CART arrow text must be UI/state overlays, and the ancient glyph a separate intentionally inspected history layer. The original PNG contains no legible gameplay-answer labels. Do not reinterpret decorative banners as official old-route proof.

## Single verified local media bundle — upload is still outstanding

A single ZIP has been prepared with exactly **three repository-relative paths**, suitable for one manual GitHub intake:

1. `assets/production-candidates/s01e03/market-lane-m0-original.png` — 1672×941 exact-source PNG, 3,768,205 bytes, SHA-256 `26090e851ca857ec75283d85b51af09c3772a4f28b9f0a5cbb2c589ec5618e63`, Git blob `8adcc82dfd5a94485b19f07cccdc1a0c1b09f674`.
2. `public/art/s01e03-market-lane-m0.webp` — same 1672×941, quality 88, 505,748 bytes, SHA-256 `f7d5b95dfbb5377027d9370a2b2be194b2a17e4673942790a0e20cb049b9351d`, Git blob `c0cd4e863c27b2b00a7ba512921d8d8363479e20`.
3. `assets/production-candidates/s01e03/PRODUCTION_INTAKE_PENDING.json` — exact-byte manifest with source provenance and hard runtime warnings, **carried inside the ZIP, NOT committed alone**, so current main media discovery/CI does not fail for not-yet-uploaded binaries.

Local SHA-256, Git blob IDs, PNG CRC, WebP riff/dimensions, Pillow verification and ZIP CRC passed. After owner uploads the three paths to main or a named branch, **re-fetch current GitHub main or that branch and verify all exact paths/blobs**, run `python scripts/verify_episode_media.py --manifest assets/production-candidates/s01e03/PRODUCTION_INTAKE_PENDING.json`, then integrate via episode-specific asset allowlist. **Do not claim media-intake PASS until real Git files are present.**

**Next focused task:** user performs *one* upload of the three ZIP paths; assistant verifies the actual committed files and then plans a playable M0-based movement/route overlay. Other six illustrations remain reference/backup only, no unnecessary regeneration. This Gate 2 selection does not authorize new C01 art, audio, E02 changes, or E03 gameplay/deploy claims.
