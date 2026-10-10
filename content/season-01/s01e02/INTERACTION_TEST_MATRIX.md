# S01E02 Interaction Test Matrix — E02-2 authoring QA

**Status:** SPECIFIED / NOT EXECUTED; tests are acceptance expectations for future E02 runtime, not evidence of passing gameplay.

**Sources:** [EPB rev 2](EPISODE_PRODUCTION_BRIEF.md), [Riverside E02-0](RIVERSIDE_E02_0_DESIGN.md), [E02 script rev 1](DETAILED_SCRIPT.md), [E02 interaction spec rev 1](INTERACTION_SPEC.md), [E01 lessons](../../../docs/E01_LESSONS_LEARNED_2026-10-10.md).

## Automated / browser acceptance plan

| Test ID | Scenario / input | Required expected result | Evidence type | Status |
|---|---|---|---|---|
| E02-N01 | Load E02 with real E01 completion + RIVERSIDE revealed events | Entry available; E01 Chronicle/marker unchanged; opening doesn't invent E01 state | unit/browser | NOT RUN |
| E02-N02 | Load E02 without either E01 prerequisite | Graceful locked state/return to E01, no fabricated event | unit/browser | NOT RUN |
| E02-S01 | Fresh launch / required introduction | Fence-only initial hypothesis spoken/captioned **before** player can enter evidence notebook; no skip of essential line | script/browser | NOT RUN |
| E02-G01 | Tap/keyboard/assist movement aimed beyond closure | Milo's feet stop on safe public paving; followers stop there too, no swimming/bridge/fence bypass | path unit + rendered video | NOT RUN |
| E02-G02 | Click fence then click close adjacent paving repeatedly | No stuck path or teleport; safe retreat to promenade available | browser/video | NOT RUN |
| E02-G03 | Use signed side path, keyboard route, or accessible Go to lookout | All follow same public same-bank graph, ending protected lookout with railing; no crossing closed spur | path unit + browser | NOT RUN |
| E02-G04 | First legitimate lookout arrival before any evidence | Exactly one overlook-accessible canonical event; revisitable after refresh even with E02 incomplete | event ledger + browser | NOT RUN |
| E02-I01 | Old-stones inspect then lookout/gap inspect | Both required true observation flags; actual evidence displayed; notebook eligible | browser/caption | NOT RUN |
| E02-I02 | Lookout/gap inspect then return to old-stones inspect | Same flags and reasoning access as reverse order, with no forced backtrack afterward | browser/state | NOT RUN |
| E02-I03 | Merely walk past both hotspots, or only open old map/Listen | No observation flags falsely set; no automatic map popup | unit/browser | NOT RUN |
| E02-I04 | Observe only stones, open notebook/Continue attempts | Revision remains inaccessible until gap also observed; child can reach gap station | unit/browser | NOT RUN |
| E02-I05 | Observe only gap, attempt correction | Cannot claim historical connection until actual stones inspection; child can return to it | unit/browser | NOT RUN |
| E02-R01 | With both observed, choose old-stones tile as disconfirmation | Helpful then/now feedback; no score, no event, player not trapped; gap remains selectable | state/browser | NOT RUN |
| E02-R02 | Choose gap tile and revision A | Contradiction and uncertainty presented; changed-confirmed canonical event emitted once | state/browser | NOT RUN |
| E02-R03 | Choose gap tile and revision B | Same canonical outcome as A; alternate dialogue only, no branch explosion | state/browser | NOT RUN |
| E02-R04 | Choose Not sure yet before evidence link | Can inspect/rethink/hint; does not auto-pass; no punitive feedback | browser | NOT RUN |
| E02-R05 | Multiple rapid taps, saved mid-dialogue, refresh | No duplicated canonical event; replay pending lines properly, does not skip required reasoning | state/browser | NOT RUN |
| E02-P01 | Check cue before gap seen, after gap seen, while solo | Cue absent before true child-visible conflict; offered once only at eligible notebook, optional and spoiler-free | parent UI/browser | NOT RUN |
| E02-M01 | Inspect fixture before evidence-backed correction | No legible Market Lane reveal/recording or E03 unlock | assets/browser | NOT RUN |
| E02-M02 | Intentionally inspect fixture after correction at safe lookout | Market Lane legible only now; record exactly once even on repeat clicks | state/browser | NOT RUN |
| E02-C01 | Reach overlook, leave before Chronicle, resume | Overlook remains revisitable but E02 is not completed; E03 locked | state/reload | NOT RUN |
| E02-C02 | Complete Chronicle with all prerequisites | E02 completion once; E03 unlock; barrier stays closed; Chronicle shows then/now, unknown cause, overlook and Market hook | unit/browser | NOT RUN |
| E02-C03 | Historical replay after completing E03 or later | No additional canonical events, no E01 rollback, no reopening old bridge or reset of world | replay tests | NOT RUN |
| E02-E01 | Fresh/incognito, storage denied/corrupt, Start new adventure | Clear recovery and no false persisted success; E01 unrelated save does not get overwritten | storage/browser | NOT RUN |
| E02-E02 | E01 baseline full regression at E02 runtime PR HEAD | Existing E01 script, scratch progress, glyph/map, portrait/name, safe movement, save and UX paths remain PASS | latest-HEAD CI | NOT RUN |
| E02-E03 | 1366×900, desktop short, 320/360/390/430 phones + landscape | No cropped critical gap/old-stones/actor feet or labels; portrait/dock/Listen/parent mode/readable route visible | actual screenshots | NOT RUN |
| E02-E04 | Motor-only/key/touch, text/Listen off, reduced motion | Same safe progression without precision pointer, audio, dragging or time pressure | browser/device | NOT RUN |
| E02-A01 | Inspect raw source art/state reference | No baked Market text on early state, no physically continuous current bridge, original PNG bytes/hash verified | reference/asset QA | NOT RUN |
| E02-A02 | Build static package/deploy MN4 | Runtime-only package, verified current source SHA+build over HTTPS and rollback; do not claim CI equals deployment | release test | NOT RUN |
| E02-U01 | Observe real 6–9 EFL child + parent using episode | Can articulate past stones vs now gap and meaningful revision, without parent giving answer; actual timing within tolerable session | family observational UX | NOT RUN |

## Authoring review gate (E02-2)

- [ ] Each bracketed exact spoken line ID in script is unique; E01's 121 lines untouched.
- [ ] Every script branch and optional/recovery line has exactly one defined trigger in interaction spec; no dialogue after an unpresented fact.
- [ ] Parent cue trigger occurs after Milo's first guess and the child's conflicting observation.
- [ ] All visible scene states are safe, physically coherent and storyboard-testable.
- [ ] No "bridge repaired," crossing, revealed Common, invented culprit/cause or unlocked Market Lane too early.
- [ ] No save schema or release status is declared implemented merely by documentation.
- [ ] Human review/owner signoff of exact script and behavior before advancing to prompt/media generation.

**Important:** This document is a planned test matrix. Nothing in it marks a browser, actual device, accessibility or family test as performed.
