# Route Map Guide

Use these files from `effects/route-map/`:

- `work-skin.css`
- `example.html`
- `preview.html`

## Installation

1. Copy `work-skin.css` into your AO3 work skin.
2. From `example.html`, copy the hover block (`<div class="route-map route-map--hover">…`) into AO3's HTML editor.
3. Replace the place names, stop notes, and ending line with your own route text.

## Customization

- Keep the `.route-map`, `.track`, `.stop`, `.marker`, `.place`, `.note`, and `.ending` structure intact so the path stays aligned.
- This effect works best with three stops. More than that makes the hover notes crowded in standard AO3 widths.
- Keep each note short. The point is to annotate a route, not to hide full scene-length prose under each stop.

## Notes

- AO3 work content does not run JavaScript; this effect is CSS only.
- If creator styles are disabled, the stops and notes still read in source order as a simple travel log.
- This effect fits journey summaries, pursuit trails, escape routes, travel montages, and time-and-place framing devices.

## Validation

- Use `preview.html` for a local visual check.
- If the AO3-facing behavior changes, follow `docs/ao3-live-validation.md`.
