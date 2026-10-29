# E08 lower-Steps authoring engine — scope and QA

This is a **synthetic, noncanonical model** for Scene 09/12, not a production E08 episode or physical lighting procedure. It implements the [draft interaction specification](INTERACTION_SPEC.md) without claiming an approved historical date, electrical work, real geometry, North Hill access, new art, Chronicle event, or E09 unlock.

## Engine

- `engine/s01e08-authoring-prototype.mjs` exposes fixed marker coordinates, three safe lower observation anchors (base, lower landing, side), exactly two independently switchable lower **model** lamps and the minimal circular angular spread computation.
- Milo can only walk one declared safe edge at a time. Inspection of brackets, boundary and individual lamp models precedes switching. A single lamp cannot produce a valid observation; both lamps are needed for two-view comparison.
- The same three marker coordinates are never changed. A second viewpoint must differ from the first, and the difference is computed from geometry, not a hard-coded success flag. Lamp changes clear stale observations.
- The undated service plate is a **source-pending observation**, never a fabricated year. Completion is preview-only; all canonical events, unlocks and historical claims remain empty.
- Action history is bounded, strictly typed and replay-derived. Invalid or tampered snapshots fail closed. Reset clears only this in-memory model.

## Verification commands

```sh
node --check engine/s01e08-authoring-prototype.mjs
node --check tests/s01e08-authoring-prototype.test.mjs
node --test tests/s01e08-authoring-prototype.test.mjs
```

Dedicated E08 GitHub Actions runs Node and production-packaging isolation checks on PR and main. **CI outcome must be checked from the actual run**; these instructions do not assert PASS.

## Explicitly not implemented

No E08 browser viewport, Chromium/mobile test, real-device/family approval, production ledger/Chronicle, real lower-lamp operation, source-card date, E07 canonical handoff, MN4 deployment, HTTPS or rollback validation. The 36-case production test matrix remains **NOT RUN**; isolated engine checks are separate evidence.

**Next independent deliverable:** create a visible lower-Steps browser lab with Milo movement, two light switches, first/second angular view cards, optional parent cue and keyboard/mobile Chromium journeys. Keep it out of production packaging.
