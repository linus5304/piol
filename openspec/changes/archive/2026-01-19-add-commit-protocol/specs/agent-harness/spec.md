## ADDED Requirements

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
