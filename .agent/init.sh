#!/usr/bin/env bash
#
# Piol Development Environment Initialization & Smoke Test
# Run this at the start of every coding session to verify the app is working.
#
# Usage:
#   ./init.sh          # Full init + smoke test
#   ./init.sh --quick  # Skip smoke test, just check env
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Piol Development Environment Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$PROJECT_ROOT"

# ============================================================================
# 1. Check Prerequisites
# ============================================================================
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "  ${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "  ${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check Bun
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo -e "  ${GREEN}✓${NC} Bun: $BUN_VERSION"
else
    echo -e "  ${RED}✗${NC} Bun not found. Install: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Git: $(git --version | cut -d' ' -f3)"
else
    echo -e "  ${RED}✗${NC} Git not found"
    exit 1
fi

echo ""

# ============================================================================
# 2. Check Environment Variables
# ============================================================================
echo -e "${YELLOW}[2/6] Checking environment variables...${NC}"

# Check for .env files
if [ -f "$PROJECT_ROOT/apps/web/.env.local" ]; then
    echo -e "  ${GREEN}✓${NC} apps/web/.env.local exists"
else
    echo -e "  ${YELLOW}!${NC} apps/web/.env.local missing (copy from .env.example)"
fi

# Check critical env vars (if they're set in environment)
REQUIRED_VARS=(
    "CONVEX_DEPLOYMENT"
    "NEXT_PUBLIC_CONVEX_URL"
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo -e "  ${GREEN}✓${NC} $var is set"
    else
        echo -e "  ${YELLOW}!${NC} $var not in environment (check .env.local)"
    fi
done

echo ""

# ============================================================================
# 3. Install Dependencies
# ============================================================================
echo -e "${YELLOW}[3/6] Checking dependencies...${NC}"

if [ -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} node_modules exists"
else
    echo -e "  ${YELLOW}!${NC} Installing dependencies..."
    bun install
fi

echo ""

# ============================================================================
# 4. Type Check
# ============================================================================
echo -e "${YELLOW}[4/6] Running type check...${NC}"

if bun run typecheck 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} TypeScript: No errors"
else
    echo -e "  ${RED}✗${NC} TypeScript errors found"
    echo -e "  ${YELLOW}  Run 'bun run typecheck' to see details${NC}"
fi

echo ""

# ============================================================================
# 5. Lint Check
# ============================================================================
echo -e "${YELLOW}[5/6] Running lint check...${NC}"

if bun run lint 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Lint: No errors"
else
    echo -e "  ${YELLOW}!${NC} Lint issues found (run 'bun run lint:fix' to auto-fix)"
fi

echo ""

# ============================================================================
# 6. Git Status
# ============================================================================
echo -e "${YELLOW}[6/6] Git status...${NC}"

BRANCH=$(git branch --show-current)
echo -e "  ${GREEN}✓${NC} Branch: $BRANCH"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "  ${YELLOW}!${NC} Uncommitted changes:"
    git status --short | head -10 | sed 's/^/      /'
    UNCOMMITTED=$(git status --porcelain | wc -l | tr -d ' ')
    if [ "$UNCOMMITTED" -gt 10 ]; then
        echo -e "      ... and $((UNCOMMITTED - 10)) more"
    fi
else
    echo -e "  ${GREEN}✓${NC} Working tree clean"
fi

# Recent commits
echo -e "\n  Recent commits:"
git log --oneline -5 | sed 's/^/      /'

echo ""

# ============================================================================
# Summary
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Environment check complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Feature summary
if [ -f "$PROJECT_ROOT/.agent/features.json" ]; then
    TOTAL=$(cat "$PROJECT_ROOT/.agent/features.json" | grep -o '"total":' | wc -l)
    if command -v jq &> /dev/null; then
        PASSING=$(jq '.summary.passing' "$PROJECT_ROOT/.agent/features.json")
        FAILING=$(jq '.summary.failing' "$PROJECT_ROOT/.agent/features.json")
        TOTAL=$(jq '.summary.total' "$PROJECT_ROOT/.agent/features.json")
        echo -e "  Features: ${GREEN}$PASSING passing${NC} / ${RED}$FAILING failing${NC} / $TOTAL total"
    fi
fi

echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo -e "    1. Run: ${BLUE}bun run dev:all${NC} to start dev server"
echo -e "    2. Open: ${BLUE}http://localhost:3000${NC}"
echo -e "    3. Check: ${BLUE}.agent/progress.md${NC} for current priorities"
echo ""

# Quick mode - skip smoke test
if [ "$1" == "--quick" ]; then
    echo -e "  ${YELLOW}(Skipping smoke test in quick mode)${NC}"
    exit 0
fi

# ============================================================================
# Optional: Start Dev Server (if requested)
# ============================================================================
echo -e "  ${YELLOW}Start dev server? (y/N)${NC} "
read -r -n 1 response
echo ""

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Starting dev server...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}\n"
    bun run dev:all
fi
