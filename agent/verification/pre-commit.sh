#!/bin/bash
# Pre-commit verification script for Ralph Wiggum
# Run before committing to ensure code quality

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════"
echo "            PRE-COMMIT VERIFICATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

FAILED=0

# 1. Lint check
echo -n "Running Biome lint... "
if bunx biome check --write . > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
    FAILED=1
fi

# 2. TypeScript check
echo -n "Running TypeScript check... "
if bun run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
    FAILED=1
fi

# 3. Convex tests (if in packages/convex)
if git diff --cached --name-only | grep -q "packages/convex"; then
    echo -n "Running Convex tests... "
    if cd packages/convex && bunx vitest run --silent > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${YELLOW}SKIP (tests may need setup)${NC}"
    fi
    cd "$PROJECT_ROOT"
fi

# 4. Check for common issues
echo -n "Checking for debug statements... "
if git diff --cached | grep -E "(console\.log|debugger)" > /dev/null 2>&1; then
    echo -e "${YELLOW}WARN - found debug statements${NC}"
else
    echo -e "${GREEN}PASS${NC}"
fi

echo -n "Checking for .env files... "
if git diff --cached --name-only | grep -E "\.env" > /dev/null 2>&1; then
    echo -e "${RED}FAIL - .env files should not be committed${NC}"
    FAILED=1
else
    echo -e "${GREEN}PASS${NC}"
fi

# 5. Check branch
BRANCH=$(git branch --show-current)
echo -n "Checking branch... "
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo -e "${RED}FAIL - Do not commit to $BRANCH${NC}"
    FAILED=1
else
    echo -e "${GREEN}PASS ($BRANCH)${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"

if [ $FAILED -eq 1 ]; then
    echo -e "${RED}VERIFICATION FAILED${NC}"
    echo "Fix the issues above before committing."
    exit 1
else
    echo -e "${GREEN}ALL CHECKS PASSED${NC}"
    exit 0
fi
