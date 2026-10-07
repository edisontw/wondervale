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

## Next focused design layer

### Episode Production Brief format

Define the standard human-readable specification used to take one approved episode into script, interaction, learning/EFL, parent guidance, visual/audio production, continuity, and QA.

Do not begin E01 detailed production until the standard brief format is stable.

## Resolve during Episode 01 design

### Audio/narration baseline
Decide which child-facing text is voiced, replay behavior, caption/transcript rules, and whether prototype narration is recorded or synthetic.

### EFL scaffolding baseline
Define an initial language band for E01:

- approximate sentence length;
- amount of new vocabulary;
- amount of repeated language;
- picture/audio support;
- tap-for-meaning behavior;
- when translation is or is not offered.

### Help model
Test the graduated scaffold ladder with actual children.

### Session checkpoint behavior
Determine how a family pauses/resumes a 12–20 minute episode.

### Recap format
Prototype a short “Previously in Wondervale” experience using the Chronicle.

### Visual art direction
Lock only enough art direction to create a coherent vertical slice. Do not build a full asset library before the E01 interaction format is validated.

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
