// Swaps the video of the PAUSED ad "כל כדור נגד כאבים" (120249246879880543) to version א3
// (design-2 CTA ending, original audio). Same text, form and OPT_OUT settings. Ad stays PAUSED.
// Leah 28.9: "המודעה של הכדור נגד כאבים תפעילי מחר בבוקר".
import fs from 'fs';
const TOKEN = JSON.parse(fs.readFileSync('.claude/skills/facebook-ads-plan/secrets.json', 'utf8')).userAccessToken;
const API = 'https://graph.facebook.com/v21.0', ACT = 'act_2148850321876940', AD = '120249246879880543';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fd = new FormData();
fd.append('access_token', TOKEN);
fd.append('name', 'כל כדור נגד כאבים - א3 - סוף עיצוב 2');
fd.append('source', new Blob([fs.readFileSync(process.argv[2])], { type: 'video/mp4' }), 'kadur-a3.mp4');
const up = await (await fetch(`${API}/${ACT}/advideos`, { method: 'POST', body: fd })).json();
if (!up.id) { console.log('upload fail', JSON.stringify(up)); process.exit(1); }
let st; for (let i = 0; i < 60; i++) { st = await (await fetch(`${API}/${up.id}?fields=status&access_token=${TOKEN}`)).json(); if (st.status?.video_status === 'ready') break; await sleep(5000); }
if (st.status?.video_status !== 'ready') { console.log('not ready'); process.exit(1); }
const old = await (await fetch(`${API}/${AD}?fields=status,creative{object_story_spec,degrees_of_freedom_spec}&access_token=${TOKEN}`)).json();
if (old.status !== 'PAUSED') { console.log('ad not paused - stop', old.status); process.exit(1); }
const oss = old.creative.object_story_spec;
const thumbs = await (await fetch(`${API}/${up.id}/thumbnails?access_token=${TOKEN}`)).json();
const thumb = (thumbs.data || []).find(t => t.is_preferred) || thumbs.data[0];
oss.video_data.video_id = up.id; oss.video_data.image_url = thumb.uri; delete oss.video_data.image_hash;
const cr = await (await fetch(`${API}/${ACT}/adcreatives`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ access_token: TOKEN, name: 'כל כדור נגד כאבים - קריאייטיב א3 28.9', object_story_spec: JSON.stringify(oss), degrees_of_freedom_spec: JSON.stringify(old.creative.degrees_of_freedom_spec) }) })).json();
if (!cr.id) { console.log('creative fail', JSON.stringify(cr)); process.exit(1); }
const upd = await (await fetch(`${API}/${AD}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ access_token: TOKEN, creative: JSON.stringify({ creative_id: cr.id }), status: 'PAUSED' }) })).json();
console.log('video', up.id, 'creative', cr.id, 'update', JSON.stringify(upd));
