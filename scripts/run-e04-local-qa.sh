#!/usr/bin/env bash
# E04 engineering-only local QA; no deployment or production episode activation.
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

for tool in node python3; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    printf 'Missing required tool: %s\n' "$tool" >&2
    exit 2
  fi
done

printf 'Running E03→E04 handoff and E04 engine/UI unit tests (Node %s)\n' "$(node --version)"
node --test \
  tests/s01e03-e04-handoff.test.mjs \
  tests/s01e04-chronology.test.mjs \
  tests/s01e04-authoring-ui.test.mjs

# Useful when GitHub-hosted runners are unavailable and the checkout has no
# Playwright installation. This is explicitly NOT a browser/CI PASS.
if [[ "${E04_QA_UNIT_ONLY:-0}" == "1" ]]; then
  printf 'E04 Node unit tests: PASS; Chromium NOT RUN (E04_QA_UNIT_ONLY=1)\n'
  exit 0
fi

if ! node -e "import('playwright').catch(() => process.exit(2))" >/dev/null 2>&1; then
  printf 'E04 Node tests passed, but Chromium QA NOT RUN: Playwright is missing.\n' >&2
  printf 'Install it with: npm install --ignore-scripts --package-lock=false\n' >&2
  exit 2
fi

# Only full browser QA needs a Chromium executable.
if [[ -z "${E04_CHROMIUM_EXECUTABLE:-}" ]]; then
  if command -v chromium >/dev/null 2>&1; then
    export E04_CHROMIUM_EXECUTABLE="$(command -v chromium)"
  elif command -v chromium-browser >/dev/null 2>&1; then
    export E04_CHROMIUM_EXECUTABLE="$(command -v chromium-browser)"
  fi
fi
if [[ -n "${E04_CHROMIUM_EXECUTABLE:-}" && ! -x "$E04_CHROMIUM_EXECUTABLE" ]]; then
  printf 'Chromium executable is not executable: %s\n' "$E04_CHROMIUM_EXECUTABLE" >&2
  exit 2
fi

# Avoid connecting to a stale or unrelated server on the default port.
port="${E04_QA_PORT:-4173}"
if [[ ! "$port" =~ ^[0-9]+$ ]] || ((10#$port < 1024 || 10#$port > 65535)); then
  printf 'E04_QA_PORT must be an integer from 1024 to 65535.\n' >&2
  exit 2
fi
log_file="$(mktemp)"
server_pid=''
cleanup() {
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  rm -f -- "$log_file"
}
trap cleanup EXIT

python3 -m http.server "$port" --bind 127.0.0.1 --directory "$repo_root" >"$log_file" 2>&1 &
server_pid=$!
ready=0
for attempt in {1..40}; do
  if ! kill -0 "$server_pid" 2>/dev/null; then
    printf 'Local test server exited unexpectedly:\n' >&2
    cat "$log_file" >&2
    exit 1
  fi
  if E04_QA_URL="http://127.0.0.1:$port/package.json" node -e \
    "fetch(process.env.E04_QA_URL).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
    >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 0.25
done
if ((ready != 1)); then
  printf 'Local E04 test server did not become ready:\n' >&2
  cat "$log_file" >&2
  exit 1
fi

printf 'Running real Chromium E04 responsive, keyboard, save/replay QA\n'
TEST_BASE_URL="http://127.0.0.1:$port" node tests/s01e04-browser.mjs
printf 'E04 local Node and Chromium QA: PASS (engineering preview only; no MN4 deployment)\n'
