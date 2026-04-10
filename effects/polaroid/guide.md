# Polaroid Guide

## Quick Start

Use these files from `effects/polaroid/`:

- `work-skin.css`
- `smoke-test.html`
- `hover-template.html`
- `tap-template.html`
- `preview.html`

Basic flow:

1. Copy `effects/polaroid/work-skin.css` into your AO3 work skin.
2. Paste `effects/polaroid/smoke-test.html` into AO3's HTML editor.
3. Use Preview to confirm the frame and flip structure render.
4. Replace the smoke test with either `hover-template.html` or `tap-template.html`.

Hard constraints:

- AO3 work content does not support JavaScript.
- Readers can disable creator styles, so the text content still needs to work without the visual flip effect.

## Posting On AO3

### 1. Create or update the work skin

1. Log in to AO3.
2. Go to `My Dashboard -> Skins -> Create Work Skin`.
3. Paste `effects/polaroid/work-skin.css`.
4. Save.

### 2. Attach the skin to the work

1. Create or edit a work.
2. In `Associations`, find `Select Work Skin`.
3. Choose the skin you just created.

### 3. Run the smoke test

1. Switch the work body editor to `HTML`.
2. Paste `effects/polaroid/smoke-test.html`.
3. Open Preview.

If you can see the polaroid stack and the front/back structure, the effect is attached correctly.

### 4. Choose the publishing template

| Situation | File | Notes |
|---|---|---|
| Default desktop-first version | `hover-template.html` | Best first choice |
| Touch-heavy audience | `tap-template.html` | Uses `details/summary` |

### 5. Replace the placeholders

Each card has a front side and a back side:

- front side: caption and visual placeholder
- back side: note or message

Do not:

- delete the front/back wrapper structure
- rename classes such as `polaroid-container`, `polaroid-front`, or `polaroid-back`
- paste in Rich Text mode

### Replacing the photo look

AO3 does not support arbitrary external image references reliably inside work skins.

Safer options:

- keep a gradient or color treatment inside `.polaroid-image`
- use simple inline visual placeholders
- only use more complex visuals after testing them directly on AO3

## Troubleshooting

### Raw HTML tags are visible

The editor is in the wrong mode. Switch back to `HTML` mode and paste again.

### The work shows plain text with no polaroid styling

The work skin is not attached correctly. Re-run `smoke-test.html` before trying the publishing templates.

### Hover does not work well on phones

Use `tap-template.html`.

### The flipped side does not read well

The back side is physically small. Keep the message short.

### My preview does not match what every reader sees

Common reasons:

- the reader disabled creator styles
- the reader is using a download format such as PDF or EPUB

## Maintenance And Verification

### Re-run verification after:

- changes to `effects/polaroid/work-skin.css`
- changes to any `effects/polaroid/*.html`
- AO3-specific compatibility adjustments

### Local verification flow

1. Open `effects/polaroid/preview.html` locally and inspect all four states.
2. Run `node tools/verify.mjs --effect polaroid`.
3. Run `npm test` before finalizing broader repository changes.
4. If AO3-facing behavior changed, follow `docs/ao3-live-validation.md`.

### What success looks like

- hover and tap both reveal the back side correctly
- the front/back transition remains readable
- the preview still uses the same published effect CSS rather than preview-only behavior hacks

## Notes

- The current implementation avoids relying on AO3-unconfirmed combinations such as unrestricted external media and brittle 3D-only assumptions without fallback.
