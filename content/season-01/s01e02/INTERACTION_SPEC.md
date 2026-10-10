# S01E02 Interaction Specification — The Bridge That Stops

- episode_id: s01e02
- interaction_spec_revision: 1
- status: draft_for_review
- source_epb: content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md
- source_epb_revision: 2
- source_script: content/season-01/s01e02/DETAILED_SCRIPT.md
- source_script_revision: 1
- script_dialogue_lock: not_yet_locked
- scope: E02-2 behavioral design, NOT executable runtime code

**Authority:** Season canon → EPB rev 2 (owner-approved) + [accepted Riverside E02-0](RIVERSIDE_E02_0_DESIGN.md) → E02 script rev 1 (proposed exact dialogue) → this behavioral specification. If code/art cannot meet any contract, escalate to authoring layer instead of revising story facts silently. E01 game remains unchanged, with its own save and exactly 121 locked spoken lines.

## 1. Non-negotiable experience invariants

1. Child controls Milo; companions stay visibly separate on public walkable paving, with legible names/true RPG portraits. No person walks on top of the closure, into the river, or onto the far bank.
2. Riverside is active and usable. The old spur **always** ends before a firm closure. Across water, two aligned old bridge footings are evidence of a past path, but the current deck is gone and near-bank public retaining edge is different.
3. Public signed **same-bank** walkway/ramp to the protected lookout exists from the start. The player opens a revisitable **discovery**, not a physically locked gate. Never represent old crossing as repaired/reopened.
4. SC01 speaks Milo's fence-only theory before free evidence exploration. SC02's **two genuine** evidence categories are observed from distinct public viewpoints, in either order.
5. Player sees the gap from the protected lookout **before** its notebook tile is actionable. Nia/Finn may describe observed facts without deciding the cause.
6. Revision credit requires **both observed categories, an explicit child evidence-link to the missing-deck gap, and a qualified Milo revision**, not merely touching hotspots or pressing Continue.
7. The old stones tile is a plausible supporting *past* fact and is non-punitively contrasted with the *present* gap; no scoring/repeated failure loop.
8. The Market Lane readable mark is revealed by **intentional player inspection after the revision** at/near the lookout. No permanent spoiler baked into default background or old map.
9. The child may ask for help, decline a parent cue, repeat speech or revisit views at any time; none of these fake inspection/completion.
10. Persistence is ledger-based, idempotent, namespaced and read-only for historical replay. E01 marker and existing Chronicle remain intact, and E03 is not unlocked early.
11. All spoken text originates from the proposed script's bracketed IDs, then from a separately locked revision before voice production. Do not invent extra lines in the engine.

## 2. Stable identities and stations

- Scenes: s01e02-sc00 (preview), sc01 (arrival), sc02 (explore public stations), sc03 (notebook/revision), sc04 (Market mark), sc05 (Chronicle).
- Substantial interactions: **s01e02-int01** = movement/viewpoints and true world observation; **s01e02-int02** = evidence-to-hypothesis link and revision.
- Parent cue: s01e02-cue-01 (compare/challenge; sparse, after child-visible conflict, before notebook selection).
- Safe observation stations: **old_stones** = public fence-side standoff viewing near+far aligned old footings; **lookout** = actual reachable protected public platform; **changed_edge** = deliberate inspect action within lookout viewing the absent deck, water gap and nearer current retaining edge; **market_mark** = lookup fixture from the safe lookout, active after reasoning.
- E02 evidence vocabulary: **ev_e02_old_stones**, **ev_e02_changed_edge** required; **ev_e02_new_edge** corroborating visible texture/geometry but not a third required click.
- Existing E01 prerequisite events verified in E01 engine: episode_completed:s01e01, s01e01_town_square_old_marker_revealed; source also knows s01e01_old_route_points_toward_riverside.

## 3. State model (authoring semantics, not a final JSON schema)

| Field | Domain / meaning | Durable location |
|---|---|---|
| `play_mode` | first_play / historical_replay | runtime context |
| `episode_id` | s01e02; never reuse s01e01 save checkpoint | state namespace |
| `phase` | preview, arrival, explore, reason, mark, chronicle, completed | E02 checkpoint |
| `initial_hypothesis_presented` | true once Milo lines MILO-003/004 were genuinely captioned | E02 checkpoint |
| `observed_old_stones` | true on deliberate public-station inspect with old alignment visible | E02 checkpoint |
| `observed_changed_edge` | true on deliberate lookout inspect with missing deck visible | E02 checkpoint |
| `observed_new_edge` | optional proof of corroborating feature; not a progression gate | E02 checkpoint |
| `overlook_reached` | public path route and legal lookout stand reached | episode-local audit + projected from ledger |
| `notebook_open` | ephemeral overlay; never story scene change by itself | UI only |
| `gap_link_selected` | child has explicitly selected the observed contradicting gap tile | E02 checkpoint |
| `revision_choice` | A / B after gap link, uncertainty remains open | E02 checkpoint; not canonical branch |
| `market_mark_seen` | intentional fixture inspect after accepted revision | E02 checkpoint + canonical ledger |
| `cue_offered` | parent cue offered after eligible conflict | E02 checkpoint |
| `played_once_line_ids` | E02-only first-play dialogue played; Listen replay exempt | E02 checkpoint |
| `hint_level` | staged assistance; not learning evidence | E02 checkpoint/UI |

**Ledger facts** (canonical, emitted once, only in first play):

| Event | Trigger | Projection |
|---|---|---|
| s01e02_riverside_overlook_accessible | First **actual** public same-bank path arrival at lookout, regardless of evidence/revision order | Riverside public lookout discovered/revisitable; old crossing remains blocked |
| s01e02_old_connection_changed_confirmed | Required old stones + gap inspected, gap linked, revision A/B selected | Chronicle “then/now” evidence and Milo correction/uncertainty |
| s01e02_market_lane_marker_recorded | Intentional Market mark inspection after revision, while at safe lookout | Market Lane clue available; no E03 puzzle pre-solved |
| episode_completed:s01e02 | Chronicle actually presented, required events exist, player explicitly finishes | E03 eligible |

Episode-local authoring references `s01e02_old_stones_observed`, `s01e02_changed_edge_observed` and `s01e02_gap_disconfirms_fence_only` mean the corresponding flags/milestone above, **not** free-standing world repairs. Every emitted event is idempotent via stable ID; derive present world state from ledger rather than authoritative mutable booleans. The final storage adapter and event schema must be separately checked for E01 save migration.

## 4. Scene transitions and exact gates

| From / entry | Trigger | Required guard / action | Forbidden shortcut |
|---|---|---|---|
| sc00 → sc01 | Begin | E01 completion and revealed RIVERSIDE marker present (or explicit preview/test fixture); child can continue without parent | Starting E02 with fabricated E01 ledger |
| sc01 → sc02 | Unskippable arrival lines end | Milo's `fence_only` idea captioned first; enable world movement | Deliver gap answer before hypothesis |
| sc02 old_stones | Inspect from fence-side safe stand-off | Actual large clear image of both aligned old footings; set observed_old_stones | Count approach without inspect |
| sc02 lookout arrival | Walk or accessible route along real public path | Require same-bank walkability; emit overlook event immediately **once** | Move gate/fence, teleport across hazard, require all evidence first |
| sc02 changed_edge | Inspect protected view | Show missing deck + water gap / current edge; set observed_changed_edge | Mark inspected from off-screen camera or before arrival |
| sc02 → sc03 | Inspect both old_stones and changed_edge in either order | Present notebook and once-only cue; preserve child-selected viewpoint order | Direct Continue with only one observation |
| sc03 → sc04 | Choose observed gap evidence tile, then revision A/B | Write changed-confirmed once; close notebook without score | Wrong old-stones tile or Not sure alone completing |
| sc04 → sc05 | Explicitly inspect safe lookout-side Market mark | Legible Market Lane direction appears only now; write marker once | On overlook arrival / visible static background |
| sc05 → completed | Chronicle displayed, explicit Finish | All required ledger facts present; emit E02 complete once | Automatic completion on opening Chronicle; parent participation gate |

**Scene overlay policy:** inspect closeups, notebook, parent cue, Help, old-map inset and Listen do not become new narrative scenes. The player remains free to move back to safe stations during sc02 and can safely return to lookout during sc04. After completion, present world and historical replay are distinct modes.

### SC02 independent observation order

- **Old stones → lookout/gap** and **lookout/gap → old stones** both produce the same notebook evidence. Either route can contain ordinary ambient inspections without changing required flags.
- Repeated station inspect gives a short already-seen caption/Listen, not a fresh first-discovery speech queue or another persistent event.
- Opening the old map is available **after first physical observation only and by direct request**; opening/closing it cannot count as observation or reopen automatically on every move.

### SC03 recoverable choice detail

- Player sees two large named/pictured notebook tiles, an unambiguous fence-only hypothesis card and optional captions/Listen.
- Old-stones tile → optional lines NIA-010, FINN-009, UI-009, returning to visible two tiles; meaningful non-punitive feedback. At most one full spoken response per specific attempted tile per entry, but visual guidance remains repeatable.
- Missing-deck tile → exact lines MILO-012/013, NIA-011, FINN-010, UI-010; set gap_link_selected true.
- Revision A or B selects its three exact Milo lines, then shared NIA-012/FINN-011/MILO-020. No correct/wrong language; both recognize old real/present absent bridge and uncertainty.
- “Not sure yet” before gap link stays in notebook, with gentle hint access; after gap link, allow an uncertainty-preserving accepted wording from existing branch lines. No additional voice line invented by the interaction renderer.
- Hint 3 highlights the actual gap tile only **after** observed_changed_edge, not before child-visible evidence. Hints do not emit observed_* events.

## 5. Movement and safety contract for later art geometry

A visual scene draft must declare, from the **approved Riverside master art**, route graph/polygons: public promenade, closed spur safe standoff, public signposted ramp, protected lookout, no-go closure, water, far bank, scenic props, character feet positions, label exclusion zones and click approach projections.

- Clicking anywhere beyond no-go boundary projects Milo to a **safe public approach**, never beyond barrier. Keyboard continuous motion collides against no-go region. Accessible Go to lookout performs pathing over the identical public route graph, **not** a cross-hazard jump.
- No path has an edge connecting closed-spur standoff to lookout except returning via the public promenade. No “jump fence,” swim, climb, temporary bridge, structural fix or movable barricade.
- NPC and companions cannot crowd out Milo/labels; actor feet stay on paving at first-frame spawn and at station stops. All actor names visible and conversation portraits isolated. Prevent repeated near-identical clicks causing a stall, and prevent movement to a rendered non-walkable art surface.
- Camera/zoom and inspects expose old stones/changed gap sufficiently in 320/360/390/430 phone and 1366×900 desktop without the RPG dock hiding evidence. Required information is not encoded only in color, a sound or a tiny pointer target. The old-and-new image states are authored separately with no pre-reveal Market text baked in.

**World-change semantics:** “overlook accessible” is a **knowledge/revisit unlock** on the existing public facility; any optional sparkle/wayfinding animation is ephemeral and never implies a closed bridge opens.

## 6. Playback, cues, checkpoints and failure safety

- Existing E01 RPG dock grammar, actual speaker portrait registry, visible name tags, single `Listen` manual replay, captions, desktop Parent View beside child view and mobile Child/Parent switch carry over. **Do not** reuse E01 Square pixel collision coordinates, scratch mechanic, dialogue IDs or marker images as Riverside.
- Parent cue s01e02-cue-01 fires **once per first-playthrough** only after child inspection of the conflicting gap and both required observations, when approaching the notebook. It never blocks child or auto-focuses the correct tile. Parent follow-up and child-alone hints are separate.
- Checkpoint after initial hypothesis, each genuine station observation, first legal lookout arrival, evidence link/revision, Market mark, Chronicle close and final completion. Persist a single coherent checkpoint snapshot plus deduplicated ledger; do not save out-of-order transient dialogue queues as completed facts.
- UI rendering/Listen/repeated tap/overlay opening can never issue canonical events. If interrupted between observing and selecting an answer, restore inspected flags **without** pretending reasoning happened. If interrupted between safe arrival and E02 completion, overlook remains available on restore.
- Denied/unavailable storage must not show false success; user can continue a session with clear warning, retry/save safely and retain existing unrelated E01 data. Fresh/incognito, corrupted E02 data, unrelated version change and explicit Start new adventure must be covered by later implementation test.
- Historical replay is read-only; no E01 progress rollback, no duplicate overlook event, no accidental event during repeat speech, no removal of Market clue or E03 unlock.
- No new account, chat, location services or child data collection.

## 7. Script-binding manifest

Only the new [E02 script](DETAILED_SCRIPT.md) owns exact line text. Required bindings:

| Beat | Proposed script IDs | Behavior |
|---|---|---|
| E02 opening/initial theory | NARRATOR-001..003, MILO-001..004, NIA-001..002, FINN-001..002, UI-001..002 | Mandatory first visit to SC01; Milo guess precedes free exploration |
| Old stones | UI-003, MILO-005..006, NIA-003..004, FINN-003 | One-time deliberate inspect |
| Closed spur | UI-004, FINN-004, NIA-005 | Safe rejection, repeat visual feedback; no crossing |
| Public lookout arrival | UI-005, NARRATOR-004, MILO-007, FINN-005 | First safe arrival only, event independently persisted |
| Gap/changed edge inspect | UI-006, MILO-008..009, NIA-006..007, FINN-006..007 | One-time deliberate inspect |
| Optional ambient/old map | MILO-010, FINN-008, UI-007, NIA-008 | Optional, never authoritative inspection completion |
| Notebook prompt | NIA-009, MILO-011, UI-008 | Both categories actually observed |
| Old-stones recovery | NIA-010, FINN-009, UI-009 | No success event |
| Gap-link realization | MILO-012..013, NIA-011, FINN-010, UI-010 | Evidence link milestone |
| Revision choices | MILO-014..016 **or** MILO-017..019 | Same canonical outcome |
| Shared correction | NIA-012, FINN-011, MILO-020 | Emits changed-confirmed once |
| Market marker | MILO-021..022, UI-011, NIA-013..014, FINN-012..013 | Explicit inspection after revision |
| Chronicle close | NARRATOR-005..008, NIA-015..017, MILO-023, FINN-014, UI-012 | Finish after record displayed |
| Hints / recap | UI-013..014, NIA-018..019, FINN-015, NARRATOR-009..010 | On-demand/restore; no early clue |

**Script status:** draft_for_review. The table is a binding proposal, **not** a claim voices have been exported, synthesized or locked. Implementation must preserve all voice/caption text and intentional line order once the script becomes approved.

## 8. Acceptance matrix and handoff

Episode-specific acceptance cases are in [E02 Interaction Test Matrix](INTERACTION_TEST_MATRIX.md). Narrative test cases must confirm the first guess remains meaningfully refutable; learning tests must prove that random hotspot tapping alone does not pass; visual tests must inspect the physical road barrier and lookout from true rendered camera views at phone size. Browser test must cover actual playback/save/replay, not source-only assertions.

**E02-2 gate OPEN until:** script line sequence, this spec and matrix are reviewed together; any exact-text revisions are reconciled; owner/authorized review marks them approved for prompt pack. **No visual/audio/runtime production follows merely from creating these draft documents.** E01 remains paused at owner PASS.
