# Search Page Guide

Use these files from `effects/search-page/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. Copy the `<div class="search-page">` block from `example.html` into AO3's HTML editor.
3. Replace the prompt with text from your work. The six wordmark letters and their color classes can be changed independently; keep replacement wordmarks similarly short so they fit narrow screens.

## Notes

- This is a static mockup. The search field does not accept input or open results.
- The decorative search icon loads from a direct Google-hosted PNG URL. It may not appear when external images are blocked; the prompt remains readable.
- Keep the image and hint on the same source line when editing the search field; AO3 inserts a line break between them otherwise.
- Without the work skin, the wordmark and prompt remain in reading order.

## Validation

- Use `preview.html` for local visual review.
- After changing the AO3-facing HTML or CSS, follow `docs/ao3-live-validation.md`.
