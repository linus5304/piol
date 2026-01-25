#!/bin/bash
# Generate contextualized prompt for Ralph Wiggum loop
# Injects dynamic context into PROMPT.template.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT"

# Get git context
GIT_BRANCH=$(git branch --show-current)
GIT_STATUS=$(git status --porcelain | head -20)
GIT_MODIFIED=$(git status --porcelain | grep -E '^ ?M' | wc -l | tr -d ' ')
GIT_UNTRACKED=$(git status --porcelain | grep -E '^\?\?' | wc -l | tr -d ' ')

# Get feature backlog summary
DONE_COUNT=$(jq '[.features[] | select(.status == "done")] | length' agent/features.json)
IN_PROGRESS_COUNT=$(jq '[.features[] | select(.status == "in_progress")] | length' agent/features.json)
BLOCKED_COUNT=$(jq '[.features[] | select(.status == "blocked")] | length' agent/features.json)
TODO_COUNT=$(jq '[.features[] | select(.status == "todo")] | length' agent/features.json)

# Get next feature (prioritize in_progress, then todo)
if [ "$IN_PROGRESS_COUNT" -gt 0 ]; then
    NEXT_FEATURE=$(jq -r '[.features[] | select(.status == "in_progress")] | .[0]' agent/features.json)
else
    NEXT_FEATURE=$(jq -r '[.features[] | select(.status == "todo")] | sort_by(.priority) | .[0]' agent/features.json)
fi

FEATURE_ID=$(echo "$NEXT_FEATURE" | jq -r '.id')
FEATURE_NAME=$(echo "$NEXT_FEATURE" | jq -r '.name')
FEATURE_ACCEPTANCE=$(echo "$NEXT_FEATURE" | jq -r '.acceptance | map("- " + .) | join("\n")')
FEATURE_NOTES=$(echo "$NEXT_FEATURE" | jq -r '.notes // ""')
FEATURE_SPEC=$(echo "$NEXT_FEATURE" | jq -r '.spec // ""')

# Get scratchpad context (last 50 lines)
SCRATCHPAD=""
if [ -f "$SCRIPT_DIR/scratchpad.md" ]; then
    SCRATCHPAD=$(tail -50 "$SCRIPT_DIR/scratchpad.md")
fi

# Get last session summary from progress.md
LAST_SESSION=""
if [ -f "$SCRIPT_DIR/progress.md" ]; then
    LAST_SESSION=$(awk '/^## Session:/{if(++n==2)exit}n' "$SCRIPT_DIR/progress.md" | tail -n +2 | head -30)
fi

# Read template and substitute variables
cat "$SCRIPT_DIR/PROMPT.template.md" | \
    sed "s/{{TIMESTAMP}}/$(date '+%Y-%m-%d %H:%M:%S')/g" | \
    sed "s/{{GIT_BRANCH}}/$GIT_BRANCH/g" | \
    sed "s/{{GIT_MODIFIED}}/$GIT_MODIFIED/g" | \
    sed "s/{{GIT_UNTRACKED}}/$GIT_UNTRACKED/g" | \
    sed "s/{{DONE_COUNT}}/$DONE_COUNT/g" | \
    sed "s/{{IN_PROGRESS_COUNT}}/$IN_PROGRESS_COUNT/g" | \
    sed "s/{{BLOCKED_COUNT}}/$BLOCKED_COUNT/g" | \
    sed "s/{{TODO_COUNT}}/$TODO_COUNT/g" | \
    sed "s/{{FEATURE_ID}}/$FEATURE_ID/g" | \
    sed "s/{{FEATURE_NAME}}/$FEATURE_NAME/g"

# Append multiline sections (can't use sed for these)
echo ""
echo "## Acceptance Criteria"
echo "$FEATURE_ACCEPTANCE"
echo ""

if [ -n "$FEATURE_NOTES" ] && [ "$FEATURE_NOTES" != "null" ]; then
    echo "## Previous Notes"
    echo "$FEATURE_NOTES"
    echo ""
fi

if [ -n "$FEATURE_SPEC" ] && [ "$FEATURE_SPEC" != "null" ]; then
    echo "## Spec File"
    echo "Read: $FEATURE_SPEC"
    echo ""
fi

echo "## Current Context (from scratchpad)"
echo '```'
echo "$SCRATCHPAD"
echo '```'
echo ""

echo "## Last Session Summary"
echo '```'
echo "$LAST_SESSION"
echo '```'
echo ""

echo "## Git Status"
echo '```'
echo "$GIT_STATUS"
echo '```'
