/* אב טיפוס v3 - מקומי בלבד. js/bat-kama.js לא נגע. שום דבר לא עלה.
 * החלטות לאה 20.9 (27): מבחן קצר - קימה מכיסא, שיווי משקל, 5 שאלות תזונה.
 * כפיפת מרפק, צעידה וכפיפה קדימה יורדות.
 * התוצאה חדה, בלי "בערך". מסך התוצאה בשלושה חלקים.
 * הקימה נעשית פעמיים, נלקחת הטובה.
 */
"use strict";
var fs = require("fs");

/* Tveter 2014, נשים. טבלה 1: משקל ממוצע 67.2 ק"ג. טבלה 3, age>=50, sex אישה=0 */
var STS_CONST = 50.61 - 0.10 * 67.2;            // 43.89
var FLOOR = 50, CEIL = 80, PER_REP = 1 / 0.36;  // 2.78 שנים לכל חזרה

function stsAverageFor(age) {
  if (age < 50) return 25;                       // Tveter טבלה 2, נשים 40-49
  return Math.round(STS_CONST - 0.36 * age);
}
function chairAge(sts) {
  var a = (STS_CONST - sts) / 0.36;
  if (a <= FLOOR) return { age: FLOOR, floored: true };
  if (a >= CEIL)  return { age: CEIL,  ceiled: true };
  return { age: a };
}
function bestOfTwo(a, b) { return Math.max(a, b); }

/* Springer 2007, עיניים פקוחות, הערך המפורסם לקבוצה (מקור משני: Heyward 2019) */
function balMeanFor(age) {
  if (age < 40) return 45.1;
  if (age < 50) return 42.1;
  if (age < 60) return 40.9;
  if (age < 70) return 30.4;
  if (age < 80) return 16.7;
  return 10.6;
}
function balanceRating(age, sec) {
  var own = balMeanFor(age), next = balMeanFor(Math.floor(age / 10) * 10 + 10);
  if (sec >= own) return "טוב לגילך";
  if (sec >= next) return "ממוצע לגילך";
  return "דורש חיזוק";
}

/* לאה 20.9, הנוסח המשולב שלה - מילה במילה */
var WAY_OUT = "תנשמי רגע. זאת תמונה של היום, ותמונה אפשר לשנות. אני יודעת בדיוק איך, וזה מתחיל בשתי קימות נוספות מהכיסא.";

function score(idAge, stsA, stsB, balSec) {
  var sts = bestOfTwo(stsA, stsB);
  var c = chairAge(sts);
  var shown = Math.round(c.age);
  var gap = Math.round(idAge - c.age);
  var numLine, gapLine, older = false;

  if (c.floored) {
    numLine = "הגוף שלך בן 50 ומטה";
    if (idAge <= 50) gapLine = "בגילך זאת התוצאה הכי טובה שהמבחן נותן";
    else gapLine = "צעיר בלפחות " + (idAge - 50) + " שנים מגילך";
  } else {
    numLine = "הגוף שלך בן " + shown;
    if (gap > 0) gapLine = "צעיר ב-" + gap + " שנים מגילך";
    else if (gap === 0) gapLine = "בדיוק בגילך";
    else if (-gap <= 10) { gapLine = "מבוגר ב-" + (-gap) + " שנים מגילך"; older = true; }
    else { gapLine = "מבוגר ביותר מ-10 שנים מגילך"; older = true; }
  }
  return {
    sts: sts, stsA: stsA, stsB: stsB, numLine: numLine, gapLine: gapLine, older: older,
    basedOn: "מבחן הקימה מכיסא, מול 192 נשים בנות 18 עד 90 שנבדקו באותו מבחן בדיוק. Tveter ואחרים, 2014.",
    compare: sts + " קימות. הממוצע בגיל " + idAge + " הוא " + stsAverageFor(idAge) + " קימות.",
    balance: balanceRating(idAge, balSec), balSec: balSec, idAge: idAge
  };
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
      /* 1. המספר והפער */
      '<p class="bk-age">' + esc(r.numLine) + '</p>' +
      '<p class="bk-compare">' + esc(r.gapLine) + '</p>' +
      /* 2. על מה זה מבוסס */
      '<div class="bk-card"><h3>על מה זה מבוסס</h3>' +
        '<p>' + esc(r.basedOn) + '</p>' +
        '<p>' + esc(r.compare) + '</p></div>' +
      '<div class="bk-card bk-balance-card"><h3>שיווי משקל</h3>' +
        '<p class="bk-balance"><strong>' + t.bal + ' שניות</strong></p>' +
        '<p class="bk-balance__age">' + esc(r.balance) + '</p></div>' +
      /* 3. מה אפשר לעשות */
      '<div class="bk-card"><h3>מה אפשר לעשות</h3>' +
        (r.older ? '<p class="bk-voice">' + esc(WAY_OUT) + '</p>' : '') +
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
'.bk-age{margin-bottom:2px}</style></head><body>' + cards + '</body></html>', "utf8");

CASES.forEach(function (t) {
  var r = score(t.age, t.a, t.b, t.bal);
  console.log("\n" + t.name + " (" + t.a + "/" + t.b + " -> " + r.sts + " קימות, " + t.bal + " שנ')");
  console.log("  " + r.numLine + " " + r.gapLine);
  console.log("  " + r.compare + "  | שיווי משקל: " + r.balance);
});
console.log("\n16 קימות -> " + Math.round(chairAge(16).age) + " | 35 קימות -> " + (chairAge(35).floored ? "50 ומטה" : Math.round(chairAge(35).age)));
console.log("חזרה אחת = " + PER_REP.toFixed(2) + " שנים");
