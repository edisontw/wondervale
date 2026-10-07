# Open Design Decisions

These decisions are intentionally not forced during the foundation review.

They should be resolved at the appropriate milestone rather than guessed inside implementation code.

## Must resolve before Episode 01 content lock

### 1. Who is the child inside the story?

Choose the narrative relationship:

- invisible helper to the recurring cast;
- named/unnamed visitor to Wondervale;
- customizable avatar;
- direct control of one recurring protagonist;
- rotating character perspective.

This affects dialogue, art, agency, continuity, and replay.

Do not let individual episodes silently use different answers.

### 2. English audience assumption

“English-first” can mean different products:

- native/strong English readers;
- general English-language family audience;
- English learners / EFL;
- mixed ability with read-aloud support.

Architecture supports separate reading/language support, but Episode 01 needs an explicit baseline for sentence length, vocabulary, narration, and parent expectations.

### 3. Core cast

Before E01 lock, define:

- initial 2–3 recurring characters;
- stable personality core;
- relationship;
- strengths and limitations;
- first-season growth direction;
- visual age/species/style if applicable.

Do not finalize a large cast yet.

### 4. Season 1 premise

Define:

- central mystery/problem;
- 2–3 Story Arcs;
- what visibly changes in Wondervale;
- major character development;
- learning themes that arise naturally;
- season payoff.

A working title such as *The Lost River* is not canon until this is locked.

### 5. Home/world navigation

Decide whether the persistent world is primarily represented as:

- town map;
- location hub;
- illustrated storybook;
- continuous scene/world;
- hybrid.

World growth should be visible somewhere stable.

### 6. Parent cue presentation

On a shared device, determine how a short adult prompt appears without:

- breaking immersion;
- making the child wait;
- hiding critical information;
- requiring a separate parent device.

Prototype at least two UI treatments in E01.

### 7. Reward/progression philosophy

Default proposal:

- story resolution;
- visible world change;
- new places/possibilities;
- character callbacks;
- optional meaningful discoveries.

Avoid making stars, streaks, coins, or collectible grinding the primary motivation.

If a collectible system is introduced, define what educational/story function it serves.

## Resolve during E01 design, not before shell work

### Audio/narration baseline
Decide which text is voiced, replay behavior, caption/transcript rules, and whether prototype narration is recorded or synthetic.

### Help model
Test the graduated scaffold ladder with actual children.

### Session checkpoint behavior
Determine how a family pauses/resumes a 12–20 minute episode.

### Recap format
Prototype a short “Previously in Wondervale” experience.

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
3. preserves learning depth;
4. keeps continuity understandable;
5. avoids unnecessary data collection;
6. can scale to many episodes without multiplying authoring complexity.
