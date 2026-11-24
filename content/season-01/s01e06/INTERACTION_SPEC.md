# S01E06 Interaction Specification — Two Gardens (Gate 1 draft)

**Status: DRAFT / NOT SHIPPABLE.** Derived from [E06 EPB](EPISODE_PRODUCTION_BRIEF.md). E06 has **one episode but two substantial playable places**: Current Garden (scene 06) and Lower Garden (scene 07). E04/E05 chronology, station-source and permission approvals are unresolved; synthetic model results must never become canonical historical facts.

## 1. Explicit flow and controls

```text
E05 canonical checkpoint verified
  -> SC00 Map Room then/now map
  -> SC01 Current Garden: move Milo; inspect healthy beds + slope/path
  -> SC02 Current Garden: reversible rain model (dry/rain + channel trial)
  -> SC03 child can say "Maybe" and choose a small trial
  -> SC04 Lower Garden: move Milo; inspect runoff trace + walking path
  -> SC05 drag/tap a temporary planting marker; reposition as needed
  -> SC06 Chronicle: observed / model / still unknown, E07 hook
```

The authoring prototype uses **local-only preview entry** instead of the E05 checkpoint and does not offer a canonical Continue. In production, E06 requires validated E05 completion, not a UI flag, E05 synthetic preview, corrupted snapshot or historical replay.

## 2. Current Garden: `s01e06-int01` / `int02`

### Observations

- `present-bed`: visibly healthy plants.
- `slope`: present garden is uphill relative to old-map marker.
- `shared-path`: residents still use the present garden path.
- At least two independent observations are required before model comparison; order is free. No hidden hotspots or answer-first quiz.
- Observations are **not** historical causes. Optional `not-sure` leaves a supported question open.

### Rain model

This is a labeled, reversible **miniature tray**, not a depiction of actual historic weather or the lower site's approved topography.

- Controls: `set-weather(dry|rain)`, `set-channel(open|blocked)`, `run-model`, `compare`.
- The tray exposes a high source, a downward path, a low catchment and a removable channel piece. Both weather and channel are visible before running.
- Dry and rain must both be observed, with at least one changed channel configuration and a second run. If channel is blocked during rain, a synthetic low catchment becomes wetter; when open, a modeled bypass may redirect part of the flow. The engine reports model observation, **not** “this is why the historical garden moved.”
- A child who starts with the more favorable model configuration can still learn: no forced wrong attempt. A child who starts with the unfavorable configuration can retry without score, damage or lost progress.
- No need for exact hand-eye drag: tap-to-place/keyboard selection produces the same water trace; step-by-step water animation alternative for reduced motion.

### Spatial model presentation contract

- The tray is an in-scene schematic with a high rain source, downhill route, directly operable drain channel, bypass and low catchment. The channel target is a keyboard-focusable button placed on the route; its activation uses the existing `garden('channel', value)` action, `can`, `dispatch` and replay rules. The accessible OPEN/BLOCKED action list uses those exact same actions.
- Keep the next-run configuration separate from observation. After weather/channel changes, the map, basin meter, run-history cards and comparison continue to describe only completed reducer `modelRuns`; the unrun configuration is labeled as the next setup.
- Draw the last completed run from its snapshot: DRY has no flow; RAIN/OPEN sends the model's two bypass marks and one low-catchment mark; RAIN/BLOCKED sends three marks to the low catchment and none to bypass. Do not derive displayed water from the currently selected setup.
- When both RAIN/Open and RAIN/Blocked snapshots exist, show them side by side as BEFORE/AFTER in their actual completion order. Keep weather the same so channel is the single changed model variable. Each card reports the snapshot's low-catchment and bypass counts; no run is fabricated and no completion timer grants progress.
- Static route and collection levels remain legible under reduced motion. The schematic is synthetic engineering geometry, not approved site geography, historical flood evidence, or proof of the garden's actual relocation cause.

### Leaving Current Garden

After the required observations and comparison, Milo can choose to investigate the lower site. A short line must keep uncertainty: “Water can run down. We still need to look there.” The current garden remains intact; it cannot be relocated or deleted.

## 3. Lower Garden: `s01e06-int03`

**Distinct environment and cognitive task:** lower site is not a replay of the rain tray. Milo must physically inspect a visible water trace and a real shared footpath before placing a temporary small planting marker.

Provisional synthetic test layout (NOT real garden geometry):

| Placement site | Rain/flow constraint | Public access | Observable result |
| --- | --- | --- | --- |
| `runoff-channel` | Overlaps modeled water route | Clear | Marker may get wet; can move |
| `footpath` | Outside water route | Blocks walking route | Another user cannot pass; can move |
| `raised-pocket` | Outside route | Leaves path open | Suitable for **small provisional trial**, not full historical restoration |

These are model affordances only. Before production, validate actual terrain, permissions, accessibility and planting care; do not turn “raised-pocket” into a historical location without review. The scene must show the constraints visually, not as three colored answer buttons. The child can try all sites or place directly at a viable site; neither strategy is penalized.

Controls: `inspect(runoff-trace|public-path)`, `move-marker(site)`, `inspect-result`, `confirm-small-trial`. Confirm is unavailable if water/access constraints conflict, or if the child has not inspected both constraints. Marker can be moved and preview undone before confirmation. A confirmed **preview** shows a small planting pocket, while the existing Current Garden remains healthy.

### Spatial feedback implementation note (2026-11-24)

- The isolated `/e06-scene/` board places the blue runoff trace/channel, gold shared footpath and green raised pocket in visibly different map positions. Each site remains a large focusable button; Milo walks and the temporary marker appears at the selected site. Mouse, touch and keyboard activate the same existing actions and strict replay path.
- After `inspect-result`, the visible map highlights the checked water conflict or shared-path conflict and explains it in a short status line. Moving the marker clears the active highlight until the new position is checked, so an old conflict is not shown as the current placement's result. The already recorded attempt remains in action history.
- After the small PAPER trial, the outlined raised pocket stays on the board. The sprout is a hypothetical model symbol. On the actual two-place revisit, a pair of NOW/POSSIBLE cards compares the healthy current bed with that PAPER idea; it does not claim that water caused a historical move.
- These are derived display changes only; there is no new action, progress flag, save, event, right or unlock. Entering/revisiting a space brings that playable scene into view. Reduced motion keeps routes and results static and legible.

## 4. Presentation, scaffolding and parent

- Desktop: illustrated world remains dominant, short caption below, optional parent cue. Mobile landscape: scene-first, controls below viewport, avoid whole-page scrolling in typical phone heights; portrait fallback readable.
- Milo is the directly controlled protagonist in **both** spaces; a clickable “Next” alone does not qualify as traversal. Companions comment briefly but do not solve the task.
- EFL: `then/now`, `higher/lower`, `wet/dry`, `because/so`, `maybe`; short replayable lines and object highlighting. Preserve the causal reasoning despite simplified language.
- Hint ladder: (1) highlight observable target; (2) prompt a comparison (“Where does the water go?”); (3) offer a nonspoiling demonstration of the control. No auto-completion.
- One parent cue **after** model comparison: “What might happen if we moved the whole garden back?” Optional reflection after planting: “What did we see? What are we still guessing?”
- Keyboard and touch must have equivalent actions; no timed moves, scores, unskippable animation, required audio or precision dragging.

## 5. State and integrity boundaries

Proposed episode-local fields: `currentObserved[]`, `modelRuns[]`, `modelCompared`, `lowerObserved[]`, `markerSite`, `lowerPreviewStarted`. All transitions are bounded, deterministic and replayable. Distinct release scene IDs: `s01e06-current-garden` and `s01e06-lower-garden`.

A developer-only prototype must:
1. begin in `mode=authoring_preview` with explicitly synthetic terrain;
2. refuse unexpected action names, properties, coordinates and out-of-order transitions;
3. derive display from validated action history, never trust a mutable `completed` flag;
4. expose `canonicalEvents=[]`, `unlocks=[]`, `historicalClaims=[]`, and never call storage APIs;
5. allow replay/reset without modifying E01–E05 progress or creating E07 eligibility;
6. preserve the *difference* between model outcome and actual cause, including in Chronicle preview.

Production integration later requires an approved E05 prerequisite, atomic idempotent event ledger, historical replay isolation, E06 owner-approved site/care evidence and real device QA. The authoring model is not a shortcut around these gates.

## 6. Minimum verification

The [test matrix](INTERACTION_TEST_MATRIX.md) enumerates cases. First engineering milestone: an isolated `engine/s01e06-authoring-prototype.mjs` with Node tests for distinct current/lower phases, two observations, dry/rain and changed-channel comparison, reversible lower marker, no event/unlock, tamper/replay rejection. Then add a small browser lab with two visibly different places and actual child-control movement before calling it a **playable** prototype. Do not add a production `/e06/` release from documentation or unit tests alone.

**Engineering handoff:** the spatial Current Garden water model and Lower Garden spatial feedback are separate PAPER-only deliveries, documented in [WORK_SEQUENCE](../../../docs/WORK_SEQUENCE.md) and the [E06 engineering QA](SPATIAL_MODEL_ENGINEERING_QA_20261124.md). Production Gate 1, historical sourcing, real-site geography, access/stewardship and art approval remain open.
