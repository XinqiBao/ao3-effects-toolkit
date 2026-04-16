# AO3 Effects Toolkit

CSS-only interactive effects for [Archive of Our Own](https://archiveofourown.org/) works.

Published AO3 content stays JavaScript-free. Local previews exist only to review each effect and generate repository demo media.

## Effects

| Effect | Preview | Description | Guide |
|---|---|---|---|
| **Envelope** | <img src="assets/demos/envelope.gif" width="220" alt="Envelope effect" /> | A trifold letter that unfolds to reveal three pages of content | [guide](effects/envelope/guide.md) |
| **Chat Messages** | <img src="assets/demos/chat-messages.gif" width="220" alt="Chat messages effect" /> | A collapsed message bar that opens into a longer exchange | [guide](effects/chat-messages/guide.md) |
| **Polaroid** | <img src="assets/demos/polaroid.gif" width="220" alt="Polaroid effect" /> | A polaroid frame that reveals the note on the back | [guide](effects/polaroid/guide.md) |
| **Secret Divider** | <img src="assets/demos/secret-divider.gif" width="220" alt="Secret divider effect" /> | A decorative divider that hides a short line of text | [guide](effects/secret-divider/guide.md) |
| **Typewriter** | <img src="assets/demos/typewriter.gif" width="220" alt="Typewriter effect" /> | A dark transcript panel with staged line reveal | [guide](effects/typewriter/guide.md) |
| **Marginalia** | <img src="assets/demos/marginalia.gif" width="220" alt="Marginalia effect" /> | A manuscript-style passage that reveals revisions and margin notes | [guide](effects/marginalia/guide.md) |
| **Casefile** | <img src="assets/demos/casefile.gif" width="220" alt="Casefile effect" /> | A case-file summary sheet with two tucked evidence slips | [guide](effects/casefile/guide.md) |
| **Route Map** | <img src="assets/demos/route-map.gif" width="220" alt="Route map effect" /> | A three-stop route that reveals short notes at each waypoint | [guide](effects/route-map/guide.md) |

## Quick Start

Each effect directory now contains the same four files:

- `work-skin.css`
- `example.html`
- `preview.html`
- `guide.md`

Basic flow:

1. Copy `effects/<name>/work-skin.css` into your AO3 work skin.
2. Open `effects/<name>/example.html` and copy the canonical block.
3. Paste that block into AO3's HTML editor and replace the placeholder text.
4. Open `effects/<name>/preview.html` locally if you want a quick visual check.
5. If you are publishing or changing AO3-facing behavior, follow [docs/ao3-live-validation.md](docs/ao3-live-validation.md).

## Local Development

```bash
npm test
npm run test:tooling
npm run test:contracts
node tools/capture-gifs.mjs envelope
```

- `npm run test:tooling` covers long-lived regressions for the local GIF capture workflow.
- `npm run test:contracts` covers committed repository contracts for previews, examples, and published CSS boundaries.
- `npm test` runs both buckets.
- `ffmpeg` must be installed locally before running `node tools/capture-gifs.mjs ...`.
- Local preview validation is primarily manual or browser-assisted.

## Documentation

- [Repository Operations](docs/repo-operations.md) — repository map and operational boundaries
- [Verification](docs/verification.md) — local review approach and its limits
- [AO3 Live Validation](docs/ao3-live-validation.md) — validation against a real AO3 account
- [AO3 Compatibility](docs/compatibility.md) — confirmed AO3 support and known restrictions
- [Effect Authoring](docs/maintainers/effect-authoring.md) — effect directory contract and authoring rules
- [Preview Principles](docs/maintainers/preview-principles.md) — preview design constraints
- [Contribution Workflow](docs/maintainers/contribution-workflow.md) — maintenance workflow for repository changes
- [Project Evolution](docs/history/project-evolution.md) — how the repository structure evolved

## AO3 Constraints

AO3 strips or rejects some CSS and HTML features. This toolkit avoids them in published artifacts:

| Forbidden or unreliable | Workaround |
|---|---|
| `gap` | Use `margin` instead |
| `grid-template-columns: repeat()` | Use `flex` or `inline-block` |
| `pointer-events` | Avoid entirely |
| `animation` and `@keyframes` | Use transitions and static end states instead |
| `border-radius` with `/` | Remove the ellipse syntax |
| HTML `id` attributes | Use classes only; AO3 strips `id` |

All AO3-facing CSS stays scoped under `#workskin`. Current published examples are hover-first. If a future effect needs an explicit touch path, prefer `<details>/<summary>`.
