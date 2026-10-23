# Wondervale — Current Status

**Snapshot:** 2026-10-24 01:55 (Asia/Taipei). **Verified pre-update `main`:** `46c5e140c8d3379d6775761b87eff16d1366f23f`. Refetch `main` every session; this snapshot is not proof of a deployed build.

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
| E03 Market Lane | **Owner PASS reported 2026-10-22 for the playable E03 experience**; accepted scene, delivery story, Chronicle and current UI are protected from routine reopening | Separately tracked engineering/CI issues (#108 S/N geometry, #109 cart clearance, #110 release artifact) are **not** automatically certified by Owner PASS; verify before claiming those technical gates |
| E04 | E03→E04 canonical unlock and authoring-only chronology engine/UI are merged (PRs #113/#115); responsive Chromium, keyboard, reload/replay and isolation tests reached `main` through PRs #119–#123. **Engineering preview only**, using synthetic test evidence. | Owner-gated E04 Gate 1 content PR #114, final sources/story/art, episode runtime, production route, MN4 release/acceptance. Corrupt-draft warning PR #124 is OPEN pending real CI. |
| E05–E11 | Season story / learning backbone approved | Detailed episode production, art/audio/runtime/QA remain future work |
| CI/deploy | Last confirmed E04 `main` QA PASS: [run #39957776723](https://github.com/edisontw/wondervale/actions/runs/39957776723), commit `46c5e140c8d3379d6775761b87eff16d1366f23f`. E04 PR #124's Node and Chromium jobs fail **before runner assignment**, with zero executed steps; [#125](https://github.com/edisontw/wondervale/issues/125) tracks the separate runner/entitlement diagnosis. | [#110](https://github.com/edisontw/wondervale/issues/110) remains OPEN for mandatory release artifact upload/download and MN4 integrity/deploy validation. E04 has **not** been deployed. Do not equate source/CI/Owner PASS with MN4 PASS. |

**Important:** a CI PASS, a review-page owner PASS, a deployed preview, and a full episode owner/device PASS are different states. Never collapse them into one status.

## Active queue: priority and links

1. **P0 CI execution:** [#125 — GitHub-hosted jobs fail before runner assignment](https://github.com/edisontw/wondervale/issues/125). Latest PR #124 E04 run [#39983519395](https://github.com/edisontw/wondervale/actions/runs/39983519395) failed both jobs before any steps; E01 runtime failed the same way. Runner ID is zero and logs are unavailable. The check annotations cannot be read through the current GitHub connector. **Billing/spending entitlement is a hypothesis, not a confirmed diagnosis.** Read the exact annotations via authenticated GitHub UI or supported API before rerunning. Do not change billing, Secrets, runners or gates automatically.
2. **P0 release package:** [#110 — mandatory artifact availability](https://github.com/edisontw/wondervale/issues/110). The bounded housekeeping from PR #112 removed old optional evidence artifacts, but upload/download and MN4 release validation have **not** been reverified. Keep #110 OPEN until actual package, allowlist/hash/rollback and deployment evidence exist.
3. **P1 E04 preview PR:** [#124 — corrupt-draft recovery notice](https://github.com/edisontw/wondervale/pull/124), head `c506adeda3f7373c686fd8b1fd9f4abc9665d5e4` at this snapshot. Keep OPEN until actual Node.js and Chromium tests run successfully on the **latest** head; prior isolated V8 tests do not substitute for CI.
4. **Owner Gate 1:** [PR #114 — E04 source/story draft](https://github.com/edisontw/wondervale/pull/114). Do **not** merge without Owner approval. Synthetic E04 evidence packs remain test-only.
5. **Preserved E03 technical follow-ups:** [#108 — S/N geometry](https://github.com/edisontw/wondervale/issues/108), [#109 — cart swept clearance](https://github.com/edisontw/wondervale/issues/109), and [PR #107 — delivery labels](https://github.com/edisontw/wondervale/pull/107). These do not revoke the 2026-10-22 E03 Owner PASS; check their live state before claiming a technical gate passed.

**Next focused implementation:** unblock actual E04 Node.js + Chromium verification by reading #125's precise pre-run error. If the external runner/account blocker persists, continue only reversible, separately tested E04 engineering work; do not merge unverified PR #124 or deploy E04. Avoid repeated blind CI retries.

## Acceptance / context policy

- [E03→E04 entry and bug/quality gates](QUALITY_GATES_E03_E04.md) contains the actual testable criteria.
- [Work Sequence](WORK_SEQUENCE.md) and [Episode Production Fast Lane](EPISODE_PRODUCTION_FAST_LANE.md) remain the production authorities. E01/E02/C01 and Season canon are frozen unless a demonstrable high-severity issue justifies reopening.
- **Read only** this file, `README.md`, `WORK_SEQUENCE.md`, relevant `OPEN_DECISIONS.md` passages, current issue/PR, and task-specific episode/source/test contracts. Do not load old entire chat, all episodes or rejected-art reports.
- On each task: fetch/verify **current `main` SHA** → choose **one** issue/gate → implement/test on a scoped branch → PR/review/merge when safe → report new `main` SHA, evidence, locks, remaining open items, next task.
- Update **current** statuses here and keep history in Git commits/closed issues; do not append a new full dated handoff every iteration.
