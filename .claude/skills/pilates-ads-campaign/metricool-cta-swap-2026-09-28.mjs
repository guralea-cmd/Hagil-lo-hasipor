// Leah 28.9: every studio organic clip ends with the logo + "להשארת פרטים לחצי כאן" button (design 2).
// Replaces the media of every PENDING studio-brand (figura_ramla) post from now to 6.10 with the same file
// from images/pilates/cta-clips/. Same text, time and networks. New post first, then delete the old one.
// Usage: node metricool-cta-swap-2026-09-28.mjs [--dry]
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json", "utf8"));
const H = { "X-Mc-Auth": s.userToken, "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" };
const DRY = process.argv.includes("--dry");
const blogId = s.brands.figura_ramla.blogId;
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const now = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 19);
const list = await (await fetch(`${base}?userId=${s.userId}&blogId=${blogId}&start=${now}&end=2026-10-07T00:00:00&timezone=Asia/Jerusalem`, { headers: H })).json();
let ok = 0, skip = 0, fail = 0;
for (const it of list.data || []) {
  const g = await (await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${blogId}`, { headers: H })).json();
  const p = g.data || g;
  if (!p?.media) { console.log(it.id, "GET_FAIL"); fail++; continue; }
  if ((p.providers || []).some(x => x.status !== "PENDING")) { console.log(it.id, "NOT_PENDING"); skip++; continue; }
  const media = p.media.map(u => u.replace(/\/images\/pilates\/(week3-clips-silent|week4-clips)\//, "/images/pilates/cta-clips/"));
  if (JSON.stringify(media) === JSON.stringify(p.media)) { console.log(it.id, "ALREADY/NO_MATCH", p.media.join(",")); skip++; continue; }
  const body = { ...p, media, providers: p.providers.map(x => ({ network: x.network })) };
  for (const k of ["id", "creationDate", "uuid", "creatorUserMail", "creatorUserId", "hasNotReadNotes"]) delete body[k];
  if (DRY) { console.log(it.id, "DRY", p.publicationDate.dateTime, body.providers.map(x => x.network).join("+"), media[0].split("/").slice(-2).join("/")); ok++; continue; }
  const pj = await (await fetch(`${base}?userId=${s.userId}&blogId=${blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  const newId = pj?.data?.id;
  if (!newId) { console.log(it.id, "POST_FAIL", JSON.stringify(pj).slice(0, 200)); fail++; continue; }
  const del = await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${blogId}`, { method: "DELETE", headers: H });
  console.log(it.id, "OK new=" + newId, "del=" + del.status, p.publicationDate.dateTime, body.providers.map(x => x.network).join("+"), media[0].split("/").pop());
  ok++;
}
console.log(`done ok=${ok} skip=${skip} fail=${fail}`);
