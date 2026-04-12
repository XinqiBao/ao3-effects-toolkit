# Chat Messages Guide

Use these files from `effects/chat-messages/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the canonical hover-only block from `example.html` (top section) into AO3's HTML editor.
3. Replace the sample names, timestamps, and message text with your own content.

## Edit Carefully

You can change:

- sender names
- timestamps
- message text

Do not rename or remove structural wrappers such as `chat`, `entry`, or `bubble`.

## Notes

- AO3 work content does not support JavaScript.
- The conversation should still read sensibly as plain text if creator styles are disabled.
- Duplicate a full `entry` block to add additional exchanges.
- Use `preview.html` to confirm the hover layout mirrors `example.html`.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
