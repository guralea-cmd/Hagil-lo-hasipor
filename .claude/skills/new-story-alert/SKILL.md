---
name: new-story-alert
description: Scheduled check that notices when Leah approves a new community story (in either the legacy `stories` collection or `story_submissions`) and tells her about it - so she doesn't have to remember to report it herself. Use when running the scheduled check, or when asked whether any new stories were approved recently.
---

# New story alert

## Why this exists

Leah asked (2026-08-15) whether she needs to tell Claude every time she approves a new story in the admin dashboard, or whether there's a mechanism that picks it up on its own. There wasn't one - Claude only learns about Firestore changes when she mentions them in chat, or incidentally while another scheduled skill happens to touch the same content. This closes that gap specifically for newly-approved stories.

**Be honest about what this is, if it comes up:** a periodic check (see cadence below), not a real-time push notification. Firestore itself has no way to "call out" to Claude the instant a document changes in this setup - this skill has to actively go look.

## What to check each run

1. Open the Browser pane at `https://guralea.com/stories.html` (any page with the Firebase SDK loaded works, this one already has `db` available).
2. Run a real query via `javascript_tool` against both collections, status `approved` only:
   - `db.collection("stories").where("status","==","approved").get()`
   - `db.collection("story_submissions").where("status","==","approved").get()`
3. For each result, collect the document id and the person's `name` field.
4. Compare against `.claude/skills/new-story-alert/seen-stories.md` (one id per line, per collection). Any id not already listed is new.

## Reporting

- **If there are no new approved stories:** stay silent. Don't message her just to say nothing changed.
- **If there are new approved stories:** message her in Hebrew, plainly - the person's name(s), which collection (doesn't need to be technical - just "סיפור חדש אושר: <name>"), and that it's now live on `stories.html`. No approval gate needed here - she already approved it herself in the dashboard; this is just letting her know it registered, not asking permission for anything.

## After reporting (or after a silent no-new-stories run)

Append every newly-seen id to `.claude/skills/new-story-alert/seen-stories.md` (create the file with a header if it doesn't exist yet) so it's never reported twice. Do this even on the very first run - the first run's job is to establish the baseline of what's already approved as of today, not to dump every historical approval on her as if they just happened. Only announce ids that appear *after* a baseline already exists.

## Cadence

Runs on a schedule (see the scheduled task for the exact interval - every 4 hours, same as `site-health-scan`, bundled as one combined check rather than two separate wake-ups). Not real-time - if she wants faster notice, the fix is a shorter interval on the scheduled task, not a change to this skill.
