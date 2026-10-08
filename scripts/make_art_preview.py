#!/usr/bin/env python3
"""Generate a low-resolution REVIEW preview and metadata from an already-committed PNG.
The original file is never modified. This is transport/inspection QA only.
"""
from __future__ import annotations

import hashlib
import json
import pathlib
import subprocess
from datetime import datetime, timezone

from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/reference-candidates/s01e01/s01e01-trio-neutral-candidate-01.png"
OUT = SOURCE.parent / ".review"
PREVIEW = OUT / "trio-neutral-preview-512.jpg"
METADATA = OUT / "trio-neutral-metadata.json"
Image.MAX_IMAGE_PIXELS = 36_000_000


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Source image not found: {SOURCE.relative_to(ROOT)}")
    data = SOURCE.read_bytes()
    if len(data) < 2000 or len(data) > 20_000_000:
        raise SystemExit(f"Implausible source size: {len(data)}")
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise SystemExit("Expected real PNG signature, not renamed JPEG/other file")
    try:
        with Image.open(SOURCE) as im:
            im.verify()
        with Image.open(SOURCE) as im:
            if im.format != "PNG":
                raise SystemExit(f"Wrong format: {im.format}")
            width, height = im.size
            if min(width, height) < 512 or max(width, height) > 12000:
                raise SystemExit(f"Invalid reference source dimensions {width}x{height}")
            clean = ImageOps.exif_transpose(im).convert("RGB")
            clean.thumbnail((640, 640), Image.Resampling.LANCZOS)
            OUT.mkdir(parents=True, exist_ok=True)
            clean.save(PREVIEW, "JPEG", quality=76, optimize=True, progressive=False)
    except (UnidentifiedImageError, OSError, ValueError) as e:
        raise SystemExit(f"Image decode/verification failed: {e}") from e

    blob = subprocess.check_output(["git", "hash-object", str(SOURCE)], cwd=ROOT, text=True).strip()
    record = {
        "schema": "wondervale-reference-image-preview-v1",
        "source_path": SOURCE.relative_to(ROOT).as_posix(),
        "source_format": "PNG",
        "source_width": width,
        "source_height": height,
        "source_bytes": len(data),
        "source_sha256": hashlib.sha256(data).hexdigest(),
        "source_git_blob_sha": blob,
        "preview_path": PREVIEW.relative_to(ROOT).as_posix(),
        "preview_width": clean.width,
        "preview_height": clean.height,
        "preview_bytes": PREVIEW.stat().st_size,
        "preview_sha256": hashlib.sha256(PREVIEW.read_bytes()).hexdigest(),
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "visual_art_approved": False,
        "comment": "Source untouched; preview is for human/art QA, not game assets."
    }
    METADATA.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
