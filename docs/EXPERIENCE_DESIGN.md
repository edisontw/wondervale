# Experience Design

## Core relationship

Wondervale is designed for a child and a caring adult using the experience together.

The child directly controls a recurring protagonist inside the story. The adult is a conversation partner and facilitator, not the controller or answer-giver.

## Experience frame

Wondervale uses a **storybook shell + living interactive scenes**.

The storybook shell provides:

- chapter/episode framing;
- transitions and recaps;
- parent preview/reflection;
- the Wondervale Chronicle;
- a stable place to see how the world has changed.

Interactive scenes provide:

- direct protagonist control;
- exploration;
- character conversation;
- object interaction;
- experiments;
- building;
- problem solving;
- visible consequences.

The MVP should use bounded persistent locations rather than attempt a large open world.

## Session rhythm

A typical 12–20 minute Core Episode may use:

1. **Parent preview** — under one minute;
2. **Storybook opening** — re-establish context and motivation;
3. **Enter living scene** — child takes control;
4. **Explore** — allow noticing before explanation;
5. **Talk together** — one concise parent cue when useful;
6. **Try / test / build / solve** — child acts through the protagonist;
7. **Observe consequence** — the world responds;
8. **Connect / deepen** — use or discuss the idea;
9. **Story payoff** — something visibly changes;
10. **Chronicle update** — record a meaningful event/discovery;
11. **Optional reflection** — one short after-play prompt.

This is a rhythm, not a rigid template.

## Player-controlled protagonist

The protagonist is a fully authored recurring character, not a blank avatar.

The child controls:

- movement/exploration;
- object interaction;
- choices and strategies;
- some dialogue choices where useful.

The character retains:

- personality;
- relationships;
- recurring preferences;
- established knowledge;
- visible growth.

This allows agency without requiring every possible player action to become canon.

## EFL-first experience

English is both the primary story language and an important learning medium.

EFL support should preserve story flow:

- short natural sentences;
- meaningful repetition;
- visuals that carry context;
- replayable narration;
- clear demonstration before text-heavy explanation;
- optional tap/inspect support for important words;
- language difficulty separate from reasoning difficulty.

A child should be able to solve a cognitively interesting problem even when the English used to frame it is simple.

Do not turn every scene into explicit vocabulary instruction.

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
2. system reaches a natural thinking moment;
3. parent cue follows or supports the child's focus.

Do not make the adult read an explanation before the child has had a chance to think.

## Reading and language are separate from age

A child's reading ability, spoken English, mathematical thinking, and scientific reasoning can differ substantially.

Do not use one global “age level” as the only difficulty variable.

Future support profiles may include independent dimensions such as:

- reading support;
- English language support;
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
2. repeat/clarify the goal with simpler language if needed;
3. demonstrate the interaction without solving the reasoning;
4. draw attention to a relevant feature;
5. narrow possibilities;
6. model one reasoning step;
7. reveal enough to continue.

Language support and problem-solving support should be distinguishable. A child who does not understand a sentence should not automatically receive the solution to the problem.

## Failure

Prefer recoverable consequences:

- something bends, spills, slows, or fails;
- a character reacts;
- new evidence appears;
- another attempt becomes possible.

Avoid shame, loud failure effects, loss of accumulated progress, or arbitrary penalties.

## Reward and progression

The main reward is diegetic progression:

- the world changes;
- the story moves;
- characters remember;
- locations gain functions;
- new possibilities appear.

The **Wondervale Chronicle** (working name) serves as a low-pressure secondary reward and memory system.

It may show:

- illustrated story moments;
- location changes;
- discoveries;
- character milestones;
- useful words/phrases encountered;
- open mysteries.

Avoid turning the Chronicle into points, ranks, streaks, or completion pressure.

## Pacing

Do not optimize for maximum interaction density.

Children need time to:

- inspect;
- move around;
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

## Accepted desktop and mobile RPG dialogue grammar (2026-10-09)

Wondervale's accepted dialogue baseline is **scene-first, with an integrated bottom RPG dialogue dock** rather than a long scrolling page or a separate generic chat card. Render a *single, isolated portrait of the current speaker* to the left of readable, selectable, replayable narration/text; identify the speaker with a clear nameplate. Use real accessible buttons (Continue, Read again, optional non-critical Skip), not baked-in buttons in scenery. The introduction explains how to start **only on the initial preview**, then disappears on Begin; required opening lines still advance one at a time, without Skip introduction.

Responsive treatments are **distinct rather than scaled screenshots**: on desktop place the wide story panel along the lower edge of the active scene and keep a quieter side-by-side Parent View; on mobile place a compact portrait/text panel near the scene's lower edge, keep the approved Town Square artwork and characters in frame, place touch-sized actions on their own row, and retain separate Child / Parent views. Prevent other characters bleeding into cropped portraits. Keep the scene, map and controls in a bounded viewport, with overflow scoped to necessary internal content. Reuse this grammar in later episodes without importing example mockup currencies/menus/lore. See [E01 exact implementation and owner feedback](E01_RPG_DIALOGUE_UI_2026-10-09.md).
