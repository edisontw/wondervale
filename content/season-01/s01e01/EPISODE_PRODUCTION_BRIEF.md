# S01E01 Episode Production Brief — The Map Behind the Board

## Identity

```yaml
episode_id: s01e01
season_id: s01
arc_id: s01a01
working_title: "The Map Behind the Board"
brief_revision: 1
brief_status: approved_for_script
content_version: pre-release
estimated_duration_min: 14
estimated_duration_max: 18
```

The child-facing title remains a working title. The stable episode identity is `s01e01`.

### Upstream canon

Authoritative inputs:

- `docs/CORE_TRIO.md`
- `docs/SEASON_1_ARCHITECTURE.md`
- `docs/SEASON_1_LEARNING_WEAVE.md`
- `docs/EPISODE_PRODUCTION_BRIEF.md`
- `docs/CHARACTER_WORLD_BIBLE.md`
- project parent/accessibility baselines

### Explicitly open downstream

The following may be decided later without reopening this brief, provided they preserve the contract below:

- exact final dialogue and narration;
- exact child-facing episode title;
- final NPC name and visual design for the noticeboard steward;
- detailed visual style within the functional constraints below;
- exact animation timing/camera framing;
- exact implementation technology;
- final image/music/SFX prompts;
- final voice provider/performance;
- exact wording of non-critical ambient text.

Changes to story function, required beats, learning intent, continuity effects, or the two substantive interaction contracts require an EPB revision.

# 1. Episode contract

## Story purpose

Open Season 1 with a visual mystery that:

- establishes Wondervale as a lived-in place with a past;
- introduces the trio through behavior rather than biography;
- gives the child direct agency within the first mystery;
- establishes the Chronicle as story memory;
- establishes the Season 1 habit of distinguishing evidence from explanation;
- gives a satisfying local discovery while pointing naturally toward Riverside.

The episode must work as a children's mystery/adventure if every educational label is removed.

## Opening state

- Milo, Nia, and Finn are already friends.
- Town Square is active, familiar, and not presented as broken.
- The public noticeboard is undergoing an ordinary small repair.
- A local noticeboard/archive steward is present for the practical repair but does not know the answer to the mystery.
- The current public map/notice layer is normal and useful.
- The old route and the blank-place mystery are not yet known to the trio.

## Central problem

A loosened layer behind the current noticeboard reveals part of an older map.

The fragment contains enough familiar structure to look plausible, but it also contains:

- a faded route line;
- a symbol whose meaning is unknown;
- a route direction that is not obvious from the current town information.

The trio must determine what is actually visible, whether the fragment represents the real Town Square, and where the route appears to continue without pretending they already know what the mystery means.

## Local stakes

The repair will eventually secure the noticeboard again.

There is no countdown, danger, or punishment, but the trio has a practical reason to document the old layer carefully before the repair is finished.

They should not rip out or damage the old map layer.

## Resolution

The child helps establish that the old fragment corresponds to the real Town Square by using ordinary persistent landmarks.

The route direction leads to a weathered old route marker near the Square's Riverside-facing exit.

The child helps clean the marker enough to reveal it.

The marker points toward Riverside.

The blank symbol remains unexplained.

## Consequence

Persistent story/world results:

- the first old route marker in Town Square is visible again;
- the old map fragment is documented rather than destroyed;
- the Chronicle records the fragment, the blank symbol, and the new open question;
- the trio knows the old map is connected to real Wondervale, but does not yet know its age, full route, or destination;
- S01E02 is narratively unlocked.

## Continuation hook

The marker directs attention toward a Riverside connection that, in the present-day town, appears to go nowhere.

The episode ends with curiosity rather than emergency.

## Non-goals

Do not:

- confirm that the map is a treasure map;
- explain the Common;
- explain why the old route disappeared;
- establish a villain or deliberate erasure;
- teach a formal map lesson;
- require arithmetic;
- turn the noticeboard steward into an exposition source;
- introduce a large open-world map;
- add a timed challenge;
- make the blank symbol solvable in E01;
- begin the Riverside investigation inside this episode.

# 2. Character contract

| Character | Enters knowing/wanting | Episode beat | Leaves with | Must not do |
|---|---|---|---|---|
| Milo | Curious, action-oriented, wants to help and explore | Treats the map as exciting and wants to follow it quickly; accepts Nia/Finn's evidence checks before acting | Still eager, but has participated in the first “notice before conclusion” cycle | Become cautious/passive; declare the mystery solved; behave like a blank avatar |
| Nia | Likes noticing, recording, comparing | Protects the distinction between what is visible and what they think it means; makes a simple record of the fragment | Has the first Chronicle-quality evidence record for the season | Lecture; provide the correct answer; refuse all action until certainty |
| Finn | Looks for physical structure, patterns, alternative explanations | Notices mounting/physical evidence and recognizes that the map needs to be matched to the real Square | Helps turn abstract map evidence into a practical search for the route marker | Over-engineer; build an unnecessary device; become the sole technical expert |
| Noticeboard steward | Knows the board's current practical use and is repairing it | Gives legitimate access/time to inspect and preserve the old layer | Agrees the old layer/marker are worth preserving; still does not know the full story | Reveal route history, the Common, or a definitive explanation |

## Trio relationship beat

The episode should show the trio's three instincts in sequence rather than having them introduce themselves:

**Milo proposes -> Nia records -> Finn checks structure -> the child combines the evidence.**

No character should state a moral such as “We should always gather evidence.”

# 3. Town Square local canon added by E01

E01 may establish two ordinary persistent Town Square landmarks used as spatial anchors:

- `town_square_fountain` — a simple central/near-central fountain with a distinctive round footprint;
- `town_square_large_tree` — a mature shade tree with a distinctive canopy/trunk symbol on simple maps.

These are ordinary civic landmarks, not mystery objects.

Their exact visual design and exact metric distance remain open, but:

- both must be visible/recognizable in the living scene;
- both must be representable as simple, non-color-dependent map symbols;
- both should remain available for later Town Square scenes.

The noticeboard and old marker should fit a coherent Square geography, but E01 does not lock the full Wondervale map.

# 4. Scene / beat map

| Scene ID | Mode | Location/state | Story job | Child goal/action | Required beat | Exit condition |
|---|---|---|---|---|---|---|
| `s01e01-sc00` | parent preview | Parent View / shared screen | Set adult role without spoilers | Adult optionally reads preview | Let child notice first; do not confirm “treasure map” interpretations | Child begins episode |
| `s01e01-sc01` | storybook opening | Town Square, normal day | Establish place/trio and ordinary repair | Continue into Square | Noticeboard repair is mundane; trio already comfortable together | Milo enters living scene |
| `s01e01-sc02` | living scene | Town Square | Give control before mystery exposition | Move/inspect Square; approach noticeboard; help with loose panel | Child action exposes edge of older layer | Old map fragment becomes visible |
| `s01e01-sc03` | living close investigation | Noticeboard | Interaction 1: observation before interpretation | Inspect visible features in any order | Nia records literal evidence; Milo offers a hypothesis only after observation begins | Enough evidence documented to compare fragment with Square |
| `s01e01-sc04` | living spatial investigation | Town Square | Interaction 2A: establish that map represents this place | Use fountain/tree as anchors and move Milo to compare them with fragment | Old fragment plausibly matches real Square; no precision overlay puzzle | Route direction can be inferred |
| `s01e01-sc05` | living discovery | Riverside-facing Square exit | Interaction 2B: follow direction and reveal marker | Search broad indicated area; clean weathered plate with accessible action | Finn connects physical mounting evidence; old marker becomes visible; Riverside direction revealed | Canonical marker state changes |
| `s01e01-sc06` | Chronicle / storybook close | Chronicle + Square | Resolve locally; preserve uncertainty; create future hook | Review record; optional parent reflection | “What we know” and “what we wonder” remain distinct | Episode completes; E02 available |

## Pacing

Target rhythm:

- preview/opening: 2–3 min;
- free Square control/discovery: 2–3 min;
- observation interaction: 3–4 min;
- spatial/marker interaction: 4–5 min;
- Chronicle/close: 2–3 min.

Do not optimize for maximum click density. The Square needs brief room for movement, looking, and trio reactions.

# 5. Interaction contract

## `s01e01-int01-observe-before-guess`

### Story reason

The trio has found something genuinely intriguing, but following the first exciting interpretation would undermine the season's reasoning spine.

Nia's desire to record what is actually present gives the observation phase a natural character/story reason.

### Cognitive action

Separate:

- **observation:** what is visibly present;
- **interpretation:** what the visible feature might mean.

### Player action

- Move Milo close to the opened noticeboard.
- Inspect a small set of large, obvious evidence regions in any order.
- The child is not required to find a tiny hidden hotspot.
- Nia records visual observations as they are inspected.
- After at least two relevant observations, interpretation dialogue becomes available.

Required observable evidence includes:

- the faded route line;
- the unknown blank-place symbol;
- physical age/layer/mounting evidence showing this is not simply a newly printed decoration.

Exact micro-details may be refined in the script/art pass, but they must remain visually readable.

### Information available before acting

The old layer is visibly different from the current noticeboard layer.

No character explains what it is.

### Valid strategies

- inspect the line first;
- inspect the symbol first;
- inspect the physical layer/mounting evidence first;
- revisit evidence;
- choose a speculative dialogue flavor after observation;
- remain uncertain.

No interpretation choice changes canon in E01.

### World feedback

Each inspection produces an in-world response:

- a close view;
- a short trio reaction;
- Nia's simple sketch/record.

The feedback names what is seen without telling the child what it means.

### Failure / recovery

There is no wrong inspection order.

Tapping irrelevant nearby objects may produce ordinary reactions but does not penalize the child.

If the child is stuck, help progressively:

1. restate the goal (“Look closely at the old layer”);
2. demonstrate the inspect control;
3. enlarge/highlight the noticeboard evidence region;
4. draw attention to one visible feature without interpreting it;
5. allow progression after enough evidence has been surfaced.

### Accessibility alternative

- large tap/click targets;
- keyboard focus/select equivalent;
- no precision drag;
- important distinctions use shape/texture/position, not color alone;
- close view can be exited/re-entered freely;
- essential observations are available in text and voiced form.

### Evidence of thinking

The system does not score the child's verbal explanation.

Meaningful evidence is that the interaction structurally separates an observation phase from an interpretation phase, and the child can inspect multiple features before the story proceeds.

The parent cue may elicit a stronger spoken distinction.

## `s01e01-int02-map-to-place-and-marker`

### Story reason

The trio needs to know whether the old fragment represents the real Town Square before treating its route line as useful.

### Cognitive action

- interpret a simple map as a representation of real space;
- use two stable landmarks to orient a fragment;
- follow a direction from representation to the physical world.

### Player action

Phase A:

- inspect the fountain/tree symbols on the fragment;
- move Milo through the actual Square to compare them with the fountain and large tree;
- confirm the two ordinary anchors.

Phase B:

- use the fragment's route direction to search a broad, clearly bounded area near the Square's Riverside-facing exit;
- inspect the weathered route plate;
- use a broad swipe, press/hold, or equivalent accessible control to clean/reveal it.

The exact cleaning input may vary by device; no precision tracing is allowed.

### Information available

The child has:

- the fragment;
- two recognizable landmarks;
- the route line;
- the real Square.

The Riverside destination is not named until the marker is sufficiently visible.

### Valid strategies

- verify fountain first or tree first;
- revisit the fragment at any time;
- walk directly to a likely area;
- use optional help;
- inspect ordinary non-mystery features.

### World feedback

After both anchors are confirmed, the trio treats the fragment as genuine evidence of an older Town Square layout/route.

Cleaning the plate reveals enough of the old marker to indicate Riverside.

The blank symbol is not resolved.

### Failure / recovery

A wrong landmark comparison produces a gentle mismatch response, not a “wrong answer” screen.

Help progression:

1. replay what the fragment shows;
2. show the two map symbols at a larger size;
3. draw attention to one real landmark;
4. indicate the broad Square sector suggested by the route line;
5. highlight the weathered plate region;
6. allow an assisted reveal if motor/input difficulty blocks completion.

### Accessibility alternative

- no free rotation or precision map overlay is required;
- physical navigation may use keyboard, touch, or mouse;
- an optional direct “go to landmark” accessibility action may be offered if movement is a barrier;
- the cleaning action has tap/hold alternative;
- route direction uses icon/shape/position plus optional text/audio, not color alone.

### Evidence of thinking

The child uses real-place anchors to treat the old map as a representation, then uses that representation to guide a physical search.

The interaction must not collapse into a standalone symbol-matching worksheet.

# 6. Learning contract

## Primary

1. **Reasoning:** separate observation from interpretation.
2. **Spatial skill:** interpret a simple map/marker as a representation of a real place.

## Secondary

- describe visible features;
- compare old/current representations;
- tolerate uncertainty without treating it as failure.

## Revisit / transfer

This is the first encounter for:

- Season Thread A — evidence, explanation, revision;
- Season Thread B — maps, routes, spatial constraints.

Future planned returns include E02, E03, E04, E05, E08, E09, and E11 as defined by the Season learning weave.

## Misconception hypotheses

Design for, but do not label the child with:

- every unusual mark must be an intentional clue;
- an old map must match the current world exactly;
- the first exciting explanation is probably correct;
- a map mismatch means either the map or the present world is “wrong.”

## Meaningful evidence of thinking

Look for whether the child:

- attends to more than one visible feature;
- can identify something seen separately from a guess;
- uses real Square landmarks to validate the map fragment;
- preserves uncertainty about the blank symbol.

Do not score a single correct verbal answer.

## World feedback

The strongest feedback is diegetic:

- the fragment matches real landmarks;
- the route marker physically exists;
- cleaning it changes the Square;
- the marker gives a new direction while leaving the larger mystery open.

## Avoid

- “Which one is evidence?” quizzes;
- vocabulary matching detached from the scene;
- rewarding the child for guessing “treasure map” or any single interpretation;
- an adult stating the learning point.

# 7. EFL / language-access contract

## E01 language band

This is the initial vertical-slice baseline to test, not a permanent Season-wide ceiling.

### Sentence shape

For required child-facing dialogue/narration:

- most lines: approximately **3–8 words**;
- occasional line: up to **10–12 words** when syntax is simple and meaning is strongly supported visually;
- prefer one main idea per line;
- avoid nested clauses and long instructions;
- preserve natural character voice rather than producing telegraphic “learner English.”

### Lexical load

- target no more than **5 comprehension-critical new lexical items** in E01;
- proper names do not count toward this limit;
- repeated ordinary words may recur naturally;
- candidate core items: **map, route, mark/marker, behind, old**;
- “blank,” “layer,” “faded,” or similar words may appear when supported, but should not all become required vocabulary.

Final word choice belongs to the detailed script review.

### Communicative functions

- describing: “I see…”
- locating: here / there / next to / behind
- uncertainty: maybe / I think / I'm not sure
- simple comparison: same / different

### Reusable patterns

Possible functional patterns:

- “I see a ___.”
- “It's behind the ___.”
- “This one is different.”
- “Maybe it goes ___.”
- “I'm not sure yet.”

These are pattern targets, not mandatory catchphrases.

### Can be communicated visually

Do not require English alone to understand:

- that one layer is older;
- where the fragment is located;
- which landmarks correspond;
- that the marker became visible;
- that Riverside is a direction/place.

### Narration / read-aloud

For E01:

- storybook narration is voiced;
- all progression-critical trio/NPC dialogue is voiced;
- essential interaction instructions have text plus tap-to-hear/replay;
- meaningful spoken content retains visible text/captions;
- incidental decorative text need not be voiced.

### Tap-for-meaning

Allow lightweight help on a small number of selected important words.

Preferred help order:

1. replay pronunciation;
2. image/gesture/context cue;
3. very simple English meaning where useful.

Automatic child-view translation is **not required for E01**.

Child and parent languages remain technically separable.

### Reasoning that must not be simplified away

Language simplification must not remove:

- uncertainty;
- comparison of evidence;
- the distinction between seeing and guessing;
- the spatial relation between map and place.

# 8. Parent guidance contract

## Parent preview intent

Target under one minute.

The preview should communicate:

- this is a mystery/exploration episode;
- let the child inspect before explaining;
- if the child says “treasure map,” treat it as one possible idea rather than confirming/correcting it;
- no special map knowledge is required.

## During-play cue

| Cue ID | Trigger | Type | Importance | Intent | Draft prompt | Do not reveal |
|---|---|---|---|---|---|---|
| `s01e01-cue-01` | after the child has inspected at least one map feature, before the trio settles on an interpretation | observe | recommended | separate observation from explanation | “What can you see before we decide what it means?” | that the route is real, where it goes, what the blank symbol means |

Optional follow-up:

> “Which part made you notice that?”

Fallback:

> “Can you point to one line, shape, or mark?”

## Optional after-play reflection

Draft intent:

> “What do we know for sure, and what are we still guessing?”

This is optional and should not become homework.

## Child-alone fallback

If the parent is absent:

- Nia naturally prompts the observation phase;
- all interactions remain completable;
- no required-for-activity parent cue is used in E01.

# 9. Scaffolding and recovery

## Language support

- persistent replay/speaker control for required voiced lines;
- selected tap-for-meaning support;
- visual context before longer explanation;
- no language mistake penalty.

## Interaction support

Use a visible help control rather than a countdown.

The first support step should clarify the control/goal without identifying the answer.

## Reasoning support

E01 reasoning support should progress from attention to narrowing:

1. remind child to look closely;
2. draw attention to the relevant broad area;
3. highlight one feature;
4. contrast “what we see” with “what we think” without supplying the interpretation;
5. narrow the spatial search;
6. reveal enough to continue if necessary.

## Accessibility support

- large targets;
- no precision dragging;
- no rapid reaction;
- no time penalty;
- mouse/touch/keyboard where practical;
- tap/hold alternatives to swipe;
- reduced-motion alternative for paper/cleaning/reveal animation;
- no color-only distinctions.

## Validation status

This help model is **locked as the E01 prototype**, not as a proven permanent standard.

Parent-child testing must determine whether the ladder is too early, too late, or too revealing.

# 10. Session checkpoint / resume prototype

E01 establishes the first checkpoint behavior to test.

Required behavior:

- local progress autosaves at scene boundaries;
- add safe checkpoints immediately after the old map is exposed and after the old marker is revealed;
- interruption during an interaction resumes from the latest safe logical state rather than an exact animation frame;
- completed canonical effects must not fire twice;
- resume must not require replaying the entire episode.

## Resume recap prototype

On a resumed session after leaving the episode, allow a short Chronicle-style recap:

- one image/card;
- one or two short sentences;
- one open question/current goal;
- voiced/replayable;
- skippable;
- target approximately 10–20 seconds.

Do not show a “Previously in Wondervale” recap on a fresh first start of E01.

This format is a prototype for later episodes and remains subject to E01 family testing.

# 11. Continuity contract

## Preconditions

```yaml
requires:
  episodes_completed: []
  canonical_events: []
```

S01E01 is the Season 1 entry episode.

## Canonical effects

Proposed stable IDs for E01:

```yaml
effects:
  canonical_events:
    - s01e01_old_map_fragment_documented
    - s01e01_town_square_old_marker_revealed

  discoveries:
    - s01e01_blank_place_symbol_seen
    - s01e01_old_route_matches_town_square
    - s01e01_old_route_points_toward_riverside

  location_state:
    - town_square_old_route_marker_visible

  open_mysteries:
    - s01_missing_place_mystery_open

  unlocks:
    - s01e02
```

These IDs become stable once implementation/runtime schema validation confirms the final field names. Their semantic identities must not be renamed casually.

## Character knowledge after completion

After E01, the trio may be assumed to know:

- an older map layer exists behind the Town Square noticeboard;
- the old fragment corresponds to real Town Square landmarks;
- the fragment includes an unexplained symbol;
- an old route marker points toward Riverside.

They must **not** know:

- what the Common is;
- why the route changed;
- when all changes occurred;
- whether one single event caused the change;
- whether the blank symbol is a destination, function, or something else.

## Meaningful choice scope

No canonical branch in E01.

- inspection order: ephemeral;
- optional dialogue hypothesis/flavor: episode-local;
- optional nonessential discoveries: may be remembered only if explicitly added later;
- main mystery outcome: canonical and fixed.

## Replay behavior

Replay is story-memory mode.

It must not:

- duplicate completion/canonical events;
- hide the marker in the current present-day Square;
- roll back later world state.

The replay may re-enact the original discovery visually inside the episode memory.

# 12. Chronicle contract

## Main memory

“The trio found an older map behind the Town Square noticeboard.”

## Visual before/after

Include:

- current noticeboard layer;
- old fragment reproduction/sketch;
- old route marker before/after cleaning if composition allows.

## Discovery / mystery

Record:

- faded route line;
- blank symbol;
- Riverside direction;
- open question: where did the old route go, and what does the symbol mean?

## Character milestone

Do not award a personality badge or explicit “evidence lesson.”

At most, the page may visually show Nia's evidence sketch and the trio's first shared investigation.

## Optional language memory

A small contextual phrase such as “I see…” or “behind” may appear only if it fits the page naturally.

Do not turn the Chronicle into a vocabulary checklist.

## Future callback value

- E04 old-route timeline;
- E10 recognition of the blank symbol;
- E11 old/new map spread.

# 13. Visual production requirements

This section specifies function, not final image prompts.

## Reusable / persistent location requirements

- Town Square base state;
- `town_square_fountain`;
- `town_square_large_tree`;
- noticeboard normal state;
- noticeboard repair/open-panel state;
- old route marker dirty state;
- old route marker revealed state.

Town Square should feel warm, active, and lived-in rather than abandoned or generally broken.

## Mystery assets

- old map fragment;
- faded route line;
- blank-place symbol;
- simple map symbols for fountain/tree;
- physical age/layer evidence;
- old route marker/plate.

The mystery must not depend on tiny texture differences.

## Character requirements

At minimum:

- Milo: neutral/explore, excited hypothesis, focused inspection, discovery reaction;
- Nia: observing/recording, comparing, uncertain-but-engaged;
- Finn: examining physical structure, playful skepticism, discovery confirmation;
- noticeboard steward: practical/neutral, gives access without “mystery expert” styling.

Exact character art direction remains a later E01 visual task.

## Functional art constraints locked now

- trio silhouettes remain distinct at small screens;
- Milo reads clearly as player-controlled;
- map symbols work without color;
- old/new layers differ through line quality, texture, shape, and hierarchy rather than color alone;
- interactable evidence must be visually legible without becoming a flashing hotspot;
- the old material should feel historical/ordinary, not spooky or magical;
- storybook panels and living-scene assets should feel like the same world;
- avoid hidden-object pixel-hunt composition.

## Art direction still open

The exact rendering style, palette, brush/3D treatment, lighting language, and final character model sheets are **not locked by this brief**.

They must be resolved before E01 visual asset generation, not invented independently by individual image prompts.

# 14. Audio / music / SFX requirements

## Music

E01 should use a small reusable music vocabulary rather than several one-off tracks.

Needed functions:

- warm Wondervale/Town Square baseline;
- light curiosity/mystery variation after the old layer appears;
- restrained discovery/world-change accent when the old marker becomes visible;
- quiet Chronicle close.

Avoid:

- ominous horror mystery;
- high-stakes treasure/adventure fanfare;
- constant musical escalation;
- music that masks speech.

The preferred production direction is to derive E01 cues from reusable Wondervale/exploration/discovery families.

## SFX

Likely reusable:

- page/paper movement;
- noticeboard panel movement;
- inspect/select confirmation;
- cloth/soft cleaning;
- subtle metal/wood reveal;
- Chronicle page turn.

Episode-specific distinctive SFX are not required unless later animation makes one useful.

Any sound carrying story information must have a visible/text equivalent.

# 15. Voice / narration requirements

## Voiced content classes

For E01:

- storybook narration: voiced;
- progression-critical Milo/Nia/Finn/steward dialogue: voiced;
- essential interaction instruction: text + optional read-aloud/replay;
- parent guide: text-first; voice not required.

## Caption / replay baseline

- meaningful child-facing spoken content remains visible as text;
- narration/dialogue can be replayed;
- audio is not the only source of essential information;
- caption/transcript text must match locked spoken text once the script is final.

## Performance direction

- natural, warm, conversational;
- medium or medium-slow pace suitable for EFL listening;
- not babyish;
- character distinction should come from rhythm/attitude more than exaggerated accents.

## Prototype voice production

Before final manual voice production, synthetic/temporary voices may be used to validate pacing and interaction timing.

Final voice files must wait until exact script lines are locked.

## Stable export convention

After script approval, voice export uses stable line IDs such as:

`S01E01-MILO-001`

with:

- character;
- exact spoken text;
- scene ID;
- intent/emotion;
- pace;
- pronunciation note;
- pause/emphasis note.

# 16. Accessibility, privacy, and safety

## E01-specific requirements

- no essential color-only map distinction;
- no essential audio-only clue;
- no pixel hunting;
- no precision dragging requirement;
- no timed search;
- no punishment for looking around slowly;
- cleaning interaction has non-swipe alternative;
- map comparison has non-drag alternative;
- all required child-facing story text supports read-aloud/replay;
- reduced-motion mode replaces elaborate paper peel/reveal with simple state changes;
- accidental leaving of close-up/map mode is recoverable;
- no child name/account/voice collection;
- no external links, chat, social features, or AI conversation;
- uncertainty remains mild/curious rather than frightening.

Baseline otherwise follows `docs/ACCESSIBILITY_PRIVACY_SAFETY.md`.

# 17. Production artifact manifest

| Artifact | Required? | Source/owner | Status after this brief | Notes |
|---|---|---|---|---|
| E01 Production Brief | yes | Episode design | approved_for_script | this file |
| detailed script | yes | Narrative | next | must preserve EPB |
| interaction specification | yes | Episode Assembly / Engineering | pending | follows approved script/EPB |
| E01 EFL line-level review | yes | Learning/EFL | pending | validate language band against script |
| parent cue final copy | yes | Learning/Parent | pending | keep sparse |
| visual art-direction mini-pass | yes | Visual | pending | before image generation |
| character/location/prop prompt pack | as needed | Visual | pending | after visual mini-pass |
| music brief/prompts | as needed | Audio | pending | reuse theme families |
| SFX list | yes | Audio | pending | mostly reusable |
| final voice export | yes | Audio | pending | only after script lock |
| runtime implementation | yes | Engineering | pending | no story invention |
| continuity/schema validation | yes | QA/Engineering | pending | validate stable fields/IDs |
| E01 QA review | yes | QA | pending | before family test |
| parent-child vertical-slice test | yes | Validation | pending | validates help/language/recap/pacing |

# 18. QA and acceptance contract

## Narrative

Pass when:

- the old map is discovered through an ordinary noticeboard repair;
- the trio's three problem-solving tendencies appear through action;
- no adult gives the answer;
- “treasure map” remains only a possible playful interpretation;
- the child helps establish that the fragment corresponds to real Town Square;
- the marker is revealed and points to Riverside;
- the blank symbol remains unresolved;
- Town Square ends slightly changed, not dramatically transformed.

## Learning

Pass when:

- the episode structurally gives observation a chance before interpretation;
- the map/place interaction requires using real spatial anchors;
- the child can progress without selecting a school-like “correct definition”;
- world feedback supplies evidence;
- uncertainty remains acceptable;
- support does not immediately give the interpretation.

## EFL

Pass when the approved script:

- stays mostly within the E01 sentence band;
- does not exceed the intended comprehension-critical lexical load without explicit justification;
- uses visuals/audio to support action;
- lets the child reason beyond their productive English level;
- keeps Milo/Nia/Finn voices distinct but simple.

## Parent experience

Pass when:

- the preview is under one minute;
- the main cue occurs only after the child has had a chance to inspect;
- the cue does not reveal the answer;
- the child can complete the episode with no parent present;
- the optional reflection feels conversational rather than like homework.

## Interaction / accessibility

Pass when:

- all essential interactive targets are generously sized;
- map comparison works without precision dragging;
- route-marker reveal works without a required swipe;
- keyboard/mouse/touch paths are available where practical;
- no color-only clue exists;
- no time pressure exists;
- reduced-motion mode preserves the discovery;
- failed/misdirected attempts recover without penalty.

## Continuity

Pass when:

- E01 has no unmet prerequisite;
- canonical events/discoveries are emitted once;
- the marker-visible state persists after completion;
- the Chronicle records the mystery;
- replay does not roll the Square backward;
- E02 can depend on E01 completion/discovery without prose-only state.

## Runtime smoke cases to implement later

- fresh first start;
- parent preview skipped;
- parent absent through episode;
- inspect features in different orders;
- choose speculative dialogue flavor;
- use help at each scaffold tier;
- misidentify/check an irrelevant landmark/area;
- pause before map discovery;
- pause after map discovery;
- pause after marker reveal;
- resume from checkpoint;
- complete without audio;
- complete with reduced motion;
- replay after E01 completion;
- replay after later-season progress once later content exists.

# 19. Approved-for-script gate

E01 is approved for detailed scripting because:

- [x] story purpose and local resolution are stable;
- [x] required character beats are stable;
- [x] scene jobs are sufficient for scripting;
- [x] there are only two substantive interaction contracts;
- [x] both interactions have a story reason and cognitive action distinct from UI mechanics;
- [x] Season learning goals are represented without overload;
- [x] the E01 EFL prototype band is defined;
- [x] parent participation is sparse and optional;
- [x] continuity effects are explicit;
- [x] persistent world changes have proposed stable semantic IDs;
- [x] Chronicle update is defined;
- [x] visual/audio requirements are defined without prematurely generating assets;
- [x] voice requirements do not depend on unwritten dialogue;
- [x] accessibility/privacy/safety requirements are explicit;
- [x] QA acceptance conditions are defined;
- [x] downstream-open decisions are listed.

## Critical review

The brief intentionally avoids three common failure modes:

1. **Worksheet mystery** — the child explores a real place and uses a representation to act in the world rather than answering detached map questions.
2. **Treasure-hunt formula** — E01 proves an old route is real but does not promise treasure, danger, or a string of arbitrary coded clues.
3. **Learning overload** — E01 introduces only the evidence/explanation and map/place threads; chronology, engineering, community tradeoffs, and formal measurement wait for later episodes.

The largest production risk is that the map/place interaction could still feel like a matching exercise if staged only as UI. The detailed script and interaction specification must keep Milo physically moving through the Square and make the landmarks feel like part of the living world.

# 20. Next focused task

Write the **S01E01 detailed script** from this approved brief.

Do not yet:

- generate images;
- generate final music;
- generate final voice files;
- implement the website;
- write E02;
- redesign Season 1 architecture.
