---
name: site-open-items
description: Standing list of open, not-yet-done tasks for the Hagil-lo-hasipor site that Leah said she'd get back to later. Check this whenever starting site work, so nothing pending gets forgotten or silently dropped.
---

# Open items - check before assuming site work is fully done

## STANDING RULE, 2026-08-26: nothing goes out without her explicit approval first, no exceptions

Leah's exact words: "תעדכני בסקייל לגבי כל דבר שיצא לאתר, ולא משנה מה זה, זה יהיה רק אחרי בדיקה ואישור שלי" - update the skills so that anything that goes out - to the site, to social media, to a paid ad account, anywhere public-facing - happens only after she has actually reviewed and approved it, no matter what it is. Not "auto-publish if it matches an established pattern," not "proceed if there's no open question" - always show her the real thing first (the actual text/image/setting, not a description of it) and wait for a clear yes.

**Why this was added:** on 2026-08-26, a paid test ad campaign (`טסט סיפורי קהילה`, set up with Pavel) turned out to have a misconfigured start date and hadn't been running when Leah believed it had - and separately, this session made a live edit to that ad set's schedule directly in Meta Ads Manager. This came right after several sessions of stale-tracking-file mistakes on the same day, which made clear that "the automation already covers this" or "the pattern is established" is not enough - every actual publish/change to something public needs her eyes on the real content in the moment, every time.

**How to apply:** this already matched the written approval-gate rule in `facebook-teaser`, `marquee-daily-content`, and `weekly-blog-article-draft` (those already say "draft only, present to Leah, publish only after her explicit approval") - but extend the same standard explicitly to anything not already covered by those three: Meta/Facebook Ads Manager changes (budget, schedule, targeting, creative - anything, not just launching a new campaign), Firestore/database rule changes, DNS/domain settings, and any other live-site or live-account change. When in doubt whether something counts as "goes out" or "affects something public," treat it as if it does and ask first.

## -1. Workshop postponed to after the holidays - RESOLVED 2026-08-25, new dates are live

Leah messaged (2026-08-24) with a strategic call: postpone the workshop to after the חגים, priority moves to growing the site itself first (visits → registrations → new people discovering her → more stories - a loop that eventually brings exposure/revenue, "won't happen tomorrow or the day after, but the wheels need to start turning"). **Standing priority shift for content work: she wants effort directed at the site itself (content, stories, traffic) over pushing workshop registration urgency, until she says otherwise.**

She gave the actual new dates 2026-08-25: **Zoom 26.11.2026, in-person 27.11.2026.** Same day, `workshop.html` and `faq.html` were updated with both dates (visible text + `Event`/FAQPage JSON-LD schema) - commits `21d6750` (removed stale Oct dates) and `0b0f142` (set the new Nov dates). Confirmed live in the actual file content, not just the commit message.

**Update 2026-08-26: full repo sweep done for the old 8.10/9.10 dates.** Fixed in 3 places that were genuinely forward-looking (would have misled a future draft): `facebook-ads-plan` SKILL.md (Campaign 1 ad copy, both date mentions), `facebook-teaser` SKILL.md (the workshop-angle date note), `marquee-daily-content` SKILL.md (the approved example line - now says to pull the live date from `workshop.html` instead of hardcoding one). Remaining hits are only in `posted-log.md` files (both skills) and `geo-seo-project` SKILL.md's verbatim record of the original 2026-08-17 spec - all genuine historical records of what was true/posted on a past date, correctly left as-is.

## 0. Legal/compliance items raised 2026-08-13 - waiting on Leah meeting a lawyer

Leah said (2026-08-13) she needs to meet with a lawyer, and raised two things to close after that meeting:
1. **The site has no תקנון (terms of service / site regulations) page.** Needs to be created - don't draft one ourselves since it's a legal document, wait for her/the lawyer's actual content.
2. **Accessibility legal compliance unclear** - she wants to check whether everything on the site meets Israeli accessibility-law requirements (נגישות) or if anything needs to change/improve. The site already has an `accessibility.html` statement page, but she wants a real legal check, not just the existing declaration - don't assume the existing page is sufficient until she confirms after the lawyer meeting.

Both are blocked on her meeting the lawyer - nothing to build yet, just don't let these drop.

**Update 2026-08-23:** Leah called the lawyer about the תקנון specifically - expects it to take about a week to close. Still nothing to build until the actual content arrives. The accessibility legal-compliance check (item 2 above) wasn't mentioned in this call - status unchanged, still just waiting.

**Update 2026-08-26:** Leah pushed the check-back date out to **2026-11-15** - don't surface/ask about the תקנון again before then unless she raises it herself.

**Deferred 2026-08-24 - do not surface before 2026-09-10:** Leah is prioritizing the paid-promotion tests (see the small boost on Amnon's story and deciding site-vs-workshop focus) before deciding what to push on next. She explicitly said not to re-show her these two prep offers - (a) Claude preparing a תקנון outline of clauses already implied by existing site content, for the lawyer to start from, and (b) Claude preparing a one-page summary of existing accessibility features for the lawyer conversation - **until 2026-09-10**. The daily open-items report should skip both of these two specific sub-items entirely until that date; the underlying תקנון/accessibility items above still exist and aren't cancelled, just muted until 2026-09-10.

## 1. Firestore rules - DONE 2026-08-14

`firestore.rules` (including the `ad_submissions` rule for the "פרסמו איתנו" banner form at `advertise.html`) was pasted into the Firebase console and published on 2026-08-14, confirmed working by a live query test (no more permission-denied). Note for future reference: there is still no `firebase.json`/Firebase CLI wired up for real deployment from this repo (a CLI login flow was attempted and hit a hard technical wall - each `firebase login` invocation runs as a separate process with no shared state, so the two-step "get code, redeem code" flow can never complete this way; don't retry that approach) - any future rules changes still need the same manual console paste.

**New minor item found during verification:** `js/banner-display.js`'s actual query (filter + orderBy) needs a Firestore composite index that doesn't exist yet - shows as `failed-precondition: The query requires an index` in console. Not urgent and not currently blocking anything (there are zero approved banners yet, so nothing is being hidden by it). Firebase's own error includes a direct "create index" link - simplest fix is just to trigger the real query once with an approved banner present and click that link, or build the composite index manually in Firestore Database → Indexes.

## 2. Workshop FAQ ("שאלות נפוצות") - DONE 2026-08-14

Built and live in `workshop.html` (9 questions - 5 from Leah's real answers, 4 drawn from existing page content). One deliberately excluded: price - Leah decided not to publish it; the workshop-lead form itself is the "contact us" path for that.

Note for future FAQ-style edits: price question was intentionally left out - don't add "כמה עולה הסדנה?" back in without her explicitly asking for it.

## 3. Site modernization pass (started 2026-08-09) - Leah said the design "belongs to websites from 30 years ago"

Three concrete changes agreed on, tracked here so none get dropped mid-pass:

1. **Remove blanket bold body text** - `.split-cta-text p`, `.value-points li`, and `.section-intro` in `css/style.css` all forced `font-weight: 700` on ordinary paragraph/list text everywhere those classes are used (about.html, index.html, register.html, workshop.html, etc.), which drowned out the real `<strong>` emphasis inside those same paragraphs. **Done 2026-08-09** - all three changed to `font-weight: 400`. If more forced-bold body-text rules turn up elsewhere (check `grep -n "font-weight: 700" css/style.css` against each selector's actual usage), fix those too - only headings, `strong`/`b`, buttons, tags, and the `.intro-highlight` callout box should stay bold.

2. **Replace the scrolling marquee strip** on the homepage with something static. **Done 2026-08-09** - `.marquee-strip`/`.marquee-strip__track` in `css/style.css` rewritten from an animated `translateX` loop with duplicated spans to a plain static flex row (tagline • message • link, dot-separated, no animation). `index.html`'s markup now has one copy of each span instead of two. The `marquee-daily-content` skill and scheduled task were updated to match (single-span editing, no more "both duplicated copies" instruction) - it keeps running daily, just publishing into a static bar now instead of a scrolling one.

3. **Replace emoji thumbnails on `blog.html`** (`🖋️` etc. used as `.blog-thumb` placeholders) with real photos, and increase the blog card heading size. **Done 2026-08-09** - heading/thumbnail sizing fixed first (`.blog-card .blog-body h3` now `var(--text-lg)` with 2-line wrap instead of 16px+ellipsis; `.blog-card .blog-thumb` grown from 54px to 88px), then the emoji themselves replaced with real photos of Leah, one per category, copied into a new `images/blog-thumbs/` folder (`resilience.jpeg`, `inspiration.jpeg`, `health.jpeg`, `balance.jpeg`, `strength.jpeg`, `sleep.jpeg`, `nutrition.jpeg`) and wired into `blog.html`'s `.blog-thumb` divs. **Caveat worth knowing:** these are matched by mood/energy, not literal topic - the photo library (`images/facebook-posts/`) is all photos of Leah doing fitness activities, there's no literal sleep or nutrition photography, so those two categories use the closest-feeling shot rather than a literal illustration. If a specific pairing feels wrong to Leah, swapping one file is a small change - don't need to redo the whole set.

**2026-08-09, after seeing it live:** Leah said the site now feels like it has too many photos of her, and that she'll take care of sourcing images herself going forward. Don't proactively add more photos of her (blog thumbnails, other placeholders, etc.) without her supplying them or asking explicitly - she's taking ownership of image selection from here.

6. **Metricool integration - DONE 2026-08-09/10.** `userId` arrived and was saved (not missing anymore), the live test call succeeded, and `facebook-teaser`'s publish mechanics were fully switched over to Metricool (2 brands × facebook+instagram = 4 destinations per post, confirmed with real published posts 2026-08-10). Full current mechanics live in `.claude/skills/facebook-teaser/SKILL.md`'s "Publishing (after approval)" section - treat that file as the source of truth for how this actually works now, not this paragraph. Publishing itself has been paused by Leah since 2026-08-11 (see [[project_facebook_publishing_paused]]) - that pause is a standing instruction, not a sign the integration is incomplete.

5. **Layout rule, confirmed 2026-08-09: text+video pairs must be genuine wide two-column splits, never one column carrying a heading+paragraphs+video stacked on top of each other.** Leah explicitly wants pages "לרוחב, לא לאורך" (wide, not tall) - when a section has both narrative text and a video, put the text in its own `.split-cta-text` column and the video alone in its own `.split-cta-video` column, same pairing `about.html` already uses correctly (natural DOM order: text first = right side in RTL, video second = left side - don't fight this with `order` unless she asks for the opposite). This was gotten wrong once on `index.html`'s homepage vision section (heading+3 paragraphs+video were all crammed into `.split-cta-video`, making that one column much taller than its sibling and dragging the whole page down) before being split into its own proper two-column row - check any future text+video section against this pattern before shipping it.

## 7. GA4 Explore dashboard - DONE 2026-08-16

All parts (A/B/C/D) done and confirmed by Leah. Part D's two funnels both live inside one Explore report, "משפך הרשמת סיפור", as two tabs: right tab = register.html funnel, left tab = workshop.html funnel. See `project_ga4_dashboard_build_paused` in Claude's memory for full detail. Nothing pending - don't treat this as an open item anymore.

## 8. More workshop FAQ candidates - DONE 2026-08-16 (5 of 6; 1 explicitly rejected)

5 of the 6 candidate questions proposed 2026-08-14 are now answered by Leah and live in `workshop.html`'s FAQ section: physiological-age test method, group size (max 15), payment timing (at registration, by phone), mid-workshop joining (yes, same price, gets all recordings), and cancellation policy (full refund >2 weeks before; 25% fee within 2 weeks; no refund after start, possible-not-guaranteed spot in the next group).

**The 6th (studio wheelchair accessibility) was explicitly rejected by Leah 2026-08-16 - do not propose it again.** The Ramla studio has ~2 entry steps and isn't wheelchair accessible; she was visibly annoyed the question was raised at all, since the workshop is movement-based (standing, sitting, floor work) and isn't something a wheelchair user could participate in regardless of entry access. Don't re-raise this as a FAQ gap or accessibility item in future passes.

## 9. Meta paid ads campaign - small test now live (in review), full Campaign 1 still not launched

Confirmed 2026-08-14: no additional tracking implementation needed to start the already-agreed Meta ads campaign (see `facebook-ads-plan` skill for the settled plan) - the Meta Pixel is live sitewide and `js/workshop-leads.js` already fires `fbq("track", "Lead")` on every workshop-lead form submission, so Facebook Ads Manager will count conversions correctly out of the box. The full 3,500₪/month Campaign 1 from that plan is still not launched - Leah agreed to tell Claude when she actually starts running it.

**Separately, a small test campaign ("טסט סיפורי קהילה," ad account 2148850321876940) was set up by Leah with Pavel, meant to go out 2026-08-24 - it didn't fire because the ad set's start date was misconfigured to 2026-09-01.** Found and fixed 2026-08-26: start date moved to 2026-08-26 (today), end date to 2026-09-02 (preserving the original 7-day window), ₪20/day. Status right after the fix was "בעיבוד" (Meta ad review), not yet "פעיל" - needs a follow-up check that it actually flipped to active and is spending. Budget account has ~₪210 credit left over from a previous ad, comfortably covers this ₪140 total.

## 10. Open items from the 2026-08-24 relaunch push - check every session until cleared

- **Metricool subscription: currently monthly, Leah wants to switch to yearly.** **Update 2026-08-26: she clarified she actually has until 2026-08-30** to do this (not the earlier 2026-08-25 assumption) - not urgent yet. Claude cannot see actual billing/subscription dates - that's in her Metricool account (Settings → Billing), not accessible from here. Keep surfacing it in the daily report until she confirms it's done or the 30.8 deadline passes; don't do the purchase for her.
- **She asked (2026-08-24) to be shown, tomorrow morning (2026-08-25), a full list of urgent/ready-to-handle items** - when picking this up on 2026-08-25, compile and present: this section, the story-reward-vouchers next steps, the facebook-teaser relaunch cadence follow-ups (see below), and anything else logged as pending across the skills in this repo.
- **Accountant's answer on BuyMe/voucher logistics** was expected 2026-08-24 (see `story-reward-vouchers` skill) - still no update as of 2026-08-26. **Leah pushed the check-back date out to 2026-11-15** - don't surface/ask about this again before then unless she raises it herself.
- **"הגיל הוא לא הסיפור" Facebook Page hide/deactivate** - she said she'd do this herself 2026-08-24 (steps logged in `facebook-teaser` skill's TODO note). Check whether it's done; the note there still says "tomorrow" relative to 2026-08-23, i.e. this was meant for today (2026-08-24).
- **Relaunch post (Amnon Gaon, figura_ramla brand) - DONE 2026-08-24.** Published to Facebook + Instagram (studio brand only). First attempt was missing his name (Leah caught it, deleted it herself from both platforms); corrected version with name/age/location published successfully. See `posted-log.md` for the real links.

## 11. GA4 traffic check - DONE 2026-08-24

Leah connected the Claude in Chrome extension 2026-08-24. Built `ga4-weekly-report` skill + Sunday 8am scheduled task (pulls a real 7-day GA4 report: general numbers, traffic sources, top pages, per-story views, register-vs-workshop form activity) - can also be run on-demand ("תריצי את הדוח"). Same session also fixed a real tracking gap (`story_submitted`/`workshop_lead_submitted` events were missing the `form_name` param). See `project_ga4_weekly_report_skill` in Claude's memory. Not an open item anymore.

## 12. Second story (Shai Tuvul) relaunch + Stories on every community-story post - scheduled 2026-08-24

Shai Tuvul's post (same format as Amnon's 2026-08-24 relaunch, figura_ramla brand only) is queued as a one-time scheduled task (`second-story-shai-tuvul-relaunch`) firing **Wednesday 2026-09-02, 07:30** - confirmed correct by Leah 2026-08-28. Leah also locked in a new standing rule same day (2026-08-24): every future סיפור קהילה post also publishes to Instagram + Facebook Stories (image-only, no clickable link - platform restriction on both) - documented in `facebook-teaser` SKILL.md. See `project_second_story_sunday_publish` in Claude's memory.

## 13. stories.html redesign - AWAITING LEAH'S VISUAL APPROVAL (committed locally, NOT pushed) - 2026-08-31

Leah asked (night of 2026-08-30/31, after a GA4 session that found near-zero average engagement time on the site) for stories.html to be reworked around 4 principles: a strong opening line per story (the peak moment, not biography), the photo prominently placed above the fold, mobile-readable structure (short paragraphs, subheadings, a "מ: __ ← ל: __. בגיל: __" summary line), and a closing "גם לך יש סיפור? ספרו לנו" invite linking to register.html. She explicitly said to show her the changes before anything goes live - consistent with the standing approval rule at the top of this file.

**Done and committed locally only** (commit `5025e16`, `js/stories.js` + `css/style.css`): hook line auto-extracted from each story's own `story` field (first ~110 chars at a word boundary); DOM order changed so the photo/video column now renders before the body-text column (previously text came first, so mobile users - flex-direction:column there - saw all the text before ever seeing the photo); a hand-curated "מ/ל/בגיל" summary badge for the 4 currently-approved stories (Shai Tuvul, Amnon Gaon, Eliezer Rave, Avi Torgeman) via a `STORY_SUMMARIES` lookup keyed by Firestore doc ID in `stories.js`; inline bold labels converted to real `<h4>` subheadings; new closing CTA using Leah's own wording, alongside the existing workshop CTA. Verified locally against live Firestore data via a throwaway static server (no console errors, correct render).

**Still needed before this can ship:**
- Show Leah actual before/after screenshots (desktop + mobile) and get her explicit yes.
- The desktop side-by-side order flips too (photo now first/right in RTL, text second/left) - call this out explicitly since she didn't ask for a desktop change, only mobile.
- `STORY_SUMMARIES` is a hand-maintained lookup, not automatic - it will silently show only "בגיל: X" (no מ/ל line) for any story approved after this ships, unless someone adds an entry for the new doc ID each time. Worth asking Leah whether she's OK with that manual step going forward, or wants the submission form itself to collect a short "before/after" phrase from storytellers instead.
- Cache-busting `?v=` bump for `stories.js`/`style.css` still needs doing at push time (not done yet, since this hasn't shipped).

**Update 2026-08-31, escalated scope:** Leah then asked for a full journalistic rewrite of each story's actual body text (not just template/layout), and set a new standing workflow for all future stories too - see `community-story-editing` skill, which now owns this whole thread (editorial spec, hard no-invention rule, Firestore field shape, and the ready-to-run update script for the 4 already-approved rewrites). **Blocked on an authenticated Firestore session** - couldn't complete the actual write (see that skill for the two ways to unblock: Leah leaves an authenticated admin-panel tab open, or approves Claude in Chrome's one-time `guralea.com` navigation permission). Check `community-story-editing` SKILL.md every session until this clears.
