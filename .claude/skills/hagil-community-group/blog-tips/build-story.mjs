// Leah 1.10: daily Story for her personal profile (FB/IG), 1080x1920, with a link sticker → the article.
import fs from "fs";
const posts = JSON.parse(fs.readFileSync(".claude/skills/hagil-community-group/blog-tips/posts.json","utf8"));
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const css = `body{margin:0;background:#111;font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1920px;box-sizing:border-box;padding:260px 100px 520px;display:flex;flex-direction:column;justify-content:center;gap:40px;position:relative;background:#111;color:#fff;margin-bottom:20px;overflow:hidden}.s h1{margin:0;font-size:84px;line-height:1.2;color:#ffd400;font-weight:800}.s p{margin:0;font-size:58px;line-height:1.35;font-weight:500}.cta{margin-top:20px;font-size:54px;font-weight:700;padding:30px 44px;border-radius:26px;background:#ffd400;color:#111;align-self:flex-start}.brand{position:absolute;top:120px;left:100px;right:100px;font-size:40px;opacity:.85;text-align:center}`;
const card = p => `<div class="s"><div class="brand">הגיל הוא לא הסיפור · לאה גורא</div><h1>${esc(p.title)}</h1><p>${esc(p.open)}</p><div class="cta">רוצה לדעת מה את צריכה<br>לעשות במצב הזה?<br>לחצי על הלינק ⬇</div></div>`;
for (let b=0; b*5<posts.length; b++) {
  fs.writeFileSync(`tmp-mock/story-batch-${b}.html`, `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body>${posts.slice(b*5,b*5+5).map(card).join("")}<script>document.querySelectorAll('.s').forEach(s=>{let f=58,t=84;const p=s.querySelector('p'),h=s.querySelector('h1');while(s.scrollHeight>1920&&f>38){f-=2;t-=2;p.style.fontSize=f+'px';h.style.fontSize=t+'px';}})</script></body></html>`);
}
console.log(Math.ceil(posts.length/5),"batches");
