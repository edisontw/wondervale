# World & Continuity Model

Wondervale is a persistent story world. Continuity is a first-class system, not a writing afterthought.

## Three kinds of state

### 1. Canon state
Facts that become true in the official story timeline.

Examples:
- a bridge is repaired;
- a new grocery store opens;
- a river changes course;
- a character joins the main group.

Canon state is episode-defined and should remain consistent in later content.

### 2. Character state
What recurring characters know, believe, remember, can do, and how their relationships have changed.

Examples:
- a character learns to test before making a conclusion;
- two characters become friends after resolving a disagreement;
- a character remembers an object found several episodes earlier.

### 3. Player progression state
What this child/family has completed or unlocked.

This is derived from episode progress and should remain separate from canon authoring data.

## Episode effects

Each episode may declare explicit effects such as:

```yaml
effects:
  world:
    - set: places.riverside_bridge.status
      value: repaired
    - unlock: places.riverside_market
  characters:
    - character: milo
      add_knowledge: waterwheel_needs_flow
    - character: abby
      relationship:
        with: milo
        change: trust_plus_one
```

The exact schema may evolve, but continuity effects must remain machine-readable.

## Preconditions

Later content can require earlier facts:

```yaml
requires:
  - world.places.riverside_bridge.status == repaired
  - character.milo.knowledge includes waterwheel_needs_flow
```

This supports callbacks without hard-coding continuity into UI components.

## Timeline

Maintain a canonical timeline containing:

- first appearance of each character;
- introduction or removal of locations;
- important world changes;
- learned character knowledge;
- unresolved mysteries;
- callbacks and payoffs;
- major learning concepts introduced and revisited.

## Growth should be visible but restrained

Characters should change enough to feel alive, but not so rapidly that they become unfamiliar.

The world should also evolve gradually:

- a vacant lot becomes a store;
- a repaired path opens a new district;
- seasonal decorations appear;
- an old building gets a new function;
- an NPC changes job or routine.

Small changes create continuity more effectively than constant dramatic transformations.

## Replay rule

Replaying an earlier episode should not rewrite the current canonical state. Replay is treated as revisiting a story memory.

## Authoring rule

No episode may introduce a persistent world or character change only in prose. Any fact expected to matter later must be recorded in structured continuity metadata.
