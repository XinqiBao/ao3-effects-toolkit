# Chat Messages Guide

## Quick Start

Use these files from `effects/chat-messages/`:

- `work-skin.css`
- `smoke-test.html`
- `hover-template.html`
- `tap-template.html`
- `preview.html`

Basic flow:

1. Copy `effects/chat-messages/work-skin.css` into your AO3 work skin.
2. Paste `effects/chat-messages/smoke-test.html` into AO3's HTML editor.
3. Use Preview to confirm the conversation styling loads.
4. Replace the smoke test with either `hover-template.html` or `tap-template.html`.

Hard constraints:

- AO3 work content does not support JavaScript.
- Readers can disable creator styles, so the conversation still needs to read sensibly as plain text.

## Posting On AO3

### 1. Create or update the work skin

1. Log in to AO3.
2. Go to `My Dashboard -> Skins -> Create Work Skin`.
3. Paste `effects/chat-messages/work-skin.css`.
4. Save.

### 2. Attach the skin to the work

1. Create or edit a work.
2. In `Associations`, find `Select Work Skin`.
3. Choose the skin you just created.

### 3. Run the smoke test

1. Switch the work body editor to `HTML`.
2. Paste `effects/chat-messages/smoke-test.html`.
3. Open Preview.

If the chat preview bar and message structure render, the effect is wired up correctly.

### 4. Choose the publishing template

| Situation | File | Notes |
|---|---|---|
| Default desktop-first version | `hover-template.html` | Expands on hover |
| Touch-heavy audience | `tap-template.html` | Uses `details/summary` |

### 5. Replace the placeholders

Edit only the content:

- speaker names
- message text
- timestamp text

Do not:

- delete structural wrappers such as `chat-meta` or `chat-bubble`
- rename classes such as `chat-bubble--sent` or `chat-bubble--received`
- paste in Rich Text mode

## Troubleshooting

### Raw HTML tags are visible

The editor is in the wrong mode. Switch back to `HTML` mode and paste again.

### The work shows plain text with no chat styling

The work skin is not attached correctly. Re-run `smoke-test.html` before trying the publishing templates.

### Which version should I start with?

Use this order:

1. `smoke-test.html`
2. `hover-template.html`
3. `tap-template.html`

### Hover does not work well on phones

Use `tap-template.html`.

### How do I add more messages?

Duplicate one conversation block and keep the same class structure.

### Can I change the bubble colors?

Yes. Update the sent and received bubble backgrounds in `work-skin.css`.

### My preview does not match what every reader sees

Common reasons:

- the reader disabled creator styles
- the reader is using a download format such as PDF or EPUB

## Maintenance And Verification

### Re-run verification after:

- changes to `effects/chat-messages/work-skin.css`
- changes to any `effects/chat-messages/*.html`
- AO3-specific compatibility adjustments

### Local verification flow

1. Open `effects/chat-messages/preview.html` locally and inspect all four states.
2. Run `node tools/verify.mjs --effect chat-messages`.
3. Run `npm test` before finalizing broader repository changes.
4. If AO3-facing behavior changed, follow `docs/ao3-live-validation.md`.

### What success looks like

- the collapsed state keeps only the preview bar visible
- the expanded state reveals the full conversation
- sent and received bubbles keep the intended styling in both hover and tap modes

## Notes

- The repository version intentionally avoids AO3-problematic CSS such as `gap`, `pointer-events`, and `grid-template-columns: repeat()`.
