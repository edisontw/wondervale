# Prompt & Production Pipeline

## Principle

Wondervale should not depend on hand-written one-off prompts scattered across chats.

Each Episode should have one authoritative **Episode Production Brief**. Prompt packs are derived from that brief and from stable project bibles.

```
Project Bibles
      +
Season / Arc Bible
      +
Episode Production Brief
      ↓
Episode Prompt Pack
      ├── story/script prompt
      ├── image prompts
      ├── animation/scene prompts
      ├── music prompts
      ├── SFX prompts/notes
      ├── voice text export
      ├── engineering implementation prompt
      └── QA/review prompt
```

The large prompt should be generated from structured project context rather than becoming an alternative source of truth.

## Stable context blocks

Prompt generation may pull from stable blocks such as:

- Product Vision;
- Character Bible;
- World Bible;
- visual style bible;
- EFL/language rules;
- learning framework;
- parent-guide rules;
- accessibility rules;
- current world continuity;
- Season/Arc context.

These should be referenced by ID/version where practical.

## Episode Production Brief

The canonical Episode Production Brief specification is [EPISODE_PRODUCTION_BRIEF.md](EPISODE_PRODUCTION_BRIEF.md).

The summary below is only a prompt-pipeline view; the canonical specification takes precedence.

Working sections:

### Identity
- episode ID/title;
- Season/Arc;
- content version;
- estimated duration.

### Story
- episode purpose;
- opening state;
- central problem;
- scene/beat outline;
- resolution;
- continuation hook.

### Character
- participating characters;
- character goals;
- relationship beats;
- knowledge/milestone constraints;
- prohibited inconsistencies.

### Learning
- primary/secondary/revisit/transfer;
- reasoning evidence;
- misconceptions;
- scaffolds.

### EFL
- communicative functions;
- key words/phrases;
- repeated sentence patterns;
- language ceiling;
- pronunciation concerns;
- narration/read-aloud support.

### Interaction
- child actions;
- mechanics;
- failure/recovery;
- parent cues;
- desktop/mobile presentation needs.

### Continuity
- prerequisites;
- canonical events;
- remembered choices/discoveries;
- Chronicle update.

### Assets
- character poses/expressions;
- backgrounds;
- props;
- illustrations;
- animations;
- music;
- SFX;
- voice lines.

### QA
- narrative checks;
- learning checks;
- EFL checks;
- continuity checks;
- accessibility checks;
- runtime smoke cases.

## Prompt pack

Each episode may generate a folder such as:

```
prompts/
  season-01/
    e01/
      00-master-context.md
      10-story-script.md
      20-image-character.md
      21-image-background.md
      22-image-props.md
      30-music.md
      31-sfx.md
      40-voice-script.txt
      50-engineering.md
      60-qa-review.md
```

The exact paths can change after E01 validates the workflow.

## Story/script prompt

Should include:

- relevant character/world canon;
- episode purpose;
- EFL constraints;
- learning intent;
- required beats;
- parent interaction points;
- continuity constraints;
- prohibited shortcuts;
- output format.

The generated script is still reviewed and becomes content source only after approval.

## Image prompt system

Do not write every image prompt from scratch.

Use layered prompt composition:

```
VISUAL_STYLE
+ CHARACTER/LOCATION_CANON
+ EPISODE_STATE
+ SHOT/POSE/ACTION
+ COMPOSITION/UI_CONSTRAINTS
+ NEGATIVE/CONSISTENCY_CONSTRAINTS
```

Separate prompt families:

- character reference/model sheets;
- expressions/poses;
- full scenes;
- reusable locations;
- props;
- storybook illustrations;
- UI/decorative art.

Persistent locations should have base reference art plus episode-specific state overlays/variants when possible.

## Music prompt system

Music often belongs to a **location, character, arc, or mood family**, not a single episode.

Maintain reusable themes such as:

- Wondervale main theme;
- exploration;
- discovery;
- gentle puzzle/thinking;
- mystery;
- success/world-change;
- specific location themes;
- character motifs where justified.

Episode music prompts should usually request a variation or arrangement of an established theme rather than a completely unrelated track.

Music prompts should specify:

- function/mood;
- approximate duration/loopability;
- intensity;
- instrumentation direction;
- age/tone;
- whether dialogue must remain intelligible over it;
- theme/motif reference;
- prohibited traits.

## SFX

Prefer a reusable SFX library for:

- UI confirmation;
- object manipulation;
- discovery;
- page turn;
- environment;
- world-change event.

Episode-specific SFX should be created only when the story needs a distinctive sound.

## Voice production

Voice generation is treated separately from story generation.

The episode build should export a clean voice script containing:

- stable line ID;
- character;
- exact spoken text;
- pronunciation note if needed;
- emotion/intention;
- pace;
- optional pause/emphasis;
- scene reference.

Example:

```
S01E01-MILO-014
Character: Milo
Text: "Wait. Where did the water go?"
Intent: surprised, curious, not frightened
Pace: medium-slow
Pronunciation: none
```

The exact spoken text should be locked before manual voice generation.

## Engineering prompt

A separate implementation prompt should reference:

- approved Episode Brief;
- approved assets;
- interaction specification;
- existing runtime contracts;
- required tests;
- files/components allowed to change.

It should not ask the coding model to invent story content.

## QA/review prompt

Generate an independent review prompt that checks:

- canon consistency;
- character voice;
- EFL suitability;
- learning authenticity;
- parent-child interaction;
- accessibility;
- repetition against recent episodes;
- visual/audio asset completeness;
- continuity event correctness.

## Large prompts vs derived prompts

Use a large prompt only as a **generated context package**.

Do not manually maintain many near-identical giant prompts.

Long-term direction:

```
structured project data
→ prompt builder
→ task-specific prompt
```

This allows a character name, visual rule, or EFL constraint to change once in the source and propagate consistently.

## Prompt reproducibility

Prompt packs should eventually record:

- prompt template version;
- source content version;
- generation date;
- model/tool when relevant;
- resulting asset IDs/paths where useful.

This is especially important for maintaining consistent character/world art across a long series.
