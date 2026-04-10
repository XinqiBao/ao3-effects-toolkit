# Verification

Use verification in two layers:

1. local verification in this repository
2. live validation against a real AO3 account

Local checks are fast and should run for routine maintenance. AO3 live validation is still required for changes that affect what gets pasted into AO3.

## Local Verification

### Run all local checks

```bash
npm test
```

Equivalent direct command for the structure and CSS scan:

```bash
node tools/verify.mjs
```

### Run one effect only

```bash
node tools/verify.mjs --effect envelope
```

## What `tools/verify.mjs` Checks

- required files exist under `effects/<name>/`
- `work-skin.css` includes the `#workskin` scope
- `hover-template.html` and `tap-template.html` include the expected stage and interaction classes
- `preview.html` follows the shared four-panel preview contract
- required effect class names appear in the CSS
- CSS is scanned for common AO3-incompatible patterns such as `gap`, `pointer-events`, `grid-template-columns: repeat()`, and `border-radius` ellipse syntax
- HTML templates are scanned for `id=` attributes, which AO3 strips

## What `npm test` Adds

- `node --test tools/*.test.mjs`
- `node tools/verify.mjs`

## What Local Verification Does Not Prove

- that AO3 will accept the work skin when saved
- that the rendered result matches expectations on AO3 Preview
- that the current `smoke-test.html` structure matches every required CSS hook
- that an authenticated AO3 workflow is still valid

For those checks, use `docs/ao3-live-validation.md`.

## When To Run Which Checks

### Run local verification after:

- changes to any `work-skin.css`
- changes to `hover-template.html`
- changes to `tap-template.html`
- changes to `smoke-test.html`
- changes to `preview.html`
- changes that alter the expected effect structure

### Run AO3 live validation after:

- CSS changes intended for publishing
- HTML template or smoke-test changes intended for publishing
- any change that touches AO3-specific compatibility workarounds
- any release candidate or final pre-publish review

## Related Docs

- `docs/ao3-live-validation.md`
- `docs/compatibility.md`
- `docs/repo-operations.md`
