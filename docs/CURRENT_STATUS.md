# Wondervale — Current Status

**Consolidated:** 2026-11-24 · **Authority:** latest GitHub `main`, not any SHA copied into a handoff.
**Purpose:** a short, actively maintained development status, **not** a per-commit diary. The complete prior 249,562-character status is preserved in [the lossless history archive](archive/CURRENT_STATUS_HISTORY_THROUGH_2026-11-06.md), including all earlier PRs, CI links and approval qualifications.

## Current production boundary

- **Locked:** ages 6–9, EFL-first; child drives Milo, Nia and Finn retain established roles; parent prompts without answering; nonpunitive retry; living-world growth; Common identity is not prematurely disclosed.
- **Production/accepted scope:** E01 Town Square and E02 Riverside playable and owner-accepted at their recorded prototype scope; E03 Market Lane has the limited L-route preview. E01/E02/C01 and E03 accepted story/art must remain untouched except by explicit scope.
- **Owner-gated:** E04 genuine attributed sources, safe actual geography/site access, historic relative chronology, final painterly art and real-device/family acceptance. [PR #114](https://github.com/edisontw/wondervale/pull/114) remains a draft, not approved Canon.
- **Do not conflate:** PAPER playability, Node PASS, Chromium PASS, GitHub Actions SUCCESS, official Canon, MN4 deployed/HTTPS/rollback, or Owner/family-device PASS. Release-package checks and actual deployment are separate.
- **Audio:** prerecorded voice, music and effects deferred; text/Listen accessibility remains in scope.

## Twelve-scene delivery ledger (11 episodes; E06 has two locations)

| Slot | Episode / space | Current evidence | Unmet production gate |
| --- | --- | --- | --- |
| 01 | E01 Town Square | Existing playable accepted prototype | Broader family/device/audio |
| 02 | E02 Riverside | Existing playable owner-accepted scope | Broader family/device/audio |
| 03 | E03 Market Lane | L-route gameplay; canonical delivery story | Actual cart turning/wheel clearance [#109](https://github.com/edisontw/wondervale/issues/109), S/N geometry and final Gate 3 |
| 04 | E04 memories/timeline | Noncanonical source/chronology lab | `blocked-design`: genuine Owner-approved E04 source packet / Canon |
| 05 | E05 Station/Map Room | Isolated replayable PAPER scene | No canonical E04 handoff or approved real station source/art |
| 06 | E06 Current Garden | Spatial rain tray; visible water result comes from a completed model run | No approved real garden chronology/terrain or canonical entry |
| 07 | E06 Lower Garden | Distinct water/path/pocket zones; chosen marker and checked conflicts shown in the scene | No real planting permission/growth, care authority or canonical entry |
| 08 | E07 connector | Isolated replayable PAPER shared-route test | No approved physical route/drainage/access |
| 09 | E08 Lantern Steps | Isolated replayable PAPER two-view/light model | No real lighting, source or site rights |
| 10 | E09 Closed Hill | Isolated replayable PAPER safe survey | Real hill CLOSED; no approved geometry/access |
| 11 | E10 unnamed courtyard | Isolated replayable PAPER needs/trace investigation | No confirmed real identity, needs or access |
| 12 | E11 shared-space/loop | Isolated replayable PAPER visitor trial | No actual Common opening/rights/canonical loop |

The inventory proves **3 existing episode experiences + 1 blocked E04 + 8 PAPER spaces**, not twelve production-ready scenes. Detailed scene and test mapping: [delivery plan](SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md), [story gap audit](SEASON_1_STORY_GAP_AUDIT_2026-11-03.md), [regression gate](SEASON1_TWELVE_SCENE_REGRESSION_GATE_2026-10-31.md).

## Recent verified delivery / next unique task

- **2026-11-24:** [PR #376](https://github.com/edisontw/wondervale/pull/376) added a child-operated spatial rain tray to E06 Current Garden. Completed reducer snapshots drive the visible water route and catchment; unrun settings do not appear as observed evidence. It merged from `c237ebbda7faa989c5b1a954219295fb451a0600` at `9cda31c3d9ee212359a4edaa654f56a035fa71d0`. See [engineering QA](../content/season-01/s01e06/SPATIAL_MODEL_ENGINEERING_QA_20261124.md).
- **2026-11-24:** [PR #377](https://github.com/edisontw/wondervale/pull/377) added Lower Garden runoff/path/pocket regions, child-positioned marker feedback, visible checked conflicts and an observed-vs-possible two-garden comparison. It merged at `a654037ec8f4e4c95c498661edcd70f62c79eb68`. All five merged-main workflows, six jobs and 72 steps passed: [E06 shell](https://github.com/edisontw/wondervale/actions/runs/45392718332), [twelve-scene regression](https://github.com/edisontw/wondervale/actions/runs/45392718272), [E01](https://github.com/edisontw/wondervale/actions/runs/45392718335), [E05→E06](https://github.com/edisontw/wondervale/actions/runs/45392718229) and [E04→E05→E06](https://github.com/edisontw/wondervale/actions/runs/45392718326). See [spatial-feedback QA](../content/season-01/s01e06/LOWER_GARDEN_SPATIAL_FEEDBACK_QA_20261124.md).
- **Next unique task:** conduct a supervised child/family usability review on real phone screens. Check whether the child understands water/path feedback, can place and move the marker, and distinguishes observed Current Garden state from the possible PAPER pocket. This is not yet family acceptance or real-site evidence.
- **Current `main`:** `a654037ec8f4e4c95c498661edcd70f62c79eb68`.

## Outstanding blockers and validation

1. **`blocked-design` Owner Gate, one consolidated batch:** E04 attributed historical cards/time relationship; actual site rights/safety and painterly composition. Do not repeatedly ask separate micro-approvals.
2. **E03 physical limitation:** issue #109 proves actual cart/wheel/corner clearance remains open despite model clearance checks.
3. **Release/device:** E05–E11 PAPER work is not MN4 deployment; HTTPS/rollback and broader family-device acceptance must be explicitly verified before promotion. The next E06 usability review requires actual child/family participants and phone screens; browser viewport checks do not substitute for it.

## Maintenance rules

Only record a **substantive milestone** here: accepted change, important CI gate, blocker transition, production approval or next focused task. No per-hour log, duplicate PR description, stale queued-CI status, speculative PASS or pasted GitHub transcript. Each development run re-fetches `main` and its exact-head PR/Actions. Preserve historical audit detail in PR/Actions and the [archive](archive/CURRENT_STATUS_HISTORY_THROUGH_2026-11-06.md), rather than growing this active file.

For focused reading use [PROJECT_INDEX](PROJECT_INDEX.md), [WORK_SEQUENCE](WORK_SEQUENCE.md), and the **relevant sections** of [OPEN_DECISIONS](OPEN_DECISIONS.md); do not load the full decision diary by default.
