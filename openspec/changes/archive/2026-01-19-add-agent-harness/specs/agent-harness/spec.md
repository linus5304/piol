## ADDED Requirements

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
