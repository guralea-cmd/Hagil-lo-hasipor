// Restores the Facebook + Instagram feed placements on Leah's studio lead ad set,
// keeping Messenger / Audience Network / Marketplace / notifications off (her explicit instruction).
// Approved by Leah 27.9.2026: "אוקיי תעשי את שניהם ונראה מה יהיה עכשיו".
import fs from 'fs';

const ADSET = '120248979725370543';
const TOKEN = JSON.parse(fs.readFileSync('.claude/skills/facebook-ads-plan/secrets.json', 'utf8')).userAccessToken;
const API = 'https://graph.facebook.com/v21.0';

const before = await (await fetch(`${API}/${ADSET}?fields=targeting,effective_status,daily_budget&access_token=${TOKEN}`)).json();
const t = before.targeting;
console.log('לפני  | פייסבוק:', JSON.stringify(t.facebook_positions), '| אינסטגרם:', JSON.stringify(t.instagram_positions));

t.facebook_positions = ['feed', 'story', 'facebook_reels'];
t.instagram_positions = ['stream', 'story', 'reels'];

const res = await (await fetch(`${API}/${ADSET}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ access_token: TOKEN, targeting: JSON.stringify(t) }),
})).json();
console.log('תגובת מטא:', JSON.stringify(res));

await new Promise(r => setTimeout(r, 2500));
const after = await (await fetch(`${API}/${ADSET}?fields=targeting,effective_status,daily_budget&access_token=${TOKEN}`)).json();
console.log('אחרי | סטטוס:', after.effective_status, '| תקציב:', after.daily_budget);
console.log('אחרי | פייסבוק:', JSON.stringify(after.targeting.facebook_positions));
console.log('אחרי | אינסטגרם:', JSON.stringify(after.targeting.instagram_positions));
console.log('אחרי | פלטפורמות:', JSON.stringify(after.targeting.publisher_platforms));
