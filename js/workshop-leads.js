document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#workshop-lead-form");
  if (!form) return;

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null
    };
  }

  var statusEl = document.querySelector("#workshop-lead-status");

  form.addEventListener("input", function () {
    if (typeof gtag === "function") gtag("event", "form_start", { form_name: "workshop_lead" });
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
    var fullName = form.fullName.value.trim();
    var email = form.email.value.trim();
    var callTime = form.callTime.value;
    // 21.9.2026: optional chair-challenge result ("אתגר הכיסא") - age + full stands in 30 seconds.
    var age = form.age.value.trim();
    var reps = form.reps.value.trim();
    db.collection("workshop_leads").add({
      firstName: fullName,
      lastName: "",
      email: email,
      callTime: callTime,
      age: age,
      reps: reps,
      phone: form.phone.value.trim(),
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
            phone: form.phone.value.trim(),
            email: email,
            callTime: callTime,
            age: age,
            reps: reps
          });
        }
        statusEl.textContent = "תודה! אחזור אלייך בטלפון בימים הקרובים. לאה";
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
        if (typeof gtag === "function") gtag("event", "workshop_lead_submitted", { form_name: "workshop_lead" });
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
