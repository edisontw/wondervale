# S01E01 Prompt Pack — Production Index

```yaml
pack_id: wondervale-s01e01-prompts
pack_revision: 1
pack_status: approved_for_downstream_planning
visual_style: wondervale-illustrated-living-diorama@1
visual_grammar_locked: true
reference_images_approved: trio_identity_only
episode_id: s01e01
source_epb_revision: 1
source_script_revision: 1
source_interaction_revision: 1
voiced_line_count: 121
generated_reference_pngs: 3
generated_production_media_count: 0
runtime_tests_executed: false
```

## Authority

This pack is a collection of **derived production prompts**, never an independent source of story canon or a claim that image/audio/application assets exist.

1. `content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md` — story/learning/continuity contract.
2. `content/season-01/s01e01/DETAILED_SCRIPT.md` — exact dialogue/caption wording and 121 approved spoken line IDs.
3. `content/season-01/s01e01/INTERACTION_SPEC.md` — required interaction behavior and event/checkpoint/replay contract.
4. `content/season-01/s01e01/INTERACTION_TEST_MATRIX.md` — **planned 51 tests, not yet executed**.
5. Task-specific foundation sources selected through `docs/PROJECT_INDEX.md`.

Start with `01-master-context.md`, then load **only one relevant task prompt** and its minimal cited inputs.

## Production routes

| Goal | File | Current gate |
|---|---|---|
| Shared prompt/context and provenance | `01-master-context.md` | ready |
| Script maintenance and EFL/parent review | `10-script-review.md`, `11-learning-parent.md` | review only; exact text locked |
| Visual direction mini-pass | `20-visual-style.md` | **COMPLETED:** see `docs/VISUAL_STYLE_BIBLE.md` |
| **C01 identity-locked turnaround** | `27-trio-turnaround-identity-locked.md` | **NEXT:** image-to-image generation only; no identity redesign |
| Other small visual references | `25-visual-reference-set.md` | Square/map/plate pending; not batch scene art |
| Character, location, prop/UI and animation | `21-character-art.md`, `22-location-art.md`, `23-prop-ui-art.md`, `24-animation.md` | **REFERENCE CANDIDATES NEXT:** grammar locked; bulk/scene art blocked until actual reference approval |
| Music family, SFX | `30-music.md`, `31-sfx.md` | direction planning only; no audio yet |
| Voice | `40-voice-production.md`, `40-voice-lines.tsv` | text export only, no recording |
| Engineering | `50-engineering.md` | handoff prompt; no implementation yet |
| Independent QA | `60-qa-review.md` | static review now; runtime tests later |
| Asset requirements | `ASSET_MANIFEST.md` | C01 identity approved; production sprites and rest of media unproduced |

## Production gates

A. Approved: EPB, script v1, interaction spec v1.
B. Approved here: task-specific prompts + reproducible voice text export + asset requirement register.
C. **Completed visual-grammar decision:** three directions compared; Illustrated Living Diorama v1 selected. E01 Square topology and abstract mystery-symbol **geometry** recorded; actual image/vector reference files are **not approved yet**.
D. **Next:** generate/review a small *reference candidate* set (trio, Square, mystery symbol, board/plate); after references are approved, proceed to scene/pose production, then music/SFX/manual voice, implementation and tests.
E. Actual runtime tests and parent-child evaluation remain pending.

**Visual grammar v1 is now selected. Create only the limited reference candidates next; no batch image production before real reference approval.** No prompt here authorizes changing fixed character/world canon, revealing the Common, showing `RIVERSIDE` before plate cleaning, rewriting spoken lines, or claiming 51 tests PASS.
