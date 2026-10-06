// Leah 3.10.2026: daily Story kit now includes the pilates tip of the day too. 1080x1920, same text and
// black-red look as the approved tip images; CTA = the existing Story CTA ("...לחצי על הלינק ⬇", link sticker -> article).
// Usage (repo root): node .claude/skills/pilates-ads-campaign/tip-posts/build-story.mjs  -> images/pilates/tip-posts/story/<slug>.jpg
import fs from "fs"; import { execFileSync } from "child_process";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const posts = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/pilates-ads-campaign/tip-posts/posts.json`, "utf8"));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const TMP = (process.env.TEMP || "C:/Windows/Temp").replace(/\\/g, "/") + "/pil-story";
const OUT = `${ROOT}/images/pilates/tip-posts/story`;
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const css = `html,body{margin:0;background:#111}body{font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1920px;box-sizing:border-box;padding:260px 100px 420px;display:flex;flex-direction:column;justify-content:center;gap:34px;position:relative;background:#111;color:#fff;overflow:hidden}.body{display:flex;flex-direction:column;gap:26px}.s p{margin:0;font-size:64px;line-height:1.3;font-weight:500}.s .k{color:#ff4a4a;font-weight:800}.cta{margin-top:24px;font-size:54px;font-weight:700;padding:30px 44px;border-radius:26px;background:#e31e24;color:#fff;align-self:flex-start}.brand{position:absolute;top:120px;left:100px;right:100px;font-size:40px;opacity:.85;text-align:center}`;
const page = p => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body><div class="s"><div class="brand">לאה גורא · פילאטיס מכשירים ברמלה</div><div class="body">${p.lines.map((l, i) => `<p class="${i === 0 || i === p.lines.length - 1 ? "k" : ""}">${esc(l)}</p>`).join("")}</div><div class="cta">רוצה לדעת מה את צריכה<br>לעשות במצב הזה?<br>לחצי על הלינק ⬇</div></div><script>const s=document.querySelector('.s'),ps=s.querySelectorAll('p');let f=64;while(s.scrollHeight>1920&&f>40){f-=2;ps.forEach(p=>p.style.fontSize=f+'px')}</script></body></html>`;
for (const p of posts) {
  const html = `${TMP}/${p.slug}.html`, png = `${TMP}/${p.slug}.png`;
  fs.writeFileSync(html, page(p)); try { fs.unlinkSync(png); } catch {}
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1920", "--virtual-time-budget=4000", `--user-data-dir=${TMP}/profile`, `--screenshot=${png}`, "file:///" + html]);
  for (let i = 0; i < 60 && !fs.existsSync(png); i++) execFileSync("powershell", ["-c", "Start-Sleep -Milliseconds 200"]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", png, "-q:v", "3", `${OUT}/${p.slug}.jpg`]);
  console.log("story", p.slug);
}
