# S01E01 Working Asset Registry

**All IDs below are prospective production IDs, not additional canonical story events.** Approved character **reference art now exists** (Candidate 01 identity only); game-ready character sprites, Town Square imagery, audio and runtime assets do **not** exist. Visual style `wondervale-illustrated-living-diorama@1` and E01 topology/mystery glyph recipe are design-locked in `docs/VISUAL_STYLE_BIBLE.md` and `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md`; actual **media references are still pending**. “Pending” means requirement recorded, not approved asset.

| Working ID | Class | Need/state | Reusable? | Approval gate | Current |
|---|---|---|---|---|---|
| `wv-char-milo-ref` | character | identity/explore/excited/inspect/discover | Season | visual style/ref | **identity locked to approved C01; poses/sprites pending** |
| `wv-char-nia-ref` | character | identity/observe/sketch/compare | Season | visual style/ref | **identity locked to approved C01; poses/sprites pending** |
| `wv-char-finn-ref` | character | identity/examine/challenge/confirm | Season | visual style/ref | **identity locked to approved C01; poses/sprites pending** |
| `wv-char-steward-ref` | NPC | ordinary repair/helper | optional | visual style/ref | pending |
| `wv-town-square-base` | location | lived-in Square base SC01–SC05 | Season | spatial layout | pending |
| `wv-town-square-fountain` | landmark | round physical/map anchor | Season | spatial layout | pending |
| `wv-town-square-tree` | landmark | large-tree physical/map anchor | Season | spatial layout | pending |
| `wv-town-square-board` | location variant | closed/front/open-paper repair states | Season | visual layout | pending |
| `wv-town-square-exit` | location | broad post/route-marker region | Season | visual layout | pending |
| `wv-e01-old-map` | prop | line, unnamed symbol, mounting holes, two anchor icons | revisits | approved symbol | pending |
| `wv-e01-nia-sketch` | prop/Chronicle | cumulative observations, no interpretation label | revisits | approved map refs | pending |
| `wv-square-plate-dirty` | prop state | destination and arrow **hidden** | Season | layout/ref | pending |
| `wv-square-plate-clear` | prop state | arrow + editable RIVERSIDE overlay | Season | layout/ref | pending |
| `wv-e01-chronicle-page` | storybook UI | sketch and marker before/after, open mystery | Season | approved visual states | pending |
| `wv-e01-map-inset` | UI | persistent fragment inset while exploring | reusable | art/input design | pending |
| `wv-parent-cue-panel` | UI | shared desktop/mobile adult cue | reusable | UI ref | pending |
| `wv-music-square-family` | music | warm/curious/discovery/close variants | Season | audio direction | pending |
| `wv-sfx-core-library` | SFX | paper/clip/inspect/sketch/cloth/page | Season | audio direction | pending |
| `wv-voice-e01-line-set` | voice | 121 line-recordings, later | E01 | provider/casting | text ready; audio pending |

## Approval and traceability

At generation time (not before), record: stable asset ID, scene/state IDs, relevant prompt and source revisions, approved reference IDs, generator/model/seed when available, date, output path, license/usage rights, mobile preview review, accessibility review, and disposition.

Status progression: `pending → proposed/reference_candidate → reference_approved → generated_candidate → approved_asset → integrated`. No future status can be assumed because a prompt exists.

Keep **same** Town Square layout and trio silhouettes across storybook, living scene, map and Chronicle; produce before/after overlays instead of independent incompatible backgrounds. The mystery symbol must be identical across E01's fragment/sketch/Chronicle and future payoff reference without interpreting it. Critical text remains app-rendered, not image-only.

## Immediate reference candidate tasks (not production assets)

| Reference ID | Dependency | Reviewer checks | Status |
|---|---|---|---|
| `ref-wv-trio-neutral-v1` | style v1, Core Trio | small silhouettes, identities, common scale | **identity reference APPROVED by owner PASS; C01 SHA `aeb4fcf...`; provenance and production sprite QA pending** |
| `ref-wv-town-square-v1` | style, E01 topology | fountain/tree/board/exit layout, mobile navigation | pending candidate |
| `ref-wv-map-symbol-v1` | `s01-missing-place-glyph-v1` geometry | non-color-dependent, consistent, non-spoiling | pending candidate |
| `ref-wv-board-plate-v1` | Square layout, same map ref | old paper intact, dirty state hides RIVERSIDE, clean has editable overlay | pending candidate |
| `ref-wv-chronicle-v1` | first four refs accepted | reuse before/after evidence, no new canon | pending candidate |

See [Reference Candidate Prompt](25-visual-reference-set.md). These entries are **not evidence that files exist**.

## Reference A actual candidate review

- [Reference 01 source & verification](../../../assets/reference-candidates/s01e01/TRIO_CANDIDATE_01.md)
- 1448×1086 original PNG, Git blob `aeb4fcf6cef5ca354bd3be495ea1226081f26604`, GitHub Actions PNG validation PASS.
- Character identity **approved** from GitHub-hosted C01 after owner PASS; actual gameplay sprite creation/QA and image provenance **not yet completed**.
- Do not count the original reference sheet as a set of transparent sprites. Side/back/neutral model directions still require separate production planning.

## Turnaround attempt dispositions

- [Candidate 02/03 review](../../../assets/reference-candidates/s01e01/TRIO_TURNAROUND_REVIEW.md): both 1448×1086 original PNGs checked against exact Git blob SHA. **02: composition reference only, not approved identity**; **03: reject as identity (goggles/wardrobe drift)**.
- Corrected next sheet must be **image-to-image anchored on C01**, following [Prompt 27](27-trio-turnaround-identity-locked.md). Do not use C02 or C03 as character source images.
