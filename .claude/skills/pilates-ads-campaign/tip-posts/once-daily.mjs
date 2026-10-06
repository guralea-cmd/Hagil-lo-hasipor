// Leah 2.10.2026 22:xx: "נפרסם רק פעם אחת ביום בשעה 10:00, טיפ אחד של הסטודיו ואחד של הגיל הוא לא הסיפור".
// Replaces the 3+3/day schedule from 3.10 with ONE post per day per channel at 10:00:
//  - studio FB+IG (figura_ramla) and TikTok (hagil account): alternate days - studio tip, then Hagil tip, ...
//  - Hagil FB+IG (hagil_lo_hasipor): one Hagil tip every day (only approved tips - the ones already scheduled).
// Payloads are copied from the existing scheduled posts (same approved text/images/first comment), only the time changes.
// Usage: node once-daily.mjs            -> dry run (prints plan)
//        node once-daily.mjs --apply    -> create new posts, then delete the old ones
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const APPLY = process.argv.includes("--apply");
const START = "2026-10-03", END = "2026-10-31";
const q = brand => `userId=${s.userId}&blogId=${s.brands[brand].blogId}`;
const list = async brand => ((await (await fetch(`${base}?${q(brand)}&start=${START}T00:00:00&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`, { headers: H })).json()).data || [])
  .filter(p => p.providers.every(x => x.status === "PENDING"));
const old = { hagil_lo_hasipor: await list("hagil_lo_hasipor"), figura_ramla: await list("figura_ramla") };
const kindOf = p => { const m = JSON.stringify(p.media); return /tip-posts\//.test(m) ? "studio" : /blog-tips\//.test(m) ? "hagil" : "other"; };
const keyOf = p => { const m = JSON.stringify(p.media); return (m.match(/tip-posts\/([a-z-]+?)(?:-fb)?\.jpg/) || m.match(/blog-tips\/(\d+)-v2/) || [])[1]; };
const net = p => p.providers[0].network;
// ordered queues of unique tips (by first scheduled time), with a payload per channel
const queue = kind => {
  const all = [...old.figura_ramla, ...old.hagil_lo_hasipor].filter(p => kindOf(p) === kind).sort((a, b) => a.publicationDate.dateTime < b.publicationDate.dateTime ? -1 : 1);
  const map = new Map();
  for (const p of all) { const k = keyOf(p); if (!k) continue; if (!map.has(k)) map.set(k, {}); const e = map.get(k); if (!e[net(p)]) e[net(p)] = p; }
  return [...map.entries()].map(([k, v]) => ({ k, ...v }));
};
const studioQ = queue("studio"), hagilQ = queue("hagil");
console.log("studio tips in queue:", studioQ.length, studioQ.map(x => x.k).join(","));
console.log("hagil tips in queue:", hagilQ.length, hagilQ.map(x => x.k).join(","));
const body = (src, dt) => ({ publicationDate: { dateTime: dt, timezone: "Asia/Jerusalem" }, text: src.text, providers: [{ network: net(src) }], media: src.media,
  autoPublish: true, draft: false, firstCommentText: src.firstCommentText || "", shortener: false, ...(net(src) === "tiktok" ? { tiktokData: { privacyOption: "PUBLIC_TO_EVERYONE", photoCoverIndex: 0 } } : {}) });
// CONFIRMED by Leah 2.10 ("כן נכון"): every day at 10:00 - 2 posts: one Hagil tip + one pilates tip, BOTH on ALL channels
// (studio FB+IG, Hagil FB+IG, TikTok). Nothing else that day. Hagil tips = only approved ones, while they last.
const plan = [];
let si = 0, hi = 0;
const allChannels = (t, dt) => [["figura_ramla", t.facebook, dt], ["figura_ramla", t.instagram, dt], ["hagil_lo_hasipor", t.facebook, dt], ["hagil_lo_hasipor", t.instagram, dt], ["hagil_lo_hasipor", t.tiktok, dt]];
for (let d = new Date(START + "T00:00:00Z"); d.toISOString().slice(0, 10) <= END; d.setUTCDate(d.getUTCDate() + 1)) {
  const dt = d.toISOString().slice(0, 10) + "T10:00:00";
  if (hi < hagilQ.length) plan.push(...allChannels(hagilQ[hi++], dt));
  plan.push(...allChannels(studioQ[si++ % studioQ.length], dt));
}
const missing = plan.filter(x => !x[1]);
if (missing.length) { console.log("MISSING payloads:", missing.length, missing.map(x => x[0] + " " + x[2]).join(" | ")); process.exit(1); }
for (const [brand, src, dt] of plan) console.log(dt.slice(0, 10), brand.padEnd(16), net(src).padEnd(9), kindOf(src), keyOf(src), "|", src.text.split("\n")[0].slice(0, 40));
const oldCount = old.figura_ramla.length + old.hagil_lo_hasipor.length;
console.log(`plan: create ${plan.length}, delete ${oldCount} old pending posts from ${START}`);
if (!APPLY) { console.log("DRY RUN - nothing changed"); process.exit(0); }
let ok = 0;
for (const [brand, src, dt] of plan) {
  const r = await (await fetch(`${base}?${q(brand)}`, { method: "POST", headers: H, body: JSON.stringify(body(src, dt)) })).json();
  if (r?.data?.id) ok++; else { console.log("CREATE FAIL", brand, dt, JSON.stringify(r).slice(0, 200)); console.log("STOPPING before any delete"); process.exit(1); }
}
console.log("created", ok);
let del = 0;
for (const [brand, posts] of Object.entries(old)) for (const p of posts) {
  const r = await fetch(`${base}/${p.id}?${q(brand)}`, { method: "DELETE", headers: H });
  if (r.ok) del++; else console.log("DELETE FAIL", brand, p.id, r.status);
}
console.log("deleted", del, "of", oldCount);
