# Wondervale Session Bootstrap

Use this procedure for every substantial new Wondervale work session.

## Start

1. Fetch and verify the current GitHub `main` SHA.
2. Read:
   - `README.md`
   - `docs/PROJECT_INDEX.md`
   - `docs/WORK_SEQUENCE.md`
   - `docs/CURRENT_STATUS.md` (**compact active source**, not archived status)
3. For Season 1 read `docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md`; locate **only relevant** `docs/OPEN_DECISIONS.md` sections, not the entire decision diary.
4. Identify one workstream and from the index read only the current Episode spec/source/tests and necessary continuity files.
5. Treat GitHub `main` as authoritative. A SHA or summary in a handoff prompt is only a hint until verified.

## Context budget

Default initial read budget: **maximum 8 repository documents total**, including the four core startup files above. Include the Season 1 delivery plan and **relevant decision sections** only if this task needs them. The preserved `docs/archive/CURRENT_STATUS_HISTORY_THROUGH_2026-11-06.md` is not a default startup file.

If a specific information gap remains, a second pass may read **up to 3 additional directly relevant documents**.

Do not:

- load the entire `docs/` directory by default;
- read every foundation document “just in case”;
- pull unrelated workstreams into context;
- use old chat context to override current `main`.

When possible, read only the relevant section/range of a large file.

If more than the normal budget is genuinely required, narrow the question first and state why the extra files are needed.

## During the session

- Work on one design/production layer at a time.
- Keep accepted upstream decisions fixed unless the user explicitly reopens them.
- Leave unresolved decisions open rather than inventing them downstream.
- Write accepted canon, implementation contracts, reusable prompts, important test results, and workflow decisions back to GitHub.
- Brainstorming and rejected alternatives do not need durable storage.

## End

Before ending substantial work:

1. Write durable results back to GitHub.
2. Verify the resulting `main` SHA.
3. Report:
   - scope completed;
   - decisions locked;
   - important decisions still open;
   - files/commits changed;
   - final `main` SHA;
   - next focused task.
4. Do not silently begin the next design layer.
5. If the conversation is becoming long, provide a compact new-session handoff prompt.

## Handoff format

```text
Continue Wondervale from the latest GitHub main.

Repository: edisontw/wondervale
GitHub main is the sole source of truth.

Scope:
- <one focused task>

Current durable state:
- <only facts needed for this task>

Read first:
- README.md
- docs/PROJECT_INDEX.md
- docs/WORK_SEQUENCE.md
- docs/CURRENT_STATUS.md
- docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md
- docs/OPEN_DECISIONS.md (only relevant sections)
- <task-specific files>

Do not change:
- <locked upstream decisions>

At the end:
- write durable results to GitHub
- report final main SHA
- report locked/open decisions
- identify the next focused task
```
