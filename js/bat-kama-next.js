/* bat-kama-next.js - "מה עושים עם התוצאה?" (bat-kama-next.html), Leah 16.9.2026.
 *
 * The page after the "בת כמה את באמת?" result: (א) the 30-day app - a purchase button,
 * (ב) the workshop - name + phone. No prices, no early registration, no email.
 *
 * Any demo= parameter (and _scan=1): no GA4, no Meta Pixel, and the form never writes
 * ("מצב הדגמה - לא נשלח."). Same rule as js/bat-kama.js and the two tags in <head>.
 */
(function () {
  "use strict";

  // Purchase link for the 30-day app. Empty until launch day (target 11.10.2026):
  // while empty the button shows but is disabled, with the review note under it.
  var APP_PURCHASE_URL = "";

  // Written by js/bat-kama.js just before it opens this page (same key and shape).
  var RESULT_KEY = "batKama.result.v1";

  var params = new URLSearchParams(window.location.search);
  var DEMO = params.has("demo");
  var noTracking = /[?&](_scan=1|demo=|step=)/.test(window.location.search);

  var TXT = {
    demo: "מצב הדגמה - לא נשלח.",
    sending: "שולח...",
    // Leah 16.9.2026: "שם + טלפון, 'אני חוזרת אלייך בהקדם'"
    success: "אני חוזרת אלייך בהקדם",
    // existing approved text (bat-kama lead form)
    fail: "משהו השתבש בשליחת הטופס. נסי שוב."
  };

  function $(sel) { return document.querySelector(sel); }

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

  function str(v) {
    return typeof v === "string" && v ? v : null;
  }

  // The stored result from the test page, or null. Only plain JSON objects are accepted.
  function storedResult() {
    try {
      var s = localStorage.getItem(RESULT_KEY);
      if (!s) return null;
      var d = JSON.parse(s);
      return d && typeof d === "object" && !Array.isArray(d) ? d : null;
    } catch (e) { return null; }
  }

  // UTM / ad ids: from this page's URL first, then from the stored result
  // (the test page does not put them in the link, see nextPageUrl in js/bat-kama.js).
  function attribution(stored) {
    var s = stored || {};
    function pick(param, key) { return str(params.get(param)) || str(s[key]); }
    return {
      utmSource: pick("utm_source", "utmSource"),
      utmMedium: pick("utm_medium", "utmMedium"),
      utmCampaign: pick("utm_campaign", "utmCampaign"),
      utmContent: pick("utm_content", "utmContent"),
      utmTerm: pick("utm_term", "utmTerm"),
      adId: pick("ad_id", "adId"),
      adsetId: pick("adset_id", "adsetId"),
      campaignId: pick("campaign_id", "campaignId"),
      fbclid: pick("fbclid", "fbclid")
    };
  }

  /* ---------- (א) the app button ---------- */
  function wireAppButton() {
    var btn = $("#bk-app-buy");
    var note = $("#bk-app-buy-note");
    if (!btn) return;
    if (!APP_PURCHASE_URL) {
      // no link yet: visible, not clickable
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.classList.add("is-disabled");
      if (note) note.hidden = false;
      return;
    }
    btn.setAttribute("href", APP_PURCHASE_URL);
    btn.removeAttribute("aria-disabled");
    btn.removeAttribute("role");
    btn.classList.remove("is-disabled");
    if (note) note.hidden = true;
    btn.addEventListener("click", function () {
      track("bat_kama_app_click", { transport_type: "beacon" });
    });
  }

  /* ---------- (ב) the workshop form ---------- */
  function wireForm() {
    var form = $("#bk-next-lead-form");
    if (!form) return;
    var statusEl = $("#bk-next-lead-status");
    var started = false;

    function formStart() {
      if (started) return;
      started = true;
      track("form_start", { form_name: "bat_kama_workshop" });
    }
    form.addEventListener("focusin", formStart);
    form.addEventListener("input", formStart);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (typeof form.reportValidity === "function") form.reportValidity();
        return;
      }
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      if (!name || !phone) return;

      statusEl.classList.remove("error");
      if (DEMO) {
        statusEl.textContent = TXT.demo;
        return;
      }

      var stored = storedResult();
      var attr = attribution(stored);
      var adEvent = {};
      if (attr.adId) adEvent.ad_id = attr.adId;
      if (attr.adsetId) adEvent.adset_id = attr.adsetId;
      if (attr.campaignId) adEvent.campaign_id = attr.campaignId;
      if (attr.fbclid) adEvent.fbclid = attr.fbclid;

      // Firestore failed: the lead still goes to the sheet, so it is never lost.
      // form "bat-kama-workshop" = tab "בת כמה את באמת", source "סדנה" (apps-script-webhook.gs, 16.9.2026)
      function onFail(err, reason) {
        if (err) console.error(err);
        if (window.sendLeadToSheet) {
          window.sendLeadToSheet({ form: "bat-kama-workshop", id: "", name: name, phone: phone });
        }
        statusEl.textContent = TXT.fail;
        statusEl.classList.add("error");
        track("bat_kama_workshop_lead_error", Object.assign({ form_name: "bat_kama_workshop", reason: reason }, adEvent));
      }

      if (typeof db === "undefined" || typeof firebase === "undefined") {
        onFail(null, "no_db");
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = TXT.sending;

      // Same list as the test (age_test_leads, Leah 13.9.2026) - its public create rule
      // only needs name + phone.
      db.collection("age_test_leads").add({
        name: name,
        phone: phone,
        source: "bat-kama-next",
        interest: "workshop",
        site: "guralea.com",
        page: window.location.pathname,
        utmSource: attr.utmSource,
        utmMedium: attr.utmMedium,
        utmCampaign: attr.utmCampaign,
        utmContent: attr.utmContent,
        utmTerm: attr.utmTerm,
        adId: attr.adId,
        adsetId: attr.adsetId,
        campaignId: attr.campaignId,
        fbclid: attr.fbclid,
        status: "new",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        result: stored
      })
        .then(function (docRef) {
          if (window.sendLeadToSheet) {
            window.sendLeadToSheet({ form: "bat-kama-workshop", id: (docRef && docRef.id) || "", name: name, phone: phone });
          }
          statusEl.textContent = TXT.success;
          track("bat_kama_workshop_lead", Object.assign({
            form_name: "bat_kama_workshop",
            has_result: !!stored
          }, adEvent));
          pixel("track", "Lead", { content_name: "bat_kama_workshop" });
          form.reset();
        })
        .catch(function (err) {
          onFail(err, "firestore");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  function init() {
    wireAppButton();
    wireForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
