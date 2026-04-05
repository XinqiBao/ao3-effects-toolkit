# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AO3 Effects Toolkit — CSS-only visual effects for Archive of Our Own. Currently contains one effect: the trifold envelope/letter. All interactivity is `:hover` or `<details>/<summary>` — no JavaScript.

## Directory Structure

- `envelope/` — Envelope effect
  - `work-skin.css` — CSS (scoped under `#workskin`)
  - `hover-template.html` — Desktop hover template
  - `tap-template.html` — Touch/device template
  - `smoke-test.html` — Minimal test template
  - `preview.html` — Local preview page (4 states: desktop/mobile × closed/open)
  - `guide.md` — User guide + maintainer notes
- `assets/` — Screenshots for README and docs
- `docs/` — Cross-effect documentation
  - `compatibility.md` — AO3 CSS limitations and compatibility matrix
  - `decisions/` — Architecture Decision Records
- `tools/` — Single Playwright verification script
- `local/` — Private data (git-ignored): AO3 test IDs, Playwright auth state
- `.playwright-mcp/` — Playwright artifacts (git-ignored)

## Core Constraints

- No JavaScript in AO3 works — all interactivity is `:hover` or `<details>/<summary>`
- Readers can disable work skin; visual effects are an enhancement layer, not core content
- Download versions don't preserve work skin
- All CSS selectors are prefixed with `#workskin`

## Common Tasks

### Modify the envelope CSS

Edit `envelope/work-skin.css`. All styles must be scoped under `#workskin`. Run `node tools/verify.mjs` to verify locally.

### Add content to a template

Edit `envelope/hover-template.html` or `envelope/tap-template.html`. Content goes inside panel text blocks (`.letter-top-text`, `.letter-mid-text`, `.letter-bot-text`).

### Verify changes

```bash
node tools/verify.mjs         # structure check + screenshots
node tools/verify.mjs --ao3   # + live AO3 validation (needs login)
```

### Add a new effect

Create a new directory parallel to `envelope/`:

```
new-effect/
  work-skin.css
  hover-template.html         # if applicable
  tap-template.html           # if applicable
  preview.html
  guide.md
```

## Architecture

The trifold letter has three panels (top/mid/bot) that unfold on interaction:
- **Hover mode** (`.trifold-letter--hover`) — expands on `:hover`
- **Tap mode** (`.trifold-letter--details`) — `<details>/<summary>` elements; expands when `[open]`
- **Preview mode** (`.trifold-letter--preview-open`) — programmatic open state for validation

All panels animate via CSS `transition` on `top`, `left`, `transform`, and `box-shadow`. Container `height` transitions to reveal unfolded panels.

## Git Notes

- Single dev on main branch — no PRs needed
- Split commits logically by concern (docs, CSS, templates, tooling)
- Never commit `local/` or `.playwright-mcp/` content
