---
name: site-health-scan
description: Scheduled health check for the Hagil-lo-hasipor site - loads the key public pages, checks for real console errors and broken Firebase connectivity, auto-fixes proven-safe issues, and messages Leah for approval on anything else. Use when running the scheduled scan, or when asked to check the site for bugs/errors.
---

# Site health scan

## Why this exists

Confirmed 2026-08-13/14: ad-hoc debugging during a live conversation is slow and error-prone without a way to reproduce the actual failure (see the photo-upload investigation that day - two theories were raised and both turned out wrong once checked against real evidence). Leah asked for a standing scan that catches real problems on its own, on a recurring schedule, instead of only surfacing when someone happens to hit them and can describe exactly what went wrong.

**Set expectation honestly, every time this is reported to Leah:** this is not literal continuous real-time monitoring - it is a scheduled check that runs periodically (see cadence below). Never describe it to her as "24/7" or "always watching" - describe it as "the last scan, run at ~X, found/didn't find Y."

## What to check each run

For each of these pages: `index.html`, `register.html`, `stories.html`, `workshop.html`, `blog.html`, `about.html`, `events.html`, `advertise.html`:

1. Navigate to the live page (`https://guralea.com/<page>`).
2. Read console messages, `onlyErrors: true`. Any uncaught error is a finding.
3. Read page text / interactive elements - confirm the page actually rendered real content (not a blank body, not a stuck "טוען..." loading state, not an empty grid where content is expected).
4. For `register.html` specifically: also run a real (not simulated) tiny test write through the live `storage` and `db` client SDKs to confirm the actual write path still works end-to-end - not just that the rules text looks right. Use a throwaway path like `story_submissions/_healthscan_<timestamp>/test.png`, a tiny real blob, real `contentType`. This exact test caught a real transient failure once (2026-08-13) that a rules-text read-through would have missed - don't skip it or replace it with a rules review.
5. For `stories.html`: confirm the approved-stories Firestore query returns data (not empty/error) and that image URLs from `photoUrls` actually resolve (HTTP 200) for at least the first story.

## Auto-fix vs. ask first

**Auto-fix only if the finding matches one of these proven-safe categories** (draft the fix, commit, push to `main`, then tell Leah what was found and fixed - past tense, already live):
- A console error caused by calling an SDK/library method that isn't loaded on that page, fixable with the same defensive-guard pattern already used for `firebase.auth()` in `js/firebase-config.js` (`typeof X === "function" ? X() : null`) - i.e. genuinely dead-code-safe, doesn't change any user-facing behavior.
- A broken/404 image or asset reference where the correct working path is unambiguous (e.g. a typo'd filename that clearly matches an existing file in the same folder).
- A missing cache-busting version bump on a CSS/JS file that was actually edited (per [[project_cache_busting_convention]] - bump `?v=`) with no other content change.

**Everything else needs her explicit approval before touching `main` - draft it, describe the finding and the proposed fix, and wait.** This includes (non-exhaustive): anything touching Firestore/Storage rules, anything changing form behavior or validation, anything that could be a false positive from a flaky/transient check (re-run the check at least once before reporting - see below), any content/copy change, any UI/UX change beyond a literal broken-asset fix.

**Before reporting ANY finding, re-run the specific check that flagged it at least once more.** 2026-08-13: a raw Storage-upload test failed once, was reported as a confirmed site-wide bug, and turned out to be a one-off flake when re-tested minutes later - real infrastructure (rules, App Check) was fine the whole time. Don't repeat that mistake. A finding that doesn't reproduce on a second check is not a finding - don't message her about single-occurrence blips; only note it if it keeps happening across multiple runs (see below).

## Reporting

- If nothing found: no message needed most runs. It's fine to stay silent - don't ping her just to say "all clear" every single cycle (see cadence note).
- If something was auto-fixed: message her in Hebrew, past tense, plain language - what broke, what was changed, that it's already live.
- If something needs her decision: message her in Hebrew with what was found, why it's not a safe auto-fix, and the specific action needed from her.
- If a check fails intermittently (flakes on some runs, passes on others) without ever being pinned down: don't send a fresh alert every time it flakes. Track it in this skill's own findings log (see below) and only escalate to Leah once it's flaked a few times, framed as "an intermittent thing worth knowing about," not as a confirmed bug.

## Findings log

Keep a running log at `.claude/skills/site-health-scan/findings-log.md` (date, page, what was checked, result, action taken) - mainly so repeated/intermittent issues can be told apart from one-off flakes without re-explaining context each run.

## Cadence

Runs on a schedule (see the scheduled task for the exact interval - default every 4 hours). This is the practical version of "24/7" in this system: periodic, not continuous. If Leah wants a different interval, that's a one-line change to the scheduled task, not to this skill.
