# AO3 Effects Toolkit

CSS-only interactive effects for [Archive of Our Own](https://archiveofourown.org/) works.
Published AO3 content stays JavaScript-free; previews exist only to help maintain and review each effect locally.

## Effects

| Effect | Preview | Description | Guide |
|---|---|---|---|
| **Envelope** | <img src="assets/demos/envelope.gif" width="220" alt="Envelope effect" /> | A trifold letter that unfolds to reveal three pages of content | [guide](effects/envelope/guide.md) |
| **Chat Messages** | <img src="assets/demos/chat-messages.gif" width="220" alt="Chat messages effect" /> | iOS-style conversation bubbles with a collapsed preview bar | [guide](effects/chat-messages/guide.md) |
| **Polaroid** | <img src="assets/demos/polaroid.gif" width="220" alt="Polaroid effect" /> | Photo frames that flip to reveal a message written on the back | [guide](effects/polaroid/guide.md) |
| **Secret Divider** | <img src="assets/demos/secret-divider.gif" width="220" alt="Secret divider effect" /> | Ornamental dividers that hide secret text between decorative lines | [guide](effects/secret-divider/guide.md) |
| **Typewriter** | <img src="assets/demos/typewriter.gif" width="220" alt="Typewriter effect" /> | A dark terminal-style container where text reveals line by line | [guide](effects/typewriter/guide.md) |

## Quick Start

Each published effect lives in `effects/<name>/` and ships with the files needed for AO3 posting:

1. Copy `effects/<name>/work-skin.css` into your [AO3 Work Skin](https://archiveofourown.org/skins).
2. Paste `effects/<name>/smoke-test.html` into AO3's HTML editor and use Preview to confirm the structure renders.
3. Replace the smoke test with either `hover-template.html` or `tap-template.html`, then swap the placeholder text for your own content.
4. Publish.

## Repository Layout

- `effects/<name>/` — one published effect per directory
- `effects/_shared/preview-shell.css` — shared local preview scaffolding
- `assets/demos/` — repository demo GIFs stored in Git LFS
- `assets/preview-media/` — shared preview-only image assets stored in Git LFS
- `docs/` — compatibility notes, maintenance guidance, and project history
- `tools/` — local verification and capture scripts

## Local Development

```bash
npm test
node tools/verify.mjs --effect envelope
node tools/capture-gifs.mjs
```

`npm test` covers repository-local checks only. Real AO3 validation is a separate workflow documented below.

## Documentation

- [Verification](docs/verification.md) — local verification workflow and its limits
- [AO3 Live Validation](docs/ao3-live-validation.md) — validation against a real AO3 account
- [AO3 Compatibility](docs/compatibility.md) — confirmed support and known AO3 restrictions
- [Repository Operations](docs/repo-operations.md) — repository layout, maintenance rules, and local artifact handling
- [Effect Authoring](docs/maintainers/effect-authoring.md) — contract for adding or reshaping effects
- [Preview Principles](docs/maintainers/preview-principles.md) — rules for keeping previews honest and lightweight
- [Contribution Workflow](docs/maintainers/contribution-workflow.md) — maintenance workflow for repository changes
- [Project Evolution](docs/history/project-evolution.md) — how the repository moved from a single effect to a curated toolkit

## AO3 Constraints

AO3 strips or rejects some CSS and HTML features. This toolkit avoids them in published artifacts:

| Forbidden or unreliable | Workaround |
|---|---|
| `gap` | Use `margin` instead |
| `grid-template-columns: repeat()` | Use `flex` or `inline-block` |
| `pointer-events` | Avoid entirely |
| `border-radius` with `/` | Remove the ellipse syntax |
| HTML `id` attributes | Use classes only; AO3 strips `id` |

All AO3-facing CSS stays scoped under `#workskin`. Desktop interaction uses `:hover`; touch interaction uses `<details>/<summary>` where an effect needs an explicit mobile path.

## Scope

- No JavaScript inside AO3 work content
- Work skins are an enhancement layer; the underlying text should remain readable without styling
- Local previews should reuse the same published CSS, not preview-only effect styling
- Demo media and screenshots are repository assets and are stored through Git LFS
