# Contribution Workflow

Use small, reviewable changes. Discuss meaningful structural reorganizations before implementing them.

## Standard Change Flow

1. Update the effect, docs, or tooling in the smallest coherent slice.
2. Keep public artifacts separate from local-only notes or private validation material.
3. Run repository-local verification.
4. If AO3-facing behavior changed, run live AO3 validation before treating the change as complete.
5. Update demo media only when the public presentation actually changed.

## Public Versus Local Material

Keep these out of commits:

- `.context/`
- `local/`
- `.playwright-mcp/`
- `.playwright-cli/`
- `.worktrees/`
- `artifacts/`

If a note is useful only for the current operator or current machine, keep it local.

## Documentation Expectations

- Update `README.md` when the public entrypoint changes.
- Update maintainer docs when repository workflows or structure change.
- Update compatibility notes when live AO3 validation confirms or invalidates a behavior.

## Verification Expectations

Minimum bar for routine changes:

- `npm test`

Additional bar for AO3-facing changes:

- follow `docs/ao3-live-validation.md`

## Commit Expectations

- Use short, specific Conventional Commit subjects.
- Keep commits understandable as normal project evolution.
- Do not preserve private process logs or sensitive material in commit history.
