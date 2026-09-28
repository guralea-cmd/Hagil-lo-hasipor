// Creates a new PAUSED lead ad "כל כדור נגד כאבים" (version א - new animated logo at the end, original audio),
// in the same ad set as Samira's ad, same lead form, same OPT_OUT creative settings.
// Leah approved in writing 28.9 ("את יכולה להעלות את גרסה א... יחד עם סמירה על אותו תקציב").
// Built PAUSED so every placement preview is checked by eye before it runs.
import fs from 'fs';

const TOKEN = JSON.parse(fs.readFileSync('.claude/skills/facebook-ads-plan/secrets.json', 'utf8')).userAccessToken;
const API = 'https://graph.facebook.com/v21.0';
const ACT = 'act_2148850321876940';
const ADSET = '120248979725370543';
const PAGE = '2267713623553786';
const IG = '17841449558315010';
const FORM = '2934762870211090';
const FILE = process.argv[2];

// First line = Leah's own words from the original post of this video; the rest = Samira's ad text, unchanged.
const MESSAGE = 'כל המתאמנות שלנו יודעות שבסטודיו של לאה גורא יוצאים בריאים וחזקים יותר! השאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים\n\nלאה גורא -פילאטיס מכשירים ברמלה בשכונת יפה נוף, מקביל לקמפוס השפלה,';
const TITLE = 'לאה גורא - פילאטיס מכשירים ברמלה';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1. upload the video file to the ad account
const fd = new FormData();
fd.append('access_token', TOKEN);
fd.append('name', 'כל כדור נגד כאבים - גרסה א - לוגו חדש בסוף');
fd.append('source', new Blob([fs.readFileSync(FILE)], { type: 'video/mp4' }), 'kadur-a.mp4');
const up = await (await fetch(`${API}/${ACT}/advideos`, { method: 'POST', body: fd })).json();
console.log('העלאה:', JSON.stringify(up));
if (!up.id) process.exit(1);
const VIDEO = up.id;

// 2. wait until Meta finished processing
let st;
for (let i = 0; i < 60; i++) {
  st = await (await fetch(`${API}/${VIDEO}?fields=status,format&access_token=${TOKEN}`)).json();
  if (st.status?.video_status === 'ready') break;
  await sleep(5000);
}
console.log('עיבוד:', st.status?.video_status, (st.format || []).map(f => f.filter + ' ' + f.width + 'x' + f.height).join(' | '));
if (st.status?.video_status !== 'ready') process.exit(1);

const samira = await (await fetch(`${API}/120249200154380543?fields=creative{degrees_of_freedom_spec}&access_token=${TOKEN}`)).json();
const dof = samira.creative.degrees_of_freedom_spec;
const thumbs = await (await fetch(`${API}/${VIDEO}/thumbnails?access_token=${TOKEN}`)).json();
const thumb = (thumbs.data || []).find(t => t.is_preferred) || (thumbs.data || [])[0];

const creative = await (await fetch(`${API}/${ACT}/adcreatives`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    access_token: TOKEN,
    name: 'כל כדור נגד כאבים - קריאייטיב 28.9',
    object_story_spec: JSON.stringify({
      page_id: PAGE,
      instagram_user_id: IG,
      video_data: { video_id: VIDEO, title: TITLE, message: MESSAGE, image_url: thumb.uri,
        call_to_action: { type: 'SIGN_UP', value: { lead_gen_form_id: FORM } } },
    }),
    degrees_of_freedom_spec: JSON.stringify(dof),
  }),
})).json();
console.log('קריאייטיב:', JSON.stringify(creative));
if (creative.error) process.exit(1);

const ad = await (await fetch(`${API}/${ACT}/ads`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    access_token: TOKEN,
    name: 'כל כדור נגד כאבים - מודעת לידים (28.9)',
    adset_id: ADSET,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: 'PAUSED',
  }),
})).json();
console.log('מודעה:', JSON.stringify(ad));
if (ad.error) process.exit(1);
fs.writeFileSync('.claude/skills/facebook-ads-plan/kadur-ad-id.txt', ad.id + '\n' + VIDEO + '\n');
