// Leah 1.10: "טיפ + המשך באתר" posts for all 16 studio articles.
// Opening = article's own opening lines (stop at a cliffhanger), CTA = Leah's exact words.
import fs from "fs";
const A = "../guraleapilates/src/content/articles/";
const CUT = { "frozen-shoulder": "שתי הדרכים מחמירות.", "herniated-disc": "שני הדברים מחמירים.", "urinary-incontinence": 'ומחכים, כי "זה בא עם הגיל".', "starting-over": "ומה שאני עונה, שוב ושוב:", "osteoporosis": "וזה בדיוק מה שמחליש את העצמות ואת השרירים עוד יותר." };
const LEAH_LBP = ["את קמה בבוקר והגב התחתון שלך תפוס.","אחרי שעה של ישיבה - את קמה לאט, עם יד על הגב.","ומה רוב האנשים עושים?",'חוזרים לנוח, שוכבים, כדי "לא להחמיר את הכאב".',"וזה בדיוק מה שמחליש לך את הגב עוד יותר."];
const ORDER = ["low-back-pain","neck-pain","osteoporosis","balance","joint-replacement","frozen-shoulder","herniated-disc","arthritis","kyphosis","urinary-incontinence","starting-over","fibromyalgia","scoliosis","fractures","sports-injuries","stress-fractures"];
const CTA_FB = "רוצה לדעת מה את צריכה לעשות במצב הזה? לחצי על הלינק:";
const out = [];
for (const slug of ORDER) {
  const a = JSON.parse(fs.readFileSync(A + slug + ".json", "utf8"));
  let lines = [];
  for (const b of a.blocks) { if (b.h2) break; if (b.lines) lines.push(...b.lines); }
  if (slug === "low-back-pain") lines = LEAH_LBP;
  if (CUT[slug]) lines = lines.slice(0, lines.indexOf(CUT[slug]) + 1);
  const url = `https://guraleapilates.com/articles/${slug}/`;
  out.push({ slug, title: a.title, lines, url, fb: lines.join("\n") + "\n" + CTA_FB + "\n" + url });
}
fs.writeFileSync(".claude/skills/pilates-ads-campaign/tip-posts/posts.json", JSON.stringify(out, null, 1));
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const card = p => `<div class="s"><div class="body">${p.lines.map((l,i)=>`<p class="${i===0||i===p.lines.length-1?'k':''}">${esc(l)}</p>`).join("")}</div><div class="cta">רוצה לדעת מה את צריכה לעשות במצב הזה?<br>הקישור בפרופיל</div><div class="brand">לאה גורא · פילאטיס מכשירים ברמלה</div></div>`;
const css = `body{margin:0;background:#111;font-family:Rubik,Arial,sans-serif}.s{width:1080px;height:1350px;box-sizing:border-box;padding:100px 100px 130px;display:flex;flex-direction:column;justify-content:center;gap:30px;position:relative;background:#111;color:#fff;margin-bottom:20px;overflow:hidden}.body{display:flex;flex-direction:column;gap:22px}.s p{margin:0;font-size:58px;line-height:1.3;font-weight:500}.s .k{color:#ff4a4a;font-weight:800}.cta{margin-top:24px;font-size:48px;font-weight:700;padding:26px 40px;border-radius:24px;background:#e31e24;color:#fff;align-self:flex-start}.brand{position:absolute;bottom:55px;left:100px;right:100px;font-size:34px;opacity:.85;text-align:center}`;
for (const [i, chunk] of [[0, out.slice(0,8)], [1, out.slice(8)]]) {
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap"><style>${css}</style></head><body>${chunk.map(card).join("")}<script>document.querySelectorAll('.s').forEach(s=>{let f=58;const ps=s.querySelectorAll('p');const fit=()=>{ps.forEach(p=>p.style.fontSize=f+'px')};fit();while(s.scrollHeight>1350&&f>36){f-=2;fit();}})</script></body></html>`;
  fs.writeFileSync(`tmp-mock/ig-batch-${i}.html`, html);
}
console.log(out.map(p => p.slug + " " + p.lines.length).join("\n"));
