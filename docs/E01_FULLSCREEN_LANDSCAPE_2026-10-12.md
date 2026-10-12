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
