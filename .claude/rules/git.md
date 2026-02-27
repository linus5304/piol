# Git Conventions

- `main` is branch-protected — always push via feature branch + PR.
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` + ticket/description.
- Commit format: `<scope>(<feature-id>): <description>` — imperative, <72 chars, focus on WHY.
- Scopes: `web`, `convex`, `chore`.
- Before committing: `bun run lint:fix && bun run typecheck`.
- Stage specific files — avoid `git add -A`.
- NEVER force push, reset --hard, or push directly to main.
