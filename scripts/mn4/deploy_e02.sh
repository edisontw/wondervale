#!/usr/bin/env bash
# Deploy verified E02 and E03 previews alongside the frozen E01 release.
# Runs as the dedicated, unprivileged wondervale-deploy SSH user.
set -Eeuo pipefail
umask 022

sha="${1:-}"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo "Expected a full 40-character commit SHA" >&2; exit 2; }
e03sha="${2:-}"
if [[ -n "$e03sha" && ! "$e03sha" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Expected a full E03 commit SHA" >&2; exit 2
fi
root=/srv/wondervale
incoming="$root/incoming/e02-$sha.tar.gz"
incoming_e03="$root/incoming/e03-${e03sha:-$sha}.tar.gz"
release="$root/releases/$sha-e02"
[[ -f "$incoming" && -L "$root/current" && -L "$root/e01-baseline" ]] || {
  echo "Missing artifact, current release, or frozen E01 baseline" >&2; exit 2;
}
baseline="$(readlink -f "$root/e01-baseline")"
[[ -d "$baseline" && "$baseline" == "$root/releases/"* ]] || {
  echo "E01 baseline must refer to an existing Wondervale release" >&2; exit 2;
}

stage="$(mktemp -d "$root/incoming/.stage-$sha.XXXXXX")"
candidate="$(mktemp -d "$root/incoming/.candidate-$sha.XXXXXX")"
cleanup() { rm -rf -- "$stage" "$candidate"; }
trap cleanup EXIT

# Do not use unrestricted tar extraction. Reject traversal, symlinks, and unknown files.
python3 - "$incoming" "$stage" <<'PY'
import hashlib, json, pathlib, posixpath, shutil, sys, tarfile
archive, destination = sys.argv[1:]
destination = pathlib.Path(destination)
allowed = {
    "e02/index.html", "e02/style.css", "e02/main.mjs",
    "engine/s01e02.mjs", "public/s01e02.json",
    "public/art/trio-sprites.webp",
    "public/art/s01e02-riverside-r0.webp",
    "public/art/s01e02-riverside-r1.webp",
    "public/art/s01e02-riverside-r2.webp",
}
contents = set()
with tarfile.open(archive, "r:gz") as tar:
    for member in tar:
        name = posixpath.normpath(member.name)
        if name == "." and member.isdir():
            continue
        if member.isdir():
            continue
        if name not in allowed | {"RELEASE_INTEGRITY.json"} or not member.isfile():
            raise SystemExit(f"Unsafe/unexpected archive member: {member.name}")
        if name in contents:
            raise SystemExit(f"Duplicate archive member: {name}")
        contents.add(name)
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        with tar.extractfile(member) as source, target.open("wb") as sink:
            shutil.copyfileobj(source, sink)
if contents != allowed | {"RELEASE_INTEGRITY.json"}:
    raise SystemExit(f"E02 archive member mismatch: {sorted((allowed | {'RELEASE_INTEGRITY.json'}) ^ contents)}")
manifest = json.loads((destination / "RELEASE_INTEGRITY.json").read_text())
assert manifest.get("episode") == "s01e02"
entries = manifest.get("files", [])
assert len(entries) == len(allowed)
assert {entry["path"] for entry in entries} == allowed
for entry in entries:
    content = (destination / entry["path"]).read_bytes()
    if len(content) != entry["bytes"] or hashlib.sha256(content).hexdigest() != entry["sha256"]:
        raise SystemExit(f"E02 artifact integrity failed: {entry['path']}")
print(f"Verified E02 archive: {len(entries)} runtime files")
PY

if [[ -n "$e03sha" ]]; then
[[ -f "$incoming_e03" ]] || { echo "Missing E03 artifact" >&2; exit 2; }
python3 - "$incoming_e03" "$stage" <<'PY'
import hashlib, json, pathlib, posixpath, shutil, sys, tarfile
archive, destination = sys.argv[1:]
destination = pathlib.Path(destination)
allowed = {
    "e03/index.html", "e03/style.css", "e03/main.mjs",
    "engine/s01e03.mjs", "engine/s01e02.mjs", "public/s01e03.json",
    "public/art/s01e03-market-lane-m0.webp", "public/art/trio-sprites.webp",
    "public/art/glyph.svg",
}
contents = set()
with tarfile.open(archive, "r:gz") as tar:
    for member in tar:
        name = posixpath.normpath(member.name)
        if name == "." and member.isdir(): continue
        if member.isdir(): continue
        if name not in allowed | {"RELEASE_INTEGRITY.json"} or not member.isfile():
            raise SystemExit(f"Unsafe/unexpected E03 archive member: {member.name}")
        if name in contents: raise SystemExit(f"Duplicate E03 archive member: {name}")
        contents.add(name)
        target = destination / ("E03_RELEASE_INTEGRITY.json" if name == "RELEASE_INTEGRITY.json" else name)
        target.parent.mkdir(parents=True, exist_ok=True)
        with tar.extractfile(member) as source, target.open("wb") as sink: shutil.copyfileobj(source, sink)
if contents != allowed | {"RELEASE_INTEGRITY.json"}:
    raise SystemExit(f"E03 archive member mismatch: {sorted((allowed | {'RELEASE_INTEGRITY.json'}) ^ contents)}")
manifest = json.loads((destination / "E03_RELEASE_INTEGRITY.json").read_text())
assert manifest.get("episode") == "s01e03"
entries = manifest.get("files", [])
assert len(entries) == len(allowed)
assert {entry["path"] for entry in entries} == allowed
for entry in entries:
    content = (destination / entry["path"]).read_bytes()
    if len(content) != entry["bytes"] or hashlib.sha256(content).hexdigest() != entry["sha256"]:
        raise SystemExit(f"E03 artifact integrity failed: {entry['path']}")
print(f"Verified E03 archive: {len(entries)} runtime files")
PY
fi

# Make a new composite release from frozen E01 bytes. Never rebuild or overwrite E01.
python3 - "$baseline" <<'PY'
import hashlib, json, pathlib, sys
root = pathlib.Path(sys.argv[1])
manifest = json.loads((root / "RELEASE_INTEGRITY.json").read_text())
entries = manifest["files"]
assert len(entries) >= 12, "E01 baseline manifest is incomplete"
for item in entries:
    path = root / item["path"]
    data = path.read_bytes()
    assert len(data) == item["bytes"]
    assert hashlib.sha256(data).hexdigest() == item["sha256"], item["path"]
assert (root / "index.html").is_file()
assert (root / "engine/episode.mjs").is_file()
assert not (root / "e02").exists(), "Baseline must be the original E01-only release"
print(f"Verified frozen E01 build {manifest.get('build')}")
PY

if [[ ! -d "$release" ]]; then
  cp -a "$baseline/." "$candidate/"
  mkdir -p "$candidate/e02" "$candidate/engine" "$candidate/public/art"
  cp -a "$stage/e02/." "$candidate/e02/"
  cp -a "$stage/engine/s01e02.mjs" "$candidate/engine/s01e02.mjs"
  cp -a "$stage/public/s01e02.json" "$candidate/public/s01e02.json"
  cp -a "$stage/public/art/." "$candidate/public/art/"
  cp -a "$stage/RELEASE_INTEGRITY.json" "$candidate/E02_RELEASE_INTEGRITY.json"
  if [[ -n "$e03sha" ]]; then
    mkdir -p "$candidate/e03"
    cp -a "$stage/e03/." "$candidate/e03/"
    cp -a "$stage/engine/s01e03.mjs" "$candidate/engine/s01e03.mjs"
    cp -a "$stage/public/s01e03.json" "$candidate/public/s01e03.json"
    cp -a "$stage/E03_RELEASE_INTEGRITY.json" "$candidate/E03_RELEASE_INTEGRITY.json"
  fi
  mv -- "$candidate" "$release"
  # candidate moved; EXIT cleanup ignores its old empty path.
fi

# Immutable release validation; a repeated SHA is safe only when its bytes agree.
cmp -s "$stage/RELEASE_INTEGRITY.json" "$release/E02_RELEASE_INTEGRITY.json" || {
  echo "Existing release differs from the requested commit artifact" >&2; exit 1;
}
python3 - "$baseline" "$release" <<'PY'
import hashlib, json, pathlib, sys
base, target = map(pathlib.Path, sys.argv[1:])
for item in json.loads((base / "RELEASE_INTEGRITY.json").read_text())["files"]:
    assert (base / item["path"]).read_bytes() == (target / item["path"]).read_bytes(), item["path"]
manifest = json.loads((target / "E02_RELEASE_INTEGRITY.json").read_text())
for item in manifest["files"]:
    data = (target / item["path"]).read_bytes()
    assert len(data) == item["bytes"]
    assert hashlib.sha256(data).hexdigest() == item["sha256"], item["path"]
print("PASS: E01 byte-identical; E02 artifact byte-verified")
PY

if [[ -n "$e03sha" ]]; then
cmp -s "$stage/E03_RELEASE_INTEGRITY.json" "$release/E03_RELEASE_INTEGRITY.json" || {
  echo "Existing E03 release differs from the requested commit artifact" >&2; exit 1;
}
python3 - "$release" <<'PY'
import hashlib, json, pathlib, sys
target = pathlib.Path(sys.argv[1])
manifest = json.loads((target / "E03_RELEASE_INTEGRITY.json").read_text())
for item in manifest["files"]:
    data = (target / item["path"]).read_bytes()
    assert len(data) == item["bytes"]
    assert hashlib.sha256(data).hexdigest() == item["sha256"], item["path"]
print("PASS: E03 artifact byte-verified")
PY
fi

previous="$(readlink -f "$root/current")"
[[ -d "$previous" && "$previous" == "$root/releases/"* ]] || {
  echo "Current symlink points outside Wondervale releases" >&2; exit 1;
}
next="$root/.current-next-$sha-$$"
ln -s -- "$release" "$next"
mv -Tf -- "$next" "$root/current"

# Check the local HTTPS virtual host, preserving correct TLS SNI and certificate checks.
site="https://wondervale.pepepow.net"
curl_args=(--fail --silent --show-error --max-time 15 --resolve "wondervale.pepepow.net:443:127.0.0.1")
check_live() {
  local temp
  temp="$(mktemp "$root/incoming/.health-$sha.XXXXXX")"
  if ! curl "${curl_args[@]}" "$site/index.html" -o "$temp" || ! cmp -s "$baseline/index.html" "$temp"; then
    rm -f "$temp"; return 1
  fi
  if ! curl "${curl_args[@]}" "$site/e02/" -o "$temp" || ! grep -q 'The Bridge That Stops' "$temp"; then
    rm -f "$temp"; return 1
  fi
  if ! curl "${curl_args[@]}" "$site/public/s01e02.json" -o "$temp" || ! cmp -s "$release/public/s01e02.json" "$temp"; then
    rm -f "$temp"; return 1
  fi
  if ! curl "${curl_args[@]}" "$site/engine/s01e02.mjs" -o "$temp" || ! cmp -s "$release/engine/s01e02.mjs" "$temp"; then
    rm -f "$temp"; return 1
  fi
  if ! curl "${curl_args[@]}" "$site/public/art/s01e02-riverside-r0.webp" -o "$temp" || ! cmp -s "$release/public/art/s01e02-riverside-r0.webp" "$temp"; then
    rm -f "$temp"; return 1
  fi
  if [[ -n "$e03sha" ]]; then
    if ! curl "${curl_args[@]}" "$site/e03/" -o "$temp" || ! grep -q 'Three Deliveries, One Wrong Turn' "$temp"; then
      rm -f "$temp"; return 1
    fi
    if ! curl "${curl_args[@]}" "$site/public/s01e03.json" -o "$temp" || ! cmp -s "$release/public/s01e03.json" "$temp"; then
      rm -f "$temp"; return 1
    fi
    if ! curl "${curl_args[@]}" "$site/e03/main.mjs" -o "$temp" || ! cmp -s "$release/e03/main.mjs" "$temp"; then
      rm -f "$temp"; return 1
    fi
  fi
  rm -f "$temp"
}
if ! check_live; then
  rollback="$root/.current-rollback-$sha-$$"
  ln -s -- "$previous" "$rollback"
  mv -Tf -- "$rollback" "$root/current"
  echo "FAIL: HTTPS smoke test. Rolled back current to $previous" >&2
  exit 1
fi
rm -f -- "$incoming"
if [[ -n "$e03sha" ]]; then rm -f -- "$incoming_e03"; fi
echo "DEPLOYED $sha to $site/e02/ and ${e03sha:+$site/e03/}; frozen E01 unchanged; previous=$previous"
