# Tasks: Add Agent Development Harness

## 1. Create Agent Directory Structure
- [x] 1.1 Create `agent/` directory at project root
- [x] 1.2 Add `agent/` to `.gitignore` comments (track, don't ignore)

## 2. Create features.json
- [x] 2.1 Create `agent/features.json` with schema
- [x] 2.2 Populate with MVP features from AGENTS.md
- [x] 2.3 Set initial statuses based on current state:
  - `mvp-0` (auth pages): done
  - `mvp-1` through `mvp-6`: todo
- [x] 2.4 Add acceptance criteria for each feature

## 3. Create Session Files
- [x] 3.1 Create `agent/progress.md` with initial entry
- [x] 3.2 Create `agent/scratchpad.md` with current context
- [x] 3.3 Create `agent/init.sh` startup script
- [x] 3.4 Make `init.sh` executable

## 4. Update Documentation
- [x] 4.1 Update `AGENTS.md` with agent harness section
- [x] 4.2 Add session workflow instructions
- [x] 4.3 Reference harness in OpenSpec workflow

## 5. Validation
- [x] 5.1 Run `./agent/init.sh` and verify output
- [x] 5.2 Verify `jq` queries work on features.json
- [x] 5.3 Ensure all files are tracked in git

## Dependencies

- None (additive change)

## Parallelizable

- Tasks 2.x and 3.x can run in parallel
- Task 4.x depends on 2.x and 3.x completion
- Task 5.x depends on all prior tasks
