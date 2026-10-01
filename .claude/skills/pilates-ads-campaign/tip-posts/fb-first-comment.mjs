// Leah 1.10: "תעשי הכל... כמו כולם - הקישור בתגובה הראשונה". FB posts: black-red image (native, no link in text),
// last line "רוצה לדעת מה את צריכה לעשות במצב הזה? לחצי על הלינק בתגובה הראשונה", first comment = article title + link.
// Re-creates each PENDING studio FB tip post with the new format, then deletes the old one.
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const blog = s.brands.figura_ramla.blogId, base = "https://app.metricool.com/api/v2/scheduler/posts", q = `userId=${s.userId}&blogId=${blog}`;
const posts = JSON.parse(fs.readFileSync(".claude/skills/pilates-ads-campaign/tip-posts/posts.json","utf8"));
export const CTA_FB = "רוצה לדעת מה את צריכה לעשות במצב הזה? לחצי על הלינק בתגובה הראשונה";
const now = new Date(Date.now()+3*3600e3).toISOString().slice(0,19);
const list = (await (await fetch(`${base}?${q}&start=${now}&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`,{headers:H})).json()).data||[];
let ok=0, skip=0, fail=0;
for (const it of list) {
  if (it.providers[0].network!=="facebook" || it.providers[0].status!=="PENDING") { skip++; continue; }
  const p = (await (await fetch(`${base}/${it.id}?${q}`,{headers:H})).json()).data;
  const art = posts.find(x=>x.lines[0]===p.text.split("\n")[0]);
  if (!art) { console.log(it.id,"NO_ARTICLE"); fail++; continue; }
  if (p.text.endsWith(CTA_FB)) { skip++; continue; }
  const body = {...p, text: art.lines.join("\n")+"\n"+CTA_FB, media:[`https://guralea.com/images/pilates/tip-posts/${art.slug}.jpg`], firstCommentText: `${art.title}\n${art.url}`, providers:p.providers.map(x=>({network:x.network}))};
  for (const k of ["id","creationDate","uuid","creatorUserMail","creatorUserId","hasNotReadNotes"]) delete body[k];
  const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
  if (!r?.data?.id) { console.log(it.id,"POST_FAIL",JSON.stringify(r).slice(0,150)); fail++; continue; }
  await fetch(`${base}/${it.id}?${q}`,{method:"DELETE",headers:H}); ok++;
}
console.log(`ok=${ok} skip=${skip} fail=${fail}`);
