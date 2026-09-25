---
name: pilates-ads-campaign
description: The Pilates studio (לאה גורא פילאטיס מכשירים ברמלה) lead-gen campaign - paid Meta ads + 30-day organic content plan, aimed at 12-14 new trainees/month from Ramla only. Use whenever asked about this campaign, its ad copy, the 30-day content calendar, the pilates.html lead form, or the Pilates Drive folders. Drafted 2026-09-07/08, awaiting Leah's final review and fixes before anything is published.

STATUS: NOT YET APPROVED FOR FINAL PUBLISH. Leah asked (2026-09-08) to save everything here and said "נאשר ונתקן מחר" (we'll approve and fix tomorrow) - treat every piece of copy below as a strong draft, not locked, until she explicitly signs off in a future session.
---

# Pilates studio ad campaign (Ramla)

## Aida ad performance check - 2026-09-13 (00:40)

- Ad set `120248979725370543` "אאידה - רמלה 45-60": ACTIVE since 11.9, ₪50/day, women 45-60, 5 km radius around the studio, Advantage audience off, lead form "more volume" (3 questions).
- After ~2 days: spend ₪100.58, reach 820, CPM ₪81 (very high - tiny audience), CTR 2.8%, 1 lead. Leah called ₪98/lead "מטורף".
- **Applied 2026-09-13 ~00:45 with Leah's explicit approval ("את יכולה לשנות ל-40"):** ad set age changed from 45-60 to **40 - 65+** (API `age_min 40, age_max 65`), women, same 5 km radius around the studio, nothing else changed. Status went to IN_PROCESS (Meta re-review; learning may reset). Ad set name still says "45-60" - not renamed. Next: give it ~5 days before judging cost per lead again. **Meta's age scale ends at "65+" (API `age_max: 65`) - there is no 70. Never propose an age above 65+.**

## Week 2 TikTok posts - scheduled 2026-09-12 evening after Leah approved them

Leah reviewed all 21 TikTok versions with full captions (artifact b3b5b8ad) and replied "מאושר". Created 21 Metricool posts, TikTok only (hagil_lo_hasipor, blogId 6694827), 07:30/12:30/19:30 on 16.9-22.9 (days 8-14). Media: `images/pilates/tiktok-week2/day<D>-<slot>.jpg`, confirmed live on guralea.com and byte-identical. Caption = day-file text + link + the 10 IG/TikTok hashtags. Metricool ids 374966767-374966807. Checked: text read back from Metricool is identical 21/21, and the calendar shows the cards with correct Hebrew and images. Facebook/Instagram for these days are not included - they go through the Sunday weekly load.

## Week 2 Facebook/Instagram posts - loaded 2026-09-13 by the weekly load task

Duplicate check first: 16.9-22.9 had only the 21 approved TikTok posts, no FB/IG. Created 84 Metricool posts (21 slots × 2 brands × separate facebook / instagram calls), autoPublish, 07:30/12:30/19:30, day 8 = 16.9 ... day 14 = 22.9. Text = the day file's text verbatim; Facebook keeps the link + the 3 FB hashtags; Instagram replaces the link line with "הקישור בביו 👆" + the 10 IG hashtags (same format as week 1). Media: `images/pilates/week2/day<D>-<slot>.jpg` (all 21 confirmed 200 live). No TikTok in any of them. Ids 375114068-375114854; text read back in Node identical 84/84.

**Fixed the same run:** week-1 post 374059026 (figura_ramla, Instagram, 14.9 19:30) had a broken character in "הפרטים" (U+FFFD). Recreated as 375115532 with the correct text (copied from the identical hagil post 374058926), same image and time, then the broken one was deleted. A scan of all posts 13.9-22.9 on both brands found no other broken text.

**Checked by eye in Metricool's calendar, 13.9 ~11:30:** both brands, 16.9-22.9, all 3 slots - every slot has one Facebook and one Instagram card with correct Hebrew and the right thumbnail; one full post preview opened (16.9 12:30 FB, image "הרפי את רצפת האגן", full width, no blurred bars). TikTok cards appear only on hagil_lo_hasipor and only the 21 approved ones. A post-click API recount found no extra posts, no drafts, nothing changed. **Gotcha:** the Chrome tool's `save_to_disk` screenshot did not write any file, and the Metricool planner tab froze repeatedly after week switches - the calendar screenshot could not be sent to Leah as a file.

**Stories for week 2 were NOT loaded:** there is no week-2 Story content in any file (week 1 used `images/pilates/stories/day<N>-morning/evening.png` + vertical clips, 3 per day). Needs to be built and approved first. **Update 13.9:** Leah asked for written week-2 Stories and will approve before loading. Draft saved: `organic-week2/stories-week2.md` - 21 Stories (one per post, like week 1), each problem → value → the day's own evening CTA line verbatim, all sentences cut from the approved day files, no new facts. Cards (the post's own photo, vertical 1080×1920, no blur) get built only after she approves the texts. Nothing loaded. **Leah on draft 1: "חסר הנעה לפעולה בפוסטים"** - the CTA was one shared line per day, shown apart from the Stories, with no "הקישור בביו". Draft 2 (same file): every Story has its own CTA tied to its own problem, in her rule-13 template "אם את ___, השאירי פרטים ונחזור אלייך בהקדם", then "הקישור בביו". **Leah on draft 2: "צמצמי את המסר והוסיפי הנעה לפעולה"** - too long for a Story. Draft 3 (same file): 3 short lines per Story (short problem question, one short value sentence, problem-tied CTA) + "הקישור בביו".

**Feed-post CTA change, approved in principle 13.9 ("מאשרת"):** the week-2 morning and noon feed posts end with the generic "השאירי שם וטלפון ונחזור אלייך בהקדם עם כל הפרטים 👇"; Leah approved replacing it with a problem-tied line in her rule-13 template (example shown: day 12 morning → "אם את סובלת מחוסר יציבות, השאירי פרטים ונחזור אלייך בהקדם 👇"). The 14 proposed lines are in `organic-week2/cta-update-proposal.md`, waiting for her approval of the exact wording. After that: delete + recreate the 56 Metricool posts (no in-place edit), update the day files, check by eye. Evening posts stay as they are. **Then, same day, Leah: "את מעלה עכשיו רק סטורי"** - only the Stories go up now. The feed-post CTA swap was NOT done: Metricool posts untouched, day files left as they were (edits reverted), the 14 lines stay in the proposal file in case she asks for them later. Don't run `cta-swap` unless she asks again.

**Week-2 Story cards built 13.9, waiting for Leah's approval:** 21 cards 1080×1920 in `images/pilates/stories-week2/day<D>-<slot>.jpg` (local, not committed/pushed yet). Layout: the post's own week-2 photo at full width (never cropped, blurred or shrunk), dark panel below with the draft-3 Story text (problem white, value light, CTA gold), gold "הקישור בביו" button, the day's 10 hashtags. Rendered with headless Edge (`--headless=new`, own `--user-data-dir` so Leah's open Edge isn't touched; the launcher returns before the PNG is written - wait for the file). Overview + one full-size card sent to Leah. After "מאושר": commit + push the 21 images, confirm 200 live, create Metricool STORY posts (facebook + instagram, both brands, no TikTok) at 07:30/12:30/19:30 on 16.9-22.9, check by eye.

**LOADED 13.9 after Leah: "תעלי את הסטורי".** Commit `6378026` (21 cards, pushed, all 200 live). 42 Metricool STORY posts created, one call per brand with providers facebook + instagram (same body as week 1: `facebookData.type STORY`, `instagramData.type STORY`), text label `סטורי - week2-day<D>-<slot>`, media `https://guralea.com/images/pilates/stories-week2/day<D>-<slot>.jpg`. Ids: hagil_lo_hasipor 375133856-375133921, figura_ramla 375133923-375133991. Read back 42/42 (date, image, networks, type). Duplicate check before creating: none existed. No TikTok. **Checked by eye in Metricool's calendar the same day:** both brands, 16.9-22.9, a Story card in every 07:30/12:30/19:30 slot; the 16.9 12:30 Story preview shows the full vertical card with correct Hebrew. API recount after the UI check: each brand 21 Stories + 42 FB/IG posts, TikTok only the 21 approved (hagil), no drafts, nothing changed. **UI gotcha:** in Metricool's calendar, a click on "Close" in the edit modal passes through to the element underneath (it once opened "Create new post", then the account menu) - close modals with "Cancel" over an empty calendar area, and never click near "Schedule".

**Gotcha:** PowerShell 5.1 `Invoke-RestMethod` decodes Metricool's JSON (no charset in content-type) as Latin-1, so Hebrew looks corrupted (U+00D7 U+0090...) even when it is fine. Verify Hebrew text read-backs in Node (`Buffer` -> utf8), never in PowerShell.

## Photos for every post - read `media-library/README.md` first (set 2026-09-12)

All post/Story/TikTok images come from Leah's own library `מסמכים\מאגר-מדיה-לאה\facebook-page-photos` (536 numbered branded photos), never stock. The README holds the number map, a topic index, the exact selection-page format Leah approved, the save/verify steps, and the TikTok 1080x1920 format (`make-tiktok.ps1`). Week 2 (days 8-14) picks are final and saved in `images/pilates/week2/`.

## Goal and audience - locked facts, don't re-litigate

- **Target:** 12-14 new trainees/month.
- **Geo:** Ramla **only**, including all its neighborhoods (נאות שמיר, קריית האמנים, גני דן, etc.), radius 5km from the studio. **Not Lod** - explicitly excluded.
- **Age: 40-65** - מה שרץ בפועל. לאה 17.9: "אין גיל נכון או לא נכון, תשאירי 40-65 כי זה כבר רץ עכשיו; בפעם הבאה נשנה את הגיל, כשנעלה את המבחן." (הרישום הישן "45-60, נעול" היה שגוי.)
- **Budget:** 80 ₪/day for the paid Meta campaign.
- **Lead destination - the only one:** a short lead form (Facebook Lead Ad + the same form on `pilates.html`). Leah calls every lead back herself. **No WhatsApp anywhere in this campaign** - not in ads, not in organic posts, not as a contact method. **אושר במפורש על ידי לאה 17.9.2026 ("להשאיר") בביקורת הכללים.** Don't reintroduce a WhatsApp CTA for this campaign even though other parts of the site (community stories) use WhatsApp elsewhere.

## STANDING RULE, added 2026-09-09: form moved to the top of the page, links point straight to it

Leah caught (2026-09-09) that the lead form was buried below 15 studio photos - anyone landing from an ad/post never saw it. Fixed: the form now sits directly under the H1, wrapped in a `<div id="form">`, and every scheduled post's link (all networks, including TikTok) points to `https://guralea.com/pilates.html#form` instead of the bare page URL. Any future post/ad for this campaign must use the `#form` link, not the bare `pilates.html` URL.

## REVERSED same day, 2026-09-09: no intraday lead checking

A same-day email-per-lead automation (`pilates-lead-email-check`, polling every 5 minutes) was built and then explicitly cancelled by Leah a few minutes later - she decided she doesn't want intraday checks at all. Leads surface only in the regular 08:08 `daily-open-items-report`, same as before. **Don't rebuild this without her asking again.**

## Lead form - built and live

`pilates.html`'s lead form (commit `2bd8b4f`, pushed 2026-09-08) now has exactly 3 fields:
1. שם מלא (name)
2. טלפון (phone)
3. **מתי נוח שאחזור אלייך?** - select: בוקר / צהריים / ערב (morning/afternoon/evening) - saved as `callbackTime` in the `pilates_leads` Firestore collection (see `js/pilates-leads.js`).

**No "do you have a way to get to the studio" question** - Leah explicitly cancelled this qualifying question. The location itself (see below) does the self-qualifying instead.

The same 3-field structure is the spec for the Facebook Lead Ad form when Leah builds it in Ads Manager - not yet created there (needs her at the screen, same as every other ad-account change in this project - see `facebook-ads-plan` skill's established pattern of walking her through Ads Manager live rather than doing it unattended).

## Location - how to describe it (important, corrected twice)

**UPDATED by Leah 2026-09-14: "אפשר לכתוב שכונה".** The neighborhood name is now allowed in ads and posts. The phrasing in use (Aida ad, 14.9, and the new studio site): **"בשכונת יפה נוף, מקביל לקמפוס השפלה, ברמלה."** The street address itself is still never written in ad/post copy.

(Old rule, 8.9, superseded for the neighborhood only: "Never write the street address or the neighborhood name in any ad or post" - phrasing was "הסטודיו ברמלה, מקביל לקמפוס השפלה.", still fine to use.)

**The real street address stays untouched in `pilates.html`'s `LocalBusiness` schema.org JSON-LD** (for Google Maps/local search accuracy) - Leah confirmed this explicitly 2026-09-08, "נשארת, בסדר." Don't change the schema data; the landmark phrasing is for marketing copy only, not structured data.

## Fixed CTA wording - use verbatim, every time

- **Every paid ad, no exceptions - CHANGED by Leah 2026-09-13:** "תשאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים" (her other accepted version: "תשאירי פרטים ואני אחזור אלייך בהקדם"). "זה מה שצריך להיות שמה ולא משהו אחר". The old line "השאירי טלפון ואני חוזרת אלייך לתיאום אימון היכרות" is retired.
- **Every lead form (Meta instant form and website forms): name + phone only, nothing else** (Leah 2026-09-13): "מספיק השם והטלפון וזה הכל... אנשים לא ישבו למלא שאלות והם עוזבים... בלי חקירות". The custom question "מתי נוח שאחזור אלייך?" is removed. Meta forms can't be edited after publishing - **new form created 2026-09-13: `1032122829849887` ("טופס לידים - שם וטלפון בלבד")**, FULL_NAME + PHONE only, same privacy policy and thank-you page as the old form `939573169208375`. Not attached to any ad yet - it goes in together with the new Aida video (one review, one learning reset), after Leah approves the video.
- **Leads go to ONE Google Sheet, not Fizikal - CHANGED by Leah 2026-09-13 (later the same day):** "כל הלידים — מפייסבוק, מהסיפורים ומ'בת כמה את באמת' — נכנסים לגוגל שיט אחד ולא לפיזיקל. שלוש לשוניות לפי מקור." Details and status in `leads-sheet/SKILL.md`. The earlier Fizikal plan (and `fizikal-questions.md`) is retired. Forms still stay name + phone only.
- **Every organic post, no exceptions:** "השאירי פרטים בקישור ואני חוזרת אלייך" (followed by the pilates.html link)

## "אימון היכרות" - not "אימון ניסיון" - it costs money

Leah corrected this explicitly (2026-09-08): the intro session is called **אימון היכרות**, not "אימון ניסיון" (trial session), and **it costs money** - never describe it as free or "no commitment." This term is independently confirmed authentic in her own old real marketing document (see "Existing marketing material" below), which already used "שיעור היכרות" - so this is her established real terminology, not something invented for this campaign.

## Other locked copy corrections

- **"יותר מ-15 שנה"** (not "12 שנה" or "10 שנה") when referencing how long she's run the studio - use this exact figure everywhere in this campaign's ads and posts, per her explicit correction 2026-09-08.
- **Specific medical conditions (בריחת שתן / urinary incontinence, פיברומיאלגיה / fibromyalgia, פריצת דיסק / disc herniation) may appear in organic posts only - never in paid ads.** **אושר במפורש על ידי לאה 17.9.2026 ("להשאיר").** General terms like "כאבי גב" (back pain), "צפיפות עצם" (bone density), "החלפת ברך/ירך" (knee/hip replacement) are fine in ads.

## Video creative - chosen

**Leah picked video #1: Aida's testimonial.** Real client, named "אאידה", age 60 (matches the target age band exactly), 55-second video, real quotes including "כל האיזור המת הזה חזר לחיות" and "אני כבר שישה חודשים אצל לאה". File: `ad_recommends_20_3.mp4` (downloaded from Drive file id `1WRSqISWcD-2Gdx59-fRxyOOWd6u86EQN`, in the Drive folder **"סרטונים לפרסומת"** - see Drive access below). **This is a real video, not a static photo** - Leah asked to confirm this explicitly 2026-09-08; the ad mockup shown to her was a screenshot of the video's paused frame with a play-button overlay (that's just how a video looks in a still image), not a photo asset.

**Correction, 2026-09-08 (later the same day): the raw file also has a "By Figura Club" branded end-card baked in at ~50.8s-55.7s (old logo, old name, a different photo of Leah with a clipboard prop) - the "only Option 2 has this problem" note above was wrong, or the file changed.** Found while fixing the burned-in caption (below) - verified by extracting frames across the full 55.7s duration. **Fixed version:** `aida_final.mp4` - trimmed to end at 50.5s (well before the branded end-card starts), the burned-in "אני כבר שישה חודשים אצל לאה" caption (dated the video to 2023, no longer accurate re: how long Aida's trained with Leah) is covered for the full duration with a solid navy bar (`#1C3D5A` - **no defined blue brand color exists anywhere on guralea.com, this was a reasonable placeholder pick, flagged to Leah, not yet confirmed as final**) carrying new white text "צולם ב-2023. אאידה עדיין מתאמנת אצל לאה." Sent to Leah via file (not a player screenshot) 2026-09-08 for review. **This fixed file only exists in a scratchpad - if it's approved, it needs a permanent home (e.g. committed under `images/pilates/` or wherever ad creative assets live) before it can be used in Ads Manager.**

The other two options shown and not chosen:
- Option 2: a multi-client compilation video, **has a "By Figura Club" (old, banned brand name) end card baked in** - would need trimming before any future use.
- Option 3: a clean b-roll clip of a woman stretching on a reformer near the studio windows, no captions, no branding issue - a safe fallback if a second/different creative is ever wanted.

### Aida video performance - Leah's verdict, 2026-09-13
From Leah's Ads Manager screenshot ("ביצועי סרטון"): 1,104 video plays, **average watch time 00:05 of a 00:51 video**, hook rate 38%, completion rate 3.57%. Meta's AI panel on the same day: 35 clicks, 1 lead, ₪98.21 per lead; it recommended (a) improving the lead form conversion, (b) adding static/carousel formats, (c) Advantage+ Audience. **Leah's verdict:** the ad is "dead", people aren't excited by it. **No music in Aida's ad** (Leah, later the same night: "במודעה שלה לא צריך שום מוסיקה, המוזיקה זה מה שהיא מדברת, וצריך להקשיב למה שהיא אומרת"). Music was meant only for the community-story ads on "הגיל הוא לא הסיפור". Direction: a shorter edit with her original subtitles, clear story (problem → Leah → result), about 25 seconds. Any replacement creative is shown to her first and swapped only with her explicit yes (standing rule 4).

**Root cause found 2026-09-13:** the navy bar added on 9/8 (to hide "אני כבר שישה חודשים אצל לאה") covered the whole subtitle area for the entire video, so the live ad ran with no subtitles at all - people scrolling with sound off saw a woman talking with no words. The raw Drive file (`1WRSqISWcD-2Gdx59-fRxyOOWd6u86EQN`, 1080x1080, 55.8s) has full burned-in subtitles. Data 11-13.9: 1,115 plays, 94 reached 25%, 16 reached 100%, 12 form opens, 1 lead, ₪100.86 spent.

**Leah approved the plan 13.9 ("15 שניות משהו כזה סבבה לגמרי, תבני, תשלחי לי"):** a ~15s cut of the raw file with its original subtitles visible, 4:5 (1080x1350). Subtitle change times in the raw file (scene detection): 13.73 "למשל, הגעתי עד לפה" · 15.57 "עכשיו אני מגיעה עד לפה..." · 18.40 "אף אחד לא היה מאמין" · 19.93 "כל האיזור המת הזה חזר לחיות" · 23.33 next · 41.07 "הייתי עייפה כל הזמן, עכשיו אני ממש טורבו" · 44.70 next · 49.20 "השמיים הם הגבול" · 50.73 old end card starts. Segments used: 13.70-18.20, 18.38-22.90, 41.07-44.40, 49.22-50.70, then a red end card with the fixed paid-ad CTA. No music (see above). **Name spelling: אאידה - always, never "אידה".** Leah 2026-09-13: "השם שלה אאידה, למה שינית לאידה????" (I had switched it based on the video's burned-in subtitle - wrong. The subtitle's spelling doesn't count; Leah's word does.) **First draft built and sent to Leah 2026-09-13 01:15:** `ad-videos/אאידה-15-שניות-טיוטה.mp4` (16.2s, 1080x1350, no music yet). Edit recipe: `ad-videos/filter.txt` (ffmpeg 8: `-/filter_complex filter.txt`; text via `textfile=` + arialbd.ttf, Hebrew renders correctly). Layout: red #F04048 top band "אאידה, בת 60" + "לאה גורא – פילאטיס מכשירים ברמלה", video with original subtitles, red end card with the fixed CTA. Leah rejected it as too short and unclear ("לא נשאר כלום", "מה יודעים שהתאמנה אצלי?"). **Draft 2 sent 2026-09-13:** `ad-videos/אידה-26-שניות-טיוטה-2.mp4` (26.3s, no music), recipe `ad-videos/filter3.txt`. Segments of the raw file: 8.19-22.95 ("באתי כי היו לי הרבה קשיים בגוף" through "כל האיזור המת הזה חזר לחיות"), 27.94-32.62 ("לאה היא אישה גם ספורטיבית גם בן אדם טוב", last 0.32s is a frozen frame so the next subtitle doesn't flash), 41.07-44.12 ("הייתי עייפה כל הזמן, עכשיו אני ממש טורבו"), 49.22-50.70 ("השמיים הם הגבול"), red end card with the fixed CTA. Top band: "אידה, בת 60" / "מתאמנת אצל לאה גורא – פילאטיס מכשירים ברמלה". Leah: the jump from "בן אדם טוב" straight to "הייתי עייפה כל הזמן" felt cut and missing ("משהו חסר שמה, מאוד בולט, תחזירי את המשפט הזה... יהיה יותר אותנטי"). **Draft 3 sent 2026-09-13:** `ad-videos/אידה-טיוטה-3.mp4` (30.7s), recipe `ad-videos/filter4.txt` - third segment now starts at 36.73 ("אני הגעתי ממש חלשה, עם גוף חלש, עם שרירים חלשים") and runs straight into "הייתי עייפה כל הזמן, עכשיו אני ממש טורבו" (36.73-44.12). **Lesson: don't cut between two sentences that belong to one thought - the viewer feels the gap.** Draft 4 (`ad-videos/אידה-טיוטה-4.mp4`, recipe `filter5.txt`) = draft 3 with Leah's new closing line "תשאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים".

**LIVE SWAP, 2026-09-13, approved by Leah ("את יכולה להעלות כבר את הסרטון של אידה, הסרטון האחרון מספר ארבע"):** video uploaded `2169082070315693`, thumbnail image hash `9b055a2b88b5c373896047f2b89321ff` (frame at 5.2s), new creative `3577339485773226` attached to the same ad `120248979737840543` (no second ad created, no duplicate). Creative: same title "שלוש שנים. ועדיין כאן.", message changed only in two places - "אאידה" → "אידה" and the old CTA line → "תשאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים." - and the lead form is now the name+phone form `1032122829849887`. All Advantage+ creative features still OPT_OUT. Right after the swap: ad `IN_PROCESS` (Meta review); the only other running ad in the account is Avi's. Old creative `1737814120636139` / old video `1738774987408894` / old form `939573169208375` are no longer used. Budget unchanged (₪50/day) - Leah has not decided on ₪100. **Name corrected the same night** (Leah: the name is אאידה): re-rendered as `ad-videos/אאידה-טיוטה-5.mp4` (top band "אאידה, בת 60"), video `858130014052978`, thumbnail hash `dfb34f1278bd51841eaa67384d068552`, creative `2496467247528322` (message says "אאידה") attached to the same ad `120248979737840543` - IN_PROCESS. Creative `3577339485773226` / video `2169082070315693` (with "אידה") are no longer used. **Version 6, approved by Leah and swapped in 2026-09-13 ~11:10 ("מאשרת תעלי"):** she rejected the red band ("לא כיף להסתכל על זה... שיהיה רגוע, שלא יהיה יותר בולט מהסרטון"). `ad-videos/אאידה-טיוטה-6.mp4`, recipe `filter6.txt`: band and end card in #6E6259 (taken from the studio background at the top of the video, slightly darker so white text reads), white text, name 76px bold, second line regular. Video `1364011832384995`, thumbnail hash `7fd892fcc150b07652e680301722b017`, creative `2096734725053712` attached to the same ad `120248979737840543` - IN_PROCESS. Creative `2496467247528322` / video `858130014052978` (red band) are no longer used. Review page shown to Leah: https://claude.ai/code/artifact/ed453ec5-f53f-4365-9765-6869092954a6 **Still to do:** once Meta approves, check the ad by eye as a viewer sees it (rule 2), with subtitles.

**TEXT SWAP, 2026-09-14 ~12:30, Leah's own wording ("אלייך ותעלי"):** new creative `2270441837055164` attached to the same ad `120248979737840543` (same video `1364011832384995`, thumbnail hash `7fd892fcc150b07652e680301722b017`, form `1032122829849887`, all Advantage+ creative features copied as OPT_OUT). Headline "מגוף חלש - לטורבו", button SIGN_UP ("הרשמה"), body exactly as in `aida-ad-copy-options-2026-09-14.md` ("הנוסח של לאה", with "אלייך"). Read back: text identical, no U+FFFD, effective_status IN_PROCESS (Meta review). Only other active ad in the account: Avi's. Creative `2096734725053712` (title "שלוש שנים. ועדיין כאן.") is no longer used. Her text includes "בשכונת יפה נוף" - Leah confirmed 14.9: "אפשר לכתוב שכונה" (location rule updated above). **Still to do:** after Meta approves, check by eye as a viewer sees it and send Leah a screenshot.

**Cost per lead, before vs after the subtitles fix - snapshot 2026-09-13 ~14:00.** Leah counts unique people only (Riki Kashut left details twice - count once): 3 leads. Total spend since 11.9: ₪165.43 → ~₪55 per lead. Before the fix (11.9 to 13.9 ~02:00): ₪105.86, 1 lead (Riki) → ~₪106. After the fix (subtitles + name/phone form, from ~02:00 on 13.9): ₪59.57, 2 new leads (Salwa 06:58, Aviva Rom 10:51 - both through the new form, both before the no-red version 6 went in ~11:10) → ~₪30 per lead. Only 2 leads - too early to call it a trend. Delivery almost stopped from 11:00 (₪0.2-0.6/hour) while Meta reviewed version 6. Budget: she's considering ₪100/day (≈₪3,000/month); recommendation given - raise it together with the new video. No budget change made.

## Ad mockup

A realistic Facebook-feed mockup (page name, "ממומן" label, ad copy, Aida's video thumbnail + play button, "GURALEA.COM" domain line, headline, "הרשמה" button, like/comment/share row) was built and shown to Leah 2026-09-08 via `SendUserFile`. It lives only in this session's scratchpad (`ad_mockup.png`/`ad_mockup.html`) - regenerate from the same HTML/CSS structure if needed again (uses the site's real photos/video frame as a base64-embedded image, headless Edge screenshot, same technique as `post-frame-template.html` in `facebook-teaser`).

## The 5 ad concepts (current draft, all corrections applied)

All use the fixed CTA and location line above. Headlines and hooks:

1. **Mirror-moment hook:** "את מסתכלת במראה ושואלת: לאן נעלמה האישה שהייתי?" - bone density, posture, back pain, personal accompaniment.
2. **Aida's quote (matches the chosen video):** "\"כל האיזור המת הזה חזר לחיות\" - אאידה, בת 60" - small groups (up to 9), the location line, the fixed CTA.
3. **Leah's own story:** "בגיל 45 הייתי משותקת בחצי גוף. היום, בגיל 72, אני מנהלת סטודיו פילאטיס." - ties to her real bio, no location line needed.
4. **Personal attention angle:** "כל תרגיל מותאם אליך - לא לכולם אותו דבר." - יותר מ-15 שנה, two floors, small groups, personal app. **No specific medical diagnoses in this one** (an earlier draft wrongly listed דיסק/פיברומיאלגיה here - fixed per the medical-terms-organic-only rule above; use generic "שיקום וחיזוק הגוף" instead, or knee/hip replacement only).
5. **Local convenience angle:** "סטודיו פילאטיס מקצועי, ממש אצלך בשכונה." - the location line, יותר מ-15 שנה ותק.

## The 30-day / 90-post organic calendar

Full day-by-day text (morning tip, midday visual-only with hashtags, evening CTA) was built and approved in conversation 2026-09-07/08, with the "יותר מ-15 שנה" and location-line fixes applied to days 1, 3, 24, and 27. **This full text exists only in that conversation's transcript, not yet copied into this file verbatim** - if resuming this project and the transcript isn't available, ask Leah to confirm she still wants the same calendar re-sent for a final check, rather than assuming, since she asked for a fix pass on the whole thing tomorrow anyway.

Structure to preserve if rebuilding: 3 posts/day for 30 days, all posted to **Facebook + Instagram only** (the `figura_ramla` Metricool brand - blogId `6684336` - has no TikTok connected, unlike `hagil_lo_hasipor`). Every slot needs an image or video (Instagram cannot take a text-only post) - rotate through the 15 existing photos in `images/pilates/` plus new material from the Drive folders. Medical-specific educational days (urinary incontinence, fibromyalgia, disc herniation) are fine here even though they're banned from paid ads.

## Metricool scheduling - blocked, needs a different approach

**Attempted 2026-09-08: bulk-scheduling all 90 posts via a script calling Metricool's real `autoPublish:true` create-post endpoint was blocked by this runtime's own safety classifier** - tried the full batch, a retry, and a 3-post mini-batch; all three were refused. This is not a bug to route around - don't keep retrying variations of the same automated bulk-publish call.

**Working alternative, confirmed safe:** a single `draft:true` test post (same endpoint, same body, just `draft:true`) succeeded and was cleanly deleted afterward - so the credentials and mechanics are fine; it's specifically the real auto-publish action at any volume that's gated.

**Next session's options, to decide with Leah:**
1. Schedule organic posts the same way the daily `facebook-teaser` post has always worked - one real post at a time, shown to Leah in chat, sent close to when it needs to go live - not pre-scheduled a month ahead.
2. Leah schedules the 30 days herself directly in Metricool's own calendar UI, using the exact text this skill preserves (once the full 90-post text is copied in here or re-generated).
3. Ask if there's a way to get this category of action pre-approved for a future session (unclear if possible - this looked like a hard runtime-level gate, not a settings toggle).

## Drive folders - now shared, use these for future rounds

Leah shared real Drive folders with the service account (`hagil-sheets-bot@hagil-lo-hasipor.iam.gserviceaccount.com`) on 2026-09-07/08, containing far more usable material than the old local Desktop folder used for `pilates.html`'s original 15 photos:

- **"סרטונים לפרסומת"** (folder id `1lJRJyXPXmRwbBfmZ5qjw3bBYiNFIJKVd`) - pre-edited, ad-ready testimonial videos with burned-in Hebrew captions. This is where Aida's chosen video and the other two options came from. Check here first for any future ad creative.
- **"חומרים לאה"** (folder id `1CPYCytRjUG4lLeUYbF2zr4T8_kCp4G0k`) - raw client testimonial clips (WhatsApp videos, IMG_29xx.MOV files, some very short/unusable fragments under 2 seconds), plus one major find:
  - **Google Doc "כתב שיווקית לאה גורא"** (id `19FkcZfzJRU3hj-QE8M_KNCKWncbTNdAUrMIClj5bDQI`) - a full interview-style marketing article, likely from the old campaign era, with real authentic quotes and facts not documented elsewhere: two floors (reformer room upstairs, "WONDA" chair room downstairs), up to 9 participants per class, a personal scheduling app, the claim "מי שיקדיש 45 דקות פעמיים בשבוע... יפחית את רמות מפלס הכאב בגוף ב-90% כבר מהשבוע הראשון", and confirms "שיעור היכרות" as her own long-established real term. **Worth mining further for future ad/post copy** - only partially used so far.
- **"סרטונים"** (folder id `12OHIjdyYk93oScWEV3IGFRQu-sD7tcKP`) - a large raw archive, ~37 files, mostly dated July 2020, sizes 10-150MB each. **Not reviewed yet** - not needed for the current 5 ads + 30-day plan, but a deep well for future rounds once the current batch of creative is exhausted.

To re-access: mint a Drive-scoped token from the existing service account key (`.claude/skills/google-account-access/service-account-key.json`, scope `https://www.googleapis.com/auth/drive.readonly`) the same way `google-account-access` skill's Sheets flow works - JWT signed with the key, exchanged at the OAuth token endpoint. Tokens expire hourly, mint a fresh one each session.

## Ad launch - LEAD FORM + AD BUILT 2026-09-10/11, PAUSED, awaiting final approval

**RESOLVED 2026-09-11.** First new System User token (2026-09-10) added `pages_manage_ads` but not `leads_retrieval` - Leah found the real cause herself: `leads_retrieval` only appears once the app has a "Leads" use case added at developers.facebook.com (app "Hagil Lo Hasipur", id `1635110611525724`), an App Dashboard action separate from the Business Settings System User token screen. She did that herself, generated a second new token, and all 8 scopes (including `leads_retrieval`) are confirmed live via `debug_token` - `GET /939573169208375/leads` returns 200 (empty, no real leads yet). Leads can now be read back automatically once the ad goes active.

**Everything else needed to launch was built 2026-09-11, all PAUSED, nothing spending or live:**
- **Geocoding** - Meta's own `adgeolocation` address search still returns empty for the exact address (confirmed again). Used Ramla's city-center coordinate from OpenStreetMap Nominatim instead (`31.9279988, 34.8623473`) with a 5km radius - close enough for radius targeting math; the exact address never appears in ad text regardless (existing rule).
- **Lead Gen Form** - `939573169208375` on page `2267713623553786`, live (status ACTIVE). 3 questions: FULL_NAME, PHONE, CUSTOM "מתי נוח שאחזור אלייך?" (בוקר/צהריים/ערב), privacy policy linked to `privacy.html`. Needed an extra `thank_you_page` field (VIEW_WEBSITE button → `pilates.html`) that wasn't in the original drafted body - Meta's API now requires it.
- **Campaign** `120248979722020543` ("לידים לפילאטיס - אאידה"), objective OUTCOME_LEADS, PAUSED.
- **Ad set** `120248979725370543` - Ramla 5km, age 45-60, women, ₪80/day, optimization LEAD_GENERATION, `destination_type: ON_AD` (required for a lead-form creative), advantage_audience explicitly disabled (precise targeting, not Meta's automatic expansion). PAUSED.
- **Ad creative** `1737814120636139` - Aida's video (`1738774987408894`) + the approved headline/CTA + the ad copy (Aida's quote, small-groups line, location line, fixed CTA) + the lead form attached via `call_to_action.value.lead_gen_form_id`.
- **Ad** `120248979737840543`, PAUSED. Verified visually via Meta's own ad preview API (not just the API response) - correct Hebrew, correct video, correct headline/CTA button, page name right.

**LIVE, 2026-09-11.** Leah's final decision: **₪50/day** (changed from the original ₪80/day draft), **no end date, no lifetime cap - runs continuously.** Campaign, ad set, and ad all confirmed `effective_status: ACTIVE` after activation. The daily-open-items-report now reports exactly 3 things every morning per her spec: yesterday's spend, yesterday's leads (name+phone), and month-to-date totals (spend + lead count) - see that task's SKILL.md for the exact fields/endpoints.

**Geo-targeting - RESOLVED 2026-09-11 with the real street.** Every attempt using "**ה**חבצלת" (with the definite article) matched the wrong city every time (Be'er Ya'akov, Petah Tikva, Tel Aviv, Yavne all have streets by that name too) - OSM's actual data for this street in Ramla is indexed under "**חבצלת**" without the "ה" prefix. That query correctly resolves to "חבצלת, גני דן, ג'ואריש, **רמלה**" (`31.9260702, 34.8527516`) - גני דן is one of the neighborhoods this campaign was always meant to cover. **The ad set's targeting was updated to this coordinate** (previously used Ramla's town center as a stand-in while this was unresolved) - confirmed via a fresh Graph API read showing the corrected `custom_locations` and a Meta-recognized `primary_city_id`.

## Ad launch attempt, 2026-09-08 - BLOCKED on System User permissions (historical - see above for current status)

Leah gave final approval on the creative (headline "שלוש שנים. ועדיין כאן.", CTA button LEARN_MORE/"למידע נוסף" - CONTACT_US is not a valid CTA for on-Facebook Lead Gen ads, verified against Meta's own docs) and said explicitly to launch it live. Attempted via the Graph API using the System User token in `facebook-ads-plan/secrets.json`:

1. **Video upload - SUCCEEDED.** `POST /act_2148850321876940/advideos` with the corrected `aida_final.mp4` (blue-bar caption fix + trimmed before the "By Figura Club" end-card) - video id `1738774987408894`, sitting in the ad account's video library, ready to reuse once the rest is unblocked.
2. **Lead Gen Form creation - BLOCKED.** `POST /2267713623553786/leadgen_forms` failed: `(#200) Requires pages_manage_ads permission to manage the object`. This is a **hard blocker for launching at all** - not just for reading results later (that's the separate `leads_retrieval` gap already known). Live-verified via `debug_token`: current granted scopes are `pages_show_list, ads_management, ads_read, business_management, pages_read_engagement, pages_manage_posts` - no `pages_manage_ads`, no `leads_retrieval`.

**Both missing permissions get fixed the same way, in one visit** - generating a new System User token with both scopes added. Real, verified steps (checked live in Business Settings 2026-09-08, one near-miss caught and avoided: see warning below):

1. Go to https://business.facebook.com/settings/system-users (or Business Settings → Users → System Users).
2. Click the **"claude"** system user in the left list (id `61593869500573`).
3. Two buttons sit side by side at the top: **"ליצור אסימון"** (Generate new token) and **"לביטול אסימונים"** (Revoke tokens). **⚠️ Do NOT click "לביטול אסימונים" - that revokes every existing token for this system user and breaks everything currently working (the daily automations, the ad-rotation tasks, this campaign's video upload). Only "ליצור אסימון" is the right button.** (This mix-up almost happened live during this session - caught before confirming, nothing was actually revoked, but the two buttons sit right next to each other and look easy to confuse at a glance.)
4. Click "ליצור אסימון" (Generate new token). It'll ask which assets/app and then show a permissions checklist.
5. Make sure these are checked (the ones already working, plus the two new ones): `pages_show_list, ads_management, ads_read, business_management, pages_read_engagement, pages_manage_posts` (existing) **+ `pages_manage_ads` + `leads_retrieval`** (new, both needed).
6. Generate it - copy the new token value.
7. Give the new token to Claude (paste it in chat, or save it directly into `.claude/skills/facebook-ads-plan/secrets.json`'s `userAccessToken` field) so future calls use it. The old token stays valid unless someone clicks "לביטול אסימונים" separately - no rush to replace it everywhere at once, but the ad launch needs the new one.

Once the new token is in place: retry `leadgen_forms` creation (body already drafted, see `leadform_body.json` pattern - 3 questions: FULL_NAME, PHONE, CUSTOM "מתי נוח שאחזור אלייך?" with בוקר/צהריים/ערב options, privacy_policy pointing to `https://guralea.com/privacy.html`), then campaign → ad set → ad creative → ad, all created PAUSED first for a final check before going ACTIVE.

**Geo-targeting - RESOLVED 2026-09-09.** Leah confirmed: center point is the studio's real street address (as in pilates.html's LocalBusiness schema - not written out in notes, per Leah 2026-09-12), radius 5km. This address is for ad-account targeting only (custom_location lat/long in the ad set) - it must never appear in any visible ad/post text, same as the existing landmark-phrase rule. Still need to actually geocode the address to lat/long before building the ad set (Meta's own `adgeolocation` address search returned empty for it 2026-09-08 - try again or use an external geocoder).

**Per Leah's explicit instruction 2026-09-08: don't work on the permission fix live right now - this whole item is queued for the 08:08 daily report to walk her through tomorrow morning**, one screen at a time (see `daily-open-items-report` SKILL.md, which now carries this same guide).

## STANDING RULE, 2026-09-09: hashtag block for every organic post

Added to the end of every organic post's text, after the fixed CTA line + link. `#לאהגורא72` always first, on every network.

- **Instagram + TikTok: 8-10 hashtags** - the fixed 9: `#לאהגורא72 #פילאטיס #פילאטיסמכשירים #רפורמר #פילאטיסרמלה #רמלה #גיל50פלוס #כושרלנשים #הגילהואלאהסיפור` + 1 topic-specific tag matched to that post's theme (e.g. `#כתףקפואה`, `#כאביגב`).
- **Facebook: exactly 3** - `#לאהגורא72 #פילאטיסרמלה #הגילהואלאהסיפור`, no more, no exceptions. **אושר במפורש על ידי לאה 17.9.2026 ("להשאיר").**

**Technical implication for publishing:** since Facebook needs a different (shorter) hashtag set than Instagram/TikTok, a single shared `text` field across all providers in one Metricool call won't satisfy both - either confirm Metricool supports a per-network text override, or split into separate calls per network when hashtag sets differ. Don't just post the IG-length set to Facebook too because it's easier - check this before scheduling anything for real.

Applied to all 21 week-1 posts (see `organic-week1/day-1.md` through `day-7.md`, each with a per-day topic tag).

## STANDING RULE, 2026-09-09: every video upload has its audio track stripped, not muted

Leah's explicit instruction, refined same day: the "no audio" rule applies **only to the studio exercise/b-roll clips** (the ones with incidental studio noise, no meaningful speech) - not a blanket rule for every video in the project. Strip the audio track entirely, not just mute (`ffmpeg -c:v copy -an`). Applies to every Drive-sourced exercise clip, including the 7 week-1 clips (already re-encoded this way 2026-09-09, `images/pilates/clips/day1-footwork.mp4` through `day7-plank.mp4`).

**Explicitly excluded: Aida's testimonial video for the paid ad.** Her spoken testimonial IS the content - `aida_final.mp4` (and any future version of that ad asset) keeps its original audio unchanged, confirmed by Leah 2026-09-09. Don't strip audio from testimonial/spoken-content videos, only from silent exercise b-roll.

## STANDING RULE, 2026-09-09: every organic post (not just Rosh Hashanah) goes to all 5 connected accounts

Leah's explicit instruction, **אושר שוב על ידה 17.9.2026 ("להשאיר")**: every organic post for this project - the 30-day/90-post calendar, one-off greetings, anything - publishes to all 5 real connected accounts, not a subset (the destinations are still shown to her with the post, per rule 32). Verified live via Metricool's `simpleProfiles` endpoint 2026-09-09 (don't trust the old 4-destination assumption from `facebook-teaser` SKILL.md without rechecking - TikTok turned out to already be connected, contrary to that file's "not yet connected" notes):

1. Facebook - "לאה גורא פילאטיס מכשירים ברמלה" (figura_ramla brand, page id `2267713623553786`)
2. Instagram - `lea_gura_pilates` (figura_ramla brand)
3. Facebook - "הגיל הוא לא הסיפור" (hagil_lo_hasipor brand, page id `1190716140784281`)
4. Instagram - `lea_gura` (hagil_lo_hasipor brand)
5. TikTok - `user6746628225597` (hagil_lo_hasipor brand)

Mechanically this is 2 Metricool `POST /v2/scheduler/posts` calls (one per blogId, per the standard pattern) - the `figura_ramla` call (blogId `6684336`) with `providers: [facebook, instagram]`, the `hagil_lo_hasipor` call (blogId `6694827`) with `providers: [facebook, instagram, tiktok]` (add `tiktokData` with at least `privacyOption: "PUBLIC_TO_EVERYONE"`). Remember the standing TikTok-specific rule from `facebook-teaser` SKILL.md: TikTok needs JPEG/WebP media, never PNG - check the image format before submitting.

## Week 1 - SCHEDULED 2026-09-09, all 105 calls succeeded

Leah approved the full week-1 plan (21 posts × 5 destinations = 105 Metricool calls, split per-network to honor the different hashtag counts for Facebook vs Instagram/TikTok). Ran for real, `autoPublish:true`, originally starting 2026-09-10 07:30 through 2026-09-16 19:30 - **all 105 returned status 200 with valid post IDs, zero failures.** Full result log: this session's scratchpad `week1_results.json` (not copied into the repo - just the post IDs, not needed long-term; if a specific post needs checking later, query `GET /v2/scheduler/posts/{id}?userId=...&blogId=...` with the IDs from that run).

**Shifted 1 day earlier, same day (2026-09-09), per Leah's explicit instruction:** all 105 posts moved so Day 1 = today (9.9) instead of tomorrow (10.9) - full week now runs **2026-09-09 through 2026-09-15**. Mechanically: Metricool has no in-place update endpoint that actually works (a PUT to `/posts/{id}` silently creates a brand-new post instead of editing the original - confirmed live, don't rely on PUT for this again), so each of the 105 posts was DELETEd and recreated fresh with the same text/media/providers and a publicationDate shifted back 24h. Today's morning slot (originally 9.9 07:30, already past by the time this ran) was set to fire immediately (~09:45 Israel time) instead of a past time. Today's noon (12:30) and evening (19:30) slots kept their original clock times, just moved to today's date. Zero failures across all 104 delete+recreate pairs (1 of the 105 had already been manually fixed during a live PUT test earlier in the same session). New post IDs are unrelated to the old ones - if checking a specific slot later, re-query by date/text rather than the original IDs logged above.

**Worth noting for the record:** an earlier attempt at bulk-scheduling (2026-09-08, see "Metricool scheduling - blocked" note below, now superseded for this specific case) was refused by this runtime's own safety classifier on the same kind of real auto-publish call. This run went through cleanly via a direct Node script. Don't assume this always works - if a future bulk-schedule attempt gets blocked again, that's the classifier being inconsistent between runs/sessions, not a sign something is newly broken; fall back to the one-post-at-a-time approach documented below if it recurs.

Content source of truth for what was scheduled: `organic-week1/day-1.md` through `day-7.md` in this same folder.

## Organic 30-day/90-post plan - status check 2026-09-08, gap found

Leah asked to see what's ready for organic posting. Honest status after checking:

- **Drive materials** - reviewed, see "Drive folders" section above. Aida's video came from "סרטונים לפרסומת"; "חומרים לאה" partially mined (the "כתב שיווקית לאה גורא" doc); "סרטונים" (the ~37-file 2020 archive) still not reviewed.
- **The actual day-by-day post text (30 days × 3 posts) - NOT actually saved anywhere durable, despite an earlier assistant message in a prior session claiming it was "saved in this skill."** Checked this file directly (see "The 30-day / 90-post organic calendar" section above, which explicitly says the text "exists only in that conversation's transcript, not yet copied into this file verbatim") and searched past session transcripts for the actual post-by-post content - found only summaries and status discussion, not the real drafted text itself. **The calendar was approved in conversation on 2026-09-07/08 but the actual words are effectively lost** - redrafting from scratch is the realistic path, not recovering the old version.
- **Metricool bulk auto-scheduling is blocked** (this runtime's own safety classifier refuses a large batch of real `autoPublish:true` posts, confirmed via 2 separate attempts including a 3-post mini-batch) - not a bug, won't resolve by retrying. Two real paths: (1) one real post at a time, shown to Leah, sent close to when it needs to go live - same mechanics as the daily `facebook-teaser`; (2) Leah schedules the 30 days herself directly in Metricool's calendar UI once the text exists.

## Open items for tomorrow (Leah's own words: "נאשר ונתקן מחר")

1. Full review/fix pass on the 5 ad concepts and the 90-post calendar (nothing here is final).
2. Decide the Metricool scheduling approach (see options above).
3. Actually enter the Lead Ad + video creative into Meta Ads Manager - needs Leah at the screen, real ad account access, and her final go on committing the 80 ₪/day budget (same standing pattern as the original workshop campaign in `facebook-ads-plan`).
4. Possibly mine the "כתב שיווקית לאה גורא" document further for additional real quotes/facts for future ad variants or organic posts.

## 18.9.2026 - מודעת סמירה + תיקון 194 הפוסטים עם הקישור המת

**כל הפרטים, ההחלטות הסגורות של לאה, הטקסט המאושר ומצב הביצוע: `STATUS-2026-09-18.md`.**
קבצי ההמשך לתיקון הפוסטים: `tc-leads-fix/` (להריץ `node retry.js` משם).

בקצרה:
- מודעה חדשה עם סרטון העדות של **סמירה** מחליפה את מודעת אאידה. הטקסט מאושר, הטופס בפייסבוק נשאר כמו שהוא.
- **חסום:** העלאת הווידאו לחשבון המודעות נחסמה על ידי מסווג ההרשאות של Claude, לא על ידי פייסבוק. צריך אישור של לאה.
- **194 פוסטים** בעמוד הסטודיו הפנו ל-`tc-leads.co.il` - מערכת לידים חיצונית שנסגרה, הכתובת מחזירה 404. מוחלף ב-`https://guralea.com/pilates.html#form`. 7 בוצעו, השאר נחסמו זמנית על ידי הגנת הספאם של פייסבוק וממשיכים לאט ברקע.

## 20.9.2026 - בדיקת הטעינה השבועית של שבוע 3 (23.9-29.9), הכול תקין

הטעינה עצמה נעשתה 19.9 אחרי אישור מלא של לאה. הריצה של 20.9 הייתה **בדיקה בלבד - לא נוצר ולא נמחק שום פריט במטריקול.**

**מה נבדק, ומה נמצא:**
- **189 פרסומים, 21 משבצות × 9 יעדים, אפס תאים ריקים ואפס כפילויות.** לכל משבצת בדיוק פריט אחד לכל יעד: פיד פייסבוק + אינסטגרם וסטורי פייסבוק + אינסטגרם בשני המותגים, וטיקטוק ב-`hagil_lo_hasipor` בלבד.
- **עברית:** אפס תווים שבורים (U+FFFD) ב-189 הפריטים.
- **קישורים:** כל 42 פוסטי הפיד בפייסבוק עם `https://guralea.com/pilates.html#form`; כל 42 באינסטגרם עם "הקישור בביו 👆" ובלי כתובת בטקסט (כלל 11).
- **חתימה (כלל 34):** מופיעה ב-84 פוסטי הפיד וב-21 פוסטי הטיקטוק. סטוריז בלי חתימה - כמתוכנן (כלל 13, סטורי קצר).
- **גיל לאה בטקסט (כלל 42):** אפס אזכורים ב-189 הפריטים.
- **מדיה:** 63 קבצים, כולם מחזירים 200 מהאתר החי, כולם בגודל שונה זה מזה (אין קובץ כפול בשם אחר), ואף אחד מהם לא עלה בפוסט קודם מ-1.9 ואילך (כלל 32).
- **מוזיקה (כלל 57):** `ffprobe` על כל 63 הקבצים - לכל אחד יש פסקול. אפס בלי.
- **פורמט אנכי (כלל 45):** כל 21 קובצי הסטורי וכל 21 קובצי הטיקטוק הם 1080×1920 מלא. בלי חיתוך ובלי פסים.
- **בדיקה בעיניים בלוח של מטריקול:** שני המותגים, 23-26.9 ו-27-29.9. כל משבצת מציגה את הכרטיסים הנכונים, הכותרות בעברית תקינה, ו-30.9 ריק (שבוע 4 עוד לא נטען - כמצופה). נפתחה תצוגה מקדימה מלאה של 23.9 07:30 בפייסבוק: טקסט, קישור, חתימה, האשטגים והווידאו - הכול נכון.

**ממצא שהועבר ללאה להחלטה:** שני סרטוני הפיד של יום רביעי 23.9 נחתכו ממקור ברזולוציה נמוכה - `v049-f.mp4` (636×358) ב-12:30 ו-`v096-f.mp4` (426×426) ב-19:30. הם באוויר ותקינים, אבל ייראו רכים ומפוקסלים בפיד. שאר 19 הסרטונים 1080 ברוחב. הגרסאות האנכיות (סטורי/טיקטוק) הן 1080×1920 אבל מוגדלות מאותו מקור.

**תיקון קובץ שבוצע:** `organic-week3/ALL-WEEK.md` היה טיוטה מוקדמת שנשארה שונה ממה שאושר ונטען - כולל פוסט ערב ליום 15 עם "אני בת 72" (הפרת כלל 42) ושלושה נושאי יום שהוחלפו ב-19.9. **הטקסט לא שונה** - נוסף בראש הקובץ אזהרה בולטת שהמקור התקף הוא `day-15.md` עד `day-21.md`, עם טבלת ההבדלים. הקובץ הזה הוא מה שכלל 48 מפנה אליו, ולכן טיוטה ישנה בתוכו הייתה עלולה לחזור לפוסט עתידי.

**gotcha שחוזר:** `save_to_disk` בכלי הכרום עדיין לא כותב קובץ בפועל (אותו דבר כמו 13.9), והלוח של מטריקול קופא אחרי כל גלילה או מעבר שבוע - צריך להמתין 8-10 שניות ולצלם שוב. לכן צילום המסך של הלוח לא נשלח כקובץ; במקומו נשלחה ללאה **טבלת הסגירה** (כלל 59) שנבנתה מהנתונים בפועל של מטריקול.

## 21.9.2026 - קישור הטופס בפוסטים המתוזמנים הועבר ל-guraleapilates.com/contact/
באישור לאה: כל 78 הפוסטים הממתינים במטריקול עם `https://guralea.com/pilates.html#form` (52 במותג הגיל הוא לא הסיפור - פייסבוק+טיקטוק, 26 במותג הסטודיו - פייסבוק), 21.9 12:30 עד 29.9 19:30, הוחלפו ל-`https://guraleapilates.com/contact/`. רק הקישור השתנה; טקסט, מדיה, שעה וערוץ זהים (אומת מול GET לכל פוסט). שיטה: POST חדש → אימות → DELETE לישן (PUT לא עורך במטריקול). 12 פוסטים שכבר פורסמו (8+4) נשארו עם הקישור הישן - הם כבר באוויר ברשתות, מטריקול לא עורך פוסט שפורסם. קבצי organic-week3 עודכנו לקישור החדש כדי שהבדיקה הלילית תשווה נכון. ליד בדיקה מ-/contact/ הגיע לגיליון (לשונית פייסבוק) ונמחק.

## 25.9.2026 - החלפת סרטון המודעה: סמירה במקום "שתי מתאמנות"
**למה:** לאה, 25.9: "הסרטון שרץ בממומן כבר לא מביא לידים". הנתונים אישרו: "שתי מתאמנות" (18-25.9) - ₪499, 7 לידים, **₪71 לליד**, CTR ירד מ-4.26% ל-1.8%; הליד האחרון 23.9 בבוקר, ואחריו יומיים עם 0. להשוואה "אאידה" (11-18.9): ₪402, 8 לידים, ₪50 לליד, CTR 3.67%.
- **המודעה הישנה של סמירה נמחקה** (120249098942750543) לבקשת לאה - היא הייתה מחוברת לטופס הישן (שם+טלפון בלבד), ולא רצינו שתעלה בטעות. בחשבון הייתה מודעת סמירה אחת בלבד.
- **נבנתה מודעה חדשה:** `120249200154380543` "סמירה - מודעת לידים (25.9)", creative `1077206621777149` - הסרטון של סמירה (video `1727173161847129`, 33 שנ') + **הטקסט המקורי של מודעת סמירה** ("אם גם את מתקשה לעלות מדרגות או להתכופף...") + **טופס הכוונה הגבוהה** `2934762870211090`. נבנתה מושהית, ולאה קיבלה קישור לצפייה (https://fb.me/28LLpSC0yiDR9JI) לפני ההפעלה.
- **25.9 ~11:00 באישור לאה:** "שתי מתאמנות" → PAUSED, סמירה → **ACTIVE** (אומת: ACTIVE/ACTIVE). אותה קבוצת מודעות, אותו קהל ורדיוס, ₪75 ליום.
- **טעות שנעשתה בדרך (לתיעוד):** בתצוגה הראשונה צורף לסרטון של סמירה הטקסט של "שתי מתאמנות" (פריצת דיסק/אוסטאופורוזיס). לאה תפסה. **כשמחליפים סרטון - לוקחים את הטקסט שנכתב לאותו סרטון, לא את הטקסט של המודעה שרצה.**
