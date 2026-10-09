# Design Decisions

This document records current product decisions and the smaller questions that remain intentionally open.

Decisions marked **current direction** are strong defaults for Episode 01 and the MVP, but may evolve if parent-child testing shows a better solution.

## Locked current directions

### 1. Player role — Milo, a recurring protagonist

The child directly controls **Milo**, a recurring protagonist with his own personality, history, relationships, strengths, limitations, and growth.

Milo is not a blank avatar and does not represent the child's literal identity.

The player controls exploration, interactions, strategies, and selected dialogue choices while Milo remains recognizably himself.

### 2. English audience — EFL-first

Wondervale is designed first for children ages 6–9 learning English as an additional/foreign language, with enough visual and audio support that limited English does not block the story.

Key rule:

**simple language does not mean simple thinking.**

Reading support, English proficiency, mathematical challenge, reasoning challenge, and accessibility should remain separable.

### 3. Core cast — Milo, Nia, Finn

The initial core trio is now defined in [CORE_TRIO.md](CORE_TRIO.md).

- **Milo** — player-controlled, curious and action-oriented;
- **Nia** — observant, thoughtful and communicative;
- **Finn** — inventive, practical and willing to challenge assumptions.

They represent different problem-solving tendencies, not different school subjects.

### 4. World presentation — storybook shell + living interactive scenes

Use a hybrid structure.

#### Storybook shell
Used for:

- episode/arc framing;
- transitions;
- recaps;
- chapter navigation;
- the Wondervale Chronicle;
- optional parent preview/reflection.

#### Living interactive scenes
Used for:

- directly controlling Milo;
- exploring locations;
- talking to characters;
- manipulating objects;
- solving problems;
- experiments/simulations;
- seeing persistent world changes.

“Continuous world” does **not** initially mean a large open world.

Prefer bounded, reusable locations that feel persistent and can visually change over time.

### 5. Reward philosophy — diegetic world growth

The main reward is that the story, characters, and world genuinely change because the episode happened.

Primary rewards:

- story resolution and continuation;
- visible changes to locations;
- new places/functions becoming available;
- character growth and callbacks;
- new interactions made possible by earlier events.

Secondary reward: the **Wondervale Chronicle** (working name).

Avoid stars, XP grinding, streak pressure, meaningless currencies, randomized rarity/loot, or rewards for mindless replay as primary motivation.

### 6. Parent cue presentation

Approved direction is defined in [PARENT_DISPLAY_MODEL.md](PARENT_DISPLAY_MODEL.md).

- **Desktop/large screen:** child experience and parent guide visible together, approximately 70–75% / 25–30%.
- **Mobile:** separate Child View and Parent View, initially supporting fast same-device switching.
- Future second-device synchronization is optional and not required for E01.

### 7. Season 1 story architecture — locked

Season 1 story architecture is defined in [SEASON_1_ARCHITECTURE.md](SEASON_1_ARCHITECTURE.md).

Locked architecture-level decisions include:

- the **Missing Place / old-route mystery** replaces *The Lost River* for Season 1;
- 3 Story Arcs and 11 Core Episodes;
- gradual visible world growth across recurring locations;
- the old route changed through normal town change rather than a villain or single catastrophe;
- the unsafe North Hill segment remains closed;
- the final missing place is a former shared community space, internally called **the Common**;
- the Common is reopened for present-day use rather than restored exactly;
- the season ends with a new Wondervale loop and the trio's Season 1 growth paid off in behavior.

The final child-facing season title, episode titles, detailed learning weave, scripts, interactions, and production details remain open.

*The Lost River* is no longer the Season 1 current concept and remains available only as a possible future story seed.

### 8. Season 1 learning weave — locked

Season 1 learning architecture is defined in [SEASON_1_LEARNING_WEAVE.md](SEASON_1_LEARNING_WEAVE.md).

Locked at this layer:

- five cross-episode learning threads: evidence/explanation, spatial routes, time/sources/change, design/systems/iteration, and perspective/community/tradeoffs;
- each Core Episode's primary/secondary learning role;
- revisit and transfer relationships across the season;
- high-level EFL language functions;
- important misconception hypotheses;
- meaningful evidence-of-thinking targets;
- one high-value parent discussion opportunity per episode.

Still intentionally open until Episode Production Specification / E01 design:

- exact activities and mechanics;
- exact quantitative difficulty;
- final EFL vocabulary/sentence load;
- final cue wording/timing;
- detailed scaffolds/hints;
- scoring or automatic assessment behavior.

### 9. Episode Production Brief format — locked

The standard Episode Production Brief is defined in [EPISODE_PRODUCTION_BRIEF.md](EPISODE_PRODUCTION_BRIEF.md).

Locked workflow rules include:

- one canonical human-readable brief per episode;
- the brief is authoritative for episode intent, required beats, learning, continuity, and production requirements;
- stable IDs are required for episode/scene/continuity references once content enters production;
- interaction design must distinguish cognitive action from interface mechanic;
- language, interaction, reasoning, and accessibility scaffolds remain separable;
- parent cues are sparse and non-spoiling;
- persistent effects must be represented structurally rather than only in prose;
- asset sections describe production requirements before assets/prompts are generated;
- final line-by-line voice text is downstream of detailed script approval rather than a prerequisite for the initial brief;
- every brief carries episode-specific QA/acceptance criteria.

### 10. S01E01 Production Brief — approved for script

The canonical E01 brief is:

- [`content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md`](../content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md)

Locked for E01:

- six episode scenes plus parent preview, with two substantive child interactions;
- observation-before-interpretation as the first reasoning interaction;
- map-to-real-place reasoning using two persistent Town Square anchors: a fountain and mature shade tree;
- discovery and accessible cleaning/reveal of the first old route marker;
- old map layer is documented/preserved rather than damaged;
- one recommended during-play parent cue plus optional reflection;
- E01 prototype language band: mostly 3–8-word required lines, occasional 10–12-word visually supported lines, and no more than about five comprehension-critical new lexical items without explicit justification;
- required storybook narration and progression-critical character dialogue are voiced with visible text/replay;
- temporary synthetic voices may be used for prototype timing; final voice production waits for script lock;
- E01 help ladder separates language, control, reasoning, and accessibility support;
- scene-boundary/local safe checkpoints plus a short Chronicle-style resume recap are the E01 prototype;
- no canonical branch in E01;
- E01 brief status is `approved_for_script`.

Still open inside the E01 vertical slice:

- final script/dialogue — **resolved in approved S01E01 script v1**;
- final child-facing E01 title;
- exact art/rendering style and final character/location model sheets;
- final parent-cue wording — **resolved provisionally in approved S01E01 script v1; family-test revisions remain possible**;
- exact interaction implementation — **behavior contract approved in E01 Interaction Spec v1; runtime technology/control layout still open**;
- final image/music/SFX prompts/assets;
- final voice provider/performance;
- validation of language/help/recap/checkpoint baselines with families.

### 11. S01E01 Prompt Pack — approved for downstream planning

The canonical derived pack is [`prompts/season-01/e01/00-README.md`](../prompts/season-01/e01/00-README.md).

Locked by this production-preparation layer:

- one indexed, task-specific prompt system derived from approved EPB/script/interaction; no independent story authority;
- script change-control, EFL/parent review, visual design, character, location, props/UI, animation, music, SFX, voice, engineering and QA prompt families;
- 121 exact approved script spoken lines exported to `40-voice-lines.tsv`; this is **text**, not voice recordings;
- a working E01 asset registry with stable candidate IDs, states, reuse, approval and provenance requirements;
- **image-generation gate:** choose and approve one visual style system, trio references, Town Square layout and stable unnamed mystery-symbol reference before any final art;
- no assumption of generated music/SFX/voice, working website, or runtime PASS.

Updated by decision #12: cross-episode visual grammar and Square topology/symbol **design** are now selected. Still open: actual character/location reference media, approved rendered symbol, final composition/camera, production assets, voice casting, runtime details, and executed acceptance/family tests.

### 12. Visual Mini-Pass — selected style direction v1

Canonical [Visual Style Bible](VISUAL_STYLE_BIBLE.md), [three-direction comparison and decision](VISUAL_STYLE_DECISION.md), and [E01 Visual Reference Contract](../content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md).

Locked at **visual-grammar level**:

- **Illustrated Living Diorama**, 2.5D appearance made from re-usable painterly/drawn layers, not mandatory full 3D;
- warm readable contours, restrained texture/lighting, consistent illustrations across storybook, living scenes and Chronicle;
- distinct grayscale trio silhouettes and recognizable Milo control staging, without locking faces or clothing before model-sheet review;
- one bounded Town Square topology with noticeboard, central round fountain, mature tree, then exit-area old marker;
- single versioned **unlabelled abstract mystery glyph design** that does not decode the Common;
- old/new paper and dirty/clean plate state overlays, with editable RIVERSIDE text and arrow appearing only after reveal;
- no batch/scene image generation before **actual character, location, glyph and marker visual references** are made and approved.

Now resolved by decision #15: **C01 trio identity** is visually approved. Still open: corrected matching turnaround, sprite production/provenance, Square master art, symbol rendered candidate, exact composition/camera, implementation tech, audio and runtime/user tests.

### 13. Image generation and GitHub binary upload smoke test (2026-10-08)

See [E01 smoke report](../experiments/s01e01/2026-10-08-image-upload/README.md), [upload runbook](IMAGE_ASSET_UPLOAD_WORKFLOW.md), and [manual trio handoff](../prompts/season-01/e01/26-trio-reference-manual.md).

Confirmed: Canva image generation succeeded (`MAHXYFZZA0A`), the ChatGPT image generator produced a local raster, and GitHub `create_blob(encoding=base64)` successfully committed and read back two test PNGs with valid signatures, dimensions and CRCs. One test PNG contains only **48×30 image-derived pixels** and is **not production-ready**. The SVG/PNG glyph probe is also a **candidate only**.

Blocked/open: fal credit exhausted; Canva media ID / ChatGPT container path cannot automatically be read as bytes in the GitHub Code Mode runtime. **Full-resolution generated images have not been committed directly through the assistant.** Manual download → branch upload → verify → PR is the reliable fallback; do not promote an unreviewed image or experimental thumbnail as the approved trio reference.

No change to selected visual grammar or reference gate; full E01 image asset production remains blocked until real reference review.

### 14. S01E01 Reference A — trio candidate uploaded and validated (2026-10-08)

[Reference status](ART_REFERENCE_PROGRESS.md) · [Merged PR #12](https://github.com/edisontw/wondervale/pull/12).

The uploaded full-resolution PNG is verified **1448×1086, 2,438,208 bytes**, matching Git blob `aeb4fcf6cef5ca354bd3be495ea1226081f26604`. GitHub Actions run `37731077246` **PASS** generated a 640×480 candidate review preview and source SHA256; original unchanged. Project owner subsequently explicitly **PASSED** this sheet as **trio identity v1**. The approval is for appearance, not sprite/media rights or integrated runtime.

**Still unresolved:** exact generator/prompt/licensing provenance (earlier Canva dimensions differ); faithful turnaround from C01, sprite-ready variants and phone-scale QA. C01 appearance is visually approved and PR #12 is merged, but no complete game asset is approved.

### 15. C01 identity lock and C02/C03 turnaround rejection (2026-10-08)

The user accepted the **Candidate 01** illustrated trio design with an explicit **PASS**. Therefore `ref-wv-trio-neutral-v1` is **approved for identity/face/hair/clothes/colors/proportions only**, anchored to blob `aeb4fcf6cef5ca354bd3be495ea1226081f26604`. [Main decision record](ART_REFERENCE_PROGRESS.md).

Both later manually uploaded full-resolution PNGs passed file integrity verification:

- **Candidate 02:** original Git blob `6bb10737cc1273bfe13b7d647179025bd0475437`; acceptable *turnaround layout* only, **REVISE for appearance**. Milo trousers/scarf, Nia braid/dress and Finn orange curls drift from the approved identity.
- **Candidate 03:** original Git blob `98bf5cd42adfac1d9ce8f3febc65947530ac2696`; **REJECT as identity**, with additional goggles and work overalls for Finn.

Neither later image can be used as a character identity reference. The next image generation must use **C01 image input** to recreate the same three children at new camera angles; do not just mention "same characters" in text. Retain C02/C03 only for audit/composition. Source licensing, final sprites, and all environment references remain open.

### 16. V1 reference gate and first playable runtime (2026-10-08)

Owner passed the reviewed V1 reference set and delegated ordinary creative/technical selection. Recovered exact turnaround blob `9e6ac0dcde86820ccc55b620497024805887348f`; C01 remains identity authority. Square reused from imported original ZIP; corrected board/plate have no baked destination; glyph geometry unchanged. See [approval record](VISUAL_REFERENCE_APPROVAL_2026-10-08.md).

Static ES modules are selected for the first playable slice. All 121 exact script/TSV lines remain unchanged. Runtime has SC00–SC06, two locked interactions, separate parent text, atomic local save/event ledger, read-only historical replay, derived marker/unlock state and Chronicle. ChatGPT generated original transparent actors are committed with exact hashes; neutral still poses are not a completed animation set. Browser speech is explicitly a prototype, not recorded performance.

## Next focused production layer

Finish runtime evidence/release review, then prepare the MN4 preview and run real-device/family acceptance. Recorded voices, music/SFX, additional coherent actor poses and rights provenance remain open. Do not reopen Season architecture, EFL weave or canonical dialogue. See [runtime QA](E01_RUNTIME_QA_2026-10-08.md).

## Can defer until after the connected MVP

- accounts;
- cloud synchronization;
- CMS;
- adaptive personalization;
- formal standards mapping;
- multiple child profiles;
- teacher/classroom mode;
- social/community features;
- generative AI;
- payments;
- elaborate collectibles;
- native mobile applications.

## Decision rule

When choosing between alternatives, prefer the option that:

1. increases child curiosity or meaningful agency;
2. improves parent-child interaction;
3. preserves cognitive depth while keeping EFL language accessible;
4. keeps character/world continuity understandable;
5. avoids unnecessary data collection;
6. scales to many episodes without multiplying authoring complexity.

### 2026-10-09 UI experience boundary (owner-directed)

E01 and upcoming episodes should present the story, world, essential dialogue and controls inside one bounded main viewport wherever screen dimensions allow, rather than expanding the browser document vertically. On desktop preserve side-by-side Parent View; on mobile preserve distinct Child/Parent modes. Use bounded internal scrolling for genuinely long parent or reflection copy rather than hiding any content. The map is an intentional investigation tool: the required first observation stays in-scene, but after that an old map must open **only on direct user request**, one copy at a time. Keep full canonical text and motor-accessible action targets. Real-device acceptance remains open; record exceptions if extremely small/mobile-landscape heights cannot fit without internal scrolling.


### 2026-10-09 RPG dialogue presentation (owner-approved direction)

Replace the long-lived on-screen introduction guidance with one-time pre-Begin instructions. Keep all unskippable opening lines. On both desktop and phone present one isolated speaker portrait and readable live text in a bottom RPG dialogue dock, with separate responsive layouts (desktop stays split with parent cue; phone retains Child/Parent toggle). Never allow atlas-neighbor portraits, huge fake navigation symbols, or images of the UI to replace current approved assets. Preserve accessibility and all E01 story/engine gates. See [implementation/QA contract](E01_RPG_DIALOGUE_UI_2026-10-09.md). Real-device crop/readability/family PASS remains open.
