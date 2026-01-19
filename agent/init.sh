#!/bin/bash
# Piol Agent Initialization Script
# Run this at the start of each session to get context

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              PIOL AGENT INITIALIZATION                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check for uncommitted work from previous session
MODIFIED=$(git status --porcelain | grep -E '^ ?M' | wc -l | tr -d ' ')
UNTRACKED=$(git status --porcelain | grep -E '^\?\?' | wc -l | tr -d ' ')
CURRENT_BRANCH=$(git branch --show-current)

if [ "$MODIFIED" -gt 0 ] || [ "$UNTRACKED" -gt 0 ]; then
    echo "⚠️  UNCOMMITTED WORK DETECTED"
    echo "─────────────────────────────────────────────────────────────"
    echo "Previous session left uncommitted changes. Fix before proceeding!"
    echo ""
    if [ "$MODIFIED" -gt 0 ]; then
        echo "Modified files ($MODIFIED):"
        git status --porcelain | grep -E '^ ?M' | sed 's/^/  /'
        echo ""
    fi
    if [ "$UNTRACKED" -gt 0 ]; then
        echo "Untracked files ($UNTRACKED):"
        git status --porcelain | grep -E '^\?\?' | sed 's/^?? /  /'
        echo ""
    fi
    echo "Options:"
    echo "  1. Commit: git add -A && git commit -m 'chore: commit missed files'"
    echo "  2. Stash:  git stash -u"
    echo "  3. Reset:  git checkout . && git clean -fd (DESTRUCTIVE)"
    echo ""
fi

# Check branch (warn if on main)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo "⚠️  ON MAIN BRANCH"
    echo "─────────────────────────────────────────────────────────────"
    echo "Create a feature branch before starting work:"
    echo "  git checkout -b feat/<feature-id>-<description>"
    echo ""
fi

# Check for jq
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not installed. Install with: brew install jq"
    echo ""
fi

# Show feature status summary
echo "📊 FEATURE STATUS"
echo "─────────────────────────────────────────────────────────────"
if command -v jq &> /dev/null; then
    echo "Done:        $(jq '[.features[] | select(.status == "done")] | length' agent/features.json)"
    echo "In Progress: $(jq '[.features[] | select(.status == "in_progress")] | length' agent/features.json)"
    echo "Blocked:     $(jq '[.features[] | select(.status == "blocked")] | length' agent/features.json)"
    echo "Todo:        $(jq '[.features[] | select(.status == "todo")] | length' agent/features.json)"
else
    grep -c '"status": "done"' agent/features.json || echo "0"
fi
echo ""

# Show next feature
echo "🎯 NEXT FEATURE"
echo "─────────────────────────────────────────────────────────────"
if command -v jq &> /dev/null; then
    NEXT=$(jq -r '[.features[] | select(.status == "todo")] | sort_by(.priority) | .[0] | "\(.id): \(.name)"' agent/features.json)
    if [ "$NEXT" != "null: null" ] && [ -n "$NEXT" ]; then
        echo "$NEXT"
        echo ""
        echo "Acceptance criteria:"
        jq -r '[.features[] | select(.status == "todo")] | sort_by(.priority) | .[0].acceptance[]' agent/features.json | sed 's/^/  • /'
    else
        echo "✅ All features complete!"
    fi
else
    echo "Install jq to see next feature"
fi
echo ""

# Show blocked features if any
if command -v jq &> /dev/null; then
    BLOCKED=$(jq '[.features[] | select(.status == "blocked")] | length' agent/features.json)
    if [ "$BLOCKED" -gt 0 ]; then
        echo "🚫 BLOCKED FEATURES"
        echo "─────────────────────────────────────────────────────────────"
        jq -r '.features[] | select(.status == "blocked") | "• \(.id): \(.name)\n  Blockers: \(.blockers | join(", "))"' agent/features.json
        echo ""
    fi
fi

# Show current context
echo "📝 CURRENT CONTEXT"
echo "─────────────────────────────────────────────────────────────"
head -30 agent/scratchpad.md
echo ""
echo "(See full context in agent/scratchpad.md)"
echo ""

# Show last session summary
echo "📋 LAST SESSION"
echo "─────────────────────────────────────────────────────────────"
# Get the last session entry (between first two "## Session:" headers)
awk '/^## Session:/{if(++n==2)exit}n' agent/progress.md | tail -n +2
echo ""

echo "─────────────────────────────────────────────────────────────"
echo "Ready to work. Remember:"
echo "  1. Work on ONE feature only"
echo "  2. Update features.json when status changes"
echo "  3. Update scratchpad.md with decisions"
echo "  4. Append to progress.md at session end"
echo "  5. Commit your changes"
echo "─────────────────────────────────────────────────────────────"
