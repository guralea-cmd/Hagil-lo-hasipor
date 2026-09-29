// Copies every lead from the studio's Meta lead forms (Facebook + Instagram ads)
// into the "פייסבוק" tab of Leah's sheet "לידים 2026 – סטודיו לאה גורא".
// Columns: תאריך | שם | טלפון | מקור | סטטוס | מזהה (F is hidden - it only holds meta:<lead id>,
// so a lead already in the tab is never added twice).
// New leads are written into the empty rows below the last row that has anything in it.
// Existing rows - including rows Leah typed in herself - are never changed.
// Website form leads reach the same tab separately, through apps-script-webhook.gs.
// Usage: node .claude/skills/leads-sheet/sync-leads.mjs
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skills = join(here, '..');
const config = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'));
const metaToken = JSON.parse(readFileSync(join(skills, 'facebook-ads-plan', 'secrets.json'), 'utf8')).userAccessToken;
const saKey = JSON.parse(readFileSync(join(skills, 'google-account-access', 'service-account-key.json'), 'utf8'));

const PAGE_ID = '2267713623553786';
const SHEET = config.sheetName || 'פייסבוק';
const HEADER = ['תאריך', 'שם', 'טלפון', 'מקור', 'סטטוס', 'מזהה'];
const ID_COL = 5; // F
const TEST_NAME = /^(בדיקה|בדיקת טופס|_healthscan)/;

async function googleToken() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({ iss: saKey.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const sig = createSign('RSA-SHA256').update(`${head}.${claim}`).sign(saKey.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${head}.${claim}.${sig}`
  });
  const json = await res.json();
  if (!json.access_token) throw new Error('Google token failed: ' + JSON.stringify(json));
  return json.access_token;
}

async function graph(path, token = metaToken) {
  const url = path.startsWith('http') ? path : `https://graph.facebook.com/v21.0/${path}${path.includes('?') ? '&' : '?'}access_token=${token}`;
  const json = await (await fetch(url)).json();
  if (json.error) throw new Error('Meta: ' + json.error.message);
  return json;
}

function israelDate(iso) {
  return new Date(iso).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function localPhone(p) {
  const digits = String(p || '').replace(/\D/g, '').replace(/^972/, '0');
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : String(p || '');
}

async function metaLeads() {
  // Listing the page's forms needs a Page token; it is derived from the system-user token.
  // All of the page's forms are read, so a new ad form (e.g. 1032122829849887 from 13.9) is picked up by itself.
  const pageToken = (await graph(`${PAGE_ID}?fields=access_token`)).access_token;
  const forms = (await graph(`${PAGE_ID}/leadgen_forms?fields=id,name&limit=100`, pageToken)).data || [];
  const leads = [];
  for (const form of forms) {
    let page = await graph(`${form.id}/leads?fields=created_time,field_data,platform&limit=100`, pageToken);
    while (page) {
      for (const lead of page.data || []) {
        const fields = {};
        for (const f of lead.field_data || []) fields[f.name] = (f.values || []).join(' ');
        const name = fields.full_name || fields.first_name || '';
        if (TEST_NAME.test(name)) continue;
        leads.push({
          time: lead.created_time,
          row: [israelDate(lead.created_time), name, localPhone(fields.phone_number), lead.platform === 'ig' ? 'מודעה - אינסטגרם' : 'מודעה - פייסבוק', 'חדש', `meta:${lead.id}`]
        });
      }
      page = page.paging && page.paging.next ? await graph(page.paging.next) : null;
    }
  }
  return leads;
}

const token = await googleToken();
const api = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
const auth = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
const tab = `'${SHEET.replace(/'/g, "''")}'`;

const current = await (await fetch(`${api}/values/${encodeURIComponent(`${tab}!A:F`)}`, { headers: auth })).json();
if (current.error) throw new Error('Sheets: ' + current.error.message);
const rows = current.values || []; // ends at the last row that has anything in A:F
const known = new Set(rows.map((r) => r[ID_COL]).filter(Boolean));
// 14.9.2026: Leah types notes into columns E/F, which wiped the hidden מזהה in F - so an ID check alone would
// re-add every lead. A phone number already in the tab (column C) also counts as "already there".
const digits = (p) => String(p || '').replace(/\D/g, '').replace(/^972/, '0').replace(/^(?=5)/, '0');
const knownPhones = new Set(rows.slice(1).map((r) => digits(r[2])).filter((p) => p.length >= 9));

const fresh = [];
for (const l of (await metaLeads()).sort((a, b) => a.time.localeCompare(b.time))) {
  const phone = digits(l.row[2]);
  if (known.has(l.row[ID_COL]) || knownPhones.has(phone)) continue;
  known.add(l.row[ID_COL]); knownPhones.add(phone);
  fresh.push(l.row);
}
const toWrite = rows.length ? fresh : [HEADER, ...fresh];

if (toWrite.length) {
  const start = rows.length + 1;
  const end = start + toWrite.length - 1;
  const meta = await (await fetch(`${api}?fields=sheets(properties(sheetId,title,gridProperties(rowCount)))`, { headers: auth })).json();
  if (meta.error) throw new Error('Sheets: ' + meta.error.message);
  const props = (meta.sheets || []).map((s) => s.properties).find((p) => p.title === SHEET);
  if (!props) throw new Error(`Sheets: tab "${SHEET}" not found`);
  if (end > props.gridProperties.rowCount) {
    const grow = await (await fetch(`${api}:batchUpdate`, {
      method: 'POST', headers: auth,
      body: JSON.stringify({ requests: [{ appendDimension: { sheetId: props.sheetId, dimension: 'ROWS', length: end - props.gridProperties.rowCount } }] })
    })).json();
    if (grow.error) throw new Error('Sheets add rows: ' + grow.error.message);
  }
  // Rows start..end are below the last used row, so they are empty: nothing existing is overwritten,
  // and the status dropdown already set on those rows stays.
  const res = await fetch(`${api}/values/${encodeURIComponent(`${tab}!A${start}:F${end}`)}?valueInputOption=RAW`, {
    method: 'PUT', headers: auth, body: JSON.stringify({ values: toWrite })
  });
  const json = await res.json();
  if (json.error) throw new Error('Sheets write: ' + json.error.message);
}
console.log(`${new Date().toISOString()} added ${fresh.length} new lead(s) to "${SHEET}"`);
