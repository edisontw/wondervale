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
| Visual / character / location art | `CORE_TRIO.md`, `CHARACTER_WORLD_BIBLE.md`, `EXPERIENCE_DESIGN.md`, `ACCESSIBILITY_PRIVACY_SAFETY.md`, approved Episode Production Brief when available |
| Audio / music / voice | `CORE_TRIO.md`, `EXPERIENCE_DESIGN.md`, approved Episode Production Brief/script, `ACCESSIBILITY_PRIVACY_SAFETY.md` |
| Engineering / runtime / UI | `ARCHITECTURE.md`, `CONTENT_MODEL.md`, `CONTENT_VERSIONING.md`, `EXPERIENCE_DESIGN.md`, `PARENT_DISPLAY_MODEL.md`, `ACCESSIBILITY_PRIVACY_SAFETY.md`, `DEPLOYMENT.md` |
| Continuity / QA | `WORLD_CONTINUITY.md`, `CONTENT_VERSIONING.md`, current Season architecture, approved Episode Production Brief, `OPEN_DECISIONS.md` |
| Prompt / production pipeline | `PROMPT_PIPELINE.md`, approved Episode Production Brief, plus only the relevant Visual/Audio/Narrative source files |
| Episode assembly | Approved Episode Production Brief first; then only the source files needed by the active downstream task |

Current Season 1 canon is in:

- `docs/SEASON_1_ARCHITECTURE.md`
- `docs/SEASON_1_LEARNING_WEAVE.md`

Rules:

- A downstream workstream must not silently redefine an upstream locked decision.
- Read extra files only to answer a specific unresolved question.
- Prefer exact files or relevant sections over directory-wide reading.
- GitHub `main` overrides old chat context, remembered SHAs, or handoff text.

Session start/end procedure and context limits are defined in [SESSION_BOOTSTRAP.md](SESSION_BOOTSTRAP.md).
