"""Byte-exact media integrity verifier for Wondervale episodes.

Usage:
    python3 scripts/verify_episode_media.py
    python3 scripts/verify_episode_media.py --manifest assets/production-candidates/s01e02/PRODUCTION_INTAKE_PENDING.json

The default scans the checked-out repository for episode intake manifests.
This is FAST art QA, not a browser, visual-identity or gameplay test.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys
import zlib

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_NAMES = ("PRODUCTION_INTEGRITY.json", "PRODUCTION_INTAKE_PENDING.json")


def dimensions_png(data: bytes) -> tuple[int, int]:
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("bad PNG signature")
    if len(data) < 33 or data[12:16] != b"IHDR":
        raise ValueError("missing PNG IHDR")
    dims = struct.unpack(">II", data[16:24])
    offset, found_end = 8, False
    while offset + 12 <= len(data):
        size = struct.unpack(">I", data[offset:offset + 4])[0]
        end = offset + 12 + size
        if end > len(data):
            raise ValueError("truncated PNG chunk")
        kind = data[offset + 4:offset + 8]
        payload = data[offset + 8:offset + 8 + size]
        crc = struct.unpack(">I", data[offset + 8 + size:end])[0]
        if zlib.crc32(kind + payload) & 0xFFFFFFFF != crc:
            raise ValueError(f"PNG CRC failed: {kind!r}")
        offset = end
        if kind == b"IEND":
            found_end = True
            break
    if not found_end or offset != len(data):
        raise ValueError("PNG IEND missing or trailing bytes")
    return dims


def dimensions_webp(data: bytes) -> tuple[int, int]:
    if len(data) < 30 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("bad WebP RIFF header")
    if struct.unpack("<I", data[4:8])[0] + 8 != len(data):
        raise ValueError("WebP RIFF length mismatch")
    offset = 12
    while offset + 8 <= len(data):
        fourcc = data[offset:offset + 4]
        size = struct.unpack("<I", data[offset + 4:offset + 8])[0]
        end = offset + 8 + size + (size & 1)
        if end > len(data):
            raise ValueError("truncated WebP chunk")
        payload = data[offset + 8:offset + 8 + size]
        if fourcc == b"VP8X":
            if len(payload) < 10:
                raise ValueError("short WebP VP8X header")
            return (int.from_bytes(payload[4:7], "little") + 1,
                    int.from_bytes(payload[7:10], "little") + 1)
        if fourcc == b"VP8 ":
            if len(payload) < 10 or payload[3:6] != b"\x9d\x01\x2a":
                raise ValueError("bad WebP VP8 frame header")
            return (int.from_bytes(payload[6:8], "little") & 0x3FFF,
                    int.from_bytes(payload[8:10], "little") & 0x3FFF)
        if fourcc == b"VP8L":
            if len(payload) < 5 or payload[0] != 0x2F:
                raise ValueError("bad WebP VP8L frame header")
            b0, b1, b2, b3 = payload[1:5]
            return (1 + (b0 | ((b1 & 0x3F) << 8)),
                    1 + (((b1 & 0xC0) >> 6) | (b2 << 2) | ((b3 & 0x0F) << 10)))
        offset = end
    raise ValueError("WebP contains no supported VP8/VP8L/VP8X frame")


def verify_manifest(path: Path) -> int:
    manifest = json.loads(path.read_text(encoding="utf-8"))
    rows = manifest["assets"]
    if not rows:
        raise ValueError("empty asset manifest")
    failures: list[str] = []
    for item in rows:
        name = item["path"]
        target = (ROOT / name).resolve()
        if not target.is_relative_to(ROOT.resolve()):
            failures.append(f"INVALID_PATH {name}")
            continue
        if not target.is_file():
            failures.append(f"MISSING {name}")
            continue
        data = target.read_bytes()
        got_sha256 = hashlib.sha256(data).hexdigest()
        got_git_sha = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
        if (len(data) != item["bytes"] or
                got_sha256 != item["sha256"] or
                got_git_sha != item["git_blob"]):
            failures.append(f"SIZE_OR_HASH_MISMATCH {name}")
            continue
        try:
            fmt = item.get("format", Path(name).suffix.removeprefix(".")).lower()
            if fmt == "png":
                got_dims = dimensions_png(data)
            elif fmt == "webp":
                got_dims = dimensions_webp(data)
            else:
                raise ValueError(f"unsupported media format {fmt}")
            if tuple(item["dimensions"]) != got_dims:
                raise ValueError(f"image dimensions {got_dims} != {item['dimensions']}")
        except (ValueError, struct.error) as exc:
            failures.append(f"MEDIA_INVALID {name}: {exc}")
            continue
        print(f"PASS {name} [{got_dims[0]}x{got_dims[1]}] {len(data)} B")
    if failures:
        for fail in failures:
            print("FAIL " + fail, file=sys.stderr)
        raise ValueError(f"{len(failures)} / {len(rows)} media files failed in {path}")
    print(f"PASS manifest {path.relative_to(ROOT)}: {len(rows)} exact-byte files")
    return len(rows)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", action="append", type=Path,
                        help="Manifest relative to repository root; default: discover all episode manifests")
    args = parser.parse_args()
    if args.manifest:
        manifests = [p if p.is_absolute() else ROOT / p for p in args.manifest]
    else:
        manifests = sorted(p for episode in (ROOT / "assets/production-candidates").iterdir()
                           if episode.is_dir() for n in MANIFEST_NAMES
                           if (p := episode / n).exists())
    if not manifests:
        print("FAIL no production image manifests found", file=sys.stderr)
        return 1
    try:
        count = sum(verify_manifest(p) for p in manifests)
    except (ValueError, OSError, KeyError, TypeError, json.JSONDecodeError) as exc:
        print(f"FAIL {exc}", file=sys.stderr)
        return 1
    print(f"PASS: {count} image originals / derivatives across {len(manifests)} manifests.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
