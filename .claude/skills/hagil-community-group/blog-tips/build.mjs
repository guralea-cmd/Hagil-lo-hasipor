// Leah 1.10: "הגיל הוא לא הסיפור" tip posts from the 65 guralea.com blog posts. Short: problem (title question) + opening sentence + CTA.
import fs from "fs";
const out = [];
const files = fs.readdirSync(".").filter(f=>/^blog-post-\d+\.html$/.test(f)).sort((a,b)=>+b.match(/\d+/)[0]-+a.match(/\d+/)[0]); // newest first
for (const f of files) {
  const n = +f.match(/\d+/)[0], h = fs.readFileSync(f,"utf8");
  const m = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>([\s\S]*?)<h2/); if (!m) { console.log("SKIP", f); continue; }
  const title = m[1].replace(/<[^>]+>/g,"").replace(/&quot;/g,'"').trim();
  const para = [...m[2].matchAll(/<p(?![^>]*byline)[^>]*>([\s\S]*?)<\/p>/g)].map(x=>x[1].replace(/<[^>]+>/g,"").replace(/&quot;/g,'"').replace(/\s+/g," ").trim()).filter(Boolean)[0] || "";
  // first sentence(s) up to ~230 chars, cut only at a sentence end
  const sents = para.match(/[^.?!]+[.?!]+/g) || [para]; let open = "";
  for (const s of sents) { if ((open+s).length > 230 && open) break; open += s; }
  out.push({ n, title, open: open.trim(), url: `https://guralea.com/blog-post-${n}.html`, img: `https://guralea.com/images/blog-tips/${n}.jpg` });
}
fs.writeFileSync(".claude/skills/hagil-community-group/blog-tips/posts.json", JSON.stringify(out,null,1));
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const css = `body{margin:0;background:#111;font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1350px;box-sizing:border-box;padding:100px 100px 130px;display:flex;flex-direction:column;justify-content:center;gap:34px;position:relative;background:#111;color:#fff;margin-bottom:20px;overflow:hidden}.s h1{margin:0;font-size:72px;line-height:1.2;color:#ffd400;font-weight:800}.s p{margin:0;font-size:52px;line-height:1.35;font-weight:500}.cta{margin-top:20px;font-size:48px;font-weight:700;padding:26px 40px;border-radius:24px;background:#ffd400;color:#111;align-self:flex-start}.brand{position:absolute;bottom:55px;left:100px;right:100px;font-size:34px;opacity:.85;text-align:center}`;
const card = p => `<div class="s"><h1>${esc(p.title)}</h1><p>${esc(p.open)}</p><div class="cta">רוצה לדעת מה את צריכה<br>לעשות במצב הזה?<br>הקישור בפרופיל</div><div class="brand">הגיל הוא לא הסיפור · לאה גורא</div></div>`;
for (let b=0; b*8<out.length; b++) {
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body>${out.slice(b*8,b*8+8).map(card).join("")}<script>document.querySelectorAll('.s').forEach(s=>{let f=52,t=72;const p=s.querySelector('p'),h=s.querySelector('h1');while(s.scrollHeight>1350&&f>34){f-=2;t-=2;p.style.fontSize=f+'px';h.style.fontSize=t+'px';}})</script></body></html>`;
  fs.writeFileSync(`tmp-mock/blog-batch-${b}.html`, html);
}
console.log(out.length, "posts;", Math.ceil(out.length/8), "batches; longest open", Math.max(...out.map(p=>p.open.length)), "shortest", Math.min(...out.map(p=>p.open.length)));
