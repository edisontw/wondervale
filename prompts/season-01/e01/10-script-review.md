# Script Change-Control Prompt (not an instruction to regenerate the script)

**Inputs:** master context; approved E01 EPB; detailed script v1; `SCRIPT_REVIEW.md`; interaction spec; core trio bible.

**Prompt:**
> Review only the particular script issue `{{REVIEW_ISSUE}}`. If no issue is supplied, produce a consistency audit without changing a single line. For changes, list existing stable line ID, exact current text, suggested complete replacement, narrative/EFL rationale, and affected branches, subtitles, recordings, parent cues, and interaction guards. Do not rewrite the 121-line script simply to vary its style.
>
> Verify Milo's action-first curiosity, Nia's observation without lecturing, Finn's playful technical skepticism, ordinary steward, no Common/treasure answer, no spoken RIVERSIDE before the reveal, no quiz logic, one optional parent cue, and short natural EFL English. “What we see” and “what we guess” remain distinguishable.
>
> If accepted, issue a **new approved script revision** and regenerate all derivative line-based exports. No voice/image/engineering prompt may silently patch dialogue.

**Output:** issue-by-line report; PASS/REVISE with affected IDs and upstream approval owner. Final authoritative script remains `content/season-01/s01e01/DETAILED_SCRIPT.md`.
