# E01 fullscreen / landscape presentation revision — 2026-10-12

**Baseline:** GitHub main `0b49f7fbed1643e4894f149b0edb4bafa85308de`. Owner explicitly reopened E01 after E02 went live.

## Locked UI decisions

1. Parent View (desktop sidebar and phone toggle) is removed. The existing non-spoiling parent preview, cue, follow-up, fallback, and reflection all appear on the **chapter opening**, before Begin. This briefing can scroll within short screens; its Begin control remains available. The required 121 script lines and mandatory introduction are unchanged.
2. Phone landscape is first-class: put Town Square and the bottom RPG portrait/text/actions in **separate adjacent panels** on short landscape coarse-pointer screens. Preserve original 1672:941 aspect ratio, world coordinates, labels, target accessibility and manual Listen. Phone portrait remains a fallback. Do not force physical rotation.
3. Full-window desktop/mobile: keep one bounded `100dvh` app; no parent sidebar or decorative footer. Let internal map, plate and Chronicle scroll when content genuinely exceeds a short viewport. Optional **Full screen** uses the browser API, falling back gracefully if unsupported.
4. **Options** holds audio, motion, motor assistance and confirmation-gated local reset. Child-driven story content is not hidden there.
5. No changes to C01 assets, mystery/spoilers, approved world geometry, scratch/reveal, EFL, ledger/state, E02 unlock or E02 code.

## Verification

Automated: episode compiler, 121 exact lines, engine/save/Chronicle, opening notes, no Parent View, portrait and landscape mobile caption/hotspot geometry, map, keyboard, rubbing, full-screen fallback and reset. Human acceptance pending: real Android Chrome/iOS Safari landscape/portrait, smaller heights, system browser chrome, labels/text/action reachability and optional Fullscreen support.

## Deployment gate

**GitHub branch/CI PASS does not update MN4.** Existing E02 auto-deploy reconstructs the composite public site from `/srv/wondervale/e01-baseline`, intentionally frozen at the previously accepted E01. A separate, explicit immutable E01 baseline promotion must preserve E02 files and same-origin progress, verify package integrity and HTTPS, and roll back on failure. Never silently replace baseline as a side effect of E02 deploy. Do not report this revision live until actual deployment PASS.

## Live deployment acceptance — 2026-10-12 23:39 Asia/Taipei

**DEPLOYED / automated gates PASS:** E01 build `20261012-e01-landscape-fullscreen1` and the already-live E02 both passed MN4's release integrity and same-host HTTPS smoke gates. Source commit deployed: `de8ab925ff99a8af41fd454e7a534f7f1cf840a8`. [GitHub Actions E01 run #38271380184](https://github.com/edisontw/wondervale/actions/runs/38271380184): `verify-and-package-e01=success`, `deploy-e01-with-e02-preserved=success`. Its remote log states `PASS E01 package and live E02 byte verification` and `DEPLOYED E01 build ...; E02 preserved`. The deploy script compares live E01 index/app/episode JSON and E02 index/app/episode JSON with release bytes over HTTPS, and then updates the pinned E01 baseline used by future E02 composite releases.

Separate gates: [E01 full browser suite #38271380189](https://github.com/edisontw/wondervale/actions/runs/38271380189) PASS; [E02 CI and remote deployment #38271380228](https://github.com/edisontw/wondervale/actions/runs/38271380228) PASS. **Not claimed:** real Android/iPhone interaction, family learning, final audio, subjective crop/legibility or owner visual acceptance.

### Incidents encountered and prevention

- E01 first release attempt [#38267717345](https://github.com/edisontw/wondervale/actions/runs/38267717345) passed E01 + E02 manifest checks but returned HTTPS 403. Root cause: `mktemp` private directory mode (0700) was inherited by the deployed immutable release; Nginx lacked traverse permission. Fix: `chmod 0755` on new E01 base and composite release directories before serving. Automatic symlink rollback occurred.
- E01 second release [#38268287850](https://github.com/edisontw/wondervale/actions/runs/38268287850) failed before switch with `mv: cannot stat .current-e01-next...`. Root cause: symbolic-link creation used a trailing literal `$` whereas promotion used `$$` (shell PID), producing two different filenames. Fix: assign one `current_next` path and reuse it for `ln -s` and `mv -Tf`; commit `de8ab925ff99a8af41fd454e7a534f7f1cf840a8`.
- Do not weaken E01/E02 artifact hash checks, strict tar allowlists, pinned SSH host key, one shared MN4 deploy concurrency group, explicit baseline promotion, live HTTPS checks or rollback.
- A successful pipeline is not a real-device UI PASS; screen orientation, browser chrome, accessibility and full-screen behavior still require owner QA.

### Next owner acceptance

Open [E01](https://wondervale.pepepow.net/) in desktop full-window/full-screen and Android/iOS phone **landscape**, with portrait as fallback. Verify chapter briefing contains all parent prompts before Begin, no Parent View afterwards, complete Square with all four names, reachable RPG dialogue/Listen/map/navigation/old-post controls, no unwanted scrolling or crop, proper save/reload and same-origin [E02](https://wondervale.pepepow.net/e02/) unlock. Verify Full screen works on supported browsers or fails non-disruptively. Any physical/device findings can reopen **UI only** without redefining story, EFL, identity, or state contracts.

## Field QA follow-up — 2026-10-12 (owner)

- **Desktop visual display:** owner reports OK for the fullscreen/landscape revision. This is an owner desktop UI observation, not the remaining phone/family PASS.
- **Phone Chrome:** owner saw the “Full screen is unavailable in this browser” message. Native page fullscreen is not uniformly permitted by mobile browsers and embedded browser environments. The E01 top-bar Full screen toggle is now exposed only when `document.fullscreenEnabled` and `requestFullscreen` indicate support; a rejected request removes that control for the current session with no persistent warning. The `100dvh` responsive landscape/portrait viewport remains usable without fullscreen API. This does **not** promise to hide browser address/system bars when the mobile browser forbids it.
- **E01 → E02:** previously the completed Chronicle ended with *Visit Town Square* and *Replay this memory* only, leaving the next chapter inaccessible from the narrative endpoint. A prominent **Riverside is next / Continue to Episode 2 · Riverside** action now appears **at the beginning of the completed Chronicle**, above the long map/memory; it links to relative same-origin `e02/`. It is absent before canonical E01 completion, and withheld when the completion save fails or while replaying a historical memory. E02 still checks its unchanged saved E01 event prerequisites, with no separate unlock flags or invented story dialogue.
- New regression scope: native fullscreen active/unsupported/rejected; phone 390×844 portrait and 667×375 landscape link visibility; genuine completed E01 ledger satisfies E02 prerequisites; same-origin link click opens the E02 introduction without resetting the old ledger. Existing full E01 narrative, old post, C01 assets, persistence, E02 state/voice/visual code remain unmodified.
- **Pending verification:** CI branch acceptance and MN4 composite deployment, then owner mobile Chrome check of the CTA and no fullscreen warning. Actual system UI chrome removal on unsupported mobile browsers is still unavailable by design.

### E01 Riverside handoff deploy incident — 2026-10-12

PR #60 (`7a81706ab347589442fe792b3903d2554771677e`) passed E01, E02 and real Chromium browser acceptance. On main push, the remote E01 release [run #38275124175](https://github.com/edisontw/wondervale/actions/runs/38275124175) **FAILED before any active release switch**: the remote Python intake asserted that the manifest build ID started with the previous UI feature name `20261012-e01-landscape-fullscreen`. The new valid build ID `20261012-e01-handoff-fullscreen2` did not satisfy this overly narrow allowlist. This was a **release intake test failure**, not a media/hash mismatch or E02 regression; the current public release was not promoted.

Remedy: validate a bounded, date-stamped `YYYYMMDD-e01-...` release ID while still requiring the E01 manifest build to exactly match `public/episode.json` and separately verifying every E01/E02 file SHA-256, tar member allowlist, shared C01 sprite identity, HTTPS, atomic promotion and rollback. Do not again encode a particular UI feature name into deployment eligibility. The next successful deployment and its live SHA must be recorded separately.

## Live E01 → E02 handoff revision — deployment PASS (2026-10-13 00:16 Asia/Taipei)

- **Source GitHub main:** `74e3edd9522ce1f6bac6d3e3513129a13a0786ea`. **E01 build:** `20261012-e01-handoff-fullscreen2`.
- [MN4 E01 release run #38275829155](https://github.com/edisontw/wondervale/actions/runs/38275829155): `verify-and-package-e01=success`, `deploy-e01-with-e02-preserved=success`. SSH remote log confirms `PASS E01 package and live E02 byte verification`, `DEPLOYED E01 build from 74e3edd9522ce1f6bac6d3e3513129a13a0786ea; E02 preserved`, and `E01 and E02 HTTPS composite promoted`.
- [E01 full runtime browser CI #38275829092](https://github.com/edisontw/wondervale/actions/runs/38275829092) PASS; [E02 independent CI and MN4 deploy #38275829153](https://github.com/edisontw/wondervale/actions/runs/38275829153) PASS. Both E01/E02 HTTPS assets compared to release bytes on MN4; live E01 release promoted together with updated `/srv/wondervale/e01-baseline` for future E02-only release preservation.
- The earlier version-prefix refusal [run #38275124175](https://github.com/edisontw/wondervale/actions/runs/38275124175) is resolved by PR #61. No content, E02 runtime, C01 illustration, scratch-state/ledger or parental briefing changes were made for the fix.
- **LOCKED:** E01 completed Chronicle has a prominent same-origin Riverside E02 CTA and retains Town Square/replay; no earlier clue spoiler or prerequisite bypass. Fullscreen is offered only if supported and quietly disappears if native request is denied.
- **OPEN:** owner real-phone Chrome retest of CTA/landscape visual presentation and confirmation of no fullscreen error (including normal browser address-bar limits); real family UX, iOS and final voices/music remain separate acceptance gates. Remote automated HTTPS verification does **not** constitute independent external-browser/device PASS.

## iPhone Chrome source-of-error correction — 2026-10-13

The owner clarified the device is **iPhone Chrome**, and the previous failure appeared **after tapping Full screen**; it was not an error on initial page load. The former generic mobile classification was too broad. iPhone Chrome uses iOS WebKit and cannot reliably native-fullscreen a standard multi-element interactive scene through `Element.requestFullscreen()`. The previous capability-gating/hiding change prevented a failed action but did **not** satisfy the owner’s wish to remove browser chrome.

**Implementation (branch, pending CI/deploy):** iPhone browsers use an explicitly labeled **App view** helper (not a misleading Full screen button) that explains Chrome Share → Add to Home Screen → Add, and then opening the new icon. A root-scoped `manifest.webmanifest`, `apple-mobile-web-app-capable` metadata and existing service worker allow standalone launch across same-origin E01 and E02. The native fullscreen button stays for non-iPhone browsers that actually expose and accept the Fullscreen API. No script, C01, interactions, event ledger, state-save key or E02 source is changed. The release package, remote MN4 strict allowlist, offline cache and HTTPS smoke include the manifest. The popup explicitly warns that iOS Home Screen Web Apps may have storage separate from the original Chrome tab; do not promise automatic progression transfer or real physical iOS acceptance.

**Verification pending:** PR CI/browser, immutable E01 package and MN4 deployment; then owner iPhone Chrome share/install, actual standalone bar reduction and persistence check. Do not claim iOS 100% edge-to-edge/system status-bar removal or Android-like native `requestFullscreen()` support.

## iPhone Chrome App view release — deployment PASS (2026-10-13 01:06 Asia/Taipei)

- **GitHub code SHA:** `af8b676785dd985a7ddf63dbce08ad850d0896d9`; **E01 build:** `20261013-e01-ios-appview1`. [PR #62](https://github.com/edisontw/wondervale/pull/62).
- Branch CI: [E01 E01 release #38281255412](https://github.com/edisontw/wondervale/actions/runs/38281255412) PASS; [E01 full browser #38281255514](https://github.com/edisontw/wondervale/actions/runs/38281255514) PASS; [E02 isolated browser #38281255439](https://github.com/edisontw/wondervale/actions/runs/38281255439) PASS.
- Main CI/deployment: [E01 immutable package + MN4 deploy #38281555894](https://github.com/edisontw/wondervale/actions/runs/38281555894) PASS; [E01 complete browser #38281555897](https://github.com/edisontw/wondervale/actions/runs/38281555897) PASS; [E02 independent CI/deploy #38281555791](https://github.com/edisontw/wondervale/actions/runs/38281555791) PASS.
- Remote deploy log: `PASS E01 package and live E02 byte verification`; `DEPLOYED E01 build from af8b676785dd985a7ddf63dbce08ad850d0896d9; E02 preserved`; `E01 and E02 HTTPS composite promoted at https://wondervale.pepepow.net/`. Strict checks now explicitly include `manifest.webmanifest`, its SHA-256, and HTTPS retrieval. E01 baseline updated for subsequent E02-only deployments.
- **Owner acceptance still OPEN:** actual iPhone Chrome Share → Add to Home Screen → launch icon; reduction of browser UI/status bar behavior, E01/E02 navigation and progress in isolated Home Screen app storage. Browser tests simulate an iPhone UA using Chromium; they do not exercise real iOS WebKit.
- **Locked:** honest iPhone **App view** helper and `standalone` installation metadata; non-iPhone native fullscreen remains; exact E01 EFL lines/C01 imagery/marker/save events and E02 deployed bytes unchanged. The site cannot force native Fullscreen API on iPhone and does not guarantee carryover from the original Chrome tab to an installed Web App.

## E01 mobile landscape bottom-dock revision — 2026-10-13 (CI/deployment pending)

**Owner physical-device report:** iPhone Chrome **Add to Home Screen App view PASS**. New issue: on short phone landscape screens the story caption and its buttons appear to the **right** of the scene, reducing the art area. Owner requests caption/buttons **under** the Town Square, minimal scrolling on ordinary story screens, slightly larger button text with smaller visible padding. This overrides the earlier E01 **landscape side-by-side** design only for live gameplay; chapter opening is a parent briefing, and scratch/Chronicle/map content may scroll if necessary.

**Implementation:** remove the split two-column dialogue on coarse-pointer short landscape. Place scene above a compact RPG portrait/text/action row; move four walking buttons into the scene-heading row to reclaim vertical space for canonical 1672:941 art. Keep 44px touch targets while reducing padding, raise 10–13px button labels to at least 14px, and restrict text-only scrolling to long dialogue. Portrait also receives small button legibility/padding tuning. Rich scratch content scrolls within its scene panel; preserve its controls. No E01 script, C01 art, world coordinates, save ledger or E02 changes.

**Browser acceptance:** simulated touch landscape 667×375, 844×390, 932×430 verifies caption below scene, whole-art aspect, normal document/panel not scrolled, reachable navigation/control targets with 44px hitboxes and 14px labels. Owner physical iPhone Chrome/App-view landscape QA remains OPEN pending deployment.

## E01 landscape bottom story dock — live release PASS (2026-10-13 12:30 Taipei)

- **Source main code:** `dcb951b1c56845304662b41f2ae50f18e925bfd1`; E01 build `20261013-e01-landscape-bottom1`; [PR #63](https://github.com/edisontw/wondervale/pull/63) merged after correcting an initial test-fixture mistake (the opening scene intentionally lacks navigation controls).
- Branch CI: [E01 complete browser #38346320038](https://github.com/edisontw/wondervale/actions/runs/38346320038) **PASS**, [E01 packaged release #38346319997](https://github.com/edisontw/wondervale/actions/runs/38346319997) **PASS**. This followed two earlier FAIL jobs on the branch, caused by testing an opening with no `.navigation` as if free-roam buttons existed; fixture corrected to genuine Fountain + Look closely dialogue and opening world-fit rules expanded. Do not rely on the failed attempts for acceptance.
- Main CI: [E01 complete browser #38346546498](https://github.com/edisontw/wondervale/actions/runs/38346546498) **PASS**. [E01 immutable package + MN4 release #38346546519](https://github.com/edisontw/wondervale/actions/runs/38346546519) **PASS** with remote log `PASS E01 package and live E02 byte verification`, `DEPLOYED E01 build from dcb951b1c56845304662b41f2ae50f18e925bfd1; E02 preserved` and `E01 and E02 HTTPS composite promoted`. Deployed at [E01](https://wondervale.pepepow.net/); E02 original files and same-origin progression preserved.
- **Locked UI behavior:** coarse-pointer short landscape screens put the Town Square **above** a compact bottom RPG dialogue/actions row. Four movement buttons share the heading row; 44px touch targets and larger 14–15px text; no normal whole-page scrolling; original 1672:941 scene aspect and character/hotspot identity kept. Exception: scratch/map/Chronicle/parent briefing may have contained scrolling. Responsive portrait button sizing also adjusted.
- **Owner actual iPhone acceptance OPEN** for new landscape layout (address-bar presence/standalone mode, full scene and character labels, all touch targets, overlong text, map, scratch, Chronicle and actual E01→E02 handoff). Automated Chromium emulation is not physical iOS WebKit acceptance.
