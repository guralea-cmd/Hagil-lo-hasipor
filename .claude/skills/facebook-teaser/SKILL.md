---
name: facebook-teaser
description: Creates one short Facebook teaser post per day for the "הגיל הוא לא הסיפור" Facebook page, drawn from site content (community story, tools/insights post, workshop, or community signup), in Leah's authentic voice, and holds it for her explicit approval before treating it as ready to publish. Use whenever asked to prepare, draft, pick, or post a Facebook teaser, or when running the daily Facebook teaser routine.
---

# Daily Facebook teaser

## PAUSED as of 2026-08-11 - do not draft or publish until Leah says otherwise

Leah paused all Facebook/Instagram publishing (2026-08-11): "את הפייסבוק אני כרגע מורידה ממך עד להודעה חדשה, את מטפלת רק באתר" - she wants to wait until real traffic is happening on the site before continuing social posting. The scheduled task `facebook-daily-teaser` is disabled (not deleted). Any already-scheduled Metricool posts for this period were also canceled (the pre-scheduled Avi Turjeman Tier-1 post for 2026-08-12 was deleted). **Do not draft, schedule, or publish anything to Facebook/Instagram/Metricool until Leah explicitly re-enables this** - if asked to run this skill in the meantime, tell her it's paused per her own instruction and ask if she wants to resume. Site-only work (marquee, blog articles, adding new approved stories to `stories.html`) continues as normal and is unaffected by this pause.

**2026-08-23, while still discussing resuming:** Leah is now planning a relaunch tied to a new incentive (a BuyMe gift voucher for approved community-story tellers, see [[story-reward-vouchers]]) and a branded photo-frame template for posts (built 2026-08-23, see that skill's design notes) - but has NOT yet said to actually resume. She also decided that once it does resume, it should go to the Figura Ramla studio brand only, not the "הגיל הוא לא הסיפור" page (see the "Update 2026-08-23" note further down in this file). Still paused - this is prep, not a green light.

**TODO for 2026-08-24 (tomorrow) - waiting on Leah to actually do it herself, not a Claude task:** she wants to unpublish/deactivate the "הגיל הוא לא הסיפור" Facebook Page itself (not delete - reversible), since it has no real audience. Steps: Page → Settings → Privacy → Facebook Page visibility → Edit → "Deactivate Page" (older UI: "Unpublish"). Remind her if she hasn't mentioned it by then.

## Caption-writing rules for this post's text (added 2026-08-23)

Leah reviewed a draft caption and gave standing rules for every future post's text, not just that one:

1. **Never open with generic "סיפור חדש..."** - always describe it vividly. Her own example phrasing to use as the pattern: **"סיפור השראה חדש שישאיר אתכם בלי מילים"** (a new inspiring story that'll leave you speechless) - adapt the specific descriptive punch per story, but keep this register (vivid, not flat/administrative).
2. **Add an invitation for readers with their own story** - Leah rejected the first attempt ("יש גם לכם סיפור השראה? שתפו את הסיפור שלכם") as too weak and gave the exact replacement concept/wording to use instead (2026-08-23): **"אם הסיפור שלך יגרום לאדם אחד להגיד לעצמו: 'אם הוא יכול, גם אני יכול' - נשמח שתשתפו אותו ותצטרפו לקהילת ההשראה שלנו."** (linking to `register.html`). Use this line, not the earlier weaker one - it ties to the existing "אם הוא יכול, אולי גם אני יכול" idea already used elsewhere in this skill's Tier 2 content.
3. **No generic templated closing line** - same rule as blog-post CTAs (see the `leah-voice` skill's "no generic templated CTA across multiple posts"), now extended to these captions too: retire "מוזמנים להכיר ולהתרשם" as a default - every post needs a closing line specific to that story/moment, written to actually drive a click, not filler.
4. Every caption must be written **to move the reader to act** (click through), not just to inform.

## The three content automations, at a glance (read this first)

This site runs three separate scheduled content skills. Confirmed 2026-08-09 after a real mix-up between them - check this table before drafting or presenting anything, so the wrong format never gets used for the wrong output:

**Confirmed 2026-08-09: each automation has a fixed number, so Leah and Claude can refer to "משימה 1" etc. instead of guessing/describing - keep these numbers stable, never renumber even if one is later removed.**

| # | Skill | Schedule | Output format | Where it publishes |
|---|---|---|---|---|
| 1 | **facebook-teaser** (this file) | daily, ~07:32 | כותרת + 2-4 lines body + **image** + קישור + hashtags | 4 destinations via Metricool (see "Where this publishes" below) |
| 2 | **marquee-daily-content** | daily, ~07:41 | **text + link only, no image, no heading** | `index.html` banner strip |
| 3 | **weekly-blog-article-draft** | weekly, Sunday ~09:16 | full article per category (title, body, CTA) **+ its listing thumbnail image** | new `blog-post-N.html` files + `blog.html` listing |
| 4 | **automation-check** | on-demand (not scheduled) | audit report of tasks 1-3, redrafts immediately if one is unconfirmed/stalled | chat only - never publishes |
| 5 | **metricool-publish-check** | daily, ~07:45 | verifies that day's Metricool-scheduled autoPublish posts (Tier-1 story pre-schedules especially) actually went live to all 4 destinations; alerts Leah immediately with the specific error if not | chat only - never publishes, may propose a fix for her approval |

All three: draft only, present to Leah in Hebrew, publish only after her explicit approval in that conversation. Scheduled runs sometimes stall in their own separate session and never reach her (confirmed 2026-08-09) - if she says she never saw a draft, don't assume it was shown elsewhere; just run the skill fresh in the current conversation instead of guessing.

## Hard rule, confirmed 2026-08-10: explain full implications up front for any new build/change, don't wait to be asked

Whenever something is built, fixed, or changed - a post, a config fix, a new setup step - report the complete practical picture in that same message: what changed, what still works exactly as before and is unaffected, and what (if anything) Leah needs to do differently going forward. Don't make her extract this by asking a follow-up question afterward.

This was said twice in the same conversation, the second time as an explicit standing rule to add here: first about a specific www/SSL fix ("חבל מאוד שאת לא מסבירה לפני כן" - it's a real shame you don't explain beforehand), then generalized to **every new build** - she wants to know exactly all the implications each time, automatically, not only when she asks. Applies beyond this one skill, but is recorded here since this is the most frequently-run automation - carry the same standard into `marquee-daily-content`, `weekly-blog-article-draft`, and any general site work in this repo.

## Hard rule: always verify the actual current date before saying "today"

Confirmed 2026-08-09, after a real mix-up: run `date` (or equivalent) and check the *actual* calendar date/time before describing anything as "today's post," "this morning," or similar - never infer it from when the current conversation started. Long sessions can span midnight; a post published late one evening can get mis-described hours later as having happened "this morning" once the date has quietly rolled over, and Leah has no way to catch that from her side - it reads as a fabricated or confused claim even when the underlying post is completely real. Before claiming a post/change is "from today," check the clock, not memory.

## What this produces

**Exactly one** short teaser per run, pointing back to a page on the site - never the full content itself. The goal is curiosity, not information: readers should have to click through to the site to get the rest of the story, the rest of the article, or the workshop/registration details. Every teaser has exactly four parts: כותרת מושכת, 2-4 lines of curiosity-only body copy, an image (see "Choosing the image"), and a קישור to the specific relevant page. Never draft more than one post in a single run.

## Publishing - how it actually works now

**As of 2026-08-09, primary publishing goes through Metricool, not the direct Facebook Graph API.** `.claude/skills/facebook-teaser/metricool-secrets.json` (gitignored - never read its contents into anything that gets committed, logged in a committed file, or echoed more than necessary) holds `userToken`, `userId`, and a `brands` object with one entry per Metricool "brand" (each brand = its own `blogId` + its own set of connected networks - blogId scopes which networks a post can reach, it is not just a label).

**Confirmed 2026-08-10: every approved post goes to all 4 of these destinations, every time, by default - this is a standing decision, not a per-post choice to ask about:**
1. Facebook page "הגיל הוא לא הסיפור" (brand `hagil_lo_hasipor`, blogId `6694827`)
2. Instagram `lea_gura` (same brand/blogId `6694827`)
3. Facebook page "לאה גורא פילאטיס מכשירים ברמלה" (brand `figura_ramla`, blogId `6684336`)
4. Instagram `lea_gura_pilates` (same brand/blogId `6684336`)

**Update 2026-08-23, still true when publishing resumes: destinations 1-2 (the `hagil_lo_hasipor` brand / "הגיל הוא לא הסיפור" page) are ON HOLD - do not post there.** Leah's reasoning: that page has no real audience yet ("חוץ ממני וממך אף אחד לא נכנס ולא מכיר"), and she'd rather not spend effort building it right now - may revisit in the future, but treat it as closed unless she says otherwise. **Only destinations 3-4 (`figura_ramla` / the studio page + its Instagram) are active** once the publishing pause itself is lifted. Update the actual publish step below (currently still described as "2 calls, one per brand") to a single call to `figura_ramla` only when this is implemented.

**YouTube is explicitly out of scope for now** (Leah, 2026-08-10) - deferred until there's real video content to post; don't add it to `providers` until she asks.

This means **two separate `POST /v2/scheduler/posts` calls per approved teaser**, one per `blogId` in `brands`, each with `providers: [{"network":"facebook"},{"network":"instagram"}]` - a single call cannot span two blogIds. Same caption and same image go to both brands (confirmed acceptable to Leah 2026-08-10 - she wants the "הגיל הוא לא הסיפור" content, including its own hashtags and its own workshop.html link, cross-posted as-is to the Figura Ramla brand too, not a separate adapted version). If this ever needs to change (e.g. a Figura-Ramla-specific caption), ask her first - don't assume. **Superseded by the 2026-08-23 update above: as of now this should be one call, `figura_ramla` only, until the `hagil_lo_hasipor` hold is lifted.**

**If `metricool-secrets.json` is missing or a publish call fails with an auth error**, fall back to the old direct-Facebook method (Facebook page "הגיל הוא לא הסיפור" only - the fallback does not cover the other 3 destinations): `.claude/skills/facebook-teaser/secrets.json` (gitignored) holds `pageId` and `pageAccessToken`, wired up 2026-08-03 - see "Fallback: direct Facebook Graph API" below. If both fail, tell Leah plainly that automated publishing isn't currently working and hand her the final text/image/link ready to copy-paste. Never claim something was posted when it wasn't, and never claim all 4 destinations succeeded when only checking one.

See "Publishing (after approval)" near the end of this file for the actual publish mechanics.

## Cadence for relaunch (2026-08-24)

When resuming after the pause, **community-story posts go out once a week, not daily** - the approved-story pool is small (4 stories as of 2026-08-24), and Leah wants to stretch it rather than exhaust it in days. Increase to multiple times a week only once there are "הרבה סיפורים" (many stories) in the approved pool - re-check story count each time before considering a frequency bump, don't assume.

**Avi Turjeman (`Q0K9W9wyU88HlsemRhDc`) is next in the story rotation after whichever story is used for the 2026-08-24 relaunch post** - not scheduled for "tomorrow" specifically, just next-in-line whenever the following weekly slot comes up. (His 2026-08-12 scheduled post status is still unconfirmed either way - see the note in `posted-log.md` - resolve that uncertainty before using him, in case it turns out he already went out.)

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

**Fixed closing line, confirmed 2026-08-10:** every הצטרפות לקהילה post ends with this exact line (Leah's verbatim words) right before the link, in place of any separately-invented lead-in phrase: `כנסי ללינק הזה, ספרי לנו עליו, והצטרפי לקהילת ההשראה הגדולה בישראל. 👇` She said this needs to appear every time a post like this runs - don't paraphrase it, don't drop it, and don't also add a generic pre-link CTA line (see step 2 of "Publishing (after approval)" below - register.html is the one destination that skips that separate lead-in convention because this fixed line already does that job). Also on 2026-08-10: any closing line inviting someone to share their own story (this type, and likely סיפור קהילה tier 2) must literally contain the word "הסיפור" - not a paraphrase like "מה שמישהי אחרת צריכה לשמוע".

**סיפור קהילה (community story)** - real, approved community stories (submitted via `register.html`, shown on `stories.html`) live in Firestore, not as files in this repo - but the collections are **publicly readable when filtered by `status == "approved"`**, using the exact same public web config the live site itself uses (`js/firebase-config.js` - that API key is a public client identifier, not a secret; access is governed by Firestore security rules, and those rules already allow anyone, including this skill, to read approved stories - it's the same data any site visitor's browser loads). See "Fetching real story photos" below for the exact query. This means the skill CAN pull a real name and a real photo for a real approved story - it does not need to invent anything.
- **Tier 1 (preferred):** query for an approved story that hasn't been used yet (check the log by document ID). If one exists, use its real photo and real name/age/location. Link to `stories.html#story-{docId}` so the post lands directly on that story (`stories.js` scrolls to and highlights `#story-{id}` on load).
- **Hard rule, confirmed 2026-08-11 (Eliezer Roeh's post, after two failed publish attempts): never use the Firestore `photoUrls[0]` Firebase Storage URL directly as the Metricool `media` value.** Metricool/Facebook/Instagram cannot reliably fetch a Firebase Storage URL whose filename contains a space or Hebrew characters - confirmed this is not a URL-encoding issue (a correctly re-encoded URL failed with the identical error). Instead: download the image (`curl -o` to an ASCII scratchpad path first - the repo's own Hebrew folder path can break `curl -o` too, same as the existing Hebrew-path gotchas below), save it into the repo under `images/story-photos/story-{docId}.jpg`, commit and push it, then use `https://guralea.com/images/story-photos/story-{docId}.jpg` as the `media` value. Confirm the file is actually live (a `curl` HEAD/GET returning 200, allowing a minute for GitHub Pages to redeploy) before submitting the Metricool post.
- Never summarize, quote, or paraphrase the content of their `story`/`bio` text field in the teaser - you might misrepresent someone's real account. Use only factual metadata (name, age, location if present) plus a generic Leah-voice curiosity hook about age not being the limit; let the actual story only be discovered by clicking through. This is stricter than typical teaser-writing, but it's the safe rule for a real person's real story ([[feedback_testimonial_authenticity]]).
- **Refined 2026-08-10, after the first real tier-1 draft (Eliezer Roeh, 91):** "only name/age/location" was too strict in practice - a teaser with literally nothing concrete felt empty and pushed readers away, in Leah's words. It's fine (and better) to pull a genuine surface-level highlight from their fields - a concrete activity or place, e.g. "יוצא להרפתקאות צילום על פני כל הגלובוס" / "מדרום אמריקה ועד איסלנד" pulled from `story`/`today` - as the hook. The line stays: don't narrate their emotional turning point, reflection, or the "why" behind it (that's still what the click-through is for); a factual highlight (what they do, where they've been) is fair game, their inner narrative is not.
- **Fixed closing line for stories.html, confirmed 2026-08-10 (first use, Eliezer Roeh draft):** `לכתבה המלאה לחצו על הלינק👇` - Leah's own words, written when finalizing that draft. Reuse this exact line before every future stories.html link, same pattern as the register.html and workshop.html fixed lines above - don't invent a different phrase per post.
- **Fixed line AFTER the link, confirmed 2026-08-10 (same draft, added on a later pass):** every סיפור קהילה post now ends with the site tagline `הגיל הוא לא הסיפור - הסיפור הוא מה עושים איתו.` on its own line directly below the link, before the hashtags. Full order for this content type: body → `לכתבה המלאה לחצו על הלינק👇` → link → tagline → hashtags. (This tagline was tried as an *opening* line first and explicitly rejected - "תורידי את זה כבר נמאס" - then asked for again but positioned after the link instead. Position matters; don't move it back to the top.)
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

## Standing CTA-link rule (added 2026-08-17, part of the GEO/SEO project)

Every post must end in a short call-to-action with a link to the relevant guralea.com page, on its own line, right before the hashtags. Which page depends on the post's content type:
- **כלים ותובנות (article)** → link to that article's own page (already the existing behavior).
- **סדנה (workshop topic)** → `https://guralea.com/workshop.html` (already the existing behavior).
- **סיפור קהילה / הצטרפות לקהילה (personal/community story)** → `https://guralea.com/register.html` (already the existing behavior for הצטרפות לקהילה; also applies to a סיפור קהילה post if the post itself is framed as an invitation to share a story rather than to read one - most tier-1/tier-2 story posts still link to `stories.html`, use judgment).
- **A post built around a general question** (not tied to one specific article/workshop/story) → `https://guralea.com/faq.html` - this is a new option, not a fifth rotation type; if a natural fit for this comes up, draft it and ask Leah whether she wants "general question" posts added as their own rotation slot, don't add one unilaterally.

This formalizes what already existed per-destination (the workshop/register/stories fixed lead-in lines above) into one general rule, and adds `faq.html` as a new possible link target now that the FAQ page exists. The existing fixed lead-in phrases (`לפרטים נוספים ולהרשמה לסדנה:`, the register.html closing line, `לכתבה המלאה לחצו על הלינק👇`) still apply exactly as documented above - this rule doesn't replace them, it's the umbrella policy that explains why they're there and extends the same pattern to faq.html once there's a post that needs it. Remember this skill is still **paused as of 2026-08-11** - documenting this rule now doesn't reactivate posting; see the note at the top of this file.

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
   - A local file under `images/facebook-posts/` (the only allowed local source as of 2026-08-04 - never `images/testimonials/*`, never `images/hero-bike.jpg`) needs to become `https://guralea.com/<path-relative-to-repo-root>` (URL-encode spaces in the filename). **Before using it**, confirm the file is actually committed and pushed - run `git status --short` on that path; if it shows as untracked/modified, the file only exists locally and Metricool's servers can't fetch it yet. In that case, tell Leah this specific image needs to be committed and pushed to the live site first, and stop - do not silently commit/push it yourself, since that's still a live-site change and she's asked to review those.
   - **Always build these URLs (and any link put in a caption) without `www` - `https://guralea.com/...`, never `https://www.guralea.com/...`.** Confirmed 2026-08-10: GitHub Pages only issues its HTTPS certificate for the exact custom domain in the repo's `CNAME` file, which is the no-www apex `guralea.com` - the `www` version had no certificate of its own and threw a browser security warning when someone hit it (not a hack, a config gap, since fixed with a GoDaddy `www` → `https://guralea.com` forward). The no-www form is and stays the canonical address for every link this skill produces.

2. **Build the caption.** Combine the headline and the 2-4 line body into one caption string. **Confirmed 2026-08-10, Leah's explicit rule: every lead-in line that precedes a link must end with a 👇 emoji pointing down at the link** (she already used this pattern herself in a real approved post - see leah-voice's "שתפי מה המטרה שלך 👇" example - and asked for it to apply everywhere a link is referenced, including the fixed register.html closing line above). Append `👇` to the end of the lead-in/closing line, then the link on its own line right below it. **Confirmed 2026-08-10, Leah's explicit rule: a raw link with no lead-in has no point ("בלי זה אין טעם לפירסום") - always precede the link with a short CTA line naming what it's for**, e.g. `לפרטים נוספים ולהרשמה לסדנה:` for a workshop.html link. Use exact functional wording, not an invented phrase each time - `לפרטים נוספים ולהרשמה לסדנה:` is the confirmed phrase for workshop.html; for other destination pages (blog-post-N.html, stories.html), ask Leah for the equivalent lead-in phrase the first time each is used, then reuse it consistently rather than inventing new wording per post (same leah-voice hard rule on functional text). **register.html is the exception:** it uses the fixed הצטרפות לקהילה closing line documented above (`כנסי ללינק הזה, ספרי לנו עליו, והצטרפי לקהילת ההשראה הגדולה בישראל. 👇`) instead of a separate lead-in - don't add another lead-in line on top of it. Then the link on its own line, then the approved hashtags (see "Hashtags" section) as the final line.

3. **Publish via Metricool (primary method, confirmed working 2026-08-09).** Read `userToken`, `blogId`, `userId` from `.claude/skills/facebook-teaser/metricool-secrets.json` (never print the token value in chat or write it into any committed file).

   **Step 3a - normalize the image.** `GET https://app.metricool.com/api/actions/normalize/image/url?url=<url-encoded public image URL>` with header `X-Mc-Auth: <userToken>`. Live-tested 2026-08-09: this can be called without `userId`/`blogId` query params despite the general "every call needs them" rule in Metricool's docs - it still returned 200. Response body is the plain-text (not JSON-wrapped) URL to use as the `media` value in step 3b - in testing it echoed the same guralea.com URL back rather than a copied Metricool-hosted one; that's expected, not a bug.

   **Step 3b - create the post, once per brand (confirmed 2026-08-10: 2 separate calls, one per `blogId` in `metricool-secrets.json`'s `brands` object - a single call cannot span two blogIds).** Write the request body to a UTF-8 file first (the `Write` tool, not a shell heredoc - same Hebrew-encoding-corruption risk as the old direct-Facebook method applies here too), then for **each** brand:
   ```
   POST https://app.metricool.com/api/v2/scheduler/posts?userId=<userId>&blogId=<this brand's blogId>
   Header: X-Mc-Auth: <userToken>
   Header: Content-Type: application/json; charset=utf-8
   Body (from --data-binary @<path-to-file>):
   {
     "publicationDate": {"dateTime": "<a few minutes from now, ISO format>", "timezone": "Asia/Jerusalem"},
     "text": "<same caption from step 2, both brands>",
     "providers": [{"network": "facebook"}, {"network": "instagram"}],
     "autoPublish": true,
     "draft": false,
     "facebookData": {"type": "POST"},
     "instagramData": {"autoPublish": true},
     "media": ["<url from step 3a>"]
   }
   ```
   **Confirmed 2026-08-10: `providers` includes both `facebook` and `instagram` for every post, in both brands - this is the standing default (4 destinations total: 2 brands × 2 networks each), not a per-post choice to ask about.** Leah explicitly confirmed the same "הגיל הוא לא הסיפור" caption/link/hashtags going out under the Figura Ramla brand identity too is intentional, not a mismatch to flag. **YouTube stays excluded** (Leah, 2026-08-10: no video content yet to post there) - don't add it until she says there's video to use. If TikTok ever gets connected in Metricool (as of 2026-08-10 it has a connection/auth problem on Leah's end, unrelated to this skill - she needs to reconnect it in Metricool's own UI), it can take photo posts too (confirmed via Metricool's docs, up to 35-image carousel, JPEG/WebP ≤1080p) - add it as a 5th destination only once she confirms the connection works and asks for it.

   **Hebrew-path gotcha (same as the old method):** if `curl`'s `@`/`<` file-reading fails against this repo's Hebrew-named folder path (`...\OneDrive\מסמכים\GitHub\...`, exit code 26 `CURLE_READ_ERROR`), copy the body file to a scratchpad path with no non-ASCII characters first, then reference it from there.

   Check each of the 2 responses (one per brand) for an `error`/non-200 status first - if present for one brand's call, do not claim success for that brand; the other brand's call is independent and may still have succeeded, so report per-destination, never as one pass/fail blob. A successful response is a JSON object with a `data.id` (Metricool's internal post id) and a `data.providers[]` array with one entry per network requested in that call (facebook + instagram) - each entry's `status` is `"PENDING"` immediately after creation, even for a real (non-draft, autoPublish) call, since Metricool processes the actual push asynchronously. This means you cannot construct a live permalink the instant the POST call returns.

   **Confirmed 2026-08-10 (first real posts made this way, including the 4-destination expansion): `publicationDate` must be a few minutes in the future, not "now" - Metricool rejects a `dateTime` at or before its own clock with `400 Bad Request "Given datetime cannot be in the past"`.** After that time passes, a follow-up `GET https://app.metricool.com/api/v2/scheduler/posts/{id}?userId=<userId>&blogId=<that brand's blogId>` shows each entry in `providers[]` flip to `"PUBLISHED"` with a real `publicUrl` (Facebook: `https://facebook.com/{pageId}/posts/{postId}`; Instagram: a direct `https://www.instagram.com/p/{shortcode}/` link) and a network-specific `id` - check **all 4 entries across both GET calls** before telling Leah anything is fully live; a brand/network showing `PENDING` still while others show `PUBLISHED` is a partial success, report it as such. In the confirmed run, `dateTime` was set ~6 minutes ahead and all 4 destinations showed `PUBLISHED` on the next check a few minutes after that time passed - poll again after a short wait if any still shows `PENDING`.

   **Hard-won gotcha, confirmed 2026-08-10: don't trust `TZ="Asia/Jerusalem" date` in this repo's Git Bash environment - it silently returns a value close to raw UTC instead of actually converting to Israel time**, which caused the first attempt at a real post to fail validation (it computed a `publicationDate` that Metricool correctly saw as already in the past). The reliable fix: run `date -u` for the real current UTC time, then add 3 hours by hand for Israel Daylight Time (summer) to get the correct local wall-clock time, and build `publicationDate` a few minutes past that - don't trust a `TZ=` prefix on `date` in this shell to do the conversion correctly. Sanity-check the computed time is actually in the near future before submitting.

   If you create a `draft: true` test post while diagnosing a failure, delete it afterward: `DELETE https://app.metricool.com/api/v2/scheduler/posts/{id}?userId=<userId>&blogId=<blogId>` (confirmed working 2026-08-09, returns `{"data":true}`) - never leave stray test posts sitting in the Metricool calendar.

   **Fallback: direct Facebook Graph API.** If Metricool is down or `metricool-secrets.json` is missing/invalid, fall back to posting straight to Facebook - this method is fully intact and unchanged from before 2026-08-09:
   ```
   POST https://graph.facebook.com/v21.0/{pageId}/photos   (multipart/form-data, curl -F, NOT --data-urlencode - curl refuses to mix -F with -d/--data-urlencode in one call)
   -F "caption=<<windows-path-to-caption-file>"   (the "<" prefix - not "@" - sends the file's contents as the plain field value)
   -F "access_token=<pageAccessToken>"
   -F "source=@<windows-path-to-image-file>"      (here "@" is correct and required - this field IS the binary image upload)
   ```
   Read `pageId`/`pageAccessToken` from `.claude/skills/facebook-teaser/secrets.json`. Both the caption file and the image file need their paths converted with `cygpath -w` first. Same Hebrew-path gotcha (copy to an ASCII-only scratchpad path first) and same Hebrew-encoding rule (write caption to a UTF-8 file, never embed it in the shell command directly) apply. Check the response for an `error` key first; a returned photo `id` confirms a real live post - verify Hebrew rendered correctly via `GET https://graph.facebook.com/v21.0/{photo-id}?fields=name&access_token=...` before telling Leah it's done. If you used `published=false` for a diagnostic test call, delete that test photo (`DELETE /v21.0/{photo-id}?access_token=...`) before finishing. If both Metricool and this fallback fail, hand Leah copy-paste-ready content instead and say plainly that automated publishing isn't working right now.

4. **Confirm to Leah** (Hebrew) that it's live, listing **all 4 destinations separately with their own real link** once each is confirmed published (see the status notes in step 3b) - never a single generic "it's live," and never claim a destination is live before its own `GET` check shows `PUBLISHED`.

## After approval and publishing

Append one row to `.claude/skills/facebook-teaser/posted-log.md`: date, content type, the specific item, a one-line note on the angle/hook used, and status (`אושר ופורסם` once actually posted, not just approved - note per-destination status if any of the 4 didn't fully succeed). Also record which image was used (folder + filename, the live URL, or the Firestore doc ID for a tier-1 story photo) so future runs can rotate images correctly and avoid repeating the same face or picture back-to-back. This is what every future run reads to keep the rotation honest and avoid repeats.

## TODO 2026-08-25: connect the "לאה גורא" Facebook page as a third Metricool brand

Leah is adding this page to Metricool manually herself (2026-08-24), but asked Claude to follow up tomorrow on making it a proper third brand in the rotation (alongside `hagil_lo_hasipor` and `figura_ramla` in `metricool-secrets.json`). She recalled there was previously some issue with this page not being a "business" account (as opposed to a personal profile) - **no record of this being resolved exists anywhere in this repo's skills as of 2026-08-24; treat it as unconfirmed/unresolved, don't assume it's fixed.** When picking this up: check whether the page connected successfully in Metricool's dashboard, ask Leah whether the business-account issue came up again, and only then add its `blogId` to `metricool-secrets.json`.

## TODO 2026-08-25: look into also auto-sharing each post to Stories

Leah asked (2026-08-24) whether the Metricool post also shares automatically to Instagram/Facebook Stories - currently it does not (the publish call uses `"type": "POST"`, feed-only, no story component). She wants this looked into for tomorrow: check Metricool's API docs for a Stories-specific post type/field, and what it would take to add it (either automatically alongside every feed post, or as an option) - don't implement until she decides she wants it, this is research + a proposal, not a build-now item.

## LOCKED, 2026-08-24 - stop re-confirming this: hagil_lo_hasipor stays fully excluded

Leah confirmed this repeatedly on 2026-08-24, increasingly frustrated at having to repeat it: **both the "הגיל הוא לא הסיפור" Facebook page AND the `lea_gura` Instagram account (same brand/blogId `6694827` in `metricool-secrets.json`) are excluded from every post, no exceptions, until she explicitly says otherwise.** This is not a per-post question, not something to double-check with her again, and not something to second-guess based on follower counts or any other reasoning - it's a closed decision. Only `figura_ramla` (blogId `6684336`) is active. Do not ask her to reconfirm this again.
