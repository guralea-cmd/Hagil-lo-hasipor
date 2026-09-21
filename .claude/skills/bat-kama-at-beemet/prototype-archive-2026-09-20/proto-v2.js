/* אב טיפוס v2 - מקומי בלבד. js/bat-kama.js לא נגע.
 * החלטות לאה 20.9: 23 שורת השוואה לממוצע בגילה · 24 תקרה 10 שנים + אמפתיה ודרך חוצה
 * · 25 שיווי משקל יוצא מהמספר ונשאר כתוצאה נפרדת (טוב לגילך / ממוצע / דורש חיזוק)
 * · המספר נשען על תרגיל אחד, ולכן "בערך" ו"הערכה".
 */
"use strict";
var fs = require("fs");

/* --- Tveter 2014, נשים. טבלה 1: משקל ממוצע 67.2 ק"ג. טבלה 3: age>=50 --- */
var STS_CONST = 50.61 - 0.10 * 67.2;            // 43.89
var FLOOR = 50, CEIL = 80;
/* Tveter טבלה 2, נשים - ממוצע קימות לקבוצת הגיל שלה */
function stsAverageFor(age) {
  if (age < 50) return 25;
  return Math.round(STS_CONST - 0.36 * age);
}
function chairAge(sts) {
  var a = (STS_CONST - sts) / 0.36;
  if (a <= FLOOR) return { age: FLOOR, floored: true };
  if (a >= CEIL)  return { age: CEIL,  ceiled: true };
  return { age: a };
}

/* --- Springer 2007, עיניים פקוחות, הערך המפורסם לכל קבוצה (מקור משני: Heyward 2019) --- */
function balMeanFor(age) {
  if (age < 40) return 45.1;
  if (age < 50) return 42.1;
  if (age < 60) return 40.9;
  if (age < 70) return 30.4;
  if (age < 80) return 16.7;
  return 10.6;
}
function balanceRating(age, sec) {
  var own = balMeanFor(age), next = balMeanFor(Math.min(89, Math.floor(age / 10) * 10 + 10));
  if (sec >= own) return { key: "good", label: "טוב לגילך" };
  if (sec >= next) return { key: "avg", label: "ממוצע לגילך" };
  return { key: "work", label: "דורש חיזוק" };
}

/* --- הנוסחים (24: תקרה 10 שנים, אמפתיה ודרך חוצה) --- */
var WAY_OUT = {
  A: "את זה אפשר לשנות. הגוף מגיב לאימון בכל גיל, וזה מתחיל בשתי קימות נוספות מהכיסא.",
  B: "זה לא גזר דין. המספר הזה זז, ואני יודעת בדיוק איך מזיזים אותו.",
  C: "תנשמי רגע. זאת תמונה של היום, ותמונה אפשר לשנות. הצעד הראשון קטן: עוד שתי קימות מהכיסא."
};
var WAY_OUT_PICK = "A";

function score(idAge, sts, balSec) {
  var c = chairAge(sts);
  var shown = Math.round(c.age);
  var gap = Math.round(idAge - c.age);
  var head, gapLine, wayOut = null, compare;

  if (c.floored) {
    head = (idAge <= 50) ? "בגילך זאת התוצאה הכי טובה שהמבחן יודע לתת." : "הגוף שלך ברמה של בת 50 ומטה";
    if (idAge <= 50) gapLine = "הגוף שלך ברמה של בת 50 ומטה";
    else gapLine = "צעירה בלפחות " + (idAge - 50) + " שנים מגילך";
  } else {
    head = "הגוף שלך ברמה של בת " + shown + " בערך";
    if (gap > 0) gapLine = "צעירה בכ-" + gap + " שנים מגילך";
    else if (gap === 0) gapLine = "בדיוק בגילך";
    else if (-gap <= 10) { gapLine = "מבוגרת בכ-" + (-gap) + " שנים מגילך"; wayOut = WAY_OUT[WAY_OUT_PICK]; }
    else { gapLine = "מבוגרת ביותר מ-10 שנים מגילך"; wayOut = WAY_OUT[WAY_OUT_PICK]; }
  }
  var avg = stsAverageFor(idAge);
  compare = sts + " קימות. הממוצע בגיל " + idAge + " הוא " + avg + " קימות.";
  return { head: head, gapLine: gapLine, wayOut: wayOut, compare: compare,
           bal: balanceRating(idAge, balSec), sts: sts, balSec: balSec, idAge: idAge };
}

var CASES = [
  { name: "בת 45, חלשה",   age: 45, sts: 18, bal: 20 },
  { name: "בת 45, חזקה",   age: 45, sts: 30, bal: 43 },
  { name: "בת 60, ממוצעת", age: 60, sts: 21, bal: 35 },
  { name: "בת 60, חזקה",   age: 60, sts: 28, bal: 41.5 },
  { name: "בת 70, חזקה",   age: 70, sts: 25, bal: 38 }
];

var NO_FAIL = "זו רק בדיקה, ואין כאן נכשלים. זה לא כישלון. זה רק אומר שאת צריכה להתחיל לשנות את ההרגלים שלך — ואני יכולה לעזור לך לשנות אותם, להתקדם, להרגיש הרבה יותר טוב, להגדיל את איכות החיים שלך ולחיות בעוצמה ובעצמאות, בלי להיות תלויה באף אחד. כי זה אפשרי עבורך.";

function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}

var cards = CASES.map(function (t) {
  var r = score(t.age, t.sts, t.bal);
  return '<section class="mock">' +
    '<p class="mock__who">' + esc(t.name) + ' · ' + t.sts + ' קימות · ' + t.bal + ' שניות על רגל אחת</p>' +
    '<div class="bk-wrap mock__phone">' +
      '<h2 class="bk-center">התוצאה שלך</h2>' +
      '<p class="bk-age">' + esc(r.gapLine) + '</p>' +
      '<p class="bk-compare">' + esc(r.head) + '</p>' +
      (r.wayOut ? '<p class="bk-voice bk-center">' + esc(r.wayOut) + '</p>' : '') +
      '<p class="bk-muted bk-center">הערכה לפי מבחן הקימה מכיסא. Tveter ואחרים, 2014.</p>' +
      '<div class="bk-card"><h3>הקימה מכיסא שלך</h3><p>' + esc(r.compare) + '</p></div>' +
      '<div class="bk-card bk-balance-card"><h3>שיווי משקל</h3>' +
        '<p class="bk-balance"><strong>' + t.bal + ' שניות</strong></p>' +
        '<p class="bk-balance__age">' + esc(r.bal.label) + '</p></div>' +
      '<p class="bk-voice bk-center bk-no-failing">' + esc(NO_FAIL) + '</p>' +
      '<div class="bk-nav"><a class="btn bk-btn-lg">מה עושים עם התוצאה?</a></div>' +
    '</div></section>';
}).join("\n");

fs.writeFileSync(__dirname + "/mock/result-screens.html",
'<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>מסכי תוצאה - טיוטה</title>' +
'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&display=swap">' +
'<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/bat-kama.css">' +
'<style>body{background:#d9d0c6;margin:0;padding:16px}' +
'.mock{margin:0 0 26px}.mock__who{font:700 15px Assistant,sans-serif;color:#4a453f;margin:0 0 8px;text-align:center}' +
'.mock__phone{background:#eee8e0;border:10px solid #2b2520;border-radius:26px;padding:18px 14px;max-width:390px;margin:0 auto}' +
'</style></head><body>' + cards + '</body></html>', "utf8");

CASES.forEach(function (t) {
  var r = score(t.age, t.sts, t.bal);
  console.log("\n" + t.name + " (" + t.sts + " קימות, " + t.bal + " שנ')");
  console.log("  " + r.head);
  console.log("  " + r.gapLine);
  if (r.wayOut) console.log("  " + r.wayOut);
  console.log("  " + r.compare);
  console.log("  שיווי משקל: " + t.bal + " שניות → " + r.bal.label);
});
console.log("\n16 קימות -> בת " + Math.round(chairAge(16).age) + " | 35 קימות -> " + (chairAge(35).floored ? "50 ומטה" : Math.round(chairAge(35).age)));
