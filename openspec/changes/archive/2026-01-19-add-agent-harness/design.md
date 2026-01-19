# Design: Agent Development Harness

## Context

Piol is a housing marketplace being built by AI agents with human oversight. The project uses:
- **OpenSpec** for spec-driven development (requirements, proposals)
- **Turborepo** monorepo with Convex backend, Next.js web, Expo mobile (paused)
- **MVP-first approach** with clear checklist in AGENTS.md

Current gap: No mechanism for session continuity between AI agents.

## Goals

1. Enable AI agents to resume work without losing context
2. Provide machine-readable feature backlog aligned with MVP
3. Track decisions and blockers across sessions
4. Define verifiable acceptance criteria for each feature

## Non-Goals

1. Replace OpenSpec (complement it)
2. Complex project management (keep it simple)
3. Human PM tooling (this is for AI agents)
4. Automated testing framework (separate concern)

## Decisions

### Decision 1: Directory Location

**Choice**: `agent/` at project root

**Alternatives considered**:
- `openspec/agent/` — Rejected: conflates specification with workflow
- `.agent/` — Rejected: hidden files are harder to discover
- `docs/agent/` — Rejected: docs are for humans, this is for agents

**Rationale**: Root-level visibility signals importance, parallel to `openspec/` for specs.

### Decision 2: Feature Tracking Format

**Choice**: JSON with explicit schema

```json
{
  "version": 1,
  "features": [
    {
      "id": "mvp-1",
      "name": "Auth redirect to dashboard",
      "status": "todo",
      "priority": 1,
      "spec": null,
      "acceptance": [
        "After sign-in, user lands on /dashboard",
        "After sign-up, user lands on /dashboard/onboarding"
      ],
      "blockers": [],
      "notes": ""
    }
  ]
}
```

**Alternatives considered**:
- YAML — Rejected: JSON is more universally parseable
- Markdown checklist — Rejected: not machine-readable for queries
- OpenSpec specs only — Rejected: specs are for requirements, not progress

**Rationale**: JSON enables:
- Querying (`jq` for finding next task)
- Explicit status tracking
- Acceptance criteria per feature
- Blocker documentation

### Decision 3: Session Handoff Protocol

**Choice**: Three-file system

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `features.json` | Backlog status | When feature status changes |
| `progress.md` | Historical log | Every session (append-only) |
| `scratchpad.md` | Current context | During session (overwrite) |

**Rationale**: 
- `progress.md` is permanent record (never lose history)
- `scratchpad.md` is transient (current session only)
- `features.json` is structured data (queryable)

### Decision 4: MVP Feature Mapping

Map current AGENTS.md checklist to features.json:

| MVP Item | Feature ID | Current State |
|----------|------------|---------------|
| Auth pages exist | mvp-0 | done (verified) |
| Redirect after auth | mvp-1 | todo |
| Browse /properties | mvp-2 | in_progress (UI exists, mock data) |
| Property detail | mvp-3 | todo |
| Landlord creates property | mvp-4 | todo (form exists, no Convex) |
| Message landlord | mvp-5 | todo |
| Save properties | mvp-6 | todo |

## File Specifications

### features.json Schema

```typescript
interface FeaturesFile {
  version: number;
  lastUpdated: string; // ISO 8601
  features: Feature[];
}

interface Feature {
  id: string;           // Unique ID (mvp-1, etc.)
  name: string;         // Human-readable name
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: number;     // Lower = higher priority
  spec?: string;        // OpenSpec spec ID if exists
  acceptance: string[]; // Verifiable criteria
  blockers: string[];   // What's blocking (if blocked)
  notes: string;        // Additional context
}
```

### progress.md Format

```markdown
# Agent Progress Log

## Session: YYYY-MM-DD HH:MM

**Agent**: [identifier if known]
**Focus**: [feature ID]
**Outcome**: [completed | partial | blocked]

### Done
- [What was accomplished]

### Blockers
- [What's blocking progress]

### Decisions
- [Key decisions made and why]

### Next
- [Recommended next steps]
```

### scratchpad.md Format

```markdown
# Current Session Context

**Last Updated**: YYYY-MM-DD HH:MM
**Working On**: [feature ID and name]

## Context
[Current understanding of the problem]

## Approach
[How we're solving it]

## Open Questions
- [Questions that need answers]

## Links
- [Relevant files, docs, PRs]
```

### init.sh Script

```bash
#!/bin/bash
# Agent initialization script

echo "=== Piol Agent Initialization ==="
echo ""

# Show last session
echo "📋 Last Session:"
tail -50 agent/progress.md | head -30
echo ""

# Show current context
echo "📝 Current Context:"
cat agent/scratchpad.md
echo ""

# Find next feature
echo "🎯 Next Feature:"
cat agent/features.json | jq '[.features[] | select(.status == "todo")] | sort_by(.priority) | .[0]'
echo ""

# Show blocked items
echo "🚫 Blocked:"
cat agent/features.json | jq '[.features[] | select(.status == "blocked")]'
```

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Agents ignore harness | Medium | High | Document in AGENTS.md, reference in prompts |
| Stale features.json | Medium | Medium | Require update at session end |
| Over-documentation | Low | Low | Keep files minimal, encourage brevity |
| Merge conflicts | Low | Low | Append-only progress.md, atomic JSON updates |

## Migration Plan

1. Create `agent/` directory with initial files
2. Populate `features.json` from AGENTS.md MVP checklist
3. Update AGENTS.md with harness reference
4. No rollback needed (additive change)

## Open Questions

1. Should `features.json` include non-MVP features? 
   - **Recommendation**: Start MVP-only, expand as needed
   
2. How to handle features that span multiple sessions?
   - **Recommendation**: Keep `in_progress`, document partial progress in notes
   
3. Should agents auto-commit progress updates?
   - **Recommendation**: No, keep commits explicit (human oversight)
