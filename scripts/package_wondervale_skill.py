"""Validate and bundle the installable Wondervale ChatGPT Skill (stdlib only).

Usage: python3 scripts/package_wondervale_skill.py
The output ZIP is NOT an installed ChatGPT skill. Users install it through the
ChatGPT Skills UI when their account/workspace supports skill upload.
"""
from pathlib import Path
import hashlib
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "wondervale-episode-fast-lane"
OUT = ROOT / "dist" / "wondervale-episode-fast-lane.skill.zip"
REQUIRED = [
    "SKILL.md",
    "references/acceptance-gates.md",
    "references/media-handoff.md",
]
OPTIONAL = ["README.md"]


def build() -> int:
    missing = [name for name in REQUIRED if not (SKILL / name).is_file()]
    if missing:
        raise ValueError(f"Missing required Skill source files: {missing}")
    front = (SKILL / "SKILL.md").read_text(encoding="utf-8")
    if not (front.startswith("---\n") and "\nname: wondervale-episode-fast-lane\n" in front
            and "\ndescription:" in front and "\n---\n" in front):
        raise ValueError("Invalid skill YAML frontmatter")
    for target in ("references/acceptance-gates.md", "references/media-handoff.md"):
        if target not in front:
            raise ValueError(f"Missing reference link in SKILL.md: {target}")
    files = REQUIRED + [name for name in OPTIONAL if (SKILL / name).is_file()]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for filename in sorted(files):
            full = SKILL / filename
            if full.is_symlink():
                raise ValueError(f"Symlink not allowed in skill archive: {filename}")
            info = zipfile.ZipInfo(f"{SKILL.name}/{filename}", date_time=(2026, 10, 12, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, full.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    with zipfile.ZipFile(OUT) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files)
        assert all(s.startswith(SKILL.name + "/") for s in z.namelist())
    digest = hashlib.sha256(OUT.read_bytes()).hexdigest()
    print(f"PASS: {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes), SHA-256 {digest}")
    print(f"Files: {len(files)}; source in skills/wondervale-episode-fast-lane/")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(build())
    except (OSError, ValueError, AssertionError, zipfile.BadZipFile) as err:
        print(f"FAIL: {err}", file=sys.stderr)
        raise SystemExit(1)
