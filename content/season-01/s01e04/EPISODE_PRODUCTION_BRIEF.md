# S01E04 — Gate 1 working brief (draft)

Status: **draft / not Owner PASS**. Source: approved Season 1 Architecture and Learning Weave; E03 script and E03→E04 quality gates. This document is a proposal, not permission for art, runtime integration or deployment.

## Identity and source authority

```yaml
episode_id: s01e04
season_id: s01
arc_id: s01a01
working_title: "Everyone Remembers It Differently"
brief_revision: 1
brief_status: draft
content_version: pre-release
estimated_duration_min: 12
estimated_duration_max: 20
```

Authoritative inputs: `docs/SEASON_1_ARCHITECTURE.md`, `docs/SEASON_1_LEARNING_WEAVE.md`, `docs/WORLD_CONTINUITY.md`, `content/season-01/s01e03/DETAILED_SCRIPT.md`, `engine/s01e03.mjs`, and `docs/QUALITY_GATES_E03_E04.md`. Duration is an untested estimate.

## Proposed scene and interaction map

| Scene ID | Story function | Meaningful child action |
| --- | --- | --- |
| `s01e04-sc00` | Optional E03 recap, with both attributed memories | Begin without replaying E03 |
| `s01e04-sc01` | Inspect source table | Examine memory, map and photograph cards; distinguish testimony from documented evidence |
| `s01e04-sc02` | Build relative chronology | Place independently verifiable sources on an earlier/later ribbon, keeping uncertain items unplaced |
| `s01e04-sc03` | Compare perspectives | Explain how the two sincere memories can fit different times, without a forced false witness |
| `s01e04-sc04` | Chronicle and Arc 1 close | Save evidence-supported timeline and open the E05 station question |

`s01e04-int01` **Source-order investigation**: child compares visible source labels and chronology clues before placing cards. Support tap-to-select and keyboard placement as alternatives to dragging. Every placement can be revised; an undated card can remain “not sure yet.” Hints point to evidence, not to a highlighted answer. No exact year is assumed.

`s01e04-int02` **Reconcile memories**: child identifies an earlier/later distinction, connects it to one visible source and keeps uncertainty where justified. A supported explanation may say both residents remember genuine periods. Neither the interface nor the narrator silently turns recollection into historical fact.

**Open creative choice:** what specific source images and labels genuinely prove relative order? Candidates include an older station-associated record and a later garden-associated route record. These are *proposals*, not approved historical artifacts. Do not decide the garden relocation's cause or reveal the Common.

## Characters, parent cue and recovery

Milo shifts from “station or garden?” to “perhaps both, at different times”; Nia preserves sources and their uncertainties; Finn helps construct the timeline, without solving it for the child. Keep both E03 speakers' existing lines unchanged.

Recommended parent cue after child notices the difference: “Could both people be right? What would have to be different?” Optional follow-up: “What evidence would help?” Child-alone progression remains available. Language help, input help, reasoning hints and motor/accessibility alternatives must be independent. No timer, score, punitive mistake, essential color-only clue or audio-only evidence.

## Assets, narration and release limits

Reuse C01 identities, existing Chronicle shell, captions and Listen. New requirements (not production approvals): one source-comparison surface, a small number of legible source cards, and an earlier/later timeline with an explicit uncertain slot. Do not use SVG sketches as final illustration. Final script, voice-line IDs, visual art, music and prerecorded audio are downstream; recorded audio remains deferred. No new child data collection.

## Acceptance gates

| Check | Status |
| --- | --- |
| Owner approves plausible source chronology, interaction and EFL load | OPEN |
| E03 completion plus both memories read-only; no fabricated direct entry | NOT IMPLEMENTED |
| E04 reset/replay cannot erase E01–E03 progress or duplicate events | NOT IMPLEMENTED |
| Child genuinely orders evidence and explains a time-based reconciliation | NOT TESTED |
| Phone portrait/short-landscape, keyboard, captions and Listen | NOT TESTED |
| E03 full Gate 3, E01/E02/E03 regressions and safe packaging | BLOCKED / NOT TESTED |
| Verified deployment and real-device Owner PASS | NOT TESTED |

E04 Gate 1 authoring can proceed separately. E04 playable integration **must wait** for E03 full Gate 3 and tested progression. This draft must not be promoted to `approved_for_script` without Owner approval.

## Story
The two E03 witnesses recall different destinations: the Market coordinator remembers a route to the station, and the Garden resident remembers a route to the garden. Both recollections remain attributed and sincere. Milo, Nia and Finn compare old maps, photographs and recollections to ask **when** each account could have been true. E04 closes Arc 1 with an evidence-based relative timeline, without revealing the Common, North Hill history, or why the garden moved.

## Learning
Primary: order evidence in time and reconcile apparently conflicting sources. Language: before/after, then/now, both/different. The child inspects visible source clues, places cards earlier/later or uncertain, and explains why both accounts may fit different periods. Do not invent dates or label one witness a liar. Reversible input, captions, Listen and keyboard alternatives are required.

## Continuity
Read E03 canonical completion plus both recorded memories; never fabricate prior episode progress. Candidate E04-only events: `s01e04_relative_timeline_recorded`, `s01e04_both_memories_contextualized`, `episode_completed:s01e04`. Save/replay/reset must preserve E01–E03 records. E04 playable integration is blocked until E03 full Gate 3; current E03 issues #108/#109 and release #110 remain open.

## Open for Owner review
Choose historically plausible, inspectable source cards and the relative-order evidence; confirm the interaction design and story tone before approving a detailed script. No new art, final dialogue or runtime is approved.
