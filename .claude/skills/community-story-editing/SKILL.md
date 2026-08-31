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

## Known blocker, hit 2026-08-31: writing to Firestore needs an authenticated session

`firestore.rules` requires `request.auth != null` to `update` an existing `stories`/`story_submissions` doc (only `create` on a new pending submission is open to the public). This session could not complete the actual Firestore write for the first 4 approved edits (below) because:
- Claude cannot enter Leah's password to log into `admin/login.html` - entering credentials to authenticate is a hard no, even for her own site, even with her asking for it.
- `mcp__claude-in-chrome` (which drives Leah's real, already-logged-in Chrome) returned "Navigation to this domain is not allowed" for `guralea.com` in this session - likely needs a one-time permission approval from her that a session running while she's asleep can't get.

**Two ways to unblock, either works:**
1. Leah opens `admin/dashboard.html` (or any page on the site) in her own Chrome and stays logged in - a session with Chrome access can then run the update through that already-authenticated page context (`javascript_tool` calling `db.collection(...).update(...)` directly - no password ever touched).
2. Leah (or a future session that gets a clean permission prompt) allows Claude in Chrome to navigate to `guralea.com` once - after that this should work going forward.

Once either is true, run this in that page's JS console (or via `javascript_tool` against that tab) to complete batch 1:

```js
Promise.all([
  db.collection("story_submissions").doc("3rwLZMW9hFppFhgALAgk").update({ edited: {
    hookLine: "בגיל 48 מצאתי את עצמי בטיפול נמרץ בסורוקה, כמעט שבועיים.",
    summaryFrom: "100 קילו, מעשן 2.5 חפיסות ביום, אחרי התקף לב",
    summaryTo: "מרתוניסט וטריאתלט",
    sections: [
      { heading: "הרגע המכונן", body: "בגיל 48 מצאתי את עצמי בטיפול נמרץ בסורוקה, כמעט שבועיים. היה לי המון זמן לחשוב ולשאול שאלות. שם, על המיטה, כתבתי בעצם את השינוי בעתיד שלי." },
      { heading: "החיים שלפני", body: "עד אז שקלתי 100 קילו. עישנתי 2.5 חפיסות ביום. אכלתי רק זבל. הייתי עצבני מאוד. ואז בא התקף הלב שעצר הכול." },
      { heading: "איפה אני היום", body: "בעשור שחלף עשיתי מהפך שלם: רץ, שוחה, רוכב, מרתוניסט. אינספור מרוצים בכל הארץ, שלוש פעמים טריאתלט, חצי איש ברזל, שחייה למרחקים. היום אני בעיקר רץ - כ-200 ק\"מ בחודש - ומאמן ריצה ומדריך ספינינג." }
    ],
    closingLine: "השמיים הם לא הגבול. הם רק תחנה אל היעד הבא. תקדימו ספורט למכה."
  }}),
  db.collection("story_submissions").doc("hjKPq4o7IpOlDYsomjDc").update({ edited: {
    hookLine: "בגיל 39 פרשתי לפנסיה מהמשטרה. באותו רגע החלטתי לצאת לדרך חדשה לגמרי - ענף פיתוח הגוף.",
    summaryFrom: "שוטר",
    summaryTo: "נשיא איגוד פיתוח גוף, עדיין מתאמן ומייעץ בגיל 76",
    sections: [
      { heading: "הרגע המכונן", body: "בגיל 39 פרשתי לפנסיה מהמשטרה. באותו רגע החלטתי לצאת לדרך חדשה לגמרי - ענף פיתוח הגוף." },
      { heading: "החיים שלפני", body: "כל חיי הייתי איש ספורט. הייתי נשיא האיגוד לפיתוח ועיצוב הגוף בישראל, וניהלתי מועדון כושר עד לפני שלוש שנים. הכנתי ספורטאים וספורטאיות לתחרויות." },
      { heading: "איפה אני היום", body: "היום, בגיל 76, אני עדיין מתאמן בצורה מקצועית - פיתוח גוף וכושר כללי גם יחד. שומר על תזונה נכונה, וממשיך לייעץ לספורטאים לקראת תחרויות." }
    ],
    closingLine: "אני ממליץ לכל אישה וגבר להיות פעילים בכושר, בתזונה נכונה ובאורח חיים בריא - בכל גיל."
  }}),
  db.collection("story_submissions").doc("pbISy7l7kfwfbJMhphPc").update({ edited: {
    hookLine: "בגיל שבעים יצאתי לפנסיה - והלכתי ללמוד צילום.",
    summaryFrom: "עבד כל החיים, פחד מהשעמום בפרישה",
    summaryTo: "צלם שמטייל ומתעד גולשים",
    sections: [
      { heading: "הרגע המכונן", body: "בגיל שבעים יצאתי לפנסיה - והלכתי ללמוד צילום." },
      { heading: "למה", body: "עבדתי כל ימי חיי, ודאגתי שמא אשתעמם כשאפסיק. לכן, כשהגיע הרגע, בחרתי ללמוד צילום." },
      { heading: "איפה אני היום", body: "מאז אני מצלם - הייתי בהרבה ארצות: דרום אמריקה, נפאל, קובה, קרוזים למיניהם. לפני שנה, במלאת לי תשעים, לקחתי את הבנים והכלה לקרוז באיסלנד ובגרנלנד. באוגוסט היה קר, אבל עברנו את זה. היום אני מצלם בעיקר גולשים בים ומשתתף בסדנאות צילום." }
    ],
    closingLine: "אל תשקוד על שמריך."
  }}),
  db.collection("story_submissions").doc("Q0K9W9wyU88HlsemRhDc").update({ edited: {
    hookLine: "בגיל 48 הפסקתי לשחק כדורסל. הבנתי שספורט קבוצתי לא מתאים לאופי שלי - ספורט סיבולת יחידני כן.",
    summaryFrom: "כדורסלן קבוצתי",
    summaryTo: "איש ברזל מלא וטפסן מדרגות עולמי",
    sections: [
      { heading: "הרגע המכונן", body: "בגיל 48 הפסקתי לשחק כדורסל. הבנתי שספורט קבוצתי לא מתאים לאופי שלי - ספורט סיבולת יחידני כן." },
      { heading: "הישגים", body: "עברתי לספורט סיבולת והשתתפתי בתחרויות בארץ ובעולם: איש ברזל מלא, מרוץ 100 קילומטר, מרתון בעומק 500 מטר מתחת לפני האדמה, תחרות טיפוס המדרגות הארוכה בעולם ברצף, ותחרות עלייה וירידה במדרגות במשך 12 שעות ברצף." },
      { heading: "איפה אני היום", body: "גמלאי משטרה כבר שש שנים. כרגע בשלב של מנוחה פעילה וטיפול בפציעות." }
    ],
    closingLine: "הכול בראש. הכול אפשרי."
  }})
]).then(() => console.log("all 4 stories updated")).catch(e => console.error(e));
```

All 4 doc IDs and text were approved by Leah in chat 2026-08-31 - this script is ready to run as-is, no further review needed before executing it, only the auth blocker stands in the way.
