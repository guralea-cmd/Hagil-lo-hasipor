document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#register-form");
  if (!form) return;

  var statusEl = document.querySelector("#form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "שולח...";
    statusEl.className = "form-status";

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    db.collection("registrations").add({
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      statusEl.textContent = "נרשמת בהצלחה! ניצור איתך קשר בקרוב לפרטי הסדנה.";
      statusEl.classList.remove("error");
      form.reset();
    }).catch(function (err) {
      console.error(err);
      statusEl.textContent = "משהו השתבש. נסה/י שוב או צרו קשר בטלפון.";
      statusEl.classList.add("error");
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });
});
