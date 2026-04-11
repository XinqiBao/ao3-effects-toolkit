# Chat Messages Guide

Use these files from `effects/chat-messages/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Quick Start

1. Copy `work-skin.css` into your AO3 work skin.
2. Open `example.html` and choose the hover block or the tap block.
3. Paste the chosen block into AO3's HTML editor.
4. Replace the sample names, timestamps, and message text.

## Choose A Block

- Use the hover block for desktop-first reading.
- Use the tap block for touch-first reading.

## Edit Carefully

You can change:

- sender names
- timestamps
- message text

Do not rename or remove structural wrappers such as `chat-conversation`, `chat-meta`, or `chat-bubble`.

## Notes

- AO3 work content does not support JavaScript.
- The conversation should still read sensibly as plain text if creator styles are disabled.
- Duplicate a full `chat-meta` block if you want more messages.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
