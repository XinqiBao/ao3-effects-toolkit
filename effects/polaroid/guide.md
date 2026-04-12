# Polaroid Guide

Use these files from `effects/polaroid/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the canonical hover block from `example.html` (only one block remains).
3. Paste it into AO3's HTML editor and replace the caption and back-side note.

## Editing

- Only change the caption and the message on the back side; leave structural classes such as `polaroid-container`, `polaroid-front`, `polaroid-back`, and `polaroid-message` untouched.
- Keep the back message concise and avoid relying on JavaScript inside AO3.

## Validation

- Use `preview.html` for a local visual sanity check.
- If you change AO3-facing behavior, follow `docs/ao3-live-validation.md`.
