# Arc 1 E03 → E04 → E05 production gate and twelve-scene accounting

**Audit baseline:** GitHub `main` `8815e90e3d7a62c40549ba80e038031dcc54270c` on 2026-10-30. This is a **gate inventory**, not a claim of Season 1 acceptance. Recheck the live SHA and Actions before merging or releasing.

## What actually connects

1. **E02 → E03:** canonical E02 completion is replay-validated by the existing E03 prerequisite. E03 completion is independently restored from its legal action history, including both sincere station/garden memories, the marker and Chronicle. The approved Market story and artwork are unchanged.
2. **E03 → E04:** `engine/s01e04-handoff.mjs` already returns a read-only source handoff after genuine E02/E03 completion. `engine/s01e04-authoring-entry.mjs` can open an isolated chronology **draft**; `engine/s01e04-chronology.mjs` supports only `draft_preview` and `historical_replay`. Completing that draft does not create a canonical E04 save or finish event. PR #114 remains draft and Owner-gated.
3. **E04 → E05:** **no canonical E04 runtime/checkpoint exists**. New `engine/s01e05-production-entry.mjs` is an explicit, read-only, fail-closed boundary. Even a completed synthetic E04 draft, a forged `canonical` snapshot, a caller's `ready:true`, or a completed E05 Map Room paper prototype cannot unlock E05. The new test executes genuine E02/E03 fixtures, finishes an E04 authoring timeline and E05 paper-room trial, then proves all attempted production promotions fail. This is a guard, **not** an E05 production runtime.

Before replacing the fail-closed E05 gate: obtain one approved E04 source/chronology batch; implement a canonical E04 event log with strict legal-action replay, exactly-once completion, Chronicle and episode-local reset; add a validated E04→E05 entry test and a browser/packaging regression. Do **not** enable it by passing an approval boolean or reusing the draft key.

## Twelve release scenes: verified scope vs missing production gates

| Release scenes | Current engineering evidence | Still required for production acceptance |
| --- | --- | --- |
| 01 E01 Town Square; 02 E02 Riverside | Accepted playable scope, canonical state and deployed historical baselines | Preserve approved behavior; remaining bounded physical/family checks |
| 03 E03 Market Lane | Canonical delivery/Chronicle and guarded E04 entry; PR #107 and #159 merged | Verify exact-current E03 browser/release/HTTPS status; wheel/turn clearance #109 and physical acceptance remain separate |
| 04 E04 two-memory chronology | Owner-gated PR #114 draft; authoring-only chronology engine | Genuine attributed sources, Owner Gate, canonical scene/ledger/Chronicle, real browser and release |
| 05 E05 station; 06 E06 current garden; 07 E06 lower garden | Distinct noncanonical child-driven paper stories, Node/Chromium tests | E04/E05 real handoffs, approved geography/rights/art, persistent growth and unlock |
| 08 E07 connector; 09 E08 Lantern Steps; 10 E09 Closed Hill | Distinct noncanonical child-driven paper stories and safe model interactions | Verified physical paths, permissions, production world changes, safe lighting and closed-hill boundaries |
| 11 E10 unnamed place; 12 E11 shared space/loop | Noncanonical evidence/needs stories and E10→E11 paper handoff | Genuine source/name/needs decisions, authorized Common reveal, canonical loop/Chronicle, family Gate |

**Accounting:** 3 existing canonical episode experiences + 9 planned scene slots (E04–E11 with E06 twice) = **12 planned**, not 12 accepted. E05–E11 authoring labs do not produce real episode unlocks or canonical history. A paper-room/planting/light/loop success is not real-world construction, a permission, or an MN4 deployment.

## Verification boundary

- `tests/s01e03-e04-handoff.test.mjs`: genuine E02/E03 legal replay, draft completion and E05 paper completion cannot manufacture canonical E05 eligibility; upstream reset fails closed.
- `.github/workflows/wondervale-e04-authoring.yml` and E03 preview workflow run this test when changed; check exact PR head and merged main independently.
- Node/Chromium, Actions, remote MN4 HTTPS, rollback exercise, and actual family device PASS are **different** gates. This change intentionally does not package or deploy any new episode.

**Single next engineering task after this gate:** build an E03→E04→E05 **noncanonical** child-story rehearsal that visibly carries the two attributed memories and an UNKNOWN source boundary into E05, without issuing a production unlock; retain PR #114 for the one-batch Owner source decision.
