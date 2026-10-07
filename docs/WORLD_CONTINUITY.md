# World & Continuity Model

Wondervale is a persistent story world. Continuity is a first-class system, not a writing afterthought.

## Separate canon, events, and derived state

### 1. Authored canon
The official story rules and facts published in content.

Examples:

- the Riverside Bridge exists;
- Episode S01E05 canonically repairs it when completed;
- a grocery store opens after a specific story event;
- a character joins the recurring cast at a defined point.

Canon is authored content, not a player's save file.

### 2. Progress / event ledger
The minimal record of what this family has completed or meaningfully chosen.

Examples:

- `episode_completed:s01e05`
- `choice:s01e06:plan=share_water`
- `discovery:s01e07:old_map_mark`

### 3. Derived world and character state
The runtime reconstructs the current state from canon plus the event ledger.

Examples:

- Riverside Bridge = repaired;
- grocery store = open;
- Milo remembers testing the waterwheel;
- a later callback is eligible.

A cached snapshot is allowed for speed but should not be the only source of truth.

## Why this separation matters

It keeps these situations consistent:

- replaying an earlier episode;
- changing devices later;
- migrating local progress to a future account;
- correcting content effects;
- adding later callbacks;
- rebuilding a save after schema changes.

## Canonical events

Persistent story changes should have stable IDs.

Example authoring form:

```yaml
effects:
  canonical_events:
    - id: riverside_bridge_repaired
      consequences:
        - place: riverside_bridge
          state: repaired
        - unlock: riverside_market

  character_milestones:
    - character: milo
      id: learned_to_test_before_concluding
```

The runtime stores completion/milestone events and derives the consequences.

## Preconditions

Later content may require:

- completion of an earlier Core Episode;
- a canonical event;
- a remembered discovery;
- a defined support/availability condition.

Use structured references where possible rather than arbitrary executable expressions.

Example:

```yaml
requires:
  episodes_completed:
    - s01e05
  canonical_events:
    - riverside_bridge_repaired
```

## Timeline

Maintain a canonical timeline containing:

- first appearance of each character;
- Story Arc boundaries;
- location introductions and state changes;
- character milestones;
- important objects;
- unresolved mysteries;
- callbacks and payoffs;
- learning concepts introduced, revisited, and transferred.

## Character continuity

Track meaningful state, not every line of dialogue.

Useful categories include:

- knows / discovered;
- believes;
- learned strategy;
- remembers shared event;
- relationship milestone;
- current goal;
- unresolved concern.

Characters should not become omniscient merely because a later episode needs an explainer.

## Growth should be visible but restrained

Characters should change enough to feel alive but retain a recognizable stable core.

The world should also evolve gradually:

- a vacant lot becomes a store;
- a repaired path opens a new district;
- seasonal decorations appear;
- an old building gains a new function;
- an NPC changes routine or responsibility.

Small persistent changes create continuity more effectively than constant dramatic transformations.

## Choice policy

Classify choices:

- **ephemeral** — current scene only;
- **episode-local** — later moments in the same episode;
- **remembered** — may be referenced later without changing the main canon path;
- **canonical branch** — creates different future story structure.

Early Wondervale should prefer the first three. Canonical branching should be rare because every branch multiplies writing, continuity, learning, asset, and test requirements.

## Replay rule

Replaying an earlier episode is a story-memory mode.

It must not:

- roll the current world backward;
- duplicate canonical completion events;
- erase later character growth.

A replay may record optional discoveries only when explicitly allowed.

## Skipping and order

Core Episodes may be mostly chronological while Side Stories and Free Explore content can be optional.

Any required prerequisite must be visible to the content graph so the runtime can determine reachability.

## Authoring rule

No persistent world/character fact that will matter later may exist only in prose.

If a later episode needs to remember it, it needs a structured stable ID.
