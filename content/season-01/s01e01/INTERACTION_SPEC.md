# S01E01 Interaction Specification — The Map Behind the Board

```yaml
episode_id: s01e01
interaction_spec_revision: 1
status: approved_for_prompt_pack
source_epb: content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md
source_epb_revision: 1
source_script: content/season-01/s01e01/DETAILED_SCRIPT.md
source_script_revision: 1
script_dialogue_lock: v1
episode_type: core
```

## Authority, scope, and gate

This is the **approved interaction behavior contract** for the S01E01 vertical slice. It defines state transitions, child input, branching, hints, parent cue delivery, checkpoints, persistent effects, replay, accessibility, and expected QA. It is human-readable source for a later content manifest/runtime implementation, **not executable application code**.

Authority order: project canon + approved Season architecture/learning weave → [E01 Production Brief](EPISODE_PRODUCTION_BRIEF.md) → [E01 Detailed Script](DETAILED_SCRIPT.md) (exact text/line IDs) → this specification (behavior). A behavior/text conflict must be resolved upstream; implementation must not silently write story.

This locks **two substantive interactions**:

1. `s01e01-int01-observe-before-guess`: observe before interpreting.
2. `s01e01-int02-map-to-place-and-marker`: map/place orientation and revealing the marker (two phases, not two more learning activities).

It does not lock framework, rendering tech, character models, map pixel geometry, visual style, final media, production code, or E02 content. **No new dialogue or canon may be invented by this spec.**

## 1. Player experience invariants

1. Milo is the only directly controlled character. Nia/Finn are companions and may give approved dialogue, not automatically solve the reasoning.
2. Exploration starts before mystery exposition; Town Square appears lived-in, not uniformly damaged.
3. Observation precedes the choice of guesses. A guess is never marked right/wrong; all three converge.
4. The child checks **both** fountain and tree in the **living world**, not solely by clicking map labels.
5. The old-map symbol remains unnamed; no treasure/villain/route-history resolution.
6. `RIVERSIDE` becomes known from the **plate reveal**, not an earlier UI/audio spoiler.
7. The steward authorizes access and gentle cleaning, never explains the mystery.
8. The parent cue is useful but never a progress gate.
9. All progress can be made using an accessible non-precision action path; no timers or punitive failure.
10. Completion and world-state changes are idempotent; historical replay cannot undo the present.
11. Exactly the 121 approved spoken-line IDs in script v1 form the voice/caption source. This document only references IDs.
12. A player may ask for help or repeat text without “getting the answer” or losing control.

## 2. Episode-wide state model

The runtime format is open; the **semantic state machine** is locked below.

### 2.1 Modes and phases

```yaml
play_mode: first_play | historical_replay
phase:
  - preview          # sc00, optional and nonblocking
  - opening          # sc01
  - square_explore    # sc02
  - map_observe       # sc03
  - square_compare    # sc04
  - marker_search     # sc05
  - chronicle_close   # sc06
  - completed
```

Exactly one phase is active. A close view, map inset, parent view, narration replay, help panel, or pause **overlays** the phase; it does not become a new narrative phase.

### 2.2 Episode-local working state

```yaml
current_scene_id: s01e01-sc00   # through sc06
front_paper_held: false
map_exposed: false
inspected_evidence: []          # subset of [line, blank_shape, layer_holes]
evidence_first_parent_cue_offered: false
physical_layer_presented: false
guess_choice: null              # A | B | C; ephemeral/episode-local
guess_branch_resolved: false
fragment_documented: false
map_inset_available: false
verified_anchors: []            # subset of [fountain, large_tree]
marker_area_available: false
plate_found: false
marker_revealed: false
chronicle_presented: false
episode_completed: false
played_once_line_ids: []        # per-playthrough once-only script reactions
hint_levels: {}                 # scoped per interaction/phase
```

- An evidence region is **inspected** only when the child chooses it. Scripted automatic presentation does **not** fake a child's click.
- `physical_layer_presented` is true after the C inspection **or** Finn's required auto-observation during the speculation transition.
- `fragment_documented` means Nia's sketch contains the required line and unnamed shape plus the old-layer context; it does not assert the destination.
- `verified_anchors` is reset when entering SC04 even if the fountain/tree were explored casually in SC02. Earlier exploration should still feel meaningful but must not auto-complete the cognitive comparison.
- `played_once_line_ids` controls presentation within this playthrough. It is **not** a global “never speak again” ledger; explicit line replay is always allowed.
- Exact field names may change in the compiled runtime schema. IDs and semantic conditions here do not.

### 2.3 Derived facts versus stored facts

The **progress/event ledger** is durable. The present-day Square state is derived from the marker-revealed canonical event; do **not** persist a separate authoritative mutable `markerVisible = true` blob. Episode-local/checkpoint state is used only to resume the current playthrough. The same principle applies to unlocks and Chronicle availability.

## 3. Scene transitions and guards

| From → To | Trigger | Guard / action | Must not happen |
|---|---|---|---|
| sc00 → sc01 | Begin / skip preview | always permitted; parent presence irrelevant | require parent approval |
| sc01 → sc02 | opening narration concludes or child continues | give control of Milo | stall on unexplained cutscene |
| sc02 → sc03 | child assists loose front sheet | `front_paper_held`, then `map_exposed`; secure old layer; write safe map-exposure checkpoint | tear/destroy old paper |
| sc03 → sc04 | child selects A/B/C guess and reactions converge | `inspected_evidence.size >= 2`, `physical_layer_presented`, `fragment_documented`, `guess_branch_resolved` | require inspection of all 3 hotspots |
| sc04 → sc05 | both distinct anchors checked against fragment | `verified_anchors = {fountain, large_tree}`; set `marker_area_available` | pre-reveal `RIVERSIDE` |
| sc05 → sc06 | authorized plate cleaning/reveal and closing dialogue | `plate_found` and `marker_revealed` | trigger the marker event twice |
| sc06 → completed | Chronicle shown and child continues/finishes | mark episode completed once, enable E02 in current progression | require optional parent reflection |

Back/inspect navigation within an active phase is allowed. Reopening an earlier close-up or inset does not reverse scene progress or replay first-discovery dialogue. An incidental return to the Square is not a second episode attempt.

### Scene-level entry/exit contracts

**SC00:** no required child interaction; one optional parent preview. `Back to Child View` returns immediately.

**SC01:** show exactly the approved opening lines `NARRATOR-001..004`, `MILO-001..002`, `NIA-001`, `FINN-001`, `STEWARD-001..003` in script order. Player enters SC02 when opening completes or is deliberately skipped using a visible continue action; skip must not suppress necessary control instruction.

**SC02:** child may examine fountain/tree or walk to board in any order. Ambient lines are one-time optional lines. At board, `STEWARD-004`, `UI-001` and repair/reveal lines `MILO-005..007`, `STEWARD-005..007`, `FINN-003`, `NIA-003..004` follow script order. Map-exposure checkpoint is saved after old layer becomes visible.

**SC03:** order-independent evidence A/B/C with only one initial reaction per region; parent cue eligible after first region; speculation unlocked after any two distinct regions. If C was not inspected, insert the script's auto physical-evidence exchange `FINN-009` → `NIA-013` at the specified transition. If B was not inspected, the unlabelled shape must become clearly visible in the sketch/transition while `NIA-015` is delivered. If A was not inspected, the long line must become plainly visible in the sketch/transition while `NIA-014` is delivered. Thus the player isn't forced to click a third hotspot but the story never claims evidence that was invisible to the child. The original region remains revisitable. Never log automatic reveal as a deliberate child inspection.

**SC04:** lightweight fragment inset available, viewable any time. Fountain and tree can be verified in either order by bringing Milo to the real place and using a large `Compare` affordance with the relevant map symbol visible. After both confirmations, play `NIA-022`, `FINN-015`, `MILO-021`, `NIA-023`, `MILO-022` in order and enable the broad direction toward the exit.

**SC05:** travel physically to the broad exit area; plate is present and visible but dirty. Story authorization and soft cloth precede `UI-008` cleaning. Reveal an arrow plus `RIVERSIDE` together; only then play `MILO-026` and later reactions. Map's blank symbol is not identified. Plate may later be inspected with `MILO-029`, not another reveal event.

**SC06:** Nia's sketch and before/after marker appear in the Chronicle; play approved closing lines and visible approved Chronicle copy. The page is a memory record, not a badge. Optional parent reflection is skippable. After the child's Continue/Finish, write completed episode event and enable E02 once.

## 4. Interaction 1 — Observe before guessing

ID: `s01e01-int01-observe-before-guess`. Cognitive goal: **observation is not interpretation**. UI activity: inspect and discuss, not an answer quiz.

### Evidence regions

| Region key | Large visual target | First-visit lines | Recorded observation |
|---|---|---|---|
| `line` | faded route line | `MILO-010`, `NIA-007..008` | a long line crosses the old paper |
| `blank_shape` | outlined unnamed shape | `FINN-004`, `NIA-009`, `MILO-011` | an unnamed shape exists |
| `layer_holes` | aged layer and old mounting holes | `FINN-005..006`, `NIA-010` | an older layer is under the current paper |

All line IDs in this table have prefix `S01E01-`. The child can choose any evidence order, inspect already-known regions again, or close/reopen the view. Re-visits show the recorded sketch and optional approved repeat line `NIA-016`, not first-visit lines.

### Control and choice contract

1. Entry lines `MILO-008..009`, `NIA-006`, `UI-002` introduce inspection.
2. After first distinct region: parent cue `s01e01-cue-01` becomes eligible exactly once; it never blocks input.
3. After **two distinct** regions: `MILO-012`, `NIA-011` and three ungraded spoken Milo choices become available. The third region remains optional.
4. Choices:
   - `A`: `MILO-013` → `FINN-007`
   - `B`: `MILO-014` → `NIA-012`
   - `C`: `MILO-015` → `FINN-008`
5. Conditional `FINN-009` → `NIA-013` if C was uninspected; the uninspected A or B is surfaced visually as noted above.
6. Rejoin with `NIA-014..015` → `FINN-010` → `MILO-016`.
7. Store only ephemeral/episode-local `guess_choice`; it must never create a branch-specific global event, badge, or alternate E02.
8. At the SC03→SC04 boundary, mark the map as documented and the blank symbol as **seen** even if initially surfaced at reconvergence, then persist the safe checkpoint.

Do not infer reasoning mastery from selecting the “uncertain” choice. If the parent discusses observed evidence, the conversation is voluntary and not transcribed/scored.

## 5. Interaction 2 — Map to place and marker

ID: `s01e01-int02-map-to-place-and-marker`. Cognitive goal: use a representation to act in a real, persistent place.

### Phase A: SC04 — anchor confirmation

- The inset shows a round fountain symbol and a distinct tree symbol. Do not depend on red/green coding.
- Milo approaches a real **fountain** or **large tree** and activates a contextual large-target `Compare` action.
- Each landmark confirms **only itself** when the relevant map representation is available: `MILO-018` → `NIA-019` for fountain; `FINN-013` → `NIA-020` for tree.
- Either order is valid. After the first, `MILO-019` → `NIA-021` appears once. After the second, use the two-anchor completion lines.
- Looking at fountain/tree in SC02 is exploration and does **not** automatically set SC04 verification flags.
- Incorrect object or mismatched symbol: `FINN-014` → `MILO-020`, at most once per attempted mismatch with an explicit replay on request. Remain in phase. No red-cross “wrong” screen, timer, loss, forced restart, or wrong-answer count.
- Direct assisted travel to a landmark is optional; child explicitly selects it. Arrival itself does **not** auto-confirm; child still observes/compares before confirming.
- No drag/rotate/precision aligning activity. Both places must remain explorable afterwards.

### Phase B: SC05 — broad search and gentle reveal

- The old route line indicates the broad Square exit area; do not auto-teleport Milo and do not label it “Riverside” yet.
- Exit-area post and weathered plate are in the world with a generous inspection affordance.
- Before both anchors verified, the child may physically see the exit but cannot complete the plate reveal or receive destination knowledge. Do not invent pre-reveal voiced lines.
- Once `plate_found`, deliver `FINN-016`, `MILO-023..025`, `NIA-025`, `STEWARD-008..009`, `FINN-017..018` according to the detailed script's SC05 order; the steward moves into natural speaking proximity when needed.
- `UI-008` presents `Clean`. Offer:
  1. one broad wipe/swipe area for pointer/touch;
  2. tap/activate or press/hold equivalent requiring **no repeated precision movement**;
  3. keyboard focus + Enter/Space;
  4. assisted single-action reveal if motor support is enabled.
- All accepted actions invoke the **same logical reveal**. No 100%-scrubbing bar, swipe-speed test, or timed polish contest.
- World feedback: state swap/short animation → `NARRATOR-005..006` → arrow + `RIVERSIDE` becomes legible → `MILO-026` and the rest of approved SC05 dialogue.
- Do not permit the plate to be “uncleaned” by closing and reopening a modal or by returning later.
- `NIA-028` (“Maybe the town changed.”) remains a **hypothesis**, not a settled history event.
- SC05 exit generates the route-direction discovery and marker canonical event. Riverside's old bridge/obstruction is reserved for E02.

## 6. Input, presentation, and accessibility contract

### Input equivalence

| Task | Touch | Mouse | Keyboard / alternate |
|---|---|---|---|
| Explore Town Square | touch movement controls or accessible move target | point/click or configured movement | arrows/WASD or focusable destination actions |
| Inspect noticeboard/evidence | large tap target | large click target | Tab/focus + Enter/Space |
| Choose guess A/B/C | three readable tap buttons | click | focus + Enter/Space; accessible order |
| View fragment/map inset | tap toggle | click toggle | focus + Enter/Space; Escape to close |
| Compare landmark | visible contextual action | click | focus + Enter/Space |
| Reveal plate | broad swipe or tap/hold | drag broad area or click/hold | focus + Enter/Space; assisted activate |
| Help/replay/pause | visible controls | click | focus + Enter/Space; Escape/back where appropriate |
| Adult view switch | quiet adult entry control | adult panel | focusable adult entry and Back to Child |

Specific locomotion scheme, control placement, target pixel sizes, and game engine are implementation choices, but **every progression-critical action must have a practical accessible alternative**. Essential targets must remain reachable at narrow mobile viewport sizes; evidence may use enlarged inspection panels instead of tiny on-scene click regions.

### Content channels

- **Child View:** story/play, current goal, essential caption text, fragment inset, modest help/replay controls. No long parent instructions.
- **Desktop shared screen:** child view dominant (~70–75%); quieter parent panel (~25–30%); collapsible; panel never covers required controls or reveals answers.
- **Mobile:** separate Child View ↔ Parent View; fast return with no phase reset; no second-device dependency.
- Parent copy uses a separate localization key/channel from child dialogue. Important labels do not exist solely inside an image.
- Keep important voiced text visible and replayable; no audio-only evidence. Disable/mute audio without blocking choice or reveal.
- Reduced motion substitutes simple state swaps for peeling/cleaning/Chronicle transitions; the revealed arrow and word remain readable.
- No countdown, forced rapid reaction, narrow swipe trace, flashing clue dependency, or color-only markers.
- Only adult/context settings may expose external links/admin actions; E01 collects no child identity, voice, or open-chat content.

### Dialogue delivery

Use **line ID → exact approved script text**. Caption and temporary/final voice must use the same ID/text pair. UI instructions `UI-001..010` are visible and optionally voiced on activation; other progression-critical lines are voiced in production with matching captions. Narration replay never re-fires a plot trigger. A disabled-audio session still shows the same narrative facts.

Dialogue triggered by a meaningful event is queued **in specified script order**. Do not start a second one-shot line sequence concurrently and overwrite the first; order-independent region visits can queue their own response at a safe moment. Replay only repeats dialogue presentation, not state changes.

## 7. Parent cue delivery

`s01e01-cue-01`:

```yaml
scene: s01e01-sc03
trigger: first_distinct_evidence_region_inspected
type: observe
importance: recommended
blocking: false
repeat_automatically: false
```

Approved parent-facing text, follow-up, and fallback are in the script; do not paraphrase or add answer spoilers.

- Desktop: quietly update the side panel once after the first inspection; keep child action active.
- Mobile: show a subtle parent-available indicator in Child View; tapping adult entry opens Parent View with the cue, then Back restores the exact child scene.
- If the adult is absent, no replacement gate; Nia's existing observation line carries the beat.
- The cue never appears before any evidence is inspected, is not voiced at the child, and does not reveal the plate's destination.
- Optional after-play reflection is available in SC06 and is not a completion prerequisite.
- Parent cue “seen” state is **presentation state**, not a claim that an adult read or discussed it.

## 8. Help and recovery model

Help is **on demand** and scoped to the current activity. Never auto-escalate because a child takes a long time. Hint requests cannot subtract points, change the canonical outcome, or falsely log demonstrated reasoning.

| Context | First support | Further support | Last resort |
|---|---|---|---|
| SC02 repair | show clear `Help` target; replay `STEWARD-004` / `UI-001` | demonstrate press/hold or tap | one-action assisted hold |
| SC03 observation | replay `UI-002` / `UI-003`; enlarge map | `UI-004`, `NIA-017`; emphasize broad feature without explanation | offer a clearly focusable, single-action assisted Inspect on an additional feature; the child deliberately activates it so two distinct inspections are recorded before choosing a guess |
| SC04 anchor comparison | `UI-006` / `UI-007`; enlarge symbols | `NIA-024` (fountain suggestion, never forced first); point toward broad landmark sector | assisted travel **with explicit consent**; still child confirms symbol/place |
| SC05 marker search | `UI-009` / `NIA-029` | highlight broad exit/post region | assisted inspection |
| SC05 cleaning | `UI-010`; demonstrate control | tap/keyboard activation | one-action assisted reveal |

Do not substitute new improvised voice text for these line IDs. Non-verbal highlights and input demonstrations may be generated in engineering, but may not identify the Common or solve the whole mystery.

### Error handling

- Wrong comparison is a **recoverable mismatch** only; never records a “wrong answer.”
- Accidental exit from close view returns to the same phase and restored inspection/anchor progress.
- Duplicate activate/tap while animation plays is ignored or safely merged; no double dialogue trigger or duplicate events.
- If narration is skipped, captions and scene state still advance coherently; skipping a cutscene must not skip a required marker state/event.
- Lost focus/background/pause during an animation resumes at a safe logical state, not halfway through a fragile swipe or paper-peel frame.
- A network outage must not break the static-first local episode; only bundled/local content is required for this design.

## 9. Checkpoints, durable ledger, and replay

### 9.1 Safe checkpoints

The first-play prototype requires:

- `cp_sc01_done` (opening ended → SC02);
- `cp_map_exposed` (old layer exposed → SC03);
- `cp_observation_done` (sketch/guess completed → SC04);
- `cp_anchors_verified` (both landmarks verified → SC05);
- `cp_marker_revealed` (plate fully visible → SC06);
- `cp_episode_completed`.

Checkpoint names are **episode-local runtime labels**; they are not canonical events. Scene-boundary commits are durable before transitioning UI. Save operation must produce a coherent checkpoint and any associated canonical event changes together, or recover them together after interruption.

**Mid-interaction rule:** restore the latest committed logical checkpoint. Uncommitted partial wipe or partial animation may restart from its clean start. No repeated forced observation of already committed scenes. The prototype does not promise resuming the exact last pointer position.

### 9.2 Canonical effect timing

The EPB defines semantic IDs; this spec assigns safe transition timing without changing those IDs.

| When | Canonical/durable ID | Effect and replay rule |
|---|---|---|
| SC03→SC04 after sketch/reconvergence | `s01e01_old_map_fragment_documented`; `s01e01_blank_place_symbol_seen`; `s01_missing_place_mystery_open` | fragment and unresolved symbol enter story record; do not infer full destination |
| SC04→SC05 after both anchors | `s01e01_old_route_matches_town_square` | evidence that old map represents Town Square |
| SC05→SC06 after full plate reveal | `s01e01_town_square_old_marker_revealed`; `s01e01_old_route_points_toward_riverside` | derived present-day `town_square_old_route_marker_visible` becomes true |
| SC06→completed | `episode_completed:s01e01` | E02 unlocked by completion rule; show Chronicle memory |

**Effect shape contract:** `canonical_events`, `discoveries`, `open_mysteries`, `location_state`, and `unlocks` are semantic categories in the EPB. The eventual manifest compiler must map them to one coherent event/projection schema. No separate mutable location-state write is required: `town_square_old_route_marker_visible` is derived from the marker event. `s01e02` unlock is derived from `episode_completed:s01e01` (or an equivalent explicit, idempotent unlock projection). Do not create undocumented alternate ID spellings.

**Exactly once:** ledger identity uses the stable episode/semantic event key; repeated completion/restore/replay requests cannot append duplicates. If a crash occurs between visual reveal and save, recover via committed marker state or re-enact a clean reveal once before committing; never show a permanently revealed marker while a persisted event says it was never found.

### 9.3 Pause/resume recap

A fresh first start has **no recap**. On returning after interruption, show exactly one optional/skippable recap card chosen by the latest safe state:

| Resume state | Spoken pair |
|---|---|
| Before `cp_map_exposed` | `NARRATOR-012..013` |
| From `cp_map_exposed` through before `cp_marker_revealed` | `NARRATOR-014..015` |
| From `cp_marker_revealed` to before completed | `NARRATOR-016..017` |

The approved line text and one-card, ~10–20-second target are in the script/EPB. Recaps use text+optional voice and can be skipped without losing position. On completed episode, show the Chronicle or episode-select, not a “what comes next in unfinished E01” recap.

### 9.4 Historical replay isolation

- The current world is derived from the durable event ledger; replay does not clear or rewrite it.
- A replay runs with a temporary **historical presentation state** for E01's discovery. The old marker can appear dirty inside that memory scene while remaining revealed in the present Town Square after replay.
- During historical replay, canonical event emission and unlock side effects are **read-only/no-op**. Episode-local inspection/guess state may be reset for an enjoyable replay; no persistent branch is created.
- Quitting replay restores the same present-world state and later-season milestones that existed before starting it.
- Opening Chronicle or replaying narration never emits discovery/completion events.

## 10. Script-to-interaction line mapping and anti-spoiler gates

| Activity / phase | Dialogue group / exact line IDs | Gate |
|---|---|---|
| Opening | `NARRATOR-001..004`, `MILO-001..002`, `FINN-001`, `NIA-001`, `STEWARD-001..003` | entering SC01 |
| Optional fountain/tree look | `MILO-003..004`, `FINN-002`, `NIA-002` | relevant early inspect, once |
| Board repair + map exposure | `STEWARD-004..007`, `UI-001`, `MILO-005..007`, `FINN-003`, `NIA-003..004` | deliberate help action |
| Revisit exposed board | `NIA-005` | on-demand repeat |
| SC03 entry | `MILO-008..009`, `NIA-006`, `UI-002` | map exposed |
| Region A | `MILO-010`, `NIA-007..008` | first inspect A |
| Region B | `FINN-004`, `NIA-009`, `MILO-011` | first inspect B |
| Region C | `FINN-005..006`, `NIA-010` | first inspect C |
| SC03 guess | `MILO-012..015` and `NIA-011..012`, `FINN-007..008` | choose exactly one A/B/C response |
| Missing C fallback | `FINN-009`, `NIA-013` | after guess if C not inspected |
| SC03 convergence/repeat/help | `NIA-014..017`, `FINN-010`, `MILO-016`, `UI-003..004` | convergence/revisit/on-demand |
| SC04 entry/landmarks/mismatch | `FINN-011..015`, `NIA-018..024`, `MILO-017..022`, `UI-005..007` | event-specific; do not autoplay all |
| SC05 search/reveal/repeat/help | `FINN-016..021`, `NIA-025..029`, `MILO-023..029`, `STEWARD-008..009`, `NARRATOR-005..006`, `UI-008..010` | marker discovery; `MILO-026` only after RIVERSIDE legible |
| SC06 Chronicle | `NARRATOR-007..011`, `NIA-030..031`, `MILO-030..031`, `FINN-022..023` | marker revealed, Chronicle visible |
| Resume-only cards | `NARRATOR-012..017` | one state-based pair; never first start |

Line IDs above are shorthand for `S01E01-<SPEAKER>-###`. **Shorthand ranges describe membership, not playback order.** Exact order, conditions, and choice pairings are governed by the script, whose 121 unique voiced line IDs have been audited. There must not be an implementation line that says “The blank place is the Common” or displays RIVERSIDE before SC05's plate reveal.

## 11. Acceptance and production handoff

A behavior implementation passes the interaction contract only when:

- [ ] both required interactions exist and are integrated into Milo-controlled exploration;
- [ ] first observation and both landmark orders work;
- [ ] all three speculation branches converge without canonical difference;
- [ ] C auto-evidence is presented only when uninspected, and A/B are visibly surfaced by reconvergence when needed;
- [ ] parent preview/cue/reflection can be skipped and parent never blocks progress;
- [ ] child gets both fountain/tree comparison in world space, not only a worksheet overlay;
- [ ] no RIVERSIDE destination reveal occurs before the plate is cleaned;
- [ ] cleaning works via non-swipe and keyboard alternatives;
- [ ] text/replay/reduced-motion requirements are preserved;
- [ ] checkpoint resume restores logical progress and does not corrupt events;
- [ ] revealed marker remains in the **present** after completion/replay;
- [ ] event/choice IDs match the EPB's semantic continuity contract;
- [ ] no extra story lines or visual information redefine E01, Riverside, or the Common;
- [ ] [Interaction Test Matrix](INTERACTION_TEST_MATRIX.md) has passing results after runtime implementation.

**Contract status:** approved for deriving E01 prompt packs and downstream production planning. **Not a runtime test pass** and not a declaration of EPB `production_ready`.

**Next focused task:** S01E01 prompt pack derived from the approved EPB + script + this specification. Before generating final character/location imagery, a focused visual-style mini-pass must define shared art direction. Voice export must preserve the exact approved line IDs/text. No image/audio generation or website implementation is authorized by this specification alone.
