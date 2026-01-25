#!/bin/bash
# Ralph Wiggum Automation Loop
# Self-verifying AI agent that autonomously completes features from the backlog
#
# Usage:
#   ./agent/ralph.sh                    # Run with default 50 iterations
#   RALPH_MAX_ITERATIONS=10 ./ralph.sh  # Run with 10 iterations
#   touch agent/.ralph-stop             # Stop the loop gracefully
#
# See: https://ghuntley.com/ralph/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT"

# Configuration
MAX_ITERATIONS=${RALPH_MAX_ITERATIONS:-50}
SLEEP_BETWEEN_ITERATIONS=${RALPH_SLEEP:-5}
LOG_FILE="$SCRIPT_DIR/ralph.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] WARN:${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $1" | tee -a "$LOG_FILE"
}

# Check dependencies
check_dependencies() {
    local missing=0

    if ! command -v jq &> /dev/null; then
        error "jq not installed. Install with: brew install jq"
        missing=1
    fi

    if ! command -v claude &> /dev/null; then
        error "claude CLI not installed. Install Claude Code first."
        missing=1
    fi

    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Get count of todo features
get_todo_count() {
    jq '[.features[] | select(.status == "todo")] | length' agent/features.json
}

# Get count of in_progress features
get_in_progress_count() {
    jq '[.features[] | select(.status == "in_progress")] | length' agent/features.json
}

# Check if we should stop
should_stop() {
    # Stop file exists
    if [ -f "$SCRIPT_DIR/.ralph-stop" ]; then
        log "Stop file detected. Cleaning up..."
        rm -f "$SCRIPT_DIR/.ralph-stop"
        return 0
    fi

    # All features done
    local todo=$(get_todo_count)
    local in_progress=$(get_in_progress_count)
    if [ "$todo" -eq 0 ] && [ "$in_progress" -eq 0 ]; then
        success "All features complete!"
        return 0
    fi

    return 1
}

# Run pre-iteration verification
pre_iteration_check() {
    log "Running pre-iteration checks..."

    # Check for uncommitted changes
    local modified=$(git status --porcelain | grep -E '^ ?M' | wc -l | tr -d ' ')
    if [ "$modified" -gt 5 ]; then
        warn "Many uncommitted changes detected ($modified files). Consider committing."
    fi

    # Check we're not on main
    local branch=$(git branch --show-current)
    if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
        error "Cannot run Ralph on main branch. Create a feature branch first."
        exit 1
    fi
}

# Run verification after iteration
post_iteration_verify() {
    log "Running post-iteration verification..."

    # Run typecheck
    if ! bun run typecheck 2>&1 | tee -a "$LOG_FILE"; then
        warn "Typecheck failed - will be addressed in next iteration"
        return 1
    fi

    # Run lint
    if ! bunx biome check --write . 2>&1 | tee -a "$LOG_FILE"; then
        warn "Lint issues detected - will be addressed in next iteration"
        return 1
    fi

    success "Verification passed"
    return 0
}

# Main loop
main() {
    check_dependencies

    log "╔════════════════════════════════════════════════════════════╗"
    log "║              RALPH WIGGUM AUTOMATION LOOP                  ║"
    log "╚════════════════════════════════════════════════════════════╝"
    log ""
    log "Max iterations: $MAX_ITERATIONS"
    log "Sleep between iterations: ${SLEEP_BETWEEN_ITERATIONS}s"
    log "To stop: touch agent/.ralph-stop"
    log ""

    local iteration=0
    while [ $iteration -lt $MAX_ITERATIONS ]; do
        iteration=$((iteration + 1))

        log ""
        log "═══════════════════════════════════════════════════════════"
        log "ITERATION $iteration / $MAX_ITERATIONS"
        log "═══════════════════════════════════════════════════════════"

        # Check stop conditions
        if should_stop; then
            break
        fi

        # Pre-checks
        pre_iteration_check

        # Generate contextualized prompt
        log "Generating prompt..."
        if ! "$SCRIPT_DIR/generate-prompt.sh" > "$SCRIPT_DIR/PROMPT.generated.md" 2>> "$LOG_FILE"; then
            error "Failed to generate prompt"
            continue
        fi

        # Feed to Claude Code
        log "Invoking Claude Code..."
        if ! cat "$SCRIPT_DIR/PROMPT.generated.md" | claude --dangerously-skip-permissions 2>&1 | tee -a "$LOG_FILE"; then
            warn "Claude Code exited with error"
        fi

        # Post-iteration verification
        post_iteration_verify || true

        # Sleep before next iteration
        if [ $iteration -lt $MAX_ITERATIONS ]; then
            log "Sleeping ${SLEEP_BETWEEN_ITERATIONS}s before next iteration..."
            sleep $SLEEP_BETWEEN_ITERATIONS
        fi
    done

    log ""
    log "═══════════════════════════════════════════════════════════"
    log "RALPH LOOP COMPLETE"
    log "═══════════════════════════════════════════════════════════"
    log "Iterations completed: $iteration"
    log "Features remaining: $(get_todo_count) todo, $(get_in_progress_count) in_progress"
    log ""
}

main "$@"
