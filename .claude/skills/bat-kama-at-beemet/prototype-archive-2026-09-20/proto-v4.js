/* אב טיפוס v4 - מקומי בלבד. js/bat-kama.js לא נגע. שום דבר לא עלה.
 * לאה 20.9 (28): פער מעל 10 שנים -> הכותרת בלי המספר, ומיד אחריה "תנשמי רגע".
 * בכל שאר המקרים המספר חד. שורת מקור מתחת לתוצאה בכל המסכים.
 */
"use strict";
var fs = require("fs");

var STS_CONST = 50.61 - 0.10 * 67.2;            // 43.89  (Tveter טבלה 3, נשים; משקל ממוצע טבלה 1)
var FLOOR = 50, CEIL = 80;

function stsAverageFor(age) { return age < 50 ? 25 : Math.round(STS_CONST - 0.36 * age); }
function chairAge(sts) {
  var a = (STS_CONST - sts) / 0.36;
  if (a <= FLOOR) return { age: FLOOR, floored: true };
  if (a >= CEIL)  return { age: CEIL,  ceiled: true };
  return { age: a };
}
function balMeanFor(age) {
  if (age < 40) return 45.1; if (age < 50) return 42.1; if (age < 60) return 40.9;
  if (age < 70) return 30.4; if (age < 80) return 16.7; return 10.6;
}
function balanceRating(age, sec) {
  if (sec >= balMeanFor(age)) return "טוב לגילך";
  if (sec >= balMeanFor(Math.floor(age / 10) * 10 + 10)) return "ממוצע לגילך";
  return "דורש חיזוק";
}

/* לאה 20.9, מילה במילה */
var BREATHE = "תנשמי רגע. זאת תמונה של היום, ותמונה אפשר לשנות. אני יודעת בדיוק איך, וזה מתחיל בשתי קימות נוספות מהכיסא.";
var SOURCE  = "התוצאה מבוססת על מבחן הקימה מכיסא ועל מחקר של אוניברסיטת אוסלו, שבדק מאות נשים וגברים בריאים בני 18 עד 90. זו הערכה של כושר תפקודי, לא אבחון רפואי.";
var SOURCE_URL = "https://www.helsedirektoratet.no/forebygging-diagnose-og-behandling/organisering-og-tjenestetilbud/frisklivssentraler/tilbud-ved-frisklivssentraler-og-veilederkurs/Artikkel%20Health-related%20physical%20fitness%20measures%202014.pdf";

function score(idAge, stsA, stsB, balSec) {
  var sts = Math.max(stsA, stsB);              // הקימה נעשית פעמיים, נלקחת הטובה
  var c = chairAge(sts);
  var shown = Math.round(c.age);
  var gap = Math.round(idAge - c.age);
  var big, sub = "", breathe = false;

  if (c.floored) {
    big = "הגוף שלך בן 50 ומטה";
    sub = idAge <= 50 ? "בגילך זאת התוצאה הכי טובה שהמבחן נותן"
                      : "צעיר בלפחות " + (idAge - 50) + " שנים מגילך";
  } else if (gap < -10) {
    // לאה 28: בלי המספר המדויק
    big = "הגוף שלך מבוגר ביותר מ-10 שנים מגילך";
    breathe = true;
  } else {
    big = "הגוף שלך בן " + shown;
    if (gap > 0) sub = "צעיר ב-" + gap + " שנים מגילך";
    else if (gap === 0) sub = "בדיוק בגילך";
    else { sub = "מבוגר ב-" + (-gap) + " שנים מגילך"; breathe = true; }
  }
  return { sts: sts, big: big, sub: sub, breathe: breathe,
           compare: sts + " קימות. הממוצע בגיל " + idAge + " הוא " + stsAverageFor(idAge) + " קימות.",
           balance: balanceRating(idAge, balSec) };
}

var CASES = [
  { name: "בת 45, חלשה",   age: 45, a: 17, b: 18, bal: 20 },
  { name: "בת 45, חזקה",   age: 45, a: 28, b: 30, bal: 43 },
  { name: "בת 60, ממוצעת", age: 60, a: 21, b: 20, bal: 35 },
  { name: "בת 60, חזקה",   age: 60, a: 26, b: 28, bal: 41.5 },
  { name: "בת 70, חזקה",   age: 70, a: 24, b: 25, bal: 38 }
];
var NO_FAIL = "זו רק בדיקה, ואין כאן נכשלים. זה לא כישלון. זה רק אומר שאת צריכה להתחיל לשנות את ההרגלים שלך — ואני יכולה לעזור לך לשנות אותם, להתקדם, להרגיש הרבה יותר טוב, להגדיל את איכות החיים שלך ולחיות בעוצמה ובעצמאות, בלי להיות תלויה באף אחד. כי זה אפשרי עבורך.";
function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}

var cards = CASES.map(function (t) {
  var r = score(t.age, t.a, t.b, t.bal);
  return '<section class="mock">' +
    '<p class="mock__who">' + esc(t.name) + ' · קימות ' + t.a + ' ו-' + t.b + ' (נלקחת ' + r.sts + ') · ' + t.bal + ' שניות על רגל אחת</p>' +
    '<div class="bk-wrap mock__phone">' +
      '<p class="bk-age">' + esc(r.big) + '</p>' +
      (r.sub ? '<p class="bk-compare">' + esc(r.sub) + '</p>' : '') +
      (r.breathe ? '<p class="bk-voice bk-center">' + esc(BREATHE) + '</p>' : '') +
      '<p class="bk-note bk-source">' + esc(SOURCE) +
        ' <a href="' + SOURCE_URL + '" target="_blank" rel="noopener">למאמר המלא</a></p>' +
      '<div class="bk-card"><h3>הקימה מכיסא שלך</h3><p>' + esc(r.compare) + '</p></div>' +
      '<div class="bk-card bk-balance-card"><h3>שיווי משקל</h3>' +
        '<p class="bk-balance"><strong>' + t.bal + ' שניות</strong></p>' +
        '<p class="bk-balance__age">' + esc(r.balance) + '</p></div>' +
      '<div class="bk-card"><h3>מה אפשר לעשות</h3>' +
        '<p>כל קימה נוספת מהכיסא מורידה כמעט 3 שנים מהמספר הזה. שתי קימות נוספות הן כבר שינוי אמיתי, לא תחושה.</p>' +
        '<p>את זה בונים בתנועה, באוכל ובשינה, ביחד. בדיוק מה שיש ב-30 יום איתי.</p></div>' +
      '<p class="bk-voice bk-center bk-no-failing">' + esc(NO_FAIL) + '</p>' +
      '<div class="bk-nav"><a class="btn bk-btn-lg">מה עושים עם התוצאה?</a></div>' +
    '</div></section>';
}).join("\n");

fs.writeFileSync(__dirname + "/mock/result-screens.html",
'<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1"><title>מסכי תוצאה - טיוטה</title>' +
'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&display=swap">' +
'<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/bat-kama.css">' +
'<style>body{background:#d9d0c6;margin:0;padding:16px}' +
'.mock{margin:0 0 26px}.mock__who{font:700 14px Assistant,sans-serif;color:#4a453f;margin:0 0 8px;text-align:center}' +
'.mock__phone{background:#eee8e0;border:10px solid #2b2520;border-radius:26px;padding:18px 14px;max-width:390px;margin:0 auto}' +
'.bk-age{margin-bottom:2px}.bk-source{text-align:center;margin:14px 0}</style></head><body>' + cards + '</body></html>', "utf8");

CASES.forEach(function (t) {
  var r = score(t.age, t.a, t.b, t.bal);
  console.log("\n" + t.name + " (" + t.a + "/" + t.b + " -> " + r.sts + ", " + t.bal + " שנ')");
  console.log("  " + r.big + (r.sub ? "  |  " + r.sub : ""));
  if (r.breathe) console.log("  [תנשמי רגע]");
  console.log("  " + r.compare + "  |  שיווי משקל: " + r.balance);
});
