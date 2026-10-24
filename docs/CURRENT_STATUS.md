# Wondervale — Current Status

**Snapshot:** 2026-10-24 (Asia/Taipei). **Verified pre-update `main`:** `77b56050606b2ac12a9296cdf8c7b4c45c4234bf` (PR #127 merge). Always refetch `main`; this snapshot is not proof of an MN4 deployment.

This is the short operational entrypoint, not a second source of product canon. Approved Season 1 architecture/learning weave, episode briefs/scripts, and accepted decisions remain authoritative. Keep detailed history in Git commits, PRs, and issues.

## Product and accepted boundaries

- Ages **6–9**, EFL-first; parent-guided, child-driven; **simple English ≠ simple thinking**. Milo is player-controlled; Nia and Finn remain recurring companions.
- Season 1 has **11 episodes in three arcs**, with approved story and learning architecture. Do not reopen the season skeleton or batch-generate unapproved art.
- **E01 Town Square, E02 Riverside:** owner-accepted playable scopes are frozen.
- **E03 Market Lane:** playable experience received Owner PASS on 2026-10-22. Protect accepted story, images, routes, save and UI; independent technical follow-ups #108 (S/N geometry), #109 (cart clearance), #110 (release artifact) and PR #107 (delivery guidance) do not negate that PASS and are not automatically certified by it.
- **E04:** canonical E03→E04 unlock, synthetic-evidence chronology engine, responsive authoring UI, save/reload/replay isolation and keyboard/browser checks are implemented. PRs #113, #115, #119–#124, **#126 and #127** are merged. PR #126 fixes keyboard focus after completing a draft. PR #127 adds a visible **Continue draft** shortcut only after strict valid local restore; it focuses the next unfinished action (or neutral card heading) without altering history, revealing a timeline answer, or touching earlier chapters. Fresh/corrupt/replay sessions do not show it. **Engineering preview only**; synthetic cards are tests, not accepted historical evidence. No approved E04 production source cards, story/script, artwork, playable episode, public route or MN4 deployment.
- **E04 neutral timeline review (2026-10-24 engineering slice):** when every synthetic source card has a time position but relative order remains unsupported, a non-answer-revealing review cue appears. A restored draft's **Continue draft** focuses the cue after other missing inspections are resolved; **Review source positions** focuses the neutral source heading, not a suggested slot. Neither navigation action changes history or storage; the cue clears only after a supported revision. This is authoring-preview UI, not historical evidence or an E04 release. See the focused PR and its Node/Chromium evidence before claiming CI PASS.
- **E04 per-source review navigation (2026-10-24 engineering slice):** for a fully placed but unsupported synthetic timeline, the review area lists only the child's **own** current choices and provides per-source neutral focus/scroll jumps and a return-to-overview shortcut. This is not a suggested correct order. Navigation never dispatches an event or writes storage; changing a placement still follows normal save/replay rules. Responsive Node/Chromium regression includes a bounded eight-card synthetic fixture. Verify exact-head CI before claiming PASS. No canonical evidence, story, images or E04 release added.
- **E05–E11:** approved season backbone only; detailed episode production remains future work. Prerecorded narration/music/SFX remain deferred; keep text, captions and accessible interactions.

## CI, release and approvals (keep separate)

- On 2026-10-24, the repository became **public** and GitHub-hosted runners resumed actual Node.js and Chromium jobs. #125 (pre-run runner failure) is **closed**. Do not infer the exact prior billing/entitlement cause from the recovery alone.
- **PR #124:** both E04 jobs and E01 runtime actually passed on head `b05aa15b46b06b47ec17b47e98bd94890ce3a8fc` (Actions #40068692115, #40068692091); merged to main before this snapshot.
- **PR #126:** E04 Node and Chromium jobs PASS (Actions #40072666914); E01 runtime PASS (#40072666896); merged at `783a2f3b43e98b61b8d8ce6485b33b37d3cff34c`. Post-merge main runs #40072811773 and #40072811753 were still in progress when this snapshot was prepared; do not mark them PASS without checking.
- **PR #127:** E04 Node and real Chromium jobs PASS on head `3f8029f262f610e002f0260681d8cf6311d3e23f` (Actions #40076793067); E01 runtime including both artifact uploads PASS (#40076793117). Merged as `77b56050606b2ac12a9296cdf8c7b4c45c4234bf`. Post-merge `main` CI must be checked separately; not implied by PR CI.
- **#110 is OPEN:** mandatory `wondervale-mn4-e02-e03-package` artifact **upload and download**, release allowlist/hash/rollback and actual MN4 deployment still require direct evidence. E04 has not been deployed. CI PASS, an owner review-page PASS, and MN4 deployment PASS are distinct.
- **PR #114 remains OPEN and Owner-gated:** E04 Gate 1 source/story proposal is not accepted; do not merge or turn its historical claims into runtime data.
- E01/E02/E03 existing deployed builds must remain byte-safe; main source commits do not automatically deploy E04. Never change Secrets or bypass package integrity gates.

## Active work queue

1. **E04 engineering only:** next verify interruption/reload and keyboard focus continuity after multiple source-position revisions (including a failed save) on a short landscape viewport; keep navigation neutral and E02/E03 saves untouched.
2. **E04 content approval:** await Owner review of PR #114 and genuine source-card provenance before building a canonical playable chapter.
3. **Release gate #110:** separately verify mandatory package upload/download and MN4 allowlist/hash/rollback on an authorized main deployment path. Do not treat optional screenshot upload as the release artifact.
4. **E03 technical backlog:** #108, #109, PR #107 remain distinct from accepted E03 gameplay; avoid unrequested changes to its story/art.

## Operating policy

Read `README.md`, `docs/WORK_SEQUENCE.md`, relevant `docs/OPEN_DECISIONS.md`, `docs/QUALITY_GATES_E03_E04.md`, and task-specific E04 engine/UI/tests. Refetch current `main` and CI before changes; make one scoped reversible improvement; run Node and real Chromium tests; merge only after verifying current head, checks and protected scope. Keep synthetic evidence test-only. Report source SHA, test results, release status, remaining gate and next single task.
