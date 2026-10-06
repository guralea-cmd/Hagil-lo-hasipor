// Leah 1.10: tip posts also on the existing TikTok (hagil_lo_hasipor brand), same cycle & slots as the studio.
// Usage: node tiktok.mjs <untilDate>  - fills every 07:30/12:30/19:30 slot from 2.10 that has no TikTok post yet.
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const blog = s.brands.hagil_lo_hasipor.blogId, base = "https://app.metricool.com/api/v2/scheduler/posts", q = `userId=${s.userId}&blogId=${blog}`;
const posts = JSON.parse(fs.readFileSync(".claude/skills/pilates-ads-campaign/tip-posts/posts.json","utf8"));
const until = process.argv[2];
const list = (await (await fetch(`${base}?${q}&start=2026-10-02T00:00:00&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`,{headers:H})).json()).data||[];
const taken = new Set(list.filter(p=>p.providers[0].network==="tiktok").map(p=>p.publicationDate.dateTime));
const SLOTS=["07:30","12:30","19:30"]; let n=0;
for (let i=0;;i++) {
  const d = new Date(Date.UTC(2026,9,2+Math.floor(i/3))).toISOString().slice(0,10); if (d>until) break;
  const dt = `${d}T${SLOTS[i%3]}:00`; if (taken.has(dt)) continue;
  const p = posts[i%posts.length];
  const body = {publicationDate:{dateTime:dt,timezone:"Asia/Jerusalem"}, text:p.lines.join("\n")+"\nרוצה לדעת מה את צריכה לעשות במצב הזה?\nהקישור בפרופיל", providers:[{network:"tiktok"}], media:[`https://guralea.com/images/pilates/tip-posts/${p.slug}.jpg`], autoPublish:true, draft:false, firstCommentText:"", shortener:false, tiktokData:{privacyOption:"PUBLIC_TO_EVERYONE",photoCoverIndex:0}};
  const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
  if (!r?.data?.id) console.log("FAIL",dt,JSON.stringify(r).slice(0,150)); else n++;
}
console.log("tiktok created",n,"through",until);
