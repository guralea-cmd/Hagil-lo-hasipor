document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#event-signup-form");
  if (!form) return;

  var statusEl = document.querySelector("#event-form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "שולח...";
    statusEl.className = "form-status";

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    db.collection("event_signups").add({
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      age: form.age.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      statusEl.textContent = "נרשמת בהצלחה! נעדכן אותך בוואטסאפ או במייל לקראת המפגש.";
      statusEl.classList.remove("error");
      form.reset();
    }).catch(function (err) {
      console.error(err);
      statusEl.textContent = "משהו השתבש. נסה/י שוב.";
      statusEl.classList.add("error");
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });
});
