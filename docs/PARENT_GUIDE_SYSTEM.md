# Parent Guide System

## Purpose

The parent is a conversation partner, not an answer key.

Parent guidance should increase the quality of adult-child interaction while adding very little cognitive overhead.

## Before an episode

A short preview may show:

- what the family will explore;
- one or two useful concepts;
- the parent's role;
- anything the parent should deliberately avoid explaining too soon.

Target reading time: under one minute.

The child should normally get a chance to notice, predict, or attempt before the adult is asked to explain a concept.

## During an episode

Use sparse cues. Most episodes should need only a few.

Cue types:

### Predict
Ask before the child acts.

> What do you think will happen?

### Observe
Encourage attention without steering.

> What do you notice?

### Explain
Invite reasoning.

> Why do you think that happened?

### Compare
Connect two observations.

> What changed from the first try?

### Connect
Relate the story to real life.

> Have you seen something like this before?

### Challenge
Open a deeper possibility.

> What could we change to test that idea?

## Cue metadata

A cue should be able to declare:

- stable ID;
- scene/trigger;
- type;
- short prompt;
- importance: optional / recommended / required-for-activity;
- optional follow-up;
- optional fallback.

Example:

```yaml
id: s01e03-cue-02
type: predict
importance: recommended
prompt: "What do you think will happen if we move the rock?"
follow_up: "What makes you think that?"
fallback: "What do you notice about the water beside it?"
```

Only the short prompt needs to interrupt play.

## Design limits

Parent cues should:

- be short;
- appear at meaningful moments;
- not reveal the answer;
- not require specialist knowledge;
- be skippable unless explicitly part of a shared activity;
- not interrupt every interaction;
- avoid making the child wait for adult approval after every decision.

## Parent participation

The core product is parent-guided, but real families will sometimes be interrupted.

Most episodes should degrade gracefully if the adult briefly steps away.

Activities truly requiring two people should announce this clearly.

## Parent and child language

Architecturally separate:

- child-facing story language;
- parent-guide language.

The first version may ship English only, but this keeps future bilingual family use possible without duplicating episode logic.

## After an episode

Offer one optional reflection or real-world extension.

Examples:

- notice water flow at a sink;
- estimate objects before measuring;
- retell the episode from another character's perspective.

Avoid homework framing.

## Parent dashboard later

Possible future functions:

- what the child has encountered;
- concepts being revisited;
- character/world recap;
- suggested conversation starters;
- optional off-screen activities;
- accessibility and reading-support settings.

Do not reduce the dashboard to scores, rank, or percentages.

## Parent feedback

Future parent feedback can be useful when it answers a design question.

Avoid collecting open-ended child data merely because a dashboard can display it.
