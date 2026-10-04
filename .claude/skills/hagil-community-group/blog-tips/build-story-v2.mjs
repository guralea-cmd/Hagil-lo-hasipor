// Leah 3.10.2026: Hagil Stories must follow HER approved template (scene + question), like the posts - not title + opening.
// Only approved posts (scene + q). 1080x1920, black-yellow; CTA = existing Story CTA "לחצי על הלינק ⬇" (link sticker -> article).
// Usage (repo root): node .claude/skills/hagil-community-group/blog-tips/build-story-v2.mjs  -> images/blog-tips/story/<n>.jpg
import fs from "fs"; import { execFileSync } from "child_process";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const posts = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/posts.json`, "utf8")).filter(p => p.approved && p.scene && p.q).filter(p => !process.argv[2] || process.argv[2].split(",").map(Number).includes(p.n));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const TMP = (process.env.TEMP || "C:/Windows/Temp").replace(/\\/g, "/") + "/hagil-story";
const OUT = `${ROOT}/images/blog-tips/story`;
fs.mkdirSync(TMP, { recursive: true });
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const css = `html,body{margin:0;background:#111}body{font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1920px;box-sizing:border-box;padding:260px 100px 420px;display:flex;flex-direction:column;justify-content:center;gap:56px;position:relative;background:#111;color:#fff;overflow:hidden}.sc{margin:0;font-size:72px;line-height:1.35;font-weight:500}.q{margin:0;font-size:80px;line-height:1.3;font-weight:800;color:#ffd400}.cta{font-size:58px;font-weight:700;padding:30px 48px;border-radius:28px;background:#ffd400;color:#111;align-self:flex-start}.brand{position:absolute;top:120px;left:100px;right:100px;font-size:40px;opacity:.85;text-align:center}`;
const page = p => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body><div class="s"><div class="brand">הגיל הוא לא הסיפור · לאה גורא</div><p class="sc">${esc(p.scene)}</p><p class="q">${esc(p.q)}</p><div class="cta">לחצי על הלינק ⬇</div></div><script>const s=document.querySelector('.s'),a=s.querySelector('.sc'),b=s.querySelector('.q');let f=72,g=80;while(s.scrollHeight>1920&&f>44){f-=2;g-=2;a.style.fontSize=f+'px';b.style.fontSize=g+'px'}</script></body></html>`;
for (const p of posts) {
  const html = `${TMP}/${p.n}.html`, png = `${TMP}/${p.n}.png`;
  fs.writeFileSync(html, page(p)); try { fs.unlinkSync(png); } catch {}
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1920", "--virtual-time-budget=4000", `--user-data-dir=${TMP}/profile`, `--screenshot=${png}`, "file:///" + html]);
  for (let i = 0; i < 60 && !fs.existsSync(png); i++) execFileSync("powershell", ["-c", "Start-Sleep -Milliseconds 200"]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", png, "-q:v", "3", `${OUT}/${p.n}.jpg`]);
  console.log("story", p.n);
}
