# S01E02 Detailed Script — The Bridge That Stops

- episode_id: s01e02
- script_revision: 1
- script_status: draft_for_review
- source_brief: content/season-01/s01e02/EPISODE_PRODUCTION_BRIEF.md
- source_brief_revision: 2
- language: en
- dialogue_lock: **NOT YET LOCKED**
- authoring_scope: full playable dialogue and captions; no audio files

**Authority:** Owner-approved EPB rev 2 and Riverside E02-0 design determine story, evidence, safety, characters, scene states and world effects. This script proposes **exact English text with unique line IDs** for E02-2 review, not a released voice export. It must not change E01's 121 locked lines or introduce a speaking NPC.

**Line rules:** A bracketed [S01E02-SPEAKER-###] prefix marks one exact proposed spoken/caption line. NARRATOR is story/Chronicle; MILO, NIA and FINN use existing core identities; UI is accessible player instruction with optional on-demand speech. [stage], [choice], [state] and Parent View copy **are not spoken lines**. Order-independent speech is emitted **once within this playthrough** when its observation is genuinely presented, except explicitly requested Listen replay; numeric IDs never force a visit order. All player-required text is true accessible caption text, not baked into background art.

## SC00 — A short shared memory (parent preview and Begin)

[stage] Optional under-one-minute Parent View. The child may Begin without parent input. The approved RIVERSIDE marker from E01 may appear in a memory card, but the old map opens later **only on explicit player request**, never as a blocking auto-modal.

Parent preview (not voiced): “The children are following the Riverside clue. Your child will see an old path and a new place to look. Let them compare what is there now with what Milo first expects. Do not tell them why the bridge changed.”

- [S01E02-NARRATOR-001] “Milo and his friends have a new place to visit.”
- [S01E02-NARRATOR-002] “The old sign points to Riverside.”
- [S01E02-UI-001] “Begin the Riverside adventure.”

[state] Begin/Continue after the required opening text leads to SC01. If opened directly from E01 completion, use the same source ledger, not a new imaginary E01 completion.

## SC01 — The living Riverside and Milo's first idea

[stage] The present near-bank promenade is used and friendly. A closed old spur leads toward the water but stops at a strong public closure. A readable public “RIVERSIDE LOOKOUT” sign marks a **different, open** path on this same bank. Milo starts on pavement with Nia/Finn spaced apart and their names readable. The far-bank landing and missing deck are physically present as art facts but not pre-interpreted by captions.

- [S01E02-NARRATOR-003] “Riverside is busy today.”
- [S01E02-MILO-001] “We made it!”
- [S01E02-FINN-001] “I can hear the water.”
- [S01E02-NIA-001] “Here is the old path.”
- [S01E02-MILO-002] “But it stops at a fence.”
- [S01E02-MILO-003] “Maybe the new fence is the only change.”
- [S01E02-MILO-004] “Maybe the old way is still behind it.”
- [S01E02-NIA-002] “Let's look before we decide.”
- [S01E02-FINN-002] “There is a lookout sign, too.”
- [S01E02-UI-002] “Explore from the public paths.”

[state] Initial theory `fence_only` is recorded before free movement or correction. Player controls **Milo**. Never begin with a claim that the gap proves anything.

## SC02 — Explore the old approach and the safe lookout (either order)

[stage] Two required **observed categories**, not two tiny objects: old aligned stones (safe standoff near old spur) and changed edge/open gap (from protected public lookout). The player can visit either first. At the old spur, Milo must stop on public paving **before** the fence; behind it is always non-traversable. At the public lookout the player chooses to examine the distant connection from behind a complete guardrail. An optional old-map card is available by direct request after the first child observation, but it does not match/overlay landmarks and never opens automatically.

### Old path / stone-footing station

When the child chooses the large “Look at old stones” station:

- [S01E02-UI-003] “Look at the old stones.”
- [S01E02-MILO-005] “These stones are very old.”
- [S01E02-NIA-003] “There are stones on both sides.”
- [S01E02-FINN-003] “They point to the same line.”
- [S01E02-NIA-004] “The old path was here.”
- [S01E02-MILO-006] “So the map may show a real old way!”

[state] The child has **seen** `ev_e02_old_stones`. Nia's note may use a picture of both banks; she does not say why the bridge stopped. Re-inspection brings a brief caption and optional Listen, not a new canonical event.

### Attempted approach to the CLOSED spur (optional)

[stage] A movement request to a point beyond the closure is **clamped** at a safe stand-off target. No invisible wall, maze, damage, alternate bypass, simulated jump or reward for trying. The child retains an immediate exit to the public path.

- [S01E02-UI-004] “This old path is closed.”
- [S01E02-FINN-004] “We can look from here.”
- [S01E02-NIA-005] “The public lookout is open.”

### Signed same-bank public ramp / arrival

[stage] The child actively walks Milo along the public ramp, or chooses the equivalent accessible “Go to lookout” route action. A physical gate is **not** opened. First arrival makes the safe overlook a persistent, **revisitable** destination (once-only event), even if the player later leaves before episode completion.

- [S01E02-UI-005] “Follow the sign to the lookout.”
- [S01E02-NARRATOR-004] “The path bends along this side of the river.”
- [S01E02-MILO-007] “We can see more from here.”
- [S01E02-FINN-005] “And we stayed on the safe path.”

[state] If the child arrived here before inspecting the old stones, allow them to go back and observe the stones later. Nothing resets or auto-counts as inspected simply by walking.

### Look across / changed bank edge station

Only when the player chooses the large “Look across” affordance **from the protected overlook**:

- [S01E02-UI-006] “Look across the water.”
- [S01E02-MILO-008] “Wait. There is no bridge here now.”
- [S01E02-NIA-006] “I see an open gap.”
- [S01E02-FINN-006] “A path needs a way across.”
- [S01E02-FINN-007] “But there is no deck.”
- [S01E02-NIA-007] “The edge is different now.”
- [S01E02-MILO-009] “That is more than a fence!”

[state] The child has seen `ev_e02_changed_edge` (gap/absent deck); `ev_e02_new_edge` is visible as corroboration, without a third compulsory inspection. The child may see the view before the stones; the initial hypothesis was already delivered during SC01. Nia does not explain the gap's cause.

### Optional ordinary Riverside life / tools

- [S01E02-MILO-010] “This is a nice place to stop.”
- [S01E02-FINN-008] “The river keeps moving.”
- [S01E02-UI-007] “Open the old map.”
- [S01E02-NIA-008] “The old map shows a line here.”

[stage] The above ambient pair is optional; map text appears only after direct Open map action, in one dismissible copy. Closing map returns to Milo and **never advances the scene**.

## SC03 — Which observation does not fit Milo's idea?

[stage] Available when both old-stone and changed-edge observations have been shown. The child may be standing anywhere on the public path. A small pictured notebook shows Milo's **existing fence-only idea**, one tile “Old stones on both banks,” and one tile “No bridge deck today.” Neither caption names the unexplained cause. No scoring and no fixed interaction timer.

- [S01E02-NIA-009] “We have two things to remember.”
- [S01E02-MILO-011] “I thought it was only the fence.”
- [S01E02-UI-008] “Which fact does not fit that idea?”

**Parent cue `s01e02-cue-01` is offered once, only now** (after Milo's hypothesis and the child's own view of the missing deck, at/before notebook selection). Recommended/skippable; child may continue alone. Parent copy, not voiced: “What can we see that doesn't fit Milo's first idea?” Optional follow-up: “What do we know, and what do we still wonder?” The parent panel does not preselect or emphasize the answer.

### Child chooses the *old stones* fact first (recoverable evidence discussion)

- [S01E02-NIA-010] “Those stones show where the way was.”
- [S01E02-FINN-009] “Do they show a bridge here now?”
- [S01E02-UI-009] “Look at both facts again.”

[stage] Return to the same notebook with both pictured facts still visible. **No red cross, point loss, or repeated trap**, and no auto-selection of gap. Repeated selection can receive the same shorter caption without replaying discovery dialogue.

### Child chooses the *missing bridge deck / gap* fact

- [S01E02-MILO-012] “Oh. My idea does not fit.”
- [S01E02-MILO-013] “The fence is not the only change.”
- [S01E02-NIA-011] “The stones show the old way.”
- [S01E02-FINN-010] “The gap shows what is here now.”
- [S01E02-UI-010] “What can Milo say now?”

[state] Evidence-link milestone is earned from this **deliberate, observed** selection, not by opening the notebook or pressing Continue. The child then selects one of the following accepted, episode-local Milo voice choices; both retain uncertainty and reach the same canonical evidence-backed outcome.

### Revision choice A — describe change

- [S01E02-MILO-014] “The bridge was here before.”
- [S01E02-MILO-015] “It is not here now.”
- [S01E02-MILO-016] “I don't know why it changed.”

### Revision choice B — qualify the first idea

- [S01E02-MILO-017] “I was wrong about only the fence.”
- [S01E02-MILO-018] “More has changed.”
- [S01E02-MILO-019] “Maybe we can learn why later.”

[stage] An optional “Not sure yet” keeps the notebook open and lets the child revisit the two observed facts; **after choosing the contradicting fact**, a child may also choose the qualified uncertainty wording and continue. No one names flood, neglect, villain, repair plan, the Common or North Hill history.

**Converged response:**

- [S01E02-NIA-012] “Our notes can show both times.”
- [S01E02-FINN-011] “A real old way. A different way now.”
- [S01E02-MILO-020] “Let's keep the question open.”

[state] Write `s01e02_old_connection_changed_confirmed` canonically **once**, only after the linked contradiction and one valid revision. Do not write it on either observation by itself. Enable SC04's explicit lookout-side marker inspection after this beat.

## SC04 — A mark that points forward

[stage] Milo can already be at the lookout; if elsewhere, a signed public return route remains available. **Only after** SC03's accepted evidence-backed revision, an in-place close view lets the player deliberately inspect a partly hidden old mark on the lookout-side public wayfinding fixture. Arrival background must not bake the legible destination into an earlier image.

- [S01E02-MILO-021] “What's that old mark?”
- [S01E02-UI-011] “Look at the old mark.”
- [S01E02-NIA-013] “It points along today's path.”
- [S01E02-FINN-012] “I can read the name.”
- [S01E02-FINN-013] “Market Lane!”
- [S01E02-MILO-022] “Another place to explore.”
- [S01E02-NIA-014] “Let's write it in our Chronicle.”

[state] Record `s01e02_market_lane_marker_recorded` once on the **intentional inspection**, not on overlook arrival or simply seeing a decorative fixture. The mark does not decode the unnamed Season 1 symbol.

## SC05 — Wondervale Chronicle: then and now

[stage] Chronicle has a legible pair of current/past observations (old stones/alignment and today's missing bridge/new edge), a persistent safe overlook destination and the Market Lane next clue. No image shows a usable present bridge across the closed spur. Child may review then choose Finish. Optional parent reflection is never required.

- [S01E02-NARRATOR-005] “The old path was real.”
- [S01E02-NARRATOR-006] “But the bridge is not here now.”
- [S01E02-NIA-015] “This picture shows the old stones.”
- [S01E02-NIA-016] “This picture shows the gap today.”
- [S01E02-MILO-023] “I changed my idea because of what we saw.”
- [S01E02-FINN-014] “And we found a safe place to look.”
- [S01E02-NIA-017] “We still do not know why.”
- [S01E02-NARRATOR-007] “The Riverside Overlook is now in the Chronicle.”
- [S01E02-NARRATOR-008] “One old mark points toward Market Lane.”
- [S01E02-UI-012] “Finish this chapter.”

[state] After explicitly completing the required Chronicle close, emit `episode_completed:s01e02` exactly once and make E03 eligible. The overlook remains available even before that point; the barrier is still closed.

**Parent reflection, optional (not voiced):** “How did Milo change his idea? What can the children say about the bridge, and what is still unknown?”

## Child-alone support, revisit and resume

All help is on-demand, not forced; number/order below is hint progression. A visible non-spoken controls hint can demonstrate tap/click/keyboard/accessible route without telling a reasoning answer.

- [S01E02-UI-013] “You can use the public path.”
- [S01E02-NIA-018] “What was here before?”
- [S01E02-NIA-019] “What can we see now?”
- [S01E02-FINN-015] “Try looking from the lookout.”
- [S01E02-UI-014] “Choose a picture you have seen.”

[stage] The specific gap evidence is highlighted by a later optional reasoning hint **only after the child has seen it**. Hints, Listen repeats, view reopening and parent toggles never mutate observation flags by themselves. If the player cannot use spatial movement, an accessible Go to lookout action follows the same safe public route; if the player cannot precisely tap a tiny object, each evidence station offers a large single action.

**Checkpoint recap on resume, when appropriate, not replacing required unplayed discovery lines:**

- [S01E02-NARRATOR-009] “We found the old path at Riverside.”
- [S01E02-NARRATOR-010] “Let's see what we know so far.”

**Historical replay:** dialogue and choices may be performed for memory only, never re-emit canonical ledger writes, reset E01 or hide a currently open overlook. Continue/Finish, rewind and Listen cannot double-commit.

## Line and content release gate

- Do not export voices until these line IDs and exact texts pass narrative/EFL/interaction cross-check and are explicitly promoted to a locked script revision.
- `MARKET LANE` becomes an in-world discovery in SC04 only; earlier optional map and UI must not display the destination. `RIVERSIDE` is known from E01.
- Draft script references [S01E02 Interaction Spec](INTERACTION_SPEC.md); any change to flow/evidence gates must be reconciled here and with EPB, not hidden in runtime.
