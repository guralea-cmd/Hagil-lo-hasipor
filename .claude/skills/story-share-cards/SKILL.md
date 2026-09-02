---
name: story-share-cards
description: Builds a personal, shareable social card for each community member whose story is published on stories.html - their photo, a real quote from their own story, their name, and a link back to their story page - so they can share it themselves on Facebook/Instagram/WhatsApp and invite people to read the full story. Use whenever asked to prepare, design, or update a share card / כרטיס שיתוף for a community-story member, or to continue this in-progress project.
---

# Story share cards

## HARD RULE, locked 2026-09-01: ONE design system for every branded image on this project, no exceptions

Leah's explicit instruction: **`.claude/skills/facebook-teaser/post-frame-template.html` is THE locked template - for branded Facebook post images AND for these personal share cards, no separate design.** The old square (1080×1080), `object-fit:contain`, cream-background design that used to live in this skill's own `templates/` folder is discarded - those files have been deleted. Do not recreate them, do not design a separate look for share cards "because they're a different use case." There is one branded look for this whole project now.

**This supersedes every design note below this point that describes the old square/contain template** - those sections are kept only as historical record of *why* the old design existed and *what mistake to avoid repeating* (the letterboxing/logo-order/spacing lessons still apply conceptually), not as instructions to follow. When building a card, go read `post-frame-template.html` directly for the real current markup/CSS - don't reconstruct it from memory or from the historical notes below.

**Also locked 2026-09-01: the round logo badge sits in the exact same spot, same size, on all 4 cards.** In the current template that's `.logo-badge` (110px circle, gold border, positioned `top:50%; right:36px`, vertically centered in the 165px top band) - copy the template file as-is per person and only change the photo, quote, name/age/location. Never touch `.top-band`/`.logo-badge` positioning per-card.

**Updated 2026-09-02: `post-frame-template.html` now also has a mirrored green WhatsApp badge** (`.wa-badge`, 110px circle - same size as the logo - positioned `bottom:82.5px; left:36px` to exactly mirror the logo's corner treatment, with the number `050-699-1723` to its right) in the bottom-left corner, plus the CTA text repositioned to `left:470px` so it no longer collides with the badge. Every card built from here on inherits this automatically since this skill just copies the template as-is - don't touch this positioning per-card, same as the logo rule above. See the two "STANDING RULE, added 2026-09-02" sections in `facebook-teaser/SKILL.md` for the full reasoning (this is a hard publish gate, not a style choice) - including that an image without both corner badges doesn't get published.

**Practical effect on the crop rule:** the current locked template uses `object-fit: cover; object-position: center 20%` (crops to fill the frame, biased toward the top of the photo) - this is Leah's approved choice for this design, not an error. The old "never crop, always contain, show the whole person" principle from the square design no longer applies to this project's actual output. If a future photo crops out something important (e.g. a raised arm, a visible prop that matters to the story), flag it to Leah rather than silently accepting a bad crop - but don't revert to `contain` unilaterally.

## Current roster - the 4 approved community-story members (checked 2026-09-01)

All four are in the `story_submissions` Firestore collection, `status: "approved"`. Direct story links use the pattern `https://guralea.com/stories.html#story-{docId}`.

| Name | Doc ID | Age | Location |
|---|---|---|---|
| שי טובול | `3rwLZMW9hFppFhgALAgk` | 58 | דימונה |
| אמנון גאון | `hjKPq4o7IpOlDYsomjDc` | 76 | קרית מוצקין |
| אליעזר רוה | `pbISy7l7kfwfbJMhphPc` | 91 | רמת גן |
| אבי תורג'מן | `Q0K9W9wyU88HlsemRhDc` | 62 | ישראל |

Quotes used, all verbatim (or disclosed-trim) from each person's own `edited.closingLine` Firestore field:
- שי: "השמיים הם לא הגבול, הם רק תחנה אל היעד הבא"
- אמנון: "אני ממליץ להיות פעילים בכושר - בכל גיל" (trimmed from the full closingLine for length; meaning preserved - disclose the trim if asked)
- אבי: "הכול בראש. הכול אפשרי" (verbatim)
- אליעזר: "אל תשקוד על שמריך" (verbatim)

## Status as of 2026-09-01: all 4 rebuilt on the single locked template - shown to Leah - awaiting "מאושר"

Shai, Avi, and Eliezer's images already existed as committed assets from the same-day post-frame-template lock: `images/facebook-posts-branded/story-3rwLZMW9hFppFhgALAgk-relaunch.png`, `story-Q0K9W9wyU88HlsemRhDc-relaunch.png`, `story-pbISy7l7kfwfbJMhphPc-relaunch.png` - reused as-is. Amnon's committed file at that path is stale (dated 2026-08-24, old design) - a fresh render matching the locked template was built and shown separately; **replace the committed Amnon file with the new render once Leah approves**, don't leave the stale 8/24 one in the repo.

**Nothing published/sent anywhere except to Leah for review - waiting for her explicit "מאושר" before any further action**, per the standing approval-gate rule in `site-open-items` SKILL.md.

## Historical design notes (old square/contain template - SUPERSEDED, kept for lesson context only)

The rest of this file below described the discarded square-card design in detail (branded-frame layout, the crop hard rule, 8 hard-won lessons from the original Shai Tuvol design session, the two accompanying share-copy text blocks). That design and those files no longer exist. The **lessons about logo positioning consistency, visible gaps, and not leaving dead space** are still generally good instincts to apply when checking any new render against the current locked template - but the specific CSS values, dimensions, and the `contain`-based crop rule described there are obsolete. Do not resurrect them.
