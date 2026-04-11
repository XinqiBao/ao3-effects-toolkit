# Polaroid Guide

Use these files from `effects/polaroid/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Open `example.html` and choose the hover block or the tap block.
3. Paste the chosen block into AO3's HTML editor.
4. Replace the caption and back-side note.

## Choose A Block

- Use the hover block for desktop-first reading.
- Use the tap block for touch-first reading.

## Edit Carefully

You can change:

- the front caption
- the back-side note

Do not rename or remove structural classes such as `polaroid-container`, `polaroid-front`, `polaroid-back`, or `polaroid-message`.

## Notes

- AO3 work content does not support JavaScript.
- Keep the back-side message short; the card is physically small.
- The repository version keeps the photo area abstract instead of depending on external images inside AO3.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
