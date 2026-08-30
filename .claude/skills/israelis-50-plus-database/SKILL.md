---
name: israelis-50-plus-database
description: Ongoing research project - an Excel database of real, named Israelis who made a significant change after age 50, with a verified working source link per row. Started 2026-08-29, sports-only for now. Use whenever asked about this database, "אנשים שעשו שינוי", or to expand/continue it.
---

# Israelis 50+ who made a change - research database

## Status: started 2026-08-29, first batch in progress

Leah asked (2026-08-29) for an ongoing Excel database of real Israelis who made a significant life change after age 50. This is a standing, expandable project - not a one-off - so each future session should pick up where the last one left off, not start over.

## Scope

**Current instruction (2026-08-29): sports only.** She narrowed the brief to sports-only mid-request ("כרגע אני רוצה רק מענף הספורט") - the secondary categories below are written down for later but must NOT be included in entries until she explicitly reopens them.

**Sports (current, active scope):** all disciplines - running/marathon, surfing, rowing, swimming, triathlon/Ironman, cycling, walking, tennis, judo, veterans' soccer, and any other sport. Explicitly include Paralympic athletes and para-athletes - people who started a sport after an injury, illness, or disability, especially starting at 50+.

**Secondary categories (PAUSED, do not add until Leah reopens this):** career change, education, entrepreneurship, art, volunteering - all specifically as a change made at age 50+.

## Sources to search

Hebrew news: ynet, מעריב, הארץ, mako, וואלה, גלובס, כלכליסט, ישראל היום. Also: Israeli running/sports sites, Israeli podcasts, the Israeli Paralympic Committee site, איל"ן, בית הלוחם. Also public Facebook content (veteran/masters running groups, masters-athlete pages, race/marathon organizer pages, sports federation pages, inspiration-story posts) - only when a real, specific, working post/article URL can be found, never a group homepage as a substitute.

## Hard rule - no exceptions

Every row must have a real, currently-working, verified URL to the actual article/post about that specific person. Never fabricate a person or guess/invent a URL. A row without a working link does not go in the table at all - this was Leah's explicit instruction, stated as a hard requirement, not a preference.

## Table structure

Columns, in this exact order: שם | גיל בזמן השינוי | מה היה לפני | מה השינוי | ענף/תחום | לינק למקור

## File location

`.claude/skills/israelis-50-plus-database/database.xlsx` (tracked in the repo so it persists and is easy to find/expand in future sessions). This is an internal research/working file, not site content - never link it from any public page without Leah asking for that separately.

## Batch 1 - done 2026-08-29/30, 8 verified rows in `database.xlsx`

Sports-only (per scope narrowed same night): טובה קידר רודר (טריאתלון), אדוארדו ריין (טריאתלון/איש ברזל), אסף סטולרו (טריאתלון/איש ברזל), אילן ברוש (ריצה/אולטרה-מרתון), ד"ר עמי שינפלד (ריצה), אליאס פרלמוטר (רכיבת אופני שטח, גם פרא-ספורטיבי - מחלת ריאות), זהר שטראוס (הליכה/ריצה יומית), פולינה כצמן (הרמת כוח פראלימפית - קטועת רגל). Each row's link was fetched and confirmed to actually be about that person before inclusion.

**Searches that came up empty this round (checked, nothing verifiable found - don't re-run these exact angles without a new source idea):** surfing started after 50; rowing/kayaking started after 50 (Paralympic rowers found all started well before 50); judo achieved/started after 50; veterans' soccer with a named 55-60+ player and a working personal-interview link; tennis discovered after 50; open-water/Kinneret swimming started after 50 (named veterans found all started young); race-walking (only Shaul Ladany, started young); cycling across countries at 60+; mountain climbing (Everest/7summits) at 50+ (Ran Kraus found but age unconfirmable, excluded); cancer-survivor runners who specifically started after 50; "Ironman after heart attack at 50" anecdote (source person never actually named, excluded as unverifiable).

**Good next leads for batch 2, not yet crawled:** Hebrew Facebook posts from specific marathon/triathlon club pages (Tel Aviv Marathon, Ironman Israel) directly; the Israeli Paralympic Committee's own athlete-profile pages (not just news coverage of them).

## Batch 2 - done 2026-08-30, 5 more verified rows added (13 total in `database.xlsx`)

New this round: שמעון סימקין (ריצה ותיקים, אליפות עולם 85+ בגיל 89), טטיאנה אברמסון (טיפוס הרים - הימלאיה בגיל 55), דן הרטנו (קראטה - חגורה שחורה בגיל 72 עם קוצב לב), פסקל ברקוביץ (קיאקים פראלימפי - עברה ענף בגיל 55 לקראת פריז 2024), נעמי רונן (התעמלות/כושר - שיא גינס בגיל 91-92, גיל התחלה לא מאומת במקור אז מסומן ככזה בעמודת הגיל עצמה).

Checked and explicitly excluded this round (real names, didn't fit): רן קראוס (age unconfirmable, already excluded batch 1), איתן רם (רכיבת אופניים - קריירה ספורטיבית רציפה כל חייו, אין "לפני/אחרי" ברור בגיל 50), יצחק חייק (כדורגל - משחק ברציפות מגיל 15, לא ביצע שינוי בגיל 50), אורי ברגמן (ספיבק - נולד עם פוליו, התחרה מגיל צעיר).

**Searches that came up empty in batch 2:** isad.org.il (Israeli Paralympic Committee) doesn't expose searchable athlete profile pages; Facebook posts on specific marathon/triathlon club pages (Tel Aviv Marathon, Tiberias Marathon) - only found general event/home pages, no specific veteran-participant posts; competitive masters swimming started at 50 with a named Israeli; judo/karate at 50+ (besides Dan Hartnoy in karate); long-distance cycling started at 60+; veteran soccer/volleyball with a named 55-60+ player who started/returned at 50+; powerlifting with a named Israeli who started at 50+; Paralympic archery/boccia with an athlete who started after 50.

**Good next leads for batch 3:** masters swimming federation results/records pages (may list age + a notable "started late" bio); Israeli powerlifting federation competition results for 50+ categories; direct outreach angle (not searchable) - Ofer Aderet (Haaretz journalist who covered Naomi Ronen) may know her exact starting age if a batch 3 session wants to try contacting the reporter's other published pieces for a follow-up mention.

## Workflow

1. Research real candidates (web search across the sources above), verify each link actually loads and is genuinely about that person before including them.
2. Add new verified rows to the existing `database.xlsx` (don't overwrite/lose previously added rows).
3. Send/share the updated file with Leah and report how many new verified rows were added this round, plus a short note of what was searched but came up empty (so gaps are visible, not silently dropped).
4. Continue expanding in future sessions on request - this is a standing, incrementally-growing asset, not a single deliverable.
