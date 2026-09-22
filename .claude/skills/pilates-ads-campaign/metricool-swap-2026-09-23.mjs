import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json"};
const MAP = { "v049-f":"p138-f","v049-sv":"p138-sv","v049-tv":"p138-tv","v096-f":"p120-f","v096-sv":"p120-sv","v096-tv":"p120-tv" };
const TARGETS = [
  ["6694827",378703145],["6694827",378703147],["6694827",378703148],["6694827",379197585],["6694827",379197589],
  ["6684336",378703153],["6684336",378703154],["6684336",378703155],["6684336",379197909],
  ["6694827",378703157],["6694827",378703158],["6694827",378703160],["6694827",379197596],["6694827",379197664],
  ["6684336",378703164],["6684336",378703165],["6684336",378703171],["6684336",379197917]
];
const DRY = process.argv.includes("--dry");
const log = [];
for (const [blogId,id] of TARGETS) {
  const g = await fetch(`https://app.metricool.com/api/v2/scheduler/posts/${id}?userId=${s.userId}&blogId=${blogId}`,{headers:H});
  const gj = await g.json(); const p = gj.data||gj;
  if (!p || !p.media) { log.push([id,"GET_FAIL",JSON.stringify(gj).slice(0,120)]); continue; }
  const newMedia = p.media.map(u => { let n=u; for (const [a,b] of Object.entries(MAP)) n = n.replace(a+".mp4", b+".mp4"); return n; });
  if (JSON.stringify(newMedia)===JSON.stringify(p.media)) { log.push([id,"NO_MEDIA_MATCH",p.media.join(",")]); continue; }
  const body = { ...p, media:newMedia, providers:p.providers.map(x=>({network:x.network})) };
  delete body.id; delete body.creationDate; delete body.uuid; delete body.creatorUserMail; delete body.creatorUserId; delete body.hasNotReadNotes;
  if (DRY) { log.push([id,"DRY",newMedia.join(",")]); continue; }
  const post = await fetch(`https://app.metricool.com/api/v2/scheduler/posts?userId=${s.userId}&blogId=${blogId}`,{method:"POST",headers:H,body:JSON.stringify(body)});
  const pj = await post.json();
  const newId = pj?.data?.id;
  if (!newId) { log.push([id,"POST_FAIL",JSON.stringify(pj).slice(0,160)]); continue; }
  const del = await fetch(`https://app.metricool.com/api/v2/scheduler/posts/${id}?userId=${s.userId}&blogId=${blogId}`,{method:"DELETE",headers:H});
  log.push([id,"OK","new="+newId+" del="+del.status+" "+newMedia[0].split("/").pop()]);
}
console.log(log.map(r=>r.join(" | ")).join("\n"));
