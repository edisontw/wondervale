# S01E08 Interaction Specification — Two Views, One Question

> **Gate 1 DRAFT / NONCANONICAL**. Derived from [E08 EPB](EPISODE_PRODUCTION_BRIEF.md). Scene 09/12; no approved site geometry, lamp power, historical service date or source cards. The E07 authoring model cannot unlock this production episode.

## 1. Entry, scene graph and safety

```text
Production: verified E07 canonical completion
  -> Lantern Steps lower safe apron (upper hill visibly closed)
  -> Milo walks and inspects brackets + boundary
  -> reversible two-lower-lamp test
  -> observe bracket/marker projection from base
  -> walk to side safe lookout; observe same fixed markers
  -> compare first/second, optionally return and recheck
  -> inspect accessible undated service plate
  -> provisional Chronicle observation / E09 safe-survey question
```

Authoring: `mode=authoring_preview`, synthetic fixtures and viewpoints, **no E07 bypass passed off as canonical**. The entire interactive location is one scene; no generic answer-choice quiz or secret path to upper Steps.

## 2. Synthetic geometric fixture contract

Use a **small abstract plan view** with fixed marker points, explicit lower safe Milo anchors, and two independently switchable lower test lamps. All points are **unitless synthetic coordinates**, not physical dimensions or verified lamp positions.

Example fixture: three markers at `(3,2), (5,3), (7,4)`; viewpoints `base=(1,1)`, `side=(1,4)`, `lower-landing=(2,1)`. For a viewpoint `v`, compute `theta_i = atan2(marker_i.y-v.y, marker_i.x-v.x)`. Compute the angular spread as the minimal circular arc containing all three angles (account for wraparound). `base` yields near-zero spread; `side` visibly differs. This is an **optical illustration** of parallax/perspective, not a proof that the historical markers were deliberately aligned. Render at least one static text/shape representation of apparent spacing; never rely on color or animation alone. The **markers never move** during a trial.

Lamp test: two bounded lower fixture IDs `lower-a` and `lower-b` can be toggled on/off in a **simulation**, never the closed upper lights. Require at least one on to see a dim outline, and both on for reliable inspection of all three marker points. If fewer are on, display “Not enough light to compare yet”; no penalty. Keep lights on for viewpoint comparison and show both lamp states in evidence.

`viewpoint` anchors are connected only through explicitly declared safe edges. `upper-closed` is **not** an anchor and cannot be traversed. Walking is one legal edge per action; no teleport, no time limit.

## 3. Authoring state/action contract

```js
{
  version: 1, mode: "authoring_preview",
  phase: "inspect" | "light-test" | "view-test" | "compare" | "preview-complete",
  miloPosition: "base",
  inspected: [],                 // brackets, boundary, service-plate
  lights: {"lower-a": false, "lower-b": false},
  observations: [],              // {viewpoint, angles, spread, lampStateHash}
  compared: false, previewComplete: false,
  history: [],
  canonicalEvents: [], unlocks: [], historicalClaims: []
}
```

Actions: `walk(anchor)`, `inspect(feature)`, `toggle-lamp(lampId)`, `observe-view`, `compare-views`, `confirm-preview`, `reset`. All actions have exact allowed keys/types. Only inspected lower fixtures can be switched; boundary inspection is required before lighting; an observation requires both lower lamps on and the current safe anchor. Two **different** viewpoints with same lamp state are required to compare. Changing light state invalidates prior view observations (or tags them to a different light hash and prevents mixed comparison). Repeated observations at the same viewpoint do not count as two perspectives. Comparing must use actual geometry outputs, not a supplied `pass` or `aligned` flag. A third safe viewpoint is optional.

At least one service-plate inspection before provisional finish; it records only `undated_source_pending`, not a year, author or historical conclusion. First apparent alignment is not “success”; two-view comparison enables a **qualified** interpretation (“This view changes the pattern. We should check the hill safely.”).

**Deterministic replay/security:** validate action history length, action types/fields/IDs, safe edges and phases. Derive the entire state from a trusted reducer; never trust snapshot `completed`, observation geometry, a forged source date or an injected unlock. `restore(snapshot)` must equal the replayed state or fail closed. Unknown actions and malformed numbers are inert. Reset only the isolated lab.

## 4. Story, EFL and feedback presentation

- Milo movement is visible on the lower apron; no fake upper pavement.
- A light test shows lower fixtures on/off and static marker silhouettes; no flashing.
- Two-view comparison presents `FROM HERE` and `FROM THERE` cards with apparent gaps or angles and identical marker identities; not a forced “correct/incorrect” answer.
- Child may revisit any safe anchor and retest; no score, lockout or forced wrong choice.
- Caption examples: “I see three marks.” “The lights help.” “From here, they line up.” “From there, I see a gap.” “The marks did not move.” “Maybe it points uphill.” Explain uncertainty, not invented history.
- Parent cue after first observation, before second: “How could we check from somewhere else?” It is optional and does not appear as a child-answer button.
- Reduced motion/static outlines, text alternatives for angles, keyboard Enter/Space and arrows or explicit walk buttons, 44px targets, landscape/portrait fallback, no sound dependence.

## 5. Continuity, QA and release boundaries

The authoring model must **not** import production save/Chronicle code, write storage, award E08, unlock E09, label an unsourced date or claim physical electrical safety. It may show a **provisional** preview note: “Lower lamps lit in the model; North Hill remains closed.” Production requires E07 canonical prerequisite, Owner-approved real lower-step geometry, lighting permissions and verified service-plate evidence before release.

[QA matrix](INTERACTION_TEST_MATRIX.md) distinguishes `NOT RUN` design cases from actual future Node/Chromium evidence. **Next unique implementation:** isolated E08 pure engine + Node tests of computed angular spread, safe walking, light toggles, replay and no canonical state, followed by browser scene and mobile Chromium.
