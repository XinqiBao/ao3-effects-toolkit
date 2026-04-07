# AO3 Live Validation

Use this workflow to confirm that an effect survives AO3's work-skin and work-content filters on a real AO3 account.

It can be followed manually in a browser or assisted by browser automation. Replace `<your-username>` throughout with your AO3 username. If you keep personal validation notes, store them under `local/` so they remain gitignored.

---

## When to Run

Run after:
- Any change to an effect's `work-skin.css`
- Any change to `hover-template.html` or `tap-template.html`
- Any change to `smoke-test.html`
- Explicit user request

---

## Account

- Username: `<your-username>`
- Drafts: `https://archiveofourown.org/users/<your-username>/works/drafts`
- Work skins: `https://archiveofourown.org/users/<your-username>/skins?skin_type=WorkSkin`

---

## Login Check

Navigate to `https://archiveofourown.org`, wait for Cloudflare (poll until title no longer contains "Just a moment"), then check the nav:

```
Logged in:  navigation[aria-label="User"] contains "Hi, <your-username>!"
Logged out: "Log In" link present, or URL redirected to /users/login
```

**If not logged in:** Stop and log in before continuing.

---

## Cloudflare

After every page load:
- If title contains "Just a moment", wait 2s and retry — up to 15 times (30s total)
- Continue once resolved

---

## Validation Flow (per effect)

### Step 1: Find or create the work skin

Navigate to the skin list:

```
https://archiveofourown.org/users/<your-username>/skins?skin_type=WorkSkin
```

**Found** (title contains effect name): extract skin ID from Edit link href (`/skins/<id>`), click Edit, update CSS.

**Not found**: create a new skin — see "Creating a Work Skin" below.

**Updating CSS:**
- Selector: `textarea#skin_css`
- Content: read `<effect>/work-skin.css`
- Submit: `input[name=commit]`
- Wait for redirect to `/skins/<id>`, record the skin ID

> ⚠️ AO3's CSS sandbox rejects certain properties on save. If submission fails, read the error and cross-reference `docs/compatibility.md`.

### Step 2: Find or create a draft work

Navigate to drafts:

```
https://archiveofourown.org/users/<your-username>/works/drafts
```

**Found** (title contains effect name): click Edit (`/works/<id>/edit`), update content and skin, click Preview.

**Not found**: create a new draft — see "Creating a Draft Work" below.

**Editing work content:**
- Content: `#content` — read `<effect>/smoke-test.html`
- Work skin: `select#work_work_skin_id` — select skin ID from Step 1
- Preview: `input[name=preview_button]`

### Step 3: DOM assertions on the Preview page

**Preview page markers:** `#workskin` exists; page contains "Preview".

**Wait for render:** `waitForTimeout(1500)`.

**Required classes inside `#workskin`:**

| Effect | Required classes |
|---|---|
| envelope | `trifold-letter`, `letter-cover`, `letter-top`, `letter-mid`, `letter-bot` |
| chat-messages | `chat-conversation`, `chat-preview`, `chat-conversation__stack`, `chat-bubble`, `chat-bubble--sent`, `chat-bubble--received` |
| polaroid | `polaroid-gallery`, `polaroid-container`, `polaroid-inner`, `polaroid-front`, `polaroid-back` |
| secret-divider | `secret-divider-container`, `secret-divider`, `secret-divider__ornament`, `secret-divider__text`, `secret-divider__text-inner` |
| typewriter | `typewriter-stage`, `typewriter-container`, `typewriter-prompt`, `typewriter-text`, `typewriter-line`, `typewriter-cursor` |

**Assertion:**
```js
const found = await page.locator(`#workskin .${cls}`).count() > 0;
```

**Visual check:** screenshot `#workskin` and inspect visually.

### Step 4: Report results

```
[envelope] OK   .trifold-letter
[envelope] OK   .letter-cover
...
[envelope] PASS — all classes found
```

FAIL usually means the class name in `smoke-test.html` does not match `work-skin.css`.

---

## Creating a Work Skin

1. Navigate to `https://archiveofourown.org/skins/new?skin_type=WorkSkin`
2. Title (`input#skin_title`): `ao3-<effect>-workskin-<your-username>-<YYYYMMDD>`
3. CSS (`textarea#skin_css`): contents of `<effect>/work-skin.css`
4. Submit: `input[name=commit]`
5. Extract skin ID from redirect URL (`/skins/<id>`)

## Creating a Draft Work

1. Navigate to `https://archiveofourown.org/works/new`
2. Title (`input#work_title`): `AO3 <EffectName> Smoke Test <YYYY-MM-DD>`
3. Fandom (`input#work_fandom_autocomplete`): type "No Fandom", wait for autocomplete, select
4. Language (`select#work_language_id`): English
5. Warning (`input[name="work[archive_warning_strings][]"]`): check "No Archive Warnings Apply"
6. Content (`textarea#content`): contents of `<effect>/smoke-test.html`
7. Work skin (`select#work_work_skin_id`): select skin ID from Step 1
8. Restrict access (`input#work_restricted`): check (keep draft private)
9. Save draft: `input[name=save_button]`
10. Extract work ID from redirect URL

---

## Notes

- Wait 2s between effects to avoid AO3 rate limits
- Check for Cloudflare after every navigation
- After Preview, do not click "Post" or "Update" — navigate away or close
- Screenshots go to `local/ao3-screenshots/` (gitignored)
