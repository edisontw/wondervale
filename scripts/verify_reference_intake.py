"""Verify original candidate bytes; never grants creative approval."""
import argparse
import hashlib
import json
import struct
import zlib
from pathlib import Path


def verify_png(data):
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('PNG signature mismatch')
    offset = 8
    dimensions = None
    ended = False
    while offset < len(data):
        length = struct.unpack('>I', data[offset:offset + 4])[0]
        kind = data[offset + 4:offset + 8]
        payload = data[offset + 8:offset + 8 + length]
        end = offset + 12 + length
        if end > len(data):
            raise ValueError('truncated PNG chunk')
        crc = struct.unpack('>I', data[end - 4:end])[0]
        if zlib.crc32(kind + payload) & 0xffffffff != crc:
            raise ValueError('PNG CRC mismatch')
        if kind == b'IHDR':
            dimensions = list(struct.unpack('>II', payload[:8]))
        if kind == b'IEND':
            if length or end != len(data):
                raise ValueError('invalid IEND or trailing bytes')
            ended = True
        offset = end
    if not dimensions or not ended:
        raise ValueError('incomplete PNG')
    return dimensions


def verify(root, manifest):
    rows = []
    for asset in manifest['assets']:
        data = (root / asset['path']).read_bytes()
        actual = {
            'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest(),
            'git_blob': hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest(),
        }
        if asset['path'].endswith('.png'):
            actual['dimensions'] = verify_png(data)
        for key, value in actual.items():
            if asset[key] != value:
                raise ValueError(f"{asset['path']}: {key} mismatch")
        rows.append({'path': asset['path'], 'integrity': 'PASS', **actual})
    return rows


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('.'))
    parser.add_argument('--manifest', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps({'assets': verify(args.root, json.loads(args.manifest.read_text())),
                      'creative_approval': 'not_implied', 'runtime_tests_run': 0}, indent=2))
