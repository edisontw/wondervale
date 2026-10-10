# S01E02 Episode Production Brief — The Bridge That Stops

**Status: DRAFT — E02-0 TOPOLOGY / COUNTEREVIDENCE / INTERACTION DESIGN PROPOSED for owner review (2026-10-10). NOT `approved_for_script`; no final dialogue, art, audio or runtime.**

**Detailed E02-0 design contract:** [Riverside topology, evidence, player agency and acceptance gates](RIVERSIDE_E02_0_DESIGN.md). This brief summarizes the proposed decisions; the linked design document contains the staging diagram, evidence/interaction detail and anti-regression tests. Any later script must preserve both after acceptance.

## Identity

```yaml
episode_id: s01e02
season_id: s01
arc_id: s01a01
working_title: "The Bridge That Stops"
brief_revision: 1
brief_status: draft # E02-0 design proposed; owner review pending
content_version: pre-release
estimated_duration_min: 12 # provisional planning only; verify later with families
estimated_duration_max: 20 # provisional planning only; verify later with families
```

**Upstream canon:** [Season 1 architecture](../../../docs/SEASON_1_ARCHITECTURE.md), [Season 1 learning weave](../../../docs/SEASON_1_LEARNING_WEAVE.md), [Character/World Bible](../../../docs/CHARACTER_WORLD_BIBLE.md), [World continuity](../../../docs/WORLD_CONTINUITY.md), [Episode Brief Standard](../../../docs/EPISODE_PRODUCTION_BRIEF.md), [E01 locked EPB](../s01e01/EPISODE_PRODUCTION_BRIEF.md), [E01 lessons](../../../docs/E01_LESSONS_LEARNED_2026-10-10.md) and [kickoff](../../../docs/E02_KICKOFF_2026-10-10.md).

**Inherited E01 results:** Town Square's first old route marker is visibly cleaned; its arrow says RIVERSIDE. The older map is documented in the Chronicle. Milo/Nia/Finn know the old route connects to real places but do not know the missing place or why the route changed. No E01 discovery may be undone; E02 does not solve the blank-symbol mystery.

## 1. Episode contract — canon (locked by Season architecture)

- **Purpose:** the first Riverside exploration proves the old route cannot be followed literally today.
- **Opening:** child-controlled Milo and companions follow the E01 marker toward Riverside; a usable everyday Riverside already exists and should not be shown as wholly destroyed.
- **Central problem:** the mapped former connection ends at a **newer barrier and changed physical edge**. The trio must infer what changed without going through, over or around the hazardous closure.
- **Local stakes:** reach a legitimate public viewpoint and understand why the old map and current layout do not align. This is an investigation, **not** an emergency or speed challenge.
- **Required character beat:** Milo initially prefers one tidy explanation; observation of physical evidence forces him to **revise it or explicitly admit alternatives**. Nia observes/records; Finn interprets structural/path clues, but neither provides the final answer automatically.
- **Resolution:** the child can open/use **safe side access to a Riverside overlook**, with the barrier remaining a genuine boundary. The older route is confirmed historically real but not the present usable way.
- **Persistent consequence:** the Riverside overlook becomes safely available in the present world; Chronicle stores evidence that past routes and current places can differ. The closed route **remains closed**.
- **Continuation:** a surviving route mark suggests busy **Market Lane** (S01E03).
- **Non-goals:** no treasure answer, no reveal of the Common, no explanation of the *complete* route history/North Hill closure, no repairing/reopening the unsafe bridge or bypassing a barrier, no villain, no fixed-clock penalty, no forced formal cartography lesson, no new character canon.

**Continuity warning:** examples in generic `docs/WORLD_CONTINUITY.md` about repairing a Riverside Bridge in a different episode are **illustrative syntax, NOT Season 1 canon**. The authoritative Season architecture says safe side overlook access in E02; never confuse this with barrier/bridge restoration.

## 2. Character contract

| Character | Enters | Episode change | Must not do |
|---|---|---|---|
| Milo | Energized by E01 discovery; likely quick explanation | Notice disconfirming clue, revise the theory while remaining eager to try safe approaches | Treat the barrier as an obstacle to physically defeat; become passively guided |
| Nia | Recorded the old map and cleaned marker | Label direct observations and uncertainty, help preserve a before/now comparison in Chronicle | Lecture or make uncertainty disappear |
| Finn | Alert to mounting/path structure | Notice a material/geometry feature that challenges Milo's idea; help reason about safe options | Build a bypass, jump/force the barrier, monopolize explanation |
| Riverside locals/NPC | Not necessary for E02-0 | No new named speaking NPC; ambient passersby/ordinary Riverside life only, if desired after visual review | Deliver an omniscient history lecture or a mystery answer |

## 3. Proposed scene / beat map — E02-0 coherent design

**Material design proposal, awaiting owner signoff; not final script IDs.** The scene IDs remain `s01e02-sc00`–`sc05`; `sc02` inspection is freely explorable, so scenes represent narrative jobs rather than forcibly sequential player movement.

| Scene | Mode / location | Required beat | Player agency / exit |
|---|---|---|---|
| `s01e02-sc00` | Preview / Chronicle | Recall E01 cleaned RIVERSIDE marker; keep map optional | Begin, no forced replay of E01 |
| `s01e02-sc01` | Riverside arrival / public promenade | Milo proposes **"maybe only the fence changed"** before contradictory observation is discussed | Choose public exploration route |
| `s01e02-sc02` | Promenade + safe lookout | From closed-spur standing spot, inspect aligned old bridge footings; via open **signed public side ramp**, reach overlook and see missing deck/open gap + new near-bank edge | Any order, independent large inspect stations; first safe arrival unlocks revisitable overlook; **no barrier bypass** |
| `s01e02-sc03` | Evidence notebook | Child links **missing bridge deck / gap** to the weakness in fence-only idea, then qualifies/revises without claiming a cause | Required visible observations and recoverable evidence choice, not a scored answer |
| `s01e02-sc04` | Same protected overlook | Surviving near-bank wayfinding mark points toward Market Lane only when intentionally inspected | Can stay if already there; no forced walk away and back |
| `s01e02-sc05` | Chronicle close | Then/now evidence, unknown why, opened safe overlook and Market Lane hook | Save canonical facts once and complete E02 |

**Route/sketch:** see the [design contract](RIVERSIDE_E02_0_DESIGN.md): Town Square enters from west → live near-bank promenade → old stone approach terminating at closure fence; across water an old matching landing, **no deck**, now-new near-bank retaining edge; independent public same-bank walkway to a protected overlook. Far bank/water/closed old spur beyond barrier are never traversable. The current Riverside remains functional.

## 4. Proposed interaction contracts — distinct from E01

### `s01e02-int01` — Walk to the viewpoint and see what changed

- **Reason / cognitive action:** test whether a drawn historic route still offers a present crossing.
- **Player action:** control Milo on the public promenade, inspect old footings at a large safe-standoff spot; choose the clear `LOOKOUT` sign and follow a same-bank public side ramp to an elevated protected view. The two inspection stops can occur in either order. A keyboard/touch `Go to lookout` route uses the identical safe path.
- **Visible information:** E01 map fragment on optional request; worn aligned footing/landing `ev_e02_old_stones`; at lookout the open gap/absent bridge deck `ev_e02_changed_edge` and newer retaining edge `ev_e02_new_edge`. All are directly observable **before** the player must conclude.
- **Feedback:** old stone evidence confirms a prior connection; lookout changes *what the child can see*, proving that a fence alone does not explain today's broken continuity. First legitimate overlook arrival persistently adds a revisitable safe world destination; the former route stays closed.
- **Failure/recovery:** selecting old spur stops Milo visibly **before** the closure, explains it is closed and leaves the safe signposted route reachable. No climb, hidden bypass, physical unlocking, countdown, pixel hunting or forced map modal.
- **Evidence:** child reaches safe view and has inspected both required evidence categories; no hotspot-count-only progress.

### `s01e02-int02` — What doesn't fit Milo's idea?

- **Reason / cognitive action:** revise an explanation using disconfirming physical evidence, retaining uncertainty.
- **Player action:** in a small observed-facts notebook, choose which visual fact undermines Milo's initial **"the new fence is the only change"** idea. The `missing deck / water gap` tile disconfirms it; the `matching old stones` tile instead supports a real *past* connection. Child then selects an evidence-respecting qualified revision (“the way was there; it isn't here now; we don't know why”), with optional spoken explanation but no speech requirement.
- **Preconditions:** both observation categories seen; Milo's first idea explicitly heard/read **before** correction; notebook facts are never hidden answers. The optional E01 old map is not a matching-overlay puzzle.
- **Recovery:** old-stones selection triggers an unscored, helpful distinction between *was* and *is*, with a direct return to gap observation. `Not sure yet` is allowed; it becomes a valid reasoned pause after linking at least one contradicting fact. Two supported revision wordings lead to the same canonical world state. No trivia quiz, punitive error or infinite dialogue loop.
- **Accessibility:** pictured, named large tiles, sequential tap or keyboard choice, manual Listen, motor-accessible alternative and optional progressive hints.
- **Evidence:** explicit observed fact → hypothesis contradiction/qualification link; not a random sequence of clicks.

**Not E01 cloned:** no scratch meter, noticeboard, repeated automatic map pop-up or overlaid physical-landmark matching. Visit the [design contract](RIVERSIDE_E02_0_DESIGN.md) for exact observation state and order-independence.

## 5. Learning and EFL contract — directly from approved Season weave

**Primary (exact):**
1. Revise an explanation when evidence does not fit.
2. Compare a mapped connection with present physical space.

**Secondary:** cause/effect reasoning with uncertainty.

**Revisit:** E01 "what we notice versus what we think" now applied to an environmental change. It is **not** a second E01 observation exercise with the same surface actions.

**Misconceptions to design against:** one change explains everything; a barrier is a puzzle to bypass; an old-versus-new map mismatch means either map must simply be wrong.

**Meaningful evidence:** child notices evidence weakening the first cause and **changes or qualifies** the explanation.

**EFL communicative functions:** compare **same / different**; contrast **was / is / changed**; explain **because**; express uncertainty. Exact new vocabulary, voice lines, number of hints and sentence caps are **not locked**. Essential safety distinctions must be visual **and** textual; accessible voice replay remains manual-capable.

**Reasoning standard:** simple wording must not remove competing possible causes or conceal the contradiction from the child.

## 6. Parent cue and supports — E02-0 proposal

**Proposed cue `s01e02-cue-01`:** after Milo offers his fence-only idea **and** the child has actually seen the lookout's missing-deck contradiction, and before/at the notebook evidence-link choice. Type: compare/challenge; importance: **recommended, skippable**. Draft: **“What can we see that doesn't fit Milo's first idea?”** Optional follow-up: “What do we know, and what do we still wonder?” The parent must not announce the missing bridge deck before it appears in the child's view, solve the cause, or tell the child where to click. Solo play stays complete.

Four distinct supports: language (heard/read `was / is / changed / maybe`), interaction (safe movement and tap-to-inspect demonstration), reasoning (first distinguish evidence of *then* from proof about *now*, next highlight lookout gap if requested), accessibility (equivalent keyboard/tap/one-action safe route, larger observation panels and audio-off captions). No mandatory parent gate; desktop parent pane and mobile Child/Parent views reuse E01 presentation.

## 7. Continuity / ledger / replay — proposed IDs

**Actual E01 prerequisites verified in `engine/episode.mjs`:** `episode_completed:s01e01`, `s01e01_town_square_old_marker_revealed` (and known `s01e01_old_route_points_toward_riverside`). E02 must leave all three and the E01 checkpoint unchanged.

| Proposed ID | Type / trigger | World fact |
|---|---|---|
| `s01e02_old_stones_observed` | E02-local checkpoint when inspected | Prior aligned footing/landing recorded |
| `s01e02_changed_edge_observed` | E02-local checkpoint when inspected | Missing deck/gap and new edge observed |
| `s01e02_gap_disconfirms_fence_only` | E02-local after evidence-link | Initial explanation corrected/qualified |
| `s01e02_riverside_overlook_accessible` | Canonical once, on **first safe public-path arrival** | Overlook is revisitable; **closed old connection remains closed** |
| `s01e02_old_connection_changed_confirmed` | Canonical once, after evidence-backed revision | Old route existed; current route differs; cause remains unresolved |
| `s01e02_market_lane_marker_recorded` | Canonical once, after intentional lookout-side mark inspection | E03 direction clue discovered |
| `episode_completed:s01e02` | Canonical once, Chronicle/end gate | E03 eligible |

These stable *design proposals* require schema/namespace lint before implementation. Overlook arrival may precede reflection; persist it immediately once and resume naturally. Source of truth remains the event ledger; E02 episode checkpoint cannot overwrite E01 save key/content version, replay is read-only, invalid/denied storage has clear recovery, reload retains prior events and note cards. No bridge-repaired event, no global mystery reveal, no canonical branch. Explicit E02 episode routing and E01→E02 state migration are engineering **OPEN** until E02-5.

## 8. Chronicle — defined E02-0 memory

- **Past:** image/note of two aligned old stone landings plus E01 route fragment; not a claim that the bridge still exists.
- **Present:** same-bank overlook view of missing deck/water gap and newer protected edge; old connection still **CLOSED**.
- **Milo's growth:** “I thought the fence was the only change. The bridge is not here now. Why it changed is still unknown.” Exact voiced lines remain open.
- **Persistent world change:** a named, revisitable **Riverside Overlook** via its normal public ramp; no repaired old bridge or opened hazardous path.
- **Future hook:** discover a nearby existing marker toward Market Lane. E03 is not solved in advance.
- **Information design:** `THEN / NOW` or `WAS / IS` with captions and visuals, no scored answers or presumed culprit.

## 9. Visual asset requirements / spoiler states — inventory only

**Reuse unchanged:** accepted C01 trio identity, usable E01 portraits and name-tag grammar, bounded full scene on phones, desktop Parent View / mobile Child/Parent toggle, bottom RPG dock and `Listen`. **No art generation until E02-0 acceptance and reference gate.**

**New staged references required:** (1) near-bank active Riverside promenade; (2) old footings/landings lining up but **no crossing deck**; (3) firm closure fence and feet-standoff on the approach; (4) newer stone bank edge and protected water boundary; (5) clearly signed same-bank public ramp and overlook; (6) old stones and lookout inspect crops at phone readability; (7) a lookout-side wayfinding marker toward Market Lane; (8) a Chronicle then/now spread and optional old-map thumbnail.

**State matrix:** arrival cannot spoil Market Lane or mystery; public lookout sign is already readable, closed old spur visible; stone alignment appears when inspected; gap/new edge readable at viewpoint; arrival marks the safe overlook as *known/revisitable*, not physically opened by moving a closure; Market Lane mark becomes readable **after** evidence reflection and intentional look, not permanently baked into the arrival master art. No stale E01 plate/scratch image as E02 prop.

**Before-art topology QA:** approve one orientation drawing with public walkable regions, barrier/water/far-bank exclusion masks, Milo + companion safe feet targets, clue legibility at fixed and phone crops, name label/portrait collision tests, no off-screen terrain and no invisible tiny buttons. Movement and companion separation must be tested on rendered images. See [exact diagram and risk list](RIVERSIDE_E02_0_DESIGN.md).

## 10. Audio/voice (function first)

Reuse a restrained shared town/riverside music family rather than generating many unique tracks. Distinguish natural water/steps/wood/marker feedback where meaningful, with equivalent visible/text cues. Silence remains valid for reasoning moments. Voice requires a **new E02 canonical script and stable line IDs only after brief approval**, character-consistent pronunciation and neutral narrator, caption and manual Listen on every spoken line; browser TTS prototype ≠ accepted voice recordings.

## 11. Episode-specific QA — proposed measurable gates

1. **Canon:** old route remains closed in all states; no cause/date/treasure/Common/North Hill reveal, repair event, new speaking NPC or E03 solution.
2. **Geometry:** from every spawn/station to both paths, clicks/keyboard/assist/followers never cross fence/water/far bank; trying closed spur stops on near-bank paving; public overlook reachable directly and via keyboard on actual artwork.
3. **Reasoning:** old footings = past connection, gap/missing deck = contradictory to *fence-only*; correction unavailable until both observed, but observation order free; wrong evidence tile triggers one helpful comment and remains recoverable.
4. **World change:** first legal overlook arrival creates exactly one revisitable unlock even if E02 is interrupted; closure always unchanged. Evidence-backed revision/Market mark/complete have idempotent independent gates.
5. **UX:** no auto-modal map, no duplicate Continue, no hidden forced rewalk; 320/360/390/430 phones, 1366×900, short desktop, mobile landscape: all essential scene, portrait, speaker text, names, evidence, paths and parent view remain accessible.
6. **State:** E01 completed+marker prerequisite; E01 keys/lines/art/scratch stay untouched; invalid/denied storage, fresh/incognito, refresh at each station, historical replay and completed E02 preserve correct events.
7. **Asset/privacy/access:** C01 source verified and no generated low-resolution placeholder accepted; every essential visual fact has caption/manual Listen; no precision drag or timer; screen captures confirm real geometry, not DOM-only checks.
8. **Release (later):** current PR HEAD CI tests pass, packaged release integrity checked and live MN4 SHA/build independently confirmed. Human PASS is scoped; deferred broad family testing and recorded voices remain open.

## 12. Remaining approval / downstream gate

**E02-0 material owner acceptance requested for:** (A) old bridge approach + matching footings + missing deck and newer stone edge, (B) signed existing **same-bank public path** and protected lookout, (C) child-controlled evidence-link correcting Milo's fence-only idea, (D) intentional Market Lane mark at the lookout. See [full design](RIVERSIDE_E02_0_DESIGN.md).

**Resolved at design-proposal level:** coherent safe geography; two critical observation classes and exact contradiction; distinct player interactions, meaningful choice and no-fail recovery; parent-cue timing; working E02 scene/interaction IDs and proposed ledger names; Chronicle/state and screenshot QA invariants.

**Open before `approved_for_script`:** owner acceptance of material Riverside composition/mechanic; final E02 IDs/schema-compatibility review; exact scene pacing and EFL word/line budget; detailed production cost and asset reference approval. The eventual script/interaction spec will define exact player text/animation/voice timing; engineering must subsequently choose namespaced E02 storage and cross-episode routing without rewriting E01. No E02 art/audio/runtime at this stage.

**Next focused task:** receive owner PASS or revise material design, then promote EPB to `approved_for_script` and author detailed E02 script + interaction specification as a separate layer.
