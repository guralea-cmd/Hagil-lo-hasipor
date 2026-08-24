document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#workshop-lead-form");
  if (!form) return;

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

    db.collection("workshop_leads").add({
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      track: form.track.value,
      status: "new",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(function () {
        statusEl.textContent = "הפרטים נשלחו, תודה.";
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
