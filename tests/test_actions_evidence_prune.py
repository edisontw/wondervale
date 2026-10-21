"""Offline regression for bounded Actions evidence housekeeping."""
from datetime import datetime, timedelta, timezone
from pathlib import Path
import os
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "prune_actions_evidence.sh"


class PruneActionsEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name)
        self.mock_gh = self.path / "gh"
        self.mock_gh.write_text(
            '#!/usr/bin/env bash\n'
            'set -euo pipefail\n'
            'if [[ "$1" == "api" && "$2" == "--paginate" ]]; then\n'
            '  cat "$GH_MOCK_TSV"\n'
            'elif [[ "$1" == "api" && "$2" == "--method" && "$3" == "DELETE" ]]; then\n'
            '  printf "%s\\n" "$4" >> "$GH_MOCK_DELETIONS"\n'
            'else\n'
            '  echo "Unexpected gh API request" >&2; exit 3\n'
            'fi\n'
        )
        self.mock_gh.chmod(0o755)
        self.tsv = self.path / "artifacts.tsv"
        self.deletes = self.path / "deleted.txt"
        old = (datetime.now(timezone.utc) - timedelta(days=8)).strftime("%Y-%m-%dT%H:%M:%SZ")
        recent = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
        self.tsv.write_text(
            f"101\\te03-engineering-evidence\\t{old}\\t9000\\tfalse\n"
            f"102\\twondervale-mn4-e02-e03-package\\t{old}\\t9000\\tfalse\n"
            f"103\\te03-engineering-evidence\\t{recent}\\t9000\\tfalse\n"
            f"104\\tunknown-artifact\\t{old}\\t9000\\tfalse\n"
            f"105\\twondervale-mn4-e02-e03-browser-evidence\\t{old}\\t1000\\tfalse\n"
        )
        self.env = dict(
            os.environ,
            PATH=f"{self.path}:{os.environ['PATH']}",
            GH_REPO="edisontw/wondervale",
            GH_TOKEN="mock-token",
            GITHUB_REF="refs/heads/main",
            GITHUB_EVENT_NAME="push",
            GH_MOCK_TSV=str(self.tsv),
            GH_MOCK_DELETIONS=str(self.deletes),
        )

    def invoke(self, mode, **updates):
        return subprocess.run(["bash", str(SCRIPT), mode],
                              env={**self.env, **updates},
                              text=True, capture_output=True, check=False)

    def test_dry_run_does_not_delete(self):
        result = self.invoke("--dry-run")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("eligible=2 deleted=0", result.stdout)
        self.assertFalse(self.deletes.exists())

    def test_apply_rejects_pull_request_and_wrong_repository(self):
        pr = self.invoke("--apply", GITHUB_EVENT_NAME="pull_request")
        self.assertEqual(pr.returncode, 2)
        wrong = self.invoke("--apply", GH_REPO="someone/else")
        self.assertEqual(wrong.returncode, 2)
        self.assertFalse(self.deletes.exists())

    def test_apply_deletes_only_old_allowlisted_evidence(self):
        result = self.invoke("--apply")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("eligible=2 deleted=2", result.stdout)
        paths = self.deletes.read_text().splitlines()
        self.assertEqual(paths, [
            "repos/edisontw/wondervale/actions/artifacts/101",
            "repos/edisontw/wondervale/actions/artifacts/105",
        ])


if __name__ == "__main__":
    unittest.main()
