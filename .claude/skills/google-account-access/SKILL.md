# Google account access (guralea@gmail.com)

Set up 2026-09-02/03, at Leah's request, to let Claude act on her Gmail, Google Sheets, Google Calendar, and Google Drive. Two separate access paths ended up being needed - don't conflate them.

## Path 1: Gmail - via Claude in Chrome (browser automation)

Drives Leah's real, already-logged-in Edge browser via the Claude in Chrome extension (same one used for the GA4 dashboard, see `project_ga4_weekly_report_skill` in memory). As long as Leah is logged into `guralea@gmail.com` there, Claude can open `mail.google.com` and act on it like she would herself - no extra login. **Confirmed working 2026-09-02** with a real test send (To: guralea@gmail.com, Subject: "בדיקת חיבור - Claude") - delivered, visible at the top of the inbox.

**Important correction:** `docs.google.com`, `sheets.google.com`, `drive.google.com`, `calendar.google.com`, and even `console.cloud.google.com` are all **blocked** for Claude in Chrome navigation ("Navigation to this domain is not allowed"). This was first assumed to be a per-site permission Leah could toggle in the extension's own settings (Extension icon -> ⋯ -> Extension settings -> Permissions -> "Your approved sites") - **that assumption turned out unverifiable**: browser-internal pages (e.g. `edge://extensions`) return the identical error, which just reflects that Claude's own automation tool can't reach browser-internal pages, a universal restriction unrelated to any user-editable list. Whether these specific Google domains are blocked by a fixed Anthropic safety policy (Claude in Chrome ships with a large default-blocked-domains list) or are genuinely addable via "Your approved sites" was never conclusively resolved, because path 2 (service account) solved the actual need first. If Gmail-adjacent Google services are needed via the browser path again, it's worth Leah checking Extension settings -> Permissions herself before assuming the block is permanent.

## Path 2: Sheets / Drive / Calendar - via a Google Cloud Service Account

Since the browser path was blocked for these, Leah set up a real Google Cloud service account (2026-09-02/03) - the standard, official way automated tools get API access to Google services.

**What exists:**
- Google Cloud project: `hagil-lo-hasipor`, with Sheets API, Drive API, and Calendar API all enabled.
- Service account: **`hagil-sheets-bot@hagil-lo-hasipor.iam.gserviceaccount.com`**
- Its private key: `.claude/skills/google-account-access/service-account-key.json` (gitignored - never commit, never print its `private_key` field into chat or any file outside this path).
- A Drive folder Leah owns and shared with that service account email as **Editor**: named "אוטומציה - claude" (id `1cjxO8aOsHYkQYjbz5AWNQEICeEAkJEA0`). This folder is the root the service account can actually reach - it has no access to anything else in Leah's Drive.

**Hard gotcha - service accounts on personal (non-Workspace) Google accounts have 0 Drive storage quota.** The service account **cannot create new files** via the Drive API even inside a folder it has Editor access to - `files.create` fails with `storageQuotaExceeded`. There is no per-file workaround; Shared Drives (which would fix this) require a paid Google Workspace account, which Leah doesn't have.

**The working pattern:** Leah creates the empty file herself (Google Sheet, Doc, whatever) inside the shared "אוטומציה - claude" folder via the normal Drive UI - since she owns it, no quota problem. The service account then only **reads/writes content into that already-existing file** (`spreadsheets.values.update`, `batchUpdate`, etc.) - this works fine, no quota involved. So the flow for any new tracking sheet is always: (1) tell Leah the exact file type and name to create inside that folder, (2) she creates it and confirms, (3) Claude finds its file ID (list files visible to the service account, don't trust exact name-string matching - see below) and fills it in via the Sheets/Drive API.

**Name-matching gotcha:** when Leah typed "פניות לעיתונאים" as a sheet name, Drive actually stored it with a double space ("פניות  לעיתונאים") - an exact-string Drive API query for the name Claude expected returned zero results. Don't assume the typed name matches byte-for-byte; list all files the service account can see (`GET drive/v3/files?fields=files(id,name,mimeType,owners)`) and match by eye/mimeType instead of a strict `name=` query filter, then hardcode the resolved file ID for subsequent writes in the same session.

**How the script works (no npm install needed):** Node.js is available on this machine (v24, no Python installed). A plain Node script signs its own JWT with `crypto.createSign('RSA-SHA256')` using the service account's `private_key` (no `googleapis` package required), exchanges it for an access token at `https://oauth2.googleapis.com/token` (grant type `urn:ietf:params:oauth:grant-type:jwt-bearer`, scopes `https://www.googleapis.com/auth/drive` + `.../auth/spreadsheets`), then calls the Drive v3 / Sheets v4 REST APIs directly with that bearer token. Write such a script fresh into the scratchpad directory each time (it's small, no need to keep a permanent copy in the repo) rather than reusing a stale one - the token expires hourly anyway and file IDs differ per task.

## Hard rule: never delete or move files/emails without explicit approval, every time

**Standing instruction from Leah, 2026-09-03.** This covers Gmail (archiving/deleting/labeling emails), Google Drive (moving/deleting/organizing files), and local files on her computer (Desktop, Downloads, Documents) alike - any organization/cleanup work (see the "סדר" project, 2026-09-03) is proposal-only until she explicitly signs off, item by item or batch by batch as she approves it. Producing a written organization proposal (suggested Gmail labels, Drive folders, local folders, what to archive/delete) is fine and expected - actually moving, deleting, labeling, or archiving anything is not, until she says yes.

**Why:** Leah asked for a full read-only scan and proposal for organizing her Gmail/Drive/computer, and was explicit that this must never become an excuse to actually touch anything without her sign-off first - mirrors the site's standing "nothing goes out without approval" pattern used elsewhere (email sends, marquee/blog publishing).

**How to apply:** Scanning, reading, and reporting is unrestricted. Any action that changes or removes something (delete, move, archive, relabel, rename) requires a specific, explicit "yes" from Leah for that specific item or batch - not a general one-time approval of the whole proposal.

## Hard rule: no email sent to anyone but Leah without her explicit approval, every time

**Standing instruction from Leah, 2026-09-02.** No email may be sent from `guralea@gmail.com` to any recipient other than herself unless she has explicitly approved that specific send in the conversation - not a blanket one-time approval covering future sends, an approval per email.

**Why:** Leah connected Gmail access specifically to let Claude help manage journalist outreach and correspondence, but was explicit that outgoing mail to real people (journalists, contacts) needs her sign-off each time - this mirrors the site's existing "never send anything to anyone without approval" pattern from `feedback_no_progress_pings_overnight` (memory) and the general permission rules Claude already follows for sending messages on someone's behalf.

**How to apply:** Before clicking "send" on any email addressed to someone other than `guralea@gmail.com` itself, show Leah the exact recipient, subject, and body, and wait for a clear yes. Sending a test/self email to `guralea@gmail.com` itself still needs her go-ahead but is lower-stakes since no one else receives it. This rule is specific to *sending mail*; reading/organizing Sheets, Drive files, or Calendar entries doesn't carry the same restriction unless it becomes clear it should.

## What's been built so far

- **2026-09-02:** Gmail connection tested and confirmed (self-test email).
- **2026-09-03:** Service account path built end-to-end and the first real tracking sheet created: **"פניות לעיתונאים"** (media outreach tracker) inside the "אוטומציה - claude" folder, with header row `כלי תקשורת | שם העורך | מייל | תאריך שליחה | ענה/לא ענה | מעקב הבא | הערות | קישור למקור` (bold, frozen). Spreadsheet ID `1_RAVPk82GCpYgZwlUm1aIypLKgEisEObNPEKfV0PBuU`.
- **2026-09-03:** Filled with 23 real, individually web-verified rows (press health sections, health sites, radio, TV, podcasts, senior magazines) per Leah's request - see `pr-media-plan/SKILL.md` for the outlet list and sourcing notes. Where no personal editor email was publicly findable, used the outlet's general/system email or contact-form link instead (never invented) - roughly half the rows have no email, only a contact-form link, which is expected and was flagged to Leah, not a gap to silently fill later with guesses.
