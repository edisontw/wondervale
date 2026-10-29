# S01E07 Interaction Specification — Test, Notice, Redesign

> **Gate 1 DRAFT / NONCANONICAL.** Derived from [E07 EPB](EPISODE_PRODUCTION_BRIEF.md). Scene 08 of the 12-scene plan is **one** navigable Connector Passage with an in-world removable model. No approved site geometry, construction, other-user identity or production art exists. E04–E06 source/site approval cannot be bypassed.

## 1. Trigger, scene graph and visible outcome

```text
E06 verified canonical completion (production only)
  -> E07 storybook handoff: Finn offers a quick connector model
  -> Connector Passage: Milo walks/inspects at least 2 real-visible anchors
  -> Finn's FIRST layout: Milo walks a short path (success for Milo)
  -> Another user walks; water/access trace runs; conflict becomes visible
  -> Child moves model connector piece(s) to a different footprint
  -> Rerun Milo + other user + water/access tests
  -> Compare FIRST/NOW; revise again if any obstruction remains
  -> Proposed revised connector / Chronicle, E08 Steps-base hook
```

Authoring prototype entry: **`mode=authoring_preview`**, synthetic labeled geometry, no E06 prerequisite simulation presented as canonical. In production, require an actual validated E06 event chain, not a developer flag, screenshot, replay or corrupted snapshot.

**Release scene** `s01e07-connector-passage` is a place, not a quiz. Milo can move among passage anchors; a removable board appears *inside* the scene after inspection. Storybook and Chronicle panels do not count as additional scenes. Finn's baseline idea is already built on a **model**, so the child does not need to be tricked into choosing a bad answer.

## 2. Concrete authoring model — synthetic, never real-site evidence

A minimal deterministic board can use a small grid of **labeled snap points** and drawn footprints; no claims about physical meters or wheel clearance. At least these three visible functions must be independently testable:

| Trace | Meaning | First-layout synthetic result | Required revised-layout result |
| --- | --- | --- | --- |
| `milo` | Can Milo follow the proposed connector from garden approach to Steps-base approach? | PASS: a short continuous route | PASS: continuous legal route |
| `resident` | Can a second user still traverse their **pre-existing shared path**? | BLOCKED: connector overlaps shared passage | PASS: passage remains open |
| `water` | Can runoff follow the existing channel without meeting connector footprint? | BLOCKED or diverted in model | PASS: channel remains open |

The baseline demonstrates **Milo success but a real side effect**. The model should show both resident and water constraints if possible, but final narrative must be narrowed to what approved production geometry supports. Synthetic board should be obviously schematic and captioned `Model — not the real site`.

**Geometry contract:** model connector pieces are bounded rectangles/polygons snapped to a small set of explicit sites; path traces are graph edges or occupancy cells. Every claimed pass/blocked result is computed from geometry/occupancy, not from a pre-scripted “correct” label. No inaccessible or painted-off path is treated as traversable. If a production art reference cannot prove a route segment, that segment stays unwalkable.

**Suggested authoring fixtures** (names describe model footprints, not approved physical locations):
- `short-crossing`: shortest model connection, intersects shared passage and water channel.
- `side-offset`: leaves both shared passage and water channel clear while keeping a Milo connection; visibly longer than the baseline.
- `path-clear-water-blocked`: preserves the resident path but crosses the channel; useful for proving multi-constraint validation.
- `channel-clear-path-blocked`: preserves water but blocks shared passage.
These are fixture states for tests; child UI should be a **spatial piece-placement surface**, not a dropdown asking “Which answer is correct?” A future geometry model may admit multiple valid layouts. The engine should accept any layout that satisfies constraints rather than hard-code one approved site.

## 3. Interaction state and deterministic actions

**Proposed authoring state:**

```js
{
  mode: "authoring_preview",
  phase: "inspect" | "first-trial" | "side-effect" | "revise" | "compare" | "preview-complete",
  observed: [],             // passage-entry, shared-path, channel (unique)
  miloPosition: "entry",     // or a validated reachable anchor
  baseline: "short-crossing",
  currentPieces: [],        // validated finite set of snap locations
  firstTrial: null,         // computed geometry result, never user-supplied
  otherUserTrial: null,     // computed geometry result
  waterTrial: null,         // computed geometry result
  revisedTrials: [],       // each includes layout hash + three computed traces
  compared: false,
  canonicalEvents: [],
  unlocks: [],
  historicalClaims: []
}
```

**Proposed action API:** `walk(anchor)`, `inspect(anchor)`, `test-milo`, `test-resident`, `test-water`, `place-piece(pieceId,snapId)`, `undo-piece`, `run-all-traces`, `compare-layouts`, `confirm-preview`, `reset`. Validate action type, fields, IDs and phase. Derive state by replaying validated actions, not by trusting a supplied `completed` property or arbitrary persisted JSON. Unrecognized actions, duplicate object IDs, invalid coordinates, negative/NaN geometry, phase skips, forged trials and tampered action logs **fail closed**.

### 3.1 Inspect and first test

- Milo walks between physically reachable model anchors; movement cannot teleport through a barrier. `inspect` requires Milo at a relevant anchor or offers an explicit keyboard focus/inspect alternative that still represents the same reachable place.
- At least two constraints must be inspected before the model trial. Display visible anchor highlights; no hidden floor.
- `test-milo` moves a ghost/test route along Finn's baseline connector; it passes. **Do not** mark episode complete.
- The child then triggers `test-resident` and `test-water`; both results remain inspectable. At least one is obstructed. Show which footprint overlaps which path/channel; no blame, damage or score.

### 3.2 Child-led revision

- Child may move model pieces to visible snap points. Layout updates invalidate old revised test results; the UI must show `Needs retest`, not stale PASS.
- Re-test all three functions against **the same layout hash**. The engine must reject a success assembled from tests of different layouts.
- The child can start with a valid revision, or make several revisions. Never require a wrong attempt or a fixed number of failures.
- `confirm-preview` requires baseline Milo trial, both baseline side-effect trials, at least one changed layout, all three revised tests PASS on that exact layout, and an explicit first/now comparison.
- If a constraint fails, show a trace/caption `The shared path is blocked` or `Water needs a way`; piece remains movable and reversible.
- `reset` clears only authoring lab history. `undo-piece` restores prior model layout without changing story or any other episode.
- A preview completion shows a proposed connector state and the E08 Steps-base hook, **never** a real built route or canonical unlock.

### 3.3 Uncertainty and presentation

- An observed model result supports `this arrangement works on this model`, **not** `real construction is safe`. Any real site width, slope, permission, drainage and accessibility requires Owner-approved evidence and real-device/art/physical review.
- Three traces should be distinguishable by path style/symbol and text, not only color; child can replay each trace or step it without animation.
- One sparse optional parent cue after Milo's first PASS: `It works for us. Who else uses this place?`. Do not require adult participation.
- EFL captions are short and replayable: `It works for me`, `Can they pass?`, `Water needs a way`, `Let's move this`, `Now both can pass`, `because...`.
- Touch targets at least 44 CSS px when feasible; keyboard Enter/Space activation, focus indicator, no drag-only solution, no timed move; landscape-first with portrait fallback. Milo is directly controllable, not merely a cursor in a quiz.

## 4. Save, Chronicle and episode boundary

**Authoring lab:** in-memory only; `canonicalEvents=[]`, `unlocks=[]`, `historicalClaims=[]`; no `localStorage`, cookies, network telemetry, or production episode imports. Reload/reset does not touch E01–E06. No `/e07/` deploy from this lab.

**Future production (after Gate 1):** verify actual canonical E06 completion, use atomic/idempotent event ledger, save `s01e07_connector_revised` only after all validated tests, record before/after and Finn's growth in Chronicle, open **Steps base** not Steps lights, and make replay read-only. Never fabricate the Common, a historical date, physical clearance or a real planting effect.

## 5. Verification milestones

1. **Authoring Node:** deterministic geometry engine, replay validation, first layout Milo PASS/other-user or water FAIL, retest invalidation, multi-constraint valid revision, alternate order, fail-closed tamper, no canonical effects.
2. **Authoring Chromium:** actual scene navigation and Milo movement, first/now visual, second-user/water traces, touch/keyboard, phone portrait/landscape, reset/reload and no storage; evidence screenshots; not a production Gate 3 PASS.
3. **Production only:** Owner Gate 1 site/role permission + approved painterly art, script/Chronicle/ledger integration, E06 handoff, E01–E03 regression, actual route/physical review, family/device QA, packaging/hash/rollback and MN4 deployment evidence.

**Next unique implementation:** isolated `engine/s01e07-authoring-prototype.mjs` + `tests/s01e07-authoring-prototype.test.mjs`; then a browser lab. Do not replace this with another document-only E07 polish pass.
