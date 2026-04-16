# AO3 Compatibility

This document records what has been confirmed against AO3 and what is still only validated locally.

## Confirmed On AO3

Verified against a logged-in AO3 account:

- on 2026-04-04, the pre-standardization `effects/envelope/work-skin.css` revision used on that date could be saved as an AO3 work skin
- on 2026-04-16, the current default published variants for all eight root-scoped effects could be saved as AO3 work skins and previewed correctly in AO3:
  - `effects/chat-messages/`
  - `effects/envelope/`
  - `effects/polaroid/`
  - `effects/secret-divider/`
  - `effects/typewriter/`
  - `effects/marginalia/`
  - `effects/casefile/`
  - `effects/route-map/`
- on 2026-04-13, the current `effects/envelope/` root-scoped structure could be saved as an AO3 work skin and previewed correctly in AO3, including both:
  - the default text-stamp example
  - the optional image-stamp path when given a hotlinkable direct image URL
- on 2026-04-13, the current `effects/polaroid/` root-scoped structure could be saved as an AO3 work skin and previewed correctly in AO3, including both:
  - the default no-image example
  - the optional image path when given a hotlinkable direct image URL
- on 2026-04-15, the current `effects/typewriter/` root-scoped structure could be saved and previewed after removing the rejected `animation`/`@keyframes` cursor blink; the cursor now appears as a static block after reveal
- AO3 preserves `<details>` and `<summary>` in posted work HTML.

## Verified Locally Only

Current published effect roots are not waiting on post-standardization AO3 revalidation.

## Known AO3 Restrictions

Avoid these CSS and HTML patterns in published artifacts:

| Unsupported or filtered | Safer replacement |
|---|---|
| `gap` | Use `margin` |
| `grid-template-columns: repeat()` | Use `inline-block` or `flex` |
| `object-fit` | Use absolute centering plus `width: 100%` and `height: auto` on the image element |
| `pointer-events` | Avoid entirely |
| `animation` and `@keyframes` | Use transitions and static end states instead |
| `border-radius` ellipse syntax with `/` | Remove the `/` clause |
| HTML `id` attributes | Use classes instead |

## Recommended Trigger

When published CSS or published example blocks change:

1. run local review
2. then follow `docs/ao3-live-validation.md`
