# S01E06 Episode Production Brief — The Garden That Moved

> **Gate 1 draft — 2026-10-29. NOT approved for script, production media or canonical runtime.** This document implements the approved Season 1 *story architecture*, not a new historical source. Two **distinct** playable spaces within one E06 episode count as scenes 06 and 07 of the [12-scene delivery plan](../../../docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md).

## 1. Identity / authority

```yaml
episode_id: s01e06
season_id: s01
arc_id: s01a02
working_title: The Garden That Moved
brief_revision: 1
brief_status: draft
content_version: pre-release
estimated_duration_min: 14 # design estimate, untested
estimated_duration_max: 20 # design estimate, untested
release_scene_ids: [s01e06-current-garden, s01e06-lower-garden]
```

Upstream: [Season 1 architecture](../../../docs/SEASON_1_ARCHITECTURE.md) E06, [learning weave](../../../docs/SEASON_1_LEARNING_WEAVE.md) E06, [core trio](../../../docs/CORE_TRIO.md), [world continuity](../../../docs/WORLD_CONTINUITY.md), [episode brief standard](../../../docs/EPISODE_PRODUCTION_BRIEF.md), [E05 draft](../s01e05/EPISODE_PRODUCTION_BRIEF.md). The E04 chronology/source package in [draft PR #114](https://github.com/edisontw/wondervale/pull/114) and E05 proposed station records are **not approved historical evidence**.

**Inherited locked facts:** the earliest map shows a garden at a *lower* location; the *present* healthy garden is uphill; the garden's continuity matters; moving it solved real problems; a modest lower-garden pocket can be started and visibly mature later; drainage/terrain matter and recur in E07/E09; Finn notices a possible new connector. E10, not E06, reveals the Common. North Hill's unsafe route stays closed.

**Gate 1 open:** exact site map geometry and safe public access; what observable soil/water/terrain evidence makes the relocation explanation defensible; any attributed record or testimony establishing the actual historical causes; whether a real lower-site planting is permitted and who cares for it; species, growth interval, planting medium, exact before/after art. **Do not assert that one rain test proves the historical move.** Authoring-only synthetic terrain is permitted for testing but must never enter canonical save/Chronicle.

## 2. Story contract

- **Purpose:** turn the apparent contradiction of two garden locations into an understanding that care can preserve something through change, without erasing the earlier site.
- **Opening trigger:** after *verified canonical E05 completion*, Milo sees the old lower-garden mark in the Map Room beside the current uphill garden. He proposes “Put it back!”; Nia asks what the plants need *now*. If E05 remains a draft, only an explicitly isolated developer preview may enter E06.
- **Problem/stakes:** the current garden thrives; the old lower area is not simply empty land to reclaim. The trio needs evidence about terrain, water and access before deciding what small new growth could responsibly belong below.
- **Turning point:** Milo tries a visible rain/runoff comparison, observes how the lower spot may collect water, and **revises** his initial exact-restoration idea. The test is a *model*, not an archival proof. Nia makes uncertainty discussable; Finn notices where a new route might fit without interfering with water.
- **Resolution:** leave the present garden intact, make a **small** lower-site planting trial at a suitable, approved spot, preserve a drainage channel/accessible path, and plan to revisit it. The two gardens now have distinct present-day purposes.
- **World consequence:** the lower pocket is started, with bounded future growth states. The current garden remains healthy and unchanged; the Chronicle remembers the old/new locations and what was observed versus hypothesized. The lower pocket becomes a visual callback in E11.
- **Hook:** Finn proposes checking whether a connector can help people reach the places *without* blocking drainage, setting up E07's design revision.
- **Non-goals:** move the entire garden back, destroy or transplant the healthy present garden, diagnose history from one synthetic test, promise all plants grow instantly, make the lower site universally dry/safe, reveal the Common, open the North Hill fence, require exact motor precision, award points, invent a new speaking caretaker or fake dates.

## 3. Character contract

| Character | Enters | Changes through action | Leaves with | Prohibited |
| --- | --- | --- | --- | --- |
| Milo (player) | Wants to put the garden back where the map shows | Tests the attractive simple idea, sees a tradeoff, helps start something smaller | Understands **keep what works; grow something new** | Child reduced to choosing an adult's answer |
| Nia | Notices two honest views of the place | Asks what the test shows and what it cannot prove; supports a cautious trial | Evidence and uncertainty can coexist | Pretend to know historical causes without a source |
| Finn | Sees slopes, paths and water flow | Helps test a model and notices a possible connector | An E07 question about multiple users and drainage | Build the connector in E06 or solve E07 early |

No new named resident is necessary for the draft. Land access/care permission remains a real Gate 1 blocker, **not** a pretend dialogue line.

## 4. Scene and trigger map

Two **separately navigable and meaningfully interactive** living spaces; storybook/Chronicle beats are not additional counted scenes.

| ID | Mode / place | Trigger and child action | Feedback / exit |
| --- | --- | --- | --- |
| `s01e06-sc00` | Storybook, Map Room handoff | Compare old map mark and present garden; choose to visit rather than accept a narration answer | Handoff remains gated by E05 canonical event |
| `s01e06-sc01` | **Current Garden** (scene 06) | Walk Milo among thriving beds, high/low view and path; inspect at least two distinct visible cues | Current beds stay healthy; garden model becomes available |
| `s01e06-sc02` | Current Garden rain/runoff model | On a clearly marked *model* tray, toggle dry/rain and compare where water travels; change the model's channel, then observe effect | Understand a possible reason to prefer higher ground, without claiming a definitive past cause |
| `s01e06-sc03` | Transition, slope | Milo revises “put it all back” to a small test below; parent cue optional | Enter Lower Garden only after observation and model comparison |
| `s01e06-sc04` | **Lower Garden** (scene 07) | Walk to an approved bounded planting area, inspect a runoff trace and walking space; move a temporary planting marker | Wet-flow or blocked-path marker shows visible consequence; marker is reversible |
| `s01e06-sc05` | Lower Garden planting | Confirm a small suitable pocket, carry/place a seedling or marker, protect drainage/access | One pocket is planted in the **authoring preview**; production event only after Gate 1 approval |
| `s01e06-sc06` | Chronicle / E07 hook | Compare **then/now** map, record evidence vs question; Finn points to connector idea | Persistent pocket growth callback for future E07/E11; no premature shortcut construction |

## 5. Substantial child interactions

### `s01e06-int01` — Observe the present garden

- **Cognitive action:** distinguish what can be seen (healthy beds, uphill location, paths) from a guess about why it moved.
- **Player action:** physically move Milo between inspectable garden anchors; inspect at least two; compare old/new map positions.
- **Feedback:** highlight observed anchors only; “Maybe” is valid; no automatic historical verdict.
- **Recovery/access:** large touch targets, keyboard/accessible action list, Listen/captions, no timed movement.

### `s01e06-int02` — Rain on a model, not on history

- **Cognitive action:** compare dry/rain states and predict runoff effects; distinguish *model observation* from *historical explanation*.
- **Player action:** run a bounded rain/dry tray model, move a detachable channel piece, re-run and compare before/after. Distinct **physical visualization** rather than a “correct choice” quiz.
- **Feedback:** animated water follows model geometry; a low catchment can get wetter; changing a channel may protect a pocket but not erase terrain constraints. Model is reversible.
- **Recovery/access:** step-through alternative to animation; fixed large controls; no score or required failure-first path.
- **Completion evidence:** child has seen two model conditions and a changed flow outcome, and can leave the explanation qualified.

### `s01e06-int03` — Start a small lower pocket

- **Cognitive action:** weigh plant needs, runoff and shared access; preserve the existing garden instead of recreating the past.
- **Player action:** at a *different location*, inspect low-site runoff and path, place/reposition a small temporary pocket marker, then confirm a safe trial.
- **Feedback:** marker in runoff becomes visibly wet; marker on path blocks a visitor; an off-channel, path-clear pocket permits a small trial. A placement remains reversible until confirm.
- **Recovery/access:** snap-to-sites / keyboard option, no precision dragging, accessible reason text with visual evidence.
- **Completion evidence:** child preserves the present garden, selects a bounded pocket, and recognizes that its future growth is not instant or guaranteed.

## 6. Learning, language and parent

**Primary:** systems/cause reasoning (terrain/drainage), preservation vs exact restoration. **Secondary:** living-system needs and change over time. Transfer: E04/E05 evidence provenance and then/now; E03 user-route constraints; E07/E09 drainage; E11 planted-pocket growth.

**EFL functions:** then / now; higher / lower; wet / dry; grow / move; because / so; “It is higher now.” “The water goes down.” “Maybe it moved because…” “We can try a small garden here.” Do not make comprehension depend on the child pronouncing *drainage*. Short lines with visible referents, replay/Listen and icons; the child still must compare causal alternatives.

**One during-play parent cue `s01e06-pc01`:** “What might happen if we moved the whole garden back?” Ask after the rain comparison, not before. Optional reflection: “What did we see, and what are we still guessing?” Adult never supplies a right answer.

## 7. Continuity and event contract (proposed IDs, **not** activated)

```yaml
requires:
  episodes_completed: [s01e05]
release_scenes:
  - id: s01e06-current-garden
    interaction: s01e06-int02
    effect: local_observation_only
  - id: s01e06-lower-garden
    interaction: s01e06-int03
    effect: pending_owner_gate
proposed_canonical_events:
  - id: s01e06_lower_pocket_started
    consequences: [lower_garden_pocket_stage_1, present_garden_unchanged]
  - id: episode_completed:s01e06
    consequences: [s01e07_eligible]
proposed_chronicle:
  id: s01e06_gardens_then_now
  fields: [old_map_location, present_garden_observed, model_result_labeled_hypothesis, lower_pocket_trial, remaining_question]
future_callbacks:
  - s01e07: keep_water_flow_and_shared_access_clear
  - s01e11: lower_garden_pocket_growth
```

Do **not** store guessed causes as historical facts. Production event emission must be atomic, idempotent and validated from canonical E05 prerequisites. Replay is read-only and cannot roll back later growth. Corrupt/forged progress fails closed. Development-only preview emits **zero** canonical events/unlocks and does not touch localStorage.

## 8. Art, animation, audio and production dependencies

- **Current Garden:** one painterly living scene with high healthy beds, distinct path, visible terrain and 2–3 inspectable anchors; C01 trio identity unchanged. Existing approved imagery preferred.
- **Lower Garden:** separate spatial composition, small permitted planting pocket, visible drainage/access constraint, before/after planting state and future growth variants. A mere recolor of the Current Garden does **not** count as a second playable scene.
- **Model:** clearly labeled detachable miniature tray, simple visible water flow and accessible step-through, not a fake photograph of a historical flood.
- **Assets:** original raster + reproducible WebP, approved provenance/manifest, no decorative SVG substituted as final art. No new full-scene generation loop before one coherent art batch.
- **Animation:** Milo walk/inspect/plant, channel move, water flow and plant-stage change; text equivalents for reduced motion.
- **Audio:** caption/Listen contract retained; prerecorded voice/music/SFX deferred.
- **Open physical approvals:** two distinct site geometries, water/soil plausibility, public permission and planting stewardship, final illustration/character staging. These are grouped into **one Gate 1 decision batch**, not micro-approval for every prop.

## 9. Acceptance and handoff

The accompanying [interaction spec](INTERACTION_SPEC.md) and [test matrix](INTERACTION_TEST_MATRIX.md) define a minimum isolated authoring prototype. It must show **two different navigable garden spaces** and two distinct actions (rain-model comparison, lower-pocket placement); preserve uncertainty; require real observations; support reversible tries; prevent canonical saves and E07 unlock. No claims of production PASS until actual scene art, browser/mobile QA, owner/family acceptance and integrity/deployment gates run.

**Next focused implementation task:** create an isolated, synthetic-geometry E06 two-garden interaction prototype and Node tests (no production imports, no E05 canonical handoff, no E07 unlock).