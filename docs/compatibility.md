# AO3 Compatibility

This document records what has been confirmed against AO3 and what is still only validated locally.

## Confirmed On AO3

Verified on 2026-04-04 against a logged-in AO3 account:

- the pre-standardization `effects/envelope/work-skin.css` revision used on 2026-04-04 could be saved as an AO3 work skin
- AO3 preserves `<details>` and `<summary>` in posted work HTML.

## Verified Locally Only

The current published structures below have local preview coverage but have not yet been revalidated against a live AO3 account after the root-scoped structure standardization completed on 2026-04-12:

- `effects/envelope/`
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

## Recommended Trigger

When published CSS or published example blocks change:

1. run local review
2. then follow `docs/ao3-live-validation.md`
