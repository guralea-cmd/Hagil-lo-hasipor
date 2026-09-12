document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#pilates-lead-form");
  if (!form) return;

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null
    };
  }

  var statusEl = document.querySelector("#pilates-lead-status");

  form.addEventListener("input", function () {
    if (typeof gtag === "function") gtag("event", "form_start", { form_name: "pilates_lead" });
  }, { once: true });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    statusEl.textContent = "שולח...";
    statusEl.classList.remove("error");

    var utm = getUtmParams();
    db.collection("pilates_leads").add({
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      status: "new",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(function () {
        statusEl.textContent = "הפרטים נשלחו, תודה.";
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
        if (typeof gtag === "function") gtag("event", "pilates_lead_submitted", { form_name: "pilates_lead" });
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
