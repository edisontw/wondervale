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
