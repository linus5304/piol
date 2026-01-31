# Compound Engineering Nightly Loop

Autonomous nightly development based on Ryan Carson's compound engineering approach. Claude Code implements tasks from `implementation_plan.md` while you sleep.

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NIGHTLY SCHEDULE                              │
├─────────────────────────────────────────────────────────────────────┤
│  5:00 PM   caffeinate         Keeps Mac awake for 9 hours           │
│ 10:30 PM   daily-review       Extracts learnings from Claude sessions│
│ 11:00 PM   auto-compound      Implements top task, creates PR       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow: auto-compound.sh

```
1. Pull latest main
2. Parse implementation_plan.md → find first unchecked [ ] task
3. Create branch: feat/compound-YYYYMMDD-task-id
4. Run loop.sh (up to 5 Claude iterations)
5. Run verification: bun run lint:fix && bun run typecheck
6. Commit changes
7. Push branch
8. Create draft PR
9. Send notification (macOS + Discord)
```

### Flow: daily-compound-review.sh

```
1. Find Claude session files modified in last 24 hours
2. Extract message summaries from .jsonl files
3. Ask Claude to analyze and extract learnings
4. Append learnings to agent/compound-learnings.md
5. Send notification
```

## Prerequisites

| Dependency | Purpose | Install |
|------------|---------|---------|
| Claude CLI | AI-powered implementation | `npm install -g @anthropic-ai/claude-code` |
| GitHub CLI | PR creation | `brew install gh` then `gh auth login` |
| Bun | Package manager | `brew install bun` |

## Installation

### 1. Make scripts executable (already done)

```bash
chmod +x scripts/compound/*.sh
```

### 2. Install launchd plists

The plist files are already installed at `~/Library/LaunchAgents/`:

```
~/Library/LaunchAgents/
├── com.piol.caffeinate.plist           # 5:00 PM - keep Mac awake
├── com.piol.daily-compound-review.plist # 10:30 PM - extract learnings
└── com.piol.auto-compound.plist         # 11:00 PM - implement tasks
```

### 3. Enable scheduled jobs

```bash
# Load all jobs
launchctl load ~/Library/LaunchAgents/com.piol.caffeinate.plist
launchctl load ~/Library/LaunchAgents/com.piol.daily-compound-review.plist
launchctl load ~/Library/LaunchAgents/com.piol.auto-compound.plist

# Verify loaded
launchctl list | grep piol
```

### 4. (Optional) Set up Discord notifications

```bash
# Add to your shell profile (~/.zshrc or ~/.bashrc)
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"
```

To create a Discord webhook:
1. Go to Discord server → Settings → Integrations → Webhooks
2. Create webhook, copy URL
3. Add to environment variable

## Files

| File | Purpose |
|------|---------|
| `auto-compound.sh` | Main nightly loop - picks task, implements, creates PR |
| `daily-compound-review.sh` | Extracts learnings from Claude sessions |
| `loop.sh` | Runs Claude iteratively until task complete or max iterations |
| `analyze-report.sh` | Parses implementation_plan.md for next unchecked task |
| `notify.sh` | Sends macOS notification + Discord webhook |
| `COMPOUND_PROMPT.md` | Instructions Claude follows during nightly work |

## Log Files

| Log | Location |
|-----|----------|
| Auto-compound | `/tmp/piol-auto-compound.log` |
| Daily review | `/tmp/piol-compound-review.log` |
| Caffeinate | `/tmp/piol-caffeinate.log` |
| Loop progress | `agent/progress.md` |
| Learnings | `agent/compound-learnings.md` |

## Manual Testing

```bash
# 1. Test notification
./scripts/compound/notify.sh "Test notification" "Test Title"

# 2. Test task parsing
./scripts/compound/analyze-report.sh agent/implementation_plan.md
# Output: task-1|3|Task 1

# 3. Test single iteration (safe - creates branch, doesn't auto-merge)
./scripts/compound/auto-compound.sh 1

# 4. Check logs
tail -f /tmp/piol-auto-compound.log
```

## Troubleshooting

### Jobs not running

```bash
# Check if jobs are loaded
launchctl list | grep piol

# If not loaded, load them
launchctl load ~/Library/LaunchAgents/com.piol.auto-compound.plist

# Check for errors
cat /tmp/piol-auto-compound.log
```

### "Working directory not clean" error

The auto-compound script aborts if there are uncommitted changes. Fix:

```bash
# Commit or stash changes
git stash
# OR
git add -A && git commit -m "WIP"
```

### "No tasks to work on"

All tasks in `agent/implementation_plan.md` are checked. Add new tasks:

```markdown
- [ ] New task description
- [ ] Another task
```

### Claude CLI not found

```bash
# Install Claude CLI
npm install -g @anthropic-ai/claude-code

# Verify
which claude
```

### gh CLI auth issues

```bash
# Re-authenticate
gh auth login

# Verify
gh auth status
```

### Mac sleeping during nightly window

The caffeinate job should prevent this. Check if it's running:

```bash
# Check caffeinate process
ps aux | grep caffeinate

# Check if plist is loaded
launchctl list | grep caffeinate
```

### Disable jobs temporarily

```bash
# Unload specific job
launchctl unload ~/Library/LaunchAgents/com.piol.auto-compound.plist

# Unload all
launchctl unload ~/Library/LaunchAgents/com.piol.caffeinate.plist
launchctl unload ~/Library/LaunchAgents/com.piol.daily-compound-review.plist
launchctl unload ~/Library/LaunchAgents/com.piol.auto-compound.plist
```

## Safety Guardrails

| Risk | Mitigation |
|------|------------|
| Breaking changes | typecheck + lint must pass before commit |
| Push to main | Always creates feature branches |
| Runaway costs | Max 5 iterations per night |
| Mac sleeps | Caffeinate job keeps system awake |
| Dirty git state | Aborts if uncommitted changes |
| Bad PRs | Creates draft PRs for human review |

## Customization

### Change schedule

Edit the plist files in `~/Library/LaunchAgents/`:

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Hour</key>
    <integer>23</integer>  <!-- Change hour (0-23) -->
    <key>Minute</key>
    <integer>0</integer>   <!-- Change minute (0-59) -->
</dict>
```

Then reload:

```bash
launchctl unload ~/Library/LaunchAgents/com.piol.auto-compound.plist
launchctl load ~/Library/LaunchAgents/com.piol.auto-compound.plist
```

### Change max iterations

```bash
# Default is 5, change to 3
./scripts/compound/auto-compound.sh 3
```

To change default, edit `auto-compound.sh`:

```bash
MAX_ITERATIONS="${1:-5}"  # Change 5 to desired default
```

### Change task file

Edit `auto-compound.sh`:

```bash
TASK_INFO=$("$SCRIPT_DIR/analyze-report.sh" agent/implementation_plan.md)
#                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                                           Change path here
```

## Implementation Plan Format

The `agent/implementation_plan.md` file should use this format:

```markdown
# Implementation Plan

- [ ] Task 1 description
- [ ] Task 2 description
- [x] Completed task (will be skipped)
- [ ] Task 3 description
```

The script finds the first unchecked `[ ]` task and works on it.

## What Gets Committed

After nightly run, you'll find:
- New branch: `feat/compound-YYYYMMDD-task-id`
- Draft PR with implementation
- Updated `agent/implementation_plan.md` with task checked off
- Updated `agent/progress.md` with session log

## Morning Review Checklist

1. Check notifications (macOS/Discord)
2. Review created PRs at https://github.com/linus5304/piol/pulls
3. Check logs: `cat /tmp/piol-auto-compound.log`
4. Review learnings: `cat agent/compound-learnings.md`
5. Merge good PRs, close bad ones
