# S01E01 — Responsive RPG dialogue UI (2026-10-09)

Status: **owner-selected visual direction implemented for browser QA**. Physical desktop/phone review pending.

## Scope and authority

- Based on the current `main` at the start of this slice (`2c215cad124ec0c5bbd8c2b57214530ce73b785d`).
- Preserve C01-approved trio identity, original `town-square-master.webp`, 121 approved English lines, engine state machine and ledger, mandatory opening, accessibility targets and parent/child model.
- The generated desktop/mobile RPG screenshots in the discussion communicate **layout direction only**; they are not approved new canonical town/character production assets. Never insert their extra currencies, shops, menus or spurious lore into E01.

## User-directed interaction changes

1. Explain how to start **once in the initial preview**, before Begin. After Begin, remove that instructional paragraph rather than persisting an opening-guide above each dialogue line. All canonical opening lines still require Continue; no introduction skip.
2. Show one **named speaker portrait** with the line in a parchment-tinted bottom RPG panel. The panel slightly overlaps the scene's lower edge and retains real/selectable text, screen-reader labels, narration replay and keyboard/touch buttons. No duplicate top Continue.
3. The original shared trio atlas remains the only existing portrait source; `portrait()` uses per-speaker SVG viewBox bounds with **non-overlapping x-ranges** (Milo 95–520, Nia 555–990, Finn 1045–1490) and a head/shoulder vertical window (y 12–492). The three in-world full-body actor viewBoxes are also narrowed slightly to avoid fringe neighbors. Narrator/UI uses a neutral symbol. This avoids displaying a neighbor from the left/right atlas region; final aesthetic crop needs eyes-on visual QA.
4. **Desktop >760 px:** wide RPG panel, portrait left, speaker/name and full line center, always-reachable Continue and replay/skip dock right. The previously mandated >=54 px Continue and >=44 px secondary controls remain.
5. **Mobile <=760 px:** independent compact two-column portrait/dialogue, touch-sized controls on their own lower row, full approved landscape Town Square image remains visible with its original 1672:941 coordinates. No forced landscape crop to manufacture a vertical game background. Keep dedicated Child View / Parent View switching.
6. Continue to keep map/landmark actions, scratch-to-clean confirmation, Chronicle and Parent View intact. Do not bake letterforms into scenery or replace the original scene with the generated mockups.

## Acceptance gates

Automated checks cover:

- preview instruction disappears on Begin, all mandatory opening lines must still be advanced;
- each tested named portrait shows a bounded single-speaker atlas crop;
- desktop 1366×900, 1024×720, 800×600 caption actions remain hit-testable;
- mobile 390×844 and 320×700 bottom dialogue dock/button geometry;
- all previously required map, state, offline, scratch, parent and replay regression tests in `tests/browser-acceptance.mjs`.

Still open: genuine iOS Safari/Android Chrome and OS scaling tests, real visual assessment of forehead/shoulder cropping, phone landscape/very short screen read comfort, user/family interaction, recorded actor voice/music.

## Build

`20261009-e01-rpg-dialogue1` with incremented service-worker cache, preserving static-only release and reload behavior.
