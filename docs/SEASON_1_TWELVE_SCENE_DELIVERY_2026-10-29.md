# Wondervale — Season 1 twelve-scene delivery plan (2026-10-29)

**Status:** Owner-directed execution strategy / delivery milestones. Does **not** revise the locked Season 1 mystery, E01–E03 accepted content, C01 identity, EFL weave or evidence canon. GitHub `main` is authoritative; inspect current SHA every execution. Initial audit `fcef6379705320346ba8365f74373efa9b8defe1`.

## Objective and accounting

Deliver **12 substantial playable scene experiences across the existing 11 approved S01E01–E11 Core Episodes**. The original Season 1 story architecture contains **11 episodes**, not 12. The proposed counting is **one episode may have two distinct playable spaces** (E06 current garden + historic lower-garden pocket); no S01E12, new main arc or unapproved Common reveal is implied. A scene counts only when it has (1) a dramatic purpose, (2) a child-controlled interaction requiring observation/choice/revision, (3) EFL and an optional parent cue, (4) a visible outcome/Chronicle continuity, and (5) working restart/replay/mobile gates. Different dialogue panels do not count as distinct playable scenes.

| # | Existing canon episode | Planned primary playable scene | Central child action / trigger | World/Chronicle consequence | Status 2026-10-29 |
| --- | --- | --- | --- | --- | --- |
| 01 | E01 The Map Behind the Board | Town Square | Observe map before guessing; clean old marker | Riverside clue, first Chronicle record | Playable; owner accepted scope preserved |
| 02 | E02 The Bridge That Stops | Riverside | Inspect physical contradiction, revise explanation | Safe overlook, Market clue | Playable; owner accepted scope preserved |
| 03 | E03 Three Deliveries, One Wrong Turn | Market Lane | Carry 3 loads; compare routes / why one route does not fit | Wayfinding, two sincere conflicting accounts | Playable limited L route; polish/integration open |
| 04 | E04 Everyone Remembers It Differently | Chronicle source/timeline worktable | Inspect attributed memories & sources, place earlier/later/uncertain | Reversible old-route timeline | Engineering preview only, no canonical source approval |
| 05 | E05 The Station with No Trains | Station foyer -> Map Room | Infer object uses; select bounded reversible test | Small persistent Map Room | Story backbone only |
| 06 | E06 The Garden That Moved | Present hillside garden | Observe garden needs/terrain, compare maps | Explain why present garden stays | Story backbone only |
| 07 | E06 The Garden That Moved | Lower historic garden pocket | Choose safe small planting/site task with consequences | Pocket planted, grows across future visits | Story backbone only |
| 08 | E07 Finn's Perfect Shortcut | Connector passage | Prototype, spot other user's conflict, revise | Working connector to Lantern Steps | Story backbone only |
| 09 | E08 When the Steps Light Up | Lantern Steps | Test viewpoint/light pattern, not accept first impression | Steps lit and dated clue | Story backbone only |
| 10 | E09 The Closed Hill | Safe North Hill viewpoint | Observe fence/erosion; choose an accessible alternative | Unsafe segment stays closed; safe overlook | Story backbone only |
| 11 | E10 The Place with No Name | Old Common discovery | Compare traces of former uses; ask who needs space | Common understood, unfinished | Story backbone only |
| 12 | E11 A New Line on the Map | Renewed Common and loop map | Compare current users/needs, layout trial and revision | Common opens; new loop; old/new Chronicle | Story backbone only |

**Clarification:** This is a release-scene accounting plan, not a claim that the game already has only 3 literal internal scene states. E01/E02 have multiple internal screens; a playable scene here means a significant interactive location/task experience. If Owner later explicitly chooses twelve *episodes*, revise Season 1 architecture through a separate narrative decision rather than silently adding E12.

## Story progression: prevent repetitive route/button gameplay

Keep the accepted narrative spine: found map -> geographical mismatch -> routes must work for people -> conflicting sincere memories -> station/garden/hill temporal explanation -> safe choice for the Common -> new present-day loop.

Each episode must have an **inciting trigger**, a **meaningful child action** (not merely `Continue` or an answer list), a **nonpunitive wrong/uncertain outcome**, a **visible changed state**, and a **forward hook**. Stage the trigger from in-world objects/dialogue; child drives Milo. Use different interaction verbs: observe/clean (E01); compare/inspect (E02); deliver/try/retrace (E03); order/uncertain/revise (E04); inspect/test (E05); compare/plant (E06); prototype/debug (E07); align/test (E08); survey safely/choose (E09); listen/infer needs (E10); negotiate/build/visit (E11). Reuse the same engine widgets, **not** the same visible quiz loop. Wrong choice should produce honest feedback, short movement or an observable consequence and easy retry—not a penalty, fake inaccessible path, or invented physical connection. For ages 6–9 use concise scaffolded EFL without simplifying thinking.

Before implementing a new episode: write a small playable scene contract (opening trigger, 2–4 child actions, safe fail/retry, EFL phrases, optional parent cue, Chronicle event, exit/unlock, test cases). A new scene cannot rewrite upstream canon. Link E03 current delivery -> E04 memories -> E05 station / E06 garden; defer Common identity reveal until E10.

## Root causes of slow progress and policy changes

1. **Local-optimization trap:** repeated tiny UI/accessibility E04 preview commits and cart envelope tests were produced while E05–E11 had no playable slices. Require every four completed hourly runs to show a concrete episode-content deliverable or document why a P0 prevented it; stop adding E04-preview polish without an actual new functional regression.
2. **False/overbroad gates:** separate Owner visual PASS, playable browser PASS, physical/device PASS, package PASS, remote deployed PASS and season PASS. Do not reopen approved episodes for unrelated minor issues. A route-geometry proof is not the same as child playability.
3. **Art-to-geometry mismatch:** painterly full scene cannot automatically supply honest walkable rear passages or turn geometry. Keep S/N restricted until ground/entry/exit are convincingly represented; allow a safe wrong-route attempt returning on the existing L graph when visually truthful. Do not label that a completed three-route traversal. Limit corrective art to truly necessary local changes.
4. **Image transport loop:** prioritize approved existing illustrations, never repeat full-scene generation or polish rejected SVG. For new high-quality images use ChatGPT Work/image workflow separately: one composition/identity prompt batch, selective review, verified PNG/WebP/manifest and a single upload; code may use a clearly labeled development placeholder *without* masquerading as accepted production art.
5. **Excessive test cycles and status noise:** batch cohesive episode-level changes; test targeted source/Node locally or CI on changed files, execute real Chromium+E01/E02/E03 continuity and artifact tests before runtime promotion. Never hide a failed main check behind successful PR-head checks. Update living status only for milestones, actionable blocker changes or scope shifts.
6. **Serial blocking of unrelated tasks:** release gate / E03 physical acceptance / E04 source approval are independent. When one is blocked, immediately author or test the next episode's *draft* scoped work in a separate branch; keep non-approved content non-canonical/unreleased.

## Current evidence and immediate priorities (re-verify each time)

- `main` at audit `fcef6379705320346ba8365f74373efa9b8defe1`. The 2026-10-27 push run **E03 CI #40544510618 FAILED** on Chromium `page.goto http://127.0.0.1:4173/e03/` with `ERR_CONNECTION_REFUSED`; Node engine tests passed in that job. Reproduce whether the packaged preview webserver failed to start / terminated early / is raced by the browser before changing runtime logic.
- **MN4 #40544510451 SUCCESS:** mandatory E02/E03 package uploaded and downloaded, remote job logs report E01 byte-identical and `DEPLOYED fcef6379705320346ba8365f74373efa9b8defe1` to `/e02/` and `/e03/`. This establishes remote deployment recorded by Actions, not current-browser owner visual/family PASS or rollback-exercise PASS. Do not keep claiming total release artifact quota blockage when newer evidence proves a successful upload/download.
- PR **#107** adds task/load/destination clarity and upstream E02-reset guard; PR **#159** adds safe wrong-route trial-and-return and truthful E04 unlock notice. Both touch E03 and **#159 is currently merge-conflicted/dirty**. Prefer one clean reconciliation on latest `main` with exact-head CI and current actual deploy gate; no independent competing merges. Preserve safe L pavement; #109 wheel/yaw physical verification remains separately open.
- PR **#114** E04 chronology evidence/EPB remains **draft** and Owner-gated. Do not turn synthetic evidence into canon, label one memory wrong, fabricate dates or publish E04. Consolidate *one* clear batch of source/chronology decision items; draft E05–E11 content work is allowed to continue independently.
- Market coordinator / Garden resident inline SVG portraits are temporary and visually inadequate. Create painterly scene-consistent NPC portrait assets in one separate art batch; preserve current accepted trio. Approved art integrity checks, reproducible WebP & uploaded originals remain required. Never ask Owner repeatedly about unimportant costume/shadow decisions.

## Hourly autonomous execution rules

1. At each run: fetch live main SHA; read `README.md`, `docs/WORK_SEQUENCE.md`, this plan, relevant `docs/OPEN_DECISIONS.md` sections, only the one episode's documents and open PR/CI. Do not reread whole history or use an old SHA as authority.
2. Select one deliverable that can be verified this run, in priority order: (a) genuine P0 data loss/child-unplayable/failed CI (one bounded repair); (b) complete the E03 #107/#159 integration; (c) E04 owner-ready genuine source packet and next playable contract; (d) E05–E11 episode production briefs / thin vertical slices, following story order; (e) shared shell/Chronicle/unlock improvements actually needed for the next scene. Work toward the next unchecked table entry.
3. Reserve roughly **two thirds of useful cycles for playable content**, not audits/polish. A cycle must produce a verifiable code/test/content artifact or a newly established blocker, not just another analysis/PR comment.
4. After **two runs** without new evidence on one blocker: classify `blocked-external` or `blocked-design`, record one owner-action requirement and switch to the next independent item. Don't keep polling same CI/art issue, opening duplicate PRs or re-generating approved media.
5. Low-risk reversible changes within accepted scope may be tested, PR'd and merged to main under existing Owner authorization. Before any integration: verify current main, protect accepted E01/E02/C01, ensure current-head checks pass, no skipped P0 safety guard, and no force push/Secrets/unsafe deployment. Release runtime only with intact package/hash/rollback guards and correct permission.
6. **Do not require Owner for each button label, layout, test case, ordinary character blocking or draft iteration.** Reserve human Gate for material upstream story/chronology evidence changes, final visual identity/scene acceptance, and real-device/family signoff. Present approvals as one coherent batch, not repeated micro-decisions. Owner-approved story canon and existing art are not silently redefined.
7. One scheduled job owns the next action; prevent overlapping autonomous runs/competing branches by checking prior commits/PR. If a PR is open for the same fix, update/reconcile it, do not open a duplicate. Maintain a short next-task pointer in this plan or `docs/CURRENT_STATUS.md` only when meaningful progress occurs.
8. Each run report Traditional Chinese in < 200 words: start/result SHA, chosen scene/task, actual changes and PR/commit, specific Node/Chromium/Actions PASS/FAIL/NOT RUN, **actual** deployment status, blocker category and next focused task. Do not equate green unit tests with device acceptance.

## Milestones and thresholds

- **M1:** E03 user-facing item/destination and wrong-route feedback integrated, fresh CI green, release/deployment verified; physical cart/S/N unresolved findings accurately labeled (no fake Gate 3).
- **M2:** E04 Gate 1 source package decided in one batch, chronology playable with genuine approved content, persistent Chronicle and E03-completion gate tested; no premature E10 revelation.
- **M3:** E05–E07 scripts and distinct playable interactions with scene/location growth, each as a thin but complete episode slice.
- **M4:** E08–E11 playable arc, final Common and new map/loop; repeated world changes visible.
- **M5:** Twelve-scene end-to-end regression + real-device/owner/family acceptance in bounded batches. Production-ready art and prerecorded audio may be separately tracked; temporary dev art does not count as final art PASS.

**Nearest unique task at 2026-10-29:** first diagnose the latest-main E03 packaged-browser `ERR_CONNECTION_REFUSED` as CI harness/server startup vs runtime defect, get green current-main E03 check, then reconcile #107/#159 into one conflict-free branch. In parallel *only if independent*, prepare the compact E04 source-card Owner decision pack; do not spend another entire series of cycles on optional E04 preview UI polish.
