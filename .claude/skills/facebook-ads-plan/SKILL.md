---
name: facebook-ads-plan
description: The locked, agreed Meta Ads (Facebook/Instagram) advertising plan for "הגיל הוא לא הסיפור" - one campaign (workshop lead generation, driving traffic to the site), real budget, real geo-targeting. Use whenever asked about ad campaigns, Ads Manager setup, marketing budget, lead generation for the workshop, or promoting the Facebook page. This is settled - do not treat it as an open question, re-debate the geographic strategy, or claim unfamiliarity with it.
---

# Facebook/Instagram Ads plan - locked 2026-08-07

**Published reference page (2026-08-14):** https://claude.ai/code/artifact/d7a849c9-12ff-4f11-8fb6-76ac984137a9 - a standalone visual summary of this plan Leah can open directly without digging through chat. If this document's content changes, republish that same file path/URL from a session that has it (see Artifact tool notes) rather than leaving the page stale.

This plan was finalized with Leah on 2026-08-07 after an earlier draft (built in a separate session) wrongly split budget between "local" and "national" targeting. That was rejected outright - **the answer is not "how much to spend nationally vs. locally," it's that the entire ad budget stays local, always.** Do not revisit that debate; the correction below is the standing plan.

**Hard rule: never respond to marketing/ads questions with "I don't know" or "I haven't heard of this" once a plan like this exists.** Leah pushed back hard on hedging ("את מבינה בפרסום? את יודעת לעשות תוכנית פרסום או שאת ממציאה שטויות") - she wants confident, concrete, decisive answers grounded in this document, not vague menus of options.

## Why local-only, not national

Leah runs a physical Pilates studio (פיגורא) in Ramla and is recruiting for two workshop tracks that both draw from the same real-world community, not a national online-only audience:
- Zoom track: Thursday evenings, 26.11.2026, 18:00-19:30
- Frontal track: Friday mornings, 27.11.2026, 10:30-12:00, at her studio in Ramla

Even the Zoom track is meant to pull from her actual local community (people who know her, might visit the studio, could eventually switch tracks) - not strangers anywhere in Israel. With a monthly budget in the thousands of shekels (not tens of thousands), spreading nationally dilutes reach to the point of being close to meaningless. Concentrating 100% of spend in one tight geographic cluster produces real, usable volume.

## Campaign 2 (page promotion) dropped, confirmed 2026-08-11

The original plan had a second campaign (1,500 ₪/month boosting organic Facebook teaser posts for page engagement). Leah dropped it: "תוכנית 2 יורדת מהפרק, אני מתרכזת בלהביא לידים למלא את הסדנה." This also lines up with [[project_facebook_publishing_paused]] - organic daily teaser posts are paused, so there'd be nothing fresh to boost anyway. Only Campaign 1 below is active. Don't propose reviving Campaign 2 unless she raises it herself.

## Geographic targeting

Target these 7 cities specifically as Meta location targets (not one large radius circle from a single pin, which would sweep in irrelevant areas) - this is a single contiguous central-Israel cluster around Ramla:

**רמלה, לוד, באר יעקב, רחובות, ראשון לציון, בת ים, חולון**

Turn off Meta's Advantage+ automatic location expansion - don't let it drift outside this list. Audience demographic: women, ages 40-60.

## Campaign 1: לידים לסדנה (workshop lead generation)

- **Budget:** 3,500 ₪/month (~115 ₪/day)
- **Objective, changed 2026-08-11 (was: Leads via Meta's native Instant Form):** Leah wants every ad to send people to the site itself, not stay inside Facebook's Instant Form - "בכל אחד מהפרסומים אפנה את האנשים להיכנס לאתר, ככה שזה יעשה פרסום גם לאתר וגם לסדנה" (every ad should drive people into the site, so it builds traffic for the site itself at the same time as generating workshop leads). So: **Traffic/Conversions objective, CTA button linking straight to `workshop.html`**, where her own lead form (with the same track-selector question, Zoom Thursday 26.11 / Frontal Ramla Friday 27.11) captures the lead - not a Meta-native form. This also directly serves the goal in [[project_facebook_publishing_paused]] of building real site traffic before resuming organic social posting.
- **Geo-targeting:** the 7 cities above, no exceptions
- **Ad creative - two variants in the same ad set (let Meta's algorithm find the winner within this audience, don't guess or split into separate ad sets per variant):**
  1. Headline: "בדיקת גיל פיזיולוגי - לא הגיל שרשום בתעודת הזהות." Body built around the "לאן נעלמה האישה שהייתי" mirror-moment hook, physiological age testing, 7-week structure, WhatsApp support, both track options with their real dates, CTA linking to `workshop.html`.
  2. Headline: "שבועות שמשנים איך הגוף שלך מתפקד." Body built around the "not a slogan, real research" framing, 7 sessions/7 weeks, personalized training plan, physiological-age progress tracking in numbers not just feeling, both track options, same CTA linking to `workshop.html`.
- Both ads point to the same page (`workshop.html`) and use the exact same CTA button text - don't invent new CTA wording per leah-voice's hard rule; reuse `workshop.html`'s own existing CTA phrase.

## Total budget

**3,500 ₪/month, Campaign 1 only** (Campaign 2 dropped, see above). Whether the 1,500 ₪/month freed up from Campaign 2 gets folded into Campaign 1 or just isn't spent hasn't been decided - ask Leah rather than assuming either way if it comes up.

## Setup support

When Leah is ready to actually enter this into Meta Ads Manager, walk her through it step-by-step on her screen (the same way the Meta Pixel install was handled) - all the way up to the point of clicking "publish"/committing real budget, since that's her call, not something to do unattended on her behalf.

## Open item, 2026-09-03: reading campaign performance is not yet possible

Leah asked to check today's campaign performance (people reached today/total, spend, whether Shai's post caused a spike) and add it as a standing section in the 08:08 daily report. Tried two paths, both currently blocked:

- **Claude in Chrome browser access to facebook.com** - blocked entirely ("Navigation to this domain is not allowed"), same restriction as Google Docs/Drive/Calendar (see `google-account-access` SKILL.md). Unclear if this is a fixed Anthropic-side blocklist or something Leah could unblock in the extension's own permission settings - never resolved.
- **The existing Page Access Token** (`.claude/skills/facebook-teaser/secrets.json`) - only has `pages_show_list`, `business_management`, `pages_read_engagement`, `pages_manage_posts` scopes. Confirmed via `/owned_ad_accounts` that it lacks `ads_read`/`ads_management`, so it cannot query campaign insights even though `business_management` does resolve a linked business ID (`141699730270272`).

**Next step, agreed with Leah for 2026-09-04:** walk her through the same one-time Graph API Explorer flow used to create the original Page token on 2026-08-03, this time requesting `ads_read` scope too (or a dedicated token) so campaign insights become queryable. Once that exists, add campaign metrics as a standing section in the daily 08:08 open-items report (see `project_daily_open_items_report` in memory). **This is still open - don't let it drop silently, pick it up proactively next session rather than waiting for Leah to re-ask.**
