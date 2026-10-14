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

### 2026-10-09 E01 RPG display acceptance and Old post inset correction

The owner confirmed that the responsive desktop/mobile RPG presentation is **much better**; lock its *layout and interaction grammar* as the E01 baseline, and document it in [Experience Design](EXPERIENCE_DESIGN.md) and [RPG UI contract](E01_RPG_DIALOGUE_UI_2026-10-09.md). Final physical-device/family acceptance remains open.

The owner also corrected the Old post cleaning: only the **central useful metal plaque** should be rubbed; its cleaned surface should replace the dirty center **in place** with `RIVERSIDE` and arrow after the accepted canonical reveal, without swapping/redrawing the whole post. The engraved word must stay inside the inner plaque frame (stack `RIVER` / `SIDE` if necessary). Preserve the existing approved master art, old/clean reference halves, wooden post/nails, original 121 lines, exactly-once reveal ledger and the accessible non-swipe cleaning alternative. No spoiler before the logical clean/reveal. See [RPG UI contract](E01_RPG_DIALOGUE_UI_2026-10-09.md) and [runtime implementation](E01_RUNTIME_IMPLEMENTATION.md). Touch/desktop visual acceptance still open.

### 2026-10-09 Old post whole-picture rubbing restored (newer owner instruction)

**Supersedes the preceding small central 58×75 scratch-area decision.** The owner found the inset too difficult to rub and could not see RIVERSIDE while actually rubbing. The final selected E01 interaction restores an accessible **240×300 complete original dirty-post scratch image**. The lower aligned clean-post reference has an ephemeral ink drawing of `RIVER / SIDE` plus arrow; wiping the *central part of the large canvas* immediately exposes this hidden ink through the actual erased pixels. There is **no requirement to wait for Finish cleaning to glimpse the letters**. The ink appears as presentation pixels, not a premature persisted story event. The original deliberate Finish cleaning/one-action cleaning alternatives and two narrator lines continue to gate the canonical marker reveal, town lettering, ledger and saves. Keep the just-rubbed writing visible in the close-up while those lines play. Preserve all approved artwork, script, and RPG dialogue design. See [runtime contract](E01_RUNTIME_IMPLEMENTATION.md). Build `20261009-e01-full-rub2`; real-device observation remains open.

### 2026-10-09 Old post completion aligned to legible writing (latest owner field QA)

Owner acceptance of full 240×300 picture scratching remains in force. After cleaning the central engraved area and seeing **RIVERSIDE**, the old meter sometimes showed only **50%** because it counted the whole post, including unrelated roof and timber. **Superseding metric:** keep the original large scratch surface and ink-behind-cover rendering, but define completion by genuinely rubbed **central RIVER / SIDE / arrow inscription area** (6×8 sampled witness cells over x=88–146, y=96–176; 36/48 distinct samples required). Off-target rubbing still removes dusty photo pixels but contributes 0 to “Writing uncovered” progress. Once enough of the writing is exposed, show 100% and enable explicit Finish cleaning. Do not autosave or reveal the in-world marker at 100%: the original deliberate Finish/accessible Clean without rubbing and canonical story queue/ledger remain mandatory. Tests cover off-target 0%, central-only 100%, mobile touch and old event semantics. This rule supersedes the 126/180 whole-photo progress metric but does **not** supersede the 240×300 whole-photo scratch interaction. Build `20261009-e01-rub-readability1`. Real-device visual/gesture QA remains open.

### 2026-10-10 E01 character readability and safe movement (owner PASS boundary)

User **PASS** on Old post scratching/readability-completion from build `20261009-e01-rub-readability1`: preserve it. Newly directed corrections only: Steward's existing full-body reference must also appear as a single cropped dialogue portrait; Nia/Finn/Steward each require visible world labels like Milo; rename vague `Read again` to audio-related **🔊 Listen** and preserve accessible manual replay; prevent the three children from rendering in a complete overlap; and stop Milo on paving **in front of** the painted noticeboard instead of standing on it. Keep the existing approved Square/trio assets, left/right hotspot semantics, 121 English lines, and save/Chronicle unaffected. See [UI contract](E01_RPG_DIALOGUE_UI_2026-10-09.md) and [engineering contract](E01_RUNTIME_IMPLEMENTATION.md). Real-device sightline/collision tuning and eventual recorded voice remain open.

### 2026-10-10 opening Milo / Steward label visibility (owner visual QA)

Latest user screenshot: at initial display, Milo partly covers the **Steward** name label. The focused implementation nudges opening Milo right to `[.42,.77]`, aligns the engine's initial feet/road origin, and slightly shifts Nia to `[.54,.72]` to avoid a new child overlap. The first playable formation stays consistent across the opening-to-exploration transition; Finn and Steward preserve their approved staging. Lock the principle: **character names must remain visible without rendering another character over the label**, and avoid start-of-play teleporting. Do not disturb the passed Old post rubbing/finish/readability, RPG dialogue, 121 canonical lines, save ledger or Board interaction. Acceptance pending an actual desktop/mobile observation of build `20261010-e01-opening-spacing1`.

### 2026-10-10 E01 opening staging — owner PASS

Owner reported **PASS** following the MN4 deployment/visual acceptance request for [PR #42](https://github.com/edisontw/wondervale/pull/42), build `20261010-e01-opening-spacing1`, main `4d94b8f0f1b552f598a3396402eea9f77d86e6bb`. Treat this as acceptance of the focused opening layout correction: Milo stands slightly right of Steward's readable nameplate, Nia/Finn retain separation, and the opening-to-play handoff does not reposition Milo unexpectedly. The prior accepted Old post scratch and RPG dialogue must remain unchanged. **Closed:** opening Milo/Steward name occlusion. **Still open:** natural movement/turning and companion-follow animation, multi-device/mobile-specific visual/family testing (including UX-11/UX-12), recorded voices and richer consistent poses. This user-reported PASS is not independent server telemetry or a substitute for those broader acceptance gates.

**Deferred E01 polish:** E01 character movement turning/following/depth, recorded voice and broader real-device/family QA remain open, but are **not** the next focused task after the owner's instruction to pause E01. Preserve the exact dialogue, character canon, approved art, parent display and completed ledger/collision/scratch behaviors.

### 2026-10-10 E01 freeze and E02 preparation (latest owner instruction)

The owner explicitly directed: **"E01 暫時先這樣"**. This overrides the prior *next-task* suggestion to continue E01 character motion polish; keep the current accepted playable E01 frozen while preparing E02. This is **not** a claim of full iOS/Android family QA, animation or recorded voice completion.

- **Durable record of E01 mistakes, remedies and preventive test gates:** [E01 lessons](E01_LESSONS_LEARNED_2026-10-10.md), including rejected tiny-region rubbing, progress mismatch, original-byte art transfer, dialogue/mobile UI, overlapping actors/labels, route geometry, fresh-save handling, exact PR HEAD CI and Windows-vs-MN4 Bash deployment.
- **Next production focus:** [E02 kickoff](E02_KICKOFF_2026-10-10.md) and [E02 Production Brief DRAFT](../content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md). The approved Season arc already locks `The Bridge That Stops`, Riverside's **blocked old connection**, a safe side overlook opening, Milo revising a hypothesis based on contradicting evidence, and a Market Lane continuation clue. The approved Season weave locks evidence revision and mapped-versus-present-space thinking, including *same/different*, *was/is/changed*, *because* and uncertainty.
- **Still OPEN / do not treat as accepted:** exact Riverside/topology/blocked-edge and safe-access physical composition; which observable facts disconfirm Milo's initial hypothesis; the specific child-controlled mechanics and parent cue trigger; scene/event identifiers; Riverside NPC/art/audio design; E02 shared runtime/save/episode routing plan. These require an E02-0 design layer and EPB approval **before** full script/asset/code.
- **Safety and continuity:** a blocked former connection stays blocked; safe access to a public overlook opens instead. Do not import hypothetical bridge-repair examples from generic world-continuity documentation as canon. Do not overwrite E01 story, approved character identity, old map/mystery symbol, or existing ledger on E02 start.

**Next focused task:** resolve the E02 Riverside topology, contradicting evidence and child interaction as one cohesive design proposal; revise the draft EPB, then request approval only for material creative choices. E01 animation/recorded voice/full family QA are deferred, not erased.


### 2026-10-10 E02-0 Riverside design proposal — pending material owner acceptance

E02-0 is now a **specific reviewable design** instead of an empty worksheet, recorded in [Riverside topology/evidence/player interaction](../content/season-01/s01e02/RIVERSIDE_E02_0_DESIGN.md) and [E02 brief revision 1](../content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md). **DRAFT remains**; proposal/documentation is not author approval or working runtime.

- **Proposed physical plan:** thriving Riverside near-bank promenade, old bridge approach fenced on safe paving, aligned old stone landings on both banks, no present bridge deck, a newer near-bank protected retaining edge, and a genuinely public signposted **same-bank** route to a protected Riverside overlook. The old connection **never reopens**; discovering the overlook makes it persistently revisitable, not newly physically constructed.
- **Proposed evidence chain:** Milo first guesses that *only* a new fence stops the old line. Old stone alignments support a historical connection; the empty bridge gap / newer edge **disconfirm fence-only** without inventing whether weather, maintenance or people caused it. Child chooses which visible observation contradicts the idea, then explicitly revises or qualifies it without right-answer scoring.
- **Proposed child agency:** move Milo to real, walkable public viewpoints in either order, choose signed safe access instead of the closed spur, inspect large context-based facts, and match evidence to a claim in a small notebook. Recoverable wrong-evidence selection, keyboard/motor accessible safe routing, no repeating E01's scratch or map-overlay mechanics. Later lookout-side mark introduces Market Lane.
- **Proposed technical contract:** independent E02 local checkpoint flags; canonical once-only overlook arrival, evidence revision/old-connection fact, Market Lane mark, and E02 completion; E01 marker/completion prerequisites and unchanged E01 source/checkpoint. IDs await schema lint and E02-specific storage routing design.
- **Still explicitly OPEN:** owner acceptance of this *new physical/interaction composition*; EPB promotion to `approved_for_script`; downstream canonical line/script text, image/audio references, exact assets/camera/hitboxes, E02 save migration, runtime implementation and device/family tests. Avoid marking `approved_for_script` or producing assets in this design-only pass.

**Next focused work:** owner reviews the E02-0 material design and either PASSes or requests adjustment. After acceptance, finish the EPB approval gate and separately draft E02 detailed script and interaction specification; E01 remains paused at its scoped user PASS.

### 2026-10-10 E02-0 owner PASS → E02-1 brief approved for script

The user explicitly responded **PASS** on 2026-10-10 to the [Riverside E02-0 material design](../content/season-01/s01e02/RIVERSIDE_E02_0_DESIGN.md). The prior section's **pending owner review is now resolved/superseded by this record**. The [E02 Production Brief rev 2](../content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md) is **`approved_for_script`** after an E02-1 acceptance gate.

**Locked:** same-bank current promenade, fenced old bridge approach and changed bank edge, aligned older stone footings with the present deck absent; existing signposted public path to protected overlook (discovered for revisit, not repaired/opened by breaking a closure); Milo's fence-only initial idea, child-visible disconfirming gap and non-punitive evidence-linked revision with unknown cause; Market Lane overlook marker after reflection; six authoring scenes `s01e02-sc00..sc05`, two substantial interactions `s01e02-int01..int02`, one parent cue `s01e02-cue-01`; E01 prerequisite and no E01 changes.

**Open downstream:** full exact script and line IDs, behavior spec/test matrix, art master/phone composition/feet polygons, content schema and cross-episode save migration, recorded voice/music, device/MN4/family QA. Stable proposed event IDs are authoring references pending runtime compatibility validation. E01 playable build remains frozen at scoped owner PASS. Do not silently promote E02 to production_ready.

### 2026-10-10 E02-2 first full script/interaction drafts — authoring QA PENDING

After owner acceptance of E02-0 and EPB rev 2 `approved_for_script`, E02-2 prepared three **draft-for-review** source documents:

- [Full E02 English dialogue](../content/season-01/s01e02/DETAILED_SCRIPT.md) with 81 unique proposed line IDs, optional parent copy, observation-order branches, two recoverable notebook paths, Chronicle, hints and resume.
- [E02 Interaction Spec](../content/season-01/s01e02/INTERACTION_SPEC.md) covering two E02-native mechanics, first-play/replay/ledger semantics, movement and evidence gates, explicit event triggers, line-binding and parent-cue conditions.
- [E02 Test Matrix](../content/season-01/s01e02/INTERACTION_TEST_MATRIX.md) covering 30 **specified, NOT RUN** cases including safety, cognition, spoiler, mobile, E01 regression, storage, release and family UX.

**Not accepted yet:** exact script/voice text or interaction behavior as production-locked; the files are drafts and no asset, audio or runtime code has been generated. Canon/EPB and E01 remain unchanged. After source QA and review, promote these two documents to approved for prompt pack, then proceed to visual reference gate E02-3. Engine event serialization/migration remains an engineering design decision; no premature E01 source modification.

### 2026-10-10 E02-2 source lock and E02-3 visual gate

The E02 detailed English script rev 1 (81 unique lines, dialogue lock `v1`) is now `approved_for_interaction_spec`; the E02 interaction spec rev 1 is `approved_for_prompt_pack` after source QA and correction of an early-spoken answer. These are downstream authoring approvals under the owner's E02-0 PASS, **not** independent owner testing. The E02 [visual reference contract](../content/season-01/s01e02/VISUAL_REFERENCE_CONTRACT.md) specifies a canonical same-bank Riverside composition, no-go geometry, phone/desktop crop checks and no early Market Lane spoiler. Rendered images, exact foot polygons and full-resolution asset QA remain OPEN; all 30 E02 runtime test cases remain NOT RUN. E01 remains frozen.

### 2026-10-11 E02-3 image trials — NOT APPROVED

Three 1536×1024 Riverside concept sheets were generated and visually reviewed; all **FAIL as master references** due to at least one of extra pet, premature Market Lane sign, intact background bridge or unverified C01 character identity / route topology. See [trial QA and original-file SHA-256](../content/season-01/s01e02/IMAGE_TRIAL_QA_2026-10-11.md). **No binary asset was written to GitHub, and no candidate is approved.** Next single visual task: generate environment-only topology master with no characters/text/distant bridges, then independently overlay C01 sprites, sign state and walkability masks. E01 remains frozen.

### 2026-10-12 E02-3 verified geography blockout — VISUAL REVIEW OPEN

Two additional environment-only rendered illustrations were visually rejected for ambiguous/incorrect same-bank access. To stop repeating that failure, E02-3 now has a [1600×900 SVG environment-only candidate](../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.svg), [separate technical QA overlay](../assets/reference-candidates/s01e02/riverside-r0-topology-debug-v1.svg), and [structured safe-route JSON](../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json). The near-bank topology has passed **source/graph point-in-polygon checks**, with a real public route to lookout and no crossing edge, but the SVG render/crops, C01 actor composites and owner visual PASS are **NOT RUN**. See [full QA record](../content/season-01/s01e02/GEOGRAPHY_BLOCKOUT_QA_2026-10-12.md). These are candidate storyboard/geometry source assets, **not production-approved art or actual engine masks**. Next: inspect rendered SVG, phone crop/actor scale, then produce painterly R0 only from this locked topology. E01 remains untouched.

### 2026-10-12 E02-3 rendered camera check — blockout v2 (not finished art)

A geometry-equivalent R0 vector was actually rasterized and reviewed; discovered that **both old bridge footings were too shallow/partly hidden**, so [v2 SVG](../assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v2.svg) now lengthens the aligned old piers and places the near-bank base above the painted foreground. [Camera config](../assets/reference-candidates/s01e02/riverside-r0-camera-proof-v1.json) and [static QA record](../content/season-01/s01e02/RENDERED_CAMERA_QA_2026-10-12.md) cover desktop split-screen plus mobile 320/360/390/430 focal crops; these are **static framing mockups, not device/browser PASS**. Two fresh painterly scene attempts were rejected for wrong base arrangement. **New LOCKED rendering constraint:** from safe lookout, `Look across` invokes a distinct evidence close view/camera pan; on 320px the lookout and old base cannot fit in one useful frame. **OPEN:** final painterly art, exact source-image integrity check, C01 sprites/labels, full phone/browser QA, E02 runtime and owner art PASS. E01 unchanged.

### 2026-10-12 E02-3 R1/R2 evidence view source gate — CANDIDATES, not approved game art

The E02 [R1 old stones](../assets/reference-candidates/s01e02/riverside-r1-old-footings-inspect-v1.svg) and [R2 lookout gap](../assets/reference-candidates/s01e02/riverside-r2-look-across-inspect-v1.svg) are self-contained 16:9 SVGs **derived from identical R0 v2 drawing geometry**, with only camera viewBox/alt description altered. The [visual manifest](../assets/reference-candidates/s01e02/riverside-r1-r2-visual-manifest-v1.json) retains the scripted child-only inspection guards and existing R0 no-go graph. Static 320/390 phone caption-dock proofs and a geometry/painting comparison were produced as conversation files; see [source+visual QA](../content/season-01/s01e02/R1_R2_REFERENCE_QA_2026-10-12.md). Source-preservation and spoiler QA **PASS**, but the new painterly candidate is **REJECTED for stone bases in mid-river instead of opposed bank ends**. Still open: genuine browser rendering, high-quality matching final art, exact C01 sprites/labels, owner visual PASS, original raster transfer and all E02 runtime tests. E01 remains frozen.

### 2026-10-12 E02-3 illustrated art-source v3 and offline visual QA — owner gate OPEN

After multiple AI concept sheets reintroduced **two bridge bases side-by-side in the water**, all unconstrained painterly versions remain REJECTED as physical E02 masters. To preserve the agreed route, a [single R0 v3 visual study](../assets/reference-candidates/s01e02/riverside-r0-art-study-v3.svg) was derived from unchanged R0 v2 vector geometry, adding only decorative texture/foliage/water detail; [R1](../assets/reference-candidates/s01e02/riverside-r1-old-stones-art-study-v3.svg) and [R2](../assets/reference-candidates/s01e02/riverside-r2-look-across-art-study-v3.svg) are **the exact same drawing with camera changes only**. An [offline review viewer](../assets/reference-candidates/s01e02/riverside-r0-r1-r2-qa-viewer-v1.html) supports R0/R1/R2, 320/360/390/430 px and simulated caption dock. Source geometry/spoiler checks PASS; see [explicit QA/limits](../content/season-01/s01e02/ART_STUDY_V3_QA_2026-10-12.md). Neither polished painting, C01 sprite assembly, actual browser/device acceptance nor owner visual PASS is achieved. Candidate visual work **must not** be marked final. E01 unchanged.

### 2026-10-12 E02-3 final conversation owner PASS — three painterly PNGs accepted, binary GitHub transfer OPEN

**This latest acceptance supersedes the prior “owner art review still open / keep regenerating” status for the selected images.** User explicitly replied **PASS** to three newly generated individual images (R0 main Riverside, R1 old-path footings, R2 protected lookout). Their exact 1672×941 original PNG bytes were recovered, hashed, and placed in a downloadable ZIP along with three quality-83 WebP derivatives. **No new images are necessary to retry visual style.** See [owner-approved media intake decision](../content/season-01/s01e02/OWNER_APPROVED_RIVERSIDE_ART_2026-10-12.md) and [expected hashes/blob IDs](../assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json).

**Important exception, still open:** owner PASS approves the **art selection** but does not make separately generated R0/R1/R2 identical world-coordinate crops, overwrite the owner-PASS Riverside same-bank/fence/absence-of-deck canon, or prove the actual E02 gameplay. Keep movement physics on the approved SVG/JSON path graph; verify evidence details with safe closeups and readable caption layers. Assets have **not yet been pushed to GitHub** because there is no binary-file upload bridge available in this assistant runtime. Transfer originals and WebPs without re-encoding, verify SHA-256/Git blob using `scripts/verify_e02_art_intake.py`, then implement E02 with actual C01 identity, browser/device QA and E01 regression. All 30 E02 runtime cases remain NOT RUN. E01 unchanged.

### 2026-10-12 E02 upload verified on main; reusable fast-lane and release-art scope fix

GitHub `main` `038f9f48a53feaf4ee7a72d2fd0bd490f0de0a2f` now has **all six** owner-approved E02 images, three full-source PNGs and three WebP derivatives, each matching the declared **Git blob SHA + byte length**. The main E01 CI run `38217390123` PASS. This supersedes historical “upload pending” messages; **do not request another upload or regenerate the selected art**. The [E02 postmortem](../content/season-01/s01e02/PRODUCTION_POSTMORTEM_2026-10-12.md) and [reusable four-gate fast-lane](EPISODE_PRODUCTION_FAST_LANE.md) record workflow corrections. A newly found E01 release packaging hazard (`public/art/*.webp` includes E02 images) is being fixed by manifest-derived E01 allowlisting. Full E02 binary SHA-256/PNG CRC/WebP dimensions media CI is to be verified at the workflow PR HEAD. 

**NEXT:** E02 engineering/gameplay slice with imported images, C01 actors, old-stones/gap evidence, revision, Chronicle/Market Lane, mobile and E01 regression. E02 runtime QA and deployment remain OPEN.

### 2026-10-12 ChatGPT reusable Wondervale Episode Fast Lane Skill

The user requested that the already approved four-stage [Episode Production Fast Lane](EPISODE_PRODUCTION_FAST_LANE.md) also be maintained as a reusable **ChatGPT Skill**. The [portable skill source](../skills/wondervale-episode-fast-lane/SKILL.md) and two [gate](../skills/wondervale-episode-fast-lane/references/acceptance-gates.md)/[image-transfer](../skills/wondervale-episode-fast-lane/references/media-handoff.md) reference guides are now part of the repository. `python3 scripts/package_wondervale_skill.py` builds an uploadable ZIP from the same durable source. Future episodes should follow this process and query **current GitHub main** instead of a frozen skill snapshot. **Open:** a ChatGPT Skills-capable user/workspace must install the ZIP in the ChatGPT UI; GitHub merge does not install a personal skill. E02 playable integration still remains the next product-development task. E01 unchanged.

### 2026-10-12 S01E02 Gate 3: isolated first playable slice; owner gameplay PASS still OPEN

A focused [E02 engineering slice](../content/season-01/s01e02/PLAYABLE_SLICE_QA_2026-10-12.md) at `/e02/` now exists with a distinct state module `engine/s01e02.mjs`, 81 exact text IDs in `public/s01e02.json`, approved R0/R1/R2 WebPs, original C01 trio, separate E02 ledger/save, safe station movement, both evidence categories, two accepted revisions, after-revision Market clue and Chronicle. The E02 test matrix has marked independently executed automated checks but full real-device/family/hosting gates remain OPEN. **Material implementation caveat:** three separately approved paintings are visually composed, not coordinate-identical to the safe-route graph; front-band sprite positioning and future scene foot/contact QA require actual human review. The new `/e02/` route is a *local/staging entry*, not proof of MN4 deployment. E01 remains source-frozen and its CI runs unchanged.


### 2026-10-12 MN4 E02 CI→SSH preview delivery — implementation committed, activation OPEN

To eliminate repeated manual `git pull` / packaging / server-copy operations, the accepted technical direction is GitHub Actions on relevant E02 `main` pushes, full E02 real-browser and media QA, strict E02-only transfer over dedicated SSH, byte-identical **frozen E01** baseline, immutable composite release, atomic `current` symlink swap, local HTTPS smoke and automatic rollback on health failure. E02 uses the same origin and `/e02/` route to read genuine E01 local progress; it does not alter E01's story, code, or save ledger. See [implementation/setup/operational gates](MN4_AUTO_DEPLOY.md). Deployment is off unless `MN4_DEPLOY_ENABLED=true` and MN4 SSH secrets/host bootstrap are configured. **OPEN:** operator checks actual E01 build on MN4 before baseline freeze, creates CI SSH credentials and verifies pinned host key, activates opt-in variable, confirms initial workflow and real HTTPS /e02/ run. This is an infrastructure decision, not E02 playable or device/family PASS.


### 2026-10-12 MN4 E02 first live deployment — infrastructure PASS, gameplay acceptance OPEN

GitHub Actions [run #38256457984](https://github.com/edisontw/wondervale/actions/runs/38256457984) against `main` `69ede242e1a2125a43e412016bef2772832389f3` completed **both** `verify-and-package=success` and `deploy-mn4=success`. SSH host key and new dedicated CI private key are accepted. MN4 deployed E02 to `https://wondervale.pepepow.net/e02/` with its 9 runtime files verified; the remote deployment smoke logged `PASS: E01 byte-identical; E02 artifact byte-verified` and confirmed E01 build `20261010-e01-opening-spacing1` unchanged. This resolves the earlier *activation OPEN* note for the infrastructure gate; it does **not** imply owner-playable, family, recorded-voice, or real-phone PASS.

**Next OPEN:** user/owner visits `/e02/` on actual desktop and phone and tests E01 progression unlock on the same origin, E02 layout/actors/footing geography and full story flow. Operational follow-up: revoke obsolete exposed/v2 SSH public keys only after ensuring the successful v3 key remains, remove stale local private-key copies and transient GitHub CLI login. See [deployment evidence and troubleshooting](MN4_AUTO_DEPLOY.md). E01 source and frozen baseline must stay untouched.

### 2026-10-12 — E01 presentation owner override (supersedes Parent View #6 and later desktop split)

Remove Parent View and put all parent-facing E01 explanation, one cue, follow-up, fallback, and reflection in the chapter opening before Begin. Phone uses **landscape-first two-column gameplay and RPG dialogue**, with portrait fallback. Desktop and phone use a dynamic full-window viewport and optional supported browser fullscreen. In-play Options retains synthetic read-aloud, movement, assistance, and confirmed reset. Do not alter original C01 assets, 121 script lines, interactions, persistence, E02 unlock or runtime. Human phone/desktop acceptance and promotion of MN4's frozen E01 baseline remain open until verified. [E01 revision](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-12 — E01 presentation release gate CLOSED; owner physical-UI QA OPEN

[Run #38271380184](https://github.com/edisontw/wondervale/actions/runs/38271380184) deployed E01 build `20261012-e01-landscape-fullscreen1` from `de8ab925ff99a8af41fd454e7a534f7f1cf840a8` to MN4 and promoted the new E01 baseline after successful E01/E02 artifact and local HTTPS tests. E02 remains available; the same-origin unlock contract is unchanged. Lock the owner-directed parent guidance before Begin, parent-free gameplay, phone landscape-first/full-window UI, and Options controls as the deployed E01 implementation. Physical Android/iOS/desktop screenshots, touch/legibility/fullscreen behavior, and family QA are **not yet accepted**; those are the next focused tasks. See [E01 release and incident report](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-12 — E01 desktop owner OK; mobile fullscreen and E02 handoff correction

Owner reports that the revised E01 desktop view is **OK**. Real phone Chrome exposed a native fullscreen error toast, and the E01 ending did not adequately lead to E02. Lock the UX correction: capability-gated fullscreen (no button or error when the browser cannot honor it), `100dvh` landscape/portrait fitting independent of the browser fullscreen API, and a prominent completed-Chronicle continuation link to the same-origin `/e02/`, strictly after E01 save/ledger completion. E02 must independently enforce the existing E01 prerequisites and retain its own progression. UI-only change: preserve every approved spoken E01/E02 line, cast/world art, marker reveal, and save/event contract. **OPEN:** CI/deployment PASS and real phone user acceptance for the corrected behavior; unsupported browser toolbars are outside the site's fullscreen-control authority.

### 2026-10-13 — E01 mobile fullscreen + E02 handoff release PASS (owner phone retest OPEN)

PR #60 delivered capability-gated fullscreen and a prominent completed-Chronicle same-origin `/e02/` continuation action. PR #61 removed a feature-specific MN4 deployment build ID assertion after failed-before-switch run #38275124175; it retains strict archive/file SHA checks, E02 preservation and atomic rollback. The combined code/deploy source is `74e3edd9522ce1f6bac6d3e3513129a13a0786ea`; E01 build `20261012-e01-handoff-fullscreen2`. [E01 remote deployment run #38275829155](https://github.com/edisontw/wondervale/actions/runs/38275829155) PASS, [E01 full browser #38275829092](https://github.com/edisontw/wondervale/actions/runs/38275829092) PASS, and [E02 CI/deploy #38275829153](https://github.com/edisontw/wondervale/actions/runs/38275829153) PASS; E02 live files byte-preserved and current E01 baseline explicitly re-promoted. **Locked:** final E01 Chronicle→Riverside CTA only after completion/verified save; no fullscreen error on unsupported/rejecting browser. **OPEN:** owner mobile Chrome actual visual/control retest, broader device/family/audio acceptance. Do not mistake a successful remote HTTPS comparison for a real physical-device PASS.

### 2026-10-13 — iPhone Chrome fullscreen root cause corrected; App view engineering gate

The owner explicitly confirmed **iPhone Chrome**, with the previous error only **after tapping Full screen**. Prior generic mobile-browser analysis was incomplete: iPhone WebKit cannot request native arbitrary-page interactive fullscreen like desktop/Android Chromium. Do not present hiding the failed button as delivering fullscreen. Use a clearly labeled **App view** installation helper, root-scoped `standalone` web manifest and iOS web-app metadata; retain full-window responsive layout and genuine Fullscreen API on capable browsers. Open: PR validation/actual MN4 deployment; **owner iPhone physical QA** of Home Screen launch and separate storage, and cross-surface E01→E02 progress persistence. No completed human iOS PASS, no promise to hide system status bar. See [E01 correction](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-13 — iPhone Chrome App view deployment PASS; real device QA OPEN

Owner correction addressed in [PR #62](https://github.com/edisontw/wondervale/pull/62): the original problem was the failure **after pressing Full screen in iPhone Chrome**, not an error on launch. App view/standalone manifest replaced the misleading iPhone fullscreen action; other supported browsers retain native fullscreen. Code `af8b676785dd985a7ddf63dbce08ad850d0896d9`, build `20261013-e01-ios-appview1`, [E01 MN4 deployment #38281555894](https://github.com/edisontw/wondervale/actions/runs/38281555894) PASS, [E01 full browser #38281555897](https://github.com/edisontw/wondervale/actions/runs/38281555897) PASS, [E02 CI/deploy #38281555791](https://github.com/edisontw/wondervale/actions/runs/38281555791) PASS. Release integrity, manifest HTTPS, E02 original bytes and E01 baseline preservation verified. **Engineering release gate CLOSED; owner actual iPhone install/UI test OPEN.** Home Screen Web App progress may live in separate storage; do not claim existing tab history transfers or iPhone system status bar disappears. All original narrative, C01, event, scratch and E02 progression contracts locked unchanged.

### 2026-10-13 — E01 phone landscape owner override: bottom story dock (pending CI/deploy)

Owner reports iPhone Chrome **Add to Home Screen App view PASS**. The remaining landscape defect is dialogue/buttons moving into a right-hand column. **Accepted UI direction:** vertical story scene followed by a compact bottom RPG portrait/text/button row; navigation shares the scene-heading row to maximize illustrated scene area. Increase label legibility, reduce visible button padding but maintain **≥44px touch targets**. Ordinary gameplay should not need whole-page scrolling; long scratch/map/Chronicle and the parent briefing may scroll within content panels. Keep the entire scene aspect, cast labels and hotspots. Supersedes the previous E01 landscape two-column caption preference. Does not redefine E01/E02 narrative, art, interactions or state. See [E01 mobile QA](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md). CI, MN4 promotion and real-phone QA remain open.

### 2026-10-13 — E01 landscape dialogue-bottom override deployed, real iPhone QA OPEN

[PR #63](https://github.com/edisontw/wondervale/pull/63) implemented the owner's corrected phone UX: full Town Square above, portrait/text/control row below; compact same-row navigation and legible ≥14px control text with ≥44px target height; conditional scrolling for content-heavy panels only. Source `dcb951b1c56845304662b41f2ae50f18e925bfd1`, build `20261013-e01-landscape-bottom1`; [E01 main browser #38346546498](https://github.com/edisontw/wondervale/actions/runs/38346546498) PASS, [MN4 live release #38346546519](https://github.com/edisontw/wondervale/actions/runs/38346546519) PASS; remote E02 bytes were verified unchanged, E01 baseline promoted. **Locked:** bottom dialogue and ordinary non-scrolling art layout for landscape mobile, exact scripts, world coordinates, C01 art, scratches, save/ledger, and E02. **OPEN:** owner iPhone actual visual/gesture acceptance, final audio/family QA. Owner already confirmed iPhone Chrome Home Screen App view PASS before this layout change. See [E01 phone layout release](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-13 — E01 landscape screenshot correction: compact header, single-row walking destinations (pending release)

Owner's actual iPhone screenshot shows oversized Wondervale/Options header and four walking buttons wrapped into **two rows**, with the lower row cut off. Supersede the prior heading-row navigation idea: top header/Options compact, **four navigation buttons BELOW the scene in one row** (visual `Board`, `Fountain`, `Big tree`, `Old post`; `Noticeboard` remains accessible name), bottom dialogue only when present. Preserve ≥44px touch targets and no normal whole-page scroll. Cover landscape windows up to 700 CSS px high and **free-roam with no caption**. No E01 dialogue/identity/art, puzzle, persistence or E02 semantic changes. Real owner iPhone acceptance remains OPEN after CI and deployment. [UI evidence](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-13 — iPhone screenshot four-button mobile nav deployed; owner iOS acceptance OPEN

[PR #64](https://github.com/edisontw/wondervale/pull/64) fixes the actual-device screenshot: compresses Wondervale/Options header and enforces one row of **Board / Fountain / Big tree / Old post** BELOW the fully visible Town Square, including when free-roaming with **no caption** and at landscape viewport heights ≤700 CSS px. Short visual Board retains full accessible `Noticeboard`; 44px hit targets, 121 E01 story lines, C01 sprites, marker, ledger, iPhone App view and E02 are unchanged. Code `929d3ffde19a72300329a3e348ee4ba32f1a7c7a`, E01 build `20261013-e01-mobile-nav1`. [Main E01 browser #38396812752](https://github.com/edisontw/wondervale/actions/runs/38396812752) PASS; [MN4 composite deployment #38396812688](https://github.com/edisontw/wondervale/actions/runs/38396812688) PASS, E02 byte-preserved. **Engineering gate CLOSED; physical iPhone landscape visual/accessibility/gesture acceptance OPEN.** Prior failed candidate CI runs were not deployed. See [E01 visual/CI field report](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-13 — Short-landscape real iPhone illustration is too small (release pending)

The owner submitted portrait 640×1136 and landscape 1136×639 image-pixel screenshots showing that, after PR #64, the landscape scene itself is tiny despite four location controls now sharing one row. The QA gap was *physical screenshot pixels vs CSS layout pixels*: a landscape physical 1136×639 screenshot on a 2× iPhone corresponds to ~568×320 CSS pixels, which was omitted from test matrices. **Accepted correction scope:** maximize full 1672:941 art at short landscape dimensions by overlaying lightweight Options/title and a compact **Map** control at top; keep four walking controls one row below art and dialogue underneath; maintain accessible controls, scroll for content-heavy pages and all E01 scripts/art/state and E02 canon unchanged. Test 568×320 CSS explicitly; **real iPhone post-release acceptance OPEN**. See [E01 field record](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-13 — Real iPhone 568×320 CSS whole-art correction deployed; owner QA OPEN

Owner screenshots (physical 640×1136 portrait and 1136×639 landscape) showed E01 scene was too small in landscape after PR #64. Short landscape UI fix [PR #65](https://github.com/edisontw/wondervale/pull/65) frees title/Options and full-width Map action space by floating those controls at the top edge, keeping the complete canonical 1672:941 Town Square, **four movement keys in one row below it**, and bottom dialogue. Covers ~568×320 CSS, distinguishes screenshot physical pixels from CSS pixels; short visible Map keeps accessible `Open the old map` and original action. **Code SHA** `3bfb44ba0abaf45dde84e557650c9b73846f72ce`, E01 build `20261013-e01-iphone-stage1`. [E01 main browser #38413502676](https://github.com/edisontw/wondervale/actions/runs/38413502676) PASS; [MN4 E01+E02 composite #38413502794](https://github.com/edisontw/wondervale/actions/runs/38413502794) PASS, E02 bytes preserved. **Engineering gate CLOSED; owner new iPhone screenshot/gesture acceptance OPEN.** Story, identity, state and E02 contracts remain locked. See [E01 field QA](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-14 — E01 iPhone animated walking must not shrink world (pending CI/deploy)

Owner reports PR #65 short-landscape revision is **much better**. Remaining physical iPhone UI failure: moving Milo shows `Walking to the place…` in a normal-flow action row, temporarily shrinking the illustration. **Accepted UI-only correction:** show **no visible walking text**, keep an accessible movement status in an empty dock of the same dimensions as ordinary free-roam, and keep the Town Square's size/aspect constant before/during/after travel. Test actual animated travel at ~568×320 CSS with movement enabled. E01 movement routing, narrative, C01 art, save ledger, E02 and rollback contracts remain locked. PR/CI/deployment and renewed owner physical QA OPEN. See [E01 landscape field QA](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-14 — E01 walking action dock no-layout-shift deployed; owner phone QA OPEN

Owner confirmed last E01 iPhone landscape layout is **much better**, but a visible transient `Walking to the place…` line shrank the Town Square during movement. [PR #66](https://github.com/edisontw/wondervale/pull/66) replaced that row's visible status text with an **empty same-height action dock**, keeping accessible `aria-label="Milo is walking"` while maintaining identical `#world` / `#viewport` geometry throughout the real animation. Main source `fb34a4348c5723598df5cba66a0833bfc2b220e9`, E01 build `20261014-e01-walk-stable1`. [E01 browser #38432760246](https://github.com/edisontw/wondervale/actions/runs/38432760246) PASS, [MN4 E01 composite #38432760231](https://github.com/edisontw/wondervale/actions/runs/38432760231) PASS, E02 bytes preserved. **Locked:** iPhone transient status must not shrink the world; E01 story, road math, actors, scratch/ledger and E02 unchanged. **OPEN:** owner real iPhone walking visual PASS, wider family/device/audio QA. [E01 field record](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-14 — E01 speculative map answer boxes too wide (PR and QA pending)

Owner wants narrower choice boxes for `Maybe it's a treasure map!` and other map speculation choices. The issue is a layout rule stretching option buttons to fill the panel; it is not a request to shorten approved dialogue or to redesign E01. **Accepted direction:** use content-hugging buttons with 44px minimum touch height and 14px font, wrap within the Old Map sheet, keep normal scroll for longer content; preserve full EFL lines, answer/ledger semantics, town navigation, artwork and E02. Add real CSS iPhone 568×320 and portrait/desktop browser geometry regression. Physical iPhone acceptance remains OPEN. See [E01 visual QA](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-14 — E01 compact map hypothesis choice boxes deployed; owner device QA OPEN

[PR #67](https://github.com/edisontw/wondervale/pull/67) fixed the owner-reported overly wide `Maybe it's a treasure map!` and sibling option boxes on the Old Map. Scope strictly to `.scene-map-sheet .choices`: content-based button widths, row wrap rather than the previous mobile flex column, ≥44px target and 14px labels, no horizontal overflow; retain verbatim EFL lines, guess/ledger effects, mobile world, movement, and E02. The initial branch CI exposed horizontal overflow at 568×320 and it was corrected before merge. **Source** `9e5fe72667e4bf360bc359f5ff3fc6cdd2dbf94c`, build `20261014-e01-map-choice-compact1`; [E01 main browser #38436788865](https://github.com/edisontw/wondervale/actions/runs/38436788865) PASS, [MN4 live release #38436788929](https://github.com/edisontw/wondervale/actions/runs/38436788929) PASS, E02 byte-preserved. **Engineering gate CLOSED; owner iPhone actual guess-selection visual acceptance OPEN.** See [E01 field QA](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

### 2026-10-14 — E01 compact Old Map hypothesis choices OWNER iPhone PASS

The owner explicitly replied **PASS** to the deployed [PR #67](https://github.com/edisontw/wondervale/pull/67) map-choice width fix (build `20261014-e01-map-choice-compact1`). **Closed / locked:** the `Maybe it's a treasure map!` and sibling hypothesis buttons size to their text with row wrapping; full canon EFL lines and guess/ledger semantics remain unchanged. Engineering CI and MN4 already PASS, and this owner report closes the **specific physical iPhone map-choice sizing acceptance**. Still open separately: other E01 device/family/audio acceptance, E01→E02 broader journey QA, and E02 gameplay/device QA. This is a documentation-only owner acceptance entry; live code/build unchanged.

### 2026-10-14 — E02 mobile UI and real-CSS phone acceptance gate (PR; CI pending)

Owner accepted E01's compact map-choice box on a real iPhone and requested the next focused step. Scope advances to E02 Riverside mobile UX without touching E01. Baseline E02 first playable is deployed, but its previous touch-browser tests only covered narrow **portrait** widths and did not check 568×320 **landscape** iPhone CSS viewport or page scroll. Proposed phone shell: scene-first complete Riverside artwork, no idle-caption space while free-roaming, story caption below art only when dialogue queued, a compact explicit walk-control row, meaningful 44px touch targets, and separate Parent View replacing (not stacking underneath) the gameplay. Long notebook/Chronicle content scrolls within its content view; no narrative/safe-route/EFL/ledger/E01 decisions changed. Updated `tests/s01e02-browser.mjs` covers scene/controls and actual reasoning flow at 568×320, 667×375 and portrait 390×844. See [E02 mobile QA](E02_MOBILE_QA_2026-10-14.md). PR browser/package and MN4 deployment gates plus real iPhone owner acceptance **OPEN**.

### 2026-10-14 — E02 mobile scene-first shell DEPLOYED; owner physical iPhone QA OPEN

[PR #68](https://github.com/edisontw/wondervale/pull/68) merged source `2f7d88016f1bbda5df68f35b825140ed33722211`, E02 build `20261014-e02-mobile-shell1`. The Riverside mobile shell now fits the whole 1672:941 stage, hides idle placeholder captions, uses a bounded one-row explicit travel-control strip and bottom dialogue in short landscape (568×320 / 667×375 CSS), and separates Parent View on phones without burying it beneath gameplay. Portrait support and internal scrolling for notebook, Chronicle and longer content preserved. E02 has the original 81 exact lines and identical EFL/story, safe closure, route graph, state/ledger events, art and E01→E02 prerequisite. **Main checks:** [E02 browser #38512581820](https://github.com/edisontw/wondervale/actions/runs/38512581820) PASS, [E01 regression #38512581573](https://github.com/edisontw/wondervale/actions/runs/38512581573) PASS, [MN4 E02 deployment #38512581602](https://github.com/edisontw/wondervale/actions/runs/38512581602) PASS; deployment verified E01 `20261014-e01-map-choice-compact1` byte-identical and E02 9 runtime files. **Engineering/deployment gate CLOSED; real owner iPhone Chrome/Home Screen E02 interaction approval OPEN.** See [mobile QA](E02_MOBILE_QA_2026-10-14.md). Next focused task: owner E02 phone visual/gesture feedback before broader E02 completion/parent-family QA.

### 2026-10-14 — E02 iPhone Notebook/Continue/hint repair OWNER PASS

Owner explicitly reported **PASS** on the deployed [PR #71](https://github.com/edisontw/wondervale/pull/71), E02 `20261014-e02-notebook-compact3` (source `932028778716800417db6d0c6f1b2c7b9bf03b18`). **Locked and physically accepted for this specific repair:** no `Continue` word wrap with compact Listen icon, neutral non-answer-colored Explore/Notebook buttons, Notebook evidence shown as a dedicated short-landscape comparison screen (not below the river), and repeatable existing-script help from `Not sure yet` without granting evidence or revision. Verified [E02 CI #38548635113](https://github.com/edisontw/wondervale/actions/runs/38548635113), [E01 CI #38548635134](https://github.com/edisontw/wondervale/actions/runs/38548635134), and [MN4 deployment #38548635057](https://github.com/edisontw/wondervale/actions/runs/38548635057) PASS; E01 byte-identical. **Remaining open:** full E02 conclusion/Chronicle physical-device acceptance, family usability, audio, cross-device/WebKit and E03 readiness. Do not treat this targeted PASS as an episode-wide signoff. See [E02 owner QA](E02_SCENE_ACTOR_DIALOGUE_QA_2026-10-14.md).

### 2026-10-14 — E02 Chronicle full-phone acceptance gate (PR #72; owner QA OPEN)

After owner PASS of Notebook/Continue/hints in build `20261014-e02-notebook-compact3`, the next focused task is E02 conclusion/Chronicle screen layout. [PR #72](https://github.com/edisontw/wondervale/pull/72) adds a short-landscape dedicated Chronicle evidence pane with the same locked Then/Now photos and Market Lane mark, stable read-along text and a visible final Finish control. Restore/completion tests protect the explicit ten-line Chronicle read → Finish gate and the E01 event ledger. Large panorama is not stacked over the book; the article may internally scroll while its action controls remain available. **Build:** `20261014-e02-chronicle-phone4`. E01 and E02 upstream narrative canon not changed. CI/deployment outcome and real iPhone owner acceptance remain separate gates; physical-device Chronicle, audio, parent/family review and overall E02 acceptance are still OPEN. See [E02 QA log](E02_SCENE_ACTOR_DIALOGUE_QA_2026-10-14.md).

### 2026-10-14 — E02 destructive Start Again storage contract (owner request; QA open)

Owner explicitly requires **Start E02 again to erase Chapter 2's progress/history**, not merely visually reset the scene. E02 must remove its namespaced localStorage key on confirmed reset, clear all E02 ledger/observations/Chronicle/played speech/phase state, stay empty across reload or background save, and allow a fresh 13-line intro once Begin is pressed. E01 must remain byte-for-byte intact and completed, so the Riverside prerequisite remains valid. The confirmation labels the destructive effect and Cancel never deletes data. Storage failures must display a real error instead of claiming success. Related QA and remaining physical-device gate: [E02 scene/dialogue QA](E02_SCENE_ACTOR_DIALOGUE_QA_2026-10-14.md). Build `20261014-e02-reset-clean5`; PR CI/deployment and owner phone validation are separate gates. No E03 unlock or narrative change.

### 2026-10-14 — E02 destructive restart code and release accepted (device QA OPEN)

[PR #73](https://github.com/edisontw/wondervale/pull/73) merged to source `45f5eeb65880e5e21bfeb3d7f83b86b4e40f8522` (`20261014-e02-reset-clean5`). The `Start E02 again` confirmation now explicitly deletes E02-only saved clues/events/Chronicle/completion, returns to new chapter with all initial narration restored, and protects E01 data. Pristine Preview cannot re-create the removed save on browser background/reload. On storage deletion failure, completed progress stays intact and an error is displayed. [E02 CI #38554287079](https://github.com/edisontw/wondervale/actions/runs/38554287079), [E01 CI #38554287200](https://github.com/edisontw/wondervale/actions/runs/38554287200), [MN4 release #38554287091](https://github.com/edisontw/wondervale/actions/runs/38554287091): **all PASS**. E01 verified byte-identical. **OPEN:** owner physical-phone verification of reset and complete Chronicle/family/audio acceptance. **Next:** owner checks reset→reload→fresh intro and preserved E01, then resume remaining E02 acceptance.

### 2026-10-14 — E02 checkpoint integrity and interruption QA (owner device gate open)

After E02 destructive-reset engineering gate [PR #73](https://github.com/edisontw/wondervale/pull/73), the next focused engineering task is checkpoint consistency and interrupted narration. The preexisting `restore()` trusted mismatched browser `phase` and evidence/revision/Market/Chronicle flags after filtering IDs, potentially showing unearned progress from corrupted localStorage. Scoped fix: reject inconsistent E02-only checkpoints to fresh preview; preserve exact valid saved queue/phase/ledger through mid-Notebook, pending Revision and mid-Chronicle reload. Unit/browser tests cover entire E02 milestone sequence, invalid completion/route data and real touch reload. **Code build** `20261014-e02-checkpoint-guard6`; E01, E02 81 exact narration lines, art, storyline and upstream choices unchanged. Full CI/MN4 gate and owner physical phone re-entry/reset QA must be reported separately; no episode-wide PASS is inferred.

### 2026-10-14 — E02 checkpoint consistency and interrupted-session CI DEPLOYED; owner phone QA OPEN

[PR #74](https://github.com/edisontw/wondervale/pull/74) merged code `e2104358f127874e130850a1eb4547fb0cdda220` (E02 `20261014-e02-checkpoint-guard6`). Bad browser snapshots no longer claim `Chapter complete` or Market Lane without matching E02 canonical ledger/observation/story states; recognized valid checkpoints retain the *exact* remaining Notebook/Revision/Chronicle speech on phone reload. [E02 main CI #38556405604](https://github.com/edisontw/wondervale/actions/runs/38556405604) **PASS**, [E01 regression #38556405598](https://github.com/edisontw/wondervale/actions/runs/38556405598) **PASS**, [MN4 production #38556405611](https://github.com/edisontw/wondervale/actions/runs/38556405611) **PASS** with E01 confirmed byte-identical and E02 artifact/commit verified. Locked original 81 speech lines, artwork, safety graph and upstream narrative/EFL decisions. **Open:** owner actual iPhone interrupted-save, destructive-restart and Chronicle screen acceptance; family/audio and future E03 tasks. Automated approval cannot substitute for owner PASS.

### 2026-10-14 — E02 interrupted-session and Start Again owner device PASS

The owner replied **PASS** to the deployed `20261014-e02-checkpoint-guard6` focused phone test of (a) returning from an interrupted E02 dialogue with saved progress intact and (b) confirming **Start E02 again** clears E02 progress through reload while E01 completion stays intact. **Closed / locked:** these specific real-device continuation and destructive-reset acceptance gates. [PR #74](https://github.com/edisontw/wondervale/pull/74), [E02 CI #38556405604](https://github.com/edisontw/wondervale/actions/runs/38556405604), [E01 CI #38556405598](https://github.com/edisontw/wondervale/actions/runs/38556405598), [MN4 deployment #38556405611](https://github.com/edisontw/wondervale/actions/runs/38556405611) had already PASS. **Open:** complete Chronicle/episode physical-phone usability signoff beyond the tested resume/reset path, parent-child learning observation, audio/voice, broader device coverage and E03 kickoff. **Next focused task:** finish E02 chapter-level owner QA before freezing it for E03; do not modify accepted upstream narrative/EFL, art or E01. This is a documentation-only owner acceptance record.
