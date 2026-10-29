# E09 Safe North Hill — isolated authoring engine QA

**2026-10-29 / Gate 2 engineering model, NOT a production route or playable browser scene.**

- Engine: [s01e09-authoring-prototype.mjs](../../../engine/s01e09-authoring-prototype.mjs)
- Tests: [s01e09-authoring-prototype.test.mjs](../../../tests/s01e09-authoring-prototype.test.mjs)
- CI: [wondervale-e09-prototype.yml](../../../.github/workflows/wondervale-e09-prototype.yml)
- Spec: [INTERACTION_SPEC.md](INTERACTION_SPEC.md); all 40 production matrix cases remain **NOT RUN**.

## Scope

A fictional five-node safe survey graph with a permanently inaccessible `upper_closed` node. Milo walks only adjacent declared model edges. At the fence, attempting to walk or mark the closed edge gives nonpunitive feedback without crossing. Only walked edges can be marked; the child can remove and revise marks. `check-route` computes continuity from `steps_base` to `overlook` using only marked and surveyed edges, not a supplied success flag. Observation cards keep seen evidence separate from hypotheses and unknown real-world facts. Comparing a distant symbol records only shape similarity to the E01 sketch, never the place's identity. A provisional finish is **in memory only**, not a canonical Chronicle entry, E10 unlock, real trail permission or deployment.

Strict action schemas, bounded deterministic replay and exact snapshot restoration reject forged completion, date, graph, route result, event and unlock fields. No child data, storage or production runtime imports.

## Evidence

Local Node v22 `node --test tests/s01e09-authoring-prototype.test.mjs`: **19/19 PASS** in the isolated work environment. Repository Actions Node v24 and E01 regression must be checked on the exact PR head before merge, then checked separately on merged `main`. E09 Chromium, physical device, MN4 deployment, HTTPS and rollback: **NOT RUN**.

## Gates and next task

Actual public-access boundary, safe anchors, alternate overlook, source provenance and approved painterly geometry remain `blocked-design` for production; the model must never be promoted as real access evidence. Next: build an **isolated E09 browser survey lab** with Milo movement, fence stop feedback, revisable marked-route notebook and seen/think/unknown cards; then four-viewport Chromium tests. Keep E01/E02/C01 and E03 accepted runtime/art unchanged.
