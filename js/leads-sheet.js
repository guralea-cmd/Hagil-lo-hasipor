// Sends a copy of a site lead to Leah's Google Sheet "לידים 2026 – סטודיו לאה גורא"
// (skill: .claude/skills/leads-sheet), through the Apps Script web app in apps-script-webhook.gs.
// Pages call window.sendLeadToSheet only AFTER their Firestore save has succeeded.
// Fire-and-forget: it never throws, never waits, and its result is ignored - the Firestore save and
// the visitor's success message never depend on it.
// Web app deployed 14.9.2026 13:57 (version 1, runs as guralea@gmail.com, access: anyone); version 4 on 21.9.2026, same URL.
(function () {
  // Where this visit came from, saved on the first page of the visit (21.9.2026, same values as
  // guraleapilates.com/assets/js/site.js). Sent only with workshop leads, as column D "מקור" of tab סדנה.
  // A referrer from guralea.com itself says nothing about the source, so it is not saved.
  try {
    if (!sessionStorage.getItem("lead_source")) {
      var p = new URLSearchParams(window.location.search);
      var s = (p.get("utm_source") || "").toLowerCase();
      var m = (p.get("utm_medium") || "").toLowerCase();
      var h = "";
      try { h = new URL(document.referrer).hostname.toLowerCase(); } catch (e) {}
      if (!/(^|\.)guralea\.com$/.test(h) || s) {
        var paid = /paid|cpc|ads?$/.test(m);
        var net = /facebook|^fb/.test(s) || /(^|\.)facebook\.com$|^fb\.me$/.test(h) ? "פייסבוק"
          : /instagram|^ig/.test(s) || /(^|\.)instagram\.com$/.test(h) ? "אינסטגרם"
          : /tiktok/.test(s) || /(^|\.)tiktok\.com$/.test(h) ? "טיקטוק" : "";
        var src = net ? (paid ? "מודעה - " : "פוסט - ") + net
          : /google/.test(s) || /(^|\.)google\./.test(h) ? "גוגל"
          : /(^|\.)guraleapilates\.com$/.test(h) ? "אתר הסטודיו"
          : "אתר - ישיר";
        sessionStorage.setItem("lead_source", src);
      }
    }
  } catch (e) {}

  var LEADS_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxgFHRnAYFq68nK-5l0nOi46WbUiCn0L2QUjaV_U4Z6oZ1w45odyjPzmt2u0dGmRytE/exec";

  // lead = { form: "story" | "bat-kama" | "bat-kama-workshop" | "workshop" | "pilates", id: Firestore doc id, name, phone,
  //          email?, callTime? (workshop only, 21.9.2026) }
  function leadSource() {
    try { return sessionStorage.getItem("lead_source") || "אתר - ישיר"; } catch (e) { return "אתר - ישיר"; }
  }

  window.sendLeadToSheet = function (lead) {
    try {
      if (LEADS_SHEET_WEBAPP_URL.indexOf("https://script.google.com/macros/s/") !== 0) return;
      if (typeof fetch !== "function") return;
      fetch(LEADS_SHEET_WEBAPP_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          form: lead.form,
          id: lead.id || "",
          name: lead.name || "",
          phone: lead.phone || "",
          source: lead.form === "workshop" ? leadSource() : "",
          email: lead.email || "",
          callTime: lead.callTime || ""
        })
      }).catch(function () {});
    } catch (e) {}
  };
})();
