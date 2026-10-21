#!/usr/bin/env bash
# Prune old, reproducible GitHub Actions evidence only; never delete release packages.
# Operates on the single expected repository. Review deletions in Actions job logs.
set -Eeuo pipefail

mode="${1:---dry-run}"
case "$mode" in --dry-run|--apply) ;; *) echo "Usage: $0 [--dry-run|--apply]" >&2; exit 2;; esac

: "${GH_REPO:?GH_REPO must be provided by Actions}"
[[ "$GH_REPO" == "edisontw/wondervale" ]] || {
  echo "Refusing repository other than edisontw/wondervale" >&2; exit 2;
}
if [[ "$mode" == "--apply" ]]; then
  [[ "${GITHUB_REF:-}" == "refs/heads/main" && "${GITHUB_EVENT_NAME:-}" != "pull_request" ]] || {
    echo "Deleting artifacts is permitted only on main outside pull requests" >&2; exit 2;
  }
fi
command -v gh >/dev/null || { echo "GitHub CLI is required" >&2; exit 2; }
: "${GH_TOKEN:?GH_TOKEN must be provided by GitHub Actions}"
cutoff="$(date -u -d '4 days ago' +%s)"
file="$(mktemp)"
trap 'rm -f -- "$file"' EXIT
# Fail closed on API/pagination errors rather than acting on an incomplete list.
gh api --paginate "repos/${GH_REPO}/actions/artifacts?per_page=100" \
  --jq '.artifacts[]? | [.id, .name, .created_at, .size_in_bytes, .expired] | @tsv' > "$file"

matched=0
deleted=0
skipped=0
while IFS=$'\t' read -r id name created_at bytes expired; do
  # This exact allowlist deliberately EXCLUDES all *package* / deploy-transfer
  # artifacts, preview distribution ZIPs, and unrelated repository artifacts.
  case "$name" in
    e01-runtime-evidence|e02-vertical-slice-evidence|e03-engineering-evidence|\
wondervale-mn4-e02-e03-browser-evidence|wondervale-mn4-e01-browser-evidence|\
e03-market-r2-visual-qa|e03-bookstall-independent-r1-qa)
      ;;
    *) continue ;;
  esac
  [[ "$id" =~ ^[0-9]+$ && "$bytes" =~ ^[0-9]+$ ]] || {
    echo "Malformed artifact id/size; refusing cleanup" >&2; exit 1;
  }
  [[ "$expired" == "false" ]] || { skipped=$((skipped+1)); continue; }
  timestamp="$(date -u -d "$created_at" +%s)"
  (( timestamp < cutoff )) || { skipped=$((skipped+1)); continue; }
  matched=$((matched+1))
  echo "$mode: eligible id=$id name=$name bytes=$bytes created=$created_at"
  if [[ "$mode" == "--apply" ]]; then
    # Bound destructive operations per run and never modify other artifacts.
    if (( deleted >= 150 )); then
      echo "Deletion cap of 150 reached; later maintenance runs will continue"
      break
    fi
    gh api --method DELETE "repos/${GH_REPO}/actions/artifacts/$id" >/dev/null
    deleted=$((deleted+1))
  fi
done < "$file"
echo "Evidence cleanup: mode=$mode eligible=$matched deleted=$deleted skipped=$skipped"
echo "Mandatory MN4 package artifacts were never deletion candidates."
