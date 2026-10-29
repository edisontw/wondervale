# E09 Safe North Hill — isolated authoring engine QA

**2026-10-29 / Gate 2 isolated Node + browser model, NOT a production route or canonical episode.**

- Engine: [s01e09-authoring-prototype.mjs](../../../engine/s01e09-authoring-prototype.mjs)
- Tests: [s01e09-authoring-prototype.test.mjs](../../../tests/s01e09-authoring-prototype.test.mjs) (19 Node cases) and [s01e09-browser.mjs](../../../tests/s01e09-browser.mjs) (four Chromium viewports + keyboard)
- Browser lab: [e09-prototype](../../../e09-prototype/README.md)
- CI: [wondervale-e09-prototype.yml](../../../.github/workflows/wondervale-e09-prototype.yml)
- Spec: [INTERACTION_SPEC.md](INTERACTION_SPEC.md); all 40 production matrix cases remain **NOT RUN**.

## Scope

A fictional five-node safe survey graph with a permanently inaccessible `upper_closed` node. Milo walks only adjacent declared model edges. At the fence, attempting to walk or mark the closed edge gives nonpunitive feedback without crossing. Only walked edges can be marked; the child can remove and revise marks. `check-route` computes continuity from `steps_base` to `overlook` using only marked and surveyed edges, not a supplied success flag. Observation cards keep seen evidence separate from hypotheses and unknown real-world facts. Comparing a distant symbol records only shape similarity to the E01 sketch, never the place's identity. A provisional finish is **in memory only**, not a canonical Chronicle entry, E10 unlock, real trail permission or deployment.

Strict action schemas, bounded deterministic replay and exact snapshot restoration reject forged completion, date, graph, route result, event and unlock fields. No child data, storage or production runtime imports.

## Evidence

Node v24 **19/19 PASS** and Chromium four complete desktop/mobile journeys plus keyboard **PASS** on exact PR head [#40847271185](https://github.com/edisontw/wondervale/actions/runs/40847271185). E01 Node/Chromium regression [#40847271191](https://github.com/edisontw/wondervale/actions/runs/40847271191) **SUCCESS**. Merged-main E09 Node/Chromium [#40847548880](https://github.com/edisontw/wondervale/actions/runs/40847548880) **SUCCESS** and E01 [#40847548834](https://github.com/edisontw/wondervale/actions/runs/40847548834) **SUCCESS**. Browser checks exercise 1366×900, 568×320, 667×375, 390×844, 44px targets, no horizontal overflow, no teleport/closed crossing, revisable route gap, notebook, restart/reload, keyboard and zero storage/canonical writes. Two early PR-head browser failures revealed mobile scrolling/pointer interception at scene anchors and long notebook buttons; accessible adjacent walk controls and moving review/restart above the notes corrected them. The final exact-head and merged-main checks are green; earlier failures are not presented as passes.

Real-device/family, the 40-case **production** matrix, MN4 deployment, HTTPS and rollback remain **NOT RUN**.

## Gates and next task

Actual public-access boundary, safe anchors, alternate overlook, source provenance and approved painterly geometry remain `blocked-design` for production; the model must never be promoted as real access evidence. Next: begin an independent E10 story/needs investigation brief and interaction contract; do not treat the E09 lab as an E10 unlock. Keep E01/E02/C01 and E03 accepted runtime/art unchanged.
