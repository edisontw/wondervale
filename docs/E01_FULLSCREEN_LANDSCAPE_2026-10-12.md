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
