// Leah 3.10 "כן" (שאלה 8): group-announcement Story every day 12:30 (no Shabbat), brand hagil_lo_hasipor,
// facebook + instagram STORY, image story-announce-daily.jpg (no link sticker possible via API).
// Usage (repo root): node .claude/skills/hagil-community-group/schedule-daily-story-2026-10-03.mjs [--dry]
import fs from "fs";
const s = JSON.parse(fs.readFileSync(".claude/skills/facebook-teaser/metricool-secrets.json", "utf8"));
const H = { "X-Mc-Auth": s.userToken, Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
const base = "https://app.metricool.com/api/v2/scheduler/posts";
const blog = s.brands.hagil_lo_hasipor.blogId;
const DAYS = ["2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-11"]; // 10.10 = שבת
const DRY = process.argv.includes("--dry");
for (const d of DAYS) {
  const body = {
    publicationDate: { dateTime: `${d}T12:30:00`, timezone: "Asia/Jerusalem" },
    text: "סטורי - קבוצה הגיל הוא לא הסיפור",
    providers: [{ network: "facebook" }, { network: "instagram" }],
    media: ["https://guralea.com/images/group/story-announce-daily.jpg"],
    autoPublish: true, draft: false, firstCommentText: "", shortener: false,
    facebookData: { type: "STORY" }, instagramData: { type: "STORY", autoPublish: true },
  };
  if (DRY) { console.log("DRY", d); continue; }
  const r = await (await fetch(`${base}?userId=${s.userId}&blogId=${blog}`, { method: "POST", headers: H, body: JSON.stringify(body) })).json();
  console.log(d, r?.data?.id ? "OK id=" + r.data.id : "FAIL " + JSON.stringify(r).slice(0, 250));
}
