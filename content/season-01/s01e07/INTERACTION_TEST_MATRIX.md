# S01E07 Connector Interaction Test Matrix

> **Gate 1 DRAFT — all 42 production-contract cases NOT RUN (2026-10-29).** This is a verification specification, not a claim that E07 code or art exists. Source: [EPB](EPISODE_PRODUCTION_BRIEF.md) and [interaction spec](INTERACTION_SPEC.md). E07 is **one major playable scene (scene 08/12)**, not an extra episode. An authoring prototype may later report its own actual Node/Chromium subset separately; do not silently mark these production cases PASS.

| ID | Layer | Stimulus | Expected evidence / invariant | Status |
| --- | --- | --- | --- | --- |
| E07-S01 | Scene | Enter Connector Passage | Milo is controllable in one navigable place; model is diegetic, not a quiz | NOT RUN |
| E07-S02 | Entry | Attempt production entry from E06 authoring preview | Reject; requires verified canonical E06 event after approval | NOT RUN |
| E07-S03 | Entry | Enter isolated lab | Label synthetic/noncanonical, no real-site safety claim | NOT RUN |
| E07-S04 | Narrative | Finish E07 preview | Only base of Lantern Steps preview; no lights, hill opening or Common reveal | NOT RUN |
| E07-O01 | Observe | Walk to entry and inspect | Reachable physical anchor, no teleport through painted wall | NOT RUN |
| E07-O02 | Observe | Inspect two distinct constraints | Recorded without historical/physical inference | NOT RUN |
| E07-O03 | Observe | Try baseline before observing constraints | Cannot skip required observation; helpful hint | NOT RUN |
| E07-O04 | Observe | Inspect out-of-range or unknown anchor | Fail closed, no hidden floor | NOT RUN |
| E07-T01 | First test | Walk Milo on Finn's baseline | Computed Milo PASS; not episode completion | NOT RUN |
| E07-T02 | Second user | Run other-user trial | Show shared-path obstruction as spatial trace, not score | NOT RUN |
| E07-T03 | Water | Run water/access trial | Show channel conflict as separate spatial trace | NOT RUN |
| E07-T04 | Test order | Run water before other-user test | Either order valid; both needed | NOT RUN |
| E07-T05 | Evidence | Inspect first success only and confirm | Reject incomplete; success for Milo is insufficient | NOT RUN |
| E07-T06 | Evidence | Inspect two side-effect traces | Visible cause/effect; Finn not mocked | NOT RUN |
| E07-R01 | Revision | Move model piece to alternative snap | Spatial footprint changes visibly, no precision drag | NOT RUN |
| E07-R02 | Revision | Choose clear layout first | May complete without forced extra wrong trial | NOT RUN |
| E07-R03 | Revision | Choose shared-path-blocking layout | Resident test FAIL; precise overlap shown; retry allowed | NOT RUN |
| E07-R04 | Revision | Choose channel-blocking layout | Water test FAIL; precise overlap shown; retry allowed | NOT RUN |
| E07-R05 | Revision | Try to confirm after only Milo revised PASS | Reject; requires resident and water tests on same layout | NOT RUN |
| E07-R06 | Revision | Run three tests on different layout hashes | Reject stale mixed evidence | NOT RUN |
| E07-R07 | Revision | Move piece after all PASS | Invalidate previous revised results; retest required | NOT RUN |
| E07-R08 | Revision | Undo or reset model | Restores reversible state, no permanent changes | NOT RUN |
| E07-R09 | Revision | Try invalid snap/duplicate piece/out-of-range coordinates | Reject deterministically; no fabricated connection | NOT RUN |
| E07-R10 | Revision | Valid revision tested in any action order | All three PASS; first/now comparison can proceed | NOT RUN |
| E07-R11 | Revision | Compare first and revised layout | Shows what changed and why, not just green badge | NOT RUN |
| E07-R12 | Revision | Confirm before first/now comparison | Reject; child must see consequence | NOT RUN |
| E07-R13 | Revision | Confirm same valid preview twice | Idempotent preview, no duplicate effects | NOT RUN |
| E07-C01 | Chronicle | Preview after revision | First/now, other user, water and Finn's new question; no score | NOT RUN |
| E07-C02 | Continuity | Inspect proposed canonical events in authoring lab | canonicalEvents/unlocks/historicalClaims all empty | NOT RUN |
| E07-C03 | Continuity | Reload or restart lab | No localStorage, E06 state mutation or E08 unlock | NOT RUN |
| E07-C04 | Continuity | Replay old trial after completion | No rollback of later canonical state; authoring lab remains local | NOT RUN |
| E07-C05 | Integrity | Tamper action log, unknown action or forged completed flag | Fail closed; derive from validated replay | NOT RUN |
| E07-C06 | Integrity | Try to reuse synthetic geometry as real-site proof | Blocked by production approval gate and explicit labeling | NOT RUN |
| E07-A01 | Access | Keyboard-only inspect, walk, place and test | Same meaningful path as touch, visible focus | NOT RUN |
| E07-A02 | Access | Phone landscape 568×320 and 667×375 | No inaccessible controls/overflow, ≥44px tap targets | NOT RUN |
| E07-A03 | Access | Phone portrait 390×844 and desktop 1366×900 | Readable scene-first fallback, no clipped essential evidence | NOT RUN |
| E07-A04 | Access | Reduced motion and no audio | Step-through traces and captions carry all information | NOT RUN |
| E07-A05 | Access | Parent absent | Child can independently finish; optional cue not blocking | NOT RUN |
| E07-P01 | Production | Approved connector geometry/role/permission | Gate 1 Owner PASS required before canonical script/scene | NOT RUN |
| E07-P02 | Production | Actual illustrated path/turn clearance and access | Physical/visual PASS separate from model/Chromium PASS | NOT RUN |
| E07-P03 | Production | Save/replay/unlock and E01–E03 regressions | Atomic ledger and current-head CI before promotion | NOT RUN |
| E07-P04 | Production | MN4 package/deploy/HTTPS/rollback | Hash/immutability/remote proof required; never infer from PR merge | NOT RUN |

## Minimum isolated authoring prototype exit

- Deterministic model geometry computes Milo, other-user and water/access outcomes; baseline Milo PASS and visible side effect. A child can move a connector piece and test a changed layout without quiz-only UI or forced failure.
- `test-milo`, `test-resident`, `test-water` results are tied to the **same validated layout**. Changing a piece invalidates earlier results. Preview completion requires first/now comparison and all three revised traces PASS.
- Tampered/out-of-order replay fails closed; `canonicalEvents=[]`, `unlocks=[]`, `historicalClaims=[]`, no localStorage or production imports. Node tests verify both failure-first and valid-first revision.
- Browser lab later verifies **real Milo navigation**, observable trace feedback, desktop/mobile and keyboard/touch parity. Unit tests alone do not prove a playable scene.

## Owner Gate 1 — single decision batch

Confirm (1) real site topology and safe floor/turning/width constraints; (2) legitimate other-user access and drainage/routine-use conflict with believable illustration; (3) permission to test/build and when a persistent connector may open; (4) whether the unnamed user needs approved production character art; (5) E06 canonical prerequisite and E08 Steps-base boundary. If these cannot be demonstrated, revise the EPB instead of inventing a route.

## Handoff

**Next task:** implement isolated E07 state/geometry engine and Node tests. Only after that add a real browser lab; no `/e07/` release, Chronicle event or E08 unlock without the upstream and production gates.
