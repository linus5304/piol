#!/usr/bin/env bash
#
# Piol Agent Runner — Single Feature Execution
# Based on Ralph Wiggum technique + Anthropic harness patterns
#
# Usage:
#   ./.agent/run-agent.sh           # Run once (interactive)
#   ./.agent/run-agent.sh --print   # Run once (headless/script mode)
#   ./.agent/run-agent.sh --loop    # Run in loop until complete (use with caution!)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Configuration
# Model options to try: opus-4.5, opus-4-5, claude-opus-4.5, claude-4-opus
# Check cursor-agent docs for exact model name
MODEL="${CURSOR_MODEL:-opus-4.5-thinking}"

# Check if cursor-agent is installed
if ! command -v cursor-agent &> /dev/null; then
    echo "❌ cursor-agent CLI not found."
    echo "   Install from: https://docs.cursor.com/agent"
    exit 1
fi

# The prompt for cursor-agent
PROMPT='@.agent/features.json @.agent/progress.md @AGENTS.md @AGENTS.frontend.md

## YOUR TASK

1. Read features.json and find the highest-priority FAILING feature to work on.
   Work only on that ONE feature. Priority 1 is highest.

2. Before implementing, verify the app builds:
   - Run: bun run typecheck
   - Run: bun run lint
   - If errors exist, fix them first before implementing new features.

3. Implement the feature following patterns in AGENTS.md and AGENTS.frontend.md.
   - Use existing shadcn components from src/components/ui/
   - Follow the code style in .cursor/rules.md

4. After implementing, verify:
   - Run: bun run typecheck (must pass)
   - Run: bun run lint (must pass)
   - Test the feature manually if applicable

5. Update .agent/features.json:
   - Change the feature status from "failing" to "passing"
   - Only mark as passing if you verified it works

6. Append your progress to .agent/progress.md:
   - Add a new session entry with date/time
   - Document what was completed
   - Note the current state
   - Suggest next priority

7. Make a git commit with format: "feat(<scope>): <description>"

## RULES
- ONLY work on ONE feature per run
- Do NOT skip verification steps
- Leave code in a MERGEABLE state (no half-implementations)
- If all priority-1 features are passing, output: COMPLETE
'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Piol Agent Runner (cursor-agent + Opus 4.5)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Model: $MODEL"
echo "Workspace: $PROJECT_ROOT"
echo ""

# Parse arguments
PRINT_MODE=""
LOOP_MODE=false

for arg in "$@"; do
    case $arg in
        --print)
            PRINT_MODE="--print --output-format text"
            ;;
        --loop)
            LOOP_MODE=true
            PRINT_MODE="--print --output-format text"
            ;;
    esac
done

# Run cursor-agent
if [ "$LOOP_MODE" = true ]; then
    echo "⚠️  Loop mode enabled. Press Ctrl+C to stop."
    echo ""
    ITERATION=1
    while true; do
        echo "━━━ Iteration $ITERATION ━━━"
        OUTPUT=$(cursor-agent \
            --model "$MODEL" \
            --workspace "$PROJECT_ROOT" \
            --force \
            $PRINT_MODE \
            "$PROMPT" 2>&1) || true
        
        echo "$OUTPUT"
        
        # Check if complete
        if echo "$OUTPUT" | grep -q "COMPLETE"; then
            echo ""
            echo "✅ All priority-1 features complete!"
            exit 0
        fi
        
        echo ""
        echo "━━━ Iteration $ITERATION complete. Starting next in 3s... ━━━"
        echo ""
        sleep 3
        ITERATION=$((ITERATION + 1))
    done
else
    # Single run
    if [ -n "$PRINT_MODE" ]; then
        # Headless mode
        cursor-agent \
            --model "$MODEL" \
            --workspace "$PROJECT_ROOT" \
            --force \
            $PRINT_MODE \
            "$PROMPT"
    else
        # Interactive mode (default)
        echo "Starting interactive session..."
        echo ""
        cursor-agent \
            --model "$MODEL" \
            --workspace "$PROJECT_ROOT" \
            "$PROMPT"
    fi
fi
