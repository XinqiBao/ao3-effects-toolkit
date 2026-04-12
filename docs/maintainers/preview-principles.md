# Preview Principles

Local previews exist to review AO3 effects, not to invent a separate presentation system.

## Shared Preview Rules

- Keep the shared shell in `effects/_shared/preview-shell.css`.
- Keep that shared shell page-level only.
- Default each preview to one canonical display surface.
- Default that canonical preview to the hover version of the effect.
- Keep supporting copy minimal so the effect remains the main subject.
- Default preview structure to `hero + #workskin + canonical effect markup`.

## What Belongs In A Preview

- the published effect CSS
- realistic sample content
- lightweight page framing that helps review the effect
- preview-only geometry helpers that stay outside AO3-facing files
- preview-only asset reinforcement that improves demo legibility without changing structure or behavior

## What Does Not Belong

- a four-panel closed/open matrix
- a default hover/tap comparison layout
- preview-only behavior that AO3 cannot use
- decorative chrome that overwhelms the effect
- extra repository-wide abstractions for one or two outlier effects
- repository-wide card or stage wrapper systems

## GIF Capture Boundary

- capture `#workskin` by default
- keep preview geometry responsibility in preview CSS, not in capture-only wrapper markup
- keep GIF tooling tied to the effect boundary plus effect-local interaction targets
- refresh demo GIFs only when visible public behavior changes meaningfully
