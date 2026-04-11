# Envelope Guide

Use these files from `effects/envelope/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Open `example.html` and choose either the hover block or the tap block.
3. Paste the chosen block into AO3's HTML editor.
4. Replace the placeholder text with your own content.

## Choose A Block

- Use the hover block for desktop-first reading.
- Use the tap block for touch-heavy reading.

## Edit Carefully

You can change:

- sender label
- address lines
- recipient line
- the three text panels

Do not rename or remove structural classes such as `trifold-letter`, `letter-cover`, `letter-top`, `letter-mid`, or `letter-bot`.

## Notes

- AO3 work content does not support JavaScript.
- This effect works best with short text on each fold.
- If creator styles are disabled, the underlying text still needs to read sensibly.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
