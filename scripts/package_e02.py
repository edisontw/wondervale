"""Package S01E02 first-playable preview in a separate static archive.

Does not modify or replace the accepted E01 runtime/release.
"""
from pathlib import Path
import hashlib, json, shutil, zipfile
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist/wondervale-e02-preview'
if OUT.exists():shutil.rmtree(OUT)
manifest=json.loads((ROOT/'assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json').read_text())
assert manifest['status'].startswith('media_uploaded_verified'),"E02 art upload not verified"
webps=sorted(x['path'] for x in manifest['assets'] if x['path'].endswith('.webp'))
assert len(webps)==3
files=['e02/index.html','e02/style.css','e02/main.mjs','engine/s01e02.mjs','public/s01e02.json','public/art/trio-sprites.webp']+webps
assert len(files)==len(set(files))
artifact={'episode':'s01e02','status':'ENGINEERING_PREVIEW_NOT_DEPLOYED','files':[]}
for name in files:
    src=ROOT/name
    assert src.is_file(),name
    dest=OUT/name
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(src,dest)
    b=src.read_bytes()
    artifact['files'].append({'path':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
(OUT/'RELEASE_INTEGRITY.json').write_text(json.dumps(artifact,indent=2)+'\n')
zpath=ROOT/'dist/wondervale-e02-preview.zip'
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(OUT.rglob('*')):
        if f.is_file():z.write(f,f.relative_to(OUT))
assert all('s01e01' not in item['path'] for item in artifact['files'])
print('PASS E02 standalone package:',len(files),'files,',sum(x['bytes'] for x in artifact['files']),'bytes; no E01 runtime overwritten')
