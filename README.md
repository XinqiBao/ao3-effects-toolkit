# AO3 envelope research

This folder contains a local prototype plus AO3-ready snippets for an
envelope-opening effect built without JavaScript.

## Why this direction

- AO3 does not allow JavaScript in posted works.
- AO3 work skins do allow enough CSS for layered paper effects.
- The classic effect is built from HTML blocks plus CSS `transform`,
  `transition`, `position`, and `z-index`.
- Downloads do not keep work skins, and readers can hide creator styles.

## Files

- `index.html`: local demo page with two interaction models
- `ao3-workskin.css`: CSS to paste into a work skin
- `snippets/hover-envelope.html`: safest AO3 publishing path
- `snippets/tap-envelope.html`: touch-friendly experiment using anchor links and `:target`

## Suggested publishing order

1. Create a new work skin in AO3.
2. Paste in `ao3-workskin.css`.
3. Attach that work skin to your work.
4. Switch the chapter editor to HTML.
5. Paste `snippets/hover-envelope.html` first.
6. Use Preview inside AO3 and adjust spacing and text lengths.
7. Only test `snippets/tap-envelope.html` after the hover version works.

## Practical caveats

- Keep the actual letter readable even with no animation.
- Keep each panel's text short enough that the scroll areas do not become
  awkward on mobile.
- If your chapter is image-heavy or wide already, test the envelope on a
  narrow screen before posting.
- If you use more than one click-open letter in the same chapter, change the
  `id` values in `snippets/tap-envelope.html` so the links do not collide.
