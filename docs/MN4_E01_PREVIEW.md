# MN4 E01 preview release

Status: deployed and operationally verified on MN4 host (2026-10-08).

## Deployment record

- Verified commit SHA: `4e6d1917d54065700de26fce3500c83d7f87b8ca`
- Build ID: `20261008-e01-slice4`
- Deployment layout: `/srv/wondervale/releases/<commit-sha>/` with atomic symlink `/srv/wondervale/current`
- Serving: Nginx static hosting, dedicated isolated document root, autoindex disabled, web server read-only permissions (`0755` dirs, `0644` files)
- Dedicated hostname: `wondervale.pepepow.net`
- HTTP & HTTPS status:
  - Local Nginx virtual host active on HTTP (port 80) and HTTPS (port 443 with HTTP/2).
  - Cache revalidation configured for `index.html` and `sw.js` (`no-cache, must-revalidate`).
  - Cache-Control `public, max-age=31536000, immutable` for static runtime assets (`/app/`, `/public/`, `/engine/`).
  - MIME types mapped: `.html`, `.css`, `.mjs`, `.js`, `.json`, `.svg`, `.webp`.
  - Service-Worker header: `Service-Worker-Allowed: /`.
  - Let's Encrypt public cert blocker: registrar DNS A record for `wondervale.pepepow.net` must point to MN4; once DNS propagates, activate valid production SSL with:
    `sudo certbot --nginx -d wondervale.pepepow.net`

## Build and verify

From repository root:
```bash
npm run build
python3 scripts/verify_production_assets.py
npm test
python3 scripts/package_static.py
```

Serve only `dist/wondervale-e01-static` from the isolated document root. The folder contains 12 runtime files plus `RELEASE_INTEGRITY.json`; no private foundation or future episode sources. Check every extracted file's SHA-256 against `RELEASE_INTEGRITY.json` before transfer.

## Acceptance test evidence (MN4 local execution)

- **Engine tests**: 22/22 unit test groups passed (`npm test`).
- **Browser acceptance**: 46/46 Chromium test records passed against the actual deployed Nginx release with `errors: []`.
- **Integrity**: all 12 packaged runtime files match byte counts and SHA-256 in `RELEASE_INTEGRITY.json`.
- **Infrastructure checks**: HTTP 200 on `index.html`, `sw.js`, and all static art/JSON assets; 403 on directory indexes and hidden files; 404 on missing assets.
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
   sudo rm /etc/nginx/sites-enabled/wondervale.pepepow.net
   sudo systemctl reload nginx
   ```

## Remaining production and human acceptance work

- Public DNS record creation for `wondervale.pepepow.net` at the domain registrar, followed by `sudo certbot --nginx -d wondervale.pepepow.net`.
- UX-11: observe a fresh child-led playthrough, record active play duration and pauses, assess the 14–18 minute target without forcing it.
- UX-12: observe what the child notices before guessing and how they use map shapes to choose a real place.
- Final recorded voices, music/SFX, and richer actor poses remain separate acceptance work.

