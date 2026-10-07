# Wondervale Session Bootstrap

Use this procedure for every substantial new Wondervale work session.

## Start

1. Fetch and verify the current GitHub `main` SHA.
2. Read:
   - `README.md`
   - `docs/PROJECT_INDEX.md`
   - `docs/WORK_SEQUENCE.md`
   - `docs/OPEN_DECISIONS.md`
3. Identify the exact workstream and current development stage.
4. From `PROJECT_INDEX.md`, read only the task-specific source files needed.
5. Treat GitHub `main` as authoritative. A SHA or summary in a handoff prompt is only a hint until verified.

## Context budget

Default initial read budget: **maximum 8 repository documents total**, including the four startup files above.

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
- docs/OPEN_DECISIONS.md
- <task-specific files>

Do not change:
- <locked upstream decisions>

At the end:
- write durable results to GitHub
- report final main SHA
- report locked/open decisions
- identify the next focused task
```
