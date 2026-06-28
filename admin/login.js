document.addEventListener("DOMContentLoaded", function () {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      window.location.href = "dashboard.html";
    }
  });

  var form = document.querySelector("#login-form");
  var statusEl = document.querySelector("#form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("error");

    auth.signInWithEmailAndPassword(form.email.value.trim(), form.password.value)
      .then(function () {
        window.location.href = "dashboard.html";
      })
      .catch(function (err) {
        console.error(err);
        statusEl.textContent = "פרטי כניסה שגויים.";
        statusEl.classList.add("error");
      });
  });
});
