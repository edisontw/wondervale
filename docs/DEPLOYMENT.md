# Deployment Baseline

## Continuous preview deployment (E02)

The GitHub Actions automation that packages and deploys the isolated E02 preview alongside the accepted E01 site is specified in [MN4 automatic deployment](MN4_AUTO_DEPLOY.md). It is **opt-in**: deployment stays disabled until a dedicated SSH key, a pinned MN4 host key, and the repository variable `MN4_DEPLOY_ENABLED=true` are configured by the operator. A build or CI PASS is not a deployed-site PASS. The E01 baseline is frozen byte-for-byte during E02 deployments, with immutable releases and automatic HTTPS-smoke rollback.

## Initial hosting

Wondervale will initially run on the existing **MN4** host while usage is low.

MN4 already hosts unrelated services, so Wondervale should be deployed with minimal assumptions about the machine and no dependency on another MN4 application.

Do not place host IP addresses, credentials, API keys, or unrelated service details in this repository.

## Static-first deployment

The MVP should prefer a static production build served by the existing reverse proxy/web server.

Benefits:

- no dedicated Wondervale Node process required for basic play;
- small operational footprint on a shared host;
- fewer failure modes;
- easy migration to another host/CDN later;
- content and runtime remain tied to the Git build rather than server-local state.

If the selected framework requires a server for a future feature, add it only when that feature is intentionally introduced.

## Deployment principles

- isolated site/document root;
- hostname-based reverse proxy/web serving;
- HTTPS;
- atomic/reversible deployments where practical;
- health/static availability check;
- logs separated from unrelated services;
- no dependency on another MN4 application;
- straightforward backup/export path;
- no irreplaceable application state stored only on MN4.

## Migration requirement

The application should be movable to a dedicated host or CDN later without changing content architecture.

Avoid:

- hard-coded hostnames or IP addresses;
- local filesystem paths embedded in content;
- coupling to another MN4 service database;
- server-only progression state in the early product.

## Early-stage state

Content belongs in Git/build artifacts.

Child/family progress should remain local and versioned until cloud synchronization is intentionally introduced.

## Logging/privacy

Before public launch, review reverse-proxy/web-server logging:

- what identifiers are recorded;
- how long logs are retained;
- who can access them;
- whether third-party scripts add additional collection.

Do not add third-party behavioral analytics by default.

## Public launch checklist

Before announcing a public URL:

- production build passes;
- content validation/lint passes;
- HTTPS works;
- static availability/health check works;
- mobile/touch layout is usable;
- keyboard/accessibility baseline works;
- no debug UI is exposed;
- no secrets are bundled client-side;
- privacy information exists for adults;
- parent-facing explanation is present;
- at least one complete validated playable episode is available.

## E01 landscape/fullscreen baseline promotion (2026-10-12)

The one-time verified refresh of the E01 baseline is **deployed** from source `de8ab925ff99a8af41fd454e7a534f7f1cf840a8`: [Actions run #38271380184](https://github.com/edisontw/wondervale/actions/runs/38271380184) has both verification and remote deployment PASS. Build `20261012-e01-landscape-fullscreen1` replaced the earlier accepted E01 at the same root URL while preserving the live E02 under `/e02/` and the origin-scoped E01 unlock contract. Immutable composite release, hash readback, atomic symlink update, `/srv/wondervale/e01-baseline` promotion, and E01/E02 local HTTPS compare completed. E02's separate [run #38271380228](https://github.com/edisontw/wondervale/actions/runs/38271380228) PASS preceded the E01 promotion. This is a deployment PASS, **not** owner/device/family visual PASS.

The deployed automation lives at `.github/workflows/wondervale-mn4-e01-refresh.yml` and `scripts/mn4/deploy_e01.sh`. Two pre-success failures (Nginx 403 from 0700 root, and temp symlink `$`/`$$` mismatch) are recorded in [E01 release incident notes](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md). For future E02-only deployments the protected E01 baseline is now the refreshed version; do not silently revert to the old 2026-10-10 bytes.

## E01 Riverside continuation + mobile fullscreen release (2026-10-13, current)

[GitHub Actions run #38275829155](https://github.com/edisontw/wondervale/actions/runs/38275829155) PASS promoted E01 build `20261012-e01-handoff-fullscreen2` from code main `74e3edd9522ce1f6bac6d3e3513129a13a0786ea`, including the prominent Chronicle-to-E02 continuation, native fullscreen capability fallback, an immutable composite release, E02 byte verification, HTTPS checks, and an updated E01 baseline. [E01 real Chromium #38275829092](https://github.com/edisontw/wondervale/actions/runs/38275829092) and [E02 deploy/QA #38275829153](https://github.com/edisontw/wondervale/actions/runs/38275829153) PASS. An initially failed E01 deployment from PR #60 could not pass an obsolete hardcoded build-name assertion; fixed in PR #61 before successful release, without weakening integrity checks. Browser/device Chrome real-user retest and family UX remain separate from CI and remote deployment PASS. See [E01 UI release notes](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).
