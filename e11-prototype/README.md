# E11 — isolated fictional shared-space browser lab

**NOT production.** This is an independent, static authoring test at `/e11-prototype/`, not a released `/e11/` episode. It imports only the pure E11 synthetic reducer and never the production episode shell, Chronicle, storage or unlock. The Common is **not open**; North Hill is **closed**.

Milo can walk adjacent paper-grid cells and visibly stop at a blocked cell. The child places the access strip and two reversible need pieces, tries a first layout where quiet and activity conflict, tests both simulated users, saves a first trial, moves a piece and retests. A comparison is accepted only when a distinct revised layout passes both users. An earlier-discovery label is explicitly **SYNTHETIC**, not a verified historical source or E10 completion. The separate model-map lets the child add/remove links, see an incomplete or disconnected loop fail, and check a connected current cycle that includes Common without ever selecting the old closed hill. The final review remains noncanonical, with no season completion.

EFL prompts are embedded in the action: "It blocks…", "Both need…", "We changed it because…". Nia asks about the other user, Finn revises his shortcut; an optional parent cue appears only after difficulty. No drag-only interaction, audio, penalty, timer, child account or persistence.

## Verification

- Node: `node --test tests/s01e11-authoring-prototype.test.mjs` (24 strict reducer cases).
- Chromium: serve repository root at port 4173, then `node tests/s01e11-browser.mjs` after `npm install --ignore-scripts --package-lock=false` and `npx playwright install chromium`.
- CI: `.github/workflows/wondervale-e11-prototype.yml` runs Node and Chromium with a bounded server-readiness probe. Four complete journeys: 1366×900, 568×320, 667×375, 390×844; plus keyboard Enter/Space. Checks blocked walk, failing/revised needs, stale test invalidation, first/now comparison, loop retry, review, reset/reload, 44px targets, no overflow, no localStorage writes and zero canonical events/unlocks. Evidence under `test-results/e11-*`.

**Production blocked-design:** genuine E10 evidence and entry handoff, actual Common geometry, rights/permissions, attributed current needs, verified safe present-day links, painterly art, real-device family acceptance, 47-case production matrix, canonical Chronicle and MN4 HTTPS/deploy/rollback. A fictional connected loop is not an access approval. E01/E02/C01 and accepted E03 content remain untouched.
