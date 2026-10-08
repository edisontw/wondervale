# S01E01 Interaction Test Matrix

**Status:** actual core/browser execution has begun; see [dated evidence](../../../docs/E01_RUNTIME_QA_2026-10-08.md). UX-11/UX-12 remain human acceptance pending.  
**Source:** [INTERACTION_SPEC.md](INTERACTION_SPEC.md), [DETAILED_SCRIPT.md](DETAILED_SCRIPT.md), and [EPISODE_PRODUCTION_BRIEF.md](EPISODE_PRODUCTION_BRIEF.md).

## Test execution rule

For each case, record platform/device, build ID, content version, observed result, PASS/FAIL, and (when applicable) event-ledger diff. Do **not** claim runtime PASS until an actual application build exists.

Use deterministic starting save fixtures:

- `fresh`: no E01 local progress, no E01 durable events;
- `map_exposed`: `cp_map_exposed`, no later effects;
- `observed`: `cp_observation_done` and map-documented/symbol-seen events;
- `anchors`: `cp_anchors_verified`;
- `marker`: `cp_marker_revealed`, marker event present;
- `complete`: E01 completed, E02 eligible;
- `later_progress`: E01 completed plus simulated later-season durable events, for replay preservation tests.

Fixtures specify semantics, not an unapproved final save schema.

## A. Story/state graph

| ID | Start | Action / variation | Expected |
|---|---|---|---|
| INT-01 | fresh | skip parent preview | enter SC01; no parent requirement |
| INT-02 | fresh | listen/continue opening then control Milo | SC02 reachable; movement and board accessible |
| INT-03 | fresh | visit fountain/tree before board | ambient reactions optional; SC04 confirmations remain unfulfilled |
| INT-04 | fresh | help hold front paper using tap | older paper exposed intact; `cp_map_exposed` saved |
| INT-05 | map_exposed | inspect A→B then guess A | C auto physical evidence; sketch line/symbol; SC04 reachable |
| INT-06 | map_exposed | inspect B→C then guess B | A line surfaced visually at convergence; SC04 reachable |
| INT-07 | map_exposed | inspect A→C then guess C | B symbol surfaced visibly at convergence; SC04 reachable |
| INT-08 | map_exposed | inspect all A/B/C in any order | no C fallback duplicate; once-only reactions |
| INT-09 | map_exposed | inspect same region twice before a second distinct region | speculation still locked; no inflated inspected count |
| INT-10 | map_exposed | choose each of guess A, B, C from equivalent states | one correct line pair each; same canonical progression/events; no scoring |
| INT-11 | observed | confirm tree then fountain | same completion as fountain then tree |
| INT-12 | observed | compare an unrelated object | friendly mismatch; progress and attempts not punished |
| INT-13 | observed | visit both landmarks without Compare | no false `verified_anchors` completion |
| INT-14 | anchors | reach broad exit/post area | plate accessible; RIVERSIDE still hidden until cleaning |
| INT-15 | observed | reach exit area before completing both anchors | no early plate-reveal or RIVERSIDE spoiler |
| INT-16 | anchors | reveal by swipe / tap-hold / keyboard alternative | all paths reach same one-time revealed marker state |
| INT-17 | marker | inspect marker again | visible marker, repeat `MILO-029` optional, no second reveal event |
| INT-18 | marker | view Chronicle, skip reflection, finish | one episode completion, E02 eligible |
| INT-19 | fresh | parent never enters Parent View | episode fully playable; cue never blocks |
| INT-20 | map_exposed | adult switches between Child and Parent View during cue | no phase/inspection loss; cue appears at most once |

## B. Saves, continuity, and replay

| ID | Start | Action | Expected |
|---|---|---|---|
| SAV-01 | fresh | first play, exit before map exposure | no recap on initial start; on return use pre-map recap |
| SAV-02 | map_exposed | exit during an evidence animation, resume | restored coherent SC03, optional `NARRATOR-014..015`; no torn-map state |
| SAV-03 | observed | exit mid SC04, resume | no forced replay of completed SC03; locally safe checkpoint |
| SAV-04 | anchors | exit before marker clean, resume | broad search remains available; marker not pre-revealed |
| SAV-05 | marker | exit before Chronicle completes, resume | `NARRATOR-016..017` optional; marker still visible |
| SAV-06 | marker | rapid/double clean input, pause at reveal frame | marker event once, no half-cleared persisted state |
| SAV-07 | complete | close/relaunch multiple times | E01 completion once, E02 unlocked; current Square marker remains clear |
| SAV-08 | complete | replay E01 to marker reveal again | historical replay view allowed; durable ledger unchanged |
| SAV-09 | later_progress | replay E01, then exit replay | later progression preserved; present Square remains unchanged |
| SAV-10 | fresh | simulate save interruption between state/effect writes | restore to coherent pre- or post-checkpoint; no orphan durable event |
| SAV-11 | map_exposed | open/cancel/reopen map inset repeatedly | same logical scene and progress; no event duplicates |

## C. Language, accessibility, and experience

| ID | Setup | Action | Expected |
|---|---|---|---|
| UX-01 | audio muted | play E01 | all essential dialogue and reveal available visually; no audio gate |
| UX-02 | reduced motion | reveal old paper and plate | legible state swaps; information unchanged |
| UX-03 | keyboard-only | complete noticeboard, evidence, both anchors, cleaning, finish | no mouse/touch-only gate; focus visible |
| UX-04 | touch-only narrow viewport | complete E01 without precise drag | large targets; no hidden controls/clip |
| UX-05 | motor assistance | assisted travel and clean | intentional child action still needed to confirm anchors; no loss |
| UX-06 | help requested at each phase | request all supports in order | on-demand, escalating, non-spoiling until last resort; no new dialogue |
| UX-07 | parent panel desktop | trigger cue after first observation | prompt visible in quiet side panel, safe on shared screen, nonblocking |
| UX-08 | mobile same-device | cue notification → adult view → child return | no action loss; no spoiler takeover |
| UX-09 | any mode | replay/skip narration | captions/text match approved line IDs; triggers fire once, not per replay |
| UX-10 | fresh | inspect map without parent assistance | Nia supports observation; no child-response capture/scoring |
| UX-11 | first play | measure play duration and use family observation | target 14–18 min is evaluated, **not presumed PASS** |
| UX-12 | child/family test | probe difference between seeing and guessing, and map→place use | observe reasoning through action/talk; don't infer learning from button success |

## D. Static/content QA to run before runtime

| ID | Validation | Expected |
|---|---|---|
| DOC-01 | check unique voice-line IDs in script and all referenced ranges | exactly 121 unique, no missing/duplicate lines |
| DOC-02 | check only approved script is source for spoken text | no added/modified voice text in implementation/prompts |
| DOC-03 | check E01 has SC00–SC06, two interaction IDs, one parent cue | identifiers coherent and resolvable |
| DOC-04 | compare EPB semantic event IDs with spec/compiled manifest | same meanings/IDs; derived marker state; no undocumented rename |
| DOC-05 | search for premature Common/Riverside revelation and treasure confirmation | none before allowed beat |
| DOC-06 | check no new mandatory precision/timed challenge or parent gate | none |
| DOC-07 | compare child/parent text channel and caption/audio export | separately authorable, exact line text |
| DOC-08 | inspect accessibility under audio-off, motion-off, small screen | cues remain readable in at least one non-audio/non-color mode |

## Exit criteria

These are **planned acceptance cases** for later implementation. The interaction design is eligible for prompt-pack derivation now; runtime acceptance requires recording actual results for every relevant case. A failing structural/canon case must be resolved against the EPB/script/spec, not silently patched by adding story.
