# Posting This On AO3

This document turns the prototype in this repo into an AO3 workflow you can
actually use.

## What AO3 allows

- AO3 allows work skins for custom CSS.
- AO3 does not allow inline CSS in works.
- AO3 allows a limited HTML subset, including `div`, `span`, `a`, `details`,
  and `summary`.
- AO3 users can disable work skins, and downloads do not retain them.

Official references:

- Skins and Archive Interface FAQ:
  <https://archive.transformativeworks.org/faq/skins-and-archive-interface?language_id=en>
- Posting and Editing FAQ:
  <https://archive.transformativeworks.org/faq/posting-and-editing?language_id=en>
- Formatting content on AO3 with HTML FAQ:
  <https://archive.transformativeworks.org/faq/formatting-content-on-ao3-with-html?language_id=en>

## Exact AO3 steps

1. Log in to AO3.
2. Open `Hi, [username]!` -> `My Dashboard`.
3. Open `Skins`.
4. Choose `Create Work Skin`.
5. Give the skin a unique title.
6. Paste the contents of `ao3-workskin.css`.
7. Save the skin.
8. Go to `Post` -> `New Work`, or open an existing work and choose `Edit`.
9. In `Associations`, find `Select Work Skin` and choose the skin you just made.
10. In `Work Text`, switch to `HTML`.
11. Paste one of the snippets from `snippets/`.
12. Use `Preview` before posting.

## Best order to try things

### Option 1: Smoke test first

Use `snippets/minimal-envelope.html`.

Why:

- It confirms the skin is attached.
- It keeps the amount of moving text small.
- It is the easiest way to debug spacing inside AO3 preview.

### Option 2: Desktop-first publication

Use `snippets/hover-envelope.html`.

Why:

- This is the safest path if you want the classic AO3 envelope feel.
- It does not depend on link state.
- It matches the interaction pattern most work skin experiments already use.

### Option 3: Mobile-friendlier publication

Use `snippets/tap-envelope.html`.

Why:

- It works better for touch devices than hover.
- It uses AO3-safe anchors and `:target`.
- It needs unique IDs if you place more than one in the same chapter.

## Important AO3-specific tips

- Do not paste the HTML snippets into Rich Text. AO3 will display the raw tags.
- Do not move the CSS into the chapter body. AO3 strips inline CSS.
- If you duplicate the target-based snippet, rename both `letter-open` and
  `letter-reset`.
- Keep a backup of your actual chapter text outside AO3. AO3 itself recommends
  not composing directly in the post form.
- Preview saves a draft automatically.

## How to test without risking the final post

AO3's Posting and Editing FAQ says you can use the `Testing` fandom when you
need to post something exactly as intended just to see how it behaves on the
site.

Suggested test flow:

1. Create a temporary work in the `Testing` fandom.
2. Attach your work skin.
3. Paste the snippet into the chapter HTML.
4. Preview.
5. If you still need to test a live post behavior, post it under `Testing`.
6. Once satisfied, either edit the fandom to the real one or delete and repost.

Be aware that a posted test can still trigger subscription emails.
