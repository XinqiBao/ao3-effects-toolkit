# Envelope Guide

## Quick Start

Use these files from `effects/envelope/`:

- `work-skin.css`
- `smoke-test.html`
- `hover-template.html`
- `tap-template.html`
- `preview.html`

Basic flow:

1. Copy `effects/envelope/work-skin.css` into your AO3 work skin.
2. Paste `effects/envelope/smoke-test.html` into AO3's HTML editor.
3. Use Preview to confirm that the envelope renders.
4. Replace the smoke test with either `hover-template.html` or `tap-template.html`.

Hard constraints:

- AO3 work content does not support JavaScript.
- Readers can disable creator styles, so the core text still needs to make sense without the effect.

## Posting On AO3

### 1. Create or update the work skin

1. Log in to AO3.
2. Go to `My Dashboard -> Skins -> Create Work Skin`.
3. Paste `effects/envelope/work-skin.css`.
4. Save.

### 2. Attach the skin to the work

1. Create or edit a work.
2. In `Associations`, find `Select Work Skin`.
3. Choose the skin you just created.

### 3. Run the smoke test

1. Switch the work body editor to `HTML`.
2. Paste `effects/envelope/smoke-test.html`.
3. Open Preview.

If you can see the addressed envelope and the folded letter structure, the skin is attached correctly.

### 4. Choose the publishing template

| Situation | File | Notes |
|---|---|---|
| Default desktop-first version | `hover-template.html` | Best first choice |
| Touch-heavy audience | `tap-template.html` | Uses `details/summary` instead of hover |

### 5. Replace the placeholders

Edit only the visible content placeholders:

- sender label or subtitle
- sender address lines
- recipient name or letter title
- first panel text
- second panel text
- third panel text

Do not:

- delete structural tags
- rename classes such as `trifold-letter`, `letter-cover`, `letter-top`, `letter-mid`, or `letter-bot`
- paste in Rich Text mode

## Troubleshooting

### Raw HTML tags are visible

The editor is in the wrong mode. Switch back to `HTML` mode and paste again.

### The work shows plain text with no envelope styling

The work skin is not attached correctly. Re-run `smoke-test.html` before trying the publishing templates.

### Which version should I start with?

Use this order:

1. `smoke-test.html`
2. `hover-template.html`
3. `tap-template.html`

### Hover does not work well on phones

Use `tap-template.html`.

### Why not use a `:target` anchor version?

AO3 strips `id` attributes from work HTML, so anchor-based interaction is not reliable there.

### The unfolded letter feels cramped

This effect is designed for short content blocks on each fold. It is an enhancement, not a general-purpose long-form layout system.

### My preview does not match what every reader sees

Common reasons:

- the reader disabled creator styles
- the reader is using a download format such as PDF or EPUB

## Maintenance And Verification

Use this section only when maintaining the effect.

### Re-run verification after:

- changes to `effects/envelope/work-skin.css`
- changes to any `effects/envelope/*.html`
- AO3-specific compatibility adjustments

### Local verification flow

1. Open `effects/envelope/preview.html` locally and inspect all four states.
2. Run `node tools/verify.mjs --effect envelope`.
3. Run `npm test` before finalizing broader repository changes.
4. If AO3-facing behavior changed, follow `docs/ao3-live-validation.md`.

### What success looks like

- `smoke-test.html` includes the expected envelope and fold structure
- the hover template opens correctly when forced with `.trifold-letter--preview-open`
- the tap template opens correctly through `details[open]`

### Common maintenance failures

- mobile breakpoint behavior looks wrong because the test viewport is too narrow
- class names in HTML were changed without matching CSS updates
- preview-only edits accidentally diverged from the published effect CSS

## Notes

- Reference inspiration last reviewed on 2026-04-04:
  `https://archiveofourown.org/works/82088401/chapters/216016191`
- The repository intentionally uses generic class names rather than copying work-specific names from the reference page.
