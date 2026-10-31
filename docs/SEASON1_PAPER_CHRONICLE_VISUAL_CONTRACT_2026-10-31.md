# Season 1 PAPER Chronicle and visible-world revisit contract — 2026-10-31

**Scope:** an isolated E05–E11 authoring rehearsal, NOT a canonical Chronicle, approved artwork, release unlock or production handoff. This augments the existing eight-place visual atlas; it does not add a new Episode or replace the independent scene engines.

## Child-visible loop
1. Milo performs a real reversible PAPER action in the current model, including a wrong-first attempt and correction.
2. Only the reducer's replay-verified `done` result adds a reflection card. The card shows the BEFORE/ NOW consequence, the specific test, and one explicit UNKNOWN.
3. The child can activate **Revisit this PAPER place** (keyboard or touch) to inspect the changed model and compare BEFORE / NOW. Other completed places remain changed.
4. Revising an earlier model withdraws its completion and every downstream card and visual change until the child retests. No phantom retained Chronicle event survives the upstream reset.

## Evidence and safety
- `paperChronicle(state)` first validates the entire `world-revisit` action history via strict replay; a caller cannot mint a card by changing `done`, `rights`, `unlocks`, `canonicalEvents` or `historicalClaims` fields.
- All eight cards are explicitly `PAPER MODEL — NOT CHRONICLE`. The card's `proofAction` and `proofStep` refer to a real model action, not a historical source or canonical progress.
- E04's two attributed memories and chronology still require Owner approval. North Hill remains CLOSED; later place identity, dates, permission, actual planting/lighting/construction and final loop remain UNKNOWN. No Common reveal or Season completion is granted.
- No localStorage, remote persistence, new portrait, audio, or production packaging imports. The existing approved E01/E02/C01 and E03 content are untouched.

## Verification
`node --test tests/season1-paper-chronicle.test.mjs` checks wrong-first, evidence provenance, BEFORE/NOW, revisit, upstream invalidation and tampering. The updated `tests/season1-world-revisit-browser.mjs` checks clickable reflection cards, three viewport sizes, keyboard baseline, retained progress, invalidation, overflow and storage isolation. `wondervale-authoring-labs.yml` executes both and remains separate from the canonical E01–E03 and twelve-scene production gates.

**Next production dependency:** one Owner batch decision on E04 genuine attributed sources/chronology, then a replay-validated *canonical* E04 event and E05 entry. PAPER cards are design evidence only.
