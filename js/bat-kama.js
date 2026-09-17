/* bat-kama.js - "רוצה לדעת בת כמה את באמת?" self-test page (bat-kama.html).
 *
 * Part 1 (BatKamaScore) is pure scoring - no DOM - and is exported for Node tests.
 * Part 2 is the page UI and only runs in a browser.
 *
 * Screen order (Leah 16.9.2026 - balance before the 2-minute step):
 *   0 intro, 1 chair stand, 2 arm curl, 3 sit-and-reach, 4 back scratch, 5 up-and-go,
 *   6 balance bonus, 7 2-minute step, 8 nutrition, 9 result.
 *   "אני לבד" skips 3, 4, 5 and 6 in both directions.
 *   Leah 16.9.2026: the result screen has one button, "מה עושים עם התוצאה?", which opens
 *   bat-kama-next.html (the two products). The old screen 10 (lead form) moved there; a
 *   compact copy of the result is kept in localStorage (RESULT_KEY) so that page can attach it.
 *
 * Debug / screenshots: bat-kama.html?step=N&demo=K   (N = screen number above)
 *   demo=1 a mixed sample, demo=2 an all-strong sample (formula), demo=3 only two age
 *   tests (no overall age), demo=4 below the whole table, demo=5 older than the ID age.
 *   Any demo= or step= parameter (valid or not) disables GA4 and the Meta Pixel, like _scan=1.
 *   Demo mode never reads or writes saved progress and never writes to Firestore.
 */
(function (global) {
  "use strict";

  /* ================================================================
   * 1. SCORING (pure)
   * Norms: Jones & Rikli 2002, table 2 (women), "normal range" = middle 50%.
   * Rule (norms-table.md, rule A): youngest age group whose lower bound of the
   * normal range the result meets. Group midpoints 62..92.
   * Leah's decision 14.9.2026 (research-2026-09.md): the physiological age uses
   * only chair stand, arm curl, 2-minute step and up-and-go (AGE_KEYS). The flexibility
   * tests are optional and shown separately as "תקין / נוקשה" (flexibilityStatus),
   * never in the age - not in the table and not in the formula (see latorreRojasFFA).
   * Leah 16.9.2026: an overall age needs at least 3 of the 4 age tests (MIN_AGE_TESTS).
   * ================================================================ */
  var GROUP_AGES = [62, 67, 72, 77, 82, 87, 92];
  var TEST_KEYS = ["chairStand", "armCurl", "step", "sitReach", "backScratch", "upAndGo"];
  var AGE_KEYS = ["chairStand", "armCurl", "step", "upAndGo"];
  var FLEX_KEYS = ["sitReach", "backScratch"];
  var MIN_AGE_TESTS = 3;
  var TABLE_START_AGE = 60;   // Rikli & Jones tables start at 60
  var TABLE_END_AGE = 94;     // ... and end at 94
  var FLOOR_REGION_MAX = 67;  // results this low can't be compared to an ID age under 60

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

  // Plausibility (audit 16.9.2026): anything outside these ranges is treated as not recorded.
  // counts: whole numbers; up-and-go under 2.0 s and balance under 1.0 s are double taps.
  var PLAUSIBLE = {
    chairStand: { min: 0, max: 60, int: true },
    armCurl:    { min: 0, max: 60, int: true },
    step:       { min: 0, max: 250, int: true },
    upAndGo:    { min: 2.0, max: 60 },
    balance:    { min: 1.0, max: 45 }
  };
  // A stop tap this soon after the start tap is ignored (the timer keeps running).
  var MIN_STOP_MS = { stopwatch: 500, countdown: 800 };

  // Latorre-Rojas 2019, Table 1 - the study's own sample means for the two flexibility
  // tests (459 women, mean age 70.3): chair sit-and-reach 0.7 cm, back scratch -0.1 cm.
  // Since 16.9.2026 the formula ALWAYS uses these two means, whether or not she did the
  // flexibility tests - so her own flexibility never changes her age.
  var FLEX_SAMPLE_MEAN = { sitReach: 0.7, backScratch: -0.1 };

  var NUTRITION_KEYS = ["protein", "calcium", "vitaminD", "fluids", "fruitVeg"];
  var MOVE_KEYS = ["chairStand", "balance", "upAndGo", "step", "armCurl", "sitReach", "backScratch"];
  // Tie-break order for movement areas (fall-related areas first)
  var MOVE_ORDER = MOVE_KEYS;
  // Internal ranking only. Every age test older than 62 has severity >= 67, so balance and
  // stiff flexibility always rank below a weak age test (audit 16.9.2026).
  var SEV = { balanceWork: 66, flexStiff: 65, balanceMedium: 64 };

  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function cmToHalfInch(cm) { return Math.round((cm / 2.54) * 2) / 2; }
  function roundTenth(x) { return Math.round(x * 10) / 10; }

  function plausible(key, v) {
    if (!isNum(v)) return false;
    var p = PLAUSIBLE[key];
    if (!p) return true;
    if (p.int && Math.floor(v) !== v) return false;
    return v >= p.min && v <= p.max;
  }

  function stopAccepted(kind, elapsedMs) {
    return isNum(elapsedMs) && elapsedMs >= (MIN_STOP_MS[kind] || 0);
  }

  // Best plausible attempt: "min" (up-and-go) or "max" (balance); null when none.
  function bestOf(key, attempts, best) {
    var vals = (attempts || []).filter(function (v) { return plausible(key, v); });
    if (!vals.length) return null;
    return best === "min" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
  }

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

  // The formula as the page uses it: the two flexibility terms are always the study's
  // sample means (FLEX_SAMPLE_MEAN), never her own values.
  function latorreRojasFFA(r) {
    return latorreRojas({
      chairStand: r.chairStand, armCurl: r.armCurl, step: r.step, upAndGo: r.upAndGo,
      sitReach: FLEX_SAMPLE_MEAN.sitReach, backScratch: FLEX_SAMPLE_MEAN.backScratch
    });
  }

  function qualifierText(q) {
    if (q === "younger") return " או צעירה יותר";
    if (q === "older") return " או מבוגרת יותר";
    return "";
  }

  // raw: { chairStand, armCurl, step, sitReach (cm), backScratch (cm), upAndGo (s) } - null = not done
  // Only AGE_KEYS count; implausible values count as not done.
  function score(raw) {
    raw = raw || {};
    var perTest = {};
    var done = [];
    var sum = 0;
    var anyYounger = false;
    var anyOlder = false;
    AGE_KEYS.forEach(function (k) {
      var a = plausible(k, raw[k]) ? ageForTest(k, raw[k]) : null;
      perTest[k] = a;
      if (a) {
        done.push(k);
        sum += a.age;
        if (a.cap === "younger") anyYounger = true;
        if (a.cap === "older") anyOlder = true;
      }
    });

    var res = {
      perTest: perTest, testsDone: done.length, testsTotal: AGE_KEYS.length, method: "none", mean: null,
      ageNumber: null, qualifier: null, ageText: "", ffa: null, strongest: [], weakest: [],
      lessThanThree: done.length < MIN_AGE_TESTS, belowTable: false
    };

    var ages = done.map(function (k) { return perTest[k].age; });
    if (ages.length) {
      var min = Math.min.apply(null, ages);
      var max = Math.max.apply(null, ages);
      if (min !== max) {
        res.strongest = done.filter(function (k) { return perTest[k].age === min; });
        res.weakest = done.filter(function (k) { return perTest[k].age === max; });
      }
    }
    if (!done.length) return res;
    // Leah 16.9.2026: fewer than 3 of the 4 age tests -> per-test results only, no overall age
    if (res.lessThanThree) { res.method = "too_few"; return res; }

    res.mean = sum / done.length;
    res.method = "table";
    res.ageNumber = Math.round(res.mean);
    function allAt(age) { return done.every(function (k) { return perTest[k].age === age; }); }
    // A qualifier only when every test is in the same end group and at least one is truly
    // beyond the table. Mixed results (a capped test next to weaker ones) get the plain number.
    if (allAt(62) && anyYounger) res.qualifier = "younger";
    if (allAt(92) && anyOlder) res.qualifier = "older";

    // All 4 age tests in the youngest group (60-64): Leah 15.9.2026 - the exact number
    // from the formula when it is under 62, floored at "50 או צעירה יותר".
    if (done.length === AGE_KEYS.length && allAt(62)) {
      res.ffa = roundTenth(latorreRojasFFA(raw));
      var ffaAge = Math.round(res.ffa);
      if (ffaAge < 62) {
        res.method = "formula";
        res.ageNumber = ffaAge < 50 ? 50 : ffaAge;
        res.qualifier = ffaAge < 50 ? "younger" : null;
      }
    }
    // Below the whole table: the headline is "יש מאיפה להתחיל, ואני כאן." (Leah 15.9.2026)
    res.belowTable = res.ageNumber === 92 && res.qualifier === "older";
    res.ageText = res.ageNumber + qualifierText(res.qualifier);
    return res;
  }

  function testAgeText(t) {
    return t ? t.age + qualifierText(t.cap) : "";
  }

  // Below the table (92 + "older"): Leah 15.9.2026 - never "92 או מבוגרת יותר" on screen.
  function isBelowTable(t) {
    return !!t && t.age === 92 && t.cap === "older";
  }

  function testDisplayText(t) {
    if (!t) return "";
    return isBelowTable(t) ? "יש מאיפה להתחיל" : testAgeText(t);
  }

  function hasBelowTable(result) {
    if (!result || !result.perTest) return false;
    return AGE_KEYS.some(function (k) { return isBelowTable(result.perTest[k]); });
  }

  // "young" (ID age under 60), "old" (over 94) or null
  function idAgeOutsideTable(idAge) {
    if (!isNum(idAge)) return null;
    if (idAge < TABLE_START_AGE) return "young";
    if (idAge > TABLE_END_AGE) return "old";
    return null;
  }

  function compareToIdAge(result, idAge) {
    if (!isNum(idAge) || !result || !isNum(result.ageNumber)) return null;
    if (result.lessThanThree || result.belowTable) return null;
    var diff = idAge - result.ageNumber;
    if (result.qualifier === "younger" && diff <= 0) return null; // "62 or younger" vs 55: unknown
    if (result.qualifier === "older" && diff >= 0) return null;
    // The table can't go below 62: a woman under 60 near the floor is not "older" than her ID age.
    if (diff < 0 && idAge < TABLE_START_AGE && result.ageNumber <= FLOOR_REGION_MAX) return null;
    if (diff > 0) return { kind: "younger", years: diff, atLeast: result.qualifier === "younger" };
    if (diff < 0) return { kind: "older", years: -diff, atLeast: result.qualifier === "older" };
    return { kind: "same", years: 0, atLeast: false };
  }

  // Flexibility, not part of the age. Compared to the lower bound of the Rikli & Jones
  // normal range for the woman's own age group (from her ID age):
  // <65 (also under 60) -> 60-64, 65-69, 70-74, 75-79, 80-84, 85-89, 90+ -> 90-94.
  // Returns "ok" | "stiff", or null when not done OR when there is no ID age
  // (no age group to judge by - the page then shows the measured value only).
  function flexAgeIndex(idAge) {
    if (!isNum(idAge) || idAge < 65) return 0;
    return Math.min(GROUP_AGES.length - 1, Math.floor((idAge - 60) / 5));
  }

  function flexibilityStatus(key, cmValue, idAge) {
    var n = NORMS[key];
    if (!n || !n.inches || !isNum(cmValue) || !isNum(idAge)) return null;
    return cmToHalfInch(cmValue) >= n.lower[flexAgeIndex(idAge)] ? "ok" : "stiff";
  }

  // Springer 2007 (via Heyward 2019) women eyes open: 60-69 = 30.4 s, 80-99 = 10.6 s.
  // Proposed mapping: good >= 30, medium 10-29.9, needs work < 10.
  function balanceRating(seconds) {
    if (!plausible("balance", seconds)) return null;
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

  // Up to 3 area keys, only from what was actually measured:
  // up to 2 weakest movement areas, then the most important nutrition gap, then the rest.
  // No generic fill - fewer than 3 (or none) is fine.
  // balance: { rating, skipped }; nutrition: { key: "ok" | "gap" }
  // skipped: kept for the call signature - a test skipped with "לא יכולה לבצע" is never a recommendation.
  // flexibility: { sitReach, backScratch: "ok" | "stiff" | null } - only "stiff" is a candidate.
  // onlyKeys (optional): movement keys she could do (alone mode) - nothing else is recommended.
  function pickRecommendations(result, balance, nutrition, skipped, flexibility, onlyKeys) {
    function allowed(k) { return !onlyKeys || onlyKeys.indexOf(k) > -1; }
    var cands = [];
    AGE_KEYS.forEach(function (k) {
      var t = result && result.perTest ? result.perTest[k] : null;
      if (t && t.age > 62 && allowed(k)) cands.push({ key: k, sev: t.age });
    });
    if (balance && !balance.skipped && allowed("balance")) {
      if (balance.rating === "work") cands.push({ key: "balance", sev: SEV.balanceWork });
      else if (balance.rating === "medium") cands.push({ key: "balance", sev: SEV.balanceMedium });
    }
    FLEX_KEYS.forEach(function (k) {
      if (flexibility && flexibility[k] === "stiff" && allowed(k)) cands.push({ key: k, sev: SEV.flexStiff });
    });
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
    return picks;
  }

  var BatKamaScore = {
    GROUP_AGES: GROUP_AGES, TEST_KEYS: TEST_KEYS, AGE_KEYS: AGE_KEYS, FLEX_KEYS: FLEX_KEYS,
    NORMS: NORMS, NUTRITION_KEYS: NUTRITION_KEYS, FLEX_SAMPLE_MEAN: FLEX_SAMPLE_MEAN,
    MIN_AGE_TESTS: MIN_AGE_TESTS, PLAUSIBLE: PLAUSIBLE, MIN_STOP_MS: MIN_STOP_MS, SEV: SEV,
    cmToHalfInch: cmToHalfInch, ageForTest: ageForTest, latorreRojas: latorreRojas,
    latorreRojasFFA: latorreRojasFFA, plausible: plausible, stopAccepted: stopAccepted, bestOf: bestOf,
    score: score, testAgeText: testAgeText, testDisplayText: testDisplayText,
    isBelowTable: isBelowTable, hasBelowTable: hasBelowTable, compareToIdAge: compareToIdAge,
    idAgeOutsideTable: idAgeOutsideTable, flexibilityStatus: flexibilityStatus,
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

  // "10 משפטים לדף בקול של לאה" - exact text and source from
  // .claude/skills/bat-kama-at-beemet/research-2026-09.md (Leah, 14.9.2026).
  // Sentence 7 (Fiatarone) is static HTML in the app column of bat-kama-next.html (Leah 16.9.2026).
  var FACTS = {
    // Leah 16.9.2026: no mortality / longevity - "אריכות ימים זה לא תמיד ביחד עם בריאות".
    // Facts 1-4 and 6 now speak about function and quality of life; 2, 3, 4, 6 carry no study claim.
    1: { text: "המבחנים האלה בודקים את מה שצריך כדי לחיות עצמאית: לקום, ללכת, להרים, להתכופף. החוקרות בדקו 2,140 בני 60 עד 94, וקבעו לכל מבחן את התוצאה שמאפשרת להמשיך לתפקד לבד, גם בגיל מבוגר מאוד.",
      src: "Rikli & Jones, The Gerontologist 2013", url: "https://pubmed.ncbi.nlm.nih.gov/22613940/" },
    2: { text: "הקצב שבו את הולכת מספר הרבה על הגוף שלך. הליכה בטוחה ומהירה היא חופש: לצאת, לחצות כביש, להגיע לבד לאן שאת רוצה." },
    3: { text: "מה שחשוב זה מה השריר שלך יודע לעשות, לא כמה הוא גדול. רגליים חזקות הן מה שמרים אותך מהכיסא, מהמיטה ומהרצפה." },
    4: { text: "עשר שניות על רגל אחת. מבחן פשוט שמראה לך כמה את יציבה. ויציבות היא ביטחון ללכת, לטייל ולרקוד." },
    5: { text: "את שיווי המשקל את יכולה לאמן כמו שריר. סקירה של 108 ניסויים מצאה שתרגילי שיווי משקל ותפקוד מורידים את מספר הנפילות בכ-24%.",
      src: "Sherrington et al., Cochrane 2019", url: "https://pubmed.ncbi.nlm.nih.gov/30703272/" },
    6: { text: "בגמישות המטרה היא לצאת מהנוקשות. גמישות זה להגיע בקלות לנעליים, לגב ולמדף העליון." },
    8: { text: "חלבון עובד יחד עם אימון. במחקר על 2,066 בני 70 עד 79, מי שאכלו הכי הרבה חלבון איבדו כ-40% פחות שריר.",
      src: "Houston et al., AJCN 2008; Liao et al., AJCN 2017", url: "https://pubmed.ncbi.nlm.nih.gov/18175749/" },
    9: { text: "בסקירה של 5,789 מבוגרים, מי שאכלו בסגנון ים-תיכוני נשארו חזקים יותר: חולשה ושבריריות הופיעו אצלם בערך בחצי מהמקרים.",
      src: "Kojima et al., JAGS 2018", url: "https://pubmed.ncbi.nlm.nih.gov/29322507/" },
    10: { text: "30 יום הם ההתחלה. הבדיקה ביום 30 מראה לך איפה את עומדת, והשינוי הגדול נבנה ב-12 השבועות שאחרי.",
      src: "Liu & Latham, Cochrane 2009; Lesinski et al., Sports Med 2015", url: "https://pubmed.ncbi.nlm.nih.gov/26325622/" }
  };
  var FLEX_LABELS = { ok: "תקין", stiff: "נוקשה" };

  // Edge-case texts, Leah 15.9.2026 (drafts-conditions-cases-2026-09-15.md).
  var TXT = {
    alone: "לבד את יכולה לעשות עכשיו שלושה מבחנים: קימה מכיסא, כפיפת מרפק וצעידה במקום. קום-לך-שב, הגמישות ושיווי המשקל — רק עם מישהו לידך. הגיל יחושב מ-3 המבחנים, ותמיד תוכלי להשלים.",
    pain: "כואב לך? עצרי. אל תעשי אף מבחן דרך כאב. הגיל יחושב מהמבחנים שתעשי.",
    redo: "משהו לא יצא כמו שצריך — ידיים לא על החזה, משקולת אחרת? לחצי \"לעשות שוב\".",
    redoBtn: "לעשות שוב",
    belowTable: "יש מאיפה להתחיל, ואני כאן.",
    idAgeYoung: "הטבלאות במחקר מתחילות בגיל 60. התוצאה תראה לך איפה את עומדת מול בנות 60 — טוב לדעת את זה כבר עכשיו.",
    idAgeOld: "הטבלאות במחקר מגיעות עד גיל 94. התוצאה תראה איפה את מול בנות 90–94. וכל מבחן שעשית — שלך.",
    // Leah 16.9.2026 decision (min 3 of 4).
    // טיוטה 16.9 - ממתין לאישור לאה (1: פחות מ-3 מבחנים)
    minTests: "כדי לתת גיל אחד צריך לפחות 3 מבחנים. בינתיים — הנה איפה את עומדת בכל מבחן שעשית.",
    // טיוטה 16.9 - ממתין לאישור לאה (2: עוצרים מיד - בפתיחה ובכל מבחן עם שעון)
    stopNow: "עצרי מיד — לא בסוף — אם יש לך כאב, לחץ בחזה, סחרחורת, או שאת לא מצליחה לנשום. המבחן לא שווה את זה, ואין לך מה להוכיח לאף אחד.",
    // טיוטה 16.9 - ממתין לאישור לאה (5: מתחת להשוואה, רק כשהתוצאה מבוגרת מהגיל בתעודת הזהות)
    olderDoctor: "אם המספר יצא גבוה בהרבה מהגיל שלך, זה לא אבחנה ואני לא רופאה. תיקחי את הדף הזה לרופא/ה שלך ותשאלי מה נכון להתחיל איתו. ואז נתחיל.",
    // טיוטה 16.9 - ממתין לאישור לאה (7: מצב לבד, כשהגיל מחושב מ-3 המבחנים שעשתה לבד)
    aloneComputed: "הגיל מחושב מ-3 המבחנים שעשית לבד. כשיהיה מישהו לידך — תשלימי את השאר, והמספר יהיה מדויק יותר.",
    // Leah 16.9.2026: "דף התוצאה: כפתור אחד — 'מה עושים עם התוצאה?'"
    nextBtn: "מה עושים עם התוצאה?",
    methodTable: "חישוב לפי טבלאות Rikli & Jones",
    methodFormula: "חישוב לפי Latorre-Rojas 2019",
    resultHeading: "הגיל הפיזיולוגי שלך",
    start: "התחלה",
    stop: "עצירה"
  };

  // "אני לבד" (Leah 15.9.2026): only these three tests can be done alone.
  // Screens 3 (כפיפה בישיבה), 4 (אצבע-אצבע), 5 (קום-לך-שב) and 6 (שיווי משקל) are skipped
  // entirely - forward and backward - and count as not done, not as skipped by pain.
  var ALONE_TESTS = ["chairStand", "armCurl", "step"];
  var ALONE_SKIP_STEPS = [3, 4, 5, 6];

  // טיוטה 16.9 - ממתין לאישור לאה (4). Replaces the start of the "לחצי התחלה..." step on the
  // three countdown tests (chair stand, arm curl, 2-minute step) - the only timers that count 3-2-1.
  // The stopwatch tests (up-and-go, balance) start at once, so this line is not on them.
  var COUNTDOWN_LINE = "לחצי התחלה. השעון סופר 3, 2, 1 ואז מצפצף — את מתחילה בצפצוף, לא לפני.";

  var TESTS = [
    {
      key: "chairStand", name: "קימה מכיסא 30 שניות", short: "קימה מכיסא",
      timer: 30, input: "count", label: "כמה פעמים עמדת?", fact: 3,
      steps: [
        "כיסא בלי ידיות, צמוד לקיר. שבי באמצע הכיסא, כפות הרגליים על הרצפה, הידיים שלובות על החזה.",
        // טיוטה 16.9 - ממתין לאישור לאה (4: ספירה לאחור)
        COUNTDOWN_LINE + " בכל פעם קומי עד עמידה זקופה ושבי בחזרה.",
        "ספרי כמה פעמים עמדת זקוף ב-30 שניות."
      ],
      safety: "מישהו עומד לידך. אם צריך להיעזר בידיים כדי לקום, עצרי ורשמי 0. זה בסדר, מכאן את מתחילה.",
      // "אני לבד" (16.9.2026): the same line without its first sentence
      safetyAlone: "אם צריך להיעזר בידיים כדי לקום, עצרי ורשמי 0. זה בסדר, מכאן את מתחילה."
    },
    {
      key: "armCurl", name: "כפיפת מרפק 30 שניות", short: "כפיפת מרפק",
      timer: 30, input: "count", label: "כמה כפיפות מלאות עשית?",
      steps: [
        "שבי על כיסא בלי ידיות. משקולת 2.5 ק\"ג (או בקבוק מים של 2 ליטר מלא) ביד החזקה, הזרוע ישרה לצד הגוף.",
        "כופפי את המרפק עד הסוף ויישרי עד הסוף. הזרוע העליונה נשארת צמודה לגוף.",
        // טיוטה 16.9 - ממתין לאישור לאה (4: ספירה לאחור)
        COUNTDOWN_LINE + " ספרי כמה כפיפות מלאות עשית ב-30 שניות."
      ],
      safety: "תנועה מלאה ומבוקרת, בלי תנופה."
    },
    {
      key: "sitReach", name: "כפיפה קדימה בישיבה", short: "כפיפה קדימה",
      timer: 0, input: "cm", label: "המרחק בס\"מ", optional: true, fact: 6,
      signs: ["לא הגעתי (−)", "נגעתי (0)", "עברתי (+)"],
      steps: [
        "שבי בקצה כיסא צמוד לקיר. רגל אחת ישרה, העקב על הרצפה, כף הרגל ב-90°.",
        "אצבעות אמצעיות זו על זו. נשפי והושיטי את הידיים לכיוון הבוהן.",
        "בקשי ממישהו למדוד את המרחק מקצות האצבעות עד קצה הבוהן."
      ],
      safety: "גב ישר, בלי קפיצות, אף פעם לא עד כאב. אם יש לך אוסטיאופורוזיס חמורה, אל תעשי את המבחן הזה."
    },
    {
      key: "backScratch", name: "אצבע-אצבע מאחורי הגב", short: "אצבע-אצבע",
      timer: 0, input: "cm", label: "המרחק בס\"מ", optional: true,
      signs: ["יש רווח (−)", "נוגעות (0)", "יש חפיפה (+)"],
      steps: [
        "יד אחת מעל הכתף ולאורך הגב כלפי מטה, כף היד אל הגוף.",
        "היד השנייה מאחורי הגב כלפי מעלה, כף היד החוצה.",
        "בקשי ממישהו למדוד את המרחק בין קצות האצבעות האמצעיות."
      ],
      safety: "2 ניסיונות, רשמי את הטוב. תחושת מתיחה קלה תקינה. אם כואב לך, עצרי מיד."
    },
    {
      key: "upAndGo", name: "קום-לך-שב 2.44 מטר", short: "קום-לך-שב",
      timer: 0, input: "stopwatch", attempts: 2, best: "min", maxSeconds: 60, fact: 2,
      steps: [
        "כיסא צמוד לקיר. סמני נקודה על הרצפה במרחק 2.44 מטר מקדמת הכיסא.",
        "שבי. בלחיצה על התחלה: קומי, לכי סביב הסימון, חזרי ושבי. עצירה ברגע שישבת.",
        "שני ניסיונות. נשמר הזמן הטוב."
      ],
      safety: "את הולכת, לא רצה — מהר ככל שאת יכולה, ובבטחה. כדאי שמישהו אחר יפעיל את השעון."
    },
    {
      // last test, per Leah's order of 15.9.2026 (the endurance test closes the battery);
      // since 16.9.2026 the balance bonus comes right before it.
      key: "step", name: "צעידה במקום 2 דקות", short: "צעידה במקום",
      timer: 120, input: "count", label: "כמה פעמים הברך הימנית הגיעה לסימון?",
      steps: [
        "סמני על הקיר את נקודת האמצע בין פיקת הברך לבליטת עצם האגן.",
        // טיוטה 16.9 - ממתין לאישור לאה (4: ספירה לאחור)
        COUNTDOWN_LINE + " צעדי במקום 2 דקות. כל ברך עולה עד הסימון.",
        "ספרי רק את הברך הימנית."
      ],
      safety: "אפשר לגעת במשענת כיסא. אם צריך, האטי או עצרי - השעון ממשיך. אל תעשי את המבחן אם יש לך כאב בחזה, סחרחורת או לחץ דם מעל 160/100."
    }
  ];

  var BALANCE = {
    key: "balance", name: "בונוס: עמידה על רגל אחת",
    input: "stopwatch", attempts: 3, best: "max", maxSeconds: 45, fact: 4,
    steps: [
      "יחפה, הידיים שלובות על החזה, המבט לנקודה בגובה העיניים.",
      "הרימי רגל אחת ליד הקרסול של רגל העמידה, בלי לגעת בה.",
      "עצירה כשרגל העמידה זזה או כשהרגל המורמת נוגעת ברצפה. השעון עוצר לבד ב-45 שניות.",
      "עד 3 ניסיונות. נשמר הזמן הטוב."
    ],
    safety: "על רצפה יציבה, ליד קיר, ומישהו צמוד לשמירה."
  };

  // screen number -> test key (see the header comment)
  var SCREEN_KEYS = [null, "chairStand", "armCurl", "sitReach", "backScratch", "upAndGo", "balance", "step"];
  var STEP_BALANCE = 6;
  var STEP_NUTRITION = 8;
  var STEP_RESULT = 9;
  var LAST_STEP = STEP_RESULT;
  var OLD_STEP_FORM = 10; // removed 16.9.2026 - a save on it resumes on the result
  var NEXT_PAGE = "bat-kama-next.html";
  // Page numbers for Leah's review (16.9.2026): intro = 1, screen N = N + 1, the next page = 11.
  // Internal review note - removed on launch day with every .bk-review-note.
  var PAGE_COUNT = 11;
  function pageNoHtml(step) {
    return '<p class="bk-review-note bk-page-no">דף ' + (step + 1) + ' מתוך ' + PAGE_COUNT + '</p>';
  }

  function testByKey(key) {
    for (var i = 0; i < TESTS.length; i++) {
      if (TESTS[i].key === key) return TESTS[i];
    }
    return key === BALANCE.key ? BALANCE : null;
  }

  var BALANCE_LABELS = { good: "טוב", medium: "בינוני", work: "יש לאן לעלות" }; // Leah 16.9.2026

  var NUTRITION = [
    { key: "protein", q: "יש חלבון בכל ארוחה שלך? (ביצים, מוצרי חלב, עוף, דג, בשר, קטניות)",
      options: [["ok", "כן, בכל ארוחה"], ["gap", "רק בחלק מהארוחות"], ["gap", "כמעט לא"]] },
    { key: "calcium", q: "כמה פעמים ביום את אוכלת מזון עשיר בסידן? (מוצרי חלב, סרדינים, טחינה, שקדים, טופו)",
      options: [["ok", "3 פעמים ומעלה"], ["gap", "1–2 פעמים"], ["gap", "כמעט לא"]] },
    { key: "vitaminD", q: "את לוקחת ויטמין D, או שבדקת את הרמה שלו בדם?",
      options: [["ok", "כן"], ["gap", "לא"], ["gap", "לא בטוחה"]] },
    { key: "fluids", q: "כמה כוסות את שותה ביום? (מים, תה, קפה, מרק)",
      options: [["ok", "8 ומעלה"], ["gap", "5–7"], ["gap", "4 או פחות"]] },
    // Leah 17.9.2026: "ירקות חופשי, פירות בהגבלה". Key stays "fruitVeg" so saved progress still loads.
    { key: "fruitVeg", q: "את אוכלת ירקות בכל ארוחה?",
      options: [["ok", "כן, בכל ארוחה"], ["gap", "רק בחלק מהארוחות"], ["gap", "כמעט לא"]] }
  ];

  // Approved by Leah 17.9.2026 (drafts-recs-leah-voice-2026-09-17.md)
  var RECS = {
    chairStand: "כוח ברגליים: הרגליים הן מה שמרים אותך מהכיסא ומהמיטה. קימה מכיסא ותרגילי כוח לרגליים, לפחות פעמיים בשבוע.",
    armCurl: "כוח בידיים: ידיים חזקות סוחבות את השקיות ומרימות את הנכדים. תרגילי כוח עם משקולת לידיים ולכתפיים, לפחות פעמיים בשבוע.",
    step: "סיבולת: הליכה מהירה, 30 דקות, 5 פעמים בשבוע. את לא חייבת בבת אחת — גם שלוש הליכות של 10 דקות נחשבות.",
    sitReach: "גמישות בגב הירך: שבי בקצה הכיסא, רגל אחת ישרה, והושיטי את הידיים לכיוון הבוהן. תחזיקי 30–60 שניות, 2–3 פעמים בשבוע. בלי קפיצות ובלי כאב.",
    backScratch: "גמישות בכתפיים: מתיחות לכתפיים, 30–60 שניות כל אחת, 2–3 פעמים בשבוע. ככה תגיעי בקלות לגב ולמדף העליון.",
    upAndGo: "זריזות: אימון שמשלב כוח, שיווי משקל והליכה, 3 פעמים בשבוע. ככה את קמה, הולכת ומסתובבת בביטחון.",
    balance: "שיווי משקל: תתרגלי ליד קיר או ליד משענת של כיסא: עמידה על רגל אחת, והליכה עקב-בוהן. 3 פעמים בשבוע.",
    protein: "חלבון: בכל ארוחה משהו חלבוני: ביצה, יוגורט, גבינה, עוף, דג או קטניות. יש לך בעיה בכליות? תשאלי קודם את הרופא/ה כמה מתאים לך.",
    calcium: "סידן: כל יום מוצרי חלב, טחינה, סרדינים, שקדים, טופו או עלים ירוקים. העצמות שלך צריכות את זה.",
    vitaminD: "ויטמין D: תבדקי ויטמין D בבדיקת הדם הבאה, ותשאלי את הרופא/ה אם את צריכה תוסף.",
    fluids: "שתייה: בקבוק מים במקום שאת רואה אותו, ותשתי לאורך כל היום. הרופא/ה הגביל לך נוזלים? תלכי לפי מה שנאמר לך.",
    fruitVeg: "ירקות ופרי: ירקות – בכל ארוחה, כמה שבא לך. פרי – אחד ביום, קטן. יש לך סוכרת? תשאלי את הרופא/ה כמה פרי מתאים לך."
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
    },
    // only two age tests - no overall age (Leah 16.9.2026, min 3 of 4)
    "3": {
      idAge: 66,
      values: { chairStand: 11, armCurl: 14 },
      attempts: { upAndGo: [], balance: [] },
      skipped: { sitReach: true, backScratch: true, upAndGo: true, balance: true, step: true },
      nutrition: { protein: 0, calcium: 0, vitaminD: 0, fluids: 1, fruitVeg: 0 }
    },
    // below the whole table (audit 16.9.2026 repro: 3/7/43/12.0, ID 70)
    "4": {
      idAge: 70,
      values: { chairStand: 3, armCurl: 7, step: 43, sitReach: -12, backScratch: -25 },
      attempts: { upAndGo: [12.4, 12.0], balance: [4.1, 3.2] },
      nutrition: { protein: 1, calcium: 1, vitaminD: 1, fluids: 2, fruitVeg: 1 }
    },
    // older than the ID age (72/77/72/77 -> 75, ID 66) - shows the doctor line (draft 5, 16.9.2026)
    "5": {
      idAge: 66,
      values: { chairStand: 10, armCurl: 11, step: 68, sitReach: -3, backScratch: -12 },
      attempts: { upAndGo: [7.6, 7.3], balance: [12.5, 14.0] },
      nutrition: { protein: 0, calcium: 1, vitaminD: 0, fluids: 1, fruitVeg: 0 }
    }
  };

  /* ================================================================
   * 3. UI
   * ================================================================ */
  var params = new URLSearchParams(window.location.search);
  var DEMO = DEMOS[params.get("demo")] || null;
  // same rule as the two inline tags in <head>: _scan=1 or any demo= parameter
  // step= (jump to a screen) is a review link too - it never counts as a real visit (16.9.2026)
  var noTracking = /[?&](_scan=1|demo=|step=)/.test(window.location.search);

  var state = {
    step: 0,
    idAge: null,
    alone: false,     // true after she chose "אני לבד"
    aloneAnswered: false,
    values: {},       // test key -> number (cm for flexibility, s for up-and-go)
    signs: {},        // flexibility key -> -1 | 0 | 1
    attempts: { upAndGo: [], balance: [] },
    skipped: {},      // key -> true
    nutrition: {},    // key -> option index
    startTracked: false,  // saved with the progress, so a reload / "להמשיך" never counts twice
    resultTracked: false,
    leadSent: false       // name + phone already saved (17.9.2026) - the form is not shown again
  };
  var activeTimer = null;
  var audioCtx = null;
  var exitTracked = false;

  /* ---------- saved progress (localStorage, this phone only) ---------- */
  // v2 = the screen order of 16.9.2026. v1 saves (balance 7, step 6) are migrated once.
  var SAVE_KEY = "batKama.progress.v2";
  var OLD_SAVE_KEY = "batKama.progress.v1";
  // 60 days (was 24h). Leah 17.9.2026: she may finish any time until the workshop starts
  // (launch 11.10 -> workshop 26-27.11 is ~47 days).
  var SAVE_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;
  var LINK_PARAM = "p"; // progress carried inside the saved WhatsApp link (no expiry)
  var V1_TO_V2_STEP = { 6: 7, 7: 6 };
  var pendingResume = null; // saved progress waiting for "להמשיך" / "להתחיל מחדש"

  function hasProgress() {
    if (state.step >= 1 || state.aloneAnswered || isNum(state.idAge)) return true;
    return Object.keys(state.values).some(function (k) { return isNum(state.values[k]); });
  }

  function snapshot() {
    return {
      v: 2, step: state.step, idAge: state.idAge, alone: state.alone, aloneAnswered: state.aloneAnswered,
      values: state.values, signs: state.signs, attempts: state.attempts,
      skipped: state.skipped, nutrition: state.nutrition,
      startTracked: state.startTracked, resultTracked: state.resultTracked,
      leadSent: state.leadSent, savedAt: Date.now()
    };
  }

  function saveState() {
    if (DEMO) return; // demo mode never writes saved state
    try {
      if (!hasProgress()) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot()));
    } catch (e) { /* private mode / full storage - the page still works */ }
  }

  // The saved WhatsApp link carries her progress, so it resumes even in another browser:
  // the ad opens in Facebook's in-app browser, the link later opens in Safari/Chrome,
  // and those don't share localStorage. The snapshot is numbers only (ASCII JSON).
  function progressLink() {
    var url = "https://guralea.com/bat-kama.html?utm_source=whatsapp&utm_medium=save_later";
    if (DEMO || !hasProgress()) return url;
    try {
      var b64 = btoa(JSON.stringify(snapshot())).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return url + "&" + LINK_PARAM + "=" + b64;
    } catch (e) { return url; }
  }

  function loadFromLink() {
    try {
      // the inline script in <head> already took ?p= out of the address bar, before GA4 and the
      // Pixel read the URL (17.9.2026 - her results must not reach Meta or Google)
      var raw = window.__bkP || null;
      if (!raw) return null;
      var b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      var d = JSON.parse(atob(b64));
      if (!d || typeof d !== "object" || !isNum(d.savedAt)) return null;
      if (!validStep(d.step)) d.step = 1;
      return d;
    } catch (e) { return null; }
  }

  function validStep(s) {
    return typeof s === "number" && Math.floor(s) === s && s >= 0 && s <= LAST_STEP;
  }

  function loadSaved() {
    if (DEMO) return null; // demo mode ignores saved state
    try {
      var s = localStorage.getItem(SAVE_KEY);
      var migrate = false;
      if (!s) {
        s = localStorage.getItem(OLD_SAVE_KEY);
        migrate = !!s;
      }
      if (!s) return null;
      var d = JSON.parse(s);
      if (migrate) localStorage.removeItem(OLD_SAVE_KEY);
      if (!d || typeof d !== "object") return null;
      // older than 60 days (or no time stamp): start fresh
      if (!isNum(d.savedAt) || Date.now() - d.savedAt > SAVE_MAX_AGE_MS || d.savedAt > Date.now() + 60000) {
        localStorage.removeItem(SAVE_KEY);
        return null;
      }
      if (d.step === OLD_STEP_FORM) d.step = STEP_RESULT;
      if (!validStep(d.step)) d.step = 1;
      else if (migrate && V1_TO_V2_STEP[d.step]) d.step = V1_TO_V2_STEP[d.step];
      return d;
    } catch (e) { return null; }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(OLD_SAVE_KEY);
    } catch (e) { /* ignore */ }
  }

  function numMap(o) {
    var out = {};
    if (o && typeof o === "object") {
      Object.keys(o).forEach(function (k) { if (isNum(o[k])) out[k] = o[k]; });
    }
    return out;
  }

  function applySaved(d) {
    if (!d) return;
    state.idAge = isNum(d.idAge) ? d.idAge : null;
    state.alone = !!d.alone;
    state.aloneAnswered = !!d.aloneAnswered;
    state.startTracked = d.startTracked === true;
    state.resultTracked = d.resultTracked === true;
    state.leadSent = d.leadSent === true;
    state.values = numMap(d.values);
    state.signs = numMap(d.signs);
    state.nutrition = numMap(d.nutrition);
    state.skipped = {};
    if (d.skipped && typeof d.skipped === "object") {
      Object.keys(d.skipped).forEach(function (k) { if (d.skipped[k] === true) state.skipped[k] = true; });
    }
    var at = d.attempts && typeof d.attempts === "object" ? d.attempts : {};
    function arr(a) { return Array.isArray(a) ? a.map(function (v) { return isNum(v) ? v : null; }) : []; }
    state.attempts = { upAndGo: arr(at.upAndGo), balance: arr(at.balance) };
  }

  /* ---------- tracking (GA4 + Meta Pixel), never in demo / scan mode ---------- */
  function track(name, p) {
    if (noTracking || typeof gtag !== "function") return;
    gtag("event", name, p || {});
  }

  function pixel(kind, name, p) {
    if (noTracking || typeof fbq !== "function") return;
    try {
      if (p) fbq(kind, name, p);
      else fbq(kind, name);
    } catch (e) { /* ignore */ }
  }

  function getUtmParams() {
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null,
      utmContent: params.get("utm_content") || null,
      utmTerm: params.get("utm_term") || null
    };
  }

  // Meta ad attribution from the landing URL
  function getAdParams() {
    return {
      adId: params.get("ad_id") || null,
      adsetId: params.get("adset_id") || null,
      campaignId: params.get("campaign_id") || null,
      fbclid: params.get("fbclid") || null
    };
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

  // "‎-3 ס״מ" - measured flexibility value, shown when there is no ID age to judge it by
  function formatCm(cm) {
    var n = Math.round(cm * 10) / 10;
    return "‎" + (n > 0 ? "+" : "") + String(n) + " ס״מ";
  }

  // one polite live region (#bk-live): only start / end / result, never the running clock
  function announce(text) {
    var live = $("#bk-live");
    if (!live) return;
    live.textContent = "";
    setTimeout(function () { live.textContent = text; }, 60);
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

  // 16.9.2026: most phones turn the screen off after 30-60 s without a touch, and a locked
  // phone stops the clock (no end beep in the 2-minute step). While a clock runs the screen
  // stays on. Browsers without the Wake Lock API simply skip this.
  var wakeLock = null;
  function keepScreenOn(on) {
    try {
      if (on) {
        if (wakeLock || !navigator.wakeLock || typeof navigator.wakeLock.request !== "function") return;
        navigator.wakeLock.request("screen").then(function (lock) {
          if (!activeTimer) { lock.release().catch(function () {}); return; }
          wakeLock = lock;
          lock.addEventListener("release", function () { if (wakeLock === lock) wakeLock = null; });
        }).catch(function () { /* not allowed / battery saver - the clock still works */ });
      } else if (wakeLock) {
        var l = wakeLock;
        wakeLock = null;
        l.release().catch(function () {});
      }
    } catch (e) { /* ignore */ }
  }
  // the lock is dropped when the page is hidden - take it again when she comes back mid-clock
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && activeTimer) keepScreenOn(true);
  });

  function stopTimer() {
    if (activeTimer) {
      clearInterval(activeTimer.id);
      activeTimer = null;
    }
    keepScreenOn(false);
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
      '<p class="bk-safety">' + esc(state.alone && t.safetyAlone ? t.safetyAlone : t.safety) + '</p>' +
      (isTimed(t) ? '<p class="bk-safety bk-stop">' + esc(TXT.stopNow) + '</p>' : "") +
      (t.fact ? factHtml(t.fact) : "");
  }

  // every screen with a clock: the 3 countdown tests, up-and-go and balance
  function isTimed(t) {
    return !!t.timer || t.input === "stopwatch";
  }

  // One research sentence with its source (FACTS, research-2026-09.md)
  function factHtml(n) {
    var f = FACTS[n];
    if (!f) return "";
    return '<div class="bk-fact"><p>' + esc(f.text) + '</p>' +
      (f.url ? '<p class="bk-src"><a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.src) + '</a></p>' : "") +
      '</div>';
  }

  // "לא יכולה להמשיך עכשיו?" on every screen (Leah 17.9.2026: "שתמיד תהיה להם נקודת יציאה").
  // Same WhatsApp link as the intro box (#bk-later in bat-kama.html).
  function laterHtml() {
    var src = $("#bk-later");
    if (!src) return "";
    return '<a class="bk-later" target="_blank" rel="noopener" href="' + esc(src.getAttribute("href")) + '">' +
      '<strong>לא יכולה להמשיך עכשיו?</strong> לחצי כאן ושמרי את המבחן בוואטסאפ שלך, ותמשיכי אותו בזמנך הפנוי. כשתחזרי מהקישור, תמשיכי בדיוק מאיפה שעצרת.</a>';
  }

  function navHtml(nextLabel) {
    return laterHtml() + '<div class="bk-nav">' +
      '<button type="button" class="btn bk-btn-lg bk-next" disabled>' + (nextLabel || "הבא") + '</button>' +
      '<button type="button" class="bk-btn-ghost bk-skip">לא יכולה לבצע</button>' +
      '<p class="bk-nav-note">' + esc(TXT.pain) + '</p>' +
      '<button type="button" class="bk-btn-ghost bk-redo">' + esc(TXT.redoBtn) + '</button>' +
      '<p class="bk-nav-note">' + esc(TXT.redo) + '</p>' +
      '<button type="button" class="bk-link bk-back">חזרה</button>' +
      '</div>';
  }

  // no aria-live on the running display - start/end go to #bk-live
  function countdownHtml(seconds) {
    return '<div class="bk-timer" data-seconds="' + seconds + '">' +
      '<div class="bk-timer__display">' + fmtClock(seconds) + '</div>' +
      '<button type="button" class="btn bk-btn-lg bk-timer__btn">' + TXT.start + '</button>' +
      '</div>';
  }

  function stopwatchHtml(t) {
    var rows = "";
    for (var i = 0; i < t.attempts; i++) {
      rows += '<div class="bk-attempt"><label for="bk-' + t.key + '-a' + i + '">ניסיון ' + (i + 1) + '</label>' +
        '<input class="bk-num bk-attempt__input" id="bk-' + t.key + '-a' + i + '" data-attempt="' + i + '" type="text" inputmode="decimal" autocomplete="off" placeholder="שניות"></div>';
    }
    return '<div class="bk-timer bk-timer--sw" data-max="' + t.maxSeconds + '">' +
      '<div class="bk-timer__display">0.00</div>' +
      '<button type="button" class="btn bk-btn-lg bk-timer__btn">' + TXT.start + '</button>' +
      '</div>' +
      '<div class="bk-attempts">' + rows + '</div>' +
      '<p class="bk-best" hidden>הזמן הטוב: <strong class="bk-best__val"></strong> שניות</p>';
  }

  function inputHtml(t) {
    if (t.input === "count") {
      return '<div class="bk-field"><label for="bk-in-' + t.key + '">' + esc(t.label) + '</label>' +
        '<input class="bk-num bk-value" id="bk-in-' + t.key + '" type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="next" autocomplete="off"></div>';
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

  // Alone mode runs 3 tests, not 6 - the progress line has to stay truthful.
  function testProgress(t) {
    if (state.alone) {
      var i = ALONE_TESTS.indexOf(t.key) + 1;
      if (i > 0) return progressHtml("מבחן " + i + " מתוך 3", i / 3);
    }
    var idx = TESTS.indexOf(t);
    return progressHtml("מבחן " + (idx + 1) + " מתוך 6", (idx + 1) / 6);
  }

  function screenEl(step) {
    return document.querySelector('.bk-screen[data-step="' + step + '"]');
  }

  function renderTestScreen(t, stepNo) {
    var el = screenEl(stepNo);
    el.innerHTML = pageNoHtml(stepNo) + testProgress(t) +
      '<h2>' + esc(t.name) + '</h2>' +
      (t.optional ? '<p class="form-note bk-optional">לא חובה</p>' : "") +
      mediaSlot(t.key, t.name) +
      stepsHtml(t) +
      (t.timer ? countdownHtml(t.timer) : "") +
      inputHtml(t) +
      navHtml();
    wireScreen(el, t);
  }

  function renderBalanceScreen() {
    var el = screenEl(STEP_BALANCE);
    // "בונוס" comes before the last test now, so the bar shows 5 of 6
    el.innerHTML = pageNoHtml(STEP_BALANCE) + progressHtml("בונוס", 5 / 6) +
      '<h2>' + esc(BALANCE.name) + '</h2>' +
      mediaSlot("balance", "עמידה על רגל אחת") +
      stepsHtml(BALANCE) +
      inputHtml(BALANCE) +
      '<p class="bk-muted">לא נכנס לחישוב הגיל.</p>' +
      navHtml();
    wireScreen(el, BALANCE);
  }

  function renderNutritionScreen() {
    var el = screenEl(STEP_NUTRITION);
    var qs = NUTRITION.map(function (n) {
      return '<fieldset class="bk-q"><legend>' + esc(n.q) + '</legend>' +
        n.options.map(function (o, i) {
          return '<label class="bk-opt"><input type="radio" name="bk-n-' + n.key + '" value="' + i + '"><span>' + esc(o[1]) + '</span></label>';
        }).join("") + '</fieldset>';
    }).join("");
    el.innerHTML = pageNoHtml(STEP_NUTRITION) + '<p class="bk-progress">שאלון תזונה קצר</p>' +
      '<h2>שאלון תזונה קצר</h2>' + factHtml(9) + qs + laterHtml() +
      '<div class="bk-nav"><button type="button" class="btn bk-btn-lg bk-next">הבא</button>' +
      '<button type="button" class="bk-link bk-back">חזרה</button></div>';
    el.querySelectorAll('input[type="radio"]').forEach(function (r) {
      var key = r.name.replace("bk-n-", "");
      if (state.nutrition[key] === Number(r.value)) r.checked = true;
      r.addEventListener("change", function () { state.nutrition[key] = Number(r.value); saveState(); });
    });
    $(".bk-next", el).addEventListener("click", function () { go(STEP_RESULT); });
    $(".bk-back", el).addEventListener("click", function () { goBack(STEP_NUTRITION - 1); });
  }

  function fmtClock(sec) {
    var s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }

  function screenValid(t) {
    if (t.input === "count") return plausible(t.key, state.values[t.key]);
    if (t.input === "cm") return isNum(state.values[t.key]);
    return bestAttempt(t) !== null;
  }

  function attemptsFull(t) {
    var a = state.attempts[t.key] || [];
    for (var i = 0; i < t.attempts; i++) { if (!isNum(a[i])) return false; }
    return true;
  }

  function bestAttempt(t) {
    return bestOf(t.key, state.attempts[t.key], t.best);
  }

  function wireScreen(el, t) {
    var next = $(".bk-next", el);
    var stepNo = Number(el.getAttribute("data-step"));

    function refresh() {
      next.disabled = !screenValid(t);
      if (t.input === "stopwatch") {
        // 16.9.2026: 2 attempts (up-and-go) / 3 (balance) - once all are in, the clock is locked,
        // so a new run can't overwrite a recorded attempt. "לעשות שוב" clears them all.
        var swB = $(".bk-timer--sw .bk-timer__btn", el);
        var runningHere = !!activeTimer && activeTimer.el === $(".bk-timer--sw", el);
        if (swB && !runningHere) swB.disabled = attemptsFull(t);
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
        state.values[t.key] = plausible(t.key, n) ? n : null;
        refresh();
        saveState();
      });
      // Enter / "next" on the phone keyboard = "הבא" when it is enabled
      inp.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (!next.disabled) next.click();
      });
    }

    // cm input with explicit sign
    if (t.input === "cm") {
      var cmIn = $(".bk-value", el);
      var segBtns = el.querySelectorAll(".bk-seg__btn");
      var update = function () {
        var sign = state.signs[t.key];
        var n = parseNum(cmIn.value);
        if (sign === 0) state.values[t.key] = 0;
        else if ((sign === 1 || sign === -1) && isNum(n) && n >= 0 && n <= 60) state.values[t.key] = sign * Math.abs(n);
        else state.values[t.key] = null;
        refresh();
        saveState();
      };
      var setSign = function (sign) {
        state.signs[t.key] = sign;
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-sign")) === sign ? "true" : "false"); });
        cmIn.disabled = sign === 0;
        if (sign === 0) cmIn.value = "0";
        else if (cmIn.value === "0") cmIn.value = "";
        update();
        if (sign !== 0) cmIn.focus();
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
          // a second tap right after the first is a double tap, not a stop
          if (!stopAccepted("countdown", performance.now() - activeTimer.t0)) return;
          stopTimer();
          disp.textContent = fmtClock(total);
          btn.textContent = TXT.start;
          cd.classList.remove("is-running");
          return;
        }
        stopTimer();
        beep(1, 1); // unlock audio on this tap
        var lead = 3;
        var startAt = null;
        cd.classList.add("is-running");
        btn.textContent = TXT.stop;
        disp.textContent = String(lead);
        var t0 = performance.now();
        keepScreenOn(true);
        activeTimer = { el: cd, t0: t0, id: setInterval(function () {
          var now = performance.now();
          if (startAt === null) {
            var left = lead - Math.floor((now - t0) / 1000);
            if (left > 0) { disp.textContent = String(left); return; }
            startAt = now;
            beep(250, 880);
            announce(TXT.start);
          }
          var remain = total - (now - startAt) / 1000;
          if (remain <= 0) {
            stopTimer();
            disp.textContent = "0:00";
            btn.textContent = TXT.start;
            cd.classList.remove("is-running");
            beep(700, 660);
            announce("0:00");
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
          arr[i] = plausible(t.key, n) ? n : null;
          refresh();
          saveState();
        });
      });
      var finish = function (secs) {
        stopTimer();
        sw.classList.remove("is-running");
        swBtn.textContent = TXT.start;
        var s = Math.min(max, Math.round(secs * 100) / 100);
        if (!plausible(t.key, s)) {
          // too short to be a real attempt - not recorded
          swDisp.textContent = "0.00";
          return;
        }
        swDisp.textContent = s.toFixed(2);
        var slot = -1;
        for (var i = 0; i < inputs.length; i++) { if (!isNum(arr[i])) { slot = i; break; } }
        if (slot === -1) { refresh(); return; } // all attempts recorded - nothing is overwritten
        arr[slot] = s;
        inputs[slot].value = s.toFixed(2);
        announce(s.toFixed(2));
        refresh();
        saveState();
      };
      swBtn.addEventListener("click", function () {
        if (!(activeTimer && activeTimer.el === sw) && attemptsFull(t)) return;
        if (activeTimer && activeTimer.el === sw) {
          var elapsed = performance.now() - activeTimer.start;
          if (!stopAccepted("stopwatch", elapsed)) return; // double tap - keep running
          finish(elapsed / 1000);
          return;
        }
        stopTimer();
        beep(120, 880);
        sw.classList.add("is-running");
        swBtn.textContent = TXT.stop;
        announce(TXT.start);
        var start = performance.now();
        keepScreenOn(true);
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
    // "לעשות שוב" - clears this test and re-draws the screen, timer display included
    $(".bk-redo", el).addEventListener("click", function () {
      stopTimer();
      state.values[t.key] = null;
      delete state.skipped[t.key];
      delete state.signs[t.key];
      if (state.attempts[t.key]) state.attempts[t.key] = [];
      saveState();
      go(stepNo, "stay");
    });
    $(".bk-back", el).addEventListener("click", function () { goBack(stepNo - 1); });
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

  // In alone mode only her three tests count, whatever else is stored on the phone.
  function doneAlone(key) {
    return !state.alone || ALONE_TESTS.indexOf(key) > -1;
  }

  function rawForScore() {
    var raw = {};
    TEST_KEYS.forEach(function (k) {
      var v = null;
      if (doneAlone(k) && !state.skipped[k]) {
        v = k === "upAndGo" ? bestAttempt(testByKey("upAndGo")) : state.values[k];
      }
      raw[k] = isNum(v) ? v : null;
    });
    return raw;
  }

  function computeAll() {
    var raw = rawForScore();
    var result = score(raw);
    var balSecs = doneAlone("balance") && !state.skipped.balance ? bestAttempt(BALANCE) : null;
    var balance = { seconds: balSecs, rating: balanceRating(balSecs), skipped: !!state.skipped.balance };
    var nutrition = nutritionStatus();
    var flexibility = {};
    FLEX_KEYS.forEach(function (k) {
      flexibility[k] = flexibilityStatus(k, raw[k], state.idAge); // null when not done or no ID age
    });
    var recs = pickRecommendations(result, balance, nutrition, state.skipped, flexibility,
      state.alone ? ALONE_TESTS : null);
    return { raw: raw, result: result, balance: balance, nutrition: nutrition, flexibility: flexibility, recs: recs };
  }

  function compareText(cmp) {
    if (!cmp) return "";
    var yrs = cmp.years === 1 ? "בשנה אחת" : "ב-" + cmp.years + " שנים";
    if (cmp.kind === "younger") return "צעירה " + (cmp.atLeast ? "לפחות " : "") + yrs + " מהגיל בתעודת הזהות. יפה. ואת יכולה עוד.";
    // Leah 16.9.2026: "יש לך חמש שנים להחזיר... ואני יכולה לעזור לך להחזיר אותם"
    if (cmp.kind === "older") return "יש לך " + (cmp.years === 1 ? "שנה אחת" : cmp.years + " שנים") + " להחזיר, ואני יכולה לעזור לך להחזיר אותן.";
    return "בדיוק הגיל שבתעודת הזהות";
  }

  // ID age outside the Rikli & Jones tables (60-94), Leah 15.9.2026
  function idAgeNote() {
    var o = idAgeOutsideTable(state.idAge);
    if (o === "young") return TXT.idAgeYoung;
    if (o === "old") return TXT.idAgeOld;
    return "";
  }

  function breakdownHtml(r) {
    var html = '<div class="bk-card"><h3>לפי מבחן</h3><ul class="bk-breakdown">';
    TESTS.forEach(function (t) {
      if (AGE_KEYS.indexOf(t.key) === -1) return;
      var pt = r.perTest[t.key];
      var tag = "";
      if (r.strongest.indexOf(t.key) > -1) tag = '<span class="bk-tag bk-tag--good">הכי חזק</span>';
      if (r.weakest.indexOf(t.key) > -1) tag = '<span class="bk-tag bk-tag--work">הכי כדאי לחזק</span>';
      html += '<li><span class="bk-breakdown__name">' + esc(t.short) + tag + '</span>' +
        '<span class="bk-breakdown__age">' + (pt ? esc(testDisplayText(pt)) : "לא בוצע") + '</span></li>';
    });
    return html + '</ul></div>';
  }

  function renderResult() {
    var el = screenEl(STEP_RESULT);
    var all = computeAll();
    var r = all.result;
    var html = pageNoHtml(STEP_RESULT) + '<h2 class="bk-center">' + esc(TXT.resultHeading) + '</h2>';
    var outside = idAgeNote();
    var spoken;

    if (r.lessThanThree) {
      // Leah 16.9.2026: fewer than 3 age tests - no overall age, no ID-age comparison
      html += '<p class="bk-min-tests">' + esc(TXT.minTests) + '</p>';
      if (outside) html += '<p class="bk-outside">' + esc(outside) + '</p>';
      html += breakdownHtml(r);
      if (hasBelowTable(r)) html += '<p class="bk-voice bk-center">' + esc(TXT.belowTable) + '</p>';
      spoken = TXT.minTests;
    } else {
      if (r.belowTable) {
        // the approved sentence replaces the big number; no comparison, and not repeated below
        html += '<p class="bk-age bk-age--sentence">' + esc(TXT.belowTable) + '</p>';
        spoken = TXT.belowTable;
      } else {
        html += '<p class="bk-age">' + esc(r.ageText) + '</p>';
        spoken = r.ageText;
        var cmp = compareToIdAge(r, state.idAge);
        var cmpText = compareText(cmp);
        if (cmpText) html += '<p class="bk-compare">' + esc(cmpText) + '</p>';
        // The doctor line (draft 5) was removed by Leah 17.9.2026 ("תורידי את השטויות האלה").
        // Its place: "השאירי שם וטלפון ואחזור אלייך" - waiting for her business WhatsApp number / decision.
      }
      if (outside) html += '<p class="bk-outside">' + esc(outside) + '</p>';
      if (state.alone && r.testsDone === ALONE_TESTS.length) {
        // טיוטה 16.9 - ממתין לאישור לאה (7): alone mode, the age comes from her 3 tests
        html += '<p class="bk-muted bk-center">' + esc(TXT.aloneComputed) + '</p>';
      } else if (r.testsDone < r.testsTotal) {
        // a test skipped because of pain ("לא יכולה לבצע")
        html += '<p class="bk-muted bk-center">הגיל מחושב מ-' + r.testsDone + ' מבחנים. כשזה יעבור — תוכלי להשלים.</p>';
      }
      html += '<p class="bk-muted bk-center">' + esc(r.method === "formula" ? TXT.methodFormula : TXT.methodTable) + '</p>';
      html += factHtml(1);
      html += breakdownHtml(r);
      if (hasBelowTable(r) && !r.belowTable) {
        html += '<p class="bk-voice bk-center">' + esc(TXT.belowTable) + '</p>';
      }
    }

    html += '<div class="bk-card"><h3>גמישות</h3><ul class="bk-breakdown">';
    TESTS.forEach(function (t) {
      if (FLEX_KEYS.indexOf(t.key) === -1) return;
      var fs = all.flexibility[t.key];
      var rawV = all.raw[t.key];
      // no ID age -> no age group to judge by: the measured value only
      var txt = fs ? FLEX_LABELS[fs] : (isNum(rawV) ? formatCm(rawV) : "לא בוצע");
      html += '<li><span class="bk-breakdown__name">' + esc(t.short) + '</span>' +
        '<span class="bk-breakdown__age">' + esc(txt) + '</span></li>';
    });
    html += '</ul><p class="bk-muted bk-flex-note">לא נכנס לחישוב הגיל.</p></div>';

    html += '<div class="bk-card"><h3>שיווי משקל</h3><p class="bk-balance">' +
      (all.balance.rating
        ? esc(BALANCE_LABELS[all.balance.rating]) + ' <span class="bk-muted">(' + all.balance.seconds.toFixed(1) + ' שניות)</span>'
        : "לא בוצע") + '</p></div>';

    if (all.recs.length) {
      html += '<div class="bk-card"><h3>3 דברים שהייתי מתחילה איתם</h3><ol class="bk-recs">' +
        all.recs.map(function (k) { return "<li>" + esc(RECS[k]) + "</li>"; }).join("") + '</ol></div>';
    }

    html += factHtml(5);
    if (all.recs.indexOf("protein") > -1) html += factHtml(8);

    html += '<p class="bk-note">מבוסס על מחקרים מדעיים. לא תחליף לייעוץ רפואי.</p>' +
      factHtml(10);
    // "המספר הזה" needs a number: hidden with fewer than 3 tests and below the table (16.9.2026)
    if (!r.lessThanThree && !r.belowTable) {
      html += '<p class="bk-voice bk-center bk-see-drop">רוצה לראות את המספר הזה יורד? 30 יום איתי — תנועה, תזונה, שינה. ואז את מודדת שוב.</p>';
    }
    // Leah 16.9.2026: one button -> the page with the two products
    html += '<div class="bk-nav"><a class="btn bk-btn-lg bk-to-next" href="' + esc(nextPageUrl()) + '">' + esc(TXT.nextBtn) + '</a>' +
      '<button type="button" class="bk-link bk-back">חזרה</button></div>';

    el.innerHTML = html;
    $(".bk-to-next", el).addEventListener("click", function (e) {
      e.preventDefault();
      storeResultForNext(all);
      track("bat_kama_next_click", { age_bucket: ageBucket(r), method: r.method });
      window.location.href = nextPageUrl();
    });
    $(".bk-back", el).addEventListener("click", function () { goBack(STEP_RESULT - 1); });
    announce(TXT.resultHeading + ": " + spoken);

    if (!state.resultTracked) {
      state.resultTracked = true;
      var bucket = ageBucket(r);
      track("bat_kama_result", { age_bucket: bucket, method: r.method, tests_done: r.testsDone });
      pixel("trackCustom", "BatKamaResult", { age_bucket: bucket });
    }
    return all;
  }

  /* ---------- hand-off to bat-kama-next.html ---------- */
  // Leah 16.9.2026: the workshop lead form is on bat-kama-next.html. Before leaving, a compact
  // copy of the result is kept on this phone so that page can attach it to a workshop lead.
  // Same key and shape are read in js/bat-kama-next.js. Demo mode never writes it.
  var RESULT_KEY = "batKama.result.v1";

  function compactResult(all) {
    var r = all.result;
    var perTestAges = {};
    AGE_KEYS.forEach(function (k) {
      perTestAges[k] = r.perTest[k] ? testAgeText(r.perTest[k]) : (state.skipped[k] ? "skipped" : null);
    });
    var flexibility = {};
    FLEX_KEYS.forEach(function (k) {
      var fs = all.flexibility[k];
      flexibility[k] = fs ? FLEX_LABELS[fs]
        : (isNum(all.raw[k]) ? "measured-no-id-age" : (state.skipped[k] ? "skipped" : null));
    });
    var utm = getUtmParams();
    var ad = getAdParams();
    return {
      v: 1,
      savedAt: Date.now(),
      ageText: r.ageText || null,
      ageNumber: isNum(r.ageNumber) ? r.ageNumber : null,
      method: r.method,
      // Latorre-Rojas 2019 value, only when it actually produced the age (above the table)
      ffa: r.method === "formula" && isNum(r.ffa) ? r.ffa : null,
      testsDone: r.testsDone,
      lessThanThreeTests: !!r.lessThanThree,
      belowTable: !!r.belowTable,
      alone: !!state.alone,
      perTestAges: perTestAges,
      flexibility: flexibility,
      balanceRating: all.balance.rating ? BALANCE_LABELS[all.balance.rating] : null,
      balanceSeconds: isNum(all.balance.seconds) ? all.balance.seconds : null,
      nutrition: all.nutrition,
      recommendations: all.recs,
      idAge: isNum(state.idAge) ? state.idAge : null,
      utmSource: utm.utmSource, utmMedium: utm.utmMedium, utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent, utmTerm: utm.utmTerm,
      adId: ad.adId, adsetId: ad.adsetId, campaignId: ad.campaignId, fbclid: ad.fbclid
    };
  }

  function storeResultForNext(all) {
    if (DEMO || params.has("demo")) return; // demo mode (any demo= value) never writes
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(compactResult(all)));
    } catch (e) { /* private mode / full storage - the next page works without it */ }
  }

  // demo= and _scan=1 travel along, so the next page also stays silent (no tracking, no writes).
  // UTM / ad ids do not go in the URL (that would start a new GA4 session) - they are in RESULT_KEY.
  function nextPageUrl() {
    var q = [];
    if (params.has("demo")) q.push("demo=" + encodeURIComponent(params.get("demo")));
    if (params.get("_scan") === "1") q.push("_scan=1");
    return NEXT_PAGE + (q.length ? "?" + q.join("&") : "");
  }

  /* ---------- navigation ---------- */
  // In alone mode the screens she can't do on her own don't exist - forward or backward.
  function stepAllowed(step) {
    return !state.alone || ALONE_SKIP_STEPS.indexOf(step) === -1;
  }

  function resolveStep(step, dir) {
    var s = Math.max(0, Math.min(LAST_STEP, step));
    while (s > 0 && s < LAST_STEP && !stepAllowed(s)) s += dir;
    return Math.max(0, Math.min(LAST_STEP, s));
  }

  function focusHeading(screen) {
    var h = screen && screen.querySelector("h1, h2");
    if (!h) return;
    h.setAttribute("tabindex", "-1");
    try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); }
  }

  // mode: undefined = new history entry (forward), "replace" = replace the current entry
  // (in-page "חזרה"), "history" = popstate (no entry), "stay" = redraw, "init" = page load.
  function go(step, mode) {
    var dir = step >= state.step ? 1 : -1;
    step = resolveStep(step, dir);
    stopTimer();
    state.step = step;
    var key = SCREEN_KEYS[step];
    if (key) {
      var t = testByKey(key);
      // a screen that already holds a valid result is not "skipped" any more
      if (screenValid(t)) delete state.skipped[key];
      if (key === BALANCE.key) renderBalanceScreen();
      else renderTestScreen(t, step);
    }
    if (step === STEP_NUTRITION) renderNutritionScreen();
    if (step === STEP_RESULT) renderResult();
    var current = null;
    document.querySelectorAll(".bk-screen").forEach(function (s) {
      var on = Number(s.getAttribute("data-step")) === step;
      s.hidden = !on;
      if (on) current = s;
    });
    try {
      var hs = history.state || {};
      if (!mode) history.pushState({ bkStep: step, bkPrev: hs.bkStep }, "", window.location.href);
      else if (mode === "replace") history.replaceState({ bkStep: step, bkPrev: hs.bkPrev }, "", window.location.href);
    } catch (e) { /* ignore */ }
    saveState();
    // style.css sets scroll-behavior:smooth on <html>; a new screen should start at the top at once
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e3) { window.scrollTo(0, 0); }
    if (mode !== "init") focusHeading(current);
  }

  // In-page "חזרה": never adds a history entry. When the previous entry is exactly the
  // screen we go back to, use the browser's own Back, so the phone's Back stays in sync.
  function goBack(target) {
    target = resolveStep(target, -1);
    var hs = history.state;
    if (hs && hs.bkStep === state.step && hs.bkPrev === target) {
      history.back();
      return;
    }
    go(target, "replace");
  }

  function applyDemo() {
    if (!DEMO) return;
    state.idAge = DEMO.idAge;
    Object.keys(DEMO.values).forEach(function (k) { state.values[k] = DEMO.values[k]; });
    state.attempts.upAndGo = DEMO.attempts.upAndGo.slice();
    state.attempts.balance = DEMO.attempts.balance.slice();
    if (DEMO.attempts.upAndGo.length) state.values.upAndGo = Math.min.apply(null, DEMO.attempts.upAndGo);
    state.skipped = JSON.parse(JSON.stringify(DEMO.skipped || {}));
    state.nutrition = JSON.parse(JSON.stringify(DEMO.nutrition));
    var idIn = $("#bk-id-age");
    if (idIn) idIn.value = DEMO.idAge;
  }

  /* ---------- intro: "מי לידך" + resume ---------- */
  function renderIntroState() {
    var withBtn = $("#bk-with");
    var aloneBtn = $("#bk-alone");
    var note = $("#bk-alone-note");
    if (withBtn && aloneBtn && note) {
      withBtn.setAttribute("aria-pressed", state.aloneAnswered && !state.alone ? "true" : "false");
      aloneBtn.setAttribute("aria-pressed", state.aloneAnswered && state.alone ? "true" : "false");
      if (state.aloneAnswered) {
        var needCard = $(".bk-alone");
        if (needCard) needCard.classList.remove("is-needed");
      }
      note.hidden = !state.alone;
      note.textContent = state.alone ? TXT.alone : "";
    }
    var resume = $("#bk-resume");
    if (resume) resume.hidden = !pendingResume;
  }

  /* ---------- name + phone before the test (Leah 17.9.2026) ----------
     Her details are saved the moment she starts, so a woman who stops in the middle is not lost.
     They go to age_test_leads (source "bat-kama") and to the sheet tab "בת כמה את באמת".
     They are never written into the saved-progress link - only the flag that they were sent. */
  function renderLeadCard() {
    var card = $("#bk-lead");
    if (card) card.hidden = DEMO || state.leadSent;
  }

  function cleanPhone(v) {
    return String(v || "").replace(/[^\d]/g, "");
  }

  function validLead(name, phone) {
    return name.length >= 2 && cleanPhone(phone).length >= 9 && cleanPhone(phone).length <= 11;
  }

  function attribution() {
    var q = new URLSearchParams(location.search);
    function g(k) { return (q.get(k) || "").slice(0, 200); }
    return {
      utmSource: g("utm_source"), utmMedium: g("utm_medium"), utmCampaign: g("utm_campaign"),
      utmContent: g("utm_content"), utmTerm: g("utm_term"),
      adId: g("ad_id").slice(0, 40), adsetId: g("adset_id").slice(0, 40),
      campaignId: g("campaign_id").slice(0, 40), fbclid: g("fbclid").slice(0, 255)
    };
  }

  // Saves her details, then calls done() either way - a failed save must never block the test.
  function saveLead(done) {
    var nameEl = $("#bk-name");
    var phoneEl = $("#bk-phone");
    var statusEl = $("#bk-lead-status");
    var name = nameEl ? nameEl.value.trim() : "";
    var phone = phoneEl ? phoneEl.value.trim() : "";
    state.leadSent = true;
    saveState();
    renderLeadCard();
    track("generate_lead", { form_name: "bat_kama_start" });
    pixel("track", "Lead", { content_name: "bat-kama" });
    var attr = attribution();
    function toSheet(id) {
      if (window.sendLeadToSheet) window.sendLeadToSheet({ form: "bat-kama", id: id || "", name: name, phone: phone });
    }
    if (typeof db === "undefined" || typeof firebase === "undefined") {
      toSheet("");
      if (statusEl) statusEl.textContent = "";
      done();
      return;
    }
    db.collection("age_test_leads").add({
      name: name, phone: phone, source: "bat-kama", interest: "test-start",
      site: "guralea.com", page: window.location.pathname,
      utmSource: attr.utmSource, utmMedium: attr.utmMedium, utmCampaign: attr.utmCampaign,
      utmContent: attr.utmContent, utmTerm: attr.utmTerm,
      adId: attr.adId, adsetId: attr.adsetId, campaignId: attr.campaignId, fbclid: attr.fbclid,
      status: "new", createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (ref) {
      toSheet(ref && ref.id);
    }).catch(function () {
      toSheet("");
      track("bat_kama_lead_error", { form_name: "bat_kama_start" });
    });
    done();
  }

  function wireIntro() {
    var withBtn = $("#bk-with");
    var aloneBtn = $("#bk-alone");
    // "לא יכולה לבצע את המבחן עכשיו?" (Leah 17.9.2026): opens her WhatsApp to save the link for later
    // one listener for every "save for later" box, including the ones drawn on the test screens
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest(".bk-later");
      if (!a) return;
      // put her progress into the link right before WhatsApp opens
      var msg = "המבחן \"בת כמה את באמת?\" של לאה גורא - להמשיך כשיהיה לי זמן: " + progressLink();
      a.setAttribute("href", "https://wa.me/?text=" + encodeURIComponent(msg));
      saveState();
      track("bat_kama_save_later", { method: "whatsapp", step: state.step });
      pixel("trackCustom", "BatKamaSaveLater");
    });
    if (withBtn) {
      withBtn.addEventListener("click", function () {
        state.alone = false;
        state.aloneAnswered = true;
        renderIntroState();
        saveState();
      });
    }
    if (aloneBtn) {
      aloneBtn.addEventListener("click", function () {
        state.alone = true;
        state.aloneAnswered = true;
        renderIntroState();
        saveState();
      });
    }
    var yes = $("#bk-resume-yes");
    var no = $("#bk-resume-no");
    if (yes) {
      yes.addEventListener("click", function () {
        var saved = pendingResume;
        pendingResume = null;
        applySaved(saved);
        var idIn = $("#bk-id-age");
        if (idIn && isNum(state.idAge)) idIn.value = state.idAge;
        renderIntroState();
        go(saved && validStep(saved.step) ? saved.step : 1);
      });
    }
    if (no) {
      no.addEventListener("click", function () {
        pendingResume = null;
        clearSaved();
        state.idAge = null;
        state.alone = false;
        state.aloneAnswered = false;
        state.values = {};
        state.signs = {};
        state.attempts = { upAndGo: [], balance: [] };
        state.skipped = {};
        state.nutrition = {};
        state.startTracked = false;
        state.resultTracked = false;
        var idIn = $("#bk-id-age");
        if (idIn) idIn.value = "";
        renderIntroState();
      });
    }
  }

  function init() {
    if (!$("#bat-kama-app")) return;
    renderLeah();
    applyDemo();

    var saved = loadSaved();
    var fromLink = DEMO ? null : loadFromLink();
    // the link wins unless this phone has newer progress of its own
    if (fromLink && (!saved || fromLink.savedAt >= saved.savedAt)) saved = fromLink;
    if (saved) {
      if (saved.step >= 1) pendingResume = saved; // she stopped in the middle - ask first
      else applySaved(saved);                     // only the "מי לידך" answer / ID age
    }
    wireIntro();
    renderIntroState();

    var idIn = $("#bk-id-age");
    if (isNum(state.idAge) && !DEMO) idIn.value = state.idAge;
    idIn.addEventListener("input", function () {
      var n = parseNum(idIn.value);
      state.idAge = isNum(n) && n >= 18 && n <= 110 && Math.floor(n) === n ? n : null;
      saveState();
    });
    renderLeadCard();
    $("#bk-start").addEventListener("click", function () {
      // 16.9.2026: no start before "מי לידך עכשיו?" is answered - a woman alone must not get
      // the screens that need someone next to her. The card is highlighted and focused.
      if (!state.aloneAnswered) {
        var card = $(".bk-alone");
        if (card) {
          card.classList.add("is-needed");
          try { card.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) { card.scrollIntoView(); }
        }
        var first = $("#bk-with");
        if (first) { try { first.focus({ preventScroll: true }); } catch (e2) { first.focus(); } }
        return;
      }
      // name + phone before the test (Leah 17.9.2026)
      var leadCard = $("#bk-lead");
      if (leadCard && !leadCard.hidden) {
        var nameEl = $("#bk-name");
        var phoneEl = $("#bk-phone");
        var consentEl = $("#bk-consent");
        var statusEl = $("#bk-lead-status");
        var nm = nameEl ? nameEl.value.trim() : "";
        var ph = phoneEl ? phoneEl.value.trim() : "";
        if (!validLead(nm, ph) || (consentEl && !consentEl.checked)) {
          if (statusEl) {
            statusEl.textContent = !validLead(nm, ph)
              ? "צריך שם ומספר טלפון מלא, כדי שאוכל לחזור אלייך."
              : "צריך לסמן את האישור, כדי שאוכל לחזור אלייך.";
          }
          leadCard.classList.add("is-needed");
          try { leadCard.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e3) { leadCard.scrollIntoView(); }
          var focusEl = !nm ? nameEl : (!validLead(nm, ph) ? phoneEl : consentEl);
          if (focusEl) { try { focusEl.focus({ preventScroll: true }); } catch (e4) { focusEl.focus(); } }
          return;
        }
        leadCard.classList.remove("is-needed");
        saveLead(function () { /* the test starts either way */ });
      }
      if (!state.startTracked) {
        state.startTracked = true;
        track("bat_kama_start", {});
        pixel("trackCustom", "BatKamaStart");
      }
      go(1);
    });

    // "אין לך וואטסאפ? להעתיק את הקישור" (Leah 17.9.2026)
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".bk-copy");
      if (!btn) return;
      var link = progressLink();
      function done(ok) { btn.textContent = ok ? "הקישור הועתק" : link; }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(function () { done(true); }, function () { done(false); });
        } else { done(false); }
      } catch (e5) { done(false); }
      track("bat_kama_copy_link", {});
    });

    window.addEventListener("popstate", function (e) {
      var s = e.state && validStep(e.state.bkStep) ? e.state.bkStep : 0;
      go(s, "history");
    });

    // left the page before the result: once, with the screen she stopped on
    window.addEventListener("pagehide", function () {
      if (exitTracked || state.resultTracked) return;
      exitTracked = true;
      track("bat_kama_exit", { last_step: state.step, transport_type: "beacon" });
    });

    var startStep = parseInt(params.get("step"), 10);
    var first = validStep(startStep) ? startStep : 0;
    try { history.replaceState({ bkStep: first }, "", window.location.href); } catch (e) { /* ignore */ }
    go(first, "init");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : null);
