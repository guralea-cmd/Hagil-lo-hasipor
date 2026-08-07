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
