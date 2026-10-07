# Episode Production Brief — Standard

## Purpose

The **Episode Production Brief (EPB)** is the single human-readable contract for taking one approved episode from Season/learning architecture into downstream production.

It sits between upstream design and downstream artifacts:

```
Product / character / world canon
+ Season story architecture
+ Season learning weave
        ↓
Episode Production Brief
        ↓
detailed script
interaction specification
prompt pack
visual / audio / voice production
implementation
QA
```

A downstream task may elaborate the brief but must not silently redefine it.

If production exposes a real conflict, update and re-approve the brief before treating the new decision as canon.

## What the brief locks

An approved brief should lock enough information that another person/model can continue without inventing:

- why the episode exists;
- what must happen narratively;
- what the child meaningfully does;
- what learning/reasoning the episode requires;
- what EFL functions must be supported;
- where parent participation is useful;
- what continuity enters and leaves the episode;
- what visible/audio assets are required;
- what must be tested;
- what is deliberately still open downstream.

The brief is **not** the screenplay, art prompt pack, audio file list, or code specification.

## Brief lifecycle

Use one of these statuses:

- **draft** — unresolved design questions remain; downstream production should not begin;
- **approved_for_script** — story, learning, interaction intent, continuity, and production requirements are stable enough to write the detailed script;
- **production_ready** — approved script/interaction references and final production requirements have been attached;
- **superseded** — replaced by a later brief revision.

For E01, the first required gate is **approved_for_script**.

## Stable identity

Once an episode enters production, do not casually rename stable IDs.

Display titles may change without changing the episode identity.

Recommended identity block:

```yaml
episode_id: s01e01
season_id: s01
arc_id: s01a01
brief_revision: 1
brief_status: draft
content_version: pre-release
estimated_duration_min: 12
estimated_duration_max: 20
```

# Required brief structure

## 1. Identity and upstream sources

Record:

- episode ID;
- working/display title;
- Season / Story Arc;
- brief revision/status;
- estimated duration;
- canonical upstream documents;
- directly relevant locked decisions;
- unresolved questions allowed to remain downstream.

Do not paste entire foundation documents into the brief. Reference them and copy only episode-specific constraints.

### Template

```markdown
## Identity

- Episode ID:
- Working title:
- Season / Arc:
- Brief revision:
- Status:
- Estimated duration:

### Upstream canon
- Season architecture:
- Season learning weave:
- Character/world constraints:
- Other required sources:

### Explicitly open
-
```

## 2. Episode contract

This section answers why the episode exists even without educational labels.

Required fields:

- story purpose;
- opening state;
- central problem;
- local stakes;
- resolution;
- world/story consequence;
- continuation hook or future possibility;
- non-goals.

The non-goals prevent downstream work from adding attractive but out-of-scope content.

### Template

```markdown
## Episode contract

### Story purpose
...

### Opening state
...

### Central problem
...

### Local stakes
...

### Resolution
...

### Consequence
...

### Continuation hook
...

### Non-goals
- ...
```

## 3. Character contract

For every important character in the episode, specify only what production must preserve.

Include:

- current goal;
- relevant knowledge/belief entering the episode;
- emotional/relationship beat;
- meaningful mistake or change, if any;
- knowledge/milestone leaving the episode;
- prohibited inconsistency.

Do not restate the entire character bible.

### Template

| Character | Enters knowing/wanting | Episode beat | Leaves with | Must not do |
|---|---|---|---|---|
| Milo |  |  |  |  |
| Nia |  |  |  |  |
| Finn |  |  |  |  |

## 4. Scene / beat map

The brief defines **scene jobs and required beats**, not final dialogue.

Every scene should have a stable working ID before implementation.

Recommended columns:

| Scene ID | Mode | Location/state | Story job | Child goal/action | Required beat | Exit condition |
|---|---|---|---|---|---|---|

Suggested modes:

- storybook;
- living scene;
- transition;
- Chronicle;
- parent preview/reflection.

A scene may exist mainly for atmosphere, humor, relationship, or observation. Do not require every scene to contain an activity.

### Scene rules

- Keep one clear reason for each scene.
- Do not specify camera shots or asset prompts unless essential to the story/interaction contract.
- Avoid locking incidental dialogue before the detailed script stage.
- Mark optional discoveries separately from required progression.

## 5. Interaction contract

For each substantial interaction, define what the child is **thinking** separately from what the interface asks the child to **do**.

### Required fields

- interaction ID;
- scene;
- story reason;
- cognitive action;
- player action/mechanic;
- information available before acting;
- valid strategies/choices;
- world feedback;
- failure/recovery;
- scaffold entry points;
- accessibility alternatives;
- completion evidence.

### Template

```markdown
### Interaction <ID>

- Story reason:
- Cognitive action:
- Player action:
- Information available:
- Valid strategies:
- World feedback:
- Failure/recovery:
- Scaffold entry:
- Accessibility alternative:
- Evidence of completion/thinking:
```

### Interaction rules

- Do not make UI dexterity the hidden learning objective.
- Avoid precision/time pressure unless it has an accessible alternative.
- Failure should reveal information, create a recoverable consequence, or permit another attempt.
- Strategy choices may vary without creating uncontrolled canonical branches.
- If the parent steps away, the episode should normally remain playable.

## 6. Learning contract

Pull directly from the approved Season learning weave.

Include:

- primary goals: normally 1–2;
- secondary learning;
- revisit;
- transfer;
- misconception/incomplete-model hypotheses;
- evidence of thinking;
- where the world provides feedback;
- what must **not** be reduced to a quiz.

### Template

```markdown
## Learning

### Primary
1.
2.

### Secondary
-

### Revisit / transfer
- Earlier source:
- New context/purpose:

### Misconception hypotheses
-

### Meaningful evidence of thinking
-

### World feedback
-

### Avoid
-
```

Do not add a subject-area objective simply to balance curriculum coverage.

## 7. EFL / language-access contract

EFL requirements must support the same reasoning rather than replace it.

Record:

- communicative functions;
- comprehension-critical language;
- likely reusable phrases/patterns;
- new vocabulary candidates;
- language that can remain visual/nonverbal;
- read-aloud/narration needs;
- pronunciation risks;
- language-support options;
- content that must remain cognitively challenging even when simplified linguistically.

Exact vocabulary counts, sentence-length ceiling, translation policy, and E01 language band are resolved during E01 design.

### Template

```markdown
## EFL / language

- Communicative functions:
- Comprehension-critical language:
- Reusable patterns:
- New-word candidates:
- Can be communicated visually:
- Narration/read-aloud needs:
- Pronunciation notes:
- Language support:
- Reasoning that must not be simplified away:
```

## 8. Parent guidance contract

The brief identifies **moments and intent**. Final cue wording may be refined during E01 production.

For each proposed cue:

- stable cue ID;
- scene/trigger;
- type: predict / observe / explain / compare / connect / challenge;
- intent;
- importance: optional / recommended / required-for-activity;
- draft short prompt;
- optional follow-up;
- optional fallback;
- what the parent should avoid revealing;
- child-alone fallback behavior.

### Template

| Cue ID | Trigger | Type | Importance | Intent | Draft prompt | Do not reveal |
|---|---|---|---|---|---|---|

Rules:

- use sparse cues;
- child normally notices/predicts/tries first;
- do not require specialist adult knowledge;
- cue text must be safe for the child to see;
- required-for-activity should be rare;
- provide a child-alone path unless two-person participation is essential and announced.

## 9. Scaffolding and recovery

Keep four support dimensions separate:

### Language support
Helps the child understand words/instructions without solving the reasoning.

### Interaction support
Shows how to use the interface without giving the strategy.

### Reasoning support
Gradually draws attention to evidence or narrows possibilities.

### Accessibility support
Provides alternate input/presentation or reduced-motion/time-pressure behavior.

Use a graduated ladder where useful:

1. free exploration/retry;
2. clarify goal;
3. demonstrate control;
4. draw attention to a relevant feature;
5. narrow possibilities;
6. model one reasoning step;
7. reveal enough to continue.

The brief should identify where the ladder may be needed, not write every final hint unless already known.

## 10. Continuity contract

No persistent fact may exist only in prose.

Specify:

### Preconditions
- required completed episode(s);
- canonical event(s);
- relevant remembered discovery/choice;
- required location/character state.

### Episode effects
- canonical events;
- location state changes;
- character milestones;
- relationship milestones;
- discoveries;
- remembered choices;
- mystery state changes;
- unlocks.

### Choice scope
Every meaningful choice must be classified:

- ephemeral;
- episode-local;
- remembered;
- canonical branch.

Canonical branches should be rare and explicit.

### Replay behavior
State whether replay may add optional discoveries and confirm that replay cannot roll back current world state or duplicate canonical completion events.

### Stable-ID template

```yaml
requires:
  episodes_completed: []
  canonical_events: []

effects:
  canonical_events: []
  character_milestones: []
  discoveries: []
  remembered_choices: []
  unlocks: []
```

Final IDs must be checked against the content model before implementation.

## 11. Chronicle contract

Specify what the Wondervale Chronicle should remember after the episode.

Possible elements:

- event page;
- before/after location state;
- discovery;
- character milestone;
- resolved/open mystery;
- meaningful keepsake;
- contextual word/phrase;
- optional family reflection.

The Chronicle must remain story memory, not a scorecard.

### Template

```markdown
## Chronicle update

- Main memory:
- Visual before/after:
- Discovery/mystery:
- Character milestone:
- Optional language memory:
- Future callback value:
```

## 12. Visual production requirements

This is an **asset requirement inventory**, not final image prompts.

Separate:

- existing reusable assets;
- required state variants;
- new character poses/expressions;
- new locations/backgrounds;
- props;
- storybook illustrations;
- UI/decorative elements;
- animation needs;
- persistent before/after states.

For each new visual requirement, state:

- narrative/interaction function;
- persistence/reuse value;
- required continuity state;
- composition/UI constraints if essential;
- accessibility requirement such as not relying on color alone.

Do not generate art before the relevant art-direction inputs are approved.

## 13. Audio / music / SFX requirements

Specify function before generation.

### Music

Prefer reusable theme/location/arc families.

Record:

- scene/function;
- mood;
- intensity;
- loop/transition need;
- dialogue-underlay requirement;
- reusable motif/theme reference;
- silence where preferable.

### SFX

Identify:

- reusable library sounds;
- distinctive episode-specific sounds;
- sounds that carry story information and therefore need visual/text alternatives.

Do not create unique SFX merely to fill every interaction.

## 14. Voice / narration requirements

The initial Episode Production Brief comes **before** the detailed script.

Therefore it locks:

- which content classes should be voiced;
- characters/narrator involved;
- tone/intention requirements;
- replay/caption requirements;
- pronunciation risks;
- line-ID convention;
- export format.

It does **not** contain the final line-by-line voice script at the `approved_for_script` stage.

After the detailed script is approved, the episode may reference/export a voice script containing:

```text
Line ID
Character
Exact spoken text
Scene
Intent/emotion
Pace
Pronunciation note
Pause/emphasis note
```

Exact spoken text must be locked before manual voice production.

## 15. Accessibility, privacy, and safety requirements

Every episode brief must explicitly check the episode-specific implications of the project baseline.

At minimum:

- no essential color-only cue;
- no essential audio-only information;
- no unnecessary precision input;
- no unnecessary rapid reaction/countdown;
- pause/replay where relevant;
- reduced-motion handling for important animation;
- clear recovery from accidental action;
- readable/voiced support for essential child-facing text;
- no new personal-data collection unless separately reviewed;
- no external child-facing links/chat/social behavior;
- mild tension without fear, humiliation, coercion, or addictive pressure.

Write `baseline only — no episode-specific exception` when no special requirement exists.

## 16. Production asset / artifact manifest

Before production starts, list expected outputs by category and ownership.

Example:

| Artifact | Required? | Source/owner | Status | Notes |
|---|---|---|---|---|
| detailed script | yes | Narrative | pending |  |
| interaction spec | yes | Episode Assembly/Engineering | pending |  |
| image prompt pack | as needed | Visual | pending |  |
| music brief/prompt | as needed | Audio | pending |  |
| SFX list | as needed | Audio | pending |  |
| voice export | yes if voiced | Audio | pending | after script lock |
| implementation | yes | Engineering | pending |  |
| QA review | yes | QA | pending |  |

This manifest prevents missing downstream deliverables without turning the EPB into those deliverables.

## 17. QA and acceptance contract

Define episode-specific pass conditions before implementation.

Required QA categories:

### Narrative
- required story beats present;
- no canon/character contradiction;
- local problem resolves coherently;
- continuation is understandable without cliffhanger pressure.

### Learning
- activity requires the intended thinking;
- evidence of thinking is observable;
- scaffold preserves reasoning;
- revisit/transfer is genuinely different from the earlier context.

### EFL
- child can understand enough to act;
- language support does not reveal the reasoning;
- important language is contextual/reusable;
- text/audio support follows project baseline.

### Parent experience
- cues are sparse and non-spoiling;
- parent role is clear;
- child can recover if adult briefly steps away.

### Interaction/accessibility
- controls communicate affordance;
- input alternatives work where required;
- no precision/reaction barrier is accidental;
- failure/recovery works;
- reduced-motion/audio/text equivalents are respected.

### Continuity
- prerequisites/effects use stable IDs;
- persistent changes are structured;
- replay cannot corrupt current state;
- callbacks align with prior canon.

### Runtime smoke cases
Define only the cases needed by this episode, such as:

- fresh start;
- normal completion;
- pause/resume;
- retry after failure;
- replay after later progress;
- optional discovery present/absent;
- remembered choice variants when applicable.

## 18. Approval gate

Before marking the brief `approved_for_script`, verify:

- [ ] story purpose and resolution are stable;
- [ ] required character beats are stable;
- [ ] scene jobs are sufficient for scripting;
- [ ] substantive child interactions have a cognitive reason;
- [ ] Season learning weave is represented without overload;
- [ ] EFL functions are identified without prematurely fixing the full language band;
- [ ] parent participation moments are sparse and purposeful;
- [ ] continuity prerequisites/effects are explicit;
- [ ] persistent changes have or will receive stable IDs;
- [ ] Chronicle update is defined;
- [ ] asset requirements are known well enough to estimate production;
- [ ] voice/audio requirements do not depend on unwritten final dialogue;
- [ ] accessibility/safety constraints are considered;
- [ ] QA pass conditions are specified;
- [ ] intentionally open downstream decisions are listed.

# Downstream authority rule

After the EPB is approved:

- the **EPB** is authoritative for episode intent, constraints, required beats, learning, continuity, and production requirements;
- the **approved detailed script** is authoritative for exact dialogue/narration;
- the **approved interaction specification** is authoritative for exact interaction behavior;
- the **approved asset references** are authoritative for generated/selected media;
- runtime manifests are compiled implementation artifacts, not new story canon.

If two downstream artifacts conflict, resolve the conflict against the EPB/upstream canon rather than letting implementation silently choose.

# What not to put in the initial brief

Do not require the initial `approved_for_script` brief to contain:

- final screenplay dialogue;
- final voice lines;
- final image-generation prompts;
- generated art/audio;
- source code;
- arbitrary implementation details;
- exhaustive test logs;
- curriculum standards mapping;
- decisions intentionally deferred to E01 testing.

Those belong downstream or remain open until evidence justifies locking them.

# Recommended file use

For each episode, create one canonical EPB using this structure.

The exact episode-folder path may be finalized during E01, but avoid parallel copies of the brief in different workstreams.

Prompt packs, scripts, interaction specs, assets, and QA outputs should reference the same EPB rather than cloning its content into competing sources of truth.
