// Schedules an approved group-post file on the Hagil Facebook page via Metricool (text = the 10 blocks, first comment = workshop link).
// Usage: node schedule-page-post.mjs <post-file.md> <YYYY-MM-DDTHH:MM:00> <image-url> [--apply]
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const [file, SLOT, IMG] = process.argv.slice(2);
const APPLY = process.argv.includes("--apply");
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const md = fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/group-posts/${file}`, "utf8");
const body_md = md.split("\n---\n")[1];
export const text = body_md.split("\n").filter(l => !l.startsWith("(כשפרק"))
  .map(l => l.replace(/\s*\(⬅[^)]*\)/g, "").replace(/^\[\d+\]\s*/, "").replace(/⬅\s*/g, "")).join("\n").trim();
const firstComment = 'לפרטים והרשמה לסדנה "הגיל הוא לא הסיפור": https://guralea.com/workshop.html';
const body = { publicationDate: { dateTime: SLOT, timezone: "Asia/Jerusalem" }, text, providers: [{ network: "facebook" }],
  media: [IMG], autoPublish: true, draft: false, firstCommentText: firstComment, shortener: false, facebookData: { type: "POST" } };
console.log("=== TEXT ===\n" + text + "\n=== FIRST COMMENT ===\n" + firstComment + "\n=== slot", SLOT, "| image", IMG, "| chars", text.length);
if (!APPLY) { console.log("DRY RUN"); }
else {
  const r = await (await fetch(`https://app.metricool.com/api/v2/scheduler/posts?userId=${s.userId}&blogId=${s.brands.hagil_lo_hasipor.blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  console.log(r?.data?.id ? `OK id=${r.data.id}` : "FAIL " + JSON.stringify(r).slice(0, 300));
}
