#!/bin/bash
# notify.sh - Send notifications via macOS and Discord
# Usage: ./notify.sh "Your message here" [title]

set -euo pipefail

MESSAGE="${1:-No message provided}"
TITLE="${2:-Piol Compound}"

# macOS notification
osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\""

# Discord webhook (optional)
if [ -n "${DISCORD_WEBHOOK_URL:-}" ]; then
  curl -s -H "Content-Type: application/json" \
    -d "{\"content\": \"**$TITLE**\n$MESSAGE\"}" \
    "$DISCORD_WEBHOOK_URL" > /dev/null 2>&1 || true
fi

echo "[notify] $TITLE: $MESSAGE"
