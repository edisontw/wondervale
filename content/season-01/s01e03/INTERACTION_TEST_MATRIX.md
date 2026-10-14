# S01E03 Interaction Test Matrix — planned, NOT RUN

**Source:** EPB rev 2, Detailed Script rev 1 (draft), Interaction Spec rev 2 (authoring-reviewed draft). These are acceptance designs, not browser results. A later implementation must record evidence, exact commit SHA and real device sizes.

| ID | Test / expected outcome | Status |
|---|---|---|
| E03-01 | Without actual E02 completion + Market marker, canonical E03 does not unlock; no fabricated E02 ledger. | NOT RUN |
| E03-02 | Existing E01/E02 keys/ledger and approved artwork are byte/state safe after E03 play, reset, replay. | NOT RUN |
| E03-03 | S/N/L routes are continuous, mapped, visually legible. H→B/T/F actually reachable. | NOT RUN |
| E03-04 | Central unloading closure prevents direct H→B only, no fake bypass, no inaccessible legitimate vendor. | NOT RUN |
| E03-05 | Books delivered via S, N and L independently (where path valid) — no mandatory Finn recommendation. | NOT RUN |
| E03-06 | Cart cannot traverse steps or narrow arch; stops safely before edge; no stairs/ramp trick. | NOT RUN |
| E03-07 | Cart on L actually reaches Tea porch with wide corners and connected level pavement. | NOT RUN |
| E03-08 | Invalid cart route → reason explained after observed condition → retry with L, no loss/penalty. | NOT RUN |
| E03-09 | Choosing L first for cart succeeds; optional assisted visual comparison confirms constraint without fabricated failed walk; no deadlock. | NOT RUN |
| E03-10 | Finn corrects his shortcut assumption only after child comparison and never mocks child. | NOT RUN |
| E03-11 | Flowers have legal steady route to F; all physically valid alternatives accepted; no breakage/timer. | NOT RUN |
| E03-12 | Not sure yet, staged hints and keyboard/tap alternative do not advance event falsely. | NOT RUN |
| E03-13 | Parent cue shown after observable cart mismatch/comparison, never supplies answer; solo play works. | NOT RUN |
| E03-14 | New WALK/CART signage directs to real legal paths, visible before/after; persists on reload. | NOT RUN |
| E03-15 | Old-route glyph is distinct from new signs and discovered intentionally; no Common reveal. | NOT RUN |
| E03-16 | Station/garden memories credited to separate residents in either order; no E03 chronology verdict. | NOT RUN |
| E03-17 | Chronicle retains delivery/wayfinding plus two explicitly unverified memories for E04. | NOT RUN |
| E03-18 | E03 events emit exactly once; no duplicate completion after reload/replay. | NOT RUN |
| E03-19 | E03 restart clears only E03; historical replay read-only; recovery at dialogue/route/checkpoints. | NOT RUN |
| E03-20 | All caption IDs unique/trigger-appropriate, short readable EFL; Listen works with prerecorded audio absent. | NOT RUN |
| E03-21 | 568×320 and 667×375 landscape: legible dialogue, actor labels/feet, controls, 44px targets, no horizontal overflow or ordinary game scrolling. | NOT RUN |
| E03-22 | Phone portrait/desktop Parent View + keyboard focus and screen reader affordances remain functional. | NOT RUN |
| E03-23 | E01/E02 full regression, package allowlist and intended deployment path are isolated from E03. | NOT RUN |
| E03-24 | Gate 2 accepted original PNG and full-size WebP hashes verified after single manual intake. | NOT RUN |

**Gate distinction:** Document source QA may be checked when scripts are locked; none of these gameplay tests pass merely because the documents exist. Gate 2 is visual/media; Gate 3 is actual executable game; Gate 4 is owner/device/deploy.

## 2026-10-14 source QA (separate from execution)

**Reviewed:** authoring script namespaced IDs, sequence and conditional dialogue; explicit child decision for each load; mutually exclusive stair/arcade feedback; E02 save read-only prerequisites; persistent wayfinding and E04 memory spoiler guards. No implementation, browser or physical-device run was performed. **All E03-01–24 remain NOT RUN.**

**Additional future test cases:**

| ID | Test / expected outcome | Status |
|---|---|---|
| E03-25 | First-choice valid cart path does not play fabricated stair-stop dialogue or report an actual attempted failure. | NOT RUN |
| E03-26 | Repeated unsure/help yields a supported valid comparison/confirmation path without endless mandatory quiz or automatic credit. | NOT RUN |
| E03-27 | Books→tea→flowers sequence and conditional line queues remain coherent for all valid route alternatives. | NOT RUN |
| E03-28 | Flower route validation uses stable-surface edges rather than hard-coded L label alone. | NOT RUN |
