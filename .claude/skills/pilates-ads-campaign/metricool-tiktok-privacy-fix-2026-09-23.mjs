// 23.9 - Leah: add "ציבורי לכולם" to every scheduled TikTok item that lacks it.
// Metricool does not edit via PUT, so: GET -> POST copy with tiktokData.privacyOption -> verify -> DELETE old.
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json","utf8"));
const H = {"X-Mc-Auth": s.userToken, "Accept":"application/json", "Content-Type":"application/json"};
const B = "6694827";
const base = `https://app.metricool.com/api/v2/scheduler/posts`;
const q = `userId=${s.userId}&blogId=${B}`;
const ids = process.argv.slice(2).filter(a=>!a.startsWith("--")).map(Number);
const DRY = process.argv.includes("--dry");
for (const id of ids) {
  const p = (await (await fetch(`${base}/${id}?${q}`,{headers:H})).json()).data;
  if (!p?.providers?.some(x=>x.network==="tiktok")) { console.log(id,"SKIP not tiktok/not found"); continue; }
  if (p.providers.some(x=>x.status!=="PENDING")) { console.log(id,"SKIP status",p.providers.map(x=>x.status)); continue; }
  if (p.tiktokData?.privacyOption) { console.log(id,"SKIP already",p.tiktokData.privacyOption); continue; }
  const body = { ...p, tiktokData:{ ...(p.tiktokData||{}), privacyOption:"PUBLIC_TO_EVERYONE", photoCoverIndex:0 }, providers:p.providers.map(x=>({network:x.network})) };
  for (const k of ["id","creationDate","uuid","creatorUserMail","creatorUserId","hasNotReadNotes"]) delete body[k];
  if (DRY) { console.log(id,"DRY",p.publicationDate.dateTime,p.media[0].split("/").pop()); continue; }
  const pj = await (await fetch(`${base}?${q}`,{method:"POST",headers:H,body:JSON.stringify(body)})).json();
  const nid = pj?.data?.id;
  if (!nid) { console.log(id,"POST_FAIL",JSON.stringify(pj).slice(0,200)); continue; }
  const n = (await (await fetch(`${base}/${nid}?${q}`,{headers:H})).json()).data;
  const same = n.text===p.text && JSON.stringify(n.media)===JSON.stringify(p.media) && n.publicationDate.dateTime===p.publicationDate.dateTime && n.tiktokData?.privacyOption==="PUBLIC_TO_EVERYONE";
  if (!same) { console.log(id,"VERIFY_FAIL new="+nid,"- old kept"); continue; }
  const d = await fetch(`${base}/${id}?${q}`,{method:"DELETE",headers:H});
  console.log(id,"OK new="+nid,"del="+d.status,p.publicationDate.dateTime,p.media[0].split("/").pop());
}
