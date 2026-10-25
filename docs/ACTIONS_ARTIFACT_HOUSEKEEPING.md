# GitHub Actions artifact quota recovery

**Status (2026-10-22):** housekeeping mechanism prepared for P0 [#110](https://github.com/edisontw/wondervale/issues/110). **Do not mark #110 resolved until a main-run mandatory release-package upload and MN4 deployment actually PASS.**

## Evidence and scope

Recent PR #107 CI succeeded at browser/source tests but all screenshot evidence uploads returned `Artifact storage quota has been hit`. A previous MN4 run produced a required `wondervale-mn4-e02-e03-package` (~2.4 MB) and optional `wondervale-mn4-e02-e03-browser-evidence` (~7.8 MB), demonstrating that repeated QA evidence may consume more storage than the release transfer package.

GitHub Actions artifacts are account/repository storage assets; deleting them is irreversible. This maintenance is **limited to exact-name, reproducible evidence artifacts in `edisontw/wondervale` older than four days**. It never removes a run, workflow log, deployed release, original media, repository source, packages, or a mandatory transfer artifact. Artifacts in another repository/account are outside its scope.

## Implementation

- `scripts/prune_actions_evidence.sh` uses the GitHub CLI REST API and requires exact `GH_REPO=edisontw/wondervale`. The script defaults to `--dry-run`; `--apply` is refused outside `refs/heads/main` or in a PR. All REST pagination must succeed before deletion.
- Exact cleanup allowlist: `e01-runtime-evidence`, `e02-vertical-slice-evidence`, `e03-engineering-evidence`, `wondervale-mn4-e02-e03-browser-evidence`, `wondervale-mn4-e01-browser-evidence`, `e03-market-r2-visual-qa`, `e03-bookstall-independent-r1-qa`.
- Never delete `wondervale-mn4-e02-e03-package`, `wondervale-mn4-e01-package`, `wondervale-e02-preview`, `wondervale-e03-preview`, any unknown artifact or another repository's data. Max **150** deletions per cleanup run. Each deletion is logged by ID, name, byte size and creation time; any API deletion error causes a failed job.
- `.github/workflows/wondervale-evidence-housekeeping.yml`: on PR, only syntax/policy check with read-only permission; only on **main** via the workflow merge push, manual dispatch, or daily schedule does a separate Actions-write cleanup job run. No SSH/deploy secrets in this workflow.
- The separate `wondervale-mn4-auto-deploy.yml` remains **unchanged**: its required release artifact, strict E02/E03 package/remote allowlists, E01 byte isolation, HTTPS checks and rollback remain mandatory/fail closed.

## Actual closure check (must be observed; not assumed)

1. Inspect the housekeeping Actions run on main; require a PASS and a deletion summary. A zero-deletion PASS is **not** proof that storage is recovered. No artifact deletion has occurred merely by merging docs/code.
2. GitHub reports Actions artifact-storage usage with a delay that can take several hours; observe the change before assuming uploads will work. If this repository's cleanup is insufficient, review the account-wide storage/other repos and billing; this script deliberately does not delete other projects' artifacts.
3. Rerun/verify the package workflow using the **current main SHA**. Confirm `wondervale-mn4-e02-e03-package` was truly uploaded and downloadable, not just tar-created on the job runner.
4. Then only merge/retest PR #107 with fresh CI, main deployment and HTTPS/live verification. A PR check PASS or a skipped PR deployment is not proof of deployed E03 functionality.
5. Keep owner phone/device inspection and full E03 Gate 3/4 OPEN until independently verified.

**References:** [GitHub artifact deletion](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/remove-workflow-artifacts), [GitHub Actions billing/storage](https://docs.github.com/en/billing/concepts/product-billing/github-actions).