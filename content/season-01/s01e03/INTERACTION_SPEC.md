# S01E03 Interaction Specification — revision 2 (authoring QA reviewed, draft)

**Authority:** E03 EPB rev 2, E03 Detailed Script rev 1, approved Season weave. Design/authoring only; no engine code or implementation PASS.

## 1. Player-facing contract

- E03 loads only if E02 read-only projection verifies both `episode_completed:s01e02` and `s01e02_market_lane_marker_recorded`. An explicit development preview may be designed later without fabricating E02 canonical progress.
- Milo is directly player-controlled inside a bounded Market Lane scene. Player may choose a destination/path by scene interaction or an accessible text/keyboard equivalent. Do not render quiz answers (“Correct route: L”).
- H=delivery hub, S=steps, N=narrow arcade, L=wide level lane, B=bookstall, T=tea porch, F=flower stand. Use one shared directed/undirected edge graph; walking permitted on S/N/L, cart permitted exclusively on L and its wide junction/spurs. A blocked central unloading edge is not passable.
- Each delivery returns to H for the next load unless the scene explicitly depicts an equivalent continuous legal return; no teleport animation presented as a traversable route.
- A proposed path is previewed as far as known legal edges. An invalid cart route **stops before** the restricted edge; no step into stairs, narrow passage, unloading or fake ramp. User remains able to inspect and choose again with no penalty.

## 2. Logical state / actions (proposed)

`phase`: preview → arrival → books → tea → flowers → signs → memories → chronicle → completed.

`position`: existing graph node/edge; `load`: none|books|tea_cart|flowers; `selectedRoute`: S|N|L|null; `pathComparison`: unseen|stairs_observed|arcade_observed|explicit_comparison|revised; `deliveries`: book/tea/flowers booleans; `signsImproved`, `oldGlyphSeen`, `stationMemoryHeard`, `gardenMemoryHeard`, `chronicleSeen`; `dialogueQueue`, `readOnlyReplay`, `hintStage`.

| Action | Precondition | Effect | Recovery |
|---|---|---|---|
| `begin` | preview and E02 prerequisites | arrival / opener | no skipping required lines |
| `inspect` load/entrance | scene active | show *already visible* physical constraints; no completion credit | close/back |
| `select_route` | active delivery, legitimate displayed path | preview/move; respect graph and cargo legal edges | retry at safe entrance if route unfit |
| `route_unsure` | active route choice | optional supportive comparison cue, never advances delivery | return to same choice |
| `deliver` | at requested destination with legal traversal | exactly-once delivery event; return to hub flow | avoid duplicate on repeat |
| `compare_cart_paths` | tea load and observed visible stairs/width (or accessible explicit route comparison) | allow `cart_route_revised` after the child chooses/reconfirms a suitable cart route and demonstrates load/route comparison; never require an actual bad traversal | no forced failed route |
| `install_sign` | all three delivered | choose valid WALK/CART sign at real fork; visually persist | explain why invalid signs point to unusable edges |
| `inspect_glyph` | sign flow complete, physically adjacent stone | old marker event; *not* old history proof | revisit |
| `hear_memory` | glyph seen and speaker available | attributed station/garden events, either order | replay/read again |
| `open_chronicle` | two attributed memories | render today vs unverified memories | close/reopen |
| `finish` | all intended events and Chronicle seen | exactly-once episode completion | completed replay only |

**Critical comparison branch:** If a child chooses L immediately for the tea cart, do **not** require deliberately choosing a bad path. Offer a two-path visual comparison (“Why would the cart stop at these steps?”) and let child indicate steps/width/load and confirm L. This is a **changed-needs comparison**, not a historical claim that the player ever chose the steps. The existing event ID describes the conceptual plan revision; implementation should additionally store route-attempt telemetry separately (ephemeral) so analytics does not misstate an attempted mistake. If a child first chooses S/N, show the boundary and allow another route. If the child requests help repeatedly, show the physical restriction then ask them to confirm a legitimate cart path; never leave them indefinitely unable to finish due to inability to verbalize the comparison. In both branches Finn's learning occurs *after* child observation, never before.

**Delivery C:** the flower tray needs a level, steady approach. Accept any graph-valid stable route, not an arbitrary L-only answer if geometry permits an equivalent. Path legalities must match depicted physical surfaces.

## 3. Runtime/UI affordance guard

Desktop: spacious scene and independent Parent View. Mobile landscape: scene first, bounded bottom RPG caption/portrait dock, 44 CSS-px target size, no right-hand overflow, choice labels do not wrap awkwardly; fallback portrait usable. Short screens 568×320 and 667×375 are mandatory render test sizes. Controls must not shrink scene during a move by transient “walking” banners; no forced document-level scrolling for ordinary gameplay. Scene actors/labels and route entry points remain visible. Listen remains browser read-aloud/manual replay, not prerecorded audio. Optional directions map is an overlay only on request, never a replacement for actual route selection.

## 4. Event projection

Source E01: `wondervale-progress-v1`, E02: `wondervale-s01e02-progress-v1` — read only. E03 must have an independent namespace, e.g. `wondervale-s01e03-progress-v1`; final schema/version to lock at implementation. Events named in EPB rev 2 are emitted once in canonical play only. Attempt-level path choices are not canonical “failures.” A deliberate E03 restart resets only E03; historical replay cannot award/change durable events. Visible signs and Chronicle derive from canonical ledger, including resumed/reloaded play.

## 5. Spoiler and continuity gates

Old stone glyph is present in the world art but may only receive a *historical-mark discovery* after appropriate inspection; should not be replaced by a newly made sign. Neither resident has omniscient route chronology. Maintain Riverside closed and no hint about the Common. No automatic changes to E01/E02 entry, art, save, dialogue or packages.

## 6. Source QA decisions (2026-10-14)

1. **Fixed vs flexible order:** preserve A → B → C for the initial playable authoring contract, so Finn has a clear success-then-revision beat. Players retain freedom **within each delivery** and may revisit paths; do not claim all three task orders are supported in the initial runtime.
2. **No phantom failure:** an immediate correct L selection remains a valid successful delivery. A separate S/L visual contrast, not an invalid route animation, supports understanding. The milestone event is not evidence of an actual failed route.
3. **Cargo rules:** books may use S/N/L; loaded cup cart only L; flower tray uses graph edges with actual steady-level flags, not arbitrary route names.
4. **Route graph proof:** before art approval or implementation, preserve an explicit path-edge table for walker/cart/stable tray and destination connectivity. Prevent the illustration from suggesting paths forbidden by the graph.
5. **Sign feedback:** invalid sign placements must be recoverable without permanent wrong signs. Parent cue is independent and never gating.
6. **Source QA is documentary only:** no engine/browser/mobile test has run.

## 7. Authoring issues still open

Graph coordinates/widths, character/parcel staging, final sign facing, optional delivery order, load animation, exact hint panel timing, final spoken line QA and audio voice files. Current preferred fixed A→B→C narrative order supports Finn's first-success-then-failure arc. This spec is not executable code or tested QA.
