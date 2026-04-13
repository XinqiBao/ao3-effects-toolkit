# AO3 Compatibility

This document records what has been confirmed against AO3 and what is still only validated locally.

## Confirmed On AO3

Verified against a logged-in AO3 account:

- on 2026-04-04, the pre-standardization `effects/envelope/work-skin.css` revision used on that date could be saved as an AO3 work skin
- on 2026-04-13, the current `effects/envelope/` root-scoped structure could be saved as an AO3 work skin and previewed correctly in AO3, including both:
  - the default text-stamp example
  - the optional image-stamp path when given a hotlinkable direct image URL
- on 2026-04-13, the current `effects/polaroid/` root-scoped structure could be saved as an AO3 work skin and previewed correctly in AO3, including both:
  - the default no-image example
  - the optional image path when given a hotlinkable direct image URL
- AO3 preserves `<details>` and `<summary>` in posted work HTML.

## Verified Locally Only

The current published structures below have local preview coverage but have not yet been revalidated against a live AO3 account after the root-scoped structure standardization completed on 2026-04-12:

- `effects/chat-messages/`
- `effects/secret-divider/`
- `effects/typewriter/`

Use `docs/ao3-live-validation.md` before treating those effects as fully AO3-verified.

## Known AO3 Restrictions

Avoid these CSS and HTML patterns in published artifacts:

| Unsupported or filtered | Safer replacement |
|---|---|
| `gap` | Use `margin` |
| `grid-template-columns: repeat()` | Use `inline-block` or `flex` |
| `object-fit` | Use absolute centering plus `width: 100%` and `height: auto` on the image element |
| `pointer-events` | Avoid entirely |
| `border-radius` ellipse syntax with `/` | Remove the `/` clause |
| HTML `id` attributes | Use classes instead |

## Recommended Trigger

When published CSS or published example blocks change:

1. run local review
2. then follow `docs/ao3-live-validation.md`
