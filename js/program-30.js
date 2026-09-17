/* program-30.js - "30 יום איתי" (program-30.html), 18.9.2026.
 * הרגע שאחרי המבחן: יום אחד בכל פעם, חמישה תחומים ביחד (תנועה, צלחת, תבלין, מים, שינה).
 * בלי הרשמה ובלי סיסמה: ההתקדמות נשמרת בטלפון, ואפשר לשמור קישור אישי בוואטסאפ (כמו במבחן).
 * מבוסס על program-30-structure-draft.md (מאושר על ידי לאה) ועל research-nutrition-2026-09.md.
 */
(function (window) {
  "use strict";
  if (!window) return;
  var document = window.document;
  function $(sel, root) { return (root || document).querySelector(sel); }

  var DEMO = /[?&]demo=/.test(window.location.search);
  var noTracking = /[?&](_scan=1|demo=|day=)/.test(window.location.search);

  /* ---------- התוכנית ---------- */
  // בכל שבוע מוסיפים שכבה, לא מחליפים. השכבות של השבועות הקודמים ממשיכות.
  var WEEKS = [
    {
      n: 1, title: "שבוע 1 - מתחילות את כל החמישה, במנה קטנה",
      plate: "שמן זית כתית הוא השמן של הבית. ירק בכל ארוחה.",
      spice: "פרוסת ג'ינג'ר טרי לתה או לאוכל, כל יום.",
      water: "בקבוק מים במקום שאת רואה אותו. מים, סודה או תה במקום משקה ממותק.",
      sleep: "הקפה האחרון עד הצהריים. שעת שינה קבועה.",
      strength: "15 דקות: קימה מכיסא, כפיפת מרפק עם בקבוק מים, עמידה על רגל אחת ליד קיר. כמה שאת יכולה, בלי כאב.",
      walk: "הליכה 10 דקות, בקצב שעוד אפשר לדבר בו."
    },
    {
      n: 2, title: "שבוע 2 - חלבון וסיבים",
      plate: "חלבון בכל ארוחה: ביצה, יוגורט, גבינה, עוף, דג או קטניות. קטניה או דגן מלא פעם ביום.",
      spice: "כורכום עם קצת פלפל שחור ושמן זית בתבשיל.",
      water: "כוס מים עם כל ארוחה.",
      sleep: "בלי אלכוהול בערב. שעה לפני השינה - ספר במקום מסך.",
      strength: "20 דקות: אותם תרגילים, חזרה אחת יותר בכל סט, ועמידה על רגל אחת בלי להיאחז.",
      walk: "הליכה 15 דקות, בקצב שעוד אפשר לדבר בו."
    },
    {
      n: 3, title: "שבוע 3 - המעי והנשנוש",
      plate: "כוס יוגורט טבעי או קפיר ביום. חופן אגוזים (כ-30 גרם). פרי שלם במקום מיץ או עוגה.",
      spice: "שום וקינמון ציילוני במקום מלח וסוכר.",
      water: "כוס מים אחרי ההליכה.",
      sleep: "התנועה בשעות היום. שגרת ערב קבועה, אותו סדר כל ערב.",
      strength: "20-25 דקות: מוסיפות הליכת עקב-בוהן ליד קיר, והרמת עקבים בעמידה.",
      walk: "הליכה 20 דקות, בקצב שעוד אפשר לדבר בו."
    },
    {
      n: 4, title: "שבוע 4 - הכול ביחד, ומודדות",
      plate: "צלחת ים-תיכונית מלאה בכל ארוחה עיקרית. דג פעמיים בשבוע.",
      spice: "כל התבלינים של החודש, כתיבול קבוע. תוספים - רק באישור רופא.",
      water: "ממשיכות את כל הרגלי המים.",
      sleep: "ממשיכות את כל הרגלי השינה.",
      strength: "25 דקות: כל התרגילים, סט נוסף, ובלי משענת במה שאפשר.",
      walk: "הליכה 25-30 דקות, בקצב שעוד אפשר לדבר בו."
    }
  ];

  var STRETCH = "מתיחות עדינות, 10 דקות: גב הירך בישיבה, כתפיים, שוקיים. להחזיק 30-60 שניות, בלי כאב.";
  var MEASURE = "יום מדידה: עושות שוב את המבחנים של \"בת כמה את באמת\", ועונות על שלוש השאלות (שינה, אנרגיה, כאב).";

  function weekOf(day) { return WEEKS[Math.min(3, Math.floor((day - 1) / 7))]; }

  function movementOf(day) {
    var w = weekOf(day);
    if (day >= 29) return MEASURE;
    var inWeek = ((day - 1) % 7) + 1;      // 1..7
    if (inWeek === 7) return STRETCH;
    return (inWeek % 2 === 1) ? w.strength : w.walk;
  }

  function dayPlan(day) {
    var w = weekOf(day);
    return {
      day: day, week: w.n, weekTitle: w.title,
      movement: movementOf(day), plate: w.plate, spice: w.spice, water: w.water, sleep: w.sleep
    };
  }

  /* ---------- שמירה (אותו רעיון כמו במבחן: טלפון + קישור אישי) ---------- */
  var SAVE_KEY = "program30.v1";
  var state = { startedAt: null, done: {} };

  function save() {
    if (DEMO) return;
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function load() {
    if (DEMO) return;
    try {
      var raw = window.localStorage.getItem(SAVE_KEY);
      if (raw) apply(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }

  function apply(d) {
    if (!d || typeof d !== "object") return;
    if (typeof d.startedAt === "number" && d.startedAt > 0) state.startedAt = d.startedAt;
    state.done = {};
    if (d.done && typeof d.done === "object") {
      Object.keys(d.done).forEach(function (k) {
        var n = parseInt(k, 10);
        if (n >= 1 && n <= 30 && d.done[k] === true) state.done[n] = true;
      });
    }
  }

  function fromLink() {
    try {
      var raw = window.__p30 || null;
      if (!raw) return null;
      var b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return JSON.parse(window.atob(b64));
    } catch (e) { return null; }
  }

  function linkWithProgress() {
    var url = "https://guralea.com/program-30.html?utm_source=whatsapp&utm_medium=save_later";
    try {
      var b64 = window.btoa(JSON.stringify(state)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return url + "&s=" + b64;
    } catch (e) { return url; }
  }

  /* ---------- איזה יום היום ---------- */
  var DAY_MS = 24 * 60 * 60 * 1000;

  function currentDay() {
    var forced = parseInt(new URLSearchParams(window.location.search).get("day"), 10);
    if (forced >= 1 && forced <= 30) return forced;
    if (!state.startedAt) return 1;
    var passed = Math.floor((Date.now() - state.startedAt) / DAY_MS);
    return Math.min(30, Math.max(1, passed + 1));
  }

  function doneCount() { return Object.keys(state.done).length; }

  function streak(today) {
    var n = 0;
    for (var d = today; d >= 1; d--) {
      if (state.done[d]) n++;
      else if (d < today) break;   // היום עצמו עוד יכול להיות פתוח
    }
    return n;
  }

  /* ---------- מדידה ---------- */
  function track(name, p) {
    if (noTracking || typeof window.gtag !== "function") return;
    window.gtag("event", name, p || {});
  }

  function pixel(kind, name) {
    if (noTracking || typeof window.fbq !== "function") return;
    try { window.fbq(kind, name); } catch (e) { /* ignore */ }
  }

  /* ---------- מסך ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function row(label, text) {
    return '<div class="p30-row"><span class="p30-row__label">' + esc(label) + '</span>' +
      '<span class="p30-row__text">' + esc(text) + '</span></div>';
  }

  function render() {
    var el = $("#p30-app");
    if (!el) return;
    var day = currentDay();
    var plan = dayPlan(day);
    var isDone = state.done[day] === true;
    var html = "";

    html += '<p class="p30-week">' + esc(plan.weekTitle) + '</p>';
    html += '<h2 class="p30-day">יום ' + day + ' מתוך 30</h2>';

    if (day === 1 && !state.startedAt) {
      html += '<div class="p30-card p30-first"><p>לפני שמתחילות, שתי דקות:</p>' +
        '<p>1. השאלון הקצר של יום 1 - <a href="#p30-safety">כאן למטה</a>.</p>' +
        '<p>2. המספרים של היום: המבחנים שלך מ<a href="bat-kama.html">"בת כמה את באמת"</a>, ושלוש השאלות - שינה, אנרגיה וכאב, מ-0 עד 10. תרשמי אותם על פתק, ביום 30 נמדוד שוב.</p></div>';
    }

    html += '<div class="p30-card p30-today">' +
      row("תנועה", plan.movement) +
      row("צלחת", plan.plate) +
      row("תבלין", plan.spice) +
      row("מים", plan.water) +
      row("שינה", plan.sleep) +
      '</div>';

    html += '<div class="p30-actions">' +
      '<button type="button" id="p30-done" class="btn p30-btn' + (isDone ? " is-done" : "") + '">' +
      (isDone ? "סימנת שעשית היום ✓" : "עשיתי היום") + '</button></div>';

    html += '<p class="p30-count">' + doneCount() + ' ימים מתוך 30 · רצף נוכחי: ' + streak(day) + '</p>';

    html += '<div class="p30-grid" role="list">';
    for (var d = 1; d <= 30; d++) {
      var cls = "p30-dot" + (state.done[d] ? " is-done" : "") + (d === day ? " is-today" : "");
      html += '<span class="' + cls + '" role="listitem">' + d + '</span>';
    }
    html += '</div>';

    if (day >= 29) {
      html += '<div class="p30-card p30-measure"><p><strong>יום המדידה.</strong> עשי שוב את המבחנים, ותשווי למספרים שרשמת ביום 1.</p>' +
        '<p><a class="btn p30-btn" href="bat-kama.html">למבחן</a></p>' +
        '<p class="p30-note">שינוי אמיתי במבחנים: קימה מכיסא 2 חזרות ומעלה · כפיפת מרפק 3 ומעלה · כפיפה בישיבה 6 ס"מ · אצבע-אצבע 4.6 ס"מ · קום-לך-שב 1.4 שניות. בכאב, ירידה של 2 נקודות מתוך 10 היא שינוי משמעותי.</p>' +
        '<p class="p30-note">שינה ושריר צריכים בדרך כלל יותר מ-30 יום כדי להשתנות. יום 30 הוא המדידה הראשונה, לא הסוף.</p></div>';
    }

    html += '<a class="p30-later" id="p30-later" target="_blank" rel="noopener" href="#">' +
      '<strong>רוצה לשמור את התוכנית בוואטסאפ שלך?</strong> לחצי כאן, וכל יום תוכלי לחזור מהקישור הזה</a>';

    el.innerHTML = html;

    var doneBtn = $("#p30-done");
    if (doneBtn) {
      doneBtn.addEventListener("click", function () {
        if (!state.startedAt) state.startedAt = Date.now() - (day - 1) * DAY_MS;
        state.done[day] = !state.done[day];
        if (!state.done[day]) delete state.done[day];
        save();
        track(state.done[day] ? "p30_day_done" : "p30_day_undone", { day: day });
        if (state.done[day]) pixel("trackCustom", "Program30Day");
        render();
      });
    }

    var later = $("#p30-later");
    if (later) {
      later.addEventListener("click", function () {
        var msg = "התוכנית \"30 יום איתי\" של לאה גורא: " + linkWithProgress();
        later.setAttribute("href", "https://wa.me/?text=" + encodeURIComponent(msg));
        track("p30_save_later", { method: "whatsapp" });
      });
    }
  }

  function init() {
    if (!$("#p30-app")) return;
    load();
    var linked = fromLink();
    if (linked && (!state.startedAt || (linked.startedAt && linked.startedAt <= (state.startedAt || Infinity)))) {
      apply(linked);
      save();
    }
    if (!state.startedAt && !DEMO) { state.startedAt = Date.now(); save(); }
    render();
    track("p30_open", { day: currentDay() });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Program30 = { dayPlan: dayPlan, WEEKS: WEEKS };
})(typeof window !== "undefined" ? window : null);
