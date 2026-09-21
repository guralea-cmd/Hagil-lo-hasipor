/* אב טיפוס v5 - מקומי בלבד. js/bat-kama.js לא נגע. שום דבר לא עלה.
 * לאה 20.9: כיסא 43-46 ס"מ. דרגה רביעית "מצוין" ב-45 שניות מלאות.
 * שיטת החישוב לא משתנה עד שלאה חוזרת מבדיקת המציאות בסטודיו.
 */
"use strict";
var fs = require("fs");

var STS_CONST = 50.61 - 0.10 * 67.2;   // 43.89 - Tveter 2014, נשים
var FLOOR = 50, CEIL = 80, BAL_CAP = 45;

function stsAverageFor(age) { return age < 50 ? 25 : Math.round(STS_CONST - 0.36 * age); }

function chairAge(sts) {
  var a = (STS_CONST - sts) / 0.36;
  if (a <= FLOOR) return { age: FLOOR, floored: true };
  if (a >= CEIL) return { age: CEIL, ceiled: true };
  return { age: a };
}

/* Springer 2007, עיניים פקוחות (מקור משני: Heyward 2019). הערך המפורסם לכל קבוצה. */
function balMeanFor(age) {
  if (age < 40) return 45.1;
  if (age < 50) return 42.1;
  if (age < 60) return 40.9;
  if (age < 70) return 30.4;
  if (age < 80) return 16.7;
  return 10.6;
}

/* ארבע דרגות. "מצוין" = הגיעה לתקרת המבחן, 45 שניות.
   אומת: הערך של הקבוצה הצעירה ביותר (18-39) הוא 45.1 שניות. מי שעומדת 45 שניות
   מלאות נמצאת ברמה של הקבוצה הצעירה ביותר שנמדדה, וזה נכון לכל גיל 40 עד 79,
   שערכיהם 42.1 / 40.9 / 30.4 / 16.7 שניות - כולם נמוכים מ-45. */
function balanceGrade(age, sec) {
  if (sec >= BAL_CAP) return "מצוין";
  if (sec >= balMeanFor(age)) return "טוב לגילך";
  if (sec >= balMeanFor(Math.floor(age / 10) * 10 + 10)) return "ממוצע לגילך";
  return "דורש חיזוק";
}

var BREATHE = "תנשמי רגע. זאת תמונה של היום, ותמונה אפשר לשנות. אני יודעת בדיוק איך, וזה מתחיל בשתי קימות נוספות מהכיסא.";
var SOURCE = "התוצאה מבוססת על מבחן הקימה מכיסא ועל מחקר של אוניברסיטת אוסלו, שבדק מאות נשים וגברים בריאים בני 18 עד 90. זו הערכה של כושר תפקודי, לא אבחון רפואי.";
var SOURCE_URL = "https://www.helsedirektoratet.no/forebygging-diagnose-og-behandling/organisering-og-tjenestetilbud/frisklivssentraler/tilbud-ved-frisklivssentraler-og-veilederkurs/Artikkel%20Health-related%20physical%20fitness%20measures%202014.pdf";
var NO_FAIL = "זו רק בדיקה, ואין כאן נכשלים. זה לא כישלון. זה רק אומר שאת צריכה להתחיל לשנות את ההרגלים שלך — ואני יכולה לעזור לך לשנות אותם, להתקדם, להרגיש הרבה יותר טוב, להגדיל את איכות החיים שלך ולחיות בעוצמה ובעצמאות, בלי להיות תלויה באף אחד. כי זה אפשרי עבורך.";

function score(idAge, stsA, stsB, balSec) {
  var sts = Math.max(stsA, stsB);
  var c = chairAge(sts), shown = Math.round(c.age), gap = Math.round(idAge - c.age);
  var big, sub = "", breathe = false;
  if (c.floored) {
    big = "הגוף שלך בן 50 ומטה";
    sub = idAge <= 50 ? "בגילך זאת התוצאה הכי טובה שהמבחן נותן"
                      : "צעיר בלפחות " + (idAge - 50) + " שנים מגילך";
  } else if (gap < -10) {
    big = "הגוף שלך מבוגר ביותר מ-10 שנים מגילך";
    breathe = true;
  } else {
    big = "הגוף שלך בן " + shown;
    if (gap > 0) sub = "צעיר ב-" + gap + " שנים מגילך";
    else if (gap === 0) sub = "בדיוק בגילך";
    else { sub = "מבוגר ב-" + (-gap) + " שנים מגילך"; breathe = true; }
  }
  return {
    sts: sts, big: big, sub: sub, breathe: breathe,
    compare: sts + " קימות. הממוצע בגיל " + idAge + " הוא " + stsAverageFor(idAge) + " קימות.",
    grade: balanceGrade(idAge, balSec)
  };
}

var CASES = [
  { name: "בת 45, חלשה", age: 45, a: 17, b: 18, bal: 20 },
  { name: "בת 45, חזקה", age: 45, a: 28, b: 30, bal: 45 },
  { name: "בת 60, ממוצעת", age: 60, a: 21, b: 20, bal: 35 },
  { name: "בת 60, חזקה", age: 60, a: 26, b: 28, bal: 41.5 },
  { name: "בת 70, חזקה", age: 70, a: 24, b: 25, bal: 38 }
];

function esc(s) {
  return String(s).replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
  });
}

function phone(inner, who) {
  return '<section class="mock"><p class="mock__who">' + esc(who) +
    '</p><div class="bk-wrap mock__phone">' + inner + '</div></section>';
}

var testScreen = phone(
  '<p class="bk-progress">מבחן 1 מתוך 2</p>' +
  '<h2>קימה מכיסא, 30 שניות</h2>' +
  '<ol class="bk-steps">' +
    '<li>כיסא בלי ידיות, בגובה 43 עד 46 ס"מ, צמוד לקיר. שבי באמצע המושב, כפות הרגליים על הרצפה, הידיים שלובות על החזה.</li>' +
    '<li>לחצי התחלה. השעון סופר 3, 2, 1 ואז מצפצף. את מתחילה בצפצוף, לא לפני.</li>' +
    '<li>קומי ושבי כמה שיותר פעמים, עד שהשעון מצפצף שוב.</li>' +
  '</ol>' +
  '<div class="bk-card"><h3>מה נחשב קימה מלאה</h3><ul class="bk-needs">' +
    '<li>קמת עד עמידה זקופה לגמרי, הברכיים ישרות</li>' +
    '<li>ישבת בחזרה עד שהישבן נגע במושב</li>' +
    '<li>הידיים נשארו שלובות על החזה כל הזמן</li>' +
  '</ul><p class="bk-swap">נעזרת בידיים? הקימה הזאת לא נספרת.</p></div>' +
  '<p class="bk-safety bk-stop">עצרי מיד, לא בסוף, אם יש לך כאב, לחץ בחזה, סחרחורת, או שאת לא מצליחה לנשום.</p>' +
  '<p class="bk-clock">0:30</p>' +
  '<div class="bk-nav"><button type="button" class="btn bk-btn-lg">התחלה</button></div>' +
  '<p class="bk-muted bk-center">את הקימה עושים פעמיים. אחרי הפעם הראשונה נוחי דקה, ואז שוב. נלקח המספר הטוב מהשתיים.</p>',
  "מסך הקימה מכיסא (טיוטה)");

var cards = CASES.map(function (t) {
  var r = score(t.age, t.a, t.b, t.bal);
  return phone(
    '<p class="bk-age">' + esc(r.big) + '</p>' +
    (r.sub ? '<p class="bk-compare">' + esc(r.sub) + '</p>' : '') +
    (r.breathe ? '<p class="bk-voice bk-center">' + esc(BREATHE) + '</p>' : '') +
    '<p class="bk-note bk-source">' + esc(SOURCE) +
      ' <a href="' + SOURCE_URL + '" target="_blank" rel="noopener">למאמר המלא</a></p>' +
    '<div class="bk-card"><h3>הקימה מכיסא שלך</h3><p>' + esc(r.compare) + '</p></div>' +
    '<div class="bk-card bk-balance-card"><h3>שיווי משקל</h3>' +
      '<p class="bk-balance"><strong>' + t.bal + ' שניות</strong></p>' +
      '<p class="bk-balance__age">' + esc(r.grade) + '</p></div>' +
    '<div class="bk-card"><h3>מה אפשר לעשות</h3>' +
      '<p>כל קימה נוספת מהכיסא מורידה כמעט 3 שנים מהמספר הזה. שתי קימות נוספות הן כבר שינוי אמיתי, לא תחושה.</p>' +
      '<p>את זה בונים בתנועה, באוכל ובשינה, ביחד. בדיוק מה שיש ב-30 יום איתי.</p></div>' +
    '<p class="bk-voice bk-center bk-no-failing">' + esc(NO_FAIL) + '</p>' +
    '<div class="bk-nav"><a class="btn bk-btn-lg">מה עושים עם התוצאה?</a></div>',
    t.name + " - קימות " + t.a + " ו-" + t.b + " (נלקחת " + r.sts + "), " + t.bal + " שניות על רגל אחת");
}).join("\n");

fs.writeFileSync(__dirname + "/mock/result-screens.html",
  '<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>מסכים - טיוטה</title>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&display=swap">' +
  '<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/bat-kama.css">' +
  '<style>body{background:#d9d0c6;margin:0;padding:16px}' +
  '.mock{margin:0 0 26px}.mock__who{font:700 14px Assistant,sans-serif;color:#4a453f;margin:0 0 8px;text-align:center}' +
  '.mock__phone{background:#eee8e0;border:10px solid #2b2520;border-radius:26px;padding:18px 14px;max-width:390px;margin:0 auto}' +
  '.bk-age{margin-bottom:2px}.bk-source{text-align:center;margin:14px 0}' +
  '.bk-clock{font:800 46px Assistant,sans-serif;text-align:center;margin:10px 0}</style>' +
  '</head><body>' + testScreen + cards + '</body></html>', "utf8");

console.log("--- אימות הדרגה הרביעית מול Springer ---");
console.log("  הקבוצה הצעירה ביותר (18-39) = 45.1 שניות");
[45, 55, 65, 75].forEach(function (a) {
  console.log("  גיל " + a + ": הערך של הקבוצה = " + balMeanFor(a) +
    " שניות. 45 שניות מעליו? " + (45 > balMeanFor(a) ? "כן" : "לא"));
});
console.log("");
CASES.forEach(function (t) {
  var r = score(t.age, t.a, t.b, t.bal);
  console.log(t.name + ": " + r.big + (r.sub ? " | " + r.sub : "") +
    "  |  שיווי משקל " + t.bal + " שניות -> " + r.grade);
});
