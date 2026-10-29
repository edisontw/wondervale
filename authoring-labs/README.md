# Season 1 isolated authoring labs — NOT production

Open `/authoring-labs/` from a local static server (e.g. `python3 -m http.server 4173`). This is a **manual inspection index**, not an episode launcher, Chronicle, canonical progress graph, unlock flow, MN4 package or proof of family playability.

- **E04:** intentionally unavailable here. Its source/timeline authoring module has no standalone production route; genuine attributed evidence and the Owner decision pack remain gated. The hub never creates synthetic source cards to bypass it.
- **E05–E11:** links to existing independent authoring labs. Each loads in an embedded frame. Previous/Next are **manual** navigation only; no state or success transfers between labs.
- **E06:** Current Garden and Lower Garden are separate planned experiences inside the same E06 laboratory. The Lower Garden menu entry does **not** bypass the observation/model-comparison prerequisite; the child must use `Walk to Lower Garden` within the lab.
- **E10/E11:** Common identity/geometry, resident needs, and the final loop remain unverified synthetic models, not canonical progress or actual access.
- **Isolation:** this index does not import production runtime, write localStorage or unlock anything. Reloading a lab restarts its independent unsaved model. Accepted E01/E02/C01 and E03 are unchanged.
- **Automated scope:** `node tests/season1-authoring-labs-browser.mjs` with a static server and installed Chromium checks eight menu entries in three viewport sizes, keyboard navigation, explicit notices, successful loads and absence of new storage keys. It does **not** replace individual Node/browser journeys, 12-scene end-to-end acceptance, real-device family QA, art/source approval, deployment, HTTPS or rollback.

## Evidence handoff audit (engineering only)

See [E04–E11 continuity/evidence matrix](CONTINUITY_HANDOFF_MATRIX.md) and [machine-readable audit contract](handoff-contract.mjs). Run `node --test tests/season1-handoff-contract.test.mjs` from the repository root to verify the actual E05–E11 reducer fresh/projection boundaries, the eight proposed transitions (including the one E06 in-lab prerequisite), and the absence of canonical events/unlocks. It emits `test-results/season1-handoff-audit.json` for inspection. This is an **inventory**, not proof that the child finished a scene, a historical source was approved or any episode is production-unlocked.

## Evidence Workshop (noncanonical, in-memory)

Open [Evidence Workshop](evidence-workshop.html) from the lab index. Children can select any E05–E11 authoring model (E06 Current and Lower separately), inspect three model/hypothesis/unknown claim cards, classify each, receive a nonpunitive explanation for a wrong grouping, revise a card, and compare what remains unproven. Each model starts fresh; no activity is read from the actual episode lab and no classification is proof the child completed that lab. E04 remains unavailable. The Common name appears only inside the explicitly selected E10/E11 late-arc authoring preview, not E05–E09.

The workshop is intentionally independent of production runtime, source-card approvals, persistence, Chronicle and unlock. It uses no localStorage or cookies. Tests: `node --test tests/season1-evidence-workshop.test.mjs` and `node tests/season1-evidence-workshop-browser.mjs` against the static server. Chromium covers desktop, short phone landscape, portrait, keyboard, retry, early-reveal boundary and zero production storage writes. Passing these checks is not a twelve-scene end-to-end or family acceptance.

## E05 → E06 paper-world callback (noncanonical)

Open [Paper World Changes](world-change.html) from the hub. This is a **separate in-memory story trial** using the existing E05/E06 authoring reducers, not a transfer of canonical checkpoints. Milo must align two replica marks, preserve the public walkway and establish a small paper Map Room; then inspect the healthy present garden, compare dry/rain/open/blocked tray trials, walk to the lower model, revise a wet or path-blocking marker, and try a raised pocket. The station table, upper garden and lower pocket remain visibly changed while revisiting the three paper places, until explicit reset. The upper garden is never removed.

No E04 memory source is inferred, no real access/planting/terrain is asserted, and no storage, canonical Chronicle, E06 unlock, E07 unlock or production package import occurs. The E05/E06 original labs remain independent. Run `node --test tests/season1-world-change.test.mjs` and `node tests/season1-world-change-browser.mjs` (with a static server and Chromium) for reducer replay/tamper, complete child-operated desktop/phone paths, keyboard, nonpunitive revision, revisits and storage isolation. This does not constitute physical/family acceptance or MN4 deployment.
