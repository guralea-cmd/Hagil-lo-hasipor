**⛔ בוטל על ידי לאה 14.9.2026 (חוק הספאם) - ארכיון בלבד**

# Leads collection for one WhatsApp message - 2026-09-14

Leah asked on 14.9.2026 for every lead from every source in one list, with no duplicates and no active trainees, including very old leads. This step only collected the list. Nothing was sent. Counts only below; names and phones are only in the sheet.

**Result:** new tab `לידים ישנים - וואטסאפ` (sheetId 870940288) in the leads sheet `1MfgLcFLpR7ax5hkEerMCOxH-aaaxIi4uMgePlJeEd2o`. It holds **12 unique contacts**. The tab is RTL, has a frozen header row, and the header is שם | טלפון | מקורות | תאריך פנייה ראשונה | הערה | סטטוס וואטסאפ. The status column is empty. The tab was read back through the API and matched what was written, and no other tab changed. Rows run newest first; the 2 rows without a date are at the bottom.

## Counts per source (before dedupe)
| Source | Rows | Notes |
|---|---|---|
| Leads sheet 2026, tab `פייסבוק` | 6 | 4 ad leads plus 2 rows Leah typed in by hand, which have no date |
| Leads sheet 2026, tab `לידים` (old tab) | 5 | all duplicates of the ad leads |
| Leads sheet 2026, tabs `סיפורים` and `בת כמה את באמת` | 0 | header only |
| Meta lead ads, studio page (17 forms) | 5 | 4 Instagram, 1 Facebook; only the 2 forms from Sept 2026 returned leads |
| Meta lead ads, community page | 0 | the page has no lead forms |
| Firestore `story_contacts` (joined to `story_submissions`) | 8 | 6 have a phone and 2 don't; 2 of the 6 are stories that were rejected |
| Firestore `pilates_leads` | 1 real of 9 | the only non-test record is Leah's own submission, so it was excluded |
| Firestore `contact_submissions`, `workshop_leads` | 0 real | all test records |
| Firestore `age_test_leads` | 0 | |

## Removed or marked
- Duplicates removed (same phone): **10**
- Dropped for having no valid mobile number: **2** (story contacts with no phone)
- Test records excluded: **23** (8 in pilates_leads, 7 in contact_submissions, 8 in workshop_leads), plus 1 pilates_leads record that is Leah's own submission
- Active trainees removed: **0**. The exclusion could not be done because Fizikal needs a login.
- Marked "not relevant / don't contact": **0**. The sheet notes (for example "no card", "no time, trained here before") were copied into the הערה column so Leah can decide.
- Every story contact has a note saying they shared a community story and were not a studio inquiry.

## How far back the Meta API went
- The oldest lead returned was from 12.9.2026. Form `939573169208375` returned 1 lead and form `1032122829849887` returned 4.
- 15 older forms, created between 2019 and July 2026, returned 0 leads and `leads_count` 0. That includes form `1002844542377108`, created 14.7.2026, which is inside the 90-day window and really has no leads. The rest are older than Meta's retention window. Meta keeps leads for about 90 days, so there are none to pull from the API, and a CSV from Business Suite would most likely be empty for those forms too.

## Sources that could not be read
- **Old sheet `1XA5mmscZFA7DUTIlVG5KX7t1iYhNjrzlJdbxnUgs6sQ`:** the service account gets 403. In Leah's own Chrome session it opens as an empty "untitled spreadsheet" with one blank tab. It is not a leads sheet.
- **Leads sheets found in Leah's Drive but not read:** "לאה לידים 2025חדש" (`1ucygRT_O8-F7pdcfeZ2dwwomtbGx8Rzmhk5S1k5ibHc`, tabs גיליון1 / גיליון5 / גיליון6 / גיליון טייקינג קונטרול / לידים אחרי החגים), "לאה גורא - לידים" (`1MxkrFO4iGM7EPQimhquhSXk3kyM88Tkpu0vTOFsFEjQ`) and "פיגורא - לידים" (`1NrAp13KvkgSyo_9MEBJeP1HFC_M67hCmurvhQUQ3gUs`). The permission system blocked opening them, because they were not among the listed sources. They are most likely the real "very old leads". To include them, Leah shares each one with `hagil-sheets-bot@hagil-lo-hasipor.iam.gserviceaccount.com` as a viewer, or confirms in chat that Claude may read them.
- **Fizikal CRM:** https://admin.fizikal.co.il/ opens a login screen. Leah has to log in herself at https://admin.fizikal.co.il/login/fizikal in Chrome. After that, both the leads and former clients and the list of active trainees can be collected, and the trainees excluded.
