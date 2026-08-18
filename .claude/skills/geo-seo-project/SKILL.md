---
name: geo-seo-project
description: The GEO/SEO project for guralea.com - making Google and AI models (ChatGPT, Gemini, Perplexity) recognize, cite, and recommend Leah Gura, her Pilates-equipment studio in Ramla ("סטודיו לאה גורא - פילאטיס מכשירים ברמלה" - NOT "Figura", that name was wrong), and the "הגיל הוא לא הסיפור" workshop. Started 2026-08-17. Use whenever asked about SEO, GEO, AI-search visibility, schema.org/structured data, the FAQ page, or the status of this project.
---

# GEO/SEO project for guralea.com

## Origin and workflow

Leah sent the full 4-part spec verbatim in chat on 2026-08-17 (repo: guralea-cmd/Hagil-lo-hasipor, GitHub Pages + Firebase backend). Original approval workflow was "show me after each part, get approval before commit" - she then changed this mid-part-1 to: **keep working through all 4 parts without stopping for approval, document progress here, and hold everything uncommitted until she reviews the whole thing at once and gives one final go-ahead to push it all together.** Do not commit or push any of this project's changes until she gives that explicit final approval - this overrides the normal "commit right after approval" pattern used by the daily content skills.

If a new session picks this up: check the task list / this file's "Status" section below before assuming a part is unstarted.

## The full spec (verbatim from Leah, 2026-08-17)

### חלק 1: דף FAQ חדש - faq.html
1. דף `faq.html` באותו עיצוב, תפריט ופוטר כמו שאר האתר (RTL, עברית).
2. נוסף לתפריט הניווט בכל הדפים תחת "שאלות ותשובות" (אחרי "כלים ותובנות").
3. מבנה: H1, ואז כל שאלה כ-H2 עם תשובה של 2-4 משפטים, ישירה, בגוף ראשון, בקול של לאה. כל תשובה עם לפחות עובדה קונקרטית אחת.
4. לא להמציא עובדות - `[לאה: להשלים]` איפה שחסר נתון.
5. 14 שאלות ספציפיות (ראה faq.html לרשימה המלאה שבוצעה).
6. `<title>` + `<meta name="description">` ייחודיים.

### חלק 2: Schema.org (JSON-LD) בכל האתר
- **כל הדפים**: `Person` (לאה גורא / Lea Gura, jobTitle, url, sameAs).
- **כל הדפים**: `LocalBusiness` (HealthClub/SportsActivityLocation) - סטודיו לאה גורא - פילאטיס מכשירים ברמלה, טלפון/כתובת `[לאה: להשלים]`.
- **workshop.html**: `Event` x2 (זום 2026-10-08 18:00-19:30, פרונטלי רמלה 2026-10-09 10:30-12:00), ללא מחיר.
- **faq.html**: `FAQPage` מופק אוטומטית מה-HTML.
- **כל מאמר בלוג**: `Article` (headline, author, datePublished, publisher).
- לוודא JSON תקין (JSON.parse לפחות).

### חלק 3: מבנה מאמרי "כלים ותובנות"
1. כותרת מאמר = שאלה שמישהי הייתה מקלידה בגוגל/AI.
2. פסקה ראשונה עונה ישירות ב-2-3 משפטים (זו הפסקה שמודלים מצטטים).
3. H2 לכל תת-נושא, מנוסחים כשאלות היכן שאפשר.
4. פסקת "בקצרה" בסוף - 3 משפטים מסכמים.
5. שורת מחבר בכל מאמר: "לאה גורא, בת 72, מאמנת כושר ומדריכת פילאטיס מכשירים ברמלה" + קישור ל"קצת עליי".
6. `<title>` + `<meta description>` ייחודיים לכל מאמר + Article schema.
7. עדכון ה-prompt של `weekly-blog-article-draft` כך שכל טיוטה עתידית תיבנה לפי המבנה הזה.

### כללים כלליים (לכל 3 החלקים)
- שם עקבי: "לאה גורא" (עברית), "Lea Gura" (אנגלית) - לא איותים אחרים.
- לא לשנות עיצוב קיים מעבר להוספת FAQ + פריט תפריט.
- ליצור/לעדכן `sitemap.xml` (כולל faq.html וכל המאמרים) ו-`robots.txt` שמפנה אליו.
- רשימת כל ה-`[לאה: להשלים]` שנשארו, בסוף.

### חלק 4: עדכון מערכת הפוסטים היומיים לפייסבוק (אחרי שחלקים 1-3 הושלמו)
כלל קבוע חדש לפרומפט: כל פוסט מסתיים בקריאה לפעולה קצרה + קישור ל-guralea.com בשורה נפרדת לפני ההאשטגים - מאמר→המאמר עצמו, נושא סדנה→workshop.html, סיפור אישי/קהילה→register.html, שאלה כללית→faq.html. להציג פוסט לדוגמה אחד לפני שמירה.

## Real facts confirmed and used (not invented)

Pulled from existing site content (about.html, workshop.html, contact.html) plus facts Leah stated directly in this task's own text:
- Leah: 72, open-heart surgery + stroke + half-body paralysis at 45, "מיס פיטנס ישראל לנשים 60+", 30 years caregiving her wheelchair-bound husband, surfs/calisthenics/skateboards past 70 (skateboard fact given directly by Leah in this task's spec).
- **Studio name - corrected a second time, 2026-08-17 (this is the real name, don't revert):** Leah's first message typed "פיגורה", she then "corrected" it to "פיגורא" - but that was ALSO wrong. "פיגורא"/"פיגורה" was never the real business name; it was an internal shorthand Claude had used in `facebook-teaser`'s posted-log for the second Facebook page's Metricool nickname ("figura_ramla"). Leah clarified directly: she runs **"סטודיו לאה גורא - פילאטיס מכשירים ברמלה"** - that's the real name, used in `LocalBusiness.name` and in prose wherever the full name is needed (first-person prose mostly just says "הסטודיו שלי" instead of restating the name). All ~39 occurrences of "פיגורא" across HTML/schema were fixed to the real name in this pass. Located in Ramla. Exact street address/zip: unknown, `[לאה: להשלים]`. No phone number found anywhere on the current site.
- **faq.html content revised twice more by Leah 2026-08-17 after first draft:** (1) trimmed repetitive "מה זה X?" phrasing (3 questions reworded: physiological age, workshop description, community/story-sharing question) since she felt it read as cheap/repetitive; (2) general "less בלה בלה" pass - cut filler words and redundant clauses from every answer, kept only concrete facts; (3) "מי זו" → "מי זאת" (both grammatically valid in modern Hebrew per an Academy of the Hebrew Language source, but she preferred זאת); (4) the Zoom/in-person question's answer text is now Leah's own dictated wording verbatim, don't rephrase it; (5) the price question's answer now uses Leah's own dictated phrasing verbatim too ("אני מעדיפה להכיר קודם את מי שנרשמת...").
- Workshop: 7 sessions x 90 min over 7 weeks, up to 15 participants, women-only (currently), physiological-age testing at start, weekly WhatsApp support, session recordings, graduate community after. Zoom track Thu 2026-10-08 18:00-19:30; in-person track (studio, Ramla) Fri 2026-10-09 10:30-12:00. Price disclosed by phone only at registration - never state a number publicly.
- Facebook page (main): https://www.facebook.com/1190716140784281. Second FB page "לאה גורא פילאטיס מכשירים ברמלה" (id 2027590501521835) and Instagram handles lea_gura / lea_gura_pilates exist per `facebook-teaser` skill's posted-log (used for Metricool cross-posting) but are **not linked anywhere on the public site itself** - used as sameAs candidates for schema since they're real, but flag to Leah that they're not otherwise site-visible. No TikTok/YouTube found anywhere - `[לאה: להשלים]` if those exist.

## Gender-inclusive addressing on this project's new pages

Per the 2026-08-17 scope rule added to `leah-voice` (see that skill): feminine-singular "את" address is workshop-only. faq.html answers use "את" only within workshop-specific Q&As (where it's factually accurate - the workshop is women-only); the rest use neutral/impersonal phrasing.

## Decisions made without stopping to ask (flag these to Leah at final review)

1. **Did not rewrite the 28 existing blog posts' headlines/intros/H2s into full question-format.** Retrofitting real structural rewrite (new headline, new direct-answer intro, question-form H2s, "בקצרה" summary) across 28 already-approved, published posts risked drifting from her exact approved wording without her line-by-line review - too risky to do unattended. Instead, existing posts got only additive, low-risk changes: author byline line, a unique `<meta description>` (extracted verbatim from each post's own real opening sentence(s), not invented), and `Article` JSON-LD. The full new structure (question-headline, direct-answer opener, "בקצרה" close) is wired into the `weekly-blog-article-draft` scheduled task's prompt for **future** posts only. **Ask Leah:** does she want the 28 existing posts fully retrofitted too, as a separate follow-up pass?
2. ~~Studio name spelling~~ - **fixed**: Leah's original task text had typed "פיגורה"; she corrected it to "פיגורא" on 2026-08-17 and every occurrence across the site/schema/this file was updated in one pass (52 replacements across 39 pages + this file).
3. **Instagram/second-Facebook-page sameAs links** used real handles (lea_gura, lea_gura_pilates, figura_ramla FB page) pulled from `facebook-teaser`'s posted-log/secrets rather than the public site (they're not linked anywhere in the site's own HTML) - flag that these are real accounts, just not otherwise site-visible.
4. **"General question → faq.html" CTA-link mapping** (part 4) was documented as a new *option*, not added as a 5th rotation type in the daily Facebook teaser rotation - didn't want to unilaterally expand the content-type rotation. Ask Leah if she wants that.
5. Admin pages (`admin/*.html`) and `archive/*.html` were left untouched throughout (no nav item, no schema, no cache-bust bump) - treated as non-public/internal, added `Disallow: /admin/` to `robots.txt`.

## Final `[לאה: להשלים]` list (everything still needed from her)

- Phone number for the `LocalBusiness` schema (`telephone` field currently omitted entirely, not filled with a placeholder, so it doesn't pollute structured data with fake text).
- TikTok/YouTube links, if they exist, to add to `sameAs`.

**Filled in by Leah 2026-08-17:** street address is רחוב החבצלת 8, רמלה - added to `LocalBusiness.address.streetAddress` on all 39 pages, `workshop.html`'s in-person Event location, and faq.html's "where's the studio" answer (both visible text and FAQPage JSON-LD).

## Example Facebook post under the new CTA-link rule (Part 4, for Leah's review - not drafted as a live rotation pick, skill is still paused)

**Content type:** כלים ותובנות (illustrative only - reuses blog-post-17, which was already teased on 2026-08-09; a real future pick would use an untaught post)

כותרת: את לא צריכה לחכות למישהי שתעורר אותך

הרבה נשים מחכות לרגע ההשראה - סרטון, סיפור, מישהי אחרת שתראה להן שאפשר.
אבל יש עוד משהו שקורה בלי ששמת לב: מישהי כבר מסתכלת עלייך, ולומדת ממך מה אפשרי בגיל שלך.

לכתבה המלאה לחצו על הלינק👇
https://guralea.com/blog-post-17.html

#הגיל_הוא_לא_הסיפור #לאה_גורא_72 #חוסן_מנטלי #כוח_נשי

*(Note: reused stories.html's existing fixed lead-in phrase "לכתבה המלאה לחצו על הלינק👇" for the blog-post link too, since no fixed lead-in phrase for כלים ותובנות links was ever confirmed with Leah - ask her if that's fine or if she wants a distinct phrase for blog-post links specifically.)*

## Status (update as work progresses)

- [x] Part 1 - faq.html created (14 Q&As), nav item added to all 38 public HTML pages.
- [x] Part 2 - Schema.org JSON-LD (Person + LocalBusiness on 39 pages, Event on workshop.html, FAQPage auto-generated on faq.html, Article on 28 blog posts). All 108 JSON-LD blocks validated with JSON.parse, zero errors.
- [x] Part 3 - 28 existing posts got byline + meta description + Article schema (additive only, see decision #1 above); `weekly-blog-article-draft` scheduled task prompt rewritten for future posts' full GEO structure.
- [x] sitemap.xml + robots.txt created (39 URLs + admin Disallow).
- [x] Part 4 - facebook-teaser CTA-link rule documented, one example post drafted above.
- [x] Final `[לאה: להשלים]` list compiled (above).
- [x] Leah's final review/approval → committed and pushed 2026-08-17 (commit e4e9622, plus a follow-up FAQ-heading-size fix in 58a36fe). Live on the site.

Everything in this project is live. This status section was left stale after the push - don't read the older draft above as still-pending.
