# Content Versioning & State Model

## Goal

Wondervale content will change while families have existing progress.

A content update must not corrupt continuity, replay history, or future cloud synchronization.

## Stable identifiers

Once published, stable IDs should not be casually reused or renamed.

Examples:

- season ID;
- arc ID;
- episode ID;
- scene ID;
- character ID;
- location ID;
- skill ID;
- canonical event ID;
- meaningful choice ID.

Titles and displayed text may change without changing stable identity.

## Version fields

Content packages should eventually expose:

- `schemaVersion` — structure understood by the runtime;
- `contentVersion` — authored content release;
- per-episode revision metadata where useful.

## Store events, derive state

Prefer storing a compact progression/event ledger:

```
episode_completed:s01e01
episode_completed:s01e02
choice:s01e03:route=north
discovery:s01e03:old_sign
```

Then derive current world/character state from:

1. canonical content rules;
2. completed episode events;
3. meaningful choice/discovery events.

Do not make a mutable blob such as `groceryStore=open` the only source of truth.

A derived state snapshot may be cached for performance, but should be rebuildable.

## Why derived state matters

It makes these cases safer:

- replaying old episodes;
- restoring local progress;
- syncing to a future account;
- moving hosting;
- fixing an incorrect world effect;
- adding a new callback;
- migrating old content versions.

## Replay

Replay should run in a historical/story mode and should not duplicate canonical completion events.

Optional discoveries may be recorded according to explicit rules, but replay must not roll the present world backward.

## Choice scope

Classify choices:

- **ephemeral** — affects only the current scene;
- **episode-local** — changes later moments in the episode;
- **remembered** — can be referenced later but does not fork canon;
- **canonical branch** — changes future story structure.

Canonical branches should be rare and explicit.

## Dependency graph

Core Episode prerequisites form a directed graph.

Build-time validation should detect:

- missing prerequisite IDs;
- cycles;
- unreachable episodes;
- impossible state requirements;
- conflicting canonical effects.

## Content migration

If published content changes incompatibly:

1. preserve old stable IDs when meaning is still equivalent;
2. provide a migration from old event/state forms;
3. test progress from representative old versions;
4. never silently reinterpret a child's major remembered choice as something different.

## Local save format

The MVP save should contain only what is necessary, for example:

- save format version;
- completed episode IDs;
- meaningful choice/discovery events;
- accessibility/support preferences;
- current navigation checkpoint if needed.

Avoid storing derived data redundantly unless it is disposable cache.

## Build artifacts

Human-friendly authoring files do not need to be identical to runtime files.

A future content pipeline may:

```
authoring source
→ schema validation
→ continuity/learning lint
→ localization checks
→ compiled runtime manifest
→ application bundle
```

This separation keeps future CMS or authoring tools possible without rewriting the player.
