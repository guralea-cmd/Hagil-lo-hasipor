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

## Workflow

1. Research real candidates (web search across the sources above), verify each link actually loads and is genuinely about that person before including them.
2. Add new verified rows to the existing `database.xlsx` (don't overwrite/lose previously added rows).
3. Send/share the updated file with Leah and report how many new verified rows were added this round, plus a short note of what was searched but came up empty (so gaps are visible, not silently dropped).
4. Continue expanding in future sessions on request - this is a standing, incrementally-growing asset, not a single deliverable.
