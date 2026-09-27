---
name: metricool-publish-check
description: Verifies that day's Metricool-scheduled autoPublish posts (the daily Facebook teaser, and any Tier-1 community story pre-scheduled directly in Metricool) actually reached all 4 destinations, and alerts Leah immediately with the specific error if any failed - instead of waiting for her to notice an error email. Use when running the scheduled post-publish check, or when asked to verify whether today's Facebook/Instagram posts actually went live.
---

**⛔ סגור 27.9.2026 - המשימה המתוזמנת נמחקה; הבדיקה מתבצעת ב-`metricool-nightly-check` (21:00) ומדווחת רק בדוח הבוקר (כללים 7/9/81). הקובץ נשאר כארכיון.** (התיקייה `metricool-publish-check` תחת scheduled-tasks היא יתומה - החלטה על מחיקתה אצל לאה.)

# Metricool publish check

## Why this exists

Confirmed 2026-08-11: a Tier-1 community-story post (Eliezer Roeh, 91) was scheduled directly in Metricool with `autoPublish:true` for 07:30, and failed on all 4 destinations (malformed/un-encoded image URL - see root cause below) without Leah finding out until Metricool emailed her directly, well after the fact. Nothing in the existing automation checked Metricool's own async publish result - `automation-check` only checks whether a draft reached Leah and got approved, not whether an already-approved, already-scheduled Metricool post actually went live at its scheduled time. This skill closes that specific gap: verify the *actual publish outcome* a few minutes after each day's scheduled time, without waiting for her to notice.

## Root cause of the 2026-08-11 failure (for reference)

**Initial hypothesis (wrong, tested and disproven same day):** first suspected the Firebase Storage `photoUrls[0]` URL was reaching Metricool decoded (a literal space + Hebrew text in the filename instead of proper `%20`/`%D7%90...` percent-encoding). Resubmitted with a correctly re-encoded URL - it failed again with the exact same error, proving encoding was never the actual problem.

**Actual root cause:** Metricool/Facebook/Instagram cannot reliably fetch a Firebase Storage download URL whose filename contains a space or non-ASCII (Hebrew) characters, regardless of how correctly that URL is encoded. This is a limitation of fetching directly from Firebase Storage for this purpose, not an encoding bug in our pipeline.

**Confirmed fix:** download the story's `photoUrls[0]` image and host it on the site itself instead of linking Firebase Storage directly - see the permanent rule added to `facebook-teaser/SKILL.md`'s Tier-1 section. Once the `media` value pointed at a `guralea.com` URL with a plain ASCII filename, all 4 destinations published successfully on the first attempt.

## What to check each run

1. Read `.claude/skills/facebook-teaser/posted-log.md` and find every row whose status is `מתוזמן (טרם פורסם בפועל)` - these are Metricool posts scheduled with autoPublish but not yet confirmed. Each such row records both POST ids (one per blogId/brand) in its text - extract them. **הערה 27.9.2026:** השורה היחידה עם הסטטוס הזה ב-posted-log היא מ-12.8.2026 (אבי תורג'מן) - ישנה, לא עודכנה מאז; אין שורות "מתוזמן" חיות.
2. Only check rows scheduled for **today or earlier** (a row scheduled for a future date isn't due yet - skip it, it'll be checked on its own day).
3. Read `userToken`/`userId` from `.claude/skills/facebook-teaser/metricool-secrets.json` (gitignored, never print the token value).
4. For each row's two POST ids, call `GET https://app.metricool.com/api/v2/scheduler/posts/{id}?userId=<userId>&blogId=<that brand's blogId>` (blogIds: `hagil_lo_hasipor`=6694827, `figura_ramla`=6684336) with header `X-Mc-Auth: <userToken>`.
5. Each response has a `providers[]` array (one entry per network in that call - facebook, instagram, and tiktok for `hagil_lo_hasipor`). Check every entry's `status`:
   - **⛔ הוחלף 27.9.2026: 5 יעדים, לא 4** - Facebook+Instagram+TikTok ל-`hagil_lo_hasipor`, Facebook+Instagram ל-`figura_ramla` (ערוץ TikTok של הקהילה קיים, ראו `facebook-teaser/SKILL.md`). All `PUBLISHED` across both calls (5 entries total) → fully successful. Update that row's status in `posted-log.md` to `אושר ופורסם (5/5 יעדים)` and append the real `publicUrl` links (same format as existing successful rows in that file).
   - Any entry `ERROR` → real failure. Do not mark the log row as published. Report to Leah (see below).
   - Any entry still `PENDING` → Metricool hasn't finished processing yet; note it, don't treat as a failure, and mention it'll be re-checked on the next run of this skill.

## If something failed

Report to Leah in Hebrew, immediately, in the same message - don't just log it silently and wait for her to ask:
- Which story/post (name/content type from the log row).
- Which specific destination(s) failed, with the exact error text from `detailedStatus`.
- If it's the same root cause as 2026-08-11 (an un-encoded Firestore `photoUrls` URL), say so plainly and prepare the fix: re-fetch the affected story's `photoUrls[0]` fresh from Firestore via the REST query documented in `facebook-teaser/SKILL.md`'s "Fetching real story photos" section, use its raw `stringValue` as-is (already correctly encoded, per "Root cause" above), and prepare a corrected repost (same caption, corrected `media` URL, new near-future `publicationDate`). **Do not actually submit the corrected repost without Leah's explicit approval in that conversation** - preparing the fix is automatic, publishing it is not, same as every other publish action in this project.
- If the cause is something new/unrecognized, report the raw error text plainly rather than guessing at a cause.

## If everything succeeded

Say so briefly - which post(s) were confirmed live, across all 5 destinations (הוחלף 27.9.2026 מ-4), with the real links. No need to pad this with extra process explanation.

## What this does not do

It doesn't draft new content (that's `facebook-teaser`/`marquee-daily-content`), and it doesn't publish or repost anything itself even when it finds and fixes a bug - it only verifies, reports, and (if it can) prepares a fix for Leah's explicit approval.
