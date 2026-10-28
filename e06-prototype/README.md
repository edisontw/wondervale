# S01E06 two-garden authoring laboratory (NOT a production episode)

This preview exercises the approved *Season 1 architecture* and **draft** E06 [production brief](../content/season-01/s01e06/EPISODE_PRODUCTION_BRIEF.md) / [interaction spec](../content/season-01/s01e06/INTERACTION_SPEC.md). It is not approved garden terrain, history, planting permission, finished painterly art or a canonical E06 unlock. The two spaces are deliberately schematic, not SVG production illustrations.

## Local preview

From the repository root, run `python3 -m http.server 4173`, then visit `http://127.0.0.1:4173/e06-prototype/`. The page has two different spaces. Tap an in-world destination to walk Milo; then press the matching **Look** button. In the Current Garden inspect two visible places, walk to the rain tray, run dry/rain with open/blocked channel, and compare. Walk to Lower Garden, inspect both water and public access, then try a marker on runoff, path or raised pocket. Inspect its result; a small pocket appears only for a valid provisional trial. A child may choose the viable setup first or revise a bad placement without penalty.

**No production import, save, localStorage, E05 checkpoint, E06 completion event, E07 unlock, true historical claim, or MN4 deployment.** Refresh/restart resets the preview. Rain bars, placements, and character movement are synthetic authoring fixtures. E04/E05 source approvals, lower-site access/plant care, final art, browser/mobile/family gates remain open.

## Test

```sh
node --check engine/s01e06-authoring-prototype.mjs
node --check e06-prototype/main.mjs
node --test tests/s01e06-authoring-prototype.test.mjs
```

These Node tests cover independent spaces, walk-to-inspect gates, dry/rain/channel evidence, favorable-first and revision flows, runoff vs access constraints, reversible markers, bounded history, strict deterministic replay/tamper rejection and zero canonical events/unlocks. Browser Playwright, mobile landscape/portrait and real-device acceptance are **NOT RUN** at this milestone; no production E06 scene is released.

**Next focused task:** add a real Chromium end-to-end test for the two distinct visual scenes and tap/keyboard controls; only after that, advance E07 authoring independently of unresolved E04–E06 owner Gate 1.
