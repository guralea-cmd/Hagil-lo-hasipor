---
name: facebook-teaser
description: Creates one short Facebook teaser post per day for the "הגיל הוא לא הסיפור" Facebook page, drawn from site content (community story, tools/insights post, workshop, or community signup), in Leah's authentic voice, and holds it for her explicit approval before treating it as ready to publish. Use whenever asked to prepare, draft, pick, or post a Facebook teaser, or when running the daily Facebook teaser routine.
---

# Daily Facebook teaser

## The three content automations, at a glance (read this first)

This site runs three separate scheduled content skills. Confirmed 2026-08-09 after a real mix-up between them - check this table before drafting or presenting anything, so the wrong format never gets used for the wrong output:

| Skill | Schedule | Output format | Where it publishes |
|---|---|---|---|
| **facebook-teaser** (this file) | daily, ~07:32 | כותרת + 2-4 lines body + **image** + קישור + hashtags | Facebook Page |
| **marquee-daily-content** | daily, ~07:41 | **text + link only, no image, no heading** | `index.html` banner strip |
| **weekly-blog-article-draft** | weekly, Sunday ~09:16 | full article per category (title, body, CTA) **+ its listing thumbnail image** | new `blog-post-N.html` files + `blog.html` listing |

All three: draft only, present to Leah in Hebrew, publish only after her explicit approval in that conversation. Scheduled runs sometimes stall in their own separate session and never reach her (confirmed 2026-08-09) - if she says she never saw a draft, don't assume it was shown elsewhere; just run the skill fresh in the current conversation instead of guessing.

## Hard rule: always verify the actual current date before saying "today"

Confirmed 2026-08-09, after a real mix-up: run `date` (or equivalent) and check the *actual* calendar date/time before describing anything as "today's post," "this morning," or similar - never infer it from when the current conversation started. Long sessions can span midnight; a post published late one evening can get mis-described hours later as having happened "this morning" once the date has quietly rolled over, and Leah has no way to catch that from her side - it reads as a fabricated or confused claim even when the underlying post is completely real. Before claiming a post/change is "from today," check the clock, not memory.

## What this produces

**Exactly one** short teaser per run, pointing back to a page on the site - never the full content itself. The goal is curiosity, not information: readers should have to click through to the site to get the rest of the story, the rest of the article, or the workshop/registration details. Every teaser has exactly four parts: כותרת מושכת, 2-4 lines of curiosity-only body copy, an image (see "Choosing the image"), and a קישור to the specific relevant page. Never draft more than one post in a single run.

## Publishing - how it actually works now

As of 2026-08-03, real automated publishing is wired up. `.claude/skills/facebook-teaser/secrets.json` (gitignored - never read its contents into anything that gets committed, logged in a committed file, or echoed more than necessary) holds `pageId` and `pageAccessToken` - a long-lived Facebook Page Access Token for the "הגיל הוא לא הסיפור" Page, with `pages_manage_posts` + `business_management` + `pages_show_list` scope.

**If `secrets.json` is missing or a publish call fails with an auth error** (token revoked/expired - long-lived Page tokens are very long-lived but not eternal), fall back to the old behavior: tell Leah plainly that automated publishing isn't currently working, hand her the final text/image/link ready to copy-paste, and suggest re-running the token setup (Meta app → Graph API Explorer → exchange → `/me/accounts`, the same flow used to originally create `secrets.json`) rather than trying to self-repair. Never claim something was posted when it wasn't.

See "Publishing (after approval)" near the end of this file for the actual publish mechanics.

## Content rotation and no-repeat rule

Read `.claude/skills/facebook-teaser/posted-log.md` first - it tracks every teaser ever drafted (date, content type, the specific item, status).

Rotate through the four content types in this fixed order, cycling: **סיפור קהילה → כלים ותובנות → סדנה → הצטרפות לקהילה → (repeat)**. Look at the last logged entry's content type to determine which type is next - don't just pick whatever's convenient that day.

Within a type, never pick an item already logged as `ממתין לאישור` or `אושר`. If every item of a type has been used already:
- **כלים ותובנות**: re-check `blog.html`'s current listing - if a new post has been added since the last cycle, it's fair game again. If nothing new exists, skip this slot (see "If there's no good content" below).
- **סדנה / הצטרפות לקהילה**: these are single evergreen pages (`workshop.html`, `register.html`), not a list of items - vary the specific angle/hook each cycle instead of the source page, and check the log so the same angle/headline isn't reused.
- **סיפור קהילה**: see the dedicated note below - this type has a structural limitation.

## Content sources per type

**כלים ותובנות (tools/blog)** - pick one post listed in `blog.html` that hasn't been teased yet (check the log). Read that specific post's file (`blog-post-N.html`) for its real title and real opening line - the teaser must tease that post's actual content, not a generic "new blog post" announcement. Link to that post's own page.

**סדנה (workshop)** - source is `workshop.html`. Pick one concrete angle each time (who it's for, what she gets, the physiological-age testing at the start, the 7-week/7-session structure, the WhatsApp support) rather than a generic "join the workshop" pitch - vary the angle from whatever was used last cycle per the log. Link to `workshop.html`.

As of 2026-08-05, the Zoom track has a confirmed opening date: **יום חמישי, 8.10.2026, 18:00-19:30** (see `workshop.html`, "מועד פתיחת הסדנה"). Posts may now name the concrete date/day/time as part of the hook (e.g. urgency, "the next cohort starts on X") instead of only vague evergreen angles - but always re-read `workshop.html` fresh before drafting, since the date could change or a cohort could fill up/close, and don't invent a headline that implies scarcity ("מקומות אחרונים" etc.) unless she's said so explicitly. The in-person track's date is still TBD ("יפורסמו בהמשך") - don't state a date/day/time for that track.

**הצטרפות לקהילה (community signup)** - source is `register.html` and the site's own community framing. Vary the angle each cycle (what the community is, what happens when someone shares their story, the "אם הוא יכול, אולי גם אני יכול" idea already used in the site's real story-criteria text). Link to `register.html`.

**סיפור קהילה (community story)** - real, approved community stories (submitted via `register.html`, shown on `stories.html`) live in Firestore, not as files in this repo - but the collections are **publicly readable when filtered by `status == "approved"`**, using the exact same public web config the live site itself uses (`js/firebase-config.js` - that API key is a public client identifier, not a secret; access is governed by Firestore security rules, and those rules already allow anyone, including this skill, to read approved stories - it's the same data any site visitor's browser loads). See "Fetching real story photos" below for the exact query. This means the skill CAN pull a real name and a real photo for a real approved story - it does not need to invent anything.
- **Tier 1 (preferred):** query for an approved story that hasn't been used yet (check the log by document ID). If one exists, use its real photo and real name/age/location. Link to `stories.html#story-{docId}` so the post lands directly on that story (`stories.js` scrolls to and highlights `#story-{id}` on load).
- Never summarize, quote, or paraphrase the content of their `story`/`bio` text field in the teaser - you might misrepresent someone's real account. Use only factual metadata (name, age, location if present) plus a generic Leah-voice curiosity hook about age not being the limit; let the actual story only be discovered by clicking through. This is stricter than typical teaser-writing, but it's the safe rule for a real person's real story ([[feedback_testimonial_authenticity]]).
- **Tier 2 (fallback, only if the query returns zero unused approved stories):** write a teaser inviting people to `stories.html` in general, built around real, already-published site language (the "מה אנחנו מחפשים בסיפור?" criteria, the "אם הוא יכול, אולי גם אני יכול" idea), with no specific person attached. As of 2026-08-02, both Firestore story collections currently have zero approved documents, so tier 2 is the realistic path today - re-check tier 1 every run, since that changes as soon as Leah approves a submission.
- If Leah asks to feature one specific story or `about.html` testimonial by name instead of whatever the query surfaces, use that instead of the query result - but the "never paraphrase their words" rule still applies.

## Fetching real story photos (Firestore REST API)

The `stories` (legacy) and `story_submissions` (current) collections are queryable read-only over plain HTTPS, no auth needed, via:

```
POST https://firestore.googleapis.com/v1/projects/hagil-lo-hasipor/databases/(default)/documents:runQuery
Content-Type: application/json

{"structuredQuery": {"from": [{"collectionId": "story_submissions"}], "where": {"fieldFilter": {"field": {"fieldPath": "status"}, "op": "EQUAL", "value": {"stringValue": "approved"}}}, "orderBy": [{"field": {"fieldPath": "createdAt"}, "direction": "DESCENDING"}]}}
```

Run the same query with `"collectionId": "stories"` for the legacy collection (its fields are `name`, `bio`, `videoUrl` - no `photoUrls`, so it won't have a photo to use; skip it for this skill's purposes unless it's ever extended with photos). This exact query pattern was verified working (200 response) against the live project on 2026-08-02 - a `403 PERMISSION_DENIED` means the security rules changed and this section needs re-verifying; an unfiltered/unordered query will correctly 403 (rules only allow the approved-filtered shape), that's expected and not a bug.

A response with matches looks like a JSON array where each item is `{"document": {"name": "projects/hagil-lo-hasipor/databases/(default)/documents/story_submissions/<docId>", "fields": {...}}, "readTime": "..."}`. When there are no matches, every item is just `{"readTime": "..."}` with no `document` key - check for that key's presence, don't assume the array is non-empty just because the call succeeded.

Relevant fields inside `fields` (each Firestore REST value is typed and wrapped, e.g. `{"stringValue": "..."}`):
- `name` → `stringValue`
- `age` → likely `stringValue` (the form field is free text)
- `location` → `stringValue`, optional, may be absent
- `photoUrls` → `arrayValue.values[]`, each a `{"stringValue": "<url>"}` - use `values[0].stringValue` as the teaser image; these are direct, publicly-loadable URLs (the same ones already rendered in `<img>` tags on `stories.html`), so no download/auth step is needed, just reference the URL
- the document ID for the `stories.html#story-{docId}` link is the last path segment of `document.name`

If `photoUrls` is absent (a submission with only a `videoUrl`, no photos), fall back to tier 2 for that specific story rather than posting without an image.

## Choosing the image

**Hard rule, as of 2026-08-04: never use images from `images/testimonials/` or any testimonial/review photo of a real person (e.g. the `about.html` review screenshots) in a Facebook post, for any content type, ever.** Leah called this out explicitly after a draft used one of those photos generically - it's not her call to reuse someone else's review photo as generic post filler. This rule does not affect Tier 1 Firestore community-story photos (see below) - those are photos the person themselves submitted specifically for this purpose, a different thing entirely from an `about.html` review screenshot.

**Sole source folder, as of 2026-08-04: `images/facebook-posts/`.** Leah replaced the old per-category `images/facebook/<category>/` structure with one flat folder that she uploads post-ready photos to directly. Only images from `images/facebook-posts/` may be used for any Facebook post (any content type: כלים ותובנות, סדנה, הצטרפות לקהילה, or the tier-2 community-story fallback). The old `images/facebook/*` category folders and their README are no longer used by this skill - leave the files in place (they're not being deleted, just no longer the source), but do not pick images from them.

**Selection logic per type:**
- **כלים ותובנות / סדנה / הצטרפות לקהילה / סיפור קהילה tier 2** → re-scan `images/facebook-posts/` fresh at run time (never cache or assume its contents). Pick a file that hasn't been used most-recently per the log (check the log for the last-used filename(s) and avoid immediate repeats; if the folder has only one file, it's fine to reuse it, just note that in the log entry). **If the folder is empty, there is no fallback image** (no more `images/hero-bike.jpg` fallback) - treat this exactly like "no good content available" (see that section below): say so plainly to Leah rather than posting without a proper image, or without her explicit go-ahead to use something else.
- **סיפור קהילה, tier 1 (preferred)** → unchanged - the real story's own `photoUrls[0]` from Firestore (see above), the actual person from that actual story. This always wins over `images/facebook-posts/` when an unused approved story exists, and is unaffected by the testimonials ban since it isn't a testimonial photo.

## Writing the teaser

Invoke the `leah-voice` skill before drafting any wording. A teaser sits right next to a link, so per leah-voice's hard rule on functional/CTA text: don't invent new wording for the destination's own call-to-action - reuse the page's real existing CTA phrase if referencing it directly (e.g. "להרשמה לסדנה" already exists verbatim; don't paraphrase it). The 2-4 line teaser body itself is narrative voice territory, like a blog intro, so draft it in Leah's authentic voice per the full leah-voice guidance - blunt, concrete, second person, no marketing gloss.

Every teaser needs exactly these four parts:
- **כותרת מושכת** - a headline specific to that day's actual item, never generic
- **2-4 lines of body copy** - curiosity only; never give away the full content or the payoff
- **image** - the file path chosen per the rule above
- **קישור** - the real site URL for that specific page/post

Plus, as of 2026-08-06, hashtags appended at the end (see "Hashtags" section below) - present these alongside the four parts when showing Leah the draft, not as a separate follow-up.

Never reuse the same hook or headline pattern across posts regardless of type or topic - the same rule that governs blog CTA headings applies here: each teaser's headline must be earned by that day's specific content, not a template.

## Hashtags

As of 2026-08-06, every post includes Hebrew hashtags at the end of the caption (after the link), decided and approved by Leah in that conversation:

- **Always fixed, every post, no exceptions:** #הגיל_הוא_לא_הסיפור and #לאה_גורא_72
- **Rotating pool, pick 3-4 per post based on topical fit with that day's specific content (not the same 3-4 every time):**
  - #מסירות_חלודה - the "rust" metaphor; fits posts about regression/momentum/starting again
  - #הרגע_של_לאה_גורא - fits posts with a personal-anecdote beat from Leah
  - #חוסן_מנטלי - fits posts emphasizing her identity as a mental coach, not just physical training
  - #כוח_נשי - fits posts speaking to female strength/capability
  - #מכווצות_את_הגיל - echoes workshop.html's own "לכווץ את הגיל הפיזיולוגי" phrasing; fits workshop/physiological-age posts specifically

Pick whichever 3-4 of the five actually fit that post's specific angle - don't default to the same combination every time. If none fit well, ask Leah rather than forcing an irrelevant one in. This pool was chosen by Leah on 2026-08-06 after an earlier round of proposals ("גיל אינו מגבלה", "נקודת התחלה חדשה", generic "כוח נשי" alone) felt too generic to her - lean toward hashtags tied to her specific vocabulary/facts over abstract empowerment terms if this pool is ever revisited.

## Approval gate

Present the drafted teaser to Leah in chat, in Hebrew, in the four-part format above, and explicitly ask for her approval before treating it as ready. She may approve, reject, or ask for edits to specific parts. Do not attempt to publish, and do not mark anything `אושר` in the log, until she has explicitly approved it in that conversation.

**Hard rule, as of 2026-08-06: always show her the actual image, not just its file path/filename.** She asked for this explicitly because a filename alone doesn't let her judge whether the picture actually fits the post's content. Send the real image file itself (e.g. via a file-sending tool if available) or otherwise render it visibly in the reply - a Firestore tier-1 photo can be shown via its public URL. A text description or path string is not sufficient on its own; she needs to actually see the picture next to the draft before she can approve it.

**Refined 2026-08-07: send the image, don't also narrate it in text.** Drop the "תמונה: <path>" text line from the four-part presentation once the actual image file is sent alongside it - the picture itself is the answer; a redundant filename/description line is noise she explicitly asked to cut. Still send the real file every time, per the rule above - this only removes the *textual* restatement, not the image itself.

**Hard rule, as of 2026-08-07: visually inspect every candidate image before using or presenting it - actually look at it (e.g. via a file-reading/viewing tool), don't just pick a filename blind.** A screenshot pulled from a phone's video-playback or gallery-app UI (status bar, contact name, video scrubber, timeline thumbnails, trash/heart/share icons visible in frame) is not a usable photo and must never be selected or shown to Leah, even as the only option in that rotation slot - skip it and pick a different file, or say plainly that no good image is available (see "If there's no good content available"). This was triggered 2026-08-07 when `WhatsApp Image 2026-08-05 at 00.32.01.jpeg` (a video-player screenshot) was picked blind, published, and had to be caught by Leah and republished with a real photo (`WhatsApp Image 2026-08-05 at 00.40.05.jpeg`, later swapped again to `...00.40.09.jpeg` per her request for a more visually striking/challenging pose). Note for future runs: at least one other file in this folder, `WhatsApp Image 2026-08-05 at 00.40.22.jpeg`, has the same video-screenshot problem - do not use it either.

## If there's no good content available

If it's a given type's turn in the rotation and there is genuinely nothing new to tease (every workshop/community angle already used this cycle, no new blog post since the last one was teased, or no story to feature because Leah hasn't named one) - do not invent content to fill the gap. Say so plainly, and either ask Leah what she'd like instead, or wait for new content (a new approved post, a new story she names) before drafting anything for that slot.

## Publishing (after approval)

Only after Leah has explicitly approved a draft in that conversation:

1. **Resolve the image to a public URL.**
   - A Firestore tier-1 story photo (`photoUrls[0]`) is already a public URL - use it as-is.
   - A local file under `images/facebook-posts/` (the only allowed local source as of 2026-08-04 - never `images/testimonials/*`, never `images/hero-bike.jpg`) needs to become `https://guralea.com/<path-relative-to-repo-root>` (that's the live site's real domain - confirmed via `gh api repos/guralea-cmd/Hagil-lo-hasipor/pages`, re-check if this ever seems wrong). **Before using it**, confirm the file is actually committed and pushed - run `git status --short` on that path; if it shows as untracked/modified, the file only exists locally and Facebook's servers can't fetch it yet. In that case, tell Leah this specific image needs to be committed and pushed to the live site first, and stop - do not silently commit/push it yourself, since that's still a live-site change and she's asked to review those.

2. **Build the caption.** Combine the headline and the 2-4 line body into one caption string, then append the real site link (e.g. `blog-post-N.html`, `workshop.html`, `register.html`, or `stories.html#story-{docId}`) as plain text on its own line, followed by the approved hashtags (see "Hashtags" section) as the final line - Facebook auto-linkifies raw URLs in post captions, so no separate "link" field/preview card is needed for this endpoint.

3. **Publish.** Read `pageId` and `pageAccessToken` from `.claude/skills/facebook-teaser/secrets.json` (never print the token value in chat or write it into any committed file).

   **Preferred method, as of 2026-08-05 - direct binary upload, not the `url` parameter.** The originally-documented `url=<public image URL>` approach (Facebook fetching the image itself from guralea.com) started failing on 2026-08-05 with `{"error":{"message":"Missing or invalid image file","code":324,...}}` - confirmed this was not about this skill's URL-encoding, the token, or the specific file (tested a previously-successful image URL from the log with the identical failure, while the exact same URL was independently confirmed fetchable via plain curl and via `curl -A "facebookexternalhit/1.1"`) - i.e. a Facebook-side fetch problem, likely transient, unrelated to anything in this repo. Direct multipart upload of the file's own bytes worked immediately as a substitute and is now the default method:
   ```
   POST https://graph.facebook.com/v21.0/{pageId}/photos   (multipart/form-data, curl -F, NOT --data-urlencode - curl refuses to mix -F with -d/--data-urlencode in one call)
   -F "caption=<<windows-path-to-caption-file>"   (the "<" prefix - not "@" - tells curl to send the file's contents as the plain field value, not as an attached document; "@" would work too but sends it as a file-part instead of a text value)
   -F "access_token=<pageAccessToken>"
   -F "source=@<windows-path-to-image-file>"      (here "@" is correct and required - this field IS the binary image upload)
   ```
   Both the caption file and the image file need their paths converted with `cygpath -w` first (same MSYS-path caveat as below - curl.exe mingw64 build won't read `/c/...`-style paths for `@`/`<` file arguments, only native Windows paths).

   **Hebrew-path gotcha, confirmed 2026-08-06:** even with a native Windows path, this repo's own path contains a Hebrew folder name (`...\OneDrive\מסמכים\GitHub\Hagil-lo-hasipor\...`), and curl's `@`/`<` file-reading failed against it with exit code 26 (`CURLE_READ_ERROR`) - it could open ASCII-only paths but not this one. Workaround: copy the image (and/or caption file) to a scratchpad path with no non-ASCII characters before passing it to curl's `@`/`<` arguments, then upload from there.

   **Hebrew encoding - hard rule, confirmed broken 2026-08-05:** never embed the Hebrew caption text directly inside the bash command string (e.g. via `$'...'` or a heredoc passed straight to a curl caption argument). On this Windows/Git-Bash setup that path silently corrupted every Hebrew character into `?` in the actual published post - it published successfully (HTTP 200, real post ID) with garbled text, which is worse than a visible failure. Instead: always write the caption to a UTF-8 file first (the `Write` tool, not a shell heredoc), convert its path with `cygpath -w`, and pass it to curl as a file reference (`caption=<path` per above) so curl reads the raw UTF-8 bytes directly, sidestepping shell/locale mangling entirely. After publishing, verify by fetching `GET https://graph.facebook.com/v21.0/{photo-id}?fields=name&access_token=...` and confirming the returned text isn't full of `?` characters (a correct response shows `\u05xx`-escaped JSON, which is normal and fine - that's just how the Graph API serializes non-ASCII text, not a sign of corruption).

   **Fallback, if direct upload ever fails too:** the old `url=<public image URL>` method (single `--data-urlencode "url=..."` field alongside `caption@...` and `access_token=...`, all as `--data-urlencode`, no `-F`) is still valid API usage and may be worth a retry if Facebook's fetch problem was truly transient - but don't loop between the two indefinitely; one retry of each is enough before falling back to handing Leah copy-paste-ready content instead.

   Check the response for a `error` key first - if present, do not claim success; report the error message to Leah and fall back to handing her copy-paste-ready content instead. If it returns a post/photo `id`, that's confirmation of a real, live Facebook post - but confirm the Hebrew rendered correctly (previous paragraph) before telling Leah it's done, since a 200 response alone doesn't guarantee the text was right. If you used `published=false` for any diagnostic/test call while debugging a failure, delete that test photo (`DELETE /v21.0/{photo-id}?access_token=...`) before finishing - never leave stray unpublished test posts on the real Page.

4. **Confirm to Leah** (Hebrew) that it's live, including a link to the post if the API response allows constructing one (`https://www.facebook.com/{returned-post-id}`).

## After approval and publishing

Append one row to `.claude/skills/facebook-teaser/posted-log.md`: date, content type, the specific item, a one-line note on the angle/hook used, and status (`אושר ופורסם` once actually posted, not just approved). Also record which image was used (folder + filename, the live URL, or the Firestore doc ID for a tier-1 story photo) so future runs can rotate images correctly and avoid repeating the same face or picture back-to-back. This is what every future run reads to keep the rotation honest and avoid repeats.
