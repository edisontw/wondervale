# MN4 automatic E02 preview deployment (GitHub Actions)

Status: **ACTIVE — first MN4 E02 deployment PASS on 2026-10-12** (GitHub Actions [run #38256457984](https://github.com/edisontw/wondervale/actions/runs/38256457984), source `main` `69ede242e1a2125a43e412016bef2772832389f3`). Both `verify-and-package` and `deploy-mn4` succeeded. Remote logs confirm byte-verified E02, frozen E01 byte identity and local HTTPS smoke checks. This is **not** owner/gameplay/physical-device/family acceptance; real-browser owner review remains open.

## Purpose and safety boundary

When a commit touching E02 runtime/media/packaging lands on GitHub `main`, `.github/workflows/wondervale-mn4-auto-deploy.yml`:

1. Verifies source and derived image integrity.
2. Recompiles and unit-tests E01, verifies its release package, and tests E02 state/route.
3. Tests the real E02 experience in headless Chromium desktop and 320/360/390/430 responsive modes.
4. Packages **E02 files only**, leaving E01 build and state untouched.
5. If explicitly enabled, sends the archive over pinned-host-key SSH to MN4.
6. Extracts with a strict allowlist, verifies every transferred byte, verifies the frozen E01 baseline and prepares a new **immutable composite release**.
7. Atomically switches `/srv/wondervale/current`, checks the local HTTPS virtual host for E01 byte identity and E02 entry/data/script/art availability, and **rolls back the symlink** if any check fails.

Public paths: `https://wondervale.pepepow.net/` (frozen E01) and `https://wondervale.pepepow.net/e02/` (E02). A single hostname is intentional: browser localStorage for genuine E01 prerequisites is origin-scoped. E02 does not auto-unlock without real E01 completion.

A successful deployment does **not** prove human screen/device/learning acceptance, nor make E02 recorded-voice ready.

**E01 freeze is strong:** the first activation captures the *currently installed E01-only* release as a permanent `e01-baseline`. Every E02 release copies that verified baseline and overlays a strict E02 allowlist. It validates that all E01 manifest files remain byte-identical. Do not silently replace `e01-baseline`; an explicitly accepted E01 release change requires a separate, documented baseline-update task.

## First live deployment evidence (2026-10-12)

- **Verified:** [Actions run #38256457984](https://github.com/edisontw/wondervale/actions/runs/38256457984), `workflow_dispatch` against `main` `69ede242e1a2125a43e412016bef2772832389f3`; `verify-and-package=success`, `deploy-mn4=success`.
- **Remote deploy log:** `Verified E02 archive: 9 runtime files`; `Verified frozen E01 build 20261010-e01-opening-spacing1`; `PASS: E01 byte-identical; E02 artifact byte-verified`; `DEPLOYED ... to https://wondervale.pepepow.net/e02/; frozen E01 unchanged`.
- **Boundary:** the deployment script's local HTTPS checks passed; independent owner device/browser interaction and E02 gameplay acceptance have **not** yet been recorded. E01 is frozen; do not modify its code or baseline for E02.
- **Failures encountered before PASS:** initially the deploy job was `skipped` because opt-in was not enabled; next strict host-key validation failed because `MN4_SSH_KNOWN_HOSTS` did not match the target; later `Load key ...: error in libcrypto` indicated malformed `MN4_SSH_KEY` text despite a valid server-side private key. The resolution was to write the unmodified private-key file directly into the Secret using `gh secret set MN4_SSH_KEY --repo edisontw/wondervale < "$HOME/.ssh/wondervale_mn4_ci_v3"`, eliminating multiline clipboard corruption. Avoid repeated key regeneration for this symptom.
- **Pending security hygiene:** after deployment PASS, revoke exposed/obsolete `wondervale-mn4-ci` and `wondervale-mn4-ci-v2` public keys from `wondervale-deploy` authorized_keys while preserving the verified v3 public key; remove stale copies of private keys and any temporary `gh` authentication no longer needed. This is an **operator action, not yet verified**. Never commit private keys, IP addresses or credentials.

## One-time MN4 bootstrap

Before making changes, confirm the **currently served E01 build** really is the version the owner has accepted; the deployment record may be older than the owner's latest PASS. The bootstrap intentionally freezes the *server's current bytes*, not whatever is currently on GitHub.

Log into MN4 using the established administrator account and an up-to-date checked-out Wondervale repository:

```bash
git -C ~/wondervale fetch origin main
git -C ~/wondervale switch main
git -C ~/wondervale pull --ff-only origin main
cd ~/wondervale
cat /srv/wondervale/current/RELEASE_INTEGRITY.json | head -n 8
# Check the displayed build and https://wondervale.pepepow.net/ yourself.
sudo bash scripts/mn4/bootstrap_deploy_user.sh
```

The bootstrap requires `/srv/wondervale/current` to be a symlink to an existing E01-only release with a valid integrity manifest. It creates `wondervale-deploy`, `/srv/wondervale/incoming`, an immutable-intent `/srv/wondervale/e01-baseline` symlink, and authorized_keys permissions. It transfers **write ownership only of the Wondervale deployment directories**, not existing E01 files or other MN4 services. It does not alter `current` or reload Nginx.

Configure SSH for the CI user using a **new dedicated Ed25519 key pair**, not an existing personal/MN4 administrative key. Windows is **not** required: generate on MN4 under the operator account if preferable and populate the GitHub Actions secret directly from the original file. For an optional Windows PowerShell workflow:

```powershell
ssh-keygen -t ed25519 -a 64 -f "$HOME\.ssh\wondervale_mn4_ci" -C "wondervale-mn4-ci"
Get-Content "$HOME\.ssh\wondervale_mn4_ci.pub"
```

On MN4, append the *public* key text to `/home/wondervale-deploy/.ssh/authorized_keys`. For a key generated on MN4, the private key can be held **temporarily by the operator** until it has been securely transferred to GitHub Secrets and an end-to-end deployment has passed. Never install it under the deploy user's home. Example after replacing the placeholder by the full public key:

```bash
echo 'ssh-ed25519 YOUR_NEW_CI_PUBLIC_KEY wondervale-mn4-ci' | sudo tee -a /home/wondervale-deploy/.ssh/authorized_keys >/dev/null
sudo chown wondervale-deploy:wondervale-deploy /home/wondervale-deploy/.ssh/authorized_keys
sudo chmod 600 /home/wondervale-deploy/.ssh/authorized_keys
```

Check that the new user can log in by SSH key and write only to the dedicated deployment namespace. Existing sshd restrictions (e.g., `AllowUsers`, port, or firewall) may need operator review; do not relax other services' restrictions unnecessarily. A limited source-IP allowlist is useful when feasible but GitHub-hosted runners do not have a single static source IP.

## GitHub repository configuration

Navigate to **Settings → Secrets and variables → Actions** for `edisontw/wondervale`.

Add **Actions secrets**:

| Secret | Value |
|---|---|
| `MN4_SSH_HOST` | MN4 hostname/IP (never commit it to Git) |
| `MN4_SSH_USER` | `wondervale-deploy` |
| `MN4_SSH_PORT` | SSH port, usually 22 |
| `MN4_SSH_KEY` | Complete private text from `wondervale_mn4_ci` |
| `MN4_SSH_KNOWN_HOSTS` | Verified **pinned** SSH host-key line(s), e.g. `hostname ssh-ed25519 ...` |

**Recommended lossless secret setup from MN4 (no Windows needed):**

```bash
# Run as the operator, with a dedicated unencrypted CI Ed25519 key already created
# and its public key installed in wondervale-deploy's authorized_keys.
ssh-keygen -y -f "$HOME/.ssh/wondervale_mn4_ci_v3" >/dev/null
gh auth login --hostname github.com --web
gh secret set MN4_SSH_KEY --repo edisontw/wondervale < "$HOME/.ssh/wondervale_mn4_ci_v3"
```

The file redirection preserves all newlines and avoids the `libcrypto` parse failure from copying multiline key text through a browser. Do not display or paste the private key into chats or GitHub issues. After GitHub Actions deploy **PASS** and the matching public key is confirmed in `authorized_keys`, remove unused old public keys and any locally retained CI private-key copy that is no longer needed; keep the GitHub Secret active. A direct `ssh-keygen -y -f KEY` PASS alone does not prove a Secret's content is intact.

**Host-key verification:** obtain the expected SSH server public-key fingerprint **on MN4** (e.g. `sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`) and independently compare it with the key exposed to the GitHub runner host and port. You may retrieve the public host key with `ssh-keyscan -p PORT HOST`, but **never trust that output without verifying the fingerprint out of band**. For a nonstandard port, the known_hosts hostname must be bracketed: `[host]:port`.

After secret setup and successful direct SSH login, add **Actions repository variable**:

```
MN4_DEPLOY_ENABLED = true
```

Before that variable is set to exactly `true`, the GitHub workflow still builds/tests/packages E02 and uploads the artifact, but deliberately skips the deployment job. No GitHub secret values should appear in pull requests, scripts, chat transcripts, build output, or commits.

## First deployment and future updates

1. Merge the approved workflow/scripts to `main`. The first `main` push runs the new CI; with deployment disabled it is a harmless rehearsal.
2. Check **Actions → Wondervale MN4 E02 continuous preview deployment** for `verify-and-package` PASS.
3. Configure the user/secrets and `MN4_DEPLOY_ENABLED=true`.
4. In Actions, choose that workflow → **Run workflow** → branch `main` (one initial manual trigger). Confirm `deploy-mn4` PASS and the remote HTTPS checks in its log.
5. Visit `https://wondervale.pepepow.net/` and `https://wondervale.pepepow.net/e02/` in a real browser. E02 should remain locked until genuine E01 completion on the **same browser/origin**; test a new E01 run as needed.
6. Thereafter, any relevant E02 code/art/package update merged into `main` triggers this automatically. Documentation-only commits and feature branches do not deploy.

**Do not conflate test statuses:** `verify-and-package=PASS` plus `deploy-mn4=skipped` means **not deployed**. `deploy-mn4=PASS` means static transfer + HTTPS smoke tested; owner E02 playable PASS and physical devices remain independent.

## Troubleshooting and rollback

- **SSH connection/auth failure:** verify host, port, firewall, server `AllowUsers`, dedicated user's authorized_keys, known_hosts fingerprint, and the Actions secret values.
- **Baseline mismatch:** E01 release package may not be the accepted build or the E02 archive's shared trio sprite may be newer than the frozen original. Do **not** disable checksum validation; resolve by explicitly reviewing/updating the approved E01 baseline.
- **Hosted `/e02/` 404:** check Nginx root and index configuration for `/srv/wondervale/current`; E02 must be served under the same origin, not a different subdomain. `try_files` must permit directory index resolution. Keep Nginx service and other hostnames untouched.
- **Old E02 in browser:** inspect Nginx/browser caching and E01's root-scoped service worker. Ensure `/e02/index.html`, `/e02/*.mjs`, `/e02/*.css`, `/engine/s01e02.mjs` and `/public/s01e02.json` are revalidated rather than indefinitely cached. Preserve ordinary cache policies for immutable images.
- **HTTPS smoke failure:** the remote script rolls back `current` to its pre-deploy symlink automatically and fails the Actions job.
- **Manual rollback:** log into MN4 and choose a known-good release, then atomically swap:
  ```bash
  old=/srv/wondervale/releases/FULL_KNOWN_GOOD_RELEASE_DIRECTORY
  sudo ln -s "$old" /srv/wondervale/.rollback-manual
  sudo mv -Tf /srv/wondervale/.rollback-manual /srv/wondervale/current
  ```
  No Nginx reload is normally necessary for a static document-root symlink switch. Confirm HTTPS and E01 after rollback.

To suspend automatic deploy **without removing the workflow**, change `MN4_DEPLOY_ENABLED` to `false` in GitHub repository variables. Do not delete old immutable releases until rollback retention policy and active-client cache behavior have been reviewed.

## Remaining deployment gate

- **Completed:** accepted E01 baseline verified and frozen, MN4 bootstrap, GitHub secrets, pinned host key, repository variable, initial end-to-end E02 deployment and local HTTPS smoke PASS in run #38256457984.
- **Open:** owner real-browser/mobile E02 gameplay and responsive/scene QA; E01-to-E02 progress unlock behavior on the same origin; cleanup of obsolete CI SSH keys and temporary operator secrets/authentication.
- **Future E01 changes:** require explicit new baseline approval; not automatically updated by E02 CI.

## 2026-10-12 explicit E01 baseline refresh (later, supersedes earlier "unchanged E01" status)

The E01 baseline **was intentionally refreshed** under separate owner direction after E02 initially went live. [E01 deployment run #38271380184](https://github.com/edisontw/wondervale/actions/runs/38271380184) PASS from `de8ab925ff99a8af41fd454e7a534f7f1cf840a8`. E01 public root now serves build `20261012-e01-landscape-fullscreen1`; the then-live E02's nine files were byte-verified, and both routes passed local HTTPS smoke. The E01 deployment script atomically promotes a new E01+E02 composite and updates `/srv/wondervale/e01-baseline` only after successful smoke; a failed attempt rolls back. Subsequent E02-only releases must preserve this **new** E01 baseline, not copy the historical 2026-10-10 version. Earlier references to "never update E01" describe E02-only work, not this explicitly approved E01 promotion.

The E01 deployment's two corrected failure modes are documented in [E01 full-screen deployment evidence](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md): inherited 0700 release directory causing HTTPS 403; mismatch between temporary symlink path using `$` and `$$`. Keep atomic switch path in a single shell variable and directory traverse permissions testable via live HTTPS. Real device/family QA is still not established by automated checks.

## 2026-10-13 E01 Riverside handoff baseline (current)

The latest **explicitly promoted E01 baseline** is build `20261012-e01-handoff-fullscreen2`, code source `74e3edd9522ce1f6bac6d3e3513129a13a0786ea`. [MN4 E01 deployment #38275829155](https://github.com/edisontw/wondervale/actions/runs/38275829155) completed archive, manifest/hash verification, live E02 byte comparison, atomic E01+E02 composite release and HTTPS readback; remote logged `DEPLOYED E01 build ...; E02 preserved`. Separate E02 [run #38275829153](https://github.com/edisontw/wondervale/actions/runs/38275829153) PASS and E01 browser [run #38275829092](https://github.com/edisontw/wondervale/actions/runs/38275829092) PASS. For subsequent E02-only deployments, preserve **this current E01 baseline** byte-for-byte, not the earlier landscape-only build.

Release incident resolved: run #38275124175 failed before switch because the E01 release intake asserted an obsolete feature-specific build prefix. PR #61 replaced that condition with a bounded date-stamped E01 identifier while retaining exact manifest ID matching, file SHA-256, strict path allowlist, HTTPS, rollback, and baseline promotion. Owner Chrome-device retest and family UX remain open. See [E01 dated QA/release note](E01_FULLSCREEN_LANDSCAPE_2026-10-12.md).

## iPhone Chrome App view release baseline — 2026-10-13 01:06 Asia/Taipei

The latest explicitly promoted **E01 baseline** is `20261013-e01-ios-appview1` from `af8b676785dd985a7ddf63dbce08ad850d0896d9`, [release #38281555894](https://github.com/edisontw/wondervale/actions/runs/38281555894) PASS. The immutable E01 file allowlist now includes `manifest.webmanifest` as an additional SHA-256-verified artifact; the MN4 deployment also byte-compares this manifest over HTTPS, preserves existing E02 content, promotes the E01 baseline and retains atomic rollback. E02 main CI/deployment [#38281555791](https://github.com/edisontw/wondervale/actions/runs/38281555791) PASS. The Home Screen feature does not change the origin-scoped ledger contract; however, iOS installed Web App storage may be separate from the original Chrome browser context, and physical iPhone acceptance remains OPEN.

## E01 mobile nav baseline promotion — 2026-10-13 20:24 Taipei

PR #64 source `929d3ffde19a72300329a3e348ee4ba32f1a7c7a`, E01 build `20261013-e01-mobile-nav1` was promoted at [MN4 E01 run #38396812688](https://github.com/edisontw/wondervale/actions/runs/38396812688), with E01 verify-and-package and E01 deploy PASS. Remote intake verified full E01 package and live E02 integrity, deployed the E01 composite and updated the pinned E01 baseline. E02 remained byte-identical across the release. [E01 main browser #38396812752](https://github.com/edisontw/wondervale/actions/runs/38396812752) PASS. The only runtime changes are E01 mobile header, navigation presentation (Board short visual label / stable ARIA), responsive CSS and versioned cache; deployment/security integrity contracts are unchanged. Physical iPhone acceptance is not implied by CI.

## Real-CSS iPhone mobile E01 baseline — 2026-10-13 22:29 Taipei

[PR #65](https://github.com/edisontw/wondervale/pull/65) source `3bfb44ba0abaf45dde84e557650c9b73846f72ce`, E01 build `20261013-e01-iphone-stage1` was promoted by [main MN4 release #38413502794](https://github.com/edisontw/wondervale/actions/runs/38413502794) PASS. Verified immutable E01 package and live E02 SHA/byte identity before remote deploy, then E01 HTTPS composite promotion and E01 baseline update. [Main E01 browser #38413502676](https://github.com/edisontw/wondervale/actions/runs/38413502676) PASS. The change only affects E01 short-landscape layout, accessibility-preserving Map display, build ID and offline cache. E02 original bytes, release identity validation, rollback and atomic swap contracts unchanged. Owner physical iPhone landscape acceptance remains OPEN.

## No-jump iPhone walking E01 baseline — 2026-10-14 00:45 Asia/Taipei

[PR #66](https://github.com/edisontw/wondervale/pull/66) merged code `fb34a4348c5723598df5cba66a0833bfc2b220e9` and immutable E01 build `20261014-e01-walk-stable1`. [Main MN4 E01 release #38432760231](https://github.com/edisontw/wondervale/actions/runs/38432760231) **PASS**, including strict E01 package SHA checks, E02 deployed-byte preservation and HTTPS composite promotion, followed by updated E01 baseline. [Main E01 browser/runtime #38432760246](https://github.com/edisontw/wondervale/actions/runs/38432760246) **PASS**. Only E01 walk-status presentation, browser acceptance tests, build/cache and docs changed; CI/deploy allowlist, E02, atomic switch and rollback contracts remained the same. Physical iPhone owner verification remains open.

## E01 compact map hypothesis choice baseline — 2026-10-14 01:15 Asia/Taipei

[PR #67](https://github.com/edisontw/wondervale/pull/67) source `9e5fe72667e4bf360bc359f5ff3fc6cdd2dbf94c`, build `20261014-e01-map-choice-compact1`. [MN4 E01 composite deploy #38436788929](https://github.com/edisontw/wondervale/actions/runs/38436788929) **PASS**, including E01 package SHA validation, deployed E02 byte verification, HTTPS composite promotion and E01 pinned baseline update. [Main E01 runtime/browser #38436788865](https://github.com/edisontw/wondervale/actions/runs/38436788865) PASS. Only E01 map hypothesis button CSS, new browser assertions, versioned cache and docs changed; E02, release file allowlists, provenance and rollback mechanisms remain unchanged. Owner iPhone Web App physical acceptance still OPEN.
