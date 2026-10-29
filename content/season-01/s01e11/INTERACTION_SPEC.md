# S01E11 Interaction Specification — Reversible Common Layout and New Loop

> **Gate 1 DRAFT.** E11 authoring fixtures are fictional, not actual courtyard geometry or permission. No E10 fixture can unlock E11 production; no canonical save, Common opening or MN4 deployment is authorized.

## 1. Child thinking vs mechanics

Milo must **physically try** a layout and test it for two current uses and safe passage. A piece can be moved again after a conflict. The child must **compare** two trials and articulate a reason based on earlier discoveries. Separately the child traces a **present-day loop** across verified (in production) links, not the closed historical North Hill segment. This is not a scored right-answer board.

| Interaction ID | Cognitive task | Child action | Visible feedback / nonpunitive recovery |
| --- | --- | --- | --- |
| `e11.place` | Decide how two uses share limited area | Move two need tokens and one access strip to model cells | Occupancy and conflict indicators update; undo/move freely |
| `e11.walkTrial` | Check whether a proposed line works for a person | Move Milo from model entrance to exit; test quiet and group user scenarios | A blocking cell, noisy overlap or unconnected passage is highlighted with explanation |
| `e11.revise` | Balance competing needs after feedback | Reposition at least one piece; repeat trial | Before/after snapshots; prior attempt remains inspectable |
| `e11.compare` | Justify a compromise without erasing needs | Compare two completed trials, select one provisional plan and cite an earlier discovery | Both needs stay attributed; remaining limitation explicitly recorded |
| `e11.traceLoop` | Integrate current places and real boundaries | Add safe, connected contemporary links to a loop on a separate map | Gaps, closed edges and unsupported links rejected; child can erase/retry |
| `e11.review` | See accumulated change | Flip old/current map and world-change cards | Noncanonical Chronicle **preview** only; final opening withheld until production gates |

## 2. Example fictional model (NOT a town map)

For deterministic tests only, use a 3x4 **paper grid** with coordinates `r0..r2/c0..c3`, an entrance at `(1,0)` and exit at `(1,3)`. Each cell is an abstract token slot, not a measured area. Fixed `boundary` cells may never be occupied. A `quiet` token, an `activity` token and an `access` strip each occupy declared cells. Simulated users: `quiet_reader` needs a quiet seat with an adjacent safe passage; `activity_group` needs a shared area that does not block passage. These roles and constraints are **synthetic** and do not assert actual interviews.

The first tempting fixture puts an activity piece across the passage; Milo's attempted walk exposes the obstruction. Another tempting fixture places noisy activity directly beside the quiet seat. Neither is punished; both can be revised. **No numeric physical accessibility compliance** can be inferred from this paper grid. In production, real accessible width, slope, drainage, circulation and emergency access must come from approved site evidence.

A separate fictional town graph for authoring uses named **role nodes**, not geographic assertions: `square`, `riverside_overlook`, `market`, `map_room`, `garden`, `connector`, `lantern_steps`, `safe_overlook`, `common`. The candidate safe-link whitelist must be explicit, with no `north_hill_closed` node or link. Fixture edges are not permission or proof of real continuous pavement. The loop checker requires an ordered, connected path returning to its start and containing the Common, with at least three distinct locations; it rejects disconnected, unknown, forbidden or merely old-map edges. **Never invent a link just to complete the loop.**

## 3. Pure reducer contract (future implementation)

Proposed commands (no arbitrary state injection):
- `moveMilo(to)`: adjacent model step only; never teleport through occupied/boundary cells.
- `place(tokenId, cells)`, `lift(tokenId)`: bounded token IDs and allowed cells; update layout; invalidate stale trials and review.
- `testUser(userId)`: only declared user scenarios, computed from current layout; records obstruction and a reason without changing layout.
- `snapshotTrial()`: captures exact validated layout and two tested users; immutable trial ID, no user-supplied pass flags.
- `compareTrials(a,b)`: two distinct snapshots, at least one revision, both user scenarios tested; preserves remaining tradeoff.
- `citeEarlier(discoveryId)`: whitelisted previously completed *canonical* discovery in production, synthetic reference labels in authoring only.
- `addLoopEdge(edgeId)` / `removeLoopEdge(edgeId)`: only declared current safe links; a closed/unknown edge is always refused.
- `checkLoop()`: computes connected closed cycle from selected edges, without granting real access.
- `reviewPreview()`: only after layout revision, comparison, earlier evidence and loop check; returns noncanonical preview, no unlock.

State is reconstructed from a bounded action ledger (e.g. <=160 validated commands). Reject unknown commands, forged `passed`/completion booleans, injected dates, arbitrary quotes, rights/source IDs, and invalid replay; fail closed. Reset and replay do not touch localStorage, E01–E10 saves, canonical Chronicle, network or release state. Layout changes invalidate prior user tests, comparison and preview; loop changes invalidate loop check and preview. The fixture is a **design trial**, not a construction order.

## 4. Dramatic feedback and EFL

The first blocked walk shows Milo stopping before the obstruction; Nia asks “What did we see?” and Finn asks “Who needs this way?” Child repositions a piece, retests, and can keep a limitation in the plan. EFL cues: “We could…”, “It blocks…”, “Both need…”, “Let's test”, “We changed it because…”. Use icon/shape/text redundant labels, no compulsory typing or reading-only reasoning.

Parent cue after a failed trial: “Who might find this path hard to use?” Optional season reflection: “Which earlier discovery changed the plan?” Neither gives coordinates or a preferred plan.

## 5. Accessibility and QA boundary

At 1366x900, 568x320, 667x375 and 390x844 CSS, child should reach the board and map without document overflow, with >=44px controls, touch/keyboard placement alternatives, no drag-only requirement, clear focus, reduced motion and restart. The scene must work without a parent present, without timer, score, child account or audio. Simulated scenarios are **not** a substitute for physical accessibility review.

## 6. Gate separation

**Gate 1** draft spec/matrix. **Gate 2** approved source, actual Common safe geometry, attributed needs/rights, painterly art. **Gate 3** child-directed browser and Node/Chromium plus E01/E02/E03 regression. **Gate 4** canonical E10 handoff, event-ledger/Chronicle and loop unlock, artifact integrity, MN4 remote HTTPS/rollback. **Gate 5** owner/family real-device signoff. The E11 authoring lab cannot write `s01e11.common_reopened` or `s01e11.season_completed`.

**Next:** isolated deterministic in-memory layout/loop engine and Node tests, then browser lab.