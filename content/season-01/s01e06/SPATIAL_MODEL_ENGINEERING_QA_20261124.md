# E06 Current Garden Spatial Water Model — Engineering QA

**Status:** PR #376 is merged to `main` as `9cda31c3d9ee212359a4edaa654f56a035fa71d0`. Its branch head was `d7d001d1ad88e22b020dfda348c1b5831326262d`, based on starting `main` `c237ebbda7faa989c5b1a954219295fb451a0600`. All PR-head and merged-main Actions checks passed. This record does not approve Gate 1, production content, real geography, or planting.

## Runtime change

- The Current Garden now shows a synthetic high rain source, downhill route, directly clickable drain channel, bypass path, and low catchment.
- The spatial channel button and the existing OPEN/BLOCKED action list use the same reducer action and `can`/`dispatch` rules. Keyboard activation works without dragging.
- Water paths and catchment amounts derive only from reducer-produced completed run snapshots. DRY has no flow and 0/3 catchment; RAIN/OPEN has 2/2 bypass and 1/3 low catchment; RAIN/BLOCKED has 0/2 bypass and 3/3 low catchment.
- Changing the next-run setup leaves the last result, run history and comparison unchanged until Run. Once both rain/channel snapshots exist, BEFORE/AFTER is built from those snapshots in their recorded order with weather held constant.
- No progress flag, fake run, timed completion or canonical persistence was added.

## Local verification

- E06 focused Node suites: **34 tests passed**, covering exact run-to-view projection, unrun setup, both comparison orders, reset/revisit, strict replay, malformed action/snapshot rejection, and E05/E06/E07 PAPER isolation.
- E06 Current/Lower Chromium journey: **PASS** at 1366×900, 568×320, and 390×844; spatial and keyboard channel input, run comparison, Lower Garden entry, revisit, restart, no horizontal overflow, and storage sentinels all verified.
- E05↔E06 Chromium transfer: **PASS** at three viewports; E06↔E07 journey passed inside the E06 browser suite. The exact E04–E06 transfer workflow also passed its 30 Node cases and three-viewport Chromium journey.
- Season 1 PAPER-continuity Node workflow command: **266 tests passed**. Season 1 canonical-boundary Node command: **71 tests passed**.
- Season 1 PAPER browser matrix (the workflow's E05–E11 scene, transfer, and integrated journeys): **all commands passed**.
- E01 runtime core: **27 tests passed**; E01 production-package Chromium acceptance: **85 records passed**, zero failed records and zero browser/HTTP errors.
- Production-media verification: **7 E01 integrity files and 17 episode media files passed**. E01/E02/E03 packages built with 13/9/10 allowlisted runtime files respectively; production allowlist scans found no E06 scene references.
- Build scripts generated the compiled E01 manifest during verification; that generated file was restored before preparing this change. No E01/E02/E03 source or approved art is part of this PR.

## Browser evidence

- [Desktop Current Garden with completed comparison](../../../docs/evidence/e06-spatial-model/desktop-current-garden.png) — 1366×900 Chromium; shows the completed rain snapshots together.
- [Short landscape model view](../../../docs/evidence/e06-spatial-model/landscape-model-viewport.png) — 568×320 Chromium.
- [Portrait model view](../../../docs/evidence/e06-spatial-model/portrait-model-viewport.png) — 390×844 Chromium.

These are engineering screenshots of synthetic diagrams, not scene art or owner acceptance.

## GitHub CI verification (2026-11-24)

The PR head ran six successful workflows and seven successful jobs (88 successful steps): [E06 scene shell #45386571534](https://github.com/edisontw/wondervale/actions/runs/45386571534), [E05–E06 transfer #45386571580](https://github.com/edisontw/wondervale/actions/runs/45386571580), [E04–E05–E06 transfer #45386571540](https://github.com/edisontw/wondervale/actions/runs/45386571540), [E02 playable slice #45386571562](https://github.com/edisontw/wondervale/actions/runs/45386571562), [E01 runtime #45386571548](https://github.com/edisontw/wondervale/actions/runs/45386571548), and [twelve-scene regression #45386571623](https://github.com/edisontw/wondervale/actions/runs/45386571623). The latter has two jobs: `paper-continuity` and `canonical-boundary`.

After the squash merge, five workflows ran on merged `main` `9cda31c3d9ee212359a4edaa654f56a035fa71d0`; all six jobs and 72 steps passed: [E06 shell #45387585037](https://github.com/edisontw/wondervale/actions/runs/45387585037), [E05–E06 transfer #45387585095](https://github.com/edisontw/wondervale/actions/runs/45387585095), [E04–E05–E06 transfer #45387585055](https://github.com/edisontw/wondervale/actions/runs/45387585055), [E01 runtime #45387585066](https://github.com/edisontw/wondervale/actions/runs/45387585066), and [twelve-scene regression #45387585179](https://github.com/edisontw/wondervale/actions/runs/45387585179). That regression's `paper-continuity` and `canonical-boundary` jobs both passed.

## Owner and production gates remain open

- PAPER has no canonical event, save, Chronicle claim, rights grant, E06/E07 production unlock, or MN4 deployment.
- E04 chronology/source approval remains at Draft PR #114. E05 public entry, real E06 terrain, planting access, stewardship and scene art remain unapproved. North Hill remains CLOSED; Common remains UNKNOWN.
- Chromium viewport checks do not replace physical-device, owner or family observation.

## Next focused engineering task

The Lower Garden spatial-feedback follow-on is recorded separately in [Lower Garden engineering QA](LOWER_GARDEN_SPATIAL_FEEDBACK_QA_20261124.md). After that independent delivery integrates, the next bounded task is a supervised child/family usability review of both PAPER spaces on real phone screens; record comprehension and navigation feedback without promoting synthetic geography, rights or growth.
