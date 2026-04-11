# Repository Entry Points

Start with `README.md` for project context.

Canonical operational docs live under `docs/`:

- `docs/repo-operations.md` — repository map and operational boundaries
- `docs/verification.md` — local review approach and its limits
- `docs/ao3-live-validation.md` — validation against a real AO3 account
- `docs/compatibility.md` — confirmed AO3 support and known restrictions
- `docs/maintainers/effect-authoring.md` — effect directory contract and authoring rules
- `docs/maintainers/preview-principles.md` — preview design constraints
- `docs/maintainers/contribution-workflow.md` — maintenance workflow for repository changes

Highest-signal repository constraints:

- published effects are CSS-only; do not introduce JavaScript into AO3 work content
- scope AO3 CSS under `#workskin`
- `npm test` covers committed GIF-tooling tests only; AO3 validation is a separate workflow
- do not commit content from `.context/`, `local/`, `.playwright-mcp/`, `.playwright-cli/`, `.worktrees/`, `node_modules/`, or `artifacts/`
