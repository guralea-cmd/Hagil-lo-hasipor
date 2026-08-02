---
name: facebook-teaser
description: Creates one short Facebook teaser post per day for the "הגיל הוא לא הסיפור" Facebook page, drawn from site content (community story, tools/insights post, workshop, or community signup), in Leah's authentic voice, and holds it for her explicit approval before treating it as ready to publish. Use whenever asked to prepare, draft, pick, or post a Facebook teaser, or when running the daily Facebook teaser routine.
---

# Daily Facebook teaser

## What this produces

**Exactly one** short teaser per run, pointing back to a page on the site - never the full content itself. The goal is curiosity, not information: readers should have to click through to the site to get the rest of the story, the rest of the article, or the workshop/registration details. Every teaser has exactly four parts: כותרת מושכת, 2-4 lines of curiosity-only body copy, an image (see "Choosing the image"), and a קישור to the specific relevant page. Never draft more than one post in a single run.

## Publishing limitation - read this before doing anything else

There is no Facebook/Meta connector available in this Claude Code environment (checked via the MCP connector registry - none found, and no other social-posting connector exists either). This skill can select content, draft the teaser, and hold it for Leah's approval - but it cannot actually click "publish" on Facebook. After she approves a draft, hand her the final text, the image file path, and the link, ready to copy-paste, and say plainly that getting it onto Facebook is a manual step for her (or a future connected integration) - never claim to have posted something that wasn't actually posted.

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

There is a fixed, permanent folder structure at `images/facebook/` - one subfolder per content category, documented in `images/facebook/README.md`. Leah adds images to these folders over time; the skill must always re-scan the relevant folder at run time (never cache or assume its contents) and pick automatically, with no manual selection needed from her:

| category | folder |
|---|---|
| כלים ותובנות → תזונה | `images/facebook/nutrition/` |
| כלים ותובנות → שינה | `images/facebook/sleep/` |
| כלים ותובנות → כוח | `images/facebook/strength/` |
| כלים ותובנות → שיווי משקל | `images/facebook/balance/` |
| כלים ותובנות → בריאות | `images/facebook/health/` |
| כלים ותובנות → השראה | `images/facebook/inspiration/` |
| כלים ותובנות → חוסן נפשי | `images/facebook/resilience/` |
| סדנה | `images/facebook/workshop/` |
| הצטרפות לקהילה | `images/facebook/community/` |
| סיפור קהילה (fallback only, see below) | `images/facebook/stories/` |

**Selection logic per type:**
- **כלים ותובנות** → the post's own category folder above (match the post's `category-tag--<name>` class to the folder name - they use the same slug). Pick a file from that folder that hasn't been used most-recently per the log; if the folder is empty, fall back to `images/hero-bike.jpg`.
- **סדנה** → `images/facebook/workshop/`, same rotation logic; fall back to `images/hero-bike.jpg` if empty.
- **הצטרפות לקהילה** → `images/facebook/community/`, same rotation logic; fall back to `images/hero-bike.jpg` if empty.
- **סיפור קהילה, tier 1 (preferred)** → the real story's own `photoUrls[0]` from Firestore (see above) - this is the actual person from that actual story, not a stand-in. This always wins over the folder below when an unused approved story exists.
- **סיפור קהילה, tier 2** → `images/facebook/stories/`, same rotation logic, only used when no unused approved Firestore story is available.
- **סיפור קהילה, tier 3 (last resort)** → if `images/facebook/stories/` is also empty, one of the `images/testimonials/*.jpeg` screenshots (real Facebook reviews from `about.html`, not story photos - fine as a last-resort generic face, but never attach a specific invented name/story to one of these).

Rotation within any folder: check the log for the last-used filename(s) in that folder and avoid immediate repeats; if a folder has only one file, it's fine to reuse it (there's no alternative), just note that in the log entry.

## Writing the teaser

Invoke the `leah-voice` skill before drafting any wording. A teaser sits right next to a link, so per leah-voice's hard rule on functional/CTA text: don't invent new wording for the destination's own call-to-action - reuse the page's real existing CTA phrase if referencing it directly (e.g. "להרשמה לסדנה" already exists verbatim; don't paraphrase it). The 2-4 line teaser body itself is narrative voice territory, like a blog intro, so draft it in Leah's authentic voice per the full leah-voice guidance - blunt, concrete, second person, no marketing gloss.

Every teaser needs exactly these four parts:
- **כותרת מושכת** - a headline specific to that day's actual item, never generic
- **2-4 lines of body copy** - curiosity only; never give away the full content or the payoff
- **image** - the file path chosen per the rule above
- **קישור** - the real site URL for that specific page/post

Never reuse the same hook or headline pattern across posts regardless of type or topic - the same rule that governs blog CTA headings applies here: each teaser's headline must be earned by that day's specific content, not a template.

## Approval gate

Present the drafted teaser to Leah in chat, in Hebrew, in the four-part format above, and explicitly ask for her approval before treating it as ready. She may approve, reject, or ask for edits to specific parts. Do not mark it `אושר` in the log until she has explicitly approved it in that conversation - and remember the publishing limitation above even after approval: getting it onto Facebook is still a manual/external step, not something this skill executes.

## If there's no good content available

If it's a given type's turn in the rotation and there is genuinely nothing new to tease (every workshop/community angle already used this cycle, no new blog post since the last one was teased, or no story to feature because Leah hasn't named one) - do not invent content to fill the gap. Say so plainly, and either ask Leah what she'd like instead, or wait for new content (a new approved post, a new story she names) before drafting anything for that slot.

## After approval

Append one row to `.claude/skills/facebook-teaser/posted-log.md`: date, content type, the specific item, a one-line note on the angle/hook used, and status. Also record which image was used (folder + filename, or the Firestore doc ID for a tier-1 story photo) so future runs can rotate images correctly and avoid repeating the same face or picture back-to-back. This is what every future run reads to keep the rotation honest and avoid repeats.
