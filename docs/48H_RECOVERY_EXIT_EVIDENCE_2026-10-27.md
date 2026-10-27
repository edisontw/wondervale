# Wondervale 48h recovery — pre-exit evidence checkpoint

Captured: **2026-10-27 10:16 Asia/Taipei**. This is a **pre-final** evidence checkpoint, not Owner acceptance or a release authorization. GitHub `main` remains authoritative; re-fetch its SHA before final closure.

## Verified main / regression

- Inspected starting `main`: `408c553fa8e42a859f8078a3a9c2ebc425841426` (merge PR [#158](https://github.com/edisontw/wondervale/pull/158)).
- E03 actual cart-motion test / Node / Chromium: [merged-main Actions #40425374430](https://github.com/edisontw/wondervale/actions/runs/40425374430) **SUCCESS** at that exact SHA. Artifacts `e03-engineering-evidence` ID `12698824772` and `wondervale-e03-preview` ID `12698609734` present. This proves automated rendered motion/screen capture, **not** physical swept-turn clearance.
- E01 Node / Chromium: [merged-main Actions #40425374535](https://github.com/edisontw/wondervale/actions/runs/40425374535) **SUCCESS** at the same SHA; `wondervale-e01-static` ID `12699681280`, `e01-runtime-evidence` ID `12699304888` present.
- E04 technical authoring / handoff latest observed main workflow: [#40338116557](https://github.com/edisontw/wondervale/actions/runs/40338116557) **SUCCESS** at older SHA `e67978749304067d04581449820bfe928b25724d`. **Not a current-head E04 test, Owner Gate 1 approval, or E04 deployment.**

## Release / E03 gates — keep results separate

| Item | Evidence | Verdict |
| --- | --- | --- |
| #110 mandatory PR-head package | [MN4 workflow #40394088828](https://github.com/edisontw/wondervale/actions/runs/40394088828) verify-and-package SUCCESS; `wondervale-mn4-e02-e03-package` artifact ID `12686372572`, size 2,442,749 bytes, GitHub digest `sha256:ff417c6d60b7810ee9aa79832036b6a37a5c183fd533085f705c984643258c19`. Earlier hourly verification records actual download, CRC, release allowlist, E02 9/9 and E03 10/10 manifest checks. | **PR-head transfer/integrity PASS**; not a main release |
| #110 current-main deploy | The same PR run's `deploy-mn4` job was **SKIPPED**. No verified current-main SSH transfer, deployed build hash, live HTTPS smoke or actual rollback evidence. | **NOT RUN / blocked-external** |
| #108 S/N paths | [#108](https://github.com/edisontw/wondervale/issues/108) is **Owner-closed**, but raster/mask evidence does not prove S/N paved floor, physical entrances/exits or no-go/occlusion classification. | **Physical Gate 3 blocked-design**, despite issue state |
| #109 cart L route | [#109](https://github.com/edisontw/wondervale/issues/109) OPEN. PR #158 actual Chromium motion and 320×740 / 568×320 / 1366×900 screenshots pass; wheel/handle/yaw swept envelope against real paving and solid obstacles unverified. | **Physical Gate 3 blocked-design** |
| PR #107 guidance | [PR #107](https://github.com/edisontw/wondervale/pull/107) OPEN, head `f5f9b4f1cf57b7634ad0775ed91c82dc2274f535`. Exact-head [E01 #40394088411](https://github.com/edisontw/wondervale/actions/runs/40394088411), [E03 #40394088423](https://github.com/edisontw/wondervale/actions/runs/40394088423), [MN4 package #40394088828](https://github.com/edisontw/wondervale/actions/runs/40394088828) SUCCESS. | **CI PASS / not merged / not deployed / not owner-device accepted** |
| PR #114 E04 | [PR #114](https://github.com/edisontw/wondervale/pull/114) remains OPEN **draft**; evidence sources, historical cards and story require Owner Gate 1 approval. | **Owner-gated**; synthetic fixtures engineering-only, no E04 deploy |

**Release safety:** E01/E02/E03 accepted story/art/save remains protected. Do not infer that a closed issue is a passed acceptance gate. No Secrets/host-key/allowlist/rollback bypass; do not merge #114 or publish E04.

## Next focused action

At the final 48-hour checkpoint, re-fetch `main`, PR #107/#114, issue #109 and latest relevant Actions; explicitly distinguish shipped from PR-only work. If no new external evidence appears, retain #110 `blocked-external` and #108/#109 `blocked-design`. The next independent P0 requires **actual MN4 authorized deploy/HTTPS/rollback proof** or **Owner-supported scene geometry and cart physical clearance**, not more repeated artifact/centerline tests.
