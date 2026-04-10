# AO3 Compatibility

This document records what has been confirmed against AO3 and what is still only validated locally.

## Confirmed On AO3

Verified on 2026-04-04 against a logged-in AO3 account:

- `effects/envelope/work-skin.css` can be saved as an AO3 work skin.
- `effects/envelope/smoke-test.html`, `hover-template.html`, and `tap-template.html` render correctly in AO3 Preview.
- The core `trifold-letter / letter-cover / letter-top / letter-mid / letter-bot` structure survives AO3's HTML filtering.
- Both interaction paths work:
  - desktop preview can be checked through `.trifold-letter--preview-open`
  - touch preview can be checked by opening the `details` element
- The mobile breakpoint at `<= 720px` preserves the intended fold offsets and alternating tilt.
- AO3 preserves `<details>` and `<summary>` in posted work HTML.

## Verified Locally Only

The following effects currently pass repository-local structure and CSS checks, but have not yet been revalidated against a live AO3 account:

- `effects/chat-messages/`
- `effects/polaroid/`
- `effects/secret-divider/`
- `effects/typewriter/`

Use `docs/ao3-live-validation.md` before treating those effects as fully AO3-verified.

## Known AO3 Restrictions

Avoid these CSS and HTML patterns in published artifacts:

| Unsupported or filtered | Safer replacement |
|---|---|
| `gap` | Use `margin` |
| `grid-template-columns: repeat()` | Use `inline-block` or `flex` |
| `pointer-events` | Avoid entirely |
| `border-radius` ellipse syntax with `/` | Remove the `/` clause |
| HTML `id` attributes | Use classes instead |

## Still Unconfirmed On AO3

These features work in local previews but have not been reconfirmed in a live AO3 post flow:

| Feature | Why it still needs AO3 validation |
|---|---|
| `@keyframes` / `animation` | Typewriter cursor behavior depends on animation support |
| `perspective` / `transform-style: preserve-3d` | Polaroid flip behavior depends on 3D transform support |

## Recommended Validation Trigger

Run local verification first:

```bash
npm test
```

Then follow `docs/ao3-live-validation.md` whenever you change published CSS, published templates, or AO3-specific compatibility workarounds.
