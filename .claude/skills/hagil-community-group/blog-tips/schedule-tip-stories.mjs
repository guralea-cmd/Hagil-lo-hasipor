// Leah 5.10.2026 ("הסטורי יכול להיות אוטומטי"): the day's 2 tips also go up as automatic Stories at 10:00 via Metricool.
// hagil_lo_hasipor: FB+IG STORY with the Hagil tip story image; figura_ramla: FB+IG STORY x2 (Hagil tip + pilates tip). No link sticker via API.
// Source of truth for which tip is on which day: pilates-ads-campaign/tip-posts/today-posts.json. Usage: node schedule-tip-stories.mjs <from> <to> [--apply]
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const [from, to] = process.argv.slice(2); const APPLY = process.argv.includes("--apply");
const days = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/pilates-ads-campaign/tip-posts/today-posts.json`, "utf8"));
const storyImg = it => it.kind === "hagil" ? `https://guralea.com/images/blog-tips/story/${it.url.match(/blog-post-(\d+)/)[1]}.jpg` : `https://guralea.com/images/pilates/tip-posts/story/${it.url.match(/articles\/([a-z-]+)/)[1]}.jpg`;
const plan = [];
for (const d of Object.keys(days).sort().filter(d => d >= from && d <= to)) {
  const items = days[d]; const hagil = items.find(x => x.kind === "hagil"), pil = items.find(x => x.kind === "pilates");
  if (hagil) plan.push(["hagil_lo_hasipor", d, hagil]);
  if (hagil) plan.push(["figura_ramla", d, hagil]);
  if (pil) plan.push(["figura_ramla", d, pil]);
}
// verify every image is live
const urls = [...new Set(plan.map(([, , it]) => storyImg(it)))]; let bad = 0;
for (const u of urls) { let ok = false; for (let t = 0; t < 3 && !ok; t++) { try { ok = (await fetch(u, { method: "HEAD" })).ok; } catch { } } if (!ok) { console.log("MISSING", u); bad++; } }
console.log("plan:", plan.length, "stories over", new Set(plan.map(p => p[1])).size, "days;", urls.length, "images,", bad, "missing");
if (bad) process.exit(1);
if (!APPLY) { for (const [b, d, it] of plan) console.log(d, b.padEnd(16), it.kind.padEnd(7), storyImg(it).split("/").pop()); console.log("DRY RUN"); process.exit(0); }
const out = [];
for (const [brand, d, it] of plan) {
  const body = { publicationDate: { dateTime: `${d}T10:00:00`, timezone: "Asia/Jerusalem" }, text: `סטורי - ${it.kind === "hagil" ? "טיפ הגיל" : "טיפ פילאטיס"} - ${it.title}`,
    providers: [{ network: "facebook" }, { network: "instagram" }], media: [storyImg(it)], autoPublish: true, draft: false, firstCommentText: "", shortener: false,
    facebookData: { type: "STORY" }, instagramData: { type: "STORY", autoPublish: true } };
  const r = await (await fetch(`${base}?userId=${s.userId}&blogId=${s.brands[brand].blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  if (r?.data?.id) out.push({ id: r.data.id, brand, date: d, kind: it.kind, img: storyImg(it) }); else console.log("FAIL", brand, d, it.kind, JSON.stringify(r).slice(0, 200));
}
fs.writeFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/tip-stories-${from}.json`, JSON.stringify(out, null, 1));
console.log("created", out.length, "of", plan.length);
