---
name: site-open-items
description: Standing list of open, not-yet-done tasks for the Hagil-lo-hasipor site that Leah said she'd get back to later. Check this whenever starting site work, so nothing pending gets forgotten or silently dropped.
---

# Open items - check before assuming site work is fully done

## 0. Legal/compliance items raised 2026-08-13 - waiting on Leah meeting a lawyer

Leah said (2026-08-13) she needs to meet with a lawyer, and raised two things to close after that meeting:
1. **The site has no תקנון (terms of service / site regulations) page.** Needs to be created - don't draft one ourselves since it's a legal document, wait for her/the lawyer's actual content.
2. **Accessibility legal compliance unclear** - she wants to check whether everything on the site meets Israeli accessibility-law requirements (נגישות) or if anything needs to change/improve. The site already has an `accessibility.html` statement page, but she wants a real legal check, not just the existing declaration - don't assume the existing page is sufficient until she confirms after the lawyer meeting.

Both are blocked on her meeting the lawyer - nothing to build yet, just don't let these drop.

## 1. Firestore rules - DONE 2026-08-14

`firestore.rules` (including the `ad_submissions` rule for the "פרסמו איתנו" banner form at `advertise.html`) was pasted into the Firebase console and published on 2026-08-14, confirmed working by a live query test (no more permission-denied). Note for future reference: there is still no `firebase.json`/Firebase CLI wired up for real deployment from this repo (a CLI login flow was attempted and hit a hard technical wall - each `firebase login` invocation runs as a separate process with no shared state, so the two-step "get code, redeem code" flow can never complete this way; don't retry that approach) - any future rules changes still need the same manual console paste.

**New minor item found during verification:** `js/banner-display.js`'s actual query (filter + orderBy) needs a Firestore composite index that doesn't exist yet - shows as `failed-precondition: The query requires an index` in console. Not urgent and not currently blocking anything (there are zero approved banners yet, so nothing is being hidden by it). Firebase's own error includes a direct "create index" link - simplest fix is just to trigger the real query once with an approved banner present and click that link, or build the composite index manually in Firestore Database → Indexes.

## 2. Workshop FAQ ("שאלות נפוצות") - DONE 2026-08-14

Built and live in `workshop.html` (9 questions - 5 from Leah's real answers, 4 drawn from existing page content). One deliberately excluded: price - Leah decided not to publish it; the workshop-lead form itself is the "contact us" path for that.

Note for future FAQ-style edits: price question was intentionally left out - don't add "כמה עולה הסדנה?" back in without her explicitly asking for it.

## 3. Site modernization pass (started 2026-08-09) - Leah said the design "belongs to websites from 30 years ago"

Three concrete changes agreed on, tracked here so none get dropped mid-pass:

1. **Remove blanket bold body text** - `.split-cta-text p`, `.value-points li`, and `.section-intro` in `css/style.css` all forced `font-weight: 700` on ordinary paragraph/list text everywhere those classes are used (about.html, index.html, register.html, workshop.html, etc.), which drowned out the real `<strong>` emphasis inside those same paragraphs. **Done 2026-08-09** - all three changed to `font-weight: 400`. If more forced-bold body-text rules turn up elsewhere (check `grep -n "font-weight: 700" css/style.css` against each selector's actual usage), fix those too - only headings, `strong`/`b`, buttons, tags, and the `.intro-highlight` callout box should stay bold.

2. **Replace the scrolling marquee strip** on the homepage with something static. **Done 2026-08-09** - `.marquee-strip`/`.marquee-strip__track` in `css/style.css` rewritten from an animated `translateX` loop with duplicated spans to a plain static flex row (tagline • message • link, dot-separated, no animation). `index.html`'s markup now has one copy of each span instead of two. The `marquee-daily-content` skill and scheduled task were updated to match (single-span editing, no more "both duplicated copies" instruction) - it keeps running daily, just publishing into a static bar now instead of a scrolling one.

3. **Replace emoji thumbnails on `blog.html`** (`🖋️` etc. used as `.blog-thumb` placeholders) with real photos, and increase the blog card heading size. **Done 2026-08-09** - heading/thumbnail sizing fixed first (`.blog-card .blog-body h3` now `var(--text-lg)` with 2-line wrap instead of 16px+ellipsis; `.blog-card .blog-thumb` grown from 54px to 88px), then the emoji themselves replaced with real photos of Leah, one per category, copied into a new `images/blog-thumbs/` folder (`resilience.jpeg`, `inspiration.jpeg`, `health.jpeg`, `balance.jpeg`, `strength.jpeg`, `sleep.jpeg`, `nutrition.jpeg`) and wired into `blog.html`'s `.blog-thumb` divs. **Caveat worth knowing:** these are matched by mood/energy, not literal topic - the photo library (`images/facebook-posts/`) is all photos of Leah doing fitness activities, there's no literal sleep or nutrition photography, so those two categories use the closest-feeling shot rather than a literal illustration. If a specific pairing feels wrong to Leah, swapping one file is a small change - don't need to redo the whole set.

**2026-08-09, after seeing it live:** Leah said the site now feels like it has too many photos of her, and that she'll take care of sourcing images herself going forward. Don't proactively add more photos of her (blog thumbnails, other placeholders, etc.) without her supplying them or asking explicitly - she's taking ownership of image selection from here.

6. **Metricool integration - proposed 2026-08-09, credentials partially in hand, API researched, not yet wired up.** Leah is considering connecting Metricool (a social-media scheduling/publishing tool with its own API covering Facebook, Instagram, YouTube, TikTok) so the daily `facebook-teaser` skill posts through Metricool's API instead of directly to the Facebook Graph API - one post would then auto-distribute to every network she's connected inside Metricool, instead of Facebook only.
   - **2026-08-09: she supplied her Metricool User Token and Blog ID (`6694827`, the "הגיל הוא לא הסיפור" brand)** - both saved in `.claude/skills/facebook-teaser/metricool-secrets.json` (gitignored, same pattern as the existing Facebook `secrets.json`). **Still missing: her Metricool `userId`** (a separate number from `blogId`, found in Metricool → Account Settings → API section, same screen as the token) - do not fabricate or guess it; ask her.
   - **2026-08-09: real API confirmed** by downloading and reading Metricool's official API PDF (`https://static.metricool.com/API+DOC/API+English.pdf`, "Updated: 04/09/2024" per the doc's own footer - re-verify if this is ever picked up much later in case Metricool revised it) rather than guessing endpoint shapes:
     - Auth: header `X-Mc-Auth: <userToken>`, plus `userId` and `blogId` as query-string params on every call.
     - Post creation: `POST https://app.metricool.com/api/v2/scheduler/posts?userId=<userId>&blogId=<blogId>`. Body includes `publicationDate: {dateTime, timezone}`, `text`, `providers: [{network: "facebook"}]`, `autoPublish: true`, `draft: false`, and a `facebookData: {type: "POST"}` block.
     - Image posts need a two-step flow: first `GET https://app.metricool.com/api/actions/normalize/image/url?url=<public image URL>` to get back a Metricool-hosted copy of the image, then put *that* returned URL in the `media` field of the `v2/scheduler/posts` call - you cannot pass an arbitrary external URL directly to the post-creation call.
   - **Next step once `userId` is in hand:** before writing the actual `facebook-teaser` skill changes, do one live test call (e.g. a `draft: true` scheduled post, not `autoPublish`) to confirm the body shape actually works against her real account - the PDF itself says the exact per-network fields are best confirmed by watching a real browser call, since they vary by publication type. Only then replace the `facebook-teaser` skill's "Publishing (after approval)" section with Metricool-specific steps - keep the rest of the skill (rotation, voice, approval gate) unchanged, this only touches the publish mechanics.

5. **Layout rule, confirmed 2026-08-09: text+video pairs must be genuine wide two-column splits, never one column carrying a heading+paragraphs+video stacked on top of each other.** Leah explicitly wants pages "לרוחב, לא לאורך" (wide, not tall) - when a section has both narrative text and a video, put the text in its own `.split-cta-text` column and the video alone in its own `.split-cta-video` column, same pairing `about.html` already uses correctly (natural DOM order: text first = right side in RTL, video second = left side - don't fight this with `order` unless she asks for the opposite). This was gotten wrong once on `index.html`'s homepage vision section (heading+3 paragraphs+video were all crammed into `.split-cta-video`, making that one column much taller than its sibling and dragging the whole page down) before being split into its own proper two-column row - check any future text+video section against this pattern before shipping it.

## 7. GA4 Explore dashboard - Part D funnel 2 of 2 (workshop.html) not built yet

See `project_ga4_dashboard_build_paused` in Claude's memory for full detail. Parts A/B/C are done and confirmed working. Part D funnel 1 (register.html: `page_view → form_start → story_submitted`, named "משפך הרשמת סיפור") is done, confirmed by Leah 2026-08-16. Funnel 2 (workshop.html: `page_view → form_start → workshop_lead_submitted`) is still an open task - confirmed 2026-08-16 it has not been built yet. No code changes needed (the events already fire correctly) - this is purely a manual GA4 Explore UI step: duplicate the funnel 1 tab and edit 3 things (step 1 page-path filter → "workshop.html", step 3 event → `workshop_lead_submitted`). Pick this up before considering the GA4 dashboard build finished.

## 8. More workshop FAQ candidates - proposed 2026-08-14, not yet decided

After the 9-question FAQ went live (see item 2), Claude proposed 6 more candidate questions that Leah hasn't answered or decided to skip yet - don't assume these were rejected, just not yet addressed:
1. איך עושים את בדיקת הגיל הפיזיולוגי במסלול הזום? (real gap: the intro says a physiological-age test happens at the start of the workshop, unclear how that works remotely over Zoom)
2. מה קורה אם צריך לבטל/לפרוש באמצע הסדנה? (cancellation/refund policy)
3. כמה משתתפות יש בקבוצה?
4. איך משלמים ומתי?
5. הסטודיו ברמלה נגיש (חניה, גישה לנכים)?
6. אפשר להצטרף באמצע, אחרי שהסדנה כבר התחילה?

Don't fabricate answers to these - real business facts, ask her.

## 9. Meta paid ads campaign - infrastructure ready, waiting on Leah to launch

Confirmed 2026-08-14: no additional tracking implementation needed to start the already-agreed Meta ads campaign (see `facebook-ads-plan` skill for the settled plan) - the Meta Pixel is live sitewide and `js/workshop-leads.js` already fires `fbq("track", "Lead")` on every workshop-lead form submission, so Facebook Ads Manager will count conversions correctly out of the box. Leah agreed to tell Claude when she actually starts running the campaign, mainly so GA4/the funnels and the admin dashboard's leads table can be watched together once real ad traffic starts - not because anything technical is blocking her from starting today.
