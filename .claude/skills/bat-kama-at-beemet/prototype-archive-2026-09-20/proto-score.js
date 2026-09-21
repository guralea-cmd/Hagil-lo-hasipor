/* אב טיפוס מקומי בלבד - לא נוגע ב-js/bat-kama.js ולא עולה לשום מקום.
 * דרך 1 לפי ההגדרה של לאה 20.9.2026: קהל 40-70, 80+ יורד, התוצאה = הפער.
 *
 * קימה מכיסא: Tveter et al. 2014, Arch Phys Med Rehabil 95:1366-73, 370 נבדקים 18-90.
 *   טבלה 2, נשים (n=192), ממוצע 30sSTS: 18-29=26 · 30-39=24 · 40-49=25 · 50-59=24
 *   · 60-69=21 · 70-79=17 · 80-90=14.  (80-90 ירד בהחלטת לאה)
 *   טבלה 3, משוואות (sex: אישה=0, גבר=1):
 *     גיל <50:  30sSTS = 25.14 - (2.85 x sex)      R2=5%   <-- אין איבר גיל בכלל
 *     גיל >=50: 30sSTS = 50.61 - (0.36 x age) - (0.10 x weight) - (3.81 x sex)   R2=39%
 *   היפוך לנשים:  age = (50.61 - 0.10*weight - STS) / 0.36
 *   משקל: ממוצע הנשים במדגם, טבלה 1 = 67.2 ק"ג (לא שואלים אותה משקל).
 *
 * עמידה על רגל אחת: Springer et al. 2007, עיניים פקוחות, שש קבוצות גיל.
 *   הערכים דרך ההדפסה החוזרת אצל Gibson, Wagner & Heyward 2019 - מקור משני.
 *   18-39 דורש 45.1 שנ' ותקרת המבחן 45 -> לא ניתן להגיע. 80-99 ירד בהחלטת לאה.
 */
"use strict";

var W_MEAN = 67.2;                 // ק"ג, ממוצע הנשים אצל Tveter (טבלה 1)
var STS_CONST = 50.61 - 0.10 * W_MEAN;   // = 43.89
var FLOOR = 50;                    // "50 ומטה" - הממצא של Tveter: אין שינוי עד ~50
var CEIL = 80;                     // מעל זה אין לנו טבלה יותר (לאה הורידה 80+)

function chairStandAge(sts) {
  if (!isFinite(sts)) return null;
  var a = (STS_CONST - sts) / 0.36;
  if (a <= FLOOR) return { age: FLOOR, cap: "younger" };
  if (a >= CEIL)  return { age: 74.5, cap: "older" };   // אמצע 70-79, השורה האחרונה שנשארה
  return { age: a, cap: null };
}

// Springer 2007, עיניים פקוחות - רק הקבוצות שלאה השאירה
var BAL = [
  { lo: 42.01, hi: Infinity, age: 44.5, cap: "younger" },  // 40-49 (42.1-45 שנ')
  { lo: 40.9,  hi: 42.0,     age: 54.5, cap: null },       // 50-59
  { lo: 30.4,  hi: 40.8,     age: 64.5, cap: null },       // 60-69
  { lo: 16.7,  hi: 30.3,     age: 74.5, cap: null },       // 70-79
  { lo: -Infinity, hi: 16.6, age: 74.5, cap: "older" }
];

function balanceAge(sec) {
  if (!isFinite(sec)) return null;
  for (var i = 0; i < BAL.length; i++) {
    if (sec >= BAL[i].lo && sec <= BAL[i].hi) return { age: BAL[i].age, cap: BAL[i].cap };
  }
  return null;
}

function score(idAge, sts, balSec) {
  var c = chairStandAge(sts), b = balanceAge(balSec);
  var parts = [c, b].filter(Boolean);
  var mean = parts.reduce(function (s, p) { return s + p.age; }, 0) / parts.length;
  if (mean < FLOOR) mean = FLOOR;                 // רצפת המוצר: "50 ומטה"
  var shown = Math.round(mean);
  var allYounger = parts.every(function (p) { return p.cap === "younger"; });
  var anyOlder   = parts.some(function (p) { return p.cap === "older"; });
  var gap = Math.round(idAge - mean);             // חיובי = צעירה ב
  var line;
  if (allYounger || shown <= FLOOR) line = "הגוף שלך ברמה של בת 50 ומטה";
  else line = "הגוף שלך ברמה של בת " + shown;
  var gapLine;
  if (allYounger || shown <= FLOOR) {
    gapLine = idAge > FLOOR ? "צעירה בלפחות " + (idAge - FLOOR) + " שנים מגילך" : "בדיוק בגילך או צעירה ממנו";
  } else if (gap > 0) gapLine = "צעירה ב-" + gap + " שנים מגילך";
  else if (gap < 0) gapLine = (anyOlder ? "מבוגרת בלפחות " : "מבוגרת ב-") + (-gap) + " שנים מגילך";
  else gapLine = "בדיוק בגיל שלך";
  return { chair: c, bal: b, mean: mean, shown: shown, line: line, gapLine: gapLine };
}

var CASES = [
  { name: "בת 45, חלשה",   age: 45, sts: 18, bal: 20 },
  { name: "בת 45, חזקה",   age: 45, sts: 30, bal: 43 },
  { name: "בת 60, ממוצעת", age: 60, sts: 21, bal: 35 },
  { name: "בת 60, חזקה",   age: 60, sts: 28, bal: 41.5 },
  { name: "בת 70, חזקה",   age: 70, sts: 25, bal: 38 }
];

console.log("STS_CONST =", STS_CONST.toFixed(2), "| 16 קימות ->", chairStandAge(16).age.toFixed(1), "| 35 קימות ->", chairStandAge(35).age.toFixed(1), chairStandAge(35).cap || "");
console.log("--- אימות מול ממוצעי הטבלה של Tveter ---");
[[24,"50-59"],[21,"60-69"],[17,"70-79"]].forEach(function (p) {
  console.log("  " + p[0] + " קימות -> " + ((STS_CONST - p[0]) / 0.36).toFixed(1) + "  (בטבלה: " + p[1] + ")");
});
console.log("--- חמש הדוגמאות ---");
CASES.forEach(function (c) {
  var r = score(c.age, c.sts, c.bal);
  console.log("\n" + c.name + "  (" + c.sts + " קימות, " + c.bal + " שנ' על רגל אחת)");
  console.log("   קימה מכיסא -> " + r.chair.age.toFixed(1) + (r.chair.cap ? " [" + r.chair.cap + "]" : "") +
              " | שיווי משקל -> " + r.bal.age + (r.bal.cap ? " [" + r.bal.cap + "]" : ""));
  console.log("   >>> " + r.line);
  console.log("   >>> " + r.gapLine);
});
