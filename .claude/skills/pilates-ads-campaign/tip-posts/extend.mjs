// Leah 1.10: keep the 16-pain cycle going, 3/day (07:30/12:30/19:30) every day; new articles join the cycle.
// Usage: node extend.mjs <untilDate YYYY-MM-DD>  - continues from the last scheduled slot, never duplicates a slot.
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const blog = s.brands.figura_ramla.blogId, base = "https://app.metricool.com/api/v2/scheduler/posts", q = `userId=${s.userId}&blogId=${blog}`;
const DIR = ".claude/skills/pilates-ads-campaign/tip-posts/";
const until = process.argv[2];
const posts = JSON.parse(fs.readFileSync(DIR+"posts.json","utf8"));
const missing = posts.filter(p=>!fs.existsSync(`images/pilates/tip-posts/${p.slug}.jpg`));
if (missing.length) { console.log("MISSING IG image:", missing.map(p=>p.slug).join(",")); process.exit(1); }
const list = (await (await fetch(`${base}?${q}&start=2026-10-01T00:00:00&end=2027-12-31T00:00:00&timezone=Asia/Jerusalem`,{headers:H})).json()).data||[];
const fbs = list.filter(p=>p.providers[0].network==="facebook").sort((a,b)=>a.publicationDate.dateTime.localeCompare(b.publicationDate.dateTime));
const taken = new Set(list.map(p=>p.publicationDate.dateTime+p.providers[0].network));
const last = fbs[fbs.length-1];
const lastSlug = (last.text.match(/articles\/([^/]+)\//)||[])[1];
let idx = (posts.findIndex(p=>p.slug===lastSlug)+1) % posts.length;
const SLOTS=["07:30","12:30","19:30"];
let [d,t] = last.publicationDate.dateTime.split("T"); let si = SLOTS.indexOf(t.slice(0,5));
const igText = p => p.lines.join("\n") + "\nרוצה לדעת מה את צריכה לעשות במצב הזה?\nהקישור בפרופיל";
let n=0;
while (true) {
  si++; if (si===3) { si=0; const x=new Date(d+"T00:00:00Z"); x.setUTCDate(x.getUTCDate()+1); d=x.toISOString().slice(0,10); }
  if (d > until) break;
  const dt = `${d}T${SLOTS[si]}:00`, p = posts[idx]; idx=(idx+1)%posts.length;
  for (const j of [{network:"facebook",text:p.lines.join("
")+"
רוצה לדעת מה את צריכה לעשות במצב הזה? לחצי על הלינק בתגובה הראשונה",media:[`https://guralea.com/images/pilates/tip-posts/${p.slug}.jpg`],extra:{facebookData:{type:"POST"},firstCommentText:`${p.title}
${p.url}`}},{network:"instagram",text:igText(p),media:[`https://guralea.com/images/pilates/tip-posts/${p.slug}.jpg`],extra:{instagramData:{type:"POST",autoPublish:true}}}]) {
    if (taken.has(dt+j.network)) continue;
    const body={publicationDate:{dateTime:dt,timezone:"Asia/Jerusalem"},text:j.text,providers:[{network:j.network}],media:j.media,autoPublish:true,draft:false,firstCommentText:"",shortener:false,...j.extra};
    const r = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
    if (!r?.data?.id) console.log("FAIL",dt,j.network,JSON.stringify(r).slice(0,150)); else n++;
  }
}
console.log("created",n,"through",until);
