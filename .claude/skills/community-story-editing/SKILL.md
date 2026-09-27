---
name: community-story-editing
description: Standing workflow (set 2026-08-31) for turning raw community-story submissions into edited journalistic narratives on stories.html - draft the edit, show Leah before/after for approval, then write the approved text into the story's own Firestore document. Use whenever a new story is approved/pending, or Leah asks to improve/edit the community stories.
---

# Community story editing

## Why this exists

Leah found (GA4 session, 2026-08-30/31) that average engagement time on stories.html was seconds, not minutes - the raw submissions are unpunctuated, unstructured, written by the storytellers themselves, and read as a wall of text. She asked for every story to be edited into a proper journalistic narrative, and set a **standing workflow**, her exact words: "מעכשיו - כל סיפור חדש אתה עורך, מציג לי לאישור, ומכניס בעצמך. אני רק מאשרת." (From now on - every new story you edit, show me for approval, and insert yourself. I only approve.)

## The editorial spec (her exact requirements, 2026-08-31)

- Opens with the peak/turning-point moment, not biography (e.g. "בגיל 62 קפצתי לים בפעם הראשונה בחיי").
- First person, in the storyteller's own voice - keep their real phrases and sentences, don't replace their voice with a generic one.
- Short paragraphs, 2-3 sentences, with subheadings (h4 in the template).
- A summary line at the top, this exact format: `מ: ___ ← ל: ___ | בגיל: ___`
- Emotional structure: הרגע המכונן ← החיים שלפני ← הקושי והפחד ← הצעד הראשון ← איפה אני היום ← משפט השראה לסיום. **Not every raw submission has material for all six beats** - when a beat has nothing in the original (no described fear, no distinct "first step"), compress or merge sections rather than invent content for it. Say so explicitly when presenting the draft to Leah.
- Length target 300-500 words - but this is secondary to the hard rule below. A short raw submission stays short; don't pad it with invented detail to hit a word count.
- Closing CTA "גם לך יש סיפור? ספרו לנו" linking to register.html - already built into the template itself (`shareYourStoryCtaHtml()` in `js/stories.js`), not something to add per-story.

## Hard rule - no exceptions

**Never invent facts, names, or details that weren't in the original submission.** Only edit and rearrange what the person actually wrote. If a structural beat has no source material, leave it out or merge it into a neighboring section - don't fabricate a plausible-sounding sentence to fill the gap. Flag every such gap explicitly when presenting the draft.

## Workflow

1. Read the real submission - either from `story_submissions`/`stories` in Firestore (via an authenticated session, or via the live rendered page at stories.html if not yet authenticated) - never edit from a paraphrase or guess.
2. Draft the edit per the spec above: hook line, מ/ל/בגיל summary, sectioned body (heading + 2-3 sentence paragraphs), closing line.
3. Present before/after to Leah in chat. Wait for explicit approval - nothing gets written to Firestore before she says yes.
4. Once approved, write the edit into that story's own Firestore document under a new `edited` field (see shape below) - **don't overwrite the original `story`/`turningPoint`/`today`/`message` fields**, they're the storyteller's actual consent-covered submission and should stay intact as the source record.
5. The template (`js/stories.js`) already prefers `edited` when present and falls back to the raw fields otherwise - no template change needed per-story, just the Firestore write.

## Firestore field shape

On the story's document in `story_submissions` (or `stories` for the legacy collection - simpler, `edited.hookLine` only, see `rowFromLegacyStory`):

```
edited: {
  hookLine: "בגיל 48 מצאתי את עצמי בטיפול נמרץ בסורוקה, כמעט שבועיים.",
  summaryFrom: "100 קילו, מעשן 2.5 חפיסות ביום, אחרי התקף לב",
  summaryTo: "מרתוניסט וטריאתלט",
  sections: [
    { heading: "הרגע המכונן", body: "..." },
    { heading: "החיים שלפני", body: "..." },
    { heading: "איפה אני היום", body: "..." }
  ],
  closingLine: "השמיים הם לא הגבול. הם רק תחנה אל היעד הבא. תקדימו ספורט למכה."
}
```

## Status - 27.9.2026

- **Batch 1 (שי טובול, אמנון גאון, אליעזר רוה, אבי תורג'מן) completed and verified 12.9; 6/7 approved stories in `story_submissions` have `edited=true`.** The 2026-08-31 auth blocker and the batch-1 write script were deleted 27.9 (done, nothing left to run). Writes to Firestore go through Leah's own logged-in browser (Edge, rule 70) via `javascript_tool` - never a password.
- חסר: כלל 63 יא (21.9) - סיפור חדש -> כרטיס + דף, מראים לפני העלאה, פוסט אורגני אחד ב'הגיל' בלבד, בלי ממומן.
- **לאה 28.9.2026 ("11 לערוך"): הסיפור של לאה גורא (96FgtqomdPjXCFZpB6WU) עובר עריכה - טיוטה לפני/אחרי מוצגת לה לאישור, ורק אז נכתב ל-Firestore.** 
❓ הסיפור של לאה גורא (96FgtqomdPjXCFZpB6WU) לא ערוך - לאה מחליטה.

**⛔ 17.9.2026, בהוראתה ("למחוק לגמרי... שום דבר לא יקרה באופן אוטומטי"): אין הרצה בלי אישור.** לפני כל הרצה של סקריפט שכותב למסד הנתונים - מציגים לה בדיוק מה ייכתב ולאיזה סיפור, ומחכים ל"כן" מפורש.
