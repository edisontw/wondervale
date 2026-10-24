# Wondervale — Current Status

**Snapshot:** 2026-10-24 (Asia/Taipei). **Verified pre-update `main`:** `783a2f3b43e98b61b8d8ce6485b33b37d3cff34c`. Always refetch `main`; this snapshot is not proof of an MN4 deployment.

This is the short operational entrypoint, not a second source of product canon. Approved Season 1 architecture/learning weave, episode briefs/scripts, and accepted decisions remain authoritative. Keep detailed history in Git commits, PRs, and issues.

## Product and accepted boundaries

- Ages **6–9**, EFL-first; parent-guided, child-driven; **simple English ≠ simple thinking**. Milo is player-controlled; Nia and Finn remain recurring companions.
- Season 1 has **11 episodes in three arcs**, with approved story and learning architecture. Do not reopen the season skeleton or batch-generate unapproved art.
- **E01 Town Square, E02 Riverside:** owner-accepted playable scopes are frozen.
- **E03 Market Lane:** playable experience received Owner PASS on 2026-10-22. Protect accepted story, images, routes, save and UI; independent technical follow-ups #108 (S/N geometry), #109 (cart clearance), #110 (release artifact) and PR #107 (delivery guidance) do not negate that PASS and are not automatically certified by it.
- **E04:** canonical E03→E04 unlock, synthetic-evidence chronology engine, responsive authoring UI, save/reload/replay isolation and keyboard/browser checks are implemented. PRs #113, #115, #119–#124 and **#126** are merged. PR #126 fixes keyboard focus after completing a draft: focus moves to the visible success status instead of the restart footer. **Engineering preview only**; synthetic cards are tests, not accepted historical evidence. No approved E04 production source cards, story/script, artwork, playable episode, public route or MN4 deployment.
- **E05–E11:** approved season backbone only; detailed episode production remains future work. Prerecorded narration/music/SFX remain deferred; keep text, captions and accessible interactions.

## CI, release and approvals (keep separate)

- On 2026-10-24, the repository became **public** and GitHub-hosted runners resumed actual Node.js and Chromium jobs. #125 (pre-run runner failure) is **closed**. Do not infer the exact prior billing/entitlement cause from the recovery alone.
- **PR #124:** both E04 jobs and E01 runtime actually passed on head `b05aa15b46b06b47ec17b47e98bd94890ce3a8fc` (Actions #40068692115, #40068692091); merged to main before this snapshot.
- **PR #126:** E04 Node and Chromium jobs PASS (Actions #40072666914); E01 runtime PASS (#40072666896); merged at `783a2f3b43e98b61b8d8ce6485b33b37d3cff34c`. Post-merge main runs #40072811773 and #40072811753 were still in progress when this snapshot was prepared; do not mark them PASS without checking.
- **#110 is OPEN:** mandatory `wondervale-mn4-e02-e03-package` artifact **upload and download**, release allowlist/hash/rollback and actual MN4 deployment still require direct evidence. E04 has not been deployed. CI PASS, an owner review-page PASS, and MN4 deployment PASS are distinct.
- **PR #114 remains OPEN and Owner-gated:** E04 Gate 1 source/story proposal is not accepted; do not merge or turn its historical claims into runtime data.
- E01/E02/E03 existing deployed builds must remain byte-safe; main source commits do not automatically deploy E04. Never change Secrets or bypass package integrity gates.

## Active work queue

1. **E04 engineering only:** next implement one reversible, testable keyboard/mobile or draft/Chronicle quality improvement using synthetic fixtures, without activating a production E04 route.
2. **E04 content approval:** await Owner review of PR #114 and genuine source-card provenance before building a canonical playable chapter.
3. **Release gate #110:** separately verify mandatory package upload/download and MN4 allowlist/hash/rollback on an authorized main deployment path. Do not treat optional screenshot upload as the release artifact.
4. **E03 technical backlog:** #108, #109, PR #107 remain distinct from accepted E03 gameplay; avoid unrequested changes to its story/art.

## Operating policy

Read `README.md`, `docs/WORK_SEQUENCE.md`, relevant `docs/OPEN_DECISIONS.md`, `docs/QUALITY_GATES_E03_E04.md`, and task-specific E04 engine/UI/tests. Refetch current `main` and CI before changes; make one scoped reversible improvement; run Node and real Chromium tests; merge only after verifying current head, checks and protected scope. Keep synthetic evidence test-only. Report source SHA, test results, release status, remaining gate and next single task.
