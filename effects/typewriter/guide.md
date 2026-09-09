# Typewriter Guide

Use these files from `effects/typewriter/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the tap block (`<details class="typewriter">…`) from `example.html` and paste it into AO3's HTML editor.
3. Replace the prompt and each `.line` with your own copy.

## Customization

- Keep the `.typewriter`, `.trigger`, `.lines`, `.line`, and `.cursor-row` wrappers as-is so the tap reveal and delayed cursor still work.
- You can refresh the line order or prompt wording, but the block should remain the single tap path that reveals lines in sequence.

## Notes

- AO3 work content does not run JavaScript; this effect is CSS only.
- Tap the transcript surface to reveal the lines, then tap the same surface to close it.
- Make sure each staged line reads clearly, even if you add or remove lines.
- AO3 rejects `animation` and `@keyframes` in work skins, so the published cursor appears as a static block after reveal instead of blinking.

## Validation

- Use `preview.html` for a local visual check.
- If anything changes on AO3, follow `docs/ao3-live-validation.md` to revalidate.
