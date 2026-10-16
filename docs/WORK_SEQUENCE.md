# Wondervale Work Sequence

Wondervale is intentionally developed **one design layer at a time**.

The goal is to prevent story, pedagogy, art, audio, prompts, and engineering from being decided simultaneously and then repeatedly invalidating one another.

**Execution shortcut (2026-10-12):** use the [Episode Production Fast Lane](EPISODE_PRODUCTION_FAST_LANE.md) and its [portable ChatGPT Skill](../skills/wondervale-episode-fast-lane/SKILL.md) for future episodes. It distinguishes story/learning, art selection + one media upload, playable browser acceptance, and deployment. It avoids repeated image generation and repetitive unscoped QA while preserving the gates below.

**Current focused transition (2026-10-16, E03 M0 media intake VERIFIED):** All three exact upload paths are present on GitHub main `f70ee1c69a413e43e6a1306702f31523a0c4672c`; both image blobs/bytes/SHA-256/dimensions, PNG CRC, WebP RIFF and Pillow full decoding pass. See [M0 intake evidence](../content/season-01/s01e03/ART_SELECTION_AND_INTAKE_M0_2026-10-16.md). Corrected source PNG alpha metadata; original PNG and runtime WebP bytes unchanged. **Next: Gate 3 playable E03** with a painting-aligned legal walk/cart graph, explicit episode art allowlist, C01 actors, flower focus/caption QA, evidence/recovery, save/Chronicle/replay and current-head browser tests. Runtime/device/deployment remain OPEN; no further image generation or SVG polish. E01/E02 frozen; recorded audio deferred; captions/Listen retained.

## Source of truth

GitHub `main` is the project source of truth.

Before a focused work session:

1. fetch current `main`;
2. read the relevant foundation documents;
3. work on one defined layer;
4. record decisions in the repository;
5. leave unresolved questions explicitly open rather than inventing answers inside implementation.

## Stage 1 — Core trio lock

**Status: complete / locked for Season 1 architecture**

Define:

- player-controlled protagonist;
- two recurring companions;
- personality contrast;
- relationships;
- strengths and limitations;
- Season 1 growth direction;
- visual identity constraints.

Exit condition:

The trio is distinct enough that the same story problem would plausibly produce three different reactions.

Do not begin full character art production until the Character Bible is internally coherent.

## Stage 2 — Season 1 story architecture

**Status: complete / approved**

Canonical architecture: [SEASON_1_ARCHITECTURE.md](SEASON_1_ARCHITECTURE.md)

Create:

- Season 1 premise;
- central mystery/problem;
- beginning state of Wondervale;
- ending state of Wondervale;
- 2–3 Story Arcs;
- approximately 10–12 Core Episodes;
- visible world changes;
- character growth beats;
- unresolved/payoff structure;
- learning opportunities that arise naturally from the story.

This stage should first produce **story architecture**, not full scripts.

Exit condition:

Every Episode has a dramatic/story reason to exist even if all learning labels are hidden.

## Stage 3 — Season 1 learning weave

**Status: complete / approved**

Canonical learning architecture: [SEASON_1_LEARNING_WEAVE.md](SEASON_1_LEARNING_WEAVE.md)

After the story skeleton is stable, map learning into it.

For each episode identify:

- primary learning goals;
- secondary learning;
- revisit/transfer opportunities;
- EFL language functions;
- likely misconceptions;
- evidence of thinking;
- parent-child discussion opportunity.

Do not force all subject areas into every episode.

Exit condition:

Learning reinforces the story rather than interrupting it, and important concepts have future revisit points.

## Stage 4 — Episode production specification

**Status: complete / approved**

Canonical specification: [EPISODE_PRODUCTION_BRIEF.md](EPISODE_PRODUCTION_BRIEF.md)

Create a standard **Episode Production Brief**.

Each episode brief becomes the single human-readable source for downstream production.

It should contain:

- story purpose;
- synopsis;
- scene list;
- dialogue intent;
- interactive beats;
- continuity requirements/effects;
- learning map;
- EFL language targets;
- parent cues;
- scaffolding;
- art asset list;
- animation needs;
- audio/music needs;
- voice/narration requirements and export contract;
- Chronicle update;
- test cases.

Exit condition:

A separate person/model could generate the episode assets and implementation without inventing missing story rules.

## Stage 5 — E01 full vertical slice

**Status: playable prototype accepted by owner and paused (2026-10-10); final family/mobile breadth, recorded voices/music and animation remain open.** See [E01 reusable lessons](E01_LESSONS_LEARNED_2026-10-10.md). Do not reopen E01 during E02 brief work.

E01 Production Brief: [S01E01 EPB](../content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md) — **approved_for_script**

**S01E01 detailed script:** [approved v1](../content/season-01/s01e01/DETAILED_SCRIPT.md).

**S01E01 interaction specification:** [approved v1](../content/season-01/s01e01/INTERACTION_SPEC.md); [test matrix](../content/season-01/s01e01/INTERACTION_TEST_MATRIX.md) now has actual prototype evidence. [Dated QA](E01_RUNTIME_QA_2026-10-08.md): 22 engine groups, 46 real Chromium result records and eight static/content checks passed within the stated prototype scope; family UX-11/UX-12 remain pending.

**Prompt/media:** [approved prompt pack](../prompts/season-01/e01/00-README.md), 121 exact voice-text records unchanged. Original source PNGs and two ChatGPT generated transparent actor candidates are committed; runtime WebP derivatives are verified. Neutral still poses and labelled synthetic read-aloud do not complete final animation/audio production.

**Visual references:** C01 is identity authority. Exact owner-approved turnaround recovered and hash-matched. Owner passed V1 Square, glyph and blank board/plate revisions; [approval record](VISUAL_REFERENCE_APPROVAL_2026-10-08.md). C02 remains layout-only; C03 remains rejected as appearance.

**Full-resolution transfer:** original-byte access, bounded byte-to-connector transport, exact Git blob/SHA-256/dimensions/PNG CRC and CI checkout validation succeeded. See [intake checkpoint](WORK_CHECKPOINT_2026-10-08.md) and production integrity report; no regeneration needed for usable imported Square art.

**Playable assembly:** SC00–SC06, parent/child views, deliberate map/place comparison, gated editable marker, atomic save/ledger, historical replay, derived world state, Chronicle and offline-after-install are implemented. Runtime-only release verified. MN4 HTTPS preview deployment is reported and documented ([current deployment record](MN4_E01_PREVIEW.md)); the first live-play field QA reset fix reached build `20261008-e01-reset1` (GitHub `main` `22f611493187d8a5117a3b40b70ea1fb3aecf83c`). Physical-device and family acceptance still remain open. Final voices/music/SFX, richer poses, source rights provenance and real-device/family acceptance remain open.

Only E01 is taken through the whole production pipeline first.

Order:

1. E01 Production Brief;
2. detailed script;
3. interaction specification;
4. prompt pack;
5. character/background/prop asset generation;
6. music/audio;
7. voice script generation and manual voice production;
8. application implementation;
9. desktop parent-child presentation;
10. mobile child/parent views;
11. accessibility checks;
12. parent-child test;
13. revise foundation rules if the vertical slice exposes a real structural problem.

Do **not** batch-produce the rest of Season 1 art/audio before E01 is validated.

## Stage 6 — Connected MVP

**E02 status (2026-10-10): Riverside E02-0 owner PASS; E02 Production Brief rev 2 `approved_for_script`.** See [E02 kickoff](E02_KICKOFF_2026-10-10.md), [approved brief](../content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md) and [Riverside E02-0 design](../content/season-01/s01e02/RIVERSIDE_E02_0_DESIGN.md). E02-2 script dialogue v1 and interaction spec rev 1 have passed source QA and are authoring-locked; 30 runtime test cases remain NOT RUN. E02-3 now has a written visual reference contract, but no rendered reference asset is yet approved. The E02-3 candidate now has an explicit 1600×900 environment SVG, technical overlay and near-bank JSON graph that passed source geometry checks. The rendered/camera/actor/owner reference gate remains OPEN; no approved painted E02 game art yet. The SVG geography was rasterized as a local staging copy; the hidden near-footing defect was corrected in R0 v2, and 320/360/390/430 static camera proof parameters were recorded. E02-3 now has **two geometry-identical R1/R2 candidate inspect SVGs**, a state-aware visual manifest and static 320/390 phone proof. Their vector/source consistency passed, but the painterly reference still failed near/far bank footing geography. E02-3 now has R0/R1/R2 same-geometry art-study v3 SVGs and an offline scene/mobile QA viewer. Source checks pass, but painterly scene quality, exact browser/device visual QA, C01 identity compositing and owner PASS are still open. Next: constrain the high-quality background to the same original near/far shore geometry, verify real browser+actor renders and obtain owner art review; E01 remains paused. E01 remains paused.

Produce E02–E04 using the validated E01 workflow.

Audit:

- repeated interaction patterns;
- repeated parent cues;
- EFL load;
- character consistency;
- world continuity;
- asset-production cost;
- actual session duration.

## Stage 7 — Season 1 production

Only after the connected MVP proves the workflow should the remaining Season 1 episodes enter parallelized production.

At this point work can be split safely into focused streams:

- narrative/script;
- learning/EFL;
- visual assets;
- audio/music/voice;
- engineering;
- QA/continuity.

## Focused conversation/workstream rule

Complex tasks should use separate focused conversations when useful.

Recommended workstreams:

### A. Narrative Room
Season/arc/episode story design, dialogue, character growth, continuity.

### B. Learning Room
Learning graph, EFL language load, scaffolding, parent prompts, transfer/revisit.

### C. Visual Room
Character sheets, locations, props, UI art, image-generation prompts.

### D. Audio Room
Music direction, SFX, voice scripts, pronunciation, audio-generation prompts.

### E. Engineering Room
Runtime, schemas, content compiler, UI, save state, deployment.

### F. Episode Assembly Room
One specific episode from approved brief to final integrated build.

Each focused session should write its durable decisions/artifacts back to GitHub rather than relying on chat memory.

## Handoff format

A focused work session should hand off:

- repository and verified `main` SHA;
- exact scope;
- approved input documents;
- files changed;
- decisions locked;
- decisions still open;
- next action;
- explicit items that must not be changed.

This allows new conversations to continue without reconstructing the entire project history.

## Parallelization rule

Parallel work is safe only when the upstream specification it depends on is stable.

Examples:

- character concept art can run after the Character Bible is locked;
- Season learning weave can run after the Season story skeleton exists;
- E01 background art and voice production can run after the E01 Production Brief/script is stable;
- engineering shell work can proceed independently where it does not invent content decisions.

Avoid parallelizing two tasks that both need to decide the same underlying fact.

## 2026-10-08 focused checkpoint

Owner passed V1 references and delegated ordinary production/technical choices. C01 remains identity authority; the recovered turnaround is approved support. First playable E01 is assembled from locked 121-line source, approved images and two original ChatGPT generated transparent actor candidates. Continue from runtime QA/release packaging, then recorded media and family acceptance; do not restart approved planning. See E01_RUNTIME_QA_2026-10-08.md.

## 2026-10-12 E02 owner PASS checkpoint — after visual art studies

The owner explicitly **PASSed three new full-resolution Riverside illustrations** (R0 main, R1 old path and R2 lookout). [Accepted image roles and technical limits](../content/season-01/s01e02/OWNER_APPROVED_RIVERSIDE_ART_2026-10-12.md); [byte-exact PNG and WebP upload manifest](../assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json). **Creative selection is locked; do not continue a loop of new concept images for trivial discrepancies.** Original images and runtime WebP derivatives are prepared as a downloadable bundle but still **await binary transfer to GitHub**. The existing E02 physical topology, narrative/EFL gates and R4 spoiler protection remain unchanged. Next focused task: actual six-file upload with integrity readback, then a minimal E02 game scene with approved C01 separate actors, real phones, E02 tests and E01 baseline. Never report a visual PASS as E02 runtime PASS.

## 2026-10-12 E02 image upload and process closeout

The owner's six original PNG/WebP files are now present in GitHub `main` and match the previously recorded Git blob/byte-size manifest. See the [E02 production postmortem](../content/season-01/s01e02/PRODUCTION_POSTMORTEM_2026-10-12.md). A fast generic source/derivative media verifier and CI are being added; the E01 static release packager is scoped to E01-owned art, preventing silent E02 image inclusion. The owner-approved R0/R1/R2 selection is locked; **next is playable E02 integration**, not more concept/image generations. E01 visual/gameplay acceptance remains unchanged.

## 2026-10-12 E02 Gate 3 engineering preview (not yet deployed)

The isolated [E02 first playable implementation](../content/season-01/s01e02/PLAYABLE_SLICE_QA_2026-10-12.md) is a separate `/e02/` browser route, with exact locked 81 E02 lines, owner-approved Riverside R0/R1/R2 artwork, approved C01 actor/portrait images, legitimate E01 prerequisites, separate E02 save/ledger, child-selected observation/revision and guarded later clue. Dedicated E02 route/state/Chromium tests and a separate E02 static preview package were added. Owner **art PASS** is retained, while **playable owner PASS and MN4 deploy are not established**; inspect actual browser screenshots and run genuine E01-to-E02/device validation before release. E01 accepted app/engine/save was not modified.

## 2026-10-12 E01 reopened for display changes

Following the owner's E02 live report, E01's accepted presentation was expressly reopened only for Parent View removal, chapter-opening guidance, landscape-first phones and dynamic full-window play. Script, world, art, state and E02 requirements stay locked. See [E01 presentation revision](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md). The server-side E01 baseline remains intentionally frozen until separately promoted.
