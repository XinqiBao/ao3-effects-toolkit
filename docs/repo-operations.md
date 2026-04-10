# Repository Operations

This document is the canonical operational reference for maintaining this repository.

## Document Map

- `README.md` — project overview and effect index
- `docs/verification.md` — local verification workflow and limits
- `docs/ao3-live-validation.md` — validation against a real AO3 account
- `docs/compatibility.md` — confirmed AO3 support and known restrictions
- `docs/maintainers/effect-authoring.md` — effect authoring contract
- `docs/maintainers/preview-principles.md` — preview design constraints
- `docs/maintainers/contribution-workflow.md` — repository maintenance workflow
- `docs/history/project-evolution.md` — public history summary
- `docs/decisions/` — architecture decisions

## Repository Layout

- `effects/`
  - `_shared/preview-shell.css` — shared local preview shell
  - `<name>/` — one published effect per directory
  - each effect directory includes `work-skin.css`, `hover-template.html`, `tap-template.html`, `smoke-test.html`, `preview.html`, and `guide.md`
- `assets/`
  - `demos/` — repository demo GIFs stored in Git LFS
  - `preview-media/` — shared preview-only images stored in Git LFS
  - `*.png` — repository screenshots and validation captures stored in Git LFS
- `docs/`
  - cross-effect documentation, maintainer guidance, and project history
- `tools/`
  - repository automation scripts such as `verify.mjs` and `capture-gifs.mjs`
- `local/`, `.context/`
  - gitignored local notes, task state, and private artifacts
- `.playwright-mcp/`, `.playwright-cli/`
  - gitignored browser automation artifacts

## Core Repository Rules

- Keep published effect behavior CSS-only. AO3 work content does not support JavaScript.
- Scope all AO3 work-skin selectors under `#workskin`.
- Offer both interaction paths where applicable:
  - desktop: `:hover`
  - touch: `<details>/<summary>`
- Treat work skins as an enhancement layer. The underlying content still needs to read sensibly without styling.
- Keep shared preview styling in `effects/_shared/preview-shell.css`; effect-specific visuals belong in the published effect CSS, not in preview-only overrides.

## Maintenance Expectations

### When editing `effects/<name>/work-skin.css`

- preserve the `#workskin` prefix
- run local verification
- if AO3-facing behavior changed, run the live validation workflow on AO3 before considering the change fully verified

### When editing `effects/<name>/hover-template.html`, `tap-template.html`, or `smoke-test.html`

- keep class names aligned with `work-skin.css`
- run local verification
- use AO3 live validation when the edited HTML is meant for publishing or smoke testing on AO3

### When editing `effects/<name>/preview.html`

- confirm the preview still demonstrates the intended closed/open desktop and mobile states
- keep the preview shell lightweight and consistent across effects
- update public demo media only when the repository-facing demonstration actually changed

### When editing repository docs

- update cross-references in the affected docs
- keep project-facing docs neutral with respect to who is operating the repository
- keep tool-specific discovery files thin and point them back to the canonical docs under `docs/`

## Generated and Local-Only Paths

Do not commit content from these paths:

- `.context/`
- `local/`
- `.playwright-mcp/`
- `.playwright-cli/`
- `.worktrees/`
- `node_modules/`
- `artifacts/`

## Known Repository Caveats

- `npm test` is the standard entrypoint for local repository verification. It runs the committed unit tests and `node tools/verify.mjs`.
- `tools/verify.mjs` is a local structure and compatibility check. It does not prove that AO3 will accept or render a change correctly.
- AO3 live validation depends on a real AO3 account, a current login session, and AO3's Cloudflare gate resolving successfully.
- The repository includes browser-capture tooling for demo GIFs, but there is no committed end-to-end AO3 publish automation.
