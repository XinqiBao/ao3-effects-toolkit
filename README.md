# AO3 Envelope

CSS-only trifold letter/envelope effect for Archive of Our Own works. Pure CSS, no JavaScript.

<p align="center">
  <img src="https://github.com/XinqiBao/ao3-envelope-workskin/raw/main/assets/envelope-closed.png" width="45%" alt="Closed" />
  <img src="https://github.com/XinqiBao/ao3-envelope-workskin/raw/main/assets/envelope-open.png" width="45%" alt="Open" />
</p>

## Quick Start

- **Just publish to AO3:** [envelope/guide.md](envelope/guide.md) — copy 4 files
- **Verify locally:** `node tools/verify.mjs`
- **Live AO3 test:** `node tools/verify.mjs --ao3`

## Effects

| Effect  | Status |
|---------|--------|
| Envelope | Ready  |

## Core Constraints

- No JavaScript in AO3 works — all interactivity via `:hover` or `<details>/<summary>`
- Readers can disable work skins; visual effects are an enhancement, not core content
- Downloads do not preserve work skin
- Critical information must not rely on visual effects alone
