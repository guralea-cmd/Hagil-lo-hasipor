document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.querySelector("#form-status");
      if (status) {
        status.textContent = "תודה! ההודעה נשלחה בהצלחה, ניצור קשר בקרוב.";
        status.style.color = "#7a5c4e";
      }
      form.reset();
    });
  }
});
