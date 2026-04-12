# Verification

Use verification in two layers:

1. local review in this repository
2. live validation against a real AO3 account

## Local Review

Local review is intentionally lightweight.

### For effect changes

- open `effects/<name>/preview.html`
- inspect the canonical preview in a browser or Playwright
- confirm the example block still matches the published CSS structure

### For tooling changes

Run:

```bash
npm test
```

If you changed GIF capture behavior, also run a focused smoke test such as:

```bash
node tools/capture-gifs.mjs envelope
```

## What Local Review Does Not Prove

- that AO3 will accept the work skin when saved
- that AO3 Preview renders the changed example block correctly
- that current AO3 filtering behavior still matches previous assumptions

For those checks, use `docs/ao3-live-validation.md`.

## When To Use AO3 Live Validation

Run the live AO3 workflow after:

- changes to published CSS intended for AO3
- changes to `example.html` blocks intended for AO3
- changes to AO3-specific compatibility workarounds
- any release candidate or pre-publish review
