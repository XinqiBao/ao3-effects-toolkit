# AO3 Effects Toolkit

Interactive CSS effects for [Archive of Our Own](https://archiveofourown.org/) works.
Pure CSS — no JavaScript required.

## Effects

| Effect | Preview | Description | Guide |
|---|---|---|---|
| **Envelope** | <img src="assets/envelope.gif" width="220" alt="Envelope effect" /> | A trifold letter that unfolds to reveal three pages of content | [guide](envelope/guide.md) |
| **Chat Messages** | <img src="assets/chat-messages.gif" width="220" alt="Chat messages effect" /> | iOS-style conversation bubbles with a collapsed preview bar | [guide](chat-messages/guide.md) |
| **Polaroid** | <img src="assets/polaroid.gif" width="220" alt="Polaroid effect" /> | Photo frames that flip to reveal a message written on the back | [guide](polaroid/guide.md) |
| **Secret Divider** | <img src="assets/secret-divider.gif" width="220" alt="Secret divider effect" /> | Ornamental dividers that hide secret text between decorative lines | [guide](secret-divider/guide.md) |
| **Typewriter** | <img src="assets/typewriter.gif" width="220" alt="Typewriter effect" /> | A dark terminal-style container where text reveals line by line | [guide](typewriter/guide.md) |

## Quick Start

Each effect is a self-contained directory with a `guide.md` that walks through copy-pasting to AO3:

1. Copy `<effect>/work-skin.css` to your [AO3 Work Skin](https://archiveofourown.org/skins)
2. Paste `<effect>/smoke-test.html` into your work's HTML editor and Preview — confirm the effect renders
3. Swap in `<effect>/hover-template.html` (desktop) or `<effect>/tap-template.html` (mobile) and replace placeholders
4. Publish

## Local Development

```bash
npm test                                 # Unit tests + structure/CSS verification
node tools/verify.mjs --effect envelope  # Structure check + CSS lint for one effect only
node tools/capture-gifs.mjs             # Re-generate all demo GIFs (requires ffmpeg)
```

## Documentation

- [Verification](docs/verification.md) — local verification workflow and its limits
- [AO3 Live Validation](docs/ao3-live-validation.md) — real-account validation workflow on AO3
- [AO3 Compatibility](docs/compatibility.md) — confirmed support and known AO3 restrictions
- [Repository Operations](docs/repo-operations.md) — repository layout, maintenance rules, and local artifact handling

## AO3 Constraints

AO3 strips or rejects certain CSS/HTML features. This toolkit avoids them:

| Forbidden | Workaround |
|---|---|
| `gap` | Use `margin` instead |
| `grid-template-columns: repeat()` | Use `flex` or `inline-block` |
| `pointer-events` | Avoid entirely |
| `border-radius` with `/` | Remove the `/` ellipse syntax |
| HTML `id` attributes | AO3 strips them — use classes only |

All CSS is scoped under `#workskin` (required by AO3). Effects use `:hover` for desktop and `<details>/<summary>` for mobile — see the [architecture decision record](docs/decisions/0001-use-details-summary-for-tap.md).

## Core Constraints

- No JavaScript — everything is pure CSS
- Readers can disable work skins; effects are an enhancement layer, not core content
- Downloads (PDF, EPUB, MOBI) don't preserve work skin

See [docs/compatibility.md](docs/compatibility.md) for the full compatibility reference and [docs/repo-operations.md](docs/repo-operations.md) for repository maintenance guidance.
