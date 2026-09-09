# Effect Authoring

Use this document when adding a new effect or reshaping an existing one.

## Effect Directory Contract

Each published effect lives in `effects/<name>/` and should include:

- `work-skin.css`
- `example.html`
- `preview.html`
- `guide.md`

## Authoring Rules

- Keep AO3-facing behavior CSS-only.
- Scope all published selectors under `#workskin`.
- Use classes, not `id` attributes.
- Prefer simple HTML structures that degrade gracefully when work skins are disabled.
- Keep preview-only helpers out of `work-skin.css` and `example.html`.
- Keep `preview.html` structurally close to the canonical published example.

## Structure Rules

- Use a `details` element with the effect name as the published root class.
- Use one direct-child `summary.trigger` as the complete interaction surface.
- Keep animated effect content inside the trigger so closing transitions remain visible.
- Use phrasing elements such as `span` inside `summary`; style their layout through effect classes.
- Derive the open state from `[open]`; do not add hover or device-specific trigger branches.
- Anchor published CSS from `#workskin .<effect-root>`.
- Prefer short, role-based descendant names inside the root scope instead of repeating the effect prefix.
- Prefer a base class plus modifier when sibling parts are the same kind of structure with small role differences.

Examples:

- `<details class="polaroid"><summary class="trigger">…`
- `<details class="chat"><summary class="trigger">…`
- `panel panel--top`
- `entry entry--sent`
- `bubble bubble--received`

Avoid vague descendant names such as `inner`, `wrapper`, or `container` unless the element truly has no stronger role.

Keep a wrapper only when it has a clear responsibility, such as:

- positioning context
- 3D transform context
- overflow or clipping boundary
- spacing or geometry control that cannot live on a more meaningful element
- pseudo-element attachment point
- stable interaction-area preservation

## Example Rules

- Default to one canonical block in `example.html`.
- Default that canonical block to tap using `details/summary`.
- Add a secondary variant only when the difference is materially larger than a small trigger-path change.
- Keep the example block aligned with the current root and descendant naming contract.

## Verification Expectations

After changing an effect:

1. open `preview.html` locally
2. confirm the example block still matches the published CSS structure
3. confirm preview-only CSS is limited to geometry reservation or effect-local asset reinforcement
4. if AO3-facing behavior changed, run the live AO3 validation workflow
5. if tooling changed, run `npm test`

## Preview Helper Rules

Allowed preview-only helpers:

- geometry reservation on `#workskin`
- effect-local asset reinforcement on existing effect elements

Disallowed preview-only helpers:

- wrapper shells added only for preview framing
- capture-only structural wrappers
- preview-only behavior that changes the published interaction model

## Review Checklist

- Does the effect still read sensibly when styling is disabled?
- Does the published CSS stay inside `#workskin`?
- Does one direct-child `summary.trigger` open and close the effect?
- Does keyboard activation work through the native summary control?
- Do `work-skin.css` and `example.html` still agree on structure?
- Does the preview keep `#workskin` as the visible effect boundary?
- Does the preview use the shared shell without changing the published behavior?
