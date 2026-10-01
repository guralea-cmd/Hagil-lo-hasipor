// Leah 1.10: "הגיל הוא לא הסיפור" = same method as the studio. 3/day 08:30/13:30/20:30 (studio TikTok uses 07:30/12:30/19:30),
// FB page + IG lea_gura + TikTok. FB: image + title + opening + CTA "...בתגובה הראשונה", first comment = title + link to the exact blog post.
// Usage: node schedule.mjs delete-old | node schedule.mjs create <untilDate>
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const blog = s.brands.hagil_lo_hasipor.blogId, base = "https://app.metricool.com/api/v2/scheduler/posts", q = `userId=${s.userId}&blogId=${blog}`;
const DIR = ".claude/skills/hagil-community-group/blog-tips/";
const all = async () => (await (await fetch(`${base}?${q}&start=${new Date(Date.now()+3*3600e3).toISOString().slice(0,19)}&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`,{headers:H})).json()).data||[];
if (process.argv[2]==="delete-old") {
  const old = (await all()).filter(p=>!(p.media[0]||"").includes("/tip-posts/") && !(p.media[0]||"").includes("/blog-tips/") && p.providers.every(x=>x.status==="PENDING"));
  fs.writeFileSync(DIR+"backup-old-hagil-2026-10-01.json", JSON.stringify(old,null,1));
  let d=0; for (const p of old) if ((await fetch(`${base}/${p.id}?${q}`,{method:"DELETE",headers:H})).ok) d++;
  console.log("backed up",old.length,"deleted",d);
}
if (process.argv[2]==="create") {
  const until = process.argv[3], posts = JSON.parse(fs.readFileSync(DIR+"posts.json","utf8"));
  const taken = new Set((await all()).filter(p=>(p.media[0]||"").includes("/blog-tips/")).map(p=>p.publicationDate.dateTime+p.providers[0].network));
  const CTA_FB = "רוצה לדעת מה את צריכה לעשות במצב הזה? לחצי על הלינק בתגובה הראשונה";
  const CTA_IG = "רוצה לדעת מה את צריכה לעשות במצב הזה?\nהקישור בפרופיל";
  const SLOTS = ["08:30","13:30","20:30"]; let n=0;
  for (let i=0;;i++) {
    const d = new Date(Date.UTC(2026,9,2+Math.floor(i/3))).toISOString().slice(0,10); if (d>until) break;
    const dt = `${d}T${SLOTS[i%3]}:00`, p = posts[i%posts.length];
    const jobs = [
      {network:"facebook", text:`${p.title}\n${p.open}\n${CTA_FB}`, extra:{facebookData:{type:"POST"}, firstCommentText:`${p.title}\n${p.url}`}},
      {network:"instagram", text:`${p.title}\n${p.open}\n${CTA_IG}`, extra:{instagramData:{type:"POST",autoPublish:true}}},
      {network:"tiktok", text:`${p.title}\n${p.open}\n${CTA_IG}`, extra:{tiktokData:{privacyOption:"PUBLIC_TO_EVERYONE",photoCoverIndex:0}}},
    ];
    for (const j of jobs) {
      if (taken.has(dt+j.network)) continue;
      const body = {publicationDate:{dateTime:dt,timezone:"Asia/Jerusalem"}, text:j.text, providers:[{network:j.network}], media:[p.img], autoPublish:true, draft:false, firstCommentText:"", shortener:false, ...j.extra};
      const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
      if (!r?.data?.id) console.log("FAIL",dt,j.network,JSON.stringify(r).slice(0,150)); else n++;
    }
  }
  console.log("created",n,"through",until);
}
