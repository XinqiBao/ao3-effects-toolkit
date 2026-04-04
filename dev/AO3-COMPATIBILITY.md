# AO3 Compatibility Notes

These notes come from live validation against a logged-in AO3 account on
April 4, 2026.

## Confirmed Working

- `bundle/smoke-test.html`
- `bundle/hover-template-zh.html`
- `bundle/tap-template-zh.html`

## Confirmed AO3 Parser Constraints

- AO3 rejected `gap`.
- AO3 rejected `grid-template-columns: repeat(2, minmax(0, 1fr))`.
- AO3 rejected `pointer-events`.
- AO3 strips `id` attributes from posted work HTML, so `:target` anchor patterns
  are not reliable in works.

## Confirmed Preserved HTML

- `details`
- `summary`

## Current Mobile Pattern

- `bundle/tap-template-zh.html` now uses `details/summary`.
- The older `:target` anchor pattern is intentionally retired.

## Validation Tooling

- `dev/scripts/ao3-cdp.mjs`
  Uses Chrome's remote debugging port to inspect and update a live AO3 session.
- `dev/scripts/capture-validation.sh`
  Captures local static screenshots for non-AO3 preview pages.
