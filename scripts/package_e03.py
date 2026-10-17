"""Package E03 with an explicit allowlist; never rebuild or publish E01/E02."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/wondervale-e03-preview'
manifest = json.loads((ROOT/'assets/production-candidates/s01e03/PRODUCTION_INTAKE_PENDING.json').read_text(encoding='utf-8'))
assert manifest['status'].startswith('media_uploaded_verified')
FILES = ['e03/index.html','e03/main.mjs','e03/style.css','engine/s01e03.mjs',
         'engine/s01e02.mjs',  # read-only prerequisite validator, frozen upstream
         'public/s01e03.json','public/art/s01e03-market-lane-m0.webp',
         'public/art/trio-sprites.webp','public/art/glyph.svg']
assert len(FILES) == len(set(FILES))
integrity = {'episode':'s01e03','build':'20261017-e03-carried-props2',
             'status':'ENGINEERING_PREVIEW_DEPLOYABLE_HIDDEN_ROUTES_OPEN', 'files':[]}
# Do not recursively remove directories. Reject stale/unexpected release files.
if OUT.exists():
    assert all(p.relative_to(OUT).as_posix() in FILES+['RELEASE_INTEGRITY.json'] for p in OUT.rglob('*') if p.is_file())
for name in FILES:
    data=(ROOT/name).read_bytes()
    target=OUT/name
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(data)
    integrity['files'].append({'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
(OUT/'RELEASE_INTEGRITY.json').write_text(json.dumps(integrity,indent=2)+'\n',encoding='utf-8')
with zipfile.ZipFile(ROOT/'dist/wondervale-e03-preview.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in FILES+['RELEASE_INTEGRITY.json']:
        z.write(OUT/name,name)
print(f'PASS E03 allowlist: {len(FILES)} runtime files, no PNG master or other episode art/runtime')
