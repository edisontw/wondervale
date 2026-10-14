# E02 Riverside — scene, grounding and dialogue QA (2026-10-14)

**Scope:** E02-only engineering repair. Before work, `main` was verified as `1e84bb64b3f16ad93100a764c86051ef9a9ba3ed`. E01 remains frozen. Owner-device acceptance is OPEN.

## Reproduced root causes

1. The engine's canonical 1600×900 **abstract near-bank graph** was being projected directly into three separately painted 1672×941 photographs. Those artworks are not pixel-registered: R1 has a paved approach at the left, while R2's paved lookout is on the right. Characters at a graph-relative X/Y could therefore appear **in the water, behind the guardrail or on props**.
2. E02 discarded the backdrop entirely for the 13-line opening sequence (`phase==='intro'`), so the beginning of the episode was text-only despite the owner-approved R0 scene being available.
3. The Old Map was appended below the short-landscape game viewport, while exploration deliberately clipped document scrolling. Users could open it but fail to see the panel.
4. Runtime previously assumed that a valid `<img src>` meant a successful download. A failed or corrupt image could leave a blank painted frame without a reason.
5. On small landscape screens the two caption controls used a fixed large share of the text column; mobile characters were also oversized relative to the illustrated boardwalk.

## Corrective implementation

- R0 has an explicit **paved-foreground presentation map**, with named graph stops mapped to image-specific feet coordinates; the original engine waypoints/edges still decide legal travel, so this is **not** a change to safe route topology or story triggers.
- **Only R0 is an explorable scene.** R1 and R2 are inspection cameras with unoccluded approved artwork and no projected actor/hotspot sprites. Dialogue retains the speaker name, C01 portrait, exact original text and manual Listen. A clear **Back to Riverside** action restores R0 without erasing observations, moving stations or duplicating ledger events.
- The opening uses R0 background and cast behind the opening dialogue. Short-landscape intro follows the same scene-first responsive caption rules as exploration.
- Adjust R0 hotspot targets to painted left gate / public walkway / right lookout, not river pixels. Scale down actors on narrow screens, keep their feet on the existing paving and avoid labels crossing one another.
- Long dialogue scrolls inside the caption text column; controls stay `>=44px`. UI speaker labels use readable casing, while 81 canonical EFL script lines and their IDs remain unchanged.
- Present the Old Map in an accessible centered dialog within the screen. Hide redundant short-phone status visually while retaining its accessibility role, avoiding scene size changes.
- On image load failure, show a human-readable error and **Retry picture**; retries bust stale responses rather than silently displaying a blank frame. Existing R0/R1/R2 WebPs remain unchanged; no image regeneration.
- New E02-only build marker: `20261014-e02-safe-stage-dialogue1`. E01 source, artwork, engine, save format and release were not edited.

## Test and release gates

- Browser checks assert real successful `img.decode()` at the expected 1672-pixel width for R0, R1, R2 (mere asset URLs are insufficient).
- Assert no actor overlays in R1/R2, actor feet in the R0 paved band, restored R0 cast after closing details, opening art and caption visible together, portrait and short-landscape interactions, and actual error/retry behavior when R2's network request is aborted.
- Engine test verifies camera return preserves the state graph position, evidence, played dialogue and ledger.
- Re-run E02 unit/browser/packaging and E01 full regression via Actions. E02 MN4 deploy must confirm byte-identical E01; PR CI is not a production release.
- **OPEN:** actual iPhone Chrome / Home Screen App visual QA at 568×320 and 667×375 CSS equivalent, correct apparent actor feet relative to the approved painting, full text/controls, WebKit picture loading, family UX and recorded voices.
- **Locked:** selected R0/R1/R2 art, C01 trio identity, the 81-line EFL/story, public path graph, closed crossing, evidence/revision/Market spoiler gates, E01 accepted application.

## 2026-10-14 owner follow-up — Continue flashes, fifth line clipped, landscape lost

**Owner observation (actual iPhone):** each Continue flashes the scene; around the fifth opening text box the dialogue slides beyond the right edge; after completing the opening, horizontal full-scene presentation is no longer preserved. These are **new blocking physical-device QA findings**, not a retroactive PASS of the prior build.

**Diagnosis:** `doAction(next)` always rebuilt `#app.innerHTML`, including a fresh scene `<img>`, on every line; the `resize` listener also rebuilt the same image on WebKit viewport changes. The intro-specific CSS did not inherit the later short-landscape caption constraints applied to Explore/Market. The fifth opening line switches to Milo's C01 portrait, exercising that under-constrained layout. A first CI attempt also revealed a selector-order regression in the mobile Parent View state; it was corrected before merge.

**Correction (E02-only build `20261014-e02-dialogue-stable2`):**

- Continue while dialogue remains in one scene updates only speaker, text, portrait and line counter, retaining the actual decoded WebP node and Continue focus.
- Phase change keeps the image DOM node if the source URL is the same; orientation/browser toolbar resize is entirely CSS-based, not a JS re-render.
- Short iPhone landscape explicitly caps the caption width, height and nested content grid for Intro, Explore and Market **identically**; text can scroll internally, Continue/Listen remain 44px touch targets, and no element may force horizontal page overflow.
- The exclusive mobile Parent View hidden-child CSS is ordered after these rules.
- New Chromium test runs **all 13 lines**, including the exact fifth line screenshot, checking unchanged background element and geometry, full visible caption/control bounds, and the scene after the 13th Continue. Continue testing portrait (390×844) and 568×320 / 667×375 short landscape. Preserve all prior E02 route, asset-decode, story, save and E01 tests.

**Locked unchanged:** R0/R1/R2 approved artwork, 81 E02 source/voice lines, safe-route and chronology engine, C01 identity, E01 app and released bytes. The owner must still approve the actual iPhone landscape after the updated MN4 deploy. Never claim Chrome CI represents a real WebKit approval.

## 2026-10-14 owner iPhone follow-up — Notebook and uncertainty

The owner corrected their earlier interpretation: the major offscreen problem happens **after choosing Open evidence notebook**, not on the fifth opening line. The two exploratory buttons **Look across** and **Open evidence notebook** were green only because `primary=true` assigned the theme accent; green was not an evidence or correctness state. The 116px mobile dialogue dock gave Continue and Listen half the available width, forcing 'Continue' onto two lines. The original notebook renderer left the Riverside scene above the evidence notebook, and `unsure` only changed `lastFeedback` without enqueuing any spoken dialogue.

**E02-only corrective design, build `20261014-e02-notebook-compact3`:**

- Use neutral styling for the Look at old stones, Look across and Open evidence notebook travel/evidence actions, so green is not misread as the correct answer.
- In short iPhone landscape, Continue is a 91px single-line target; manual Listen is a separate 44px accessible loudspeaker icon. The canonical speech text and IDs remain unmodified.
- When entering Notebook or the immediate Revision choice page, do not render an unused full-size Riverside game painting **above** the content. Preserve the existing Chronicle image and revealed Market Lane sign; that chapter record is intentionally scrollable. The evidence notebook instead owns the available child viewport, with two visible evidence photographs, their labels, the original fence-only hypothesis question, and an immediately available Not sure yet control.
- During the notebook introduction/help dialogue, keep the notebook visible with evidence buttons temporarily disabled until the three existing queued lines finish. The caption remains at the bottom of the same viewport. Constrain evidence thumbnails/card content on 568×320 short landscape; no page-length scroll should be required for ordinary notebook decisions.
- Not sure yet enqueues the **already approved** NIA-010, FINN-009 and UI-009 recovery questions. It never marks `linked`, `revised`, or any ledger event. Hints may be repeated; the child still selects the fact, then explicitly revises Milo's idea. In the revision step Not sure yet reuses approved NIA-018 and NIA-019 prompts.
- Keep evidence photos at full quality in the original R1/R2 asset files; only their notebook thumbnail viewport is compacted. No new art.
- Retest the actual iPhone landscape after CI and production deploy. Chromium short-landscape tests do not establish WebKit PASS, and evidence/family acceptance remains open. Preserve E01 frozen release, original 81 E02 script lines and E02 safety/story gates.

## 2026-10-14 — Owner iPhone PASS for notebook/UI repair

**Owner explicit report:** PASS after the deployed E02 build `20261014-e02-notebook-compact3` ([PR #71](https://github.com/edisontw/wondervale/pull/71), main `932028778716800417db6d0c6f1b2c7b9bf03b18`). Close the **specific physical-phone repair acceptance** for: single-line Continue/manual Listen placement; neutral Look across / Open evidence notebook buttons; Notebook two-evidence compact landscape layout; accessible Not sure yet dialogue followed by child-selected evidence; and preservation of landscape operation through the Notebook. The exact final owner response is `pass`; do not extrapolate it to every gameplay/audio/replay/parent device path.

**Regression/provenance:** [E02 acceptance #38548635113](https://github.com/edisontw/wondervale/actions/runs/38548635113) PASS, [E01 regression #38548635134](https://github.com/edisontw/wondervale/actions/runs/38548635134) PASS, [MN4 deployment #38548635057](https://github.com/edisontw/wondervale/actions/runs/38548635057) PASS and confirmed E01 byte-identical. Canonical 81 spoken lines, R0/R1/R2 approved art, evidence gate, and safe route remain locked.

**Still open:** broader E02 end-to-end/family playtest, audio quality, WebKit/Home Screen variations and Chronicle-to-E03 readiness. **Next focused task:** exercise the complete E02 conclusion and Chronicle on physical phone; repair only concrete user-reported failures.

## 2026-10-14 focused follow-up — Chapter conclusion & Chronicle on phone (PR #72)

**Trigger:** owner reported PASS for the prior Notebook/Continue/hint repair and requested the next focused step. The previously accepted E02 81-line dialogue, C01 trio, route/mystery canon, and E01 release remain locked.

**Pre-fix UI issue:** Chronicle shared the screen with the full-size Riverside `world-frame` and the full Chronicle card was appended below it. On a ~568×320 iPhone CSS viewport this pushed the Then/Now record and `Read the Chronicle`/Finish button below the visible area. Also, `navigation()` unmounted the Chronicle card whenever its narration queue was active, leaving an isolated, displaced dialogue pane.

**Scoped solution:**
- Chronicle is a dedicated evidence page: keep its two approved R1/R2 Then/Now photos, corresponding plain-English facts, safe-lookout note, and explicitly unlocked `MARKET LANE →` mark **inside the Chronicle card**. No panoramic game-scene duplicate and no early clue revelation.
- Keep Chronicle visible during all 10 canonical narration lines. Only its article pane scrolls if content exceeds the available height. A persistent minimum 44px action strip offers `Read the Chronicle` before reading and `Finish this chapter` only after the complete manually advanced queue.
- When speech is queued, keep 44px `Continue` and accessible manual Listen visible below the Chronicle. Hide the Read/Finish buttons during speech; keep the chapter record and images in place.
- The standard phone Parent View still replaces the child pane, not stacks below it; explicit Restart confirmation uses an accessible screen-centered modal and Cancel leaves the chapter complete.
- On smaller 568×320 landscape, article scrolling is expected. On larger 667×375, article may fit entirely and **should not be forced to scroll**. Portrait remains a scrollable fallback.
- No change to story, evidence linking, station graph, `chronicleSeen` completion semantics, save schema, or E01 assets. `episode_completed:s01e02` remains a one-time event behind original Market clue + full Chronicle reading + explicit Finish. E03 is not implemented or unlocked by this UI layer.

**Validation:** E02 browser test now drives real touchscreen actions through Notebook → qualified revision → safe Market mark → Chronicle → 10 narrated lines → Finish and one-time ledger event → reload → Chronicle review → Restart Cancel at 568×320. Separately restores a legitimate Chronicle checkpoint in a new 667×375 mobile context and completes. Checks original image decoding, on-screen CTA/Continue, parent swap and no horizontal/global page overflow. Engine unit test checks premature Finish rejection, mid-Chronicle reload and idempotency. Automated CI and deploy gate required; **owner iPhone / Home Screen visual PASS still OPEN**.

**Test fixture note:** when seeding a stored Chronicle state in a second Playwright browser context, use a pre-load init script rather than writing localStorage into an already running Preview page immediately before reload; the earlier page can save Preview on visibilitychange during navigation. This was a test setup problem, not an established defect in ordinary in-app checkpoint saves.

### Accepted GitHub engineering/production gates (2026-10-14)

[PR #72](https://github.com/edisontw/wondervale/pull/72) merged to code SHA `5308cdddad647722fb5c228a4a2c5d4035939400`, E02 build `20261014-e02-chronicle-phone4`.

- [E02 main browser and engine acceptance #38551725622](https://github.com/edisontw/wondervale/actions/runs/38551725622): **PASS**. Includes actual touch path at 568×320, 667×375; preserved approved images; Chronicle with original dialogue and action row; explicit completion, save/reload, Parent View, review, Cancel, and E01 prerequisite.
- [E01 main runtime regression #38551725709](https://github.com/edisontw/wondervale/actions/runs/38551725709): **PASS**; no E01 code changes.
- [MN4 E02 continuous preview deployment #38551725654](https://github.com/edisontw/wondervale/actions/runs/38551725654): **PASS** including production SSH deploy. Remote transcript explicitly reports **E01 byte-identical, E02 archive byte-verified** and E02 deployed from the above code SHA.
- **Locked in engineering:** Chronicle screen-first layout; no river scene stacked above the book; internal scroll only if needed; pinned Read/Finish actions; narration text remains accessible; no automatic completion; no E03 early unlock. R0/R1/R2 and all 81 canonical lines unchanged.
- **OPEN:** owner physical iPhone Chrome / Home Screen Chronicle and completion acceptance, recorded voice, full parent/family trial, and separate E03 kickoff. Do not mark E02-wide physical QA PASS from Chromium evidence.

## 2026-10-14 — Owner request: Start E02 again must delete Chapter 2 history

**Owner direction:** choosing `Start E02 again` should erase Chapter 2's saved records, not just return to the opening screen. This is a user-controlled *destructive restart*, distinct from replay/viewing the permanent Chronicle.

**E02-only implementation, build `20261014-e02-reset-clean5`:**
- `Start E02 again` opens an explicit confirmation explaining that **all Episode 02 saved progress, clue observations, Chronicle reading and episode completion on this device will be lost**; Episode 01 completion remains intact. Cancel leaves the entire E02 state untouched.
- Confirm deletes only `wondervale-s01e02-progress-v1` in localStorage and checks that the key is actually absent. If the browser denies deletion or the key remains, keep the completed state and display a visible `role=alert` error (no false success).
- After successful deletion restore `fresh()` in memory, clearing the complete E02 ledger, observations, current station, evidence/revision/Market flags, Chronicle/completion flags, played-line history, dialogue queue, and UI review/parent/map state. Cancel speech and remove any stale alerts.
- During the new pristine preview, `save()` is deliberately a no-op, including on `visibilitychange`: backgrounding/reloading must not silently recreate a deleted E02 saved record. Pressing `Begin Riverside adventure` resumes ordinary checkpoint persistence and replays all 13 opening lines.
- Preserve the entire `wondervale-progress-v1` E01 save without mutation. Reset must not open/repair the closed crossing or unlock E03.
- E02 browser regression must confirm cancel safety, simulated denied-storage warning, successful key deletion, absence of leftover E02-prefixed keys, full reload still preview with no E02 record, replay from original first line with zero E02 events, and E01 ledger byte-for-byte equality. Unit test validates all `fresh()` milestones. Physical iPhone owner PASS remains OPEN until tested.

**Scope:** restart storage/UX only. Do not alter the E02 canonical 81 lines, approved art, map/route, safety/reasoning/completion gates or E01 code.

### Engineering and MN4 production verification — 2026-10-14

[PR #73](https://github.com/edisontw/wondervale/pull/73) merged to source `45f5eeb65880e5e21bfeb3d7f83b86b4e40f8522`, build `20261014-e02-reset-clean5`.

- [E02 acceptance #38554287079](https://github.com/edisontw/wondervale/actions/runs/38554287079) **PASS**: browser test exercised Cancel, simulated storage-denied deletion, confirmed E02 localStorage key removal, reload without key recreation, complete first-line replay and E01 unchanged. Engine test checks all `fresh()` episode milestones cleared.
- [E01 regression #38554287200](https://github.com/edisontw/wondervale/actions/runs/38554287200) **PASS**.
- [MN4 deployment #38554287091](https://github.com/edisontw/wondervale/actions/runs/38554287091) **PASS**: confirmed deployed from this main commit, E02 artifact byte-verified and E01 release byte-identical.
- **Engineering/deployment gate CLOSED. Actual owner's iPhone confirmation for destructive restart still OPEN.** Do not confuse the user's original requirement with a reported PASS.

## 2026-10-14 — E02 interrupted checkpoint integrity regression (focused engineering QA)

**Starting point:** `main` `9d195c79f8f1fc58ef25b0c25b8d5d730168d25f`, following [PR #73](https://github.com/edisontw/wondervale/pull/73) production deployment. Owner's actual iPhone PASS for destructive restart **remains open**; no invented acceptance.

**Issue detected in static audit:** `restore()` already filters unknown ledger and observation IDs, but previously merged arbitrary stored `phase`, `market`, `revised`, `chronicleSeen` and `view` fields without ensuring they agree with canonical events. A damaged browser checkpoint could therefore show `Chapter complete` or prematurely reveal the Market Lane clue without the corresponding E02 ledger history.

**Repair, E02-only `20261014-e02-checkpoint-guard6`:** reject inconsistent checkpoint state to the safe fresh E02 preview. Verify recognized phase/camera, boolean flag types, a coherent event/phase chain (lookout → inspected facts → linked evidence → revision → Market mark → Chronicle read → explicit Finish), and only valid close-up camera/standing-station pairings. Retain genuine pending dialogue, the intended `after` transition, observations, E02 events and position for valid checkpoints; do not regenerate scene art or alter narration or E01. This is integrity validation, not a new game rule, route, reward or E03 unlock.

**Focused automated regression:** unit tests cover 25+ real sequential checkpoints from preview/opening through old-stones/gap, both supported recovery prompts, revision, Market mark, mid-Chronicle and completion. Explicit corrupted snapshots must never fabricate completion/Market progress or invalid camera locations. Browser test actually reloads a phone while Notebook intro, evidence-to-revision and Chronicle queues are pending, checking exact pending line order and unchanged events, then finishes and uses the already accepted E02 clean restart. E01 and static release byte-isolation must remain PASS.

**Acceptance still open:** real mobile Safari/Chrome/Home Screen interrupted-session checks, owner reset and Chronicle acceptance, actual child/parent family trial, recorded audio and E03 authoring.

### Engineering CI and deployed verification — 2026-10-14, PR #74

[PR #74](https://github.com/edisontw/wondervale/pull/74) was squash-merged to code `e2104358f127874e130850a1eb4547fb0cdda220`, build `20261014-e02-checkpoint-guard6`.

- [E02 engine + real-browser acceptance #38556405604](https://github.com/edisontw/wondervale/actions/runs/38556405604): **PASS**; includes 25+ valid snapshots, fake-completion corruption rejection, exact saved speech order after phone reload during Notebook, evidence-link/Revision, and Chronicle, plus end-to-end completion and reset.
- [E01 independent runtime regression #38556405598](https://github.com/edisontw/wondervale/actions/runs/38556405598): **PASS**.
- [MN4 E02 deployment #38556405611](https://github.com/edisontw/wondervale/actions/runs/38556405611): **PASS** including production deploy. Remote logs explicitly confirm `Verified E02 archive: 9 runtime files`, frozen E01 `20261014-e01-map-choice-compact1`, `PASS: E01 byte-identical; E02 artifact byte-verified`, and deployed matching code SHA.

**Locked engineering:** validated E02 checkpoint consistency, lossless restoration of well-formed mid-dialogue progress, stable safe scene/reasoning gates, approved R0/R1/R2 art and 81 unchanged E02 lines, E01 untouched.

**Still OPEN (human acceptance):** actual-owner iPhone/WebKit re-entry and clean Start Again behavior, full E02 Chronicle conclusion, parent/child family test, prerecorded narration/audio quality and Episode 03 authoring. This automatic test PASS is not an owner physical-device acceptance report.

**Next focused task:** owner checks on the real phone that an interrupted Notebook/Chronicle resumes at the same line and that confirmed Start E02 again remains clear after reload, before proceeding to the final E02 acceptance checklist.
