document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
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

  var footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".footer-email")) {
    var emailP = document.createElement("p");
    emailP.className = "footer-email";
    emailP.innerHTML = 'שאלות או רוצים לדעת אם הסיפור שלכם פורסם? <a href="mailto:guralea@gmail.com">guralea@gmail.com</a>';
    footer.insertBefore(emailP, footer.firstChild.nextSibling);
  }

  var waFloat = document.createElement("a");
  waFloat.href = "https://wa.me/972506991723?text=%D7%94%D7%99%D7%99%20%D7%9C%D7%90%D7%94%2C%20%D7%94%D7%A0%D7%94%20%D7%94%D7%A1%D7%99%D7%A4%D7%95%D7%A8%20%D7%A9%D7%9C%D7%99.%0A%D7%A9%D7%9D%2C%20%D7%92%D7%99%D7%9C%2C%20%D7%95%D7%9E%D7%90%D7%99%D7%A4%D7%94%3A%0A%D7%94%D7%97%D7%99%D7%99%D7%9D%20%D7%A9%D7%9C%D7%99%20%D7%9C%D7%A4%D7%A0%D7%99%3A%0A%D7%9E%D7%94%20%D7%A7%D7%A8%D7%94%2C%20%D7%94%D7%A8%D7%92%D7%A2%20%D7%A9%D7%94%D7%9B%D7%9C%20%D7%94%D7%A9%D7%AA%D7%A0%D7%94%3A%0A%D7%9E%D7%94%20%D7%A2%D7%A9%D7%99%D7%AA%D7%99%2C%20%D7%90%D7%99%D7%9A%20%D7%99%D7%A6%D7%90%D7%AA%D7%99%20%D7%9E%D7%96%D7%94%3A%0A%D7%90%D7%99%D7%A4%D7%94%20%D7%90%D7%A0%D7%99%20%D7%94%D7%99%D7%95%D7%9D%3A%0A%D7%9E%D7%94%20%D7%94%D7%9E%D7%A1%D7%A8%20%D7%A9%D7%9C%D7%99%20%D7%9C%D7%9E%D7%99%20%D7%A9%D7%A0%D7%9E%D7%A6%D7%90%20%D7%A2%D7%9B%D7%A9%D7%99%D7%95%20%D7%90%D7%99%D7%A4%D7%94%20%D7%A9%D7%90%D7%A0%D7%99%20%D7%94%D7%99%D7%99%D7%AA%D7%99%3A%0A(%D7%90%D7%A4%D7%A9%D7%A8%20%D7%92%D7%9D%20%D7%9C%D7%94%D7%A7%D7%9C%D7%99%D7%98%20%D7%94%D7%95%D7%93%D7%A2%D7%94%20%D7%A7%D7%95%D7%9C%D7%99%D7%AA%20%D7%91%D7%9E%D7%A7%D7%95%D7%9D%20%D7%9C%D7%9B%D7%AA%D7%95%D7%91%2C%20%D7%95%D7%9C%D7%A6%D7%A8%D7%A3%20%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA)";
  waFloat.target = "_blank";
  waFloat.rel = "noopener";
  waFloat.className = "wa-float-btn";
  waFloat.setAttribute("aria-label", "שלחו הודעה קולית בוואטסאפ");
  waFloat.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.479 1.34 4.995L2 22l5.117-1.342a9.96 9.96 0 0 0 4.887 1.246h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.068a9.935 9.935 0 0 0-7.073-2.936zm5.831 15.828a8.283 8.283 0 0 1-5.831 2.416h-.003a8.27 8.27 0 0 1-4.213-1.152l-.302-.18-3.037.797.81-2.96-.197-.304a8.259 8.259 0 0 1-1.266-4.418c0-4.575 3.723-8.297 8.302-8.297a8.243 8.243 0 0 1 5.868 2.434 8.238 8.238 0 0 1 2.428 5.868 8.276 8.276 0 0 1-2.559 5.796z"/></svg>';
  document.body.appendChild(waFloat);
});
