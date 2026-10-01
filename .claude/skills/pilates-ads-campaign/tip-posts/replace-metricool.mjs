// Leah 1.10: "תורידי את כל מה שהכנסת למטריקול ותכניסי את כל הטקסטים החדשים... מעכשיו רק פוסטים כאלה"
// 1) back up + delete every PENDING studio (figura_ramla) post from now on
// 2) schedule the 16 tip posts: 1/day 19:30 from 4.10 (after Sukkot), FB link post + IG image post
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const blog = s.brands.figura_ramla.blogId, base = "https://app.metricool.com/api/v2/scheduler/posts", q = `userId=${s.userId}&blogId=${blog}`;
const DIR = ".claude/skills/pilates-ads-campaign/tip-posts/";
const step = process.argv[2];
if (step === "delete") {
  const now = new Date(Date.now()+3*3600e3).toISOString().slice(0,19);
  const list = (await (await fetch(`${base}?${q}&start=${now}&end=2026-12-31T23:59:59&timezone=Asia/Jerusalem`,{headers:H})).json()).data||[];
  const pend = [];
  for (const it of list) { const p = (await (await fetch(`${base}/${it.id}?${q}`,{headers:H})).json()).data; if (p && p.providers.every(x=>x.status==="PENDING")) pend.push(p); }
  fs.writeFileSync(DIR+"backup-pending-2026-10-01.json", JSON.stringify(pend,null,1));
  let d=0; for (const p of pend) { const r = await fetch(`${base}/${p.id}?${q}`,{method:"DELETE",headers:H}); if (r.ok) d++; else console.log("DEL_FAIL",p.id,r.status); }
  console.log(`backed up ${pend.length}, deleted ${d}`);
}
if (step === "create") {
  const posts = JSON.parse(fs.readFileSync(DIR+"posts.json","utf8"));
  const igText = p => p.lines.join("\n") + "\nרוצה לדעת מה את צריכה לעשות במצב הזה?\nהקישור בפרופיל";
  const ids = [];
  for (let i=0;i<posts.length;i++) {
    const p = posts[i]; const day = new Date(Date.UTC(2026,9,2+i)).toISOString().slice(0,10); /* every day incl. Shabbat/holidays (Leah 1.10) */ const dt = `${day}T19:30:00`;
    const jobs = [
      {network:"facebook", text:p.fb, media:[], extra:{facebookData:{type:"POST"}}},
      {network:"instagram", text:igText(p), media:[`https://guralea.com/images/pilates/tip-posts/${p.slug}.jpg`], extra:{instagramData:{type:"POST",autoPublish:true}}},
    ];
    for (const j of jobs) {
      const body = {publicationDate:{dateTime:dt,timezone:"Asia/Jerusalem"}, text:j.text, providers:[{network:j.network}], media:j.media, autoPublish:true, draft:false, firstCommentText:"", shortener:false, ...j.extra};
      const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
      const id = r?.data?.id; ids.push({slug:p.slug,dt,network:j.network,id});
      console.log(dt, j.network, p.slug, id ? "OK "+id : "FAIL "+JSON.stringify(r).slice(0,200));
    }
  }
  fs.writeFileSync(DIR+"scheduled-ids.json", JSON.stringify(ids,null,1));
}
