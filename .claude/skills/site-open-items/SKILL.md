---
name: site-open-items
description: Standing list of open, not-yet-done tasks for the Hagil-lo-hasipor site that Leah said she'd get back to later. Check this whenever starting site work, so nothing pending gets forgotten or silently dropped.
---

# Open items - check before assuming site work is fully done

## 1. Firestore rules need to be deployed manually

`firestore.rules` in this repo was updated (2026-08-07) to add an `ad_submissions` collection rule (for the new "פרסמו איתנו" banner-request form at `advertise.html`), and to fix a bug in that same rule (missing the public-read exception for `status == "approved"` entries - without it, an approved banner would never actually display, since `js/banner-display.js` reads it with no login).

**This file only updates the repo - it does not deploy to the live Firestore project.** There is no `firebase.json` or Firebase CLI set up in this repo, so deployment has always been manual: paste the full contents of `firestore.rules` into the Firebase console (Firestore Database → Rules → Publish), the same way it's been done before for this project.

Until this is pasted, the `advertise.html` submission form itself still works (the `create` rule was already correct), but approved banners will silently fail to appear on the site (permission-denied, caught in `banner-display.js`'s `.catch`) and admin read/review may also be blocked depending on how review is done. Leah said (2026-08-07) she'd handle this "later" - check whether it's done before assuming the banner-display feature is live end-to-end. Confirm by re-testing `banner-display.js`'s Firestore query against the real project once she says it's pasted.

## 2. Workshop FAQ ("שאלות נפוצות") - waiting on Leah's real answers

Leah asked (2026-08-07) whether the site has an FAQ for the workshop - it doesn't. A draft question list was proposed, split into what's already answerable from existing `workshop.html` content vs. what genuinely needs her input (don't invent answers to these - they're real business facts, not narrative copy):

**Already answerable from `workshop.html` (no need to ask her again):**
- למי מיועדת הסדנה
- מה קורה אם מפספסים מפגש (יש הקלטות)
- ההבדל בין שני המסלולים (זום 8.10 / פרונטלי ברמלה 9.10)
- מה קורה אחרי שהסדנה נגמרת (קהילת הבוגרים)

**Still needs Leah's real answer - do not fabricate:**
1. האם צריך ניסיון קודם באימונים/פילאטיס?
2. כמה עולה הסדנה? (אין מחיר בשום מקום באתר כרגע)
3. יש הגבלת גיל על הסדנה עצמה, מעבר להגדרת הקהילה הכללית כ-50+?
4. הסדנה מיועדת לנשים בלבד, או גם לגברים?
5. מה צריך כדי להשתתף במסלול הזום (ציוד, מקום)?
6. יש מגבלות בריאותיות ספציפיות שכן משפיעות, מעבר לניסוח הכללי "בכל גיל ומצב בריאותי"?

Once she answers, build a real FAQ section/page in her voice (invoke `leah-voice` first, per this repo's standing rule) - link it from `workshop.html` at minimum.

## 3. Site modernization pass (started 2026-08-09) - Leah said the design "belongs to websites from 30 years ago"

Three concrete changes agreed on, tracked here so none get dropped mid-pass:

1. **Remove blanket bold body text** - `.split-cta-text p`, `.value-points li`, and `.section-intro` in `css/style.css` all forced `font-weight: 700` on ordinary paragraph/list text everywhere those classes are used (about.html, index.html, register.html, workshop.html, etc.), which drowned out the real `<strong>` emphasis inside those same paragraphs. **Done 2026-08-09** - all three changed to `font-weight: 400`. If more forced-bold body-text rules turn up elsewhere (check `grep -n "font-weight: 700" css/style.css` against each selector's actual usage), fix those too - only headings, `strong`/`b`, buttons, tags, and the `.intro-highlight` callout box should stay bold.

2. **Replace the scrolling marquee strip** on the homepage with something static. **Done 2026-08-09** - `.marquee-strip`/`.marquee-strip__track` in `css/style.css` rewritten from an animated `translateX` loop with duplicated spans to a plain static flex row (tagline • message • link, dot-separated, no animation). `index.html`'s markup now has one copy of each span instead of two. The `marquee-daily-content` skill and scheduled task were updated to match (single-span editing, no more "both duplicated copies" instruction) - it keeps running daily, just publishing into a static bar now instead of a scrolling one.

3. **Replace emoji thumbnails on `blog.html`** (`🖋️` etc. used as `.blog-thumb` placeholders) with real photos, and increase the blog card heading size. **Done 2026-08-09** - heading/thumbnail sizing fixed first (`.blog-card .blog-body h3` now `var(--text-lg)` with 2-line wrap instead of 16px+ellipsis; `.blog-card .blog-thumb` grown from 54px to 88px), then the emoji themselves replaced with real photos of Leah, one per category, copied into a new `images/blog-thumbs/` folder (`resilience.jpeg`, `inspiration.jpeg`, `health.jpeg`, `balance.jpeg`, `strength.jpeg`, `sleep.jpeg`, `nutrition.jpeg`) and wired into `blog.html`'s `.blog-thumb` divs. **Caveat worth knowing:** these are matched by mood/energy, not literal topic - the photo library (`images/facebook-posts/`) is all photos of Leah doing fitness activities, there's no literal sleep or nutrition photography, so those two categories use the closest-feeling shot rather than a literal illustration. If a specific pairing feels wrong to Leah, swapping one file is a small change - don't need to redo the whole set.

**2026-08-09, after seeing it live:** Leah said the site now feels like it has too many photos of her, and that she'll take care of sourcing images herself going forward. Don't proactively add more photos of her (blog thumbnails, other placeholders, etc.) without her supplying them or asking explicitly - she's taking ownership of image selection from here.

6. **Metricool integration - proposed 2026-08-09, not started.** Leah is considering connecting Metricool (a social-media scheduling/publishing tool with its own API covering Facebook, Instagram, YouTube, TikTok) so the daily `facebook-teaser` skill posts through Metricool's API instead of directly to the Facebook Graph API - one post would then auto-distribute to every network she's connected inside Metricool, instead of Facebook only. Nothing has been built yet; she said she'd check into getting a Metricool account/API token. To pick this up:
   1. She needs a Metricool account with the target networks (Facebook, Instagram, YouTube, TikTok) already connected in Metricool's own dashboard.
   2. She needs a Metricool **User Token** and her **Blog ID / User ID** (found in Metricool's account/API settings) - do not fabricate or guess these.
   3. Before writing any code, read Metricool's actual current API documentation for the publish/schedule-post endpoint (image upload mechanics and per-network caption support likely differ by endpoint - verify rather than assume, the same way the direct Facebook Graph API integration in this skill had to be debugged empirically, see the "Publishing (after approval)" section below).
   4. Once confirmed, the `facebook-teaser` skill's "Publishing (after approval)" section would need a Metricool-specific replacement for its current direct-to-Facebook `curl` steps - keep the rest of the skill (rotation, voice, approval gate) unchanged, this only touches the publish mechanics.

5. **Layout rule, confirmed 2026-08-09: text+video pairs must be genuine wide two-column splits, never one column carrying a heading+paragraphs+video stacked on top of each other.** Leah explicitly wants pages "לרוחב, לא לאורך" (wide, not tall) - when a section has both narrative text and a video, put the text in its own `.split-cta-text` column and the video alone in its own `.split-cta-video` column, same pairing `about.html` already uses correctly (natural DOM order: text first = right side in RTL, video second = left side - don't fight this with `order` unless she asks for the opposite). This was gotten wrong once on `index.html`'s homepage vision section (heading+3 paragraphs+video were all crammed into `.split-cta-video`, making that one column much taller than its sibling and dragging the whole page down) before being split into its own proper two-column row - check any future text+video section against this pattern before shipping it.
