# S01E03 Episode Production Brief — Three Deliveries, One Wrong Turn

> **Gate 1 design draft rev 1 — NOT owner-approved / NOT approved_for_script.** This proposal implements the already-approved Season 1 E03 purpose without silently canonizing new details. No script, pictures, sound, runtime or deploy are produced by this document.

## Identity and authority

```yaml
episode_id: s01e03
season_id: s01
arc_id: s01a01
working_title: "Three Deliveries, One Wrong Turn"
brief_revision: 1
brief_status: draft
content_version: pre-release
estimated_duration_min: 12 # provisional, test with children
estimated_duration_max: 20 # provisional, test with children
```

Upstream: [Season 1 Architecture](../../../docs/SEASON_1_ARCHITECTURE.md), [Learning Weave](../../../docs/SEASON_1_LEARNING_WEAVE.md), [Episode Brief Standard](../../../docs/EPISODE_PRODUCTION_BRIEF.md), [World Continuity](../../../docs/WORLD_CONTINUITY.md), [E03 kickoff](../../../docs/E03_KICKOFF_2026-10-14.md), and [E02 brief](../s01e02/EPISODE_PRODUCTION_BRIEF.md). Production workflow: [Fast Lane](../../../docs/EPISODE_PRODUCTION_FAST_LANE.md).

**Non-negotiable inherited story facts:** E01 Town Square and E02 Riverside accepted playable states remain unchanged. E02 established a true historical route, an unusable/closed old connection, a safe public overlook and an inspected marker pointing to Market Lane. Nobody crosses or repairs the closed Riverside connection. The missing Common, North Hill history, and identity of the old-route destination remain unrevealed. Approved C01 Milo/Nia/Finn identity and illustrated living-diorama styling carry forward.

## 1. Episode contract

**Purpose:** A bustling, good-humored town delivery job turns a mysterious mapped route into a practical question: *a shortcut for whom, carrying what?* Break the clue-hunt rhythm without breaking the old-route arc.

**Opening:** The trio arrives via the presently usable approach to Market Lane. A temporary **legitimate market stall unloading area** occupies the middle through-lane; public pedestrian access remains open via signed side walks. Three waiting parcels must go to recognizable local destinations. Nobody needs to move the obstruction or enter an unsafe work zone.

**Stakes:** Residents need their ordinary deliveries and reliable directions, not speed records. There is no timer, score, spoilable shipment or money penalty.

**Turning point:** Finn enthusiastically recommends the visually shortest stair shortcut. It succeeds for a light hand-carried parcel but a cart cannot climb the steps; neither the trio nor the player is blamed for trying a plausible plan. On-screen evidence makes the mismatch understandable before judging the route. Finn changes from “This is the shortest!” to “Shortest for us. What about the cart?”

**Resolution:** Milo, controlled by the child, compares available paths by destination and load, carries/escorts three deliveries using workable routes, and helps place clearer *present-day* directional signs showing a level cart way and pedestrian way. The change remains in Market Lane afterward.

**Mystery exit:** An old-route glyph is noticed on existing market stonework, not conjured as a reward or reconstructed from the delivery signage. Two sincere residents independently recall the route toward an **old station** and **a garden**. Both accounts enter the Chronicle as attributed memories, not verified present-day arrows; E04 examines *when* each could have been true.

**Non-goals:** No new bridge, restoration of old routes, guilty/lost NPC, forced single correct universal route, board scratch, E02 photo/evidence notebook duplicate, exact distance arithmetic, timed cart-racing, mystery solution, or premature E04 time reconciliation.

## 2. Market Lane world/route contract — proposed Gate 1 geometry

**Topology concept:** one legible bounded market scene with a central collection point **H (Hub)** and destinations **B (Bookstall), T (Tea porch), F (Flower stand)**. Use three visibly distinct public paths, each traversable by Milo on foot unless explicitly noted. All paths have continuous legal connections, and there are no imagined teleport links.

| Route | Visual trajectory from H | Surface/constraint | Relative length (illustrative, not measured) | Uses |
|---|---|---|---|---|
| **S — Steps** | H → upper landing → B/T-side foot junction | Short, **stairs**, several shallow turns; hand-carried only | Shortest H→B | Light delivery; **not** cart |
| **N — Narrow arcade** | H → covered narrow passage → B/T-side foot junction | Level but **too narrow for loaded handcart**, corner at arcade exit | Medium H→B; handy for walking toward T | Hand-held; **not** cart |
| **L — Level outer lane** | H → past stalls → wide bend → B/T-side junction → F spur | Continuous **wide, level and turnable** public path | Longest H→B; good for handcart; required cart approach to F | All parcels and cart |

The pedestrian B/T-side junction connects **B** and **T** by ordinary level footway; the cart route L continues along its sufficiently wide section to both B and T. The F spur is off the *wide* outer lane before the B/T-side junction; it cannot be reached from the stair/arcade branch by cart. The temporary stall unloading blocks **only** the central straight-through connector H→B, not S/N/L or access to any legitimate shop. Each permitted edge is traversable in both directions; no step becomes a hidden ramp.

**Non-numeric implementation proof required before Gate 3:** create a node/edge graph, legal walking/cart flags, step labels, passable clear widths/turn geometry, arrival footprints and collision masks; verify H→B, H→T and H→F each have a physically connected legal path for the intended delivery. The guide map must visually match this graph. Relative “shorter/longer” may be shown by route-length segments; no invented precise meter counts at Gate 1. If art cannot convey all three paths on a small phone, prioritize one clear main view plus an optional simple *in-world route sketch*; do not create three incompatible geographies.

## 3. Three deliveries and why the constraints differ (proposed)

| Delivery | From → destination | Carrying / restriction | Child decision and comparison |
|---|---|---|---|
| **A: Small book bundle** | Hub → Bookstall B | Milo can carry it by hand; stairs/arcade/outer lane all possible | Try Finn's **short stair** route successfully; compare it with longer routes |
| **B: Stacked tea cups in a small handcart** | Hub → Tea porch T | Must **stay on cart**; no lifting over steps, narrow arch or tight turns; level outer lane is usable | Test whether the same shortest route works; visible steps prevent passage, then revise to **L**; notice that a longer route may be easier and fit the user |
| **C: Tray of flower pots** | Hub → Flower stand F | Hand-carried in a tray; requires **a level, steady route** to keep pots upright; cart may be optionally available but not necessary | Choose **L** to avoid stairs/awkward sharp turns; reason from the cargo, not from an arbitrary lock |

**Design safeguard for C:** The Flower stand must visibly connect to a stable level side spur; if players can reasonably reach F another equally steady legal way, recognize it as a successful alternate, rather than falsely declaring only one exact route “correct.” The flowers are not made physically dangerous or breakable. Delivery contents and NPC shop names are *draft defaults*, not upstream canon.

## 4. Player agency and interactive beat map

| Scene | Beat / information | What the child actually does | Exit |
|---|---|---|---|
| **sc00** Chapter opener | Short E02 recap: safe overlook; Market Lane mark | Begin; no E02 replay or forced map | Enter market |
| **sc01** Busy hub | Meet coordinator; see three items, shop landmarks, unloading obstruction and three public paths | Explore controls; inspect loads and route entrance clues before commitment | Choose A |
| **sc02** A: walker's shortcut | Finn proposes stairs, explicitly for light parcel | Select a route on walkable scene/sketch; move Milo/parcel along S or another legal route; compare | B delivered |
| **sc03** B: route under changed needs | Same map, visible cart/steps/narrow-width relation; Finn's shortcut now mismatches | Choose route, watch cart approach **stop before** stairs/narrow entrance, inspect why, choose another; L succeeds | Tea delivered |
| **sc04** C: carry carefully | Flower tray and F placement make ease/turning relevant | Child independently compares routes and uses a stable legitimate approach, with alternate solutions credited | Flowers delivered |
| **sc05** Improve current signs | Shoppers still confuse foot and cart routes | Child places/chooses clear arrows at known junction, checks destinations from both viewpoints; **not** an answer-key puzzle | Signs visibly updated |
| **sc06** Old mark & two voices | Inspect surviving stone glyph on current street; hear distinct attributed station/garden recollections | Child notices and preserves *both* accounts without choosing a liar or historical winner; optional “We don't know yet” | E04 hook, Chronicle |

**Freedom and feedback:** Order A/B/C is a recommended narrative rhythm for Finn's beat; exact delivery order may be flexible if the turning point still plays coherently and never presupposes an undelivered item. Routes are chosen in scene by destination/entrance, not by a static “correct answer” quiz. First attempted unsuitable cart path pauses at a visible safe boundary and explains what physically does not fit. “Not sure yet”, “Look at the load” and “Try another route” remain available; no punitive animation, lost item or repeated long dialogue. No automatic pre-highlighted winning path before the child compares options. Evidence of reasoning is the **route change when the carried load changes**, with optional “because” choice/speech, never speech recognition as a gate.

**Signs:** Wayfinding is an earned diegetic improvement (clear **WALK / CART** route icons and destinations), not a new magic connection. Player cannot place a sign directing carts into S or N. Original glyph is materially and visually distinct from the new signs and is only a historical *clue*, not a present instruction to follow it.

## 5. Characters and community perspectives

| Character | In / beat | Out / consistency guard |
|---|---|---|
| **Milo (child-controlled)** | Wants to help, tests paths, sees load differences | Makes actual route/revision choice, does not become a passenger to Nia/Finn |
| **Finn** | Efficient, playful shortest-path idea succeeds once, then fails for cart | Revises without shame; asks “Who can use this way?”; foreshadows E07, does not supply solution immediately |
| **Nia** | Observes the cart width, stair and turns, listens to people | Helps record route constraints and source attribution, not a lecture or universal answer |
| **Market coordinator / vendor** | Assigns small real needs; remembers a stationward route from their viewpoint | May know local use but not entire Season history |
| **Long-term resident** | Remembers a gardenward version plausibly and sincerely | Neither is discredited; no exact chronology yet |

The two memory speakers may be recurring market vendor and resident roles already anticipated in Season canon. Final names, age, clothing/portraits and precise recollection wording wait for script/character micro-pass; avoid adding unneeded cast.

## 6. Learning, English and parent support

**Primary (approved weave):** plan/compare routes under restrictions; reason that different users/objects have different workable paths. **Secondary:** shorter/longer, easier/harder, narrow/wide, stairs/level, turn. A “works” judgment depends on physical path and load, **not** speed alone.

**EFL intentions:** short authentic instructions “Go past the stalls.”, “Turn left.”, “Go up the steps.”, “Go down.”, “This way is shorter.”, “The cart needs a wide path.” and supported reasoning “This way works because …”. Show icons, cargo silhouettes and a route preview; keep required captions short (normally 3–8 words, occasional supported longer line), replayable via **Listen** browser/read-aloud fallback even when no audio assets exist. Avoid demanding long typed sentences or perfect English. Exact approved script text and stable line IDs will be generated after Gate 1 approval.

**Parent cue (recommended/skippable, not a gate):** **“Which route works for this delivery, and what makes it different from the others?”** Trigger after a cart route mismatch is observable, before the child selects a repaired route; do not give away L. Optional follow-up: “Who else might need the wider way?” Keep parent information independent from child action on phone, alongside on roomy desktop; solo experience fully works.

**Support ladder:** (1) repeat readable/Listen wording, (2) clarify select/move/route controls, (3) compare stairs/width/cargo visually without showing destination route first, (4) accessible equivalent keyboard/tap planning with no precision dragging. “Not sure yet” returns to observation without advancing a false completion flag.

**Accessibility/mobile:** minimum approximately 44 CSS-px actionable targets, full keyboard path and focus, high contrast text/visual distinctions, icon+words (not color alone), caption/portrait dock at bottom in mobile landscape, no offscreen button column or ordinary page scrolling at 568×320 and 667×375 where possible. Put route diagram/large observation overlay in bounded content, not a tall document; preserve portrait fallback and desktop independent Parent View. Moving actors and labels must remain outside the dialogue dock and avoid total overlaps. Sound off retains the complete story.

## 7. Continuity and persistence contract (proposed, NOT implemented)

**Verified from current `engine/s01e02.mjs`:** E02 emits `s01e02_riverside_overlook_accessible`, `s01e02_old_connection_changed_confirmed`, `s01e02_market_lane_marker_recorded`, and `episode_completed:s01e02`. E01 prerequisite in that engine is `episode_completed:s01e01` plus `s01e01_town_square_old_marker_revealed`. Proposed E03 *narrative unlock requirement* is E02 completion **and** Market Lane marker recorded. Keep the E02 save `wondervale-s01e02-progress-v1` and E01 `wondervale-progress-v1` unchanged. Downstream engineering must determine a read-only cross-episode prerequisite projection without injecting E03 events into either saved object.

| Proposed E03 event | Condition / fact |
|---|---|
| `s01e03_delivery_book_delivered` | A reached B by a legal route |
| `s01e03_cart_route_revised` | Child observed cart constraint and changed an unsuitable plan to a valid one; do **not** emit merely for viewing Finn's line |
| `s01e03_delivery_tea_delivered` | B arrived at T with cart on continuous legal path |
| `s01e03_delivery_flowers_delivered` | C safely reached F by route fitting load |
| `s01e03_market_wayfinding_improved` | All three delivered and legitimate new route signs installed/checked |
| `s01e03_old_market_marker_recorded` | Existing old-route glyph intentionally inspected; no mystery answer |
| `s01e03_station_memory_recorded` | One attributed resident recollection heard/read |
| `s01e03_garden_memory_recorded` | Other attributed recollection heard/read |
| `episode_completed:s01e03` | Three deliveries, route-revision evidence, sign change, old mark, **both** memories, and Chronicle close complete |

Child's unsuccessful proposal/route preview should be local retry state, not a permanent “mistake” event. All canonical events emit **at most once** in first play; reopening an episode uses a **read-only historical replay** isolated from canonical ledger. New E03-owned save/checkpoint namespace and atomicity verified at Gate 3. Restarting E03 clears **only** E03 attempt state when explicitly chosen; never erases E01/E02. Chapter resume remains consistent after route attempt, delivery, sign or narrative checkpoint.

**Chronicle:** one entry with today's three deliveries and the lesson that load changes route choice; Market Lane's new signs remain visible. A separate, source-attributed “station memory / garden memory — not yet checked” teaser leads to E04. Do not report either claim as established history.

## 8. Visual and audio production envelope — future gates only

Reuse exact approved **C01** trio identity, current independent actor/portrait assets and existing storybook/RPG caption/Listen/Parent/Chronicle presentation contracts. Suggested small asset plan after Gate 1 approval: **one main Market Lane painterly background**, a readable path/wayfinding diagram or overlay derived from the same route graph, and minimal composited prop state layers for unloading area, visible stairs/narrow arcade/wide turn, parcels/cart, signs before/after, historical stone glyph. Optional single focused cart-at-stairs close-up *only if* main scene is insufficient on 568×320. Prefer separate objects and editable arrows/text; no baked illegible sign copy or arbitrary NPC art multiplication. No art generation/upload in this gate. Defer prerecorded voices, music, ambience and SFX; **captions and Listen remain**, recordings may be introduced later by stable script ID.

Fast Lane image intake in Gate 2: approve useful scene candidate(s) before transfer, preserve original PNG and full-size WebP derivative, bundle one upload ZIP with exact paths/hash manifest, **one** manual GitHub intake if needed; check uploaded Git blob/source integrity once before assembly. Do not restart E01/E02 art trials.

## 9. Acceptance test matrix — design criteria, NOT executed

1. **Geometry:** connected H→B/T/F routes exist; cart routes never traverse steps, narrow arch or turning radius conflicts; market obstruction has no unsafe through-route; no “phantom ramp.”
2. **Real comparison:** a valid walker shortcut succeeds; the same cart shortcut visibly fails *because of known physical constraint*; choosing L then works. Other physically valid routes should be accepted.
3. **Learning agency:** player—not Finn—makes changed-load decision; a route revision is observable in state. No hidden right-answer hotspot, timer or punishment.
4. **Cargo-specific delivery:** books, cart and flower tray have genuinely different restrictions and destinations; attempts always allow recovery.
5. **Signs:** updated signs visibly persist and point to real current foot/cart paths; old glyph remains separate, discovered only by inspection.
6. **Memory:** source attribution for station and garden recollections; E03 cannot adjudicate chronology or show Common answer.
7. **EFL & parent:** short readable captions and optional Listen; parent cue appears *after* child can observe mismatch, never mandatory; keyboard/touch and solo path complete.
8. **Small-phone/desktop:** no cropped actor feet/labels, route options or dialogue; important content visible in 568×320 and 667×375 landscape plus portrait/desktop; 44px targets; contained internal scroll only if needed.
9. **Persistence:** refresh/restart/resume, exactly-once events, read-only replay; E03 reset doesn't mutate E01/E02; no E03 unlock until verified legitimate E02 finish + Market clue.
10. **Release isolation:** future E03 package includes only E03-owned media; E01/E02 binary/source/playable regression remains unchanged. Test current PR HEAD, then deploy and owner device PASS as separate gates.

## 10. Decision register / Gate exit

| Question | Rev 1 disposition |
|---|---|
| Episode premise, Finn's learning arc, Market Lane improvement, conflicting memories to E04 | **Locked upstream**, preserved |
| Three goods, three destinations and three S/N/L routes | **Proposed for owner Gate 1 signoff** |
| Cart cannot use stairs/too-narrow turns; usable level lane exists | **Proposed physical contract for signoff** |
| Brief structure, non-punitive choice/retry, meaningful load change | **Proposed interaction design for signoff** |
| New event names, E02 read-only unlock, separate saves | **Proposed authoring contract**, exact E02 IDs verified; not coded |
| NPC identities/names, route coordinates, widths, precise timings, exact scene dialogue, ID list, visual framing | **Open for focused downstream design** within the approved intent |
| E01/E02 audio and full family/device testing | **Explicitly deferred**, not PASS |
| E03 Gate 1 | **DRAFT — owner approval outstanding** |
| E03 Gate 2 image/art, Gate 3 running game, Gate 4 owner/deploy | **NOT STARTED** |

**Next focused task:** owner reviews the *three delivery/physical route/character beat* design and marks Gate 1 PASS or a specific material correction. Only then promote to `approved_for_script` and create one compact E03 detailed script + interaction spec/test matrix with line IDs, followed by Gate 2 visual selection. Do not call this draft approved or create art/runtime preemptively.
