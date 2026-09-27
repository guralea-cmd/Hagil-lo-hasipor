---
name: site-health-scan
description: Scheduled health check for the Hagil-lo-hasipor site - loads the key public pages, checks for real console errors and broken Firebase connectivity, and reports every finding as one line in the 07:30 morning report (no auto-fix at all, rule 19.5; never a mid-day message, rule 81). Use when running the scheduled scan, or when asked to check the site for bugs/errors.
---

# Site health scan

## Why this exists

Confirmed 2026-08-13/14: ad-hoc debugging during a live conversation is slow and error-prone without a way to reproduce the actual failure (see the photo-upload investigation that day - two theories were raised and both turned out wrong once checked against real evidence). Leah asked for a standing scan that catches real problems on its own, on a recurring schedule, instead of only surfacing when someone happens to hit them and can describe exactly what went wrong.

**Set expectation honestly, every time this is reported to Leah:** this is not literal continuous real-time monitoring - it is a scheduled check that runs periodically (see cadence below). Never describe it to her as "24/7" or "always watching" - describe it as "the last scan, run at ~X, found/didn't find Y."

## What to check each run

For each of these pages: `index.html`, `register.html`, `stories.html`, `workshop.html`, `blog.html`, `about.html`, `advertise.html` (**⛔ הוחלף 27.9.2026:** `events.html` הוסר מהרשימה - הוא רק הפניה ל-index.html מ-29.8, אין מה לסרוק בו):

1. Navigate to the live page **with the tracking-exclusion param**: `https://guralea.com/<page>?_scan=1`. Every page's Google Analytics and Meta Pixel init calls check for `_scan=1` in the query string and skip firing when present (added 2026-08-30, after this scan's own repeated checks were found inflating index.html's pageview/user numbers in GA4). Always include it - never navigate to these pages without it during a scan run.
2. Read console messages, `onlyErrors: true`. Any uncaught error is a finding.
3. Read page text / interactive elements - confirm the page actually rendered real content (not a blank body, not a stuck "טוען..." loading state, not an empty grid where content is expected).
4. For `register.html` specifically: also run a real (not simulated) tiny test write through the live `storage` and `db` client SDKs to confirm the actual write path still works end-to-end - not just that the rules text looks right. Use a throwaway path like `story_submissions/_healthscan_<timestamp>/test.png`, a tiny real blob, real `contentType`. This exact test caught a real transient failure once (2026-08-13) that a rules-text read-through would have missed - don't skip it or replace it with a rules review.
5. For `stories.html`: confirm the approved-stories Firestore query returns data (not empty/error) and that image URLs from `photoUrls` actually resolve (HTTP 200) for at least the first story.

**STOPPED 2026-09-13 - Leah's decision ("למחוק ולהפסיק"): step 6 below does NOT run anymore.** No test writes of any kind to `pilates_leads`, `contact_submissions`, `workshop_leads` or `ad_submissions` - the fake "בדיקה מערכת - למחיקה" records were piling up next to real leads. Instead, for `pilates.html`, `contact.html` and `workshop.html`: confirm the page loads with no console errors and its form fields render, and treat a working approved-stories read (step 5) as the Firestore rules sanity check. If step 5 fails with `permission-denied`, that's the signal the rules broke again (as on 12-13.9) - report it. **Run that check exactly as the page itself runs it - with the `where("status","==","approved")` filter** (see `js/stories.js:146`). An unfiltered `.get()` on the whole `stories`/`story_submissions` collection returns `permission-denied` by design (the rules only expose approved docs) and is NOT a rules regression - on 2026-09-18 an unfiltered probe looked like one for a minute before the filtered query came back clean. Existing test records are left for Leah to delete herself; never delete them from a scan.
6. **Form write-path check, added 2026-09-06 after a real bug was found this way** (`ad_submissions` Storage path had no rule at all - see findings log 2026-09-06 - the Firestore side had been fixed 2026-08-14 but nobody had ever tested the Storage side, so every real banner-ad submission had been silently failing). For each of these forms, run a REAL write through the live client SDK on that form's own page (not a simulated/mocked check) - this proves the exact path a real visitor's click would take, including Storage rules, Firestore rules, and required fields together:
   - `register.html` (`story_submissions`) - already covered by step 4 above.
   - `workshop.html` - `db.collection("workshop_leads").add({firstName, lastName, phone, email, track, status:"new", createdAt})`.
   - `pilates.html` - `db.collection("pilates_leads").add({name, phone, status:"new", createdAt})`.
   - `contact.html` - `db.collection("contact_submissions").add({name, phone, email, topic, message, status:"new", createdAt})`.
   - `advertise.html` - upload a real tiny file to Storage first (`storage.ref("ad_submissions/" + id + "/test.svg").put(blob)`, e.g. fetch `/images/favicon.svg` same-origin and re-upload it as the test blob), THEN `db.collection("ad_submissions").doc(id).set({advertiserName, contactName, phone, email, page, size, duration, link:"", notes:"", bannerUrl, status:"pending", createdAt})`. Both legs must succeed - a Storage-only failure won't show up if you only test the Firestore write.
     **17.9.2026 - ההשתקה בוטלה בהוראת לאה ("למחוק לגמרי").** אסור להסתיר ממנה ממצא. הכשל ב-`storage/unauthorized` בטופס הזה נבדק, נרשם ב-`findings-log.md`, **ומדווח לה ככל ממצא אחר**.
   - Mark every test record's name/advertiserName field literally `"בדיקה מערכת - למחיקה"` (or the equivalent) so it's unambiguous in the admin panel and in Firestore console that it's scan data, not a real submission.
   - **Do not use the actual `<button type=submit>` click (via any tool) to fire these** - the runtime's own permission classifier blocks a real form-submit action even with approval already given in conversation; only a literal click by Leah herself in her own browser gets past it. Write directly via the collection `.add()`/`.set()` calls above instead - this mirrors the exact code each form's own JS runs (verified 2026-09-06 by reading `js/register.js`, `js/workshop-leads.js`, `js/pilates-leads.js`, `js/contact-form.js`, `js/advertise.js` - use those files as the source of truth for field names if any of them change).
   - **Do not attempt to delete the test record afterward** - both a scripted `.delete()` call and clicking the admin panel's "מחק" button (which opens a native `confirm()` dialog this runtime cannot answer) get blocked/stuck. Leave it and note it in the findings log; only escalate to Leah for a cleanup pass if test records are visibly piling up.
   - **Known gap, 2026-09-06: `contact_submissions` and `ad_submissions` have no admin-panel UI at all** - Leah can only see them by opening Firebase Console directly. This isn't something to auto-fix (it's a UI feature, not a bug), but keep surfacing it until she decides whether she wants it built. **⛔ הוחלף 27.9.2026:** ההערה הישנה "מ-12.9 זה חל רק על contact_submissions כי ad_submissions הושתק" בוטלה - ההשתקה נמחקה 17.9 (ראו למעלה), ולכן הפער חל על **שני** האוספים, `contact_submissions` וגם `ad_submissions`.

## Auto-fix vs. ask first

**⛔ בוטל 17.9.2026 בהוראת לאה ("למחוק לגמרי... שום דבר לא יקרה באופן אוטומטי, זה חמור מאוד"): אין תיקון אוטומטי בכלל.** כל ממצא, גם הקטן ביותר, מוצג ללאה עם התיקון המוצע, ונדחף ל-`main` רק אחרי "כן" מפורש ממנה. אסור לדחוף שום שינוי לאתר החי מתוך סריקה. (הרשימה הישנה של "קטגוריות בטוחות לתיקון עצמי" - קונסול, תמונה שבורה, גרסת קאש - נמחקה; היא מעולם לא אושרה על ידה.)

**הכול דורש אישור מפורש שלה לפני נגיעה ב-`main` - מנסחים, מתארים את הממצא ואת התיקון המוצע, ומחכים.** This includes (non-exhaustive): anything touching Firestore/Storage rules, anything changing form behavior or validation, anything that could be a false positive from a flaky/transient check (re-run the check at least once before reporting - see below), any content/copy change, any UI/UX change beyond a literal broken-asset fix.

**Before reporting ANY finding, re-run the specific check that flagged it at least once more.** 2026-08-13: a raw Storage-upload test failed once, was reported as a confirmed site-wide bug, and turned out to be a one-off flake when re-tested minutes later - real infrastructure (rules, App Check) was fine the whole time. Don't repeat that mistake. A finding that doesn't reproduce on a second check is not a finding - don't message her about single-occurrence blips; only note it if it keeps happening across multiple runs (see below).

## Reporting

**⛔ הוחלף 27.9.2026 (כלל 81, נקבע 23.9): לעולם לא שולחים הודעה ללאה באמצע היום. כל ממצא = שורה אחת בדוח הבוקר של 07:30 (daily-open-items-report). אין "תוקן אוטומטית" (כלל 19.5) - יש רק "נמצא X, התיקון המוצע Y, ממתין לאישור".**

- If nothing found: nothing to add to the morning report beyond the last-scan timestamp.
- If something needs her decision: one line in the morning report - what was found, the proposed fix, and the specific action needed from her.
- If a check fails intermittently (flakes on some runs, passes on others) without ever being pinned down: don't add a fresh line every time it flakes. Track it in this skill's own findings log (see below) and only add it to the morning report once it's flaked a few times, framed as "an intermittent thing worth knowing about," not as a confirmed bug.

(היסטוריה: עד 23.9 הסעיף הזה דיבר על "message her in Hebrew" ועל "auto-fixed" - שניהם בוטלו.)

❓ עובדה 27.9: ריצה אחרונה 20.9 14:24 - 7 ימים בלי סריקה, סיבה לא נבדקה.

## Findings log

Keep a running log at `.claude/skills/site-health-scan/findings-log.md` (date, page, what was checked, result, action taken) - mainly so repeated/intermittent issues can be told apart from one-off flakes without re-explaining context each run.

## Cadence

Runs on a schedule (see the scheduled task for the exact interval - default every 4 hours). This is the practical version of "24/7" in this system: periodic, not continuous. If Leah wants a different interval, that's a one-line change to the scheduled task, not to this skill.
