/* bat-kama.js - "רוצה לדעת בת כמה את באמת?" self-test page (bat-kama.html).
 *
 * Part 1 (BatKamaScore) is pure scoring - no DOM - and is exported for Node tests.
 * Part 2 is the page UI and only runs in a browser.
 *
 * Debug / screenshots: bat-kama.html?step=N&demo=1
 *   step: 0 intro, 1-6 tests, 7 balance, 8 nutrition, 9 result, 10 form
 *   demo=1 fills a mixed sample (table method), demo=2 an all-62 sample (formula method).
 *   Demo mode sends no GA4 events and never writes to Firestore.
 */
(function (global) {
  "use strict";

  /* ================================================================
   * 1. SCORING (pure)
   * Norms: Jones & Rikli 2002, table 2 (women), "normal range" = middle 50%.
   * Rule (norms-table.md, rule A): youngest age group whose lower bound of the
   * normal range the result meets. Group midpoints 62..92.
   * Leah's decision 13.9.2026: Latorre-Rojas 2019 formula only when all 6 tests
   * were done and all 6 map to 62.
   * ================================================================ */
  var GROUP_AGES = [62, 67, 72, 77, 82, 87, 92];
  var TEST_KEYS = ["chairStand", "armCurl", "step", "sitReach", "backScratch", "upAndGo"];

  var NORMS = {
    chairStand:  { better: "higher", lower: [12, 11, 10, 10, 9, 8, 4], youngestTop: 17 },
    armCurl:     { better: "higher", lower: [13, 12, 12, 11, 10, 10, 8], youngestTop: 19 },
    step:        { better: "higher", lower: [75, 73, 68, 68, 60, 55, 44], youngestTop: 107 },
    // inches, as published; input is cm -> /2.54 -> nearest half inch
    sitReach:    { better: "higher", inches: true, lower: [-0.5, -0.5, -1.0, -1.5, -2.0, -2.5, -4.5], youngestTop: 5.0 },
    backScratch: { better: "higher", inches: true, lower: [-3.0, -3.5, -4.0, -5.0, -5.5, -7.0, -8.0], youngestTop: 1.5 },
    // seconds, lower is better: slow end of each normal range; fast end of 60-64
    upAndGo:     { better: "lower", slow: [6.0, 6.4, 7.1, 7.4, 8.7, 9.6, 11.5], youngestFast: 4.4 }
  };

  var NUTRITION_KEYS = ["protein", "calcium", "vitaminD", "fluids", "fruitVeg"];
  // Tie-break order for movement areas (fall-related areas first)
  var MOVE_ORDER = ["chairStand", "balance", "upAndGo", "step", "armCurl", "sitReach", "backScratch"];

  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function cmToHalfInch(cm) { return Math.round((cm / 2.54) * 2) / 2; }
  function roundTenth(x) { return Math.round(x * 10) / 10; }

  function ageForTest(key, value) {
    if (!isNum(value)) return null;
    var n = NORMS[key];
    var i, v;
    if (n.better === "higher") {
      v = n.inches ? cmToHalfInch(value) : value;
      if (v > n.youngestTop) return { age: 62, cap: "younger", scored: v };
      for (i = 0; i < n.lower.length; i++) {
        if (v >= n.lower[i]) return { age: GROUP_AGES[i], cap: null, scored: v };
      }
      return { age: 92, cap: "older", scored: v };
    }
    v = roundTenth(value);
    if (v < n.youngestFast) return { age: 62, cap: "younger", scored: v };
    for (i = 0; i < n.slow.length; i++) {
      if (v <= n.slow[i]) return { age: GROUP_AGES[i], cap: null, scored: v };
    }
    return { age: 92, cap: "older", scored: v };
  }

  // Latorre-Rojas et al. 2019, J Sport Health Sci 8(3). CSR and BS in cm, FUG in seconds.
  function latorreRojas(r) {
    return 40.146 + 0.350 * r.chairStand - 0.714 * r.armCurl - 0.110 * r.step
      - 0.177 * r.sitReach - 0.101 * r.backScratch + 8.835 * r.upAndGo;
  }

  function qualifierText(q) {
    if (q === "younger") return " או צעירה יותר";
    if (q === "older") return " או מבוגרת יותר";
    return "";
  }

  // raw: { chairStand, armCurl, step, sitReach (cm), backScratch (cm), upAndGo (s) } - null = not done
  function score(raw) {
    raw = raw || {};
    var perTest = {};
    var done = [];
    var sum = 0;
    var anyYounger = false;
    var anyOlder = false;
    TEST_KEYS.forEach(function (k) {
      var a = ageForTest(k, raw[k]);
      perTest[k] = a;
      if (a) {
        done.push(k);
        sum += a.age;
        if (a.cap === "younger") anyYounger = true;
        if (a.cap === "older") anyOlder = true;
      }
    });

    var res = {
      perTest: perTest, testsDone: done.length, method: "none", mean: null, ffa: null,
      ageNumber: null, qualifier: null, ageText: "", strongest: [], weakest: []
    };
    if (!done.length) return res;

    res.mean = sum / done.length;
    var all62 = done.length === 6 && done.every(function (k) { return perTest[k].age === 62; });
    if (all62) {
      res.method = "formula";
      res.ffa = latorreRojas(raw);
      if (res.ffa >= 62) { res.ageNumber = 62; res.qualifier = "younger"; }
      else if (res.ffa < 50) { res.ageNumber = 50; res.qualifier = "younger"; }
      else { res.ageNumber = Math.round(res.ffa); }
    } else {
      res.method = "table";
      res.ageNumber = Math.round(res.mean);
      // both caps at once cancel each other out - no qualifier (flagged for Leah)
      if (anyYounger && !anyOlder) res.qualifier = "younger";
      if (anyOlder && !anyYounger) res.qualifier = "older";
    }
    res.ageText = res.ageNumber + qualifierText(res.qualifier);

    var ages = done.map(function (k) { return perTest[k].age; });
    var min = Math.min.apply(null, ages);
    var max = Math.max.apply(null, ages);
    if (min !== max) {
      res.strongest = done.filter(function (k) { return perTest[k].age === min; });
      res.weakest = done.filter(function (k) { return perTest[k].age === max; });
    }
    return res;
  }

  function testAgeText(t) {
    return t ? t.age + qualifierText(t.cap) : "";
  }

  function compareToIdAge(result, idAge) {
    if (!isNum(idAge) || !result || !isNum(result.ageNumber)) return null;
    var diff = idAge - result.ageNumber;
    if (result.qualifier === "younger" && diff <= 0) return null; // "62 or younger" vs 55: unknown
    if (result.qualifier === "older" && diff >= 0) return null;
    if (diff > 0) return { kind: "younger", years: diff, atLeast: result.qualifier === "younger" };
    if (diff < 0) return { kind: "older", years: -diff, atLeast: result.qualifier === "older" };
    return { kind: "same", years: 0, atLeast: false };
  }

  // Springer 2007 (via Heyward 2019) women eyes open: 60-69 = 30.4 s, 80-99 = 10.6 s.
  // Proposed mapping: good >= 30, medium 10-29.9, needs work < 10.
  function balanceRating(seconds) {
    if (!isNum(seconds)) return null;
    var s = roundTenth(seconds);
    if (s >= 30) return "good";
    if (s >= 10) return "medium";
    return "work";
  }

  function ageBucket(result) {
    if (!result || !isNum(result.ageNumber)) return "none";
    if (result.ageNumber <= 50 && result.qualifier === "younger") return "50_or_younger";
    var lo = Math.floor(result.ageNumber / 5) * 5;
    return lo + "-" + (lo + 4) + (result.qualifier ? "_" + result.qualifier : "");
  }

  // Exactly 3 area keys: up to 2 weakest movement areas, then the most important
  // nutrition gap, then fill (more movement gaps, more nutrition gaps, fixed order).
  // balance: { rating, skipped }; nutrition: { key: "ok" | "gap" }; skipped: { testKey: true }
  function pickRecommendations(result, balance, nutrition, skipped) {
    var cands = [];
    TEST_KEYS.forEach(function (k) {
      var t = result && result.perTest ? result.perTest[k] : null;
      if (t && t.age > 62) cands.push({ key: k, sev: t.age });
      else if (!t && skipped && skipped[k]) cands.push({ key: k, sev: 95 });
    });
    if (balance) {
      // internal ranking only (Springer group midpoints), never shown as an age
      if (balance.skipped) cands.push({ key: "balance", sev: 95 });
      else if (balance.rating === "work") cands.push({ key: "balance", sev: 89.5 });
      else if (balance.rating === "medium") cands.push({ key: "balance", sev: 74.5 });
    }
    cands.sort(function (a, b) {
      return (b.sev - a.sev) || (MOVE_ORDER.indexOf(a.key) - MOVE_ORDER.indexOf(b.key));
    });
    var gaps = NUTRITION_KEYS.filter(function (k) { return nutrition && nutrition[k] === "gap"; });

    var picks = [];
    function add(k) { if (picks.length < 3 && picks.indexOf(k) === -1) picks.push(k); }
    cands.slice(0, 2).forEach(function (c) { add(c.key); });
    if (gaps.length) add(gaps[0]);
    cands.slice(2).forEach(function (c) { add(c.key); });
    gaps.slice(1).forEach(add);
    MOVE_ORDER.forEach(add);
    return picks;
  }

  var BatKamaScore = {
    GROUP_AGES: GROUP_AGES, TEST_KEYS: TEST_KEYS, NORMS: NORMS, NUTRITION_KEYS: NUTRITION_KEYS,
    cmToHalfInch: cmToHalfInch, ageForTest: ageForTest, latorreRojas: latorreRojas,
    score: score, testAgeText: testAgeText, compareToIdAge: compareToIdAge,
    balanceRating: balanceRating, ageBucket: ageBucket, pickRecommendations: pickRecommendations
  };

  if (typeof module !== "undefined" && module.exports) module.exports = BatKamaScore;
  if (global) global.BatKamaScore = BatKamaScore;
  if (typeof document === "undefined") return;

  /* ================================================================
   * 2. PAGE CONFIG
   * ================================================================ */

  // Leah's own section "בת כמה אני באמת?". Fill in after filming - nothing else changes.
  // videos[key] is used BOTH in Leah's section and as the instruction video on that test's screen.
  var LEAH = {
    idAge: 72,
    headerImage: { src: "", alt: "לאה גורא" },
    result: "",
    testResults: { chairStand: "", armCurl: "", step: "", sitReach: "", backScratch: "", upAndGo: "" },
    videos: {
      chairStand:  { src: "", poster: "" },
      armCurl:     { src: "", poster: "" },
      step:        { src: "", poster: "" },
      sitReach:    { src: "", poster: "" },
      backScratch: { src: "", poster: "" },
      upAndGo:     { src: "", poster: "" },
      balance:     { src: "", poster: "" }
    }
  };
  var LEAH_PENDING = "התוצאה של לאה: יתעדכן אחרי הצילום";

  var TESTS = [
    {
      key: "chairStand", name: "קימה מכיסא 30 שניות", short: "קימה מכיסא",
      timer: 30, input: "count", label: "כמה פעמים עמדת?",
      steps: [
        "כיסא בלי ידיות, צמוד לקיר. שבי באמצע הכיסא, כפות הרגליים על הרצפה, הידיים שלובות על החזה.",
        "לחצי התחלה. בכל פעם קומי עד עמידה זקופה ושבי בחזרה.",
        "ספרי כמה פעמים עמדת זקוף ב-30 שניות."
      ],
      safety: "מישהו עומד לידך. אם צריך להיעזר בידיים כדי לקום, עצרי ורשמי 0. זה בסדר, מכאן מתחילים."
    },
    {
      key: "armCurl", name: "כפיפת מרפק 30 שניות", short: "כפיפת מרפק",
      timer: 30, input: "count", label: "כמה כפיפות מלאות עשית?",
      steps: [
        "שבי על כיסא בלי ידיות. משקולת 2.5 ק\"ג (או בקבוק מים של 2 ליטר מלא) ביד החזקה, הזרוע ישרה לצד הגוף.",
        "כופפי את המרפק עד הסוף ויישרי עד הסוף. הזרוע העליונה נשארת צמודה לגוף.",
        "לחצי התחלה וספרי כמה כפיפות מלאות עשית ב-30 שניות."
      ],
      safety: "תנועה מלאה ומבוקרת, בלי תנופה."
    },
    {
      key: "step", name: "צעידה במקום 2 דקות", short: "צעידה במקום",
      timer: 120, input: "count", label: "כמה פעמים הברך הימנית הגיעה לסימון?",
      steps: [
        "סמני על הקיר את נקודת האמצע בין פיקת הברך לבליטת עצם האגן.",
        "לחצי התחלה וצעדי במקום 2 דקות. כל ברך עולה עד הסימון.",
        "ספרי רק את הברך הימנית."
      ],
      safety: "אפשר לגעת במשענת כיסא. אם צריך, האטי או עצרי - השעון ממשיך. לא מבצעים עם כאב בחזה, סחרחורת או לחץ דם מעל 160/100."
    },
    {
      key: "sitReach", name: "כפיפה קדימה בישיבה", short: "כפיפה קדימה",
      timer: 0, input: "cm", label: "המרחק בס\"מ",
      signs: ["לא הגעתי (−)", "נגעתי (0)", "עברתי (+)"],
      steps: [
        "שבי בקצה כיסא צמוד לקיר. רגל אחת ישרה, העקב על הרצפה, כף הרגל ב-90°.",
        "אצבעות אמצעיות זו על זו. נשפי והושיטי את הידיים לכיוון הבוהן.",
        "בקשי ממישהו למדוד את המרחק מקצות האצבעות עד קצה הבוהן."
      ],
      safety: "גב ישר, בלי קפיצות, אף פעם לא עד כאב. לא מבצעים באוסטיאופורוזיס חמורה."
    },
    {
      key: "backScratch", name: "אצבע-אצבע מאחורי הגב", short: "אצבע-אצבע",
      timer: 0, input: "cm", label: "המרחק בס\"מ",
      signs: ["יש רווח (−)", "נוגעות (0)", "יש חפיפה (+)"],
      steps: [
        "יד אחת מעל הכתף ולאורך הגב כלפי מטה, כף היד אל הגוף.",
        "היד השנייה מאחורי הגב כלפי מעלה, כף היד החוצה.",
        "בקשי ממישהו למדוד את המרחק בין קצות האצבעות האמצעיות."
      ],
      safety: "2 ניסיונות, רשמי את הטוב. תחושת מתיחה קלה תקינה. אם כואב, עוצרים מיד."
    },
    {
      key: "upAndGo", name: "קום-לך-שב 2.44 מטר", short: "קום-לך-שב",
      timer: 0, input: "stopwatch", attempts: 2, best: "min", maxSeconds: 60,
      steps: [
        "כיסא צמוד לקיר. סמני נקודה על הרצפה במרחק 2.44 מטר מקדמת הכיסא.",
        "שבי. בלחיצה על התחלה: קומי, לכי סביב הסימון, חזרי ושבי. עצירה ברגע שישבת.",
        "שני ניסיונות. נשמר הזמן הטוב."
      ],
      safety: "הולכים, לא רצים - מהר ככל שאפשר ובבטחה. כדאי שמישהו אחר יפעיל את השעון."
    }
  ];

  var BALANCE = {
    key: "balance", name: "בונוס: עמידה על רגל אחת",
    input: "stopwatch", attempts: 3, best: "max", maxSeconds: 45,
    steps: [
      "יחפה, הידיים שלובות על החזה, המבט לנקודה בגובה העיניים.",
      "הרימי רגל אחת ליד הקרסול של רגל העמידה, בלי לגעת בה.",
      "עצירה כשרגל העמידה זזה או כשהרגל המורמת נוגעת ברצפה. השעון עוצר לבד ב-45 שניות.",
      "עד 3 ניסיונות. נשמר הזמן הטוב."
    ],
    safety: "על רצפה יציבה, ליד קיר, ומישהו צמוד לשמירה."
  };

  var BALANCE_LABELS = { good: "טוב", medium: "בינוני", work: "דורש עבודה" };

  var NUTRITION = [
    { key: "protein", q: "יש חלבון בכל ארוחה שלך? (ביצים, מוצרי חלב, עוף, דג, בשר, קטניות)",
      options: [["ok", "כן, בכל ארוחה"], ["gap", "רק בחלק מהארוחות"], ["gap", "כמעט לא"]] },
    { key: "calcium", q: "כמה פעמים ביום את אוכלת מזון עשיר בסידן? (מוצרי חלב, סרדינים, טחינה, שקדים, טופו)",
      options: [["ok", "3 פעמים ומעלה"], ["gap", "1–2 פעמים"], ["gap", "כמעט לא"]] },
    { key: "vitaminD", q: "את לוקחת ויטמין D, או שבדקת את הרמה שלו בדם?",
      options: [["ok", "כן"], ["gap", "לא"], ["gap", "לא בטוחה"]] },
    { key: "fluids", q: "כמה כוסות את שותה ביום? (מים, תה, קפה, מרק)",
      options: [["ok", "8 ומעלה"], ["gap", "5–7"], ["gap", "4 או פחות"]] },
    { key: "fruitVeg", q: "כמה מנות פירות וירקות את אוכלת ביום?",
      options: [["ok", "5 ומעלה"], ["gap", "3–4"], ["gap", "2 או פחות"]] }
  ];

  var RECS = {
    chairStand: "כוח ברגליים: קימה מכיסא ותרגילי כוח לרגליים, לפחות פעמיים בשבוע.",
    armCurl: "כוח בידיים: תרגילי כוח עם משקולת לידיים ולכתפיים, לפחות פעמיים בשבוע.",
    step: "סיבולת: 150 דקות בשבוע של הליכה מהירה, למשל 30 דקות 5 פעמים בשבוע.",
    sitReach: "גמישות בגב הירך: מתיחה בישיבה, להחזיק 30–60 שניות, 2–3 פעמים בשבוע.",
    backScratch: "גמישות בכתפיים: מתיחות לכתפיים, להחזיק 30–60 שניות, 2–3 פעמים בשבוע.",
    upAndGo: "זריזות: אימון שמשלב כוח, שיווי משקל והליכה, 3 פעמים בשבוע.",
    balance: "שיווי משקל: תרגול שיווי משקל ליד קיר, 3 פעמים בשבוע.",
    protein: "חלבון: 25–30 גרם חלבון בכל ארוחה - ביצים, מוצרי חלב, עוף, דג, בשר או קטניות.",
    calcium: "סידן: מוצרי חלב, סרדינים, טחינה, עלים ירוקים, שקדים וטופו.",
    vitaminD: "ויטמין D: לבדוק את הרמה בדם ולשאול את הרופא אם צריך תוסף.",
    fluids: "שתייה: לפחות 8 כוסות ביום.",
    fruitVeg: "פירות וירקות: לפחות 5 מנות ביום."
  };

  var DEMOS = {
    "1": {
      idAge: 72,
      values: { chairStand: 13, armCurl: 12, step: 70, sitReach: -2.5, backScratch: -11.4 },
      attempts: { upAndGo: [6.5, 6.3], balance: [18.2, 22.4] },
      nutrition: { protein: 1, calcium: 0, vitaminD: 1, fluids: 1, fruitVeg: 0 }
    },
    "2": {
      idAge: 60,
      values: { chairStand: 20, armCurl: 22, step: 115, sitReach: 15, backScratch: 5 },
      attempts: { upAndGo: [4.2, 4.0], balance: [41.0, 45] },
      nutrition: { protein: 0, calcium: 1, vitaminD: 0, fluids: 0, fruitVeg: 2 }
    }
  };

  /* ================================================================
   * 3. UI
   * ================================================================ */
  var params = new URLSearchParams(window.location.search);
  var demoKey = params.get("demo");
  var DEMO = DEMOS[demoKey] || null;
  var noTracking = window.location.search.indexOf("_scan=1") > -1 || !!DEMO;

  var LAST_STEP = 10;
  var state = {
    step: 0,
    idAge: null,
    values: {},       // test key -> number (cm for flexibility, s for up-and-go)
    signs: {},        // flexibility key -> -1 | 0 | 1
    attempts: { upAndGo: [], balance: [] },
    skipped: {},      // key -> true
    nutrition: {},    // key -> option index
    resultTracked: false
  };
  var activeTimer = null;
  var audioCtx = null;

  function track(name, params) {
    if (noTracking || typeof gtag !== "function") return;
    gtag("event", name, params || {});
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }

  function $(sel, rootEl) { return (rootEl || document).querySelector(sel); }

  function parseNum(str) {
    if (str === null || str === undefined) return NaN;
    var s = String(str).trim().replace(",", ".");
    if (s === "" || !/^-?\d*\.?\d*$/.test(s)) return NaN;
    return parseFloat(s);
  }

  function beep(ms, freq) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.frequency.value = freq || 880;
      g.gain.value = 0.25;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + ms / 1000);
    } catch (e) { /* no sound - fine */ }
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e2) { /* ignore */ }
  }

  function stopTimer() {
    if (activeTimer) {
      clearInterval(activeTimer.id);
      activeTimer = null;
    }
  }

  function mediaSlot(key, testName) {
    var v = LEAH.videos[key];
    if (v && v.src) {
      return '<div class="bk-media bk-media--video" data-video-id="' + key + '">' +
        '<video controls playsinline preload="metadata" src="' + esc(v.src) + '"' +
        (v.poster ? ' poster="' + esc(v.poster) + '"' : "") + '></video></div>';
    }
    return '<div class="bk-media" data-video-id="' + key + '">כאן יבוא סרטון של לאה - ' + esc(testName) + '</div>';
  }

  /* ---------- Leah's section ---------- */
  function renderLeah() {
    var el = $("#bk-leah");
    if (!el) return;
    var img = LEAH.headerImage.src
      ? '<img class="bk-leah__img" src="' + esc(LEAH.headerImage.src) + '" alt="' + esc(LEAH.headerImage.alt) + '">'
      : '<div class="bk-media bk-media--header">כאן תבוא תמונת כותרת של לאה</div>';
    var cards = TESTS.map(function (t) {
      var r = LEAH.testResults[t.key];
      return '<div class="bk-leah__card">' + mediaSlot(t.key, t.name) +
        '<p class="bk-leah__card-name">' + esc(t.name) + '</p>' +
        '<p class="bk-leah__card-result">' + (r ? "התוצאה של לאה: " + esc(r) : LEAH_PENDING) + '</p></div>';
    }).join("");
    el.innerHTML = img +
      '<h2 class="bk-leah__title">בת כמה אני באמת?</h2>' +
      '<div class="bk-leah__ages">' +
        '<p>גיל בתעודת הזהות: <strong>' + LEAH.idAge + '</strong></p>' +
        '<p>' + (LEAH.result ? "התוצאה של לאה: <strong>" + esc(LEAH.result) + "</strong>" : LEAH_PENDING) + '</p>' +
      '</div>' +
      '<div class="bk-leah__videos">' + cards + '</div>';
  }

  /* ---------- test screens ---------- */
  function progressHtml(text, fraction) {
    return '<p class="bk-progress">' + text + '</p>' +
      '<div class="bk-bar" aria-hidden="true"><span style="width:' + Math.round(fraction * 100) + '%"></span></div>';
  }

  function stepsHtml(t) {
    return '<ol class="bk-steps">' + t.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ol>' +
      '<p class="bk-safety">' + esc(t.safety) + '</p>';
  }

  function navHtml(nextLabel) {
    return '<div class="bk-nav">' +
      '<button type="button" class="btn bk-btn-lg bk-next" disabled>' + (nextLabel || "הבא") + '</button>' +
      '<button type="button" class="bk-btn-ghost bk-skip">לא יכולה לבצע</button>' +
      '<button type="button" class="bk-link bk-back">חזרה</button>' +
      '</div>';
  }

  function countdownHtml(seconds) {
    return '<div class="bk-timer" data-seconds="' + seconds + '">' +
      '<div class="bk-timer__display" aria-live="polite">' + fmtClock(seconds) + '</div>' +
      '<button type="button" class="btn bk-btn-lg bk-timer__btn">התחלה</button>' +
      '</div>';
  }

  function stopwatchHtml(t) {
    var rows = "";
    for (var i = 0; i < t.attempts; i++) {
      rows += '<div class="bk-attempt"><label for="bk-' + t.key + '-a' + i + '">ניסיון ' + (i + 1) + '</label>' +
        '<input class="bk-num bk-attempt__input" id="bk-' + t.key + '-a' + i + '" data-attempt="' + i + '" type="text" inputmode="decimal" autocomplete="off" placeholder="שניות"></div>';
    }
    return '<div class="bk-timer bk-timer--sw" data-max="' + t.maxSeconds + '">' +
      '<div class="bk-timer__display" aria-live="polite">0.00</div>' +
      '<button type="button" class="btn bk-btn-lg bk-timer__btn">התחלה</button>' +
      '</div>' +
      '<div class="bk-attempts">' + rows + '</div>' +
      '<p class="bk-best" hidden>הזמן הטוב: <strong class="bk-best__val"></strong> שניות</p>';
  }

  function inputHtml(t) {
    if (t.input === "count") {
      return '<div class="bk-field"><label for="bk-in-' + t.key + '">' + esc(t.label) + '</label>' +
        '<input class="bk-num bk-value" id="bk-in-' + t.key + '" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off"></div>';
    }
    if (t.input === "cm") {
      return '<div class="bk-field">' +
        '<div class="bk-seg" role="group">' +
          '<button type="button" class="bk-seg__btn" data-sign="-1" aria-pressed="false">' + esc(t.signs[0]) + '</button>' +
          '<button type="button" class="bk-seg__btn" data-sign="0" aria-pressed="false">' + esc(t.signs[1]) + '</button>' +
          '<button type="button" class="bk-seg__btn" data-sign="1" aria-pressed="false">' + esc(t.signs[2]) + '</button>' +
        '</div>' +
        '<label for="bk-in-' + t.key + '">' + esc(t.label) + '</label>' +
        '<input class="bk-num bk-value" id="bk-in-' + t.key + '" type="text" inputmode="decimal" autocomplete="off" disabled></div>';
    }
    return stopwatchHtml(t);
  }

  function renderTestScreen(t, idx) {
    var el = document.querySelector('.bk-screen[data-step="' + (idx + 1) + '"]');
    el.innerHTML = progressHtml("מבחן " + (idx + 1) + " מתוך 6", (idx + 1) / 6) +
      '<h2>' + esc(t.name) + '</h2>' +
      mediaSlot(t.key, t.name) +
      stepsHtml(t) +
      (t.timer ? countdownHtml(t.timer) : "") +
      inputHtml(t) +
      navHtml();
    wireScreen(el, t);
  }

  function renderBalanceScreen() {
    var el = document.querySelector('.bk-screen[data-step="7"]');
    el.innerHTML = progressHtml("בונוס", 1) +
      '<h2>' + esc(BALANCE.name) + '</h2>' +
      mediaSlot("balance", "עמידה על רגל אחת") +
      stepsHtml(BALANCE) +
      inputHtml(BALANCE) +
      '<p class="bk-muted">לא נכנס לחישוב הגיל.</p>' +
      navHtml();
    wireScreen(el, BALANCE);
  }

  function renderNutritionScreen() {
    var el = document.querySelector('.bk-screen[data-step="8"]');
    var qs = NUTRITION.map(function (n) {
      return '<fieldset class="bk-q"><legend>' + esc(n.q) + '</legend>' +
        n.options.map(function (o, i) {
          return '<label class="bk-opt"><input type="radio" name="bk-n-' + n.key + '" value="' + i + '"><span>' + esc(o[1]) + '</span></label>';
        }).join("") + '</fieldset>';
    }).join("");
    el.innerHTML = '<p class="bk-progress">שאלון תזונה קצר</p>' +
      '<h2>שאלון תזונה קצר</h2>' + qs +
      '<div class="bk-nav"><button type="button" class="btn bk-btn-lg bk-next">הבא</button>' +
      '<button type="button" class="bk-link bk-back">חזרה</button></div>';
    el.querySelectorAll('input[type="radio"]').forEach(function (r) {
      var key = r.name.replace("bk-n-", "");
      if (state.nutrition[key] === Number(r.value)) r.checked = true;
      r.addEventListener("change", function () { state.nutrition[key] = Number(r.value); });
    });
    $(".bk-next", el).addEventListener("click", function () { go(9); });
    $(".bk-back", el).addEventListener("click", function () { go(7); });
  }

  function fmtClock(sec) {
    var s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }

  function screenValid(t) {
    if (t.input === "count") return isNum(state.values[t.key]);
    if (t.input === "cm") return isNum(state.values[t.key]);
    return bestAttempt(t) !== null;
  }

  function bestAttempt(t) {
    var vals = (state.attempts[t.key] || []).filter(function (v) { return isNum(v) && v > 0 && v <= t.maxSeconds; });
    if (!vals.length) return null;
    return t.best === "min" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
  }

  function wireScreen(el, t) {
    var next = $(".bk-next", el);
    var stepNo = Number(el.getAttribute("data-step"));

    function refresh() {
      next.disabled = !screenValid(t);
      if (t.input === "stopwatch") {
        var b = bestAttempt(t);
        var bestEl = $(".bk-best", el);
        bestEl.hidden = b === null;
        if (b !== null) $(".bk-best__val", el).textContent = b.toFixed(2);
      }
    }

    // count input
    if (t.input === "count") {
      var inp = $(".bk-value", el);
      if (isNum(state.values[t.key])) inp.value = state.values[t.key];
      inp.addEventListener("input", function () {
        var n = parseNum(inp.value);
        state.values[t.key] = (isNum(n) && n >= 0 && n <= 300 && Math.floor(n) === n) ? n : null;
        refresh();
      });
    }

    // cm input with explicit sign
    if (t.input === "cm") {
      var cmIn = $(".bk-value", el);
      var segBtns = el.querySelectorAll(".bk-seg__btn");
      var setSign = function (sign) {
        state.signs[t.key] = sign;
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-sign")) === sign ? "true" : "false"); });
        cmIn.disabled = sign === 0;
        if (sign === 0) cmIn.value = "0";
        else if (cmIn.value === "0") cmIn.value = "";
        update();
        if (sign !== 0) cmIn.focus();
      };
      var update = function () {
        var sign = state.signs[t.key];
        var n = parseNum(cmIn.value);
        if (sign === 0) state.values[t.key] = 0;
        else if ((sign === 1 || sign === -1) && isNum(n) && n >= 0 && n <= 60) state.values[t.key] = sign * Math.abs(n);
        else state.values[t.key] = null;
        refresh();
      };
      segBtns.forEach(function (b) {
        b.addEventListener("click", function () { setSign(Number(b.getAttribute("data-sign"))); });
      });
      cmIn.addEventListener("input", update);
      if (isNum(state.values[t.key])) {
        var v = state.values[t.key];
        var sgn = v === 0 ? 0 : (v < 0 ? -1 : 1);
        cmIn.value = String(Math.abs(v));
        state.signs[t.key] = sgn;
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-sign")) === sgn ? "true" : "false"); });
        cmIn.disabled = sgn === 0;
      }
    }

    // countdown timer
    var cd = $(".bk-timer:not(.bk-timer--sw)", el);
    if (cd) {
      var total = Number(cd.getAttribute("data-seconds"));
      var disp = $(".bk-timer__display", cd);
      var btn = $(".bk-timer__btn", cd);
      btn.addEventListener("click", function () {
        if (activeTimer && activeTimer.el === cd) {
          stopTimer();
          disp.textContent = fmtClock(total);
          btn.textContent = "התחלה";
          cd.classList.remove("is-running");
          return;
        }
        stopTimer();
        beep(1, 1); // unlock audio on this tap
        var lead = 3;
        var startAt = null;
        cd.classList.add("is-running");
        btn.textContent = "עצירה";
        disp.textContent = String(lead);
        var t0 = performance.now();
        activeTimer = { el: cd, id: setInterval(function () {
          var now = performance.now();
          if (startAt === null) {
            var left = lead - Math.floor((now - t0) / 1000);
            if (left > 0) { disp.textContent = String(left); return; }
            startAt = now;
            beep(250, 880);
          }
          var remain = total - (now - startAt) / 1000;
          if (remain <= 0) {
            stopTimer();
            disp.textContent = "0:00";
            btn.textContent = "התחלה";
            cd.classList.remove("is-running");
            beep(700, 660);
            var focusIn = $(".bk-value", el);
            if (focusIn) focusIn.focus();
            return;
          }
          disp.textContent = fmtClock(remain);
        }, 100) };
      });
    }

    // stopwatch (up-and-go / balance)
    var sw = $(".bk-timer--sw", el);
    if (sw) {
      var max = Number(sw.getAttribute("data-max"));
      var swDisp = $(".bk-timer__display", sw);
      var swBtn = $(".bk-timer__btn", sw);
      var inputs = el.querySelectorAll(".bk-attempt__input");
      var arr = state.attempts[t.key];
      inputs.forEach(function (inpA, i) {
        if (isNum(arr[i])) inpA.value = arr[i].toFixed(2);
        inpA.addEventListener("input", function () {
          var n = parseNum(inpA.value);
          arr[i] = isNum(n) && n > 0 && n <= max ? n : null;
          refresh();
        });
      });
      var finish = function (secs) {
        stopTimer();
        sw.classList.remove("is-running");
        swBtn.textContent = "התחלה";
        var s = Math.min(max, Math.round(secs * 100) / 100);
        swDisp.textContent = s.toFixed(2);
        var slot = -1;
        for (var i = 0; i < inputs.length; i++) { if (!isNum(arr[i])) { slot = i; break; } }
        if (slot === -1) slot = inputs.length - 1;
        arr[slot] = s;
        inputs[slot].value = s.toFixed(2);
        refresh();
      };
      swBtn.addEventListener("click", function () {
        if (activeTimer && activeTimer.el === sw) {
          finish((performance.now() - activeTimer.start) / 1000);
          return;
        }
        stopTimer();
        beep(120, 880);
        sw.classList.add("is-running");
        swBtn.textContent = "עצירה";
        var start = performance.now();
        activeTimer = { el: sw, start: start, id: setInterval(function () {
          var secs = (performance.now() - start) / 1000;
          if (secs >= max) { finish(max); beep(500, 660); return; }
          swDisp.textContent = secs.toFixed(2);
        }, 50) };
      });
    }

    next.addEventListener("click", function () {
      if (!screenValid(t)) return;
      delete state.skipped[t.key];
      if (t.input === "stopwatch") state.values[t.key] = bestAttempt(t);
      track("bat_kama_test_done", { test_name: t.key, skipped: false });
      go(stepNo + 1);
    });
    $(".bk-skip", el).addEventListener("click", function () {
      state.skipped[t.key] = true;
      state.values[t.key] = null;
      track("bat_kama_test_done", { test_name: t.key, skipped: true });
      go(stepNo + 1);
    });
    $(".bk-back", el).addEventListener("click", function () { go(stepNo - 1); });
    refresh();
  }

  /* ---------- result ---------- */
  function nutritionStatus() {
    var out = {};
    NUTRITION.forEach(function (n) {
      var i = state.nutrition[n.key];
      if (typeof i === "number" && n.options[i]) out[n.key] = n.options[i][0];
    });
    return out;
  }

  function rawForScore() {
    var raw = {};
    BatKamaScore.TEST_KEYS.forEach(function (k) {
      var v = state.skipped[k] ? null : state.values[k];
      if (k === "upAndGo" && !state.skipped[k]) v = bestAttempt(TESTS[5]);
      raw[k] = isNum(v) ? v : null;
    });
    return raw;
  }

  function computeAll() {
    var raw = rawForScore();
    var result = BatKamaScore.score(raw);
    var balSecs = state.skipped.balance ? null : bestAttempt(BALANCE);
    var balance = { seconds: balSecs, rating: BatKamaScore.balanceRating(balSecs), skipped: !!state.skipped.balance };
    var nutrition = nutritionStatus();
    var recs = BatKamaScore.pickRecommendations(result, balance, nutrition, state.skipped);
    return { raw: raw, result: result, balance: balance, nutrition: nutrition, recs: recs };
  }

  function compareText(cmp) {
    if (!cmp) return "";
    var yrs = cmp.years === 1 ? "בשנה אחת" : "ב-" + cmp.years + " שנים";
    if (cmp.kind === "younger") return "צעירה " + (cmp.atLeast ? "לפחות " : "") + yrs + " מהגיל בתעודת הזהות. יפה. ואפשר עוד.";
    if (cmp.kind === "older") return "מבוגרת " + yrs + " מהגיל בתעודת הזהות. זה לא גזר דין — זה נקודת התחלה. ואת זה אני יודעת לשנות.";
    return "בדיוק הגיל שבתעודת הזהות";
  }

  function renderResult() {
    var el = document.querySelector('.bk-screen[data-step="9"]');
    var all = computeAll();
    var r = all.result;
    var html = '<h2 class="bk-center">הגיל הפיזיולוגי שלך</h2>';

    if (r.method === "none") {
      html += '<p class="bk-age bk-age--none">כדי לחשב גיל צריך לבצע לפחות מבחן אחד.</p>';
    } else {
      html += '<p class="bk-age">' + esc(r.ageText) + '</p>';
      var cmpText = compareText(BatKamaScore.compareToIdAge(r, state.idAge));
      if (cmpText) html += '<p class="bk-compare">' + esc(cmpText) + '</p>';
      if (r.testsDone < 6) html += '<p class="bk-muted bk-center">התוצאה מבוססת על ' + r.testsDone + ' מתוך 6 מבחנים.</p>';
      html += '<p class="bk-muted bk-center">' + (r.method === "formula" ? "חישוב לפי Latorre-Rojas 2019" : "חישוב לפי טבלאות Rikli & Jones") + '</p>';

      html += '<div class="bk-card"><h3>לפי מבחן</h3><ul class="bk-breakdown">';
      TESTS.forEach(function (t) {
        var pt = r.perTest[t.key];
        var tag = "";
        if (r.strongest.indexOf(t.key) > -1) tag = '<span class="bk-tag bk-tag--good">הכי חזק</span>';
        if (r.weakest.indexOf(t.key) > -1) tag = '<span class="bk-tag bk-tag--work">הכי כדאי לחזק</span>';
        html += '<li><span class="bk-breakdown__name">' + esc(t.short) + tag + '</span>' +
          '<span class="bk-breakdown__age">' + (pt ? esc(BatKamaScore.testAgeText(pt)) : "לא בוצע") + '</span></li>';
      });
      html += '</ul></div>';
    }

    html += '<div class="bk-card"><h3>שיווי משקל</h3><p class="bk-balance">' +
      (all.balance.rating
        ? esc(BALANCE_LABELS[all.balance.rating]) + ' <span class="bk-muted">(' + all.balance.seconds.toFixed(1) + ' שניות)</span>'
        : "לא בוצע") + '</p></div>';

    html += '<div class="bk-card"><h3>3 דברים שהייתי מתחילה איתם</h3><ol class="bk-recs">' +
      all.recs.map(function (k) { return "<li>" + esc(RECS[k]) + "</li>"; }).join("") + '</ol></div>';

    html += '<p class="bk-note">מבוסס על שני מחקרים מדעיים. לא תחליף לייעוץ רפואי.</p>' +
      '<p class="bk-voice bk-center">רוצה לראות את המספר הזה יורד? 30 יום איתי — תנועה, תזונה, שינה. ומודדים שוב.</p>' +
      '<div class="bk-nav"><button type="button" class="btn bk-btn-lg bk-to-form">רוצה תוכנית 30 יום</button>' +
      '<button type="button" class="bk-link bk-back">חזרה</button></div>';

    el.innerHTML = html;
    $(".bk-to-form", el).addEventListener("click", function () { go(10); });
    $(".bk-back", el).addEventListener("click", function () { go(8); });

    if (!state.resultTracked) {
      state.resultTracked = true;
      track("bat_kama_result", { age_bucket: BatKamaScore.ageBucket(r), method: r.method, tests_done: r.testsDone });
    }
    return all;
  }

  /* ---------- lead form ---------- */
  function getUtmParams() {
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null,
      utmContent: params.get("utm_content") || null,
      utmTerm: params.get("utm_term") || null
    };
  }

  function leadResultPayload() {
    var all = computeAll();
    var r = all.result;
    var perTestAges = {};
    BatKamaScore.TEST_KEYS.forEach(function (k) {
      perTestAges[k] = r.perTest[k] ? BatKamaScore.testAgeText(r.perTest[k]) : (state.skipped[k] ? "skipped" : null);
    });
    return {
      ageNumber: r.ageNumber,
      ageText: r.ageText || null,
      method: r.method,
      testsDone: r.testsDone,
      ffa: isNum(r.ffa) ? Math.round(r.ffa * 100) / 100 : null,
      perTestAges: perTestAges,
      rawResults: all.raw,
      balanceRating: all.balance.rating ? BALANCE_LABELS[all.balance.rating] : null,
      balanceSeconds: isNum(all.balance.seconds) ? all.balance.seconds : null,
      idAge: isNum(state.idAge) ? state.idAge : null,
      recommendations: all.recs,
      nutrition: all.nutrition
    };
  }

  function wireForm() {
    var form = $("#bat-kama-lead-form");
    if (!form) return;
    var statusEl = $("#bat-kama-lead-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      if (!name || !phone) return;

      if (DEMO) {
        statusEl.textContent = "מצב הדגמה - לא נשלח.";
        return;
      }
      if (typeof db === "undefined") {
        statusEl.textContent = "משהו השתבש בשליחת הטופס. נסי שוב.";
        statusEl.classList.add("error");
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = "שולח...";
      statusEl.classList.remove("error");
      var utm = getUtmParams();
      var result = leadResultPayload();

      // Separate list from the studio leads (Leah, 13.9.2026). Needs its own rule in
      // firestore.rules (published in the console) before the page goes live.
      db.collection("age_test_leads").add({
        name: name,
        phone: phone,
        source: "bat-kama",
        site: "guralea.com",
        page: window.location.pathname,
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
        utmContent: utm.utmContent,
        utmTerm: utm.utmTerm,
        status: "new",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        result: result
      })
        .then(function () {
          statusEl.textContent = "הפרטים הגיעו. אני אחזור אלייך.";
          track("bat_kama_lead_submitted", { age_bucket: BatKamaScore.ageBucket(computeAll().result), method: result.method });
          form.reset();
        })
        .catch(function (err) {
          console.error(err);
          statusEl.textContent = "משהו השתבש בשליחת הטופס. נסי שוב.";
          statusEl.classList.add("error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
    $("#bk-form-back").addEventListener("click", function () { go(9); });
  }

  /* ---------- navigation ---------- */
  function go(step, fromHistory) {
    step = Math.max(0, Math.min(LAST_STEP, step));
    stopTimer();
    state.step = step;
    if (step >= 1 && step <= 6) renderTestScreen(TESTS[step - 1], step - 1);
    if (step === 7) renderBalanceScreen();
    if (step === 8) renderNutritionScreen();
    if (step === 9) renderResult();
    document.querySelectorAll(".bk-screen").forEach(function (s) {
      s.hidden = Number(s.getAttribute("data-step")) !== step;
    });
    if (!fromHistory) {
      try { history.pushState({ bkStep: step }, "", window.location.href); } catch (e) { /* ignore */ }
    }
    // style.css sets scroll-behavior:smooth on <html>; a new screen should start at the top at once
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e3) { window.scrollTo(0, 0); }
  }

  function applyDemo() {
    if (!DEMO) return;
    state.idAge = DEMO.idAge;
    Object.keys(DEMO.values).forEach(function (k) { state.values[k] = DEMO.values[k]; });
    state.attempts.upAndGo = DEMO.attempts.upAndGo.slice();
    state.attempts.balance = DEMO.attempts.balance.slice();
    state.values.upAndGo = Math.min.apply(null, DEMO.attempts.upAndGo);
    state.nutrition = JSON.parse(JSON.stringify(DEMO.nutrition));
    var idIn = $("#bk-id-age");
    if (idIn) idIn.value = DEMO.idAge;
  }

  function init() {
    if (!$("#bat-kama-app")) return;
    renderLeah();
    applyDemo();

    var idIn = $("#bk-id-age");
    idIn.addEventListener("input", function () {
      var n = parseNum(idIn.value);
      state.idAge = isNum(n) && n >= 18 && n <= 110 && Math.floor(n) === n ? n : null;
    });
    $("#bk-start").addEventListener("click", function () {
      track("bat_kama_start", {});
      go(1);
    });
    wireForm();

    window.addEventListener("popstate", function (e) {
      var s = e.state && typeof e.state.bkStep === "number" ? e.state.bkStep : 0;
      go(s, true);
    });

    var startStep = parseInt(params.get("step"), 10);
    var first = isNum(startStep) ? startStep : 0;
    try { history.replaceState({ bkStep: first }, "", window.location.href); } catch (e) { /* ignore */ }
    go(first, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : null);
