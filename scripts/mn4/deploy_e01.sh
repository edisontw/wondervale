#!/usr/bin/env bash
# Promote an integrity-checked E01 release while retaining live E02 bytes.
set -Eeuo pipefail
umask 022
sha="$1"
[[ "$sha" =~ ^[a-f0-9]{40}$ ]] || exit 2
root=/srv/wondervale
archive="$root/incoming/e01-$sha.tar.gz"
[[ -f "$archive" && -L "$root/current" && -L "$root/e01-baseline" ]] || exit 2
old="$(readlink -f "$root/current")"
base="$(readlink -f "$root/e01-baseline")"
[[ "$old" == "$root/releases/"* && "$base" == "$root/releases/"* ]] || exit 2
[[ -f "$old/E02_RELEASE_INTEGRITY.json" ]] || { echo "E02 missing; refuse E01-only promotion" >&2; exit 2; }
stage="$(mktemp -d "$root/incoming/.e01-stage-$sha.XXXXXX")"
candidate="$(mktemp -d "$root/incoming/.e01-candidate-$sha.XXXXXX")"
changed=0
cleanup() {
  local result=$?
  if (( result != 0 && changed )); then
    ln -s "$old" "$root/.undo-current-$sha-$$"
    mv -Tf "$root/.undo-current-$sha-$$" "$root/current"
    ln -s "$base" "$root/.undo-base-$sha-$$"
    mv -Tf "$root/.undo-base-$sha-$$" "$root/e01-baseline"
    echo "Rolled back E01 + E02 to prior composite" >&2
  fi
  rm -rf -- "$stage" "$candidate"
}
trap cleanup EXIT
python3 - "$archive" "$stage" "$old" <<'PY'
import hashlib,json,pathlib,posixpath,re,shutil,sys,tarfile
archive, stage, current=sys.argv[1:]
stage,current=pathlib.Path(stage),pathlib.Path(current)
e01={"index.html","sw.js","app/main.mjs","app/style.css","engine/episode.mjs","public/episode.json","public/art/glyph.svg","public/art/town-square-master.webp","public/art/trio-sprites.webp","public/art/noticeboard-reference.webp","public/art/marker-reference.webp","public/art/steward.webp"}
seen=set()
with tarfile.open(archive,"r:gz") as tar:
 for member in tar:
  name=posixpath.normpath(member.name)
  if member.isdir():
   if name.startswith("/") or name.startswith("../"): raise SystemExit("Invalid directory")
   continue
  if not member.isfile() or name not in e01|{"RELEASE_INTEGRITY.json"} or name in seen:
   raise SystemExit("Invalid archive member: "+member.name)
  seen.add(name)
  target=stage/name
  target.parent.mkdir(parents=True,exist_ok=True)
  with tar.extractfile(member) as source,target.open("wb") as dest: shutil.copyfileobj(source,dest)
if seen != e01|{"RELEASE_INTEGRITY.json"}: raise SystemExit("Wrong E01 file list")
manifest=json.loads((stage/"RELEASE_INTEGRITY.json").read_text())
assert {x["path"] for x in manifest["files"]}==e01 and len(manifest["files"])==len(e01)
assert manifest["build"]==json.loads((stage/"public/episode.json").read_text())["buildId"]
# Build IDs are E01 release identifiers, not a particular UI feature or build revision.
# The artifact manifest must agree with episode.json and every file hash must pass.
assert re.fullmatch(r"20[0-9]{6}-e01-[a-z0-9][a-z0-9-]{0,63}", manifest["build"])
for entry in manifest["files"]:
 data=(stage/entry["path"]).read_bytes()
 assert len(data)==entry["bytes"] and hashlib.sha256(data).hexdigest()==entry["sha256"],entry["path"]
e02=json.loads((current/"E02_RELEASE_INTEGRITY.json").read_text())
expected={"e02/index.html","e02/style.css","e02/main.mjs","engine/s01e02.mjs","public/s01e02.json","public/art/trio-sprites.webp","public/art/s01e02-riverside-r0.webp","public/art/s01e02-riverside-r1.webp","public/art/s01e02-riverside-r2.webp"}
assert e02.get("episode")=="s01e02" and len(e02["files"])==len(expected)
assert {x["path"] for x in e02["files"]}==expected
for entry in e02["files"]:
 data=(current/entry["path"]).read_bytes()
 assert len(data)==entry["bytes"] and hashlib.sha256(data).hexdigest()==entry["sha256"],entry["path"]
assert (stage/"public/art/trio-sprites.webp").read_bytes()==(current/"public/art/trio-sprites.webp").read_bytes()
print("PASS E01 package and live E02 byte verification")
PY
newbase="$root/releases/$sha-e01"
digest="$(sha256sum "$old/E02_RELEASE_INTEGRITY.json" | cut -c1-14)"
newcurrent="$root/releases/$sha-e01-with-e02-$digest"
if [[ ! -e "$newbase" ]]; then
  cp -a "$stage/." "$newbase"
else
  cmp -s "$stage/RELEASE_INTEGRITY.json" "$newbase/RELEASE_INTEGRITY.json"
fi
# mktemp source dirs are 0700; immutable release roots must be traversable
# by the unprivileged HTTPS web server, unlike private staging dirs.
chmod 0755 "$newbase"
cp -a "$newbase/." "$candidate/"
python3 - "$old" "$candidate" <<'PY'
import hashlib,json,pathlib,shutil,sys
old,new=map(pathlib.Path,sys.argv[1:])
m=json.loads((old/"E02_RELEASE_INTEGRITY.json").read_text())
for entry in m["files"]:
 src=old/entry["path"]
 dst=new/entry["path"]
 if entry["path"]=="public/art/trio-sprites.webp":
  assert src.read_bytes()==dst.read_bytes()
 else:
  dst.parent.mkdir(parents=True,exist_ok=True)
  shutil.copyfile(src,dst)
shutil.copyfile(old/"E02_RELEASE_INTEGRITY.json",new/"E02_RELEASE_INTEGRITY.json")
for entry in m["files"]:
 b=(new/entry["path"]).read_bytes()
 assert len(b)==entry["bytes"] and hashlib.sha256(b).hexdigest()==entry["sha256"]
PY
if [[ ! -e "$newcurrent" ]]; then
  mv "$candidate" "$newcurrent"
  candidate="$(mktemp -d "$root/incoming/.e01-candidate-$sha.XXXXXX")"
else
  cmp -s "$candidate/RELEASE_INTEGRITY.json" "$newcurrent/RELEASE_INTEGRITY.json"
  cmp -s "$candidate/E02_RELEASE_INTEGRITY.json" "$newcurrent/E02_RELEASE_INTEGRITY.json"
fi
chmod 0755 "$newcurrent"
current_next="$root/.current-e01-next-$sha-$"
ln -s "$newcurrent" "$current_next"
mv -Tf "$current_next" "$root/current"
changed=1
site=https://wondervale.pepepow.net
verify_live() {
  local path="$1" expected="$2" tmp
  tmp="$(mktemp "$root/incoming/.health-$sha.XXXXXX")"
  if ! curl --fail --silent --show-error --max-time 15 --resolve "wondervale.pepepow.net:443:127.0.0.1" "$site/$path" -o "$tmp" || ! cmp -s "$tmp" "$expected"; then
    rm -f "$tmp"
    return 1
  fi
  rm -f "$tmp"
}
verify_live index.html "$newbase/index.html"
verify_live app/main.mjs "$newbase/app/main.mjs"
verify_live public/episode.json "$newbase/public/episode.json"
verify_live e02/index.html "$old/e02/index.html"
verify_live e02/main.mjs "$old/e02/main.mjs"
verify_live public/s01e02.json "$old/public/s01e02.json"
ln -s "$newbase" "$root/.baseline-e01-next-$sha-$$"
mv -Tf "$root/.baseline-e01-next-$sha-$$" "$root/e01-baseline"
[[ "$(readlink -f "$root/e01-baseline")" == "$newbase" ]]
changed=0
rm -f "$archive"
echo "DEPLOYED E01 build from $sha; E02 preserved; old release $old"
