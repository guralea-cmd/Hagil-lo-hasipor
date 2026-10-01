// Schedules APPROVED Hagil article posts (scene+q, Leah's template) into the next free 08:30/13:30/20:30 slots, both brands.
// FB: image -v2-fb + text "scene\nq\nכנסי לתגובה הראשונה ותראי", first comment = title + link. IG/TikTok: image -v2-ig + "...\nהקישור בפרופיל".
// Usage: node schedule-approved.mjs <slugs n,n,...> <startDate YYYY-MM-DD> <startSlotIndex 0|1|2>
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const posts = JSON.parse(fs.readFileSync(".claude/skills/hagil-community-group/blog-tips/posts.json","utf8"));
const ns = process.argv[2].split(",").map(Number); let [d, si] = [process.argv[3], +process.argv[4]];
const SLOTS = ["08:30","13:30","20:30"];
for (const n of ns) {
  const p = posts.find(x=>x.n===n); if (!p?.approved) { console.log("NOT APPROVED", n); continue; }
  const dt = `${d}T${SLOTS[si]}:00`;
  for (const [brand, nets] of [["hagil_lo_hasipor",["facebook","instagram","tiktok"]],["figura_ramla",["facebook","instagram"]]]) {
    const q = `userId=${s.userId}&blogId=${s.brands[brand].blogId}`;
    for (const net of nets) {
      const fb = net==="facebook";
      const body = {publicationDate:{dateTime:dt,timezone:"Asia/Jerusalem"}, text:`${p.scene}\n${p.q}\n${fb?"כנסי לתגובה הראשונה ותראי":"הקישור בפרופיל"}`, providers:[{network:net}], media:[`https://guralea.com/images/blog-tips/${n}-v2-${fb?"fb":"ig"}.jpg`], autoPublish:true, draft:false, firstCommentText: fb?`${p.title}\n${p.url}`:"", shortener:false,
        ...(fb?{facebookData:{type:"POST"}}:net==="instagram"?{instagramData:{type:"POST",autoPublish:true}}:{tiktokData:{privacyOption:"PUBLIC_TO_EVERYONE",photoCoverIndex:0}})};
      const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
      console.log(dt, brand, net, n, r?.data?.id ? "OK" : "FAIL "+JSON.stringify(r).slice(0,120));
    }
  }
  si++; if (si===3) { si=0; const x=new Date(d+"T00:00:00Z"); x.setUTCDate(x.getUTCDate()+1); d=x.toISOString().slice(0,10); }
}
