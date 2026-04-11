# Contribution Workflow

Use small, reviewable changes. Discuss meaningful structural reorganizations before implementing them.

## Standard Change Flow

1. Update the effect, docs, or tooling in the smallest coherent slice.
2. Keep public artifacts separate from local-only notes or private validation material.
3. Run the relevant local checks:
   - preview check for effect changes
   - `npm test` for tooling changes
4. If AO3-facing behavior changed, run live AO3 validation before treating the change as complete.
5. Update demo media only when the visible public presentation actually changed.

## Public Versus Local Material

Keep these out of commits:

- `.context/`
- `local/`
- `.playwright-mcp/`
- `.playwright-cli/`
- `.worktrees/`
- `artifacts/`

## Documentation Expectations

- Update `README.md` when the public entrypoint changes.
- Update maintainer docs when repository workflows or structure change.
- Update compatibility notes when live AO3 validation confirms or invalidates a behavior.

## Commit Expectations

- Use short, specific Conventional Commit subjects.
- Keep commits understandable as normal project evolution.
- Do not preserve private process logs or sensitive material in commit history.
