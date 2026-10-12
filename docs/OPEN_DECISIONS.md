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
