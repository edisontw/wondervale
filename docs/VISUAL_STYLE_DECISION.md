# Wondervale Visual Style Mini-Pass — Decision Record

```yaml
decision: visual_style_v1
selected: illustrated_living_diorama
status: accepted_visual_grammar
reference_assets_approved: false
production_assets_generated: false
```

## Decision

Adopt **B. Illustrated Living Diorama** for Wondervale E01 visual reference production.

| Criterion | A — Watercolor Plates | B — Illustrated Living Diorama | C — Stylized Real-Time 3D |
|---|---|---|---|
| Warm storybook character | High | High | Medium–high if modeled carefully |
| Child character expression | High | High | High but rigging-dependent |
| Continuity between story and play | Medium | **High** | High |
| Map↔physical landmark legibility | Medium | **High** | Variable by camera and 3D scene |
| Lightweight persistent state variants | Medium | **High** | Medium |
| Mobile/browser production burden | Low for static screens | **Moderate/control-friendly** | Higher |
| Generated reference consistency risk | High without strict templates | **Manageable with shared reference sheets** | Higher 3D asset/rigging complexity |
| Whole-season reuse | Medium | **High** | Potentially high at higher startup cost |

Assessments are **qualitative design judgments**, not study results, measured performance, or proof of audience preference.

### Why B

- Milo can be controlled in a bounded place rather than clicking through static slides.
- Common reference assets can feed storybook panels, living scenes, and Chronicle.
- A single Square master layout with state overlays lets the marker remain visible once revealed.
- Fixed view and legible shape design serve ages 6–9, EFL and mobile play.
- Less cost/risk than requiring full character modeling and camera control before E01 tests.

### Locked by this decision

- Visual direction name/version and 2.5D **appearance**, not specific rendering engine.
- Rounded, legible drawn forms, soft controlled textured materials, stable light and quiet shadows.
- Shared trio identity and grayscale silhouette differentiation **criteria**, not final character faces/outfits.
- Town Square topology and state overlay strategy in E01 reference contract.
- Non-color-only clues and editable text; no premature marker destination.
- Versioned mystery-symbol geometric **recipe** and semantically unknown status.
- Small-reference-first approval process; no batch production yet.

### Remains open

Actual reference images/3D-vs-sprite implementation choice, specific character outfit/face/colors, final town scenery positions and camera metrics, rendered glyph legibility, actual asset styles/tool/model, audio/voice/engineering and user-test results.

**Next single task:** generate and review a small E01 **visual reference set**: trio neutral silhouettes first; then one Town Square shared layout; then map-symbol and dirty/clean board/plate references. Approve or revise references before batch generation.
