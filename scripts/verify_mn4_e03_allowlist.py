"""Fail CI when E03 local package files disagree with the strict MN4 SSH allowlist.

This static contract test intentionally reads source without importing the packager
(which would write release artifacts) or weakening remote tar member validation.
"""
from __future__ import annotations

import ast
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
package = (ROOT / "scripts/package_e03.py").read_text(encoding="utf-8")
remote = (ROOT / "scripts/mn4/deploy_e02.sh").read_text(encoding="utf-8")

tree = ast.parse(package)
assignments = [
    node for node in tree.body
    if isinstance(node, ast.Assign)
    and any(isinstance(target, ast.Name) and target.id == "FILES"
            for target in node.targets)
]
if len(assignments) != 1:
    raise SystemExit("FAIL: exactly one literal E03 FILES list is required")
local_files = ast.literal_eval(assignments[0].value)
if not isinstance(local_files, list) or len(local_files) != len(set(local_files)):
    raise SystemExit("FAIL: E03 FILES must be a unique literal list")

start = remote.find('if [[ -n "$e03sha" ]]; then')
if start < 0:
    raise SystemExit("FAIL: E03 remote deployment block missing")
match = re.search(r"(?m)^allowed = \{(?P<items>.*?)^\}", remote[start:], re.S)
if not match:
    raise SystemExit("FAIL: E03 remote allowed set not found")
remote_files = ast.literal_eval("{" + match.group("items") + "}")
if not isinstance(remote_files, set):
    raise SystemExit("FAIL: remote E03 allowlist must be a literal set")

actual = set(local_files)
if actual != remote_files:
    raise SystemExit(
        "FAIL E03/MN4 allowlist mismatch: "
        f"not allowed remotely={sorted(actual - remote_files)}, "
        f"missing from package={sorted(remote_files - actual)}"
    )
if any("route-review" in item or "route-depth" in item or "m1-candidate" in item
       for item in actual):
    raise SystemExit("FAIL: E03 review-only files cannot enter runtime archive")
print(f"PASS: E03 packager and strict MN4 remote allowlist match ({len(actual)} files)")
