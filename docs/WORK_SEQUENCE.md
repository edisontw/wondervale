# Wondervale Work Sequence

Wondervale is intentionally developed **one design layer at a time**.

The goal is to prevent story, pedagogy, art, audio, prompts, and engineering from being decided simultaneously and then repeatedly invalidating one another.

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

**Next major focused task**

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
