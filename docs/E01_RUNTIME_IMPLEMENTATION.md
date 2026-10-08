# S01E01 first playable prototype — implementation contract

Baseline: `c096a46963f44d19a034f74c202f3be488ca7d49`. Owner passed V1 references and delegated routine selection. Static ES modules; no application backend/dependency required to play. `npm run build` compiles and verifies all 121 exact TSV/script lines. Hosting remains MN4; no deployment claimed.

Painterly background and separately composited transparent C01-derived actors; five-point accessible travel; optional world keyboard arrows; explicit compare action at actual fountain/tree with map shapes visible. SVG old paper, mounting holes, fountain/tree shapes, one shared glyph. Blank marker raster state with editable destination overlay gated by reveal. Chronicle reuses map/glyph/plate sources. Desktop quiet side panel; phone separate parent/child view with cue indicator.

Ledger and checkpoint use one versioned localStorage payload; marker/unlock derived from semantic IDs. Historical replay never writes save/effects. Dialogue reread has no effects. Failed atomic write reports a warning and leaves a coherent earlier checkpoint. Offline cache after one online install; not first-ever offline load. No account, microphone or child-response capture.

Two original ChatGPT generated PNGs preserved; runtime WebP retains alpha. Neutral still poses are not a full walking/interaction animation set. Device synthetic read-aloud is a labelled prototype; recorded performances/music/SFX remain open. Generator/model/rights fields that were not supplied are not fabricated.

`python3 scripts/verify_production_assets.py` checks seven original/derivative byte counts, SHA-256/Git hashes, original PNG dimensions and all PNG chunk CRCs. `scripts/package_static.py` builds a runtime-only folder with per-file integrity, excluding future episode and foundation sources. CI runs real Chromium against that packaged folder, not the repository document root.

Local 22 engine groups passed. Actual desktop/touch/keyboard/offline acceptance and static QA evidence are recorded in E01_RUNTIME_QA_2026-10-08.md. UX-11/UX-12 require actual family observation; real iOS/Android device checks and final media remain separate acceptance work.

## Reset story progress (2026-10-08 field feedback)

A returning player sees the optional **Story so far** recap because `localStorage` contains a saved `wondervale-progress-v1` checkpoint. Refreshing the page does not reset the adventure by design.

S01E01 now exposes **Start new adventure** in the return recap, Pause dialog and Parent View (including phones). The first activation opens an explicit confirmation explaining that the device-local story progress, discoveries and E02 unlocks will be erased. **Keep my progress** or Escape cancels without changing the ledger. **Erase progress and restart** removes only the `wondervale-progress-v1` key, verifies its removal, cancels any current speech, resets in-memory state/preferences and returns to the fresh episode preview without a recap. It does not clear unrelated storage or offline caches. If storage removal fails, do not change in-memory story state; keep the confirmation open with an error message.

Automated Chromium regressions verify cancel, fresh reload after erase, completed mobile story/unlock reset, and storage-denial behavior. This is not a cloud deletion flow (the MVP has no child account or cloud progress).

**Operational check on MN4:** deploy the new runtime-only package from current main after CI succeeds, verify the new build ID `20261008-e01-reset1`, and test the new button from a previously saved public-origin session. The application state remains on the same origin so existing players can choose to resume or reset. Physical device/family acceptance remains open.
