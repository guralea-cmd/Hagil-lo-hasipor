// מדפיס אילו כתבות כבר קיימות באתר הפילאטיס ואילו נושאים עדיין בלי כתבה.
// שימוש: node <נתיב מלא לקובץ הזה>
import fs from "fs";
import path from "path";
const REPO = "C:/Users/gural/OneDrive/מסמכים/GitHub/guraleapilates";
const ART = path.join(REPO, "src/content/articles");
const SITE = path.join(REPO, "src/content/site.json");
if (!fs.existsSync(ART)) { console.error("לא נמצאה תיקיית הכתבות:", ART); process.exit(1); }
const files = fs.readdirSync(ART).filter(f => f.endsWith(".json"));
const articles = files.map(f => {
  const j = JSON.parse(fs.readFileSync(path.join(ART, f), "utf8"));
  return { file: f, slug: j.slug, category: j.category, categorySlug: j.categorySlug, date: j.date, featured: !!j.featured, published: j.published !== false };
});
const site = JSON.parse(fs.readFileSync(SITE, "utf8"));
const cats = (site.categories || []).map(c => (typeof c === "string" ? { slug: c, title: c } : c));
const haveSlugs = new Set(articles.map(a => a.categorySlug));
const missing = cats.filter(c => !haveSlugs.has(c.slug));
const featured = articles.filter(a => a.featured).map(a => a.slug);
console.log("כתבות קיימות:", articles.length, "| נושאים באתר:", cats.length, "| בלי כתבה:", missing.length);
console.log("כתבה ראשית נוכחית:", featured.length ? featured.join(", ") : "אין");
console.log("--- לפי תאריך (הוותיקות קודם = הבאות בתור לרענון) ---");
articles.sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(a => console.log(` ${a.date || "?"}  ${a.categorySlug || "?"}  ${a.slug}${a.featured ? "  [ראשית]" : ""}`));
if (missing.length) { console.log("--- נושאים בלי כתבה ---"); missing.forEach(c => console.log(" " + (c.slug || c) + "  " + (c.title || ""))); }
console.log("OK");
