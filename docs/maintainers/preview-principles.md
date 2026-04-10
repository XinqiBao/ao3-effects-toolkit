# Preview Principles

Local previews exist to review AO3 effects, not to invent a separate presentation system.

## Primary Goal

A preview should make it easy to inspect the effect's real published CSS and HTML states without adding preview-only styling that would misrepresent AO3 behavior.

## Shared Preview Rules

- Keep the shared shell in `effects/_shared/preview-shell.css`.
- Reuse the same four-panel structure across effects:
  - desktop closed
  - desktop open
  - mobile closed
  - mobile open
- Prefer one shared layout pattern over custom preview chrome per effect.
- Keep supporting copy and framing minimal so the effect remains the main subject.

## What Belongs In A Preview

- the published effect CSS
- realistic sample content
- lightweight framing that helps compare states
- shared preview-only layout helpers that do not alter the effect itself

## What Does Not Belong

- bespoke per-effect art direction that overwhelms the effect
- preview-only interaction logic that AO3 cannot use
- decorative styling that changes the perceived behavior of the published CSS
- large media assets unless they directly support the effect demo

## Media Guidance

- Store demo GIFs in `assets/demos/` through Git LFS.
- Store shared still images in `assets/preview-media/` through Git LFS.
- Keep repository screenshots and validation captures in `assets/` and track them through Git LFS as well.

## When To Refresh Demo Media

Refresh demo GIFs or screenshots only when the visible public behavior changed in a meaningful way. Routine copy edits or internal refactors should not force media churn.
