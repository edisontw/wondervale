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
    if "e02/index.html" in files:
        files["e02/index.html"] = b"<h1>The Bridge That Stops</h1>"
    if "e03/index.html" in files:
        files["e03/index.html"] = b"<h1>Three Deliveries, One Wrong Turn</h1>"
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



class ReleaseRollbackGuards(unittest.TestCase):
    """Run the real deploy script inside a disposable root with mocked HTTPS.

    No /srv paths, network, SSH, or real host changes are permitted.
    """

    SHA = "a" * 40

    def fixture(self, root: Path, *, e03_mutation: str | None = None):
        for directory in ("incoming", "releases", "bin"):
            (root / directory).mkdir()
        baseline = root / "releases/accepted-e01"
        baseline.mkdir()
        base_files = {
            "index.html": b"<h1>Frozen E01</h1>",
            "engine/episode.mjs": b"// frozen E01 engine",
        }
        base_files.update({
            f"public/frozen-{i:02d}.txt": f"e01-{i}".encode()
            for i in range(10)
        })
        for name, data in base_files.items():
            target = baseline / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        (baseline / "RELEASE_INTEGRITY.json").write_text(json.dumps({
            "build": "synthetic-frozen-e01",
            "files": [
                {"path": name, "bytes": len(data),
                 "sha256": hashlib.sha256(data).hexdigest()}
                for name, data in base_files.items()
            ],
        }))
        previous = root / "releases/previous-composite"
        previous.mkdir()
        (previous / "sentinel.txt").write_text("must survive rollback")
        (root / "current").symlink_to(previous, target_is_directory=True)
        (root / "e01-baseline").symlink_to(baseline, target_is_directory=True)
        for key, episode, var in EPISODES:
            _, allowed = validator(var)
            make_archive(root / f"incoming/{key}-{self.SHA}.tar.gz",
                         episode, allowed,
                         mutation=e03_mutation if key == "e03" else None)
        fake_curl = root / "bin/curl"
        fake_curl.write_text(
            "#!/usr/bin/env python3\n"
            "import os, pathlib, sys, urllib.parse\n"
            "args = sys.argv[1:]\n"
            "url = next(x for x in args if x.startswith('https://'))\n"
            "path = urllib.parse.urlparse(url).path\n"
            "if path == os.environ.get('FAKE_FAIL_PATH'): sys.exit(22)\n"
            "relative = path.lstrip('/')\n"
            "if path.endswith('/'): relative += 'index.html'\n"
            "src = (pathlib.Path(os.environ['FAKE_ROOT']) / 'current').resolve() / relative\n"
            "if not src.is_file(): sys.exit(22)\n"
            "pathlib.Path(args[args.index('-o') + 1]).write_bytes(src.read_bytes())\n"
        )
        fake_curl.chmod(0o755)
        marker = "root=/srv/wondervale\n"
        self.assertEqual(SCRIPT.count(marker), 1, "Unexpected remote root declaration")
        test_script = root / "isolated-deploy.sh"
        test_script.write_text(SCRIPT.replace(marker, f"root={root}\n"))
        env = dict(__import__("os").environ)
        env["PATH"] = str(root / "bin") + __import__("os").pathsep + env["PATH"]
        env["FAKE_ROOT"] = str(root)
        return test_script, env, previous, baseline, base_files

    def execute(self, root: Path, *, fail_path: str | None = None,
                e03_mutation: str | None = None):
        script, env, previous, baseline, base_files = self.fixture(
            root, e03_mutation=e03_mutation)
        if fail_path is not None:
            env["FAKE_FAIL_PATH"] = fail_path
        result = subprocess.run(
            ["bash", str(script), self.SHA, self.SHA],
            capture_output=True, text=True, timeout=25, check=False, env=env,
        )
        return result, previous, baseline, base_files

    def test_late_e03_https_failure_restores_previous_symlink(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            result, previous, baseline, base_files = self.execute(
                root, fail_path="/e03/")
            self.assertNotEqual(result.returncode, 0, result.stdout)
            self.assertIn("Rolled back current", result.stderr)
            self.assertEqual((root / "current").resolve(), previous)
            self.assertEqual((previous / "sentinel.txt").read_text(),
                             "must survive rollback")
            for name, data in base_files.items():
                self.assertEqual((baseline / name).read_bytes(), data)

    def test_success_promotes_composite_with_frozen_e01_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            result, previous, baseline, base_files = self.execute(root)
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            promoted = root / "releases" / (self.SHA + "-e02")
            self.assertEqual((root / "current").resolve(), promoted)
            self.assertTrue((promoted / "e03/main.mjs").is_file())
            self.assertTrue((previous / "sentinel.txt").is_file())
            for name, data in base_files.items():
                self.assertEqual((promoted / name).read_bytes(), data)
                self.assertEqual((baseline / name).read_bytes(), data)
            self.assertFalse((root / f"incoming/e02-{self.SHA}.tar.gz").exists())
            self.assertFalse((root / f"incoming/e03-{self.SHA}.tar.gz").exists())

    def test_invalid_e03_archive_cannot_switch_current(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            result, previous, _, _ = self.execute(
                root, e03_mutation="tampered_bytes")
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual((root / "current").resolve(), previous)
            self.assertFalse((root / "releases" / (self.SHA + "-e02")).exists())



if __name__ == "__main__":
    unittest.main()
