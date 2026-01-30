#!/bin/bash
# loop.sh - Run Claude iteratively until task is complete or max iterations reached
# Usage: ./loop.sh "Your prompt" [max_iterations]

set -euo pipefail

PROMPT="$1"
MAX_ITERATIONS="${2:-5}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROGRESS_FILE="$PROJECT_ROOT/agent/progress.md"

cd "$PROJECT_ROOT"

# Initialize progress file
echo "# Compound Loop Progress - $(date '+%Y-%m-%d %H:%M:%S')" >> "$PROGRESS_FILE"
echo "" >> "$PROGRESS_FILE"
echo "## Task" >> "$PROGRESS_FILE"
echo "$PROMPT" >> "$PROGRESS_FILE"
echo "" >> "$PROGRESS_FILE"

for i in $(seq 1 "$MAX_ITERATIONS"); do
  echo "[loop] Iteration $i of $MAX_ITERATIONS"
  echo "### Iteration $i - $(date '+%H:%M:%S')" >> "$PROGRESS_FILE"

  # Run Claude with the prompt
  # Using --dangerously-skip-permissions for autonomous operation
  OUTPUT=$(claude -p "$PROMPT" --dangerously-skip-permissions 2>&1) || true

  # Log output summary (first 500 chars)
  echo "${OUTPUT:0:500}..." >> "$PROGRESS_FILE"
  echo "" >> "$PROGRESS_FILE"

  # Check for completion signals
  if echo "$OUTPUT" | grep -qi "COMPLETE\|DONE\|All tasks completed\|ready for review"; then
    echo "[loop] Task completed at iteration $i"
    echo "**Status:** COMPLETE" >> "$PROGRESS_FILE"
    exit 0
  fi

  # Check for blocking issues
  if echo "$OUTPUT" | grep -qi "BLOCKED\|ERROR\|Cannot proceed\|Failed"; then
    echo "[loop] Task blocked at iteration $i"
    echo "**Status:** BLOCKED" >> "$PROGRESS_FILE"
    exit 1
  fi

  # Update prompt for continuation
  PROMPT="Continue working on the task. Check implementation_plan.md for progress. If the current task is complete, mark it with [x] and say COMPLETE."
done

echo "[loop] Max iterations reached without completion"
echo "**Status:** MAX_ITERATIONS_REACHED" >> "$PROGRESS_FILE"
exit 2
