#!/bin/bash
# daily-compound-review.sh - Extract learnings from Claude sessions in last 24 hours
# Runs nightly at 10:30 PM via launchd

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LEARNINGS_FILE="$PROJECT_ROOT/agent/compound-learnings.md"
LOG_FILE="/tmp/piol-compound-review.log"
SESSIONS_DIR="$HOME/.claude/projects"

# Redirect all output to log file
exec > >(tee -a "$LOG_FILE") 2>&1

echo ""
echo "=========================================="
echo "Compound Review - $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

cd "$PROJECT_ROOT"

# Find session files modified in last 24 hours for this project
# Look for .jsonl files in the Claude projects directory
PROJECT_SESSIONS=$(find "$SESSIONS_DIR" -name "*.jsonl" -mtime -1 -type f 2>/dev/null | head -20)

if [ -z "$PROJECT_SESSIONS" ]; then
  echo "[review] No recent sessions found"
  "$SCRIPT_DIR/notify.sh" "No recent sessions to review" "Compound Review"
  exit 0
fi

SESSION_COUNT=$(echo "$PROJECT_SESSIONS" | wc -l | tr -d ' ')
echo "[review] Found $SESSION_COUNT recent session(s)"

# Create a summary of recent sessions for Claude to analyze
SUMMARY_FILE=$(mktemp)
echo "# Claude Session Summaries - Last 24 Hours" > "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

for session in $PROJECT_SESSIONS; do
  echo "## Session: $(basename "$session")" >> "$SUMMARY_FILE"
  echo "Modified: $(stat -f '%Sm' "$session")" >> "$SUMMARY_FILE"
  echo "" >> "$SUMMARY_FILE"

  # Extract key messages (assistant responses containing decisions/changes)
  # Limit to last 50 lines to keep context manageable
  tail -50 "$session" 2>/dev/null | \
    grep -o '"content":"[^"]*"' | \
    head -20 | \
    sed 's/"content":"//g; s/"$//g' >> "$SUMMARY_FILE" 2>/dev/null || true

  echo "" >> "$SUMMARY_FILE"
  echo "---" >> "$SUMMARY_FILE"
  echo "" >> "$SUMMARY_FILE"
done

# Ask Claude to extract learnings
REVIEW_PROMPT="Analyze these Claude Code session summaries from the Piol project (Cameroon housing marketplace).

Extract learnings in this format:

## $(date '+%Y-%m-%d') Learnings

### Patterns Discovered
- [Pattern 1]
- [Pattern 2]

### Decisions Made
- [Decision 1]
- [Decision 2]

### Issues Encountered
- [Issue 1]
- [Issue 2]

### Recommendations for CLAUDE.md
- [Recommendation 1]

Keep it concise. Only include significant learnings, not routine operations.

Session summaries:
$(cat "$SUMMARY_FILE")"

echo "[review] Analyzing sessions with Claude..."

# Run Claude to extract learnings
LEARNINGS=$(claude -p "$REVIEW_PROMPT" --dangerously-skip-permissions 2>&1) || true

if [ -n "$LEARNINGS" ]; then
  # Append to learnings file
  echo "" >> "$LEARNINGS_FILE"
  echo "$LEARNINGS" >> "$LEARNINGS_FILE"
  echo "[review] Learnings appended to $LEARNINGS_FILE"
fi

# Cleanup
rm -f "$SUMMARY_FILE"

"$SCRIPT_DIR/notify.sh" "Reviewed $SESSION_COUNT sessions, learnings extracted" "Compound Review"
echo "[review] Complete"
