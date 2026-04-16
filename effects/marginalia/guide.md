# Marginalia Guide

Use these files from `effects/marginalia/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. From `example.html`, copy the hover block (`<div class="marginalia marginalia--hover">…`) into AO3's HTML editor.
3. Replace the passage text, the revised phrase, the added sentence, and the two notes with your own copy.

## Customization

- Keep the `.marginalia`, `.sheet`, `.passage`, `.revision`, `.addition`, `.notes`, and `.note` structure intact so the reveal stays stable.
- Keep the revised phrase short. The crossed-out version works best on one concise phrase, not a full paragraph.
- Keep the added sentence and side notes brief. This effect is strongest when the second layer feels like a correction or aside, not a second full scene.

## Notes

- AO3 work content does not run JavaScript; this effect is CSS only.
- If creator styles are disabled, the passage, addition, and notes should still read sensibly in source order.
- This effect works best for annotations, unreliable narration, memory corrections, and unsent-text framing.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
