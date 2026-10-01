// Leah 1.10: the CTA arrow in organic clips must point at something clickable.
// FB POST: first line "להשארת פרטים לחצי כאן: <link>" + first comment with the same line.
// IG REEL/POST: first line "להשארת פרטים - הקישור בפרופיל". Stories untouched.
// Re-creates each PENDING studio post (figura_ramla) with the new text, then deletes the old one.
// Usage: node metricool-link-line-2026-10-01.mjs [--dry]
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json", "utf8"));
const H = { "X-Mc-Auth": s.userToken, "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" };
const DRY = process.argv.includes("--dry");
const blogId = s.brands.figura_ramla.blogId;
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const FB = "להשארת פרטים לחצי כאן: https://guraleapilates.com/contact/";
const IG = "להשארת פרטים - הקישור בפרופיל";
const now = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 19);
const list = await (await fetch(`${base}?userId=${s.userId}&blogId=${blogId}&start=${now}&end=2026-10-07T00:00:00&timezone=Asia/Jerusalem`, { headers: H })).json();
let ok = 0, skip = 0, fail = 0;
for (const it of list.data || []) {
  const p = (await (await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${blogId}`, { headers: H })).json()).data;
  if (!p) { console.log(it.id, "GET_FAIL"); fail++; continue; }
  if ((p.providers || []).some(x => x.status !== "PENDING")) { skip++; continue; }
  const net = p.providers.map(x => x.network).join("+");
  const isFbPost = net === "facebook" && p.facebookData?.type === "POST";
  const isIgFeed = net === "instagram" && ["REEL", "POST"].includes(p.instagramData?.type);
  if (!isFbPost && !isIgFeed) { skip++; continue; }
  const line = isFbPost ? FB : IG;
  if (p.text.startsWith(line)) { console.log(it.id, "ALREADY"); skip++; continue; }
  const body = { ...p, text: line + "\n\n" + p.text, providers: p.providers.map(x => ({ network: x.network })) };
  if (isFbPost) body.firstCommentText = FB;
  for (const k of ["id", "creationDate", "uuid", "creatorUserMail", "creatorUserId", "hasNotReadNotes"]) delete body[k];
  if (DRY) { console.log(it.id, "DRY", p.publicationDate.dateTime, net, p.facebookData?.type || p.instagramData?.type); ok++; continue; }
  const pj = await (await fetch(`${base}?userId=${s.userId}&blogId=${blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  const newId = pj?.data?.id;
  if (!newId) { console.log(it.id, "POST_FAIL", JSON.stringify(pj).slice(0, 200)); fail++; continue; }
  const del = await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${blogId}`, { method: "DELETE", headers: H });
  console.log(it.id, "OK new=" + newId, "del=" + del.status, p.publicationDate.dateTime, net);
  ok++;
}
console.log(`done ok=${ok} skip=${skip} fail=${fail}`);
