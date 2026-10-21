# Wondervale — Quality Triage and E03 → E04 Entry Gates

**Status:** 2026-10-22 process/QA plan. Applies prospectively. This does **not** change already-approved story, EFL, the three E03 delivery/route intent, E01/E02/C01 source, or existing owner-PASS boundaries.

## 1. Triage: fix blockers, do not polish indefinitely

| Priority | Rule | Work policy |
| --- | --- | --- |
| **P0 — blocker** | Cannot finish intended meaningful child task; unsafe/impossible route presented as legal; progress/Chronicle corruption; critical input inaccessible; E01/E02 regression; release integrity or mandatory deploy-package failure. | Fix before E03 full Gate 3 / the next integrated release. Track exact reproduction, source SHA, and acceptance evidence. |
| **P1 — important** | Misleading current item/destination, cramped/covered text, confusing actor placement, significant mobile rendering or nonfatal persistence/support issue. | Fix in short focused batches before owner Gate 4 or promotion; escalate to P0 when child cannot meaningfully proceed. |
| **P2 — polish** | Nonblocking petal/texture detail, slight motion softness, cosmetic shadow/prop appearance, optional animation and deferred audio. | Backlog for Arc 1 alpha/season polish; do not re-open approved illustrations or burn repeated generation cycles. |

**Evidence discipline:** an issue must say what was observed, where it occurs, what the child actually sees/can do, which tests ran, and which acceptance remains open. `PASS` must be scoped: static reference / engine / browser / real device / owner playable / release are not synonyms.

### Tracked current items

- **P0** [#110 Release artifact quota](https://github.com/edisontw/wondervale/issues/110): mandatory release-package upload must recover; do not bypass artifact/package signing/integrity/allowlists.
- **P0** [#108 S/N pedestrian paths](https://github.com/edisontw/wondervale/issues/108): validate real painted paving, both entrances/exits/foreground and explicit child route alternatives. Maintain the canonical three-route interaction purpose.
- **P0** [#109 tea-cart swept envelope](https://github.com/edisontw/wondervale/issues/109): prove real practical turns/paving under perspective, not only visual CSS bounding-box separation.
- **P1** [PR #107 task/destination clarity](https://github.com/edisontw/wondervale/pull/107): branch candidate, PR CI PASS claim, **not** merged/current-live owner PASS. Existing art/props remain approved for their prior scope.
- **P1 pending owner QA:** E03 smartphone short-landscape, portrait, captions, interactive target size, actor feet/foreground, task strip/wayfinding, and meaningful unassisted decision. Open until actual scoped device observations are recorded.
- **P2 deferred:** final prerecorded audio, background score/SFX, richer movement/pose micro-polish. Preserve Listen/text support, do not remove this deferral by accident.

Do not create a duplicate Issue for a bug already tracked by PR #107. Refer to the current issue/PR at the time of work; priorities can be changed with new evidence.

## 2. E03 Gate 3 exit: engineering and learning

**All are required for a claim of full E03 Gate 3; do not infer them from a single L-path browser run.**

- [ ] S/N/L route alternatives are physically coherent on the **selected playable artwork**; no invented bridge, invisible through-walk, cargo overlap or walking on rails. Appropriate cart / pedestrian / flower constraints have meaningful playable consequences. See #108.
- [ ] The tea cart traverses legal L pavement in both directions and turns safely with the actual perspective-adjusted footprint; forbidden stairs/arcade attempts visibly stop with a reason and nonpunitive retry. See #109.
- [ ] Book/tea/flower deliveries and visible current destination/item are understandable; shortest path vs *works for whom?* comparison requires child observation/revision rather than a pre-highlighted answer or fabricated failed attempt. Validate PR #107 after merge.
- [ ] Story and EFL line triggers stay coherent, short, speaker-correct and accessible, with captions/Listen fallback; no spoiler that station or garden witness is false, and no premature Common reveal.
- [ ] E02 completion/Market marker prerequisites are read-only and legitimate; E03 atomic save, interruption/reload, reset-only-E03, event-once, historical replay, Chronicle and branch/hint logic all pass fresh tests.
- [ ] Current-head engine and browser checks cover realistic legal/illegal route choices and device dimensions (including 568×320, 667×375, representative portrait and desktop), without breaking E01/E02 regression or asset/archive allowlists.
- [ ] Evidence links identify exact PR/main commit and separate automated PASS from **actual** owner/device PASS; outstanding tests remain explicitly OPEN.

## 3. E03 Gate 4 and safe release

- [ ] Maintainer confirms mandatory Actions release artifact works and the exact main SHA's MN4 workflow completes; verify hosted `/e03/` build and existing `/` and `/e02/` are preserved.
- [ ] Owner directly reviews a live phone-size/session: captions/objects/routes are clear, no routine horizontal overflow or inaccessible game controls, characters have believable depth and do not obstruct task targets.
- [ ] No regression in canonical prerequisites / Chronicle / replay / progress reset; if a real device issue prevents play or corrupts continuity, it is P0, not deferred polish.
- [ ] Record one **scoped** E03 Gate 3/Gate 4 PASS only after the appropriate evidence. Visual acceptance of M1 review by itself is not sufficient.

## 4. Separate the two E04 entry thresholds

**E04 Gate 1 (narrative and learning authoring) may begin immediately in a separate focused session.** Read only the accepted S01 Arc 1/E04 portion of `docs/SEASON_1_ARCHITECTURE.md`, E04 weave, E03 station/garden exit, and EPB standard. Create **draft** E04 Episode Production Brief; do not label it approved or generate all art. Preserve both resident accounts as sincere but from different time periods; E04 should reconcile evidence using a chronology, not a dishonest witness. No changes to E01/E02/E03 implementation in this authoring task.

**E04 playable integration / shared progression promotion requires full E03 Gate 3**, stable E03 output-event and save contracts, and a tested transition. If current delivery pipeline remains blocked, keep any integrated E04 release unpromoted. Prefer closing E03 Gate 4 before real-family/connected-MVP acceptance; episode draft writing need not be idle.

Cross-episode Arc 1 tests before connected-MVP PASS:
- [ ] E01→E02→E03→E04 fresh-play and returning-play sequences; invalid direct-entry does not fabricate completed chapters.
- [ ] Per-episode reset cannot erase earlier chapter ledgers; Chronicle reflects truthful original marker, Riverside evidence, Market wayfinding, and attributed conflicting accounts.
- [ ] E04's timeline resolves *why station and garden accounts differ* without rewriting recorded E03 dialogue or exposing the Common before later season gates.
- [ ] Replays are read-only, saved progress recovers after refresh and early-exit, and substantive child reasoning remains observable rather than just navigation clicks.
- [ ] Core mobile/device review and E01/E02/E03 regressions all remain accepted; no new episode art is included accidentally in earlier packages.

## 5. Controlled growth / next production phase

After E04 Arc 1 MVP, inspect common patterns in UI, line/caption runtime, actor layering, navigation, story transition, help, parent cues, Chronicle/ledger and packaging before E05–E11 engineering. Reuse underlying mechanics but vary narrative reasoning and in-scene tasks. Use a **content specification skeleton** for E05–E11 rather than producing every full script, image or asset ahead of validation.

At the end of **each** focused task update `docs/CURRENT_STATUS.md`, the specific issue/PR and any accepted canon/implementation contract. Keep existing `OPEN_DECISIONS.md` as decision history; do not clone or reread all its entries. Finish with verified **current `main` SHA**, locked scope, remaining open items, and **one next focused task**.
