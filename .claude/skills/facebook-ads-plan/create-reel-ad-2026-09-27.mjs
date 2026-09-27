// Creates a new PAUSED lead ad from Leah's own page reel 1675720589759858
// ("בדיוק כמוך... רוצה להעלים את הכאבים?" - Leah with trainees in the studio, 23.6s),
// in the same ad set as Samira's ad, same lead form, same OPT_OUT creative settings.
// Built PAUSED - Leah approves before it goes live (rule 78). Leah: "או קי" 27.9.2026.
import fs from 'fs';

const TOKEN = JSON.parse(fs.readFileSync('.claude/skills/facebook-ads-plan/secrets.json', 'utf8')).userAccessToken;
const API = 'https://graph.facebook.com/v21.0';
const ACT = 'act_2148850321876940';
const ADSET = '120248979725370543';
const PAGE = '2267713623553786';
const IG = '17841449558315010';
const FORM = '2934762870211090';
const VIDEO = '1675720589759858';

// Opening line = the reel's own burned-in caption; closing + address = Leah's approved wording from her earlier ads.
const MESSAGE = 'רוצה להעלים את הכאבים? השאירי מספר טלפון ונחזור אלייך בהקדם עם כל הפרטים\n\nלאה גורא -פילאטיס מכשירים ברמלה בשכונת יפה נוף, מקביל לקמפוס השפלה,';
const TITLE = 'לאה גורא - פילאטיס מכשירים ברמלה';

const samira = await (await fetch(`${API}/120249200154380543?fields=creative{degrees_of_freedom_spec}&access_token=${TOKEN}`)).json();
const dof = samira.creative.degrees_of_freedom_spec;

const thumbs = await (await fetch(`${API}/${VIDEO}/thumbnails?access_token=${TOKEN}`)).json();
const thumb = (thumbs.data || []).find(t => t.is_preferred) || (thumbs.data || [])[0];

const creative = await (await fetch(`${API}/${ACT}/adcreatives`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    access_token: TOKEN,
    name: 'בדיוק כמוך - ריל מהעמוד - קריאייטיב 27.9',
    object_story_spec: JSON.stringify({
      page_id: PAGE,
      instagram_user_id: IG,
      video_data: {
        video_id: VIDEO,
        title: TITLE,
        message: MESSAGE,
        image_url: thumb.uri,
        call_to_action: { type: 'SIGN_UP', value: { lead_gen_form_id: FORM } },
      },
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
    name: 'בדיוק כמוך - מודעת לידים (27.9)',
    adset_id: ADSET,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: 'PAUSED',
  }),
})).json();
console.log('מודעה:', JSON.stringify(ad));
if (ad.error) process.exit(1);

const link = await (await fetch(`${API}/${ad.id}?fields=preview_shareable_link,status,effective_status&access_token=${TOKEN}`)).json();
console.log('סטטוס:', link.status, '/', link.effective_status);
console.log('תצוגה מקדימה:', link.preview_shareable_link);

const all = await (await fetch(`${API}/${ADSET}/ads?fields=name,status,effective_status&access_token=${TOKEN}`)).json();
console.log('--- כל המודעות בקבוצה ---');
(all.data || []).forEach(a => console.log(a.name + '  ->  ' + a.status + ' / ' + a.effective_status));
