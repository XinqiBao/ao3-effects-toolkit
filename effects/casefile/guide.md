# Casefile Guide

Use these files from `effects/casefile/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. From `example.html`, copy the hover block (`<div class="casefile casefile--hover">…`) into AO3's HTML editor.
3. Replace the summary sheet text and the two evidence slips with your own dossier-style copy.

## Customization

- Keep the `.casefile`, `.summary`, `.summary-label`, `.summary-title`, `.summary-copy`, `.slip`, `.slip-label`, `.slip-title`, and `.slip-copy` structure intact so the tucked-slip reveal stays aligned.
- Treat the summary as the one main record the reader sees first.
- Keep the ticket and note slips short. This effect works best when hover reveals two small corroborating fragments, not a second full document stack.

## Notes

- AO3 work content does not run JavaScript; this effect is CSS only.
- If creator styles are disabled, the summary and both slips still appear in source order and remain readable.
- This effect fits dossiers, briefing notes, investigation summaries, and any scene where one primary record is accompanied by a few attached scraps of evidence.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
