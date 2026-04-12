# Secret Divider Guide

Use these files from `effects/secret-divider/` as the single source of truth:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the hover block from `example.html` and paste it into AO3's HTML editor.
3. Replace the hidden text (inside `.message`) and, if desired, the ornament characters.

## Canonical Hover

`secret-divider--hover` is the only supported reveal; both `example.html` and `preview.html` show that block so you always know what will render.

## Edit Notes

- Keep the reveal wrappers and the hover structure intact.
- AO3 work content does not support JavaScript, so stay CSS-only.
- The hidden text should not carry essential plot information by itself.

## Validation

- Use `preview.html` for a local visual check.
