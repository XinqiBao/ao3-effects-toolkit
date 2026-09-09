# Secret Divider Guide

Use these files from `effects/secret-divider/` as the single source of truth:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the tap block from `example.html` and paste it into AO3's HTML editor.
3. Replace the hidden text inside `.message` and edit the ornament string directly inside `.ornament` if you want different symbols.

## Canonical Interaction

Tap the divider to reveal its note, then tap the same surface to close it. Both `example.html` and `preview.html` use this one interaction.

## Edit Notes

- Keep the `details`, `summary.trigger`, and reveal wrappers intact.
- AO3 work content does not support JavaScript, so stay CSS-only.
- The hidden text should not carry essential plot information by itself.

## Validation

- Use `preview.html` for a local visual check.
