# E07 Finn's Perfect Shortcut — isolated browser authoring lab

**Scope:** synthetic connector passage, not the production E07 episode. This lab consumes the deterministic [E07 engine](../engine/s01e07-authoring-prototype.mjs) and the draft [E07 interaction spec](../content/season-01/s01e07/INTERACTION_SPEC.md). It does not import the E01–E06 production runtime or use localStorage, network telemetry, save ledgers, canonical events, historical evidence, real terrain, E08 unlocks, MN4 deployment or unapproved visual art.

## Play locally

From repository root, run `python3 -m http.server 4173` and visit `http://127.0.0.1:4173/e07-prototype/`.

Milo starts at Entry. Walk to Shared path and Water channel and choose **Look** at each; then walk to Model bench. Test Milo, another person and water on Finn's short connector. The model shows that Milo can pass but the other two overlap the connector. Choose a visible footprint (e.g., Path clear, water blocked), test it, and revise again. **Upper side detour** and **Lower side detour** are both valid synthetic layouts; the engine computes all three traces from model cells rather than grading a named choice. Compare FIRST/NOW and confirm a **model preview only**. Reset or reload clears the authoring state. All visible anchors and controls work with mouse, touch or keyboard; no drag is required.

The grid deliberately uses schematic colored cells with labels instead of rejected SVG portraits or unapproved painterly art. Every model state retains an explicit **MODEL — NOT THE REAL SITE** warning. No future Common reveal or false historical date is included.

## Verification

```sh
node --check engine/s01e07-authoring-prototype.mjs
node --check e07-prototype/main.mjs
node --check tests/s01e07-browser.mjs
node --test tests/s01e07-authoring-prototype.test.mjs
# With Playwright Chromium installed and HTTP server running:
node tests/s01e07-browser.mjs
```

The dedicated GitHub Actions workflow runs Node and four complete Chromium viewport journeys (1366×900, 568×320, 667×375, 390×844), plus keyboard Enter/Space. It checks first-trial side effects, failed water revision, stale-evidence invalidation, viable detour, FIRST/NOW, no canonical/storage writes, restart/reload, touch target sizes and browser console errors. Screenshots and JSON report are uploaded for review. CI results must be read from the exact PR/main run; this document is not itself a PASS claim.

**Still open:** E07 production Gate 1 terrain/other-user/drainage/permission evidence and approved painterly media; E06 canonical handoff; real device/family QA; full production regression, packaging, HTTPS and rollback. No `/e07/` production release from this lab.
