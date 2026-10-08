# Master Context — S01E01

Use this as the shared prefix to **one chosen task prompt**. Don't copy an entire project bible into every prompt.

## Source authority / fresh checkout

1. Fetch/verify current GitHub `edisontw/wondervale` `main` SHA at execution time.
2. Read `README.md`, `docs/PROJECT_INDEX.md`, `docs/WORK_SEQUENCE.md`, `docs/OPEN_DECISIONS.md`; then only needed documents for the selected workstream.
3. This prompt pack is **derived**, not canon. Sources: `content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md` revision 1; `DETAILED_SCRIPT.md` revision 1, exact dialogue lock v1; `INTERACTION_SPEC.md` revision 1; and `INTERACTION_TEST_MATRIX.md` (51 planned tests, none executed).
4. If an approved source changes, stop/assess whether this pack and voice export must be regenerated before acting. No downstream work can silently redefine upstream decisions.

## Common creative constraints

Wondervale is ages 6–9, EFL-first, **simple language does not mean simple thinking**, parent-guided/child-driven, storybook shell + persistent living scenes. Milo is player-controlled; Nia observes/communicates; Finn invents/challenges. The trio are established friends, not subjects-as-characters. World growth and Chronicle memory are rewards; not badges/streaks.

E01 (working title *The Map Behind the Board*): ordinary Town Square noticeboard repair reveals an old layer. The child inspects visible faded line, unnamed shape, physical age/holes. After >=2 distinct child-initiated evidence inspections, choose A/B/C **ungraded** guess; all reconverge. Then Milo checks round fountain and shade tree in actual Town Square, searches broad exit region, cleans a dirty plate, only then sees arrow + **RIVERSIDE**. Mystery symbol meaning remains unknown; the Common is not revealed. Canonical marker visible after completion, replay cannot roll the present backward.

Do not add villain, treasure confirmation, magic, timed task, pixel hunt, forced dragging, compulsory parent step, answer-giver adult or a third substantive interaction. Child and parent language channels separate; narration, captions and replay are accessible; no child data collection.

## Explicit unresolved inputs

```text
APPROVED_VISUAL_STYLE = wondervale-illustrated-living-diorama@1 (LOCKED in docs/VISUAL_STYLE_BIBLE.md)
APPROVED_CHARACTER_REFS = UNSET
APPROVED_TOWN_SQUARE_LAYOUT = topology/design LOCKED in E01 VISUAL_REFERENCE_CONTRACT.md; rendered master ref PENDING
APPROVED_SYMBOL_REFERENCE = glyph geometric recipe LOCKED: s01-missing-place-glyph-v1; actual vector/media candidate PENDING and meaning UNKNOWN
APPROVED_AUDIO_DIRECTION = UNSET
APPROVED_ASSET_PATHS = UNSET
```

Do **not** substitute invented values for any UNSET input. Visual grammar now permits **small candidate reference generation only**; do not batch-produce scenes, poses or props until actual character, Town Square, and glyph refs are reviewed.

## Mandatory task output footer

```text
TASK:
SOURCE_MAIN_SHA:
SOURCE_FILES_AND_REVISIONS:
DELIVERABLE_PATHS_OR_ASSET_IDS:
PROPOSALS_REQUIRING_APPROVAL:
CHECKS_PERFORMED_AND_EVIDENCE:
KNOWN_LIMITATIONS:
NEXT_GATE:
```

For asset production, append tool/model version, prompt version, seed/reference IDs when supported, generation date, file path and review state **only after generation actually occurs**.
