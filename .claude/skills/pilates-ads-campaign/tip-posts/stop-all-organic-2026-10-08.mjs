// Leah 7.10.2026 02:55: "אל תעלי שום דבר באורגני, כלום כלום כלום. אנחנו מתחילים דרך חדשה" -> delete every PENDING Metricool post from 8.10 on, both brands.
// Backup first (full post objects) so anything can be recreated. Usage: node stop-all-organic-2026-10-08.mjs [--apply]
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const APPLY = process.argv.includes("--apply");
const backup = {};
let total = 0;
for (const [brand, b] of Object.entries(s.brands)) {
  const j = await (await fetch(`${base}?userId=${s.userId}&blogId=${b.blogId}&start=2026-10-08T00:00:00&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`, { headers: H })).json();
  const pending = (j.data || []).filter(p => p.providers.every(x => x.status === "PENDING"));
  backup[brand] = pending; total += pending.length;
  const kinds = {}; for (const p of pending) { const k = /^סטורי - קבוצה/.test(p.text) ? "group-story" : /^סטורי - טיפ/.test(p.text) ? "tip-story" : /blog-tips\//.test(JSON.stringify(p.media)) ? "hagil-tip" : /tip-posts\//.test(JSON.stringify(p.media)) ? "pilates-tip" : "other"; kinds[k] = (kinds[k] || 0) + 1; }
  console.log(brand, "pending from 8.10:", pending.length, JSON.stringify(kinds), "dates", pending.map(p => p.publicationDate.dateTime.slice(0, 10)).sort()[0], "->", pending.map(p => p.publicationDate.dateTime.slice(0, 10)).sort().pop());
}
fs.writeFileSync(`${ROOT}/.claude/skills/pilates-ads-campaign/tip-posts/backup-stop-all-2026-10-08.json`, JSON.stringify(backup, null, 1));
console.log("backup written, total", total);
if (!APPLY) { console.log("DRY RUN"); process.exit(0); }
let del = 0, fail = 0;
for (const [brand, posts] of Object.entries(backup)) for (const p of posts) {
  const r = await fetch(`${base}/${p.id}?userId=${s.userId}&blogId=${s.brands[brand].blogId}`, { method: "DELETE", headers: H });
  if (r.ok) del++; else { fail++; console.log("DELETE FAIL", brand, p.id, r.status); }
}
console.log("deleted", del, "failed", fail);
for (const [brand, b] of Object.entries(s.brands)) {
  const j = await (await fetch(`${base}?userId=${s.userId}&blogId=${b.blogId}&start=2026-10-08T00:00:00&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`, { headers: H })).json();
  console.log(brand, "still pending from 8.10:", (j.data || []).filter(p => p.providers.every(x => x.status === "PENDING")).length);
}
