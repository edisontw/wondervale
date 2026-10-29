# E11 isolated shared-space and current-loop authoring engine — QA

**2026-10-29 | Engineering authoring only; NONCANONICAL.** This reducer implements E11's fictional 3×4 paper board, reversible quiet/activity/access pieces, child-directed adjacent Milo movement, separate quiet-reader and activity-group trials, before/after snapshots, comparison, synthetic earlier-discovery citation and an independent closed-loop checker. It does not assert actual accessible widths, slopes, drainage, rights, history, resident testimony or continuous town pavement.

## Deterministic model
- Entry (1,0), exit (1,3), boundary (0,3)/(2,3). A proposed access strip occupies (1,1) and (1,2). Quiet and activity each occupy one cell. A piece can overlap the proposed access strip as an intentionally **failed layout**, making the route obstruction visible during simulation; overlapping the two need pieces themselves is rejected.
- Both distinct user scenarios must be tested on the same revision before a trial snapshot. Moving or lifting a piece invalidates stale tests, comparison and review. A later passing trial with a genuinely different layout may be compared to the earlier trial; the remaining limitation is always retained.
- Fictional town role-node links are whitelisted, not permissions. A model loop requires Common, three or more nodes, every degree two and full connectivity. Old/closed North Hill and unknown edges cannot be selected.
- The exact typed command ledger is limited to 160 entries. Restore recomputes the entire snapshot. No arbitrary passed flag, rights, dates, sources, unlock or completion may be injected. Synthetic earlier-discovery labels do not establish canonical E10 handoff.
- No localStorage, network, E01–E10 source, production package, canonical Chronicle, Common opening, approved art or MN4 deployment is touched.

## Verification
Run:
    node --check engine/s01e11-authoring-prototype.mjs
    node --check tests/s01e11-authoring-prototype.test.mjs
    node --test tests/s01e11-authoring-prototype.test.mjs

The dedicated E11 Actions job runs 24 isolated Node cases and checks production-package exclusion. Browser Chromium, real-device/family, E10 source/entry, owner design Gate, production Chronicle, remote MN4 HTTPS/deploy/rollback remain NOT RUN until evidenced.

**Next unique task:** create a clearly labeled E11 browser authoring lab with child-controlled layout, dual scenario retry, before/after comparison and safe model loop, then desktop/mobile/keyboard Chromium tests. Never convert paper-model results into production E11 unlock.
