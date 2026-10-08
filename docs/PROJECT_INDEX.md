# Wondervale Project Index

Use this file to choose the **smallest useful reading set** for a focused work session. Do not load the whole repository by default.

Always begin with:

- `README.md`
- `docs/WORK_SEQUENCE.md`
- `docs/OPEN_DECISIONS.md`

Then read only the files needed for the current workstream.

| Workstream | Primary files |
|---|---|
| Narrative / Season / Episode story | `PRODUCT_VISION.md`, `CORE_TRIO.md`, `CHARACTER_WORLD_BIBLE.md`, `CONTENT_STRATEGY.md`, `WORLD_CONTINUITY.md`, current Season architecture |
| Learning / EFL / parent discussion | `PRODUCT_VISION.md`, `CONTENT_STRATEGY.md`, `LEARNING_FRAMEWORK.md`, current Season architecture, current Season learning weave, `PARENT_GUIDE_SYSTEM.md` |
| Visual / character / location art | `VISUAL_STYLE_BIBLE.md`, E01 `VISUAL_REFERENCE_CONTRACT.md`, `ART_REFERENCE_PROGRESS.md`, `IMAGE_ASSET_UPLOAD_WORKFLOW.md`, `CORE_TRIO.md`, `CHARACTER_WORLD_BIBLE.md`, `EXPERIENCE_DESIGN.md`, `ACCESSIBILITY_PRIVACY_SAFETY.md`, approved Episode Production Brief when available |
| Audio / music / voice | `CORE_TRIO.md`, `EXPERIENCE_DESIGN.md`, approved Episode Production Brief/script, `ACCESSIBILITY_PRIVACY_SAFETY.md` |
| Engineering / runtime / UI | `ARCHITECTURE.md`, `CONTENT_MODEL.md`, `CONTENT_VERSIONING.md`, `EXPERIENCE_DESIGN.md`, `PARENT_DISPLAY_MODEL.md`, `ACCESSIBILITY_PRIVACY_SAFETY.md`, `DEPLOYMENT.md` |
| Continuity / QA | `WORLD_CONTINUITY.md`, `CONTENT_VERSIONING.md`, current Season architecture, approved Episode Production Brief, `OPEN_DECISIONS.md` |
| Prompt / production pipeline | `PROMPT_PIPELINE.md`, approved Episode Production Brief, plus only the relevant Visual/Audio/Narrative source files |
| Episode brief / assembly | `EPISODE_PRODUCTION_BRIEF.md`, current Season architecture, current Season learning weave; then only the source files needed by the active downstream task |

Current Season 1 canon is in:

- `docs/SEASON_1_ARCHITECTURE.md`
- `docs/SEASON_1_LEARNING_WEAVE.md`

Production specification:

- `docs/EPISODE_PRODUCTION_BRIEF.md`

Current episode production:

- `docs/WORK_HANDOFF_2026-10-08.md` — historical bootstrap handoff; see E01_RUNTIME_QA_2026-10-08.md for current runtime checkpoint

- `content/season-01/s01e01/EPISODE_PRODUCTION_BRIEF.md` — approved_for_script
- `content/season-01/s01e01/DETAILED_SCRIPT.md` — approved v1
- `content/season-01/s01e01/INTERACTION_SPEC.md` — approved v1
- `content/season-01/s01e01/INTERACTION_TEST_MATRIX.md` — actual prototype core/browser execution; dated QA record governs status
- `prompts/season-01/e01/00-README.md` — approved prompt pack; references and first actor media now committed
- `docs/VISUAL_STYLE_BIBLE.md` — selected illustrated living diorama visual grammar v1
- `docs/VISUAL_STYLE_DECISION.md` — three-way comparison and decision record
- `content/season-01/s01e01/VISUAL_REFERENCE_CONTRACT.md` — approved C01 trio identity and Square topology + stable mystery-symbol design; V1 references owner-passed
- `docs/IMAGE_ASSET_UPLOAD_WORKFLOW.md` — tested PNG GitHub transfer/readback and manual high-resolution fallback
- `prompts/season-01/e01/26-trio-reference-manual.md` — narrow reference-A prompt for next window/manual transfer
- `docs/ART_REFERENCE_PROGRESS.md` — C01 trio identity **approved**; C02/C03 rejected as identity; source/provenance and game sprites still pending
- `assets/reference-candidates/s01e01/TRIO_TURNAROUND_REVIEW.md` — original SHA and visual difference QA for C02/C03
- `prompts/season-01/e01/27-trio-turnaround-identity-locked.md` — next image-to-image prompt tied to approved C01

Rules:

- A downstream workstream must not silently redefine an upstream locked decision.
- Read extra files only to answer a specific unresolved question.
- Prefer exact files or relevant sections over directory-wide reading.
- GitHub `main` overrides old chat context, remembered SHAs, or handoff text.

Session start/end procedure and context limits are defined in [SESSION_BOOTSTRAP.md](SESSION_BOOTSTRAP.md).
