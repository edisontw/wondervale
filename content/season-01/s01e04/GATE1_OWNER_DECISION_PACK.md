# S01E04 — One-batch Owner Gate 1 decision pack

**Status: PROPOSAL / not approved / not a production source pack.** Companion to [draft PR #114](https://github.com/edisontw/wondervale/pull/114) and its [Episode Production Brief](EPISODE_PRODUCTION_BRIEF.md). Prepared from GitHub `main` `77f2481d082faa92874e27c9c02224c8cf295880` on 2026-10-29. This document is **not** a new Season 1 canon lock, script approval, media approval, playable E04 release, or permission to use synthetic chronology fixtures in production.

## 1. Already established — no new Owner decision required

| Input | Exact existing authority | Meaning and limit |
| --- | --- | --- |
| Market coordinator | `S01E03-COORDINATOR-009`: **“I remember a way to the station.”** | Attributed, sincere *memory* of a station way; not proof of its date or current route |
| Garden resident | `S01E03-RESIDENT-001`: **“I remember a way to the garden.”** | Attributed, sincere *memory* of a garden way; not proof of its date or exact location |
| Old market marker | `s01e03_old_market_marker_recorded` | Existing glyph is observed, not decoded; no premature Common link |
| Witness event records | `s01e03_station_memory_recorded` and `s01e03_garden_memory_recorded` | E04 reads canonical E03 history; it does not invent witnesses or overwrite E03 |
| Story outcome | `docs/SEASON_1_ARCHITECTURE.md` E04 | Both memories can belong to genuine different periods; Arc 1 ends with *relative chronology* and opens E05 station investigation |
| Learning | `docs/SEASON_1_LEARNING_WEAVE.md` E04 | before/after/then/now/both/different; child may leave a source uncertain |
| Engineering | `engine/s01e04-handoff.mjs`, `engine/s01e04-chronology.mjs` | Canonical E02/E03 prerequisite gate and reversible **draft-only** chronology; no E04 canonical event or deployed game |

Do **not** change either E03 line, recast a witness as lying, assign a calendar year, assert a garden-relocation cause, infer a safe S/N walk, reveal the Common, or treat E05's later discovery as already established by E04.

## 2. The single Owner decision batch — proposed default A

**Question to approve as one set:** Is the following *ordinary, inspectable in-world paper evidence* appropriate for E04, with the two memories remaining unverified testimony?

| Candidate ID (draft) | Proposed visible source and provenance | What the child can actually see | Allowed inference | Approval |
| --- | --- | --- | --- | --- |
| `station-route-copy` | An older station-associated route-board copy kept in the town records | A route fragment, old glyph, and legible **Version 1** mark | A station-facing route representation existed in one period; not the full town map | **OPEN — proposal** |
| `garden-route-update` | A later, visibly revised route notice kept alongside the first copy | The matching old glyph, a changed destination label and **Version 2** mark | This notice was prepared *after* Version 1; it does not prove why or exactly when the route changed | **OPEN — proposal** |
| `undated-way-photo` | A photograph without trustworthy date/provenance in the same record box | Part of a way sign and a familiar route mark; no readable year or revision | It can be observed and compared but must remain **Not sure yet** | **OPEN — proposal** |
| `version-mark` (clue) | Readable version marks on the first two records | The child notices that Version 2 follows Version 1 | A **relative document order**, not a calendar date or complete historical causal account | **OPEN — proposal** |

These are **candidate fictional in-world artifacts**, not found historical documents, not generated images, and not already-approved source cards. The proposed labels/marks are *new story facts* and must not enter production data until Gate 1 approval. The proposal deliberately establishes **record order** first; it does **not** automatically prove that every memory describes exactly the date of its associated record. A child may say, “Maybe the station way was earlier. The garden notice came later. We need more clues.”

**If default A is unsuitable:** a bounded alternative is two other visibly versioned town records with independent provenance and a separate undated photograph. Keep the same reasoning, uncertainty and E05 handoff; do not substitute a fabricated precise date, narrator answer, or unexplained magic clue. Do not open many tiny approval questions about paper texture, costume, or button colors.

## 3. Child-driven E04 scene contract (proposal, not final dialogue)

| Beat | In-world trigger | Milo's meaningful action | Nonpunitive feedback / recovery | Chronicle / forward hook |
| --- | --- | --- | --- | --- |
| Open | Both E03 memories remain unresolved after Market Lane | Choose to compare the two attributed recollections at the source table | Can reread either line; no forced correct witness | Chronicle retains both attributions |
| Inspect | Two versioned papers and one undated photo are accessible | Examine each paper's visible version mark and the photograph's lack of date | `Not sure yet` remains a legitimate choice; hints ask *what changed?* | Source observations stored only in E04 draft |
| Arrange | A relative timeline ribbon appears | Place Version 1 earlier, Version 2 later; keep undated photo uncertain | Wrong placement shows both cards together for comparison; move freely, no loss or score | A defensible **relative** sequence |
| Explain | Nia asks what changed between records; Finn invites a test of the sequence | Child connects the visible revision clue to **maybe different times** rather than picking a liar | “Both might remember a real route” is an inference, not narrator-certified proof | Draft Chronicle notes source vs memory and remaining questions |
| Continue | The records mention a station but do not settle its history | Child chooses to investigate the station next | No premature Garden relocation explanation or North Hill closure proof | E05 foyer / Map Room question |

**Child-facing English functions:** “This says Version 1.” / “This one says Version 2.” / “This came later.” / “I am not sure about the photo.” / “Maybe both remember a real way.” These are **scaffolding candidates**, not locked spoken lines. Parent cue (optional, after inspection): “Could both people be right? What would have to be different?” No compulsory parent intervention, timers, punitive errors or audio-only clues.

## 4. Implementation mapping after approval — do not ship now

The existing draft chronology contract requires 2–8 `cards` of `map|photo|document`, 1–8 inspectable `clues`, unique short IDs, and `relativeOrder:{earlier,later,basis}`. Proposed **mapping only**, not an importable runtime fixture:

- `cards`: `station-route-copy` (`map`), `garden-route-update` (`document`), `undated-way-photo` (`photo`).
- `clues`: `version-mark`, with child-inspectable text explaining only the version comparison.
- `relativeOrder`: `{earlier:'station-route-copy',later:'garden-route-update',basis:'version-mark'}`.
- Both exact E03 witness lines must be inspected; the chronology engine requires the visible basis clue and all cards placed (undated card = `uncertain`).
- Source provenance, version mark legibility at phone sizes, and whether Version 1/2 are suitable fictional documents must be decided before creating the **actual** `public/s01e04*.json` content or painterly media. Synthetic `testPack` in `tests/s01e04-chronology.test.mjs` stays test-only.
- `e04Handoff` must validate replayed canonical E02+E03 saves; draft/reset/replay must not touch those saves. A future production ledger must be separately designed and tested. E04 remains preview-only until E03 full physical Gate 3 and release gates are satisfied.

## 5. Approval checklist — one response, no repeated micro-gates

- [ ] **Story/provenance:** accept proposed default A (or state one substantive revision to its document evidence). Does the record comparison plausibly support an *earlier/later document order* without inventing years or causes?
- [ ] **Learning/interaction:** accept inspect → arrange/revise → explain, including the undated photo and uncertainty, as the E04 thinking task.
- [ ] **Narrative boundary:** retain both sincere memories, avoid premature Common/hill/garden-cause reveal, and end with an E05 station investigation.
- [ ] **Approval status:** if all three pass, explicitly authorize changing the EPB status from `draft` to `approved_for_script`; until then, this pack and PR #114 remain draft.

**Current disposition:** `blocked-design` for **production source approval only**; engineering draft-preview QA and independent E05 draft episode work may proceed without waiting. Do not equate an Owner PASS of E04 prototype interaction with approval of these new in-world paper records.

## 6. Evidence and verification scope

- Exact witness lines checked against `public/s01e03.json` at the stated `main` SHA.
- E03 witness ledger IDs checked against `engine/s01e03.mjs`; E04 gate and draft schema checked against `engine/s01e04-handoff.mjs` and `engine/s01e04-chronology.mjs`.
- This is a **documentation-only authoring deliverable**. Node/Chromium/Actions are **NOT RUN** for this new pack; prior passing engineering-preview tests do not approve the new evidence or make E04 playable.
- No E01/E02/E03 runtime, existing media, save schema, release allowlist or MN4 deployment is changed.
