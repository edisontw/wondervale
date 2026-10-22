# E04 chronology authoring prototype — 2026-10-22

**State:** implementation + automated tests submitted as a stacked Draft PR on top of PR #113; **not** a deployed, approved E04 episode.

## Accepted boundary
- Owner explicitly passed E03 on 2026-10-22; preserve its script, art, save semantics, and gameplay.
- E04 **prototype interaction** received Owner PASS, but the exact historically justified source cards, dialogue, approved art, and E04 Gate 1 specification are separate decisions in Draft PR #114.
- The authoring engine uses synthetic data in tests **only**. Never ship the test fixture or treat its invented chronology as canon.
- Preserve both E03 resident memories as attributed, sincere claims; do not label either speaker wrong or reveal the Common prematurely.

## Implementation
- `engine/s01e04-chronology.mjs`: pure, versioned, reversible evidence placement (earlier/later/uncertain), inspected-source and two-memory requirements, nonpunitive adjustment, draft-only history-based restore, Chronicle projection without canonical ledger events.
- `engine/s01e04-authoring-entry.mjs`: calls PR #113's `e04Handoff(e02Save,e03Save)` before opening/resuming a draft session; an untrusted `ready` boolean never authorizes entry.
- `tests/s01e04-chronology.test.mjs`: seven draft-engine regression tests.
- Extended `tests/s01e03-e04-handoff.test.mjs`: verifies guarded entry, interrupted draft resume, chapter-local reset, replay isolation and read-only E02/E03 sources.
- `.github/workflows/wondervale-e04-authoring.yml`: Node 24 unit checks only, **no artifacts or deployment**, so GitHub artifact storage quota does not obscure the authoring test result.

## Remaining work
1. Obtain approval of plausible visible chronology source cards, their evidence and EFL wording under E04 Gate 1 (PR #114).
2. Use the approved source pack to build accessible keyboard/touch UI; do not promote SVG draft placeholders to production art.
3. Implement E04 canonical progression and episode-scoped save only when complete story interaction and tests are approved.
4. Extend MN4 static packaging, source allowlists, rollback and HTTPS checks for E04 before any release; do not assume changes to `main` automatically deploy E04.

**Note:** E03 Owner PASS is not identical to successful GitHub release-artifact upload or closure of older route-clearance engineering issues (#108/#109/#110). Track these separately without asking the Owner to repeat E03 acceptance.
