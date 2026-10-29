# Season 1 E04–E11 continuity / evidence handoff audit

**Scope (2026-10-30): engineering-only; NOT canonical continuity, approved history, production unlock or a twelve-scene acceptance.** Source of truth: latest `main` and the [12-scene plan](../docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md). The [authoring index](index.html) offers **eight selectable entries** for E05–E11, counting E06 Current and Lower separately. E04 is visibly disabled. This audit records what the actual independent reducers can model, and precisely what is **not transferred** to the next episode.

## Evidence inventory and missing handoff

| Release scene | Observable engineering evidence (NOT genuine history) | Missing before canonical Chronicle / next-episode eligibility |
| --- | --- | --- |
| 04 · E04 memories/timeline | **Unavailable** from the index; PR #114 is an Owner-gated chronology/source draft | Two genuinely attributed memories, source-card provenance/rights, earlier/later/uncertain timeline decision and verified E03 completion |
| 05 · E05 station | Replica marks align/mismatch on a **copy**; corridor-safe table placement makes a local Map Room preview | Approved E04 timeline; actual station records/access, believable overlay and production art; no canonical `Map Room opened` event |
| 06 · E06 Current Garden | Milo observes the present garden; dry/rain/channel **model** produces different runoff | Canonical E05 Map Room handoff; observed terrain and qualified relocation source; no historical cause inferred from a model |
| 07 · E06 Lower Garden | **Within the same lab**, observation and rain-model comparison precede Lower entry; marker tests wet channel/path conflict | Actual safe/authorized lower planting site, stewardship and art; no canonical planted-pocket or future growth stage |
| 08 · E07 connector | Finn's short path causes simulated resident/water conflict; revised route tested | Verified E06 growth/continuity, real clearance/drainage/permission; no built connector or E08 unlock |
| 09 · E08 Lantern Steps | Synthetic light/viewpoint geometry gives different observations | E07 completion, safe lighting/electrical approvals, provenance of any dated clue; no historical date or E09 unlock |
| 10 · E09 Closed Hill | Walked/marked safe-model edges and a qualified distant-symbol comparison | Actual public route, slope/fence safety and symbol source; North Hill **remains closed**, no E10 identity reveal |
| 11 · E10 unnamed place | Two undated model traces, revisable hypotheses and two **simulated** resident needs | Approved source proving name/identity, site access and representative needs; no canonical Common reveal or E11 unlock |
| 12 · E11 renewed place/loop | Reversible fictional shared-space layout, two simulated user tests, safe-loop graph | Genuine E10 handoff, real current safe links/rights, art, real-device/family Gate; no Common opening, final Chronicle or Season completion |

**E04 → E05:** no attributed history is currently delivered by the authoring index. A fake card, test fixture or a manually selected E05 preview must never count as the E04 completion event.

**E05 → E06 Current:** the Map Room is only an in-memory paper-room preview. Its `roomPreview` flag is not a canonical station-access record. E06 does not receive E05 progress.

**E06 Current → E06 Lower:** this is a **local prerequisite within one E06 reducer**, not a cross-episode unlock. Clicking the Lower Garden menu entry opens the same fresh lab and still requires the child's Current Garden observations and runoff comparison. The two locations are separately counted only because they have distinct actions and outcomes.

**E06 Lower → E07 → E08 → E09:** local pocket/connector/light/survey results are not a shared ledger. Their geometry is synthetic; the model does not establish land rights, physical safety or historical dating. E09's distant symbol remains unidentified.

**E09 → E10 → E11:** the Common identity is reserved for an E10 approved source gate; the E10 opt-in synthetic test token is never provenance. E11's `e10_needs` label is a fictional model citation, not a real resident interview. E11's graph cannot open real access or certify a safe loop.

## Explicit acceptance separation

| Gate | Evidence currently available | Status |
| --- | --- | --- |
| Isolated reducer tests | Individual E05–E11 Node suites and authoring-only models | Previously tested; rerun on changed heads when needed |
| Cross-lab entry navigation | Eight menu entries, three viewports, keyboard, storage isolation | Chromium smoke from PR #183; not episode progression |
| Cross-lab evidence inventory | `handoff-contract.mjs` + `tests/season1-handoff-contract.test.mjs` | Node contract test verifies all actual reducer fresh/projection boundaries and writes a machine-readable checklist |
| Canonical event emission / save / unlock | **None** from authoring labs | NOT IMPLEMENTED / NOT RUN |
| 12-scene end-to-end gameplay, EFL, Chronicle replay, growth callbacks | No integrated canonical chain | NOT RUN |
| Genuine source / public access / portrait approval | Needs one bounded Owner batch | `blocked-design` |
| MN4 HTTPS / deploy / rollback and family device test | Independent production release gates | NOT RUN for these labs |

The audit is deliberately **fail-closed**: its `productionEligible`, `canonicalEventIssued`, and `unlockIssued` fields are always `false`. It is not an alternative to an actual signed production ledger or a future release gate. Even a completed in-lab model is not a production event. The audit does not read/write `localStorage`, introduce a story runtime, import art, or modify E01/E02/C01/E03.

## One bounded Owner batch, only when ready for production

1. **E04 genuine chronology:** two distinct attributed memories, source permissions, evidence-card wording and what is earlier/later/uncertain; do not invent a date or declare one witness wrong.
2. **E05–E09 geography and intervention:** station/Map Room access and replica plausibility; Current/Lower garden site, water and stewardship; connector/lighting rights; North Hill public safe alternative and closure boundary.
3. **E10–E11 community and media:** credible Common identity source and access, representative resident needs, permitted current loop, painterly scene/NPC art chosen from existing approved assets where possible. Final family/mobile acceptance remains a separate gate.

**Next independent playable-content task:** create an **in-memory, noncanonical story recap / evidence comparison** for the authoring index that displays `observed model / hypothesis / unresolved` separately without accepting synthetic artifacts as historical truth, writing a Chronicle, or bypassing E04. Verify on mobile and keyboard. Do not repeatedly polish the E04 preview while the source gate remains open.
