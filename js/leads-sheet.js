// Sends a copy of a site lead to Leah's Google Sheet "לידים 2026 – סטודיו לאה גורא"
// (skill: .claude/skills/leads-sheet), through the Apps Script web app in apps-script-webhook.gs.
// Pages call window.sendLeadToSheet only AFTER their Firestore save has succeeded.
// Fire-and-forget: it never throws, never waits, and its result is ignored - the Firestore save and
// the visitor's success message never depend on it.
// Web app deployed 14.9.2026 13:57 (version 1, runs as guralea@gmail.com, access: anyone).
(function () {
  var LEADS_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxgFHRnAYFq68nK-5l0nOi46WbUiCn0L2QUjaV_U4Z6oZ1w45odyjPzmt2u0dGmRytE/exec";

  // lead = { form: "story" | "bat-kama" | "pilates", id: Firestore doc id, name, phone }
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
          phone: lead.phone || ""
        })
      }).catch(function () {});
    } catch (e) {}
  };
})();
