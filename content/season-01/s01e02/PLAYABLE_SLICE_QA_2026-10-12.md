# S01E02 first playable engineering slice — 2026-10-12

**Status:** isolated E02 browser preview under `/e02/`; not yet deployed to MN4 or owner gameplay-PASS. E01 root episode is unchanged. The accepted R0/R1/R2 painterly images and original 81 script lines are reused without regenerating them.

## Architecture

- `e02/index.html` + `e02/style.css` + `e02/main.mjs`: stand-alone browser entrance and responsive RPG scene; C01 actor/portrait crops drawn from the **existing** `public/art/trio-sprites.webp`. Three E02 1672×941 WebP scenes are consumed directly from `public/art/s01e02-riverside-r0/r1/r2.webp`.
- `engine/s01e02.mjs`: isolated E02 state, safe public near-bank graph based exactly on `assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json`, observation conditions, evidence link, accepted revisions, separate Chronicle and four **deduplicated** canonical events.
- `public/s01e02.json`: **81 exact** E02 script line IDs and text, compiled from E02 approved script v1. Manual **Listen** uses browser speech synthesis as fallback; canonical recorded voices not available.
- E01 save key remains `wondervale-progress-v1`, read **only** for genuine `episode_completed:s01e01` and `s01e01_town_square_old_marker_revealed`. E02 uses a **separate** `wondervale-s01e02-progress-v1` key. No E01 state/line/event is written from E02.
- The standalone `scripts/package_e02.py` puts only E02 preview web files, E02 content, the three new WebPs and the reused C01 trio WebP under `dist/wondervale-e02-preview/`. It does not overwrite E01's release or add the other episode to E01. The preview ZIP is **not** an MN4 deploy.
- Story flow: mandatory first hypothesis → walk public path → independently inspect stones and gap in either order → notebook choose contradictory gap (old stones choice gives recovery; uncertainty acceptable) → revised hypothesis A/B → deliberate post-revision Market clue from safe lookout → Chronicle → completion.
- `tests/s01e02.test.mjs`, `tests/s01e02-browser.mjs`, and [E02-specific GitHub Actions workflow](../../../.github/workflows/wondervale-e02-preview.yml) check actual state, media, Chromium and multiple phone widths; E01 baseline still runs on its own workflow.

## Boundaries retained

- E01 entrypoint, E01 assets, E01 121 voice lines, E01 engine/save and MN4 deployed version are unchanged.
- E02's three paintings are **separate** user-approved illustrations, not pixel-identical views over one physically measured master. The actual walking **graph** determines safe legal feet stops, route and closed-spur behavior. The R0 playable prototype keeps moving sprites in a bounded public foreground band and uses approved camera/station artwork for the two required closeups. **Precise actor feet to illustrated paving alignment and actual phone readability need owner/browser screenshot review; source graph tests are not sufficient to approve art collision physics.**
- E02 world events are stored separately, not retroactively appended into E01's version-1 save. A later E03 integration must project both the original E01 ledger and the E02-specific ledger without rewriting E01.
- Market text is **not embedded** in R0/R1/R2; it appears as a distinct interactive state only after the valid revision and deliberate safe-lookout fixture inspection.
- E02 is an engineering preview, not a finished episode: no voice actor recordings, new music, full family UX or deployed MN4 accepted status.

## Test scope

GitHub workflow verifies all original/derivative media, content/state 13-case node suite, static packaging and a real Playwright/Chromium scenario starting with **an E01-completed fixture**, plus a locked/no-E01 fixture, actual desktop story flow, reload and 320/360/390/430 simulated touch views. The fixture validates integration **shape** but is not a full real E01-to-E02 click-through. It takes screenshots as a QA artifact. E01 browser regression is run independently at the same PR SHA.

**Not yet acceptance-complete:** manually review actual screenshots for C01 sizing and names/feet, validate legitimate real E01 progression across the link and save lineage (no simulated fixture), check keyboard/path on a broad device sample, storage failures and reduced motion, test replay after later episodes, observe a real 6–9 EFL family, verify MN4 deployment+rollback, obtain separate owner playable PASS. The complete `INTERACTION_TEST_MATRIX.md` remains the complete release gate; only explicitly executed subsets may be marked PASS.

## Current viewing and next task

At repo root (locally, after checkout):

```bash
python3 -m http.server 4173
```

Then visit `http://127.0.0.1:4173/e02/` **on the same origin with genuine E01-completed localStorage**. Without E01 completion, it correctly shows a locked-state link to Town Square. To test via GitHub CI, inspect/download `wondervale-e02-preview` and `e02-vertical-slice-evidence` from the E02 Actions run. Do not claim they are already available at MN4 until the staging service actually serves them.

**Next focused task after engineering CI PASS:** inspect E02 browser screenshots and stage package on MN4 alongside rather than replacing E01; owner tests one playthrough and supplies feedback for C01/world composition and mobile interaction.
