# S01E01 Working Asset Registry

**All IDs below are prospective production IDs, not additional canonical story events.** Images/audio are **not yet generated**. “Pending” means requirement recorded, not approved asset.

| Working ID | Class | Need/state | Reusable? | Approval gate | Current |
|---|---|---|---|---|---|
| `wv-char-milo-ref` | character | identity/explore/excited/inspect/discover | Season | visual style/ref | pending |
| `wv-char-nia-ref` | character | identity/observe/sketch/compare | Season | visual style/ref | pending |
| `wv-char-finn-ref` | character | identity/examine/challenge/confirm | Season | visual style/ref | pending |
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
