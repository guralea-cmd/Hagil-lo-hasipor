/**
 * @OnlyCurrentDoc
 */
// Google Apps Script bound to the sheet "לידים 2026 – סטודיו לאה גורא" (opened from the sheet:
// Extensions → Apps Script). Deployed as a web app (Execute as: Me, Who has access: Anyone).
// 1) Site forms: after a form's Firestore save succeeds, the page sends a copy here (doPost):
//   form "story"    - guralea.com/register.html (story_contacts)              → סיפורים
//   form "bat-kama" - guralea.com/bat-kama.html (age_test_leads)              → בת כמה את באמת
//   form "workshop" - guralea.com/workshop.html, the workshop registration page (workshop_leads) → סדנה (21.9.2026)
//   form "bat-kama-workshop" - guralea.com/bat-kama-next.html, the workshop form (age_test_leads)
//                          → סדנה, מקור "מבחן" (21.9.2026; until then בת כמה את באמת / "סדנה")
//   form "pilates"  - guralea.com/pilates.html + guraleapilates.com (pilates_leads) → פייסבוק
// 2) Meta ad leads (Facebook + Instagram) → פייסבוק, every 5 minutes (syncMetaLeads, run by Google).
// Rows are written to columns A-E only: תאריך | שם | טלפון | מקור | סטטוס. Column F and everything to its
// left that Leah edits is hers - never written, never read for IDs (14.9.2026: her notes in F wiped the old IDs).
// No lead is added twice: its ID is kept in the hidden tab "_מזהים". A phone already in the tab blocks a
// second row only when that row itself came in automatically (column D "מקור" is filled - an ad or a site
// form), i.e. the same person left details twice. A row Leah typed in by hand has an empty מקור and never
// hides a real incoming lead (16.9.2026: a Meta lead was swallowed that way and never reached the sheet).
// The only secret is the Script property META_TOKEN (never in this code).

const TABS = { story: 'סיפורים', 'bat-kama': 'בת כמה את באמת', 'bat-kama-workshop': 'סדנה', workshop: 'סדנה', pilates: 'פייסבוק' };
const IDS_TAB = '_מזהים';
const SOURCE_SITE = 'אתר';
// מקור לפי טופס, כשהוא לא "אתר" (16.9.2026: לידים של הסדנה מדף "מה עושים עם התוצאה")
const FORM_SOURCES = { 'bat-kama-workshop': 'מבחן' };
const STATUS = 'חדש';
// 21.9.2026: guraleapilates.com sends where the visit came from (referrer / utm, see its site.js). Only these
// values are accepted; anything else falls back to "אתר".
const SITE_SOURCES = /^((פוסט|מודעה) - (פייסבוק|אינסטגרם|טיקטוק)|גוגל|אתר - ישיר|אתר הקהילה|אתר הסטודיו|מבחן)$/;
// Workshop leads get their own subject line (Leah 21.9.2026: "ליד חדש לסדנה: שם").
const MAIL_SUBJECTS = { 'סדנה': 'ליד חדש לסדנה: ' };
// 21.9.2026: the workshop form also sends email (optional) and when to call (בוקר / צהריים / ערב).
// In tab סדנה they go to columns F-G (header: אימייל | מתי נוח להתקשר), right after סטטוס.
// 21.9.2026 later: + the optional chair-challenge result, age and stands in 30 seconds (columns H-I).
const EXTRA_COLS = { 'סדנה': ['email', 'callTime', 'age', 'reps'] };
const CALL_TIMES = /^(בוקר|צהריים|ערב)$/;
// 21.9.2026: one email per new row, to Leah. Subject "ליד חדש: שם" (workshop: "ליד חדש לסדנה: שם"). Every attempt is logged in the
// hidden tab _מיילים (time | id | name | source | result) - the morning report compares it with the new rows.
const MAIL_TO = 'guralea@gmail.com';
const MAIL_LOG_TAB = '_מיילים';
const PAGE_ID = '2267713623553786';

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const form = String(data.form || '');
    const tabName = Object.prototype.hasOwnProperty.call(TABS, form) ? TABS[form] : '';
    const name = String(data.name || '').trim().slice(0, 80);
    const phone = String(data.phone || '').replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
    const id = String(data.id || '').replace(/[^\w-]/g, '').slice(0, 40);
    const email = String(data.email || '').trim().slice(0, 100);
    const callTime = CALL_TIMES.test(String(data.callTime || '')) ? String(data.callTime) : '';
    const age = String(data.age || '').replace(/\D/g, '').slice(0, 3);
    const reps = String(data.reps || '').replace(/\D/g, '').slice(0, 2);
    if (!tabName || !name || !/\d/.test(phone)) return reply({ ok: false });
    if (isTest(name)) return reply({ ok: true, skipped: true });
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      addRows(tabName, [{ key: form + ':' + (id || Utilities.getUuid()), when: new Date(), name: name, phone: phone, email: email, callTime: callTime, age: age, reps: reps, source: FORM_SOURCES[form] || (SITE_SOURCES.test(String(data.source || '')) ? String(data.source) : SOURCE_SITE) }]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false });
  }
}

// Opening the web app URL in a browser only checks the setup - it writes nothing.
function doGet() {
  const book = SpreadsheetApp.getActive();
  const tabs = {};
  Object.keys(TABS).forEach(function (form) { tabs[TABS[form]] = !!book.getSheetByName(TABS[form]); });
  return reply({ ok: true, tabs: tabs, metaToken: !!PropertiesService.getScriptProperties().getProperty('META_TOKEN') });
}

// Run once: creates the 5-minute trigger and does a first sync.
function setup() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'syncMetaLeads'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('syncMetaLeads').timeBased().everyMinutes(5).create();
  syncMetaLeads();
}

function syncMetaLeads() {
  const token = PropertiesService.getScriptProperties().getProperty('META_TOKEN');
  if (!token) throw new Error('Missing Script property META_TOKEN');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    const G = 'https://graph.facebook.com/v21.0/';
    const pageToken = graph_(G + PAGE_ID + '?fields=access_token&access_token=' + encodeURIComponent(token)).access_token;
    const forms = graph_(G + PAGE_ID + '/leadgen_forms?fields=id&limit=100&access_token=' + encodeURIComponent(pageToken)).data || [];
    const leads = [];
    forms.forEach(function (form) {
      let url = G + form.id + '/leads?fields=created_time,field_data,platform&limit=100&access_token=' + encodeURIComponent(pageToken);
      while (url) {
        const page = graph_(url);
        (page.data || []).forEach(function (lead) {
          const f = {};
          (lead.field_data || []).forEach(function (x) { f[x.name] = (x.values || []).join(' '); });
          const name = String(f.full_name || f.first_name || '').trim();
          if (!name || isTest(name)) return;
          leads.push({
            key: 'meta:' + lead.id, when: new Date(lead.created_time), name: name,
            phone: String(f.phone_number || ''), source: lead.platform === 'ig' ? 'מודעה - אינסטגרם' : 'מודעה - פייסבוק'
          });
        });
        url = page.paging && page.paging.next ? page.paging.next : null;
      }
    });
    leads.sort(function (a, b) { return a.when - b.when; });
    addRows(TABS.pilates, leads);
  } finally {
    lock.releaseLock();
  }
}

// Adds the leads that are not in the tab yet. Existing rows are never changed.
function addRows(tabName, leads) {
  const book = SpreadsheetApp.getActive();
  const sheet = book.getSheetByName(tabName);
  if (!sheet || !leads.length) return;
  let idsSheet = book.getSheetByName(IDS_TAB);
  if (!idsSheet) { idsSheet = book.insertSheet(IDS_TAB); idsSheet.hideSheet(); }
  const idsLast = idsSheet.getLastRow();
  const seen = new Set(idsLast ? idsSheet.getRange(1, 1, idsLast, 1).getDisplayValues().flat() : []);
  const last = sheet.getLastRow();
  // phone -> the מקור (column D) of the first row holding it. Empty means Leah typed that row in herself.
  const phones = new Map();
  if (last > 1) {
    sheet.getRange(2, 1, last - 1, 4).getDisplayValues().forEach(function (r) {
      const p = digits_(r[2]);
      if (p.length >= 9 && !phones.has(p)) phones.set(p, String(r[3] || "").trim());
    });
  }
  const rows = [];
  const newIds = [];
  const written = [];
  leads.forEach(function (l) {
    if (seen.has(l.key)) return;
    seen.add(l.key);
    newIds.push([l.key]);
    const p = digits_(l.phone);
    // Skipped only when the same person already has an automatic row (מקור filled) - that is a real
    // duplicate. If the only row with this phone is one Leah typed by hand, the lead still gets its own row,
    // so an ad lead is never lost just because she already knew the person.
    if (p.length >= 9 && phones.has(p) && phones.get(p) !== "") return;
    phones.set(p, l.source);
    written.push(l);
    rows.push([Utilities.formatDate(l.when, 'Asia/Jerusalem', 'd.M.yyyy, HH:mm'), asText(l.name), asText(localPhone(l.phone)), l.source, STATUS]
      .concat((EXTRA_COLS[tabName] || []).map(function (k) { return asText(String(l[k] || '')); })));
  });
  if (newIds.length) idsSheet.getRange(idsLast + 1, 1, newIds.length, 1).setNumberFormat('@').setValues(newIds);
  if (!rows.length) return;
  const start = sheet.getLastRow() + 1;
  const missing = start + rows.length - 1 - sheet.getMaxRows();
  if (missing > 0) sheet.insertRowsAfter(sheet.getMaxRows(), missing);
  sheet.getRange(start, 1, rows.length, rows[0].length).setNumberFormat('@').setValues(rows);
  mailLeads_(book, tabName, written);
}

// The row is already in the sheet before any email is tried, so a mail failure never loses a lead.
// Nightly form-test leads (name starts with "ניסיון") are written so the test can find them, but never emailed.
function mailLeads_(book, tabName, leads) {
  let log = book.getSheetByName(MAIL_LOG_TAB);
  if (!log) { log = book.insertSheet(MAIL_LOG_TAB); log.hideSheet(); }
  leads.forEach(function (l) {
    if (/^ניסיון/.test(l.name)) return;
    let result = 'נשלח';
    try {
      MailApp.sendEmail({
        to: MAIL_TO,
        subject: (MAIL_SUBJECTS[tabName] || 'ליד חדש: ') + l.name,
        body: 'שם: ' + l.name + '\nטלפון: ' + localPhone(l.phone) +
          (l.email ? '\nאימייל: ' + l.email : '') + (l.callTime ? '\nמתי נוח להתקשר: ' + l.callTime : '') +
          (l.age ? '\nגיל: ' + l.age : '') + (l.reps ? '\nכמה פעמים קמה וישבה ב-30 שניות: ' + l.reps : '') +
          '\nמקור: ' + l.source + '\nזמן: ' +
          Utilities.formatDate(l.when, 'Asia/Jerusalem', 'd.M.yyyy, HH:mm') + '\nבגיליון: לשונית ' + tabName
      });
    } catch (err) {
      result = 'שגיאה: ' + String(err && err.message || err).slice(0, 200);
    }
    log.appendRow([Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'd.M.yyyy, HH:mm:ss'), l.key, asText(l.name), l.source, result]);
  });
}

function graph_(url) {
  const json = JSON.parse(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText());
  if (json.error) throw new Error('Meta: ' + json.error.message);
  return json;
}

function isTest(name) {
  return /^(בדיקה|בדיקת טופס|בדיקת מערכת|_healthscan)/.test(name);
}

function digits_(p) {
  const d = String(p || '').replace(/\D/g, '').replace(/^972/, '0');
  return d.charAt(0) === '5' ? '0' + d : d;
}

function localPhone(p) {
  const d = digits_(p);
  return d.length === 10 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : String(p || '');
}

// A value starting with = + - @ would otherwise be read by Sheets as a formula.
function asText(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
