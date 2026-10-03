// Leah 2.10: one-week trial - one Hagil tip post per day as a Reel (1080x1920, black-yellow, no music).
// Same approved text as the image (scene + q + CTA), revealed in 3 beats. Usage: node build-reel.mjs 58[,60,...]
// Output: images/blog-tips/reel/N-fb.mp4 (CTA "כנסי לתגובה הראשונה ותראי") and N-ig.mp4 ("הקישור בפרופיל").
import fs from "fs"; import { execFileSync } from "child_process";
const ROOT = "C:/Users/gural/OneDrive/מסמכים/GitHub/Hagil-lo-hasipor";
const posts = JSON.parse(fs.readFileSync(`${ROOT}/.claude/skills/hagil-community-group/blog-tips/posts.json`, "utf8"));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const TMP = (process.env.TEMP || "C:/Windows/Temp").replace(/\\/g, "/") + "/reel-build";
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(`${ROOT}/images/blog-tips/reel`, { recursive: true });
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const css = `html,body{margin:0;background:#111}body{font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1920px;box-sizing:border-box;padding:0 100px;display:flex;flex-direction:column;justify-content:center;gap:56px;position:relative;background:#111;color:#fff}.sc{margin:0;font-size:72px;line-height:1.35;font-weight:500}.q{margin:0;font-size:78px;line-height:1.3;font-weight:800;color:#ffd400}.cta{font-size:58px;font-weight:700;padding:30px 48px;border-radius:28px;background:#ffd400;color:#111;align-self:flex-start}.hide{visibility:hidden}.brand{position:absolute;bottom:150px;left:100px;right:100px;font-size:40px;opacity:.85;text-align:center}`;
const frame = (p, cta, step) => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body><div class="s"><p class="sc">${esc(p.scene)}</p><p class="q ${step < 2 ? "hide" : ""}">${esc(p.q)}</p><div class="cta ${step < 3 ? "hide" : ""}">${cta}</div><div class="brand">הגיל הוא לא הסיפור · לאה גורא</div></div></body></html>`;
const shot = (html, png) => {
  const f = `${TMP}/f.html`; fs.writeFileSync(f, html); try { fs.unlinkSync(png); } catch {}
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1920", "--virtual-time-budget=4000", `--screenshot=${png}`, "file:///" + f]);
  for (let i = 0; i < 50 && !fs.existsSync(png); i++) execFileSync("powershell", ["-c", "Start-Sleep -Milliseconds 200"]);
};
const DUR = [4.5, 3.5, 4.5]; // seconds per beat, total 12.5
for (const n of process.argv[2].split(",").map(Number)) {
  const p = posts.find(x => x.n === n); if (!p?.scene || !p?.q) { console.log("MISSING scene/q", n); continue; }
  for (const [tag, cta] of [["fb", "כנסי לתגובה הראשונה ותראי"], ["ig", "הקישור בפרופיל"]]) {
    const pngs = [1, 2, 3].map(st => { const png = `${TMP}/${n}-${tag}-${st}.png`; shot(frame(p, cta, st), png); return png; });
    const out = `${ROOT}/images/blog-tips/reel/${n}-${tag}.mp4`;
    const args = ["-y"]; pngs.forEach((png, i) => args.push("-loop", "1", "-t", String(DUR[i]), "-i", png));
    args.push("-f", "lavfi", "-t", String(DUR.reduce((a, b) => a + b) - 0.8), "-i", "anullsrc=r=44100:cl=stereo");
    const o1 = DUR[0] - 0.4, o2 = DUR[0] + DUR[1] - 0.8;
    args.push("-filter_complex", `[0:v][1:v]xfade=transition=fade:duration=0.4:offset=${o1}[a];[a][2:v]xfade=transition=fade:duration=0.4:offset=${o2},format=yuv420p,fps=30[v]`,
      "-map", "[v]", "-map", "3:a", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-shortest", "-movflags", "+faststart", out);
    execFileSync("ffmpeg", args, { stdio: "ignore" });
    console.log("built", out);
  }
}
