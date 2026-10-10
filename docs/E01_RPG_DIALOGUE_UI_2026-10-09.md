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

## Owner feedback — 2026-10-09

The owner reported that the implemented **desktop and mobile RPG dialogue presentation is substantially better**. Promote this as the accepted **E01 UI baseline and reusable cross-episode presentation rule** (portrait isolated by speaker, live text in an anchored bottom parchment dialogue panel, one-time pre-Begin introduction, desktop parent-side panel, mobile Child/Parent switching). Do not revert to detached stacked caption boxes or large overlay HUD/mockup art. This is visual/interaction direction acceptance, **not** final physical-device/family QA or production asset sign-off.

## Current Old post behavior after user feedback

The accepted desktop/mobile RPG dialogue layout is unchanged. The 2026-10-09 owner correction restores the **large whole-picture Old post rubbing gesture** because the inset-only surface was impractical. `RIVERSIDE` must visibly emerge under the finger/mouse during center rubbing and remain visible after Finish while dialogue proceeds. The permanent in-town destination and Chronicle event still require the canonical story completion. This new interaction overrides the intermediate plaque-only scratching details recorded for audit in earlier documentation.

## 2026-10-10 owner field feedback: actor clarity (scope accepted scratch preserved)

The owner **PASS**ed the existing whole-picture Old post rubbing and lettering-based finish gate. This slice must not reopen or alter that interaction, its art, voice lines or persistence.

Four improvements are required for the accepted RPG dialogue grammar:

1. The **Steward** speaks with the already-committed `public/art/steward.webp` artwork, cropped to a single head-and-shoulders portrait in the bottom caption. Narrator and UI remain neutral.
2. **Milo, Nia, Finn and Steward** each show a small, readable character name beneath their on-scene sprite. These decorative labels must never intercept world-pointer or touch navigation.
3. Change the ambiguous **Read again** button to **🔊 Listen**, with accessible names `Play voice` for current caption and `Play recap aloud` for the replayable recap. Manual browser speech remains available with automatic audio off; it never modifies the story ledger. Native/localized recorded voice is still future work.
4. Scene-relative trio placement must preserve visible separation: Nia and Finn flank/trail Milo with different feet positions rather than both being road-projected onto the protagonist's segment. No three-child stack, while modest natural occlusion is acceptable. Existing opening staging remains deliberately spaced.

See [runtime implementation](E01_RUNTIME_IMPLEMENTATION.md). The complete Town Square and sprite atlas identities remain authoritative; no new character artwork or unapproved UI widgets introduced. Browser QA tests these fixes; physical phone/desktop aesthetics remain open.
