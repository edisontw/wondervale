# S01E09 Interaction Specification — Safe North Hill Survey

> **Gate 1 DRAFT.** Proposed **synthetic authoring interaction**, not evidence of real North Hill geometry, slope safety, public access or historic chronology. E08 canonical completion remains the future production prerequisite. No E10/Common reveal.

## Interaction principle

The child does **field observation and route annotation**, not another multiple-choice path quiz or E07 construction puzzle. A genuine boundary changes the objective: reach a safe overlook by *surveying and marking* only model-accessible edges. A fence is never “solved” by opening it. Milo is controlled by the child, while Nia asks what can be known and Finn checks whether a present-day route is useful.

## 1. Declared model geometry (fictional for testing)

A small, **explicitly synthetic** graph is a reproducible test fixture, not approved art/real-world coordinates:

| Node | Role | Accessible? | Inspectable clue |
| --- | --- | --- | --- |
| `steps_base` | Lower entry from E08 | yes | old line and current survey note |
| `signpost` | public-side fork | yes | boundary sign |
| `fence_view` | fence-side **safe** lookout | yes | fence and visible disturbed-ground feature |
| `lower_bend` | alternative public-side model path | yes | water/runoff feature and path surface |
| `overlook` | alternate model viewpoint | yes | distant matching mark |
| `upper_closed` | unsafe historical hill line | **no** | cannot enter, inspect up close or mark |

Only bidirectional safe edges: `steps_base–signpost`, `signpost–fence_view`, `signpost–lower_bend`, `lower_bend–overlook`. `fence_view–upper_closed` is a **visible closed edge** with no traversal action. There is **no hidden floor, teleport, jump, secret bridge, bypass or implied physical access**. The actual topology and permitted route remain unverified.

## 2. State and commands

Proposed in-memory state: `position`, `inspected` (set of approved clue IDs), `observations` (typed `seen` vs `inferred` vs `unknown`), `surveyedEdges` (only edges Milo actually walked), `markedEdges` (route sketch subset), `blockedAttempts` (feedback count only), `symbolCompared`, `provisionalFinished`. No localStorage, production imports, remote requests or fabricated dates.

- `walk(toNode)`: only one declared adjacent **safe** edge at a time; record a surveyed edge. Walking toward `upper_closed` is rejected with visible “This way is closed. We can look from here.” Milo remains on safe ground; no damage.
- `inspect(clueId)`: only if Milo stands at a declared safe viewing anchor. Fence/sign, surface/runoff and distant mark have separate IDs; seeing an erosion-like feature is **not** proof of its cause/date.
- `mark(edgeId)`: only if it is a declared safe edge **and already walked/surveyed**. Attempt to mark a closed, unknown or unsurveyed edge gives nonpunitive feedback and leaves the map unchanged. Child can `unmark` and revise.
- `checkRoute()`: compute continuity from `steps_base` to `overlook` using **only marked safe surveyed edges**, not a client-provided success flag. If incomplete, highlight the last reachable marked node and allow walking/marking again.
- `compareSymbol()`: only from `overlook`, after inspecting the distant mark, with the previously known E01 symbol *as a design reference*. Result is “same mark shape observed” (provisional), **not** place identity or historical source.
- `review()`: show distinct “We saw / We think / We still don't know” cards, after fence, terrain and overlook evidence are actually inspected and a continuous model route is checked. `finishPreview()` creates only an in-memory **authoring** summary.

Actions cannot declare a route safe, invent a source year, open the closed segment, supply new graph edges, grant E10 access or directly set `provisionalFinished`. Any command at a wrong anchor must fail closed with a legible reason and optional nearby safe action. A child can choose the order of fence/alternate inspections; route completion cannot skip required evidence.

## 3. Story sequence and visible feedback

1. **Stop at the real boundary (represented in a model).** At `signpost` Milo can walk to `fence_view`; the historical line ends at the fence. A trial `walk(upper_closed)` produces a **stop-and-return** gesture only on existing safe ground. The sign stays fixed.
2. **Notice rather than explain.** Inspect the sign and disturbed ground from safe anchors. Cards say `I SEE` for visible surface/water clues; `I THINK` may hold a hypothesis but cannot become a verified historical fact.
3. **Survey a different way.** Milo walks via `lower_bend` to `overlook`. Each actually traversed edge becomes available to mark in the diegetic notebook. A wrong/incomplete mark can be removed; no “wrong choice” animation or forced reset.
4. **Check the sketch against the walk.** A continuous route must be computed from the selected surveyed edges. An unmarked gap produces a visible gap, not a success message.
5. **Look, compare, leave the mystery intact.** From `overlook`, inspect the distant mark and compare its **shape** to E01. Do not display the destination name, current use, hidden path or E10 solution. Finish with a qualified Chronicle **preview** and E10 question.

The child may walk back to re-inspect any clue. The preview never alters the E08/E09 production save, Chronicle, map or unlock. The model is **not** a safety certification.

## 4. EFL, parent, accessibility

Short captions tied to objects/actions: “The hill path is closed.” “I can see the fence.” “I see water marks.” “We can't walk there.” “Try another way.” “This way is open in our model.” “I see the same sign.” “We don't know the place yet.” Use icons/text labels and optional spoken-text UI fallback, not mandatory audio or forced text entry. Never make English decoding the only way to know which node is accessible.

Parent cue **after** fence inspection, not before: “What can we learn without crossing?” It must be optional; adults do not choose the route. A second optional prompt asks which evidence is seen versus guessed.

Accessible presentation: visible Milo motion with reduced-motion/static equivalent; every walk, inspect and mark action has touch/keyboard focusable alternative; ≥44px targets; text labels for safe/closed and route gaps independent of color; 1366×900, 568×320, 667×375 and 390×844 layout tests. Fence and closed edge always visible, including portrait/restart.

## 5. Replay and QA boundaries

Implement a deterministic reducer with a fixed maximum action-history length, strict node/edge/clue IDs, phase constraints, no arbitrary geometry injection, and state derivation from action replay. Reject forged completion, invented route edges, changed source dates, and injected unlocks; if snapshot restoration is offered, it must match trusted replay. Reset affects only the isolated model.

A future production runtime must separately verify canonical E08 prerequisite, Owner-approved **actual** safe ground and route geometry, genuine evidence provenance, source/asset integrity, Chronicle and E10 unlock rules, remote release and family acceptance. An E09 authoring test PASS cannot satisfy those gates.

**Next implementation:** a small pure Node state engine with calculated route connectivity and explicit closed-edge invariants; then an isolated child-driven browser survey, followed by Chromium and accepted-episode regression. No production E09 deployment.
