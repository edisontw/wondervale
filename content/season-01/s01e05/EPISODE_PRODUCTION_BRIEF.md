# S01E05 Episode Production Brief — The Station with No Trains

> **Gate 1 draft, 2026-10-29. NOT approved for script, canon, production media or playable release.** This is an actionable proposal under the already-approved Season 1 architecture and learning weave. A draft interaction specification and test matrix accompany it. E04's proposed new paper sources in PR #114 are **not** assumed approved; nothing in this brief is a claim that a playable E04 checkpoint exists.

## 1. Identity and upstream authority

```yaml
episode_id: s01e05
season_id: s01
arc_id: s01a02
working_title: "The Station with No Trains"
brief_revision: 1
brief_status: draft
content_version: pre-release
estimated_duration_min: 12 # untested estimate
estimated_duration_max: 18 # untested estimate
```

Upstream: [Season 1 architecture](../../../docs/SEASON_1_ARCHITECTURE.md) E05, [learning weave](../../../docs/SEASON_1_LEARNING_WEAVE.md) E05, [core trio](../../../docs/CORE_TRIO.md), [world continuity](../../../docs/WORLD_CONTINUITY.md), [EPB standard](../../../docs/EPISODE_PRODUCTION_BRIEF.md), [12-scene delivery plan](../../../docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md), [E03 canonical handoff](../../../engine/s01e04-handoff.mjs), and **E04's draft only** [PR #114](https://github.com/edisontw/wondervale/pull/114).

**Locked inherited facts:** E03 recorded two sincere, attributed memories (station and garden), not a verdict. E04 is intended to establish a *relative* source chronology, not exact dates or the cause of the garden move. The old station is not operating trains; its public foyer is unused/closed at the season's start. E05 must end with a small **Map Room/work area**, records about changing routes and a garden detour, and a clue that full-loop use ended around North Hill closure. E06 investigates *why* the garden moved; E10, not E05, reveals the missing place. No closed route is reopened.

**Open, not silently canonical:** how authorized public access to the foyer is obtained; exact design/wording/provenance of the route board, record copies and detachable test overlay; how the station's record corroborates a garden detour and North Hill closure without a fabricated year; the child's final Map Room layout and production art. All below are **design proposals** pending one bounded Gate 1 review.

## 2. Episode contract

- **Story purpose:** start Arc 2 by letting Milo investigate what a place and its objects were *used for*, then help give a closed station a small useful present-day role.
- **Opening:** E04's two sincere memories and supported *relative* chronology leave a practical question: what did the old station actually do for the route? The trio approaches the station's **public foyer only when access is explicitly authorized**. The entrance is not a lock-picking or trespass puzzle; until the access rule is authored, this is a non-shippable staging assumption.
- **Problem/stakes:** a dusty route board, marks where labels once fitted and records are incomplete. Nobody needs to make the station run trains again. The trio wants to test an explanation *without damaging old material*.
- **Turning point:** Nia chooses a small reversible test even though she does not yet know the answer. A removable **replica overlay** fits one set of visible mounting marks; it supports a limited inference about how a sign may have changed, **not** a claim that one historical account is completely proven.
- **Resolution:** the child inspects physical features, tries and revises a reversible alignment test, compares the result with accessible station records, and arranges a small public Map Room/worktable. The room opens for future visits; the old transport service remains closed.
- **World/story consequence:** the station records support the already-locked arc that routes changed, a garden detour existed and full-loop use stopped around North Hill closure. Do not invent calendar years, exact sequence beyond evidence, engineering causes, or the destination of the blank symbol.
- **Hook:** an old map locates a garden below the current healthy uphill garden. Milo asks why the garden seems to be in two places; E06 investigates.
- **Non-goals:** restart trains, force a single correct object-function guess, let an adult explain everything, retell E04 as a timeline drag quiz, restore unsafe old paths, solve E06 drainage or garden relocation cause, reveal the Common, fabricate precise dates, award points/streaks, or require sound/motor precision.

## 3. Character contract

| Character | Enters | Episode beat | Leaves with | Must not |
| --- | --- | --- | --- | --- |
| Milo | Curious whether the station memory explains the route | Looks closely, tries the replica, asks what evidence is still missing | A better question about old/new garden sites | Receive the solution in dialogue or treat an untested guess as proof |
| Nia | Careful about source order; hesitant to act without certainty | **Proposes/accepts a reversible test despite uncertainty** | Confidence that a safe test can yield partial evidence | Become omniscient or require perfect certainty first |
| Finn | Notices mounting, labels and physical mechanisms | Helps prepare a **replica** rather than alter an original board | A useful present-day worktable, not a restored train service | Secretly repair/rewrite an archival object or solve for the child |

No new named speaking NPC is required. If an authorized-access facilitator is later needed, approve the role and lines at Gate 1; do not silently invent a caretaker with historical knowledge.

## 4. Scene / beat map

This episode counts as **one major playable scene** in the 12-scene delivery plan. Storybook and Chronicle beats are not extra release scenes.

| ID | Mode/location | Narrative job | Child action and exit |
| --- | --- | --- | --- |
| `s01e05-sc00` | Storybook/Chronicle handoff | Recall **attributed** E03 memories and only E04-approved conclusions | Begin when canonical E04 completion is verified; dev preview is isolated and explicitly noncanonical |
| `s01e05-sc01` | Public station foyer | Explore a real, unused place; note the room's possible former functions | Walk Milo to inspect board, worn slots, public information area; no one lectures |
| `s01e05-sc02` | Board/replica work surface | Turn observation into a **bounded reversible test** | Place a removable paper/transparent replica overlay against marked positions; try another orientation if it does not fit |
| `s01e05-sc03` | Foyer records desk | Check whether the test answers the whole route question | Inspect distinct station records for changed routes, garden detour, hill-closure-related end of full-loop use; separate what the board shows from what records say |
| `s01e05-sc04` | Foyer to Map Room | Reuse the space for present needs | Choose a safe worktable/map placement from bounded accessible options; see the room change and remain open |
| `s01e05-sc05` | Chronicle/exit | Preserve partial inference and uncertainty | Record Map Room opening and the garden-location question; E06 hook |

**Critical scene direction:** The board and records must be visible objects in a navigable illustrated foyer, not six sequential quiz cards. Milo's movement to inspect stations is child-controlled; text/keyboard alternatives reach the same observations.

## 5. Substantial interaction contract

### `s01e05-int01` — What was this board for?

- **Story reason:** a station object is unfamiliar and partly changed.
- **Thinking:** infer plausible function from slots, mounting and surviving labels; distinguish observation from hypothesis.
- **Action:** walk/inspect 2–3 marked details; optionally propose a use (“route board,” “notice board,” “something else/not sure”). This is a working hypothesis, **not a graded answer**.
- **Available evidence:** physical marks and the existing object only. A record does not appear until the child intentionally inspects it.
- **Feedback/recovery:** the object highlights only what was actually observed; hypotheses remain revisable. A wrong guess does not block the test.
- **Scaffold/access:** tap large inspect targets, keyboard action list, Listen/captions; hint asks “What could fit here?” without naming the answer.
- **Evidence of thinking:** at least one physical observation precedes the test; later inference may be revised.

### `s01e05-int02` — Try without changing the original

- **Story reason:** Nia wants a test that will not damage the old board.
- **Thinking:** choose a **reversible** test, predict a visible fit, compare result and revise.
- **Action:** on a clearly labelled **replica** surface, place a detachable overlay in one of two illustrated orientations (tap-to-place or drag; keyboard equivalent). A mismatch leaves visible pegs/marks unaligned; repositioning aligns the same features. The board original is never touched.
- **Information before action:** replica slots and overlay marks are simultaneously visible; no hidden target.
- **Valid strategies:** either orientation can be tried first; no penalty. The player must *observe* fit/mismatch, not guess a secret answer.
- **World feedback:** alignment indicates the panel could be swapped/repositioned; it **does not prove the entire old route, date or purpose of the building**.
- **Failure/recovery:** immediate reversible re-placement; explicit “Not sure yet” and optional feature comparison. No score/timer.
- **Evidence:** player compares at least two physical features and recognizes that the test provides partial evidence.
- **Approval dependency:** exact peg/overlay arrangement and meaning require Gate 1 plausibility and art geometry review. If a credible replica cannot be illustrated, replace this test **before** scripting, not by faking a fit animation.

### `s01e05-int03` — What do the records add?

- **Story reason:** a successful fit alone cannot settle the station's history.
- **Thinking:** distinguish direct observation, written record and unanswered question.
- **Action:** inspect short, legible **proposed** record excerpts (changed route, garden detour, full-loop use ended around North Hill closure); match one record to the route question; mark the garden-move *cause* as still unknown.
- **Feedback/recovery:** a plausible but overstrong conclusion is met with “What does this record actually say?” and reinspection, never a liar/wrong-answer banner.
- **Evidence:** child can identify a supported statement and a remaining uncertainty. Exact source labels and provenance are **not approved** in this brief.

### `s01e05-int04` — Make a small Map Room

- **Story reason:** the foyer can serve people now without restoring its former transport role.
- **Thinking:** adaptive reuse with at least two practical needs (view the map, leave a clear public route).
- **Action:** arrange a reversible table/display footprint in one of two **illustrated physically plausible** positions. One can obstruct passage and is shown as such; reposition before confirming.
- **Feedback/recovery:** path remains visibly clear only in a feasible arrangement. No timed placement or inaccessible drag requirement.
- **Outcome:** persistent modest Map Room, unchanged closed train service. Placement choice is episode-local unless later explicitly approved as remembered.

## 6. Learning

**Primary:** (1) infer object/space function from physical evidence and records; (2) choose/interpret a small reversible test. **Secondary:** read records for a purpose, not as collectibles.

- **Revisit/transfer:** E01/E02 observations → a building object; E04 source chronology → independent station records. This is **not** another earlier/later sorting task.
- **Incomplete models:** every object has one obvious purpose; one successful fit proves the full history; adults must provide the correct answer.
- **Thinking evidence:** child notices mounting marks, tests without altering the original, revises or qualifies an inference, distinguishes board observation from records.
- **World feedback:** actual overlay fit/mismatch and the resulting usable Map Room; no arbitrary quiz grade.

## 7. EFL / language access

- **Functions:** predict, propose a test, compare observations, qualify an inference.
- **Comprehension-critical:** “try,” “check,” “fits / does not fit,” “same / different,” “old / now,” “not sure.”
- **Reusable phrase candidates (not final lines):** “I think this was for …”; “If we put it here …”; “It fits!”; “This mark shows …”; “We need more clues.”; “We can use this room now.”
- **New-word candidates:** station, board, mark, label, fit, record, detour (the last may need visual explanation).
- **Visual support:** aligned holes, clear passage, changed map/table state. Do not demand the child pronounce “detour” to progress.
- **Listen/captions:** every critical line replayable; no prerecorded audio required now. Text remains the authoritative fallback.
- **Cognitive depth:** simple sentences still allow hypothesis, test design, partial evidence and uncertainty.

## 8. Parent guidance and scaffolds

| ID | Trigger | Type | Importance | Draft cue | Avoid |
| --- | --- | --- | --- | --- | --- |
| `s01e05-parent01` | After first board inspection | predict | optional | “What do the marks make you think?” | Naming the object's function |
| `s01e05-parent02` | Before reversible test | challenge | recommended | “What can we try without changing the old board?” | Choosing the orientation |
| `s01e05-parent03` | After record inspection | explain | optional | “What do we know, and what is still a guess?” | Revealing why the garden moved |

Child-alone fallback: Milo can request language, control and evidence hints separately. Hint ladder: freely inspect → restate task → show tap/keyboard control → highlight **a feature** → compare two features → model one observation → allow completion without requiring verbal explanation. Parent never has to operate the interface.

## 9. Continuity, replay and Chronicle

**Canonical entry (future implementation):** a validated E04 completion and E04 Chronicle evidence must be replay-verified from its eventual canonical ledger, *not* guessed from a string or a draft preview. E04's production ledger is not yet implemented. Until then E05 may have only a clearly isolated **authoring preview** with no canonical E05 writes or unlock.

**Proposed IDs for review, not implemented or approved:**

```yaml
requires:
  episodes_completed: [s01e04]
  canonical_events: [s01e04_relative_timeline_recorded] # proposal in E04 draft; verify actual ID after E04 approval
effects:
  canonical_events:
    - s01e05_board_test_observed
    - s01e05_station_records_noted
    - s01e05_map_room_opened
    - episode_completed:s01e05
  character_milestones:
    - nia_reversible_test_with_uncertainty
  discoveries:
    - s01e05_garden_site_question
  unlocks: [s01e06]
```

- **Choice scope:** overlay placement ephemeral; object hypothesis episode-local; final feasible table arrangement episode-local; Map Room opening canonical once.
- **Replay:** read-only historical visit; cannot close Map Room, duplicate opening, erase E01–E04, or award an extra completion.
- **Chronicle:** “The station foyer became a Map Room.” Before/after foyer view; board test supports a limited inference; station records about route/garden detour/hill closure are *attributed records*, not omniscient explanation; garden move cause remains open. Future E06/E11 revisits the room and records.
- **Gate:** never award `episode_completed:s01e05` from preview or from a client-provided unvalidated `e04Done` flag.

## 10. Visual, animation and production requirements

| Asset / behavior | Source | Need | Gate |
| --- | --- | --- | --- |
| Milo/Nia/Finn identities and common shell | Reuse C01 and existing approved assets | Character consistency, captions, accessible controls | Preserve accepted appearance |
| Foyer before/after Map Room | **New painterly** environment, two bounded states or composited small table | Walkable visual area, credible door/access, safe circulation | Not generated/approved |
| Board + inspect details | New illustrated prop layer | Legible slots, labels, wear and accessible inspection positions | Physical plausibility approval |
| Replica overlay and fit/mismatch | New illustrated prop/interaction states | Two orientations with visible alignment proof, non-destructive | Gate 1 concept, then geometry/browser QA |
| Station record copies | New story-content cards, later illustrated | Legible provenance and limited claims | Gate 1 narrative approval |
| Map table and signage | New reusable world-growth prop | Clearly different before/after, leaves walkway open | Art/QA pending |
| Chronicle page | Existing Chronicle UI + new text/visual | Before/after and uncertainty; no score | Script/QA pending |

Do **not** polish/reuse rejected SVG art as final production art; high-quality painterly media will be selected in a separate Work/media batch. New media must pass manifest/original-byte/WebP integrity gates. Animations: simple Milo walk, inspect focus, overlay placement and small room transformation, all reduced-motion-safe.

## 11. Audio/voice, accessibility and privacy

Audio production is **deferred by Owner**. Future needs: reusable station ambience (optional), subtle paper/placement cues (optional), trio captions and Listen text replay; no audio-only evidence. Exact line IDs and voice exports follow script lock; no new prerecorded voice/music/SFX in this Gate 1 draft.

Accessibility: no color-only or sound-only clue; large touch targets, keyboard and tap-to-place alternatives to drag; short-landscape 568×320 and portrait fallback; no time pressure, mandatory fine motor or penalty; clear reduced-motion equivalent and repeatable dialogue; no new child accounts, data collection or external links. A child may finish without an adult.

## 12. Artifact ownership and QA

| Artifact | Status / owner |
| --- | --- |
| EPB revision 1 | **Draft** — Narrative/Learning |
| [Interaction specification](INTERACTION_SPEC.md) | **Draft** — interaction/engineering handoff, not implementation |
| [Interaction test matrix](INTERACTION_TEST_MATRIX.md) | **Proposed** — QA criteria, not executed tests |
| Detailed script and line IDs | NOT STARTED — after Gate 1 |
| New records and provenance | **BLOCKED-DESIGN** — one substantive Owner batch |
| Final scene art / media manifest | NOT STARTED — separate visual workstream |
| Canonical engine, save, release and deployment | NOT STARTED — cannot precede E04 canonical gate |
| Real-device/family acceptance | NOT RUN |

**Pass criteria:** meaningful physical inference, reversible test with visible partial evidence, no invented history, Map Room opens visibly, garden question carries forward; source provenance and E04 gate approved; no prior save mutation; Chromium mobile/desktop and replay tests pass; MN4 packaging/HTTPS/rollback verified separately. All are **future** checks, not PASS now.

## 13. One-batch Gate 1 decisions and next task

1. Is a removable **replica overlay against existing board marks** a believable, safe, child-driven reversible test? If not, substitute another physically evidenced station-object test *before* writing final script.
2. What is the smallest inspectable set of station records with visible provenance that supports **changed route, garden detour, and full-loop use ending around North Hill closure**, without an invented date or early E06 garden-cause reveal? E04's source pack must be settled independently.
3. What legitimate public-access cue opens the formerly closed foyer, and what illustrated placement leaves a believable walkway when it becomes a Map Room?

**Until approved:** retain `brief_status: draft`; no new records, scene props, gate events or production images become canon. The next focused independent work is a bounded **noncanonical** interaction-state prototype/test of overlay alignment and Map Room placement, while E04 remains blocked for source approval. Do not treat this EPB as a playable episode.
