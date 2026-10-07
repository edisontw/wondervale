# Content Model

## Hierarchy

```
World
└── Season
    └── Episode
        └── Scene
            ├── narrative
            ├── activity
            ├── dialogue
            ├── parent cue
            └── continuity effects
```

Learning skills form a separate graph and are referenced by episodes and activities.

## Episode metadata

Working shape:

```yaml
id: s01e01
title: Something Is Missing
season: s01
estimated_minutes: 15

characters:
  - milo
  - abby

skills:
  primary:
    - observation
    - inference
  secondary:
    - descriptive_language
  revisit: []
  transfer: []

parent_cues:
  - type: predict
    scene: river_arrival
  - type: explain
    scene: first_clue

scenes:
  - intro
  - river_arrival
  - first_clue
  - investigation
  - resolution

effects:
  world: []
  characters: []

requires: []
```

## Scene design

A scene can combine several primitives:

- dialogue
- narration
- free exploration
- hotspot discovery
- drag/drop
- sort/classify
- sequence
- compare
- map
- build
- experiment/simulation
- simple text input
- audio/listening
- parent discussion
- choice with consequence

## Component registry

The engine should expose reusable activity primitives, but content authors should not be forced into visibly repetitive templates.

Example internal components:

```
dialogue
explore
search
sort
sequence
compare
measure
build
simulate
map
listen
choose
reflect
```

## Separate content from presentation

Episode content should be data-driven and schema-validated.

UI components should not contain episode-specific learning facts or story continuity.

## Localization readiness

English is the first authored language.

Keep these separable:

- stable content IDs;
- displayed strings;
- narration/audio references;
- culturally adapted content;
- parent-facing text.

Do not assume future localization is word-for-word translation.

## Content linting goals

Future automated checks should catch:

- missing IDs;
- invalid skill references;
- continuity prerequisites that do not exist;
- unresolved character references;
- inaccessible activities;
- overly long child-facing text;
- episodes whose declared effects conflict with canon.
