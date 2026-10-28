# S01E05 — Station Foyer Interaction Specification (draft v1)

**Status:** candidate Gate 1 engineering contract, NOT approved script/canon, NOT implemented or playable. Read [EPB](EPISODE_PRODUCTION_BRIEF.md) first. The E04 source decision pack in PR #114 is draft; no E04 canonical save or E05 production unlock exists yet. This specification cannot override Season 1 architecture or fabricate prior history.

## 1. One living scene, several meaningful states

The release unit is one **Station Foyer → Map Room** living scene, plus bookends; not another drag-the-timeline puzzle. The child controls Milo to inspect a board, test a replica and lay out a future public workspace. World growth is visible when the table/map display appears.

Proposed phases:

`entry` → `explore` → `test` → `records` → `reuse` → `chronicle` → `completed`

Within `explore`, `test` and `records`, returning to a prior inspectable object is allowed. A phase label must not prevent rereading evidence. Reversible placement can be revised until `confirm-reuse`.

**Production entry guard:** use a future `e05Handoff` that replays a validated canonical E04 ledger, checks its final completion and evidence events, and checks prior E01–E03 continuity as needed. Never accept a boolean flag, copied ledger array, `draft_preview`, historical replay, or localStorage key existence as proof. A developer-only preview must have its own isolated storage namespace (or no storage), be clearly labeled, and have no canonical save/event writes.

## 2. Proposed state schema — do not ship until EPB Gate 1

```js
{
  mode: "authoring_preview", // future: canonical | historical_replay
  phase: "entry",
  visited: [],                // board, slots, label, record-route, record-garden, record-hill
  hypothesis: null,           // route_board | notice_board | unsure; not scored
  replicaOrientation: null,   // first | second; only replica moves
  observedFit: false,         // requires inspection of at least two visible features
  testConclusion: null,       // partial_support | still_unsure; never "full_route_proven"
  recordsCompared: [],        // IDs are proposal placeholders until approved
  unknownGardenCause: false,
  tablePlacement: null,       // near_wall | across_walkway; illustrated, not invented geometry
  walkwayClear: false,
  chronicleSeen: false,
  history: []                 // bounded, validated actions; no arbitrary code execution
}
```

All proposed IDs and text need schema/source validation before runtime. `visited` is an inspection log, **not** a claim that the child inferred the correct historical explanation. Canonical event IDs are proposals in the EPB, not accepted runtime facts.

## 3. Actions, preconditions, effects and recovery

| Action | Guard | Effect / visible feedback | Nonpunitive recovery |
| --- | --- | --- | --- |
| `begin` | Validated entry or explicit preview mode | Milo arrives in authorized public foyer; board/room visibly closed to train service | Exit/back; never alter upstream saves |
| `walk-to` | Known connected safe in-scene waypoint | Milo walks along illustrated legal floor to board/desk/worktable | No teleport to blocked or unpainted floor; keyboard list alternative |
| `inspect` | Object in accessible area | Record exact visible feature; reveal close view of slots, worn mark, label or desk | Reinspect freely; no score |
| `propose-use` | Board inspected | Store revisable hypothesis; **does not** award evidence/completion | Change to any other plausible hypothesis |
| `place-replica` | Visible replica/marks inspected; `mode` permits changes | Position **replica only** in either illustrated orientation; mismatched peg/wear marks remain visibly unmatched | Move/reverse immediately, no damage or penalty |
| `compare-fit` | At least two relevant physical features inspected and replica placed | Child inspects matched/unmatched features; sets partial-support/unsure, **never full historical certainty** | Return to inspect/reposition |
| `inspect-record` | Public record desk reachable | Read attributed short record, preserve provenance; no exact dates invented | Revisit; do not force a particular order |
| `compare-records` | Board test observed + approved source evidence inspected | Distinguish observed board fit vs written route/garden/hill record; leave cause of garden move unresolved | Hint asks which source says what |
| `place-table` | Records comparison complete | Preview table footprint; show clear vs obstructed public circulation | Reposition before confirmation; no penalty |
| `confirm-reuse` | Physically plausible table footprint leaves walkway open | Stage small Map Room before/after visual; still no trains | Confirm only once; preview does not write canon |
| `open-chronicle` | Test + record + feasible reuse complete | Present attributed partial inference, open garden question, before/after Map Room | Close/reopen |
| `finish` | Chronicle viewed, legitimate canonical mode and verified prerequisites | Append once-only canonical events and completion in atomic validated save | Historical replay read-only; authoring preview can end locally without unlock |

**Fail closed:** an unknown action, invalid object ID, impossible waypoint, invalid phase, corrupted history, repeated canonical event, unapproved record or unverified E04 checkpoint must never advance production progress. Reconstruct state from a bounded validated event log; reject a client-supplied mutable snapshot that pretends `walkwayClear:true` or `phase:completed`.

## 4. Physical puzzle proof — a *test*, not a quiz

The proposed replica has **two distinct visible alignment features** (for example a peg pair and a worn label boundary) and two illustrated orientations. Only a physically matching placement aligns both; the other leaves an obvious mismatch. **Exact feature geometry is not yet approved.** Do not invent a hidden answer in code and draw contradictory art.

- Child first observes at least one feature, then predicts where a removable **replica** could fit.
- Wrong-first: place it the other way → see two visible mismatches → try again → see fit; no “Wrong” banner, score, time penalty or destroyed item.
- Fit-first: observe a fit → inspect the alternative/mismatch or use a comparison focus → explain *why* the first fits; do not force the child to deliberately make an error.
- Child may retain `still_unsure` until inspecting a record; one fit supports a limited board-use hypothesis, **not** the whole route history.
- Text, accessible taps and keyboard all expose the same features; no dexterity-only drag or sound-only click is required.

## 5. Records: three claims, no invented precision

The approved Season architecture requires the station records to support three narrative discoveries: route changes; a garden detour; and full-loop use ending around North Hill closure. The **specific artifacts, wording, provenance and relative order are not yet approved**. Until then use neutral authoring labels in an isolated preview, never child-facing production facts. A valid record view must identify its source and what it actually supports; no calendar years, fabricated service schedules or cause of garden relocation.

The child must be able to conclude: “The board may have changed. These records say the route changed. We still need to find out why the garden moved.” E06 remains responsible for the garden investigation. A station record does not automatically prove a witness's entire memory or reveal the Common.

## 6. Map Room layout

Use one physically coherent foyer with a known accessible circulation corridor. The child previews a table/display placement that either leaves the corridor open or visibly blocks it. This is a spatial constraint, **not** an arbitrary “correct button.” If both illustrated placements are in fact safe, both must be accepted; do not mark one wrong for narrative convenience. If the environment art does not show a real passage, **do not** implement a fabricated obstruction; revise the visual plan first.

World state after canonical completion: station foyer remains open as a modest map/work area; no rail service or unsafe route restored. Later E06/E11 may show the same table and evolving maps.

## 7. Language, scaffolds and parent

- Short child-facing action labels (candidates): “Look at marks,” “Try the copy,” “Turn it,” “Check the fit,” “Read record,” “Move table,” “Open Chronicle.”
- EFL functions: “I think …”; “If … then …”; “It fits / doesn't fit”; “This mark shows …”; “We don't know yet.”
- Parent cue is optional and after the child's first observation: “What could we try without changing the old board?” No parent gate.
- Independent help: language replay → control demo → focus relevant feature → compare two features → model one inference → allow supported progression. Hints do not reveal hidden history.
- Touch targets at least 44 CSS px where feasible, keyboard alternatives, portrait and 568×320 landscape layout, readable focus panel, captions/Listen, reduced-motion placement. No precision drag/timer.

## 8. Persistence, restart and unlock boundaries

**Not yet implemented.** Future canonical ledger must use approved stable IDs, one event per meaningful completed fact, atomic save with integrity/ordering checks, exact-once completion, and read-only replay. E05 restart clears **only E05** progress; it must not erase E01–E04 or remove a later Map Room state. A new playthrough cannot manufacture E04 completion; a corrupt upstream save fails closed. Any future E06 unlock must require a verified E05 canonical completion, not the existence of a preview file.

## 9. Implementation slice order and gates

1. **Gate 1:** approve public foyer access, test prop geometry, and smallest plausible records batch. Keep EPB/spec draft until then.
2. **Noncanonical engineering prototype allowed now:** implement replica alignment + visible mismatch and table placement in an isolated state module with tests; no production route, new historical facts or canonical storage.
3. **Script/EFL:** lock exact short dialogue, line IDs and evidence attribution after Gate 1.
4. **Visual:** choose approved painterly foyer/prop images, check geometry and readability before movement/fit collision claims.
5. **Runtime:** build real scene, validated E04→E05 gate, ledger/Chronicle, reset/replay and future E06 gate.
6. **QA/release:** execute [test matrix](INTERACTION_TEST_MATRIX.md), Node/Chromium/device and packaging; confirm real deployment/HTTPS/rollback separately.

This specification is a handoff for the next focused work, **not** proof of a playable E05.
