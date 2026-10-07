# Design Decisions

This document records current product decisions and the smaller questions that remain intentionally open.

Decisions marked **current direction** are strong defaults for Episode 01 and the MVP, but may evolve if parent-child testing shows a better solution.

## Locked current directions

### 1. Player role — control one recurring protagonist

**Current direction:** the child directly controls one recurring protagonist who is a real member of the core cast.

The protagonist is not a blank avatar and is not intended to represent the child's literal identity. They have their own personality, history, relationships, strengths, limitations, and growth.

Why:

- stronger long-term character continuity than an invisible helper;
- easier dialogue and story writing than a blank customizable avatar;
- lets the child act inside the story instead of only answering prompts;
- avoids the asset and continuity explosion of full avatar customization;
- supports recognizable IP and character growth.

The child chooses actions for the protagonist, but the protagonist may still express personality rather than acting as a silent puppet.

Later special episodes may temporarily shift perspective or control to another core character, but this is not required for the MVP.

### 2. English audience — EFL-first

**Current direction:** Wondervale is designed first for children ages 6–9 learning English as an additional/foreign language, with enough visual and audio support that limited English does not block the story.

English is not merely a subject inside Wondervale. It is also the primary language of the story experience.

Implications:

- short, natural child-facing English;
- strong visual context;
- replayable narration/read-aloud;
- key vocabulary introduced in context rather than isolated lists;
- instructions should remain understandable from action, icons, examples, or demonstration where practical;
- parent guidance can eventually use a different language from child-facing story content;
- reading support and English proficiency remain separate from age and reasoning challenge.

Do not simplify every idea merely because the language is simple. Cognitive depth and language complexity are separate variables.

### 3. Core cast — three at launch, expandable over time

**Current direction:** begin with a **core trio**.

- one player-controlled protagonist;
- two recurring companions with contrasting but complementary personalities;
- additional recurring characters introduced gradually;
- later seasons may expand the effective main ensemble.

Do not assign one character permanently to “Math,” “Science,” or “English.”

A useful initial trio should provide different ways of thinking, for example:

- an action-oriented curious protagonist;
- a careful observer / communicator;
- an inventive challenger / builder.

These are personality/strategy tendencies, not subject labels.

Names, species/human design, age appearance, and detailed visual identity remain open until the character bible is developed.

### 4. World presentation — storybook shell + living interactive scenes

**Current direction:** use a hybrid structure.

#### Storybook shell
Used for:

- episode/arc framing;
- transitions;
- recaps;
- chapter navigation;
- the growing chronicle of what has happened;
- optional parent preview/reflection.

#### Living interactive scenes
Used for:

- directly controlling the protagonist;
- exploring locations;
- talking to characters;
- manipulating objects;
- solving problems;
- experiments/simulations;
- seeing persistent world changes.

“Continuous world” does **not** initially mean a large open world.

Prefer bounded, reusable locations that feel persistent and can visually change over time. This makes content production scalable while preserving the feeling of a living place.

The same location may appear across many episodes with new objects, residents, routes, or functions.

### 5. Reward philosophy — diegetic world growth

**Current direction:** the main reward is that the **story, characters, and world genuinely change because the episode happened**.

Primary rewards:

- story resolution and continuation;
- visible changes to locations;
- new places/functions becoming available;
- character growth and callbacks;
- new interactions made possible by earlier events.

Secondary reward: a **Wondervale Chronicle** (working name) inside the storybook shell.

The Chronicle can accumulate:

- illustrated story moments;
- changed locations;
- character memories/milestones;
- meaningful discoveries;
- optional found objects with story significance;
- useful words/phrases encountered in context;
- unresolved questions/mysteries.

It is a memory and reflection system, not a score board.

Optional keepsakes may exist when they are tied to exploration or story meaning, but avoid:

- stars as the main success metric;
- XP grinding;
- daily streak pressure;
- coins that exist only to compel repetition;
- randomized rarity/loot;
- rewards for mindless replay.

A good reward should make the child think, “Something changed / I found something / I want to see what happens next,” not merely “My number increased.”

## Still required before Episode 01 content lock

### 6. Core trio character bible

Define for each:

- stable personality;
- strengths and limitations;
- communication style;
- relationship with the other two;
- first-season growth direction;
- visual identity;
- why children would care about them.

The player-controlled protagonist must be especially clear because their personality affects every interaction.

### 7. Season 1 premise

Define:

- central mystery/problem;
- 2–3 Story Arcs;
- visible world changes;
- major character development;
- naturally arising learning themes;
- season payoff.

*The Lost River* remains a working concept, not canon.

### 8. Parent cue presentation

Prototype at least two shared-screen treatments and test which is least disruptive.

Potential directions:

- brief parent ribbon/card at natural pauses;
- optional “Grown-up cue” tab that highlights when useful;
- storybook-side note during transitions.

The child should not repeatedly stop and wait for an adult to read.

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
