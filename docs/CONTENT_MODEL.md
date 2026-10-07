# Content Model

## Planning hierarchy

```
World
└── Season
    └── Story Arc
        └── Episode
            └── Scene
                └── Beat / Activity
```

Learning skills form a separate graph and are referenced by episodes and activities.

A Story Arc is the medium-term planning unit, usually spanning several episodes. It helps manage setup/payoff, learning revisit, character growth, and world change without forcing an entire season into one flat list.

## Episode types

- `core` — advances the canonical season story;
- `side_story` — optional character/world depth;
- `free_explore` — location-based exploration/practice;
- `special` — themed story that should not create inaccessible core prerequisites.

The MVP should primarily use `core`.

## Episode authoring metadata

Working shape:

```yaml
schemaVersion: 1
contentVersion: 1

id: s01e01
type: core
title: Something Is Missing
season: s01
arc: s01a01
estimated_minutes: 15

characters:
  - milo
  - abby

learning:
  primary:
    - observation
    - inference
  secondary:
    - descriptive_language
  revisit: []
  transfer: []
  evidence:
    - notices_change_in_water_level
    - explains_clue_using_observation
  anticipated_misconceptions: []
  scaffold_profile: standard

parent_cues:
  - id: s01e01-cue-01
    type: predict
    scene: river_arrival
    importance: recommended
  - id: s01e01-cue-02
    type: explain
    scene: first_clue
    importance: recommended

scenes:
  - intro
  - river_arrival
  - first_clue
  - investigation
  - resolution

effects:
  canonical_events: []
  character_milestones: []
  discoveries: []

requires: []
```

The final schema should use stable IDs and structured objects rather than free-form expressions when practical.

## Scene and beat design

A scene can combine:

- dialogue;
- narration;
- free exploration;
- hotspot discovery;
- activity;
- parent discussion;
- choice;
- transition;
- consequence.

A beat is a small narrative/interaction moment inside a scene. Not every beat needs an activity.

## Activity model

Separate **cognitive action** from **interface mechanic**.

### Cognitive examples

- observe
- compare
- estimate
- infer
- predict
- classify
- plan
- model
- test
- revise
- explain
- negotiate
- create
- retell
- perspective_take

### Mechanic examples

- inspect
- drag
- sort
- sequence
- compare
- measure
- build
- simulate
- map
- listen
- choose
- arrange
- talk_together

This allows the engine to reuse mechanics without making the learning experience repetitive.

## Scaffolding

Activities should be able to declare a graduated hint ladder.

Example:

```yaml
scaffolds:
  - level: clarify_goal
    text: "What are we trying to make happen?"
  - level: direct_attention
    target: water_near_rock
  - level: narrow_choices
    options: [move_rock, move_wheel]
```

Do not make hints equivalent to immediately revealing the answer.

## Learning evidence

The runtime does not need to score every child action.

Episode content should still declare what evidence would indicate meaningful thinking. This is useful for:

- design review;
- parent-child testing;
- future adaptive systems;
- avoiding activities that only test UI proficiency.

## Continuity effects

Persistent effects should emit stable event/milestone IDs rather than directly becoming the only stored state.

Example:

```yaml
effects:
  canonical_events:
    - id: bridge_repaired
      set:
        place: riverside_bridge
        state: repaired
  character_milestones:
    - character: milo
      id: tests_before_concluding
```

The runtime derives the visible current world from the progression/event ledger plus canonical rules.

## Choices

Classify meaningful choices:

- ephemeral;
- episode-local;
- remembered;
- canonical branch.

Early content should strongly prefer the first three.

## Localization readiness

English is the first authored language.

Keep separable:

- stable IDs;
- child-facing strings;
- parent-facing strings;
- narration/audio references;
- culturally adapted content;
- asset metadata.

Child locale and parent-guide locale should not be assumed to be identical forever.

## Authoring source vs runtime manifest

Human-friendly authoring files do not have to equal runtime data.

Preferred future pipeline:

```
authoring source
→ schema validation
→ learning lint
→ continuity lint
→ accessibility/localization lint
→ compiled runtime manifest
→ application bundle
```

This protects the runtime from future changes in authoring tools or CMS.

## Content linting goals

Automated checks should eventually catch:

- missing or duplicate IDs;
- invalid skill references;
- missing character/location references;
- dependency cycles;
- unreachable episodes;
- continuity conflicts;
- invalid parent cue references;
- inaccessible activity requirements;
- overly long child-facing text;
- missing meaningful audio transcripts/captions;
- incompatible content/schema versions;
- declared persistent changes that are not represented as structured events.
