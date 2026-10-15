document.addEventListener("DOMContentLoaded", function () {
  // 15.10.2026 (Leah: "טופס אחד"): workshop.html has ONE form, in the first screen - name, phone,
  // when to call. Age/email are gone from it; missing fields are sent as "" so the sheet and rules stay the same.
  // workshop-info.html still has its own older form with the same id.
  var forms = document.querySelectorAll("#workshop-lead-form");
  if (!forms.length) return;

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null
    };
  }

  // Optional fields may be missing in the short form - always send a string.
  function val(form, name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  Array.prototype.forEach.call(forms, function (form) {
    var statusEl = form.querySelector("#workshop-lead-status") || document.querySelector("#workshop-lead-status");
    var formName = "workshop_lead";

    form.addEventListener("input", function () {
      if (typeof gtag === "function") gtag("event", "form_start", { form_name: formName });
    }, { once: true });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      statusEl.textContent = "שולח...";
      statusEl.classList.remove("error");

      var utm = getUtmParams();
      // 21.9.2026 (Leah): full name + phone (required), email + "when is it convenient to call" (optional).
      // The whole name goes in firstName and lastName stays an empty string, because firestore.rules still
      // requires both to be strings. The track (zoom / studio) is settled by phone.
      var fullName = val(form, "fullName");
      var phone = val(form, "phone");
      var email = val(form, "email");
      var callTime = val(form, "callTime");
      var age = val(form, "age");
      // 10.10.2026: chair-challenge field removed from the form (Leah). reps stays an empty string for the sheet/rules.
      var reps = val(form, "reps");
      db.collection("workshop_leads").add({
        firstName: fullName,
        lastName: "",
        email: email,
        callTime: callTime,
        age: age,
        reps: reps,
        phone: phone,
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
        status: "new",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
        .then(function (docRef) {
          // Copy to the leads sheet, tab סדנה, + an email to Leah (21.9.2026) - fire-and-forget, see js/leads-sheet.js.
          if (window.sendLeadToSheet) {
            window.sendLeadToSheet({
              form: "workshop",
              id: (docRef && docRef.id) || "",
              name: fullName,
              phone: phone,
              email: email,
              callTime: callTime,
              age: age,
              reps: reps
            });
          }
          statusEl.textContent = "תודה! אחזור אלייך בהקדם האפשרי. לאה";
          if (typeof fbq === "function") {
            fbq("track", "Lead");
          }
          if (typeof gtag === "function") gtag("event", "workshop_lead_submitted", { form_name: formName });
          form.reset();
        })
        .catch(function (err) {
          console.error(err);
          statusEl.textContent = "משהו השתבש בשליחת הטופס. נסה/י שוב.";
          statusEl.classList.add("error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  });
});
