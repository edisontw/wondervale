# Experience Design

## Core relationship

Wondervale is designed for a child and a caring adult using the experience together.

The adult is a conversation partner and facilitator. The child should retain agency over exploration and decisions.

## Session rhythm

A typical 12–20 minute Core Episode may use:

1. **Parent preview** — under one minute;
2. **Story hook** — establish a meaningful problem;
3. **Explore** — allow noticing before explanation;
4. **Talk together** — one concise prompt;
5. **Try / test / build / solve** — child acts;
6. **Observe consequence** — the world responds;
7. **Connect / deepen** — use or discuss the idea;
8. **Story payoff** — something visibly changes;
9. **Optional reflection** — one short after-play prompt.

This is a rhythm, not a rigid template.

## Parent participation levels

Each parent cue should declare how important adult participation is:

- **optional** — useful enrichment;
- **recommended** — important to the intended experience;
- **required-for-activity** — rare; the activity explicitly depends on conversation or shared action.

The child should not become trapped because the adult stepped away unless the experience clearly announced a shared activity.

## Parent cue structure

A cue may contain:

- short prompt;
- intent;
- optional follow-up if the child responds;
- optional fallback if the child says “I don't know.”

Example:

```yaml
type: predict
prompt: "What do you think will happen if we move this rock?"
follow_up: "What makes you think that?"
fallback: "What do you notice about the water near the rock?"
importance: recommended
```

Only the short prompt needs to appear during play.

## Child-led first

When possible:

1. child notices or acts;
2. system observes the relevant moment;
3. parent cue follows or supports the child's focus.

Do not make the adult read an explanation before the child has had a chance to think.

## Reading and language are separate from age

A child's reading ability, spoken English, mathematical thinking, and scientific reasoning can differ substantially.

Do not use one global “age level” as the only difficulty variable.

Future support profiles may include independent dimensions such as:

- reading support;
- language support;
- number challenge;
- reasoning challenge;
- motor/accessibility preferences.

## Read-aloud support

Child-facing story text should be able to support narration/read-aloud without making audio mandatory.

Important text and instructions should not exist only in audio.

## Child and adult language

Keep child-facing locale and parent-guide locale technically separable.

This allows future cases such as:

- English story + English parent guide;
- English story + Traditional Chinese parent guide;
- localized story + parent guide in another family language.

The first release may still ship only English.

## Help and scaffolding

Use graduated support rather than immediate answers.

Example ladder:

1. allow exploration;
2. repeat/clarify the goal;
3. draw attention to a relevant feature;
4. narrow possibilities;
5. model one step;
6. reveal enough to continue.

A hint should preserve as much thinking as possible.

## Failure

Prefer recoverable consequences:

- something bends, spills, slows, or fails;
- a character reacts;
- new evidence appears;
- another attempt becomes possible.

Avoid shame, loud failure effects, loss of accumulated progress, or arbitrary penalties.

## Pacing

Do not optimize for maximum interaction density.

Children need time to:

- inspect;
- talk;
- laugh;
- predict;
- change their mind;
- remember earlier events.

Some scenes can exist mainly for story or atmosphere.

## Ending

A strong episode ending should usually do at least two things:

- provide a satisfying local resolution;
- leave a small unanswered question, changed world detail, or future possibility.

This creates continuation without cliffhanger pressure.
