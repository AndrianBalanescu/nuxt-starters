#!/usr/bin/env bash
# ==============================================================================
# run-suite.sh — ohnuxt QA runner (iBrowse bridge)
#
# Enqueues every JSON test config in this directory as an iBrowse run
# (preset + target URL + goal/checks), polls each job to a terminal status,
# and aggregates a pass/fail summary. Exits non-zero if any run does not
# reach `succeeded`.
#
#   Usage:
#     IBROWSE_API_KEY=sk_live_... ./run-suite.sh            # run everything
#     QA_DRY_RUN=1 ./run-suite.sh                           # print payloads only
#     QA_BASE_URL=http://172.17.0.1:3333 ./run-suite.sh     # override target
#
# Contract (from the iBrowse skill, live-verified):
#   POST {base}/v1/runs            {preset, url, goal?, timeout?}
#     -> {"job_id","execution_id","status":"queued"}
#   GET  {base}/v1/runs/{job_id}   poll every QA_POLL_SECONDS until terminal
#   terminal: succeeded | failed | blocked | cancelled | timed_out
#
# NOTE: `succeeded` means "automation ran to completion", not "zero defects".
# For QA presets the defect findings live in trace.json under artifacts[] —
# the summary prints the execution_id/runDir so you can inspect them.
# ==============================================================================

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
QA_DIR="$ROOT_DIR/qa"
EVIDENCE_DIR="$ROOT_DIR/qa-evidence"

IBROWSE_BASE_URL="${IBROWSE_BASE_URL:-${IBROWSE_HOST:-http://localhost:3000}}"
IBROWSE_API_KEY="${IBROWSE_API_KEY:?Set IBROWSE_API_KEY to your iBrowse bridge key}"
QA_PRESET="${QA_PRESET:-qa}"
QA_POLL_SECONDS="${QA_POLL_SECONDS:-6}"
QA_DRY_RUN="${QA_DRY_RUN:-0}"
QA_CONCURRENCY="${QA_CONCURRENCY:-1}" # runs are polled serially for now

command -v jq >/dev/null 2>&1 || { echo "jq is required" >&2; exit 2; }
command -v curl >/dev/null 2>&1 || { echo "curl is required" >&2; exit 2; }

mkdir -p "$EVIDENCE_DIR"

# macOS ships bash 3.2 — avoid mapfile/bash-4-isms.
QA_FILES=("$QA_DIR"/*.json)
if [ ! -f "${QA_FILES[0]}" ]; then
  echo "No QA configs found in $QA_DIR" >&2
  exit 2
fi

echo "========================================================"
echo " ohnuxt — iBrowse QA Test Suite Runner"
echo " Bridge: $IBROWSE_BASE_URL | preset: $QA_PRESET | configs: ${#QA_FILES[@]}"
echo "========================================================"

declare -a RESULT_NAMES=()
declare -a RESULT_STATES=()
declare -a RESULT_IDS=()
FAILED=0

for f in "${QA_FILES[@]}"; do
  name=$(basename "$f" .json)
  goal=$(jq -r '.goal // empty' "$f")
  timeout=$(jq -r '.timeout // 300' "$f")
  base=$(jq -r '.baseUrl // "http://localhost:3333"' "$f")
  path=$(jq -r '.paths[0] // "/"' "$f")
  # Goal = the narrative goal + the explicit checklist, so the agent gets both.
  checks=$(jq -r '.checks // [] | to_entries | "CHECKLIST:\n" + (map("- [" + ((.key+1)|tostring) + "] " + .value) | join("\n"))' "$f")
  target_url="${QA_BASE_URL:-$base}$path"

  payload=$(jq -nc --arg preset "$QA_PRESET" --arg url "$target_url" \
    --arg goal "$goal
$checks" --argjson timeout "$timeout" \
    '{preset:$preset, url:$url, goal:$goal, timeout:$timeout}')

  echo ""
  echo "▸ $name -> $target_url"

  if [ "$QA_DRY_RUN" = "1" ]; then
    echo "  [dry-run] $payload"
    RESULT_NAMES+=("$name"); RESULT_STATES+=("dry-run"); RESULT_IDS+=("-")
    continue
  fi

  resp=$(curl -sS -X POST "$IBROWSE_BASE_URL/v1/runs" \
    -H "Authorization: Bearer $IBROWSE_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" || true)
  job_id=$(jq -r '.job_id // empty' <<<"$resp" 2>/dev/null)
  exec_id=$(jq -r '.execution_id // empty' <<<"$resp" 2>/dev/null)

  if [ -z "$job_id" ]; then
    echo "  enqueue FAILED: ${resp:-(empty response)}"
    RESULT_NAMES+=("$name"); RESULT_STATES+=("enqueue_failed"); RESULT_IDS+=("-")
    FAILED=1
    continue
  fi
  echo "  job: $job_id (execution: $exec_id)"

  # Poll to terminal (config timeout + 90s grace).
  deadline=$(( $(date +%s) + timeout + 90 ))
  status="queued"
  while :; do
    sleep "$QA_POLL_SECONDS"
    status=$(curl -sS "$IBROWSE_BASE_URL/v1/runs/$job_id" \
      -H "Authorization: Bearer $IBROWSE_API_KEY" \
      | jq -r '.status // "unknown"' 2>/dev/null || echo unknown)
    case "$status" in
      succeeded|failed|blocked|cancelled|timed_out) break ;;
    esac
    if [ "$(date +%s)" -ge "$deadline" ]; then
      status="wall_clock_timeout"
      break
    fi
  done

  echo "  status: $status"
  [ "$status" = "succeeded" ] || FAILED=1
  RESULT_NAMES+=("$name"); RESULT_STATES+=("$status"); RESULT_IDS+=("$exec_id")
done

echo ""
echo "========================================================"
printf ' %-28s %-20s %s\n' "CONFIG" "STATUS" "EXECUTION ID"
for i in "${!RESULT_NAMES[@]}"; do
  printf ' %-28s %-20s %s\n' "${RESULT_NAMES[$i]}" "${RESULT_STATES[$i]}" "${RESULT_IDS[$i]}"
done
echo "========================================================"
if [ "$QA_DRY_RUN" = "1" ]; then
  echo "Dry run complete (nothing enqueued)."
  exit 0
fi
if [ "$FAILED" -ne 0 ]; then
  echo "Some runs did not reach 'succeeded'. Inspect trace.json in the"
  echo "artifacts of any 'succeeded' run before claiming the UI is clean."
  exit 1
fi
echo "All runs reached 'succeeded'. Remember: check artifacts' trace.json"
echo "for a11y/console/4xx findings — status alone does not mean defect-free."
