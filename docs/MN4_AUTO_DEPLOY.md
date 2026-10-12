# MN4 automatic E02 preview deployment (GitHub Actions)

Status: implementation staged; **deployment is disabled until the MN4 SSH account, GitHub secrets, and opt-in repository variable are configured**. This is an E02 preview deployment contract, **not** owner/gameplay/device/family acceptance. Do not report an actual MN4 deploy without a successful deployed workflow run and endpoint verification.

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

Configure SSH for the CI user using a **new dedicated Ed25519 key pair** generated locally, not any existing personal/MN4 administrative key. On Windows PowerShell:

```powershell
ssh-keygen -t ed25519 -a 64 -f "$HOME\.ssh\wondervale_mn4_ci" -C "wondervale-mn4-ci"
Get-Content "$HOME\.ssh\wondervale_mn4_ci.pub"
```

On MN4, append the *public* key text to `/home/wondervale-deploy/.ssh/authorized_keys` (no private key should ever reach MN4). Example after replacing the placeholder by the full public key:

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

- User/admin: verify actual E01 baseline build, run one-time MN4 bootstrap, configure SSH public/private key and pinned host key, enable GitHub variable.
- CI: inspect a run at the current HEAD before activation.
- Runtime: inspect E02 on actual phones and receive owner playable PASS separately.
- Future E01 changes: require explicit new baseline approval; not automatically updated by E02 CI.
