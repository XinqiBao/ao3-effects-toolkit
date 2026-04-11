# Typewriter Guide

Use these files from `effects/typewriter/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Open `example.html` and choose the hover block or the tap block.
3. Paste the chosen block into AO3's HTML editor.
4. Replace the prompt and line text.

## Choose A Block

- Use the hover block for desktop-first reading.
- Use the tap block for touch-first reading.

## Edit Carefully

You can change:

- the prompt text
- each `.typewriter-line`
- the hint text if you want

Do not rename or remove the outer structure such as `typewriter-stage`, `typewriter-container`, or `typewriter-line`.

## Notes

- AO3 work content does not support JavaScript.
- The staged reveal should remain readable even if you add a few more lines.
- `@keyframes` support should still be treated as AO3-unconfirmed until revalidated live.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
