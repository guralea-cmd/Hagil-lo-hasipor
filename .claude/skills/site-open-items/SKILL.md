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

1. **Remove blanket bold body text** - `.split-cta-text p`, `.value-points li`, and `.section-intro` in `css/style.css` all forced `font-weight: 700` on ordinary paragraph/list text everywhere those classes are used (about.html, index.html, register.html, workshop.html, etc.), which drowned out the real `<strong>` emphasis inside those same paragraphs. **Done 2026-08-09** - all three changed to `font-weight: 400`. Bump the CSS cache-bust version and push after any further edits in this pass. If more forced-bold body-text rules turn up elsewhere (check `grep -n "font-weight: 700" css/style.css` against each selector's actual usage), fix those too - only headings, `strong`/`b`, buttons, tags, and the `.intro-highlight` callout box should stay bold.

2. **Replace the scrolling marquee strip** on the homepage (`.marquee-strip`, currently driven by the `marquee-daily-content` scheduled skill) with something static - Leah specifically called out horizontally-scrolling ticker text as a dated pattern. Not yet done as of this writing - needs a decision on the replacement (a static banner? Rotate the daily content some other way?) before implementing, and likely means retiring or repurposing the `marquee-daily-content` scheduled task/skill once the strip itself is gone.

3. **Replace emoji thumbnails on `blog.html`** (`🖋️` etc. used as `.blog-thumb` placeholders) with real photos, and increase the blog card heading size - Leah called the emoji "childish" and the headings "too small, doesn't look professional." Not yet done - needs real images sourced/chosen per post (check `images/facebook-posts/` or ask Leah for photos) and a `css/style.css` change to `.blog-card h3` (or whatever the current selector is) for heading size.
