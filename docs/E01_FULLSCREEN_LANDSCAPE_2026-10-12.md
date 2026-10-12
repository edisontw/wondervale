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
