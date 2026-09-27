---
name: facebook-ads-plan
description: "The workshop ('הגיל הוא לא הסיפור') paid-ads plan - locked 2026-08-07, frozen 2026-09-08, un-frozen 2026-09-10. As of 27.9.2026 NO workshop campaign exists in the ad account; a paid workshop ad runs not before 8.10.2026 and only with Leah's explicit approval. Also holds the Meta ad-account operational lessons (System User token, ads_read, geo by city list) and the studio ads status block. Runs alongside the separate live `pilates-ads-campaign` (Pilates studio lead gen) - independent campaigns for different offers. Read the 'מצב נכון ל-27.9.2026' block first."
---

# Facebook/Instagram Ads plan - locked 2026-08-07, frozen 2026-09-08, UN-FROZEN 2026-09-10

## מצב נכון ל-27.9.2026 - לקרוא לפני כל דבר אחר

- **קמפיין הסדנה:** **לא קיים בחשבון המודעות.** מודעה ממומנת לסדנה - **לא לפני 8.10.2026, ורק באישור מפורש של לאה.** אין הכנה, טעינה או הוצאה בלי "כן" שלה.
- **workshop.html** חי, תאריכים 26.11 (זום) / 27.11 (פרונטלי, רמלה); הטופס עם שדות "אתגר הכיסא" (גיל, כמה פעמים קמת וישבת ב-30 שניות). אין הקפאה רשומה כרגע.
- **קמפיין הסטודיו** (`pilates-ads-campaign`): קבוצת מודעות `120248979725370543` "שתי מתאמנות - רמלה, לוד, באר יעקב 45-65" בקמפיין "לידים לפילאטיס - שתי מתאמנות", **₪90 ליום**, גיל 45-60, ערים רמלה/לוד/באר יעקב/מצליח/יש"רש. פעילות: סמירה `120249200154380543`, בדיוק כמוך `120249230663580543`. פירוט מלא בסעיף "מצב הממומן של הסטודיו" בסוף הקובץ.
- **קריאת ביצועים עובדת** (טוקן System User עם `ads_read`/`ads_management`, `facebook-ads-plan/secrets.json`). תצוגה מקדימה של מודעה נפתחת בכרום של לאה דרך Claude in Chrome (27.9).
- **אורגני:** 3 פוסטים ביום בשני המותגים מ-9.9 (לא מושהה). כלל 79 (27.9): בלי שום שמע.
- **קמפיין "טסט סיפורי קהילה"** `120248718043000543` - מושהה מ-26.9 (ראו למטה).

## Current status - history of the 10.9 timeline

**⛔ הוחלף 27.9.2026: לוח הזמנים של 10.9 (הכנה מ-25.9, השקה 1.10) לא בתוקף. מודעה ממומנת לסדנה - לא לפני 8.10 ורק באישור לאה; אין קמפיין סדנה בחשבון.**

(History - timeline set by Leah 2026-09-10, then rule 12 in `standing-work-rules`: prep from 2026-09-25, approved before 2026-10-01, launch 2026-10-01.)

**This plan (Campaign 1: לידים לסדנה) drives traffic to `workshop.html` and its lead form - both are live again as of 2026-09-10** (the 2026-09-07 removal was reversed the same day this plan was un-frozen; see `project_workshop_removed_from_site` in memory, now stale). The content below was written before the removal, so before starting real prep on 9/25: re-verify the workshop's current real dates on the live `workshop.html` (they may have shifted since 2026-08-25's "Zoom 26.11, in-person 27.11"), re-check the current site state (pilates.html, nav, branding all changed since August), and confirm the geo/budget/audience below still reflects what Leah wants before spending anything.

**This runs alongside `pilates-ads-campaign`, not instead of it** - that's a separate, already-active paid campaign for Pilates studio lead-gen (different offer, different audience). Don't merge or confuse the two when both are running.

The content below documents real, hard-won operational lessons (System User tokens vs. short-lived Explorer tokens, geo-targeting-by-city-list vs. radius, Campaign-2-dropped decision) that still apply - read it as the starting point for 9/25's prep, not a blind resurrection to launch as-is.

---

**Published reference page (2026-08-14):** https://claude.ai/code/artifact/d7a849c9-12ff-4f11-8fb6-76ac984137a9 - a standalone visual summary of this plan Leah can open directly without digging through chat. If this document's content changes, republish that same file path/URL from a session that has it (see Artifact tool notes) rather than leaving the page stale.

This plan was finalized with Leah on 2026-08-07 after an earlier draft (built in a separate session) wrongly split budget between "local" and "national" targeting. That was rejected outright - **the answer is not "how much to spend nationally vs. locally," it's that the entire ad budget stays local, always.** Do not revisit that debate; the correction below is the standing plan.

**Hard rule: never respond to marketing/ads questions with "I don't know" or "I haven't heard of this" once a plan like this exists.** Leah pushed back hard on hedging ("את מבינה בפרסום? את יודעת לעשות תוכנית פרסום או שאת ממציאה שטויות") - she wants confident, concrete, decisive answers grounded in this document, not vague menus of options.

## Why local-only, not national

Leah runs a physical Pilates studio ("לאה גורא - פילאטיס מכשירים ברמלה"; "פיגורא" was the old brand name, not used any more) in Ramla and is recruiting for two workshop tracks that both draw from the same real-world community, not a national online-only audience:
- Zoom track: Thursday evenings, 26.11.2026, 18:00-19:30
- Frontal track: Friday mornings, 27.11.2026, 10:30-12:00, at her studio in Ramla

Even the Zoom track is meant to pull from her actual local community (people who know her, might visit the studio, could eventually switch tracks) - not strangers anywhere in Israel. With a monthly budget in the thousands of shekels (not tens of thousands), spreading nationally dilutes reach to the point of being close to meaningless. Concentrating 100% of spend in one tight geographic cluster produces real, usable volume.

## Campaign 2 (page promotion) dropped, confirmed 2026-08-11

The original plan had a second campaign (1,500 ₪/month boosting organic Facebook teaser posts for page engagement). Leah dropped it: "תוכנית 2 יורדת מהפרק, אני מתרכזת בלהביא לידים למלא את הסדנה." (At the time organic posting was paused - **⛔ הוחלף 27.9.2026: האורגני רץ 3 פוסטים ביום בשני המותגים מ-9.9**, but Campaign 2 stays dropped regardless.) Only Campaign 1 below is planned. Don't propose reviving Campaign 2 unless she raises it herself.

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

## Reading campaign performance - RESOLVED (was open 2026-09-03)

**⛔ הוחלף 27.9.2026: קריאת ביצועים עובדת** - the System User token in `facebook-ads-plan/secrets.json` has `ads_read`/`ads_management` (since 10-11.9), the morning report pulls spend/leads daily, and the ad previews open in Leah's Chrome via Claude in Chrome (done 27.9 - the old "Navigation to this domain is not allowed" block on facebook.com no longer applies). History: on 3.9 only the Page token (`facebook-teaser/secrets.json`, no ads scopes) existed and Chrome was blocked, so insights could not be read; fixed by the System User token below.

## Hard rule, confirmed 2026-09-04: use a System User token, never a raw Graph API Explorer user token

On 2026-09-04, a raw Graph API Explorer user token (with `ads_management`/`ads_read`) was created to swap an ad's creative (pause Amnon's ad, launch Avi's). That token is short-lived (~1-2 hours) and **expired mid-task**, forcing Leah to redo the whole Explorer flow a second time and burning a large chunk of a session on pure credential logistics. She called this out sharply ("לוגיסטיקה מטומטמת") and was right to.

**Going forward, for any Meta/Facebook ads-management credential work (not just organic posting - this covers `ads_management`/`ads_read` specifically):** default straight to a **System User token in Business Manager** (business.facebook.com → Business Settings → Users → System Users → Add → assign the ad account/Page/app as assets → Generate New Token with the needed scopes). This token does not expire on its own and survives across sessions - it is the only credential type suited to "future automated swaps" or any multi-step task that might span more than an hour. Do not default to the quick Explorer-token-plus-manual-exchange path (used historically for the `facebook-teaser` Page token) for anything involving ad account management - that path is for quick one-off Page-token needs only, and even then, prefer System User if the task might recur.

**The broader lesson, not just about tokens:** before starting a multi-step credential/setup flow, think through what the *durable* end-state needs to look like (will this be used once or repeatedly? does it need to survive this session?) and go straight there, instead of solving only the immediate step and discovering the gap later at Leah's expense. When a flow will need her to click through several screens, batch instructions into consolidated multi-step chunks (as many steps as can be safely batched before something might diverge from expectation) rather than one micro-step at a time waiting for confirmation after each one.

## 26.9.2026 - קמפיין "טסט סיפורי קהילה" (120248718043000543) הושהה
לאה, 26.9: "תכבי מיד את הקמפיין של הגיל הוא לא הסיפור גם אם הוא כבר הסתיים... שמטא לא תציג אותו כפעיל". הקמפיין הסתיים לפי תאריך ב-23.9 13:01 (הוצאה אחרונה 9.57 ב-23.9, סה"כ 557.71), אבל מטא הציגה ACTIVE. הועבר ל-PAUSED דרך ה-API ב-26.9; נבדק: קמפיין PAUSED, ערכת המודעות ומודעת "לאה גורא - מתוך החיים שלי נולד החזון" CAMPAIGN_PAUSED. לא נמחק כלום.

## מצב הממומן של הסטודיו - 27.9.2026 ערב (לאה אישרה כל צעד)

- **קבוצת המודעות** `120248979725370543` "שתי מתאמנות - רמלה, לוד, באר יעקב 45-65": **₪90 ליום** (הועלה מ-₪75 ב-27.9 21:21, לאה: "מאשרת 90"; כלל +20% לכל היותר בכל פעם, הבא ל-₪108 רק אחרי יומיים-שלושה עם לידים **ורק אחרי אישור מפורש של לאה. שום שינוי תקציב, מיקום, מודעה או סטטוס לא מתבצע אוטומטית - לעולם. Claude מציע בדוח, לאה מאשרת, ורק אז מבצעים** - לאה 27.9), גילאים 45-60.
  **מיקומים (סופי, לאה 27.9):** פייסבוק פיד+סטוריז+רילס, אינסטגרם פיד+סטוריז+רילס. **מסנג'ר, רשת השותפים, Marketplace, התראות, וידאו באמצע - סגורים לצמיתות.**
  16:59 צומצם ל-4 מקומות (בלי פיד) -> ההצגה קרסה (2-34 חשיפות בשעה, ₪51 מתוך ₪75). ~20:35 הוחזרו שני הפידים (`restore-feeds-2026-09-27.mjs`).
- **מודעות פעילות (2):**
  1. `120249200154380543` "סמירה - מודעת לידים (25.9)" - 7 לידים, ₪22.8 לליד עד 27.9. כל הלידים שלה מרילס/סטוריז.
  2. `120249230663580543` "בדיוק כמוך - מודעת לידים (27.9)" - הופעלה 27.9 ~21:05. **הסרטון = הריל של העמוד `1675720589759858`** ("בדיוק כמוך... היי אני לאה גורא... רוצה להעלים את הכאבים?", 23.6ש, 1080x1080) **מקושר ישירות, בלי הורדה/עריכה/העלאה מחדש.** טופס `2934762870211090`. טקסט: "רוצה להעלים את הכאבים? השאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים" + שורת הכתובת. סקריפט: `create-reel-ad-2026-09-27.mjs`.
- **כבויות:** "שתי מתאמנות" `120249099802200543` (סרטון אחר, 37ש, ₪62 לליד ב-4 המקומות) ו"אאידה" `120248979737840543` (**₪50.2 לליד סה"כ על כל התקופה 11-27.9; ₪37.2 לליד כשמסתכלים רק על רילס/סטוריז** - לא להצטט "₪37" כמספר כללי). לאה: נשארות כבויות.
- **נמחק 27.9:** מודעה זמנית `120249230513180543` + קריאייטיב `1110843278064532` - נבנתה בטעות מזיהוי שגוי של הסרטון (השוואה לפי אורך בלבד, נגד כלל 77). אין לה זכר.
- **לקח 27.9:** לזהות סרטון רק לפי הפריימים שלו (`/{video_id}/thumbnails`), לעולם לא לפי אורך. `source` של ריל בעמוד לא זמין ב-API (גם עם page token). תצוגה מקדימה שלאה יכולה לפתוח: `previews` -> `preview_iframe.php` בכרום שלה דרך Claude in Chrome; קישור fb.me לא נפתח אצלה.
