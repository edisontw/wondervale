# E04 chronology authoring prototype — 2026-10-22

**State:** E03→E04 handoff and E04 authoring prototype merged into `main` via PR #113 and #115. This follow-up branch improves the preview's source visibility and Chronicle review. **No E04 production route, canonical progress or MN4 release is enabled.**

## Accepted boundary
- Owner explicitly passed E03 on 2026-10-22; preserve its script, art, save semantics, and gameplay.
- E04 **prototype interaction** received Owner PASS, but the exact historically justified source cards, dialogue, approved art, and E04 Gate 1 specification are separate decisions in Draft PR #114.
- The authoring engine uses synthetic data in tests **only**. Never ship the test fixture or treat its invented chronology as canon.
- Preserve both E03 resident memories as attributed, sincere claims; do not label either speaker wrong or reveal the Common prematurely.

## Implementation
- `engine/s01e04-chronology.mjs`: pure, versioned, reversible evidence placement (earlier/later/uncertain), inspected-source and two-memory requirements, nonpunitive adjustment, draft-only history-based restore, Chronicle projection without canonical ledger events.
- `engine/s01e04-authoring-entry.mjs`: calls PR #113's `e04Handoff(e02Save,e03Save)` before opening/resuming a draft session; an untrusted `ready` boolean never authorizes entry.
- `tests/s01e04-chronology.test.mjs`: seven draft-engine regression tests.
- `e04/authoring-ui.mjs` and `.css`: responsive, accessible preview with the two exact approved E03 witness lines shown on inspection, source placement and a readable draft Chronicle summary (earlier/later/undated). No unapproved E04 art or evidence cards.
- Restart in the E04 preview now asks for confirmation before clearing only the E04 draft. The earlier E02/E03 progress records remain untouched; cancel preserves the current draft.
- `tests/s01e04-authoring-ui.test.mjs`: exercises memory inspection, timeline review, persistence and revision; keyboard focus must relocate to a **currently enabled** nearby control when the inspected source/clue or reviewed Chronicle button becomes disabled after a DOM rerender.
- Extended `tests/s01e03-e04-handoff.test.mjs`: verifies guarded entry, interrupted draft resume, chapter-local reset, replay isolation and read-only E02/E03 sources.
- `.github/workflows/wondervale-e04-authoring.yml`: Node 24 unit checks only, **no artifacts or deployment**, so GitHub artifact storage quota does not obscure the authoring test result.

## Short-screen Chronicle navigation (2026-10-25 engineering follow-up)
- Opening **Review draft Chronicle** must focus the newly revealed **Our draft timeline** heading, not skip directly to **Complete draft timeline** when the review button disables itself.
- The heading is programmatically focusable without adding a Tab stop; the next Tab reaches the completion control. Visible focus styling and 320×640 / 568×320 / 1366×768 Chromium checks protect this behavior.
- Navigation changes no source placement, checkpoint, E02/E03 content, or canonical Chronicle. This remains an E04 engineering preview, not a production release.

## Read-only Chronicle/source round trip (2026-10-25 engineering follow-up)
- After **Review draft Chronicle**, **Review source cards** focuses the neutral Source cards heading; **Back to draft timeline** beside that heading returns focus to the Chronicle summary. Both remain available on short mobile screens without requiring a long manual scroll.
- Neither navigation control dispatches a chronology action, changes source positions, rewrites the draft checkpoint or affects E02/E03. The return control disappears if a placement revision invalidates the Chronicle review.
- Synthetic Node DOM and actual Chromium 320×640 / 568×320 / 1366×768 regression must pass on the exact PR head and merged main before claiming acceptance. This is engineering-preview navigation only; no canonical sources, story, art or E04 release.

## Long draft Chronicle readability (2026-10-25 engineering follow-up)
- The **Not sure yet** group now renders each undated source as a separate semantic list item rather than a single comma-separated sentence. This makes long synthetic labels individually scannable and allows wrapping on 320px portrait and 568px landscape.
- Earlier/later relative order, uncertainty, E03 memory attribution and the original source labels remain unchanged. This is presentation-only: no event dispatch, source-order inference, checkpoint mutation, canonical source approval or public E04 route.
- DOM tests assert list semantics; actual Chromium regression uses the bounded eight-card synthetic pack, including an unbroken long label, and checks viewport overflow plus read-only Chronicle/source round trips. Check the exact PR and merged-main CI before claiming PASS.

## Long Chronicle keyboard orientation (2026-10-25 engineering follow-up)
- When three or more draft sources have no confirmed date, the read-only Chronicle preview displays their count and offers **Review sources without dates** near the timeline heading. This jumps to a visible, focusable **Not sure yet** section heading; **Back to timeline start** returns to the beginning without forcing a long manual scroll.
- The undated group remains a semantic list. Focus movement and count text do not infer chronology, dispatch events, change source placements, or write checkpoints. One undated card keeps the simpler existing keyboard order.
- Synthetic eight-card Node DOM and Chromium 320×640 / 568×320 / 1366×768 checks cover heading visibility, return keyboard order and checkpoint immutability. Confirm exact PR-head CI and merged-main CI separately; this is not approved E04 source/story/art or deployment.

## Remaining work
1. Obtain approval of plausible visible chronology source cards, their evidence and EFL wording under E04 Gate 1 (PR #114).
2. Integrate the approved source pack into the existing keyboard/touch authoring UI; replace synthetic test fixtures only after Gate 1 approval, and do not promote SVG draft placeholders to production art.
3. Implement E04 canonical progression and episode-scoped save only when complete story interaction and tests are approved.
4. Extend MN4 static packaging, source allowlists, rollback and HTTPS checks for E04 before any release; do not assume changes to `main` automatically deploy E04.

**Note:** E03 Owner PASS is not identical to successful GitHub release-artifact upload or closure of older route-clearance engineering issues (#108/#109/#110). Track these separately without asking the Owner to repeat E03 acceptance.
