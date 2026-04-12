# Typewriter Guide

Use these files from `effects/typewriter/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. From `example.html`, copy the hover block (`<div class="typewriter typewriter--hover">…`) and paste it into AO3's HTML editor.
3. Replace the prompt and each `.line` with your own copy.

## Customization

- Keep the `.typewriter`, `.lines`, `.line`, and `.cursor-row` wrappers as-is so the hover reveal and cursor animation keep working.
- You can refresh the line order or hint wording, but the block should remain the single hover path that reveals lines in sequence.

## Notes

- AO3 work content does not run JavaScript; this effect is CSS only.
- Make sure each staged line reads clearly, even if you add or remove lines.
- Treat `@keyframes` support as AO3-unconfirmed until you validate it live.

## Validation

- Use `preview.html` for a local visual check.
- If anything changes on AO3, follow `docs/ao3-live-validation.md` to revalidate.
