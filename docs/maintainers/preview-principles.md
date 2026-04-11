# Preview Principles

Local previews exist to review AO3 effects, not to invent a separate presentation system.

## Shared Preview Rules

- Keep the shared shell in `effects/_shared/preview-shell.css`.
- Current interactive effects use two cards:
  - hover
  - tap
- Keep supporting copy minimal so the effect remains the main subject.

## What Belongs In A Preview

- the published effect CSS
- realistic sample content
- lightweight framing that helps review the effect
- preview-only layout helpers that stay outside AO3-facing files

## What Does Not Belong

- a four-panel closed/open matrix
- preview-only behavior that AO3 cannot use
- decorative chrome that overwhelms the effect
- extra repository-wide abstractions for one or two outlier effects

## GIF Capture Boundary

- capture the preview stage, not the whole card
- keep GIF tooling tied to the preview shell only
- refresh demo GIFs only when visible public behavior changes meaningfully
