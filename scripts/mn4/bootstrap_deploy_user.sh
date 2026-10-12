#!/usr/bin/env bash
# Run ONCE on MN4 as root: sudo bash scripts/mn4/bootstrap_deploy_user.sh
# This never changes the active site or the existing E01 release bytes.
set -Eeuo pipefail
[[ "$(id -u)" -eq 0 ]] || { echo "Run as root via sudo" >&2; exit 2; }

root=/srv/wondervale
account=wondervale-deploy
[[ -L "$root/current" && -d "$root/releases" ]] || {
  echo "Existing MN4 Wondervale release/symlink not found; do not install blindly" >&2; exit 1;
}
current="$(readlink -f "$root/current")"
[[ -d "$current" && "$current" == "$root/releases/"* ]] || {
  echo "Current must resolve inside Wondervale releases" >&2; exit 1;
}
[[ -f "$current/RELEASE_INTEGRITY.json" && -f "$current/public/episode.json" ]] || {
  echo "Current E01 lacks its release integrity/content files" >&2; exit 1;
}

# Confirm the E01 snapshot is byte-correct before making it a permanent baseline.
python3 - "$current" <<'PY'
import hashlib, json, pathlib, sys
root=pathlib.Path(sys.argv[1])
manifest=json.loads((root/"RELEASE_INTEGRITY.json").read_text())
assert len(manifest["files"])>=12
accepted="20261010-e01-opening-spacing1"
assert manifest.get("build")==accepted, (
    f"Current server E01 build {manifest.get('build')!r} is not the last owner-accepted {accepted!r}; "
    "deploy the accepted E01 release first, then rerun bootstrap"
)
assert json.loads((root/"public/episode.json").read_text())["buildId"]==accepted
for item in manifest["files"]:
    data=(root/item["path"]).read_bytes()
    assert len(data)==item["bytes"], item["path"]
    assert hashlib.sha256(data).hexdigest()==item["sha256"], item["path"]
assert (root/"index.html").is_file()
assert (root/"engine/episode.mjs").is_file()
assert not (root/"e02").exists(), "First baseline must be E01-only"
print("E01 baseline build:",manifest.get("build"))
PY

if [[ ! -e "$root/e01-baseline" && ! -L "$root/e01-baseline" ]]; then
  ln -s -- "$current" "$root/e01-baseline"
  echo "Frozen E01 baseline: $current"
else
  [[ -L "$root/e01-baseline" ]] || { echo "e01-baseline is not a symlink" >&2; exit 1; }
  echo "Existing E01 baseline retained: $(readlink -f "$root/e01-baseline")"
fi

if ! id "$account" &>/dev/null; then
  useradd --create-home --shell /bin/bash "$account"
fi
install -d -o "$account" -g "$account" -m 0755 "$root/incoming"
install -d -o "$account" -g "$account" -m 0700 "/home/$account/.ssh"
touch "/home/$account/.ssh/authorized_keys"
chown "$account:$account" "/home/$account/.ssh/authorized_keys"
chmod 0600 "/home/$account/.ssh/authorized_keys"

# Limit write ownership to the Wondervale deployment namespace, not other MN4 services.
# Existing release file ownership/content is deliberately unchanged.
chown "$account:$account" "$root" "$root/releases"
chmod 0755 "$root" "$root/releases"
echo "Bootstrap complete. Current site is unchanged."
echo "Next: install a dedicated CI PUBLIC key in /home/$account/.ssh/authorized_keys,"
echo "then configure GitHub Actions secrets and set MN4_DEPLOY_ENABLED=true."
