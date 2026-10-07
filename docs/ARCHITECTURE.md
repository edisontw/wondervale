# Architecture

## Goal

Build a content-driven web application whose story world can grow for years without embedding episode logic directly into the UI.

## Logical layers

```
Presentation
    ↓
Story Runtime
    ↓
Activity Runtime
    ↓
Content + Schema Validation
    ↓
Learning Graph + Continuity Graph
    ↓
Progress State
```

## Initial application principles

- English-first content
- responsive web UI
- child-safe interaction patterns
- static/content-driven where possible
- client-side interactivity only where required
- minimal personal data
- no mandatory child account for the first version

## Suggested source structure

```
app/
components/
  story/
  activities/
  parent-cues/
  characters/
content/
  world/
  characters/
  seasons/
  skills/
engine/
  story/
  activity/
  learning/
  continuity/
  progress/
schemas/
public/
  characters/
  scenes/
  objects/
  audio/
docs/
```

## State separation

Keep these distinct:

1. authored canon;
2. runtime world state derived from completed episodes;
3. local child/family progress;
4. UI state.

This prevents replay, save data, and future account synchronization from corrupting story canon.

## Persistence plan

### Prototype / early MVP
Use local persistence only where needed.

### Later
Introduce cloud profiles only after actual usage demonstrates a need for cross-device synchronization or adaptive progression.

## Future-compatible areas

Architecture should leave room for:

- multiple children per family;
- multilingual content;
- adaptive difficulty;
- text-to-speech and narration;
- offline/PWA behavior;
- content authoring tools;
- analytics designed with child privacy constraints;
- optional AI assistance for authors or parents without making AI required for core gameplay.
