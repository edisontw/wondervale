# Accessibility, Privacy & Safety Baseline

## Accessibility is part of content design

Wondervale targets young children with widely varying reading, attention, motor, sensory, and language abilities.

Accessibility should be designed before Episode 01 rather than added after content production.

## Interaction baseline

- large, clearly recognizable controls;
- consistent placement and behavior;
- touch, mouse, and keyboard where practical;
- no color-only instructions;
- no precision dragging when an easier alternative is possible;
- no rapid reaction requirement unless an accessible alternative exists;
- generous time by default;
- reduced-motion support;
- pause/replay for narration and animation;
- clear recovery from accidental actions.

## Representation

Important ideas should be able to use more than one representation when useful:

- text;
- speech;
- illustration;
- animation;
- manipulable objects;
- diagrams;
- simulation.

Do not overload every scene with all modalities at once.

## Reading support

- concise child-facing sentences;
- meaningful illustrations;
- optional read-aloud;
- replayable audio;
- captions/transcripts for meaningful audio;
- adjustable text presentation where feasible;
- avoid embedding essential text inside images.

## Cognitive accessibility

- consistent controls;
- clear next action;
- minimal competing UI;
- predictable navigation;
- limited simultaneous instructions;
- visible cause and effect;
- no unnecessary countdowns;
- no punishment for taking time.

## Child-facing safety

The early product should avoid:

- open chat;
- user-generated public content;
- unrestricted links;
- social messaging;
- public profiles;
- behavioral advertising;
- manipulative purchase prompts;
- open-ended generative AI conversations with children.

External links and administrative settings should be in an adult context or behind an appropriate parent gate.

## Data minimization

The early MVP should work without:

- child name;
- email address;
- date of birth;
- precise location;
- microphone recordings stored on a server;
- advertising identifiers;
- third-party behavioral analytics.

Use local progress where possible.

## Logs and analytics

Public hosting infrastructure can create logs even when the application has no accounts.

Before public launch:

- review what web server/proxy logs contain;
- minimize fields and retention;
- avoid unnecessary third-party scripts;
- document any analytics introduced later;
- perform a child-privacy review before collecting persistent identifiers or behavioral data.

## Parent controls

Adult-facing settings may eventually include:

- audio/narration;
- reading support;
- difficulty/support preferences;
- reduced motion;
- progress reset/export;
- language;
- privacy choices.

## Content safety

Stories may contain mild uncertainty, mistakes, disappointment, or conflict, but should not rely on fear, humiliation, coercion, or addictive reward pressure.

## Review requirement

Any later introduction of accounts, cloud profiles, voice capture, AI conversation, payments, advertising, social functions, or third-party analytics requires a fresh privacy/safety review before implementation.
