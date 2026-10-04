// Post images (1080x1350) in Leah's approved template: scene (white) + question (yellow) + CTA pill. Same look as 58-v2-fb/ig.jpg.
// FB variant: CTA "כנסי לתגובה הראשונה ותראי" -> images/blog-tips/<n>-v2-fb.jpg ; IG/TikTok variant: "הקישור בפרופיל" -> <n>-v2-ig.jpg
// Usage (repo root): node .claude/skills/hagil-community-group/blog-tips/build-post-v2.mjs 44,43,42   (only approved posts with scene+q)
import fs from "fs"; import { execFileSync } from "child_process";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const want = (process.argv[2] || "").split(",").filter(Boolean).map(Number);
const posts = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/posts.json`, "utf8")).filter(p => p.approved && p.scene && p.q && (!want.length || want.includes(p.n)));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const TMP = (process.env.TEMP || "C:/Windows/Temp").split("\\").join("/") + "/hagil-post";
const OUT = `${ROOT}/images/blog-tips`;
fs.mkdirSync(TMP, { recursive: true });
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const css = `html,body{margin:0;background:#111}body{font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1350px;box-sizing:border-box;padding:140px 100px 160px;display:flex;flex-direction:column;justify-content:center;gap:48px;position:relative;background:#111;color:#fff;overflow:hidden}.sc{margin:0;font-size:62px;line-height:1.4;font-weight:500}.q{margin:0;font-size:68px;line-height:1.3;font-weight:800;color:#ffd400}.cta{font-size:50px;font-weight:700;padding:28px 44px;border-radius:30px;background:#ffd400;color:#111;align-self:flex-start}.brand{position:absolute;bottom:60px;left:100px;right:100px;font-size:34px;opacity:.85;text-align:center}`;
const page = (p, cta) => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body><div class="s"><p class="sc">${esc(p.scene)}</p><p class="q">${esc(p.q)}</p><div class="cta">${cta}</div><div class="brand">הגיל הוא לא הסיפור • לאה גורא</div></div><script>const s=document.querySelector('.s'),a=s.querySelector('.sc'),b=s.querySelector('.q');let f=62,g=68;while(s.scrollHeight>1350&&f>40){f-=2;g-=2;a.style.fontSize=f+'px';b.style.fontSize=g+'px'}</script></body></html>`;
for (const p of posts) for (const [k, cta] of [["fb", "כנסי לתגובה הראשונה ותראי"], ["ig", "הקישור בפרופיל"]]) {
  const html = `${TMP}/${p.n}-${k}.html`, png = `${TMP}/${p.n}-${k}.png`;
  fs.writeFileSync(html, page(p, cta)); try { fs.unlinkSync(png); } catch {}
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1350", "--virtual-time-budget=4000", `--user-data-dir=${TMP}/profile`, `--screenshot=${png}`, "file:///" + html]);
  for (let i = 0; i < 60 && !fs.existsSync(png); i++) execFileSync("powershell", ["-c", "Start-Sleep -Milliseconds 200"]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", png, "-q:v", "3", `${OUT}/${p.n}-v2-${k}.jpg`]);
  console.log("post", p.n, k);
}
