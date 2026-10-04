// Schedules approved Hagil tips at 10:00 (one per day) exactly like the live 3.10 layout:
// hagil_lo_hasipor: facebook + instagram + tiktok ; figura_ramla: facebook + instagram.
// Payload copied from live posts 386963336/341/344/329. Usage: node schedule-1000.mjs 44,43,... [--apply]  (uses p.slot from posts.json)
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const APPLY = process.argv.includes("--apply");
const ns = process.argv[2].split(",").map(Number);
const posts = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/posts.json`, "utf8"));
const plan = [];
for (const n of ns) {
  const p = posts.find(x => x.n === n);
  if (!p?.approved || !p.scene || !p.q || !p.slot) { console.log("SKIP (not approved / no slot)", n); continue; }
  for (const [brand, nets] of [["hagil_lo_hasipor", ["facebook", "instagram", "tiktok"]], ["figura_ramla", ["facebook", "instagram"]]]) for (const net of nets) {
    const fb = net === "facebook";
    plan.push([brand, net, n, { publicationDate: { dateTime: p.slot, timezone: "Asia/Jerusalem" },
      text: `${p.scene}\n${p.q}\n${fb ? "כנסי לתגובה הראשונה ותראי" : "הקישור בפרופיל"}`, providers: [{ network: net }],
      media: [`https://guralea.com/images/blog-tips/${n}-v2-${fb ? "fb" : "ig"}.jpg`], autoPublish: true, draft: false,
      firstCommentText: fb ? `${p.title}\n${p.url}` : "", shortener: false,
      ...(fb ? { facebookData: { type: "POST" } } : net === "instagram" ? { instagramData: { type: "POST", autoPublish: true } } : { tiktokData: { privacyOption: "PUBLIC_TO_EVERYONE", photoCoverIndex: 0 } }) }]);
  }
}
console.log("plan:", plan.length, "posts"); for (const [b, net, n, body] of plan) console.log(body.publicationDate.dateTime.slice(0, 10), b.padEnd(16), net.padEnd(9), n);
if (!APPLY) { console.log("DRY RUN"); process.exit(0); }
const ids = [];
for (const [brand, net, n, body] of plan) {
  const r = await (await fetch(`${base}?userId=${s.userId}&blogId=${s.brands[brand].blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  if (r?.data?.id) { ids.push({ id: r.data.id, brand, net, n, slot: body.publicationDate.dateTime }); console.log("OK", body.publicationDate.dateTime.slice(0, 10), brand, net, n, r.data.id); }
  else { console.log("FAIL", brand, net, n, JSON.stringify(r).slice(0, 200)); }
}
fs.writeFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/scheduled-2026-10-04.json`, JSON.stringify(ids, null, 1));
console.log("created", ids.length, "of", plan.length);
