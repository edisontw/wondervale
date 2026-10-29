# S01E10 Interaction Specification — Courtyard Traces and Community Needs

> **Gate 1 DRAFT, noncanonical.** The E10 child-facing reveal of the Common is permitted by the locked story architecture **only in E10**. All fixture geometry, clues, labels and speakers are **fictional test data** until an Owner source/access/art decision. E09's isolated lab cannot unlock this scene.

## 1. Interaction contract and learning evidence

Milo investigates a shared courtyard, rather than answering a history quiz. The child must (a) **move and inspect two distinct traces**, (b) attach and revise **qualified hypotheses** about former uses, (c) **listen to two differing present needs**, (d) compare the needs without pretending to satisfy everyone or completing E11's layout, and (e) review a four-column Chronicle **preview**: `SEEN / MAYBE / NEEDS / UNKNOWN`.

A trace is **not** a source-confirmed use; a present-day need is **not** evidence of a historical event. The model never scores one use as uniquely correct, never calls a person wrong, and never awards an E11 unlock.

## 2. Synthetic fixture topology (never claim real access)

| Anchor | Fictional role | Inspections available |
| --- | --- | --- |
| `entry` | model courtyard threshold | symbol, entry boundary |
| `stone_edge` | open-side trace | worn surface |
| `notice_wall` | second trace | mounting holes |
| `quiet_corner` | first current voice | reader need |
| `meeting_edge` | second current voice | activity-group need |

Allowed synthetic undirected edges: `entry-stone_edge`, `entry-notice_wall`, `stone_edge-quiet_corner`, `notice_wall-meeting_edge`, `quiet_corner-meeting_edge`. All other movements are rejected without teleportation. `closed_hill` is never an accessible node; no return route through E09's closed segment. These anchors/edges are **test fixtures**, not a real-world map.

Fixtures:
- `trace_surface` at `stone_edge` and `trace_holes` at `notice_wall`: inspectable shapes only, undated, source-pending.
- `symbol` at `entry`: comparison to the E01 mark; **does not by itself prove the Common name**.
- `need_quiet` at `quiet_corner` and `need_activity` at `meeting_edge`: simulated, separately attributed current preferences, not historical testimony.
- `name_source`: a **test-only fictional token** behind a dedicated explicit authoring mode, never a publishable artifact or asserted archival document. Production requires an approved source ID, provenance, rights and chronology before reveal.

## 3. Deterministic in-memory state and commands

State derives from a bounded ordered action ledger (e.g., max 128 commands), not a caller-provided snapshot: `position`, `inspectedTraceIds`, `seenSymbol`, `hypotheses` (trace ID -> set of `{useTag, qualifier:'maybe'}`), `nameSourceChecked`, `nameRevealed`, `heardNeedIds`, `needBoard`, `tradeoffReviewed`, `previewFinished`. No localStorage, canonical ledger import, network calls, arbitrary timestamps, unlock flags or personally identifying child data.

| Command | Preconditions and real operation | Failure / retry |
| --- | --- | --- |
| `walk(to)` | Declared adjacent anchor only; Milo position changes visibly | Unknown, closed or nonadjacent target leaves Milo in place with a short reason |
| `inspect(traceId)` | Correct viewing anchor; stores **seen form**, not its use or age | Remote/unknown trace refused; child can walk and retry |
| `compareSymbol()` | Inspect `symbol` from `entry`; compares only visual shape | Does not reveal the name |
| `suggestUse(traceId,useTag)` | Trace already inspected; bounded approved hypothesis vocabulary; stores `maybe` | Unsupported tag/trace refused; not graded right/wrong |
| `reviseUse(traceId,oldTag,newTag)` / `removeUse` | Existing hypothesis, inspected trace; reversible with visible before/now | Never silently rewrites observation |
| `checkNameSource()` | Symbol compared, two different traces inspected, **explicit authoring fixture mode**; production mode requires approved source provenance | No source -> show `UNKNOWN`, never name or completion |
| `hearNeed(needId)` | Milo at corresponding listening anchor; source/role identified as **simulated** | A need cannot be forged from a user-supplied string |
| `placeNeed(needId,slot)` | Heard need only, bounded board slots; keeps source attribution | Move/revise without discarding the other voice |
| `reviewTradeoff()` | Two distinct needs placed and two trace hypotheses present; shows where one-use-only framing fails | No automatically chosen permanent layout |
| `review()` | Inspections, qualified use tags, source check, two needs and tradeoff actually complete | Identifies missing step; preserves progress |
| `finishPreview()` | `review()` completed with valid **fixture** name token; returns noncanonical summary only | No E11 unlock, release or real-world claim |

The child may inspect and listen in flexible order. A valid completion cannot be created by directly setting booleans, importing a forged state, supplying a fake date or replaying invalid commands. Every state-changing action is validated during replay; tampered action history fails closed.

## 4. Reveal and spoiler containment

E09 remains **unidentified symbol**. Only E10 authoring code may contain a deliberately gated test string `Common` (for a nonproduction fixture). Never export that name in E09 data, E08/E09 browser labels, production release packages or pre-unlock Chronicle. A fixture name card must be visually and programmatically labeled `SYNTHETIC — NO APPROVED SOURCE`. In production mode, missing verified name evidence blocks `checkNameSource`, `nameRevealed`, `finish` and E11 unlock.

Past-use tags are `MAYBE`, not facts. Distinct trace observations do not automatically prove multiple uses or a date. A current need remains a quoted/attributed *present preference*, not an archival record. Do not make the two need roles named, visually canonical or representative of every resident.

## 5. Child-visible interaction and feedback

1. **Explore:** Child walks Milo and inspects two different features. Each produces a small icon/text "I SEE" card.
2. **Infer:** Child places possible-use tags on evidence, tests a tempting single-use interpretation, and revises at least one hypothesis or explicitly keeps two possibilities open. Feedback says "This could fit. What else do we see?" rather than "Wrong."
3. **Identify:** Only after an actual source gate, the E10-specific mark/name comparison can reveal the Common. In isolated authoring preview, display an explicit fictional-source warning beside the reveal.
4. **Listen:** Child walks to two different voices, hears their differing needs, and pins both on a present-needs board. No text entry.
5. **Compare:** Child moves a card in a temporary **paper board**, observes a tradeoff and retains both needs; does not place permanent furniture or build the E11 loop.
6. **Review:** Four distinct sections show what was physically seen, what is hypothesized, what people want now, and what remains unknown. The courtyard is understood, **not finished**.

No timers, loss states, gold stars, correct-answer-only progression or forced adult input. All meaningful operations have mouse/touch/keyboard alternatives. Provide 44px minimum targets, no horizontal overflow at 1366×900, 568×320, 667×375 and 390×844, and a reduced-motion option. Parent cues appear after evidence and needs collection, respectively, and remain optional.

## 6. Event, save and security boundaries

The authoring reducer emits `authoringPreview` only. It must not import or mutate E01–E09 save, create `s01e10.*` canonical events, set `unlockedE11`, alter the hill closure or write to browser storage. Any future production promotion requires **verified canonical E09 completion**, approved accessible entrance, approved name/source and rights, valid E10 action evidence, Chronicle replay, versioned assets, hash/integrity and rollback checks, MN4 HTTPS and real-device/family acceptance. A green Node/Chromium authoring test proves only the isolated fixture.

**Next implementation:** pure reducer + tests for adjacency, source/need typing, revisable hypotheses, stale evidence/review invalidation and fail-closed replay; then separate browser lab. Never silently make the test token into an approved historical name source.
