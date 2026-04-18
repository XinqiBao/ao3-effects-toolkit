# Testing Boundaries

Committed tests in this repository should protect durable contracts and repeat regressions, not freeze temporary tuning decisions.

## What Belongs In Committed Tests

- browser-backed checks for visible preview or hover regressions that have already proven easy to reintroduce
- GIF capture helper logic such as clip math, reset behavior, config validation, and effect coverage
- AO3 compatibility restrictions already documented in the public repository docs
- artifact-shape contracts that contributors are expected to preserve across `work-skin.css`, `example.html`, and `preview.html`

## What Belongs In Docs Or Manual Review Instead

- exact preview padding, width, or height tuning
- exact demo framing numbers unless the repository deliberately adopts them as a public contract
- descendant naming-style preferences unless changing the name would break a documented published contract
- migration-only bans on obsolete wrappers, helper classes, or older labels
- duplicated assertions of internal helper defaults only because they match the current implementation

## Promotion Rule

Start uncertain checks outside the committed test suite:

- use manual preview review for visual tuning
- use `local/` or the active `.context/work/` packet for temporary probes
- promote a check into `tests/` only when it is durable, documented, and likely to recur

## Preview Boundary Tests

Preview-boundary automation should verify the repository contract, not a frozen screenshot calibration:

- `#workskin` remains the visible preview and GIF capture boundary
- the open hover state stays inside `#workskin`
- the preview frame stays close to the visible effect instead of stretching across the shell
- exact pixel windows should stay out of committed tests unless the repository intentionally documents a numeric contract

## Tooling Tests

Tooling tests should protect workflow guarantees while leaving room for future refinement:

- validate required capture config shape and values
- cover every published effect directory
- ensure capture selectors stay tied to `#workskin` and effect-local interaction targets
- avoid forbidding future per-effect overrides unless the repository has intentionally standardized them
