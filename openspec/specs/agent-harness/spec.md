# agent-harness Specification

## Purpose
TBD - created by archiving change add-agent-harness. Update Purpose after archive.
## Requirements
### Requirement: Agent Session Initialization

The system SHALL provide an initialization script that agents run at session start.

#### Scenario: Agent starts new session
- **GIVEN** an AI agent begins a new coding session
- **WHEN** the agent runs `./agent/init.sh`
- **THEN** the script displays:
  - Last 30 lines of progress.md (previous session context)
  - Full contents of scratchpad.md (current working context)
  - Next feature to work on (highest priority with status=todo)
  - Any blocked features with their blockers

### Requirement: Feature Backlog Tracking

The system SHALL maintain a machine-readable feature backlog in `agent/features.json`.

#### Scenario: Query next feature to work on
- **GIVEN** features.json contains features with various statuses
- **WHEN** an agent queries for the next task using `jq '[.features[] | select(.status == "todo")] | sort_by(.priority) | .[0]'`
- **THEN** the query returns the highest-priority feature with status "todo"

#### Scenario: Feature status transitions
- **GIVEN** a feature with status "todo"
- **WHEN** an agent begins work on the feature
- **THEN** the agent updates status to "in_progress"
- **AND** only one feature SHALL have status "in_progress" at a time

#### Scenario: Feature blocked
- **GIVEN** a feature with status "in_progress"
- **WHEN** the agent encounters an external blocker
- **THEN** the agent updates status to "blocked"
- **AND** documents the blocker in the feature's "blockers" array

#### Scenario: Feature completion
- **GIVEN** a feature with status "in_progress"
- **WHEN** all acceptance criteria are verified
- **THEN** the agent updates status to "done"

### Requirement: Session Handoff Protocol

The system SHALL maintain session state across agent sessions.

#### Scenario: Session end documentation
- **GIVEN** an agent has worked on features during a session
- **WHEN** the session ends
- **THEN** the agent SHALL:
  - Append a session entry to progress.md with done/blockers/decisions/next
  - Update features.json status for any changed features
  - Update scratchpad.md with current context for next session

#### Scenario: Session start context retrieval
- **GIVEN** progress.md contains previous session entries
- **AND** scratchpad.md contains current working context
- **WHEN** a new agent session begins
- **THEN** the agent can read both files to understand current state

### Requirement: Acceptance Criteria Verification

Each feature SHALL have explicit, verifiable acceptance criteria.

#### Scenario: Feature with testable criteria
- **GIVEN** a feature in features.json
- **WHEN** an agent reads the feature definition
- **THEN** the "acceptance" array contains at least one verifiable criterion
- **AND** each criterion is specific enough to be verified (route works, data loads, action succeeds)

#### Scenario: Verification before marking done
- **GIVEN** a feature with acceptance criteria
- **WHEN** an agent marks the feature as "done"
- **THEN** the agent has verified each acceptance criterion
- **AND** documented verification in the session's progress entry

### Requirement: Commit Protocol

The agent harness SHALL define a commit protocol that separates feature changes from agent state changes.

#### Scenario: Agent commits after completing feature
- **GIVEN** an agent has completed work on a feature
- **WHEN** the agent prepares to commit
- **THEN** the agent SHALL:
  1. Run `bunx biome check --write .` to format code
  2. Stage and commit feature code with message `<scope>(<feature-id>): <description>`
  3. Stage and commit agent state with message `agent: complete <feature-id>`

#### Scenario: Commit message format
- **GIVEN** an agent needs to commit feature code
- **WHEN** writing the commit message
- **THEN** the message SHALL follow format `<scope>(<feature-id>): <description>` where:
  - scope is one of: web, convex, mobile, chore
  - feature-id is the MVP feature ID (e.g., mvp-1)
  - description is a concise summary of the change

### Requirement: Ephemeral Scratchpad

The scratchpad file SHALL NOT be committed to version control.

#### Scenario: Scratchpad is gitignored
- **GIVEN** the agent harness includes `agent/scratchpad.md`
- **WHEN** checking git status
- **THEN** `agent/scratchpad.md` SHALL be ignored
- **AND** the file SHALL remain available locally for session context

### Requirement: Feature Branch Workflow

Each feature SHALL be developed on a separate branch and merged via pull request.

#### Scenario: Agent starts new feature
- **GIVEN** an agent is about to start work on a feature
- **WHEN** the agent begins work
- **THEN** the agent SHALL:
  1. Create a new branch from main: `git checkout -b feat/<feature-id>-<short-description>`
  2. All commits for that feature go on this branch
  3. When complete, push and create PR to main

#### Scenario: Branch naming convention
- **GIVEN** a feature needs a branch
- **WHEN** creating the branch name
- **THEN** the format SHALL be `<type>/<feature-id>-<description>` where:
  - type is one of: feat, fix, chore
  - feature-id is the MVP feature ID (e.g., mvp-2)
  - description is kebab-case summary (e.g., `feat/mvp-2-properties-convex`)

#### Scenario: Never commit directly to main
- **GIVEN** any code change
- **WHEN** the agent is on the main branch
- **THEN** the agent SHALL NOT commit
- **AND** SHALL create a feature branch first

### Requirement: Uncommitted Work Detection

The init script SHALL warn about uncommitted work from previous sessions.

#### Scenario: Session starts with dirty working directory
- **GIVEN** an agent runs `./agent/init.sh`
- **WHEN** there are uncommitted changes or untracked files (excluding gitignored)
- **THEN** the script SHALL display a warning with:
  - List of modified files
  - List of untracked files
  - Instruction to commit or stash before proceeding

#### Scenario: Clean working directory
- **GIVEN** an agent runs `./agent/init.sh`
- **WHEN** the working directory is clean
- **THEN** the script proceeds without warning

