document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#contact-form");
  if (!form) return;

  var statusEl = document.querySelector("#form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    if (statusEl) {
      statusEl.textContent = "שולח...";
      statusEl.style.color = "";
    }

    db.collection("contact_submissions").add({
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      topic: form.topic.value,
      message: form.message.value.trim(),
      status: "new",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(function () {
        if (statusEl) {
          statusEl.textContent = "תודה! ההודעה נשלחה בהצלחה, ניצור קשר בקרוב.";
          statusEl.style.color = "#7a5c4e";
        }
        if (typeof gtag === "function") gtag("event", "contact_form_submitted", { form_name: "contact" });
        form.reset();
      })
      .catch(function (err) {
        console.error(err);
        if (statusEl) {
          statusEl.textContent = "משהו השתבש בשליחת הטופס. אפשר גם לפנות ישירות באימייל.";
          statusEl.style.color = "#b83227";
        }
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
});
