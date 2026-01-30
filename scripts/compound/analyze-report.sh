#!/bin/bash
# analyze-report.sh - Parse implementation_plan.md and return first unchecked task
# Usage: ./analyze-report.sh [path/to/implementation_plan.md]
# Output: task_id|task_description (or empty if all done)

set -euo pipefail

PLAN_FILE="${1:-agent/implementation_plan.md}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [ ! -f "$PROJECT_ROOT/$PLAN_FILE" ]; then
  echo "[analyze-report] Plan file not found: $PLAN_FILE" >&2
  exit 1
fi

# Find first unchecked task: - [ ] Task description
# Extract task number and description
TASK_LINE=$(grep -n '^\s*-\s*\[ \]' "$PROJECT_ROOT/$PLAN_FILE" | head -1)

if [ -z "$TASK_LINE" ]; then
  echo "[analyze-report] All tasks completed!" >&2
  exit 0
fi

# Parse line number and content
LINE_NUM=$(echo "$TASK_LINE" | cut -d: -f1)
TASK_CONTENT=$(echo "$TASK_LINE" | cut -d: -f2- | sed 's/^\s*-\s*\[ \]\s*//')

# Generate task ID from line number or task content
# Try to extract task number if present (e.g., "Task 1" -> "task-1")
if echo "$TASK_CONTENT" | grep -qi 'task\s*[0-9]'; then
  TASK_ID=$(echo "$TASK_CONTENT" | grep -oi 'task\s*[0-9]*' | head -1 | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
else
  # Use line number as fallback
  TASK_ID="line-$LINE_NUM"
fi

# Output: task_id|line_number|task_description
echo "$TASK_ID|$LINE_NUM|$TASK_CONTENT"
