# S01E05 Interaction / Continuity Test Matrix — proposed v1

**All tests NOT RUN.** This is a Gate 1 draft acceptance contract, not runtime evidence or E05 production approval. Sources: [E05 EPB](EPISODE_PRODUCTION_BRIEF.md), [interaction spec](INTERACTION_SPEC.md), approved Season 1 story/learning, E04 draft PR #114. Do not mark PASS from document review or from E01/E03 green CI.

| ID | Layer | Scenario / input | Expected observable result | Status |
| --- | --- | --- | --- | --- |
| E05-N01 | Narrative | Start after genuine E04 canonical completion | E03 station/garden memories stay attributed; E04 relative uncertainty retained; no fabricated year or garden cause | NOT RUN |
| E05-N02 | Narrative | Inspect board and station records | Distinguish physical board observation from claims in records; no omniscient narrator or Common reveal | NOT RUN |
| E05-N03 | Narrative | Finish | Foyer becomes small Map Room; station trains remain closed; garden-location question leads to E06 | NOT RUN |
| E05-L01 | Learning | Child hypothesizes object use before testing | Any plausible hypothesis or “not sure” is allowed; no answer-key lock | NOT RUN |
| E05-L02 | Learning | Fit-first replica orientation | Child can inspect two alignment features and qualify inference without forced wrong choice | NOT RUN |
| E05-L03 | Learning | Mismatch-first orientation | Visible mismatch, reversible re-placement and visible match; no penalty or damage | NOT RUN |
| E05-L04 | Learning | Test fits, records not inspected | No completion; fit alone never proves entire route history | NOT RUN |
| E05-L05 | Learning | Child overclaims from one record | Support asks what record shows; source remains attributed; child can revise | NOT RUN |
| E05-U01 | UI/movement | Milo walks to board/records/worktable | All waypoints correspond to continuous, painted legal floor; no teleport or unshown path | NOT RUN |
| E05-U02 | UI/space | Table preview blocks real circulation | Obstruction visibly demonstrated; cannot confirm until placed in a feasible position | NOT RUN |
| E05-U03 | UI/space | Both candidate table positions visibly feasible | Both accepted; no arbitrary hidden wrong answer | NOT RUN |
| E05-U04 | UI/accessibility | 568×320, 320×740, 390×844, 1366×900 | Scene remains legible, focus/choices reachable, no sideways overflow; 44 CSS px controls where feasible | NOT RUN |
| E05-U05 | UI/accessibility | Keyboard/tap alternative to drag, Listen, reduced motion | Same reasoning path and evidence available without precise drag/audio or motion | NOT RUN |
| E05-P01 | Parent | Parent never interacts | Child can finish via independent hints and controls | NOT RUN |
| E05-P02 | Parent | Parent cue after first inspection | Prompt invites a safe test; does not reveal fit or historical explanation | NOT RUN |
| E05-S01 | Safety | No authorization to enter public foyer | Production scene remains locked; no trespass, lock-picking or unsafe route | NOT RUN |
| E05-S02 | Safety | Replica test attempted | Original archival board is never moved, damaged or overwritten | NOT RUN |
| E05-C01 | Prerequisite | Missing/corrupt E04 canonical ledger | E05 canonical entry denied; no synthetic E04 completion | NOT RUN |
| E05-C02 | Prerequisite | E04 authoring preview or historical replay only | E05 canonical entry denied; developer preview explicitly isolated | NOT RUN |
| E05-C03 | Ledger | Repeated `finish` or repeated save/reload | No duplicate canonical completion, Map Room or Chronicle event | NOT RUN |
| E05-C04 | Ledger | Restart E05 | E01–E04 progress unchanged; E05 only reset before canonical completion | NOT RUN |
| E05-C05 | Ledger | Replay E05 after E06 progress | Read-only historical state; current Map Room/world and later discoveries not rolled back | NOT RUN |
| E05-C06 | Ledger | Tampered `walkwayClear`, `phase:completed`, event order or unknown action | Fails closed; state reconstructed from validated bounded actions | NOT RUN |
| E05-C07 | Unlock | E05 preview reaches local end | No E06 canonical unlock or production event | NOT RUN |
| E05-E01 | Regression | Build/release integration | E01/E02/C01 bytes and accepted gameplay unchanged; E03 canonical progress preserved | NOT RUN |
| E05-E02 | Packaging | E05 runtime release requested | Exact-head Node/Chromium, integrity, package, remote HTTPS and rollback separately verified | NOT RUN |
| E05-E03 | Device/family | Owner real-device play | Physical foyer navigation, text, portrait/landscape, story understanding accepted | NOT RUN |

## Minimum isolated engineering prototype (not canon)

Before art or runtime release, implement only the **replica orientation test and table footprint preview** with a bounded state machine. Required test assertions:

1. Orientation mismatch is observable and reversible; a match cannot bypass observation of two physical features.
2. A match alone does not award a historical or completion event.
3. Both fit-first and mismatch-first paths can reach the same **draft-only** explanation without penalizing a child.
4. A physically blocked table position cannot be confirmed; a valid position can be revised before confirming.
5. Invalid action, corrupted state, replay or draft mode cannot write a canonical event or unlock E06.
6. All source IDs, provenance and dates remain placeholders until a single Gate 1 approval; synthetic preview data never appears in production assets.

**Next task:** Build and Node-test this isolated reversible test module, with clearly synthetic geometry and no production import. Only after E05 Gate 1 approval should it be connected to a painted scene, source records, E04 completion and canonical ledger.
