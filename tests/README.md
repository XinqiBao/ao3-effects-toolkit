# Tests

This directory holds the committed automated checks that are worth keeping in the repository long-term.

## Buckets

- `tooling/` — regressions for the local GIF capture workflow and helper logic
- `contracts/` — regressions for documented repository contracts such as preview boundaries, published structure alignment, and documented compatibility rules

## Keep In Repo

Commit tests when they protect:

- a stable local workflow that contributors are expected to rely on
- a documented repository contract already described in `docs/`
- a regression that has proven likely to recur

## Keep Out Of Repo

Do not commit:

- one-off investigation scripts
- migration-only assertions that no longer describe the active contract
- temporary experiment checks
- visual preference assertions that are not documented repository policy

Keep those in `local/` or the active `.context/work/` task packet instead.
