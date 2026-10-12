# S01E02 Interaction Test Matrix — E02-2 authoring QA

**Status:** PARTIALLY EXECUTED on E02 engineering-preview CI (2026-10-12). Only rows marked PASS have an automated assertion; PARTIAL items and all device/family/deployment signoffs remain open. Test scope does not imply E02 owner playable PASS.

**Sources:** [EPB rev 2](EPISODE_PRODUCTION_BRIEF.md), [Riverside E02-0](RIVERSIDE_E02_0_DESIGN.md), [E02 script rev 1](DETAILED_SCRIPT.md), [E02 interaction spec rev 1](INTERACTION_SPEC.md), [E01 lessons](../../../docs/E01_LESSONS_LEARNED_2026-10-10.md).

## Automated / browser acceptance plan

| Test ID | Scenario / input | Required expected result | Evidence type | Status |
|---|---|---|---|---|
| E02-N01 | Load E02 with real E01 completion + RIVERSIDE revealed events | Entry available; E01 Chronicle/marker unchanged; opening doesn't invent E01 state | unit/browser | PARTIAL — E01-completed fixture, not real first-play continuation |
| E02-N02 | Load E02 without either E01 prerequisite | Graceful locked state/return to E01, no fabricated event | unit/browser | PASS — browser locked state |
| E02-S01 | Fresh launch / required introduction | Fence-only initial hypothesis spoken/captioned **before** player can enter evidence notebook; no skip of essential line | script/browser | PASS — browser line-by-line introduction |
| E02-G01 | Tap/keyboard/assist movement aimed beyond closure | Milo's feet stop on safe public paving; followers stop there too, no swimming/bridge/fence bypass | path unit + rendered video | PARTIAL — route graph and near-bank positions; click-to-water visual QA open |
| E02-G02 | Click fence then click close adjacent paving repeatedly | No stuck path or teleport; safe retreat to promenade available | browser/video | NOT RUN — repeated scene pointer-edge QA |
| E02-G03 | Use signed side path, keyboard route, or accessible Go to lookout | All follow same public same-bank graph, ending protected lookout with railing; no crossing closed spur | path unit + browser | PARTIAL — route graph & accessible Go-to; keyboard traversal open |
| E02-G04 | First legitimate lookout arrival before any evidence | Exactly one overlook-accessible canonical event; revisitable after refresh even with E02 incomplete | event ledger + browser | PASS — unit + browser once-only lookout |
| E02-I01 | Old-stones inspect then lookout/gap inspect | Both required true observation flags; actual evidence displayed; notebook eligible | browser/caption | PASS — state-unit both observation orders |
| E02-I02 | Lookout/gap inspect then return to old-stones inspect | Same flags and reasoning access as reverse order, with no forced backtrack afterward | browser/state | PASS — state-unit + reverse-order browser |
| E02-I03 | Merely walk past both hotspots, or only open old map/Listen | No observation flags falsely set; no automatic map popup | unit/browser | PASS — station-inspection unit + browser |
| E02-I04 | Observe only stones, open notebook/Continue attempts | Revision remains inaccessible until gap also observed; child can reach gap station | unit/browser | PASS — state-unit notebook gate |
| E02-I05 | Observe only gap, attempt correction | Cannot claim historical connection until actual stones inspection; child can return to it | unit/browser | PASS — state-unit both observed gate |
| E02-R01 | With both observed, choose old-stones tile as disconfirmation | Helpful then/now feedback; no score, no event, player not trapped; gap remains selectable | state/browser | PASS — unit + browser unscored recovery |
| E02-R02 | Choose gap tile and revision A | Contradiction and uncertainty presented; changed-confirmed canonical event emitted once | state/browser | PASS — state-unit revision A |
| E02-R03 | Choose gap tile and revision B | Same canonical outcome as A; alternate dialogue only, no branch explosion | state/browser | PASS — state-unit + browser revision B |
| E02-R04 | Choose Not sure yet before evidence link | Can inspect/rethink/hint; does not auto-pass; no punitive feedback | browser | PASS — state-unit unsure |
| E02-R05 | Multiple rapid taps, saved mid-dialogue, refresh | No duplicated canonical event; replay pending lines properly, does not skip required reasoning | state/browser | PARTIAL — pending-line resume unit; real browser interruption stress open |
| E02-P01 | Check cue before gap seen, after gap seen, while solo | Cue absent before true child-visible conflict; offered once only at eligible notebook, optional and spoiler-free | parent UI/browser | PARTIAL — browser cue timing; solo-family human QA open |
| E02-M01 | Inspect fixture before evidence-backed correction | No legible Market Lane reveal/recording or E03 unlock | assets/browser | PASS — browser no early destination |
| E02-M02 | Intentionally inspect fixture after correction at safe lookout | Market Lane legible only now; record exactly once even on repeat clicks | state/browser | PASS — browser explicit post-revision mark once |
| E02-C01 | Reach overlook, leave before Chronicle, resume | Overlook remains revisitable but E02 is not completed; E03 locked | state/reload | PARTIAL — state-unit persisted lookout; interrupted Chronicle browser open |
| E02-C02 | Complete Chronicle with all prerequisites | E02 completion once; E03 unlock; barrier stays closed; Chronicle shows then/now, unknown cause, overlook and Market hook | unit/browser | PASS — state-unit + browser Chronicle completion and reload |
| E02-C03 | Historical replay after completing E03 or later | No additional canonical events, no E01 rollback, no reopening old bridge or reset of world | replay tests | NOT RUN — replay with future episodes |
| E02-E01 | Fresh/incognito, storage denied/corrupt, Start new adventure | Clear recovery and no false persisted success; E01 unrelated save does not get overwritten | storage/browser | PARTIAL — E01 CI separate; storage fail & E02 reset paths open |
| E02-E02 | E01 baseline full regression at E02 runtime PR HEAD | Existing E01 script, scratch progress, glyph/map, portrait/name, safe movement, save and UX paths remain PASS | latest-HEAD CI | PASS — existing E01 CI on E02 PR SHA |
| E02-E03 | 1366×900, desktop short, 320/360/390/430 phones + landscape | No cropped critical gap/old-stones/actor feet or labels; portrait/dock/Listen/parent mode/readable route visible | actual screenshots | PARTIAL — Chromium 320/360/390/430 screenshot and label bounds; human device QA open |
| E02-E04 | Motor-only/key/touch, text/Listen off, reduced motion | Same safe progression without precision pointer, audio, dragging or time pressure | browser/device | PARTIAL — simulated Playwright taps/parent switch; broad keyboard/accessibility QA open |
| E02-A01 | Inspect raw source art/state reference | No baked Market text on early state, no physically continuous current bridge, original PNG bytes/hash verified | reference/asset QA | PARTIAL — 13-file image integrity CI; real rendered art/evidence visual gate open |
| E02-A02 | Build static package/deploy MN4 | Runtime-only package, verified current source SHA+build over HTTPS and rollback; do not claim CI equals deployment | release test | NOT RUN — MN4 deployment and served build verification |
| E02-U01 | Observe real 6–9 EFL child + parent using episode | Can articulate past stones vs now gap and meaningful revision, without parent giving answer; actual timing within tolerable session | family observational UX | NOT RUN — actual child/parent observational UX |

## Authoring review gate (E02-2)

- [ ] Each bracketed exact spoken line ID in script is unique; E01's 121 lines untouched.
- [ ] Every script branch and optional/recovery line has exactly one defined trigger in interaction spec; no dialogue after an unpresented fact.
- [ ] Parent cue trigger occurs after Milo's first guess and the child's conflicting observation.
- [ ] All visible scene states are safe, physically coherent and storyboard-testable.
- [ ] No "bridge repaired," crossing, revealed Common, invented culprit/cause or unlocked Market Lane too early.
- [ ] No save schema or release status is declared implemented merely by documentation.
- [ ] Human review/owner signoff of exact script and behavior before advancing to prompt/media generation.

**Important:** The E02 engineering-preview workflow performs its isolated automated/browser subset; image integrity and the E01 baseline have independent workflows. Screenshots and simulated touch are **not** owner/real-device acceptance, and E02 remains NOT DEPLOYED to MN4. See [playable slice QA](PLAYABLE_SLICE_QA_2026-10-12.md) for test method and limitations.
