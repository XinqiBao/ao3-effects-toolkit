# AO3 Live Validation

Use this workflow to confirm that an effect survives AO3's work-skin and work-content filters on a real AO3 account.

It can be followed manually in a browser or assisted by browser automation. Replace `<your-username>` throughout with your AO3 username. If you keep personal validation notes, store them under `local/`.

## When To Run

Run after:

- any change to an effect's `work-skin.css`
- any change to a publishable block in `example.html`
- any AO3-specific compatibility change
- explicit user request

## Validation Flow

### 1. Update the work skin

- open the AO3 work-skin editor
- paste the current `work-skin.css`
- save and note any AO3 CSS rejection

### 2. Create or update a draft work

- create or edit a private draft
- paste one chosen block from `example.html` into the HTML editor
- attach the work skin
- open AO3 Preview

### 3. Check the preview

Confirm:

- `#workskin` exists
- the expected effect classes still appear
- the interaction path you pasted behaves correctly
- the result still looks acceptable in AO3 Preview

### 4. Record the result

Track:

- effect name
- which example block you tested
- whether AO3 accepted the CSS
- whether AO3 Preview rendered the block correctly
- any screenshots or notes kept under `local/`

## Notes

- Wait for Cloudflare to clear after each AO3 navigation.
- Do not publish test drafts; use Preview only.
- Local preview success does not replace AO3 validation.
