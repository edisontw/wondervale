# E06 Lower Garden Spatial Feedback — Engineering QA

**Scope:** follow-on PAPER-only scene presentation, based on merged `main` `9cda31c3d9ee212359a4edaa654f56a035fa71d0` in branch `codex/e06-lower-garden`. This is engineering evidence, not Gate 1, production acceptance, actual site geography, planting permission or real growth.

## Child-visible change

- Lower Garden is one direct, operable spatial board. It shows runoff trace and channel in blue, a shared footpath in gold, and a raised pocket in green. The three marker sites are spatially separated instead of shown as three equivalent answer buttons.
- Milo and the temporary marker are shown at the actual selected site. After `inspect-result`, the board highlights the checked water or path conflict and explains the result. Moving the marker removes the active highlight until the new position is checked, while the existing action history remains intact.
- The safe raised pocket stays visible after the small PAPER plan and through the hypothetical sprout state. After the existing actual-health versus hypothetical-PAPER garden revisit, two visual cards show the NOW Current Garden beside the POSSIBLE Lower Garden model.
- Entering or revisiting a garden brings that playable scene into view. Mobile touch, desktop pointer and keyboard still use the existing buttons/actions, reducer legality and strict replay.

No reducer action, completion flag, model outcome, canonical event, save, Chronicle fact, right or unlock was added.

## Local verification

- E06 Node command — **30 tests passed** across the scene shell, water snapshot view, E06/E07 transfer, Lower Garden story, and isolated authoring prototype suites. These include safe and unsafe placement, nonpunitive correction, strict replay, forged action rejection, reset and no canonical promotion.
- `tests/season1-e06-scene-shell-browser.mjs` — **PASS** at 1366×900, 568×320 and 390×844. The mobile sizes use real Playwright touch taps. The desktop journey uses keyboard activation on the Lower Garden map. The test checks the marker site, stale-result clearing on move, visible water/path conflicts, retained pocket, NOW/POSSIBLE comparison, in-scene navigation, reset, no horizontal overflow and localStorage sentinels.
- The same browser journey still verifies Current Garden's true run-snapshot display, E05/E06/E07 transfer, and no premature result when a next-run setup changes.
- `git diff --check` and JS syntax checks are recorded with the PR verification. Production package paths remain independent of `e06-scene/`.

## Browser evidence

- [Lower Garden with checked runoff-channel conflict](../../../docs/evidence/e06-lower-garden/lower-garden-water-conflict.png)
- [Lower Garden with checked shared-footpath conflict](../../../docs/evidence/e06-lower-garden/lower-garden-path-conflict.png)
- [Desktop Lower Garden and NOW/POSSIBLE comparison](../../../docs/evidence/e06-lower-garden/lower-garden-1366x900.png) — 1366×900 Chromium.
- [Short landscape touch view](../../../docs/evidence/e06-lower-garden/lower-garden-568x320.png) — 568×320 Chromium.
- [Portrait touch view](../../../docs/evidence/e06-lower-garden/lower-garden-390x844.png) — 390×844 Chromium.

Screenshots show synthetic model diagrams only; they are not approved art or real land evidence.

## Gates and next task

- The prototype remains PAPER-only, with no canonical save, Chronicle fact, production unlock, rights grant or MN4 deployment. North Hill remains CLOSED; the Common UNKNOWN.
- E04 source chronology, E05 public entry, real E06 geography, access, planting/care stewardship and scene art remain Owner Gates. Mobile viewport simulation does not replace physical-device use.
- After this independent delivery is integrated, the next bounded task is a supervised child/family usability review on real phone screens. Record whether a child can explain the water/path conflict, place or move a marker, and distinguish NOW from POSSIBLE before pursuing any production geography or permission.
