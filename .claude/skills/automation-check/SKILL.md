---
name: automation-check
description: Standing audit skill that checks every scheduled automation on this project (daily-open-items-report, metricool-nightly-check, metricool-weekly-load, marquee-daily-content, weekly-blog-article-draft, ga4-weekly-report, site-health-scan, new-story-alert, pilates-weekly-articles, and any added later) to confirm each one's most recent scheduled run actually happened and reached Leah - not just that the task exists. Read-only: it reports gaps as one line each in the 07:30 morning report and never runs, re-runs, creates or edits a task on its own (rules 78 and 81). Use whenever asked to check, audit, or verify the automations, or when Leah asks whether something "עלה" today/this week.
---

# Automation check

## Why this exists

Confirmed 2026-08-09: scheduled task runs happen in their own separate background session and sometimes stall before ever reaching Leah for approval. A recent `lastRunAt` timestamp on the scheduled task only proves the task *fired* - it does not prove a draft was shown to her, approved, or actually published. Leah asked (2026-08-09) for a standing check across every automation she runs, so gaps like this get caught instead of silently dropped.

**Updated 27.9.2026:** the task list, the "run it yourself immediately" rules and the Facebook-teaser/4-destinations checks below were rewritten. `facebook-daily-teaser` and `metricool-publish-check` no longer exist as scheduled tasks (Facebook/Instagram organic publishing goes through Metricool per rule 1, checked nightly by `metricool-nightly-check`). The "4 destinations per post" rule was cancelled 17.9 (standing-work-rules rule 19.5).

## Live task list (verified 27.9.2026 - always re-check with `list_scheduled_tasks`, this table is a snapshot)

| Task | Schedule | Durable output to compare against |
|---|---|---|
| `daily-open-items-report` | daily 07:30 | the report message in its own session; last actually ran 23.9 |
| `metricool-nightly-check` | daily 21:00 | `standing-work-rules/nightly-check-log.md` (one row per night) |
| `metricool-weekly-load` | Sunday | Metricool scheduler (posts for the coming week, both brands) |
| `marquee-daily-content` | Sunday 07:51 (weekly since 26.9, Leah) | `marquee-daily-content/posted-log.md` |
| `weekly-blog-article-draft` | Sunday 09:26 | drafts in `.claude/blog-drafts/` + chat message (❓ Leah said 26.9 it should stay off; it is enabled - see `site-open-items`) |
| `ga4-weekly-report` | Sunday | the report message in its session |
| `site-health-scan` | every 4h | `site-health-scan/findings-log.md` |
| `new-story-alert` | every 4h | `new-story-alert/seen-stories.md` |
| `pilates-weekly-articles` | Sunday | new article on guraleapilates.com after Leah's approval (re-enabled by Leah 26.9) |
| `tc-leads-daily-20` | **disabled since 23.9** | 36/194 posts fixed; `tc-leads-resume-0927` never fired - open item |

**Known fact, 27.9.2026:** none of `weekly-blog-article-draft`, `marquee-daily-content`, `ga4-weekly-report`, `site-health-scan`, `new-story-alert` has run since 20.9, and `daily-open-items-report` last ran 23.9, although all are enabled. Cause not yet checked - per rule 55, check the Windows event log and `list_task_runs` before writing any cause.

## How to check

1. Call `list_scheduled_tasks` to get the live list - don't work from the table above alone, since tasks get added/removed/rescheduled over time. For each task, note `enabled`, the schedule, and `lastRunAt` (convert to local date - don't assume the UTC display matches "today").
2. For each enabled task, compare `lastRunAt` against its schedule: a daily task whose last run is older than yesterday, or a Sunday task that skipped the last Sunday, is a **gap**. A disabled task with no recent run is expected, not a gap - report it only as "disabled since <date>".
3. **For tasks with a log file** (`marquee-daily-content`, `metricool-nightly-check`, `site-health-scan`, `new-story-alert`), read the log and look for a row dated to `lastRunAt`'s date:
   - Row exists, status `אושר ופורסם` / completed → that run completed end-to-end.
   - Row exists, status `ממתין לאישור` → drafted but never approved. Report it.
   - No row for that date → either the run legitimately found nothing, or it stalled before reaching her. Treat as **unconfirmed** - never assume either explanation.
4. **For `weekly-blog-article-draft`**, there's no posted-log - its output is drafted (not committed) article files in `.claude/blog-drafts/` plus a chat message, gated on Leah's approval before anything touches `blog.html`. Check whether new files exist there since the last Sunday. If none and the Sunday passed, that's unconfirmed.
5. **For `metricool-nightly-check`**, its job is already "check whether Metricool posts actually published" - auditing it means confirming *it* ran and wrote its nightly row, not re-doing its check. A missing row for last night = unconfirmed.
6. **For `daily-open-items-report`**, check `list_task_runs` for a run this morning that reached the end (the report appeared and the notification was sent).
7. If a new automation gets added, extend this same pattern to it (find its log or durable output, compare against `lastRunAt`).

## Reporting to Leah - only in the 07:30 morning report (rules 78 and 81)

Answer plainly, in Hebrew, **one line per automation with a gap**, each with a concrete recommendation Leah can answer by number (rule 22). Confirmed-OK automations get a single summary line. Don't pad with process explanation.

**⛔ Superseded 27.9.2026 - the old rules "handle it immediately: re-run the underlying skill yourself, without asking, at session start / whenever a scheduled session opens / bundle same-day tasks" are cancelled.** They contradict standing-work-rules **rule 81** (23.9: "אל תקים, אל תשנה ואל תבדוק משימות בלי שביקשתי... כל בעיה שאתה מוצא, תכתוב בדוח הבוקר, בשורה אחת עם המלצה") and **rule 78** (27.9: state the intention, execute only after her "כן"). Concretely:
- **Never run, re-run, create, enable, disable or edit a scheduled task from this skill.** Not "just to check", not to fill a gap.
- **Never run the underlying skill live to produce a replacement draft** unless Leah asked for exactly that in the current conversation.
- **A gap is reported once, in the morning report, as one line + recommendation.** No mid-day messages, no approval prompts (rule 81.3).
- Reading is always allowed: `list_scheduled_tasks`, `list_task_runs`, log files, Metricool GET, the live site.

Publishing itself is governed by standing-work-rules **rule 19** (nothing happens automatically, no live action without her explicit "כן" each time) and **rule 37** (nothing goes up until Leah approves the exact item). This skill never publishes and never approves.

## What this skill does not do

It never publishes anything, never marks a log row as `אושר ופורסם` on its own (only Leah's explicit approval of a specific draft, followed by an actual successful publish, earns that), never re-runs a scheduled task, and never drafts a replacement on its own initiative. It reads, compares, and writes one line per gap into the morning report.


## תוספת 5.10.2026 - ריצה תקועה חוסמת את המתזמן
ריצה שסטטוס שלה "running" יותר משעתיים אחרי last_activity_at = תקועה (בדרך כלל פקודה שחיכתה לאישור בלי אף אחד שיענה). כל עוד היא "running", המתזמן לא מפעיל את הריצה הבאה של אותה משימה - זו הסיבה שהדוח של 5.10 לא רץ. בבדיקה: לכל משימה, אם הריצה האחרונה "running" ו-last_activity_at ישן משעתיים - שורה בדוח: "<משימה>: ריצה תקועה מ-<שעה>, חוסמת את הריצה הבאה - לעצור".
