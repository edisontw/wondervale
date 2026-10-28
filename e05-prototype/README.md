# E05 Old Station — isolated interaction laboratory

**Not a playable production episode.** This is a Gate 1 **authoring-only** browser surface and pure Node state machine for the two specifically permitted E05 mechanics. It contains **synthetic coordinates**, not an approved foyer floor, route, artifact, station record, historical date or art. It does not unlock E05/E06 or write E01–E04 progress.

## Open the prototype locally

From the repository root:

```sh
python3 -m http.server 4173
# Open http://127.0.0.1:4173/e05-prototype/
```

No build, backend, account, localStorage, audio, or image generation is required. A page refresh restarts the laboratory.

## Try two distinct paths

1. Inspect **peg pair** and **worn edge**. Choose **Try copy side B**, then **Check both marks**; both synthetic copy marks fail to align. Turn to **side A**, check again, and observe both marks align. This changes only the removable replica, not the original board. The child may choose A first instead; no deliberately wrong answer is required.
2. Choose **The copy fits; what do we know?** to preserve a **limited inference**, not a claim about the station's actual past. Preview a table **across walkway** and observe the visible obstruction; then move it **near wall** and confirm a small Map Room preview. The public walkway stays open.

The floor and peg positions are deliberately **diagrammatic**, with text descriptions and tap/keyboard buttons. They must be replaced by physically truthful, approved painterly geometry before any real movement/placement claim. There are no source cards, dialogue, Chronicle, persistent world effects, train reopening or canonical completion.

## Automated verification

```sh
node --test tests/s01e05-authoring-prototype.test.mjs
node --check e05-prototype/main.mjs
```

CI: `.github/workflows/wondervale-e05-prototype.yml`. Tests cover fit-first/mismatch-first, two observable alignment features, geometric corridor obstruction, reversible choice, strict replay, invalid actions, action cap and zero canonical events/unlocks. **They do not count as PASS for the 27 proposed production acceptance cases** in the E05 interaction test matrix. Browser-device layout and future artwork remain untested.

## Next production gates

E04 real source cards, chronology and canonical completion are not approved or available. E05 public foyer access, actual replica geometry, records and Map Room spatial art require one Gate 1 Owner decision batch. Only then author the full scene, exact text, E04→E05 canonical handoff, Chronicle and world persistence; do not import this prototype directly into production.
