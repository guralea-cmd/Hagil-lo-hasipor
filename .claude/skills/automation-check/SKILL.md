---
name: automation-check
description: Standing audit skill that checks every scheduled content automation on this site (facebook-daily-teaser, marquee-daily-content, weekly-blog-article-draft, and any added later) to confirm each one's most recent scheduled run actually reached Leah and got approved/published - not just that the task fired. Use whenever asked to check, audit, or verify the daily/weekly automations, when Leah asks whether something "עלה" today/this week, or proactively at the start of any session that touches content-automation work.
---

# Automation check

## Why this exists

Confirmed 2026-08-09 (`facebook-teaser`, `marquee-daily-content` skill files): scheduled task runs happen in their own separate background session and sometimes stall before ever reaching Leah for approval. A recent `lastRunAt` timestamp on the scheduled task only proves the task *fired* - it does not prove a draft was shown to her, approved, or actually published. Leah asked (2026-08-09) for a standing check across every skill she runs, so gaps like this get caught instead of silently dropped.

## How to check

1. Call `list_scheduled_tasks` to get the live list - don't work from a hardcoded list, since tasks get added/removed/rescheduled over time. Confirmed 2026-08-09: each automation has a fixed reference number so Leah can say "משימה 1" etc. without ambiguity (see the same numbered table in `facebook-teaser`/`marquee-daily-content`/`weekly-blog-article-draft`'s own SKILL.md files) - numbers are stable, never reused/reassigned:
   - **1 = `facebook-daily-teaser`** (daily ~07:32)
   - **2 = `marquee-daily-content`** (daily ~07:41)
   - **3 = `weekly-blog-article-draft`** (Sunday ~09:16)
   - **4 = `automation-check`** (this skill - on-demand, not scheduled)
   - **5 = `metricool-publish-check`** (daily ~07:45)
2. For each task, note `lastRunAt` and its calendar date (convert to local date, don't assume UTC display matches "today").
3. **For `facebook-daily-teaser` and `marquee-daily-content`**, read the matching repo skill's own log (`.claude/skills/facebook-teaser/posted-log.md`, `.claude/skills/marquee-daily-content/posted-log.md`) and look for a row dated to `lastRunAt`'s date:
   - Row exists, status `אושר ופורסם` → that run completed end-to-end. Nothing to do.
   - Row exists, status `ממתין לאישור` → drafted but never approved. Flag it and ask Leah if she wants to review it now.
   - No row for that date → either the run legitimately found no good content (each skill says so in plain prose in-conversation, not as a log row - so this can't be distinguished from a silent stall just by reading the log), or it stalled before reaching her. Treat this as **unconfirmed** rather than assuming either explanation, and ask her directly / offer to run it fresh.

   **For `facebook-daily-teaser` specifically, confirmed 2026-08-10: a status of `אושר ופורסם` is not enough on its own - check that the log row actually documents all 4 destinations, not just one.** Every approved post is supposed to reach 2 Facebook pages + 2 Instagram accounts (see `facebook-teaser`'s "Publishing - how it actually works now" section for the full list and the two-blogId mechanics). If a log row only shows a single link (the old single-destination format from before 2026-08-10) or is missing one of the 4, that's a partial-success gap worth flagging and re-checking live via `GET https://app.metricool.com/api/v2/scheduler/posts/{id}?userId=<userId>&blogId=<blogId>` for both brands (ids/blogIds in `.claude/skills/facebook-teaser/metricool-secrets.json`) rather than assumed to be fine because the row says "אושר ופורסם".
4. **For `weekly-blog-article-draft`**, there's no posted-log file - its output is 7 drafted (not committed) `blog-post-N.html` files plus a chat message, gated on her approval before anything touches `blog.html` or gets pushed. Check whether new untracked `blog-post-N.html` files exist (`git status --short`) with N higher than what's already listed in `blog.html`. If none exist and it's been past the last Sunday run, ask Leah directly whether she saw that week's draft rather than guessing.
5. **For `metricool-publish-check`**, its whole job is already "check whether Metricool posts actually published" - so auditing it means confirming *it* ran and reported, not re-doing its check yourself. Look for any `.claude/skills/facebook-teaser/posted-log.md` row still showing `מתוזמן (טרם פורסם בפועל)` for a date that has already passed - if one exists, that means either `metricool-publish-check` hasn't run yet today, or it ran and found a real unresolved failure that's still sitting there. Either way, run the `metricool-publish-check` skill live right now (same "handle immediately" rule as the others) rather than leaving it unresolved.
6. If a future automation gets added, extend this same pattern to it (find its log or durable output, compare against `lastRunAt`) - don't skip newly-added tasks just because they're not listed above.

## Reporting to Leah

Answer plainly, in Hebrew: which automations are confirmed posted (with the live link/text from the log), which are pending her approval, and which are unconfirmed/possibly stalled. Don't pad with process explanation.

**Confirmed 2026-08-09, hard rule: don't just flag a gap and wait - handle it immediately.** If something is pending approval or unconfirmed/stalled, immediately re-run the underlying skill (`facebook-teaser`, `marquee-daily-content`, or `weekly-blog-article-draft`) fresh in the current conversation right then, produce a new draft, and present it to her for approval in the same message as the audit finding - don't stop at "should I run it?" and wait for a separate go-ahead to draft. Re-triggering the scheduled task itself doesn't help (same stall risk) - running it live in this conversation is the confirmed fix. The one thing that still always needs her explicit, separate approval is the final publish step itself - drafting and presenting happens immediately and automatically, publishing never does.

## Hard rule, confirmed 2026-08-10: run this audit FIRST, automatically, whenever a session opens as one of the scheduled tasks

Leah caught this gap directly on 2026-08-10: a session opened as the `facebook-daily-teaser` scheduled task notification, and instead of checking the other automations, the assistant went straight into drafting that one task - `marquee-daily-content` had already silently stalled that same morning and only got caught because Leah noticed and asked "where was the audit skill today?"

So: **the moment a session/conversation opens as a scheduled-task notification for `facebook-daily-teaser`, `marquee-daily-content`, or `weekly-blog-article-draft`, run this audit skill first - before drafting anything for the task that triggered the session.** Don't wait until the triggering task is fully handled to check the others (that was the exact ordering that let today's gap slip through), and don't wait for Leah to ask. If the audit finds another same-day automation unconfirmed, follow the existing "handle immediately" rule below and present its fresh draft alongside (or before) the triggering task's draft, in the same message flow.

## Standing rule, confirmed 2026-08-10: run that day's due automations together, don't wait to be asked

Leah does not want to have to notice a gap herself and chase for it - she said explicitly she shouldn't need to "remind every moment what's in the skill" or "chase after" getting a stalled task run. So this is not just an on-demand audit tool anymore: **whenever any one of the daily/weekly automations (tasks 1-3) is run in a conversation with her - whether that's a scheduled fire that reached her, or a manual re-run triggered by this skill finding a gap - immediately also check whether the other automations due that same calendar day are confirmed done, and if not, run them live right then too, one after another in the same message flow, without her having to separately ask for each one.**

Concretely: task 1 (`facebook-daily-teaser`, ~07:32) and task 2 (`marquee-daily-content`, ~07:41) are both due every day, only ~9 minutes apart - treat them as a same-day bundle. If task 1's draft is being handled in a conversation, check task 2's `lastRunAt`/log the same way this skill already does, and if it's unconfirmed for today, draft and present it in that same conversation immediately after task 1 is resolved (approved+published or explicitly deferred) - don't wait for her to ask "what about the other one." On Sundays, fold task 3 (`weekly-blog-article-draft`) into the same sweep.

This extends the existing "handle immediately, don't just flag" rule (below) from "found a gap during an audit" to "proactively check for same-day gaps any time one of these automations is being handled at all."

## What this skill does not do

It never publishes anything itself, and it never marks a `posted-log.md` row as `אושר ופורסם` on its own - only Leah's explicit approval of a specific draft, followed by an actual successful publish, earns that. It also never re-runs the *scheduled task* itself (that has the same stall risk) - it re-runs the underlying *skill* live instead. Drafting and presenting a fresh attempt is automatic; publishing is not.
