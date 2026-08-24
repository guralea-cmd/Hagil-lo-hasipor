---
name: ga4-weekly-report
description: Every Sunday morning - pulls a real GA4 traffic report for the last 7 days (users/views, traffic sources, top pages, per-story views, and register-vs-workshop form activity) and sends it to Leah in Hebrew.
---

# GA4 weekly report

## Why this exists

Leah asked (2026-08-24) for a standing Sunday-morning traffic report so she doesn't have to ask for one manually each time. She specifically wants forms split by which form it was (community-story registration vs. workshop registration), because she can't tell from the site itself whether people are trying to register for the community or for the workshop.

## Prerequisite: Claude in Chrome must be connected

This report is pulled live from analytics.google.com using the `mcp__claude-in-chrome__*` tools (her logged-in Google session). Before starting:
1. Call `mcp__claude-in-chrome__list_connected_browsers`.
2. If it returns an empty array, the extension isn't connected. Message Leah in Hebrew explaining that this week's report couldn't run because the extension disconnected, and ask her to reopen/reconnect it (link: https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn). Do not fabricate numbers. Stop here for this run.
3. If connected, proceed.

## Account/property

- GA4 account: `hagil-lo-hasipor`. Navigate to `https://analytics.google.com/analytics/web/#/analysis/a400816093p545159332` (Analysis Hub) - this resolves the correct account/property automatically. Property number is `545159332`, account is `400816093`; if the URL ever 404s or shows "missing permissions," re-derive the property id by navigating to `https://analytics.google.com/analytics/web/` plain and reading the resolved URL from the page (it redirects to the right account/property).
- Default date range on new explorations is "last 28 days" - always change it to **last 7 days** for this report (click the date range control near the top of the exploration and select the last-7-days preset, or last complete week ending the Saturday before this Sunday run).

## Building the report (GA4 Explore, manual UI - no working deep-link exists)

Deep-linking directly to a specific report/explore configuration via URL params does not reliably work in this GA4 account (redirects back to a generic screen). Build it manually each run:

1. Go to the Analysis Hub URL above, open **"ריק / יצירת ניתוח חדש"** (blank exploration) - or reuse a previously-saved blank one from the list if one from this skill already exists (look for an exploration you don't recognize as Leah's named reports like "לוח בקרה" or "משפך הרשמה").
2. Set the date range to last 7 days.
3. Add dimensions (search box in the "מאפיינים" picker, Hebrew labels): `form_name` (custom dimension, search by exact name), `שם האירוע` (Event name), `שם דף וסיווג מסך` or similar for top pages, `story_name` (custom dimension), and a channel/source dimension - search `קבוצת ערוצים` and use "קבוצת ערוצים שמוגדרת כברירת מחדל" (Default channel group) for the FB/IG/Google/Direct/Other breakdown.
4. Add metrics: `ספירת אירועים` (Event count) and `משתמשים פעילים` (Active users) and `צפיות` (Views) as needed per section below.
5. **Known UI quirks (hit these building the first version of this report on 2026-08-24):**
   - After clicking a "+" to add a dimension/metric and selecting one from the picker, click the outer "אישור" (confirm) button to close the picker before opening another picker - opening two pickers back-to-back without confirming caused the browser tab to hang once.
   - Dragging fields from the "משתנים" panel into Rows/Columns/Values via mouse drag does NOT reliably work with automation. Instead, click the "+" (add) button directly inside the Rows/Columns/Values slot in the "הגדרות" panel - this opens a small dropdown listing only the fields already added to the exploration; click the one you want there.
   - Column/row tables default to showing only the top 5 columns by event count. If a needed event (e.g. `form_start`, `workshop_lead_submitted`) isn't in the top 5, increase "הצגת קבוצות של עמודות" (or the equivalent rows setting) from 5 to 20 to reveal it.
   - If a screenshot/page-read call times out or the extension reports "disconnected," it's usually transient - wait a few seconds and retry the same read. If a specific tab stays stuck for more than ~15 seconds across two retries, close it and open a fresh tab to the same exploration URL (it auto-saves progress, so reopening by URL recovers the work) rather than continuing to fight the stuck tab.
6. Build one table per section below (reusing the same exploration, adding tabs via the "+" next to the tab name at top-left if helpful, or just reconfiguring rows/columns between reads - reading the numbers via `get_page_text` after each reconfiguration is enough, no need to keep every intermediate table).

## What to include in the report

1. **Numbers כלליים**: total active users and total views for the 7-day window. (Reports > "ניתוח התנועה באתר או באפליקציה" > "סקירה כללית" gives this quickly without building a custom Explore - use that shortcut if it's faster than the manual Explore for this one number.)
2. **מקורות תנועה**: breakdown by Default channel group (dimension) with active users or sessions per source - report the named channels Leah cares about explicitly (Facebook/Organic Social, Instagram if it appears separately or is bucketed under Organic Social - note which), Google/Organic Search, Direct, and an "אחר" bucket for everything else, with numbers for each.
3. **העמודים הנצפים ביותר**: top pages by views (page title dimension), top 5-7 is enough.
4. **צפיות בסיפורים ספציפיים**: rows = `story_name`, filtered to event name = `story_view` (add a filter, or just read the story_view column from a table with columns = event name), metric = event count. Report each story name with its view count.
5. **טפסים בנפרד**: rows = `form_name`, columns = `שם האירוע`, values = event count. Report, separately for each form:
   - **הרשמה לקהילה** (form_name = `story_submission`): count of `form_start` (attempts) vs `story_submitted` (completions).
   - **סדנה** (form_name = `workshop_lead`): count of `form_start` (attempts) vs `workshop_lead_submitted` (completions).
   - If either form shows 0 form_start events tagged with its form_name, say so plainly rather than omitting it - that's a real "nobody tried" finding, not a gap to hide.
   - Note: as of 2026-08-24 both `story_submitted` and `workshop_lead_submitted` completion events were missing the `form_name` param in code (only `form_start` had it), which meant completions couldn't be attributed to a form and fell into "(not set)". This was fixed in commit (see repo history around 2026-08-24, `js/register.js` and `js/workshop-leads.js`) so completions should now be attributable too. If a run finds `story_submitted` or `workshop_lead_submitted` still landing under "(not set)" in significant numbers, flag it to Leah as a possible tracking regression rather than silently reporting incomplete numbers.

## Sending the report

Message Leah in Hebrew, plainly, structured with the 5 sections above as headers or a short list per section. This is a routine informational report, not a publish action - no approval gate needed, just send it. If any section came back empty/zero, say so explicitly (e.g. "אף אחד לא ניסה למלא את טופס הסדנה השבוע") rather than omitting the section.

## Cadence

Runs every Sunday morning via the scheduled task. Not tied to site-health-scan's 4-hour cadence - this is its own weekly schedule.
