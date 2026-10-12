"""Verify exact bytes of owner-PASS E02 Riverside PNG source media and WebP derivatives.

Execute from a checked-out repository root AFTER binary upload:
    python3 scripts/verify_e02_art_intake.py
Missing files intentionally fail. This is not automatically run by E01 CI while
image media is awaiting the user-assisted GitHub transfer.
"""
from pathlib import Path
import hashlib
import json
import struct
import sys
import zlib

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json"
rows = json.loads(MANIFEST.read_text(encoding="utf-8"))["assets"]
failures = []

for row in rows:
    f = ROOT / row["path"]
    if not f.is_file():
        failures.append(f"MISSING {row['path']}")
        continue
    b = f.read_bytes()
    h = hashlib.sha256(b).hexdigest()
    git_blob = hashlib.sha1(f"blob {len(b)}\0".encode() + b).hexdigest()
    if len(b) != row["bytes"] or h != row["sha256"] or git_blob != row["git_blob"]:
        failures.append(f"HASH_OR_SIZE_MISMATCH {row['path']}")
        continue
    if row["format"] == "png":
        if b[:8] != b"\x89PNG\r\n\x1a\n":
            failures.append(f"BAD_PNG {row['path']}")
            continue
        if list(struct.unpack(">II", b[16:24])) != row["dimensions"]:
            failures.append(f"DIMENSION_MISMATCH {row['path']}")
            continue
        off = 8
        try:
            while off < len(b):
                size = struct.unpack(">I", b[off:off+4])[0]
                chunk = b[off+4:off+8]
                data = b[off+8:off+8+size]
                crc = struct.unpack(">I", b[off+8+size:off+12+size])[0]
                assert zlib.crc32(chunk + data) & 0xffffffff == crc
                off += size + 12
                if chunk == b"IEND":
                    break
            assert off == len(b)
        except (AssertionError, ValueError, struct.error):
            failures.append(f"BAD_PNG_CRC {row['path']}")
            continue
    elif row["format"] == "webp":
        if not (b[:4] == b"RIFF" and b[8:12] == b"WEBP"):
            failures.append(f"BAD_WEBP {row['path']}")
            continue
    print(f"PASS {row['path']} {len(b)} B {git_blob}")

if failures:
    for msg in failures:
        print(msg, file=sys.stderr)
    sys.exit(1)
print(f"PASS: {len(rows)} Wondervale E02 assets match the accepted original images and derivatives.")
