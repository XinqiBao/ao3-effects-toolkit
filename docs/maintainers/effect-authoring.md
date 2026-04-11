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

## Example Rules

- Current interactive effects keep both hover and tap blocks in `example.html`.
- Future effects do not automatically require both paths.
- Provide both blocks only when the effect genuinely needs both interaction models.

## Verification Expectations

After changing an effect:

1. open `preview.html` locally
2. confirm the example block still matches the published CSS structure
3. if AO3-facing behavior changed, run the live AO3 validation workflow
4. if tooling changed, run `npm test`

## Review Checklist

- Does the effect still read sensibly when styling is disabled?
- Does the published CSS stay inside `#workskin`?
- Do `work-skin.css` and `example.html` still agree on structure?
- Does the preview use the shared shell without changing the published behavior?
