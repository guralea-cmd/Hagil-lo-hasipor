// Schedules the approved 8.10 carbs post on the Hagil Facebook page via Metricool (one post, one network).
// Text = the 10 blocks of 2026-10-08-carbs-after-50.md (approved v3), image = Leah's pick, first comment = workshop link.
// Usage: node schedule-2026-10-08-carbs.mjs [--apply]
import fs from "fs";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const s = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/facebook-teaser/metricool-secrets.json`, "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const APPLY = process.argv.includes("--apply");
const SLOT = "2026-10-08T09:00:00";
const md = fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/group-posts/2026-10-08-carbs-after-50.md`, "utf8");
const body_md = md.split("\n---\n")[1];
// strip editor-only parentheticals "(⬅ ...)", the "(כשפרק הספר...)" note line, block markers "[n] " and arrows
export const text = body_md.split("\n").filter(l => !l.startsWith("(כשפרק"))
  .map(l => l.replace(/\s*\(⬅[^)]*\)/g, "").replace(/^\[\d+\]\s*/, "").replace(/⬅\s*/g, "")).join("\n").trim();
export const firstComment = 'לפרטים והרשמה לסדנה "הגיל הוא לא הסיפור": https://guralea.com/workshop.html';
const body = { publicationDate: { dateTime: SLOT, timezone: "Asia/Jerusalem" }, text, providers: [{ network: "facebook" }],
  media: ["https://guralea.com/images/group-posts/2026-10-08-carbs-leah-paddle.jpg"], autoPublish: true, draft: false,
  firstCommentText: firstComment, shortener: false, facebookData: { type: "POST" } };
if (process.argv[1].endsWith("schedule-2026-10-08-carbs.mjs")) {
  console.log("=== TEXT ===\n" + text + "\n=== FIRST COMMENT ===\n" + firstComment + "\n=== slot", SLOT, "chars", text.length);
  if (!APPLY) { console.log("DRY RUN"); }
  else {
    const r = await (await fetch(`${base}?userId=${s.userId}&blogId=${s.brands.hagil_lo_hasipor.blogId}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
    console.log(r?.data?.id ? `OK id=${r.data.id}` : "FAIL " + JSON.stringify(r).slice(0, 300));
  }
}
