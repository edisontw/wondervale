# Wondervale — 48-hour recovery sprint (2026-10-25 to 2026-10-27, Asia/Taipei)

Status: Owner-directed execution plan, not a new story/visual approval. The **live GitHub `main`** remains authoritative; the initial inspected SHA was `7fe1fb4b4051c07f915424c5b5c6eedde491f46e`. Always re-fetch on each hourly run.

## Goal and success measurement

Move the project toward a **validated E03 Gate 3 / release pathway and an honest E04 production-entry decision**, instead of generating more small E04 preview-only UI changes. This 48-hour sprint is time-boxed, **not a promise** that externally blocked gates will close. Every run should either deliver a tested change, improve a blocker with concrete new evidence, or explicitly advance to the next independent task.

Measure at the end: (a) #110 mandatory package upload/download and actual deploy result separately, (b) #108 legal S/N pedestrian geometry proof, (c) #109 L tea-cart swept-turn clearance, (d) PR #107 merged/deployed/owner-tested status separately, (e) #114 owner Gate 1 decision status, (f) E01/E02/E03 regression and site byte safety. Never count new commits as success by themselves.

## Verified starting boundaries

- E01 and E02: protected Owner-PASS playable scope. E03: Owner PASS of 2026-10-22, while independent #108, #109 and #110 remain open for full technical/production gates.
- E04: chronological reasoning engine, synthetic evidence fixtures, Chronicle/draft/resume/reset/keyboard/mobile tests exist as **engineering preview only**. No approved production source cards, chapter script or art; no public /e04/ release or MN4 deployment.
- PR #114: open **draft** Gate 1 story/evidence proposal; only Owner can approve new historical evidence/story. Never merge automatically.
- PR #107: open guidance/wayfinding candidate; prior CI passed on its old head, but artifact quota/release/physical QA remain independently unproven. Refresh from current main and retest before considering a merge.
- #110: mandatory `wondervale-mn4-e02-e03-package` was blocked by artifact quota in an earlier run. The newer E01 run #40149152254 uploaded E01 artifacts, but that **does not prove** the mandatory E02/E03 release package can be uploaded/downloaded, nor that MN4 deployed.
- The `wondervale-mn4-auto-deploy.yml` workflow supports manual dispatch and push-path triggers; verify the release-transfer job and the gated `MN4_DEPLOY_ENABLED` flag without changing Secrets or weakening integrity controls. With unavailable manual-dispatch tool, record the exact requested manual action once; do not issue fake PASS or repeatedly try unsupported methods.

## Priority order and flexible 48-cycle budget

Treat the phases as *maximum attention budgets*, not excuses to wait until a particular hour. Once an item passes or hits an external gate, move ahead immediately.

| Cycles | Primary focus | Expected independently verifiable output |
| --- | --- | --- |
| 1–4 | Audit actual main SHA, recent workflows, issue repro and release artifacts; establish baseline and prevent duplicated fixes | Small issue-linked baseline, current P0 list and exact workflow/run evidence |
| 5–14 | #110 release pipeline: check quota recovery, mandatory upload/download, allowlists, hash/rollback and MN4 opt-in; do not deploy E04 | Real release-gate verdict with run ID and downloaded package proof when possible; otherwise one actionable manual blocker |
| 15–27 | #108 E03 pedestrian S/N: map existing painted walkable surface, entrances/exits/occlusion and no-go geometry; add legal alternatives and browser regression only when art supports them | Real geometry evidence, tests and scoped code PR/merge or precise art/Owner blocker |
| 28–36 | #109 E03 tea-cart sweep: evaluate full rendered footprint including wheel/handle, yaw/turn, foreground and both L directions on 320/568/desktop; no sprites hiding/teleporting | Swept-area geometry/test evidence and minimal safe fix where needed |
| 37–41 | PR #107: rebase/compare current main, verify delivery guidance and genuine source tests; merge only with release proof and safe unchanged accepted episodes | Scoped integrated guidance or documented reason for hold |
| 42–45 | E03→E04 handoff, cross-episode reset/Chronicle QA and *Owner-ready* PR #114 decision packet; no synthetic evidence promoted to canon | Tests and concise decision request, without auto-acceptance |
| 46–48 | Recheck E01/E02/E03/E04-technical CI and release evidence; update current status/issues, consolidate outcomes, identify next highest-risk focus | Final truthful summary: SHAs, PASS/FAIL/NOT RUN, shipped versus unshipped, pending Owner decisions |

**Priority may override the table:** a newly reproduced P0 integrity/safety/child-unplayable regression must be addressed immediately. If #110 is externally blocked, parallelize only source/tests/documentation of #108/#109; do not keep auditing the same quota every hour. If existing art makes S/N impossible, state this explicitly and prepare the *smallest* evidence-backed scene/art request instead of inventing a connection.

## Hourly work protocol

1. Read live `main` SHA, `README.md`, `docs/WORK_SEQUENCE.md`, this plan, `docs/CURRENT_STATUS.md`, and only relevant `OPEN_DECISIONS.md` sections/source/tests. Check open PRs, Issues and real Actions results.
2. Identify the single highest-impact **currently actionable** blocker. Consult last run's GitHub notes/issue or status to avoid cycling over identical observations.
3. Reproduce the defect or gather concrete evidence. Distinguish source-graph tests, rendered browser tests, owner-device review and actual deployed HTTPS checks.
4. Make a small reversible change only if it materially improves an accepted scope. Run relevant Node, real Chromium, package/hash/allowlist and E01/E02 regression gates. Update main only after verification; use PR when risk or checks require it, and recheck merge head.
5. No force-push, destructive cleanup, Secrets changes, bypass of release artifact validation, approval of PR #114, invented chronology, unapproved image changes, or release of E04.
6. If an action is disallowed by connector/permissions, stop that specific write path **without trying to bypass it**. Record the exact blocker and proceed to the next independent unit of work. Do not turn local-only patches into a false GitHub result.
7. After **two consecutive hourly rounds** on the same blocker without new findings or any admissible progress, explicitly mark it `blocked-external` or `blocked-design` with one actionable next step and move on. Check it again only on new evidence or at the closing sweep.
8. Update exact issue/PR and `docs/CURRENT_STATUS.md` **only on meaningful changes**; avoid appending an hourly status flood or creating repetitive PRs.
9. Report in Traditional Chinese, briefly: read main SHA; one focus; actual code/doc change and resulting commit/PR (or no change); exact test/run PASS/FAIL/NOT RUN; actual MN4 status; blocker; next unique task.

## End-of-sprint exit report

Report separate outcomes, each evidenced by an exact source SHA and run/proof: (1) GitHub main + actual CI, (2) release artifact upload/download, (3) MN4 site deployed/probed, (4) E03 S/N and cart route proof, (5) E03 guidance, (6) E04 Gate 1 Owner approval, (7) remaining P0/P1 and recommended next focused sprint. **Do not mark full E03 Gate 3 or E04 playable production PASS without all required gates.**
