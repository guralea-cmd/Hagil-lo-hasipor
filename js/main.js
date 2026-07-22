document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
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

  var modals = document.querySelectorAll(".modal-overlay");
  var lastFocusedElement = null;
  var focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var focusable = modal.querySelectorAll(focusableSelector);
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function trapFocus(modal, e) {
    var focusable = modal.querySelectorAll(focusableSelector);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var modal = document.getElementById(trigger.getAttribute("data-open-modal"));
      if (modal) {
        openModal(modal);
      }
    });
  });

  modals.forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeModal(modal);
      });
    }
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        trapFocus(modal, e);
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach(function (modal) {
        if (!modal.hidden) {
          closeModal(modal);
        }
      });
    }
  });

  window.openSiteModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) {
      openModal(modal);
    }
  };

  var aboutHeading = document.querySelector(".split-cta-text h2");
  var aboutVideoWraps = document.querySelectorAll(".split-cta-video .video-wrap");
  if (aboutHeading && aboutVideoWraps.length > 1) {
    var secondVideoWrap = aboutVideoWraps[1];
    var alignSecondVideo = function () {
      if (window.innerWidth <= 700) {
        secondVideoWrap.style.marginTop = "24px";
        return;
      }
      secondVideoWrap.style.marginTop = "0px";
      var delta = aboutHeading.getBoundingClientRect().top - secondVideoWrap.getBoundingClientRect().top;
      secondVideoWrap.style.marginTop = Math.max(delta, 24) + "px";
    };
    alignSecondVideo();
    window.addEventListener("resize", alignSecondVideo);
  }
});
