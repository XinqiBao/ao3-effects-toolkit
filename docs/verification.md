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

Use the narrower entrypoints when they match the change:

```bash
npm run test:tooling
npm run test:contracts
```

If you changed GIF capture behavior, also run a focused smoke test such as:

```bash
node tools/capture-gifs.mjs envelope
```

## Committed Test Boundary

Commit tests only when they protect a durable repository contract or a long-lived local workflow.

For detailed test-design guidance, see `docs/maintainers/testing-boundaries.md`.

Good candidates:

- capture math or timing regressions that would break committed demo generation
- browser-backed checks for stable preview boundaries or hover behavior
- structure and compatibility assertions that are already documented in the public maintainer docs
- config validation that protects the long-lived GIF capture workflow

Keep out of the repository:

- one-off investigation scripts
- migration-only assertions that are no longer part of the active contract
- temporary experiment checks
- personal visual-preference assertions that are not documented as repository policy
- exact preview sizing or framing calibration that still belongs in maintainer docs or manual review

Keep temporary validation in `local/` or the active `.context/work/` packet until it either proves unnecessary or gets promoted into a documented repository contract.

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
