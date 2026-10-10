# S01E02 Riverside — topology, counterevidence and player-agency design (E02-0)

**Design state:** E02-0 OWNER PASS on 2026-10-10; accepted upstream design, now referenced by EPB rev 2 `approved_for_script`. This is **not** final art, line-by-line script or runtime.

**Source baseline:** GitHub `main` `fd9943ba9e712db22e2719feed6f0f5fb5c41977` (2026-10-10). See [E02 brief](EPISODE_PRODUCTION_BRIEF.md), [kickoff](../../../docs/E02_KICKOFF_2026-10-10.md), [Season 1 canon](../../../docs/SEASON_1_ARCHITECTURE.md), [E02 weave](../../../docs/SEASON_1_LEARNING_WEAVE.md) and [E01 anti-regression lessons](../../../docs/E01_LESSONS_LEARNED_2026-10-10.md). E01 first-playable prototype remains owner-PASS and frozen.

## 1. One coherent Riverside: old path, new edge, public overlook

**Selected staging:** a lively, used **near-bank promenade** runs west-to-east beside an ordinary calm Riverside channel. The trio enters from Town Square at its west end. An **old paved bridge approach spur** diverges from the promenade toward the water. A substantial **current pedestrian closure barrier** terminates this old spur *well before* the protected water edge. Past the barrier, the old bridge deck is absent. The **near bank now has a continuous newer stone retaining edge and public railing**, interrupting the former alignment; the opposite bank retains a small old masonry landing but no usable connected bridge. The Riverside still has normal people-friendly paths. We neither date nor explain the alteration.

A clearly signed, **public, level/sloped side path** branches from the promenade *on the same near bank*, away from the closed spur, to an existing fenced/protected **Riverside Overlook**. This is the safe way to see the changed edge and distant old landing. The side path is **already legally open**, not a barrier to break, a private gate, a puzzle lock or a temporarily hazardous walkway. When the player walks Milo there, the overlook becomes a **persistent discovered/available destination** in the Wondervale world and Chronicle; the world grows through accessible wayfinding and knowledge, **not a magical structural change**.

### Topological sketch (conceptual, NOT illustration/collision coordinates)

```text
                         FAR BANK (not traversable in E02)
    old opposite landing [A2]       present paths; no bridge deck
    ===========================================================
             water gap / old bridge alignment  [B1]
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    changed near-bank edge + protected railing
                 [CLOSED OLD SPUR]     [SAFE OVERLOOK V]
                 closure fence [F]           /  public path
                     |                      /
                old stone base [A1]        /   sign: LOOKOUT
                     |                    /
 WEST: Town Square -> +---- PROMENADE ---+---- ordinary riverside
             spawn          walkable near-bank walkway
 ```

**Geometry invariants for visual/engine production:** no walkable mesh, click target, tap interpolation, follower path, teleport, keyboard move or assist route connects `F` to the water/far bank. Milo's **feet** stop on paving in front of `F`, without climbing it. The overlook entrance branches on the safe side of the barrier. Water/new edge/old opposite landing are inspection-only distant art, not simulated traversable areas. Guardrails stay continuous. Visual/collision coordinate polygons are **not** finalized until Riverside master artwork and phone framing are approved. Labels/hotspots are offset from character heads and vital evidence; safe spawns/transitions remain on paving.

**Safety language:** physical signs say **CLOSED / DO NOT ENTER** at the old spur and **RIVERSIDE LOOKOUT** at the public ramp (simple illustrated sign + captions; no color-only code). A rejected attempt to follow the closed spur simply stops Milo in front of the fence with an unambiguous calm explanation; it does not reward searching for an opening. The scene is an observation walk, not a river rescue, repair challenge, risky jump or erosion tutorial.

## 2. Evidence and falsifiable first idea

**Milo's initial hypothesis, expressed before the contradictory view:** *"Maybe the new fence is the only change. The old way is still there behind it."* This is plausible on first arrival from the old-route stone footing and fence; **not** a statement of fact.

| Evidence ID | When / where safely observable | What it warrants | What it does NOT establish |
|---|---|---|---|
| `ev_e02_old_stones` (A1 + A2) | From the public promenade by the closed-spur fence, observe a worn near-bank bridge footing and a visually matching far-bank landing lining up with the old map direction. A distant-landing zoom is a fixed inspect view, not a character approach. | A genuine older connection once aligned here; the E01 map is not merely a random invented line. | Whether the bridge was ever safe/reliable, the exact date, who changed it, why it stopped. |
| `ev_e02_changed_edge` (B1) | From the legal side overlook, inspect the visible **open water gap with no continuous bridge deck** where Milo imagined an intact path. | A fence is **not** the only obstruction: walking farther would not reveal the complete old bridge. This directly contradicts the “fence only” hypothesis. | Whether water, maintenance, construction or another cause removed the former crossing. |
| `ev_e02_new_edge` (C) | From the overlook, also see newer uninterrupted stone edging/railing meeting the former approach. | The present physical edge/path geometry **is different** from the old connection. Reinforces B1 without an invented cause. | A construction date, a flood story, a culprit, exact historical sequence. |

Only **A1+A2 and B1** are mandatory evidence categories for the correction; C strengthens the visual comparison and is not a third scavenger-hunt checkbox. Inspection does not require precision targeting a tiny object: each public station has one large grounded `Inspect old stones` / `Look across` action with caption, optional zoom and manual Listen.

**Revision the child can choose:** *"The old route was real, but the bridge is not here now. Maybe more than the fence changed. We do not know why yet."* A second valid form can emphasize *"The edge changed"* and uncertainty. The interface must not present “the bridge washed away” or any single unproven cause as the accepted answer. Neither the Common nor the North Hill chronology is revealed.

**Character differences:** Milo first wants the neat fence explanation, then visibly accepts the contradictory observation; Nia distinguishes *we see* (stone ends, missing deck, new edge) from *we think* (unknown cause) and records evidence without pre-answering; Finn notes that two old footings line up but a usable crossing needs a continuous surface. Finn must not repair/build a detour or act as a fact-revealing NPC. **No extra Riverside NPC** is needed for E02-0; populated environmental details remain allowed.

## 3. Actual child-driven play: route exploration + evidence revision

**Mechanic 1 — Choose a safe viewpoint, in an explorable scene.** The old spur and `LOOKOUT` branch are both legible from the promenade. The player controls Milo with ordinary click/touch/keyboard movement; an explicit accessible `Go to lookout` action follows the **same safe route**, not a teleport or barrier bypass. The child can approach the closed fence, inspect old stones, turn back, and follow the signed public ramp. There is **no forced order** for inspecting stones versus visiting the overlook, no timed target and no mandatory map pop-up. At the overlook, changing the camera/viewpoint reveals the missing-deck gap and new edge at readable scale. The physical footway has been open all along; *first legitimate arrival* persistently unlocks the overlook as a revisitable world destination. Neither a gate nor closure is moved.

**Mechanic 2 — Test Milo's idea against evidence.** Milo offers the *fence-only* idea **before** the `Look across` contradiction becomes narratively explicit. After both observation categories are available, a small child-controlled notebook offers two **named, pictured observed facts** and asks *which does not fit the “fence only” idea?* The child selects the **missing continuous bridge deck / open gap** as the undermining observation, using a large evidence tile, keyboard selection, or one-button accessible alternative. It is evidence-to-claim matching, **not** the E01 overlay-map comparison or scratch/cleaning minigame. The old-route fragment is optional on **explicit request** as a small reference, never repeatedly auto-opened. The kid then chooses either of two evidence-respecting, uncertainty-preserving revision phrasings; choice is **episode-local**, not a story branch or exam grade.

**No-fail recovery:** selecting the *old stones* tile is not “incorrect/try again” punishment: the trio explains that this confirms a past path but **does not show a walkway behind today's fence**; the view remains open and the other evidence is still accessible. A child may take `I'm not sure` at first; the notebook explicitly keeps that uncertainty and asks which seen fact makes certainty about *only the fence* harder. Layered hints progress (1) distinguish “was” from “is”; (2) look at the gap from the public lookout; (3) highlight the large missing-deck evidence tile; (4) model the evidence link if requested. No random-click completion, no looping dialog, no speech recognition, no requirement to say a word aloud. The necessary evidence must have been **visually presented** before any final revise/uncertain-with-evidence action counts.

**Player-selected exploration order:** `old stones → overlook` or `overlook → old stones` both work. If the overlook is visited first, record the viewpoint and facts; Milo's explicit initial idea is still voiced **before the contradiction is treated as a correction**. Subsequent notebook review never erases the fact that the child saw the place earlier. On wrong-path movement, Milo reaches a visibly safe standing spot at the barrier and can immediately turn toward the public path; no repeated modal loops.

**Market Lane continuity hook:** from the actual overlook, after evidence reflection, a partly occluded surviving **route mark on the near-bank lookout-side wayfinding fixture** becomes legible as pointing toward **Market Lane**, a next district reached by normal present-day paths. The mark does not decode the blank E01 glyph; do not place an E03 route solution or later-season history on art. The same fixture may be visible earlier, but its fine direction should become readable only at the intentional discovery viewpoint/cue, not be baked prematurely into the master scene.

## 4. Working beats, gates, and player-visible consequences

| Beat / working scene | State/trigger | Visible player consequence | Checkpoint/evidence |
|---|---|---|---|
| `s01e02-sc00` preview | E01 required ledger present | Very short E01 Chronicle link; `Begin` to Riverside; no automatic repeated old map | Fresh E02 only |
| `s01e02-sc01` arrival | On promenade; Milo initial fence-only theory before correction | Riverside is active, old spur visibly closed, safe lookout sign present | Save safe paving start |
| `s01e02-sc02` investigate | User can explore either valid observation station | Old footings/landing and gap/new edge visually observed; independent station flags; viewpoint arrival unlocks revisitable overlook immediately | Local per-station checkpoints; idempotent overlook event |
| `s01e02-sc03` revise | Both required evidence categories seen | User links gap to theory, qualifies/revises; no score; optional parent cue only now | Evidence-link and revision checkpoint |
| `s01e02-sc04` lookout mark | Reflection complete, child at overlook or can safely return via signed route | Surviving mark points toward Market Lane; old crossing remains closed | Once-only Market Lane discovery |
| `s01e02-sc05` Chronicle | Valid observation, revision, safe arrival and mark | Side-by-side **THEN / NOW** memory and uncertain cause; mark points toward E03; player can revisit overlook | Complete event once; unlock E03 |

The fact that the child may reach the overlook before `sc03` means scene IDs are **narrative phases**, not a rule that freezes walking to a single rigid linear scene. The later mark can be read in the same overlook camera without forced backtracking; it is never globally unhidden by changing the physical river.

## 5. Continuity / testable event proposal (not yet an engine schema)

**Prerequisite:** existing E01 `episode_completed:s01e01` and `s01e01_town_square_old_marker_revealed` (use existing E01 ledger; do not fabricate E01 state). Reuse the map/marker as known historical evidence, never reset it. Check that the real E01 engine has `s01e01_old_route_points_toward_riverside` as a second marker fact.

Proposed IDs, to be validated at E02-1/E02-2 against the E01 state and compiler:

| ID | Scope / trigger | Derived meaning |
|---|---|---|
| `s01e02_old_stones_observed` | Episode-local inspection flag; save in E02 checkpoint | A1+A2 observation is available in notebook |
| `s01e02_changed_edge_observed` | Episode-local inspection flag; save in E02 checkpoint | B1/C observation is available |
| `s01e02_gap_disconfirms_fence_only` | Episode-local reasoning milestone after a valid evidence link | Milo's initial idea no longer fits all facts; allow uncertainty |
| `s01e02_riverside_overlook_accessible` | Canonical once, when Milo **reaches by public side path** | Present-world Riverside Overlook available/revisitable; old bridge STILL closed |
| `s01e02_old_connection_changed_confirmed` | Canonical once, after evidence-linked revision | Past connection evidenced; no usable present bridge, reason unknown |
| `s01e02_market_lane_marker_recorded` | Canonical once, after intentional overlook marker encounter | E03 destination hook present; no complete route puzzle solved |
| `episode_completed:s01e02` | Canonical once, after Chronicle and required facts/overlook | E03 becomes eligible |

**Atomic write requirements:** derive current world from unified canonical ledger; E02 local checkpoint and E01 checkpoint have separate `episode_id` and `contentVersion` namespaces. No E02 control may overwrite E01 saved snapshot, E01 line IDs, old marker state or existing Chronicle page. E02 route marks/overlook persist even if player exits early and returns; completion remains independent. Handle denied storage, duplicate clicks, refresh at each station, and historical replay as **read-only**; replay neither duplicates events nor closes the opened overlook. Exact storage migration/routing mechanism is for the engineering layer; event names are a design contract pending schema lint, not shipped code.

**Episode choices:** observation order is ephemeral; first hypothesis/revision wording is episode-local; look-out discovery and evidence-backed route history are canonical single-path. No canonical branch; no arbitrary “bridge repaired” event.

## 6. EFL, parent and visual QA handoff

- **Functional language:** `same / different`, `was / is / changed`, `because`, `maybe / I don't know yet`. Candidate short child-facing prompts: “The old stones line up.” / “The bridge is not here now.” / “The fence is not the only change.” / “We don't know why.” These are **examples**, not locked voice lines.
- **Parent cue `s01e02-cue-01` (proposed):** only after Milo's initial theory **and** child-visible changed-edge evidence, before/at evidence-link choice. Draft: “What can we see that doesn't fit Milo's first idea?” Optional second: “What do we know, and what do we still wonder?” Parent must not identify the gap before child can see it. Desktop parent panel remains beside child scene; mobile has separate Parent View. Solo play and layered child hints are sufficient.
- **Chronicle:** one illustrated old footings/route view, one current gap/edge view, a clear `THEN` vs `NOW` distinction, an explicit *why unknown*, a visible public overlook destination and a Market Lane pointer. **No route score**. Avoid saying the historical bridge is repaired or the river has been fixed.
- **Art state matrix before generation:**
  1. Arrival: existing Riverside life, old spur closed, public lookout sign visible, bridge gap physically exists but contradicton not pre-narrated; no Market Lane answer readable from this camera.
  2. Promenade inspect: near/far old stone endpoints align, missing connection not explained; no character placed in river or atop closure.
  3. Lookout inspect: missing deck and newer retaining edge readable together **at phone scale**, without zoom requiring pixel hunting.
  4. After child arrives: public lookout recorded/highlighted as revisitable; physical barrier unchanged.
  5. After reflection: Market Lane direction mark legible from intended lookout view, not omnipresent in pre-reveal environment.
  6. Chronicle/replay: visible past and present distinguished without falsely rendering a continuous present-day bridge.
- **Before-art camera geometry QA:** storyboard one coherent near/far-bank orientation; pedestrian path and walkable feet masks; barrier stand-off; side ramp and protected overlook; far-side area exclusion; large tactile/keyboard inspection stations; responsive 1366×900 and 320/360/390/430 portrait + short window/landscape; portrait, actor names and RPG dock must not cover crucial gap; Milo/Nia/Finn offset, feet/paving and start-to-play no teleport. Test on screenshots, not abstract hotspot coordinates. C01 approved trio identity; reuse existing portraits and Listen affordance.
- **Safety & accessibility:** icons plus text, visible speech captions and explicit replay; control remapping/tap-to-route; no time/dexterity/precision challenge; no audio-only evidence; no self-built bypass, unsafe climbing, negative feedback on uncertainty or hidden adult-only gate.
- **E01 regression:** E01 main/runtime/art/scripts stay byte-for-byte unchanged in this design PR. For a later E02 engine PR, rerun latest-HEAD E01 interaction, first-visit, save/replay, mobile crop, labels, old scratch/finish, and deployed SHA tests.

## 7. Decision gate and downstream boundaries

**Owner PASS received (2026-10-10) for the **material E02-0 choices**: two-ended old bridge evidence + missing deck/new bank edge; public same-bank signposted path; notebook disconfirmation; Market Lane clue visible from lookout. Their narrative *function* is season canon; their **specific physical composition** is proposed here.

**After E02-0 approval:** EPB rev 2 has been promoted to `approved_for_script` after checking its required fields and authoring IDs. Next draft E02 detailed script and interaction specification. Do **not** generate final art, audio, voice text or runtime in this layer. Keep E01 frozen.
