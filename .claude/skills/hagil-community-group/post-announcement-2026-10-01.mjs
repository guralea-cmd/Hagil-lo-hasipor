// Leah 1.10 "מאשרת את יכולה להעלות את הכל": group announcement to 5 channels via Metricool, publish ~now.
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json; charset=utf-8"};
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const full = fs.readFileSync(".claude/skills/hagil-community-group/announcement-approved-2026-10-01.txt","utf8").replace(/\r/g,"").trim();
const lines = full.split("\n");
const fbText = full;
const igText = lines.slice(0,-2).join("\n") + "\nמחפשים בפייסבוק: הגיל הוא לא הסיפור";
const media = ["https://guralea.com/images/group/announce-2026-10-01.jpg"];
const t = new Date(Date.now() + 3*3600e3 + 4*60e3).toISOString().slice(0,16)+":00";
const DRY = process.argv.includes("--dry");
const jobs = [
  {blog:s.brands.hagil_lo_hasipor.blogId, net:"facebook", text:fbText, extra:{facebookData:{type:"POST"}}},
  {blog:s.brands.hagil_lo_hasipor.blogId, net:"instagram", text:igText, extra:{instagramData:{type:"POST",autoPublish:true}}},
  {blog:s.brands.hagil_lo_hasipor.blogId, net:"tiktok", text:igText, extra:{tiktokData:{privacyOption:"PUBLIC_TO_EVERYONE",photoCoverIndex:0}}},
  {blog:s.brands.figura_ramla.blogId, net:"facebook", text:fbText, extra:{facebookData:{type:"POST"}}},
  {blog:s.brands.figura_ramla.blogId, net:"instagram", text:igText, extra:{instagramData:{type:"POST",autoPublish:true}}},
];
for (const j of jobs) {
  const body = {publicationDate:{dateTime:t,timezone:"Asia/Jerusalem"}, text:j.text, providers:[{network:j.net}], media, autoPublish:true, draft:false, firstCommentText:"", shortener:false, ...j.extra};
  if (DRY) { console.log("DRY", j.blog, j.net, t, j.text.split("\n").slice(-1)[0]); continue; }
  const r = await (await fetch(`${base}?userId=${s.userId}&blogId=${j.blog}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
  console.log(j.blog, j.net, r?.data?.id ? "OK id="+r.data.id : "FAIL "+JSON.stringify(r).slice(0,250));
}
