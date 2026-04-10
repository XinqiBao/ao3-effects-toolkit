# Effect Authoring

Use this document when adding a new effect or making a structural change to an existing one.

## Effect Directory Contract

Each published effect lives in `effects/<name>/` and should include:

- `work-skin.css`
- `hover-template.html`
- `tap-template.html`
- `smoke-test.html`
- `preview.html`
- `guide.md`

The repository assumes that contract in verification and preview tooling.

## Authoring Rules

- Keep AO3-facing behavior CSS-only.
- Scope all published selectors under `#workskin`.
- Use classes, not `id` attributes.
- Prefer simple HTML structures that degrade gracefully when work skins are disabled.
- Treat hover and tap as separate interaction paths only when both are needed by the effect.

## Shared Constraints

- Avoid AO3-incompatible CSS such as `gap`, `pointer-events`, and `grid-template-columns: repeat()`.
- Keep preview-only helpers out of published templates unless the same class is also valid in AO3 content.
- Reuse `effects/_shared/preview-shell.css` for preview framing instead of rebuilding the shell per effect.
- Keep preview media in `assets/preview-media/` only when it materially helps review the effect.

## Required Verification

After changing an effect:

1. Run `node tools/verify.mjs --effect <name>`.
2. Run `npm test` before finalizing the change.
3. If published AO3 behavior changed, run the live AO3 validation workflow as well.

## Review Checklist

- Does the effect still read sensibly when styling is disabled?
- Does the published CSS stay inside `#workskin`?
- Do the templates and CSS agree on the same class names?
- Does the preview use the shared shell and the same published CSS?
- Did the change avoid introducing private notes, local artifacts, or tool-specific state into the repository?
