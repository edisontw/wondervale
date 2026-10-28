# S01E06 Two-Garden Interaction Test Matrix

**Gate 1 DRAFT / ALL NOT RUN** as of 2026-10-29. This is a test contract, not a claim that E06 is playable. Source: [E06 EPB](EPISODE_PRODUCTION_BRIEF.md) and [interaction spec](INTERACTION_SPEC.md). Run the authoring engine subset before any E06 UI release; production gates require approved E04/E05 chain and real site/art.

| ID | Layer | Test / stimulus | Expected observation / invariant | Status |
| --- | --- | --- | --- | --- |
| E06-S01 | Scene identity | Enter Current Garden | Distinct healthy uphill garden, walkable Milo anchors, not a questionnaire | NOT RUN |
| E06-S02 | Scene identity | Enter Lower Garden | Separate terrain/composition, Milo movement, water trace/path and planting marker | NOT RUN |
| E06-S03 | Scene identity | Skip Current Garden directly to Lower Garden | Canonical flow denied; isolated dev preview clearly labeled | NOT RUN |
| E06-S04 | Trigger | Finish E05 preview but no canonical ledger | E06 canonical entry denied | NOT RUN |
| E06-S05 | Trigger | Complete valid E05 canonical chain | E06 unlock only through approved production integration | NOT RUN |
| E06-I01 | Observe | Inspect present-bed and slope in either order | Two distinct observations remembered; no auto-cause verdict | NOT RUN |
| E06-I02 | Observe | Attempt model comparison before observations | Does not advance or fabricate evidence | NOT RUN |
| E06-I03 | Observe | Inspect healthy bed only, then request lower garden | Cannot bypass reasoning; hint highlights missing observation | NOT RUN |
| E06-I04 | Model | Run dry configuration | Visible dry trace, not a historical claim | NOT RUN |
| E06-I05 | Model | Run rain with channel blocked | Visible model catchment wetter; result labeled synthetic | NOT RUN |
| E06-I06 | Model | Change channel and rerun | Different visible water route; old observation retained for comparison | NOT RUN |
| E06-I07 | Model | Try favorable channel first | Child can still complete meaningful comparison without forced mistake | NOT RUN |
| E06-I08 | Model | Try unfavorable channel first | Nonpunitive retry, same valid ending | NOT RUN |
| E06-I09 | Model | Try to finish after only one weather or no changed-channel run | Cannot claim comparison or leave as complete | NOT RUN |
| E06-I10 | Model | Restart/rewind miniature model | Does not alter current garden, lower pocket or canonical ledger | NOT RUN |
| E06-I11 | Evidence | Finish model | Output states “may/can,” does not assert actual historical cause | NOT RUN |
| E06-L01 | Lower | Walk to runoff trace and public path | Both visible and inspectable, with touch/keyboard equivalents | NOT RUN |
| E06-L02 | Lower | Place marker on runoff-channel | Water constraint visibly demonstrated, can move | NOT RUN |
| E06-L03 | Lower | Place marker on footpath | Access blockage visibly demonstrated, can move | NOT RUN |
| E06-L04 | Lower | Move marker to raised-pocket | Both modeled constraints clear; provisional trial available | NOT RUN |
| E06-L05 | Lower | Try to confirm without inspecting constraints | Does not complete or write events | NOT RUN |
| E06-L06 | Lower | Confirm at blocked site | Does not complete; nonpunitive correction available | NOT RUN |
| E06-L07 | Lower | Confirm at viable site | Only a small preview pocket appears; present garden unchanged | NOT RUN |
| E06-L08 | Lower | Complete twice | No duplicate preview action/event, no E07 unlock | NOT RUN |
| E06-C01 | Chronicle | Preview after model and planting | Observed vs simulated vs unknown clearly separated; then/now shown | NOT RUN |
| E06-C02 | Growth | Preview future E11 callback | Pocket stage changes only under approved future event, not time or repeated replay | NOT RUN |
| E06-C03 | Ledger | Replay E06 after later world growth | Read-only; no rollback of current pocket, no new canonical event | NOT RUN |
| E06-C04 | Ledger | Tamper snapshot/phase, event history or mode | Fail closed; never grant E06 completion or E07 unlock | NOT RUN |
| E06-C05 | Ledger | Unknown action / arbitrary site / forged weather result | Ignored/rejected, no history mutation or events | NOT RUN |
| E06-C06 | Ledger | Repeated reset of E06 | E01–E05 checkpoint, present garden and accepted C01 unaffected | NOT RUN |
| E06-C07 | Ledger | No E04/E05 approval / missing source | Synthetic model remains isolated; no production history/Chronicle assertion | NOT RUN |
| E06-E01 | EFL | Limited-English child uses Listen/visual scaffold | Can compare terrain and revise without reading long text | NOT RUN |
| E06-E02 | Parent | Parent cue displayed after model comparison | One optional nonspoiling cue; child can continue alone | NOT RUN |
| E06-E03 | Accessibility | Touch and keyboard for model, movement and marker | Same outcome; no precision or timer | NOT RUN |
| E06-E04 | Mobile | 568×320, 667×375 landscape; portrait fallback | Garden visible, controls/captions legible, no accidental page overflow | NOT RUN |
| E06-E05 | Regression | Integrate E06 only after approval | E01/E02/E03/C01 bytes and existing saves unchanged | NOT RUN |
| E06-E06 | Release | E06 production package and MN4 deploy | Exact-head CI, artifact integrity, HTTPS and rollback separately verified | NOT RUN |
| E06-E07 | Family | Owner/family play two spaces | Both count as genuine interactive scenes; child can explain change without a quiz | NOT RUN |

## Minimum isolated prototype exit (noncanonical)

A Node-tested, pure state-machine preview must prove: (1) two phases with independent observations, (2) dry/rain and channel-change evidence without a fabricated historical conclusion, (3) physically distinguishable wet-route and blocked-path placement, (4) valid first try and correction path both work, (5) deterministic replay and tamper failure, and (6) **zero canonical events/unlocks/storage**. Browser/real-device tests remain NOT RUN until separately executed.

## Owner Gate 1 — single grouped decision

Before `approved_for_script`, approve or revise: (a) two distinct site topologies and safe access, (b) defensible water/terrain evidence and historical-source attribution, (c) permission/stewardship for planting, and (d) what the approved lower pocket/growth visuals depict. This is a **batch** request; do not block independent synthetic engineering on each item.