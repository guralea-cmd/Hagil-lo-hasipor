---
name: pilates-page-project
description: Building out pilates.html - the Ramla Pilates-equipment studio page on guralea.com - from Leah's real old material (client testimonial videos/photos, old registration PDF), since no old website files exist locally. Use whenever asked about pilates.html, the studio page, or "Figura"/"פיגורא" material.
---

# Pilates page project

## Status: placeholder page live, full content not yet built

`pilates.html` was created 2026-08-18 as a placeholder (title, short intro paragraph, phone number, LocalBusiness schema) and added to the main nav on all 40 public pages ("לאה גורא פילאטיס" / "מכשירים ברמלה", between "קצת עליי" and "סיפורי קהילה"). The body still has a `[לאה: להשלים]` marker where the real content goes.

**Next step: build out pilates.html in full** using the source material found below - real testimonial photos/videos, and whatever text/structure makes sense from the old registration form - instead of the placeholder paragraph.

## Naming note - not a contradiction

The current, correct, official studio name for guralea.com is **"סטודיו לאה גורא - פילאטיס מכשירים ברמלה"** (see [[geo-seo-project]], which explicitly flags "NOT Figura" - that was about the *current* site branding, and that guidance still stands).

Leah confirmed 2026-08-19 that **"פיגורא" (Figura, spelled with an א) was the studio's OLD/prior brand name**, from before the rebrand to "לאה גורא". This is why the old material below (PDF, desktop shortcut) is labeled "Figura"/"פיגורא" - it predates the current branding. Don't use "Figura" anywhere on the live site; it's only relevant here as a search term for locating old material.

## File search results (2026-08-19)

Searched Desktop, Documents, Downloads, and OneDrive (plus checked D:\, which only has an OneDrive junction and an EFI partition - nothing relevant) for old-site material, keywords: פילאטיס, פיגורא, Figura, Pilates, Studio, גורא, Gura.

**No old website files (HTML or otherwise) exist anywhere on this computer.** Checked every .html/.htm/.mhtml file under those roots (only the current Hagil-lo-hasipor repo and unrelated files turned up) and every .zip/.rar/.7z archive in Downloads (7 archives, all just duplicate copies of the same client photos/videos found on the Desktop - no site files inside any of them). If the old "פיגורא" site was ever live, it was on an external platform (Wix/WordPress/etc.) and wasn't saved locally as raw files - there is nothing to recover here, only the raw client material below.

**Relevant material found, to build the real page from:**

1. **Media folder (the main source):**
   `C:\Users\gural\OneDrive\Desktop\סירטונים,תמונות עדויות לקוח ועוד  לאה גורא פילאטיס מכשירים\`
   Dozens of client testimonial videos and photos (.MOV, .mp4, .jpeg, .HEIC), directly in that folder plus two subfolders `חומרים\` and `תמונות\` (which itself has a `שומש\` sub-subfolder). This is real client testimonial material - client-facing images/videos, likely the main asset for the finished page.

2. **Old registration form:**
   `C:\Users\gural\OneDrive\Desktop\פיגורא פילאטיס - טופס הרשמה.pdf`
   Not yet opened/read - may contain old service descriptions, pricing structure, or specialty list worth checking before writing final copy.

3. **`Figura - Chrome.lnk`** (Desktop shortcut) - checked, it only launches Chrome with the default profile (`--profile-directory="Default"`), no target URL embedded. Not useful for finding the old site's live URL.

## Working notes for next session

- Don't move, rename, or delete anything in the Desktop media folder or the PDF - treat them as read-only source material, copy what's needed into the repo's `images/`/`videos/` folders instead.
- HEIC files will need conversion to a web-friendly format (JPEG) before use on the site, same as other image handling on this project.
- Follow the [[feedback_testimonial_authenticity]] rule from memory: real client testimonials must be embedded as actual screenshot/photo/video, never retyped as text.
- Check with Leah before publishing which specific photos/videos/testimonials she wants used - this is real client material, not stock content.
