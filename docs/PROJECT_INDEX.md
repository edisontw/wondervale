# Wondervale — Project Index

**Active handoff (2026-11-06):** [CURRENT_STATUS](CURRENT_STATUS.md) is the short current development ledger; [SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29](SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md) sets the twelve substantial playable scenes across the existing eleven episodes. GitHub's latest `main` always supersedes dated handoffs. **Next playable work:** implement the [E10 two-view question contract](E10_PAPER_COURTYARD_CHILD_QUESTION_CONTRACT_2026-11-06.md) with strict replay; no E04 Canon or site access is implied.

## Read only what the current task needs

1. Fetch the actual `main` SHA, latest relevant PR/Issue/Actions.
2. Read `README.md`, `docs/WORK_SEQUENCE.md`, `docs/CURRENT_STATUS.md`, and this index.
3. For Season 1 work read the twelve-scene plan, then **relevant sections only** of `docs/OPEN_DECISIONS.md`; never load its 110 KB historical decision diary by default.
4. Read **one episode's** production brief / spec / source / tests plus only directly needed upstream continuity contract.
5. Record stable approved decisions and test evidence on GitHub; avoid creating one more dated handoff, duplicated status file or per-run progress report.

| Focus | Authoritative source(s) |
| --- | --- |
| Locked vision and character identity | `PRODUCT_VISION.md`, `CORE_TRIO.md`, `CHARACTER_WORLD_BIBLE.md`, `docs/SEASON_1_ARCHITECTURE.md` |
| EFL / parent guidance | `docs/SEASON_1_LEARNING_WEAVE.md`, `LEARNING_FRAMEWORK.md`, `PARENT_GUIDE_SYSTEM.md` |
| Current delivery and next gate | `docs/CURRENT_STATUS.md`, `docs/SEASON_1_TWELVE_SCENE_DELIVERY_2026-10-29.md` |
| Production specification / authoring | `EPISODE_PRODUCTION_BRIEF.md`, specific `content/season-01/s01eNN/` brief/spec/test matrix |
| E01/E02 accepted art and QA | `ART_REFERENCE_PROGRESS.md`, `VISUAL_REFERENCE_APPROVAL_2026-10-08.md`, `E01_LESSONS_LEARNED_2026-10-10.md`, `E02_SCENE_ACTOR_DIALOGUE_QA_2026-10-14.md` |
| E03 route and cargo proof | `E03_SN_GEOMETRY_AUDIT_2026-10-25.md`, `content/season-01/s01e03/GATE3_M0_SLICE.md`, issue #109 |
| E04 Owner source gate | `docs/OPEN_DECISIONS.md` relevant E04 clauses, `content/season-01/s01e04/`, draft PR #114 |
| E05–E11 PAPER mechanics | `eNN-scene/`, corresponding `authoring-labs/`, `engine/` and directly matching `tests/` |
| Cross-scene/replay QA | `SEASON1_TWELVE_SCENE_REGRESSION_GATE_2026-10-31.md`, `SEASON_1_STORY_GAP_AUDIT_2026-11-03.md` |
| Release / safety | `DEPLOYMENT.md`, `MN4_AUTO_DEPLOY.md`, `CONTENT_VERSIONING.md`, `ACCESSIBILITY_PRIVACY_SAFETY.md` |
| Asset approval / generation | `VISUAL_STYLE_BIBLE.md`, `IMAGE_ASSET_UPLOAD_WORKFLOW.md`, `EPISODE_PRODUCTION_FAST_LANE.md` |
| Earlier session procedure | `SESSION_BOOTSTRAP.md` |

## Repository layout and housekeeping

- `app/`, `e02/`, `e03/`, `public/art/`: accepted or release-related runtime/media; protect bytes, approval and packaging invariants.
- `e04/`, `e05-scene/` … `e11-scene/`: experimental / PAPER authoring-only interfaces unless explicitly promoted by a separate approved gate.
- `e05-prototype/` … `e11-prototype/`: **legacy but still CI-referenced** model/browser fixtures. Do **not** delete based on folder name. Each has a corresponding `.github/workflows/wondervale-eNN-prototype.yml` and matching tests; first migrate or retire dependencies and prove full green regression in a scoped PR.
- `authoring-labs/`, `engine/`, `tests/`, `.github/workflows/`: source-of-evidence and strict replay/production-isolation gates, not disposable scratch files.
- `assets/reference-candidates/`, `assets/production-candidates/`, `public/art/`: preserve original image provenance, owner-selected C01/E01–E03 art, manifests and exact hash checks. Do not deduplicate by byte identity without checking all links and approved asset contracts.
- `docs/archive/`: immutable historical progress/decision evidence. The [full former status file](archive/CURRENT_STATUS_HISTORY_THROUGH_2026-11-06.md) is here; **read `CURRENT_STATUS.md` for current work**, not this archive.
- Local throwaway artifacts (caches, Node modules, Playwright reports, generated releases, temp files, secrets) are ignored by `.gitignore`. CI screenshots remain in Actions artifacts when appropriate rather than being manually appended to Git.

### Pruning rule

**Never delete an item merely because it is named `prototype`, `candidate` or `old`.** Before deletion or relocation, check usage in runtime/imports, browser tests, workflows, documentation, asset manifests, case-sensitive links and allowlists; preserve source identity and evidence. Reversible, tested removal is a separate small PR. Don't archive a runnable scene in a way that breaks test paths or prevents full PAPER replay.

The [older E01/E02 production handoff](E02_KICKOFF_2026-10-10.md) and [2026-10-08 Work handoff](WORK_HANDOFF_2026-10-08.md) are historical references, not the next-step pointer.
