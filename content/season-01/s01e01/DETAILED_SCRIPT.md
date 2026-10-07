# S01E01 Detailed Script — The Map Behind the Board

```yaml
episode_id: s01e01
script_revision: 1
script_status: approved_for_interaction_spec
source_brief: content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md
source_brief_revision: 1
language: en
dialogue_lock: v1
```

**Scope:** Full English narrative/dialogue for S01E01, including player-visible choices, order-independent reactions, optional parent language, help/recovery, Chronicle close, and resume recap. This script is the source of exact spoken text for subsequent voice export; it is **not** an audio file or implementation spec.

**Authority:** The approved Episode Production Brief (EPB) controls story beats, learning, continuity, and mechanics intent. The script controls exact dialogue/narration. If an interaction spec reveals a conflict, revise this script or escalate to the EPB rather than inventing dialogue downstream.

## Reading conventions

- `[S01E01-SPEAKER-###]` = stable, unique spoken-line ID; the quoted English text is exact voice/caption text.
- `[stage]` = direction, **not** dialogue or voice text.
- `[child action]` = play/interaction intent, **not** a new skill quiz.
- `[branch]` = one optional local dialogue variant; all variants reconverge and have no persistent canonical effect.
- `[help]` = optional spoken guidance; no timed auto-interrupt.
- `[state]` = scene/continuity checkpoint intent; runtime event names remain governed by the EPB.
- The steward's speaker key is `STEWARD`; their display name and art design remain open.
- `NARRATOR` voices storybook panels, Chronicle summary, and optional resume cards. Essential `UI` instructions are text with on-demand speech using the line IDs below.
- Spoken lines can appear in an order different from their numeric IDs when child-led inspection permits it. No numbered line implies a forced dialogue order.
- Do not replay a one-time discovery line each time a completed object is inspected; use the repeat lines specified below instead.

## S01E01-SC00 — Parent preview (optional, text-only)

**Display:** Parent View / quiet shared-screen panel, no spoilers, under one minute.

**Preview copy (parent-facing, not voiced):**

> Today Milo, Nia, and Finn find something unusual in Town Square. Let your child look before you explain. If they call it a treasure map, ask what they see; do not confirm or deny the guess. No map knowledge is needed.

**Parent cue policy:** One recommended cue during S01E01-SC03, optional reflection after S01E01-SC06. Parent view may be skipped; child progress never waits for the adult.

---

## S01E01-SC01 — A normal day in Town Square

**Mode:** Storybook opening, then entry to living scene. **Goal:** lively familiar town, friends already together, ordinary board repair.

[stage] Wide storybook view of a functioning Town Square. A round fountain splashes; an old shade tree moves softly. Neighbors come and go. One corner of the public noticeboard paper flaps beside a steward making a small repair. Avoid broken-town or supernatural mood.

- [S01E01-NARRATOR-001] “The fountain splashes in Town Square.”
- [S01E01-NARRATOR-002] “A big tree gives cool shade.”
- [S01E01-NARRATOR-003] “But one paper will not stay still.”
- [S01E01-MILO-001] “It's waving at us!”
- [S01E01-FINN-001] “That paper is very friendly.”
- [S01E01-NIA-001] “Its corner is loose.”
- [S01E01-STEWARD-001] “Oh! Not again.”
- [S01E01-STEWARD-002] “I can fix this corner.”
- [S01E01-MILO-002] “Can we help?”
- [S01E01-STEWARD-003] “Yes. Please hold the paper.”
- [S01E01-NARRATOR-004] “Milo walks into the square.”

[stage] Transition to living scene. The player gains control of Milo promptly. Nia and Finn remain companions, not alternate playable characters.

**Exit:** `s01e01-sc02` enters with the noticeboard repair still in progress.

---

## S01E01-SC02 — The paper behind the paper

**Mode:** Living scene, gentle free exploration + noticeboard interaction. **Goal:** player controls Milo before mystery exposition.

[stage] Fountain, tree, noticeboard, and path edges are clearly navigable. The steward is by the board. No forced countdown or narrow hit targets.

### Optional ambient exploration (first interaction only)

**If Milo inspects the fountain:**

- [S01E01-MILO-003] “I love that splash.”
- [S01E01-FINN-002] “I can hear it from here.”

**If Milo inspects the large tree:**

- [S01E01-NIA-002] “This tree gives us shade.”
- [S01E01-MILO-004] “And a good place to sit.”

**If Milo approaches the board before the fountain/tree:** proceed normally. These are optional, not prerequisites.

### Ordinary repair

[child action] A large `Help` affordance lets Milo hold the loose **current** paper edge while the steward adjusts its clip. A tap/hold alternative is supported; there is no skill-based dexterity failure.

- [S01E01-STEWARD-004] “Hold here, please.”
- [S01E01-UI-001] “Help hold the paper.”
- [S01E01-MILO-005] “Got it!”
- [S01E01-STEWARD-005] “Thanks. One little clip…”
- [S01E01-FINN-003] “Wait. There's paper behind it.”
- [S01E01-NIA-003] “I see another map.”
- [S01E01-MILO-006] “Behind this one?”
- [S01E01-STEWARD-006] “I didn't know it was there.”

[stage] The ordinary loose front sheet shifts safely, revealing an **older paper layer** behind it. The steward secures the front paper to one side temporarily. Nobody tears off the older layer.

- [S01E01-STEWARD-007] “Please don't pull the old paper.”
- [S01E01-NIA-004] “We can draw what we see.”
- [S01E01-MILO-007] “Now I'm really curious.”

[state] Safe checkpoint: `s01e01_map_exposed`. Scene transitions to close investigation. No event claiming the mystery is solved.

**If the child leaves and returns to the board after exposure:**

- [S01E01-NIA-005] “The old map is still here.”

---

## S01E01-SC03 — Look before we guess

**Mode:** Living close investigation. **Interaction:** `s01e01-int01-observe-before-guess`.

[stage] Close view shows three generous evidence regions in any order: (A) a faded line, (B) an unlabelled outlined symbol, and (C) paper/mounting holes under the newer sheet. Shape, texture, and location—not color alone—identify them. Neither camera nor tooltip calls the symbol a destination.

- [S01E01-MILO-008] “An old map!”
- [S01E01-MILO-009] “Where does it go?”
- [S01E01-NIA-006] “Let's see what's really there.”
- [S01E01-UI-002] “Look closely at the old map.”

### Order-independent evidence reactions

Each region gives its line(s) once, in whichever order inspected. Nia adds an unlabelled sketch/shape to her page. The child may revisit without being forced to repeat dialogue.

**A — faded line:**

- [S01E01-MILO-010] “I see a long line.”
- [S01E01-NIA-007] “It goes across the map.”
- [S01E01-NIA-008] “I'll draw that line.”

**B — unknown symbol:**

- [S01E01-FINN-004] “What's this shape?”
- [S01E01-NIA-009] “It has no name here.”
- [S01E01-MILO-011] “Maybe it's something special.”

**C — layer/holes:**

- [S01E01-FINN-005] “Look at these little holes.”
- [S01E01-FINN-006] “They're under the new paper.”
- [S01E01-NIA-010] “This paper looks much older.”

**After the first evidence region, offer one parent cue** (not blocking):

`s01e01-cue-01` (**recommended / observe**):
> What can you see before we decide what it means?

Optional follow-up: “Which part made you notice that?”

Optional fallback: “Can you point to a line or shape?”

[stage] Parent cue never names the marker's destination or the blank symbol. If no parent is present, Nia's observation line serves the same story purpose.

### After any two relevant regions have been inspected

[stage] A larger speculation choice appears. The third region remains inspectable. If the mounting/holes region has not been inspected, Finn observes it automatically during the transition below, so **all three evidence types** have been represented before spatial inference; the player is not forced into a third tiny-hotspot hunt.

- [S01E01-MILO-012] “I have an idea.”
- [S01E01-NIA-011] “Tell us your guess.”

**[branch] Choose one spoken Milo reply; no option is marked correct.**

- **A — excited guess:** [S01E01-MILO-013] “Maybe it's a treasure map!”
  - [S01E01-FINN-007] “Maybe. Let's check first.”
- **B — practical guess:** [S01E01-MILO-014] “Maybe it's our town.”
  - [S01E01-NIA-012] “We can look outside.”
- **C — honest uncertainty:** [S01E01-MILO-015] “I'm not sure yet.”
  - [S01E01-FINN-008] “Good. We can check.”

**If mounting evidence C was not inspected, insert these lines now:**

- [S01E01-FINN-009] “These holes are under the paper.”
- [S01E01-NIA-013] “So this map was here before.”

**All branches reconverge:**

- [S01E01-NIA-014] “See? We have a line.”
- [S01E01-NIA-015] “And a shape with no name.”
- [S01E01-FINN-010] “But is this our square?”
- [S01E01-MILO-016] “Let's find out!”

[stage] Nia's sketch shows only observed things; it does **not** get labelled “treasure,” “The Common,” or any assumed route destination.

**Optional repeat in close view:**

- [S01E01-NIA-016] “We can look again.”

**Help lines, available on demand, in increasing specificity:**

- [S01E01-UI-003] “Look for lines and shapes.”
- [S01E01-UI-004] “Try another part of the map.”
- [S01E01-NIA-017] “What can we see right here?”

[state] Observation record retained as episode-local progress. Move to Square comparison; the fragment can be reopened at any time.

---

## S01E01-SC04 — Does the map show our square?

**Mode:** Living spatial investigation. **Interaction:** `s01e01-int02-map-to-place-and-marker`, Phase A.

[stage] The fragment remains accessible as a lightweight inset. It depicts the round fountain and the large tree as readable **different shapes**. The map need not be rotated or dragged. Milo physically visits/looks at both actual landmarks; prior ambient visits from SC02 do not silently count toward this new comparison action.

- [S01E01-FINN-011] “There's a round mark here.”
- [S01E01-NIA-018] “And look: a big tree.”
- [S01E01-MILO-017] “We have both!”
- [S01E01-FINN-012] “Let's check the real places.”
- [S01E01-UI-005] “Find both places in the square.”

### Anchor checks — either order

**At the fountain, with the fragment available:**

- [S01E01-MILO-018] “This fountain is round.”
- [S01E01-NIA-019] “The round mark fits here.”

**At the large tree, with the fragment available:**

- [S01E01-FINN-013] “That's one very big tree.”
- [S01E01-NIA-020] “The tree mark fits here.”

**After only one verified anchor:**

- [S01E01-MILO-019] “One place fits!”
- [S01E01-NIA-021] “Let's check the other one.”

**If player points to a nearby irrelevant object:**

- [S01E01-FINN-014] “Hmm. That shape is different.”
- [S01E01-MILO-020] “Let's keep looking.”

**Once both anchors are verified:**

- [S01E01-NIA-022] “Both marks fit our square.”
- [S01E01-FINN-015] “So this map shows this place.”
- [S01E01-MILO-021] “But there's another line.”
- [S01E01-NIA-023] “It goes past the tree.”
- [S01E01-MILO-022] “Then let's follow it!”

[stage] This is **evidence of a real mapped place**, not proof that the old route still exists exactly as drawn.

### On-demand help/repeat

- [S01E01-UI-006] “Look at the two map shapes.”
- [S01E01-NIA-024] “Find the round fountain first.”
- [S01E01-UI-007] “You can visit either place first.”

[stage] If help is needed, highlight a broad area and provide a non-movement accessibility shortcut. Do not teleport without the child's choice.

**Exit:** Both anchors checked; fragment indicates a broad direction toward the Square's Riverside-facing side. Do not name the destination before SC05's marker reveal.

---

## S01E01-SC05 — The old mark

**Mode:** Living scene near the Square exit. **Interaction:** `s01e01-int02-map-to-place-and-marker`, Phase B.

[stage] The old line points toward the Square's Riverside-facing exit, where a weathered plate is visible on a **low public marker**. The plate is dirty, not a tiny secret hotspot. A single broad area is searchable; no pixel hunt. Marker location is a permanent reusable location feature.

- [S01E01-FINN-016] “The line goes this way.”
- [S01E01-MILO-023] “Near the edge of the square?”
- [S01E01-NIA-025] “There's something on that post.”
- [S01E01-MILO-024] “It's covered in dirt.”

[stage] The steward, still near the board, notices the trio looking. No adult exposition.

- [S01E01-STEWARD-008] “That old plate is safe to clean.”
- [S01E01-STEWARD-009] “I've got a soft cloth.”
- [S01E01-FINN-017] “Those holes look familiar.”
- [S01E01-FINN-018] “Like the ones behind the board.”
- [S01E01-MILO-025] “Let's see what it says.”

[child action] Clean with a large wipe area, tap/hold, or accessible press. No timing or precision. Mild wipe animation or reduced-motion state swap; cleaning is never a penalty.

- [S01E01-UI-008] “Clean the old plate.”
- [S01E01-NARRATOR-005] “A little dirt comes away.”
- [S01E01-NARRATOR-006] “A mark appears under it.”

[stage] The plate reveals an **arrow and the readable place name RIVERSIDE**. The symbol from SC03 does **not** get explained here. Both visible text and clear arrow direction communicate the destination.

- [S01E01-MILO-026] “Riverside!”
- [S01E01-NIA-026] “So this way led there.”
- [S01E01-FINN-019] “The old mark is real.”
- [S01E01-MILO-027] “Then the map isn't just a guess.”
- [S01E01-NIA-027] “It shows places we know.”
- [S01E01-FINN-020] “But look at the old line.”
- [S01E01-FINN-021] “It keeps going past here.”
- [S01E01-MILO-028] “Isn't that way a dead end?”
- [S01E01-NIA-028] “Maybe the town changed.”

[stage] This is a **possibility**, not a final explanation. The current Riverside route's exact obstruction is reserved for E02. Milo can look toward the direction but cannot travel into E02's investigation in this episode.

[state] Safe checkpoint: `s01e01_marker_revealed`. Commit marker-visible state once as specified in EPB; preserve it in current-world view.

### On-demand help / repeat

- [S01E01-UI-009] “Look near the path out.”
- [S01E01-NIA-029] “Check the old line again.”
- [S01E01-UI-010] “Hold to clean the plate.”
- [S01E01-MILO-029] “The Riverside mark is still here.”

[stage] If player leaves and returns after reveal, use the repeat line, **not** a second discovery event.

---

## S01E01-SC06 — The first page of the Chronicle

**Mode:** Storybook + Chronicle, quiet close. **Goal:** celebrate a small real-world change and remember evidence without claiming the entire mystery is solved.

[stage] Nia's sketch becomes the visual basis of the Chronicle page. It shows the old layer as **preserved**, the two familiar landmarks, the unlabelled symbol, the faded route, and the old marker before/after cleaning. No score, badge, XP, or victory chest.

- [S01E01-NARRATOR-007] “The old map stays safe.”
- [S01E01-NARRATOR-008] “The old mark is clear now.”
- [S01E01-NIA-030] “I'll keep our drawing here.”
- [S01E01-MILO-030] “The fountain and tree match.”
- [S01E01-FINN-022] “And the plate says Riverside.”
- [S01E01-NIA-031] “But this shape has no name.”
- [S01E01-MILO-031] “Maybe we'll find out there!”
- [S01E01-FINN-023] “Only one way to check.”
- [S01E01-NARRATOR-009] “One small mark changed the square.”
- [S01E01-NARRATOR-010] “One big question is still open.”

### Chronicle page (visible child copy)

**Header:** `Our First Old Map` (working page title; not voiced unless chosen for narration in later audio pass).

**What we found:**
- An old map behind the board.
- A round fountain and big tree.
- A clean old mark: **RIVERSIDE →**.

**What we wonder:**
- What does the empty shape mean?
- Where did the old line go?

[stage] The child may inspect/replay the page. Text labels never call the empty shape “The Common.”

**Optional parent reflection (text-only):**
> What do we know for sure? What are we still guessing?

**Completion:**
- [S01E01-NARRATOR-011] “Next time, we can visit Riverside.”

[state] Emit episode completion and canonical effects according to EPB; unlock E02. Persist the current Square marker as revealed. Do **not** replay the map discovery event merely from opening the Chronicle.

---

## Resume-only micro-recaps (not on first start)

Use a **single short card**, skippable. Choose one state-dependent pair of lines; do not combine cards.

**If paused before the old map is exposed:**

- [S01E01-NARRATOR-012] “We were helping at the noticeboard.”
- [S01E01-NARRATOR-013] “Let's see what needs fixing.”

**If paused after map exposure but before marker reveal:**

- [S01E01-NARRATOR-014] “We found an old map.”
- [S01E01-NARRATOR-015] “What can it show us?”

**If paused after marker reveal but before Chronicle completion:**

- [S01E01-NARRATOR-016] “The old plate points to Riverside.”
- [S01E01-NARRATOR-017] “Let's save what we found.”

[stage] Card uses existing scene/Chronicle imagery, one open goal, 10–20-second target including optional replay; a fresh first start never shows this.

---

## Branch, trigger, and dialogue safety matrix

| Situation | Required behavior | Forbidden result |
|---|---|---|
| Parent preview skipped | enter SC01 normally | child blocked |
| SC02 fountain/tree visited early | ambient lines optional; new SC04 comparison still available | auto-complete spatial thinking |
| SC03 evidence inspection reordered | corresponding reaction once per region | required fixed ordering |
| SC03 speculation A/B/C | one Milo line + one response; reconverge | treasure confirmed or canonical fork |
| Only two SC03 regions inspected | allow speculation; auto-show remaining physical-layer evidence if needed | third tiny hotspot mandatory |
| Parent absent | Nia supplies observation impetus | parent cue gate |
| SC04 wrong comparison | soft mismatch, no penalty | “wrong answer” screen |
| SC04 either landmark first | both valid | hidden preferred order |
| SC05 plate already revealed | use repeat line and visible plate | repeat canonical event |
| No audio | all essential dialogue/goal text remains available | audio-only clue |
| Reduced motion | simple reveal state swap | unreadable clue |
| Pause/resume | restore latest safe logical checkpoint + optional recap | duplicate events |
| Replay after later progress | stage past discovery as memory, preserve present-day state | rollback of Square |

## Spoken-text / EFL review rules

- Only the exact text within `[S01E01-...]` quoted lines is eligible for voice export.
- Dialogue/narration lines should usually be 3–8 words; a small number of plain, strongly visual lines up to 12 words is acceptable.
- Candidate critical lexical items remain: `map`, `old`, `behind`, `mark`, `route`. “Route” is a developer/parent term here; child-facing lines primarily use **line / way / mark** until the child's understanding is grounded.
- Proper name `Riverside` is grounded by the actual printed plate and destination arrow.
- The script deliberately avoids requiring the child to comprehend “fragment,” “layer,” “mounting,” “evidence,” “symbol,” or “interpretation” as taught vocabulary.
- Short lines do not imply shallow reasoning: the child must distinguish observation from guess and map from place.
- No dialogue branch is a graded response, and no correct/incorrect label is shown.
- The parent-facing preview/cues and non-voiced Chronicle/interaction labels are reviewed separately for clarity and do not count against child spoken-line limits.

## Script lock boundary

Locked in this revision:
- exact child-facing voiced lines and their stable IDs;
- parent preview, during-play cue, and optional reflection copy;
- scene progression/line triggers and all required branch reactions;
- checkpoint recap text;
- Chronicle visible text content;
- absence of a canonical-choice branch.

Not locked by this script:
- camera shots, layout, character models/palette, animation implementation;
- final music/SFX or recording performance;
- exact accessibility-control widgets;
- runtime schema field names for the EPB's semantic events;
- number of replay taps and support timings (test in E01 prototype).

**Next workstream:** E01 Interaction Specification. It must follow this approved script and EPB and must not write new canon or voice dialogue on its own.
