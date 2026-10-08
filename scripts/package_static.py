"""Package only runtime files, with per-file integrity and no future episode sources."""
from pathlib import Path
import hashlib,json,shutil,zipfile
root=Path(__file__).resolve().parents[1]
out=root/'dist/wondervale-e01-static'
if out.exists(): shutil.rmtree(out)
files=['index.html','sw.js','app/main.mjs','app/style.css','engine/episode.mjs','public/episode.json']+[str(p.relative_to(root)) for p in sorted((root/'public/art').glob('*.webp'))]+['public/art/glyph.svg']
manifest={'build':json.loads((root/'public/episode.json').read_text())['buildId'],'files':[]}
for name in files:
 p=root/name;target=out/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
 b=p.read_bytes();manifest['files'].append({'path':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
(out/'RELEASE_INTEGRITY.json').write_text(json.dumps(manifest,indent=2)+'\n')
with zipfile.ZipFile(root/'dist/wondervale-e01-static.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(out.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(out))
print(f"Static release: {len(files)} runtime files; {sum(x['bytes'] for x in manifest['files'])} bytes; no future canon/source assets.")
