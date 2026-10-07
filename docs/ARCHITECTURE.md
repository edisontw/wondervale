# Architecture

## Goal

Build a content-driven web application whose story world can grow for years without embedding episode logic directly into presentation code.

The architecture should optimize first for:

1. content quality and authoring speed;
2. continuity correctness;
3. accessibility;
4. easy deployment/migration;
5. future cloud features without requiring them now.

## Logical layers

```
Authoring Sources
      ↓
Content Compiler / Validators
      ↓
Compiled Runtime Manifest
      ↓
Story Runtime
      ↓
Activity Runtime
      ↓
Presentation
      ↕
Progress/Event Ledger
      ↓
Derived Continuity + Learning State
```

Learning and continuity are related to the story runtime but should not be hidden inside UI components.

## Static-first MVP

The first playable version should be capable of running as static web assets:

- content compiled at build time;
- interactive runtime in the browser;
- local progress persistence;
- no mandatory application server;
- no account required.

A framework such as Next.js with static output can still be used. The important architectural decision is that Episode 01 must not depend on server state.

When cloud synchronization or accounts become justified, add backend services behind explicit interfaces rather than redesigning the story engine.

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
  content/
schemas/
tests/
public/
  characters/
  scenes/
  objects/
  audio/
docs/
```

## State separation

Keep these distinct:

1. **authored canon** — immutable intent of published story content;
2. **progress/event ledger** — completed episodes and meaningful recorded choices/discoveries;
3. **derived world/character state** — reconstructed from canon + ledger;
4. **session state** — current scene/activity/checkpoint;
5. **UI state** — menus, animations, transient component state.

Derived state may be cached but must be rebuildable.

## Progress persistence

### Prototype / early MVP

Store a versioned local save containing only what is needed:

- completed episodes;
- meaningful choice/discovery events;
- accessibility/support preferences;
- optional current checkpoint.

### Later

Cloud profiles may synchronize the same conceptual ledger.

Do not make cloud storage a different source-of-truth model.

## Content compiler

Build-time tools should validate:

- schemas;
- stable references;
- episode dependency graph;
- learning references;
- continuity events;
- parent cues;
- asset references;
- accessibility/localization requirements.

The compiler should output runtime-friendly content and fail the build on structural errors.

## Activity runtime

The Activity Runtime should implement reusable mechanics, not hard-code learning topics.

Examples:

- explore;
- inspect/search;
- sort;
- sequence;
- build;
- measure;
- map;
- simulate;
- choose;
- listen;
- talk-together.

Episode data determines context, assets, learning intent, and scaffolding.

## Support profiles

Do not bind all challenge to one age level.

Architecture should allow independent future settings such as:

- reading support;
- language support;
- mathematical challenge;
- reasoning scaffolding;
- motor/accessibility preferences;
- narration.

The MVP may expose only a small subset.

## Localization

Treat child-facing and adult-facing language as separate content channels.

Do not build localization around replacing strings embedded inside React components.

## Testing layers

### Schema tests
Invalid content should fail before runtime.

### Continuity tests
Rebuild a world from representative ledgers and verify expected state.

### Episode smoke tests
Every episode can start, progress, and finish.

### Accessibility interaction tests
Critical interactions must not depend on a single inaccessible input method.

### Human validation
Parent-child testing remains necessary; automated tests cannot validate delight, conversation quality, or educational meaning.

## Future-compatible areas

Leave room for:

- multiple children per family;
- cloud synchronization;
- multilingual content;
- adaptive support;
- text-to-speech and narration;
- offline/PWA behavior;
- content authoring tools/CMS;
- privacy-preserving analytics;
- optional AI assistance for authors or parents.

None of these should be required to make the first complete episode work.
