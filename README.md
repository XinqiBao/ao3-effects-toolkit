# AO3 Effects Toolkit

CSS-only visual effects for Archive of Our Own works. Pure CSS, no JavaScript.

<p align="center">
  <img src="https://github.com/XinqiBao/ao3-envelope-workskin/raw/main/assets/envelope-closed.png" width="45%" alt="Closed" />
  <img src="https://github.com/XinqiBao/ao3-envelope-workskin/raw/main/assets/envelope-open.png" width="45%" alt="Open" />
</p>

## Quick Start

- **Just publish to AO3:** Read the `guide.md` in your chosen effect directory
- **Verify locally:** `node tools/verify.mjs`
- **Live AO3 test:** `node tools/verify.mjs --ao3`

## Effects

| Effect | Status |
|--------|--------|
| Envelope | Ready |
| Chat Messages | Ready |
| Polaroid | Ready |
| Secret Divider | Ready |
| Typewriter | Ready |

## Core Constraints

- No JavaScript in AO3 works — all interactivity via `:hover` or `<details>/<summary>`
- Readers can disable work skins; visual effects are an enhancement, not core content
- Downloads do not preserve work skin
- Critical information must not rely on visual effects alone
