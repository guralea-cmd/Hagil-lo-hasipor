---
name: marquee-daily-content
description: Updates the scrolling marquee-strip on the homepage (index.html) with one new short line + link each day, drawn from site content (community stories, blog, workshop, or community signup) in Leah's authentic voice, and holds it for her explicit approval before publishing to the live site. Use whenever asked to prepare, draft, pick, or update the daily marquee/פס נע content, or when running the daily marquee routine.
---

# Daily marquee-strip content

## What this produces

**Exactly one** short line for today, replacing the rotating message + link spans in the homepage banner strip (`index.html`, `.marquee-strip__track`). This mirrors the `facebook-teaser` skill's rotation logic and approval gate, but for the homepage banner instead of a Facebook post - no image, no hashtags, just a single short line of text plus a link, since it has to fit on one line next to the tagline.

**Confirmed 2026-08-09: this is now a static bar, not a scrolling ticker.** Leah called horizontally-scrolling marquee text a dated ("30 years old") web pattern, so the strip was rewritten to a static flex row (tagline • message • link, separated by a dot), no animation, no duplicated spans. Don't reintroduce scrolling/animation/duplicate spans if asked to touch this again - three plain `<span>`s, once each.

The strip has exactly three spans:
1. The fixed site tagline - **never change this one**: `הגיל הוא לא הסיפור - הסיפור הוא מה עושים איתו`
2. A rotating message line - this is what changes daily
3. A link span (visible link text + href) - this also changes daily, paired with the message

Each day, spans 2 and 3 get replaced with that day's content. Span 1 (the tagline) stays exactly as-is, always.

## Content rotation and no-repeat rule

Read `.claude/skills/marquee-daily-content/posted-log.md` first - it tracks every line ever shown (date, content type, item, exact text, link, status). This log is independent from `facebook-teaser`'s log - the two rotate separately even though they sometimes draw from the same source pages.

Rotate through the four content types in this fixed order, cycling: **סיפורי קהילה (עיון) → כלים ותובנות → סדנה → הצטרפות לקהילה (שיתוף סיפור) → (repeat)**. Look at the last logged entry's content type to determine which type is next.

Within a type, never reuse the exact same line already logged as `ממתין לאישור` or `אושר ופורסם`. If every angle of a type feels exhausted this cycle, vary the specific angle/hook rather than skipping (these are evergreen pages, not a finite list, except כלים ותובנות - see below).

## Content sources and link text per type

For each type, the **message** (the rotating line) is short narrative copy in Leah's voice (see "Writing the line" below) - draft it fresh each cycle, never repeat a headline pattern. The **link text** is *functional* text sitting right next to a link, so per `leah-voice`'s hard rule, it must be exact existing wording copied from elsewhere on the site - never invented. Re-read the source page fresh each run (dates, listings, etc. can change).

**סדנה (workshop)** - source `workshop.html`. Message: a short line naming a concrete angle (the Zoom date, the physiological-age test, the 7-session structure) - vary the angle from last cycle's workshop entry in the log. Link text: `פרטים והרשמה לסדנה` (exact nav wording). Href: `workshop.html`.

**Confirmed 2026-08-09: prefer action-driving phrasing over a neutral date announcement.** The original evergreen line ("הסדנה הבאה: 8.10.2026 בזום | 9.10.2026 בסטודיו ברמלה") just informs - Leah asked to replace it with something that drives to action instead (a direct question, an invitation, a nudge), same instinct as `leah-voice`'s blunt-question pattern. The line that landed after a few rounds: **"רוצה לדעת מה הגיל האמיתי של הגוף שלך? בואי לבדוק בסדנה - 8.10 בזום, 9.10 ברמלה."** - reusing the "רוצה לדעת מה הגיל האמיתי של הגוף שלך?" opener already approved once before for a Facebook post (see `facebook-teaser`'s posted-log, 2026-08-06 entry) rather than inventing a new hook from scratch. When a phrasing has already been approved elsewhere on a closely related topic, offering it as an option is often faster than a fully new draft - but still get her explicit approval each time, don't assume it transfers automatically.

**Grammar gotcha, confirmed 2026-08-09:** a first-draft opener "בת כמה הגוף שלך באמת?" was rejected - "בת" (feminine) doesn't grammatically agree with "הגוף" (a masculine noun, takes "בן"), even though the line addresses a woman; the noun's own grammatical gender governs the "בן/בת" construction, not the reader's gender. When phrasing anything as "בן/בת כמה is X" (or similar constructions bound to a noun's grammatical gender), check the noun's actual gender rather than defaulting to match the reader.

**כלים ותובנות (blog)** - source `blog.html`, pick one post not yet used in this log (check by filename). Read that post's own file for its real title. Message: the post's own real title, used as-is (not invented CTA copy - it's the post's actual published title). Link text: `כלים ותובנות` (exact nav wording). Href: that post's own file, e.g. `blog-post-N.html`. If every post in `blog.html`'s current listing has already been used in this log, re-check `blog.html` for anything newly added; if nothing new exists, treat as "no good content" for this slot (see below) rather than repeating.

**הצטרפות לקהילה (share a story)** - source `register.html`'s real criteria text (the "מה אנחנו מחפשים בסיפור?" modal - "סיפור שמשנה את התפיסה של מה אפשרי אחרי גיל 50", "אם הוא יכול, אולי גם אני יכול"). Message: a short line in Leah's voice inviting someone to share their own turning point, built from that real language - vary the angle each cycle. Link text: `שתפו את הסיפור שלכם` (exact button wording from `stories.html`). Href: `register.html`.

**סיפורי קהילה (browse stories)** - source `stories.html`'s real hero copy ("חברי קהילה משתפים בקצרצרי וידאו ובמילים שלהם את הדרך שעשו"). Message: a short line inviting someone to go see what other community members shared - vary the angle each cycle; if a real approved Firestore story exists (see `facebook-teaser`'s Firestore query section for the exact fetch pattern - same public read-only query applies here), a message can reference that a real story is featured, but never name/quote the person's story content directly in this one-line format - just point at the page. Link text: `סיפורי קהילה` (exact nav wording). Href: `stories.html`.

## Writing the line

Invoke the `leah-voice` skill before drafting. The message needs to be **short enough for one scrolling line** - aim for under ~90 characters including the date/detail, since it has to be readable while scrolling past at a fixed speed. This is much tighter than a Facebook teaser body - one punchy sentence, not 2-4 lines. Still no invented CTA/link wording (see above) - only the message itself is narrative-voice territory.

Never reuse the same phrasing/hook pattern across cycles for the same content type - vary the angle each time, same rule as `facebook-teaser`.

## If there's no good content available

If a type's turn comes up and there's genuinely nothing new (blog: no unused post exists and none newly added; workshop/register/stories: every recent angle already logged and nothing new to draw on) - do not invent content to fill the gap. Say so plainly to Leah and ask what she'd like, rather than forcing a repeat or generic line.

**Confirmed 2026-08-09: Leah doesn't see the scheduled task's notification/draft in her regular chat** - the automated 07:41 run happens in a separate session she doesn't check. Rather than debug the notification delivery (outside this repo's control), she asked to just run this skill manually in her regular conversation each morning instead. If a morning goes by and she hasn't seen a draft, she'll ask directly (e.g. "תריצי את הפס הנע") - run it then. The scheduled task can keep running in the background as a backup, but don't assume she's seen its output.

## Approval gate

Present today's draft to Leah in chat, in Hebrew, before touching any file:
- **הטקסט:** the message line
- **הקישור:** the link text + destination page
- **תמונה:** send an actual relevant image file alongside the text (via a file-sending tool), matching that day's content type/topic. This does NOT get embedded in the live marquee itself (the strip is text-only, no image slot in its HTML) - it's just context so Leah can see something concrete while approving, the same expectation she has from the `facebook-teaser` flow. Confirmed 2026-08-09 after she repeatedly asked "where's the image" - always include one, every day, regardless of content type.

Explicitly ask for her approval. She may approve, reject, or ask for edits. Do not edit `index.html` or push anything until she has explicitly approved that day's exact text in that conversation.

## Publishing (after approval)

Only after Leah has explicitly approved:

1. Edit `index.html`'s `.marquee-strip__track` block - replace the second and third `<span>` (message, link - only one of each, no duplicates) with the approved text, keeping the exact same HTML structure (the link span wraps an `<a href="...">`, matching the existing pattern for the workshop link).
2. Do **not** touch the cache-busting `?v=` query param on `css/style.css` - this is an HTML content change, not a CSS change, so no version bump is needed (bump it only if `css/style.css` itself is edited).
3. Commit and push to `main` (this is a live-site content change, already covered by Leah's approval of the specific text in step 1 of this gate - no separate push confirmation needed beyond that approval, since editing-and-publishing this line is exactly what she asked this skill to do daily).
4. Confirm to Leah (Hebrew) that it's live.

## After approval and publishing

Append one row to `.claude/skills/marquee-daily-content/posted-log.md`: date, content type, item, the exact text shown, the link, and status `אושר ופורסם`. This is what every future run reads to keep the rotation honest and avoid repeats.
