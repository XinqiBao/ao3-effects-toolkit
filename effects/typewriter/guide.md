# Typewriter Guide

## Quick Start

Use these files from `effects/typewriter/`:

- `work-skin.css`
- `smoke-test.html`
- `hover-template.html`
- `tap-template.html`
- `preview.html`

Basic flow:

1. Copy `effects/typewriter/work-skin.css` into your AO3 work skin.
2. Paste `effects/typewriter/smoke-test.html` into AO3's HTML editor.
3. Use Preview to confirm the container and staged text structure render.
4. Replace the smoke test with either `hover-template.html` or `tap-template.html`.

Hard constraints:

- AO3 work content does not support JavaScript.
- Readers can disable creator styles, so the lines still need to make sense as plain text.

## Posting On AO3

### 1. Create or update the work skin

1. Log in to AO3.
2. Go to `My Dashboard -> Skins -> Create Work Skin`.
3. Paste `effects/typewriter/work-skin.css`.
4. Save.

### 2. Attach the skin to the work

1. Create or edit a work.
2. In `Associations`, find `Select Work Skin`.
3. Choose the skin you just created.

### 3. Run the smoke test

1. Switch the work body editor to `HTML`.
2. Paste `effects/typewriter/smoke-test.html`.
3. Open Preview.

If you can see the terminal-style container and the staged text lines, the effect is attached correctly.

### 4. Choose the publishing template

| Situation | File | Notes |
|---|---|---|
| Default desktop-first version | `hover-template.html` | Best first choice |
| Touch-heavy audience | `tap-template.html` | Uses `details/summary` |

### 5. Replace the placeholders

Edit only:

- prompt text
- hint text
- each `.typewriter-line`

You can add or remove lines. The CSS already staggers the early lines and still displays longer sequences safely.

Do not:

- delete the outer container structure
- rename classes such as `typewriter-stage`, `typewriter-container`, or `typewriter-line`
- paste in Rich Text mode

## Troubleshooting

### Raw HTML tags are visible

The editor is in the wrong mode. Switch back to `HTML` mode and paste again.

### The work shows plain text with no typewriter styling

The work skin is not attached correctly. Re-run `smoke-test.html` before trying the publishing templates.

### Hover does not work well on phones

Use `tap-template.html`.

### Can I remove the cursor?

Yes. Remove the cursor wrapper from the template if you do not want the blinking cursor effect.

### My preview does not match what every reader sees

Common reasons:

- the reader disabled creator styles
- the reader is using a download format such as PDF or EPUB

## Maintenance And Verification

### Re-run verification after:

- changes to `effects/typewriter/work-skin.css`
- changes to any `effects/typewriter/*.html`
- AO3-specific compatibility adjustments

### Local verification flow

1. Open `effects/typewriter/preview.html` locally and inspect all four states.
2. Run `node tools/verify.mjs --effect typewriter`.
3. Run `npm test` before finalizing broader repository changes.
4. If AO3-facing behavior changed, follow `docs/ao3-live-validation.md`.

### What success looks like

- the closed state shows the shell and prompt cleanly
- the open state reveals the lines in sequence
- hover and tap modes stay aligned with the preview contract

## Notes

- The effect uses a terminal/typewriter visual language: dark background, monospace text, staged line reveal, and a blinking cursor.
- `@keyframes` support should still be treated as AO3-unconfirmed until revalidated live.
