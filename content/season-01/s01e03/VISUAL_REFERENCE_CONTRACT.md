# S01E03 — Market Lane Gate 2 Visual Reference Contract

**Status:** R0 technical layout / visual-production reference **proposed**, not owner art PASS. **No finished painterly art, art source PNG, WebP, asset upload or runtime exists in this change.**

Source authority: [E03 Episode Production Brief rev 2](EPISODE_PRODUCTION_BRIEF.md), [Detailed Script rev 2](DETAILED_SCRIPT.md), [Interaction Spec rev 2](INTERACTION_SPEC.md), [Season 1 Architecture](../../../docs/SEASON_1_ARCHITECTURE.md), [Visual Style Bible](../../../docs/VISUAL_STYLE_BIBLE.md), [Fast Lane](../../../docs/EPISODE_PRODUCTION_FAST_LANE.md).

Technical files:
- [MARKET_LANE_TOPOLOGY.json](MARKET_LANE_TOPOLOGY.json) — source-of-truth proposed node/edge/passability design for illustration. Units are **design-space pixels**, not real-world meters.
- [MARKET_LANE_LAYOUT.svg](MARKET_LANE_LAYOUT.svg) — editable *annotation-only* single-scene storyboard. Colored route strokes and letter codes **must not be baked into final art**.

## 1. Composition R0 — one readable town street, no three disconnected paintings

**Canvas:** 1600 × 900 working coordinates, three-quarter elevated illustrated-living-diorama camera, gentle soft daytime from upper left, painterly, warm friendly market. Approximate left-to-right movement from the **delivery hub H** toward shops on the right, with a visible **upper stair shortcut S**, **middle covered narrow arcade N**, and **lower/winding wide level outer lane L**. The unloading obstruction belongs to a **different directly blocked through-connector**, not to the arcade or outer lane.

**All action-relevant feet/targets occupy y≤665** in the R0 working storyboard; y≥705 is a visual RPG dialogue dock reserve, **not** a declared real-browser pixel mask. Final runtime aspect/crop decisions must confirm the same visibility at short mobile landscape. Do not require all characters to stand on one horizontal line or render Milo behind the unloading stall/labels. Physical grade of the upper steps must be evident; arcade opening must plausibly be too narrow for a loaded handcart; outer lane must have visible turning room and continuous paving (including tea porch and flower spur). R0 is a *topological target*, not pixel-perfect painting tracing.

**Distinct destinations:** bookstall **B**, tea porch **T**, flower stand **F** must be recognizable from iconography/props, not labels baked into AI art. H carries the books, loaded tea-cup cart, and upright flower tray one at a time; none is a countdown or damaging object. A readable lane contrast matters more than decorative stalls.

## 2. Verified R0 design graph — not a tested game world

Path lengths computed from source graph coordinates are **illustrative** and internally consistent: **H→B Steps S = 1,227 units**, **H→B Arcade N = 1,335 units**, **H→B Outer L = 1,417 units**. This preserves S < N < L for the shared bookstall destination. Geometry is **not** a claim about measured scale.

| Load / goal | Permitted path | Intent |
|---|---|---|
| Books to B | S, N or L | Finn's steps can succeed; child free to choose alternatives |
| Tea-cup handcart to T | **L**, continuous `H→L0→L1→L2→W→T` | No stairs, narrow arch or imaginary ramp |
| Upright flower tray to F | Level steady L and flower spur `H→L0→L1→L2→F` | No forced failure; any genuinely stable new path must be valid if added |

**Static design audit performed 2026-10-14:** 14 named nodes, 15 declared legal edges, one separate impassable direct-unloading connector; every edge endpoint exists; cart cannot access stair/narrow edge; required reachable H→B/T/F paths are present; all interactive node y values ≤665. These assertions were checked on the proposed design data during authoring; **NOT** collision simulation, browser traversal, visual perceptual QA, child comprehension, or actual cart-turn-radius measurement. Exact physical widths/clearances, a polygon collision map and in-engine route audit remain **open for Gate 3**.

## 3. State art and spoiler layers

Use the same environment master for ordinary deliveries and post-delivery wayfinding. Keep the following as independent objects and scene-state overlays:

| Asset/layer | Placement | Requirement |
|---|---|---|
| Main Market Lane background R0 | One broad street view | Shops, steps, arcade, level lane, paving and active unloading; **no children baked into background** |
| C01 Milo/Nia/Finn actors | Foreground independently movable | Use already-approved C01 game characters/portraits; any newly generated pose must actually reference the canonical C01 *image* |
| Loads | Hub and with appropriate delivery mode | Book bundle, cups on small cart, upright flower tray; separate, removable |
| Wayfinding signs | Main route split and legitimate destination junction | Before/after state via editable arrows and text; no sign points a cart into S/N |
| Old-route mark | Existing small stone at market edge, separate layer | Genuine historical mark, not new sign; discoverable after inspection, does not reveal Common/station/garden as confirmed arrow |
| NPC residents | At present market positions | Distinct Market coordinator and long-term resident; voices/text can exist before unique art identities are chosen |
| Focus/camera cut-ins | Optional, not automatically required | Add only if narrow-versus-wide or steps are unreadable at mobile size |

**Visibility:** the background can visually contain an ordinary old stone from the start; the story *meaning* and Chronicle event are only revealed when the player intentionally inspects at the appropriate scene. Both station/garden accounts remain attributed memories (no images proving one memory correct). No Riverside crossing repair, Common, or North Hill revelation.

## 4. Targeted next art generation (after checking this composition)

**Candidate M0: ONE high-quality background concept**, no core trio or NPC portraits baked in. Illustrated Living Diorama, friendly town market at daytime, 16:9 1600×900-equivalent source; 2.5D three-quarter view. Preserve: left hub, *distinct accessible-looking* upper steps for walkers (not cart), middle arcade visibly too narrow for cart, open wide gentle-turning outer lane through tea and flower destinations, busy **but safe** unloading stall only obstructing direct center pass, and book/tea/flower destinations distinguishable. Natural town detail, warm restrained ink/painterly textures. Leave enough uncluttered empty paving for **separate approved sprites** and caption/choice overlays. Do **not** render educational route stripes, text labels, UI panels, route answers, old-route solution, extra magical objects, or the three child characters.

**Candidate M1 only if M0 materially fails:** one alternate framing preserving the **same named routes and safe connections**. Do not generate 5–6 minor cosmetic variants. If a finished environment misrepresents the graph, prefer an editable overlay/waypoint correction if nonmaterial; regenerate only when the wrong lane, dangerous crossing, hidden critical destination or impossible cart geometry would mislead a player.

An *optional* focused cart/stairs view may be composited or generated later from M0 only if a real small-screen prototype cannot convey the distinction.

## 5. Small-screen and downstream acceptance plan

- Validate one full scene at 568×320 and 667×375 CSS-px mobile landscape plus portrait fallback and desktop Parent display model. Check actual characters, feet, labels, dock, dialogs, cart turning, paths, shop signs and click/tap hit regions; don't infer device PASS from this SVG.
- Maintain ≥44 CSS-px actionable targets, no essential bottom-dock occlusion, no controls pushed right or transient walking text shrinking the scene.
- Use stable caption text plus browser/manual Listen. Prerecorded voices, music, ambience and effects remain **deferred**, not PASS.
- E01/E02 accepted original bytes, saves, packages and routes must remain unchanged.
- Keep production gate statuses distinct: **R0 layout/source graph verified** ≠ **rendered art accepted** ≠ **Git PNG/WebP intake** ≠ **playable/devices PASS**.

## 6. Fast Lane transfer once a rendered candidate is chosen

Once **one** background image is visually accepted, package the full-resolution original PNG and quality-checked same-dimension WebP derivative once; include manifest with byte lengths, SHA-256, Git blob, dimensions, provenance and exact repository-relative target names (recommended `assets/production-candidates/s01e03/market-lane-r0-original.png` and `public/art/s01e03-market-lane-r0.webp`). Arrange one ZIP transfer with no repeated ineffective GitHub binary writes. After user uploads, re-fetch current GitHub main/branch and **verify real uploaded exact files**, then run `scripts/verify_episode_media.py` and its targeted CI. This document and SVG are *text/design only*, not image-transfer evidence.

## 7. Status and next task

**Locked upstream:** E03 Season plot/EFL goals, book/cart/tray constraints, Finn's reasoning turn, E04 two memories, E01/E02 freezes and C01 identity.

**This Gate 2 layout work:** chosen **provisional single-scene R0 composition** and a connected route graph checked for basic reachability; pending actual rendered art and owner art PASS.

**Still open:** final painted master, exact art scene depth, cart/character collision clearances, mobile perceptual QA, NPC designs, visual state overlays, media intake and playable implementation.

**Next focused task:** generate **one** M0 Market Lane painterly background candidate using this topology, show the real image, assess only material path/identity/spoiler defects; proceed to one transfer bundle only after it is accepted. No audio or runtime code in this step.
