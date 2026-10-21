# Wondervale — Current Status

**Snapshot:** 2026-10-22 (Asia/Taipei). **Verified source baseline:** GitHub `main` at `5c2df1b06340fb8d217032f1940778a92b7efaba` before this document-only update. **Never treat this SHA as permanently current:** refetch `main` each session.

This is the **short operational entrypoint**, not a second source of product canon. Canon is in the approved Season 1 architecture / learning weave, episode briefs, scripts, and applicable accepted decisions; live work status is in issues/PRs. Keep this file short and replace stale status instead of appending historical logs.

## Product and season

- Ages **6–9**; **EFL-first**, parent-guided/child-driven; **simple English ≠ simple thinking**.
- Milo is player-controlled; Nia and Finn are recurring companions. C01 identity and accepted artwork remain authoritative.
- Season 1 story architecture and learning weave cover **11 episodes in three Arcs**, already approved. Do **not** restart season-structure ideation or batch-generate all remaining art.
- Storybook shell + living interactive scenes; persistent world / Chronicle and episode-safe progress ledgers; static-first deployments.
- Prerecorded narration, music, and SFX are intentionally deferred; retain text/caption/Listen paths and accessibility.

## Episode / system status

| Scope | Verified at baseline / accepted boundary | What is not yet accepted |
| --- | --- | --- |
| E01 Town Square | Playable; scoped owner PASS; frozen | Broader family UX and final audio/animation; do not reopen for routine polish |
| E02 Riverside | Playable; scoped owner PASS; frozen | Broader family UX; no speculative change to E02 save or narrative |
| E03 Market Lane | One playable L-path engineering preview; accepted painterly scene / approved M1 depth-review reference; core delivery/Chronicle/ledger partly exercised | Full S/N walking connections, wheel/turn/paving clearance, complete three-route choice, full Gate 3 and actual owner phone/device Gate 4 |
| E04 | Arc 1 closing story role approved in Season architecture | Episode-specific Brief, dialogue, interaction, assets, runtime and acceptance not yet completed |
| E05–E11 | Season story / learning backbone approved | Detailed episode production, art/audio/runtime/QA remain future work |
| CI/deploy | Existing MN4 static release workflow with strict allowlists | Artifact-quota issue blocks dependable new deploy-package creation; latest PR #107 is **not** merged/deployed |

**Important:** a CI PASS, a review-page owner PASS, a deployed preview, and a full episode owner/device PASS are different states. Never collapse them into one status.

## Active queue: priority and links

1. **P0 release blocker:** [#110 — mandatory Actions artifact availability](https://github.com/edisontw/wondervale/issues/110). Do not lower mandatory package-upload/deploy safety requirements.
2. **P1 task clarity, code prepared but not live:** [PR #107 — delivery item and destination labels](https://github.com/edisontw/wondervale/pull/107). Tests previously passed on PR head, but evidence uploads and main deployment are affected by artifact quota. Do not claim live acceptance.
3. **P0 playable geometry:** [#108 — S/N walking routes](https://github.com/edisontw/wondervale/issues/108), preserve three-route narrative; do not invent occluded connections.
4. **P0 cart safety / visual consistency:** [#109 — actual cart swept clearance](https://github.com/edisontw/wondervale/issues/109). Prior 2D display-envelope clearance is a diagnostic, not physical/cart-turn PASS.
5. **P1 verification:** real phone portrait/short-landscape, keyboard, readable UI, scene foreground/actor/cargo, progression/reload/replay, and scoped owner playable PASS. A feature becomes P0 if it blocks completion, corrupts state, reveals an unsafe route, or breaks release.

**Next focused implementation:** unblock mandatory artifact packaging (#110), then finish/ship/owner-check PR #107; address #108 and #109 before claiming full E03 Gate 3. Narrative **E04 Gate 1 can proceed in a separate scoped workstream**, but E04 playable integration must respect the gate below.

## Acceptance / context policy

- [E03→E04 entry and bug/quality gates](QUALITY_GATES_E03_E04.md) contains the actual testable criteria.
- [Work Sequence](WORK_SEQUENCE.md) and [Episode Production Fast Lane](EPISODE_PRODUCTION_FAST_LANE.md) remain the production authorities. E01/E02/C01 and Season canon are frozen unless a demonstrable high-severity issue justifies reopening.
- **Read only** this file, `README.md`, `WORK_SEQUENCE.md`, relevant `OPEN_DECISIONS.md` passages, current issue/PR, and task-specific episode/source/test contracts. Do not load old entire chat, all episodes or rejected-art reports.
- On each task: fetch/verify **current `main` SHA** → choose **one** issue/gate → implement/test on a scoped branch → PR/review/merge when safe → report new `main` SHA, evidence, locks, remaining open items, next task.
- Update **current** statuses here and keep history in Git commits/closed issues; do not append a new full dated handoff every iteration.
