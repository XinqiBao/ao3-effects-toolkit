# Repository Operations

This document is the canonical operational reference for maintaining this repository.

## Document Map

- `README.md` — project overview and effect index
- `docs/verification.md` — local verification workflow and limits
- `docs/ao3-live-validation.md` — validation against a real AO3 account
- `docs/compatibility.md` — confirmed AO3 support and known restrictions
- `docs/decisions/` — architecture decisions

## Repository Layout

- `envelope/`, `chat-messages/`, `polaroid/`, `secret-divider/`, `typewriter/`
  - one self-contained effect per directory
  - each effect directory includes `work-skin.css`, `hover-template.html`, `tap-template.html`, `smoke-test.html`, `preview.html`, and `guide.md`
- `assets/`
  - preview screenshots and other demo media used by the repository docs
- `docs/`
  - cross-effect documentation and maintenance references
- `tools/`
  - repository automation scripts such as `verify.mjs`
- `local/`
  - gitignored local notes and screenshots
- `.playwright-mcp/`, `.playwright-cli/`
  - gitignored browser automation artifacts

## Core Repository Rules

- Keep published effect behavior CSS-only. AO3 work content does not support JavaScript.
- Scope all AO3 work-skin selectors under `#workskin`.
- Offer both interaction paths where applicable:
  - desktop: `:hover`
  - touch: `<details>/<summary>`
- Treat work skins as an enhancement layer. The underlying content still needs to read sensibly without styling.

## Maintenance Expectations

### When editing `work-skin.css`

- preserve the `#workskin` prefix
- run local verification
- if AO3-facing behavior changed, run the live validation workflow on AO3 before considering the change fully verified

### When editing `hover-template.html`, `tap-template.html`, or `smoke-test.html`

- keep class names aligned with `work-skin.css`
- run local verification
- use AO3 live validation when the edited HTML is meant for publishing or smoke testing on AO3

### When editing `preview.html`

- confirm the preview still demonstrates the intended closed/open desktop and mobile states
- update public preview media only when the repository-facing demonstrations actually need to change

### When editing repository docs

- update cross-references in the affected docs
- keep project-facing docs neutral with respect to who is operating the repository
- keep tool-specific discovery files thin and point them back to the canonical docs under `docs/`

## Generated and Local-Only Paths

Do not commit content from these paths:

- `local/`
- `.playwright-mcp/`
- `.playwright-cli/`
- `.worktrees/`
- `node_modules/`
- `artifacts/`

## Known Repository Caveats

- `npm test` is the standard entrypoint for local repository verification and currently runs `node tools/verify.mjs`.
- `tools/verify.mjs` is a local structure and compatibility check. It does not prove that AO3 will accept or render a change correctly.
- `tools/verify.mjs` currently checks that each `smoke-test.html` file exists, but it does not fully validate the smoke-test DOM structure against the CSS class inventory.
- AO3 live validation depends on a real AO3 account, a current login session, and AO3's Cloudflare gate resolving successfully.
- The repository includes browser-automation artifacts and guidance, but there is no committed end-to-end script for AO3 validation.
