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
- on 2026-04-16, the current `effects/typewriter/` root-scoped structure could be saved and previewed after refactoring the prompt into a stable hover-stage overlay; the lower-edge hover regression no longer reproduced and the cursor still appears as a static block after reveal
- on 2026-04-17, the current `effects/chat-messages/` hover-stability revision could be saved and previewed correctly after replacing the instant preview removal with a stable hover surface; the collapsed bar still renders and the conversation opens without hover dropouts
- AO3 preserves `<details>` and `<summary>` in posted work HTML.
- on 2026-09-24, the current CSS for all eight interactive effects saved in one work skin, and their example HTML rendered in AO3 Preview; each opened and closed by click, and typewriter also closed with Enter
- on 2026-09-24, the static `effects/search-page/` CSS saved and its current example HTML rendered in AO3 Preview, including the externally hosted search icon
- on 2026-09-24, route-map's expanded notes showed their full text at a 320px viewport after increasing the reveal height; the search page, route-map, and typewriter fit within the same viewport

## Known Mobile Limits

- `casefile` clips the evidence slips on narrow screens.
- `marginalia` clips the right-hand notes on narrow screens.

Both retain their desktop paper layouts; their narrow-screen presentation needs a separate design pass.

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
| `@media` in work skins | AO3 removes the wrapper and applies its inner rules unconditionally; use viewport-independent rules |
| `clamp()` CSS values | AO3 rejects the work skin; use supported fixed values |
| Newlines between inline search-field contents | AO3 may insert `<br>`; keep the image and hint together on one line |

## Recommended Trigger

When published CSS or published example blocks change:

1. run local review
2. then follow `docs/ao3-live-validation.md`
