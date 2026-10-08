"""Check committed source originals and runtime derivatives against exact-byte intake."""
from pathlib import Path
import hashlib,json,struct,zlib
root=Path(__file__).resolve().parents[1]
items=json.loads((root/'assets/production-candidates/s01e01/PRODUCTION_INTEGRITY.json').read_text())['assets']
for item in items:
 b=(root/item['path']).read_bytes()
 assert len(b)==item['bytes'],item['path']
 assert hashlib.sha256(b).hexdigest()==item['sha256'],item['path']
 assert hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()==item['git_blob'],item['path']
 if item['path'].endswith('.png'):
  assert b[:8]==b'\x89PNG\r\n\x1a\n';assert list(struct.unpack('>II',b[16:24]))==item['dimensions']
  offset=8
  while offset<len(b):
   size=struct.unpack('>I',b[offset:offset+4])[0];chunk=b[offset+4:offset+8];data=b[offset+8:offset+8+size];crc=struct.unpack('>I',b[offset+8+size:offset+12+size])[0]
   assert zlib.crc32(chunk+data)&0xffffffff==crc,item['path'];offset+=size+12
   if chunk==b'IEND':break
  assert offset==len(b),item['path']
 print('PASS',item['path'],len(b),item['git_blob'])
print(f'{len(items)} production source/derivative files match original bytes and Git hashes.')
