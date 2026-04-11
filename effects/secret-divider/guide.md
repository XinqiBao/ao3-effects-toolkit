# Secret Divider Guide

Use these files from `effects/secret-divider/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Open `example.html` and choose the hover block or the tap block.
3. Paste the chosen block into AO3's HTML editor.
4. Replace the hidden text and, if you want, the ornament characters.

## Choose A Block

- Use the hover block for desktop-first reading.
- Use the tap block for touch-first reading.

## Edit Carefully

You can change:

- the hidden text inside `secret-divider__text-inner`
- the ornament symbols

Do not rename the reveal wrappers or remove the summary structure from the tap block.

## Notes

- AO3 work content does not support JavaScript.
- The hidden message should not carry essential plot information by itself.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
