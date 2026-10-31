# Season 1 twelve-scene regression gate — 2026-10-31

**Scope:** verifiable engineering coverage, **not** twelve accepted production scenes, a deployed build, Owner approval or a Season 1 completion claim. Baseline at implementation: GitHub main \`c3dbb92ceddeb67beac988330f31c42e1ec2d1d7\`; re-read current main before any merge.

## Why this gate exists

Previously the canonical E01–E03, E04 source gate, isolated E05–E11 browser tests and E03→E11 PAPER story chain passed independently. Those green checks cannot be added up as an end-to-end **production** acceptance. This regression runs the relevant tests together, records all twelve intended scene slots, and preserves the missing production boundaries.

The two jobs in \`.github/workflows/wondervale-season1-twelve-scene-regression.yml\` run:

1. **Canonical boundary:** verify locked media, compile and package E01/E02/E03 without changing source, run E01/E02/E03 Node and the genuine E02/E03→E04/E05 guard, produce \`test-results/season1-twelve-scene-evidence.json\`, then exercise E02 and the **packaged** E03 in actual Chromium. E01 full browser acceptance remains the separate mandatory \`wondervale-runtime.yml\` PR/main check, not a fabricated result from this job.
2. **PAPER continuity:** run strict E04–E11 reducer/replay/forgery tests and cross-scene state tests; run the independent E05, E06 Current+Lower, E07, E08, E09, E10, E11 Chromium child journeys, plus the integrated E03→E11 PAPER browser journey. Check that authoring-only code is absent from production package allowlists.

The workflow has bounded HTTP server readiness checks and server cleanup. Both jobs must be inspected at the exact PR-head and merged-main SHA. A green job only establishes its **named** test scope; MN4 remote deployment, HTTPS, rollback and real-device/family tests remain separate.

## Twelve release-scene slots and actual authority

| Scene | Location | Available evidence | Production status |
| --- | --- | --- | --- |
| 01 | E01 Town Square | Canonical E01 runtime; separate browser CI | Existing accepted scope; device Gate remains |
| 02 | E02 Riverside | Canonical Node and browser progression | Existing accepted scope; device Gate remains |
| 03 | E03 Market Lane | Canonical Node and packaged browser progression; E04 read-only handoff | Existing limited L-route; cart physical Gate open |
| 04 | E04 two memories/timeline | Draft chronology and source-boundary tests | **blocked-design**: PR #114 Owner evidence/chronology decision |
| 05 | E05 Station / Map Room | Standalone child PAPER scene, mock provenance, reversible table | No canonical E04→E05 entry |
| 06 | E06 Current Garden | Child observation and rain/channel model | No canonical E05→E06 entry |
| 07 | E06 Lower Garden | Distinct gated lower model, wet marker/revision | No approved planting/stewardship |
| 08 | E07 Finn connector | Other user/water conflict and revised model | No real connector rights or unlock |
| 09 | E08 Lantern Steps | Two model lights and two viewpoints | No approved real lighting or dated source |
| 10 | E09 Closed Hill | Safe paper route, blocked upper edge, gap revision | North Hill remains CLOSED |
| 11 | E10 unnamed courtyard | Synthetic traces and simulated needs | Identity/source UNKNOWN; no Common reveal |
| 12 | E11 shared space / loop | Revised two-user layout and fictional loop | No Common opening, production Chronicle or season ending |

**Numerator discipline:** 12 planned scene slots = 3 existing canonical episode experiences + 1 blocked E04 slot + 8 distinct PAPER spaces (E06 twice). This is **not** 12/12 production PASS. Browser regressions can pass while the production numerator remains three existing episode experiences, subject to their own remaining acceptance gates.

## Required promotion path, not a boolean shortcut

- E04: Owner approves genuine attribution, rights, evidence cards and qualified chronology in one batch; implement replay-validated canonical E04 event/Chronicle/checkpoint and real E04 browser journey.
- E05–E11: implement **one real upstream unlock/Chronicle/world-state handoff at a time**, preserving the existing paper reducers as reference only. Prove reload, restart, upstream reset invalidation, wrong-first recovery and mobile/keyboard interaction for each production entry.
- E09–E11: verify safe actual geography, permissions, credible present-day needs and identity evidence before opening or naming any real Common; do not reopen North Hill.
- After source/art/device gates: run real full-season browser traversal, verify release allowlists/integrity, MN4 HTTPS deployment and rollback separately, then family acceptance. Only then mark Season 1 complete.

**Next independent implementation task:** an Owner-gated canonical E04 checkpoint contract and fail-closed E05 transition tests, without treating synthetic cards or E04 draft completion as approval. If the source gate is still blocked, work on a production-independent world-growth/Chronicle visual contract rather than repeated E04 preview polish.
