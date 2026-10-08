# MN4 E01 preview release

Status: MN4 HTTPS preview live. Most recent **reported** deployed release: `22f611493187d8a5117a3b40b70ea1fb3aecf83c` (`20261008-e01-reset1`), 2026-10-08. Original release evidence retained below.

## Deployment record

- Verified commit SHA: `4e6d1917d54065700de26fce3500c83d7f87b8ca`
- Build ID: `20261008-e01-slice4`
- Content version: `s01e01-script-v1`
- Deployment layout: `/srv/wondervale/releases/<commit-sha>/` with atomic symlink `/srv/wondervale/current`
- Serving: Nginx static hosting, dedicated isolated document root, autoindex disabled, web server read-only permissions (`0755` dirs, `0644` files)
- Dedicated hostname: `wondervale.pepepow.net`
- Public URL: `https://wondervale.pepepow.net/`
- HTTP & HTTPS status:
  - HTTP port 80: 301 redirects to HTTPS while preserving `^~ /.well-known/acme-challenge/` for ACME validation.
  - HTTPS port 443 (HTTP/2): Valid Let's Encrypt certificate active (ISRG Root X1 trusted chain).
  - Loopback port 127.0.0.1:4173: Nginx direct static serving for local test runners without external dependency.
  - Cache revalidation policy: `index.html`, `sw.js`, and unversioned JavaScript (`app/main.mjs`, `engine/episode.mjs`), CSS (`app/style.css`), and JSON (`public/episode.json`) are served with `Cache-Control: no-cache, must-revalidate` to ensure immediate propagation of updates across deployments.
  - Static art caching: `public/art/` served with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
  - MIME types mapped: `.html`, `.css`, `.mjs`, `.js`, `.json`, `.svg`, `.webp`.
  - Service-Worker header: `Service-Worker-Allowed: /`.

## Build and verify

From repository root:
```bash
npm run build
python3 scripts/verify_production_assets.py
npm test
python3 scripts/package_static.py
```

Serve only `dist/wondervale-e01-static` from the isolated document root. The folder contains 12 runtime files plus `RELEASE_INTEGRITY.json`; no private foundation or future episode sources. Check every extracted file's SHA-256 against `RELEASE_INTEGRITY.json` before transfer.

## Acceptance test evidence (MN4 execution)

- **Engine tests**: 22/22 unit test groups passed (`npm test`).
- **Browser acceptance**: 46/46 Chromium test records passed against the live `https://wondervale.pepepow.net/` deployment with `errors: []`.
- **Integrity**: all 12 packaged runtime files match byte counts and SHA-256 in `RELEASE_INTEGRITY.json`.
- **Infrastructure checks**: HTTP 200 on `index.html`, `sw.js`, and all static art/JSON assets; 403 on directory indexes and hidden files; 404 on missing assets. HTTP requests 301 redirect to HTTPS.
- **Gameplay checks**: controllable Square entered, Milo/Nia/Finn visible, noticeboard/map interaction works, landmark comparison works, plate cleaning reveal works, `RIVERSIDE →` appears only upon reveal, Chronicle records completion, refresh retains progress, historical replay preserves ledger, mobile touch controls pass, and offline reload succeeds after installation.
- **Existing services**: HearLens and OpenClaw services on MN4 verified healthy and untouched.

## Rollback procedure

To roll back to a previous release:
1. Re-point the atomic symlink:
   ```bash
   sudo ln -sfn /srv/wondervale/releases/<previous-sha> /srv/wondervale/current
   sudo systemctl reload nginx
   ```
2. To take down the preview site safely without affecting other services:
   ```bash
   sudo rm -f /etc/nginx/sites-enabled/wondervale.pepepow.net
   sudo systemctl reload nginx
   ```

## Remaining production and human acceptance work

- UX-11: observe a fresh child-led playthrough, record active play duration and pauses, assess the 14–18 minute target without forcing it.
- UX-12: observe what the child notices before guessing and how they use map shapes to choose a real place.
- Actual physical iPhone (Safari) and Android (Chrome) device validation.
- Final recorded voices, music/SFX, and richer actor poses remain separate acceptance work.

## 2026-10-08 field-QA and reset1 deployment update

Following the owner's first live playtest, E01 field fixes were merged through [PR #20](https://github.com/edisontw/wondervale/pull/20): the map-symbol inset now renders instead of printing literal `\${mapArt()}`, explicit read-again after reload does not require autoplay audio, and Milo's free travel is constrained to a road-route network. The user accepted the visual quality of the existing approved art. Road alignment/foreground occlusion still needs visual assessment on physical devices.

A further return-session problem was reproduced: page refresh shows **Story so far** because the device-local `wondervale-progress-v1` checkpoint persists; at that point there had been no ordinary UI control to erase it. [PR #21](https://github.com/edisontw/wondervale/pull/21) implemented **Start new adventure** in the recap, Pause, and Parent View (including mobile) with explicit confirmation and storage-failure handling. See [E01 Runtime Implementation](E01_RUNTIME_IMPLEMENTATION.md) for reset contract. This is a deliberate reset, **not** a change to the normal restore-on-refresh behavior.

### MN4 Codex deployment report (2026-10-08)

This section transcribes the operator-supplied MN4 deployment results. The assistant verified that the deployed SHA is a real current GitHub `main` commit but did not independently reproduce the external browser/network tests.

- GitHub `main` / reported deployed SHA: `22f611493187d8a5117a3b40b70ea1fb3aecf83c`.
- Content/build identifier: `20261008-e01-reset1`.
- Published release: `/srv/wondervale/releases/22f611493187d8a5117a3b40b70ea1fb3aecf83c`; `/srv/wondervale/current` changed atomically to this directory, retaining the prior release for rollback.
- Build: `npm run build` compiled the canonical 121 voice-text records; seven original/derived asset checks passed; static package contains 12 checked runtime files with byte-count and SHA-256 matching `RELEASE_INTEGRITY.json`.
- Tests: `npm test` **24/24 PASS**; actual Chromium browser acceptance against `https://wondervale.pepepow.net/` **52/52 PASS** with `errors: []`, per MN4 report.
- Explicit reset regression tests: `RESET-01` cancel preserves original checkpoint; `RESET-02` confirm clears local progress and subsequent refresh stays fresh; `RESET-03` mobile Parent View removes completed progress/unlocks; `RESET-04` denied storage removal preserves previous saved progress and reports the error.
- HTTPS endpoint `public/episode.json` reportedly served build `20261008-e01-reset1`. HearLens, OpenClaw and LINE services were checked healthy by the deploying operator.
- Owner subsequently indicated the Let's Encrypt certificate problem has been resolved.

### Unclosed physical / learning acceptance

- Owner must verify that the **public-origin** browser displays the new **Start new adventure** control, then perform confirm → Begin → refresh without a recap. A service-worker cache or browser state can still differ from an automated fresh test session.
- Check whether every character's feet align with the *painted road* and foreground occlusion is natural at desktop/mobile widths; mathematical road-network tests are not visual-art approval.
- Real iPhone Safari, Android Chrome and family learning cases UX-11/UX-12 remain pending. Voice recordings, music/SFX and richer actor animation are not accepted by these regression tests.
