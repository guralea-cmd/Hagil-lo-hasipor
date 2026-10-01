// Rule 79 (Leah 27.9): replace the media of every pending 28-29.9 item with the silent copy.
// Same text, time and network - only week3-clips/ -> week3-clips-silent/. New post first, then delete the old one.
// Usage: node metricool-silent-swap-2026-09-27.mjs <pending.json> [--dry]
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const items = JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const DRY = process.argv.includes("--dry");
const base = `https://app.metricool.com/api/v2/scheduler/posts`;
for (const it of items) {
  const g = await (await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${it.blogId}`,{headers:H})).json();
  const p = g.data || g;
  if (!p || !p.media) { console.log(it.id, "GET_FAIL"); continue; }
  if ((p.providers||[]).some(x => x.status !== "PENDING")) { console.log(it.id, "NOT_PENDING - skipped"); continue; }
  const media = p.media.map(u => u.replace("/week3-clips/", "/week3-clips-silent/"));
  if (JSON.stringify(media) === JSON.stringify(p.media)) { console.log(it.id, "NO_MATCH", p.media.join(",")); continue; }
  const body = { ...p, media, providers: p.providers.map(x => ({ network: x.network })) };
  for (const k of ["id","creationDate","uuid","creatorUserMail","creatorUserId","hasNotReadNotes"]) delete body[k];
  if (body.providers.some(x => x.network === "tiktok")) body.tiktokData = { ...(body.tiktokData||{}), privacyOption: "PUBLIC_TO_EVERYONE" };
  if (DRY) { console.log(it.id, "DRY", p.publicationDate.dateTime, body.providers.map(x=>x.network).join("+"), media[0].split("/").slice(-2).join("/")); continue; }
  const pj = await (await fetch(`${base}?userId=${s.userId}&blogId=${it.blogId}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
  const newId = pj?.data?.id;
  if (!newId) { console.log(it.id, "POST_FAIL", JSON.stringify(pj).slice(0,200)); continue; }
  const del = await fetch(`${base}/${it.id}?userId=${s.userId}&blogId=${it.blogId}`,{method:"DELETE",headers:H});
  console.log(it.id, "OK new=" + newId, "del=" + del.status, p.publicationDate.dateTime, body.providers.map(x=>x.network).join("+"), media[0].split("/").pop());
}
