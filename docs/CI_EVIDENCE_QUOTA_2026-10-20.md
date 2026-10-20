# CI artifact quota and E03 guidance release — 2026-10-20

## Evidence and incident

After E03 active-load guide PR #107, the browser regression at head `11abf3852d6a8002bbc4604d8c59a329c2782c5d` passed all 22 E03 browser records; the job was nevertheless red solely because `actions/upload-artifact@v4` rejected evidence with `Artifact storage quota has been hit`. On the preceding commit, an actual E03 bookstall destination-pin overlap assertion failed as well, and was fixed by outward-anchoring the shop/tea labels and the garden label. The new head passes the real test; failures across E01/E02/MN4 were caused by the same storage-quota condition. See Actions run #39374904251 (E03) and #39374904252 (MN4 PR verification).

## Workflow contract

- E01, E02 and E03 *test results* (script exit codes) are mandatory. Evidence screenshot uploads are optional, now `continue-on-error: true`, with three-day retention for newly stored screenshots.
- Standalone E01/E02/E03 preview archives are optional and are not used by MN4 deployment; their upload errors do not override test success.
- MN4 package upload occurs **only on main**, where it remains fatal on failure, because `deploy-mn4` downloads that exact artifact and must not deploy absent or stale packages. The MN4 browser screenshot artifact remains optional with three-day retention.
- Do not claim an unavailable screenshot was reviewed. Browser assertions and Actions logs can still establish scripted pass/fail, while real physical device visual acceptance remains open.

## Follow-up

GitHub's artifact quota is a repository-level constraint; shortened retention only affects *new* artifacts and may not free existing used storage immediately. The repository maintainer should review/delete older unneeded CI artifacts from earlier workflow runs, preserving GitHub-tracked approvals and durable QA documents. Do **not** bypass the required MN4 deployment package or loosen its integrity/signed-host-key checks. Re-run PR #107 validation, merge only with real E01/E02/E03 pass, and require main deploy PASS before reporting a live E03 build.

E01/E02 game runtime and accepted C01 art are unchanged by this CI-only adjustment.
