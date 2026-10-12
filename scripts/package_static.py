"""Package only runtime files, with per-file integrity and no future episode sources."""
from pathlib import Path
import hashlib,json,shutil,zipfile
root=Path(__file__).resolve().parents[1]
out=root/'dist/wondervale-e01-static'
if out.exists(): shutil.rmtree(out)
# E01 releases include only art explicitly owned by E01. Never glob public/art/*.webp:
# future episode art can be present in the repository before its own runtime is ready.
e01_manifest=json.loads((root/'assets/production-candidates/s01e01/PRODUCTION_INTEGRITY.json').read_text())['assets']
e01_webps=sorted(x['path'] for x in e01_manifest
                 if x['path'].startswith('public/art/') and x['path'].endswith('.webp'))
assert len(e01_webps)==5, "E01 owned-art manifest changed; review release allowlist"
files=['index.html','manifest.webmanifest','sw.js','app/main.mjs','app/style.css','engine/episode.mjs','public/episode.json']+e01_webps+['public/art/glyph.svg']
assert len(files)==len(set(files)), "Duplicate release paths"
assert not any('s01e02' in path for path in files), "Future episode art leaked into E01"
manifest={'build':json.loads((root/'public/episode.json').read_text())['buildId'],'files':[]}
for name in files:
 p=root/name;target=out/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
 b=p.read_bytes();manifest['files'].append({'path':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
(out/'RELEASE_INTEGRITY.json').write_text(json.dumps(manifest,indent=2)+'\n')
with zipfile.ZipFile(root/'dist/wondervale-e01-static.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(out.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(out))
print(f"Static release: {len(files)} E01-owned runtime files; {sum(x['bytes'] for x in manifest['files'])} bytes; no future episode assets.")
