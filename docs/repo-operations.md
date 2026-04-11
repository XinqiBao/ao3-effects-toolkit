# Repository Operations

This document is the canonical operational map for maintaining this repository.

## Repository Layout

- `effects/`
  - `_shared/preview-shell.css` — shared local preview shell
  - `<name>/`
    - `work-skin.css` — AO3-facing CSS
    - `example.html` — AO3-facing example blocks
    - `preview.html` — local preview page
    - `guide.md` — short usage guide
- `assets/`
  - `demos/` — repository demo GIFs stored in Git LFS
  - `preview-media/` — shared preview-only images stored in Git LFS
- `docs/` — public documentation and maintainer guidance
- `tools/` — GIF capture scripts and their tests
- `.context/`, `local/` — gitignored local process notes and private artifacts

## Core Repository Rules

- Keep published effect behavior CSS-only.
- Scope all AO3-facing selectors under `#workskin`.
- Treat work skins as an enhancement layer; underlying text still needs to read sensibly without styling.
- Keep preview-only helpers out of `work-skin.css` and `example.html`.
- Keep shared preview framing in `effects/_shared/preview-shell.css`.

## Maintenance Expectations

### When editing `effects/<name>/work-skin.css`

- preserve the `#workskin` prefix
- run a local preview check
- if AO3-facing behavior changed, run the live AO3 validation workflow before treating the change as fully verified

### When editing `effects/<name>/example.html`

- keep class names aligned with `work-skin.css`
- keep both hover and tap blocks only when the effect genuinely supports both paths
- use AO3 live validation when the changed block is intended for publishing

### When editing `effects/<name>/preview.html`

- keep the preview focused on the effect itself
- keep preview-only classes out of published artifacts
- keep the shared shell lightweight and consistent across effects

### When editing `tools/`

- keep tooling focused on GIF capture and committed helper tests
- avoid rebuilding a broad repository verification framework

## Generated And Local-Only Paths

Do not commit content from these paths:

- `.context/`
- `local/`
- `.playwright-mcp/`
- `.playwright-cli/`
- `.worktrees/`
- `node_modules/`
- `artifacts/`

## Known Caveats

- `npm test` covers committed GIF-tooling tests only.
- Passing local tooling tests does not prove AO3 will accept or render a change correctly.
- AO3 live validation still depends on a real AO3 account, a current login session, and AO3's Cloudflare gate resolving successfully.
