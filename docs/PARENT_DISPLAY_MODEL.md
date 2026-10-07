# Parent / Child Display Model

## Principle

Parent guidance should be available at the moment it helps without making the child feel that play repeatedly stops for an adult lesson.

Wondervale therefore uses different presentation strategies for large shared screens and phones.

## Desktop / large-screen shared mode

Default layout:

```
┌──────────────────────────────────┬───────────────┐
│                                  │               │
│       CHILD EXPERIENCE           │ PARENT GUIDE  │
│       ~70–75% width              │ ~25–30%       │
│                                  │               │
└──────────────────────────────────┴───────────────┘
```

The child experience remains dominant.

The parent panel may show:

- current short cue;
- why it is useful (optional expandable detail);
- optional follow-up/fallback;
- episode progress/context;
- upcoming shared-action notice.

Rules:

- no answer spoilers;
- no long teacher notes during active play;
- visually quieter than the child scene;
- cue changes should be synchronized with natural story/interaction moments;
- panel may collapse if the family wants more game space.

For tablets in landscape, test this mode when width permits.

## Mobile

Mobile prepares two coordinated views rather than squeezing both onto one screen.

### Child View

Primary play surface.

Contains:

- story/interactive scene;
- narration controls;
- child instructions;
- minimal indicator when a parent cue is available.

It should not display the full parent explanation.

### Parent View

A dedicated parent-facing view for the same episode/session.

Contains:

- <1 minute preview;
- current cue;
- follow-up/fallback;
- brief context;
- optional reflection;
- accessibility/language settings where appropriate.

The first implementation can support rapid same-device switching.

Future options may include:

- parent opens Parent View on a second phone;
- QR/deep link to the current episode parent guide;
- synchronized cue state across devices once cloud/session sync exists.

Second-device support is not required for E01.

## Same-phone switching

Prototype a low-friction adult entry that does not look like a game button the child is expected to press.

Possible implementation:

- small “For grown-ups” control;
- press-and-hold;
- simple parent gate when entering settings or sensitive actions.

For ordinary cue viewing, avoid cumbersome math gates or passwords that interrupt family interaction.

A prominent **Back to Child View** action should return immediately.

## Cue notification

A cue should not take over the child's screen.

Possible signal:

- subtle parent icon;
- gentle edge pulse;
- short label such as “Grown-up cue” at a natural pause.

No audio alarm is needed.

## Content requirement

Each parent cue must be safe to expose visually to the child.

The cue may guide the adult's questioning, but must not contain a hidden answer that would spoil the child's reasoning if they read it.

## E01 validation

E01 should prototype and compare at least:

1. desktop split-screen;
2. mobile Child View ↔ Parent View switching.

Observe:

- whether the parent notices cues;
- whether the child reads/gets distracted by the parent panel;
- whether switching feels burdensome;
- whether the adult starts controlling the task;
- whether prompts cause genuine conversation.
