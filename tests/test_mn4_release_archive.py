"""Exercise the *actual* MN4 deploy script's embedded archive validators.

No /srv writes, SSH, symlink switch, or HTTP requests. Synthetic tarballs only.
"""
from __future__ import annotations

import ast
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = (ROOT / "scripts/mn4/deploy_e02.sh").read_text(encoding="utf-8")
EPISODES = (("e02", "s01e02", "$incoming"), ("e03", "s01e03", "$incoming_e03"))


def validator(archive_var: str) -> tuple[str, set[str]]:
    marker = 'python3 - "' + archive_var + '" "$stage" <<\'PY\'\n'
    assert SCRIPT.count(marker) == 1, "Expected exactly one remote archive validator"
    code = SCRIPT.split(marker, 1)[1].split("\nPY\n", 1)[0]
    match = re.search(r"(?ms)^allowed = \{(.*?)^\}", code)
    assert match, "Expected literal allowlist in remote validator"
    allowed = ast.literal_eval("{" + match.group(1) + "}")
    assert isinstance(allowed, set) and all(isinstance(x, str) for x in allowed)
    return code, allowed


def make_archive(path: Path, episode: str, allowed: set[str], *,
                 mutation: str | None = None) -> None:
    files = {name: ("synthetic:" + name).encode() for name in sorted(allowed)}
    manifest = {
        "episode": episode,
        "files": [
            {"path": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
            for name, data in files.items()
        ],
    }
    if mutation == "wrong_episode":
        manifest["episode"] = "s01e99"
    if mutation == "bad_manifest":
        manifest["files"][0]["sha256"] = "0" * 64
    if mutation == "extra_manifest":
        manifest["files"].append({"path": "unapproved.txt", "bytes": 1, "sha256": "0" * 64})
    if mutation == "tampered_bytes":
        first = sorted(files)[0]
        files[first] = b"tampered bytes"
    if mutation == "missing_member":
        files.pop(sorted(files)[0])
    with tarfile.open(path, "w:gz") as tar:
        for name, data in files.items():
            info = tarfile.TarInfo(name)
            if mutation == "symlink_member" and name == sorted(files)[0]:
                info.type = tarfile.SYMTYPE
                info.linkname = "../outside"
                tar.addfile(info)
            else:
                info.size = len(data)
                tar.addfile(info, io.BytesIO(data))
        data = json.dumps(manifest).encode()
        info = tarfile.TarInfo("RELEASE_INTEGRITY.json")
        info.size = len(data)
        tar.addfile(info, io.BytesIO(data))
        if mutation in {"unexpected_member", "traversal_member", "duplicate_member"}:
            if mutation == "unexpected_member":
                name = "unapproved.txt"
            elif mutation == "traversal_member":
                name = "../escape.txt"
            else:
                name = sorted(files)[0]
            data = b"extra"
            info = tarfile.TarInfo(name)
            info.size = len(data)
            tar.addfile(info, io.BytesIO(data))


class ReleaseArchiveGuards(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.validators = {key: validator(var) for key, _, var in EPISODES}
        assert len(cls.validators["e02"][1]) == 9
        assert len(cls.validators["e03"][1]) == 10

    def check(self, mutation: str | None, expected_success: bool):
        for key, episode, _ in EPISODES:
            with self.subTest(episode=key, mutation=mutation):
                code, allowed = self.validators[key]
                with tempfile.TemporaryDirectory() as tmp:
                    archive = Path(tmp) / "release.tar.gz"
                    stage = Path(tmp) / "stage"
                    stage.mkdir()
                    make_archive(archive, episode, allowed, mutation=mutation)
                    run = subprocess.run(
                        [sys.executable, "-c", code, str(archive), str(stage)],
                        capture_output=True, text=True, timeout=10, check=False,
                    )
                    if expected_success:
                        self.assertEqual(run.returncode, 0, run.stderr + run.stdout)
                    else:
                        self.assertNotEqual(run.returncode, 0, "Validator accepted " + mutation)

    def test_valid_synthetic_archives(self):
        self.check(None, True)

    def test_rejects_tampered_bytes(self):
        self.check("tampered_bytes", False)

    def test_rejects_bad_manifest_hash(self):
        self.check("bad_manifest", False)

    def test_rejects_extra_manifest_entry(self):
        self.check("extra_manifest", False)

    def test_rejects_wrong_episode(self):
        self.check("wrong_episode", False)

    def test_rejects_missing_member(self):
        self.check("missing_member", False)

    def test_rejects_unexpected_member(self):
        self.check("unexpected_member", False)

    def test_rejects_traversal_member(self):
        self.check("traversal_member", False)

    def test_rejects_duplicate_member(self):
        self.check("duplicate_member", False)

    def test_rejects_symlink_member(self):
        self.check("symlink_member", False)


if __name__ == "__main__":
    unittest.main()
