# Secret Divider Guide

## Quick Start

Use these files from `effects/secret-divider/`:

- `work-skin.css`
- `smoke-test.html`
- `hover-template.html`
- `tap-template.html`
- `preview.html`

Basic flow:

1. Copy `effects/secret-divider/work-skin.css` into your AO3 work skin.
2. Paste `effects/secret-divider/smoke-test.html` into AO3's HTML editor.
3. Use Preview to confirm the ornament and hidden-text structure render.
4. Replace the smoke test with either `hover-template.html` or `tap-template.html`.

Hard constraints:

- AO3 work content does not support JavaScript.
- Readers can disable creator styles, so the hidden message should not carry critical plot information by itself.

## Posting On AO3

### 1. Create or update the work skin

1. Log in to AO3.
2. Go to `My Dashboard -> Skins -> Create Work Skin`.
3. Paste `effects/secret-divider/work-skin.css`.
4. Save.

### 2. Attach the skin to the work

1. Create or edit a work.
2. In `Associations`, find `Select Work Skin`.
3. Choose the skin you just created.

### 3. Run the smoke test

1. Switch the work body editor to `HTML`.
2. Paste `effects/secret-divider/smoke-test.html`.
3. Open Preview.

If you can see the divider line and reveal behavior, the effect is attached correctly.

### 4. Choose the publishing template

| Situation | File | Notes |
|---|---|---|
| Default desktop-first version | `hover-template.html` | Best first choice |
| Touch-heavy audience | `tap-template.html` | Uses `details/summary` |

### 5. Replace the placeholders

Edit only:

- the hidden text inside `secret-divider__text-inner`
- the ornament characters inside `secret-divider__ornament`

Do not:

- rename classes
- delete the reveal wrappers
- paste in Rich Text mode

## Troubleshooting

### Raw HTML tags are visible

The editor is in the wrong mode. Switch back to `HTML` mode and paste again.

### The divider appears but the hidden text never reveals

The work skin is not attached correctly, or the HTML structure was changed. Re-run `smoke-test.html`.

### Hover does not work well on phones

Use `tap-template.html`.

### Can I use many of these in one work?

Yes, but keep the hidden text short so the reveal stays readable.

### My preview does not match what every reader sees

Common reasons:

- the reader disabled creator styles
- the reader is using a download format such as PDF or EPUB
- browsers render transitions slightly differently

## Maintenance And Verification

### Re-run verification after:

- changes to `effects/secret-divider/work-skin.css`
- changes to any `effects/secret-divider/*.html`
- AO3-specific compatibility adjustments

### Local verification flow

1. Open `effects/secret-divider/preview.html` locally and inspect all four states.
2. Run `node tools/verify.mjs --effect secret-divider`.
3. Run `npm test` before finalizing broader repository changes.
4. If AO3-facing behavior changed, follow `docs/ao3-live-validation.md`.

### What success looks like

- the ornament remains visible in the closed state
- the hidden text becomes visible in both hover and tap modes
- the preview still reflects the real published CSS behavior

## Notes

- Decorative Unicode symbols are part of the effect design and can be swapped, but keep readability and spacing in mind.
