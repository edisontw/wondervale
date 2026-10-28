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

**Next task:** implement that isolated engine and tests; verify E01/E02/E03 remain byte-untouched.