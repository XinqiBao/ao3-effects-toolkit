# Polaroid Guide

Use these files from `effects/polaroid/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the canonical hover block from `example.html` (only one block remains).
3. Paste it into AO3's HTML editor and replace the caption and back-side note.

If you want a real front-side photo on AO3, replace the empty `.photo` slot with the optional `<img>` block shown in `example.html`.

## Editing

- Only change the caption and the message on the back side; leave structural classes such as `polaroid`, `front`, `back`, `photo`, and `message` untouched.
- The default example remains valid without any image; the gradient photo area is the built-in fallback.
- If you add a photo, point `src` to a stable external direct image URL because AO3 does not host work images for you.
- Keep the back message concise and avoid relying on JavaScript inside AO3.

## Validation

- Use `preview.html` for a local visual sanity check.
- If you change AO3-facing behavior, follow `docs/ao3-live-validation.md`.
